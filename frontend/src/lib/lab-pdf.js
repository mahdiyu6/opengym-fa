// Browser-side PDF text extraction. PDF bytes stay in the browser.
let promise
async function pdfjs(){
 if(!promise) promise=import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs').then(m=>{m.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';return m})
 return promise
}
export async function extractPdfText(file){
 const lib=await pdfjs(),pdf=await lib.getDocument({data:await file.arrayBuffer()}).promise,pages=[]
 for(let p=1;p<=pdf.numPages;p++){
  const page=await pdf.getPage(p),content=await page.getTextContent()
  const items=content.items.map(i=>({s:i.str,x:i.transform?.[4]||0,y:i.transform?.[5]||0})),rows=[]
  for(const it of items){let row=rows.find(r=>Math.abs(r.y-it.y)<3);if(!row){row={y:it.y,a:[]};rows.push(row)}row.a.push(it)}
  rows.sort((a,b)=>b.y-a.y)
  pages.push(`--- PAGE ${p} ---\n`+rows.map(r=>r.a.sort((a,b)=>a.x-b.x).map(x=>x.s).join(' ').replace(/\s+/g,' ').trim()).filter(Boolean).join('\n'))
 }
 return pages.join('\n\n')
}
export function parseLabReportText(text){
 const warnings=[],items=[],seen=new Set()
 if(!text.trim())return{date:'',items:[],warnings:['PDF متن قابل‌استخراج ندارد؛ احتمالاً تصویری/اسکن‌شده است. OCR هنوز پیاده نشده.']}
 const dm=text.match(/(?:sample|collection|received|report|date|تاریخ(?:\s+(?:پذیرش|نمونه|گزارش))?)\s*[:：]?\s*(\d{4}[/-]\d{1,2}[/-]\d{1,2})/i)
 const date=dm?dm[1].replaceAll('/','-'):''
 const lines=text.split(/\r?\n/).map(s=>s.replace(/\s+/g,' ').trim()).filter(Boolean)
 const unitRx=/(10\s*\*\s*[36]\s*\/\s*[µμu]L|mg\/dL|mmol\/L|µmol\/L|umol\/L|ng\/mL|pg\/mL|ng\/dL|pg\/dL|g\/dL|g\/L|mIU\/L|mIU\/mL|µIU\/mL|uIU\/mL|IU\/L|U\/L|%|fL|pg|mm³|\/µL|\/μL|nmol\/L|pmol\/L|mm\/hr|mg\/L|µg\/dL|ug\/dL|µg\/L|ug\/L)\b/i
 for(const line of lines){
  if(line.length<4||/reference interval|normal range|patient name|page \d|نتیجه آزمایش|نام بیمار/i.test(line))continue
  const um=line.match(unitRx);if(!um)continue
  const before=line.slice(0,um.index).trim()
  const vm=before.match(/(-?\d+(?:[.,]\d+)?)\s*$/);if(!vm)continue
  const value=vm[1].replace(',','.'),name=before.slice(0,vm.index).replace(/[|:;·]+$/,'').trim(),unit=um[1]
  if(name.length<2||name.length>80||!/[a-zA-Z\u0600-\u06FF]/.test(name))continue
  const tail=line.slice(um.index+unit.length)
  const range=tail.match(/^\s*(\d+(?:[.,]\d+)?)\s*[-–]\s*(\d+(?:[.,]\d+)?)/)
  const key=name.toLowerCase()+'|'+value+'|'+unit.toLowerCase();if(seen.has(key))continue;seen.add(key)
  items.push({name,value,unit,refLow:range?range[1].replace(',','.'): '',refHigh:range?range[2].replace(',','.'): '',status:'unknown',sourceLine:line,verified:false})
 }
 warnings.push(items.length?'استخراج آزمایشی است؛ ممکن است ردیف‌ها جا بیفتند یا ستون‌ها اشتباه جفت شوند. هر ردیف را با PDF تطبیق بده.':'نتیجه‌ای با الگوی مطمئن پیدا نشد. متن خام را بررسی کن؛ هیچ موردی خودکار ذخیره نشده است.')
 return{date,items,warnings}
}
