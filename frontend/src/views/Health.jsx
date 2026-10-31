
import { useEffect, useMemo, useRef, useState } from 'react'
import { directionFor, getLang, t, useLang } from '../lib/i18n.js'
import { extractPdfText, parseLabReportText } from '../lib/lab-pdf.js'
import './health.css'
import { useStore } from '../store/useStore.js'

const KEY = 'opengym.health.reports.v1'

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

const write = x => localStorage.setItem(KEY, JSON.stringify(x))

const statusOf = x => {
  if (x.status && x.status !== 'unknown') return x.status

  const n = Number(x.value)
  if (!Number.isFinite(n) || x.value === '') return 'unknown'

  if (x.refLow !== '' && x.refLow != null && n < Number(x.refLow)) return 'low'
  if (x.refHigh !== '' && x.refHigh != null && n > Number(x.refHigh)) return 'high'

  if (
    (x.refLow !== '' && x.refLow != null) ||
    (x.refHigh !== '' && x.refHigh != null)
  ) return 'normal'

  return 'unknown'
}
function numericValue(value) {
  if (value === '' || value == null) return null
  const n = Number(String(value).trim())
  return Number.isFinite(n) ? n : null
}

function referenceRange(item) {
  const low = item.refLow !== '' && item.refLow != null ? item.refLow : '—'
  const high = item.refHigh !== '' && item.refHigh != null ? item.refHigh : '—'
  if (low === '—' && high === '—') return '—'
  return `${low} – ${high} ${item.unit || ''}`.trim()
}

