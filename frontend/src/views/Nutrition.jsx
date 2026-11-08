
import { useState } from 'react'
import { useLang, getLang } from '../lib/i18n.js'
import { useStore } from '../store/useStore.js'
import { fmtDateFull, todayISO } from '../lib/format.js'
import './health-hub.css'

export default function Nutrition() {
  useLang()

  const fa = getLang() === 'fa'
  const calendar = useStore(s =>
    s.S?.calendar === 'jalali' ? 'jalali' : 'gregorian'
  )

  const [page, setPage] = useState('dashboard')

  const tx = (en, faText) => fa ? faText : en

  const tabs = [
    { id: 'dashboard', label: tx('Overview', 'نمای کلی'), icon: '🔥' },
    { id: 'meals', label: tx('Meals', 'وعده‌ها'), icon: '🍽️' },
    { id: 'nutrition', label: tx('Nutrition', 'ارزش غذایی'), icon: '🥗' }
  ]

  return (
    <main className="health-page health-nutrition" dir={fa ? 'rtl' : 'ltr'}>
      <header className="health-header">
        <div>
          <h1>{tx('Nutrition & Calories', 'تغذیه و کالری')}</h1>
          <p className="health-muted">
            {tx('Daily nutrition and body tracking', 'پایش تغذیه و وضعیت روزانه بدن')}
          </p>
        </div>
        <span className="health-dashboard-date">
          {fmtDateFull(todayISO(), calendar)}
        </span>
      </header>

      <nav className="health-nutrition-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            className={page === tab.id ? 'active' : ''}
            onClick={() => setPage(tab.id)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {page === 'dashboard' && (
        <section className="health-nutrition-placeholder">
          <span>🔥</span>
          <h2>{tx('Daily overview', 'نمای کلی روزانه')}</h2>
          <p>{tx(
            'Your calorie balance and body tracking tools will appear here.',
            'حلقه کالری و ابزارهای پایش بدن در این قسمت قرار می‌گیرند.'
          )}</p>
        </section>
      )}

      {page === 'meals' && (
        <section className="health-nutrition-placeholder">
          <span>🍽️</span>
          <h2>{tx('Meals', 'وعده‌های غذایی')}</h2>
          <p>{tx(
            'Breakfast, lunch, dinner and snacks will be managed here.',
            'صبحانه، ناهار، شام و میان‌وعده در این قسمت ثبت می‌شوند.'
          )}</p>
        </section>
      )}

      {page === 'nutrition' && (
        <section className="health-nutrition-placeholder">
          <span>🥗</span>
          <h2>{tx('Nutrition facts', 'ارزش غذایی')}</h2>
          <p>{tx(
            'Daily nutrition targets and consumed amounts will appear here.',
            'اهداف و مقادیر دریافتی روزانه مواد مغذی در این قسمت نمایش داده می‌شوند.'
          )}</p>
        </section>
      )}
    </main>
  )
}
