import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { getLang, useLang } from '../lib/i18n.js'
import './health-hub.css'

const today = () => new Date().toISOString().slice(0, 10)

const CATALOG = [
  { category: 'Anabolic & hormonal', fa: 'آنابولیک و هورمونی', items: ['Testosterone', 'Testosterone cypionate', 'Testosterone enanthate', 'Testosterone propionate', 'Sustanon', 'Nandrolone', 'Boldenone', 'Trenbolone', 'Drostanolone', 'Methenolone (Primobolan)', 'Oxandrolone', 'Stanozolol', 'Methandienone', 'Oxymetholone', 'Fluoxymesterone', 'Clomiphene', 'Enclomiphene', 'Tamoxifen', 'Anastrozole', 'Exemestane', 'Letrozole', 'hCG', 'hMG', 'DHEA'] },
  { category: 'Peptides & related', fa: 'پپتیدها و ترکیبات مرتبط', items: ['BPC-157', 'TB-500', 'CJC-1295', 'Ipamorelin', 'GHRP-2', 'GHRP-6', 'Tesamorelin', 'Sermorelin', 'IGF-1 LR3', 'MK-677 (Ibutamoren)', 'AOD-9604', 'GHK-Cu', 'Melanotan II', 'PT-141'] },
  { category: 'Ancillaries', fa: 'داروهای کمکی', items: ['Cabergoline', 'Pramipexole', 'Finasteride', 'Dutasteride', 'Proviron (Mesterolone)', 'Raloxifene', 'Aromasin (Exemestane)', 'Arimidex (Anastrozole)', 'Nolvadex (Tamoxifen)'] },
  { category: 'Health support', fa: 'حمایت از سلامت', items: ['Omega-3', 'Vitamin D3', 'Vitamin K2', 'Magnesium', 'Zinc', 'CoQ10', 'NAC', 'TUDCA', 'Milk thistle', 'Psyllium', 'Electrolytes', 'Fiber'] },
  { category: 'Supplements', fa: 'مکمل‌ها', items: ['Whey protein', 'Creatine monohydrate', 'Casein protein', 'EAAs', 'BCAAs', 'Beta-alanine', 'Citrulline', 'Caffeine', 'L-Carnitine', 'Ashwagandha', 'Multivitamin', 'Collagen'] }
]

const emptyForm = {
  name: '',
  type: 'Personal',
  compounds: [],
  startDate: today(),
  endDate: '',
  notes: ''
}

