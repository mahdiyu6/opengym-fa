import { useMemo, useState } from 'react'
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

const EMPTY = Object.freeze({})
const EMPTY_ARRAY = Object.freeze([])

const numberOrNull = value => {
  if (value === '' || value === null || value === undefined) return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

const cleanMicronutrients = values => {
  const normalized = normalizeMicronutrients(values || {})
  return Object.fromEntries(
    Object.entries(normalized).filter(([, value]) => value !== null)
  )
}

const getFoodMicronutrients = food =>
  cleanMicronutrients(food?.micronutrients || {})

const nutrientLabel = (item, fa) =>
  fa ? (item.nameFa || item.name) : item.name

const makeEmptyFood = () => ({
  name: '',
  nameEn: '',
  nutritionBasis: 'perUnit',
  unit: 'g',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
  micronutrients: {}
})

const makeFoodDraft = food => ({
  name: food?.name || '',
  nameEn: food?.nameEn || '',
  nutritionBasis: food?.nutritionBasis || 'perUnit',
  unit: food?.unit || 'g',
  calories: String(food?.calories ?? ''),
  protein: String(food?.protein ?? ''),
  carbs: String(food?.carbs ?? ''),
  fat: String(food?.fat ?? ''),
  micronutrients: getFoodMicronutrients(food)
})

const scaleFoodValues = (food, factor) => ({
  calories: (Number(food.calories) || 0) * factor,
  protein: (Number(food.protein) || 0) * factor,
  carbs: (Number(food.carbs) || 0) * factor,
  fat: (Number(food.fat) || 0) * factor,
  micronutrients: scaleMicronutrients(
    getFoodMicronutrients(food),
    factor
  )
})

const getFoodFactor = (food, quantity) =>
  food?.nutritionBasis === 'per100g'
    ? Number(quantity) / 100
    : Number(quantity)

export default function Nutrition() {
  useLang()

  const nav = useNavigate()
  const fa = getLang() === 'fa'
  const tx = (en, faText) => fa ? faText : en

  const calendar = useStore(s =>
    s.S?.calendar === 'jalali' ? 'jalali' : 'gregorian'
  )
  const nutrition = useStore(s => s.S?.nutrition || EMPTY)
  const updateStore = useStore(s => s.update)
  const workouts = useStore(s =>
    Array.isArray(s.S?.workouts) ? s.S.workouts : EMPTY_ARRAY
  )

  const today = todayISO()
  const day = nutrition.days?.[today] || {}
  const meals = Array.isArray(day.meals) ? day.meals : []
  const foodBank = Array.isArray(nutrition.foods) ? nutrition.foods : []

  const [page, setPage] = useState('dashboard')
  const [foodSearch, setFoodSearch] = useState('')
  const [addingFoodFor, setAddingFoodFor] = useState(null)
  const [foodDraft, setFoodDraft] = useState(makeEmptyFood)
  const [foodQuantity, setFoodQuantity] = useState('1')
  const [selectedFoodId, setSelectedFoodId] = useState('')
  const [editingFoodId, setEditingFoodId] = useState(null)
  const [editingFoodDraft, setEditingFoodDraft] = useState(makeEmptyFood)
  const [editingMealItemId, setEditingMealItemId] = useState(null)
  const [editingMealQuantity, setEditingMealQuantity] = useState('')
  const [nutrientSearch, setNutrientSearch] = useState('')
  const [selectedNutrientKey, setSelectedNutrientKey] = useState('')
  const [nutrientValue, setNutrientValue] = useState('')
  const [importMessage, setImportMessage] = useState('')
  const [importing, setImporting] = useState(false)

  const [editingTarget, setEditingTarget] = useState(false)
  const [targetDraft, setTargetDraft] = useState(
    String(nutrition.targetCalories || 2000)
  )
  const [editingMacroGoals, setEditingMacroGoals] = useState(false)
  const [macroGoalsDraft, setMacroGoalsDraft] = useState({
    protein: String(nutrition.macroGoals?.protein ?? ''),
    carbs: String(nutrition.macroGoals?.carbs ?? ''),
    fat: String(nutrition.macroGoals?.fat ?? '')
  })
  const [editingMicroGoals, setEditingMicroGoals] = useState(false)
  const [microGoalsDraft, setMicroGoalsDraft] = useState(
    cleanMicronutrients(nutrition.microGoals || {})
  )

  const target = Number(nutrition.targetCalories || 2000)
  const consumed = meals.reduce(
    (sum, item) => sum + (Number(item.calories) || 0),
    0
  )
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

  const macroTotals = useMemo(() => meals.reduce((sum, item) => ({
    protein: sum.protein + (Number(item.protein) || 0),
    carbs: sum.carbs + (Number(item.carbs) || 0),
    fat: sum.fat + (Number(item.fat) || 0)
  }), { protein: 0, carbs: 0, fat: 0 }), [meals])

  const microTotals = useMemo(() => {
    const totals = {}
    const counts = {}

    for (const meal of meals) {
      for (const [key, value] of Object.entries(
        getFoodMicronutrients(meal)
      )) {
        totals[key] = (totals[key] || 0) + Number(value)
        counts[key] = (counts[key] || 0) + 1
      }
    }

    return { totals, counts }
  }, [meals])

  const filteredFoods = foodBank.filter(food => {
    const q = foodSearch.trim().toLowerCase()
    if (!q) return true
    return `${food.name || ''} ${food.nameEn || ''}`
      .toLowerCase()
      .includes(q)
  })

  const filteredNutrients = MICRONUTRIENT_CATALOG.filter(item => {
    const q = nutrientSearch.trim().toLowerCase()
    if (!q) return true
    return `${item.name || ''} ${item.nameFa || ''} ${item.number || ''}`
      .toLowerCase()
      .includes(q)
  })

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

  function updateDraft(setter, draft, key, value) {
    setter({ ...draft, [key]: value })
  }

  function addNutrientToDraft(draft, setter) {
    if (!selectedNutrientKey || nutrientValue === '') return
    const value = numberOrNull(nutrientValue)
    if (value === null || value < 0) return

    setter({
      ...draft,
      micronutrients: {
        ...draft.micronutrients,
        [selectedNutrientKey]: value
      }
    })
    setNutrientValue('')
  }

  function removeNutrientFromDraft(draft, setter, key) {
    const next = { ...draft.micronutrients }
    delete next[key]
    setter({ ...draft, micronutrients: next })
  }

  function renderNutrientEditor(draft, setter) {
    const entries = Object.entries(draft.micronutrients || {})
      .map(([key, value]) => ({
        item: MICRONUTRIENT_CATALOG.find(n => n.key === key),
        key,
        value
      }))
      .filter(row => row.item)

    return (
      <div className="health-nutrition-micro-editor">
        <strong>{tx('Nutrients', 'مواد مغذی')}</strong>

        <input
          type="search"
          value={nutrientSearch}
          onChange={e => setNutrientSearch(e.target.value)}
          placeholder={tx('Search nutrient catalog...', 'جست‌وجو در کاتالوگ مواد مغذی...')}
        />

        <div className="health-nutrition-food-identity">
          <label>
            {tx('Select nutrient', 'انتخاب ماده مغذی')}
            <select
              value={selectedNutrientKey}
              onChange={e => setSelectedNutrientKey(e.target.value)}
            >
              <option value="">
                {tx('Choose a nutrient', 'یک ماده مغذی انتخاب کن')}
              </option>
              {MICRONUTRIENT_GROUPS.map(group => {
                const options = filteredNutrients.filter(
                  item => item.group === group.id
                )
                if (!options.length) return null

                return (
                  <optgroup
                    key={group.id}
                    label={fa ? group.fa : group.en}
                  >
                    {options.map(item => (
                      <option key={item.key} value={item.key}>
                        {nutrientLabel(item, fa)} ({item.unit})
                      </option>
                    ))}
                  </optgroup>
                )
              })}
            </select>
          </label>

          <label>
            {tx('Value', 'مقدار')}
            <input
              type="number"
              min="0"
              step="any"
              value={nutrientValue}
              onChange={e => setNutrientValue(e.target.value)}
              placeholder="—"
            />
          </label>

          <button
            type="button"
            onClick={() => addNutrientToDraft(draft, setter)}
            disabled={!selectedNutrientKey || nutrientValue === ''}
          >
            {tx('Add / Update', 'افزودن / به‌روزرسانی')}
          </button>
        </div>

        {entries.length > 0 ? (
          <div className="health-nutrition-meal-items">
            {entries.map(({ item, key, value }) => (
              <div className="health-nutrition-meal-item" key={key}>
                <span>{nutrientLabel(item, fa)}</span>
                <strong>{fmtNum(value)} {item.unit}</strong>
                <button
                  type="button"
                  className="health-nutrition-remove-item"
                  onClick={() => removeNutrientFromDraft(draft, setter, key)}
                  aria-label={tx('Remove nutrient', 'حذف ماده مغذی')}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="health-muted">
            {tx(
              'No nutrient values entered. Missing values will remain unknown.',
              'هنوز مقداری ثبت نشده است؛ مقادیر ناموجود خالی باقی می‌مانند.'
            )}
          </p>
        )}
      </div>
    )
  }

  function saveNewFood() {
    const name = foodDraft.name.trim()
    const quantity = Number(foodQuantity)
    const isFoodBankOnly = addingFoodFor === 'foodbank'

    if (!name || !addingFoodFor) return
    if (!isFoodBankOnly && (!Number.isFinite(quantity) || quantity <= 0)) return

    const food = {
      id: `food-${Date.now()}`,
      name,
      nameEn: foodDraft.nameEn.trim(),
      nutritionBasis: foodDraft.nutritionBasis || 'perUnit',
      unit: foodDraft.unit.trim() || 'g',
      calories: numberOrNull(foodDraft.calories) ?? 0,
      protein: numberOrNull(foodDraft.protein) ?? 0,
      carbs: numberOrNull(foodDraft.carbs) ?? 0,
      fat: numberOrNull(foodDraft.fat) ?? 0,
      micronutrients: cleanMicronutrients(foodDraft.micronutrients)
    }

    const existing = foodBank.find(item =>
      item.name?.trim().toLowerCase() === name.toLowerCase() &&
      item.unit === food.unit &&
      (item.nutritionBasis || 'perUnit') === food.nutritionBasis
    )
    const savedFood = existing || food

    updateStore(s => {
      s.nutrition ||= {}
      s.nutrition.foods ||= []
      if (!existing) s.nutrition.foods.push(food)

      if (!isFoodBankOnly) {
        const factor = getFoodFactor(savedFood, quantity)
        const values = scaleFoodValues(savedFood, factor)

        s.nutrition.days ||= {}
        s.nutrition.days[today] ||= {}
        s.nutrition.days[today].meals ||= []
        s.nutrition.days[today].meals.push({
          id: `meal-${Date.now()}`,
          foodId: savedFood.id,
          mealType: addingFoodFor,
          name: savedFood.name,
          unit: savedFood.nutritionBasis === 'per100g' ? 'g' : savedFood.unit,
          quantity,
          nutritionBasis: savedFood.nutritionBasis,
          ...values
        })
      }
    })

    setAddingFoodFor(null)
    setFoodDraft(makeEmptyFood())
    setFoodQuantity('1')
    setSelectedFoodId('')
  }

  function saveFoodBankEdit() {
    if (!editingFoodId || !editingFoodDraft.name.trim()) return

    const updated = {
      ...editingFoodDraft,
      id: editingFoodId,
      name: editingFoodDraft.name.trim(),
      nameEn: editingFoodDraft.nameEn.trim(),
      unit: editingFoodDraft.unit.trim() || 'g',
      calories: numberOrNull(editingFoodDraft.calories) ?? 0,
      protein: numberOrNull(editingFoodDraft.protein) ?? 0,
      carbs: numberOrNull(editingFoodDraft.carbs) ?? 0,
      fat: numberOrNull(editingFoodDraft.fat) ?? 0,
      micronutrients: cleanMicronutrients(editingFoodDraft.micronutrients)
    }

    updateStore(s => {
      s.nutrition ||= {}
      s.nutrition.foods = (s.nutrition.foods || []).map(food =>
        food.id === editingFoodId ? updated : food
      )
    })
    setEditingFoodId(null)
  }

  function deleteFood(foodId) {
    updateStore(s => {
      s.nutrition ||= {}
      s.nutrition.foods = (s.nutrition.foods || []).filter(
        food => food.id !== foodId
      )
    })
    if (editingFoodId === foodId) setEditingFoodId(null)
  }

  async function importFoodBankJSON(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setImporting(true)
    setImportMessage('')

    try {
      const parsed = JSON.parse(await file.text())
      const records = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.foods) ? parsed.foods : []

      const valid = records.filter(food =>
        food &&
        (food.name || food.nameEn) &&
        Number.isFinite(Number(food.calories)) &&
        Number.isFinite(Number(food.protein)) &&
        Number.isFinite(Number(food.carbs)) &&
        Number.isFinite(Number(food.fat))
      )

      if (!valid.length) throw new Error('No valid food records')

      let added = 0
      let skipped = 0

      updateStore(s => {
        s.nutrition ||= {}
        s.nutrition.foods ||= []
        const existingIds = new Set(
          s.nutrition.foods.map(food => String(food.id))
        )
        const existingSources = new Set(
          s.nutrition.foods
            .map(food => food.source?.externalId)
            .filter(Boolean)
            .map(String)
        )

        for (const food of valid) {
          const externalId = food.source?.externalId
          const id = food.id || `food-${Date.now()}-${added}`

          if (
            existingIds.has(String(id)) ||
            (externalId && existingSources.has(String(externalId)))
          ) {
            skipped++
            continue
          }

          s.nutrition.foods.push({
            id,
            name: food.name || food.nameEn,
            nameEn: food.nameEn || food.name || '',
            nutritionBasis: food.nutritionBasis || 'per100g',
            unit: food.unit || 'g',
            calories: Number(food.calories) || 0,
            protein: Number(food.protein) || 0,
            carbs: Number(food.carbs) || 0,
            fat: Number(food.fat) || 0,
            micronutrients: cleanMicronutrients(food.micronutrients),
            source: food.source || null,
            preparation: food.preparation || null,
            referenceWeightGrams: food.referenceWeightGrams ?? null
          })
          existingIds.add(String(id))
          if (externalId) existingSources.add(String(externalId))
          added++
        }
      })

      setImportMessage(tx(
        `Import complete: ${added} added, ${skipped} duplicates skipped.`,
        `ورود انجام شد: ${added} غذا اضافه و ${skipped} مورد تکراری رد شد.`
      ))
    } catch {
      setImportMessage(tx(
        'Import failed. Check the JSON structure.',
        'ورود ناموفق بود؛ ساختار فایل JSON را بررسی کن.'
      ))
    } finally {
      setImporting(false)
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
      protein: numberOrNull(macroGoalsDraft.protein),
      carbs: numberOrNull(macroGoalsDraft.carbs),
      fat: numberOrNull(macroGoalsDraft.fat)
    }
    if (Object.values(goals).some(v => v === null || v < 0)) return

    updateStore(s => {
      s.nutrition ||= {}
      s.nutrition.macroGoals = goals
    })
    setEditingMacroGoals(false)
  }

  function saveMicroGoals() {
    updateStore(s => {
      s.nutrition ||= {}
      s.nutrition.microGoals = cleanMicronutrients(microGoalsDraft)
    })
    setEditingMicroGoals(false)
  }

  function editMealQuantity(item, newQuantity) {
    const oldQuantity = Number(item.quantity)
    const nextQuantity = Number(newQuantity)
    if (!Number.isFinite(nextQuantity) || nextQuantity <= 0 || oldQuantity <= 0) return

    const ratio = nextQuantity / oldQuantity
    const nextMeals = meals.map(meal => {
      if (meal.id !== item.id) return meal
      return {
        ...meal,
        quantity: nextQuantity,
        calories: (Number(meal.calories) || 0) * ratio,
        protein: (Number(meal.protein) || 0) * ratio,
        carbs: (Number(meal.carbs) || 0) * ratio,
        fat: (Number(meal.fat) || 0) * ratio,
        micronutrients: scaleMicronutrients(
          getFoodMicronutrients(meal),
          ratio
        )
      }
    })
    saveMeals(nextMeals)
    setEditingMealItemId(null)
  }

  const mealTypes = [
    { id: 'breakfast', label: tx('Breakfast', 'صبحانه'), icon: '🌅' },
    { id: 'lunch', label: tx('Lunch', 'ناهار'), icon: '☀️' },
    { id: 'dinner', label: tx('Dinner', 'شام'), icon: '🌙' },
    { id: 'snack', label: tx('Snacks', 'میان‌وعده'), icon: '🍎' }
  ]

  const macroRows = [
    { key: 'protein', label: tx('Protein', 'پروتئین') },
    { key: 'carbs', label: tx('Carbohydrates', 'کربوهیدرات') },
    { key: 'fat', label: tx('Fat', 'چربی') }
  ]

  function renderFoodForm(draft, setter, onSave, cancelLabel, onCancel = () => setAddingFoodFor(null)) {
    return (
      <div className="health-nutrition-food-form">
        <h3 className="health-nutrition-form-title">
          {tx('Food details', 'مشخصات غذا')}
        </h3>

        <div className="health-nutrition-food-identity">
          <label>
            {tx('Food name', 'نام غذا')}
            <input
              value={draft.name}
              onChange={e => updateDraft(setter, draft, 'name', e.target.value)}
            />
          </label>
          <label>
            {tx('English name (optional)', 'نام انگلیسی (اختیاری)')}
            <input
              value={draft.nameEn}
              onChange={e => updateDraft(setter, draft, 'nameEn', e.target.value)}
            />
          </label>
          <label>
            {tx('Measurement unit', 'واحد اندازه‌گیری')}
            <input
              value={draft.unit}
              onChange={e => updateDraft(setter, draft, 'unit', e.target.value)}
              placeholder="g"
            />
          </label>
          <label>
            {tx('Nutrition basis', 'مبنای مقادیر غذایی')}
            <select
              value={draft.nutritionBasis}
              onChange={e => updateDraft(setter, draft, 'nutritionBasis', e.target.value)}
            >
              <option value="perUnit">{tx('Per unit', 'به ازای هر واحد')}</option>
              <option value="per100g">{tx('Per 100 grams', 'به ازای هر ۱۰۰ گرم')}</option>
            </select>
          </label>
        </div>

        <div className="health-nutrition-form-section">
          <strong>{tx('Core nutrition', 'ارزش غذایی اصلی')}</strong>
          <div className="health-nutrition-food-macros">
            {[
              ['calories', 'Calories (kcal)', 'کالری (kcal)'],
              ['protein', 'Protein (g)', 'پروتئین (g)'],
              ['carbs', 'Carbohydrates (g)', 'کربوهیدرات (g)'],
              ['fat', 'Fat (g)', 'چربی (g)']
            ].map(([key, en, faText]) => (
              <label key={key}>
                {tx(en, faText)}
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={draft[key]}
                  onChange={e => updateDraft(setter, draft, key, e.target.value)}
                />
              </label>
            ))}
          </div>
        </div>

        {renderNutrientEditor(draft, setter)}

        <div className="health-nutrition-food-actions">
          <button type="button" onClick={onSave}>
            {tx('Save', 'ذخیره')}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => setAddingFoodFor(null)}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    )
  }

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
          {[
            ['meals', tx('Meals', 'وعده‌ها'), '🍽️'],
            ['nutrition', tx('Nutrition', 'ارزش غذایی'), '🥗'],
            ['foodbank', tx('Food Bank', 'بانک غذا'), '📚']
          ].map(([id, label, icon]) => (
            <button key={id} type="button" onClick={() => setPage(id)}>
              <span>{icon}</span>{label}
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
                <button type="button" onClick={saveTarget}>{tx('Save', 'ذخیره')}</button>
                <button type="button" className="secondary" onClick={() => setEditingTarget(false)}>
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
              {[
                ['fat', tx('Fat', 'چربی'), macroTotals.fat, '🥑'],
                ['protein', tx('Protein', 'پروتئین'), macroTotals.protein, '🥩'],
                ['carbs', tx('Carbs', 'کربوهیدرات'), macroTotals.carbs, '🍚']
              ].map(([key, label, value, icon]) => (
                <div className="health-nutrition-macro" key={key}>
                  <span className="health-nutrition-macro-icon">{icon}</span>
                  <strong>{label}</strong>
                  <div><b>{fmtNum(value)}</b><span> g</span></div>
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
                <label>{tx('Steps', 'تعداد قدم')}
                  <input type="number" min="0" value={day.steps ?? ''} onChange={e => saveDay('steps', e.target.value)} />
                </label>
                <label>{tx('Burned calories', 'کالری سوزانده‌شده')}
                  <input type="number" min="0" value={day.stepsCalories ?? ''} onChange={e => saveDay('stepsCalories', e.target.value)} />
                </label>
              </article>
              <article className="health-nutrition-tool">
                <span className="health-nutrition-tool-icon">💧</span>
                <strong>{tx('Water tracker', 'آب‌شمار')}</strong>
                <div className="health-nutrition-water-value">
                  <b>{Number(day.water || 0)}</b><span> / 8 {tx('glasses', 'لیوان')}</span>
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
                <label>{tx('Sleep duration (hours)', 'مدت خواب (ساعت)')}
                  <input type="number" min="0" max="24" step="0.5" value={day.sleepHours ?? ''} onChange={e => saveDay('sleepHours', e.target.value)} />
                </label>
                <label>{tx('Estimated calories', 'کالری تخمینی')}
                  <input type="number" min="0" value={day.sleepCalories ?? ''} onChange={e => saveDay('sleepCalories', e.target.value)} />
                </label>
              </article>
            </div>
          </section>
        </>
      )}

      {page === 'foodbank' && (
        <section className="health-nutrition-meals health-nutrition-foodbank-page">
          <div className="health-nutrition-section-title">
            <span>{foodBank.length} {tx('saved foods', 'غذای ذخیره‌شده')}</span>
          </div>

          <label className="health-nutrition-add-food">
            {importing ? tx('Importing...', 'در حال ورود...') : tx('Import food bank JSON', 'ورود فایل بانک غذا')}
            <input
              type="file"
              accept=".json,application/json"
              disabled={importing}
              onChange={importFoodBankJSON}
              style={{ display: 'none' }}
            />
          </label>
          {importMessage && <p className="health-muted" role="status">{importMessage}</p>}

          <button
            type="button"
            className="health-nutrition-add-food"
            onClick={() => {
              setFoodDraft(makeEmptyFood())
              setAddingFoodFor('foodbank')
            }}
          >
            + {tx('Create new food', 'تعریف غذای جدید')}
          </button>

          {addingFoodFor === 'foodbank' && renderFoodForm(
            foodDraft,
            setFoodDraft,
            saveNewFood,
            tx('Cancel', 'انصراف')
          )}

          <input
            type="search"
            className="health-nutrition-bank-search"
            value={foodSearch}
            onChange={e => setFoodSearch(e.target.value)}
            placeholder={tx('Search foods...', 'جست‌وجوی غذا...')}
          />

          {filteredFoods.length ? (
            <div className="health-nutrition-meal-list">
              {filteredFoods.map(food => (
                <article className="health-nutrition-meal-card" key={food.id}>
                  <div className="health-nutrition-meal-heading">
                    <div className="health-nutrition-meal-name">
                      <span>🍽️</span>
                      <div>
                        <strong>{food.name}</strong>
                        <small>
                          {food.nutritionBasis === 'per100g'
                            ? tx('Per 100 g', 'به ازای ۱۰۰ گرم')
                            : `${tx('Per unit', 'به ازای هر واحد')} · ${food.unit}`}
                        </small>
                      </div>
                    </div>
                    <strong className="health-nutrition-meal-calories">
                      {fmtNum(food.calories)} kcal
                    </strong>
                  </div>

                  <div className="health-nutrition-food-macro-summary">
                    {macroRows.map(row => (
                      <div className="health-nutrition-food-macro-item" key={row.key}>
                        <span>{row.label}</span>
                        <strong>{fmtNum(food[row.key])} g</strong>
                      </div>
                    ))}
                  </div>

                  <div className="health-nutrition-food-actions">
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => {
                        setEditingFoodId(food.id)
                        setEditingFoodDraft(makeFoodDraft(food))
                      }}
                    >
                      {tx('Edit food', 'ویرایش غذا')}
                    </button>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => {
                        if (window.confirm(tx('Delete this food?', 'این غذا حذف شود؟'))) {
                          deleteFood(food.id)
                        }
                      }}
                    >
                      {tx('Delete', 'حذف')}
                    </button>
                  </div>

                  {editingFoodId === food.id && renderFoodForm(
                    editingFoodDraft,
                    setEditingFoodDraft,
                    saveFoodBankEdit,
                    tx('Cancel', 'انصراف')
                  )}

                  <details className="health-nutrition-micro-editor">
                    <summary>{tx('Nutrient details', 'جزئیات مواد مغذی')}</summary>
                    <div className="health-nutrition-meal-items">
                      {Object.entries(getFoodMicronutrients(food)).map(([key, value]) => {
                        const nutrient = MICRONUTRIENT_CATALOG.find(n => n.key === key)
                        if (!nutrient) return null
                        return (
                          <div className="health-nutrition-meal-item" key={key}>
                            <span>{nutrientLabel(nutrient, fa)}</span>
                            <strong>{fmtNum(value)} {nutrient.unit}</strong>
                          </div>
                        )
                      })}
                    </div>
                  </details>
                </article>
              ))}
            </div>
          ) : (
            <p className="health-nutrition-meal-empty">
              {tx('No foods found.', 'غذایی پیدا نشد.')}
            </p>
          )}
        </section>
      )}

      {page === 'meals' && (
        <section className="health-nutrition-meals">
          <div className="health-nutrition-section-title">
            <span>{fmtNum(consumed)} kcal</span>
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
                        <small>{items.length} {tx('items', 'مورد')}</small>
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
                      setFoodDraft(makeEmptyFood())
                      setFoodQuantity('1')
                      setSelectedFoodId('')
                    }}
                  >
                    + {tx('Add food', 'افزودن غذا')}
                  </button>

                  {addingFoodFor === type.id && (
                    <div className="health-nutrition-food-form">
                      {foodBank.length > 0 && (
                        <label className="health-nutrition-bank-picker">
                          {tx('Choose a saved food', 'انتخاب از بانک غذا')}
                          <select
                            value={selectedFoodId}
                            onChange={e => {
                              const food = foodBank.find(f => f.id === e.target.value)
                              setSelectedFoodId(e.target.value)
                              if (food) setFoodDraft(makeFoodDraft(food))
                            }}
                          >
                            <option value="">{tx('Select food', 'انتخاب غذا')}</option>
                            {foodBank.map(food => (
                              <option key={food.id} value={food.id}>{food.name}</option>
                            ))}
                          </select>
                        </label>
                      )}

                      <label>
                        {tx('Food name', 'نام غذا')}
                        <input
                          value={foodDraft.name}
                          onChange={e => updateDraft(setFoodDraft, foodDraft, 'name', e.target.value)}
                        />
                      </label>
                      <label>
                        {foodDraft.nutritionBasis === 'per100g'
                          ? tx('Amount (g)', 'مقدار (گرم)')
                          : tx('Quantity', 'تعداد')}
                        <input
                          type="number"
                          min="0.1"
                          step="any"
                          value={foodQuantity}
                          onChange={e => setFoodQuantity(e.target.value)}
                        />
                      </label>

                      <div className="health-nutrition-food-macros">
                        {[
                          ['calories', 'Calories', 'کالری'],
                          ['protein', 'Protein', 'پروتئین'],
                          ['carbs', 'Carbs', 'کربوهیدرات'],
                          ['fat', 'Fat', 'چربی']
                        ].map(([key, en, faText]) => (
                          <label key={key}>
                            {tx(en, faText)}
                            <input
                              type="number"
                              min="0"
                              step="any"
                              value={foodDraft[key]}
                              onChange={e => updateDraft(setFoodDraft, foodDraft, key, e.target.value)}
                            />
                          </label>
                        ))}
                      </div>

                      {renderNutrientEditor(foodDraft, setFoodDraft)}

                      <div className="health-nutrition-food-actions">
                        <button type="button" onClick={saveNewFood}>{tx('Add to meal', 'افزودن به وعده')}</button>
                        <button type="button" className="secondary" onClick={() => setAddingFoodFor(null)}>
                          {tx('Cancel', 'انصراف')}
                        </button>
                      </div>
                    </div>
                  )}

                  {items.length ? (
                    <div className="health-nutrition-meal-items">
                      <h4 className="health-nutrition-review-title">
                        {tx('Added foods – Review', 'غذاهای ثبت‌شده – بازبینی')}
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
                            <small>{tx('Carbs:', 'کربوهیدرات:')} {fmtNum(item.carbs)} g</small>
                          </div>

                          {editingMealItemId === item.id ? (
                            <>
                              <button type="button" onClick={() => editMealQuantity(item, editingMealQuantity)}>
                                {tx('Save', 'ذخیره')}
                              </button>
                              <button type="button" className="secondary" onClick={() => setEditingMealItemId(null)}>
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
                            onClick={() => saveMeals(meals.filter(m => m.id !== item.id))}
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

          {editingMacroGoals && (
            <div className="health-nutrition-target-editor">
              {macroRows.map(row => (
                <label key={row.key}>
                  {row.label} (g)
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={macroGoalsDraft[row.key]}
                    onChange={e => setMacroGoalsDraft(v => ({
                      ...v,
                      [row.key]: e.target.value
                    }))}
                  />
                </label>
              ))}
              <button type="button" onClick={saveMacroGoals}>{tx('Save goals', 'ذخیره اهداف')}</button>
              <button type="button" className="secondary" onClick={() => setEditingMacroGoals(false)}>
                {tx('Cancel', 'انصراف')}
              </button>
            </div>
          )}

          <div className="health-nutrition-facts-table">
            <div className="health-nutrition-facts-row header" style={{ gridTemplateColumns: 'minmax(0,1.4fr) repeat(2,minmax(0,1fr))' }}>
              <strong>{tx('Nutrient', 'ماده مغذی')}</strong>
              <strong>{tx('Goal', 'هدف')}</strong>
              <strong>{tx('Consumed', 'دریافتی')}</strong>
            </div>
            {[
              { id: 'calories', label: tx('Calories', 'کالری'), value: consumed, goal: target, unit: 'kcal' },
              ...macroRows.map(row => ({
                id: row.key,
                label: row.label,
                value: macroTotals[row.key],
                goal: nutrition.macroGoals?.[row.key],
                unit: 'g'
              }))
            ].map(row => (
              <div className="health-nutrition-facts-row" key={row.id} style={{ gridTemplateColumns: 'minmax(0,1.4fr) repeat(2,minmax(0,1fr))' }}>
                <span>{row.label}</span>
                <strong>{row.goal == null ? '—' : `${fmtNum(row.goal)} ${row.unit}`}</strong>
                <strong>{fmtNum(row.value)} {row.unit}</strong>
              </div>
            ))}
          </div>

          <div className="health-nutrition-goal-heading">
            <h3 className="health-nutrition-facts-heading">
              {tx('Micronutrients & other compounds', 'ریزمغذی‌ها و سایر ترکیبات')}
            </h3>
            <button
              type="button"
              className="health-nutrition-edit"
              onClick={() => {
                setMicroGoalsDraft(cleanMicronutrients(nutrition.microGoals || {}))
                setEditingMicroGoals(v => !v)
              }}
            >
              ✎ {tx('Edit nutrient goals', 'ویرایش اهداف مواد مغذی')}
            </button>
          </div>

          {editingMicroGoals && (
            <div className="health-nutrition-target-editor">
              {renderNutrientEditor(
                {
                  micronutrients: microGoalsDraft
                },
                draft => setMicroGoalsDraft(draft.micronutrients)
              )}
              <div className="health-nutrition-food-actions">
                <button type="button" onClick={saveMicroGoals}>{tx('Save goals', 'ذخیره اهداف')}</button>
                <button type="button" className="secondary" onClick={() => setEditingMicroGoals(false)}>
                  {tx('Cancel', 'انصراف')}
                </button>
              </div>
            </div>
          )}

          <div className="health-nutrition-facts-table">
            <div className="health-nutrition-facts-row header" style={{ gridTemplateColumns: 'minmax(0,1.4fr) repeat(2,minmax(0,1fr))' }}>
              <strong>{tx('Nutrient', 'ماده مغذی')}</strong>
              <strong>{tx('Goal', 'هدف')}</strong>
              <strong>{tx('Consumed', 'دریافتی')}</strong>
            </div>
            {Object.keys(microTotals.totals)
              .sort((a, b) => a.localeCompare(b))
              .map(key => {
                const nutrient = MICRONUTRIENT_CATALOG.find(n => n.key === key)
                if (!nutrient) return null
                const goal = nutrition.microGoals?.[key]
                const partial = microTotals.counts[key] < meals.length
                return (
                  <div className="health-nutrition-facts-row" key={key} style={{ gridTemplateColumns: 'minmax(0,1.4fr) repeat(2,minmax(0,1fr))' }}>
                    <span>{nutrientLabel(nutrient, fa)}</span>
                    <strong>{goal == null ? `— ${nutrient.unit}` : `${fmtNum(goal)} ${nutrient.unit}`}</strong>
                    <strong>{fmtNum(microTotals.totals[key])} {nutrient.unit}</strong>
                    {partial && <small>{tx('Partial data', 'اطلاعات ناقص')}</small>}
                  </div>
                )
              })}
          </div>
        </section>
      )}
    </main>
  )
}
