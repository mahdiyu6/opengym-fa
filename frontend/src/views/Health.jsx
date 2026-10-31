import { useMemo, useRef, useState } from 'react'
import { extractPdfText, parseLabReportText } from '../lib/lab-pdf.js'
import './health.css'

const KEY='opengym.health.reports.v1'
const labels={normal:'در محدوده',low:'پایین',high:'بالا',unknown:'نیازمند بررسی'}
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}}
const write=x=>localStorage.setItem(KEY,JSON.stringify(x))
const statusOf=x=>{if(x.status&&x.status!=='unknown')return x.status;const n=Number(x.value);if(!Number.isFinite(n)||x.value==='')return'unknown';if(x.refLow!==''&&x.refLow!=null&&n<Number(x.refLow))return'low';if(x.refHigh!==''&&x.refHigh!=null&&n>Number(x.refHigh))return'high';if((x.refLow!==''&&x.refLow!=null)||(x.refHigh!==''&&x.refHigh!=null))return'normal';return'unknown'}

export default function Health(){
 const input=useRef(null),[reports,setReports]=useState(read),[draft,setDraft]=useState(null),[selected,setSelected]=useState(null),[query,setQuery]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('')
 const all=useMemo(()=>reports.flatMap(r=>(r.items||[]).map((x,i)=>({...x,reportId:r.id,reportDate:r.date,reportName:r.name,itemKey:r.id+'-'+i}))),[reports])
 const filtered=all.filter(x=>(x.name+' '+x.unit+' '+x.value).toLowerCase().includes(query.toLowerCase()))
 const groups=filtered.reduce((a,x)=>{(a[x.reportDate||'تاریخ نامشخص']||=[]).push(x);return a},{})
 async function importPdf(file){
  if(!file)return;setError('');setNotice('')
  if(file.type!=='application/pdf'&&!/\.pdf$/i.test(file.name)){setError('لطفاً فایل PDF انتخاب کن.');return}
  if(file.size>20*1024*1024){setError('حجم فایل بیشتر از ۲۰ مگابایت است.');return}
  setBusy(true)
  try{const text=await extractPdfText(file),parsed=parseLabReportText(text);setDraft({id:'r-'+Date.now(),name:file.name,date:parsed.date||new Date().toISOString().slice(0,10),items:parsed.items,rawText:text.slice(0,30000),warnings:parsed.warnings});setNotice(parsed.items.length?`${parsed.items.length} ردیف اولیه پیدا شد؛ پیش از ذخیره، تک‌تک ردیف‌ها را با PDF تطبیق بده.`:'متن قابل‌استخراج پیدا نشد؛ فایل ممکن است اسکن تصویری باشد. هیچ نتیجه‌ای ذخیره نشده است.')}
  catch(e){setError('خواندن PDF ناموفق بود: '+(e?.message||'خطای نامشخص'))}finally{setBusy(false)}
 }
 function edit(i,k,v){setDraft(d=>({...d,items:d.items.map((x,j)=>i===j?{...x,[k]:v,status:'unknown'}:x)}))}
 function addRow() {
  setDraft(d => ({
    ...d,
    items: [
      ...d.items,
      {
        name: '',
        value: '',
        unit: '',
        refLow: '',
        refHigh: '',
        status: 'unknown',
        sourceLine: 'Manually added',
        verified: false
      }
    ]
  }))
}
function removeRow(index) {
  setDraft(d => ({
    ...d,
    items: d.items.filter((_, i) => i !== index)
  }))
}
 function save(){const r={id:draft.id,name:draft.name,date:draft.date||new Date().toISOString().slice(0,10),createdAt:new Date().toISOString(),items:draft.items.map(x=>({...x,status:statusOf(x),verified:true}))};const next=[r,...reports];try{write(next);setReports(next);setDraft(null);setNotice('ذخیره شد؛ داده فقط در همین مرورگر قرار دارد.')}catch{setError('ذخیره‌سازی مرورگر ناموفق بود.')}}
 function remove(id){if(!confirm('این گزارش حذف شود؟'))return;const next=reports.filter(r=>r.id!==id);write(next);setReports(next);setSelected(null)}
 if(selected)return <main className="health-page" dir="rtl" lang="fa"><button className="health-secondary" onClick={()=>setSelected(null)}>‹ بازگشت</button><h1>{selected.name}</h1><section className="health-card"><div className="health-value">{selected.value} <small>{selected.unit}</small></div><span className={'health-badge '+statusOf(selected)}>{labels[statusOf(selected)]}</span><p>تاریخ: {selected.reportDate||'نامشخص'}</p><p>محدوده مرجع: {selected.refLow!==''||selected.refHigh!==''?`${selected.refLow||'—'} تا ${selected.refHigh||'—'} ${selected.unit||''}`:'در PDF مشخص نشده؛ وضعیت قطعی نیست.'}</p><p className="health-warning">این ابزار تشخیص پزشکی نیست. محدوده‌ها را با برگه اصلی بررسی کن.</p></section><section className="health-card"><h2>تاریخچه</h2>{all.filter(x=>x.name.toLowerCase()===selected.name.toLowerCase()).sort((a,b)=>(a.reportDate||'').localeCompare(b.reportDate||'')).map(x=><p key={x.itemKey}>{x.reportDate}: <b>{x.value} {x.unit}</b></p>)}</section></main>
 return <main className="health-page" dir="rtl" lang="fa"><header className="health-header"><div><p className="health-kicker">OPENGYM · HEALTH</p><h1>سلامت و آزمایش‌ها</h1><p className="health-muted">گزارش PDF را وارد و نتایج را پیش از ذخیره بازبینی کن.</p></div><button className="health-primary" disabled={busy} onClick={()=>input.current?.click()}>{busy?'در حال خواندن…':'+ بارگذاری PDF'}</button><input ref={input} type="file" accept="application/pdf,.pdf" hidden onChange={e=>{importPdf(e.target.files?.[0]);e.target.value=''}}/></header>
 <div className="health-privacy">حریم خصوصی: این نسخه فایل را به سرور ارسال نمی‌کند؛ نتایج در localStorage همین مرورگر ذخیره می‌شوند و بین دستگاه‌ها همگام نیستند.</div>
 {error&&<div className="health-alert">{error}</div>}{notice&&<div className="health-alert">{notice}</div>}
 {draft&&<section className="health-card"><div className="health-row"><h2>بازبینی قبل از ذخیره</h2><button className="health-secondary" onClick={()=>setDraft(null)}>لغو</button></div><label>تاریخ گزارش <input type="date" value={draft.date} onChange={e=>setDraft({...draft,date:e.target.value})}/></label><p className="health-warning">استخراج آزمایشی است و تضمین پوشش کامل ندارد. مقدار، اعشار، واحد و محدوده را با PDF تطبیق بده.</p>{draft.warnings.map((w,i)=><p className="health-alert" key={i}>{w}</p>)}<button type="button" className="health-secondary" onClick={addRow}> + افزودن ردیف </button><div className="health-table-wrap"><table className="health-table"><thead><tr><th>نام</th><th>مقدار</th><th>واحد</th><th>مرجع پایین</th><th>مرجع بالا</th><th>عملیات</th></tr></thead><tbody>{draft.items.map((x, i) => (
  <tr key={i}>
    {[
      ['name', 'نام'],
      ['value', 'مقدار'],
      ['unit', 'واحد'],
      ['refLow', 'مرجع پایین'],
      ['refHigh', 'مرجع بالا']
    ].map(([k, l]) => (
      <td key={k}>
        <input
          aria-label={l}
          value={x[k] ?? ''}
          onChange={e => edit(i, k, e.target.value)}
        />
      </td>
    ))}
    <td>
      <button
        type="button"
        className="health-danger"
        onClick={() => removeRow(i)}
      >
        حذف
      </button>
    </td>
  </tr>
))}</tbody></table></div><details className="health-raw"><summary>متن خام برای بررسی</summary><pre>{draft.rawText}</pre></details><button className="health-primary" disabled={!draft.items.length} onClick={save}>ذخیره نتایج بازبینی‌شده</button></section>}
 <label className="health-search"><span>⌕</span><input placeholder="جست‌وجوی شاخص…" value={query} onChange={e=>setQuery(e.target.value)}/></label>
 {!Object.keys(groups).length?<section className="health-empty"><h2>هنوز آزمایشی ثبت نشده</h2><p>PDF را انتخاب کن؛ نتایج فقط پس از بازبینی ذخیره می‌شوند.</p><button className="health-primary" onClick={()=>input.current?.click()}>انتخاب PDF</button></section>:Object.entries(groups).map(([date,items])=><section className="health-group" key={date}><h2>{date}</h2><div className="health-list">{items.map(x=><button className="health-item" key={x.itemKey} onClick={()=>setSelected(x)}><span className={'health-dot '+statusOf(x)}/><b className="health-item-name">{x.name}</b><span className="health-item-value">{x.value} {x.unit}</span><span>›</span></button>)}</div></section>)}
 {reports.length>0&&<section className="health-card"><h2>گزارش‌های ذخیره‌شده</h2>{reports.map(r=><div className="health-row health-report" key={r.id}><div><b>{r.date}</b><p className="health-muted">{r.name} · {r.items.length} شاخص</p></div><button className="health-danger" onClick={()=>remove(r.id)}>حذف</button></div>)}</section>}
 </main>
}
