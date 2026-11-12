import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { workoutVolume, setsDone } from '../lib/history.js'
import { getLang, useLang } from '../lib/i18n.js'
import { fmtDateFull } from '../lib/format.js'
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

const positiveNumber = value => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : null
}

const log10 = value => Math.log(value) / Math.LN10

function calculateNavyBodyFat({ sex, height, waist, neck, hip }) {
  if (!height || !waist || !neck) return null

  const h = height / 2.54
  const w = waist / 2.54
  const n = neck / 2.54

  let result

  if (sex === 'female') {
    if (!hip) return null
    result = 163.205 * log10(w + hip / 2.54 - n)
      - 97.684 * log10(h) - 78.387
  } else {
    if (w <= n) return null
    result = 86.010 * log10(w - n)
      - 70.041 * log10(h) + 36.76
  }

  return Number.isFinite(result) && result >= 2 && result <= 70
    ? result
    : null
}

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
  calendar,
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
              ? `${fa ? 'آخرین ثبت' : 'Latest'}: ${fmtDateFull(last.date, calendar)}`
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
                <small>{fmtDateFull(first.date, calendar)}</small>
              </div>

              <div>
                <span>{fa ? 'آخرین مقدار' : 'Latest value'}</span>
                <strong>{fmt(Number(last.value))} {unit}</strong>
                <small>{fmtDateFull(last.date, calendar)}</small>
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
                    {fmtDateFull(item.date, calendar)}: {fmt(Number(item.value))} {unit}
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
                  <span>{fmtDateFull(item.date, calendar)}</span>
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


function AreaTrendChart({
  title,
  unit,
  data,
  emptyText,
  fa,
  calendar,
  accent = '#38bdf8'
}) {
  const points = data
    .filter(item => numeric(item.value))
    .sort((a, b) => a.date.localeCompare(b.date))

  const first = points[0]
  const last = points[points.length - 1]
  const hasTrend = points.length >= 2

  const values = points.map(item => Number(item.value))
  const min = values.length ? Math.min(...values) : 0
  const max = values.length ? Math.max(...values) : 0
  const spread = max - min || Math.max(Math.abs(max) * 0.05, 1)
  const low = min - spread * 0.18
  const high = max + spread * 0.18

  const x = index =>
    points.length === 1
      ? 150
      : 8 + index / (points.length - 1) * 284

  const y = value =>
    78 - ((value - low) / (high - low)) * 58

  const linePath = points
    .map((item, index) =>
      `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(Number(item.value))}`
    )
    .join(' ')

  const areaPath = points.length
    ? `${linePath} L ${x(points.length - 1)} 86 L ${x(0)} 86 Z`
    : ''

  const change = hasTrend
    ? Number(last.value) - Number(first.value)
    : null

  const history = points.slice(-8).reverse()

  const renderChart = (detail = false) => (
    <svg
      className={
        detail
          ? 'health-analytics-trend-detail-chart'
          : 'health-analytics-trend-sparkline'
      }
      viewBox="0 0 300 100"
      role="img"
      aria-label={`${title} area chart`}
    >
      <defs>
        <linearGradient
          id="body-weight-area-gradient"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="var(--trend-accent)"
            stopOpacity=".38"
          />
          <stop
            offset="100%"
            stopColor="var(--trend-accent)"
            stopOpacity=".02"
          />
        </linearGradient>
      </defs>

      {[20, 50, 80].map(level => (
        <line
          key={level}
          x1="8"
          y1={level}
          x2="292"
          y2={level}
          stroke="var(--sep)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
      ))}

      {points.length > 0 && (
        <>
          <path
            d={areaPath}
            fill="url(#body-weight-area-gradient)"
          />

          {hasTrend && (
            <path
              d={linePath}
              fill="none"
              stroke="var(--trend-accent)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {points.map((item, index) => (
            <circle
              key={`${item.date}-${index}`}
              cx={x(index)}
              cy={y(Number(item.value))}
              r={index === points.length - 1 ? 4.5 : 3}
              fill="var(--trend-accent)"
              stroke="var(--surface-2)"
              strokeWidth="1.5"
            >
              <title>
                {fmtDateFull(item.date, calendar)}: {fmt(Number(item.value))} {unit}
              </title>
            </circle>
          ))}
        </>
      )}
    </svg>
  )

  return (
    <details
      className="health-analytics-trend-card health-analytics-area-card"
      style={{ '--trend-accent': accent }}
    >
      <summary>
        <div className="health-analytics-trend-top">
          <div className="health-analytics-trend-heading">
            <span className="health-analytics-trend-indicator" />
            <strong>{title}</strong>
          </div>

          <span className="health-analytics-trend-unit">{unit}</span>
        </div>

        <div className="health-analytics-trend-main">
          <strong>{last ? fmt(Number(last.value)) : '—'}</strong>

          {hasTrend && (
            <span className="health-analytics-trend-change">
              {change > 0 ? '+' : ''}
              {fmt(change)} {unit}
            </span>
          )}
        </div>

        {points.length > 0
          ? renderChart()
          : (
            <p className="health-muted health-analytics-trend-empty">
              {emptyText}
            </p>
          )}

        <div className="health-analytics-trend-footer">
          <span>
            {last
              ? `${fa ? 'آخرین ثبت' : 'Latest'}: ${fmtDateFull(last.date, calendar)}`
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
                <small>{fmtDateFull(first.date, calendar)}</small>
              </div>

              <div>
                <span>{fa ? 'آخرین مقدار' : 'Latest value'}</span>
                <strong>{fmt(Number(last.value))} {unit}</strong>
                <small>{fmtDateFull(last.date, calendar)}</small>
              </div>
            </div>

            {renderChart(true)}

            <div className="health-analytics-trend-history">
              <strong>{fa ? 'آخرین ثبت‌ها' : 'Recent records'}</strong>

              {history.map((item, index) => (
                <div key={`${item.date}-${index}`}>
                  <span>{fmtDateFull(item.date, calendar)}</span>
                  <strong>{fmt(Number(item.value))} {unit}</strong>
                </div>
              ))}
            </div>
          </>
        )}

        {!hasTrend && (
          <p className="health-muted">{emptyText}</p>
        )}
      </div>
    </details>
  )
}


