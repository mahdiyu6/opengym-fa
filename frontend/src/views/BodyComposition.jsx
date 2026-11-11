
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { getLang, useLang } from '../lib/i18n.js'
import './body-composition.css'

const number = value => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : null
}

const log10 = value => Math.log(value) / Math.LN10

function bodyFatNavy({ sex, height, waist, neck, hip }) {
  if (!height || !waist || !neck) return null

  const h = height / 2.54
  const w = waist / 2.54
  const n = neck / 2.54

  let result

  if (sex === 'female') {
    if (!hip) return null
    result = 163.205 * log10(w + hip / 2.54 - n) - 97.684 * log10(h) - 78.387
  } else {
    if (w <= n) return null
    result = 86.010 * log10(w - n) - 70.041 * log10(h) + 36.76
  }

  return Number.isFinite(result) && result >= 2 && result <= 70
    ? result
    : null
}

function Metric({ label, value, unit = '', hint }) {
  return (
    <div className="bc-metric">
      <span>{label}</span>
      <strong>{value == null ? '—' : value}</strong>
      {unit && <small>{unit}</small>}
      {hint && <small className="bc-hint">{hint}</small>}
    </div>
  )
}

export default function BodyComposition() {
  useLang()
  const nav = useNavigate()
  const S = useStore(s => s.S)
  const update = useStore(s => s.update)
  const fa = getLang() === 'fa'
  const tx = (en, faText) => fa ? faText : en

  const profile = S.bodyProfile || {}
  const sex = profile.sex || S.body || 'male'
  const height = number(profile.heightCm)
  const age = number(profile.age)
  const targetBfp = number(profile.targetBfp)

  const latest = useMemo(() => {
    const checkIns = [...(S.healthCheckIns || [])]
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))

    const measurements = {}
    for (const key of ['waist', 'neck', 'hip', 'chest', 'arm', 'leg']) {
      const entry = checkIns.find(item => number(item[key]))
      measurements[key] = number(entry?.[key])
    }

    const checkInWeight = checkIns.find(item => number(item.weight))
    const weightEntries = [...(S.bodyweight || [])]
      .filter(item => number(item.w))
      .sort((a, b) => String(b.d || '').localeCompare(String(a.d || '')))

    const latestWeight = weightEntries[0]
    const useCheckIn = checkInWeight &&
      (!latestWeight || String(checkInWeight.date) > String(latestWeight.d))

    const rawWeight = useCheckIn ? checkInWeight.weight : latestWeight?.w
    const weight = number(rawWeight)
    const kg = weight
      ? (S.unit === 'lb' ? weight / 2.20462262 : weight)
      : null

    return { ...measurements, weight: kg }
  }, [S.healthCheckIns, S.bodyweight, S.unit])

  const bmi = height && latest.weight
    ? latest.weight / ((height / 100) ** 2)
    : null

  const bfp = bodyFatNavy({
    sex,
    height,
    waist: latest.waist,
    neck: latest.neck,
    hip: latest.hip
  })

  const fatMass = bfp != null && latest.weight
    ? latest.weight * bfp / 100
    : null

  const leanMass = fatMass != null
    ? latest.weight - fatMass
    : null

  const idealFatMass = leanMass != null && targetBfp != null && targetBfp < 100
    ? leanMass * targetBfp / (100 - targetBfp)
    : null

  const idealWeight = idealFatMass != null
    ? leanMass + idealFatMass
    : null

  const proportionalWeight = height
    ? 22.5 * (height / 100) ** 2
    : null

  const extraWeight = latest.weight && idealWeight != null
    ? latest.weight - idealWeight
    : null

  const fatToLose = bfp != null && targetBfp != null &&
    targetBfp > 0 && targetBfp < bfp &&
    latest.weight && idealWeight != null
      ? Math.max(0, latest.weight - idealWeight)
      : null

  const weeklyLossMin = latest.weight
    ? latest.weight * 0.0025
    : null

  const weeklyLossMax = latest.weight
    ? latest.weight * 0.0075
    : null

  const estimatedWeeksMin = fatToLose != null && weeklyLossMax > 0
    ? Math.ceil(fatToLose / weeklyLossMax)
    : null

  const estimatedWeeksMax = fatToLose != null && weeklyLossMin > 0
    ? Math.ceil(fatToLose / weeklyLossMin)
    : null

  const bmr = age && height && latest.weight
    ? (10 * latest.weight) + (6.25 * height) - (5 * age) + (sex === 'female' ? -161 : 5)
    : null

  const tbw = age && height && latest.weight
    ? sex === 'female'
      ? -2.097 + (0.1069 * height) + (0.2466 * latest.weight)
      : 2.447 - (0.09156 * age) + (0.1074 * height) + (0.3362 * latest.weight)
    : null

  const waistHeight = latest.waist && height
    ? latest.waist / height
    : null

  const fatDistribution = waistHeight == null
    ? null
    : waistHeight < 0.5
      ? tx('Lower central-fat indicator', 'شاخص تجمع چربی مرکزی پایین‌تر')
      : waistHeight < 0.6
        ? tx('Elevated central-fat indicator', 'شاخص تجمع چربی مرکزی بالاتر')
        : tx('High central-fat indicator', 'شاخص تجمع چربی مرکزی زیاد')

  const weightUnit = S.unit === 'lb' ? 'lb' : 'kg'
  const displayWeight = value => {
    if (value == null) return null
    return (S.unit === 'lb' ? value * 2.20462262 : value).toFixed(1)
  }

  const lossRateLabel = weeklyLossMin != null && weeklyLossMax != null
    ? `${displayWeight(weeklyLossMin)}–${displayWeight(weeklyLossMax)} ${weightUnit}`
    : null

  const timelineLabel = estimatedWeeksMin != null && estimatedWeeksMax != null
    ? `${estimatedWeeksMin}–${estimatedWeeksMax}`
    : null
  
  function saveProfile(key, value) {
    update(s => {
      s.bodyProfile = { ...(s.bodyProfile || {}), [key]: value }
    })
  }

  const bmiLabel = bmi == null
    ? '—'
    : bmi < 18.5
      ? tx('Underweight', 'کمبود وزن')
      : bmi < 25
        ? tx('Normal range', 'محدوده طبیعی')
        : bmi < 30
          ? tx('Overweight range', 'محدوده اضافه‌وزن')
          : tx('Obesity range', 'محدوده چاقی')

  return (
    <main className="health-page bc-page" dir={fa ? 'rtl' : 'ltr'}>
      <header className="health-header">
        <div>
          <span className="bc-eyebrow">{tx('BODY ANALYSIS', 'تحلیل ترکیب بدن')}</span>
          <div className="health-title-row">
            <h1>{tx('Body Composition', 'آنالیز بدن')}</h1>
            <button
              type="button"
              className="health-secondary health-back"
              onClick={() => nav('/health')}
            >
              {tx('‹ Back', '‹ بازگشت')}
            </button>
          </div>
          <p className="health-muted">
            {tx('Understand your weight, body fat and body composition.', 'وضعیت وزن، چربی و ترکیب بدن خود را بررسی کن.')}
          </p>
        </div>
      </header>

      <section className="bc-profile health-card">
        <div className="bc-section-heading">
          <div>
            <h2>{tx('Body profile', 'مشخصات بدن')}</h2>
            <p>{tx('Required for personalized calculations', 'برای محاسبات اختصاصی لازم است')}</p>
          </div>
          <span className="bc-section-icon">⚙</span>
        </div>

        <div className="bc-form-grid">
          <label>
            {tx('Height', 'قد')} (cm)
            <input
              type="number"
              inputMode="decimal"
              min="1"
              value={profile.heightCm || ''}
              placeholder="e.g. 176"
              onChange={e => saveProfile('heightCm', e.target.value)}
            />
          </label>

          <label>
            {tx('Age', 'سن')}
            <input
              type="number"
              inputMode="numeric"
              min="1"
              max="120"
              value={profile.age || ''}
              placeholder="e.g. 33"
              onChange={e => saveProfile('age', e.target.value)}
            />
          </label>

          <label>
            {tx('Sex', 'جنسیت')}
            <select
              value={sex}
              onChange={e => saveProfile('sex', e.target.value)}
            >
              <option value="male">{tx('Male', 'مرد')}</option>
              <option value="female">{tx('Female', 'زن')}</option>
            </select>
          </label>

          <label>
            {tx('Target body fat', 'درصد چربی هدف')} (%)
            <input
              type="number"
              inputMode="decimal"
              min="2"
              max="60"
              step="0.1"
              value={profile.targetBfp || ''}
              placeholder="e.g. 15"
              onChange={e => saveProfile('targetBfp', e.target.value)}
            />
          </label>
        </div>
        <p className="bc-disclaimer">
          {tx('Your profile values are saved automatically. Measurements are taken from your latest check-ins.', 'مشخصات به‌صورت خودکار ذخیره می‌شوند و اندازه‌ها از آخرین ارزیابی‌های ثبت‌شده خوانده می‌شوند.')}
        </p>
      </section>

      <section className="bc-overview">
        <div className="bc-overview-visual">
          <div className="bc-body-figure" aria-hidden="true">
            <span className="bc-head" />
            <span className="bc-torso" />
            <span className="bc-arm left" />
            <span className="bc-arm right" />
            <span className="bc-leg left" />
            <span className="bc-leg right" />
          </div>
          <div className="bc-overview-copy">
            <span>{tx('BODY STATUS', 'وضعیت بدن')}</span>
            <strong>{bmiLabel}</strong>
            <p>{fatDistribution || tx('Add waist and height measurements', 'قد و دور کمر را وارد کن')}</p>
            <div className="bc-bmi-pill">
              <small>BMI</small>
              <b>{bmi == null ? '—' : bmi.toFixed(1)}</b>
            </div>
          </div>
        </div>
      </section>

      <section className="health-card bc-section">
        <div className="bc-section-heading">
          <div>
            <h2>{tx('Basic analysis', 'تحلیل پایه')}</h2>
            <p>{tx('Core body indicators', 'شاخص‌های اصلی بدن')}</p>
          </div>
        </div>
        <div className="bc-metric-grid">
          <Metric label="BMI" value={bmi?.toFixed(1)} hint={bmiLabel} />
          <Metric label="BMR" value={bmr == null ? null : Math.round(bmr)} unit="kcal/day" />
          <Metric label="TBW" value={tbw?.toFixed(1)} unit="kg" hint={tx('Estimated total body water', 'تخمین آب کل بدن')} />
        </div>
      </section>

      <section className="health-card bc-section">
        <div className="bc-section-heading">
          <div>
            <h2>{tx('Weight analysis', 'تحلیل وزن')}</h2>
            <p>{tx('Current and target weight estimates', 'وزن فعلی و وزن‌های هدف تخمینی')}</p>
          </div>
        </div>
        <div className="bc-metric-grid">
          <Metric label={tx('Current weight', 'وزن فعلی')} value={displayWeight(latest.weight)} unit={weightUnit} />
          <Metric label={tx('Proportional weight', 'وزن متناسب')} value={displayWeight(proportionalWeight)} unit={weightUnit} hint={tx('Based on BMI 22.5', 'بر اساس BMI برابر ۲۲٫۵')} />
          <Metric label={tx('Ideal weight', 'وزن ایده‌آل')} value={displayWeight(idealWeight)} unit={weightUnit} hint={tx('Based on target body fat', 'بر اساس درصد چربی هدف')} />
          <Metric label={tx('Weight difference', 'اختلاف وزن')} value={extraWeight == null ? null : displayWeight(Math.abs(extraWeight))} unit={weightUnit} hint={extraWeight == null ? null : extraWeight >= 0 ? tx('Above target', 'بالاتر از هدف') : tx('Below target', 'پایین‌تر از هدف')} />
        </div>
      </section>

            <section className="health-card bc-section bc-fat-loss">
        <div className="bc-section-heading">
          <div>
            <h2>{tx('Fat loss projection', 'پیش‌بینی کاهش چربی')}</h2>
            <p>
              {tx(
                'Estimated progress toward your target body fat',
                'برآورد مسیر رسیدن به درصد چربی هدف'
              )}
            </p>
          </div>
          <span className="bc-section-icon">↘</span>
        </div>

        {fatToLose != null && fatToLose > 0 ? (
          <>
            <div className="bc-metric-grid">
              <Metric
                label={tx('Estimated fat to lose', 'چربی قابل کاهش')}
                value={displayWeight(fatToLose)}
                unit={weightUnit}
              />
              <Metric
                label={tx('Weekly weight-loss range', 'بازه کاهش وزن هفتگی')}
                value={lossRateLabel}
              />
              <Metric
                label={tx('Estimated time to target', 'زمان تخمینی رسیدن به هدف')}
                value={timelineLabel}
                unit={tx('weeks', 'هفته')}
              />
            </div>
            <p className="bc-disclaimer">
              {tx(
                'This is a mathematical estimate assuming lean mass is maintained. Actual fat loss and timeline vary with nutrition, activity, health and individual response. The weekly range is a general reference, not a prescription.',
                'این محاسبه با فرض حفظ توده بدون چربی انجام شده است. میزان و زمان واقعی کاهش چربی به تغذیه، فعالیت، وضعیت سلامت و واکنش بدن بستگی دارد. بازه هفتگی صرفاً یک معیار عمومی است و نسخه تجویزی نیست.'
              )}
            </p>
          </>
        ) : (
          <p className="bc-disclaimer">
            {bfp == null || targetBfp == null
              ? tx(
                  'Enter the required body measurements and target body-fat percentage to calculate your projection.',
                  'برای محاسبه، اندازه‌های لازم بدن و درصد چربی هدف را ثبت کن.'
                )
              : tx(
                  'Your target body-fat percentage is not below your current estimate. No fat-loss projection is needed.',
                  'درصد چربی هدف پایین‌تر از تخمین فعلی نیست؛ بنابراین پیش‌بینی کاهش چربی نمایش داده نمی‌شود.'
                )}
          </p>
        )}
      </section>
      
      <section className="health-card bc-section">
        <div className="bc-section-heading">
          <div>
            <h2>{tx('Fat analysis', 'تحلیل چربی')}</h2>
            <p>{tx('Estimated from body measurements', 'تخمین بر اساس اندازه‌های بدن')}</p>
          </div>
        </div>
        <div className="bc-metric-grid">
          <Metric label="BFP" value={bfp == null ? null : bfp.toFixed(1)} unit="%" />
          <Metric label="IBF" value={targetBfp == null ? null : targetBfp.toFixed(1)} unit="%" hint={tx('Your target body-fat percentage', 'درصد چربی هدف شما')} />
          <Metric label="BF" value={fatMass?.toFixed(1)} unit="kg" hint={tx('Total fat mass', 'جرم کل چربی بدن')} />
          <Metric label="LBM" value={leanMass?.toFixed(1)} unit="kg" hint={tx('Lean body mass', 'توده بدون چربی بدن')} />
          <Metric label={tx('Fat distribution', 'تجمع چربی')} value={fatDistribution} />
        </div>
        <p className="bc-disclaimer">
          {tx('Body-fat percentage and body-water values are estimates, not direct measurements. Navy estimates require height, waist and neck; hip is also required for female calculations.', 'درصد چربی و آب بدن تخمینی هستند و اندازه‌گیری مستقیم محسوب نمی‌شوند. محاسبه Navy به قد، دور کمر و گردن نیاز دارد؛ برای محاسبه بانوان دور باسن نیز لازم است.')}
        </p>
      </section>
    </main>
  )
}
