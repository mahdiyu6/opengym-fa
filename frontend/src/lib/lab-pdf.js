
// Browser-side PDF text extraction. PDF bytes stay in the browser.
let promise

async function pdfjs() {
  if (!promise) {
    promise = import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs')
      .then(m => {
        m.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs'
        return m
      })
  }
  return promise
}

export async function extractPdfText(file) {
  const lib = await pdfjs()
  const pdf = await lib.getDocument({ data: await file.arrayBuffer() }).promise
  const pages = []

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p)
    const content = await page.getTextContent()

    const items = content.items.map(i => ({
      s: i.str,
      x: i.transform?.[4] || 0,
      y: i.transform?.[5] || 0
    }))

    const rows = []

    for (const it of items) {
      let row = rows.find(r => Math.abs(r.y - it.y) < 3)

      if (!row) {
        row = { y: it.y, a: [] }
        rows.push(row)
      }

      row.a.push(it)
    }

    rows.sort((a, b) => b.y - a.y)

    pages.push(
      `--- PAGE ${p} ---\n` +
      rows
        .map(r =>
          r.a
            .sort((a, b) => a.x - b.x)
            .map(x => x.s)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim()
        )
        .filter(Boolean)
        .join('\n')
    )
  }

  return pages.join('\n\n')
}

const numeric = '-?\\d+(?:[.,]\\d+)?'

const unitRx =
  /(10\s*\*\s*[36]\s*\/\s*[µμu]L|mg\/dL|mmol\/L|µmol\/L|umol\/L|ng\/mL|pg\/mL|ng\/dL|pg\/dL|g\/dL|gr\/dl|g\/L|mIU\/L|mIU\/mL|µIU\/mL|μIU\/ml|uIU\/mL|IU\/L|U\/L|%|fL|pg|mm³|\/[µμ]L|nmol\/L|pmol\/L|mm\/h(?:r)?|mg\/L|µg\/dL|ug\/dL|µg\/L|ug\/L|μg\/dL|μg\/L|Index|Ratio)/i

const normalizeNumber = value =>
  String(value ?? '').replace(',', '.').trim()

function extractRange(tail) {
  let match = tail.match(
    new RegExp(`(?:^|\\s)(${numeric})\\s*[-–]\\s*(${numeric})(?=\\s|$)`)
  )

  if (match) {
    return {
      refLow: normalizeNumber(match[1]),
      refHigh: normalizeNumber(match[2])
    }
  }

  match = tail.match(
    new RegExp(`(?:up to|upto|less than|<)\\s*(${numeric})`, 'i')
  )

  if (match) {
    return {
      refLow: '',
      refHigh: normalizeNumber(match[1])
    }
  }

  match = tail.match(
    new RegExp(`(?:more than|greater than|>)\\s*(${numeric})`, 'i')
  )

  if (match) {
    return {
      refLow: normalizeNumber(match[1]),
      refHigh: ''
    }
  }

  return { refLow: '', refHigh: '' }
}

const urineLabels = [
  ['Specific Gravity', /Specific\s*Gravity/i],
  ['Leukocyte Esterase', /Leukocyte\s*Esterase/i],
  ['Epithelial Cells (HPF)', /Epithelial\s*Cells?\s*\(?\s*HPF\s*\)?/i],
  ['Dysmorphic RBC (Urine)', /Dysmorphic\s*RBC\s*\(?\s*Urine\s*\)?/i],
  ['W.B.C. (HPF)', /W\.?\s*B\.?\s*C\.?\s*\(?\s*HPF\s*\)?/i],
  ['R.B.C. (HPF)', /R\.?\s*B\.?\s*C\.?\s*\(?\s*HPF\s*\)?/i],
  ['Bacteria', /Bacteria/i],
  ['Appearance', /Appearance/i],
  ['Urobilinogen', /Urobilinogen/i],
  ['Bilirubin', /Bilirubin/i],
  ['Protein', /Protein/i],
  ['Glucose', /Glucose/i],
  ['Ketone', /Ketone/i],
  ['Nitrite', /Nitrite/i],
  ['Color', /Color/i],
  ['pH', /\bpH\b/i],
  ['Mucus', /Mucus/i],
  ['Yeast Cell', /Yeast\s*Cell/i],
  ['Casts (LPF)', /Casts?\s*\(?\s*LPF\s*\)?/i],
  ['Crystals (Urine)', /Crystals?\s*\(?\s*Urine\s*\)?/i]
]

