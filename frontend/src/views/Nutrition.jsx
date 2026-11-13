
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang, getLang } from '../lib/i18n.js'
import { useStore } from '../store/useStore.js'
import { fmtDateFull, todayISO, fmtNum } from '../lib/format.js'
import {
  MICRONUTRIENT_CATALOG,
  MICRONUTRIENT_GROUPS,
  normalizeMicronutrients,
  scaleMicronutrients
} from '../lib/usdaNutrients.js'
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
  
  const nav = useNavigate()
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
  nutritionBasis: 'perUnit',
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
const [foodSearch, setFoodSearch] = useState('')
const [foodDraft, setFoodDraft] = useState(emptyFoodDraft)
const [foodQuantity, setFoodQuantity] = useState('1')
const [selectedFoodId, setSelectedFoodId] = useState('')
const [editingMealItemId, setEditingMealItemId] = useState(null)
const [editingMealQuantity, setEditingMealQuantity] = useState('')
const [editingFoodId, setEditingFoodId] = useState(null)
const [editingFoodDraft, setEditingFoodDraft] = useState(emptyFoodDraft)
const [foodBankImportMessage, setFoodBankImportMessage] = useState('')
const [foodBankImporting, setFoodBankImporting] = useState(false)
  
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
  const [microGoalsDraft, setMicroGoalsDraft] = useState(
  Object.fromEntries(
    MICRONUTRIENTS.map(item => [
      item.id,
      String(nutrition.microGoals?.[item.id] ?? '')
    ])
  )
)
const [editingMicroGoals, setEditingMicroGoals] = useState(false)
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

  async function importFoodBankJSON(event) {
  const file = event.target.files?.[0]
  event.target.value = ''

  if (!file) return

  setFoodBankImportMessage('')
  setFoodBankImporting(true)

  try {
    const parsed = JSON.parse(await file.text())
    const records = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed.foods)
        ? parsed.foods
        : []

    if (!records.length) {
      throw new Error('No food records found')
    }

    const validFoods = records.filter(food =>
      food &&
      (food.fdcId || food.id) &&
      (food.name || food.nameEn) &&
      Number.isFinite(Number(food.calories)) &&
      Number.isFinite(Number(food.protein)) &&
      Number.isFinite(Number(food.carbs)) &&
      Number.isFinite(Number(food.fat))
    )

    if (!validFoods.length) {
      throw new Error('No valid food records')
    }

    const importedFoods = validFoods.map(food => ({
      ...food,
      id: food.id || `usda-fdc-${food.fdcId}`,
      name: food.name || food.nameEn,
      nameEn: food.nameEn || food.name || '',
      nutritionBasis: 'per100g',
      unit: 'g',
      unsaturatedFat:
        food.unsaturatedFat ??
        (
          Number(food.fattyAcidsSourceComponents?.monounsaturated || 0) +
          Number(food.fattyAcidsSourceComponents?.polyunsaturated || 0)
        )
    }))

    let added = 0
    let skipped = 0

    updateStore(s => {
      s.nutrition ||= {}
      s.nutrition.foods ||= []

      const existingIds = new Set(
        s.nutrition.foods.map(food => String(food.id))
      )

      const existingFdcIds = new Set(
        s.nutrition.foods
          .filter(food => food.fdcId)
          .map(food => String(food.fdcId))
      )

      for (const food of importedFoods) {
        if (
          existingIds.has(String(food.id)) ||
          (food.fdcId && existingFdcIds.has(String(food.fdcId)))
        ) {
          skipped++
          continue
        }

        s.nutrition.foods.push(food)
        existingIds.add(String(food.id))
        if (food.fdcId) existingFdcIds.add(String(food.fdcId))
        added++
      }
    })

    setFoodBankImportMessage(
      tx(
        `Import complete: ${added} added, ${skipped} already existed.`,
        `ورود اطلاعات انجام شد: ${added} غذا اضافه شد و ${skipped} مورد تکراری رد شد.`
      )
    )
  } catch (error) {
    setFoodBankImportMessage(
      tx(
        'Import failed. Please check the JSON file format.',
        'ورود ناموفق بود؛ ساختار فایل JSON را بررسی کن.'
      )
    )
  } finally {
    setFoodBankImporting(false)
  }
}
  
  function saveNewFood() {
  const name = foodDraft.name.trim()
  const unit = foodDraft.unit.trim() || 'g'
  const quantity = Number(foodQuantity)
  const isFoodBankOnly = addingFoodFor === 'foodbank'

  if (!name || !addingFoodFor) return
  if (!isFoodBankOnly && (!Number.isFinite(quantity) || quantity <= 0)) return

const nutrients = Object.fromEntries(
  MICRONUTRIENTS.map(item => [
    item.id,
    foodDraft[item.id] === ''
      ? null
      : Number(foodDraft[item.id]) || 0
  ])
)

  const food = {
    id: `food-${Date.now()}`,
    nutritionBasis: foodDraft.nutritionBasis || 'perUnit',
    name,
    unit,
    calories: Number(foodDraft.calories) || 0,
    protein: Number(foodDraft.protein) || 0,
    carbs: Number(foodDraft.carbs) || 0,
    fat: Number(foodDraft.fat) || 0,
    ...nutrients
  }

 const existingFood = foodBank.find(item =>
  item.name.trim().toLowerCase() === name.toLowerCase() &&
  item.unit === unit &&
  (item.nutritionBasis || 'perUnit') ===
    (food.nutritionBasis || 'perUnit')
)

  const savedFood = existingFood || food

  updateStore(s => {
    s.nutrition ||= {}
    s.nutrition.foods ||= []

    if (!existingFood) {
      s.nutrition.foods.push(food)
    }

    if (!isFoodBankOnly) {
      const nutritionScale = savedFood.nutritionBasis === 'per100g'
  ? quantity / 100
  : quantity
      const mealItem = {
        id: `meal-${Date.now()}`,
        foodId: savedFood.id,
        mealType: addingFoodFor,
        name: savedFood.name,
        unit: savedFood.unit,
        quantity,
nutritionBasis: savedFood.nutritionBasis || 'perUnit',
calories: savedFood.calories * nutritionScale,
protein: savedFood.protein * nutritionScale,
carbs: savedFood.carbs * nutritionScale,
fat: savedFood.fat * nutritionScale,
        ...Object.fromEntries(
MICRONUTRIENTS.map(item => [
  item.id,
  savedFood[item.id] == null
    ? null
    : Number(savedFood[item.id]) * nutritionScale
])
        )
      }

      s.nutrition.days ||= {}
      s.nutrition.days[today] ||= {}
      s.nutrition.days[today].meals ||= []
      s.nutrition.days[today].meals.push(mealItem)
    }
  })

if (isFoodBankOnly) {
  setAddingFoodFor(null)
} else {
  setFoodDraft(emptyFoodDraft)
  setFoodQuantity('1')
  setSelectedFoodId('')
}
}
  function saveFoodBankEdit() {
  const name = editingFoodDraft.name.trim()
  const unit = editingFoodDraft.unit.trim() || 'g'

  if (!name || !editingFoodId) return

const nutrients = Object.fromEntries(
  MICRONUTRIENTS.map(item => [
    item.id,
    editingFoodDraft[item.id] === ''
      ? null
      : Number(editingFoodDraft[item.id]) || 0
  ])
)

  const updatedFood = {
    id: editingFoodId,
    name,
    nutritionBasis: editingFoodDraft.nutritionBasis || 'perUnit',
    unit,
    calories: Number(editingFoodDraft.calories) || 0,
    protein: Number(editingFoodDraft.protein) || 0,
    carbs: Number(editingFoodDraft.carbs) || 0,
    fat: Number(editingFoodDraft.fat) || 0,
    ...nutrients
  }

  updateStore(s => {
    s.nutrition ||= {}
s.nutrition.foods = (s.nutrition.foods || []).map(food =>
  food.id === editingFoodId
    ? { ...food, ...updatedFood }
    : food
)
  })

  setEditingFoodId(null)
}

