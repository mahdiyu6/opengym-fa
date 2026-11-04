import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getLang, useLang } from '../lib/i18n.js'

const pad = n => String(n).padStart(2, '0')

const toDateKey = date =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

const parseDate = value => {
  if (!value) return null
  const [y, m, d] = String(value).slice(0, 10).split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

const addDays = (date, amount) => {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function HealthDoseSchedule() {
  useLang()
  const fa = getLang() === 'fa'

  const protocols = useStore(s => s.S.healthProtocols || [])
  const overrides = useStore(s => s.S.healthDoseScheduleOverrides || {})
  const update = useStore(s => s.update)

  const [month, setMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const [selectedDate, setSelectedDate] = useState(() => toDateKey(new Date()))

  const monthTitle = month.toLocaleDateString(fa ? 'fa-IR' : 'en-GB', {
    year: 'numeric',
    month: 'long'
  })

  const events = useMemo(() => {
    const result = {}

    const addEvent = (date, protocol, compound) => {
      const key = toDateKey(date)
      if (!result[key]) result[key] = []

      const overrideKey = `${protocol.id}::${compound.id}::${key}`
      const saved = overrides[overrideKey] || {}

      result[key].push({
        key: overrideKey,
        protocolName: protocol.name || (fa ? 'پروتکل بدون نام' : 'Unnamed protocol'),
        compoundName: compound.name || '',
        amount: compound.amount || '',
        unit: compound.unit || '',
        status: saved.status || 'planned',
        time: saved.time || ''
      })
    }

    const year = month.getFullYear()
    const monthIndex = month.getMonth()
    const firstDay = new Date(year, monthIndex, 1)
    const lastDay = new Date(year, monthIndex + 1, 0)

    protocols
      .filter(protocol => protocol.status === 'active')
      .forEach(protocol => {
        const start = parseDate(
          protocol.startDate || protocol.createdAt
        )
        const end = parseDate(protocol.endDate)

        if (!start || (end && end < firstDay) || start > lastDay) return

        const compounds = Array.isArray(protocol.compounds)
          ? protocol.compounds
          : []

        compounds.forEach(compound => {
          const frequency = compound.frequency || 'daily'
          const selectedDays = Array.isArray(compound.days) ? compound.days : []

          for (
            let date = new Date(Math.max(start.getTime(), firstDay.getTime()));
            date <= lastDay;
            date = addDays(date, 1)
          ) {
            if (end && date > end) continue

            const diff = Math.round(
              (date - start) / (24 * 60 * 60 * 1000)
            )

            let scheduled = false

            if (frequency === 'daily') {
              scheduled = true
            } else if (frequency === 'every_other_day') {
              scheduled = diff % 2 === 0
            } else if (frequency === 'weekly') {
              scheduled = diff % 7 === 0
            } else if (frequency === 'selected_days') {
              scheduled = selectedDays.includes(dayNames[date.getDay()])
            }

            if (scheduled) addEvent(date, protocol, compound)
          }
        })
      })

    return result
  }, [protocols, overrides, month, fa])

  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0
  ).getDate()

  const firstWeekday = (
    new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6
  ) % 7

  const calendarCells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ]

  const selectedEvents = events[selectedDate] || []

  const changeStatus = (event, status) => {
    update(s => {
      s.healthDoseScheduleOverrides = {
        ...(s.healthDoseScheduleOverrides || {}),
        [event.key]: {
          ...(s.healthDoseScheduleOverrides?.[event.key] || {}),
          status
        }
      }
    })
  }

  const changeTime = (event, time) => {
    update(s => {
      s.healthDoseScheduleOverrides = {
        ...(s.healthDoseScheduleOverrides || {}),
        [event.key]: {
          ...(s.healthDoseScheduleOverrides?.[event.key] || {}),
          time
        }
      }
    })
  }

  const weekdays = fa
    ? ['د', 'س', 'چ', 'پ', 'ج', 'ش', 'ی']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const statusText = {
    planned: fa ? 'برنامه‌ریزی‌شده' : 'Planned',
    completed: fa ? 'انجام‌شده' : 'Done',
    skipped: fa ? 'انجام‌نشده' : 'Skipped',
    cancelled: fa ? 'لغوشده' : 'Cancelled'
  }

  const statusActions = [
    ['completed', fa ? 'انجام شد' : 'Done'],
    ['skipped', fa ? 'رد شد' : 'Skip'],
    ['cancelled', fa ? 'لغو' : 'Cancel'],
    ['planned', fa ? 'بازنشانی' : 'Reset']
  ]

  const goToday = () => {
    const now = new Date()
    setMonth(new Date(now.getFullYear(), now.getMonth(), 1))
    setSelectedDate(toDateKey(now))
  }

  return (
    <section className="health-card health-calendar-section">
      <div className="health-picker-heading">
        <h3>{fa ? 'تقویم نوبت‌ها' : 'Dose Schedule'}</h3>
        <span>
          {fa
            ? 'بر اساس برنامه ترکیبات پروتکل‌های فعال'
            : 'Generated from active protocol schedules'}
        </span>
      </div>

      <div className="health-schedule-toolbar">
        <button type="button" onClick={() => setMonth(
          new Date(month.getFullYear(), month.getMonth() - 1, 1)
        )}>‹</button>

        <strong>{monthTitle}</strong>

        <button type="button" onClick={() => setMonth(
          new Date(month.getFullYear(), month.getMonth() + 1, 1)
        )}>›</button>

        <button type="button" onClick={goToday}>
          {fa ? 'امروز' : 'Today'}
        </button>
      </div>

      <div className="health-schedule-grid">
        {weekdays.map((day, index) => (
          <div className="health-schedule-weekday" key={index}>{day}</div>
        ))}

        {calendarCells.map((day, index) => {
          if (!day) {
            return <div className="health-schedule-empty" key={`empty-${index}`} />
          }

          const date = toDateKey(new Date(
            month.getFullYear(),
            month.getMonth(),
            day
          ))

          const count = (events[date] || []).length

          return (
            <button
              type="button"
              key={date}
              className={`health-schedule-day ${selectedDate === date ? 'selected' : ''} ${count ? 'has-events' : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              <span>{day}</span>
              {count > 0 && <small>{count}</small>}
            </button>
          )
        })}
      </div>

      <div className="health-schedule-details">
        <h4>
          {fa ? 'نوبت‌های تاریخ' : 'Scheduled items for'}{' '}
          {parseDate(selectedDate)?.toLocaleDateString(
            fa ? 'fa-IR' : 'en-GB',
            { year: 'numeric', month: 'long', day: 'numeric' }
          )}
        </h4>

        {selectedEvents.length === 0 ? (
          <p className="health-muted">
            {fa ? 'برای این روز نوبتی ثبت نشده است.' : 'No scheduled items for this day.'}
          </p>
        ) : (
          selectedEvents.map(event => (
            <div className="health-schedule-entry" key={event.key}>
              <div className="health-schedule-entry-heading">
                <strong>{event.compoundName}</strong>
                <span className={`health-schedule-status ${event.status}`}>
                  {statusText[event.status]}
                </span>
              </div>

              <p className="health-muted">
                {event.protocolName}
                {event.amount ? ` · ${event.amount} ${event.unit}` : ''}
              </p>

              <label className="health-schedule-time">
                {fa ? 'ساعت (اختیاری)' : 'Time (optional)'}
                <input
                  type="time"
                  value={event.time}
                  onChange={e => changeTime(event, e.target.value)}
                />
              </label>

              <div className="health-schedule-actions">
                {statusActions.map(([status, label]) => (
                  <button
                    type="button"
                    key={status}
                    className={event.status === status ? 'active' : ''}
                    onClick={() => changeStatus(event, status)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <p className="health-muted health-schedule-note">
        {fa
          ? 'این تقویم فقط برای پیگیری نوبت‌های برنامه‌ریزی‌شده است؛ ثبت انجام واقعی در Daily Log جداگانه انجام می‌شود.'
          : 'This calendar is a schedule tracker only. Record actual use separately in Daily Log.'}
      </p>
    </section>
  )
}
