// Estimated pharmacokinetic reference bank.
// ALL values are estimates for visualization only.
// They are NOT clinical measurements, prescribing guidance, or dosing advice.
//
// Time units: hours.
// Ranges are stored as [minimum, maximum].
// Tmax is descriptive reference data. The curve uses absorption and
// elimination half-lives in a first-order depot/central-compartment model.

const H = (min, max = min) => [min, max]

const rows = [
  // Cardiovascular, metabolic, supplements
  ['Atorvastatin', 'oral', H(1,2), H(.5), H(14), '14 h'],
  ['Berberine', 'oral', H(2,4), H(.75,1), H(4,5), '4–5 h'],
  ['Carvedilol', 'oral', H(1,2), H(.33,.5), H(6,10), '6–10 h'],
  ['DHEA', 'oral', H(1,2), H(.5), H(.25,.5), '15–30 min', 'DHEA-S metabolite has a different, longer half-life (7–10 h).'],
  ['Dutasteride', 'oral', H(2,3), H(.75), H(1200), '~5 weeks'],
  ['Ezetimibe', 'oral', H(1,2), H(.5), H(22), '22 h'],
  ['Finasteride', 'oral', H(1,2), H(.5), H(5,8), '5–8 h'],
  ['Glutathione IV', 'IV', H(0), H(.01), H(.167,.25), '10–15 min'],
  ['Glutathione IM', 'IM', H(.25,.5), H(.167), H(.167,.25), '10–15 min'],
  ['L-Carnitine Injectable', 'IM', H(.5,1), H(.25,.333), H(15,17), '15–17 h'],
  ['Isotretinoin', 'oral', H(2,4), H(.75,1), H(19,22), '19–22 h'],
  ['Lisinopril', 'oral', H(6,8), H(2), H(12), '12 h'],
  ['Metformin IR', 'oral', H(2,3), H(.75), H(4,9), '4–9 h'],
  ['Minoxidil Oral', 'oral', H(1), H(.25,.333), H(3,4), '3–4 h'],
  ['NAC', 'oral', H(1,2), H(.5), H(5.6), '5.6 h'],
  ['NAD+', 'SC/IM', H(.25,.75), H(.167,.25), H(1,2), '1–2 h'],
  ['Nebivolol', 'oral', H(1.5,4), H(.75), H(10,19), '10–19 h'],
  ['Pregnenolone', 'oral', H(1,2), H(.5), H(3,4), '3–4 h'],
  ['Rosuvastatin', 'oral', H(3,5), H(1), H(19), '19 h'],
  ['Sildenafil', 'oral', H(.5,2), H(.25,.333), H(3,5), '3–5 h'],
  ['SLU-PP-332', 'oral', H(1,2), H(.333,.5), H(2,4), '2–4 h', 'Preclinical estimate; human PK is not established.'],
  ['Tadalafil', 'oral', H(2), H(.5,.75), H(17.5), '17.5 h'],
  ['Telmisartan', 'oral', H(.5,1), H(.25,.333), H(24), '24 h'],
  ['TUDCA', 'oral', H(1.5,3), H(.75), H(3,5), '3–5 h', 'Enterohepatic circulation may affect the observed profile.'],
  ['Yohimbine HCL', 'oral', H(.75,1), H(.25), H(.583,1), '35–60 min'],

  // Peptides
  ['BPC-157', 'SC', H(.333,.667), H(.167,.25), H(.1,.5), '<30 min'],
  ['Cagrilintide', 'SC', H(24,72), H(8,12), H(168,192), '7–8 days'],
  ['CJC-1295 (NO DAC)', 'SC', H(.25,.5), H(.083,.167), H(.5), '~30 min'],
  ['CJC-1295 (with DAC)', 'SC', H(24,48), H(6,12), H(144,192), '6–8 days'],
  ['DSIP', 'SC', H(.25,.5), H(.083,.167), H(.133,.25), '8–15 min'],
  ['Epithalon', 'SC', H(.5,1), H(.25,.333), H(2,4), '2–4 h'],
  ['GHK-Cu', 'SC', H(.333,.75), H(.167,.25), H(.5,1), '30–60 min'],
  ['GHRP-2', 'SC', H(.25,.5), H(.083,.167), H(.25,1), '15–60 min'],
  ['GHRP-6', 'SC', H(.25,.5), H(.083,.167), H(.25,1), '15–60 min'],
  ['Gonadorelin', 'SC', H(.25,.5), H(.083,.167), H(.167,.667), '10–40 min'],
  ['Growth Hormone (HGH)', 'SC', H(2,6), H(1,1.5), H(2,3), '2–3 h'],
  ['HCG', 'SC/IM', H(6,12), H(2,3), H(24,36), '24–36 h'],
  ['HGH Frag 176-191', 'SC', H(.5,1), H(.25,.417), H(.5,2), '30 min–2 h'],
  ['HMG', 'SC/IM', H(6,12), H(2,4), H(30,40), '30–40 h'],
  ['IGF-1 LR3', 'SC', H(1,2), H(.333,.5), H(20,30), '20–30 h'],
  ['Ipamorelin', 'SC', H(.25,.5), H(.083,.167), H(2), '2 h'],
  ['Liraglutide', 'SC', H(8,12), H(2,3), H(13), '13 h'],
  ['Melanotan II', 'SC', H(.5,1.5), H(.25,.5), H(1,2.4), '1–2.4 h'],
  ['MOTS-c', 'SC', H(.5,1), H(.25,.417), H(.5,1), '30–60 min'],
  ['PT-141', 'SC', H(.5,1), H(.25,.333), H(2.7), '2.7 h'],
  ['Retatrutide', 'SC', H(12,48), H(6,10), H(144), '6 days'],
  ['Selank', 'intranasal', H(.083,.25), H(.05,.083), H(.033,.083), '2–5 min'],
  ['Semaglutide', 'SC', H(24,72), H(8,12), H(168), '~7 days'],
  // Semax elimination range follows the user's explicitly selected 12–24 h estimate.
  ['Semax', 'intranasal', H(.083,.25), H(.05,.083), H(12,24), '12–24 h'],
  ['Sermorelin', 'SC', H(.083,.333), H(.083), H(.183,.2), '11–12 min'],
  ['SS-31', 'SC', H(.5,1), H(.25,.333), H(3,4), '3–4 h'],
  ['TB-500', 'SC', H(.5,1), H(.25,.417), H(48,72), '2–3 days'],
  ['Tesamorelin', 'SC', H(.15,.25), H(.083), H(.433,.633), '26–38 min'],
  ['Thymosin Alpha-1', 'SC', H(1,2), H(.333,.5), H(2), '2 h'],
  ['Tirzepatide', 'SC', H(8,72), H(6,8), H(120), '5 days'],

  // Hormonal, thyroid and stimulants
  ['Anastrozole', 'oral', H(2), H(.5,.75), H(40,50), '40–50 h'],
  ['Exemestane', 'oral', H(1.2,2.9), H(.5,.75), H(24), '24 h'],
  ['Cabergoline', 'oral', H(2,3), H(.75), H(63,69), '63–69 h'],
  ['Clenbuterol', 'oral', H(2,3), H(.75), H(25,39), '25–39 h'],
  ['Clomiphene', 'oral', H(2,6), H(1), H(120,168), '5–7 days'],
  ['Enclomiphene', 'oral', H(2,3), H(.75), H(10), '10 h'],
  ['Ephedrine', 'oral', H(1.5,2), H(.5), H(3,6), '3–6 h'],
  ['Humalog (Insulin Lispro)', 'SC', H(.5,1.5), H(.25), H(1), '~1 h'],
  ['Lantus (Insulin Glargine)', 'SC', H(4,5), H(4,6), H(12,24), '12–24 h', 'Approximate plateau profile; no sharp defined peak.'],
  ['Letrozole', 'oral', H(2), H(.5,.75), H(48,96), '2–4 days'],
  ['Levemir (Insulin Detemir)', 'SC', H(6,8), H(2,3), H(5,7), '5–7 h', 'Reported duration of action may be longer than plasma half-life.'],
  ['MK-677', 'oral', H(1,2), H(.333,.5), H(4,6), '4–6 h', 'Downstream IGF-1 response may outlast plasma presence.'],
  ['Tamoxifen', 'oral', H(5), H(1,1.5), H(120,168), '5–7 days'],
  ['NovoRapid (Insulin Aspart)', 'SC', H(.667,.833), H(.25), H(1.35), '~81 min'],
  ['Pramipexole', 'oral', H(1,3), H(.5,.75), H(8,12), '8–12 h'],
  ['Raloxifene', 'oral', H(6), H(1.5), H(27.7), '27.7 h'],
  ['T3', 'oral', H(1,2), H(.333,.5), H(24,60), '1–2.5 days'],
  ['T4', 'oral', H(2,4), H(.75,1), H(144,168), '6–7 days'],
  ['Toremifene', 'oral', H(3), H(.75,1), H(120), '5 days'],

  // Oral anabolic compounds
  ['Oxymetholone (Anadrol)', 'oral', H(1,2), H(.333,.5), H(8,9), '8–9 h'],
  ['Oxandrolone (Anavar)', 'oral', H(1,1.5), H(.25,.5), H(9,10), '9–10 h'],
  ['Methandrostenolone (Dianabol)', 'oral', H(1,3), H(.333,.667), H(3,6), '3–6 h'],
  ['Epistane', 'oral', H(1,1.5), H(.25,.5), H(6), '6 h'],
  ['Fluoxymesterone (Halotestin)', 'oral', H(1,2), H(.333,.5), H(9,10), '9–10 h'],
  ['M1T', 'oral', H(1,2), H(.333,.5), H(6,8), '6–8 h'],
  ['Methenolone Acetate (Oral)', 'oral', H(1,2), H(.333,.5), H(4,6), '4–6 h'],
  ['Mesterolone (Proviron)', 'oral', H(1.5,3), H(.5,.75), H(12,13), '12–13 h'],
  ['Methasterone (Superdrol)', 'oral', H(1,3), H(.5), H(8,12), '8–12 h'],
  ['Turinabol', 'oral', H(1.5,3), H(.5,.75), H(16), '16 h'],
  ['Stanozolol Oral', 'oral', H(1,2), H(.333,.5), H(9), '9 h'],

  // Injectable anabolic compounds
  ['TNE', 'IM', H(1,2), H(.25,.5), H(2,4), '2–4 h'],
  ['Winstrol Inj', 'IM', H(2,4), H(1), H(24), '24 h'],
  ['MENT (Trestolone Acetate)', 'IM', H(4,8), H(2,3), H(8,12), '8–12 h'],
  ['Testosterone Propionate', 'IM', H(12,24), H(4,6), H(48,72), '2–3 days'],
  ['Testosterone Phenylpropionate', 'IM', H(24,36), H(8,12), H(72,108), '3–4.5 days'],
  ['Trenbolone Acetate', 'IM', H(12,24), H(4,6), H(48,72), '2–3 days'],
  ['Masteron Propionate', 'IM', H(12,24), H(4,6), H(48,72), '2–3 days'],
  ['Nandrolone Phenylpropionate (NPP)', 'IM', H(24,48), H(8,12), H(72,108), '3–4.5 days'],
  ['DHB', 'IM', H(48,96), H(24,36), H(192,240), '8–10 days'],
  ['Testosterone Cypionate', 'IM', H(48,96), H(24,36), H(192,240), '8–10 days'],
  ['Testosterone Enanthate', 'IM', H(48,72), H(24,36), H(168,216), '7–9 days'],
  ['Masteron Enanthate', 'IM', H(48,72), H(24,36), H(168,240), '7–10 days'],
  ['Trenbolone Enanthate', 'IM', H(48,72), H(24,36), H(168,240), '7–10 days'],
  ['Primobolan Inj', 'IM', H(48,96), H(24,36), H(168,240), '7–10 days'],
  ['Parabolan', 'IM', H(72,120), H(36,48), H(240,336), '10–14 days'],
  ['Boldenone Cypionate', 'IM', H(48,96), H(24,36), H(192,288), '8–12 days'],
  ['Equipoise (Boldenone Undecylenate)', 'IM', H(72,120), H(48,72), H(336), '14 days'],
  ['Nandrolone Decanoate', 'IM', H(72,120), H(48,72), H(288,360), '12–15 days'],
  ['Sustanon', 'IM', H(24,48), H(6,72), H(360,432), '15–18 days', 'Multi-ester profile simplified to one effective absorption compartment.'],
  ['Testosterone Undecanoate', 'IM', H(168), H(72,120), H(504,816), '21–34 days', 'Oil vehicle may produce substantially longer apparent release in some formulations.'],

  // Existing catalog entries retained
  ['Semaglutide', 'SC', H(24,72), H(8,12), H(168), '~7 days'],
  ['Tirzepatide', 'SC', H(8,72), H(6,8), H(120), '5 days'],
  ['Liraglutide', 'SC', H(8,12), H(2,3), H(13), '13 h'],
  ['PT-141', 'SC', H(.5,1), H(.25,.333), H(2.7), '2.7 h'],
  ['Thymosin Alpha-1', 'SC', H(1,2), H(.333,.5), H(2), '2 h']
]

