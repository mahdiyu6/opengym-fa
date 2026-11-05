import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { getLang, useLang } from '../lib/i18n.js'
import './health-hub.css'

const PAGE_SIZE = 20

export default function HealthCheckInHistory() {
  useLang()
  const fa = getLang() === 'fa'
  const nav = useNavigate()

  const checkIns = useStore(s => s.S.healthCheckIns || [])
  const update = useStore(s => s.update)

  const [page, setPage] = useState(1)

  const tx = (en, faText) => fa ? faText : en

  const sorted = useMemo(() => {
    return [...checkIns].sort((a, b) =>
      (b.date || '').localeCompare(a.date || '') ||
      (b.createdAt || '').localeCompare(a.createdAt || '')
    )
  }, [checkIns])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const visible = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  function removeEntry(id) {
    if (!confirm(tx(
      'Delete this weekly check-in?',
      'این ارزیابی هفتگی حذف شود؟'
    ))) return

    update(s => {
      s.healthCheckIns = (s.healthCheckIns || [])
        .filter(entry => entry.id !== id)
    })
  }

  function trainingLabel(value) {
    const labels = {
      excellent: ['Excellent', 'عالی'],
      good: ['Good', 'خوب'],
      average: ['Average', 'متوسط'],
      poor: ['Poor', 'ضعیف']
    }

    const item = labels[value]
    return item ? tx(item[0], item[1]) : value
  }

  return (
    <main className="health-page" dir={fa ? 'rtl' : 'ltr'}>
      <button
        className="health-secondary"
        onClick={() => nav('/health')}
      >
        {tx('‹ Back to Health', '‹ بازگشت به سلامت')}
      </button>

      <header className="health-header">
        <div>
          <h1>{tx('Weekly Check-in History', 'تاریخچه ارزیابی هفتگی')}</h1>
          <p className="health-muted">
            {tx(
              'All your previous weekly check-ins.',
              'تمام ارزیابی‌های هفتگی ثبت‌شده شما.'
            )}
          </p>
        </div>
      </header>

      <section className="health-card">
        <p className="health-muted">
          {tx('Total check-ins:', 'تعداد کل ارزیابی‌ها:')} {sorted.length}
        </p>

        {visible.length === 0 ? (
          <p className="health-muted">
            {tx('No weekly check-ins yet.', 'هنوز ارزیابی هفتگی ثبت نشده است.')}
          </p>
        ) : (
          visible.map(entry => (
            <article className="health-checkin-entry" key={entry.id}>
              <div className="health-checkin-entry-heading">
                <strong>{entry.date}</strong>

                <button
                  type="button"
                  className="health-danger"
                  onClick={() => removeEntry(entry.id)}
                >
                  {tx('Delete', 'حذف')}
                </button>
              </div>

              <div className="health-checkin-values">
                {entry.weight && (
                  <span>{tx('Weight:', 'وزن:')} {entry.weight} kg</span>
                )}

                {entry.waist && (
                  <span>{tx('Waist:', 'دور کمر:')} {entry.waist} cm</span>
                )}

                {entry.sleep && (
                  <span>{tx('Sleep:', 'خواب:')} {entry.sleep} h</span>
                )}

                <span>
                  {tx('Sleep quality:', 'کیفیت خواب:')} {entry.sleepQuality}/5
                </span>

                <span>
                  {tx('Energy:', 'انرژی:')} {entry.energy}/5
                </span>

                <span>
                  {tx('Well-being:', 'حال عمومی:')} {entry.mood}/5
                </span>
              </div>

              {entry.training && (
                <p>
                  {tx('Training:', 'تمرین:')} {trainingLabel(entry.training)}
                </p>
              )}

              {entry.notes && <p>{entry.notes}</p>}
            </article>
          ))
        )}

        {sorted.length > PAGE_SIZE && (
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
