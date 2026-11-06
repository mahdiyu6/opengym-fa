
import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getLang, useLang, dateLocale } from '../lib/i18n.js'
import {
  todayISO,
  isoOf,
  calendarParts,
  calendarMonthStart,
  calendarMonthDays,
  calendarMonthLabel
} from '../lib/format.js'
import '../views/health-hub.css'

function parseISO(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [y, m, d] = value.split('-').map(Number)
  const date = new Date(y, m - 1, d, 12)
  return date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d ? date : null
}

export default function HealthDatePicker({
  value = '',
  onChange,
  min,
  max,
  placeholder
}) {
  useLang()

  const fa = getLang() === 'fa'
  const calendar = useStore(s =>
    s.S?.calendar === 'jalali' ? 'jalali' : 'gregorian'
  )

  const [open, setOpen] = useState(false)
  const [monthAnchor, setMonthAnchor] = useState(
    () => parseISO(value) || new Date()
  )

  const selectedDate = parseISO(value)
  const monthStart = calendarMonthStart(monthAnchor, calendar)
  const days = calendarMonthDays(monthStart, calendar)

  const offset = days.length
    ? calendar === 'jalali'
      ? (days[0].getDay() + 1) % 7
      : (days[0].getDay() + 6) % 7
    : 0

  const weekdays = calendar === 'jalali'
    ? (fa
      ? ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
      : ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
    : (fa
      ? ['د', 'س', 'چ', 'پ', 'ج', 'ش', 'ی']
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])

  const locale = calendar === 'jalali'
    ? (fa ? 'fa-IR-u-ca-persian' : 'en-US-u-ca-persian')
    : dateLocale()

  const monthTitle = calendar === 'jalali' && !fa
    ? monthStart.toLocaleDateString(locale, {
        month: 'long',
        year: 'numeric'
      })
    : calendarMonthLabel(monthStart, calendar)

  function displayDate(date) {
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  function changeMonth(amount) {
    const anchor = new Date(monthStart)
    anchor.setDate(
      anchor.getDate() + (amount > 0 ? days.length : -1)
    )
    setMonthAnchor(anchor)
  }

  function selectDate(date) {
    const iso = isoOf(date)
    if (min && iso < min) return
    if (max && iso > max) return

    onChange?.(iso)
    setMonthAnchor(date)
    setOpen(false)
  }

  function goToday() {
    const today = parseISO(todayISO())
    if (!today) return
    setMonthAnchor(today)
    selectDate(today)
  }

  return (
    <div className="health-date-picker" dir={fa ? 'rtl' : 'ltr'}>
      <button
        type="button"
        className="health-date-picker-trigger"
        onClick={() => {
          setMonthAnchor(selectedDate || new Date())
          setOpen(v => !v)
        }}
        aria-expanded={open}
      >
        <span>
          {selectedDate
            ? displayDate(selectedDate)
            : placeholder || (fa ? 'انتخاب تاریخ' : 'Select date')}
        </span>
        <span className="health-date-picker-icon">▦</span>
      </button>

      {open && (
        <div className="health-date-picker-popover">
          <div className="health-calendar-navigation">
            <button
              type="button"
              className="health-secondary"
              onClick={() => changeMonth(-1)}
              aria-label={fa ? 'ماه قبل' : 'Previous month'}
            >
              ‹
            </button>

            <strong>{monthTitle}</strong>

            <button
              type="button"
              className="health-secondary"
              onClick={() => changeMonth(1)}
              aria-label={fa ? 'ماه بعد' : 'Next month'}
            >
              ›
            </button>
          </div>

          <div className="health-calendar-grid">
            {weekdays.map((day, index) => (
              <div
                className="health-calendar-weekday"
                key={`${calendar}-${index}`}
              >
                {day}
              </div>
            ))}

            {Array.from({ length: offset }, (_, index) => (
              <div
                className="health-calendar-empty"
                key={`empty-${index}`}
              />
            ))}

            {days.map(date => {
              const iso = isoOf(date)
              const selected = iso === value
              const isToday = iso === todayISO()
              const disabled =
                (min && iso < min) || (max && iso > max)

              const day = calendarParts(date, calendar).day

              return (
                <button
                  type="button"
                  key={iso}
                  disabled={!!disabled}
                  className={[
                    'health-calendar-day',
                    selected ? 'selected' : '',
                    isToday ? 'is-today' : '',
                    disabled ? 'disabled' : ''
                  ].filter(Boolean).join(' ')}
                  onClick={() => selectDate(date)}
                  aria-pressed={selected}
                  aria-label={displayDate(date)}
                >
                  <span>{day.toLocaleString(locale)}</span>
                </button>
              )
            })}
          </div>

          <div className="health-date-picker-actions">
            <button
              type="button"
              className="health-secondary"
              onClick={goToday}
            >
              {fa ? 'امروز' : 'Today'}
            </button>

            {value && (
              <button
                type="button"
                className="health-secondary"
                onClick={() => {
                  onChange?.('')
                  setOpen(false)
                }}
              >
                {fa ? 'پاک‌کردن' : 'Clear'}
              </button>
            )}

            <button
              type="button"
              className="health-secondary"
              onClick={() => setOpen(false)}
            >
              {fa ? 'بستن' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
