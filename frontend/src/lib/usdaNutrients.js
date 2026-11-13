// USDA SR Legacy nutrient catalog. Source: the user's USDA SR Legacy export.
// `id` is the USDA nutrient ID; `number` is the USDA nutrient number.
// Core macros are stored on food records separately; all other entries use `micronutrients`.

export const USDA_NUTRIENTS = [
  {
    "id": 1003,
    "number": "203",
    "name": "Protein",
    "nameFa": "پروتئین",
    "unit": "g",
    "rank": 600,
    "group": "macros",
    "storage": "macro",
    "macroKey": "protein"
  },
  {
    "id": 1004,
    "number": "204",
    "name": "Total lipid (fat)",
    "nameFa": "چربی کل",
    "unit": "g",
    "rank": 800,
    "group": "macros",
    "storage": "macro",
    "macroKey": "fat"
  },
  {
    "id": 1005,
    "number": "205",
    "name": "Carbohydrate, by difference",
    "nameFa": "کربوهیدرات",
    "unit": "g",
    "rank": 1110,
    "group": "macros",
    "storage": "macro",
    "macroKey": "carbs"
  },
  {
    "id": 1007,
    "number": "207",
    "name": "Ash",
    "nameFa": "خاکستر",
    "unit": "g",
    "rank": 1000,
    "group": "other",
    "storage": "micronutrients"
  },
  {
    "id": 1008,
    "number": "208",
    "name": "Energy",
    "nameFa": "انرژی",
    "unit": "kcal",
    "rank": 300,
    "group": "macros",
    "storage": "macro",
    "macroKey": "calories"
  },
  {
    "id": 1009,
    "number": "209",
    "name": "Starch",
    "nameFa": "نشاسته",
    "unit": "g",
    "rank": 2200,
    "group": "carbohydrates",
    "storage": "micronutrients"
  },
  {
    "id": 1010,
    "number": "210",
    "name": "Sucrose",
    "nameFa": "ساکارز",
    "unit": "g",
    "rank": 1600,
    "group": "carbohydrates",
    "storage": "micronutrients"
  },
  {
    "id": 1011,
    "number": "211",
    "name": "Glucose",
    "nameFa": "گلوکز",
    "unit": "g",
    "rank": 1700,
    "group": "carbohydrates",
    "storage": "micronutrients"
  },
  {
    "id": 1012,
    "number": "212",
    "name": "Fructose",
    "nameFa": "فروکتوز",
    "unit": "g",
    "rank": 1800,
    "group": "carbohydrates",
    "storage": "micronutrients"
  },
  {
    "id": 1013,
    "number": "213",
    "name": "Lactose",
    "nameFa": "لاکتوز",
    "unit": "g",
    "rank": 1900,
    "group": "carbohydrates",
    "storage": "micronutrients"
  },
  {
    "id": 1014,
    "number": "214",
    "name": "Maltose",
    "nameFa": "مالتوز",
    "unit": "g",
    "rank": 2000,
    "group": "carbohydrates",
    "storage": "micronutrients"
  },
  {
    "id": 1018,
    "number": "221",
    "name": "Alcohol, ethyl",
    "nameFa": "الکل اتیلیک",
    "unit": "g",
    "rank": 18200,
    "group": "other",
    "storage": "micronutrients"
  },
  {
    "id": 1051,
    "number": "255",
    "name": "Water",
    "nameFa": "آب",
    "unit": "g",
    "rank": 100,
    "group": "other",
    "storage": "micronutrients"
  },
  {
    "id": 1057,
    "number": "262",
    "name": "Caffeine",
    "nameFa": "کافئین",
    "unit": "mg",
    "rank": 18300,
    "group": "other",
    "storage": "micronutrients"
  },
  {
    "id": 1058,
    "number": "263",
    "name": "Theobromine",
    "nameFa": "تئوبرومین",
    "unit": "mg",
    "rank": 18400,
    "group": "other",
    "storage": "micronutrients"
  },
  {
    "id": 1062,
    "number": "268",
    "name": "Energy",
    "nameFa": "انرژی (کیلوژول)",
    "unit": "kJ",
    "rank": 400,
    "group": "other",
    "storage": "micronutrients"
  },
  {
    "id": 2000,
    "number": "269",
    "name": "Total Sugars",
    "nameFa": "قند کل",
    "unit": "g",
    "rank": 1510,
    "group": "carbohydrates",
    "storage": "micronutrients"
  },
  {
    "id": 1075,
    "number": "287",
    "name": "Galactose",
    "nameFa": "گالاکتوز",
    "unit": "g",
    "rank": 2100,
    "group": "carbohydrates",
    "storage": "micronutrients"
  },
  {
    "id": 1079,
    "number": "291",
    "name": "Fiber, total dietary",
    "nameFa": "فیبر غذایی",
    "unit": "g",
    "rank": 1200,
    "group": "carbohydrates",
    "storage": "micronutrients"
  },
  {
    "id": 1087,
    "number": "301",
    "name": "Calcium, Ca",
    "nameFa": "کلسیم",
    "unit": "mg",
    "rank": 5300,
    "group": "minerals",
    "storage": "micronutrients"
  },
  {
    "id": 1089,
    "number": "303",
    "name": "Iron, Fe",
    "nameFa": "آهن",
    "unit": "mg",
    "rank": 5400,
    "group": "minerals",
    "storage": "micronutrients"
  },
  {
    "id": 1090,
    "number": "304",
    "name": "Magnesium, Mg",
    "nameFa": "منیزیم",
    "unit": "mg",
    "rank": 5500,
    "group": "minerals",
    "storage": "micronutrients"
  },
  {
    "id": 1091,
    "number": "305",
    "name": "Phosphorus, P",
    "nameFa": "فسفر",
    "unit": "mg",
    "rank": 5600,
    "group": "minerals",
    "storage": "micronutrients"
  },
  {
    "id": 1092,
    "number": "306",
    "name": "Potassium, K",
    "nameFa": "پتاسیم",
    "unit": "mg",
    "rank": 5700,
    "group": "minerals",
    "storage": "micronutrients"
  },
  {
    "id": 1093,
    "number": "307",
    "name": "Sodium, Na",
    "nameFa": "سدیم",
    "unit": "mg",
    "rank": 5800,
    "group": "minerals",
    "storage": "micronutrients"
  },
  {
    "id": 1095,
    "number": "309",
    "name": "Zinc, Zn",
    "nameFa": "روی",
    "unit": "mg",
    "rank": 5900,
    "group": "minerals",
    "storage": "micronutrients"
  },
  {
    "id": 1098,
    "number": "312",
    "name": "Copper, Cu",
    "nameFa": "مس",
    "unit": "mg",
    "rank": 6000,
    "group": "minerals",
    "storage": "micronutrients"
  },
  {
    "id": 1099,
    "number": "313",
    "name": "Fluoride, F",
    "nameFa": "فلوراید",
    "unit": "µg",
    "rank": 6240,
    "group": "minerals",
    "storage": "micronutrients"
  },
  {
    "id": 1101,
    "number": "315",
    "name": "Manganese, Mn",
    "nameFa": "منگنز",
    "unit": "mg",
    "rank": 6100,
    "group": "minerals",
    "storage": "micronutrients"
  },
  {
    "id": 1103,
    "number": "317",
    "name": "Selenium, Se",
    "nameFa": "سلنیوم",
    "unit": "µg",
    "rank": 6200,
    "group": "minerals",
    "storage": "micronutrients"
  },
  {
    "id": 1104,
    "number": "318",
    "name": "Vitamin A, IU",
    "nameFa": "ویتامین A (واحد بین‌المللی)",
    "unit": "IU",
    "rank": 7500,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1105,
    "number": "319",
    "name": "Retinol",
    "nameFa": "رتینول",
    "unit": "µg",
    "rank": 7430,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1106,
    "number": "320",
    "name": "Vitamin A, RAE",
    "nameFa": "ویتامین A (RAE)",
    "unit": "µg",
    "rank": 7420,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1107,
    "number": "321",
    "name": "Carotene, beta",
    "nameFa": "بتاکاروتن",
    "unit": "µg",
    "rank": 7440,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1108,
    "number": "322",
    "name": "Carotene, alpha",
    "nameFa": "آلفاکاروتن",
    "unit": "µg",
    "rank": 7450,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1109,
    "number": "323",
    "name": "Vitamin E (alpha-tocopherol)",
    "nameFa": "ویتامین E",
    "unit": "mg",
    "rank": 7905,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1110,
    "number": "324",
    "name": "Vitamin D (D2 + D3), International Units",
    "nameFa": "ویتامین D (D2 + D3، واحد بین‌المللی)",
    "unit": "IU",
    "rank": 8650,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1111,
    "number": "325",
    "name": "Vitamin D2 (ergocalciferol)",
    "nameFa": "ویتامین D2",
    "unit": "µg",
    "rank": 8710,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1112,
    "number": "326",
    "name": "Vitamin D3 (cholecalciferol)",
    "nameFa": "ویتامین D3",
    "unit": "µg",
    "rank": 8720,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1114,
    "number": "328",
    "name": "Vitamin D (D2 + D3)",
    "nameFa": "ویتامین D (D2 + D3)",
    "unit": "µg",
    "rank": 8700,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1120,
    "number": "334",
    "name": "Cryptoxanthin, beta",
    "nameFa": "بتاکریپتوگزانتین",
    "unit": "µg",
    "rank": 7460,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1122,
    "number": "337",
    "name": "Lycopene",
    "nameFa": "لیکوپن",
    "unit": "µg",
    "rank": 7530,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1123,
    "number": "338",
    "name": "Lutein + zeaxanthin",
    "nameFa": "لوتئین + زآگزانتین",
    "unit": "µg",
    "rank": 7560,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1125,
    "number": "341",
    "name": "Tocopherol, beta",
    "nameFa": "Tocopherol, beta",
    "unit": "mg",
    "rank": 8000,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1126,
    "number": "342",
    "name": "Tocopherol, gamma",
    "nameFa": "Tocopherol, gamma",
    "unit": "mg",
    "rank": 8100,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1127,
    "number": "343",
    "name": "Tocopherol, delta",
    "nameFa": "Tocopherol, delta",
    "unit": "mg",
    "rank": 8200,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1128,
    "number": "344",
    "name": "Tocotrienol, alpha",
    "nameFa": "Tocotrienol, alpha",
    "unit": "mg",
    "rank": 8300,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1129,
    "number": "345",
    "name": "Tocotrienol, beta",
    "nameFa": "Tocotrienol, beta",
    "unit": "mg",
    "rank": 8400,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1130,
    "number": "346",
    "name": "Tocotrienol, gamma",
    "nameFa": "Tocotrienol, gamma",
    "unit": "mg",
    "rank": 8500,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1131,
    "number": "347",
    "name": "Tocotrienol, delta",
    "nameFa": "Tocotrienol, delta",
    "unit": "mg",
    "rank": 8600,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1162,
    "number": "401",
    "name": "Vitamin C, total ascorbic acid",
    "nameFa": "ویتامین C",
    "unit": "mg",
    "rank": 6300,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1165,
    "number": "404",
    "name": "Thiamin",
    "nameFa": "ویتامین B1 (تیامین)",
    "unit": "mg",
    "rank": 6400,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1166,
    "number": "405",
    "name": "Riboflavin",
    "nameFa": "ویتامین B2 (ریبوفلاوین)",
    "unit": "mg",
    "rank": 6500,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1167,
    "number": "406",
    "name": "Niacin",
    "nameFa": "ویتامین B3 (نیاسین)",
    "unit": "mg",
    "rank": 6600,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1170,
    "number": "410",
    "name": "Pantothenic acid",
    "nameFa": "ویتامین B5 (اسید پانتوتنیک)",
    "unit": "mg",
    "rank": 6700,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1175,
    "number": "415",
    "name": "Vitamin B-6",
    "nameFa": "ویتامین B6",
    "unit": "mg",
    "rank": 6800,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1177,
    "number": "417",
    "name": "Folate, total",
    "nameFa": "فولات کل",
    "unit": "µg",
    "rank": 6900,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1178,
    "number": "418",
    "name": "Vitamin B-12",
    "nameFa": "ویتامین B12",
    "unit": "µg",
    "rank": 7300,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1180,
    "number": "421",
    "name": "Choline, total",
    "nameFa": "کولین",
    "unit": "mg",
    "rank": 7220,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1183,
    "number": "428",
    "name": "Vitamin K (Menaquinone-4)",
    "nameFa": "ویتامین K2 (مناکینون-4)",
    "unit": "µg",
    "rank": 8950,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1184,
    "number": "429",
    "name": "Vitamin K (Dihydrophylloquinone)",
    "nameFa": "ویتامین K (دی‌هیدروفیلوکینون)",
    "unit": "µg",
    "rank": 8900,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1185,
    "number": "430",
    "name": "Vitamin K (phylloquinone)",
    "nameFa": "ویتامین K1 (فیلوکینون)",
    "unit": "µg",
    "rank": 8800,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1186,
    "number": "431",
    "name": "Folic acid",
    "nameFa": "اسید فولیک",
    "unit": "µg",
    "rank": 7000,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1187,
    "number": "432",
    "name": "Folate, food",
    "nameFa": "فولات غذایی",
    "unit": "µg",
    "rank": 7100,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1190,
    "number": "435",
    "name": "Folate, DFE",
    "nameFa": "فولات DFE",
    "unit": "µg",
    "rank": 7200,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1198,
    "number": "454",
    "name": "Betaine",
    "nameFa": "بتائین",
    "unit": "mg",
    "rank": 7290,
    "group": "other",
    "storage": "micronutrients"
  },
  {
    "id": 1210,
    "number": "501",
    "name": "Tryptophan",
    "nameFa": "تریپتوفان",
    "unit": "g",
    "rank": 16300,
    "group": "aminoAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1211,
    "number": "502",
    "name": "Threonine",
    "nameFa": "ترئونین",
    "unit": "g",
    "rank": 16400,
    "group": "aminoAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1212,
    "number": "503",
    "name": "Isoleucine",
    "nameFa": "ایزولوسین",
    "unit": "g",
    "rank": 16500,
    "group": "aminoAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1213,
    "number": "504",
    "name": "Leucine",
    "nameFa": "لوسین",
    "unit": "g",
    "rank": 16600,
    "group": "aminoAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1214,
    "number": "505",
    "name": "Lysine",
    "nameFa": "لیزین",
    "unit": "g",
    "rank": 16700,
    "group": "aminoAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1215,
    "number": "506",
    "name": "Methionine",
    "nameFa": "متیونین",
    "unit": "g",
    "rank": 16800,
    "group": "aminoAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1216,
    "number": "507",
    "name": "Cystine",
    "nameFa": "سیستین",
    "unit": "g",
    "rank": 16900,
    "group": "aminoAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1217,
    "number": "508",
    "name": "Phenylalanine",
    "nameFa": "فنیل‌آلانین",
    "unit": "g",
    "rank": 17000,
    "group": "aminoAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1218,
    "number": "509",
    "name": "Tyrosine",
    "nameFa": "تیروزین",
    "unit": "g",
    "rank": 17100,
    "group": "aminoAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1219,
    "number": "510",
    "name": "Valine",
    "nameFa": "والین",
    "unit": "g",
    "rank": 17200,
    "group": "aminoAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1220,
    "number": "511",
    "name": "Arginine",
    "nameFa": "آرژینین",
    "unit": "g",
    "rank": 17300,
    "group": "aminoAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1221,
    "number": "512",
    "name": "Histidine",
    "nameFa": "هیستیدین",
    "unit": "g",
    "rank": 17400,
    "group": "aminoAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1222,
    "number": "513",
    "name": "Alanine",
    "nameFa": "آلانین",
    "unit": "g",
    "rank": 17500,
    "group": "aminoAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1223,
    "number": "514",
    "name": "Aspartic acid",
    "nameFa": "اسید آسپارتیک",
    "unit": "g",
    "rank": 17600,
    "group": "aminoAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1224,
    "number": "515",
    "name": "Glutamic acid",
    "nameFa": "اسید گلوتامیک",
    "unit": "g",
    "rank": 17700,
    "group": "aminoAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1225,
    "number": "516",
    "name": "Glycine",
    "nameFa": "گلیسین",
    "unit": "g",
    "rank": 17800,
    "group": "aminoAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1226,
    "number": "517",
    "name": "Proline",
    "nameFa": "پرولین",
    "unit": "g",
    "rank": 17900,
    "group": "aminoAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1227,
    "number": "518",
    "name": "Serine",
    "nameFa": "سرین",
    "unit": "g",
    "rank": 18000,
    "group": "aminoAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1228,
    "number": "521",
    "name": "Hydroxyproline",
    "nameFa": "هیدروکسی‌پرولین",
    "unit": "g",
    "rank": 18100,
    "group": "aminoAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1242,
    "number": "573",
    "name": "Vitamin E, added",
    "nameFa": "Vitamin E, added",
    "unit": "mg",
    "rank": 7920,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1246,
    "number": "578",
    "name": "Vitamin B-12, added",
    "nameFa": "Vitamin B-12, added",
    "unit": "µg",
    "rank": 7340,
    "group": "vitamins",
    "storage": "micronutrients"
  },
  {
    "id": 1253,
    "number": "601",
    "name": "Cholesterol",
    "nameFa": "کلسترول",
    "unit": "mg",
    "rank": 15700,
    "group": "other",
    "storage": "micronutrients"
  },
  {
    "id": 1257,
    "number": "605",
    "name": "Fatty acids, total trans",
    "nameFa": "اسیدهای چرب ترانس کل",
    "unit": "g",
    "rank": 15400,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1258,
    "number": "606",
    "name": "Fatty acids, total saturated",
    "nameFa": "اسیدهای چرب اشباع کل",
    "unit": "g",
    "rank": 9700,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1259,
    "number": "607",
    "name": "SFA 4:0",
    "nameFa": "SFA 4:0",
    "unit": "g",
    "rank": 9800,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1260,
    "number": "608",
    "name": "SFA 6:0",
    "nameFa": "SFA 6:0",
    "unit": "g",
    "rank": 9900,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1261,
    "number": "609",
    "name": "SFA 8:0",
    "nameFa": "SFA 8:0",
    "unit": "g",
    "rank": 10000,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1262,
    "number": "610",
    "name": "SFA 10:0",
    "nameFa": "SFA 10:0",
    "unit": "g",
    "rank": 10100,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1263,
    "number": "611",
    "name": "SFA 12:0",
    "nameFa": "SFA 12:0",
    "unit": "g",
    "rank": 10300,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1264,
    "number": "612",
    "name": "SFA 14:0",
    "nameFa": "SFA 14:0",
    "unit": "g",
    "rank": 10500,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1265,
    "number": "613",
    "name": "SFA 16:0",
    "nameFa": "SFA 16:0",
    "unit": "g",
    "rank": 10700,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1266,
    "number": "614",
    "name": "SFA 18:0",
    "nameFa": "SFA 18:0",
    "unit": "g",
    "rank": 10900,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1267,
    "number": "615",
    "name": "SFA 20:0",
    "nameFa": "SFA 20:0",
    "unit": "g",
    "rank": 11100,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1268,
    "number": "617",
    "name": "MUFA 18:1",
    "nameFa": "اسید اولئیک (MUFA 18:1)",
    "unit": "g",
    "rank": 12100,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1269,
    "number": "618",
    "name": "PUFA 18:2",
    "nameFa": "اسید لینولئیک (PUFA 18:2)",
    "unit": "g",
    "rank": 13100,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1270,
    "number": "619",
    "name": "PUFA 18:3",
    "nameFa": "اسید لینولنیک (PUFA 18:3)",
    "unit": "g",
    "rank": 13900,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1271,
    "number": "620",
    "name": "PUFA 20:4",
    "nameFa": "PUFA 20:4",
    "unit": "g",
    "rank": 14700,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1272,
    "number": "621",
    "name": "PUFA 22:6 n-3 (DHA)",
    "nameFa": "DHA (امگا ۳)",
    "unit": "g",
    "rank": 15300,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1273,
    "number": "624",
    "name": "SFA 22:0",
    "nameFa": "SFA 22:0",
    "unit": "g",
    "rank": 11200,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1274,
    "number": "625",
    "name": "MUFA 14:1",
    "nameFa": "MUFA 14:1",
    "unit": "g",
    "rank": 11500,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1275,
    "number": "626",
    "name": "MUFA 16:1",
    "nameFa": "MUFA 16:1",
    "unit": "g",
    "rank": 11700,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1276,
    "number": "627",
    "name": "PUFA 18:4",
    "nameFa": "PUFA 18:4",
    "unit": "g",
    "rank": 14250,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1277,
    "number": "628",
    "name": "MUFA 20:1",
    "nameFa": "MUFA 20:1",
    "unit": "g",
    "rank": 12400,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1278,
    "number": "629",
    "name": "PUFA 20:5 n-3 (EPA)",
    "nameFa": "EPA (امگا ۳)",
    "unit": "g",
    "rank": 15000,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1279,
    "number": "630",
    "name": "MUFA 22:1",
    "nameFa": "MUFA 22:1",
    "unit": "g",
    "rank": 12500,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1280,
    "number": "631",
    "name": "PUFA 22:5 n-3 (DPA)",
    "nameFa": "DPA (امگا ۳)",
    "unit": "g",
    "rank": 15200,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1283,
    "number": "636",
    "name": "Phytosterols",
    "nameFa": "فیتواسترول‌ها",
    "unit": "mg",
    "rank": 15800,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1285,
    "number": "638",
    "name": "Stigmasterol",
    "nameFa": "استیگماسترول",
    "unit": "mg",
    "rank": 15900,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1286,
    "number": "639",
    "name": "Campesterol",
    "nameFa": "کامپسترول",
    "unit": "mg",
    "rank": 16000,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1288,
    "number": "641",
    "name": "Beta-sitosterol",
    "nameFa": "بتاسیتوسترول",
    "unit": "mg",
    "rank": 16200,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1292,
    "number": "645",
    "name": "Fatty acids, total monounsaturated",
    "nameFa": "اسیدهای چرب تک‌غیراشباع کل",
    "unit": "g",
    "rank": 11400,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1293,
    "number": "646",
    "name": "Fatty acids, total polyunsaturated",
    "nameFa": "اسیدهای چرب چندغیراشباع کل",
    "unit": "g",
    "rank": 12900,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1299,
    "number": "652",
    "name": "SFA 15:0",
    "nameFa": "SFA 15:0",
    "unit": "g",
    "rank": 10600,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1300,
    "number": "653",
    "name": "SFA 17:0",
    "nameFa": "SFA 17:0",
    "unit": "g",
    "rank": 10800,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1301,
    "number": "654",
    "name": "SFA 24:0",
    "nameFa": "SFA 24:0",
    "unit": "g",
    "rank": 11300,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1303,
    "number": "662",
    "name": "TFA 16:1 t",
    "nameFa": "TFA 16:1 t",
    "unit": "g",
    "rank": 15520,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1304,
    "number": "663",
    "name": "TFA 18:1 t",
    "nameFa": "TFA 18:1 t",
    "unit": "g",
    "rank": 15521,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1305,
    "number": "664",
    "name": "TFA 22:1 t",
    "nameFa": "TFA 22:1 t",
    "unit": "g",
    "rank": 15550,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1306,
    "number": "665",
    "name": "TFA 18:2 t not further defined",
    "nameFa": "TFA 18:2 t not further defined",
    "unit": "g",
    "rank": 15610,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1307,
    "number": "666",
    "name": "PUFA 18:2 i",
    "nameFa": "PUFA 18:2 i",
    "unit": "g",
    "rank": 13350,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1310,
    "number": "669",
    "name": "TFA 18:2 t,t",
    "nameFa": "TFA 18:2 t,t",
    "unit": "g",
    "rank": 15615,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1311,
    "number": "670",
    "name": "PUFA 18:2 CLAs",
    "nameFa": "PUFA 18:2 CLAs",
    "unit": "g",
    "rank": 13300,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1312,
    "number": "671",
    "name": "MUFA 24:1 c",
    "nameFa": "MUFA 24:1 c",
    "unit": "g",
    "rank": 12800,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1313,
    "number": "672",
    "name": "PUFA 20:2 n-6 c,c",
    "nameFa": "PUFA 20:2 n-6 c,c",
    "unit": "g",
    "rank": 14300,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1314,
    "number": "673",
    "name": "MUFA 16:1 c",
    "nameFa": "MUFA 16:1 c",
    "unit": "g",
    "rank": 11800,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1315,
    "number": "674",
    "name": "MUFA 18:1 c",
    "nameFa": "MUFA 18:1 c",
    "unit": "g",
    "rank": 12200,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1316,
    "number": "675",
    "name": "PUFA 18:2 n-6 c,c",
    "nameFa": "PUFA 18:2 n-6 c,c",
    "unit": "g",
    "rank": 13200,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1317,
    "number": "676",
    "name": "MUFA 22:1 c",
    "nameFa": "MUFA 22:1 c",
    "unit": "g",
    "rank": 12600,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1321,
    "number": "685",
    "name": "PUFA 18:3 n-6 c,c,c",
    "nameFa": "PUFA 18:3 n-6 c,c,c",
    "unit": "g",
    "rank": 14100,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1323,
    "number": "687",
    "name": "MUFA 17:1",
    "nameFa": "MUFA 17:1",
    "unit": "g",
    "rank": 12000,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1325,
    "number": "689",
    "name": "PUFA 20:3",
    "nameFa": "PUFA 20:3",
    "unit": "g",
    "rank": 14400,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1329,
    "number": "693",
    "name": "Fatty acids, total trans-monoenoic",
    "nameFa": "Fatty acids, total trans-monoenoic",
    "unit": "g",
    "rank": 15500,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1331,
    "number": "695",
    "name": "Fatty acids, total trans-polyenoic",
    "nameFa": "Fatty acids, total trans-polyenoic",
    "unit": "g",
    "rank": 15619,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1332,
    "number": "696",
    "name": "SFA 13:0",
    "nameFa": "SFA 13:0",
    "unit": "g",
    "rank": 10400,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1333,
    "number": "697",
    "name": "MUFA 15:1",
    "nameFa": "MUFA 15:1",
    "unit": "g",
    "rank": 11600,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1404,
    "number": "851",
    "name": "PUFA 18:3 n-3 c,c,c (ALA)",
    "nameFa": "ALA (امگا ۳)",
    "unit": "g",
    "rank": 14000,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1405,
    "number": "852",
    "name": "PUFA 20:3 n-3",
    "nameFa": "PUFA 20:3 n-3",
    "unit": "g",
    "rank": 14500,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1406,
    "number": "853",
    "name": "PUFA 20:3 n-6",
    "nameFa": "PUFA 20:3 n-6",
    "unit": "g",
    "rank": 14600,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1408,
    "number": "855",
    "name": "PUFA 20:4 n-6",
    "nameFa": "PUFA 20:4 n-6",
    "unit": "g",
    "rank": 14900,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1409,
    "number": "856",
    "name": "PUFA 18:3i",
    "nameFa": "PUFA 18:3i",
    "unit": "g",
    "rank": 14200,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1410,
    "number": "857",
    "name": "PUFA 21:5",
    "nameFa": "PUFA 21:5",
    "unit": "g",
    "rank": 15100,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1411,
    "number": "858",
    "name": "PUFA 22:4",
    "nameFa": "PUFA 22:4",
    "unit": "g",
    "rank": 15160,
    "group": "fattyAcids",
    "storage": "micronutrients"
  },
  {
    "id": 1412,
    "number": "859",
    "name": "MUFA 18:1-11 t (18:1t n-7)",
    "nameFa": "MUFA 18:1-11 t (18:1t n-7)",
    "unit": "g",
    "rank": 12310,
    "group": "fattyAcids",
    "storage": "micronutrients"
  }
]

