import { getCompoundPk } from '../store/compound-pharmacokinetics.js'

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR
const STEP_HOURS = 1
const LN2 = Math.LN2

function dateAtNoon(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null
  return Date.parse(`${value}T12:00:00Z`)
}

function midpoint(value) {
  if (Array.isArray(value) && value.length === 2) {
    const a = Number(value[0])
    const b = Number(value[1])
    if (a > 0 && b > 0) return (a + b) / 2
  }

  const n = Number(value)
  return n > 0 ? n : null
}

function formatHours(value) {
  if (!Array.isArray(value)) return '—'

  const [a, b] = value
  const fmt = n => {
    if (n < 1) return `${Math.round(n * 60)} min`
    if (n >= 24) {
      const days = n / 24
      return `${Number(days.toFixed(1))} d`
    }
    return `${Number(n.toFixed(2))} h`
  }

  return a === b ? fmt(a) : `${fmt(a)}–${fmt(b)}`
}

function getProtocolEnd(protocol, compound) {
  if (compound.endDate) return compound.endDate
  if (protocol.endDate) return protocol.endDate

  if (protocol.status === 'completed' && protocol.completedAt) {
    return String(protocol.completedAt).slice(0, 10)
  }

  return new Date().toISOString().slice(0, 10)
}

function scheduledOn(compound, date, dayIndex) {
  const frequency = String(compound.frequency || '').toLowerCase()

  if (
    frequency === 'daily' ||
    frequency === 'every_day' ||
    frequency === 'per_day'
  ) {
    return true
  }

  if (
    frequency === 'every_other_day' ||
    frequency === 'eod'
  ) {
    return dayIndex % 2 === 0
  }

  if (frequency === 'selected_days') {
    const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return (compound.days || []).includes(names[date.getUTCDay()])
  }

  if (frequency === 'weekly' || frequency === 'once_weekly') {
    return dayIndex % 7 === 0
  }

  if (frequency === 'twice_weekly') {
    return dayIndex % 3 === 0 || dayIndex % 3 === 1
  }

  if (frequency === 'three_times_weekly') {
    return dayIndex % 2 === 0 && dayIndex % 7 !== 6
  }

  // Preserve a visible event for protocols whose frequency is not
  // represented by one of the known schedule values.
  if (!frequency || frequency === 'per_dose') {
    return dayIndex === 0
  }

  return false
}

function getDoseAmount(compound) {
  const amount = Number.parseFloat(compound.amount)

  if (!Number.isFinite(amount) || amount <= 0) return null

  if (compound.amountBasis !== 'per_week') {
    return amount
  }

  let weeklyEvents = 7

  if (
    compound.frequency === 'every_other_day' ||
    compound.frequency === 'eod'
  ) {
    weeklyEvents = 3.5
  } else if (compound.frequency === 'selected_days') {
    weeklyEvents = (compound.days || []).length
  } else if (compound.frequency === 'weekly') {
    weeklyEvents = 1
  } else if (compound.frequency === 'twice_weekly') {
    weeklyEvents = 2
  } else if (compound.frequency === 'three_times_weekly') {
    weeklyEvents = 3
  }

  return weeklyEvents > 0 ? amount / weeklyEvents : null
}