function deleteFoodBankItem(foodId) {
  updateStore(s => {
    s.nutrition ||= {}
    s.nutrition.foods = (s.nutrition.foods || []).filter(
      food => food.id !== foodId
    )
  })

  if (editingFoodId === foodId) {
    setEditingFoodId(null)
  }
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

function saveMicroGoals() {
  const goals = {}

  for (const item of MICRONUTRIENTS) {
    const raw = microGoalsDraft[item.id]
    if (raw === '') {
      goals[item.id] = null
      continue
    }

    const value = Number(raw)
    if (!Number.isFinite(value) || value < 0) return

    goals[item.id] = value
  }

  updateStore(s => {
    s.nutrition ||= {}
    s.nutrition.microGoals = goals
  })

  setEditingMicroGoals(false)
}
  
  const macroTotals = meals.reduce((totals, item) => ({
  fat: totals.fat + (Number(item.fat) || 0),
  protein: totals.protein + (Number(item.protein) || 0),
  carbs: totals.carbs + (Number(item.carbs) || 0)
}), { fat: 0, protein: 0, carbs: 0 })

const microTotals = meals.reduce((totals, item) => {
  MICRONUTRIENTS.forEach(nutrient => {
    const value = item[nutrient.id]

    if (value != null && value !== '') {
      totals[nutrient.id].sum += Number(value) || 0
      totals[nutrient.id].count += 1
    }
  })

  return totals
}, Object.fromEntries(
  MICRONUTRIENTS.map(item => [
    item.id,
    { sum: 0, count: 0 }
  ])
))
  
const macros = [
  { label: tx('Fat', 'چربی'), value: macroTotals.fat, goal: '—', unit: 'g', icon: '🥑' },
  { label: tx('Protein', 'پروتئین'), value: macroTotals.protein, goal: '—', unit: 'g', icon: '🥩' },
  { label: tx('Carbs', 'کربوهیدرات'), value: macroTotals.carbs, goal: '—', unit: 'g', icon: '🍚' }
]

const tabs = [
  { id: 'meals', label: tx('Meals', 'وعده‌ها'), icon: '🍽️' },
  { id: 'nutrition', label: tx('Nutrition', 'ارزش غذایی'), icon: '🥗' },
  { id: 'foodbank', label: tx('Food Bank', 'بانک غذا'), icon: '📚' }
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
    <div className="health-title-row">
      <h1>{tx('Nutrition & Calories', 'تغذیه و کالری')}</h1>

      <button
        type="button"
        className="health-secondary health-back"
        onClick={() => nav('/health')}
      >
        {tx('‹ Back', '‹ بازگشت')}
      </button>
    </div>

    <div className="health-title-row">
      <p className="health-muted">
        {tx('Daily nutrition and body tracking', 'پایش تغذیه و وضعیت روزانه بدن')}
      </p>

      <span className="health-dashboard-date">
        {fmtDateFull(today, calendar)}
      </span>
    </div>
  </div>
</header>

{page === 'dashboard' ? (
  <nav className="health-nutrition-tabs">
    {tabs.map(tab => (
      <button
        key={tab.id}
        type="button"
        onClick={() => setPage(tab.id)}
      >
        <span>{tab.icon}</span>
        {tab.label}
      </button>
    ))}
  </nav>
) : (
  <div className="health-nutrition-section-title">
    <button
      type="button"
      className="health-nutrition-edit"
      onClick={() => setPage('dashboard')}
    >
      ← {tx('Back', 'بازگشت')}
    </button>

    <h2>
  {page === 'meals'
    ? tx('Daily meals', 'وعده‌های غذایی امروز')
    : page === 'foodbank'
      ? tx('Food Bank', 'بانک غذا')
      : tx('Nutrition', 'ارزش غذایی')}
</h2>
  </div>
)}
{page === 'foodbank' && (
  <section className="health-nutrition-meals health-nutrition-foodbank-page">
    <div className="health-nutrition-section-title">
      <span>{foodBank.length} {tx('saved foods', 'غذای ذخیره‌شده')}</span>
    </div>
    <label className="health-nutrition-add-food">
  {foodBankImporting
    ? tx('Importing...', 'در حال ورود اطلاعات...')
    : tx('Import food bank JSON', 'ورود فایل بانک غذا')}
  <input
    type="file"
    accept=".json,application/json"
    disabled={foodBankImporting}
    onChange={importFoodBankJSON}
    style={{ display: 'none' }}
  />
</label>

{foodBankImportMessage && (
  <p className="health-muted" role="status">
    {foodBankImportMessage}
  </p>
)}
<button
  type="button"
  className="health-nutrition-add-food"
  onClick={() => {
    setFoodDraft(emptyFoodDraft)
    setFoodQuantity('1')
    setAddingFoodFor('foodbank')
  }}
>
  + {tx('Create new food', 'تعریف غذای جدید')}
</button>
   {addingFoodFor === 'foodbank' && (
  <div className="health-nutrition-food-form">
    <h3 className="health-nutrition-form-title">
      {tx('New food details', 'مشخصات غذای جدید')}
    </h3>

    <div className="health-nutrition-form-section">
      <div className="health-nutrition-food-identity">
        <label>
          {tx('Food name', 'نام غذا')}
          <input
            value={foodDraft.name}
            onChange={e => setFoodDraft(v => ({ ...v, name: e.target.value }))}
            placeholder={tx('e.g. Bread', 'مثلاً نان')}
          />
        </label>

        <label>
          {tx('Measurement unit', 'واحد اندازه‌گیری')}
          <input
            value={foodDraft.unit}
            onChange={e => setFoodDraft(v => ({ ...v, unit: e.target.value }))}
            placeholder={tx('g, spoon, slice, piece', 'گرم، قاشق، اسلایس، عدد')}
          />
        </label>
      </div>
    </div>

    <div className="health-nutrition-form-section">
      <strong>{tx('Nutrition per unit', 'ارزش غذایی هر واحد')}</strong>

      <div className="health-nutrition-food-macros">
        {[
          ['calories', 'Calories (kcal)', 'کالری (کیلوکالری)'],
          ['protein', 'Protein (g)', 'پروتئین (گرم)'],
          ['carbs', 'Carbs (g)', 'کربوهیدرات (گرم)'],
          ['fat', 'Fat (g)', 'چربی (گرم)']
        ].map(([key, en, faText]) => (
          <label key={key}>
            {tx(en, faText)}
            <input
              type="number"
              min="0"
              step="any"
              value={foodDraft[key]}
              onChange={e => setFoodDraft(v => ({
                ...v,
                [key]: e.target.value
              }))}
              placeholder="0"
            />
          </label>
        ))}
      </div>
    </div>

    <details className="health-nutrition-micro-editor">
      <summary>
        {tx('Micronutrients & More', 'ریزمغذی‌ها و سایر موارد')}
      </summary>

      <div className="health-nutrition-micro-grid">
        {MICRONUTRIENTS.map(item => (
          <label key={item.id}>
            {tx(item.en, item.fa)} ({item.unit})
            <input
              type="number"
              min="0"
              step="any"
              value={foodDraft[item.id] ?? ''}
              onChange={e => setFoodDraft(v => ({
                ...v,
                [item.id]: e.target.value
              }))}
              placeholder="0"
            />
          </label>
        ))}
      </div>
    </details>

    <div className="health-nutrition-food-actions">
      <button type="button" onClick={saveNewFood}>
        {tx('Save to food bank', 'ذخیره در بانک غذا')}
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
    <input
      type="search"
      className="health-nutrition-bank-search"
      value={foodSearch}
      onChange={e => setFoodSearch(e.target.value)}
      placeholder={tx('Search foods...', 'جست‌وجوی غذا...')}
    />

    {foodBank.length > 0 ? (
      <div className="health-nutrition-meal-list">
        {foodBank
          .filter(food =>
            food.name.toLowerCase().includes(foodSearch.trim().toLowerCase())
          )
          .map(food => (
            <article className="health-nutrition-meal-card" key={food.id}>
              <div className="health-nutrition-meal-heading">
                <div className="health-nutrition-meal-name">
                  <span>🍽️</span>
                  <div>
                    <strong>{food.name}</strong>
                    <small>
  {food.nutritionBasis === 'per100g'
    ? tx('Per 100 g', 'به ازای هر ۱۰۰ گرم')
    : tx('Per unit:', 'به ازای هر واحد:')}
  {food.nutritionBasis === 'per100g' ? '' : ` ${food.unit}`}
</small>
                  </div>
                </div>
                <strong className="health-nutrition-meal-calories">
                  {fmtNum(food.calories)} kcal
                </strong>
              </div>
              <div className="health-nutrition-food-macro-summary">
  {[
    { key: 'protein', label: tx('Protein', 'پروتئین') },
    { key: 'carbs', label: tx('Carbs', 'کربوهیدرات') },
    { key: 'fat', label: tx('Fat', 'چربی') }
  ].map(item => (
    <div className="health-nutrition-food-macro-item" key={item.key}>
      <span>{item.label}</span>
      <strong>
        {food[item.key] !== null &&
         food[item.key] !== undefined &&
         food[item.key] !== ''
          ? `${fmtNum(Number(food[item.key]))} g`
          : '—'}
      </strong>
    </div>
  ))}
</div>
              <div className="health-nutrition-food-actions">
  <button
    type="button"
    className="secondary"
    onClick={() => {
      setEditingFoodId(food.id)
setEditingFoodDraft({
  name: food.name || '',
  nutritionBasis: food.nutritionBasis || 'perUnit',
  unit: food.unit || 'g',
        calories: String(food.calories ?? ''),
        protein: String(food.protein ?? ''),
        carbs: String(food.carbs ?? ''),
        fat: String(food.fat ?? ''),
        ...Object.fromEntries(
          MICRONUTRIENTS.map(item => [
            item.id,
            String(food[item.id] ?? '')
          ])
        )
      })
    }}
  >
    {tx('Edit food', 'ویرایش غذا')}
  </button>

  <button
    type="button"
    className="secondary"
    onClick={() => {
      if (window.confirm(tx(
        'Delete this food from the food bank?',
        'این غذا از بانک غذا حذف شود؟'
      ))) {
        deleteFoodBankItem(food.id)
      }
    }}
  >
    {tx('Delete', 'حذف')}
  </button>
</div>
             {editingFoodId === food.id && (
  <div className="health-nutrition-food-form health-nutrition-edit-form">
    <h3 className="health-nutrition-form-title">
      {tx('Edit food details', 'ویرایش مشخصات غذا')}
    </h3>

    <div className="health-nutrition-form-section">
      <div className="health-nutrition-food-identity">
        <label>
          {tx('Food name', 'نام غذا')}
          <input
            value={editingFoodDraft.name}
            onChange={e => setEditingFoodDraft(v => ({
              ...v, name: e.target.value
            }))}
          />
        </label>

        <label>
          {tx('Measurement unit', 'واحد اندازه‌گیری')}
          <input
            value={editingFoodDraft.unit}
            onChange={e => setEditingFoodDraft(v => ({
              ...v, unit: e.target.value
            }))}
          />
        </label>
      </div>
    </div>

    <div className="health-nutrition-form-section">
      <strong>
  {editingFoodDraft.nutritionBasis === 'per100g'
    ? tx('Nutrition per 100 g', 'ارزش غذایی در هر ۱۰۰ گرم')
    : tx('Nutrition per unit', 'ارزش غذایی هر واحد')}
      </strong>

      <div className="health-nutrition-food-macros">
        {[
          ['calories', 'Calories (kcal)', 'کالری (کیلوکالری)'],
          ['protein', 'Protein (g)', 'پروتئین (گرم)'],
          ['carbs', 'Carbs (g)', 'کربوهیدرات (گرم)'],
          ['fat', 'Fat (g)', 'چربی (گرم)']
        ].map(([key, en, faText]) => (
          <label key={key}>
            {tx(en, faText)}
            <input
              type="number"
              min="0"
              step="any"
              value={editingFoodDraft[key]}
              onChange={e => setEditingFoodDraft(v => ({
                ...v, [key]: e.target.value
              }))}
            />
          </label>
        ))}
      </div>
    </div>

    <details className="health-nutrition-micro-editor">
      <summary>
        {tx('Micronutrients & More', 'ریزمغذی‌ها و سایر موارد')}
      </summary>

      <div className="health-nutrition-micro-grid">
        {MICRONUTRIENTS.map(item => (
          <label key={item.id}>
            {tx(item.en, item.fa)} ({item.unit})
            <input
              type="number"
              min="0"
              step="any"
              value={editingFoodDraft[item.id] ?? ''}
              onChange={e => setEditingFoodDraft(v => ({
                ...v, [item.id]: e.target.value
              }))}
            />
          </label>
        ))}
      </div>
    </details>

    <div className="health-nutrition-food-actions">
      <button type="button" onClick={saveFoodBankEdit}>
        {tx('Save changes', 'ذخیره تغییرات')}
      </button>

      <button
        type="button"
        className="secondary"
        onClick={() => setEditingFoodId(null)}
      >
        {tx('Cancel', 'انصراف')}
      </button>
    </div>
  </div>
)}
<details className="health-nutrition-micro-editor">
  <summary>
    {tx('Micronutrient details', 'جزئیات ریزمغذی‌ها')}
  </summary>

  <div className="health-nutrition-meal-items">
    {MICRONUTRIENTS.map(item => (
      <div className="health-nutrition-meal-item" key={item.id}>
        <span>{tx(item.en, item.fa)}</span>
        <strong>
          {food[item.id] !== null &&
           food[item.id] !== undefined &&
           food[item.id] !== ''
            ? `${fmtNum(Number(food[item.id]))} ${item.unit}`
            : '—'}
        </strong>
      </div>
    ))}
  </div>
</details>
            </article>
          ))}
      </div>
    ) : (
      <p className="health-nutrition-meal-empty">
        {tx(
          'Your food bank is empty. Foods you save will appear here.',
          'بانک غذای شما هنوز خالی است. غذاهایی که ذخیره کنید اینجا نمایش داده می‌شوند.'
        )}
      </p>
    )}
  </section>
)}
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
            </div>
          </section>
        </>
      )}

{page === 'meals' && (
  <section className="health-nutrition-meals">
    <div className="health-nutrition-section-title">
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
                
<h3 className="health-nutrition-form-title">
  {tx('Add food to meal', 'افزودن غذا به وعده')}
</h3>

{foodBank.length > 0 && (
  <label className="health-nutrition-bank-picker">
    {tx('Choose a saved food', 'انتخاب از بانک غذا')}
    <select
  value={selectedFoodId}
  onChange={e => {
    const food = foodBank.find(item => item.id === e.target.value)
    setSelectedFoodId(e.target.value)
        if (!food) return

setFoodDraft({
  name: food.name,
  nutritionBasis: food.nutritionBasis || 'perUnit',
  unit: food.unit,
          calories: String(food.calories ?? ''),
          protein: String(food.protein ?? ''),
          carbs: String(food.carbs ?? ''),
          fat: String(food.fat ?? ''),
          ...Object.fromEntries(
            MICRONUTRIENTS.map(item => [
              item.id,
              String(food[item.id] ?? '')
            ])
          )
        })
        setFoodQuantity('1')
      }}
    >
      <option value="">
        {tx('Select from food bank', 'انتخاب غذای ذخیره‌شده')}
      </option>
      {foodBank.map(food => (
        <option key={food.id} value={food.id}>
          {food.name}
        </option>
      ))}
    </select>
  </label>
)}

<div className="health-nutrition-form-section">
  <strong>{tx('Food details', 'مشخصات غذا')}</strong>
  <div className="health-nutrition-food-identity">
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
        placeholder={tx('e.g. spoon, slice, piece', 'مثلاً قاشق، اسلایس، عدد')}
      />
    </label>

    <label>
      {foodDraft.nutritionBasis === 'per100g'
  ? tx('Amount consumed (g)', 'مقدار مصرف (گرم)')
  : tx('Quantity consumed', 'تعداد واحد مصرفی')}
      <input
        type="number"
        min="0.1"
        step="0.1"
        value={foodQuantity}
        onChange={e => setFoodQuantity(e.target.value)}
        placeholder="1"
      />
    </label>
  </div>
</div>

<div className="health-nutrition-form-section">
<strong>
  {foodDraft.nutritionBasis === 'per100g'
    ? tx('Nutrition per 100 g', 'ارزش غذایی در هر ۱۰۰ گرم')
    : tx('Nutrition per unit', 'ارزش غذایی هر واحد')}
</strong>
<small>
  {foodDraft.nutritionBasis === 'per100g'
    ? tx(
        'Enter nutritional values for 100 grams. The consumed amount will be calculated in grams.',
        'مقادیر غذایی را برای ۱۰۰ گرم وارد کن؛ مقدار مصرف برحسب گرم محاسبه می‌شود.'
      )
    : tx(
        'Enter the nutritional values for one unit, not the total quantity.',
        'مقادیر زیر را برای یک واحد وارد کن، نه کل تعداد مصرفی.'
      )}
</small>

  <div className="health-nutrition-food-macros">
    <label>
      {tx('Calories (kcal)', 'کالری (کیلوکالری)')}
      <input
        type="number"
        min="0"
        value={foodDraft.calories}
        onChange={e => setFoodDraft(v => ({ ...v, calories: e.target.value }))}
        placeholder="0"
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
        placeholder="0"
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
        placeholder="0"
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
        placeholder="0"
      />
    </label>
  </div>
</div>

<details className="health-nutrition-micro-editor">
  <summary>
    {tx('Micronutrients & More', 'ریزمغذی‌ها و سایر موارد')}
    <span>29</span>
  </summary>

  <div className="health-nutrition-micro-grid">
    {MICRONUTRIENTS.map(item => (
      <label key={item.id}>
        {tx(item.en, item.fa)} ({item.unit})
        <input
          type="number"
          min="0"
          step="any"
          value={foodDraft[item.id] ?? ''}
          onChange={e => setFoodDraft(v => ({
            ...v,
            [item.id]: e.target.value
          }))}
          placeholder="0"
        />
      </label>
    ))}
  </div>
</details>
                
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
    <h4 className="health-nutrition-review-title">
      {tx('Added foods – Review', 'غذاهای اضافه‌شده – بازبینی')}
      <span>{items.length}</span>
    </h4>

{items.map(item => (
  <div className="health-nutrition-meal-item" key={item.id}>
    <div className="health-nutrition-review-info">
      <strong>{item.name}</strong>

      {editingMealItemId === item.id ? (
        <input
          type="number"
          min="0.1"
          step="any"
          value={editingMealQuantity}
          onChange={e => setEditingMealQuantity(e.target.value)}
        />
      ) : (
        <small>{item.quantity} {item.unit}</small>
      )}
    </div>

    <div className="health-nutrition-review-values">
      <strong>{fmtNum(item.calories)} kcal</strong>
      <small>
        {tx('Carbs:', 'کربوهیدرات:')} {fmtNum(item.carbs)} g
      </small>
    </div>

    {editingMealItemId === item.id ? (
      <>
        <button
          type="button"
          onClick={() => {
            const newQuantity = Number(editingMealQuantity)
            const oldQuantity = Number(item.quantity)

            if (!Number.isFinite(newQuantity) || newQuantity <= 0 || oldQuantity <= 0) return

            const ratio = newQuantity / oldQuantity

            const updatedMeals = meals.map(meal =>
              meal.id === item.id
                ? {
                    ...meal,
                    quantity: newQuantity,
                    calories: (Number(meal.calories) || 0) * ratio,
                    protein: (Number(meal.protein) || 0) * ratio,
                    carbs: (Number(meal.carbs) || 0) * ratio,
                    fat: (Number(meal.fat) || 0) * ratio,
                    ...Object.fromEntries(
                      MICRONUTRIENTS.map(n => [
                        n.id,
                        (Number(meal[n.id]) || 0) * ratio
                      ])
                    )
                  }
                : meal
            )

            saveMeals(updatedMeals)
            setEditingMealItemId(null)
          }}
        >
          {tx('Save', 'ذخیره')}
        </button>

        <button
          type="button"
          className="secondary"
          onClick={() => setEditingMealItemId(null)}
        >
          {tx('Cancel', 'انصراف')}
        </button>
      </>
    ) : (
      <button
        type="button"
        onClick={() => {
          setEditingMealItemId(item.id)
          setEditingMealQuantity(String(item.quantity))
        }}
      >
        {tx('Edit', 'ویرایش')}
      </button>
    )}

    <button
      type="button"
      className="health-nutrition-remove-item"
      onClick={() => {
        saveMeals(meals.filter(meal => meal.id !== item.id))
        if (editingMealItemId === item.id) setEditingMealItemId(null)
      }}
      aria-label={tx('Remove food', 'حذف غذا')}
    >
      ✕
    </button>
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

<div className="health-nutrition-goal-heading">
  <h3 className="health-nutrition-facts-heading">
    {tx('Macronutrients', 'درشت‌مغذی‌ها')}
  </h3>

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


<div className="health-nutrition-goal-heading">
  <h3 className="health-nutrition-facts-heading">
    {tx('Micronutrients', 'ریزمغذی‌ها')}
  </h3>

  <button
    type="button"
    className="health-nutrition-edit"
    onClick={() => {
      setMicroGoalsDraft(
        Object.fromEntries(
          MICRONUTRIENTS.map(item => [
            item.id,
            String(nutrition.microGoals?.[item.id] ?? '')
          ])
        )
      )
      setEditingMicroGoals(v => !v)
    }}
  >
    ✎ {tx('Edit micro goals', 'ویرایش اهداف ریزمغذی‌ها')}
  </button>
</div>


{editingMicroGoals && (
  <div className="health-nutrition-target-editor">
    <div className="health-nutrition-micro-grid">
      {MICRONUTRIENTS.map(item => (
        <label key={item.id}>
          {tx(item.en, item.fa)} ({item.unit})
          <input
            type="number"
            min="0"
            step="any"
            value={microGoalsDraft[item.id] ?? ''}
            placeholder="—"
            onChange={e => setMicroGoalsDraft(v => ({
              ...v,
              [item.id]: e.target.value
            }))}
          />
        </label>
      ))}
    </div>

    <div className="health-nutrition-food-actions">
      <button type="button" onClick={saveMicroGoals}>
        {tx('Save goals', 'ذخیره اهداف')}
      </button>
      <button
        type="button"
        className="secondary"
        onClick={() => setEditingMicroGoals(false)}
      >
        {tx('Cancel', 'انصراف')}
      </button>
    </div>
  </div>
)}
    
    <div className="health-nutrition-facts-table">
      <div
        className="health-nutrition-facts-row header"
        style={{ gridTemplateColumns: 'minmax(0,1.4fr) repeat(2,minmax(0,1fr))', minWidth: 0 }}
      >
        <strong>{tx('Nutrient', 'ماده مغذی')}</strong>
        <strong>{tx('Goal', 'هدف')}</strong>
        <strong>{tx('Consumed', 'دریافتی')}</strong>
      </div>

{MICRONUTRIENTS.map(item => (
  <div
    className="health-nutrition-facts-row"
    key={item.id}
    style={{
      gridTemplateColumns: 'minmax(0,1.4fr) repeat(2,minmax(0,1fr))',
      minWidth: 0
    }}
  >
    <span>{tx(item.en, item.fa)}</span>
    <strong>
  {nutrition.microGoals?.[item.id] !== undefined &&
   nutrition.microGoals?.[item.id] !== null &&
   nutrition.microGoals?.[item.id] !== ''
    ? `${fmtNum(Number(nutrition.microGoals[item.id]))} ${item.unit}`
    : `— ${item.unit}`}
    </strong>
<strong>
  {microTotals[item.id].count > 0
    ? `${fmtNum(Number(microTotals[item.id].sum.toFixed(2)))} ${item.unit}`
    : `— ${item.unit}`}
</strong>
{microTotals[item.id].count < meals.length && (
  <small>
    {tx('Partial data', 'اطلاعات ناقص')}
  </small>
)}
  </div>
))}
    </div>
  </section>
)}
    </main>
  )
}