export const COMPOUND_PK = Object.fromEntries(
  rows.map(([name, route, tmaxHours, absorptionHalfLifeHours, halfLifeHours, display, note]) => [
    name,
    {
      route,
      tmaxHours,
      absorptionHalfLifeHours,
      halfLifeHours,
      display,
      evidence: 'estimate',
      sourceType: 'estimated_reference',
      note: note || ''
    }
  ])
)

// Local-only persistence is intentionally not represented as systemic PK.
COMPOUND_PK.Mediphorm = {
  route: 'topical/local',
  tmaxHours: null,
  absorptionHalfLifeHours: null,
  halfLifeHours: null,
  display: 'Local persistence: 3–5 days',
  localPersistenceDays: H(3,5),
  evidence: 'estimate',
  sourceType: 'local_persistence_only',
  note: 'Local persistence only; no systemic curve is modeled.'
}

// Additional existing catalog names / aliases.
const ALIASES = {
  'eq': 'Equipoise (Boldenone Undecylenate)',
  'boldenone': 'Equipoise (Boldenone Undecylenate)',
  'sustanon 250': 'Sustanon',
  'test p': 'Testosterone Propionate',
  'testosterone propionate': 'Testosterone Propionate',
  'test c': 'Testosterone Cypionate',
  'testosterone cypionate': 'Testosterone Cypionate',
  'test e': 'Testosterone Enanthate',
  'testosterone enanthate': 'Testosterone Enanthate',
  'test u': 'Testosterone Undecanoate',
  'tne': 'TNE',
  'tpp': 'Testosterone Phenylpropionate',
  'ment': 'MENT (Trestolone Acetate)',
  'npp': 'Nandrolone Phenylpropionate (NPP)',
  'tren a': 'Trenbolone Acetate',
  'tren e': 'Trenbolone Enanthate',
  'parabolan': 'Parabolan',
  'dhb': 'DHB',
  'masteron propionate': 'Masteron Propionate',
  'masteron enanthate': 'Masteron Enanthate',
  'primobolan inj': 'Primobolan Inj',
  'primobolan injectable': 'Primobolan Inj',
  'primobolan oral': 'Methenolone Acetate (Oral)',
  'winstrol inj': 'Winstrol Inj',
  'winstrol': 'Stanozolol Oral',
  'anadrol': 'Oxymetholone (Anadrol)',
  'anavar': 'Oxandrolone (Anavar)',
  'dianabol': 'Methandrostenolone (Dianabol)',
  'halotestin': 'Fluoxymesterone (Halotestin)',
  'proviron': 'Mesterolone (Proviron)',
  'superdrol': 'Methasterone (Superdrol)',
  'arimidex': 'Anastrozole',
  'anastrozole': 'Anastrozole',
  'aromasin': 'Exemestane',
  'exemestane': 'Exemestane',
  'clomid': 'Clomiphene',
  'nolvadex': 'Tamoxifen',
  'tamoxifen': 'Tamoxifen',
  'humalog': 'Humalog (Insulin Lispro)',
  'insulin lispro': 'Humalog (Insulin Lispro)',
  'novorapid': 'NovoRapid (Insulin Aspart)',
  'novolog': 'NovoRapid (Insulin Aspart)',
  'insulin aspart': 'NovoRapid (Insulin Aspart)',
  'lantus': 'Lantus (Insulin Glargine)',
  'insulin glargine': 'Lantus (Insulin Glargine)',
  'levemir': 'Levemir (Insulin Detemir)',
  'insulin detemir': 'Levemir (Insulin Detemir)',
  'hgh': 'Growth Hormone (HGH)',
  'growth hormone': 'Growth Hormone (HGH)',
  'cjc-1295 no dac': 'CJC-1295 (NO DAC)',
  'cjc-1295 with dac': 'CJC-1295 (with DAC)',
  'cjc-1295 (with dac)': 'CJC-1295 (with DAC)',
  'metformin': 'Metformin IR',
  'l-carnitine': 'L-Carnitine Injectable',
  'nad': 'NAD+'
}

