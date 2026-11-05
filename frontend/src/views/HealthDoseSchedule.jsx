import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getLang, useLang, dateLocale } from '../lib/i18n.js'
import { todayISO, isoOf, calendarParts, calendarMonthStart, calendarMonthDays, calendarMonthLabel } from '../lib/format.js'

const DAY_KEYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const STATUSES = ['planned', 'completed', 'skipped', 'cancelled']

function parseISODate(value) {
  if (typeof value !== 'string') return null
  const m = value.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return null
  const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3])
  const date = new Date(y, mo - 1, d, 12)
  return date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d ? date : null
}

function showDate(date, calendar, fa, options) {
  const locale = calendar === 'jalali'
    ? (fa ? 'fa-IR-u-ca-persian' : 'en-US-u-ca-persian')
    : dateLocale()
  return date.toLocaleDateString(locale, options)
}

export default function HealthDoseSchedule() {
  useLang()
  const fa = getLang() === 'fa'
  const calendar = useStore(s => s.S?.calendar === 'jalali' ? 'jalali' : 'gregorian')
  const rawProtocols = useStore(s => s.S?.healthProtocols)
  const rawOverrides = useStore(s => s.S?.healthDoseScheduleOverrides)
  const rawLogs = useStore(s => s.S?.healthDoseLogs)
  const update = useStore(s => s.update)

  const protocols = Array.isArray(rawProtocols) ? rawProtocols : []
  const overrides = rawOverrides && typeof rawOverrides === 'object' && !Array.isArray(rawOverrides) ? rawOverrides : {}
  const logs = Array.isArray(rawLogs) ? rawLogs.filter(x => x && typeof x === 'object') : []
  const [monthAnchor, setMonthAnchor] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(todayISO)

  const monthStart = calendarMonthStart(monthAnchor, calendar)
  const monthDays = calendarMonthDays(monthStart, calendar)
  const offset = monthDays.length
    ? (calendar === 'jalali' ? (monthDays[0].getDay() + 1) % 7 : (monthDays[0].getDay() + 6) % 7)
    : 0

  const weekdays = calendar === 'jalali'
    ? (fa ? ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'] : ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
    : (fa ? ['د', 'س', 'چ', 'پ', 'ج', 'ش', 'ی'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])

  const eventsByDate = useMemo(() => {
    const result = {}
    const days = calendarMonthDays(monthStart, calendar)
    const first = days[0], last = days[days.length - 1]
    if (!first || !last) return result

    protocols.forEach(protocol => {
      if (!protocol || typeof protocol !== 'object' || protocol.status !== 'active' || protocol.id == null) return
      const start = parseISODate(protocol.startDate || protocol.createdAt)
      const end = parseISODate(protocol.endDate)
      if (!start || (end && end < first) || start > last) return

      const compounds = Array.isArray(protocol.compounds) ? protocol.compounds : []
      compounds.forEach(compound => {
        if (!compound || typeof compound !== 'object' || compound.id == null) return
        const frequency = typeof compound.frequency === 'string' ? compound.frequency : 'daily'
        const selectedDays = Array.isArray(compound.days) ? compound.days.filter(x => typeof x === 'string') : []

        days.forEach(date => {
          if (date < start || (end && date > end)) return
          const diff = Math.round((date.getTime() - start.getTime()) / 86400000)
          const scheduled = frequency === 'daily'
            ? true
            : frequency === 'every_other_day'
              ? diff % 2 === 0
              : frequency === 'weekly'
                ? diff % 7 === 0
                : frequency === 'selected_days'
                  ? selectedDays.includes(DAY_KEYS[date.getDay()])
                  : false
          if (!scheduled) return

          const dateKey = isoOf(date)
          const key = `${protocol.id}::${compound.id}::${dateKey}`
          const saved = overrides[key] && typeof overrides[key] === 'object' ? overrides[key] : {}
          if (!result[dateKey]) result[dateKey] = []
          result[dateKey].push({
            key,
            protocolName: typeof protocol.name === 'string' ? protocol.name : (fa ? 'پروتکل بدون نام' : 'Unnamed protocol'),
            compoundName: typeof compound.name === 'string' ? compound.name : (fa ? 'ترکیب بدون نام' : 'Unnamed compound'),
            amount: compound.amount == null ? '' : String(compound.amount),
            unit: typeof compound.unit === 'string' ? compound.unit : '',
            status: STATUSES.includes(saved.status) ? saved.status : 'planned',
            time: typeof saved.time === 'string' ? saved.time : ''
          })
        })
      })
    })
    return result
  }, [protocols, overrides, monthStart, calendar, fa])

  const selectedEvents = eventsByDate[selectedDate] || []
  const selectedLogs = logs
    .filter(entry => typeof entry.date === 'string' && entry.date.slice(0, 10) === selectedDate)
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')))

  function saveOverride(event, patch) {
    if (!event) return
    update(s => {
      const current = s.healthDoseScheduleOverrides && typeof s.healthDoseScheduleOverrides === 'object'
        ? s.healthDoseScheduleOverrides : {}
      s.healthDoseScheduleOverrides = {
        ...current,
        [event.key]: {
          ...(current[event.key] && typeof current[event.key] === 'object' ? current[event.key] : {}),
          ...patch
        }
      }
    })
  }

  function changeMonth(amount) {
    const anchor = new Date(monthStart)
    anchor.setDate(anchor.getDate() + (amount > 0 ? monthDays.length : -1))
    setMonthAnchor(anchor)
  }

  function goToday() {
    setMonthAnchor(new Date())
    setSelectedDate(todayISO())
  }

  const statusText = {
    planned: fa ? 'برنامه‌ریزی‌شده' : 'Planned',
    completed: fa ? 'انجام‌شده' : 'Done',
    skipped: fa ? 'انجام‌نشده' : 'Skipped',
    cancelled: fa ? 'لغوشده' : 'Cancelled'
  }
  const actions = [
    ['completed', fa ? 'انجام شد' : 'Done'],
    ['skipped', fa ? 'رد شد' : 'Skip'],
    ['cancelled', fa ? 'لغو' : 'Cancel'],
    ['planned', fa ? 'بازنشانی' : 'Reset']
  ]
  const monthTitle = calendar === 'jalali' && !fa
    ? monthStart.toLocaleDateString('en-US-u-ca-persian', { month: 'long', year: 'numeric' })
    : calendarMonthLabel(monthStart, calendar)

  return (
    <section className="health-card health-calendar-section">
      <div className="health-picker-heading">
        <h3>{fa ? 'تقویم نوبت‌ها' : 'Dose Schedule'}</h3>
        <span>{fa ? 'بر اساس برنامه ترکیبات پروتکل‌های فعال' : 'Generated from active protocol schedules'}</span>
      </div>

      <div className="health-calendar-navigation">
        <button type="button" className="health-secondary" onClick={() => changeMonth(-1)} aria-label={fa ? 'ماه قبل' : 'Previous month'}>‹</button>
        <strong>{monthTitle}</strong>
        <button type="button" className="health-secondary" onClick={() => changeMonth(1)} aria-label={fa ? 'ماه بعد' : 'Next month'}>›</button>
        <button type="button" className="health-secondary" onClick={goToday}>{fa ? 'امروز' : 'Today'}</button>
      </div>

      <div className="health-calendar-grid">
        {weekdays.map((day, i) => <div className="health-calendar-weekday" key={`${calendar}-${i}`}>{day}</div>)}
        {Array.from({ length: offset }, (_, i) => <div className="health-calendar-empty" key={`empty-${i}`} />)}
        {monthDays.map(date => {
          const key = isoOf(date)
          const count = (eventsByDate[key] || []).length
          const selected = selectedDate === key
          const isToday = todayISO() === key
          const day = calendarParts(date, calendar).day
          const locale = calendar === 'jalali'
            ? (fa ? 'fa-IR-u-ca-persian' : 'en-US-u-ca-persian')
            : dateLocale()
          return (
            <button
              type="button"
              key={key}
              className={['health-calendar-day', count ? 'has-logs' : '', selected ? 'selected' : '', isToday ? 'is-today' : ''].filter(Boolean).join(' ')}
              onClick={() => setSelectedDate(key)}
              aria-pressed={selected}
              aria-label={`${showDate(date, calendar, fa, { year: 'numeric', month: 'long', day: 'numeric' })}, ${count} ${fa ? 'نوبت' : 'scheduled items'}`}
            >
              <span>{day.toLocaleString(locale)}</span>
              {count > 0 && <small>{count}</small>}
            </button>
          )
        })}
      </div>

      <div className="health-calendar-day-details">
        <h4>
          {fa ? 'نوبت‌های تاریخ' : 'Scheduled items for'}{' '}
          {parseISODate(selectedDate)
            ? showDate(parseISODate(selectedDate), calendar, fa, { year: 'numeric', month: 'long', day: 'numeric' })
            : selectedDate}
        </h4>

        {selectedEvents.length === 0 ? (
          <p className="health-muted">{fa ? 'برای این روز نوبتی ثبت نشده است.' : 'No scheduled items for this day.'}</p>
        ) : selectedEvents.map(event => (
          <div className="health-schedule-entry" key={event.key}>
            <div className="health-schedule-entry-heading">
              <strong>{event.compoundName}</strong>
              <span className={`health-schedule-status ${event.status}`}>{statusText[event.status]}</span>
            </div>
            <p className="health-muted">{event.protocolName}{event.amount ? ` · ${event.amount} ${event.unit}` : ''}</p>
            <label className="health-schedule-time">
              {fa ? 'ساعت (اختیاری)' : 'Time (optional)'}
              <input type="time" value={event.time} onChange={e => saveOverride(event, { time: e.target.value })} />
            </label>
            <div className="health-schedule-actions">
              {actions.map(([status, label]) => (
                <button type="button" key={status} className={event.status === status ? 'active' : ''} onClick={() => saveOverride(event, { status })}>{label}</button>
              ))}
            </div>
          </div>
        ))}

        {selectedLogs.length > 0 && (
          <div className="health-schedule-actual-logs">
            <h4>{fa ? 'ثبت‌های واقعی در Daily Log' : 'Actual Daily Log entries'}</h4>
            {selectedLogs.map(entry => (
              <div className="health-calendar-entry" key={entry.id || `${entry.date}-${entry.compoundName}`}>
                <strong>{entry.compoundName || (fa ? 'ترکیب' : 'Compound')}</strong>
                <span>{[entry.amount, entry.unit].filter(Boolean).join(' ')}</span>
                {entry.notes && <small>{entry.notes}</small>}
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="health-muted health-schedule-note">
        {fa
          ? 'این تقویم برای پیگیری نوبت‌های برنامه‌ریزی‌شده است. ثبت انجام واقعی در Daily Log جداگانه ذخیره می‌شود.'
          : 'This calendar tracks planned schedule items. Actual use is recorded separately in Daily Log.'}
      </p>
    </section>
  )
}
