
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { workoutVolume, setsDone } from '../lib/history.js'
import { getLang, useLang } from '../lib/i18n.js'
import './health-hub.css'

const DAY = 24 * 60 * 60 * 1000

const localToday = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const dateValue = value => {
  if (!value) return NaN
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d).getTime()
}

const numeric = value =>
  value !== '' &&
  value !== null &&
  value !== undefined &&
  Number.isFinite(Number(value))

const average = values =>
  values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : null

const fmt = value =>
  Number.isInteger(value) ? String(value) : value.toFixed(1)


function TrendChart({
  title,
  unit,
  data,
  emptyText,
  fa,
  accent = '#8b5cf6'
}) {
  const points = data
    .filter(item => numeric(item.value))
    .sort((a, b) => a.date.localeCompare(b.date))

  const hasTrend = points.length >= 2
  const first = points[0]
  const last = points[points.length - 1]

  const values = points.map(item => Number(item.value))
  const min = hasTrend ? Math.min(...values) : 0
  const max = hasTrend ? Math.max(...values) : 0
  const spread = max - min || Math.max(Math.abs(max) * 0.1, 1)
  const low = min - spread * 0.12
  const high = max + spread * 0.12

  const x = index =>
    8 + (index / Math.max(1, points.length - 1)) * 284

  const y = value =>
    58 - ((value - low) / (high - low)) * 46

  const coords = points
    .map((item, index) => `${x(index)},${y(Number(item.value))}`)
    .join(' ')

  const change = hasTrend
    ? Number(last.value) - Number(first.value)
    : null

  const history = points.slice(-8).reverse()

  return (
    <details
      className="health-analytics-trend-card"
      style={{ '--trend-accent': accent }}
    >
      <summary>
        <div className="health-analytics-trend-top">
          <div className="health-analytics-trend-heading">
            <span className="health-analytics-trend-indicator" />
            <strong>{title}</strong>
          </div>

          <span className="health-analytics-trend-unit">
            {unit}
          </span>
        </div>

        <div className="health-analytics-trend-main">
          <strong>
            {last ? fmt(Number(last.value)) : '—'}
          </strong>

          {hasTrend && (
            <span className="health-analytics-trend-change">
              {change > 0 ? '+' : ''}
              {fmt(change)} {unit}
            </span>
          )}
        </div>

        {hasTrend ? (
          <svg
            className="health-analytics-trend-sparkline"
            viewBox="0 0 300 70"
            role="img"
            aria-label={`${title} trend`}
          >
            <polyline
              points={coords}
              fill="none"
              stroke="var(--trend-accent)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <circle
              cx={x(points.length - 1)}
              cy={y(Number(last.value))}
              r="4"
              fill="var(--trend-accent)"
            />
          </svg>
        ) : (
          <p className="health-muted health-analytics-trend-empty">
            {points.length === 1
              ? (fa ? 'برای نمایش روند به داده بیشتری نیاز است' : 'More data is needed to show a trend')
              : emptyText}
          </p>
        )}

        <div className="health-analytics-trend-footer">
          <span>
            {last
              ? `${fa ? 'آخرین ثبت' : 'Latest'}: ${last.date}`
              : (fa ? 'بدون داده' : 'No data')}
          </span>

          <span className="health-analytics-trend-expand">
            {fa ? 'مشاهده جزئیات' : 'View details'}
            <span className="health-analytics-trend-chevron">⌄</span>
          </span>
        </div>
      </summary>

      <div className="health-analytics-trend-details">
        {hasTrend && (
          <>
            <div className="health-analytics-trend-comparison">
              <div>
                <span>{fa ? 'اولین مقدار' : 'First value'}</span>
                <strong>{fmt(Number(first.value))} {unit}</strong>
                <small>{first.date}</small>
              </div>

              <div>
                <span>{fa ? 'آخرین مقدار' : 'Latest value'}</span>
                <strong>{fmt(Number(last.value))} {unit}</strong>
                <small>{last.date}</small>
              </div>
            </div>

            <svg
              className="health-analytics-trend-detail-chart"
              viewBox="0 0 300 100"
              role="img"
              aria-label={`${title} detailed trend`}
            >
              <line
                x1="8"
                y1="88"
                x2="292"
                y2="88"
                stroke="var(--sep)"
                strokeWidth="1"
              />

              <line
                x1="8"
                y1="50"
                x2="292"
                y2="50"
                stroke="var(--sep)"
                strokeWidth="1"
                strokeDasharray="3 4"
              />

              <polyline
                points={points
                  .map((item, index) =>
                    `${x(index)},${y(Number(item.value)) + 20}`
                  )
                  .join(' ')}
                fill="none"
                stroke="var(--trend-accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {points.map((item, index) => (
                <circle
                  key={`${item.date}-${index}`}
                  cx={x(index)}
                  cy={y(Number(item.value)) + 20}
                  r="3"
                  fill="var(--trend-accent)"
                >
                  <title>
                    {item.date}: {fmt(Number(item.value))} {unit}
                  </title>
                </circle>
              ))}
            </svg>

            <div className="health-analytics-trend-history">
              <strong>
                {fa ? 'آخرین ثبت‌ها' : 'Recent records'}
              </strong>

              {history.map((item, index) => (
                <div key={`${item.date}-${index}`}>
                  <span>{item.date}</span>
                  <strong>{fmt(Number(item.value))} {unit}</strong>
                </div>
              ))}
            </div>
          </>
        )}

        {!hasTrend && (
          <p className="health-muted">
            {emptyText}
          </p>
        )}
      </div>
    </details>
  )
}