function normalize(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
}

const NORMALIZED_KEYS = new Map(
  Object.keys(COMPOUND_PK).map(key => [normalize(key), key])
)

export const PK_EVIDENCE_LABELS = {
  estimate: {
    en: 'Estimated reference data',
    fa: 'داده مرجع تخمینی'
  },
  local: {
    en: 'Local persistence only',
    fa: 'ماندگاری موضعی'
  }
}

export function getCompoundPk(name) {
  if (!name) return null

  const normalized = normalize(name)
  const aliasTarget = ALIASES[normalized]
  const key =
    (aliasTarget && NORMALIZED_KEYS.get(normalize(aliasTarget))) ||
    NORMALIZED_KEYS.get(normalized)

  if (!key) return null

  const pk = COMPOUND_PK[key]
  const systemic = Array.isArray(pk.halfLifeHours) &&
    Array.isArray(pk.absorptionHalfLifeHours)

  return {
    ...pk,
    name: key,
    elimination: {
      halfLifeHours: pk.halfLifeHours,
      evidence: pk.evidence,
      sourceType: pk.sourceType
    },
    absorption: {
      model: systemic ? 'first_order_depot' : 'not_systemic',
      halfLifeHours: pk.absorptionHalfLifeHours,
      tmaxHours: pk.tmaxHours,
      route: pk.route,
      evidence: pk.evidence
    },
    modelSupport: {
      totalActive: systemic,
      releaseRate: systemic
    }
  }
}