function buildCompoundSeries(compound, protocol) {
  const pk = getCompoundPk(compound.name)

  if (!pk?.modelSupport?.totalActive) {
    return {
      supported: false,
      compound,
      reason: 'no_pk_data'
    }
  }

  const absorptionHalfLife = midpoint(pk.absorptionHalfLifeHours)
  const eliminationHalfLife = midpoint(pk.halfLifeHours)

  if (
    !absorptionHalfLife ||
    !eliminationHalfLife ||
    absorptionHalfLife <= 0 ||
    eliminationHalfLife <= 0
  ) {
    return {
      supported: false,
      compound,
      reason: 'invalid_pk_data'
    }
  }

  const startDate = compound.startDate || protocol.startDate
  const endDate = getProtocolEnd(protocol, compound)

  const start = dateAtNoon(startDate)
  const end = dateAtNoon(endDate)
  const doseAmount = getDoseAmount(compound)

  if (
    !start ||
    !end ||
    end < start ||
    !doseAmount ||
    !compound.unit
  ) {
    return {
      supported: false,
      compound,
      reason: 'missing_protocol_data'
    }
  }

  const ka = LN2 / absorptionHalfLife
  const ke = LN2 / eliminationHalfLife
  const route = String(pk.route || '').toLowerCase()
  const isIV = route === 'iv'

  const events = []
  const totalDays = Math.floor((end - start) / DAY)

  for (let day = 0; day <= totalDays; day++) {
    const date = new Date(start + day * DAY)

    if (scheduledOn(compound, date, day)) {
      events.push({
        time: date.getTime(),
        amount: doseAmount
      })
    }
  }

  if (!events.length) {
    return {
      supported: false,
      compound,
      reason: 'no_scheduled_doses'
    }
  }

  let depot = 0
  let circulating = 0
  let eventIndex = 0

  const samples = []
  const endTime = end + DAY
  const stepMs = STEP_HOURS * HOUR
  const depotFactor = Math.exp(-ka * STEP_HOURS)
  const eliminationFactor = Math.exp(-ke * STEP_HOURS)

  for (let time = start; time <= endTime; time += stepMs) {
    while (
      eventIndex < events.length &&
      events[eventIndex].time <= time
    ) {
      const event = events[eventIndex]

      if (isIV) {
        // IV bolus: direct entry into the circulating compartment.
        circulating += event.amount
      } else {
        // Oral, SC, IM and intranasal routes use the estimated depot model.
        depot += event.amount
      }

      eventIndex++
    }

    samples.push({
      time,
      release: circulating,
      total: depot + circulating
    })

    const absorbed = Math.abs(ka - ke) < 0.000001
      ? depot * ka * STEP_HOURS * eliminationFactor
      : depot *
        ka /
        (ka - ke) *
        (eliminationFactor - depotFactor)

    circulating =
      circulating * eliminationFactor + absorbed

    depot *= depotFactor
  }

  return {
    supported: true,
    compound,
    samples,
    unit: compound.unit,
    pk,
    absorptionHalfLife,
    eliminationHalfLife
  }
}

function makePath(samples, key) {
  if (!samples?.length) return ''

  const values = samples.map(item => item[key])
  const max = Math.max(...values, 0.000001)

  return values.map((value, index) => {
    const x = (index / Math.max(1, values.length - 1)) * 100
    const y = 42 - (value / max) * 36

    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
  }).join(' ')
}

function CompoundCurve({ item, metric, fa }) {
  const path = makePath(item.samples, metric)
  const color = item.compound.color || '#38bdf8'

  const peak = Math.max(
    ...item.samples.map(sample => sample[metric]),
    0
  )

  const pk = item.pk
  const tmax = formatHours(pk.tmaxHours)
  const absorption = formatHours(pk.absorptionHalfLifeHours)
  const elimination = formatHours(pk.halfLifeHours)

  return (
    <div className="pk-curve">
      <div className="pk-curve-heading">
        <span
          className="pk-curve-dot"
          style={{ background: color }}
        />

        <strong>{item.compound.name}</strong>
        <small>{item.unit}</small>
      </div>

      <svg
        className="pk-curve-svg"
        viewBox="0 0 100 46"
        preserveAspectRatio="none"
        role="img"
        aria-label={`${item.compound.name} ${metric} curve`}
      >
        <path
          className="pk-curve-grid"
          d="M0 6 H100 M0 24 H100 M0 42 H100"
        />

        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="pk-curve-footer">
        <span>
          {metric === 'release'
            ? (fa ? 'اوج مقدار در گردش' : 'Circulating peak')
            : (fa ? 'اوج مقدار کل فعال' : 'Total active peak')}
        </span>

        <strong>
          {Number(peak.toFixed(3)).toString()} {item.unit}
        </strong>
      </div>

      <div className="pk-curve-meta">
        <span>
          {fa ? 'Tmax' : 'Tmax'}: <strong>{tmax}</strong>
        </span>
        <span>
          {fa ? 'نیمه‌عمر جذب' : 'Absorption t½'}: <strong>{absorption}</strong>
        </span>
        <span>
          {fa ? 'نیمه‌عمر حذف' : 'Elimination t½'}: <strong>{elimination}</strong>
        </span>
        <span>
          {fa ? 'مسیر' : 'Route'}: <strong>{pk.route}</strong>
        </span>
      </div>
    </div>
  )
}

