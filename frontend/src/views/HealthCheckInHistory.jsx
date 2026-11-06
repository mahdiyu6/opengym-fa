
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import HealthDatePicker from '../components/HealthDatePicker.jsx'
import { getLang, useLang } from '../lib/i18n.js'
import { fmtDateFull, todayISO } from '../lib/format.js'
import './health-hub.css'

const PAGE_SIZE = 20

const emptyForm = () => ({
  date: todayISO(),
  weight: '',
  waist: '',
  sleep: '',
  sleepQuality: '3',
  energy: '3',
  mood: '3',
  training: '',
  notes: ''
})

export default function HealthCheckInHistory() {
  useLang()

  const fa = getLang() === 'fa'
  const nav = useNavigate()
  const checkIns = useStore(s => s.S.healthCheckIns || [])
  const calendar = useStore(s => s.S?.calendar === 'jalali' ? 'jalali' : 'gregorian')
  const update = useStore(s => s.update)

  const [page, setPage] = useState(1)
  const [form, setForm] = useState(emptyForm)

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

  function change(key, value) {
    setForm(old => ({ ...old, [key]: value }))
  }

  function saveCheckIn(e) {
    e.preventDefault()

    const entry = {
      id: 'hci-' + Date.now(),
      ...form,
      createdAt: new Date().toISOString()
    }

    update(s => {
      s.healthCheckIns = [
        entry,
        ...(s.healthCheckIns || [])
      ]
    })

    setForm(emptyForm())
    setPage(1)
  }

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
          <h1>{tx('Weekly Check-in', 'ارزیابی هفتگی')}</h1>
          <p className="health-muted">
            {tx(
              'Track your personal progress and weekly wellbeing.',
              'وزن، دور کمر، خواب، انرژی و وضعیت هفتگی خود را ثبت و پیگیری کن.'
            )}
          </p>
        </div>
      </header>

      <section className="health-card health-checkin-section">
        <div className="health-picker-heading">
          <h3>{tx('New weekly check-in', 'ثبت ارزیابی جدید')}</h3>
          <span>
            {tx('Record your current status', 'وضعیت فعلی خود را ثبت کن')}
          </span>
        </div>

        <form className="health-checkin-form" onSubmit={saveCheckIn}>
          <label>
            {tx('Assessment date', 'تاریخ ارزیابی')}
            <HealthDatePicker
              value={form.date}
              onChange={value => change('date', value)}
            />
          </label>

          <div className="health-checkin-grid">
            <label>
              {tx('Body weight (kg)', 'وزن بدن (کیلوگرم)')}
              <input
                type="number"
                step="0.1"
                min="0"
                value={form.weight}
                onChange={e => change('weight', e.target.value)}
                placeholder="—"
              />
            </label>

            <label>
              {tx('Waist (cm)', 'دور کمر (سانتی‌متر)')}
              <input
                type="number"
                step="0.1"
                min="0"
                value={form.waist}
                onChange={e => change('waist', e.target.value)}
                placeholder="—"
              />
            </label>

            <label>
              {tx('Average sleep (hours)', 'میانگین خواب (ساعت)')}
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={form.sleep}
                onChange={e => change('sleep', e.target.value)}
                placeholder="—"
              />
            </label>
          </div>

          {[
            ['sleepQuality', 'Sleep quality', 'کیفیت خواب'],
            ['energy', 'Energy level', 'سطح انرژی'],
            ['mood', 'General well-being', 'حال عمومی']
          ].map(([key, en, faText]) => (
            <label key={key}>
              {tx(en, faText)}
              <select
                value={form[key]}
                onChange={e => change(key, e.target.value)}
              >
                <option value="1">{tx('1 - Very low', '۱ - خیلی ضعیف')}</option>
                <option value="2">{tx('2 - Low', '۲ - ضعیف')}</option>
                <option value="3">{tx('3 - متوسط', '۳ - متوسط')}</option>
                <option value="4">{tx('4 - Good', '۴ - خوب')}</option>
                <option value="5">{tx('5 - Very good', '۵ - خیلی خوب')}</option>
              </select>
            </label>
          ))}

          <label>
            {tx('Training status', 'وضعیت تمرین')}
            <select
              value={form.training}
              onChange={e => change('training', e.target.value)}
            >
              <option value="">{tx('Not specified', 'مشخص نشده')}</option>
              <option value="excellent">{tx('Excellent', 'عالی')}</option>
              <option value="good">{tx('Good', 'خوب')}</option>
              <option value="average">{tx('Average', 'متوسط')}</option>
              <option value="poor">{tx('Poor', 'ضعیف')}</option>
            </select>
          </label>

          <label>
            {tx('Notes', 'توضیحات')}
            <textarea
              rows="3"
              value={form.notes}
              onChange={e => change('notes', e.target.value)}
              placeholder={tx(
                'Any observations about this week...',
                'هر نکته‌ای درباره وضعیت این هفته...'
              )}
            />
          </label>

          <button className="health-primary" type="submit">
            {tx('Save weekly check-in', 'ذخیره ارزیابی هفتگی')}
          </button>
        </form>
      </section>

      <section className="health-card">
        <div className="health-history-title-row">
          <div>
            <h3>{tx('Check-in history', 'تاریخچه ارزیابی‌ها')}</h3>
            <p className="health-muted">
              {tx('Total check-ins:', 'تعداد کل ارزیابی‌ها:')} {sorted.length}
            </p>
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="health-muted">
            {tx('No weekly check-ins yet.', 'هنوز ارزیابی هفتگی ثبت نشده است.')}
          </p>
        ) : (
          visible.map(entry => (
            <article className="health-checkin-entry" key={entry.id}>
              <div className="health-checkin-entry-heading">
                <strong>{fmtDateFull(entry.date, calendar)}</strong>

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
