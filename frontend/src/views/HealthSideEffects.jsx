import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getLang, useLang } from '../lib/i18n.js'

const today = () => todayISO()
const blankForm = () => ({
  date: today(),
  symptom: '',
  severity: 'mild',
  protocolId: '',
  compoundId: '',
  notes: ''
})

export default function HealthSideEffects() {
  useLang()
  const fa = getLang() === 'fa'
  const calendar = useStore(s => s.S?.calendar === 'jalali' ? 'jalali' : 'gregorian')
  const tx = (en, faText) => fa ? faText : en
  const entries = useStore(s => Array.isArray(s.S.healthSideEffects) ? s.S.healthSideEffects : [])
  const protocols = useStore(s => Array.isArray(s.S.healthProtocols) ? s.S.healthProtocols : [])
  const update = useStore(s => s.update)
  const [form, setForm] = useState(blankForm)
  const [showAll, setShowAll] = useState(false)

  const selectedProtocol = protocols.find(p => p.id === form.protocolId)
  const compounds = Array.isArray(selectedProtocol?.compounds) ? selectedProtocol.compounds : []
  const sorted = useMemo(() => [...entries].sort((a, b) =>
    (b.date || '').localeCompare(a.date || '') ||
    (b.createdAt || '').localeCompare(a.createdAt || '')
  ), [entries])
  const visible = showAll ? sorted : sorted.slice(0, 5)
  const activeCount = entries.filter(x => x.status !== 'resolved').length
  const severeCount = entries.filter(x => x.status !== 'resolved' && x.severity === 'severe').length

  function save(e) {
    e.preventDefault()
    if (!form.symptom.trim() || !form.date) return
    const protocol = protocols.find(p => p.id === form.protocolId)
    const compound = Array.isArray(protocol?.compounds)
      ? protocol.compounds.find(c => c.id === form.compoundId)
      : null
    const entry = {
      id: 'hse-' + Date.now(),
      date: form.date,
      symptom: form.symptom.trim(),
      severity: form.severity,
      protocolId: protocol?.id || '',
      protocolName: protocol?.name || '',
      compoundId: compound?.id || '',
      compoundName: compound?.name || '',
      notes: form.notes.trim(),
      status: 'active',
      createdAt: new Date().toISOString()
    }
    update(s => {
      s.healthSideEffects = [
        entry,
        ...(Array.isArray(s.healthSideEffects) ? s.healthSideEffects : [])
      ]
    })
    setForm(blankForm())
  }

  function resolve(id) {
    update(s => {
      s.healthSideEffects = (Array.isArray(s.healthSideEffects) ? s.healthSideEffects : []).map(x =>
        x.id === id ? { ...x, status: 'resolved', resolvedAt: new Date().toISOString() } : x
      )
    })
  }

  function remove(id) {
    if (!confirm(tx('Delete this side-effect record?', 'این سابقه عارضه حذف شود؟'))) return
    update(s => {
      s.healthSideEffects = (Array.isArray(s.healthSideEffects) ? s.healthSideEffects : []).filter(x => x.id !== id)
    })
  }

  const severityLabel = value => ({
    mild: tx('Mild', 'خفیف'),
    moderate: tx('Moderate', 'متوسط'),
    severe: tx('Severe', 'شدید')
  })[value] || value

  return (
    <section className="health-card health-side-effects-section">
      <style>{`
        .health-side-effects-section { margin-top: 16px; }
        .health-side-effects-summary { display:flex; flex-wrap:wrap; gap:10px 18px; margin:0 0 14px; color:var(--label-2); font-size:12px; }
        .health-side-effects-summary strong { color:var(--label); }
        .health-side-effects-form { display:flex; flex-direction:column; gap:12px; }
        .health-side-effects-form label { display:flex; flex-direction:column; gap:7px; color:var(--label-2); font-size:13px; min-width:0; }
        .health-side-effects-form input, .health-side-effects-form select, .health-side-effects-form textarea { width:100%; min-width:0; border:1px solid var(--sep); border-radius:12px; padding:11px 12px; background:var(--bg); color:var(--label); font:inherit; font-size:14px; }
        .health-side-effects-form textarea { resize:vertical; line-height:1.7; }
        .health-side-effects-history { margin-top:20px; }
        .health-side-effect-entry { border:1px solid var(--sep); border-radius:14px; padding:12px; margin-top:9px; min-width:0; }
        .health-side-effect-heading { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; }
        .health-side-effect-heading strong, .health-side-effect-heading small { display:block; overflow-wrap:anywhere; }
        .health-side-effect-heading small { color:var(--label-3); font-size:11px; margin-top:4px; }
        .health-side-effect-status { flex-shrink:0; border-radius:20px; padding:4px 8px; font-size:10px; background:var(--surface-2); color:var(--label-2); }
        .health-side-effect-status.active { color:var(--orange, #d58b35); }
        .health-side-effect-status.resolved { color:var(--green); }
        .health-side-effect-entry p { color:var(--label-2); font-size:12px; line-height:1.6; margin:8px 0 0; overflow-wrap:anywhere; }
        .health-side-effect-actions { display:flex; justify-content:flex-end; flex-wrap:wrap; gap:8px; margin-top:12px; }
        .health-side-effects-note { margin-top:14px; font-size:11px; line-height:1.6; }
        @media(max-width:380px) { .health-side-effects-form .health-form-row { grid-template-columns:1fr; } }
      `}</style>

      <div className="health-picker-heading">
        <h3>{tx('Side effects', 'عوارض جانبی')}</h3>
        <span>{tx('Track symptoms and changes over time', 'ثبت و پیگیری علائم و تغییرات')}</span>
      </div>

      <div className="health-side-effects-summary">
        <span>{tx('Ongoing records', 'موارد فعال')}: <strong>{activeCount}</strong></span>
        <span>{tx('Severe', 'شدید')}: <strong>{severeCount}</strong></span>
      </div>

      <form className="health-side-effects-form" onSubmit={save}>
        <label>
          {tx('Symptom or side effect', 'علامت یا عارضه')}
          <input
            value={form.symptom}
            onChange={e => setForm(old => ({ ...old, symptom: e.target.value }))}
            placeholder={tx('e.g. headache, nausea, skin irritation', 'مثلاً سردرد، تهوع، تحریک پوستی')}
            required
          />
        </label>

        <div className="health-form-row">
          <label>
            {tx('Date observed', 'تاریخ مشاهده')}
           <HealthDatePicker
  value={form.date}
  onChange={value => setForm(old => ({
    ...old,
    date: value
  }))}
/>
          </label>
          <label>
            {tx('Severity', 'شدت')}
            <select value={form.severity}
              onChange={e => setForm(old => ({ ...old, severity: e.target.value }))}>
              <option value="mild">{tx('Mild', 'خفیف')}</option>
              <option value="moderate">{tx('Moderate', 'متوسط')}</option>
              <option value="severe">{tx('Severe', 'شدید')}</option>
            </select>
          </label>
        </div>

        <label>
          {tx('Related protocol (optional)', 'پروتکل مرتبط (اختیاری)')}
          <select value={form.protocolId}
            onChange={e => setForm(old => ({ ...old, protocolId: e.target.value, compoundId: '' }))}>
            <option value="">{tx('Not specified', 'مشخص نشده')}</option>
            {protocols.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>

        {form.protocolId && compounds.length > 0 && (
          <label>
            {tx('Related compound (optional)', 'ترکیب مرتبط (اختیاری)')}
            <select value={form.compoundId}
              onChange={e => setForm(old => ({ ...old, compoundId: e.target.value }))}>
              <option value="">{tx('Not specified', 'مشخص نشده')}</option>
              {compounds.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
        )}

        <label>
          {tx('Notes (optional)', 'توضیحات (اختیاری)')}
          <textarea rows="2" value={form.notes}
            onChange={e => setForm(old => ({ ...old, notes: e.target.value }))}
            placeholder={tx('Duration, context, or other observations...', 'مدت، شرایط بروز یا مشاهدات دیگر...')} />
        </label>

        <button className="health-primary" type="submit">
          {tx('Save side-effect record', 'ثبت عارضه')}
        </button>
      </form>

      <div className="health-side-effects-history">
        <div className="health-history-title-row">
          <h4>{tx('Recorded side effects', 'سوابق عوارض')}</h4>
          {sorted.length > 5 && (
            <button type="button" className="health-view-all-link" onClick={() => setShowAll(v => !v)}>
              {showAll ? tx('Show recent', 'نمایش اخیر') : tx('View all', 'مشاهده همه')}
            </button>
          )}
        </div>

        {visible.length === 0 ? (
          <p className="health-muted">{tx('No side effects recorded.', 'هنوز عارضه‌ای ثبت نشده است.')}</p>
        ) : visible.map(entry => (
          <article className="health-side-effect-entry" key={entry.id}>
            <div className="health-side-effect-heading">
              <div>
                <strong>{entry.symptom || tx('Unspecified symptom', 'علامت نامشخص')}</strong>
                <small>{fmtDateFull(entry.date, calendar)} · {severityLabel(entry.severity)}</small>
              </div>
              <span className={'health-side-effect-status ' + (entry.status === 'resolved' ? 'resolved' : 'active')}>
                {entry.status === 'resolved' ? tx('Resolved', 'برطرف‌شده') : tx('Ongoing', 'فعال')}
              </span>
            </div>
            {(entry.protocolName || entry.compoundName) && (
              <p>{[entry.protocolName, entry.compoundName].filter(Boolean).join(' · ')}</p>
            )}
            {entry.notes && <p>{entry.notes}</p>}
            <div className="health-side-effect-actions">
              {entry.status !== 'resolved' && (
                <button type="button" className="health-secondary" onClick={() => resolve(entry.id)}>
                  {tx('Mark resolved', 'ثبت برطرف‌شدن')}
                </button>
              )}
              <button type="button" className="health-danger" onClick={() => remove(entry.id)}>
                {tx('Delete', 'حذف')}
              </button>
            </div>
          </article>
        ))}
      </div>
      <p className="health-muted health-side-effects-note">
        {tx('This log is for personal tracking and does not determine whether a symptom is caused by a compound.', 'این بخش برای ثبت و پیگیری شخصی است و علت پزشکی علائم را مشخص نمی‌کند.')}
      </p>
    </section>
  )
}
