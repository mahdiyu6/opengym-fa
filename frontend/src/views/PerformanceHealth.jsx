import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import HealthDatePicker from '../components/HealthDatePicker.jsx'
import { getLang, useLang } from '../lib/i18n.js'
import HealthDoseSchedule from './HealthDoseSchedule.jsx'
import HealthSideEffects from './HealthSideEffects.jsx'
import './health-hub.css'

const today = () => new Date().toISOString().slice(0, 10)

const CATALOG = [
  {
    category: 'Androstanes',
    fa: 'آندروستان‌ها',
    groups: [
      {
        name: 'Boldenone',
        items: ['Boldenone Cypionate', 'EQ']
      },
      {
        name: 'testosterone',
        items: ['sustanon', 'test c', 'test E', 'test p', 'test u', 'TNE', 'TPP']
      }
    ]
  },
  {
    category: '19-NORS',
    fa: '۱۹ نورها',
    groups: [
      { name: 'Trestolone', items: ['Ment'] },
      { name: 'Nandrolone', items: ['Nandrolone (Deca)', 'NPP'] },
      { name: 'Trenbolone', items: ['Parabolan', 'Tren A', 'Tren E'] }
    ]
  },
  {
    category: 'DHT DERIVATIVES',
    fa: 'مشتقات DHT',
    groups: [
      { name: 'Dihydroboldenone', items: ['DHB'] },
      { name: 'Drostanolone', items: ['Masteron Enanthate', 'Masteron propionate'] },
      { name: 'Methenolone', items: ['Primobolan Inj', 'Primobolan Oral'] },
      { name: 'Stanozolol', items: ['Winstrol Inj'] }
    ]
  },
  {
    category: 'ORALS',
    fa: 'ترکیبات خوراکی',
    groups: [
      {
        name: 'DHT-based orals',
        items: [
          'Anadrol', 'Anavar', 'Dianabol', 'Epistane',
          'Halotestin', 'M1T', 'Proviron', 'Superdrol',
          'Turinabol', 'Winstrol'
        ]
      }
    ]
  },
  {
    category: 'Ancillaries',
    fa: 'داروهای کمکی',
    groups: [
      {
        name: '',
        items: [
          'Arimidex', 'Aromasin', 'Cabergoline', 'Cagrilintide',
          'CJC-1295 (NO DAC)', 'CJC-1295 (with DAC)',
          'Clenbuterol', 'Clomid', 'Enclomiphene', 'Ephedrine',
          'GHRP-2', 'GHRP-6', 'Gonadorelin', 'Growth Hormone',
          'HCG', 'HGH Frag 176-191', 'HMG', 'Humalog',
          'IGF-1 LR3', 'Ipamorelin', 'Lantus', 'Letrozole',
          'Levemir', 'Liraglutide', 'Melanotan II', 'MK-677',
          'Nolvadex', 'Novorapid', 'Pramipexole', 'PT-141',
          'Raloxifene', 'Retatrutide', 'Semaglutide', 'Sermorelin',
          'SLU-PP-332', 'T3', 'T4', 'Tesamorelin',
          'Tirzepatide', 'Toremifene', 'Yohimbine HCL'
        ]
      }
    ]
  },
  {
    category: 'Health Support',
    fa: 'حمایت از سلامت',
    groups: [
      {
        name: '',
        items: [
          'Atorvastatin', 'Berberine', 'BPC-157', 'Carvedilol',
          'DHEA', 'DSIP', 'Dutasteride', 'Epithalon',
          'Ezetimibe', 'Finasteride', 'GHK-Cu', 'Glutathione',
          'Injectable L-Carnitine', 'Isotretinoin', 'Lisinopril',
          'Mediphorm', 'Metformin', 'Minoxidil Oral', 'MOTS-c',
          'NAC', 'NAD+', 'Nebivolol', 'Pregnenolone',
          'Rosuvastatin', 'Selank', 'Semax', 'Sildenafil',
          'SS-31', 'Tadalafil', 'TB-500', 'Telmisartan',
          'Thymosin Alpha-1', 'TUDCA'
        ]
      }
    ]
  }
]
const CATALOG_COLOR_MAP = new Map(
  CATALOG
    .flatMap(group => group.groups.flatMap(subgroup => subgroup.items))
    .map((name, index) => [
      name,
      `hsl(${Math.round((index * 137.508) % 360)} 72% 46%)`
    ])
)

function getCompoundColor(name) {
  if (CATALOG_COLOR_MAP.has(name)) {
    return CATALOG_COLOR_MAP.get(name)
  }

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }

  return `hsl(${hash % 360} 72% 46%)`
}

const emptyForm = {
  name: '',
  type: 'Personal',
  compounds: [],
  startDate: today(),
  endDate: '',
  notes: ''
}

