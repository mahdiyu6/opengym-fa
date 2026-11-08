
import { useState } from 'react'
import { useLang, getLang } from '../lib/i18n.js'
import { useStore } from '../store/useStore.js'
import { fmtDateFull, todayISO, fmtNum } from '../lib/format.js'
import './health-hub.css'

const EMPTY_NUTRITION = Object.freeze({})
const EMPTY_WORKOUTS = Object.freeze([])

const MICRONUTRIENTS = [
  { id: 'fiber', en: 'Fiber', fa: 'فیبر', unit: 'gr' },
  { id: 'vitaminA', en: 'Vitamin A', fa: 'ویتامین A', unit: 'mcg' },
  { id: 'vitaminB1', en: 'Vitamin B1', fa: 'ویتامین B1', unit: 'mg' },
  { id: 'vitaminB2', en: 'Vitamin B2', fa: 'ویتامین B2', unit: 'mg' },
  { id: 'vitaminB3', en: 'Vitamin B3', fa: 'ویتامین B3', unit: 'mg' },
  { id: 'vitaminB5', en: 'Vitamin B5', fa: 'ویتامین B5', unit: 'mg' },
  { id: 'vitaminB6', en: 'Vitamin B6', fa: 'ویتامین B6', unit: 'mg' },
  { id: 'vitaminB9', en: 'Vitamin B9', fa: 'ویتامین B9', unit: 'mcg' },
  { id: 'vitaminB12', en: 'Vitamin B12', fa: 'ویتامین B12', unit: 'mcg' },
  { id: 'vitaminC', en: 'Vitamin C', fa: 'ویتامین C', unit: 'mg' },
  { id: 'vitaminD3', en: 'Vitamin D3', fa: 'ویتامین D3', unit: 'mcg' },
  { id: 'vitaminE', en: 'Vitamin E', fa: 'ویتامین E', unit: 'mg' },
  { id: 'vitaminK', en: 'Vitamin K', fa: 'ویتامین K', unit: 'mcg' },
  { id: 'iron', en: 'Iron', fa: 'آهن', unit: 'mg' },
  { id: 'zinc', en: 'Zinc', fa: 'روی', unit: 'mg' },
  { id: 'copper', en: 'Copper', fa: 'مس', unit: 'mg' },
  { id: 'calcium', en: 'Calcium', fa: 'کلسیم', unit: 'mg' },
  { id: 'sodium', en: 'Sodium', fa: 'سدیم', unit: 'mg' },
  { id: 'potassium', en: 'Potassium', fa: 'پتاسیم', unit: 'mg' },
  { id: 'magnesium', en: 'Magnesium', fa: 'منیزیم', unit: 'mg' },
  { id: 'selenium', en: 'Selenium', fa: 'سلنیوم', unit: 'mcg' },
  { id: 'manganese', en: 'Manganese', fa: 'منگنز', unit: 'mg' },
  { id: 'phosphorus', en: 'Phosphorus', fa: 'فسفر', unit: 'mg' },
  { id: 'fluoride', en: 'Fluoride', fa: 'فلوراید', unit: 'mcg' },
  { id: 'choline', en: 'Choline', fa: 'کولین', unit: 'mg' },
  { id: 'cholesterol', en: 'Cholesterol', fa: 'کلسترول', unit: 'mg' },
  { id: 'saturatedFat', en: 'Saturated fatty acids', fa: 'اسیدهای چرب اشباع‌شده', unit: 'gr' },
  { id: 'unsaturatedFat', en: 'Unsaturated fatty acids', fa: 'اسیدهای چرب اشباع‌نشده', unit: 'gr' },
  { id: 'sugar', en: 'Sugar', fa: 'قند', unit: 'gr' }
]