export const USDA_NUTRIENT_BY_ID = Object.freeze(
  Object.fromEntries(USDA_NUTRIENTS.map(item => [String(item.id), item]))
)

export const USDA_NUTRIENT_BY_NUMBER = Object.freeze(
  Object.fromEntries(USDA_NUTRIENTS.map(item => [String(item.number), item]))
)

export const MICRONUTRIENT_GROUPS = [
  { id: 'vitamins', en: 'Vitamins', fa: 'ویتامین‌ها' },
  { id: 'minerals', en: 'Minerals', fa: 'مواد معدنی' },
  { id: 'aminoAcids', en: 'Amino acids', fa: 'اسیدهای آمینه' },
  { id: 'fattyAcids', en: 'Fatty acids', fa: 'اسیدهای چرب' },
  { id: 'carbohydrates', en: 'Carbohydrates & sugars', fa: 'کربوهیدرات‌ها و قندها' },
  { id: 'phytosterols', en: 'Phytosterols', fa: 'فیتواسترول‌ها' },
  { id: 'other', en: 'Other compounds', fa: 'سایر ترکیبات' }
]

export const USDA_CORE_MACROS = Object.freeze(
  Object.fromEntries(
    USDA_NUTRIENTS
      .filter(item => item.storage === 'macro')
      .map(item => [item.number, item.macroKey])
  )
)


