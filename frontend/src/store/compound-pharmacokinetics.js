// Pharmacokinetic reference data used by PerformanceHealth charts.
// Educational reference only. halfLifeHours is [minimum, maximum].
// null means no defensible systemic half-life; local persistence is stored separately.

export const COMPOUND_PK = {
  'Boldenone Cypionate': { halfLifeHours: [192, 288], display: '8–12 days', evidence: 'estimate', sourceType: 'user_estimate', note: 'User-selected estimate; formulation-specific human PK is not established.' },
  'CJC-1295 (with DAC)': { halfLifeHours: [144, 192], display: '6–8 days', evidence: 'human_clinical', sourceType: 'published_human_pk', note: 'Human clinical PK reports a prolonged half-life; values vary by study.' },
  'CJC-1295 (NO DAC)': { halfLifeHours: [0.5, 0.5], display: '~30 min', evidence: 'estimate', sourceType: 'user_estimate', note: 'User-selected analogue estimate; no reliable human PK value established for this exact analogue.' },
  'IGF-1 LR3': { halfLifeHours: [20, 30], display: '20–30 hours', evidence: 'estimate', sourceType: 'user_estimate', note: 'User-selected estimate; not a verified human plasma half-life.' },
  'TB-500': { halfLifeHours: [8, 12], display: '8–12 hours', evidence: 'estimate', sourceType: 'user_estimate', note: 'User-selected estimate; reliable human PK is not established.' },
  'SLU-PP-332': { halfLifeHours: [2, 4], display: '2–4 hours', evidence: 'preclinical_estimate', sourceType: 'user_estimate', note: 'User-selected estimate; human PK is not established.' },
  'Epistane': { halfLifeHours: [6, 6], display: '~6 hours', evidence: 'estimate', sourceType: 'user_estimate' },
  'M1T': { halfLifeHours: [6, 8], display: '6–8 hours', evidence: 'estimate', sourceType: 'user_estimate' },
  'Superdrol': { halfLifeHours: [8, 12], display: '8–12 hours', evidence: 'estimate', sourceType: 'user_estimate' },
  'GHK-Cu': { halfLifeHours: [0.5, 1], display: '30–60 minutes', evidence: 'estimate', sourceType: 'user_estimate', note: 'User-selected estimate; downstream signalling may outlast plasma presence.' },
  'Epithalon': { halfLifeHours: [2, 4], display: '2–4 hours', evidence: 'estimate', sourceType: 'user_estimate', note: 'User-selected subcutaneous estimate; human PK is not established.' },
  'DSIP': { halfLifeHours: [8 / 60, 15 / 60], display: '8–15 min', evidence: 'animal_or_indirect', sourceType: 'user_estimate', note: 'User-selected IV estimate; robust human PK is not established.' },
  'Selank': { halfLifeHours: [2 / 60, 5 / 60], display: '2–5 min', evidence: 'estimate', sourceType: 'user_estimate', note: 'User-selected estimate; reliable human PK is not established.' },
  'Semax': { halfLifeHours: [12, 24], display: '12–24 hours', evidence: 'estimate', sourceType: 'user_estimate', note: 'User-selected estimate; not a measured human plasma half-life.' },
  'MOTS-c': { halfLifeHours: [0.5, 1], display: '30–60 min', evidence: 'estimate', sourceType: 'user_estimate', note: 'User-selected estimate; bloodstream clearance and downstream signalling duration are distinct.' },
  'BPC-157': { halfLifeHours: [0.25, 0.5], display: '<30 min', evidence: 'animal', sourceType: 'animal_pk', note: 'Short plasma half-life reported in animal models; no established human PK.' },
  'Melanotan II': { halfLifeHours: [1, 2.4], display: '1–2.4 hours', evidence: 'estimate', sourceType: 'user_estimate', note: 'User-selected estimate; do not substitute bremelanotide PK.' },
  'HGH Frag 176-191': { halfLifeHours: [0.5, 2], display: '30 min–2 hours', evidence: 'estimate', sourceType: 'user_estimate', note: 'User-selected estimate; human PK is not established.' },
  'Mediphorm': { halfLifeHours: null, display: 'Local persistence: 3–5 days', evidence: 'estimate', sourceType: 'user_estimate', localPersistenceDays: [3, 5], note: 'Local persistence only, not systemic half-life. Composition needs confirmation.' },
  'Semaglutide': { halfLifeHours: [144, 168], display: '6–7 days', evidence: 'regulatory_label', sourceType: 'fda_label', note: 'Approximate one-week elimination half-life in FDA prescribing information.' },
  'Tirzepatide': { halfLifeHours: [120, 120], display: '~5 days', evidence: 'regulatory_label', sourceType: 'regulatory_label' },
  'Liraglutide': { halfLifeHours: [13, 13], display: '~13 hours', evidence: 'regulatory_label', sourceType: 'regulatory_label' },
  'Dutasteride': { halfLifeHours: [840, 840], display: '~5 weeks', evidence: 'regulatory_label', sourceType: 'regulatory_label', note: 'Long terminal half-life; accumulation and washout are prolonged.' },
  'Finasteride': { halfLifeHours: [5, 6], display: '5–6 hours', evidence: 'regulatory_label', sourceType: 'regulatory_label' },
  'Minoxidil Oral': { halfLifeHours: [3, 4], display: '3–4 hours', evidence: 'published_human', sourceType: 'published_pk' },
  'Atorvastatin': { halfLifeHours: [14, 14], display: '~14 hours', evidence: 'regulatory_label', sourceType: 'regulatory_label', note: 'Active metabolites contribute to longer inhibitory activity.' },
  'Rosuvastatin': { halfLifeHours: [19, 19], display: '~19 hours', evidence: 'regulatory_label', sourceType: 'regulatory_label' },
  'Ezetimibe': { halfLifeHours: [22, 22], display: '~22 hours', evidence: 'regulatory_label', sourceType: 'regulatory_label' },
  'Telmisartan': { halfLifeHours: [24, 24], display: '~24 hours', evidence: 'regulatory_label', sourceType: 'regulatory_label' },
  'Lisinopril': { halfLifeHours: [12, 12], display: '~12 hours', evidence: 'regulatory_label', sourceType: 'regulatory_label' },
  'Carvedilol': { halfLifeHours: [7, 10], display: '7–10 hours', evidence: 'regulatory_label', sourceType: 'regulatory_label' },
  'Sildenafil': { halfLifeHours: [4, 4], display: '~4 hours', evidence: 'regulatory_label', sourceType: 'regulatory_label' },
  'Tadalafil': { halfLifeHours: [17.5, 17.5], display: '~17.5 hours', evidence: 'regulatory_label', sourceType: 'regulatory_label' },
  'Isotretinoin': { halfLifeHours: [10, 20], display: '10–20 hours', evidence: 'regulatory_label', sourceType: 'regulatory_label', note: 'Parent compound and metabolites have different elimination profiles.' },
  'NAC': { halfLifeHours: [5.6, 5.6], display: '~5.6 hours', evidence: 'published_human', sourceType: 'published_pk' },
  'T3': { halfLifeHours: [24, 24], display: '~1 day', evidence: 'published_human', sourceType: 'published_pk' },
  'T4': { halfLifeHours: [144, 168], display: '6–7 days', evidence: 'published_human', sourceType: 'published_pk' },
  'MK-677': { halfLifeHours: [4, 6], display: '4–6 hours', evidence: 'estimate', sourceType: 'published_or_estimated_pk' },
  'PT-141': { halfLifeHours: [1.9, 4], display: '1.9–4 hours', evidence: 'regulatory_label', sourceType: 'fda_label', note: 'Bremelanotide (PT-141) label range; not Melanotan II.' },
  'GHRP-6': { halfLifeHours: [1.4, 3.6], display: '1.4–3.6 hours', evidence: 'human_clinical', sourceType: 'published_human_pk', note: 'Human IV study; route-specific.' },
  'Thymosin Alpha-1': { halfLifeHours: [1, 3], display: '1–3 hours', evidence: 'human_clinical', sourceType: 'published_human_pk' }
}

