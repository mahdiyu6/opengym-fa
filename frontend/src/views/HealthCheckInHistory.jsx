
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
  chest: '',
  arm: '',
  leg: '',
  sleep: '',
  stress: '3',
  energy: '3',
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

  function scaleLabel(value, type) {
    const labels = type === 'stress'
      ? {
          1: ['Very low', 'خیلی کم'],
          2: ['Low', 'کم'],
          3: ['Moderate', 'متوسط'],
          4: ['High', 'زیاد'],
          5: ['Very high', 'خیلی زیاد']
        }
      : {
          1: ['Very low', 'خیلی ضعیف'],
          2: ['Low', 'ضعیف'],
          3: ['Moderate', 'متوسط'],
          4: ['Good', 'خوب'],
          5: ['Very good', 'خیلی خوب']
        }

    const item = labels[value]
    return item ? tx(item[0], item[1]) : value
  }

  function MeasurementField({ field, title, subtitle, unit = 'cm', step = '0.1' }) {
    return (
      <label className="health-checkin-measurement">
        <span className="health-checkin-field-title">{title}</span>
        <small>{subtitle}</small>
        <div className="health-checkin-input-wrap">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step={step}
            value={form[field]}
            onChange={e => change(field, e.target.value)}
            placeholder="—"
          />
          <span>{unit}</span>
        </div>
      </label>
    )
  }

  function ScaleField({ field, title, subtitle, type = 'normal' }) {
    const value = Number(form[field] || 3)

    return (
      <div className="health-checkin-scale">
        <div className="health-checkin-scale-heading">
          <div>
            <strong>{title}</strong>
            <small>{subtitle}</small>
          </div>
          <span className="health-checkin-scale-value">{value}/5</span>
        </div>

        <div className="health-checkin-scale-options">
          {[1, 2, 3, 4, 5].map(number => (
            <button
              key={number}
              type="button"
              className={value === number ? 'active' : ''}
              onClick={() => change(field, String(number))}
              aria-pressed={value === number}
            >
              {number}
            </button>
          ))}
        </div>

        <div className="health-checkin-scale-caption">
          <span>
            {type === 'stress'
              ? tx('Very low', 'خیلی کم')
              : tx('Very low', 'خیلی ضعیف')}
          </span>
          <span>
            {type === 'stress'
              ? tx('Very high', 'خیلی زیاد')
              : tx('Very good', 'خیلی خوب')}
          </span>
        </div>
      </div>
    )
  }

  return (
    <main className="health-page" dir={fa ? 'rtl' : 'ltr'}>
            <header className="health-header health-checkin-header">
        <div>
          <span className="health-checkin-eyebrow">
            {tx('PERSONAL TRACKING', 'پایش شخصی')}
          </span>

          <div className="health-title-row">
            <h1>{tx('Weekly Check-in', 'ارزیابی هفتگی')}</h1>

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
              'Track body measurements, recovery and training progress.',
              'اندازه‌های بدن، وضعیت ریکاوری و روند تمرین خود را دنبال کن.'
            )}
          </p>
        </div>

        <div className="health-checkin-header-icon">◉</div>
      </header>

      <section className="health-card health-checkin-section">
        <div className="health-picker-heading">
          <h3>{tx('New weekly check-in', 'ثبت ارزیابی جدید')}</h3>
          <span>{tx('Your weekly snapshot', 'نمای کلی وضعیت این هفته')}</span>
        </div>

        <form className="health-checkin-form" onSubmit={saveCheckIn}>
          <div className="health-checkin-date-block">
            <label>
              {tx('Assessment date', 'تاریخ ارزیابی')}
              <HealthDatePicker
                value={form.date}
                onChange={value => change('date', value)}
              />
            </label>
          </div>

          <section className="health-checkin-group">
            <div className="health-checkin-group-heading">
              <span className="health-checkin-group-icon">↗</span>
              <div>
                <h4>{tx('Body measurements', 'اندازه‌گیری بدن')}</h4>
                <p>{tx('Track physical changes over time', 'تغییرات اندازه‌های بدن را دنبال کن')}</p>
              </div>
            </div>

            <div className="health-checkin-grid">
{MeasurementField({
  field: 'weight',
  title: tx('Body weight', 'وزن بدن'),
  subtitle: tx('Current weight', 'وزن فعلی'),
  unit: 'kg'
})}
{MeasurementField({
  field: 'waist',
  title: tx('Waist', 'دور کمر'),
  subtitle: tx('Waist circumference', 'اندازه دور کمر')
})}

{MeasurementField({
  field: 'chest',
  title: tx('Chest', 'دور سینه'),
  subtitle: tx('Chest circumference', 'اندازه دور سینه')
})}

