import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { getLang, useLang } from '../lib/i18n.js'
import './health-hub.css'

const today = () => new Date().toISOString().slice(0, 10)

const emptyForm = {
  name: '',
  type: 'TRT',
  compounds: '',
  amount: '',
  unit: 'mg',
  schedule: '',
  startDate: today(),
  endDate: '',
  notes: ''
}

export default function PerformanceHealth() {
  useLang()
  const fa = getLang() === 'fa'
  const nav = useNavigate()

  const protocols = useStore(s => s.S.healthProtocols)
  const update = useStore(s => s.update)

  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)

  const tx = (en, faText) => fa ? faText : en

  function change(key, value) {
    setForm(old => ({ ...old, [key]: value }))
  }

  function saveProtocol(e) {
    e.preventDefault()

    if (!form.name.trim()) return

    const item = {
      ...form,
      id: 'hp-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'active'
    }

    update(s => {
      s.healthProtocols = [item, ...(s.healthProtocols || [])]
    })

    setForm(emptyForm)
    setShowForm(false)
  }

  function removeProtocol(id) {
    if (!confirm(tx('Delete this protocol?', 'این پروتکل حذف شود؟'))) return

    update(s => {
      s.healthProtocols = (s.healthProtocols || []).filter(x => x.id !== id)
    })
  }

  function finishProtocol(id) {
    update(s => {
      s.healthProtocols = (s.healthProtocols || []).map(x =>
        x.id === id
          ? { ...x, status: 'completed', completedAt: new Date().toISOString() }
          : x
      )
    })
  }

  return (
    <main className="health-page" dir={fa ? 'rtl' : 'ltr'}>
      <button className="health-secondary" onClick={() => nav('/health')}>
        {tx('‹ Back', '‹ بازگشت')}
      </button>

      <header className="health-header">
        <div>
          <h1>{tx('Performance & Health', 'پایش عملکرد و سلامت')}</h1>
          <p className="health-muted">
            {tx(
              'Track your protocols and health trends.',
              'ثبت و پیگیری پروتکل‌ها و روند وضعیت سلامت.'
            )}
          </p>
        </div>
      </header>

      <div className="health-warning">
        {tx(
          'This section is for personal recordkeeping. It does not recommend doses, cycles or medication changes. Discuss treatment decisions with your clinician.',
          'این بخش برای ثبت و پیگیری سوابق شخصی است و دوز، چرخه مصرف یا تغییر دارو پیشنهاد نمی‌دهد. تصمیم‌های درمانی را با پزشک خود بررسی کنید.'
        )}
      </div>

      <div className="health-section-heading">
        <h2>{tx('Protocols', 'پروتکل‌ها')}</h2>
        <button
          className="health-primary"
          onClick={() => setShowForm(v => !v)}
        >
          {showForm
            ? tx('Cancel', 'انصراف')
            : tx('+ Add protocol', '+ ثبت پروتکل')}
        </button>
      </div>

      {showForm && (
        <form className="health-card health-protocol-form" onSubmit={saveProtocol}>
          <label>
            {tx('Protocol name', 'عنوان پروتکل')}
            <input
              value={form.name}
              onChange={e => change('name', e.target.value)}
              placeholder={tx('e.g. TRT protocol', 'مثلاً پروتکل TRT')}
              required
            />
          </label>

          <label>
            {tx('Protocol type', 'نوع پروتکل')}
            <select
              value={form.type}
              onChange={e => change('type', e.target.value)}
            >
              <option value="TRT">TRT</option>
              <option value="PED">PED</option>
              <option value="Other">{tx('Other', 'سایر')}</option>
            </select>
          </label>

          <label>
            {tx('Compounds', 'ترکیبات')}
            <textarea
              value={form.compounds}
              onChange={e => change('compounds', e.target.value)}
              placeholder={tx(
                'Enter the compounds you want to record',
                'ترکیبات موردنظر برای ثبت را وارد کنید'
              )}
              rows={3}
            />
          </label>

          <div className="health-form-row">
            <label>
              {tx('Recorded amount', 'مقدار ثبت‌شده')}
              <input
                value={form.amount}
                onChange={e => change('amount', e.target.value)}
                placeholder="—"
              />
            </label>

            <label>
              {tx('Unit', 'واحد')}
              <select
                value={form.unit}
                onChange={e => change('unit', e.target.value)}
              >
                <option value="mg">mg</option>
                <option value="mcg">mcg</option>
                <option value="ml">ml</option>
                <option value="IU">IU</option>
                <option value="other">{tx('Other', 'سایر')}</option>
              </select>
            </label>
          </div>

          <label>
            {tx('Schedule / frequency', 'زمان‌بندی / تناوب ثبت‌شده')}
            <input
              value={form.schedule}
              onChange={e => change('schedule', e.target.value)}
              placeholder={tx('Personal record', 'ثبت شخصی')}
            />
          </label>

          <div className="health-form-row">
            <label>
              {tx('Start date', 'تاریخ شروع')}
              <input
                type="date"
                value={form.startDate}
                onChange={e => change('startDate', e.target.value)}
              />
            </label>

            <label>
              {tx('End date', 'تاریخ پایان')}
              <input
                type="date"
                value={form.endDate}
                onChange={e => change('endDate', e.target.value)}
              />
            </label>
          </div>

          <label>
            {tx('Notes', 'توضیحات')}
            <textarea
              value={form.notes}
              onChange={e => change('notes', e.target.value)}
              rows={3}
            />
          </label>

          <button className="health-primary" type="submit">
            {tx('Save protocol', 'ذخیره پروتکل')}
          </button>
        </form>
      )}

      {protocols.length === 0 ? (
        <div className="health-empty">
          <div style={{ fontSize: 38 }}>📋</div>
          <h2>{tx('No protocols yet', 'هنوز پروتکلی ثبت نشده')}</h2>
          <p className="health-muted">
            {tx(
              'Add a protocol to start keeping your records.',
              'برای شروع ثبت سوابق، یک پروتکل اضافه کنید.'
            )}
          </p>
        </div>
      ) : (
        <div className="health-protocol-list">
          {protocols.map(item => (
            <article className="health-card" key={item.id}>
              <div className="health-row">
                <div>
                  <h2>{item.name}</h2>
                  <span className="health-protocol-type">{item.type}</span>
                </div>
                <span className={'health-protocol-status ' + item.status}>
                  {item.status === 'active'
                    ? tx('Active', 'فعال')
                    : tx('Completed', 'پایان‌یافته')}
                </span>
              </div>

              {item.compounds && (
                <p className="health-protocol-detail">
                  <b>{tx('Compounds:', 'ترکیبات:')}</b> {item.compounds}
                </p>
              )}

              {item.amount && (
                <p className="health-protocol-detail">
                  <b>{tx('Recorded amount:', 'مقدار ثبت‌شده:')}</b>{' '}
                  {item.amount} {item.unit}
                </p>
              )}

              {item.schedule && (
                <p className="health-protocol-detail">
                  <b>{tx('Schedule:', 'زمان‌بندی:')}</b> {item.schedule}
                </p>
              )}

              <p className="health-protocol-detail">
                <b>{tx('Start:', 'شروع:')}</b> {item.startDate || '—'}
                {' · '}
                <b>{tx('End:', 'پایان:')}</b> {item.endDate || '—'}
              </p>

              {item.notes && (
                <p className="health-protocol-detail">{item.notes}</p>
              )}

              <div className="health-protocol-actions">
                {item.status === 'active' && (
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
          ))}
        </div>
      )}
    </main>
  )
}