const makeCompound = (name, category, subcategory = '') => ({
  id: 'hc-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
  name,
  category,
  subcategory,
  color: getCompoundColor(name),
  amount: '',
  unit: 'mg',
  concentration: '',
  concentrationUnit: 'mg/ml',
  amountBasis: 'per_week',
  frequency: 'daily',
  days: [],
  notes: ''
})

export default function PerformanceHealth() {
  useLang()
  const fa = getLang() === 'fa'
  const nav = useNavigate()
  const protocols = useStore(s => s.S.healthProtocols || [])
  const doseLogs = useStore(s => s.S.healthDoseLogs || [])
  const checkIns = useStore(s => s.S.healthCheckIns || [])
const [checkInForm, setCheckInForm] = useState({
  date: today(),
  weight: '',
  waist: '',
  sleep: '',
  sleepQuality: '3',
  energy: '3',
  mood: '3',
  training: '',
  notes: ''
})
  const update = useStore(s => s.update)
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [query, setQuery] = useState('')
  const [customName, setCustomName] = useState('')
  const [customCategory, setCustomCategory] = useState('Other')
const [logForm, setLogForm] = useState({
  protocolId: '',
  compoundId: '',
  date: today(),
  amount: '',
  unit: 'mg',
  notes: ''
})

const selectedLogProtocol = protocols.find(
  p => p.id === logForm.protocolId
)

const logCompounds = Array.isArray(selectedLogProtocol?.compounds)
  ? selectedLogProtocol.compounds
  : []
  const recentDoseLogs = useMemo(() => {
  return [...doseLogs]
    .sort((a, b) =>
      (b.date || '').localeCompare(a.date || '') ||
      (b.createdAt || '').localeCompare(a.createdAt || '')
    )
    .slice(0, 10)
}, [doseLogs])

const recentCheckIns = useMemo(() => {
  return [...checkIns]
    .sort((a, b) =>
      (b.date || '').localeCompare(a.date || '') ||
      (b.createdAt || '').localeCompare(a.createdAt || '')
    )
    .slice(0, 5)
}, [checkIns])
 const [calendarMonth, setCalendarMonth] = useState(() => {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1)
})

const [selectedCalendarDate, setSelectedCalendarDate] = useState(today())

const calendarCells = useMemo(() => {
  const year = calendarMonth.getFullYear()
  const month = calendarMonth.getMonth()

  const firstDay = new Date(year, month, 1)
  const offset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  return Array.from({ length: 42 }, (_, index) => {
    const dayNumber = index - offset + 1

    if (dayNumber < 1 || dayNumber > daysInMonth) return null

    return [
      year,
      String(month + 1).padStart(2, '0'),
      String(dayNumber).padStart(2, '0')
    ].join('-')
  })
}, [calendarMonth])

const calendarLogCounts = useMemo(() => {
  return doseLogs.reduce((counts, entry) => {
    if (entry.date) {
      counts[entry.date] = (counts[entry.date] || 0) + 1
    }
    return counts
  }, {})
}, [doseLogs])

const selectedDayLogs = useMemo(() => {
  return doseLogs
    .filter(entry => entry.date === selectedCalendarDate)
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
}, [doseLogs, selectedCalendarDate])

function changeCalendarMonth(amount) {
  setCalendarMonth(old => new Date(
    old.getFullYear(),
    old.getMonth() + amount,
    1
  ))
}

function goToCalendarToday() {
  const d = new Date()
  setCalendarMonth(new Date(d.getFullYear(), d.getMonth(), 1))
  setSelectedCalendarDate(today())
}
  const tx = (en, faText) => fa ? faText : en
  const filteredCatalog = useMemo(() => CATALOG.map(group => ({
  ...group,
  groups: group.groups.map(subgroup => ({
    ...subgroup,
    items: subgroup.items.filter(name =>
      name.toLowerCase().includes(query.trim().toLowerCase())
    )
  })).filter(subgroup => subgroup.items.length)
})).filter(group => group.groups.length), [query])
  function change(key, value) {
    setForm(old => ({ ...old, [key]: value }))
  }

  function addCompound(name, category, subcategory = '') {
  if (form.compounds.some(c =>
    c.name.toLowerCase() === name.toLowerCase()
  )) return

  change('compounds', [
    ...form.compounds,
    makeCompound(name, category, subcategory)
  ])
}

  function updateCompound(id, key, value) {
    change('compounds', form.compounds.map(c => c.id === id ? { ...c, [key]: value } : c))
  }

  function toggleDay(id, day) {
    const compound = form.compounds.find(c => c.id === id)
    if (!compound) return
    const days = compound.days.includes(day)
      ? compound.days.filter(x => x !== day)
      : [...compound.days, day]
    updateCompound(id, 'days', days)
  }

  function saveProtocol(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    const item = {
      ...form,
      id: 'hp-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'active',
      compounds: form.compounds
    }
    update(s => { s.healthProtocols = [item, ...(s.healthProtocols || [])] })
    setForm(emptyForm)
    setQuery('')
    setCustomName('')
    setShowForm(false)
  }

  function removeProtocol(id) {
    if (!confirm(tx('Delete this protocol?', 'این پروتکل حذف شود؟'))) return
    update(s => { s.healthProtocols = (s.healthProtocols || []).filter(x => x.id !== id) })
  }

  function finishProtocol(id) {
    update(s => {
      s.healthProtocols = (s.healthProtocols || []).map(x =>
        x.id === id ? { ...x, status: 'completed', completedAt: new Date().toISOString() } : x
      )
    })
  }