function LineTrendChart({
  title,
  unit,
  data,
  emptyText,
  fa,
  calendar,
  accent = '#f59e0b'
}) {
  const points = data
    .filter(item => numeric(item.value))
    .sort((a, b) => a.date.localeCompare(b.date))

  const first = points[0]
  const last = points[points.length - 1]
  const hasTrend = points.length >= 2

  const values = points.map(item => Number(item.value))
  const min = values.length ? Math.min(...values) : 0
  const max = values.length ? Math.max(...values) : 0
  const spread = max - min || Math.max(Math.abs(max) * 0.08, 1)
  const low = min - spread * 0.15
  const high = max + spread * 0.15
  const middle = (low + high) / 2

  const x = index =>
    points.length === 1
      ? 163
      : 36 + index / (points.length - 1) * 256

  const y = value =>
    82 - ((value - low) / (high - low)) * 64

  const linePath = points
    .map((item, index) =>
      `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(Number(item.value))}`
    )
    .join(' ')

  const change = hasTrend
    ? Number(last.value) - Number(first.value)
    : null

  const history = points.slice(-8).reverse()

  const renderChart = () => (
    <svg
      className="health-analytics-trend-detail-chart"
      viewBox="0 0 300 104"
      role="img"
      aria-label={`${title} line chart`}
    >
      {[18, 50, 82].map(level => (
        <line
          key={level}
          x1="34"
          y1={level}
          x2="292"
          y2={level}
          stroke="var(--sep)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
      ))}

      <g
        fill="var(--trend-accent)"
        fontSize="9"
        textAnchor="end"
      >
        <text x="29" y="21">{fmt(high)}</text>
        <text x="29" y="53">{fmt(middle)}</text>
        <text x="29" y="85">{fmt(low)}</text>
      </g>

      {hasTrend && (
        <path
          d={linePath}
          fill="none"
          stroke="var(--trend-accent)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {points.map((item, index) => (
        <circle
          key={`${item.date}-${index}`}
          cx={x(index)}
          cy={y(Number(item.value))}
          r={index === points.length - 1 ? 4.8 : 3.2}
          fill="var(--trend-accent)"
          stroke="var(--surface-2)"
          strokeWidth="1.5"
        >
          <title>
            {fmtDateFull(item.date, calendar)}: {fmt(Number(item.value))} {unit}
          </title>
        </circle>
      ))}
    </svg>
  )

  return (
    <details
      className="health-analytics-trend-card health-analytics-line-card"
      style={{ '--trend-accent': accent }}
    >
      <summary>
        <div className="health-analytics-trend-top">
          <div className="health-analytics-trend-heading">
            <span className="health-analytics-trend-indicator" />
            <strong>{title}</strong>
          </div>

          <span className="health-analytics-trend-unit">{unit}</span>
        </div>

        <div className="health-analytics-trend-main">
          <strong>{last ? fmt(Number(last.value)) : '—'}</strong>

          {hasTrend && (
            <span className="health-analytics-trend-change">
              {change > 0 ? '+' : ''}
              {fmt(change)} {unit}
            </span>
          )}
        </div>

        {points.length > 0
          ? renderChart()
          : (
            <p className="health-muted health-analytics-trend-empty">
              {emptyText}
            </p>
          )}

        <div className="health-analytics-trend-footer">
          <span>
            {last
              ? `${fa ? 'آخرین ثبت' : 'Latest'}: ${fmtDateFull(last.date, calendar)}`
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
                <small>{fmtDateFull(first.date, calendar)}</small>
              </div>

              <div>
                <span>{fa ? 'آخرین مقدار' : 'Latest value'}</span>
                <strong>{fmt(Number(last.value))} {unit}</strong>
                <small>{fmtDateFull(last.date, calendar)}</small>
              </div>
            </div>

            {renderChart()}

            <div className="health-analytics-trend-history">
              <strong>{fa ? 'آخرین ثبت‌ها' : 'Recent records'}</strong>

              {history.map((item, index) => (
                <div key={`${item.date}-${index}`}>
                  <span>{fmtDateFull(item.date, calendar)}</span>
                  <strong>{fmt(Number(item.value))} {unit}</strong>
                </div>
              ))}
            </div>
          </>
        )}

        {!hasTrend && (
          <p className="health-muted">
            {points.length === 1
              ? (fa ? 'برای نمایش روند به داده بیشتری نیاز است' : 'More data is needed to show a trend')
              : emptyText}
          </p>
        )}
      </div>
    </details>
  )
}