function ReviewValue({
  label,
  current,
  previous,
  unit = '',
  lowerIsBetter = false,
  fa
}) {
  const hasBoth = numeric(current) && numeric(previous)

  const delta = hasBoth
    ? Number(current) - Number(previous)
    : null

  const improved =
    delta === null || delta === 0
      ? null
      : lowerIsBetter
        ? delta < 0
        : delta > 0

  return (
    <div className="health-analytics-review-value">
      <span>{label}</span>

      <strong>
        {numeric(current)
          ? `${fmt(Number(current))}${unit ? ` ${unit}` : ''}`
          : '—'}
      </strong>

      <small>
        {delta === null
          ? (fa
              ? 'برای مقایسه به دو ارزیابی نیاز است'
              : 'Two check-ins needed to compare')
          : `${delta > 0 ? '+' : ''}${fmt(delta)}${unit ? ` ${unit}` : ''} ${fa ? 'نسبت به قبل' : 'vs previous'}`}

        {improved !== null &&
          ` · ${
            improved
              ? (fa ? 'افزایش' : 'increased')
              : (fa ? 'کاهش' : 'decreased')
          }`}
      </small>
    </div>
  )
}

export default function HealthAnalytics() {
  useLang()

  const fa = getLang() === 'fa'
  const nav = useNavigate()

  const checkIns = useStore(s =>
    Array.isArray(s.S.healthCheckIns)
      ? s.S.healthCheckIns
      : []
  )

  const doseLogs = useStore(s =>
    Array.isArray(s.S.healthDoseLogs)
      ? s.S.healthDoseLogs
      : []
  )

  const sideEffects = useStore(s =>
    Array.isArray(s.S.healthSideEffects)
      ? s.S.healthSideEffects
      : []
  )

  const protocols = useStore(s =>
    Array.isArray(s.S.healthProtocols)
      ? s.S.healthProtocols
      : []
  )
  
  const workouts = useStore(s =>
    Array.isArray(s.S.workouts)
      ? s.S.workouts
      : []
  )
  
  const [range, setRange] = useState('90')

  const tx = (en, faText) =>
    fa ? faText : en

  const sortedCheckIns = useMemo(
    () =>
      [...checkIns].sort(
        (a, b) =>
          (a.date || '').localeCompare(b.date || '') ||
          (a.createdAt || '').localeCompare(b.createdAt || '')
      ),
    [checkIns]
  )

  const cutoff =
    range === 'all'
      ? -Infinity
      : dateValue(localToday()) - Number(range) * DAY

  const inRange = item =>
    dateValue(item.date) >= cutoff

  const filteredCheckIns =
    sortedCheckIns.filter(inRange)

  const filteredLogs =
    doseLogs.filter(inRange)

  const filteredEffects =
    sideEffects.filter(inRange)

  const filteredWorkouts = workouts.filter(
    w => w.d && dateValue(w.d) >= cutoff
  )

  const trainingSummary = useMemo(() => {
    const sessions = filteredWorkouts.length

    const sets = filteredWorkouts.reduce(
      (sum, w) => sum + setsDone(w),
      0
    )

    const volume = filteredWorkouts.reduce(
      (sum, w) => sum + workoutVolume(w),
      0
    )

    const duration = filteredWorkouts.reduce(
      (sum, w) => {
        const minutes = (Number(w.end) - Number(w.start)) / 60000
        return sum + (Number.isFinite(minutes) ? Math.max(0, minutes) : 0)
      },
      0
    )

    const calories = filteredWorkouts.reduce(
      (sum, w) => sum + (Number(w.calories) || 0),
      0
    )

    const firstDate = filteredWorkouts.length
      ? Math.min(...filteredWorkouts.map(w => dateValue(w.d)))
      : dateValue(localToday())

    const days = range === 'all'
      ? Math.max(1, (dateValue(localToday()) - firstDate) / DAY + 1)
      : Number(range)

    return {
      sessions,
      sets,
      volume,
      duration,
      calories,
      sessionsPerWeek: sessions / Math.max(1, days / 7)
    }
  }, [filteredWorkouts, range])

  const weeklyTraining = useMemo(() => {
    const weeks = new Map()

    filteredWorkouts.forEach(w => {
      const date = new Date(w.d + 'T12:00:00')
      if (Number.isNaN(date.getTime())) return

      const weekday = (date.getDay() + 6) % 7
      date.setDate(date.getDate() - weekday)

      const key = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0')
      ].join('-')

      if (!weeks.has(key)) {
        weeks.set(key, {
          date: key,
          volume: 0,
          sets: 0,
          sessions: 0
        })
      }

      const item = weeks.get(key)

      item.volume += workoutVolume(w)
      item.sets += setsDone(w)
      item.sessions += 1
    })

    return [...weeks.values()]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-12)
  }, [filteredWorkouts])

  const latest = [...filteredCheckIns].reverse()
  const current = latest[0]
  const previous = latest[1]

  
  const metrics = [
    {
      key: 'weight',
      title: tx('Body weight', 'وزن بدن'),
      unit: 'kg',
      accent: '#38bdf8'
    },
    {
      key: 'waist',
      title: tx('Waist', 'دور کمر'),
      unit: 'cm',
      accent: '#f59e0b'
    },
    {
      key: 'sleep',
      title: tx('Average sleep', 'میانگین خواب'),
      unit: 'h',
      accent: '#a78bfa'
    },
    {
      key: 'sleepQuality',
      title: tx('Sleep quality', 'کیفیت خواب'),
      unit: '/5',
      accent: '#2dd4bf'
    },
    {
      key: 'energy',
      title: tx('Energy', 'انرژی'),
      unit: '/5',
      accent: '#facc15'
    },
    {
      key: 'mood',
      title: tx('Well-being', 'حال عمومی'),
      unit: '/5',
      accent: '#fb7185'
    }
  ]


  const weeklyLogCounts = useMemo(() => {
    const today = dateValue(localToday())

    return Array.from({ length: 8 }, (_, index) => {
      const start = today - (7 - index) * 7 * DAY
      const end = start + 7 * DAY

      const count = doseLogs.filter(item => {
        const date = dateValue(item.date)
        return date >= start && date < end
      }).length

      return {
        label: String(index + 1),
        count
      }
    })
  }, [doseLogs])

  const maxWeeklyLogs = Math.max(
    1,
    ...weeklyLogCounts.map(item => item.count)
  )

  const activeEffects =
    sideEffects.filter(item => item.status !== 'resolved')

  const severeEffects =
    activeEffects.filter(item => item.severity === 'severe').length

  const activeProtocols =
    protocols.filter(item => item.status === 'active').length

  const exportCsv = () => {
    const headers = [
      'date',
      'weight_kg',
      'waist_cm',
      'sleep_hours',
      'sleep_quality',
      'energy',
      'wellbeing',
      'training',
      'notes'
    ]

    const rows = filteredCheckIns.map(item =>
      headers.map(key => {
        const value = ({
          date: item.date,
          weight_kg: item.weight,
          waist_cm: item.waist,
          sleep_hours: item.sleep,
          sleep_quality: item.sleepQuality,
          energy: item.energy,
          wellbeing: item.mood,
          training: item.training,
          notes: item.notes
        })[key] ?? ''

        return `"${String(value).replaceAll('"', '""')}"`
      })
    )

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob(
      ['\ufeff' + csv],
      { type: 'text/csv;charset=utf-8' }
    )

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download =
      `opengym-weekly-checkins-${localToday()}.csv`

    document.body.appendChild(link)
    link.click()
    link.remove()

    URL.revokeObjectURL(url)
  }

  return (
    <main
      className="health-page health-analytics-page"
      dir={fa ? 'rtl' : 'ltr'}
    >
      <style>{`
        .health-analytics-page {
          min-width: 0;
        }

        .health-analytics-toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin: 16px 0;
        }

        .health-analytics-range {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .health-analytics-range button {
          border: 1px solid var(--sep);
          border-radius: 10px;
          padding: 8px 11px;
          background: var(--surface);
          color: var(--label-2);
          font: inherit;
          font-size: 12px;
        }

        .health-analytics-range button.active {
          border-color: var(--green);
          color: var(--green);
          background: var(--surface-2);
        }

        .health-analytics-summary {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 9px;
          margin: 16px 0;
        }

        .health-analytics-summary > div {
          min-width: 0;
          border: 1px solid var(--sep);
          border-radius: 13px;
          padding: 12px;
          background: var(--surface-2);
        }

        .health-analytics-summary span {
          display: block;
          color: var(--label-3);
          font-size: 11px;
        }

        .health-analytics-summary strong {
          display: block;
          color: var(--label);
          font-size: 22px;
          margin-top: 6px;
        }

        .health-analytics-section {
          margin: 18px 0;
        }

        .health-analytics-section h3 {
          font-size: 15px;
          margin: 0 0 12px;
        }

        .health-analytics-charts {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .health-analytics-chart {
          min-width: 0;
          border: 1px solid var(--sep);
          border-radius: 13px;
          padding: 12px;
          background: var(--bg);
        }

        .health-analytics-chart-title,
        .health-analytics-chart-values,
        .health-analytics-chart-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }

        .health-analytics-chart-title strong {
          font-size: 13px;
        }

        .health-analytics-chart-title span,
        .health-analytics-chart-values,
        .health-analytics-chart-foot {
          color: var(--label-3);
          font-size: 10px;
        }

        .health-analytics-chart-values {
          margin-top: 8px;
          color: var(--label-2);
        }

        .health-analytics-svg {
          display: block;
          width: 100%;
          height: auto;
          margin: 7px 0 2px;
          overflow: visible;
        }

        .health-analytics-axis {
          stroke: var(--sep);
          stroke-width: 1;
        }

        .health-analytics-gridline {
          stroke: var(--sep);
          stroke-width: 1;
          stroke-dasharray: 3 4;
          opacity: .7;
        }

        .health-analytics-line {
          fill: none;
          stroke: var(--green);
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .health-analytics-dot {
          fill: var(--green);
          stroke: var(--bg);
          stroke-width: 1.5;
        }

        .health-analytics-chart-foot {
          flex-wrap: wrap;
        }

        .health-analytics-chart-foot strong {
          color: var(--label);
        }

        .health-analytics-review-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .health-analytics-review-value {
          min-width: 0;
          padding: 11px;
          border: 1px solid var(--sep);
          border-radius: 12px;
          background: var(--surface-2);
        }

        .health-analytics-review-value span,
        .health-analytics-review-value small {
          display: block;
          color: var(--label-3);
          font-size: 10px;
        }

        .health-analytics-review-value strong {
          display: block;
          margin: 5px 0;
          font-size: 18px;
          color: var(--label);
        }

        .health-analytics-review-value small {
          line-height: 1.5;
        }

        .health-analytics-bars {
          display: flex;
          align-items: flex-end;
          gap: 7px;
          height: 118px;
          padding: 12px 2px 0;
          border-bottom: 1px solid var(--sep);
        }

        .health-analytics-bar-wrap {
          flex: 1;
          min-width: 0;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          gap: 5px;
        }

        .health-analytics-bar {
          width: 100%;
          max-width: 28px;
          min-height: 2px;
          border-radius: 6px 6px 2px 2px;
          background: var(--green);
        }

        .health-analytics-bar-wrap small {
          color: var(--label-3);
          font-size: 9px;
        }

        .health-analytics-note {
          font-size: 11px;
          line-height: 1.65;
          margin-top: 12px;
        }

.health-analytics-trend-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--sep);
  border-radius: 16px;
  background: var(--surface-2);
  transition: border-color .2s ease;
}

.health-analytics-trend-card[open] {
  border-color: var(--trend-accent);
}

.health-analytics-trend-card summary {
  display: block;
  padding: 14px;
  cursor: pointer;
  list-style: none;
}

.health-analytics-trend-card summary::-webkit-details-marker {
  display: none;
}

.health-analytics-trend-top,
.health-analytics-trend-heading,
.health-analytics-trend-main,
.health-analytics-trend-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.health-analytics-trend-heading {
  justify-content: flex-start;
  min-width: 0;
}

.health-analytics-trend-heading strong {
  color: var(--label);
  font-size: 13px;
}

.health-analytics-trend-indicator {
  width: 9px;
  height: 9px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--trend-accent);
  box-shadow: 0 0 10px color-mix(in srgb, var(--trend-accent) 45%, transparent);
}

.health-analytics-trend-unit {
  color: var(--label-3);
  font-size: 10px;
}

.health-analytics-trend-main {
  justify-content: flex-start;
  align-items: baseline;
  margin-top: 13px;
}

.health-analytics-trend-main > strong {
  color: var(--label);
  font-size: 27px;
  line-height: 1.2;
  font-weight: 750;
}

.health-analytics-trend-change {
  color: var(--trend-accent);
  font-size: 11px;
  font-weight: 700;
}

.health-analytics-trend-sparkline {
  display: block;
  width: 100%;
  height: 65px;
  margin: 8px 0 3px;
  overflow: visible;
}

.health-analytics-trend-empty {
  min-height: 55px;
  display: flex;
  align-items: center;
  font-size: 11px;
}

.health-analytics-trend-footer {
  padding-top: 9px;
  border-top: 1px solid var(--sep);
  color: var(--label-3);
  font-size: 10px;
}

.health-analytics-trend-expand {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--trend-accent);
  font-weight: 650;
  white-space: nowrap;
}

.health-analytics-trend-chevron {
  display: inline-block;
  font-size: 15px;
  transition: transform .2s ease;
}

.health-analytics-trend-card[open] .health-analytics-trend-chevron {
  transform: rotate(180deg);
}

.health-analytics-trend-details {
  padding: 0 14px 14px;
  border-top: 1px solid var(--sep);
}

.health-analytics-trend-comparison {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
  margin-top: 13px;
}

.health-analytics-trend-comparison > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
  padding: 10px;
  border-radius: 11px;
  background: var(--bg);
}

.health-analytics-trend-comparison span,
.health-analytics-trend-comparison small {
  color: var(--label-3);
  font-size: 10px;
}

.health-analytics-trend-comparison strong {
  color: var(--label);
  font-size: 15px;
}

.health-analytics-trend-detail-chart {
  display: block;
  width: 100%;
  height: auto;
  margin: 12px 0;
  overflow: visible;
}

.health-analytics-trend-history {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.health-analytics-trend-history > strong {
  margin-bottom: 8px;
  color: var(--label-2);
  font-size: 11px;
}

.health-analytics-trend-history > div {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 0;
  border-top: 1px solid var(--sep);
  font-size: 11px;
}

.health-analytics-trend-history > div span {
  color: var(--label-3);
}

.health-analytics-trend-history > div strong {
  color: var(--label);
}

.health-analytics-training-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;
  margin: 12px 0 16px;
}

.health-analytics-training-summary > div {
  min-width: 0;
  border: 1px solid var(--sep);
  border-radius: 13px;
  padding: 12px;
  background: var(--surface-2);
}

.health-analytics-training-summary span {
  display: block;
  color: var(--label-3);
  font-size: 11px;
}

.health-analytics-training-summary strong {
  display: block;
  color: var(--label);
  font-size: 21px;
  margin-top: 6px;
}

@media(max-width:600px) {
  .health-analytics-training-summary,
  .health-analytics-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .health-analytics-charts {
    grid-template-columns: 1fr;
  }
}
    
        @media(max-width:380px) {
          .health-analytics-review-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <button
        className="health-secondary"
        onClick={() => nav('/health')}
      >
        {tx('‹ Back to Health', '‹ بازگشت به سلامت')}
      </button>

      <header className="health-header">
        <div>
          <h1>
            {tx(
              'Analytics & Weekly Review',
              'تحلیل و مرور هفتگی'
            )}
          </h1>

          <p className="health-muted">
            {tx(
              'Review your recorded trends and activity over time.',
              'روندها و فعالیت‌های ثبت‌شده خود را در طول زمان بررسی کنید.'
            )}
          </p>
        </div>
      </header>

      <div className="health-analytics-toolbar">
        
<div className="health-analytics-range">
  {[
    ['7', tx('Week', 'هفته')],
    ['30', tx('Month', 'ماه')],
    ['90', tx('3 Months', '۳ ماه')],
    ['180', tx('6 Months', '۶ ماه')],
    ['365', tx('1 Year', 'یک سال')],
    ['all', tx('All Time', 'همه زمان‌ها')]
  ].map(([value, label]) => (
    <button
      key={value}
      type="button"
      className={range === value ? 'active' : ''}
      onClick={() => setRange(value)}
    >
      {label}
    </button>
  ))}
</div>


        <button
          className="health-secondary"
          type="button"
          onClick={exportCsv}
          disabled={!filteredCheckIns.length}
        >
          {tx(
            'Export check-ins CSV',
            'خروجی CSV ارزیابی‌ها'
          )}
        </button>
      </div>

      <div className="health-analytics-summary">
        <div>
          <span>{tx('Check-ins in range', 'ارزیابی در بازه')}</span>
          <strong>{filteredCheckIns.length}</strong>
        </div>

        <div>
          <span>{tx('Dose log entries', 'ثبت‌های روزانه')}</span>
          <strong>{filteredLogs.length}</strong>
        </div>

        <div>
          <span>{tx('Ongoing side effects', 'عوارض فعال')}</span>
          <strong>{activeEffects.length}</strong>
        </div>

        <div>
          <span>{tx('Active protocols', 'پروتکل فعال')}</span>
          <strong>{activeProtocols}</strong>
        </div>
      </div>

      <section className="health-card health-analytics-section">
        <h3>{tx('Weekly review', 'مرور هفتگی')}</h3>

        {!current ? (
          <p className="health-muted">
            {tx(
              'Save at least one weekly check-in to start your review.',
              'برای شروع مرور، حداقل یک ارزیابی هفتگی ثبت کنید.'
            )}
          </p>
        ) : (
          <>
            <p className="health-muted">
              {tx('Latest check-in:', 'آخرین ارزیابی:')} {current.date}

              {previous
                ? ` · ${tx('Compared with', 'در مقایسه با')} ${previous.date}`
                : ''}
            </p>

            <div className="health-analytics-review-grid">
              <ReviewValue
                label={tx('Body weight', 'وزن بدن')}
                current={current.weight}
                previous={previous?.weight}
                unit="kg"
                fa={fa}
              />

              <ReviewValue
                label={tx('Waist', 'دور کمر')}
                current={current.waist}
                previous={previous?.waist}
                unit="cm"
                lowerIsBetter
                fa={fa}
              />

              <ReviewValue
                label={tx('Average sleep', 'میانگین خواب')}
                current={current.sleep}
                previous={previous?.sleep}
                unit="h"
                fa={fa}
              />

              <ReviewValue
                label={tx('Sleep quality', 'کیفیت خواب')}
                current={current.sleepQuality}
                previous={previous?.sleepQuality}
                unit="/5"
                fa={fa}
              />

              <ReviewValue
                label={tx('Energy', 'انرژی')}
                current={current.energy}
                previous={previous?.energy}
                unit="/5"
                fa={fa}
              />

              <ReviewValue
                label={tx('Well-being', 'حال عمومی')}
                current={current.mood}
                previous={previous?.mood}
                unit="/5"
                fa={fa}
              />
            </div>

            {current.training && (
              <p className="health-muted health-analytics-note">
                {tx('Training status:', 'وضعیت تمرین:')} {current.training}
              </p>
            )}
          </>
        )}

        <p className="health-muted health-analytics-note">
          {tx(
            'Changes are descriptive comparisons only. They do not establish causes or provide medical advice.',
            'این تغییرات صرفاً مقایسه آماری هستند و علت پزشکی یا توصیه درمانی را مشخص نمی‌کنند.'
          )}
        </p>
      </section>

      <section className="health-card health-analytics-section">
        <h3>{tx('Progress trends', 'روند پیشرفت')}</h3>

        {filteredCheckIns.length === 0 ? (
          <p className="health-muted">
            {tx(
              'No check-ins in this period.',
              'در این بازه ارزیابی‌ای ثبت نشده است.'
            )}
          </p>
        ) : (
          <div className="health-analytics-charts">
            {metrics.map(metric => (
              <TrendChart
                key={metric.key}
                title={metric.title}
                unit={metric.unit}
                fa={fa}
                accent={metric.accent}
                data={filteredCheckIns.map(item => ({
                  date: item.date,
                  value: item[metric.key]
                }))}
                emptyText={tx(
                  'At least two data points are needed to show a trend.',
                  'برای نمایش روند، حداقل دو داده لازم است.'
                )}
              />
            ))}
          </div>
        )}
      </section>

      <section className="health-card health-analytics-section">
        <h3>{tx('Daily log activity', 'فعالیت ثبت روزانه')}</h3>

        <p className="health-muted">
          {tx(
            'Entries per week · last 8 weeks',
            'تعداد ثبت در هر هفته · ۸ هفته اخیر'
          )}
        </p>

        <div className="health-analytics-bars">
          {weeklyLogCounts.map((item, index) => (
            <div
              className="health-analytics-bar-wrap"
              key={item.label}
              title={`${item.count} entries`}
            >
              <div
                className="health-analytics-bar"
                style={{
                  height: `${Math.max(
                    2,
                    item.count / maxWeeklyLogs * 82
                  )}px`
                }}
              />

              <small>{index + 1}</small>
            </div>
          ))}
        </div>

        <p className="health-muted health-analytics-note">
          {tx(
            'Total entries in the selected period:',
            'مجموع ثبت‌ها در بازه انتخابی:'
          )} {filteredLogs.length}
        </p>
      </section>

      <section className="health-card health-analytics-section">
        <h3>{tx('Side-effect overview', 'نمای کلی عوارض جانبی')}</h3>

        <div className="health-analytics-summary">
          <div>
            <span>{tx('In selected period', 'در بازه انتخابی')}</span>
            <strong>{filteredEffects.length}</strong>
          </div>

          <div>
            <span>{tx('Mild', 'خفیف')}</span>
            <strong>
              {filteredEffects.filter(x => x.severity === 'mild').length}
            </strong>
          </div>

          <div>
            <span>{tx('Moderate', 'متوسط')}</span>
            <strong>
              {filteredEffects.filter(x => x.severity === 'moderate').length}
            </strong>
          </div>

          <div>
            <span>{tx('Severe ongoing', 'شدید و فعال')}</span>
            <strong>{severeEffects}</strong>
          </div>
        </div>

        {filteredEffects.length === 0 && (
          <p className="health-muted">
            {tx(
              'No side-effect records in this period.',
              'در این بازه عارضه‌ای ثبت نشده است.'
            )}
          </p>
        )}

        <p className="health-muted health-analytics-note">
          {tx(
            'Recorded symptoms are not proof of a connection to a protocol or compound. Seek professional medical assessment for concerning symptoms.',
            'ثبت هم‌زمان یک علامت و پروتکل، اثبات‌کننده رابطه علت و معلولی نیست. برای علائم نگران‌کننده ارزیابی پزشکی دریافت کنید.'
          )}
        </p>
      </section>

      <section className="health-card health-analytics-section">
        <h3>{tx('Training Overview', 'نمای کلی تمرین')}</h3>

        <div className="health-analytics-training-summary">
          <div>
            <span>{tx('Workouts', 'جلسات تمرین')}</span>
            <strong>{trainingSummary.sessions}</strong>
          </div>

          <div>
            <span>{tx('Sessions / week', 'جلسه در هفته')}</span>
            <strong>{fmt(trainingSummary.sessionsPerWeek)}</strong>
          </div>

          <div>
            <span>{tx('Completed sets', 'ست تکمیل‌شده')}</span>
            <strong>{trainingSummary.sets}</strong>
          </div>

          <div>
            <span>{tx('Training volume', 'حجم تمرین')}</span>
            <strong>{Math.round(trainingSummary.volume).toLocaleString()}</strong>
          </div>

          <div>
            <span>{tx('Duration', 'مدت تمرین')}</span>
            <strong>{Math.round(trainingSummary.duration)} min</strong>
          </div>

          <div>
            <span>{tx('Estimated calories', 'کالری تخمینی')}</span>
            <strong>{Math.round(trainingSummary.calories).toLocaleString()}</strong>
          </div>
        </div>

        <p className="health-muted health-analytics-note">
          {tx(
            'Training volume is calculated from completed sets using logged external weight × reps. Bodyweight, timed and cardio work without external weight × reps are not included in this volume. Calories are estimates recorded by the workout system.',
            'حجم تمرین از حاصل‌ضرب وزنه ثبت‌شده در تعداد تکرار ست‌های تکمیل‌شده محاسبه می‌شود. حرکات وزن بدن، زمان‌دار و هوازی که وزنه و تکرار خارجی ندارند در این حجم لحاظ نمی‌شوند. کالری نیز تخمین ثبت‌شده توسط سیستم تمرین است.'
          )}
        </p>

        <h3 style={{ marginTop: 22 }}>
          {tx('Weekly Training Trends', 'روند هفتگی تمرین')}
        </h3>

        {weeklyTraining.length === 0 ? (
          <p className="health-muted">
            {tx(
              'No completed workouts in this period.',
              'در این بازه تمرین تکمیل‌شده‌ای ثبت نشده است.'
            )}
          </p>
        ) : (
          <div className="health-analytics-charts">
            <TrendChart
              title={tx('Training volume', 'حجم تمرین')}
              unit="kg × reps"
              data={weeklyTraining.map(w => ({
                date: w.date,
                value: w.volume
              }))}
              emptyText={tx(
                'At least two weeks of data are needed.',
                'برای نمایش روند حداقل دو هفته داده لازم است.'
              )}
              fa={fa}
            />

            <TrendChart
              title={tx('Completed sets', 'ست‌های تکمیل‌شده')}
              unit={tx('sets', 'ست')}
              data={weeklyTraining.map(w => ({
                date: w.date,
                value: w.sets
              }))}
              emptyText={tx(
                'At least two weeks of data are needed.',
                'برای نمایش روند حداقل دو هفته داده لازم است.'
              )}
              fa={fa}
            />

            <TrendChart
              title={tx('Workout frequency', 'تعداد جلسات')}
              unit={tx('sessions', 'جلسه')}
              data={weeklyTraining.map(w => ({
                date: w.date,
                value: w.sessions
              }))}
              emptyText={tx(
                'At least two weeks of data are needed.',
                'برای نمایش روند حداقل دو هفته داده لازم است.'
              )}
              fa={fa}
            />
          </div>
        )}
      </section>
      
      <div className="health-analytics-toolbar">
        <button
          className="health-secondary"
          onClick={() => nav('/health/performance/check-ins')}
        >
          {tx(
            'Open check-in history →',
            'مشاهده تاریخچه ارزیابی‌ها ←'
          )}
        </button>

        <button
          className="health-secondary"
          onClick={() => nav('/health/performance/logs')}
        >
          {tx(
            'Open daily log history →',
            'مشاهده تاریخچه ثبت روزانه ←'
          )}
        </button>
      </div>
    </main>
  )
}
