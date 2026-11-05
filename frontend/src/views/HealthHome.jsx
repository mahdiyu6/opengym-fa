import { useLang, getLang } from '../lib/i18n.js'
import { useNavigate } from 'react-router-dom'
import './health-hub.css'

export default function HealthHome() {
  useLang()
  const nav = useNavigate()
  const fa = getLang() === 'fa'

  const tiles = [
    {
      icon: '🧪',
      title: fa ? 'آزمایش‌ها' : 'Lab Tests',
      desc: fa ? 'ثبت و بررسی نتایج آزمایش‌ها' : 'Record and review lab results',
      path: '/health/labs'
    },
    {
      icon: '📈',
      title: fa ? 'پایش عملکرد' : 'Performance',
      desc: fa ? 'پیگیری پروتکل‌ها، عوارض و روند تغییرات' : 'Track protocols, side effects and progress',
      path: '/health/performance'
    },
    {
      icon: '📊',
      title: fa ? 'تحلیل و بینش‌ها' : 'Analytics & Insights',
      desc: fa ? 'تحلیل جامع تمرین، سلامت و روندها' : 'Explore training, health and long-term trends',
      path: '/health/analytics'
    },
    {
     icon: '📝',
     title: fa ? 'ثبت هفتگی' : 'Weekly Check-in',
     desc: fa ? 'ثبت وزن، دور کمر، خواب، انرژی و وضعیت هفتگی' : 'Record weight, waist, sleep, energy and weekly wellbeing',
     path: '/health/check-in'
    }
  ]

  return (
    <main className="health-page" dir={fa ? 'rtl' : 'ltr'}>
      <header className="health-header">
        <div>
          <h1>{fa ? 'سلامت' : 'Health'}</h1>
          <p className="health-muted">
            {fa ? 'مدیریت اطلاعات و پایش وضعیت سلامت' : 'Manage your health information'}
          </p>
        </div>
      </header>

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