export const PK_EVIDENCE_LABELS = {
  regulatory_label: { en: 'Regulatory label', fa: 'برچسب رسمی دارو' },
  human_clinical: { en: 'Human clinical PK', fa: 'فارماکوکینتیک انسانی' },
  published_human: { en: 'Published human data', fa: 'داده انسانی منتشرشده' },
  animal: { en: 'Animal data only', fa: 'فقط داده حیوانی' },
  animal_or_indirect: { en: 'Limited / indirect evidence', fa: 'شواهد محدود یا غیرمستقیم' },
  preclinical_estimate: { en: 'Preclinical estimate', fa: 'تخمین پیش‌بالینی' },
  estimate: { en: 'Estimated value', fa: 'مقدار تخمینی' }
}

export function getCompoundPk(name) {
  if (!name) return null

  const key = String(name).trim().toLowerCase()
  const match = Object.keys(COMPOUND_PK).find(
    item => item.toLowerCase() === key
  )

  if (!match) return null

  const pk = COMPOUND_PK[match]

  return {
    ...pk,

    // Elimination data: already present in the bank
    elimination: {
      halfLifeHours: pk.halfLifeHours,
      evidence: pk.evidence,
      sourceType: pk.sourceType
    },

    // Absorption data: deliberately unknown until supported
    // by reliable compound-specific pharmacokinetic evidence.
    absorption: {
      model: 'unknown',
      halfLifeHours: null,
      evidence: 'not_available'
    },

    // Prevent unsupported compounds from being presented
    // as measured systemic blood-level estimates.
    modelSupport: {
      totalActive: Array.isArray(pk.halfLifeHours),
      releaseRate: false
    }
  }
}
