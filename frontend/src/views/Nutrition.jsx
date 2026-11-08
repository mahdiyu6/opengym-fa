
import { useState } from 'react'
import { useLang, getLang } from '../lib/i18n.js'
import { useStore } from '../store/useStore.js'
import { fmtDateFull, todayISO, fmtNum } from '../lib/format.js'
import './health-hub.css'

export default function Nutrition() {
  useLang()

  const fa = getLang() === 'fa'
  const calendar = useStore(s =>
    s.S?.calendar === 'jalali' ? 'jalali' : 'gregorian'
  )
  const nutrition = useStore(s => s.S?.nutrition || {})
  const updateStore = useStore(s => s.update)
  const workouts = useStore(s => s.S?.workouts || [])

  const today = todayISO()
  const day = nutrition.days?.[today] || {}

  const [page, setPage] = useState('dashboard')
  const [editingTarget, setEditingTarget] = useState(false)
  const [targetDraft, setTargetDraft] = useState(
    String(nutrition.targetCalories || 2000)
  )

  const tx = (en, faText) => fa ? faText : en

  const target = Number(nutrition.targetCalories || 2000)
  const consumed = Number(day.consumedCalories || 0)
  const exercise = workouts
  .filter(w => w.d === today)
  .reduce((sum, w) => sum + (Number(w.calories) || 0), 0)
  const stepsCalories = Number(day.stepsCalories || 0)
  const sleepCalories = Number(day.sleepCalories || 0)

const burned = exercise + stepsCalories + sleepCalories
const remaining = Math.max(0, target - consumed)
const progress = target > 0
  ? Math.min(100, Math.max(0, remaining / target * 100))
  : 0

  function saveDay(field, value) {
    updateStore(s => {
      s.nutrition ||= {}
      s.nutrition.days ||= {}
      s.nutrition.days[today] ||= {}
      s.nutrition.days[today][field] = Number(value) || 0
    })
  }

  function saveTarget() {
    const value = Number(targetDraft)
    if (!Number.isFinite(value) || value <= 0) return

    updateStore(s => {
      s.nutrition ||= {}
      s.nutrition.targetCalories = value
    })

    setEditingTarget(false)
  }

  const macros = [
    { label: tx('Fat', 'چربی'), value: 0, goal: '—', unit: 'g', icon: '🥑' },
    { label: tx('Protein', 'پروتئین'), value: 0, goal: '—', unit: 'g', icon: '🥩' },
    { label: tx('Carbs', 'کربوهیدرات'), value: 0, goal: '—', unit: 'g', icon: '🍚' }
  ]

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
          {fmtDateFull(today, calendar)}
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
        <>
          <section className="health-nutrition-calorie-card">
            <div className="health-nutrition-card-heading">
              <div>
                <span className="health-nutrition-eyebrow">
                  {tx('DAILY CALORIES', 'کالری روزانه')}
                </span>
                <h2>{tx('Calorie balance', 'تراز کالری')}</h2>
              </div>

              <button
                type="button"
                className="health-nutrition-edit"
                onClick={() => {
                  setTargetDraft(String(target))
                  setEditingTarget(v => !v)
                }}
              >
                ✎ {tx('Edit goal', 'ویرایش هدف')}
              </button>
            </div>

            {editingTarget && (
              <div className="health-nutrition-target-editor">
                <label>
                  {tx('Daily calorie target', 'هدف کالری روزانه')}
                  <input
                    type="number"
                    min="1"
                    value={targetDraft}
                    onChange={e => setTargetDraft(e.target.value)}
                  />
                </label>
                <button type="button" onClick={saveTarget}>
                  {tx('Save', 'ذخیره')}
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setEditingTarget(false)}
                >
                  {tx('Cancel', 'انصراف')}
                </button>
              </div>
            )}

            <div className="health-nutrition-calorie-layout">
              <div className="health-nutrition-side-stat">
                <span>{tx('Burned', 'سوزانده‌شده')}</span>
                <strong>{fmtNum(burned)}</strong>
                <small>kcal</small>
              </div>

              <div
                className="health-nutrition-ring"
                style={{ '--calorie-progress': `${progress}%` }}
                role="img"
                aria-label={`${Math.round(remaining)} calories remaining`}
              >
                <div className="health-nutrition-ring-inner">
                  <span>{tx('REMAINING', 'باقی‌مانده')}</span>
                  <strong>{fmtNum(remaining)}</strong>
                  <small>kcal</small>
                </div>
              </div>

              <div className="health-nutrition-side-stat">
                <span>{tx('Consumed', 'دریافتی')}</span>
                <strong>{fmtNum(consumed)}</strong>
                <small>kcal</small>
              </div>
            </div>

            <div className="health-nutrition-calorie-footer">
              <span>{tx('Daily target', 'هدف روزانه')}</span>
              <strong>{fmtNum(target)} kcal</strong>
            </div>
          </section>

          <section className="health-nutrition-macros">
            <div className="health-nutrition-section-title">
              <h2>{tx('Macronutrients', 'درشت‌مغذی‌ها')}</h2>
              <span>{tx("Today's intake", 'مصرف امروز')}</span>
            </div>

            <div className="health-nutrition-macro-grid">
              {macros.map(item => (
                <div className="health-nutrition-macro" key={item.label}>
                  <span className="health-nutrition-macro-icon">{item.icon}</span>
                  <strong>{item.label}</strong>
                  <div>
                    <b>{item.value}</b>
                    <span> / {item.goal} {item.unit}</span>
                  </div>
                  <div className="health-nutrition-macro-track">
                    <i style={{ width: '0%' }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="health-nutrition-tools">
            <div className="health-nutrition-section-title">
              <h2>{tx('Body & Activity', 'بدن و فعالیت')}</h2>
            </div>

            <div className="health-nutrition-tool-grid">
              <article className="health-nutrition-tool">
                <span className="health-nutrition-tool-icon">🚶</span>
                <strong>{tx('Step counter', 'قدم‌شمار')}</strong>
                <label>
                  {tx('Steps', 'تعداد قدم')}
                  <input
                    type="number"
                    min="0"
                    value={day.steps ?? ''}
                    placeholder="0"
                    onChange={e => saveDay('steps', e.target.value)}
                  />
                </label>
                <label>
                  {tx('Burned calories', 'کالری سوزانده‌شده')}
                  <input
                    type="number"
                    min="0"
                    value={day.stepsCalories ?? ''}
                    placeholder="0"
                    onChange={e => saveDay('stepsCalories', e.target.value)}
                  />
                </label>
                <small>{tx('Daily step goal: 10,000', 'هدف روزانه: ۱۰٬۰۰۰ قدم')}</small>
              </article>

              <article className="health-nutrition-tool">
                <span className="health-nutrition-tool-icon">💧</span>
                <strong>{tx('Water tracker', 'آب‌شمار')}</strong>
                <div className="health-nutrition-water-value">
                  <b>{Number(day.water || 0)}</b>
                  <span> / 8 {tx('glasses', 'لیوان')}</span>
                </div>
                <div className="health-nutrition-water-actions">
                  <button type="button" onClick={() => saveDay('water', Math.max(0, Number(day.water || 0) - 1))}>−</button>
                  <button type="button" onClick={() => saveDay('water', Number(day.water || 0) + 1)}>+</button>
                </div>
                <small>{tx('One glass = 250 ml', 'هر لیوان معادل ۲۵۰ میلی‌لیتر')}</small>
              </article>

              <article className="health-nutrition-tool">
                <span className="health-nutrition-tool-icon">🌙</span>
                <strong>{tx('Sleep', 'اطلاعات خواب')}</strong>
                <label>
                  {tx('Sleep duration (hours)', 'مدت خواب (ساعت)')}
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={day.sleepHours ?? ''}
                    placeholder="0"
                    onChange={e => saveDay('sleepHours', e.target.value)}
                  />
                </label>
                <label>
                  {tx('Estimated calories', 'کالری تخمینی')}
                  <input
                    type="number"
                    min="0"
                    value={day.sleepCalories ?? ''}
                    placeholder="0"
                    onChange={e => saveDay('sleepCalories', e.target.value)}
                  />
                </label>
              </article>

              <article className="health-nutrition-tool">
                <span className="health-nutrition-tool-icon">⚖️</span>
                <strong>{tx('Body composition', 'آنالیز بدن')}</strong>
                <p>{tx(
                  'BMI, BMR, body fat and body type',
                  'BMI، BMR، درصد چربی و تیپ بدنی'
                )}</p>
                <small>{tx('Based on body measurements', 'بر اساس اندازه‌گیری‌های بدن')}</small>
              </article>
            </div>
          </section>
        </>
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