function saveDoseLog(e) {
  e.preventDefault()

  const protocol = protocols.find(p => p.id === logForm.protocolId)
  const compound = Array.isArray(protocol?.compounds)
    ? protocol.compounds.find(c => c.id === logForm.compoundId)
    : null

  if (!protocol || !compound || !logForm.date || !logForm.amount.trim()) {
    return
  }

  const entry = {
    id: 'hl-' + Date.now(),
    protocolId: protocol.id,
    protocolName: protocol.name,
    compoundId: compound.id,
    compoundName: compound.name,
    date: logForm.date,
    amount: logForm.amount.trim(),
    unit: logForm.unit,
    notes: logForm.notes.trim(),
    createdAt: new Date().toISOString()
  }

  update(s => {
    s.healthDoseLogs = [entry, ...(s.healthDoseLogs || [])]
  })

  setLogForm(old => ({
    ...old,
    compoundId: '',
    amount: '',
    notes: ''
  }))
}

function removeDoseLog(id) {
  if (!confirm(tx('Delete this log entry?', 'این ثبت از تاریخچه حذف شود؟'))) return

  update(s => {
    s.healthDoseLogs = (s.healthDoseLogs || []).filter(x => x.id !== id)
  })
}
 function saveCheckIn(e) {
  e.preventDefault()

  const entry = {
    id: 'hci-' + Date.now(),
    ...checkInForm,
    createdAt: new Date().toISOString()
  }

  update(s => {
    s.healthCheckIns = [
      entry,
      ...(s.healthCheckIns || [])
    ]
  })

  setCheckInForm({
    date: today(),
    weight: '',
    waist: '',
    sleep: '',
    sleepQuality: '3',
    energy: '3',
    mood: '3',
    training: '',
    notes: ''
  })
}

function removeCheckIn(id) {
  if (!confirm(tx(
    'Delete this weekly check-in?',
    'این ارزیابی هفتگی حذف شود؟'
  ))) return

  update(s => {
    s.healthCheckIns = (s.healthCheckIns || [])
      .filter(entry => entry.id !== id)
  })
}
  const days = [
    ['Mon', 'د'], ['Tue', 'س'], ['Wed', 'چ'], ['Thu', 'پ'],
    ['Fri', 'ج'], ['Sat', 'ش'], ['Sun', 'ی']
  ]