// -----------------------------------------------------------------------------
// OpenGym's source-independent nutrient catalog
// USDA IDs are source references only. Food records use stable internal keys.
// -----------------------------------------------------------------------------


const createInternalNutrientKey = (nutrient) => {
  if (nutrient.storage === 'macro') return nutrient.macroKey;

  // Distinguish energy measured in kJ from energy measured in kcal.
  if (nutrient.number === '268') return 'energy-kj';

  const base = nutrient.name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return base || 'other-nutrient';
};

const usedNutrientKeys = new Set();

export const NUTRIENT_CATALOG = Object.freeze(
  USDA_NUTRIENTS.map((nutrient) => {
    let key = createInternalNutrientKey(nutrient);

    // Resolve duplicate names without making USDA IDs the normal storage key.
if (usedNutrientKeys.has(key)) {
  const unitKey = String(nutrient.unit || 'unit')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');

  key = `${key}-${unitKey}`;

  if (usedNutrientKeys.has(key)) {
    key = `${key}-variant-${usedNutrientKeys.size + 1}`;
  }
}

    usedNutrientKeys.add(key);

    return Object.freeze({
      ...nutrient,
      key,
      source: Object.freeze({
        provider: 'usda-sr-legacy',
        nutrientId: nutrient.id,
        nutrientNumber: nutrient.number
      })
    });
  })
);

export const MICRONUTRIENT_CATALOG = Object.freeze(
  NUTRIENT_CATALOG.filter(
    nutrient => nutrient.storage !== 'macro'
  )
);

export const NUTRIENT_BY_KEY = Object.freeze(
  Object.fromEntries(
    NUTRIENT_CATALOG.map(nutrient => [nutrient.key, nutrient])
  )
);

export const CORE_MACRO_KEYS = Object.freeze([
  'calories',
  'protein',
  'carbs',
  'fat'
]);

// Missing values remain missing. They are never converted to zero.
export const normalizeMicronutrients = (values = {}) => {
  if (!values || typeof values !== 'object' || Array.isArray(values)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(values).filter(
      ([, value]) =>
        value !== null &&
        value !== '' &&
        Number.isFinite(Number(value))
    ).map(([key, value]) => [key, Number(value)])
  );
};

export const scaleMicronutrients = (values = {}, factor = 1) => {
  const normalized = normalizeMicronutrients(values);

  if (!Number.isFinite(Number(factor))) return normalized;

  return Object.fromEntries(
    Object.entries(normalized).map(
      ([key, value]) => [key, value * Number(factor)]
    )
  );
};