{MeasurementField({
  field: 'arm',
  title: tx('Arm', 'دور بازو'),
  subtitle: tx('Arm circumference', 'اندازه دور بازو')
})}

{MeasurementField({
  field: 'leg',
  title: tx('Leg', 'دور پا'),
  subtitle: tx('Leg circumference', 'اندازه دور پا')
})}
            </div>
          </section>

          <section className="health-checkin-group">
            <div className="health-checkin-group-heading">
              <span className="health-checkin-group-icon">◷</span>
              <div>
                <h4>{tx('Recovery & stress', 'ریکاوری و استرس')}</h4>
                <p>{tx('Monitor sleep, stress and energy', 'خواب، استرس و انرژی خود را ارزیابی کن')}</p>
              </div>
            </div>

            <div className="health-checkin-grid">
{MeasurementField({
  field: 'sleep',
  title: tx('Average sleep', 'میانگین خواب'),
  subtitle: tx('Hours per night', 'ساعت در شب'),
  unit: 'h',
  step: '0.5'
})}
            </div>

            <div className="health-checkin-scales">
              <ScaleField
                field="stress"
                title={tx('Stress level', 'سطح استرس')}
                subtitle={tx('How stressed did you feel this week?', 'این هفته چقدر استرس داشتی؟')}
                type="stress"
              />
              <ScaleField
                field="energy"
                title={tx('Energy level', 'سطح انرژی')}
                subtitle={tx('Your overall energy this week', 'میزان انرژی کلی این هفته')}
              />
            </div>
          </section>

          <section className="health-checkin-group">
            <div className="health-checkin-group-heading">
              <span className="health-checkin-group-icon">⌁</span>
              <div>
                <h4>{tx('Training', 'تمرین')}</h4>
                <p>{tx('Your overall training performance', 'وضعیت کلی عملکرد تمرینی')}</p>
              </div>
            </div>

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
          </section>

          <section className="health-checkin-group health-checkin-notes-group">
            <div className="health-checkin-group-heading">
              <span className="health-checkin-group-icon">✎</span>
              <div>
                <h4>{tx('Weekly notes', 'یادداشت هفتگی')}</h4>
                <p>{tx('Anything worth remembering?', 'نکته‌ای برای ثبت و یادآوری داری؟')}</p>
              </div>
            </div>

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
          </section>

          <button className="health-primary health-checkin-submit" type="submit">
            {tx('Save weekly check-in', 'ذخیره ارزیابی هفتگی')}
          </button>
        </form>
      </section>

      <section className="health-card health-checkin-history-card">
        <div className="health-history-title-row">
          <div>
            <h3>{tx('Check-in history', 'تاریخچه ارزیابی‌ها')}</h3>
            <p className="health-muted">
              {tx('Total check-ins:', 'تعداد کل ارزیابی‌ها:')} {sorted.length}
            </p>
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="health-checkin-empty">
            <span>◷</span>
            <strong>{tx('No weekly check-ins yet', 'هنوز ارزیابی هفتگی ثبت نشده است')}</strong>
            <p>{tx('Your saved check-ins will appear here.', 'ارزیابی‌های ذخیره‌شده در اینجا نمایش داده می‌شوند.')}</p>
          </div>
        ) : (
          visible.map(entry => (
            <article className="health-checkin-entry" key={entry.id}>
              <div className="health-checkin-entry-heading">
                <div>
                  <span className="health-checkin-entry-label">
                    {tx('WEEKLY RECORD', 'ثبت هفتگی')}
                  </span>
                  <strong>{fmtDateFull(entry.date, calendar)}</strong>
                </div>

                <button
                  type="button"
                  className="health-danger"
                  onClick={() => removeEntry(entry.id)}
                >
                  {tx('Delete', 'حذف')}
                </button>
              </div>

              <div className="health-checkin-values">
                {[
                  ['weight', 'Weight', 'وزن', 'kg'],
                  ['waist', 'Waist', 'دور کمر', 'cm'],
                  ['chest', 'Chest', 'دور سینه', 'cm'],
                  ['arm', 'Arm', 'دور بازو', 'cm'],
                  ['leg', 'Leg', 'دور پا', 'cm'],
                  ['sleep', 'Sleep', 'خواب', 'h']
                ].map(([key, en, faText, unit]) => (
                  entry[key] !== undefined && entry[key] !== '' && (
                    <span key={key}>
                      {tx(en, faText)}: {entry[key]} {unit}
                    </span>
                  )
                ))}

                {entry.stress !== undefined && (
                  <span>
                    {tx('Stress:', 'استرس:')} {scaleLabel(entry.stress, 'stress')}
                    {' '}({entry.stress}/5)
                  </span>
                )}

                {entry.energy !== undefined && (
                  <span>
                    {tx('Energy:', 'انرژی:')} {entry.energy}/5
                  </span>
                )}

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
