import { getCompoundPk } from '../store/compound-pharmacokinetics.js'

const DAY = 24
const STEP = 6
const LN2 = Math.LN2

function dateAtNoon(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null
  return Date.parse(`${value}T12:00:00Z`)
}

function meanHalfLife(value) {
  if (Array.isArray(value) && value.length === 2) {
    return (Number(value[0]) + Number(value[1])) / 2
  }

  return Number(value) > 0 ? Number(value) : null
}

function scheduledOn(compound, date, dayIndex) {
  if (compound.frequency === 'daily') return true

  if (compound.frequency === 'every_other_day') {
    return dayIndex % 2 === 0
  }

  if (compound.frequency === 'selected_days') {
    const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return (compound.days || []).includes(names[date.getUTCDay()])
  }

  return false
}

function getDoseAmount(compound) {
  const amount = Number.parseFloat(compound.amount)
  if (!Number.isFinite(amount) || amount <= 0) return null

  if (compound.amountBasis !== 'per_week') return amount

  let weeklyEvents = 7

  if (compound.frequency === 'every_other_day') {
    weeklyEvents = 3.5
  } else if (compound.frequency === 'selected_days') {
    weeklyEvents = (compound.days || []).length
  }

  return weeklyEvents > 0 ? amount / weeklyEvents : null
}

function buildCompoundSeries(compound, protocol) {
  const pk = getCompoundPk(compound.name)
  const absorptionHalfLife = meanHalfLife(
    pk?.absorption?.halfLifeHours
  )
  const eliminationHalfLife = meanHalfLife(
    pk?.halfLifeHours
  )

  if (!absorptionHalfLife || !eliminationHalfLife) {
    return { supported: false, compound }
  }

  const startDate = compound.startDate || protocol.startDate
  const endDate =
    compound.endDate ||
    protocol.endDate ||
    (protocol.status === 'completed'
      ? String(protocol.completedAt || '').slice(0, 10)
      : new Date().toISOString().slice(0, 10))

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
    return { supported: false, compound }
  }

  const ka = LN2 / absorptionHalfLife
  const ke = LN2 / eliminationHalfLife

  const events = []
  const totalDays = Math.floor((end - start) / (DAY * 3600000))

  for (let day = 0; day <= totalDays; day++) {
    const date = new Date(start + day * DAY * 3600000)

    if (scheduledOn(compound, date, day)) {
      events.push({
        time: date.getTime(),
        amount: doseAmount
      })
    }
  }

  if (!events.length) {
    return { supported: false, compound }
  }

  let depot = 0
  let circulating = 0
  let eventIndex = 0

  const samples = []
  const endTime = end + DAY * 3600000
  const stepMs = STEP * 3600000

  for (let time = start; time <= endTime; time += stepMs) {
    while (
      eventIndex < events.length &&
      events[eventIndex].time <= time
    ) {
      depot += events[eventIndex].amount
      eventIndex++
    }

    samples.push({
      time,
      release: circulating,
      total: depot + circulating
    })

    const depotFactor = Math.exp(-ka * STEP)
    const eliminationFactor = Math.exp(-ke * STEP)

    const absorbed = Math.abs(ka - ke) < 0.000001
      ? depot * ka * STEP * eliminationFactor
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
    unit: compound.unit
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

function CompoundCurve({ item, metric }) {
  const path = makePath(item.samples, metric)
  const color = item.compound.color || '#38bdf8'

  const peak = Math.max(
    ...item.samples.map(sample => sample[metric]),
    0
  )

  return (
    <div className="pk-curve">
      <div className="pk-curve-heading">
        <span className="pk-curve-dot" style={{ background: color }} />
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
        <span>{metric === 'release' ? 'Circulating peak' : 'Total active peak'}</span>
        <strong>{Number(peak.toFixed(3)).toString()} {item.unit}</strong>
      </div>
    </div>
  )
}

export default function ProtocolPkCharts({ protocol, fa = false }) {
  const compounds = Array.isArray(protocol.compounds)
    ? protocol.compounds
    : []

  const results = compounds.map(compound =>
    buildCompoundSeries(compound, protocol)
  )

  const supported = results.filter(item => item.supported)
  const unsupported = results.filter(item => !item.supported)

  const labels = fa
    ? {
        release: 'Release Rate',
        total: 'Total Active',
        releaseSub: 'مقدار تخمینی ترکیب در بخش در گردش خون',
        totalSub: 'مجموع مقدار موجود در مخزن جذب و بخش در گردش خون',
        unavailable: 'داده جذب معتبر برای محاسبه این ترکیبات موجود نیست.',
        note: 'این نمودارها مدل تخمینی هستند، نه اندازه‌گیری غلظت واقعی خون.',
        unsupported: 'فاقد داده کافی'
      }
    : {
        release: 'Release Rate',
        total: 'Total Active',
        releaseSub: 'Estimated amount in the circulating compartment',
        totalSub: 'Combined amount in the depot and circulating compartments',
        unavailable: 'Validated absorption data is not available for these compounds.',
        note: 'These are model estimates, not measured blood concentrations.',
        unsupported: 'Insufficient data'
      }

  return (
    <section className="pk-charts-section">
      <div className="pk-charts-heading">
        <div>
          <h3>{fa ? 'مدل فارماکوکینتیک چرخه' : 'Cycle Pharmacokinetic Model'}</h3>
          <p>{labels.note}</p>
        </div>
      </div>

      <div className="pk-charts-grid">
        <article className="pk-chart-card pk-release-card">
          <div className="pk-chart-title">
            <span className="pk-chart-icon">↗</span>
            <div>
              <h4>{labels.release}</h4>
              <p>{labels.releaseSub}</p>
            </div>
          </div>

          {supported.length ? (
            supported.map(item => (
              <CompoundCurve
                key={item.compound.id || item.compound.name}
                item={item}
                metric="release"
              />
            ))
          ) : (
            <p className="pk-empty">{labels.unavailable}</p>
          )}
        </article>

        <article className="pk-chart-card pk-total-card">
          <div className="pk-chart-title">
            <span className="pk-chart-icon">◉</span>
            <div>
              <h4>{labels.total}</h4>
              <p>{labels.totalSub}</p>
            </div>
          </div>

          {supported.length ? (
            supported.map(item => (
              <CompoundCurve
                key={item.compound.id || item.compound.name}
                item={item}
                metric="total"
              />
            ))
          ) : (
            <p className="pk-empty">{labels.unavailable}</p>
          )}
        </article>
      </div>

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