const makeCompound = (name, category) => ({
  id: 'hc-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
  name,
  category,
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
  const tx = (en, faText) => fa ? faText : en
  const filteredCatalog = useMemo(() => CATALOG.map(group => ({
    ...group,
    items: group.items.filter(name => name.toLowerCase().includes(query.trim().toLowerCase()))
  })).filter(group => group.items.length), [query])

  function change(key, value) {
    setForm(old => ({ ...old, [key]: value }))
  }

  function addCompound(name, category) {
    if (form.compounds.some(c => c.name.toLowerCase() === name.toLowerCase())) return
    change('compounds', [...form.compounds, makeCompound(name, category)])
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
          <h1>{tx('Performance & Health', 'پایش عملکرد و سلامت')}</h1>
          <p className="health-muted">
            {tx('Your personal compound library and protocol records.', 'کتابخانه ترکیبات و سوابق پروتکل‌های شخصی شما.')}
          </p>
        </div>
      </header>

      <div className="health-warning">
        {tx(
          'Recordkeeping only. This tool does not recommend compounds, doses, cycles or medication changes. Enter only information from your own records and discuss treatment decisions with a qualified clinician.',
          'این ابزار صرفاً برای ثبت سوابق است و هیچ ترکیب، دوز، چرخه یا تغییری در دارو پیشنهاد نمی‌کند. فقط اطلاعات سوابق خود را وارد کنید و تصمیم‌های درمانی را با پزشک بررسی کنید.'
        )}
      </div>
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
              <input type="date" value={form.startDate} onChange={e => change('startDate', e.target.value)} />
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
                  <div className="health-catalog-items">
                    {group.items.map(name => {
                      const selected = form.compounds.some(c => c.name.toLowerCase() === name.toLowerCase())
                      return <button type="button" key={name}
                        className={'health-catalog-chip' + (selected ? ' selected' : '')}
                        onClick={() => selected
                          ? change('compounds', form.compounds.filter(c => c.name.toLowerCase() !== name.toLowerCase()))
                          : addCompound(name, group.category)}>
                        {selected ? '✓ ' : '+ '}{name}
                      </button>
                    })}
                  </div>
                </div>
              ))}
              {!filteredCatalog.length && <p className="health-muted">{tx('No catalog match. Add it below as a custom item.', 'موردی پیدا نشد؛ می‌توانید آن را به‌صورت دستی اضافه کنید.')}</p>}
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
                <article className="health-compound-editor" key={compound.id}>
                  <div className="health-row">
                    <div>
                      <strong>{compound.name}</strong>
                      <small>{compound.category}</small>
                    </div>
                    <button type="button" className="health-danger"
                      onClick={() => change('compounds', form.compounds.filter(c => c.id !== compound.id))}>
                      {tx('Remove', 'حذف')}
                    </button>
                  </div>
            <div className="health-dose-block">
  <label>
    {tx('Recorded amount', 'مقدار ثبت‌شده')}
    <input
      inputMode="decimal"
      value={compound.amount}
      onChange={e => updateCompound(compound.id, 'amount', e.target.value)}
      placeholder="—"
    />
  </label>

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
                    <label>{tx('Label concentration (optional)', 'غلظت درج‌شده روی بسته (اختیاری)')}
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
              <input type="date" value={form.endDate} onChange={e => change('endDate', e.target.value)} />
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
          <p className="health-muted">{tx('Create a record and add items from the compound library.', 'یک سابقه بسازید و موارد را از کتابخانه ترکیبات اضافه کنید.')}</p>
        </div>
      ) : (
        <div className="health-protocol-list">
          {protocols.map(item => {
            const compoundList = Array.isArray(item.compounds) ? item.compounds : []
            return (
              <article className="health-card" key={item.id}>
                <div className="health-row">
                  <div>
                    <h2>{item.name}</h2>
                    <span className="health-protocol-type">{item.type || 'Personal'}</span>
                  </div>
                  <span className={'health-protocol-status ' + item.status}>
                    {item.status === 'active' ? tx('Active', 'فعال') : tx('Completed', 'پایان‌یافته')}
                  </span>
                </div>
                {Array.isArray(item.compounds) ? (
                  compoundList.length ? <div className="health-record-compounds">
                    {compoundList.map(c => <div className="health-record-compound" key={c.id || c.name}>
                      <div><strong>{c.name}</strong><small>{c.category}</small></div>
<span>
  {c.amount
    ? `${c.amount} ${c.unit} · ${
        c.amountBasis === 'per_dose'
          ? tx('Per dose', 'در هر نوبت')
          : tx('Per week', 'در هفته')
      }`
    : tx('Amount not entered', 'مقدار ثبت نشده')}
</span>

<small>
  {tx('Frequency:', 'تناوب:')} {tx(
    ({
      daily: 'Daily',
      every_other_day: 'Every other day',
      weekly: 'Weekly',
      selected_days: 'Selected weekdays'
    })[c.frequency] || 'Not specified',
    ({
      daily: 'روزانه',
      every_other_day: 'یک روز در میان',
      weekly: 'هفتگی',
      selected_days: 'روزهای انتخابی'
    })[c.frequency] || 'نامشخص'
  )}
</small>

{c.frequency === 'selected_days' && Array.isArray(c.days) && c.days.length > 0 && (
  <small>
    {tx('Days:', 'روزها:')} {c.days.map(day => {
      const match = days.find(([key]) => key === day)
      return match ? (fa ? match[1] : match[0]) : day
    }).join('، ')}
  </small>
)}

{c.concentration && (
  <small>
    {tx('Concentration:', 'غلظت:')} {c.concentration} {c.concentrationUnit}
  </small>
)}
                    </div>)}
                  </div> : <p className="health-protocol-detail">{tx('No compounds added.', 'ترکیبی اضافه نشده است.')}</p>
                ) : item.compounds ? <p className="health-protocol-detail"><b>{tx('Legacy compounds:', 'ترکیبات ثبت‌شده قبلی:')}</b> {item.compounds}</p> : null}
                <p className="health-protocol-detail">
                  <b>{tx('Start:', 'شروع:')}</b> {item.startDate || '—'} {' · '}
                  <b>{tx('End:', 'پایان:')}</b> {item.endDate || '—'}
                </p>
                {item.notes && <p className="health-protocol-detail">{item.notes}</p>}
                <div className="health-protocol-actions">
                  {item.status === 'active' && <button className="health-secondary" onClick={() => finishProtocol(item.id)}>{tx('Mark completed', 'ثبت پایان پروتکل')}</button>}
                  <button className="health-danger" onClick={() => removeProtocol(item.id)}>{tx('Delete', 'حذف')}</button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}