export default function Nutrition() {
  useLang()

  const fa = getLang() === 'fa'
  const calendar = useStore(s =>
    s.S?.calendar === 'jalali' ? 'jalali' : 'gregorian'
  )
  const nutrition = useStore(s => s.S?.nutrition || EMPTY_NUTRITION)
  const updateStore = useStore(s => s.update)
  const workouts = useStore(s =>
  Array.isArray(s.S?.workouts) ? s.S.workouts : EMPTY_WORKOUTS
)

  const today = todayISO()
  const day = nutrition.days?.[today] || {}
  const meals = Array.isArray(day.meals) ? day.meals : []

  const foodBank = Array.isArray(nutrition.foods) ? nutrition.foods : []

const emptyFoodDraft = {
  name: '',
  unit: 'g',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
  ...Object.fromEntries(
    MICRONUTRIENTS.map(item => [item.id, ''])
  )
}

const [addingFoodFor, setAddingFoodFor] = useState(null)
const [foodDraft, setFoodDraft] = useState(emptyFoodDraft)
const [foodQuantity, setFoodQuantity] = useState('1')
  
  const [page, setPage] = useState('dashboard')
  const [editingTarget, setEditingTarget] = useState(false)
  const [targetDraft, setTargetDraft] = useState(
    String(nutrition.targetCalories || 2000)
  )
const [macroGoalsDraft, setMacroGoalsDraft] = useState({
  protein: String(nutrition.macroGoals?.protein ?? ''),
  carbs: String(nutrition.macroGoals?.carbs ?? ''),
  fat: String(nutrition.macroGoals?.fat ?? '')
})

const [editingMacroGoals, setEditingMacroGoals] = useState(false)
  const tx = (en, faText) => fa ? faText : en

  const target = Number(nutrition.targetCalories || 2000)
  const consumed = meals.length > 0
  ? meals.reduce(
      (sum, item) => sum + (Number(item.calories) || 0), 0
    )
  : Number(day.consumedCalories || 0)
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

  function saveMeals(nextMeals) {
  updateStore(s => {
    s.nutrition ||= {}
    s.nutrition.days ||= {}
    s.nutrition.days[today] ||= {}
    s.nutrition.days[today].meals = nextMeals
  })
}
  
  function saveNewFood() {
  const name = foodDraft.name.trim()
  const unit = foodDraft.unit.trim() || 'g'
  const quantity = Number(foodQuantity)

  if (!name || !addingFoodFor || !Number.isFinite(quantity) || quantity <= 0) return

  const calories = Number(foodDraft.calories) || 0
  const protein = Number(foodDraft.protein) || 0
  const carbs = Number(foodDraft.carbs) || 0
  const fat = Number(foodDraft.fat) || 0

  const existingFood = foodBank.find(food =>
    food.name.trim().toLowerCase() === name.toLowerCase() &&
    food.unit === unit &&
    Number(food.calories) === calories &&
    Number(food.protein) === protein &&
    Number(food.carbs) === carbs &&
    Number(food.fat) === fat
  )

  const food = existingFood || {
    id: `food-${Date.now()}`,
    name,
    unit,
    calories,
    protein,
    carbs,
    fat
  }

  const mealItem = {
    id: `meal-${Date.now()}`,
    foodId: food.id,
    mealType: addingFoodFor,
    name: food.name,
    unit: food.unit,
    quantity,
    calories: food.calories * quantity,
    protein: food.protein * quantity,
    carbs: food.carbs * quantity,
    fat: food.fat * quantity
  }

  updateStore(s => {
    s.nutrition ||= {}
    s.nutrition.foods ||= []

    if (!existingFood) {
      s.nutrition.foods.push(food)
    }

    s.nutrition.days ||= {}
    s.nutrition.days[today] ||= {}
    s.nutrition.days[today].meals ||= []
    s.nutrition.days[today].meals.push(mealItem)
  })

  setFoodDraft(emptyFoodDraft)
  setFoodQuantity('1')
  setAddingFoodFor(null)
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

  function saveMacroGoals() {
  const goals = {
    protein: Number(macroGoalsDraft.protein),
    carbs: Number(macroGoalsDraft.carbs),
    fat: Number(macroGoalsDraft.fat)
  }

  if (Object.values(goals).some(value =>
    !Number.isFinite(value) || value < 0
  )) return

  updateStore(s => {
    s.nutrition ||= {}
    s.nutrition.macroGoals = goals
  })

  setEditingMacroGoals(false)
}

  const macroTotals = meals.reduce((totals, item) => ({
  fat: totals.fat + (Number(item.fat) || 0),
  protein: totals.protein + (Number(item.protein) || 0),
  carbs: totals.carbs + (Number(item.carbs) || 0)
}), { fat: 0, protein: 0, carbs: 0 })

const macros = [
  { label: tx('Fat', 'چربی'), value: macroTotals.fat, goal: '—', unit: 'g', icon: '🥑' },
  { label: tx('Protein', 'پروتئین'), value: macroTotals.protein, goal: '—', unit: 'g', icon: '🥩' },
  { label: tx('Carbs', 'کربوهیدرات'), value: macroTotals.carbs, goal: '—', unit: 'g', icon: '🍚' }
]

  const tabs = [
    { id: 'dashboard', label: tx('Overview', 'نمای کلی'), icon: '🔥' },
    { id: 'meals', label: tx('Meals', 'وعده‌ها'), icon: '🍽️' },
    { id: 'nutrition', label: tx('Nutrition', 'ارزش غذایی'), icon: '🥗' }
  ]

  const mealTypes = [
  { id: 'breakfast', label: tx('Breakfast', 'صبحانه'), icon: '🌅' },
  { id: 'lunch', label: tx('Lunch', 'ناهار'), icon: '☀️' },
  { id: 'dinner', label: tx('Dinner', 'شام'), icon: '🌙' },
  { id: 'snack', label: tx('Snacks', 'میان‌وعده'), icon: '🍎' }
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
  <section className="health-nutrition-meals">
    <div className="health-nutrition-section-title">
      <h2>{tx('Daily meals', 'وعده‌های غذایی امروز')}</h2>
      <span>
        {fmtNum(meals.reduce(
          (sum, item) => sum + (Number(item.calories) || 0), 0
        ))} kcal
      </span>
    </div>

    <div className="health-nutrition-meal-list">
      {mealTypes.map(type => {
        const items = meals.filter(item => item.mealType === type.id)
        const calories = items.reduce(
          (sum, item) => sum + (Number(item.calories) || 0), 0
        )

        return (
          <article className="health-nutrition-meal-card" key={type.id}>
            <div className="health-nutrition-meal-heading">
              <div className="health-nutrition-meal-name">
                <span>{type.icon}</span>
                <div>
                  <strong>{type.label}</strong>
                  <small>
                    {items.length} {tx('items', 'مورد')}
                  </small>
                </div>
              </div>

              <strong className="health-nutrition-meal-calories">
                {fmtNum(calories)} kcal
              </strong>
            </div>

                        <button
              type="button"
              className="health-nutrition-add-food"
              onClick={() => {
                setAddingFoodFor(type.id)
                setFoodDraft(emptyFoodDraft)
                setFoodQuantity('1')
              }}
            >
              + {tx('Add food', 'افزودن غذا')}
            </button>

            {addingFoodFor === type.id && (
              <div className="health-nutrition-food-form">
                <h3>{tx('New food', 'ثبت غذای جدید')}</h3>
                
{foodBank.length > 0 && (
  <label>
    {tx('Choose from food bank', 'انتخاب از بانک غذا')}
    <select
      defaultValue=""
      onChange={e => {
        const food = foodBank.find(item => item.id === e.target.value)
        if (!food) return

        setFoodDraft({
          name: food.name,
          unit: food.unit,
          calories: String(food.calories),
          protein: String(food.protein),
          carbs: String(food.carbs),
          fat: String(food.fat)
        })
        setFoodQuantity('1')
      }}
    >
      <option value="">
        {tx('Select a saved food', 'انتخاب غذای ذخیره‌شده')}
      </option>
      {foodBank.map(food => (
        <option key={food.id} value={food.id}>
          {food.name}
        </option>
      ))}
    </select>
  </label>
)}
                <label>
                  {tx('Food name', 'نام غذا')}
                  <input
                    value={foodDraft.name}
                    onChange={e => setFoodDraft(v => ({ ...v, name: e.target.value }))}
                    placeholder={tx('e.g. Rice', 'مثلاً برنج')}
                  />
                </label>

                <label>
                  {tx('Unit', 'واحد اندازه‌گیری')}
                  <input
                    value={foodDraft.unit}
                    onChange={e => setFoodDraft(v => ({ ...v, unit: e.target.value }))}
                    placeholder="g"
                  />
                </label>

                <label>
                  {tx('Quantity', 'تعداد واحد مصرفی')}
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={foodQuantity}
                    onChange={e => setFoodQuantity(e.target.value)}
                  />
                </label>

                <label>
                  {tx('Calories per unit', 'کالری هر واحد')}
                  <input
                    type="number"
                    min="0"
                    value={foodDraft.calories}
                    onChange={e => setFoodDraft(v => ({ ...v, calories: e.target.value }))}
                  />
                </label>

                <label>
                  {tx('Protein (g)', 'پروتئین (گرم)')}
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={foodDraft.protein}
                    onChange={e => setFoodDraft(v => ({ ...v, protein: e.target.value }))}
                  />
                </label>

                <label>
                  {tx('Carbs (g)', 'کربوهیدرات (گرم)')}
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={foodDraft.carbs}
                    onChange={e => setFoodDraft(v => ({ ...v, carbs: e.target.value }))}
                  />
                </label>

                <label>
                  {tx('Fat (g)', 'چربی (گرم)')}
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={foodDraft.fat}
                    onChange={e => setFoodDraft(v => ({ ...v, fat: e.target.value }))}
                  />
                </label>

                <div className="health-nutrition-food-actions">
                  <button type="button" onClick={saveNewFood}>
                    {tx('Save food', 'ثبت غذا')}
                  </button>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => setAddingFoodFor(null)}
                  >
                    {tx('Cancel', 'انصراف')}
                  </button>
                </div>
              </div>
            )}
            {items.length > 0 ? (
              <div className="health-nutrition-meal-items">
                {items.map(item => (
                  <div className="health-nutrition-meal-item" key={item.id}>
                    <span>{item.name}</span>
                    <small>
                      {item.quantity} {item.unit}
                    </small>
                    <strong>{fmtNum(item.calories)} kcal</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="health-nutrition-meal-empty">
                {tx('No food added yet', 'هنوز غذایی ثبت نشده است')}
              </p>
            )}
          </article>
        )
      })}
    </div>
  </section>
)}

{page === 'nutrition' && (
  <section className="health-nutrition-facts">
    <div className="health-nutrition-section-title">
      <h2>{tx('Daily nutrition', 'ارزش غذایی امروز')}</h2>

      <button
        type="button"
        className="health-nutrition-edit"
        onClick={() => {
          setMacroGoalsDraft({
            protein: String(nutrition.macroGoals?.protein ?? ''),
            carbs: String(nutrition.macroGoals?.carbs ?? ''),
            fat: String(nutrition.macroGoals?.fat ?? '')
          })
          setEditingMacroGoals(v => !v)
        }}
      >
        ✎ {tx('Edit macro goals', 'ویرایش اهداف درشت‌مغذی‌ها')}
      </button>
    </div>

    {editingMacroGoals && (
      <div className="health-nutrition-target-editor">
        <label>
          {tx('Protein target (g)', 'هدف پروتئین (گرم)')}
          <input
            type="number"
            min="0"
            step="0.1"
            value={macroGoalsDraft.protein}
            onChange={e => setMacroGoalsDraft(v => ({
              ...v, protein: e.target.value
            }))}
          />
        </label>

        <label>
          {tx('Carbohydrate target (g)', 'هدف کربوهیدرات (گرم)')}
          <input
            type="number"
            min="0"
            step="0.1"
            value={macroGoalsDraft.carbs}
            onChange={e => setMacroGoalsDraft(v => ({
              ...v, carbs: e.target.value
            }))}
          />
        </label>

        <label>
          {tx('Fat target (g)', 'هدف چربی (گرم)')}
          <input
            type="number"
            min="0"
            step="0.1"
            value={macroGoalsDraft.fat}
            onChange={e => setMacroGoalsDraft(v => ({
              ...v, fat: e.target.value
            }))}
          />
        </label>

        <div className="health-nutrition-food-actions">
          <button type="button" onClick={saveMacroGoals}>
            {tx('Save goals', 'ذخیره اهداف')}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => setEditingMacroGoals(false)}
          >
            {tx('Cancel', 'انصراف')}
          </button>
        </div>
      </div>
    )}

    <h3 className="health-nutrition-facts-heading">
      {tx('Macronutrients', 'درشت‌مغذی‌ها')}
    </h3>

    <div className="health-nutrition-facts-table">
      <div
        className="health-nutrition-facts-row header"
        style={{ gridTemplateColumns: 'minmax(0,1.4fr) repeat(2,minmax(0,1fr))', minWidth: 0 }}
      >
        <strong>{tx('Nutrient', 'ماده مغذی')}</strong>
        <strong>{tx('Goal', 'هدف')}</strong>
        <strong>{tx('Consumed', 'دریافتی')}</strong>
      </div>

      {[
        { id: 'calories', label: tx('Calories', 'کالری'), value: consumed, goal: target, unit: 'kcal' },
        { id: 'protein', label: tx('Protein', 'پروتئین'), value: macroTotals.protein, goal: nutrition.macroGoals?.protein, unit: 'g' },
        { id: 'carbs', label: tx('Carbohydrates', 'کربوهیدرات'), value: macroTotals.carbs, goal: nutrition.macroGoals?.carbs, unit: 'g' },
        { id: 'fat', label: tx('Fat', 'چربی'), value: macroTotals.fat, goal: nutrition.macroGoals?.fat, unit: 'g' }
      ].map(item => (
        <div
          className="health-nutrition-facts-row"
          key={item.id}
          style={{ gridTemplateColumns: 'minmax(0,1.4fr) repeat(2,minmax(0,1fr))', minWidth: 0 }}
        >
          <span>{item.label}</span>
          <strong>
            {item.goal !== undefined && item.goal !== null && item.goal !== ''
              ? `${fmtNum(Number(item.goal))} ${item.unit}`
              : '—'}
          </strong>
          <strong>{fmtNum(Number(item.value.toFixed(1)))} {item.unit}</strong>
        </div>
      ))}
    </div>

    <h3 className="health-nutrition-facts-heading">
      {tx('Micronutrients', 'ریزمغذی‌ها')}
    </h3>

    <div className="health-nutrition-facts-table">
      <div
        className="health-nutrition-facts-row header"
        style={{ gridTemplateColumns: 'minmax(0,1.4fr) repeat(2,minmax(0,1fr))', minWidth: 0 }}
      >
        <strong>{tx('Nutrient', 'ماده مغذی')}</strong>
        <strong>{tx('Goal', 'هدف')}</strong>
        <strong>{tx('Consumed', 'دریافتی')}</strong>
      </div>

      {[
        ['fiber', 'Fiber', 'فیبر', 'gr'],
        ['vitaminA', 'Vitamin A', 'ویتامین A', 'mcg'],
        ['vitaminB1', 'Vitamin B1', 'ویتامین B1', 'mg'],
        ['vitaminB2', 'Vitamin B2', 'ویتامین B2', 'mg'],
        ['vitaminB3', 'Vitamin B3', 'ویتامین B3', 'mg'],
        ['vitaminB5', 'Vitamin B5', 'ویتامین B5', 'mg'],
        ['vitaminB6', 'Vitamin B6', 'ویتامین B6', 'mg'],
        ['vitaminB9', 'Vitamin B9', 'ویتامین B9', 'mcg'],
        ['vitaminB12', 'Vitamin B12', 'ویتامین B12', 'mcg'],
        ['vitaminC', 'Vitamin C', 'ویتامین C', 'mg'],
        ['vitaminD3', 'Vitamin D3', 'ویتامین D3', 'mcg'],
        ['vitaminE', 'Vitamin E', 'ویتامین E', 'mg'],
        ['vitaminK', 'Vitamin K', 'ویتامین K', 'mcg'],
        ['iron', 'Iron', 'آهن', 'mg'],
        ['zinc', 'Zinc', 'روی', 'mg'],
        ['copper', 'Copper', 'مس', 'mg'],
        ['calcium', 'Calcium', 'کلسیم', 'mg'],
        ['sodium', 'Sodium', 'سدیم', 'mg'],
        ['potassium', 'Potassium', 'پتاسیم', 'mg'],
        ['magnesium', 'Magnesium', 'منیزیم', 'mg'],
        ['selenium', 'Selenium', 'سلنیوم', 'mcg'],
        ['manganese', 'Manganese', 'منگنز', 'mg'],
        ['phosphorus', 'Phosphorus', 'فسفر', 'mg'],
        ['fluoride', 'Fluoride', 'فلوراید', 'mcg'],
        ['choline', 'Choline', 'کولین', 'mg'],
        ['cholesterol', 'Cholesterol', 'کلسترول', 'mg'],
        ['saturatedFat', 'Saturated fatty acids', 'اسیدهای چرب اشباع‌شده', 'gr'],
        ['unsaturatedFat', 'Unsaturated fatty acids', 'اسیدهای چرب اشباع‌نشده', 'gr'],
        ['sugar', 'Sugar', 'قند', 'gr']
      ].map(([id, en, faLabel, unit]) => (
        <div
          className="health-nutrition-facts-row"
          key={id}
          style={{ gridTemplateColumns: 'minmax(0,1.4fr) repeat(2,minmax(0,1fr))', minWidth: 0 }}
        >
          <span>{tx(en, faLabel)}</span>
          <strong>— {unit}</strong>
          <strong>— {unit}</strong>
        </div>
      ))}
    </div>
  </section>
)}
    </main>
  )
}
