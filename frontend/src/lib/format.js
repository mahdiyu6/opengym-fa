// Formatting + date helpers (ported from the vanilla app, unit taken from the store where needed).
import { dateLocale, t } from './i18n.js'
export const todayISO = () => {
  const d = new Date()
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}
export const isoOf = d =>
  d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')

export const DAYN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function fmtDate(iso, long, calendar = 'gregorian') {
  const d = new Date(iso + 'T12:00:00')

  const locale = calendar === 'jalali'
    ? 'fa-IR-u-ca-persian'
    : dateLocale()

  return d.toLocaleDateString(
    locale,
    long
      ? {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        }
      : {
          day: 'numeric',
          month: 'short'
        }
  )
}
export function fmtDur(ms) {
  const m = Math.floor(ms / 60000)
  return m >= 60 ? Math.floor(m / 60) + 'h ' + (m % 60) + 'm' : m + ' min'
}
// Imported history has no clock — an unknown duration is left out rather than shown as "0 min".
export const durPart = ms => (ms >= 60000 ? [fmtDur(ms)] : [])
// Numbers follow the UI language, like the dates above — a hardcoded locale put Swiss
// apostrophes ("7'535 kg") in front of every user, in every language.
export const fmtNum = n => (Math.round(n * 10) / 10).toLocaleString(dateLocale())
// Volume stays in the profile's unit throughout: the old shorthand turned anything over
// 10 000 into "t", which is wrong for a pound profile and made one list mix "18.8t" with
// "7'535 kg" — two numbers you can't compare at a glance.
export const fmtVol = (v, unit) => fmtNum(v) + ' ' + unit
// Plural forms are not automatic when the English string is the key.
export const exCount = n => t(n === 1 ? '{0} exercise' : '{0} exercises', n)

// Calendar helpers.
// Workout dates remain stored as Gregorian ISO dates.
// These helpers only control how dates are displayed in the selected calendar.

export function calendarParts(date, calendar = 'gregorian') {
  const d = date instanceof Date
    ? date
    : new Date(date + 'T12:00:00')

  const locale = calendar === 'jalali'
    ? 'fa-IR-u-ca-persian'
    : dateLocale()

  const parts = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).formatToParts(d)

  const get = type =>
    Number(parts.find(p => p.type === type)?.value || 0)

  return {
    year: get('year'),
    month: get('month'),
    day: get('day')
  }
}

export function calendarMonthStart(date, calendar = 'gregorian') {
  const d = new Date(date)

  if (calendar !== 'jalali') {
    return new Date(d.getFullYear(), d.getMonth(), 1, 12)
  }

  // Move backwards until the first day of the Persian month.
  for (let i = 0; i < 32; i++) {
    const p = calendarParts(d, 'jalali')

    if (p.day === 1) {
      return new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        12
      )
    }

    d.setDate(d.getDate() - 1)
  }

  return new Date(date)
}

export function calendarMonthLabel(date, calendar = 'gregorian') {
  const d = calendarMonthStart(date, calendar)

  return d.toLocaleDateString(
    calendar === 'jalali'
      ? 'fa-IR-u-ca-persian'
      : dateLocale(),
    {
      month: 'long',
      year: 'numeric'
    }
  )
}

export function calendarMonthDays(monthStart, calendar = 'gregorian') {
  const start = calendarMonthStart(monthStart, calendar)
  const startParts = calendarParts(start, calendar)
  const days = []

  for (let i = 0; i < 33; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)

    const p = calendarParts(d, calendar)

    if (
      i > 0 &&
      (p.year !== startParts.year ||
       p.month !== startParts.month)
    ) {
      break
    }

    days.push(d)
  }

  return days
}

export function weekKey(d) {
  const dt = new Date(d + 'T12:00:00')
  const day = (dt.getDay() + 6) % 7
  dt.setDate(dt.getDate() - day + 3)
  const jan4 = new Date(dt.getFullYear(), 0, 4)
  const week = 1 + Math.round(((dt - jan4) / 86400000 - 3 + ((jan4.getDay() + 6) % 7)) / 7)
  return dt.getFullYear() + '-' + week
}

export const localTZ = () => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' } catch { return 'UTC' } }

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
export const ACCENTS = { lime: '#30d158', sky: '#0a84ff', orange: '#ff9f0a', violet: '#bf5af2', pink: '#ff375f', red: '#ff453a', teal: '#40c8e0', gold: '#ffd60a' }