export default function ProtocolPkCharts({ protocol, fa = false }) {
  const compounds = Array.isArray(protocol?.compounds)
    ? protocol.compounds
    : []

  const results = compounds.map(compound =>
    buildCompoundSeries(compound, protocol)
  )

  const supported = results.filter(item => item.supported)
  const unsupported = results.filter(item => !item.supported)

  const labels = fa
    ? {
        title: 'مدل فارماکوکینتیک پروتکل',
        release: 'مقدار در گردش خون',
        total: 'مقدار کل فعال مدل‌شده',
        releaseSub: 'مقدار تخمینی ترکیب در بخش مرکزی مدل',
        totalSub: 'مجموع مقدار در مخزن جذب و بخش مرکزی مدل',
        note: 'تمام مقادیر و منحنی‌ها تخمینی هستند و مبنای بالینی یا تجویزی ندارند.',
        caveat: 'برآوردها بر اساس ساختار شیمیایی، استر متصل‌شده (در صورت وجود) و مسیر مصرف یا تزریق انجام شده‌اند. این نمودارها اندازه‌گیری واقعی غلظت پلاسمایی نیستند.',
        unavailable: 'برای این ترکیبات داده کافی در بانک موجود نیست.',
        unsupported: 'ترکیبات نمایش‌داده‌نشده',
        noData: 'برای این پروتکل داده‌ای جهت رسم نمودار وجود ندارد.'
      }
    : {
        title: 'Protocol Pharmacokinetic Model',
        release: 'Circulating Amount',
        total: 'Total Modeled Active Amount',
        releaseSub: 'Estimated amount in the central compartment',
        totalSub: 'Combined amount in the absorption depot and central compartment',
        note: 'All values and curves are estimates and have no clinical or prescribing basis.',
        caveat: 'Estimates are based on chemical structure, attached ester (where applicable), and administration or injection route. These charts are not measurements of actual plasma concentrations.',
        unavailable: 'There is not enough reference data for these compounds.',
        unsupported: 'Compounds not displayed',
        noData: 'There is no data available to plot for this protocol.'
      }

  return (
    <section className="pk-charts-section">
      <div className="pk-charts-heading">
        <div>
          <h3>{labels.title}</h3>
          <p>{labels.note}</p>
        </div>
      </div>

      <p className="pk-model-caveat">
        {labels.caveat}
      </p>

      {supported.length > 0 ? (
        <div className="pk-charts-grid">
          <article className="pk-chart-card pk-release-card">
            <div className="pk-chart-title">
              <span className="pk-chart-icon">↗</span>
              <div>
                <h4>{labels.release}</h4>
                <p>{labels.releaseSub}</p>
              </div>
            </div>

            {supported.map(item => (
              <CompoundCurve
                key={item.compound.id || item.compound.name}
                item={item}
                metric="release"
                fa={fa}
              />
            ))}
          </article>

          <article className="pk-chart-card pk-total-card">
            <div className="pk-chart-title">
              <span className="pk-chart-icon">◉</span>
              <div>
                <h4>{labels.total}</h4>
                <p>{labels.totalSub}</p>
              </div>
            </div>

            {supported.map(item => (
              <CompoundCurve
                key={item.compound.id || item.compound.name}
                item={item}
                metric="total"
                fa={fa}
              />
            ))}
          </article>
        </div>
      ) : (
        <p className="pk-empty">{labels.noData}</p>
      )}

      {unsupported.length > 0 && (
        <div className="pk-unsupported">
          <strong>{labels.unsupported}</strong>
          <span>
            {unsupported.map(item => item.compound.name).join(' · ')}
          </span>
        </div>
      )}
    </section>
  )
}