function parseUrine(lines, addItem) {
  let inUrine = false

  for (const line of lines) {
    if (/urine\s*analysis/i.test(line)) {
      inUrine = true
    }

    if (!inUrine) continue

    if (/bacteriology\s*culture/i.test(line)) {
      const match = line.match(
        /Bacteriology\s*Culture\s*:?\s*(.+)$/i
      )

      if (match?.[1]) {
        addItem({
          name: 'Urine Culture',
          value: match[1].trim(),
          unit: '',
          refLow: '',
          refHigh: '',
          status: 'unknown',
          sourceLine: line,
          verified: false
        })
      }

      inUrine = false
      continue
    }

    if (/---\s*PAGE|end of report/i.test(line)) {
      inUrine = false
      continue
    }

    // Urine reports may contain two columns on one line.
    // Find recognized labels and extract the text between them.
    const found = []

    for (const [name, regex] of urineLabels) {
      const match = regex.exec(line)

      if (match) {
        found.push({
          name,
          start: match.index,
          end: match.index + match[0].length
        })
      }
    }

    found.sort((a, b) => a.start - b.start)

    const matches = found.filter(
      (item, index) =>
        index === 0 || item.start !== found[index - 1].start
    )

    for (let i = 0; i < matches.length; i++) {
      const current = matches[i]
      const end = matches[i + 1]?.start ?? line.length

      const value = line
        .slice(current.end, end)
        .replace(/^[\s:|*-]+/, '')
        .replace(/[\s|*-]+$/, '')
        .replace(/^(?:Result|Unit|Reference Intervals)\s*/i, '')
        .trim()

      if (!value || value.length > 45) continue

      addItem({
        name: current.name,
        value,
        unit: '',
        refLow: '',
        refHigh: '',
        status: 'unknown',
        sourceLine: line,
        verified: false
      })
    }
  }
}

export function parseLabReportText(text) {
  const warnings = []
  const items = []
  const seen = new Set()

  if (!text.trim()) {
    return {
      date: '',
      items: [],
      warnings: [
        'No extractable PDF text was found. The file may be scanned; OCR is not implemented yet.'
      ]
    }
  }

  const dateMatch = text.match(
    /(?:sample|collection|received|report|date|تاریخ(?:\s+(?:پذیرش|نمونه|گزارش))?)\s*[:：]?\s*(\d{4}[/-]\d{1,2}[/-]\d{1,2})/i
  )

  const date = dateMatch
    ? dateMatch[1].replaceAll('/', '-')
    : ''

  const lines = text
    .split(/\r?\n/)
    .map(s => s.replace(/\s+/g, ' ').trim())
    .filter(Boolean)

  function addItem(item) {
    const key =
      `${item.name.toLowerCase()}|` +
      `${item.value.toLowerCase()}|` +
      `${item.unit.toLowerCase()}`

    if (seen.has(key)) return

    seen.add(key)
    items.push(item)
  }

  // Numeric laboratory results
  for (const line of lines) {
    if (
      line.length < 4 ||
      /reference interval|normal range|patient name|page \d|نتیجه آزمایش|نام بیمار/i.test(line) ||
      /urine\s*analysis/i.test(line)
    ) {
      continue
    }

    const unitMatch = line.match(unitRx)

    if (!unitMatch) continue

    const before = line.slice(0, unitMatch.index).trim()

    const valueMatch = before.match(
      new RegExp(`(${numeric})\\s*\\*?\\s*$`)
    )

    if (!valueMatch) continue

    const value = normalizeNumber(valueMatch[1])

    // H/L flags are separated from the analyte name.
    const flagMatch = before.match(/\b([HL])\s*$/i)

    let name = before
      .slice(0, valueMatch.index)
      .replace(/\s+\*+\s*$/, '')
      .replace(/\s+\b[HL]\b\s*$/i, '')
      .replace(/[\s*|:;·]+$/g, '')
      .trim()

    if (
      name.length < 2 ||
      name.length > 90 ||
      !/[a-zA-Z\u0600-\u06FF]/.test(name)
    ) {
      continue
    }

    const tail = line.slice(
      unitMatch.index + unitMatch[0].length
    )

    const range = extractRange(tail)

    addItem({
      name,
      value,
      unit: unitMatch[0],
      refLow: range.refLow,
      refHigh: range.refHigh,
      status: flagMatch
        ? flagMatch[1].toUpperCase() === 'H'
          ? 'high'
          : 'low'
        : 'unknown',
      sourceLine: line,
      verified: false
    })
  }

  // FIB-4 and eAG may appear in a different layout.
  for (const line of lines) {
    const match = line.match(
      new RegExp(
        `^\\s*(FIB-4|eAG)\\s+(${numeric})\\s*(Index|mg\\/dL)?`,
        'i'
      )
    )

    if (match) {
      addItem({
        name: match[1],
        value: normalizeNumber(match[2]),
        unit:
          match[3] ||
          (match[1].toLowerCase() === 'fib-4'
            ? 'Index'
            : 'mg/dL'),
        refLow: '',
        refHigh: '',
        status: 'unknown',
        sourceLine: line,
        verified: false
      })
    }
  }

  // Urinalysis: text-valued and two-column results.
  parseUrine(lines, addItem)

  warnings.push(
    items.length
      ? 'Extraction is provisional. Check every name, value, unit, reference range and H/L flag against the original PDF before saving.'
      : 'No results matching supported patterns were found. Check the raw text; nothing has been saved automatically.'
  )

  return { date, items, warnings }
}
