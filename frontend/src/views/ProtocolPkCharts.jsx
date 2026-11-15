import { useMemo, useState } from 'react'
import { getCompoundPk } from '../store/compound-pharmacokinetics'

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR
const LN2 = Math.LN2

function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))
}

function dateTime(value) {
  if (!validDate(value)) return null
  return Date.parse(`${value}T12:00:00Z`)
}

function midpoint(value) {
  if (Array.isArray(value) && value.length === 2) {
    const a = Number(value[0])
    const b = Number(value[1])
    return a > 0 && b > 0 ? (a + b) / 2 : null
  }

  const n = Number(value)
  return n > 0 ? n : null
}

function numberText(value, decimals = 2) {
  if (!Number.isFinite(value)) return '0'

  return Number(value.toFixed(decimals)).toLocaleString('en-US', {
    maximumFractionDigits: decimals
  })
}

function hoursText(value) {
  if (!Array.isArray(value)) return '—'

  const format = n => {
    if (n < 1) return `${Math.round(n * 60)} min`
    if (n >= 24) return `${numberText(n / 24, 1)} d`
    return `${numberText(n, 2)} h`
  }

  return value[0] === value[1]
    ? format(value[0])
    : `${format(value[0])}–${format(value[1])}`
}

function protocolEndDate(protocol, compound) {
  if (validDate(compound.endDate)) return compound.endDate
  if (validDate(protocol.endDate)) return protocol.endDate
  return new Date().toISOString().slice(0, 10)
}

function getWeeklyDose(compound) {
  const amount = Number.parseFloat(compound.amount)

  if (!Number.isFinite(amount) || amount <= 0) return null
  if (compound.amountBasis !== 'per_week') return amount

  const frequency = compound.frequency || 'daily'

  let dosesPerWeek = 7

  if (frequency === 'every_other_day') {
    dosesPerWeek = 3.5
  } else if (frequency === 'selected_days') {
    dosesPerWeek = (compound.days || []).length
  }

  return dosesPerWeek > 0 ? amount / dosesPerWeek : null
}

function isScheduled(compound, date, dayIndex) {
  const frequency = compound.frequency || 'daily'

  if (frequency === 'daily') return true

  if (frequency === 'every_other_day') {
    return dayIndex % 2 === 0
  }

  if (frequency === 'selected_days') {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return (compound.days || []).includes(weekdays[date.getUTCDay()])
  }

  return false
}

function buildSeries(compound, protocol, chartStart, chartEnd) {
  const pk = getCompoundPk(compound.name)

  if (
    !pk?.modelSupport?.totalActive ||
    !pk?.modelSupport?.releaseRate
  ) {
    return { supported: false, compound }
  }

  const absorptionHalfLife = midpoint(pk.absorptionHalfLifeHours)
  const eliminationHalfLife = midpoint(pk.halfLifeHours)

  if (!absorptionHalfLife || !eliminationHalfLife) {
    return { supported: false, compound }
  }

  const startDate = validDate(compound.startDate)
    ? compound.startDate
    : protocol.startDate

  const endDate = protocolEndDate(protocol, compound)

  const start = dateTime(startDate)
  const end = dateTime(endDate)
  const dose = getWeeklyDose(compound)

  if (
    !start ||
    !end ||
    end < start ||
    !dose ||
    !compound.unit ||
    !chartStart ||
    !chartEnd
  ) {
    return { supported: false, compound }
  }

  const events = []
  const totalDays = Math.floor((end - start) / DAY)

  for (let day = 0; day <= totalDays; day++) {
    const time = start + day * DAY
    const date = new Date(time)

    if (isScheduled(compound, date, day)) {
      events.push({ time, amount: dose })
    }
  }

  if (!events.length) {
    return { supported: false, compound }
  }

  const ka = LN2 / absorptionHalfLife
  const ke = LN2 / eliminationHalfLife

  const isIV = String(pk.route || '').toLowerCase() === 'iv'

  const depotFactor = Math.exp(-ka)
  const eliminationFactor = Math.exp(-ke)

  let depot = 0
  let circulating = 0
  let eventIndex = 0

  const samples = []

  for (let time = chartStart; time <= chartEnd; time += HOUR) {
    while (
      eventIndex < events.length &&
      events[eventIndex].time <= time
    ) {
      if (isIV) {
        circulating += events[eventIndex].amount
      } else {
        depot += events[eventIndex].amount
      }

      eventIndex++
    }

    const releaseRate = isIV
      ? 0
      : depot * (1 - depotFactor) * 24

    samples.push({
      time,
      releaseRate,
      totalActive: depot + circulating
    })

    const absorbed = Math.abs(ka - ke) < 0.000001
      ? depot * ka * eliminationFactor
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
    isIV
  }
}