function BodyCompositionStackedChart({
  title,
  data,
  emptyText,
  fa,
  calendar
}) {
  const points = data
    .filter(item =>
      numeric(item.fatMass) &&
      numeric(item.leanMass) &&
      Number(item.fatMass) > 0 &&
      Number(item.leanMass) > 0
    )
    .map(item => ({
      ...item,
      fatMass: Number(item.fatMass),
      leanMass: Number(item.leanMass),
      total: Number(item.fatMass) + Number(item.leanMass)
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const visiblePoints = points.slice(-10)
  const first = points[0]
  const last = points[points.length - 1]
  const maxTotal = Math.max(
    0,
    ...visiblePoints.map(item => item.total)
  )

  const hasTrend = points.length >= 2
  const totalChange = hasTrend ? last.total - first.total : null
  const fatChange = hasTrend ? last.fatMass - first.fatMass : null
  const leanChange = hasTrend ? last.leanMass - first.leanMass : null
  const history = points.slice(-8).reverse()

  const renderBars = (detailed = false) => (
    <div
      className="health-analytics-bar-chart"
      role="img"
      aria-label={fa
        ? 'نمودار ترکیبی توده چربی و بدون چربی'
        : 'Stacked fat and lean mass chart'}
    >
      {visiblePoints.map((item, index) => {
        const height = maxTotal > 0
          ? Math.max(4, item.total / maxTotal * 100)
          : 4

        const fatPercent = item.fatMass / item.total * 100
        const leanPercent = item.leanMass / item.total * 100

        return (
          <div
            className="health-analytics-bar-column"
            key={`${item.date}-${index}`}
            title={`${fmtDateFull(item.date, calendar)} · ${fa ? 'چربی' : 'Fat'}: ${fmt(item.fatMass)} kg · ${fa ? 'بدون چربی' : 'Lean'}: ${fmt(item.leanMass)} kg`}
          >
            <span className="health-analytics-bar-value">
              {fmt(item.total)}
            </span>

            <div
              className="health-analytics-bar-track"
              style={{
                height: detailed ? '140px' : '88px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
              }}
            >
              <div
                style={{
                  width: detailed ? 'min(82%, 30px)' : 'min(76%, 22px)',
                  height: `${height}%`,
                  minHeight: '3px',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  borderRadius: '7px 7px 3px 3px'
                }}
              >
                <div
                  style={{
                    height: `${leanPercent}%`,
                    background: '#2dd4bf',
                    minHeight: '1px'
                  }}
                />

                <div
                  style={{
                    height: `${fatPercent}%`,
                    background: '#f87171',
                    minHeight: '1px'
                  }}
                />
              </div>
            </div>

            <span className="health-analytics-bar-label">
              {index + 1}
            </span>
          </div>
        )
      })}
    </div>
  )

  const renderMetricComparison = (label, start, end, change, color) => (
    <div
      style={{
        border: `1px solid color-mix(in srgb, ${color} 35%, var(--sep))`,
        background: `color-mix(in srgb, ${color} 7%, var(--surface-2))`,
        borderRadius: '13px',
        padding: '12px',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '9px'
      }}
    >
      <span style={{
        color,
        fontSize: '12px',
        fontWeight: 700
      }}>
        {label}
      </span>

      <strong style={{
        fontSize: '19px',
        lineHeight: 1.3,
        color: 'var(--text)'
      }}>
        {change > 0 ? '+' : ''}{fmt(change)} kg
      </strong>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '8px',
        fontSize: '11px',
        color: 'var(--muted)'
      }}>
        <span>
          {fa ? 'ابتدا' : 'First'}: {fmt(start)}
        </span>
        <span>
          {fa ? 'آخرین' : 'Latest'}: {fmt(end)}
        </span>
      </div>
    </div>
  )

  return (
    <details
      className="health-analytics-trend-card health-analytics-bar-card health-analytics-composition-card"
      style={{ '--trend-accent': '#2dd4bf' }}
    >
      <summary>
        <div className="health-analytics-trend-top">
          <div className="health-analytics-trend-heading">
            <span
              className="health-analytics-trend-indicator"
              style={{
                background: 'linear-gradient(90deg, #f87171 50%, #2dd4bf 50%)'
              }}
            />
            <strong>{title}</strong>
          </div>

          <span className="health-analytics-trend-unit">kg</span>
        </div>

        <div className="health-analytics-trend-main">
          <strong>{last ? fmt(last.total) : '—'}</strong>

          {hasTrend && (
            <span className="health-analytics-trend-change">
              {totalChange > 0 ? '+' : ''}
              {fmt(totalChange)} kg
            </span>
          )}
        </div>

        {visiblePoints.length > 0 ? (
          renderBars()
        ) : (
          <p className="health-muted health-analytics-trend-empty">
            {emptyText}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '12px',
            fontSize: '12px'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <i style={{ width: 8, height: 8, borderRadius: 3, background: '#f87171' }} />
            {fa ? 'توده چربی' : 'Fat mass'}
          </span>

          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <i style={{ width: 8, height: 8, borderRadius: 3, background: '#2dd4bf' }} />
            {fa ? 'توده بدون چربی' : 'Lean body mass'}
          </span>
        </div>

        <div className="health-analytics-trend-footer">
          <span>
            {last
              ? `${fa ? 'آخرین ثبت' : 'Latest'}: ${fmtDateFull(last.date, calendar)}`
              : (fa ? 'بدون داده' : 'No data')}
          </span>

          <span
            className="health-analytics-trend-expand"
            style={{
              color: '#2dd4bf',
              fontWeight: 700
            }}
          >
            {fa ? 'مشاهده جزئیات' : 'View details'}
            <span
              className="health-analytics-trend-chevron"
              style={{ color: '#2dd4bf' }}
            >
              ⌄
            </span>
          </span>
        </div>
      </summary>

      <div className="health-analytics-trend-details">
        {hasTrend ? (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '10px'
              }}
            >
              {renderMetricComparison(
                fa ? 'تغییر توده چربی' : 'Fat mass change',
                first.fatMass,
                last.fatMass,
                fatChange,
                '#f87171'
              )}

              {renderMetricComparison(
                fa ? 'تغییر توده بدون چربی' : 'Lean mass change',
                first.leanMass,
                last.leanMass,
                leanChange,
                '#2dd4bf'
              )}
            </div>

            <div style={{ marginTop: '18px' }}>
              <strong style={{
                display: 'block',
                marginBottom: '10px',
                fontSize: '13px'
              }}>
                {fa ? 'روند ترکیب بدن' : 'Body composition trend'}
              </strong>

              {renderBars(true)}
            </div>

            <div className="health-analytics-trend-history">
              <strong>{fa ? 'آخرین ثبت‌ها' : 'Recent records'}</strong>

              {history.map((item, index) => (
                <div key={`${item.date}-${index}`}>
                  <span>{fmtDateFull(item.date, calendar)}</span>

                  <strong style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <span style={{ color: '#f87171' }}>
                      {fa ? 'چربی' : 'Fat'}: {fmt(item.fatMass)} kg
                    </span>
                    <span style={{ color: '#2dd4bf' }}>
                      {fa ? 'بدون چربی' : 'Lean'}: {fmt(item.leanMass)} kg
                    </span>
                  </strong>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="health-muted">
            {points.length === 1
              ? (fa
                ? 'برای نمایش روند به ثبت‌های بیشتری نیاز است.'
                : 'More records are needed to show a trend.')
              : emptyText}
          </p>
        )}
      </div>
    </details>
  )
}

function WeeklyBarChart({
  title,
  unit,
  data,
  emptyText,
  fa,
  calendar,
  accent = '#8b5cf6',
  rangeScale = false
}) {
  const points = data
    .filter(item => numeric(item.value))
    .sort((a, b) => a.date.localeCompare(b.date))

  const visiblePoints = points.slice(-10)
  const first = points[0]
  const last = points[points.length - 1]
  const max = Math.max(0, ...visiblePoints.map(item => Number(item.value)))
  const min = Math.min(...visiblePoints.map(item => Number(item.value)))
  const range = max - min || Math.max(Math.abs(max) * 0.05, 1)

  const hasTrend = points.length >= 2
  const change = hasTrend
    ? Number(last.value) - Number(first.value)
    : null

  const history = points.slice(-8).reverse()

  return (
    <details
      className="health-analytics-trend-card health-analytics-bar-card"
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

        {visiblePoints.length > 0 ? (
          <div
            className="health-analytics-bar-chart"
            role="img"
            aria-label={`${title} weekly bar chart`}
          >
            {visiblePoints.map((item, index) => {
              const value = Math.max(0, Number(item.value))
              const height = rangeScale
                ? 24 + ((value - min) / range) * 76
                : max > 0
                ? Math.max(3, value / max * 100)
                : 3

              return (
                <div
                  className="health-analytics-bar-column"
                  key={`${item.date}-${index}`}
                  title={`${fmtDateFull(item.date, calendar)}: ${fmt(value)} ${unit}`}
                >
<span className="health-analytics-bar-value">
  {value >= 10000
    ? `${(value / 1000).toFixed(1)}k`
    : value >= 1000
      ? `${(value / 1000).toFixed(1)}k`
      : fmt(value)}
</span>

                  <div className="health-analytics-bar-track">
                    <div
                      className="health-analytics-bar-fill"
                      style={{ height: `${height}%` }}
                    />
                  </div>

<span
  className="health-analytics-bar-label"
  aria-label={`${fa ? 'هفته' : 'Week'} ${index + 1}`}
>
  {index + 1}
</span>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="health-muted health-analytics-trend-empty">
            {emptyText}
          </p>
        )}

        <div className="health-analytics-trend-footer">
          <span>
            {last
              ? `${fa ? 'آخرین ثبت' : 'Latest'}: ${fmtDateFull(last.date, calendar)}`
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
                <small>{fmtDateFull(first.date, calendar)}</small>
              </div>

              <div>
                <span>{fa ? 'آخرین مقدار' : 'Latest value'}</span>
                <strong>{fmt(Number(last.value))} {unit}</strong>
                <small>{fmtDateFull(last.date, calendar)}</small>
              </div>
            </div>

            <div className="health-analytics-trend-history">
              <strong>
                {fa ? 'آخرین ثبت‌ها' : 'Recent records'}
              </strong>

              {history.map((item, index) => (
                <div key={`${item.date}-${index}`}>
                  <span>{fmtDateFull(item.date, calendar)}</span>
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

function BodyMeasurementsMap({ data, fa, calendar }) {
  const measurements = [
    {
      key: 'neck',
      title: fa ? 'دور گردن' : 'Neck',
      color: '#38bdf8',
      y: 65
    },
    {
      key: 'chest',
      title: fa ? 'دور سینه' : 'Chest',
      color: '#fb923c',
      y: 112
    },
    {
      key: 'arm',
      title: fa ? 'دور بازو' : 'Arm',
      color: '#a78bfa',
      y: 142
    },
    {
      key: 'hip',
      title: fa ? 'دور هیپ' : 'Hip',
      color: '#f472b6',
      y: 185
    },
    {
      key: 'leg',
      title: fa ? 'دور پا' : 'Leg',
      color: '#2dd4bf',
      y: 252
    }
  ]

  const getHistory = key =>
    data
      .filter(item => positiveNumber(item[key]) !== null)
      .sort((a, b) => a.date.localeCompare(b.date))

  const getSparkline = points => {
    if (points.length < 2) return ''

    const values = points.map(item => Number(item.value))
    const min = Math.min(...values)
    const max = Math.max(...values)
    const spread = max - min || 1

    return values
      .map((value, index) => {
        const x = 3 + index / (values.length - 1) * 94
        const y = 23 - ((value - min) / spread) * 18
        return `${x},${y}`
      })
      .join(' ')
  }

  return (
    <div className="health-body-map">
      <div className="health-body-map-intro">
        <div>
          <strong>
            {fa ? 'نقشه اندازه‌های بدن' : 'Body Measurement Map'}
          </strong>
          <p>
            {fa
              ? 'تغییرات هر ناحیه را جداگانه دنبال کن'
              : 'Track the progress of each body area independently'}
          </p>
        </div>

        <span className="health-body-map-badge">
          {fa ? '۵ ناحیه' : '5 AREAS'}
        </span>
      </div>

      <div className="health-body-map-visual">
        <svg
          viewBox="0 0 280 310"
          role="img"
          aria-label={fa ? 'نقشه اندازه‌های بدن' : 'Body measurement map'}
        >
          <defs>
            <linearGradient id="body-map-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--label-3)" stopOpacity=".24" />
              <stop offset="100%" stopColor="var(--label-3)" stopOpacity=".07" />
            </linearGradient>
          </defs>

          {/* Body silhouette */}
          <circle
            cx="140"
            cy="27"
            r="18"
            fill="url(#body-map-fill)"
            stroke="var(--label-3)"
            strokeOpacity=".55"
            strokeWidth="1.5"
          />

          <path
            d="
              M125 49
              C115 53 101 58 91 65
              C80 73 76 91 72 111
              L58 157
              C56 164 60 169 66 170
              C72 171 76 167 79 159
              L96 117
              L103 151
              L99 194
              C98 205 103 211 113 212
              L119 270
              C120 282 127 287 133 284
              C139 281 138 273 138 265
              L140 218
              L142 265
              C142 273 141 281 147 284
              C153 287 160 282 161 270
              L167 212
              C177 211 182 205 181 194
              L177 151
              L184 117
              L201 159
              C204 167 208 171 214 170
              C220 169 224 164 222 157
              L208 111
              C204 91 200 73 189 65
              C179 58 165 53 155 49
              Z
            "
            fill="url(#body-map-fill)"
            stroke="var(--label-3)"
            strokeOpacity=".55"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Measurement rings */}
          {measurements.map(item => (
            <g key={item.key}>
              <ellipse
                cx="140"
                cy={item.y}
                rx={item.key === 'arm' ? 65 : item.key === 'leg' ? 35 : 48}
                ry={item.key === 'leg' ? 7 : 9}
                fill="none"
                stroke={item.color}
                strokeWidth="2.5"
                strokeDasharray="4 3"
                opacity=".95"
              />
              <circle
                cx="140"
                cy={item.y}
                r="3.5"
                fill={item.color}
              />
            </g>
          )}

          <text
            x="140"
            y="305"
            fill="var(--label-3)"
            fontSize="8"
            textAnchor="middle"
          >
            {fa ? 'نمای شماتیک بدن' : 'BODY REFERENCE'}
          </text>
        </svg>
      </div>

      <div className="health-body-map-grid">
        {measurements.map(metric => {
          const history = getHistory(metric.key)
          const latest = history[history.length - 1]
          const previous = history.length > 1
            ? history[history.length - 2]
            : null

          const currentValue = latest
            ? Number(latest[metric.key])
            : null

          const delta = latest && previous
            ? currentValue - Number(previous[metric.key])
            : null

          const sparkPoints = history
            .slice(-8)
            .map(item => ({
              date: item.date,
              value: Number(item[metric.key])
            }))

          return (
            <div
              className="health-body-map-metric"
              key={metric.key}
              style={{
                '--body-metric-color': metric.color
              }}
            >
              <div className="health-body-map-metric-heading">
                <span className="health-body-map-dot" />
                <strong>{metric.title}</strong>
                <small>cm</small>
              </div>

              <div className="health-body-map-metric-value">
                <strong>
                  {currentValue !== null ? fmt(currentValue) : '—'}
                </strong>

                {delta !== null && (
                  <span className={
                    delta > 0 ? 'increase' :
                    delta < 0 ? 'decrease' : 'unchanged'
                  }>
                    {delta > 0 ? '+' : ''}
                    {fmt(delta)}
                  </span>
                )}
              </div>

              {sparkPoints.length > 1 ? (
                <svg
                  className="health-body-map-sparkline"
                  viewBox="0 0 100 28"
                  preserveAspectRatio="none"
                  aria-label={`${metric.title} trend`}
                >
                  <polyline
                    points={getSparkline(sparkPoints)}
                    fill="none"
                    stroke={metric.color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <div className="health-body-map-no-trend">
                  {fa ? 'برای نمایش روند، ثبت بیشتری لازم است' : 'More records needed for trend'}
                </div>
              )}

              <div className="health-body-map-metric-date">
                {latest
                  ? fmtDateFull(latest.date, calendar)
                  : (fa ? 'هنوز ثبت نشده' : 'Not recorded yet')}
              </div>
            </div>
          )
        })}
      </div>

      <p className="health-body-map-footnote">
        {fa
          ? 'تغییر هر اندازه فقط با ثبت قبلی همان ناحیه مقایسه می‌شود.'
          : 'Each measurement is compared only with its own previous record.'}
      </p>
    </div>
  )
}

function ReviewValue({
  label,
  current,
  previous,
  unit = '',
  fa,
  accent = '#8b5cf6'
}) {
  const hasBoth = numeric(current) && numeric(previous)

  const delta = hasBoth
    ? Number(current) - Number(previous)
    : null

  return (
    <div
      className="health-analytics-review-value"
      style={{
        background: `color-mix(in srgb, ${accent} 16%, var(--surface-2))`,
        borderColor: `color-mix(in srgb, ${accent} 45%, var(--sep))`
      }}
    >
      <div className="health-analytics-review-top">
        <span>{label}</span>

        {delta !== null && (
          <span className={`health-analytics-review-change ${
            delta > 0 ? 'up' : delta < 0 ? 'down' : 'same'
          }`}>
            {delta > 0 ? '↑' : delta < 0 ? '↓' : '–'}
            {' '}
            {delta > 0 ? '+' : ''}
            {fmt(delta)}
          </span>
        )}
      </div>

      <div className="health-analytics-review-current">
        <strong>
          {numeric(current) ? fmt(Number(current)) : '—'}
        </strong>
        {unit && <small>{unit}</small>}
      </div>

      <div className="health-analytics-review-previous">
        {delta === null
          ? (fa
              ? 'برای مقایسه به دو ارزیابی نیاز است'
              : 'Two check-ins needed to compare')
          : `${fa ? 'مقدار قبلی' : 'Previous'}: ${fmt(Number(previous))} ${unit}`}
      </div>
    </div>
  )
}


export default function HealthAnalytics() {
  useLang()

  const fa = getLang() === 'fa'
  const calendar = useStore(s => s.S?.calendar === 'jalali' ? 'jalali' : 'gregorian')
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

  const bodyweight = useStore(s =>
  Array.isArray(s.S.bodyweight) ? s.S.bodyweight : []
)

  const bodyProfile = useStore(s => s.S.bodyProfile || {})
  const weightUnit = useStore(s => s.S.unit || 'kg')
  const bodySex = bodyProfile.sex || useStore(s => s.S.body) || 'male'
  const bodyHeight = positiveNumber(bodyProfile.heightCm)
  
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

  const bodyCompositionTrends = useMemo(() => {
  const byDate = new Map()

  // Full body-weight history
  ;[...bodyweight]
    .filter(item => item.d && positiveNumber(item.w))
    .sort((a, b) =>
      (a.d || '').localeCompare(b.d || '') ||
      Number(a.t || 0) - Number(b.t || 0)
    )
    .forEach(item => {
      const kg = weightUnit === 'lb'
        ? Number(item.w) / 2.20462262
        : Number(item.w)

      byDate.set(item.d, {
        date: item.d,
        weight: kg
      })
    })

  // Weekly check-ins and body-fat estimates
  sortedCheckIns.forEach(item => {
    if (!item.date) return

    const previous = byDate.get(item.date) || {}

    const weight = positiveNumber(item.weight)
     ?? previous.weight
     ?? null

    const waist = positiveNumber(item.waist)

    const bfp = calculateNavyBodyFat({
      sex: bodySex,
      height: bodyHeight,
      waist,
      neck: positiveNumber(item.neck),
      hip: positiveNumber(item.hip)
    })

    const fatMass = bfp != null && weight != null
      ? weight * bfp / 100
      : null

    byDate.set(item.date, {
      ...previous,
      date: item.date,
      weight,
      waist,
      bfp,
      fatMass,
      leanMass: fatMass != null && weight != null
        ? weight - fatMass
        : null,
      waistHeight: waist != null && bodyHeight
        ? waist / bodyHeight
        : null
    })
  })

  return [...byDate.values()]
    .filter(item => dateValue(item.date) >= cutoff)
    .sort((a, b) => a.date.localeCompare(b.date))
}, [
  bodyweight,
  sortedCheckIns,
  weightUnit,
  bodySex,
  bodyHeight,
  cutoff
])
  
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
    const today = new Date(`${localToday()}T12:00:00`)

    // Start from the selected date range.
    const rangeStart = new Date(today)

    if (range !== 'all') {
      rangeStart.setDate(rangeStart.getDate() - Number(range))
    } else {
      rangeStart.setDate(rangeStart.getDate() - 11 * 7)
    }

    // Align both ends to Monday.
    const startWeek = new Date(rangeStart)
    startWeek.setDate(
      startWeek.getDate() - ((startWeek.getDay() + 6) % 7)
    )

    const currentWeek = new Date(today)
    currentWeek.setDate(
      currentWeek.getDate() - ((currentWeek.getDay() + 6) % 7)
    )

    // Keep the chart limited to the latest 12 calendar weeks.
    const earliestVisibleWeek = new Date(currentWeek)
    earliestVisibleWeek.setDate(
      earliestVisibleWeek.getDate() - 11 * 7
    )

    if (startWeek < earliestVisibleWeek) {
      startWeek.setTime(earliestVisibleWeek.getTime())
    }

    const weeks = new Map()

    // Create every calendar week, including weeks with zero workouts.
    const cursor = new Date(startWeek)

    while (cursor <= currentWeek) {
      const key = [
        cursor.getFullYear(),
        String(cursor.getMonth() + 1).padStart(2, '0'),
        String(cursor.getDate()).padStart(2, '0')
      ].join('-')

      weeks.set(key, {
        date: key,
        volume: 0,
        sets: 0,
        sessions: 0
      })

      cursor.setDate(cursor.getDate() + 7)
    }

    // Add recorded workout data to its corresponding week.
    filteredWorkouts.forEach(w => {
      if (!w.d) return

      const date = new Date(`${w.d}T12:00:00`)
      if (Number.isNaN(date.getTime())) return

      const weekday = (date.getDay() + 6) % 7
      date.setDate(date.getDate() - weekday)

      const key = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0')
      ].join('-')

      const item = weeks.get(key)
      if (!item) return

      item.volume += workoutVolume(w)
      item.sets += setsDone(w)
      item.sessions += 1
    })

    return [...weeks.values()]
  }, [filteredWorkouts, range])

  const latest = [...filteredCheckIns].reverse()
  const current = latest[0]
  const previous = latest[1]

 const metrics = [
  {
    key: 'stress',
    title: tx('Stress level', 'سطح استرس'),
    unit: '/5',
    accent: '#f87171'
  },
  {
    key: 'energy',
    title: tx('Energy', 'انرژی'),
    unit: '/5',
    accent: '#facc15'
  }
]
 
const weeklyLogCounts = useMemo(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayTime = today.getTime()
  const weekday = (today.getDay() + 6) % 7
  const currentWeekStart = todayTime - weekday * DAY

  return Array.from({ length: 8 }, (_, index) => {
    const start = currentWeekStart - (7 - index) * 7 * DAY
    const end = start + 7 * DAY

    const count = doseLogs.filter(item => {
      const date = dateValue(item.date)
      return date >= start && date < end
    }).length

    const date = new Date(start)
    const dateISO = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-')
    const label = fmtDateFull(dateISO, calendar)

    return {
      label,
      count,
      start,
      end
    }
  })
}, [doseLogs, calendar])

const maxWeeklyLogs = Math.max(
  1,
  ...weeklyLogCounts.map(item => item.count)
)

const activeEffects =
  filteredEffects.filter(item => item.status !== 'resolved')

const resolvedEffects =
  filteredEffects.filter(item => item.status === 'resolved')

const severeEffects =
  activeEffects.filter(item => item.severity === 'severe').length

const effectSeverityCounts = {
  mild: filteredEffects.filter(item => item.severity === 'mild').length,
  moderate: filteredEffects.filter(item => item.severity === 'moderate').length,
  severe: filteredEffects.filter(item => item.severity === 'severe').length,
  other: filteredEffects.filter(item =>
    !['mild', 'moderate', 'severe'].includes(item.severity)
  ).length
}

const recentEffects = [...filteredEffects]
  .sort((a, b) =>
    (b.date || '').localeCompare(a.date || '') ||
    (b.createdAt || '').localeCompare(a.createdAt || '')
  )
  .slice(0, 4)


  const activeProtocols =
    protocols.filter(item => item.status === 'active').length

  const exportCsv = () => {
const headers = [
  'date',
  'weight_kg',
  'waist_cm',
  'neck_cm',
  'hip_cm',
  'chest_cm',
  'arm_cm',
  'leg_cm',
  'stress',
  'energy',
  'training',
  'notes'
]

    const rows = filteredCheckIns.map(item =>
      headers.map(key => {
const value = ({
  date: item.date,
  weight_kg: item.weight,
  waist_cm: item.waist,
  neck_cm: item.neck,
  hip_cm: item.hip,
  chest_cm: item.chest,
  arm_cm: item.arm,
  leg_cm: item.leg,
  stress: item.stress,
  energy: item.energy,
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

.health-analytics-nav {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin: 18px 0;
}

.health-analytics-nav a {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 48px;
  padding: 9px 5px;
  border: 1px solid var(--sep);
  border-radius: 13px;
  background: var(--surface-2);
  color: var(--label-2);
  font-size: 11px;
  font-weight: 650;
  text-align: center;
  text-decoration: none;
  line-height: 1.5;
  transition: .2s ease;
}

.health-analytics-nav a:active {
  border-color: var(--green);
  color: var(--green);
  transform: scale(.97);
}

.health-analytics-section[id] {
  scroll-margin-top: 18px;
}

@media(max-width: 380px) {
  .health-analytics-nav {
    gap: 5px;
  }

  .health-analytics-nav a {
    font-size: 10px;
    padding: 8px 3px;
  }
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
  padding: 14px;
  border: 1px solid var(--sep);
  border-radius: 15px;
  background: var(--surface-2);
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.health-analytics-review-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.health-analytics-review-top > span:first-child {
  color: var(--label-2);
  font-size: 11px;
  font-weight: 600;
}

.health-analytics-review-change {
  flex-shrink: 0;
  padding: 4px 7px;
  border-radius: 7px;
  background: var(--bg);
  font-size: 10px;
  font-weight: 700;
  direction: ltr;
}

.health-analytics-review-change.up,
.health-analytics-review-change.down {
  color: var(--label-2);
}

.health-analytics-review-change.same {
  color: var(--label-3);
}

.health-analytics-review-current {
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.health-analytics-review-current strong {
  color: var(--label);
  font-size: 27px;
  line-height: 1.2;
  font-weight: 750;
}

.health-analytics-review-current small {
  color: var(--label-3);
  font-size: 11px;
}

.health-analytics-review-previous {
  padding-top: 8px;
  border-top: 1px solid var(--sep);
  color: var(--label-3);
  font-size: 10px;
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

.health-analytics-bar-count {
  color: var(--label-2);
  font-size: 10px;
  font-weight: 650;
  font-variant-numeric: tabular-nums;
}

.health-analytics-bar {
  width: 100%;
  max-width: 28px;
  min-height: 2px;
  border-radius: 7px 7px 3px 3px;
  background: linear-gradient(
    180deg,
    var(--green),
    color-mix(in srgb, var(--green) 55%, transparent)
  );
  transition: height .25s ease;
}

health-analytics-bar-wrap small {
  color: var(--label-3);
  font-size: 8px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}


        .health-analytics-note {
          font-size: 11px;
          line-height: 1.65;
          margin-top: 12px;
        }

.health-analytics-effects-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;
  margin: 12px 0 18px;
}

.health-analytics-effects-summary > div {
  min-width: 0;
  padding: 13px;
  border: 1px solid var(--sep);
  border-radius: 13px;
  background: var(--surface-2);
}

.health-analytics-effects-summary span {
  display: block;
  color: var(--label-3);
  font-size: 11px;
}

.health-analytics-effects-summary strong {
  display: block;
  margin-top: 7px;
  color: var(--label);
  font-size: 23px;
}

health-analytics-effects-breakdown {
  padding: 14px;
  border: 1px solid var(--sep);
  border-radius: 14px;
  background: var(--surface-2);
}

health-analytics-effects-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 13px;
}

health-analytics-effects-heading strong {
  color: var(--label);
  font-size: 12px;
}

health-analytics-effects-heading > span {
  color: var(--label-3);
  font-size: 10px;
}

health-analytics-effects-bar {
  display: flex;
  width: 100%;
  height: 11px;
  overflow: hidden;
  border-radius: 20px;
  background: var(--bg);
}

health-analytics-effects-bar > div {
  min-width: 2px;
  transition: width .25s ease;
}

health-analytics-effects-bar .mild,
health-analytics-effects-legend i.mild {
  background: #38bdf8;
}

health-analytics-effects-bar .moderate,
health-analytics-effects-legend i.moderate {
  background: #f59e0b;
}

health-analytics-effects-bar .severe,
health-analytics-effects-legend i.severe {
  background: #ef4444;
}

health-analytics-effects-bar .other,
health-analytics-effects-legend i.other {
  background: #94a3b8;
}

health-analytics-effects-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 18px;
  margin-top: 13px;
}

health-analytics-effects-legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--label-2);
  font-size: 10px;
}

health-analytics-effects-legend i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

health-analytics-effects-legend strong {
  color: var(--label);
}

health-analytics-effects-recent {
  margin-top: 20px;
}

health-analytics-effect-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--sep);
}

health-analytics-effect-row > div:first-child {
  min-width: 0;
}

health-analytics-effect-row > div:first-child strong,
.health-analytics-effect-row > div:first-child small {
  display: block;
  overflow-wrap: anywhere;
}

.health-analytics-effect-row > div:first-child strong {
  color: var(--label);
  font-size: 12px;
}

.health-analytics-effect-row > div:first-child small {
  margin-top: 5px;
  color: var(--label-3);
  font-size: 10px;
}

.health-analytics-effect-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 5px;
  flex-shrink: 0;
}

.health-analytics-effect-tags span {
  padding: 4px 7px;
  border-radius: 7px;
  background: var(--bg);
  color: var(--label-2);
  font-size: 9px;
  white-space: nowrap;
}

.health-analytics-effect-tags .severity-mild {
  color: #38bdf8;
}

.health-analytics-effect-tags .severity-moderate {
  color: #d99a28;
}

.health-analytics-effect-tags .severity-severe {
  color: #ef4444;
}

.health-analytics-effect-tags .active {
  color: var(--orange, #d58b35);
}

.health-analytics-effect-tags .resolved {
  color: var(--green);
}

@media(max-width:600px) {
  .health-analytics-effects-summary {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .health-analytics-effect-row {
    align-items: flex-start;
  }
}

@media(max-width:380px) {
  .health-analytics-effect-row {
    flex-direction: column;
  }

  .health-analytics-effect-tags {
    justify-content: flex-start;
  }
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

health-analytics-trend-footer {
  padding-top: 9px;
  border-top: 1px solid var(--sep);
  color: var(--label-3);
  font-size: 10px;
}

health-analytics-trend-expand {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--trend-accent);
  font-weight: 650;
  white-space: nowrap;
}

health-analytics-trend-chevron {
  display: inline-block;
  font-size: 15px;
  transition: transform .2s ease;
}

health-analytics-trend-card[open] .health-analytics-trend-chevron {
  transform: rotate(180deg);
}

health-analytics-trend-details {
  padding: 0 14px 14px;
  border-top: 1px solid var(--sep);
}

health-analytics-trend-comparison {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
  margin-top: 13px;
}

health-analytics-trend-comparison > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
  padding: 10px;
  border-radius: 11px;
  background: var(--bg);
}

health-analytics-trend-comparison span,
health-analytics-trend-comparison small {
  color: var(--label-3);
  font-size: 10px;
}

health-analytics-trend-comparison strong {
  color: var(--label);
  font-size: 15px;
}

health-analytics-trend-detail-chart {
  display: block;
  width: 100%;
  height: auto;
  margin: 12px 0;
  overflow: visible;
}

health-analytics-trend-history {
  display: flex;
  flex-direction: column;
  gap: 0;
}

health-analytics-trend-history > strong {
  margin-bottom: 8px;
  color: var(--label-2);
  font-size: 11px;
}

health-analytics-trend-history > div {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 0;
  border-top: 1px solid var(--sep);
  font-size: 11px;
}

health-analytics-trend-history > div span {
  color: var(--label-3);
}

health-analytics-trend-history > div strong {
  color: var(--label);
}

health-analytics-training-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;
  margin: 12px 0 16px;
}

health-analytics-training-summary > div {
  min-width: 0;
  border: 1px solid var(--sep);
  border-radius: 13px;
  padding: 12px;
  background: var(--surface-2);
}

health-analytics-training-summary span {
  display: block;
  color: var(--label-3);
  font-size: 11px;
}

health-analytics-training-summary strong {
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

      <header className="health-header">
        <div>
          <div className="health-title-row">
            <h1>
              {tx(
                'Analytics & Insights',
                'تحلیل و بینش ها '
              )}
            </h1>

            <button
              type="button"
              className="health-secondary health-back"
              onClick={() => nav('/health')}
            >
              {tx('‹ Back', '‹ بازگشت')}
            </button>
          </div>

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
    ['30', tx('Month', 'ماه')],
    ['90', tx('3 Mos', '۳ ماه')],
    ['180', tx('6 Mos', '۶ ماه')],
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

      <nav className="health-analytics-nav">
  <a href="#body-composition-trends">
    {tx('Body', 'ترکیب بدن')}
  </a>

  <a href="#training-overview">
    {tx('Training', 'تمرین')}
  </a>

  <a href="#health-recovery">
    {tx('Recovery', 'سلامت')}
  </a>

  <a href="#protocol-overview">
    {tx('Protocols', 'پروتکل‌ها')}
  </a>
</nav>
      
      <section id="health-recovery" className="health-card health-analytics-section">
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
              {tx('Latest check-in:', 'آخرین ارزیابی:')} {fmtDateFull(current.date, calendar)}

              {previous
                ? ` · ${tx('Compared with', 'در مقایسه با')} ${fmtDateFull(previous.date, calendar)}`
                : ''}
            </p>

<div className="health-analytics-review-grid">
  <ReviewValue
    label={tx('Body weight', 'وزن بدن')}
    current={current.weight}
    previous={previous?.weight}
    unit="kg"
    fa={fa}
    accent="#38bdf8"
  />

  <ReviewValue
    label={tx('Waist', 'دور کمر')}
    current={current.waist}
    previous={previous?.waist}
    unit="cm"
    fa={fa}
    accent="#f59e0b"
  />

  <ReviewValue
    label={tx('Chest', 'دور سینه')}
    current={current.chest}
    previous={previous?.chest}
    unit="cm"
    fa={fa}
    accent="#fb923c"
  />

    <ReviewValue
    label={tx('Neck', 'دور گردن')}
    current={current.neck}
    previous={previous?.neck}
    unit="cm"
    fa={fa}
    accent="#38bdf8"
  />

  <ReviewValue
    label={tx('Hip', 'دور هیپ')}
    current={current.hip}
    previous={previous?.hip}
    unit="cm"
    fa={fa}
    accent="#f472b6"
  />
  
  <ReviewValue
    label={tx('Arm', 'دور بازو')}
    current={current.arm}
    previous={previous?.arm}
    unit="cm"
    fa={fa}
    accent="#a78bfa"
  />

  <ReviewValue
    label={tx('Leg', 'دور پا')}
    current={current.leg}
    previous={previous?.leg}
    unit="cm"
    fa={fa}
    accent="#2dd4bf"
  />

  <ReviewValue
    label={tx('Stress', 'استرس')}
    current={current.stress}
    previous={previous?.stress}
    unit="/5"
    fa={fa}
    accent="#f87171"
  />

  <ReviewValue
    label={tx('Energy', 'انرژی')}
    current={current.energy}
    previous={previous?.energy}
    unit="/5"
    fa={fa}
    accent="#facc15"
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

      
<section id="body-composition-trends" className="health-card health-analytics-section">
  <h3>{tx('Body Composition Trends', 'روند ترکیب بدن')}</h3>

  <p className="health-muted">
    {tx(
      'Track changes in body weight, fat percentage and body composition.',
      'تغییرات وزن، درصد چربی و ترکیب بدن را دنبال کن.'
    )}
  </p>

  {bodyCompositionTrends.length === 0 ? (
    <p className="health-muted">
      {tx(
        'No body composition records in this period.',
        'در این بازه داده‌ای برای ترکیب بدن ثبت نشده است.'
      )}
    </p>
  ) : (
    <div className="health-analytics-charts">

<AreaTrendChart
  title={tx('Body weight', 'وزن بدن')}
  unit="kg"
  accent="#38bdf8"
  data={bodyCompositionTrends.map(item => ({
    date: item.date,
    value: item.weight
  }))}
  emptyText={tx('No weight data available.', 'داده وزن موجود نیست.')}
  fa={fa}
  calendar={calendar}
/>

<LineTrendChart
  title={tx('Body fat percentage', 'درصد چربی بدن')}
  unit="%"
  accent="#f59e0b"
  data={bodyCompositionTrends.map(item => ({
    date: item.date,
    value: item.bfp
  }))}
  emptyText={tx(
    'Complete waist, neck and height measurements are needed.',
    'برای محاسبه، اندازه‌های کامل دور کمر، گردن و قد لازم است.'
  )}
  fa={fa}
  calendar={calendar}
/>

<WeeklyBarChart
  title={tx('Waist circumference', 'دور کمر')}
  unit="cm"
  accent="#fb923c"
  rangeScale
  data={bodyCompositionTrends.map(item => ({
    date: item.date,
    value: item.waist
  }))}
  emptyText={tx(
    'No waist data available.',
    'داده دور کمر موجود نیست.'
  )}
  fa={fa}
  calendar={calendar}
/>

<BodyCompositionStackedChart
  title={tx('Fat & Lean Mass', 'توده چربی و بدون چربی')}
  data={bodyCompositionTrends}
  emptyText={tx(
    'Body weight and body fat measurements are needed.',
    'برای نمایش، ثبت وزن و درصد چربی بدن لازم است.'
  )}
  fa={fa}
  calendar={calendar}
/> 
    </div>
  )}
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
<>
  <BodyMeasurementsMap
    data={filteredCheckIns}
    fa={fa}
    calendar={calendar}
  />

  <div className="health-analytics-charts">
    {metrics.map(metric => (
      <TrendChart
        key={metric.key}
        title={metric.title}
        unit={metric.unit}
        fa={fa}
        calendar={calendar}
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
</>
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

{weeklyLogCounts.map(item => (
  <div
    className="health-analytics-bar-wrap"
    key={item.label}
    title={`${item.count} entries`}
  >
    <span className="health-analytics-bar-count">
      {item.count}
    </span>

    <div
      className="health-analytics-bar"
      style={{
        height: `${Math.max(
          2,
          item.count / maxWeeklyLogs * 82
        )}px`
      }}
    />

    <small>{item.label}</small>
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


<section id="protocol-overview" className="health-card health-analytics-section">
  <h3>{tx('Side-effect overview', 'نمای کلی عوارض جانبی')}</h3>

  <div className="health-analytics-effects-summary">
    <div>
      <span>{tx('Active', 'فعال')}</span>
      <strong>{activeEffects.length}</strong>
    </div>

    <div>
      <span>{tx('Resolved', 'برطرف‌شده')}</span>
      <strong>{resolvedEffects.length}</strong>
    </div>

    <div>
      <span>{tx('Severe ongoing', 'شدید و فعال')}</span>
      <strong>{severeEffects}</strong>
    </div>
  </div>

  <div className="health-analytics-effects-breakdown">
    <div className="health-analytics-effects-heading">
      <strong>{tx('Severity distribution', 'توزیع شدت عوارض')}</strong>
      <span>{filteredEffects.length} {tx('records', 'ثبت')}</span>
    </div>

    {filteredEffects.length > 0 ? (
      <>
        <div className="health-analytics-effects-bar">
          {effectSeverityCounts.mild > 0 && (
            <div
              className="mild"
              style={{
                width: `${effectSeverityCounts.mild / filteredEffects.length * 100}%`
              }}
            />
          )}

          {effectSeverityCounts.moderate > 0 && (
            <div
              className="moderate"
              style={{
                width: `${effectSeverityCounts.moderate / filteredEffects.length * 100}%`
              }}
            />
          )}

          {effectSeverityCounts.severe > 0 && (
            <div
              className="severe"
              style={{
                width: `${effectSeverityCounts.severe / filteredEffects.length * 100}%`
              }}
            />
          )}

          {effectSeverityCounts.other > 0 && (
            <div
              className="other"
              style={{
                width: `${effectSeverityCounts.other / filteredEffects.length * 100}%`
              }}
            />
          )}
        </div>

        <div className="health-analytics-effects-legend">
          <span>
            <i className="mild" />
            {tx('Mild', 'خفیف')}
            <strong>{effectSeverityCounts.mild}</strong>
          </span>

          <span>
            <i className="moderate" />
            {tx('Moderate', 'متوسط')}
            <strong>{effectSeverityCounts.moderate}</strong>
          </span>

          <span>
            <i className="severe" />
            {tx('Severe', 'شدید')}
            <strong>{effectSeverityCounts.severe}</strong>
          </span>

          {effectSeverityCounts.other > 0 && (
            <span>
              <i className="other" />
              {tx('Other / unspecified', 'سایر / نامشخص')}
              <strong>{effectSeverityCounts.other}</strong>
            </span>
          )}
        </div>
      </>
    ) : (
      <p className="health-muted">
        {tx('No records to classify.', 'موردی برای دسته‌بندی وجود ندارد.')}
      </p>
    )}
  </div>

  <div className="health-analytics-effects-recent">
    <div className="health-analytics-effects-heading">
      <strong>{tx('Recent records', 'آخرین عوارض ثبت‌شده')}</strong>
    </div>

    {recentEffects.length === 0 ? (
      <p className="health-muted">
        {tx(
          'No side-effect records in this period.',
          'در این بازه عارضه‌ای ثبت نشده است.'
        )}
      </p>
    ) : (
      recentEffects.map(item => (
        <div
          className="health-analytics-effect-row"
          key={item.id}
        >
          <div>
            <strong>{item.symptom || tx('Unspecified symptom', 'علامت نامشخص')}</strong>

            <small>
              {item.date ? fmtDateFull(item.date, calendar) : '—'}
              {item.compoundName ? ` · ${item.compoundName}` : ''}
            </small>
          </div>

          <div className="health-analytics-effect-tags">
            <span className={`severity-${item.severity || 'other'}`}>
              {{
                mild: tx('Mild', 'خفیف'),
                moderate: tx('Moderate', 'متوسط'),
                severe: tx('Severe', 'شدید')
              }[item.severity] || tx('Unspecified', 'نامشخص')}
            </span>

            <span className={item.status === 'resolved' ? 'resolved' : 'active'}>
              {item.status === 'resolved'
                ? tx('Resolved', 'برطرف‌شده')
                : tx('Active', 'فعال')}
            </span>
          </div>
        </div>
      ))
    )}
  </div>

  <p className="health-muted health-analytics-note">
    {tx(
      'Recorded symptoms do not establish a causal relationship with any protocol or compound. Seek professional medical assessment for concerning symptoms.',
      'ثبت علائم، رابطه علت و معلولی با هیچ پروتکل یا ترکیبی را اثبات نمی‌کند. برای علائم نگران‌کننده ارزیابی پزشکی دریافت کنید.'
    )}
  </p>
</section>

      <section id="training-overview" className="health-card health-analytics-section">
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

<WeeklyBarChart
  title={tx('Training volume', 'حجم تمرین')}
  unit={`${weightUnit} × reps`}
  data={weeklyTraining.map(w => ({
    date: w.date,
    value: w.volume
  }))}
  emptyText={tx(
    'At least two weeks of data are needed.',
    'برای نمایش روند حداقل دو هفته داده لازم است.'
  )}
  fa={fa}
  calendar={calendar}
  accent="#8b5cf6"
/>

<WeeklyBarChart
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
  calendar={calendar}
  accent="#0d9488"
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
              calendar={calendar}
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