function TrendChart({ points, tx }) {
  const width = 640
  const height = 250
  const left = 54
  const right = 18
  const top = 18
  const bottom = 48

  const values = points.map(p => p.value)
  let min = Math.min(...values)
  let max = Math.max(...values)

  if (min === max) {
    const pad = Math.abs(min) * 0.1 || 1
    min -= pad
    max += pad
  } else {
    const pad = (max - min) * 0.12
    min -= pad
    max += pad
  }

  const x = i => left + (i / Math.max(points.length - 1, 1)) * (width - left - right)
  const y = v => top + ((max - v) / (max - min)) * (height - top - bottom)

  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p.value)}`)
    .join(' ')

  const ticks = Array.from({ length: 5 }, (_, i) => max - (i / 4) * (max - min))

  return (
    <div className="health-chart-wrap">
      <svg
        className="health-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={tx('Lab result trend chart', 'نمودار روند نتایج آزمایش')}
      >
        {ticks.map((v, i) => (
          <g key={i}>
            <line
              className="health-chart-grid"
              x1={left}
              x2={width - right}
              y1={y(v)}
              y2={y(v)}
            />
            <text
              className="health-chart-label"
              x={left - 8}
              y={y(v) + 4}
              textAnchor="end"
            >
              {Number(v.toFixed(2))}
            </text>
          </g>
        ))}

        <path className="health-chart-line" d={path} />

        {points.map((p, i) => (
          <g key={p.itemKey}>
            <circle
              className="health-chart-point"
              cx={x(i)}
              cy={y(p.value)}
              r="5"
            />
            <text
              className="health-chart-label"
              x={x(i)}
              y={height - 22}
              textAnchor="middle"
            >
              {(p.reportDate || '').slice(0, 10)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
export default function Health() {
  // Subscribe to the app's language changes
  useLang()

  const lang = getLang()
  const dir = directionFor(lang)
  const isFa = lang === 'fa'

  // Persian text for this page; other languages use the app translation system.
  const tx = (english, persian) => isFa ? persian : t(english)

  const statusLabels = {
    normal: tx('In range', 'در محدوده'),
    low: tx('Low', 'پایین'),
    high: tx('High', 'بالا'),
    unknown: tx('Needs review', 'نیازمند بررسی')
  }
  
  const input = useRef(null)

  const reports = useStore(s => s.S.labReports || [])
  const updateStore = useStore(s => s.update)
  const [draft, setDraft] = useState(null)
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const all = useMemo(
    () => reports.flatMap(r =>
      (r.items || []).map((x, i) => ({
        ...x,
        reportId: r.id,
        reportDate: r.date,
        reportName: r.name,
        itemKey: r.id + '-' + i
      }))
    ),
    [reports]
  )

  const filtered = all.filter(x =>
    (x.name + ' ' + x.unit + ' ' + x.value)
      .toLowerCase()
      .includes(query.toLowerCase())
  )

  const groups = filtered.reduce((a, x) => {
    (a[x.reportDate || tx('Unknown date', 'تاریخ نامشخص')] ||= []).push(x)
    return a
  }, {})

  async function importPdf(file) {
    if (!file) return

    setError('')
    setNotice('')

    if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
      setError(tx('Please select a PDF file.', 'لطفاً فایل PDF انتخاب کن.'))
      return
    }

    if (file.size > 20 * 1024 * 1024) {
      setError(tx('File size exceeds 20 MB.', 'حجم فایل بیشتر از ۲۰ مگابایت است.'))
      return
    }

    setBusy(true)

    try {
      const text = await extractPdfText(file)
      const parsed = parseLabReportText(text)

      setDraft({
        id: 'r-' + Date.now(),
        name: file.name,
        date: parsed.date || new Date().toISOString().slice(0, 10),
        items: parsed.items,
        rawText: text.slice(0, 30000),
        warnings: parsed.warnings
      })

      setNotice(
        parsed.items.length
          ? tx(
              `${parsed.items.length} preliminary rows found. Review each row against the PDF before saving.`,
              `${parsed.items.length} ردیف اولیه پیدا شد؛ پیش از ذخیره، تک‌تک ردیف‌ها را با PDF تطبیق بده.`
            )
          : tx(
              'No extractable text found. The file may be a scanned image. Nothing has been saved.',
              'متن قابل‌استخراج پیدا نشد؛ فایل ممکن است اسکن تصویری باشد. هیچ نتیجه‌ای ذخیره نشده است.'
            )
      )
    } catch (e) {
      setError(
        tx('Could not read PDF: ', 'خواندن PDF ناموفق بود: ') +
        (e?.message || tx('Unknown error', 'خطای نامشخص'))
      )
    } finally {
      setBusy(false)
    }
  }

  function edit(i, k, v) {
    setDraft(d => ({
      ...d,
      items: d.items.map((x, j) =>
        i === j ? { ...x, [k]: v, status: 'unknown' } : x
      )
    }))
  }

  function addRow() {
    setDraft(d => ({
      ...d,
      items: [
        ...d.items,
        {
          name: '',
          value: '',
          unit: '',
          refLow: '',
          refHigh: '',
          status: 'unknown',
          sourceLine: 'Manually added',
          verified: false
        }
      ]
    }))
  }

  function removeRow(index) {
    setDraft(d => ({
      ...d,
      items: d.items.filter((_, i) => i !== index)
    }))
  }

  function save() {
    const r = {
      id: draft.id,
      name: draft.name,
      date: draft.date || new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
      items: draft.items.map(x => ({
        ...x,
        status: statusOf(x),
        verified: true
      }))
    }

try {
  updateStore(s => {
    s.labReports = [
      r,
      ...(s.labReports || []).filter(x => x.id !== r.id)
    ]
  })

  setDraft(null)
  setNotice(
    tx(
      'Report saved to your app data. It will sync with your account when signed in and online.',
      'گزارش در اطلاعات برنامه ذخیره شد و در صورت ورود به حساب و اتصال اینترنت، همگام‌سازی می‌شود.'
    )
  )
    } catch {
      setError(
        tx(
          'Could not save data in browser storage.',
          'ذخیره‌سازی مرورگر ناموفق بود.'
        )
      )
    }
  }

  function remove(id) {
    if (!confirm(tx('Delete this report?', 'این گزارش حذف شود؟'))) return

updateStore(s => {
  s.labReports = (s.labReports || []).filter(r => r.id !== id)
})
    setSelected(null)
  }

  const statusLabel = item => statusLabels[statusOf(item)]
const selectedHistory = selected
    ? all
        .filter(x =>
          String(x.name || '').trim().toLowerCase() ===
          String(selected.name || '').trim().toLowerCase()
        )
        .map(x => ({ ...x, numeric: numericValue(x.value) }))
        .filter(x => x.numeric !== null)
        .sort((a, b) =>
          (a.reportDate || '').localeCompare(b.reportDate || '')
        )
    : []

  const historyUnits = [...new Set(selectedHistory.map(x => x.unit || ''))]
  const sameUnit = historyUnits.length <= 1

  const chartPoints = sameUnit
    ? selectedHistory.map(x => ({ ...x, value: x.numeric }))
    : []

  const latestTwo = selectedHistory.slice(-2)
  const previousResult = latestTwo.length === 2 ? latestTwo[0] : null
  const latestResult = latestTwo.length === 2 ? latestTwo[1] : null

  const difference = previousResult && latestResult
    ? latestResult.numeric - previousResult.numeric
    : null

  const percentageChange =
    previousResult && previousResult.numeric !== 0
      ? (difference / Math.abs(previousResult.numeric)) * 100
      : null
    // Selected test detail
  if (selected) {
    return (
      <main className="health-page" dir={dir} lang={lang}>
        <button
          className="health-secondary"
          onClick={() => setSelected(null)}
        >
          {tx('‹ Back', '‹ بازگشت')}
        </button>

        <h1>{selected.name}</h1>

        <section className="health-card">
          <div className="health-value">
            {selected.value} <small>{selected.unit}</small>
          </div>

          <span className={'health-badge ' + statusOf(selected)}>
            {statusLabel(selected)}
          </span>

          <p>
            {tx('Date: ', 'تاریخ: ')}
            {selected.reportDate || tx('Unknown', 'نامشخص')}
          </p>

          <p>
            {tx('Reference range: ', 'محدوده مرجع: ')}
            {referenceRange(selected) === '—'
              ? tx('Not specified', 'مشخص نشده')
              : referenceRange(selected)}
          </p>

          <p className="health-warning">
            {tx(
              'This tool is not a medical diagnosis. Check the values against the original report.',
              'این ابزار تشخیص پزشکی نیست. نتایج را با برگه اصلی آزمایش بررسی کن.'
            )}
          </p>
        </section>

        {/* Comparison of the two latest results */}
        <section className="health-card">
          <h2>{tx('Latest comparison', 'مقایسه دو نتیجه آخر')}</h2>

          {latestTwo.length < 2 ? (
            <p className="health-muted">
              {tx(
                'At least two numeric results are needed for comparison.',
                'برای مقایسه، حداقل دو نتیجه عددی لازم است.'
              )}
            </p>
          ) : !sameUnit ? (
            <p className="health-warning">
              {tx(
                'These results have different units and cannot be compared.',
                'واحد این نتایج متفاوت است و قابل مقایسه نیستند.'
              )}
            </p>
          ) : (
            <>
              <div className="health-trend-summary">
                <div>
                  <small>{tx('Previous result', 'نتیجه قبلی')}</small>
                  <b>{previousResult.numeric} {previousResult.unit}</b>
                  <small>{previousResult.reportDate}</small>
                </div>

                <div>
                  <small>{tx('Latest result', 'آخرین نتیجه')}</small>
                  <b>{latestResult.numeric} {latestResult.unit}</b>
                  <small>{latestResult.reportDate}</small>
                </div>

                <div>
                  <small>{tx('Numeric change', 'تغییر عددی')}</small>
                  <b>
                    {difference > 0 ? '+' : ''}
                    {Number(difference.toFixed(3))} {latestResult.unit}
                  </b>
                  <small>
                    {percentageChange === null
                      ? tx('Percentage unavailable', 'درصد تغییر قابل محاسبه نیست')
                      : `${percentageChange > 0 ? '+' : ''}${percentageChange.toFixed(1)}%`}
                  </small>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Trend chart */}
        <section className="health-card">
          <h2>{tx('Trend over time', 'روند تغییرات در طول زمان')}</h2>

          {!sameUnit ? (
            <p className="health-warning">
              {tx(
                'The chart is unavailable because the recorded units differ.',
                'به دلیل تفاوت واحد نتایج ثبت‌شده، نمودار قابل نمایش نیست.'
              )}
            </p>
          ) : chartPoints.length < 2 ? (
            <p className="health-muted">
              {tx(
                'At least two numeric results are needed to draw a trend chart.',
                'برای رسم نمودار روند، حداقل دو نتیجه عددی لازم است.'
              )}
            </p>
          ) : (
            <TrendChart points={chartPoints} tx={tx} />
          )}

          {chartPoints.length > 0 && (
            <p className="health-muted">
              {tx(
                'The chart shows recorded numeric values over time. It does not indicate whether a change is medically good or bad.',
                'نمودار فقط مقادیر عددی ثبت‌شده در طول زمان را نشان می‌دهد و به‌تنهایی خوب یا بد بودن تغییر را مشخص نمی‌کند.'
              )}
            </p>
          )}
        </section>

        {/* Full history */}
        <section className="health-card">
          <h2>{tx('History & reference ranges', 'تاریخچه و محدوده‌های مرجع')}</h2>

          {!selectedHistory.length ? (
            <p className="health-muted">
              {tx('No numeric history found.', 'تاریخچه عددی برای این شاخص پیدا نشد.')}
            </p>
          ) : (
            <div className="health-table-wrap">
              <table className="health-table">
                <thead>
                  <tr>
                    <th>{tx('Date', 'تاریخ')}</th>
                    <th>{tx('Result', 'نتیجه')}</th>
                    <th>{tx('Reference range', 'محدوده مرجع')}</th>
                    <th>{tx('Status', 'وضعیت')}</th>
                  </tr>
                </thead>

                <tbody>
                  {[...selectedHistory].reverse().map(x => (
                    <tr key={x.itemKey}>
                      <td>{x.reportDate || '—'}</td>
                      <td>
                        <b>{x.value} {x.unit}</b>
                      </td>
                      <td>{referenceRange(x)}</td>
                      <td>
                        <span className={'health-badge ' + statusOf(x)}>
                          {statusLabel(x)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    )
  }
  return (
    <main className="health-page" dir={dir} lang={lang}>
      <header className="health-header">
        <div>
          <p className="health-kicker">OPENGYM · HEALTH</p>

          <h1>{tx('Health & Lab Tests', 'سلامت و آزمایش‌ها')}</h1>

          <p className="health-muted">
            {tx(
              'Import a PDF report and review the results before saving.',
              'گزارش PDF را وارد و نتایج را پیش از ذخیره بازبینی کن.'
            )}
          </p>
        </div>

        <button
          className="health-primary"
          disabled={busy}
          onClick={() => input.current?.click()}
        >
          {busy
            ? tx('Reading…', 'در حال خواندن…')
            : tx('+ Upload PDF', '+ بارگذاری PDF')}
        </button>

        <input
          ref={input}
          type="file"
          accept="application/pdf,.pdf"
          hidden
          onChange={e => {
            importPdf(e.target.files?.[0])
            e.target.value = ''
          }}
        />
      </header>

      <div className="health-privacy">
        {tx(
          'Privacy: The PDF itself is not uploaded. Reviewed results are saved in app data and sync with your account when signed in and online.',
'حریم خصوصی: خود فایل PDF بارگذاری نمی‌شود. نتایج بازبینی‌شده در اطلاعات برنامه ذخیره می‌شوند و در صورت ورود به حساب و اتصال اینترنت با حساب همگام‌سازی خواهند شد.'
        )}
      </div>

      {error && <div className="health-alert">{error}</div>}
      {notice && <div className="health-alert">{notice}</div>}

      {/* PDF review and editing */}
      {draft && (
        <section className="health-card">
          <div className="health-row">
            <h2>{tx('Review before saving', 'بازبینی قبل از ذخیره')}</h2>

            <button
              className="health-secondary"
              onClick={() => setDraft(null)}
            >
              {tx('Cancel', 'لغو')}
            </button>
          </div>

          <label>
            {tx('Report date ', 'تاریخ گزارش ')}
            <input
              type="date"
              value={draft.date}
              onChange={e => setDraft({ ...draft, date: e.target.value })}
            />
          </label>

          <p className="health-warning">
            {tx(
              'Extraction is experimental and may not be complete. Check values, decimals, units and reference ranges against the PDF.',
              'استخراج آزمایشی است و تضمین پوشش کامل ندارد. مقدار، اعشار، واحد و محدوده را با PDF تطبیق بده.'
            )}
          </p>

          {draft.warnings.map((w, i) => (
            <p className="health-alert" key={i}>{w}</p>
          ))}

          <button
            type="button"
            className="health-secondary"
            onClick={addRow}
          >
            + {tx('Add row', 'افزودن ردیف')}
          </button>

          <div className="health-table-wrap">
            <table className="health-table">
              <thead>
                <tr>
                  <th>{tx('Name', 'نام')}</th>
                  <th>{tx('Value', 'مقدار')}</th>
                  <th>{tx('Unit', 'واحد')}</th>
                  <th>{tx('Ref. low', 'مرجع پایین')}</th>
                  <th>{tx('Ref. high', 'مرجع بالا')}</th>
                  <th>{tx('Action', 'عملیات')}</th>
                </tr>
              </thead>

              <tbody>
                {draft.items.map((x, i) => (
                  <tr key={i}>
                    {[
                      ['name', tx('Name', 'نام')],
                      ['value', tx('Value', 'مقدار')],
                      ['unit', tx('Unit', 'واحد')],
                      ['refLow', tx('Ref. low', 'مرجع پایین')],
                      ['refHigh', tx('Ref. high', 'مرجع بالا')]
                    ].map(([k, l]) => (
                      <td key={k}>
                        <input
                          aria-label={l}
                          value={x[k] ?? ''}
                          onChange={e => edit(i, k, e.target.value)}
                        />
                      </td>
                    ))}

                    <td>
                      <button
                        type="button"
                        className="health-danger"
                        onClick={() => removeRow(i)}
                      >
                        {tx('Delete', 'حذف')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <details className="health-raw">
            <summary>{tx('Raw text for review', 'متن خام برای بررسی')}</summary>
            <pre>{draft.rawText}</pre>
          </details>

          <button
            className="health-primary"
            disabled={!draft.items.length}
            onClick={save}
          >
            {tx('Save reviewed results', 'ذخیره نتایج بازبینی‌شده')}
          </button>
        </section>
      )}

      {/* Search */}
      <label className="health-search">
        <span>⌕</span>
        <input
          placeholder={tx('Search tests…', 'جست‌وجوی شاخص…')}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </label>

      {/* Saved results */}
      {!Object.keys(groups).length ? (
        <section className="health-empty">
          <h2>{tx('No lab tests yet', 'هنوز آزمایشی ثبت نشده')}</h2>

          <p>
            {tx(
              'Select a PDF. Results are saved only after review.',
              'PDF را انتخاب کن؛ نتایج فقط پس از بازبینی ذخیره می‌شوند.'
            )}
          </p>

          <button
            className="health-primary"
            onClick={() => input.current?.click()}
          >
            {tx('Choose PDF', 'انتخاب PDF')}
          </button>
        </section>
      ) : (
        Object.entries(groups).map(([date, items]) => (
          <section className="health-group" key={date}>
            <h2>{date}</h2>

            <div className="health-list">
              {items.map(x => (
                <button
                  className="health-item"
                  key={x.itemKey}
                  onClick={() => setSelected(x)}
                >
                  <span className={'health-dot ' + statusOf(x)} />

                  <b className="health-item-name">{x.name}</b>

                  <span className="health-item-value">
                    {x.value} {x.unit}
                  </span>

                  <span>›</span>
                </button>
              ))}
            </div>
          </section>
        ))
      )}

      {/* Saved reports */}
      {reports.length > 0 && (
        <section className="health-card">
          <h2>{tx('Saved reports', 'گزارش‌های ذخیره‌شده')}</h2>

          {reports.map(r => (
            <div className="health-row health-report" key={r.id}>
              <div>
                <b>{r.date}</b>

                <p className="health-muted">
                  {r.name} · {r.items.length} {tx('tests', 'شاخص')}
                </p>
              </div>

              <button
                className="health-danger"
                onClick={() => remove(r.id)}
              >
                {tx('Delete', 'حذف')}
              </button>
            </div>
          ))}
        </section>
      )}
    </main>
  )
}