function niceStep(maxValue) {
  if (!Number.isFinite(maxValue) || maxValue <= 0) return 1

  const rough = maxValue / 5
  const power = Math.pow(10, Math.floor(Math.log10(rough)))
  const fraction = rough / power

  let nice = 1

  if (fraction > 1 && fraction <= 2) nice = 2
  else if (fraction > 2 && fraction <= 2.5) nice = 2.5
  else if (fraction > 2.5 && fraction <= 5) nice = 5
  else if (fraction > 5) nice = 10

  return nice * power
}

function ChartLane({
  items,
  metric,
  fa,
  chartStart,
  chartEnd,
  individual = false
}) {
  if (!items.length) return null

  const duration = Math.max(DAY, chartEnd - chartStart)
  const weeks = Math.max(1, Math.ceil(duration / (7 * DAY)))

  const left = 66
  const right = 18
  const top = 20
  const bottom = 43
  const plotHeight = 190
  const plotWidth = Math.max(620, weeks * 92)

  const width = left + plotWidth + right
  const height = top + plotHeight + bottom

  const values = items.flatMap(item =>
    item.samples.map(sample => sample[metric])
  )

  const rawMax = Math.max(0, ...values)
  const step = niceStep(rawMax || 1)
  const yMax = Math.max(step, Math.ceil(rawMax / step) * step)

  const x = time =>
    left + ((time - chartStart) / duration) * plotWidth

  const y = value =>
    top + plotHeight - (value / yMax) * plotHeight

  const yTicks = []

  for (let value = 0; value <= yMax + step * 0.001; value += step) {
    yTicks.push(value)
  }

  const xTicks = []

  for (let week = 0; week <= weeks; week++) {
    const time = chartStart + week * 7 * DAY

    if (time <= chartEnd + DAY * 0.05) {
      xTicks.push({ time, week: week + 1 })
    }
  }

  const unit = items[0].unit
  const axisUnit = metric === 'releaseRate'
    ? `${unit}/${fa ? 'روز' : 'day'}`
    : unit

  const pathFor = item => item.samples.map((sample, index) => {
    const px = x(sample.time)
    const py = y(sample[metric])

    return `${index === 0 ? 'M' : 'L'} ${px.toFixed(2)} ${py.toFixed(2)}`
  }).join(' ')

  return (
    <div className="pk-chart-lane">
      {!individual && (
        <div className="pk-chart-lane-heading">
          <strong>{fa ? 'واحد' : 'Unit'}: {unit}</strong>
          <span>
            {fa
              ? 'مقیاس عمودی مستقل برای ترکیبات با این واحد'
              : 'Independent vertical scale for compounds using this unit'}
          </span>
        </div>
      )}

      <div className="pk-chart-scroll" dir="ltr">
        <svg
          className="pk-chart-svg"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${metric} - ${axisUnit}`}
        >
          {yTicks.map(value => {
            const py = y(value)

            return (
              <g key={`y-${value}`}>
                <line
                  className="pk-chart-grid-line"
                  x1={left}
                  x2={left + plotWidth}
                  y1={py}
                  y2={py}
                />
                <text
                  className="pk-chart-axis-label"
                  x={left - 10}
                  y={py + 4}
                  textAnchor="end"
                >
                  {numberText(value)}
                </text>
              </g>
            )
          })}

          {xTicks.map(tick => {
            const px = x(tick.time)

            return (
              <g key={`x-${tick.week}`}>
                <line
                  className="pk-chart-grid-line pk-chart-grid-vertical"
                  x1={px}
                  x2={px}
                  y1={top}
                  y2={top + plotHeight}
                />
                <text
                  className="pk-chart-axis-label pk-chart-week-label"
                  x={px}
                  y={top + plotHeight + 25}
                  textAnchor="middle"
                >
                  {fa ? `هفته ${tick.week}` : `Week ${tick.week}`}
                </text>
              </g>
            )
          })}

          <line
            className="pk-chart-axis-line"
            x1={left}
            x2={left}
            y1={top}
            y2={top + plotHeight}
          />

          <line
            className="pk-chart-axis-line"
            x1={left}
            x2={left + plotWidth}
            y1={top + plotHeight}
            y2={top + plotHeight}
          />

          <text
            className="pk-chart-unit-label"
            x={left}
            y={12}
          >
            {axisUnit}
          </text>

          {items.map(item => (
            <path
              key={item.compound.id || item.compound.name}
              d={pathFor(item)}
              fill="none"
              stroke={item.compound.color || '#38bdf8'}
              strokeWidth={individual ? 2.8 : 2.25}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>

      <div className="pk-chart-legend">
        {items.map(item => (
          <span key={item.compound.id || item.compound.name}>
            <i style={{ background: item.compound.color || '#38bdf8' }} />
            <strong>{item.compound.name}</strong>
          </span>
        ))}
      </div>

      {individual && (
        <div className="pk-chart-peak">
          <span>{fa ? 'بیشینه مدل‌شده' : 'Modeled peak'}</span>
          <strong>
            {numberText(Math.max(
              0,
              ...items[0].samples.map(sample => sample[metric])
            ), 3)} {axisUnit}
          </strong>
        </div>
      )}
    </div>
  )
}

function ChartPanel({
  items,
  metric,
  fa,
  chartStart,
  chartEnd,
  individual = false
}) {
  const groups = useMemo(() => {
    const map = new Map()

    items.forEach(item => {
      const unit = String(item.unit || '—')

      if (!map.has(unit)) map.set(unit, [])
      map.get(unit).push(item)
    })

    return Array.from(map.entries())
  }, [items])

  return (
    <div className="pk-chart-card">
      {groups.map(([unit, unitItems]) => (
        <ChartLane
          key={unit}
          items={unitItems}
          metric={metric}
          fa={fa}
          chartStart={chartStart}
          chartEnd={chartEnd}
          individual={individual}
        />
      ))}
    </div>
  )
}

export default function ProtocolPkCharts({ protocol, fa = false }) {
  const [metric, setMetric] = useState('releaseRate')

  const compounds = Array.isArray(protocol?.compounds)
    ? protocol.compounds
    : []

  const model = useMemo(() => {
    const starts = compounds
      .map(item => validDate(item.startDate) ? item.startDate : protocol.startDate)
      .filter(validDate)

    const ends = compounds
      .map(item => protocolEndDate(protocol, item))
      .filter(validDate)

    const startDate = validDate(protocol.startDate)
      ? protocol.startDate
      : (starts.sort()[0] || new Date().toISOString().slice(0, 10))

    const endDate = ends.sort().slice(-1)[0] || startDate

    const chartStart = dateTime(startDate)
const latestEnd = Math.max(
  dateTime(endDate) || chartStart,
  ...ends.map(dateTime).filter(Boolean)
)

// Extend the PK chart by 8 weeks after the last compound ends.
const chartEnd = latestEnd + 56 * DAY

    const results = compounds.map(item =>
      buildSeries(item, protocol, chartStart, chartEnd)
    )

    return {
      supported: results.filter(item => item.supported),
      unsupported: results.filter(item => !item.supported),
      chartStart,
      chartEnd
    }
  }, [compounds, protocol])

  const labels = fa
    ? {
        title: 'مدل فارماکوکینتیک پروتکل',
        release: 'Release Rate · نرخ آزادسازی',
        total: 'Total Active · مقدار کل فعال',
        releaseDesc: 'مقدار تخمینی آزادشده از مخزن جذب در هر روز',
        totalDesc: 'مجموع مقدار موجود در مخزن جذب و بخش مرکزی مدل',
        individual: 'نمودار اختصاصی هر ترکیب',
        individualDesc: 'برای مشاهده نمودار هر ترکیب باز کنید',
        unavailable: 'برای این ترکیبات داده کافی یا اطلاعات معتبر پروتکل جهت رسم نمودار وجود ندارد.',
        noData: 'برای این پروتکل داده‌ای جهت رسم نمودار وجود ندارد.',
        iv: 'در مسیر IV، ورود مستقیماً به بخش مرکزی مدل می‌شود؛ بنابراین آزادسازی از مخزن جذب صفر است.'
      }
    : {
        title: 'Protocol Pharmacokinetic Model',
        release: 'Release Rate',
        total: 'Total Active',
        releaseDesc: 'Estimated amount released from the absorption depot per day',
        totalDesc: 'Combined amount in the absorption depot and central compartment',
        individual: 'Individual compound charts',
        individualDesc: 'Expand a compound to view its own chart',
        unavailable: 'There is not enough reference data or valid protocol information to plot these compounds.',
        noData: 'There is no data available to plot for this protocol.',
        iv: 'For IV routes, input is modeled directly into the central compartment, so depot release is zero.'
      }

  const isRelease = metric === 'releaseRate'

  return (
    <section className="pk-charts-section">
      <div className="pk-charts-heading">
        <h3>{labels.title}</h3>
      </div>

      {model.supported.length > 0 ? (
        <>
          <div className="pk-metric-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={isRelease}
              className={isRelease ? 'active' : ''}
              onClick={() => setMetric('releaseRate')}
            >
              {labels.release}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={!isRelease}
              className={!isRelease ? 'active' : ''}
              onClick={() => setMetric('totalActive')}
            >
              {labels.total}
            </button>
          </div>

          <div className="pk-chart-heading">
            <strong>{isRelease ? labels.release : labels.total}</strong>
            <span>{isRelease ? labels.releaseDesc : labels.totalDesc}</span>
          </div>

          <ChartPanel
            items={model.supported}
            metric={metric}
            fa={fa}
            chartStart={model.chartStart}
            chartEnd={model.chartEnd}
          />

          {isRelease && model.supported.some(item => item.isIV) && (
            <p className="pk-chart-note">{labels.iv}</p>
          )}

          <div className="pk-compound-accordion-list">
            <div className="pk-accordion-heading">
              <strong>{labels.individual}</strong>
              <span>{labels.individualDesc}</span>
            </div>

            {model.supported.map(item => (
              <details
                className="pk-compound-accordion"
                key={item.compound.id || item.compound.name}
              >
                <summary>
                  <span
                    className="pk-compound-dot"
                    style={{ background: item.compound.color || '#38bdf8' }}
                  />
                  <strong>{item.compound.name}</strong>
                  <small>{item.unit}</small>
                  <span className="pk-accordion-chevron">⌄</span>
                </summary>

                <div className="pk-compound-accordion-body">
                  <ChartPanel
                    items={[item]}
                    metric={metric}
                    fa={fa}
                    chartStart={model.chartStart}
                    chartEnd={model.chartEnd}
                    individual
                  />

                  <div className="pk-compound-meta">
                    <span>
                      Tmax: <strong>{hoursText(item.pk.tmaxHours)}</strong>
                    </span>
                    <span>
                      {fa ? 'نیمه‌عمر جذب' : 'Absorption t½'}:
                      {' '}
                      <strong>{hoursText(item.pk.absorptionHalfLifeHours)}</strong>
                    </span>
                    <span>
                      {fa ? 'نیمه‌عمر حذف' : 'Elimination t½'}:
                      {' '}
                      <strong>{hoursText(item.pk.halfLifeHours)}</strong>
                    </span>
                    <span>
                      {fa ? 'مسیر' : 'Route'}:
                      {' '}
                      <strong>{item.pk.route}</strong>
                    </span>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </>
      ) : (
        <p className="pk-empty">{labels.noData}</p>
      )}

      {model.unsupported.length > 0 && (
        <div className="pk-unsupported">
          <strong>{fa ? 'ترکیبات بدون نمودار' : 'Compounds without charts'}</strong>
          <span>
            {model.unsupported.map(item => item.compound.name).join(' · ')}
          </span>
          <small>{labels.unavailable}</small>
        </div>
      )}
    </section>
  )
}
