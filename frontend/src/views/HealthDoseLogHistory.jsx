import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { getLang, useLang } from '../lib/i18n.js'
import { fmtDateFull } from '../lib/format.js'
import './health-hub.css'

function getCompoundColor(name) {
  let hash = 0

  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }

  return `hsl(${hash % 360} 72% 46%)`
}

const PAGE_SIZE = 20

export default function HealthDoseLogHistory() {
  useLang()
  const fa = getLang() === 'fa'
  const nav = useNavigate()

  const logs = useStore(s => s.S.healthDoseLogs || [])
  const calendar = useStore(s => s.S?.calendar === 'jalali' ? 'jalali' : 'gregorian')
  const update = useStore(s => s.update)

  const [filter, setFilter] = useState({
    compound: '',
    from: '',
    to: ''
  })

  const [page, setPage] = useState(1)

  const tx = (en, faText) => fa ? faText : en

  const compounds = useMemo(
    () => [...new Set(logs.map(x => x.compoundName).filter(Boolean))],
    [logs]
  )

  const filtered = useMemo(() => {
    return [...logs]
      .filter(entry => {
        if (filter.compound && entry.compoundName !== filter.compound) return false
        if (filter.from && entry.date < filter.from) return false
        if (filter.to && entry.date > filter.to) return false
        return true
      })
      .sort((a, b) =>
        (b.date || '').localeCompare(a.date || '') ||
        (b.createdAt || '').localeCompare(a.createdAt || '')
      )
  }, [logs, filter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  function changeFilter(key, value) {
    setFilter(old => ({ ...old, [key]: value }))
    setPage(1)
  }

  function removeEntry(id) {
    if (!confirm(tx(
      'Delete this log entry?',
      'این ثبت از تاریخچه حذف شود؟'
    ))) return

    update(s => {
      s.healthDoseLogs = (s.healthDoseLogs || []).filter(x => x.id !== id)
    })
  }

  return (
    <main className="health-page" dir={fa ? 'rtl' : 'ltr'}>
      <button
        className="health-secondary"
        onClick={() => nav('/health/performance')}
      >
        {tx('‹ Back to Performance', '‹ بازگشت به پایش عملکرد')}
      </button>

      <header className="health-header">
        <div>
          <h1>{tx('Daily Log History', 'تاریخچه ثبت روزانه')}</h1>
          <p className="health-muted">
            {tx(
              'All your recorded entries.',
              'تمام ثبت‌های ذخیره‌شده شما.'
            )}
          </p>
        </div>
      </header>

      <section className="health-card">
        <h3>{tx('Filters', 'فیلترها')}</h3>

        <div className="health-history-filters">
          <label>
            {tx('Filter by compound', 'فیلتر بر اساس ترکیب')}
            <select
              value={filter.compound}
              onChange={e => changeFilter('compound', e.target.value)}
            >
              <option value="">
                {tx('All compounds', 'همه ترکیبات')}
              </option>

              {compounds.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </label>

          <div className="health-history-date-filters">
            <label>
              {tx('From date', 'از تاریخ')}
              <input
                type="date"
                value={filter.from}
                onChange={e => changeFilter('from', e.target.value)}
              />
            </label>

            <label>
              {tx('To date', 'تا تاریخ')}
              <input
                type="date"
                value={filter.to}
                min={filter.from || undefined}
                onChange={e => changeFilter('to', e.target.value)}
              />
            </label>
          </div>

          <button
            type="button"
            className="health-secondary"
            onClick={() => {
              setFilter({ compound: '', from: '', to: '' })
              setPage(1)
            }}
          >
            {tx('Clear filters', 'پاک‌کردن فیلترها')}
          </button>
        </div>

        <p className="health-muted">
          {tx('Total matching records:', 'تعداد کل نتایج:')} {filtered.length}
        </p>

        {visible.length === 0 ? (
          <p className="health-muted">
            {tx('No entries found.', 'موردی پیدا نشد.')}
          </p>
        ) : (
          visible.map(entry => (
<article className="health-log-entry" key={entry.id}>
  <div className="health-log-entry-content">
    <div
      className="health-log-compound-name"
      style={{ '--compound-color': getCompoundColor(entry.compoundName) }}
    >
      <span className="health-log-compound-dot" />
      <strong>{entry.compoundName}</strong>
    </div>

    <small>{entry.protocolName} · {fmtDateFull(entry.date, calendar)}</small>

    <span className="health-log-entry-amount">
      {entry.amount} {entry.unit}
    </span>

    {entry.notes && <small>{entry.notes}</small>}
  </div>

              <button
                type="button"
                className="health-danger"
                onClick={() => removeEntry(entry.id)}
              >
                {tx('Delete', 'حذف')}
              </button>
            </article>
          ))
        )}

        {filtered.length > PAGE_SIZE && (
          <div className="health-history-pagination">
            <button
              className="health-secondary"
              disabled={currentPage <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              {tx('Previous', 'قبلی')}
            </button>

            <span>
              {tx('Page', 'صفحه')} {currentPage} {tx('of', 'از')} {totalPages}
            </span>

            <button
              className="health-secondary"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              {tx('Next', 'بعدی')}
            </button>
          </div>
        )}
      </section>
    </main>
  )
}