const activeCount = protocols.filter(p => p.status === 'active').length
const completedCount = protocols.filter(p => p.status === 'completed').length
const compoundCount = protocols.reduce(
  (total, p) => total + (Array.isArray(p.compounds) ? p.compounds.length : 0),
  0
)
  return (
    <main className="health-page" dir={fa ? 'rtl' : 'ltr'}>
      <button className="health-secondary" onClick={() => nav('/health')}>
        {tx('‹ Back', '‹ بازگشت')}
      </button>


      <header className="health-header">
        <div>
          <h1>{tx('Performance', 'پایش عملکرد')}</h1>
          <p className="health-muted">
            {tx('Your personal compound library and protocol records.', 'کتابخانه ترکیبات و سوابق پروتکل‌های شخصی شما.')}
          </p>
        </div>
      </header>

<div className="health-stats-grid">
  <div className="health-stat-card">
    <span>{tx('Active records', 'سوابق فعال')}</span>
    <strong>{activeCount}</strong>
  </div>

  <div className="health-stat-card">
    <span>{tx('Completed', 'پایان‌یافته')}</span>
    <strong>{completedCount}</strong>
  </div>

  <div className="health-stat-card">
    <span>{tx('Recorded compounds', 'ترکیبات ثبت‌شده')}</span>
    <strong>{compoundCount}</strong>
  </div>

  <div className="health-stat-card">
    <span>{tx('Total records', 'کل سوابق')}</span>
    <strong>{protocols.length}</strong>
  </div>
</div>
      <section className="health-card health-log-section">
  <div className="health-picker-heading">
    <h3>{tx('Daily log', 'ثبت روزانه')}</h3>
    <span>{tx('Personal record only', 'صرفاً ثبت سوابق شخصی')}</span>
  </div>

  <form className="health-log-form" onSubmit={saveDoseLog}>
    <label>
      {tx('Protocol', 'پروتکل')}
      <select
        value={logForm.protocolId}
        onChange={e => setLogForm(old => ({
          ...old,
          protocolId: e.target.value,
          compoundId: ''
        }))}
        required
      >
        <option value="">{tx('Select a protocol', 'انتخاب پروتکل')}</option>
        {protocols.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </label>

    <label>
      {tx('Compound', 'ترکیب')}
      <select
        value={logForm.compoundId}
        onChange={e => setLogForm(old => ({
          ...old,
          compoundId: e.target.value
        }))}
        disabled={!logCompounds.length}
        required
      >
        <option value="">{tx('Select a compound', 'انتخاب ترکیب')}</option>
        {logCompounds.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </label>

    <div className="health-form-row">
      <label>
        {tx('Record date', 'تاریخ ثبت')}
<HealthDatePicker
  value={logForm.date}
  onChange={value => setLogForm(old => ({
    ...old,
    date: value
  }))}
/>
      </label>

      <label>
        {tx('Recorded amount', 'مقدار ثبت‌شده')}
        <input
          inputMode="decimal"
          value={logForm.amount}
          onChange={e => setLogForm(old => ({
            ...old,
            amount: e.target.value
          }))}
          placeholder="—"
          required
        />
      </label>
    </div>

    <label>
      {tx('Unit', 'واحد')}
      <select
        value={logForm.unit}
        onChange={e => setLogForm(old => ({
          ...old,
          unit: e.target.value
        }))}
      >
        <option>mg</option>
        <option>mcg</option>
        <option>ml</option>
        <option>IU</option>
        <option>g</option>
        <option>capsule</option>
        <option>tablet</option>
        <option>other</option>
      </select>
    </label>

    <label>
      {tx('Notes (optional)', 'توضیحات (اختیاری)')}
      <input
        value={logForm.notes}
        onChange={e => setLogForm(old => ({
          ...old,
          notes: e.target.value
        }))}
      />
    </label>

    <button
      className="health-primary"
      type="submit"
      disabled={!protocols.length || !logCompounds.length}
    >
      {tx('Save log entry', 'ثبت در تاریخچه')}
    </button>
  </form>

<HealthDoseSchedule />      
        
<div className="health-log-history">
  <div className="health-history-title-row">
    <h3>{tx('Recent entries', '۱۰ ثبت اخیر')}</h3>

    <button
      type="button"
      className="health-view-all-link"
      onClick={() => nav('/health/performance/logs')}
    >
      {tx('View all →', 'مشاهده همه ←')}
    </button>
  </div>

  {doseLogs.length === 0 ? (
    <p className="health-muted">
      {tx('No entries recorded yet.', 'هنوز موردی ثبت نشده است.')}
    </p>
  ) : (
    <>
     <div className="health-log-preview-grid">
  {recentDoseLogs.map(entry => (
    <article
      className="health-log-entry health-log-entry-compact"
      key={entry.id}
    >

<div className="health-log-entry-content">
  <div
    className="health-log-compound-name"
    style={{ '--compound-color': getCompoundColor(entry.compoundName) }}
  >
    <span className="health-log-compound-dot" />
    <strong>{entry.compoundName}</strong>
  </div>

  <small>{entry.protocolName} · {entry.date}</small>

  <span className="health-log-entry-amount">
    {entry.amount} {entry.unit}
  </span>

  {entry.notes && <small>{entry.notes}</small>}
</div>
      
      <button
        type="button"
        className="health-danger"
        onClick={() => removeDoseLog(entry.id)}
      >
        {tx('Delete', 'حذف')}
      </button>
    </article>
  ))}
</div>

      {doseLogs.length > 10 && (
        <p className="health-muted health-preview-count">
          {tx(
            `Showing 10 of ${doseLogs.length} entries`,
            `نمایش ۱۰ مورد از ${doseLogs.length} ثبت`
          )}
        </p>
      )}
    </>
  )}
</div>
       </section>
       <HealthSideEffects />
        <section className="health-card health-checkin-section">
  <div className="health-picker-heading">
    <h3>{tx('Weekly check-in', 'ارزیابی هفتگی')}</h3>
    <span>{tx('Track your personal progress', 'ثبت روند وضعیت شخصی')}</span>
  </div>

  <form className="health-checkin-form" onSubmit={saveCheckIn}>
    <label>
      {tx('Assessment date', 'تاریخ ارزیابی')}
<HealthDatePicker
  value={checkInForm.date}
  onChange={value => setCheckInForm(old => ({
    ...old,
    date: value
  }))}
/>
    </label>

    <div className="health-checkin-grid">
      <label>
        {tx('Body weight (kg)', 'وزن بدن (کیلوگرم)')}
        <input
          type="number"
          step="0.1"
          min="0"
          value={checkInForm.weight}
          onChange={e => setCheckInForm(old => ({
            ...old,
            weight: e.target.value
          }))}
          placeholder="—"
        />
      </label>

      <label>
        {tx('Waist (cm)', 'دور کمر (سانتی‌متر)')}
        <input
          type="number"
          step="0.1"
          min="0"
          value={checkInForm.waist}
          onChange={e => setCheckInForm(old => ({
            ...old,
            waist: e.target.value
          }))}
          placeholder="—"
        />
      </label>

      <label>
        {tx('Average sleep (hours)', 'میانگین خواب (ساعت)')}
        <input
          type="number"
          step="0.5"
          min="0"
          max="24"
          value={checkInForm.sleep}
          onChange={e => setCheckInForm(old => ({
            ...old,
            sleep: e.target.value
          }))}
          placeholder="—"
        />
      </label>
    </div>

    {[
      ['sleepQuality', 'Sleep quality', 'کیفیت خواب'],
      ['energy', 'Energy level', 'سطح انرژی'],
      ['mood', 'General well-being', 'حال عمومی']
    ].map(([key, en, faText]) => (
      <label key={key}>
        {tx(en, faText)}
        <select
          value={checkInForm[key]}
          onChange={e => setCheckInForm(old => ({
            ...old,
            [key]: e.target.value
          }))}
        >
          <option value="1">{tx('1 - Very low', '۱ - خیلی ضعیف')}</option>
          <option value="2">{tx('2 - Low', '۲ - ضعیف')}</option>
          <option value="3">{tx('3 - متوسط', '۳ - متوسط')}</option>
          <option value="4">{tx('4 - Good', '۴ - خوب')}</option>
          <option value="5">{tx('5 - Very good', '۵ - خیلی خوب')}</option>
        </select>
      </label>
    ))}

    <label>
      {tx('Training status', 'وضعیت تمرین')}
      <select
        value={checkInForm.training}
        onChange={e => setCheckInForm(old => ({
          ...old,
          training: e.target.value
        }))}
      >
        <option value="">{tx('Not specified', 'مشخص نشده')}</option>
        <option value="excellent">{tx('Excellent', 'عالی')}</option>
        <option value="good">{tx('Good', 'خوب')}</option>
        <option value="average">{tx('Average', 'متوسط')}</option>
        <option value="poor">{tx('Poor', 'ضعیف')}</option>
      </select>
    </label>

    <label>
      {tx('Notes', 'توضیحات')}
      <textarea
        rows="3"
        value={checkInForm.notes}
        onChange={e => setCheckInForm(old => ({
          ...old,
          notes: e.target.value
        }))}
        placeholder={tx(
          'Any observations about this week...',
          'هر نکته‌ای درباره وضعیت این هفته...'
        )}
      />
    </label>

    <button className="health-primary" type="submit">
      {tx('Save weekly check-in', 'ذخیره ارزیابی هفتگی')}
    </button>
  </form>
<div className="health-checkin-history">
  <div className="health-history-title-row">
    <h4>{tx('Previous check-ins', '۵ ارزیابی اخیر')}</h4>

    <button
      type="button"
      className="health-view-all-link"
      onClick={() => nav('/health/performance/check-ins')}
    >
      {tx('View all →', 'مشاهده همه ←')}
    </button>
  </div>

  {checkIns.length === 0 ? (
    <p className="health-muted">
      {tx('No weekly check-ins yet.', 'هنوز ارزیابی هفتگی ثبت نشده است.')}
    </p>
  ) : (
    <>
      {recentCheckIns.map(entry => (
        <article
          className="health-checkin-entry health-checkin-entry-compact"
          key={entry.id}
        >
          <div className="health-checkin-entry-heading">
            <strong>{entry.date}</strong>

            <button
              type="button"
              className="health-danger"
              onClick={() => removeCheckIn(entry.id)}
            >
              {tx('Delete', 'حذف')}
            </button>
          </div>

          <div className="health-checkin-values">
            {entry.weight && (
              <span>{tx('Weight:', 'وزن:')} {entry.weight} kg</span>
            )}

            {entry.waist && (
              <span>{tx('Waist:', 'دور کمر:')} {entry.waist} cm</span>
            )}

            {entry.sleep && (
              <span>{tx('Sleep:', 'خواب:')} {entry.sleep} h</span>
            )}

            <span>
              {tx('Sleep quality:', 'کیفیت خواب:')} {entry.sleepQuality}/5
            </span>

            <span>
              {tx('Energy:', 'انرژی:')} {entry.energy}/5
            </span>

            <span>
              {tx('Well-being:', 'حال عمومی:')} {entry.mood}/5
            </span>
          </div>

          {entry.training && (
            <p>
              {tx('Training:', 'تمرین:')} {tx(
                ({
                  excellent: 'Excellent',
                  good: 'Good',
                  average: 'Average',
                  poor: 'Poor'
                })[entry.training] || entry.training,
                ({
                  excellent: 'عالی',
                  good: 'خوب',
                  average: 'متوسط',
                  poor: 'ضعیف'
                })[entry.training] || entry.training
              )}
            </p>
          )}

          {entry.notes && <p>{entry.notes}</p>}
        </article>
      ))}

      {checkIns.length > 5 && (
        <p className="health-muted health-preview-count">
          {tx(
            `Showing 5 of ${checkIns.length} check-ins`,
            `نمایش ۵ مورد از ${checkIns.length} ارزیابی`
          )}
        </p>
      )}
    </>
  )}
</div>
     </section>
          <div className="health-section-heading">
        <h2>{tx('My protocols', 'پروتکل‌های من')}</h2>
        <button className="health-primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? tx('Cancel', 'انصراف') : tx('+ New protocol', '+ پروتکل جدید')}
        </button>
      </div>

      {showForm && (
        <form className="health-card health-protocol-form" onSubmit={saveProtocol}>
          <label>
            {tx('Protocol name', 'عنوان پروتکل')}
            <input value={form.name} onChange={e => change('name', e.target.value)}
              placeholder={tx('e.g. Personal health record', 'مثلاً سوابق شخصی')} required />
          </label>

          <div className="health-form-row">
            <label>
              {tx('Record category', 'دسته‌بندی سابقه')}
              <select value={form.type} onChange={e => change('type', e.target.value)}>
                <option value="Personal">{tx('Personal', 'شخصی')}</option>
                <option value="Prescribed">{tx('Prescribed treatment', 'درمان تجویزشده')}</option>
                <option value="Other">{tx('Other', 'سایر')}</option>
              </select>
            </label>
            <label>
              {tx('Start date', 'تاریخ شروع')}
              <HealthDatePicker
  value={form.startDate}
  onChange={value => change('startDate', value)}
/>
            </label>
          </div>

          <section className="health-compound-picker">
            <div className="health-picker-heading">
              <h3>{tx('Compound library', 'کتابخانه ترکیبات')}</h3>
              <span>{tx('Select items to add to this record', 'موارد موردنظر را به این سابقه اضافه کنید')}</span>
            </div>
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder={tx('Search compounds and supplements…', 'جست‌وجوی ترکیبات و مکمل‌ها…')} />
<div className="health-catalog-groups">
  {filteredCatalog.map(group => (
    <div className="health-catalog-group" key={group.category}>
      <h4>{fa ? group.fa : group.category}</h4>

      {group.groups.map(subgroup => (
        <div className="health-catalog-subgroup" key={subgroup.name || group.category}>
          {subgroup.name && <h5>{subgroup.name}</h5>}

          <div className="health-catalog-items">
            {subgroup.items.map(name => {
              const selected = form.compounds.some(
                c => c.name.toLowerCase() === name.toLowerCase()
              )

              return (
                <button
                  type="button"
                  key={name}
                  className={'health-catalog-chip' + (selected ? ' selected' : '')}
                  style={{ '--compound-color': getCompoundColor(name) }}
                  onClick={() => selected
                    ? change('compounds', form.compounds.filter(
                        c => c.name.toLowerCase() !== name.toLowerCase()
                      ))
                    : addCompound(name, group.category, subgroup.name)
                  }
                >
                  <span className="health-catalog-color-dot" />
                  {name}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  ))}

  {!filteredCatalog.length && (
    <p className="health-muted">
      {tx(
        'No catalog match. Add it below as a custom item.',
        'موردی پیدا نشد؛ می‌توانید آن را به‌صورت دستی اضافه کنید.'
      )}
    </p>
  )}
</div>
            <div className="health-custom-compound">
              <input value={customName} onChange={e => setCustomName(e.target.value)}
                placeholder={tx('Add a custom compound or supplement', 'افزودن ترکیب یا مکمل دلخواه')} />
              <select value={customCategory} onChange={e => setCustomCategory(e.target.value)}>
                <option value="Other">{tx('Other', 'سایر')}</option>
                {CATALOG.map(g => <option key={g.category} value={g.category}>{fa ? g.fa : g.category}</option>)}
              </select>
              <button type="button" className="health-secondary" disabled={!customName.trim()}
                onClick={() => { addCompound(customName.trim(), customCategory); setCustomName('') }}>
                {tx('Add', 'افزودن')}
              </button>
            </div>
          </section>

          {form.compounds.length > 0 && (
            <section className="health-selected-compounds">
              <div className="health-picker-heading">
                <h3>{tx('Selected items', 'موارد انتخاب‌شده')}</h3>
                <span>{form.compounds.length}</span>
              </div>
              {form.compounds.map(compound => (
                <article
  className="health-compound-editor"
  key={compound.id}
  style={{ '--compound-color': getCompoundColor(compound.name) }}
>
  <div className="health-row">
    <div className="health-compound-title">
      <span className="health-compound-color-dot" />
      <div>
        <strong>{compound.name}</strong>
        <small>{compound.category}</small>
      </div>
    </div>
                    <button type="button" className="health-danger"
                      onClick={() => change('compounds', form.compounds.filter(c => c.id !== compound.id))}>
                      {tx('Remove', 'حذف')}
                    </button>
                  </div>
            
              <div className="health-dose-block">
  <div className="health-dose-fields">
    <label>
      {tx('Recorded amount', 'مقدار ثبت‌شده')}
      <input
        inputMode="decimal"
        value={compound.amount}
        onChange={e => updateCompound(compound.id, 'amount', e.target.value)}
        placeholder="—"
      />
    </label>

    <label>
      {tx('Unit', 'واحد')}
      <select
        value={compound.unit}
        onChange={e => updateCompound(compound.id, 'unit', e.target.value)}
      >
        <option>mg</option>
        <option>mcg</option>
        <option>ml</option>
        <option>IU</option>
        <option>g</option>
        <option>capsule</option>
        <option>tablet</option>
        <option>other</option>
      </select>
    </label>
  </div>

  <div className="health-dose-mode">
    <button
      type="button"
      className={compound.amountBasis === 'per_week' ? 'active' : ''}
      onClick={() => updateCompound(compound.id, 'amountBasis', 'per_week')}
    >
      {tx('Per week', 'در هفته')}
    </button>

    <button
      type="button"
      className={compound.amountBasis === 'per_dose' ? 'active' : ''}
      onClick={() => updateCompound(compound.id, 'amountBasis', 'per_dose')}
    >
      {tx('Per dose', 'در هر نوبت')}
    </button>
  </div>
</div>

<div className="health-frequency-block">
  <strong>{tx('Recorded frequency', 'تناوب ثبت‌شده')}</strong>

  <div className="health-frequency-options">
    {[
      ['daily', 'Daily', 'روزانه'],
      ['every_other_day', 'Every other day', 'یک روز در میان'],
      ['selected_days', 'Selected days', 'روزهای انتخابی']
    ].map(([value, en, faLabel]) => (
      <button
        type="button"
        key={value}
        className={compound.frequency === value ? 'active' : ''}
        onClick={() => updateCompound(compound.id, 'frequency', value)}
      >
        {tx(en, faLabel)}
      </button>
    ))}
  </div>

  {compound.frequency === 'selected_days' && (
    <div className="health-day-picker">
      {days.map(([day, faDay]) => (
        <button
          type="button"
          key={day}
          className={(compound.days || []).includes(day) ? 'active' : ''}
          aria-pressed={(compound.days || []).includes(day)}
          onClick={() => toggleDay(compound.id, day)}
        >
          {fa ? faDay : day.slice(0, 2)}
        </button>
      ))}
    </div>
  )}
</div>
                  <div className="health-form-row">
                    <label>{tx('Label concentration', 'غلظت درج‌شده روی بسته')}
                      <input value={compound.concentration}
                        onChange={e => updateCompound(compound.id, 'concentration', e.target.value)}
                        placeholder={tx('e.g. label value', 'مقدار درج‌شده روی برچسب')} />
                    </label>
                    <label>{tx('Concentration unit', 'واحد غلظت')}
                      <select value={compound.concentrationUnit}
                        onChange={e => updateCompound(compound.id, 'concentrationUnit', e.target.value)}>
                        <option>mg/ml</option><option>mcg/ml</option><option>IU/ml</option><option>mg/tablet</option><option>other</option>
                      </select>
                    </label>
                  </div>
                  <label>{tx('Notes', 'توضیحات')}
                    <input value={compound.notes} onChange={e => updateCompound(compound.id, 'notes', e.target.value)} />
                  </label>
                </article>
              ))}
            </section>
          )}

          <div className="health-form-row">
            <label>{tx('End date (optional)', 'تاریخ پایان (اختیاری)')}
              <HealthDatePicker
  value={form.endDate}
  onChange={value => change('endDate', value)}
/>
            </label>
            <label>{tx('Notes', 'توضیحات')}
              <input value={form.notes} onChange={e => change('notes', e.target.value)} />
            </label>
          </div>

          <button className="health-primary" type="submit">{tx('Save record', 'ذخیره سابقه')}</button>
        </form>
      )}

   
{protocols.length === 0 ? (
  <div className="health-empty">
    <div style={{ fontSize: 38 }}>📋</div>
    <h2>{tx('No protocols yet', 'هنوز سابقه‌ای ثبت نشده')}</h2>
    <p className="health-muted">
      {tx(
        'Create a record and add items from the compound library.',
        'یک سابقه بسازید و موارد را از کتابخانه ترکیبات اضافه کنید.'
      )}
    </p>
  </div>
) : (
  <div className="health-protocol-list">
    {protocols.map(item => {
      const compoundList = Array.isArray(item.compounds)
        ? item.compounds
        : []

      const isActive = item.status === 'active'
      const previewCompounds = compoundList.slice(0, 3)
      const remainingCount = compoundList.length - previewCompounds.length

      const protocolType = {
        Personal: tx('Personal', 'شخصی'),
        Prescribed: tx('Prescribed treatment', 'درمان تجویزشده'),
        Other: tx('Other', 'سایر')
      }[item.type] || item.type || tx('Personal', 'شخصی')

      return (
        <article
          className="health-card health-protocol-overview"
          key={item.id}
        >
          <div className="health-protocol-overview-top">
            <div className="health-protocol-heading">
              <span className="health-protocol-eyebrow">
                {tx('HEALTH RECORD', 'سابقه سلامت')}
              </span>
              <h2>{item.name}</h2>
              <span className="health-protocol-type">
                {protocolType}
              </span>
            </div>

            <span className={
              'health-protocol-status ' +
              (isActive ? 'active' : 'completed')
            }>
              <span className="health-protocol-status-dot" />
              {isActive
                ? tx('Active', 'فعال')
                : tx('Completed', 'پایان‌یافته')}
            </span>
          </div>

          <div className="health-protocol-metrics">
            <div>
              <span>{tx('Compounds', 'ترکیبات')}</span>
              <strong>{compoundList.length}</strong>
            </div>
            <div>
              <span>{tx('Start date', 'تاریخ شروع')}</span>
              <strong>{item.startDate || '—'}</strong>
            </div>
            <div>
              <span>{tx('End date', 'تاریخ پایان')}</span>
              <strong>{item.endDate || (isActive
                ? tx('Ongoing', 'در حال انجام')
                : '—')}</strong>
            </div>
          </div>

          <div className="health-protocol-compound-preview">
  <div className="health-protocol-preview-heading">
    <strong>{tx('Compound details', 'جزئیات ترکیبات')}</strong>
    <span>{compoundList.length}</span>
  </div>

  {compoundList.length > 0 ? (
    <div className="health-protocol-compound-list">
      {compoundList.map(c => {
        const frequency = {
          daily: tx('Daily', 'روزانه'),
          every_other_day: tx('Every other day', 'یک روز در میان'),
          selected_days: tx('Selected days', 'روزهای انتخابی')
        }[c.frequency] || tx('Not specified', 'مشخص نشده')

        const amountBasis = c.amountBasis === 'per_dose'
          ? tx('Per dose', 'در هر نوبت')
          : tx('Per week', 'در هفته')

        const dayNames = {
          Mon: 'دوشنبه',
          Tue: 'سه‌شنبه',
          Wed: 'چهارشنبه',
          Thu: 'پنجشنبه',
          Fri: 'جمعه',
          Sat: 'شنبه',
          Sun: 'یکشنبه'
        }

        return (
          <article
            className="health-protocol-compound-row"
            key={c.id || c.name}
            style={{ '--compound-color': getCompoundColor(c.name) }}
          >
            <div className="health-protocol-compound-name">
              <span />
              <div>
                <strong>{c.name}</strong>
                <small>{c.subcategory || c.category || tx('Custom item', 'مورد دلخواه')}</small>
              </div>
            </div>

            <div className="health-protocol-compound-meta">
              <div>
                <small>{tx('Recorded amount', 'مقدار ثبت‌شده')}</small>
                <strong>
                  {c.amount
                    ? `${c.amount} ${c.unit || ''}`
                    : tx('Not recorded', 'ثبت نشده')}
                </strong>
                {c.amount && <small>{amountBasis}</small>}
              </div>

              <div>
                <small>{tx('Frequency', 'تناوب')}</small>
                <strong>{frequency}</strong>
                {c.frequency === 'selected_days' && (
                  <small>
                    {(c.days || []).map(day =>
                      fa ? dayNames[day] || day : day
                    ).join('، ') || '—'}
                  </small>
                )}
              </div>
           {c.concentration && (
  <div className="health-protocol-compound-wide">
    <small>{tx('Concentration', 'غلظت')}</small>
    <strong>
      {c.concentration} {c.concentrationUnit || ''}
    </strong>
  </div>
)}
            </div>
            {c.notes && (
  <p className="health-protocol-compound-notes">
    {c.notes}
  </p>
)}
          </article>
        )
      })}
    </div>
  ) : (
    <p className="health-muted">
      {tx('No compounds added.', 'ترکیبی اضافه نشده است.')}
    </p>
  )}
</div>

          {item.notes && (
            <p className="health-protocol-overview-notes">
              {item.notes}
            </p>
          )}

          <div className="health-protocol-actions">
            {isActive && (
              <button
                className="health-secondary"
                onClick={() => finishProtocol(item.id)}
              >
                {tx('Mark completed', 'ثبت پایان پروتکل')}
              </button>
            )}
            <button
              className="health-danger"
              onClick={() => removeProtocol(item.id)}
            >
              {tx('Delete', 'حذف')}
            </button>
          </div>
        </article>
      )
    })}
  </div>
)}

    </main>
  )
}
