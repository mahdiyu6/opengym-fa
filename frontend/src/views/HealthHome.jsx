
import { useLang, getLang } from '../lib/i18n.js'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { fmtDateFull, todayISO } from '../lib/format.js'
import './health-hub.css'

const DAY_KEYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function HealthHome() {
  useLang()
  const nav = useNavigate()
  const fa = getLang() === 'fa'
  const calendar = useStore(s => s.S?.calendar === 'jalali' ? 'jalali' : 'gregorian')
  const protocols = useStore(s => Array.isArray(s.S?.healthProtocols) ? s.S.healthProtocols : [])
  const doseLogs = useStore(s => Array.isArray(s.S?.healthDoseLogs) ? s.S.healthDoseLogs : [])
  const sideEffects = useStore(s => Array.isArray(s.S?.healthSideEffects) ? s.S.healthSideEffects : [])
  const workouts = useStore(s => Array.isArray(s.S?.workouts) ? s.S.workouts : [])
  const checkIns = useStore(s => Array.isArray(s.S?.healthCheckIns) ? s.S.healthCheckIns : [])

  const today = todayISO()
  const todayDate = new Date(`${today}T12:00:00`)
  const tx = (en, faText) => fa ? faText : en

  const plannedToday = []

  protocols.forEach(protocol => {
    if (!protocol || protocol.status !== 'active') return

    const start = String(protocol.startDate || protocol.createdAt || '').slice(0, 10)
    const end = String(protocol.endDate || '').slice(0, 10)

    if (start && start > today) return
    if (end && end < today) return

    const compounds = Array.isArray(protocol.compounds) ? protocol.compounds : []

    compounds.forEach(compound => {
      if (!compound || compound.id == null) return

      const frequency = typeof compound.frequency === 'string' ? compound.frequency : 'daily'
      const selectedDays = Array.isArray(compound.days) ? compound.days : []
      const startDate = start ? new Date(`${start}T12:00:00`) : todayDate
      const diff = Math.round((todayDate.getTime() - startDate.getTime()) / 86400000)

      const scheduled = frequency === 'daily'
        ? true
        : frequency === 'every_other_day'
          ? diff >= 0 && diff % 2 === 0
          : frequency === 'weekly'
            ? diff >= 0 && diff % 7 === 0
            : frequency === 'selected_days'
              ? selectedDays.includes(DAY_KEYS[todayDate.getDay()])
              : false

      if (!scheduled) return

      const logged = doseLogs.some(log =>
        log.date === today &&
        log.protocolId === protocol.id &&
        log.compoundId === compound.id
      )

      plannedToday.push({
        id: `${protocol.id}-${compound.id}`,
        name: compound.name || (fa ? 'ترکیب بدون نام' : 'Unnamed compound'),
        protocolName: protocol.name || (fa ? 'پروتکل' : 'Protocol'),
        logged
      })
    })
  })

  const doneToday = plannedToday.filter(item => item.logged).length
  const totalToday = plannedToday.length
  const progress = totalToday ? Math.round(doneToday / totalToday * 100) : 0

  const activeProtocols = protocols.filter(item => item?.status === 'active').length
  const activeEffects = sideEffects.filter(item => item?.status !== 'resolved').length
  const workoutsToday = workouts.filter(item => item?.d === today).length

  const latestCheckIn = [...checkIns].sort((a, b) =>
    String(b.date || '').localeCompare(String(a.date || ''))
  )[0]

  const tiles = [
    {
      icon: '🍕',
      title: fa ? 'تغذیه و کالری' : 'Nutrition & Calorie',
      desc: fa
        ? 'مدیریت کالری، وعده‌ها و ارزش غذایی'
        : 'Track calories, meals and nutrition',
      path: '/health/nutrition'
    },
    {
  icon: '🏃🏻‍♂️',
  title: fa ? 'ترکیب بدن' : 'Body Composition',
  desc: fa
    ? 'تحلیل وزن، چربی و ترکیب بدن'
    : 'Analyze weight, body fat and body composition',
  path: '/health/body-composition'
    },
    {
      icon: '🩸',
      title: fa ? 'آزمایش‌ها' : 'Lab Tests',
      desc: fa ? 'ثبت و بررسی نتایج آزمایش‌ها' : 'Record and review lab results',
      path: '/health/labs'
    },
    {
      icon: '💊',
      title: fa ? 'پایش عملکرد' : 'Performance',
      desc: fa ? 'پیگیری پروتکل‌ها، عوارض و روند تغییرات' : 'Track protocols, side effects and progress',
      path: '/health/performance'
    },
    {
      icon: '📊',
      title: fa ? 'تحلیل و بینش‌ها' : 'Analytic & Insight',
      desc: fa ? 'تحلیل جامع تمرین، سلامت و روندها' : 'Explore training, health and long-term trends',
      path: '/health/analytics'
    },
    {
      icon: '🗓️',
      title: fa ? 'ثبت هفتگی' : 'Weekly Check-in',
      desc: fa ? 'ثبت وزن، دور کمر، خواب، انرژی و غیره ' : 'Record weight, waist, sleep, energy and etc',
      path: '/health/check-in'
    }
  ]

  return (
    <main className="health-page health-dashboard" dir={fa ? 'rtl' : 'ltr'}>
      <header className="health-header">
        <div>
          <h1>{tx('Health', 'سلامت')}</h1>
          <p className="health-muted">
            {tx('Your personal health overview', 'نمای کلی وضعیت سلامت و فعالیت‌های شما')}
          </p>
        </div>
        <span className="health-dashboard-date">{fmtDateFull(today, calendar)}</span>
      </header>

      <section className="health-dashboard-daily">
        <div className="health-dashboard-daily-heading">
          <div>
            <span className="health-dashboard-eyebrow">{tx('DAILY OVERVIEW', 'نمای امروز')}</span>
            <h2>{tx("Today's progress", 'پیشرفت امروز')}</h2>
          </div>
          <button type="button" onClick={() => nav('/health/performance')}>
            {tx('Open log', 'ثبت روزانه')} <span>↗</span>
          </button>
        </div>

        <div className="health-dashboard-progress-row">
          <div
            className="health-dashboard-ring"
            style={{ '--daily-progress': `${progress}%` }}
            role="img"
            aria-label={`${doneToday} of ${totalToday} scheduled items logged`}
          >
            <div>
              <strong>{totalToday ? `${progress}%` : '—'}</strong>
              <span>{tx('COMPLETE', 'تکمیل')}</span>
            </div>
          </div>

          <div className="health-dashboard-progress-copy">
            <strong>
              {totalToday
                ? tx(`${doneToday} of ${totalToday} logged`, `${doneToday} از ${totalToday} مورد ثبت شده`)
                : tx('No scheduled items today', 'امروز مورد برنامه‌ریزی‌شده‌ای ندارید')}
            </strong>
            <p>
              {totalToday
                ? tx('Based on your active protocol schedule and saved daily logs.', 'بر اساس برنامه پروتکل‌های فعال و ثبت‌های واقعی شما.')
                : tx('Your overview will update when an active protocol has an item scheduled for today.', 'با رسیدن زمان‌بندی پروتکل فعال، وضعیت امروز در این قسمت نمایش داده می‌شود.')}
            </p>

            {totalToday > 0 && (
              <div className="health-dashboard-progress-legend">
                <span><i className="done" />{tx('Logged', 'ثبت‌شده')} {doneToday}</span>
                <span><i />{tx('Remaining', 'باقی‌مانده')} {totalToday - doneToday}</span>
              </div>
            )}
          </div>
        </div>

        {plannedToday.length > 0 && (
          <div className="health-dashboard-today-list">
            {plannedToday.slice(0, 3).map(item => (
              <div className="health-dashboard-today-item" key={item.id}>
                <span className={item.logged ? 'health-dashboard-status done' : 'health-dashboard-status'} />
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.protocolName}</small>
                </div>
                <span className={item.logged ? 'health-dashboard-item-state done' : 'health-dashboard-item-state'}>
                  {item.logged ? tx('Logged', 'ثبت‌شده') : tx('Pending', 'در انتظار')}
                </span>
              </div>
            ))}

            {plannedToday.length > 3 && (
              <button className="health-dashboard-more" onClick={() => nav('/health/performance')}>
                {tx(`View all ${plannedToday.length} items`, `مشاهده همه ${plannedToday.length} مورد`)} →
              </button>
            )}
          </div>
        )}
      </section>

      <section className="health-dashboard-stats">
        <div>
          <span>{tx('Active protocols', 'پروتکل فعال')}</span>
          <strong>{activeProtocols}</strong>
        </div>
        <div>
          <span>{tx('Active side effects', 'عوارض فعال')}</span>
          <strong>{activeEffects}</strong>
        </div>
        <div>
          <span>{tx("Today's workouts", 'تمرین امروز')}</span>
          <strong>{workoutsToday}</strong>
        </div>
        <div>
          <span>{tx('Last check-in', 'آخرین ارزیابی')}</span>
          <strong className="health-dashboard-last-checkin">
            {latestCheckIn ? fmtDateFull(latestCheckIn.date, calendar) : '—'}
          </strong>
        </div>
      </section>

      <div className="health-dashboard-section-heading">
        <h2>{tx('Your health tools', 'ابزارهای سلامت')}</h2>
      </div>

      <div className="health-hub-grid">
        {tiles.map(tile => (
          <button
            className="health-hub-tile"
            key={tile.path}
            onClick={() => nav(tile.path)}
          >
            <span className="health-hub-icon">{tile.icon}</span>
            <strong>{tile.title}</strong>
            <small>{tile.desc}</small>
            <span className="health-hub-arrow">←</span>
          </button>
        ))}
      </div>
    </main>
  )
}
