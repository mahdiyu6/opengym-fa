// Bilingual educational lab-marker information for OpenGym Health.
// Reference intervals must come from the user's own laboratory report.
// This content is educational and is not a diagnosis or treatment recommendation.
const INFO = {
  "WBC": {
    "en": {
      "title": "White blood cell count",
      "what": "Immune defence against infection and abnormal cells.",
      "role": "They help recognize and respond to infections and inflammation.",
      "high": "High: infection, inflammation, stress, smoking, or medicines.",
      "low": "Low: viral illness, medicines, immune or marrow disorders.",
      "factors": "Recent illness, medicines, smoking, stress."
    },
    "fa": {
      "title": "تعداد کل گلبول‌های سفید",
      "what": "دفاع ایمنی در برابر عفونت و سلول‌های غیرطبیعی.",
      "role": "در شناسایی و مقابله با عفونت‌ها و التهاب نقش دارند.",
      "high": "بالا: عفونت، التهاب، استرس، سیگار یا داروها.",
      "low": "پایین: عفونت ویروسی، داروها یا اختلالات ایمنی و مغز استخوان.",
      "factors": "بیماری اخیر، دارو، سیگار و استرس."
    }
  },
  "NEUTROPHILS#": {
    "en": {
      "title": "Absolute neutrophil count",
      "what": "Rapid immune response, especially against bacteria and fungi.",
      "role": "They provide rapid defense, especially against bacterial and fungal infections.",
      "high": "High: bacterial infection, inflammation, stress, steroids.",
      "low": "Low: medicines, viral illness, marrow conditions; severe lows increase infection risk.",
      "factors": "Medicines and recent infection."
    },
    "fa": {
      "title": "تعداد مطلق نوتروفیل",
      "what": "پاسخ سریع ایمنی، به‌ویژه علیه باکتری‌ها و قارچ‌ها.",
      "role": "خط دفاعی سریع بدن، به‌ویژه در برابر عفونت‌های باکتریایی و قارچی هستند.",
      "high": "بالا: عفونت باکتریایی، التهاب، استرس یا کورتون.",
      "low": "پایین: داروها، عفونت ویروسی یا اختلال مغز استخوان؛ کاهش شدید خطر عفونت را بالا می‌برد.",
      "factors": "داروها و عفونت اخیر."
    }
  },
  "LYMPHOCYTES#": {
    "en": {
      "title": "Absolute lymphocyte count",
      "what": "B, T and NK cells support targeted immunity and immune memory.",
      "role": "They coordinate adaptive immunity; B cells produce antibodies and T cells regulate cellular immunity.",
      "high": "High: some viral infections or blood disorders.",
      "low": "Low: acute illness, immune suppression, steroids or other medicines.",
      "factors": "Age, medicines, infection and immune status."
    },
    "fa": {
      "title": "تعداد مطلق لنفوسیت",
      "what": "سلول‌های B و T و NK در ایمنی اختصاصی و حافظه ایمنی نقش دارند.",
      "role": "ایمنی اختصاصی را هدایت می‌کنند؛ سلول‌های B پادتن می‌سازند و سلول‌های T ایمنی سلولی را تنظیم می‌کنند.",
      "high": "بالا: برخی عفونت‌های ویروسی یا اختلالات خونی.",
      "low": "پایین: بیماری حاد، سرکوب ایمنی یا بعضی داروها.",
      "factors": "سن، دارو، عفونت و وضعیت ایمنی."
    }
  },
  "MONOCYTES#": {
    "en": {
      "title": "Absolute monocyte count",
      "what": "Help clear debris and coordinate inflammation and tissue repair.",
      "role": "They can become macrophages in tissues and help remove microbes and damaged cells.",
      "high": "High: recovery from infection, chronic inflammation, some blood disorders.",
      "low": "Low: often little meaning alone.",
      "factors": "Recent infection and inflammation."
    },
    "fa": {
      "title": "تعداد مطلق مونوسیت",
      "what": "در پاک‌سازی بقایا، تنظیم التهاب و ترمیم بافت نقش دارند.",
      "role": "می‌توانند در بافت‌ها به ماکروفاژ تبدیل شوند و میکروب‌ها و سلول‌های آسیب‌دیده را پاک‌سازی کنند.",
      "high": "بالا: دوره بهبود عفونت، التهاب مزمن یا برخی اختلالات خونی.",
      "low": "پایین: اغلب به‌تنهایی معنای مهمی ندارد.",
      "factors": "عفونت اخیر و التهاب."
    }
  },
  "EOSINOPHILS#": {
    "en": {
      "title": "Absolute eosinophil count",
      "what": "Participate in allergy and defence against some parasites.",
      "role": "They participate in parasite defense and allergic inflammation.",
      "high": "High: allergy, asthma, drug reaction, parasites.",
      "low": "Low: commonly not important alone; may follow stress or steroids.",
      "factors": "Allergies, asthma, exposures and medicines."
    },
    "fa": {
      "title": "تعداد مطلق ائوزینوفیل",
      "what": "در آلرژی و دفاع در برابر برخی انگل‌ها نقش دارند.",
      "role": "در مقابله با انگل‌ها و واکنش‌های التهابی آلرژیک نقش دارند.",
      "high": "بالا: آلرژی، آسم، واکنش دارویی یا انگل.",
      "low": "پایین: معمولاً به‌تنهایی مهم نیست و ممکن است با استرس یا کورتون دیده شود.",
      "factors": "آلرژی، آسم، تماس‌ها و داروها."
    }
  },
  "BASOPHILS#": {
    "en": {
      "title": "Absolute basophil count",
      "what": "Participate in allergic and inflammatory signalling, including histamine release.",
      "role": "They release histamine and other mediators involved in allergic reactions.",
      "high": "High: allergy, inflammation, thyroid or blood conditions.",
      "low": "Low: usually not meaningful alone.",
      "factors": "Small counts vary; review the full CBC."
    },
    "fa": {
      "title": "تعداد مطلق بازوفیل",
      "what": "در پیام‌رسانی آلرژیک و التهابی از جمله آزادسازی هیستامین نقش دارند.",
      "role": "با آزادسازی هیستامین و مواد دیگر در واکنش‌های آلرژیک مشارکت دارند.",
      "high": "بالا: آلرژی، التهاب یا برخی اختلالات تیروئید و خون.",
      "low": "پایین: معمولاً به‌تنهایی اهمیت ندارد.",
      "factors": "تعداد کم است و نوسان دارد؛ همراه CBC بررسی شود."
    }
  },
  "NEUTROPHILS": {
    "en": {
      "title": "Neutrophil percentage",
      "what": "Early immune defence, especially against bacteria.",
      "role": "It helps assess the distribution of innate immune cells.",
      "high": "High percentage: infection, stress or steroid effect.",
      "low": "Low percentage: viral illness or relative shift in other cells.",
      "factors": "A percentage is relative; check absolute count too."
    },
    "fa": {
      "title": "درصد نوتروفیل",
      "what": "دفاع اولیه ایمنی، به‌ویژه در برابر باکتری‌ها.",
      "role": "برای ارزیابی سهم سلول‌های ایمنی ذاتی در ترکیب گلبول‌های سفید استفاده می‌شود.",
      "high": "درصد بالا: عفونت، استرس یا اثر کورتون.",
      "low": "درصد پایین: بیماری ویروسی یا تغییر نسبی سایر سلول‌ها.",
      "factors": "درصد نسبی است؛ شمارش مطلق را هم بررسی کن."
    }
  },
  "LYMPHOCYTES": {
    "en": {
      "title": "Lymphocyte percentage",
      "what": "Coordinate targeted immune responses and immune memory.",
      "role": "It helps assess the relative proportion of adaptive immune cells.",
      "high": "High: some viral illnesses or relative shifts.",
      "low": "Low: acute stress, illness or steroids.",
      "factors": "Check absolute count; percentages alone may mislead."
    },
    "fa": {
      "title": "درصد لنفوسیت",
      "what": "پاسخ ایمنی اختصاصی و حافظه ایمنی را سازمان‌دهی می‌کنند.",
      "role": "برای ارزیابی سهم نسبی سلول‌های ایمنی اختصاصی استفاده می‌شود.",
      "high": "بالا: برخی بیماری‌های ویروسی یا تغییر نسبی سلول‌ها.",
      "low": "پایین: استرس حاد، بیماری یا کورتون.",
      "factors": "شمارش مطلق را بررسی کن؛ درصد تنها ممکن است گمراه‌کننده باشد."
    }
  },
  "MONOCYTES": {
    "en": {
      "title": "Monocyte percentage",
      "what": "Support tissue clean-up and immune regulation.",
      "role": "It contributes to assessment of immune surveillance and cellular cleanup.",
      "high": "High: recovery from infection or chronic inflammation.",
      "low": "Low: usually not meaningful alone.",
      "factors": "Relative percentage changes with other white cells."
    },
    "fa": {
      "title": "درصد مونوسیت",
      "what": "در پاک‌سازی بافت و تنظیم ایمنی نقش دارند.",
      "role": "در ارزیابی فعالیت پایش ایمنی و پاک‌سازی سلولی کمک‌کننده است.",
      "high": "بالا: بهبود عفونت یا التهاب مزمن.",
      "low": "پایین: معمولاً به‌تنهایی مهم نیست.",
      "factors": "با تغییر سایر گلبول‌های سفید، درصد نسبی هم تغییر می‌کند."
    }
  },
  "EOSINOPHILS": {
    "en": {
      "title": "Eosinophil percentage",
      "what": "Participate in allergy and parasite-related responses.",
      "role": "It helps interpret allergic and parasite-related immune patterns.",
      "high": "High: allergy, asthma, drug reaction or parasites.",
      "low": "Low: usually little significance.",
      "factors": "Review absolute count and symptoms."
    },
    "fa": {
      "title": "درصد ائوزینوفیل",
      "what": "در پاسخ‌های مرتبط با آلرژی و انگل نقش دارند.",
      "role": "به تفسیر الگوهای ایمنی مرتبط با آلرژی و انگل کمک می‌کند.",
      "high": "بالا: آلرژی، آسم، واکنش دارویی یا انگل.",
      "low": "پایین: معمولاً اهمیت کمی دارد.",
      "factors": "شمارش مطلق و علائم را بررسی کن."
    }
  },
  "BASOPHILS": {
    "en": {
      "title": "Basophil percentage",
      "what": "Contribute to allergic and inflammatory signalling.",
      "role": "It adds context to allergic and inflammatory patterns.",
      "high": "High: allergy, inflammation or uncommon blood conditions.",
      "low": "Low: usually not meaningful alone.",
      "factors": "Basophils are rare; small changes affect percentage."
    },
    "fa": {
      "title": "درصد بازوفیل",
      "what": "در پیام‌رسانی آلرژیک و التهابی نقش دارند.",
      "role": "برای تفسیر الگوهای آلرژیک و التهابی اطلاعات تکمیلی فراهم می‌کند.",
      "high": "بالا: آلرژی، التهاب یا به‌ندرت اختلالات خونی.",
      "low": "پایین: معمولاً به‌تنهایی مهم نیست.",
      "factors": "بازوفیل‌ها کم‌شمارند و تغییر کوچک روی درصد اثر می‌گذارد."
    }
  },
  "RBC": {
    "en": {
      "title": "Red blood cell count",
      "what": "Red cells carry oxygen using haemoglobin.",
      "role": "They transport oxygen from the lungs to tissues and help carry carbon dioxide back.",
      "high": "High: dehydration, smoking, low oxygen or increased production.",
      "low": "Low: anaemia, blood loss or nutrient deficiency.",
      "factors": "Hydration, altitude, smoking, age and sex."
    },
    "fa": {
      "title": "تعداد گلبول قرمز",
      "what": "گلبول‌های قرمز با هموگلوبین اکسیژن را حمل می‌کنند.",
      "role": "اکسیژن را از ریه به بافت‌ها می‌رسانند و در بازگرداندن دی‌اکسیدکربن نقش دارند.",
      "high": "بالا: کم‌آبی، سیگار، کمبود اکسیژن یا افزایش تولید.",
      "low": "پایین: کم‌خونی، خون‌ریزی یا کمبود مواد مغذی.",
      "factors": "آب بدن، ارتفاع، سیگار، سن و جنس."
    }
  },
  "HEMOGLOBIN": {
    "en": {
      "title": "Haemoglobin",
      "what": "Protein in red cells that binds and delivers oxygen.",
      "role": "It binds oxygen in the lungs and releases it to body tissues.",
      "high": "High: dehydration or increased red-cell mass.",
      "low": "Low: anaemia, iron/B12/folate deficiency or bleeding.",
      "factors": "Hydration, altitude, pregnancy, age and sex."
    },
    "fa": {
      "title": "هموگلوبین",
      "what": "پروتئین گلبول قرمز که اکسیژن را متصل و منتقل می‌کند.",
      "role": "در ریه به اکسیژن متصل می‌شود و آن را در بافت‌های بدن آزاد می‌کند.",
      "high": "بالا: کم‌آبی یا افزایش توده گلبول قرمز.",
      "low": "پایین: کم‌خونی، کمبود آهن/B12/فولات یا خون‌ریزی.",
      "factors": "آب بدن، ارتفاع، بارداری، سن و جنس."
    }
  },
  "HEMATOCRIT": {
    "en": {
      "title": "Hematocrit",
      "what": "Fraction of blood volume occupied by red cells.",
      "role": "It helps assess red-cell concentration and investigate anemia or dehydration.",
      "high": "High: dehydration or increased red cells.",
      "low": "Low: anaemia, bleeding or excess fluid.",
      "factors": "Hydration and red-cell size."
    },
    "fa": {
      "title": "هماتوکریت",
      "what": "سهم حجمی گلبول‌های قرمز از کل خون.",
      "role": "برای ارزیابی غلظت گلبول‌های قرمز و بررسی کم‌خونی یا کم‌آبی استفاده می‌شود.",
      "high": "بالا: کم‌آبی یا افزایش گلبول قرمز.",
      "low": "پایین: کم‌خونی، خون‌ریزی یا مایعات زیاد.",
      "factors": "آب بدن و اندازه گلبول قرمز."
    }
  },
  "MCV": {
    "en": {
      "title": "Mean red cell volume",
      "what": "Classifies red cells by average size and helps assess anaemia.",
      "role": "It classifies red cells by size and helps identify anemia patterns.",
      "high": "High: B12/folate deficiency, alcohol, liver disease or medicines.",
      "low": "Low: iron deficiency or thalassaemia trait.",
      "factors": "Interpret with Hb, RDW, B12, folate and iron."
    },
    "fa": {
      "title": "میانگین حجم گلبول قرمز",
      "what": "اندازه متوسط گلبول قرمز را نشان می‌دهد و به بررسی کم‌خونی کمک می‌کند.",
      "role": "اندازه گلبول‌ها را مشخص می‌کند و به دسته‌بندی انواع کم‌خونی کمک می‌کند.",
      "high": "بالا: کمبود B12/فولات، الکل، بیماری کبد یا داروها.",
      "low": "پایین: کمبود آهن یا صفت تالاسمی.",
      "factors": "همراه Hb، RDW، B12، فولات و آهن تفسیر شود."
    }
  },
  "MCH": {
    "en": {
      "title": "Mean haemoglobin per red cell",
      "what": "Shows average haemoglobin amount in each red cell.",
      "role": "It helps evaluate the hemoglobin content of individual red cells.",
      "high": "High: often follows larger red cells.",
      "low": "Low: iron deficiency or thalassaemia patterns.",
      "factors": "Review with MCV, MCHC and iron studies."
    },
    "fa": {
      "title": "میانگین هموگلوبین هر گلبول",
      "what": "مقدار متوسط هموگلوبین در هر گلبول قرمز را نشان می‌دهد.",
      "role": "برای ارزیابی مقدار هموگلوبین موجود در هر گلبول قرمز کاربرد دارد.",
      "high": "بالا: اغلب همراه بزرگ‌شدن گلبول قرمز.",
      "low": "پایین: کمبود آهن یا الگوهای تالاسمی.",
      "factors": "همراه MCV، MCHC و آزمایش آهن بررسی شود."
    }
  },
  "MCHC": {
    "en": {
      "title": "Mean haemoglobin concentration",
      "what": "Describes haemoglobin concentration inside red cells.",
      "role": "It helps characterize red-cell hemoglobinization and anemia patterns.",
      "high": "High: uncommon; may reflect red-cell shape or measurement issues.",
      "low": "Low: iron deficiency/hypochromia.",
      "factors": "Check smear and other red-cell indices if unexpected."
    },
    "fa": {
      "title": "میانگین غلظت هموگلوبین",
      "what": "غلظت هموگلوبین داخل گلبول قرمز را توصیف می‌کند.",
      "role": "به بررسی میزان هموگلوبین‌دار بودن گلبول‌ها و الگوهای کم‌خونی کمک می‌کند.",
      "high": "بالا: غیرشایع؛ گاهی ناشی از شکل سلول یا خطای اندازه‌گیری.",
      "low": "پایین: کمبود آهن یا کم‌رنگی سلول.",
      "factors": "در نتیجه غیرمنتظره، اسمیر و شاخص‌های دیگر بررسی شوند."
    }
  },
  "RDW-CV": {
    "en": {
      "title": "Red cell size variation (CV)",
      "what": "Measures variation in red-cell size as a percentage.",
      "role": "It helps detect variation in red-cell size when evaluating anemia.",
      "high": "High: iron, B12 or folate deficiency, or mixed deficiencies.",
      "low": "Low: usually not significant.",
      "factors": "Interpret with MCV and haemoglobin."
    },
    "fa": {
      "title": "تنوع اندازه گلبول قرمز",
      "what": "تنوع اندازه گلبول‌های قرمز را به‌صورت درصد نشان می‌دهد.",
      "role": "برای شناسایی تفاوت اندازه گلبول‌های قرمز در بررسی کم‌خونی استفاده می‌شود.",
      "high": "بالا: کمبود آهن، B12، فولات یا کمبودهای ترکیبی.",
      "low": "پایین: معمولاً مهم نیست.",
      "factors": "همراه MCV و هموگلوبین تفسیر شود."
    }
  },
  "RDW-SD": {
    "en": {
      "title": "Red cell size variation (SD)",
      "what": "Measures the spread of red-cell volumes.",
      "role": "It quantifies red-cell size variability and complements MCV.",
      "high": "High: greater size variation, including nutritional deficiencies.",
      "low": "Low: usually not significant.",
      "factors": "Use the lab range and other CBC indices."
    },
    "fa": {
      "title": "پراکندگی اندازه گلبول قرمز",
      "what": "پراکندگی حجم گلبول‌های قرمز را اندازه می‌گیرد.",
      "role": "میزان پراکندگی اندازه گلبول‌ها را کمی می‌کند و مکمل MCV است.",
      "high": "بالا: تنوع بیشتر اندازه، از جمله در کمبودهای تغذیه‌ای.",
      "low": "پایین: معمولاً مهم نیست.",
      "factors": "محدوده آزمایشگاه و شاخص‌های دیگر CBC را در نظر بگیر."
    }
  },
  "PLATELETS": {
    "en": {
      "title": "Platelet count",
      "what": "Platelets help form clots and stop bleeding.",
      "role": "They form an initial plug at injured vessels and support blood clotting.",
      "high": "High: inflammation, infection, iron deficiency or blood loss.",
      "low": "Low: medicines, infection, immune or marrow conditions.",
      "factors": "Sample clumping, medicines and recent illness."
    },
    "fa": {
      "title": "تعداد پلاکت",
      "what": "پلاکت‌ها به تشکیل لخته و توقف خون‌ریزی کمک می‌کنند.",
      "role": "در محل آسیب رگ پلاک اولیه تشکیل می‌دهند و به انعقاد خون کمک می‌کنند.",
      "high": "بالا: التهاب، عفونت، کمبود آهن یا خون‌ریزی.",
      "low": "پایین: داروها، عفونت یا اختلالات ایمنی و مغز استخوان.",
      "factors": "چسبندگی پلاکت در نمونه، دارو و بیماری اخیر."
    }
  },
  "MPV": {
    "en": {
      "title": "Mean platelet volume",
      "what": "Average platelet size; indirectly relates to platelet production/turnover.",
      "role": "It provides clues about platelet production and turnover.",
      "high": "High: more large/young platelets.",
      "low": "Low: may accompany reduced production.",
      "factors": "Interpret with platelet count; sample handling matters."
    },
    "fa": {
      "title": "میانگین حجم پلاکت",
      "what": "اندازه متوسط پلاکت؛ به‌طور غیرمستقیم با تولید و گردش پلاکت ارتباط دارد.",
      "role": "می‌تواند درباره میزان تولید و جایگزینی پلاکت‌ها اطلاعات بدهد.",
      "high": "بالا: پلاکت‌های بزرگ یا جوان بیشتر.",
      "low": "پایین: ممکن است با کاهش تولید همراه باشد.",
      "factors": "همراه تعداد پلاکت تفسیر شود؛ نگهداری نمونه مهم است."
    }
  },
  "PDW": {
    "en": {
      "title": "Platelet distribution width",
      "what": "Measures variation in platelet size.",
      "role": "It helps characterize platelet-size variability alongside MPV and platelet count.",
      "high": "High: platelet sizes are more variable.",
      "low": "Low: usually not interpreted alone.",
      "factors": "Analyzer and sample handling affect it."
    },
    "fa": {
      "title": "تنوع اندازه پلاکت",
      "what": "تنوع اندازه پلاکت‌ها را اندازه می‌گیرد.",
      "role": "همراه MPV و تعداد پلاکت به بررسی تغییرپذیری اندازه پلاکت‌ها کمک می‌کند.",
      "high": "بالا: اندازه پلاکت‌ها متنوع‌تر است.",
      "low": "پایین: معمولاً به‌تنهایی تفسیر نمی‌شود.",
      "factors": "دستگاه و نگهداری نمونه مؤثرند."
    }
  },
  "P-LCR": {
    "en": {
      "title": "Platelet large cell ratio",
      "what": "Proportion of platelets above the analyzer's large-size threshold.",
      "role": "It can provide additional information about platelet turnover.",
      "high": "High: more large platelets.",
      "low": "Low: interpret with platelet count and MPV.",
      "factors": "Analyzer-specific ranges; use platelet profile."
    },
    "fa": {
      "title": "درصد پلاکت‌های بزرگ",
      "what": "سهم پلاکت‌هایی را نشان می‌دهد که از آستانه اندازه بزرگ دستگاه بیشترند.",
      "role": "می‌تواند اطلاعات تکمیلی درباره روند تولید و جایگزینی پلاکت‌ها بدهد.",
      "high": "بالا: پلاکت‌های بزرگ بیشتر.",
      "low": "پایین: همراه تعداد پلاکت و MPV تفسیر شود.",
      "factors": "محدوده وابسته به دستگاه است؛ کل نمایه پلاکتی بررسی شود."
    }
  },
  "ESR 1ST": {
    "en": {
      "title": "Erythrocyte sedimentation rate",
      "what": "Nonspecific marker that can rise with inflammation.",
      "role": "It is a nonspecific marker used in evaluating inflammation.",
      "high": "High: infection, inflammation, anaemia, pregnancy or age.",
      "low": "Low: usually less informative.",
      "factors": "Age, anaemia, pregnancy and red-cell shape."
    },
    "fa": {
      "title": "سرعت رسوب گلبول قرمز",
      "what": "شاخصی غیراختصاصی است که در التهاب ممکن است بالا رود.",
      "role": "شاخصی غیراختصاصی برای ارزیابی و پیگیری التهاب است.",
      "high": "بالا: عفونت، التهاب، کم‌خونی، بارداری یا سن.",
      "low": "پایین: معمولاً اطلاعات کمتری دارد.",
      "factors": "سن، کم‌خونی، بارداری و شکل گلبول قرمز."
    }
  },
  "BUN": {
    "en": {
      "title": "Blood urea nitrogen",
      "what": "Waste nitrogen from protein metabolism; removed by kidneys.",
      "role": "It helps assess kidney waste handling together with hydration and other kidney tests.",
      "high": "High: dehydration, reduced kidney filtration, high protein intake or GI bleeding.",
      "low": "Low: low protein intake, severe liver disease or overhydration.",
      "factors": "Hydration, diet, medicines and kidney function."
    },
    "fa": {
      "title": "نیتروژن اوره خون",
      "what": "محصول دفعی متابولیسم پروتئین که توسط کلیه دفع می‌شود.",
      "role": "همراه وضعیت آب بدن و سایر آزمایش‌های کلیوی به ارزیابی دفع مواد زائد کمک می‌کند.",
      "high": "بالا: کم‌آبی، کاهش تصفیه کلیه، پروتئین زیاد یا خون‌ریزی گوارشی.",
      "low": "پایین: پروتئین کم، بیماری شدید کبد یا آب زیاد.",
      "factors": "آب بدن، رژیم، دارو و عملکرد کلیه."
    }
  },
  "CREATININE": {
    "en": {
      "title": "Creatinine",
      "what": "Muscle metabolism waste used to estimate kidney filtration (eGFR).",
      "role": "It is used to estimate kidney filtration, commonly through eGFR.",
      "high": "High: reduced kidney filtration, dehydration, medicines or muscle injury.",
      "low": "Low: low muscle mass or pregnancy.",
      "factors": "Muscle mass, exercise, meat, hydration and medicines."
    },
    "fa": {
      "title": "کراتینین",
      "what": "محصول متابولیسم عضله است و برای برآورد تصفیه کلیه (eGFR) به‌کار می‌رود.",
      "role": "برای برآورد توان تصفیه کلیه‌ها، معمولاً از طریق eGFR، استفاده می‌شود.",
      "high": "بالا: کاهش تصفیه کلیه، کم‌آبی، دارو یا آسیب عضله.",
      "low": "پایین: توده عضلانی کم یا بارداری.",
      "factors": "توده عضلانی، ورزش، گوشت، آب بدن و دارو."
    }
  },
  "URIC ACID": {
    "en": {
      "title": "Uric acid",
      "what": "Purine-breakdown product removed by kidneys and gut.",
      "role": "Excess may lead to urate crystal formation and gout.",
      "high": "High: gout risk, reduced excretion, medicines or high cell turnover.",
      "low": "Low: less often important.",
      "factors": "Diet, alcohol, hydration, kidney function and medicines."
    },
    "fa": {
      "title": "اسیداوریک",
      "what": "محصول تجزیه پورین است و از کلیه و روده دفع می‌شود.",
      "role": "افزایش آن می‌تواند به تشکیل بلورهای اورات و بروز نقرس منجر شود.",
      "high": "بالا: خطر نقرس، کاهش دفع، داروها یا گردش سلولی زیاد.",
      "low": "پایین: کمتر اوقات مهم است.",
      "factors": "رژیم، الکل، آب بدن، کلیه و دارو."
    }
  },
  "CHOLESTEROL": {
    "en": {
      "title": "Total cholesterol",
      "what": "Total cholesterol carried in blood lipoproteins; part of cardiovascular risk assessment.",
      "role": "It helps assess cardiovascular risk and reflects cholesterol transport in blood.",
      "high": "High: may add to cardiovascular risk depending on LDL, HDL and overall risk.",
      "low": "Low: interpret in context.",
      "factors": "Genetics, diet, thyroid, diabetes and medicines."
    },
    "fa": {
      "title": "کلسترول تام",
      "what": "کلسترول حمل‌شده در لیپوپروتئین‌های خون؛ بخشی از ارزیابی خطر قلبی‌عروقی.",
      "role": "در ارزیابی خطر قلبی‌عروقی و بررسی وضعیت انتقال کلسترول کاربرد دارد.",
      "high": "بالا: بسته به LDL، HDL و خطر کلی می‌تواند خطر قلبی‌عروقی را افزایش دهد.",
      "low": "پایین: در زمینه بالینی تفسیر شود.",
      "factors": "ژنتیک، رژیم، تیروئید، دیابت و دارو."
    }
  },
  "TRIGLYCERIDES": {
    "en": {
      "title": "Triglycerides",
      "what": "Main circulating/storage form of fat used for energy.",
      "role": "They serve as an energy reserve; very high levels increase pancreatitis risk.",
      "high": "High: meals, poor glucose control, insulin resistance, alcohol; very high levels raise pancreatitis risk.",
      "low": "Low: usually not concerning alone.",
      "factors": "Fasting, recent meals, glucose, alcohol and medicines."
    },
    "fa": {
      "title": "تری‌گلیسرید",
      "what": "شکل اصلی چربی برای ذخیره و انتقال انرژی است.",
      "role": "ذخیره انرژی بدن هستند و افزایش بسیار زیاد آن‌ها خطر التهاب پانکراس را بالا می‌برد.",
      "high": "بالا: غذا، کنترل نامناسب قند، مقاومت به انسولین و الکل؛ افزایش بسیار زیاد خطر پانکراتیت دارد.",
      "low": "پایین: معمولاً به‌تنهایی نگران‌کننده نیست.",
      "factors": "ناشتایی، غذای اخیر، قند، الکل و دارو."
    }
  },
  "LDL": {
    "en": {
      "title": "LDL cholesterol",
      "what": "Carries cholesterol; can contribute to plaque in artery walls.",
      "role": "High LDL is associated with cholesterol buildup in artery walls and cardiovascular risk.",
      "high": "High: associated with higher atherosclerotic cardiovascular risk.",
      "low": "Low: often appropriate in high-risk people receiving treatment.",
      "factors": "Genetics, diet, thyroid, diabetes and lipid therapy."
    },
    "fa": {
      "title": "کلسترول LDL",
      "what": "کلسترول را حمل می‌کند و می‌تواند در تشکیل پلاک دیواره شریان نقش داشته باشد.",
      "role": "افزایش LDL با تجمع کلسترول در دیواره شریان‌ها و افزایش خطر قلبی‌عروقی ارتباط دارد.",
      "high": "بالا: با خطر بیشتر بیماری آترواسکلروتیک قلبی‌عروقی مرتبط است.",
      "low": "پایین: در افراد پرخطر تحت درمان اغلب مطلوب است.",
      "factors": "ژنتیک، رژیم، تیروئید، دیابت و درمان چربی."
    }
  },
  "HDL": {
    "en": {
      "title": "HDL cholesterol",
      "what": "Participates in reverse cholesterol transport; one part of lipid risk profile.",
      "role": "It participates in reverse cholesterol transport and cardiovascular-risk assessment.",
      "high": "High: often associated with lower risk, but raising HDL alone is not a treatment target.",
      "low": "Low: associated with metabolic risk.",
      "factors": "Exercise, smoking, genetics and triglycerides."
    },
    "fa": {
      "title": "کلسترول HDL",
      "what": "در انتقال معکوس کلسترول نقش دارد و بخشی از نمایه خطر چربی خون است.",
      "role": "در انتقال معکوس کلسترول و ارزیابی خطر قلبی‌عروقی نقش دارد.",
      "high": "بالا: اغلب با خطر کمتر همراه است، اما افزایش HDL به‌تنهایی هدف درمان نیست.",
      "low": "پایین: با خطر متابولیک همراه است.",
      "factors": "ورزش، سیگار، ژنتیک و تری‌گلیسرید."
    }
  },
  "LDL/HDL ATHEROGENIC FACTOR": {
    "en": {
      "title": "LDL/HDL ratio",
      "what": "Calculated ratio comparing LDL with HDL; not a stand-alone diagnosis.",
      "role": "It provides a derived view of the lipid profile and must be interpreted with other risk factors.",
      "high": "Higher ratio: may reflect a less favourable lipid pattern.",
      "low": "Lower ratio: does not remove cardiovascular risk.",
      "factors": "Both component values and overall risk are needed."
    },
    "fa": {
      "title": "نسبت LDL به HDL",
      "what": "نسبت محاسباتی LDL به HDL؛ به‌تنهایی تشخیص‌دهنده نیست.",
      "role": "نمایی محاسباتی از پروفایل چربی ارائه می‌دهد و باید همراه سایر عوامل خطر تفسیر شود.",
      "high": "نسبت بالاتر: ممکن است الگوی نامطلوب‌تر چربی را نشان دهد.",
      "low": "نسبت پایین‌تر: خطر قلبی‌عروقی را حذف نمی‌کند.",
      "factors": "هر دو مقدار و خطر کلی فرد لازم‌اند."
    }
  },
  "TOTAL BILIRUBIN": {
    "en": {
      "title": "Total bilirubin",
      "what": "Yellow pigment formed during red-cell breakdown and processed by liver.",
      "role": "It helps assess heme breakdown, liver processing, and bile flow.",
      "high": "High: haemolysis, liver injury or bile obstruction.",
      "low": "Low: usually not significant.",
      "factors": "Fasting, medicines, inherited traits and liver status."
    },
    "fa": {
      "title": "بیلی‌روبین کل",
      "what": "رنگدانه زرد حاصل از تجزیه گلبول قرمز که در کبد پردازش می‌شود.",
      "role": "برای بررسی تجزیه هِم، پردازش کبدی و جریان صفرا کاربرد دارد.",
      "high": "بالا: همولیز، آسیب کبد یا انسداد صفرا.",
      "low": "پایین: معمولاً مهم نیست.",
      "factors": "ناشتایی، دارو، ویژگی ارثی و وضعیت کبد."
    }
  },
  "DIRECT BILIRUBIN": {
    "en": {
      "title": "Direct bilirubin",
      "what": "Conjugated, water-soluble bilirubin processed by liver for bile excretion.",
      "role": "It helps evaluate bilirubin excretion and possible bile-flow problems.",
      "high": "High: impaired liver excretion or bile-flow obstruction.",
      "low": "Low: expected/usually not meaningful.",
      "factors": "Interpret with total bilirubin, ALT, AST and ALP."
    },
    "fa": {
      "title": "بیلی‌روبین مستقیم",
      "what": "بیلی‌روبین کونژوگه و محلول در آب که کبد برای دفع صفراوی پردازش می‌کند.",
      "role": "به بررسی دفع بیلی‌روبین و احتمال اختلال در جریان صفرا کمک می‌کند.",
      "high": "بالا: اختلال دفع کبدی یا انسداد جریان صفرا.",
      "low": "پایین: معمولاً طبیعی و بی‌اهمیت.",
      "factors": "همراه بیلی‌روبین کل، ALT، AST و ALP تفسیر شود."
    }
  },
  "SGOT AST": {
    "en": {
      "title": "AST / SGOT",
      "what": "Enzyme in liver, muscle, heart and other tissues; not liver-specific.",
      "role": "It helps identify possible cell injury but is not specific to the liver.",
      "high": "High: liver or muscle injury, strenuous exercise or sample haemolysis.",
      "low": "Low: usually not important.",
      "factors": "Exercise, muscle injury, alcohol, medicines and haemolysis."
    },
    "fa": {
      "title": "آنزیم AST",
      "what": "آنزیمی در کبد، عضله، قلب و بافت‌های دیگر؛ اختصاصی کبد نیست.",
      "role": "به شناسایی آسیب احتمالی سلولی کمک می‌کند، اما اختصاصی کبد نیست.",
      "high": "بالا: آسیب کبد یا عضله، ورزش سنگین یا همولیز نمونه.",
      "low": "پایین: معمولاً مهم نیست.",
      "factors": "ورزش، آسیب عضله، الکل، دارو و همولیز."
    }
  },
  "SGPT ALT": {
    "en": {
      "title": "ALT / SGPT",
      "what": "Enzyme found mainly in liver cells; a marker of liver-cell injury.",
      "role": "It is commonly used to assess possible liver-cell injury.",
      "high": "High: fatty liver, hepatitis, medicines or other liver injury.",
      "low": "Low: usually not concerning.",
      "factors": "Metabolic health, medicines, alcohol and illness."
    },
    "fa": {
      "title": "آنزیم ALT",
      "what": "آنزیمی عمدتاً در سلول‌های کبدی؛ نشانگر آسیب سلول کبد.",
      "role": "معمولاً برای بررسی آسیب احتمالی سلول‌های کبدی استفاده می‌شود.",
      "high": "بالا: کبد چرب، هپاتیت، دارو یا آسیب دیگر کبد.",
      "low": "پایین: معمولاً نگران‌کننده نیست.",
      "factors": "سلامت متابولیک، دارو، الکل و بیماری."
    }
  },
  "FIB-4": {
    "en": {
      "title": "FIB-4 fibrosis risk score",
      "what": "Calculated from age, AST, ALT and platelets to estimate advanced liver fibrosis risk; not a diagnosis.",
      "role": "It estimates the likelihood of advanced liver fibrosis and is a screening aid, not a diagnosis.",
      "high": "Higher score: may warrant further assessment; age-specific interpretation is needed.",
      "low": "Lower score: lowers likelihood but does not exclude all liver disease.",
      "factors": "Age, acute enzyme changes and platelet disorders."
    },
    "fa": {
      "title": "امتیاز خطر فیبروز FIB-4",
      "what": "با سن، AST، ALT و پلاکت محاسبه می‌شود تا احتمال فیبروز پیشرفته کبد را برآورد کند؛ تشخیص قطعی نیست.",
      "role": "احتمال فیبروز پیشرفته کبد را برآورد می‌کند و ابزار غربالگری است، نه تشخیص قطعی.",
      "high": "امتیاز بالاتر: ممکن است بررسی بیشتر لازم باشد؛ تفسیر وابسته به سن است.",
      "low": "پایین‌تر: احتمال را کم می‌کند اما همه بیماری‌های کبدی را رد نمی‌کند.",
      "factors": "سن، تغییر حاد آنزیم‌ها و اختلال پلاکت."
    }
  },
  "ALKALINE PHOSPHATASE": {
    "en": {
      "title": "Alkaline phosphatase (ALP)",
      "what": "Enzyme mainly from bile ducts and bone; relates to bile flow and bone turnover.",
      "role": "It helps assess bile-duct conditions and bone activity.",
      "high": "High: bile-duct disease, bone growth/turnover or pregnancy.",
      "low": "Low: uncommon; may occur with deficiencies or malnutrition.",
      "factors": "Age, pregnancy, bone status and GGT/liver tests."
    },
    "fa": {
      "title": "آلکالین فسفاتاز",
      "what": "آنزیمی عمدتاً از مجاری صفراوی و استخوان؛ مرتبط با جریان صفرا و گردش استخوان.",
      "role": "برای ارزیابی وضعیت مجاری صفراوی و فعالیت استخوان کاربرد دارد.",
      "high": "بالا: بیماری مجاری صفراوی، رشد/گردش استخوان یا بارداری.",
      "low": "پایین: غیرشایع؛ گاهی کمبودها یا سوءتغذیه.",
      "factors": "سن، بارداری، وضعیت استخوان و GGT/آزمایش کبد."
    }
  },
  "ALBUMIN": {
    "en": {
      "title": "Albumin",
      "what": "Major liver-made blood protein; maintains fluid balance and transports substances.",
      "role": "It maintains oncotic pressure and transports hormones, drugs, and fatty acids.",
      "high": "High: usually dehydration.",
      "low": "Low: inflammation, liver disease, kidney protein loss or poor nutrition.",
      "factors": "Hydration, inflammation, liver/kidney function and nutrition."
    },
    "fa": {
      "title": "آلبومین",
      "what": "پروتئین اصلی ساخته کبد؛ تعادل مایعات را حفظ و مواد را حمل می‌کند.",
      "role": "فشار اونکوتیک خون را حفظ می‌کند و هورمون‌ها، داروها و اسیدهای چرب را حمل می‌کند.",
      "high": "بالا: معمولاً کم‌آبی.",
      "low": "پایین: التهاب، بیماری کبد، دفع پروتئین کلیوی یا تغذیه نامناسب.",
      "factors": "آب بدن، التهاب، عملکرد کبد و کلیه و تغذیه."
    }
  },
  "SERUM IRON": {
    "en": {
      "title": "Serum iron",
      "what": "Iron circulating in blood, mostly bound to transferrin; needed for haemoglobin.",
      "role": "Iron is essential for hemoglobin production and many enzymes.",
      "high": "High: iron overload, recent intake or some liver/blood conditions.",
      "low": "Low: iron deficiency or inflammation.",
      "factors": "Time of day, meals, supplements; review ferritin and TIBC."
    },
    "fa": {
      "title": "آهن سرم",
      "what": "آهن در گردش خون، عمدتاً متصل به ترانسفرین؛ برای ساخت هموگلوبین لازم است.",
      "role": "آهن برای تولید هموگلوبین و عملکرد بسیاری از آنزیم‌ها ضروری است.",
      "high": "بالا: اضافه‌بار آهن، مصرف اخیر یا برخی بیماری‌های کبد و خون.",
      "low": "پایین: کمبود آهن یا التهاب.",
      "factors": "زمان روز، غذا و مکمل؛ فریتین و TIBC هم بررسی شوند."
    }
  },
  "IRON BINDING CAPACITY": {
    "en": {
      "title": "Total iron-binding capacity (TIBC)",
      "what": "Estimates transferrin capacity to bind iron; interpreted with serum iron and ferritin.",
      "role": "Together with serum iron and ferritin, it helps evaluate iron deficiency or overload.",
      "high": "High: often iron deficiency.",
      "low": "Low: inflammation, malnutrition or reduced transferrin production.",
      "factors": "Ferritin, inflammation and liver status."
    },
    "fa": {
      "title": "ظرفیت اتصال آهن",
      "what": "ظرفیت ترانسفرین برای اتصال آهن را برآورد می‌کند؛ همراه آهن سرم و فریتین تفسیر می‌شود.",
      "role": "همراه آهن سرم و فریتین به بررسی کمبود یا اضافه‌بار آهن کمک می‌کند.",
      "high": "بالا: اغلب کمبود آهن.",
      "low": "پایین: التهاب، سوءتغذیه یا کاهش تولید ترانسفرین.",
      "factors": "فریتین، التهاب و وضعیت کبد."
    }
  },
  "CALCIUM": {
    "en": {
      "title": "Calcium",
      "what": "Supports bones, muscle contraction, nerve signals and clotting.",
      "role": "It supports bone structure, muscle contraction, nerve signaling, and clotting.",
      "high": "High: parathyroid disorders, some cancers, medicines or dehydration.",
      "low": "Low: vitamin D/PTH problems, kidney disease or low magnesium.",
      "factors": "Albumin affects total calcium; ionized/corrected calcium may be needed."
    },
    "fa": {
      "title": "کلسیم",
      "what": "برای استخوان، انقباض عضله، پیام عصبی و انعقاد لازم است.",
      "role": "در استحکام استخوان، انقباض عضلات، پیام‌رسانی عصبی و انعقاد خون نقش دارد.",
      "high": "بالا: اختلال پاراتیروئید، برخی سرطان‌ها، دارو یا کم‌آبی.",
      "low": "پایین: مشکلات ویتامین D/PTH، کلیه یا منیزیم پایین.",
      "factors": "آلبومین بر کلسیم کل اثر دارد؛ گاهی کلسیم یونیزه/تصحیح‌شده لازم است."
    }
  },
  "PHOSPHOR": {
    "en": {
      "title": "Phosphate / phosphorus",
      "what": "Needed for bones, ATP energy, cell membranes and acid-base balance.",
      "role": "It is essential for ATP energy transfer, cell membranes, and bone mineralization.",
      "high": "High: kidney impairment or cell breakdown.",
      "low": "Low: poor intake, vitamin D issues or hormonal shifts.",
      "factors": "Kidney function, calcium, vitamin D and PTH."
    },
    "fa": {
      "title": "فسفات",
      "what": "برای استخوان، انرژی ATP، غشای سلول و تعادل اسید و باز لازم است.",
      "role": "برای انتقال انرژی در ATP، ساخت غشای سلولی و معدنی‌شدن استخوان ضروری است.",
      "high": "بالا: اختلال کلیه یا تخریب سلولی.",
      "low": "پایین: دریافت ناکافی، مشکل ویتامین D یا تغییر هورمونی.",
      "factors": "عملکرد کلیه، کلسیم، ویتامین D و PTH."
    }
  },
  "SODIUM": {
    "en": {
      "title": "Sodium",
      "what": "Main extracellular electrolyte; regulates water balance and nerve/muscle function.",
      "role": "It regulates fluid balance and supports nerve and muscle function.",
      "high": "High: often water deficit.",
      "low": "Low: excess water relative to sodium, medicines or hormonal/organ conditions.",
      "factors": "Hydration, glucose, kidney/adrenal function and medicines."
    },
    "fa": {
      "title": "سدیم",
      "what": "الکترولیت اصلی خارج سلول؛ تنظیم آب و عملکرد عصب و عضله.",
      "role": "به تنظیم تعادل مایعات و عملکرد اعصاب و عضلات کمک می‌کند.",
      "high": "بالا: اغلب کمبود آب.",
      "low": "پایین: آب اضافی نسبت به سدیم، دارو یا اختلال هورمونی/اندامی.",
      "factors": "آب بدن، قند، عملکرد کلیه/فوق‌کلیه و دارو."
    }
  },
  "POTASSIUM": {
    "en": {
      "title": "Potassium",
      "what": "Key intracellular electrolyte for nerve, muscle and heart electrical activity.",
      "role": "It is essential for heart rhythm, nerve signals, and muscle contraction.",
      "high": "High: kidney impairment, medicines, tissue breakdown or haemolysis.",
      "low": "Low: vomiting, diarrhoea, diuretics or low intake.",
      "factors": "Kidney function, medicines, acid-base state and sample quality."
    },
    "fa": {
      "title": "پتاسیم",
      "what": "الکترولیت اصلی داخل سلول برای فعالیت الکتریکی عصب، عضله و قلب.",
      "role": "برای ریتم قلب، پیام‌های عصبی و انقباض عضلات ضروری است.",
      "high": "بالا: اختلال کلیه، دارو، تخریب بافت یا همولیز.",
      "low": "پایین: استفراغ، اسهال، ادرارآور یا دریافت کم.",
      "factors": "کلیه، دارو، تعادل اسید و باز و کیفیت نمونه."
    }
  },
  "ZINC": {
    "en": {
      "title": "Zinc",
      "what": "Supports immunity, wound healing, DNA/protein synthesis, taste and smell.",
      "role": "It supports immunity, wound healing, DNA synthesis, and taste and smell.",
      "high": "High: excessive supplements; can disturb copper balance.",
      "low": "Low: poor intake, malabsorption or inflammation.",
      "factors": "Meals, supplements, inflammation and sample collection."
    },
    "fa": {
      "title": "روی",
      "what": "از ایمنی، ترمیم زخم، ساخت DNA/پروتئین و چشایی و بویایی پشتیبانی می‌کند.",
      "role": "از ایمنی بدن، ترمیم زخم، ساخت DNA و حس چشایی و بویایی پشتیبانی می‌کند.",
      "high": "بالا: مکمل بیش از حد؛ ممکن است تعادل مس را مختل کند.",
      "low": "پایین: دریافت کم، سوءجذب یا التهاب.",
      "factors": "غذا، مکمل، التهاب و نمونه‌گیری."
    }
  },
  "LDH SERUM": {
    "en": {
      "title": "Lactate dehydrogenase (LDH)",
      "what": "Enzyme in many tissues; blood levels are a nonspecific marker of cell injury/turnover.",
      "role": "Raised levels can indicate cell damage but are nonspecific.",
      "high": "High: haemolysis, liver/muscle injury, infection and many other causes.",
      "low": "Low: usually not important.",
      "factors": "Sample haemolysis can raise it markedly."
    },
    "fa": {
      "title": "آنزیم LDH",
      "what": "آنزیمی در بافت‌های متعدد؛ افزایش خون آن شاخص غیراختصاصی آسیب یا گردش سلولی است.",
      "role": "افزایش آن می‌تواند نشانه آسیب سلولی باشد، اما اختصاصی نیست.",
      "high": "بالا: همولیز، آسیب کبد/عضله، عفونت و علل متعدد.",
      "low": "پایین: معمولاً مهم نیست.",
      "factors": "همولیز نمونه می‌تواند آن را به‌شدت بالا ببرد."
    }
  },
  "HEMOGLOBIN A1C": {
    "en": {
      "title": "Hemoglobin A1c (HbA1c)",
      "what": "Percentage of haemoglobin with attached glucose; reflects average glucose over about 2–3 months.",
      "role": "It estimates average glucose over roughly 2–3 months and helps monitor diabetes; it does not show daily glucose fluctuations.",
      "high": "High: higher average glucose over time.",
      "low": "Low: lower average or shortened red-cell lifespan; does not show daily lows/variability.",
      "factors": "Anaemia, variants, kidney disease, transfusion and altered red-cell turnover. In type 1 diabetes pair with CGM/time-in-range."
    },
    "fa": {
      "title": "هموگلوبین A1c",
      "what": "درصد هموگلوبین متصل به گلوکز؛ میانگین قند حدود ۲ تا ۳ ماه را بازتاب می‌دهد.",
      "role": "میانگین تقریبی قند خون در ۲ تا ۳ ماه گذشته را نشان می‌دهد و برای پایش دیابت کاربرد دارد؛ نوسان روزانه قند را نشان نمی‌دهد.",
      "high": "بالا: میانگین قند بیشتر در طول زمان.",
      "low": "پایین: میانگین کمتر یا کوتاه‌شدن عمر گلبول قرمز؛ افت‌ها و نوسان روزانه را نشان نمی‌دهد.",
      "factors": "کم‌خونی، انواع هموگلوبین، بیماری کلیه، انتقال خون و تغییر عمر گلبول قرمز. در دیابت نوع ۱ همراه CGM و زمان در محدوده بررسی شود."
    }
  },
  "EAG ESTIMATED AVERAGE GLUCOSE": {
    "en": {
      "title": "Estimated average glucose (eAG)",
      "what": "HbA1c-derived estimate expressed in glucose units; not a direct glucose reading.",
      "role": "It translates HbA1c into familiar glucose units; it is not a separate glucose test.",
      "high": "High/low: mirrors the HbA1c-derived average; cannot show glucose swings or hypoglycaemia frequency.",
      "low": "",
      "factors": "Inherits HbA1c limitations; CGM metrics add context."
    },
    "fa": {
      "title": "میانگین تخمینی قند خون",
      "what": "برآوردی بر پایه HbA1c با واحد قند خون؛ اندازه‌گیری مستقیم قند نیست.",
      "role": "HbA1c را به واحدهای آشناتر قند خون تبدیل می‌کند و آزمایش مستقل قند نیست.",
      "high": "بالا/پایین: بازتاب میانگین برآوردشده از HbA1c است؛ نوسان یا دفعات افت قند را نشان نمی‌دهد.",
      "low": "",
      "factors": "محدودیت‌های HbA1c را دارد؛ شاخص‌های CGM اطلاعات تکمیلی می‌دهند."
    }
  },
  "FERRITIN": {
    "en": {
      "title": "Ferritin",
      "what": "Protein that stores iron; commonly reflects body iron stores.",
      "role": "Blood ferritin is used to estimate iron stores but can also rise with inflammation.",
      "high": "High: inflammation, liver/metabolic disease or iron overload.",
      "low": "Low: depleted iron stores, sometimes before anaemia.",
      "factors": "Inflammation raises ferritin; interpret with CRP and iron studies."
    },
    "fa": {
      "title": "فریتین",
      "what": "پروتئین ذخیره‌کننده آهن؛ معمولاً بازتاب ذخایر آهن بدن است.",
      "role": "فریتین خون برای برآورد ذخایر آهن استفاده می‌شود، اما در التهاب نیز ممکن است افزایش یابد.",
      "high": "بالا: التهاب، بیماری کبدی/متابولیک یا اضافه‌بار آهن.",
      "low": "پایین: کاهش ذخایر آهن، گاهی پیش از کم‌خونی.",
      "factors": "التهاب فریتین را بالا می‌برد؛ همراه CRP و آزمایش آهن تفسیر شود."
    }
  },
  "FOLIC ACID": {
    "en": {
      "title": "Folate / folic acid",
      "what": "B vitamin required for DNA synthesis, cell division and red-cell production.",
      "role": "It is needed for DNA synthesis and normal red-cell production.",
      "high": "High: commonly supplementation.",
      "low": "Low: can cause megaloblastic anaemia; poor intake or malabsorption are causes.",
      "factors": "Recent supplements/food; check B12 before treating deficiency."
    },
    "fa": {
      "title": "فولات / اسید فولیک",
      "what": "ویتامین B لازم برای ساخت DNA، تقسیم سلولی و تولید گلبول قرمز.",
      "role": "برای ساخت DNA و تولید طبیعی گلبول‌های قرمز لازم است.",
      "high": "بالا: معمولاً مکمل.",
      "low": "پایین: می‌تواند کم‌خونی مگالوبلاستیک ایجاد کند؛ تغذیه نامناسب یا سوءجذب از علت‌هاست.",
      "factors": "مکمل/غذای اخیر؛ پیش از درمان کمبود، B12 هم بررسی شود."
    }
  },
  "VITAMIN D TOTAL25-OH": {
    "en": {
      "title": "25-hydroxy vitamin D",
      "what": "Standard blood marker of vitamin D status; supports calcium absorption and bone/muscle health.",
      "role": "It regulates calcium and phosphate absorption and supports bone and muscle health.",
      "high": "High: usually excessive supplementation and may raise calcium.",
      "low": "Low: limited sun, low intake, malabsorption or organ disease.",
      "factors": "Season, sun exposure, diet, supplements and body composition."
    },
    "fa": {
      "title": "ویتامین D (25-OH)",
      "what": "شاخص استاندارد وضعیت ویتامین D؛ به جذب کلسیم و سلامت استخوان و عضله کمک می‌کند.",
      "role": "جذب کلسیم و فسفات را تنظیم می‌کند و برای سلامت استخوان و عضله اهمیت دارد.",
      "high": "بالا: معمولاً مکمل بیش از حد و احتمال افزایش کلسیم.",
      "low": "پایین: آفتاب یا دریافت کم، سوءجذب یا بیماری اندام‌ها.",
      "factors": "فصل، آفتاب، رژیم، مکمل و ترکیب بدن."
    }
  },
  "CRP QUANTITATIVE": {
    "en": {
      "title": "C-reactive protein (CRP)",
      "what": "Liver-made nonspecific marker that rises with inflammation.",
      "role": "It helps monitor inflammation but does not identify its cause.",
      "high": "High: infection, inflammation or tissue injury; does not identify cause.",
      "low": "Low: little systemic inflammation at sampling.",
      "factors": "Recent illness, injury, exercise and smoking; standard CRP differs from hs-CRP."
    },
    "fa": {
      "title": "پروتئین واکنشی C",
      "what": "شاخص غیراختصاصی ساخته کبد که در التهاب افزایش می‌یابد.",
      "role": "به پایش التهاب کمک می‌کند، اما علت التهاب را مشخص نمی‌کند.",
      "high": "بالا: عفونت، التهاب یا آسیب بافتی؛ علت را مشخص نمی‌کند.",
      "low": "پایین: التهاب سیستمیک کم در زمان نمونه‌گیری.",
      "factors": "بیماری، آسیب، ورزش و سیگار؛ CRP معمولی با hs-CRP فرق دارد."
    }
  },
  "FSH": {
    "en": {
      "title": "Follicle-stimulating hormone",
      "what": "Pituitary hormone supporting ovarian follicles or sperm production.",
      "role": "In men it supports sperm production through its action on the testes.",
      "high": "High: menopause or reduced gonadal function.",
      "low": "Low: pituitary/hypothalamic suppression.",
      "factors": "Sex, age, cycle phase, medicines and related hormones."
    },
    "fa": {
      "title": "هورمون FSH",
      "what": "هورمون هیپوفیزی مؤثر در رشد فولیکول تخمدان یا تولید اسپرم.",
      "role": "در مردان از طریق اثر بر بیضه‌ها به تولید اسپرم کمک می‌کند.",
      "high": "بالا: یائسگی یا کاهش عملکرد غدد جنسی.",
      "low": "پایین: سرکوب هیپوفیز/هیپوتالاموس.",
      "factors": "جنس، سن، مرحله چرخه، دارو و هورمون‌های مرتبط."
    }
  },
  "LH": {
    "en": {
      "title": "Luteinizing hormone",
      "what": "Pituitary hormone; triggers ovulation and stimulates testosterone production.",
      "role": "In men it stimulates Leydig cells in the testes to produce testosterone.",
      "high": "High: menopause or primary gonadal dysfunction.",
      "low": "Low: pituitary/hypothalamic causes.",
      "factors": "Sex, age, cycle timing, medicines and FSH/testosterone."
    },
    "fa": {
      "title": "هورمون LH",
      "what": "هورمون هیپوفیزی؛ تخمک‌گذاری و تولید تستوسترون را تحریک می‌کند.",
      "role": "در مردان سلول‌های لیدیگ بیضه را برای تولید تستوسترون تحریک می‌کند.",
      "high": "بالا: یائسگی یا اختلال اولیه غدد جنسی.",
      "low": "پایین: علل هیپوفیزی/هیپوتالاموسی.",
      "factors": "جنس، سن، زمان چرخه، دارو و FSH/تستوسترون."
    }
  },
  "TESTOSTERONE": {
    "en": {
      "title": "Total testosterone",
      "what": "Total circulating testosterone, both protein-bound and free; supports reproductive, muscle, bone and red-cell functions.",
      "role": "It contributes to libido, reproductive function, muscle and bone maintenance, and red-cell production.",
      "high": "High: therapy, supplements or endocrine conditions.",
      "low": "Low: gonadal/pituitary issues, illness, obesity or medicines.",
      "factors": "Morning timing, sleep, illness, SHBG and medicines."
    },
    "fa": {
      "title": "تستوسترون کل",
      "what": "مجموع تستوسترون خون، آزاد و متصل به پروتئین؛ مؤثر در تولیدمثل، عضله، استخوان و گلبول قرمز.",
      "role": "در میل و عملکرد جنسی، حفظ عضله و استخوان و تولید گلبول قرمز نقش دارد.",
      "high": "بالا: درمان، مکمل یا اختلال غدد.",
      "low": "پایین: مشکلات غدد جنسی/هیپوفیز، بیماری، چاقی یا دارو.",
      "factors": "زمان صبح، خواب، بیماری، SHBG و دارو."
    }
  },
  "FREE TESTOSTERONE": {
    "en": {
      "title": "Free testosterone",
      "what": "Fraction not bound to blood proteins; interpret with total testosterone and SHBG.",
      "role": "It is available to enter tissues; interpretation may require SHBG and albumin.",
      "high": "High: androgen therapy or endocrine conditions.",
      "low": "Low: reduced production or altered binding proteins.",
      "factors": "Assay method matters; direct and calculated values are not interchangeable."
    },
    "fa": {
      "title": "تستوسترون آزاد",
      "what": "بخش متصل‌نشده به پروتئین‌های خون؛ همراه تستوسترون کل و SHBG تفسیر شود.",
      "role": "قابلیت ورود به بافت‌ها را دارد و تفسیر آن ممکن است به SHBG و آلبومین نیاز داشته باشد.",
      "high": "بالا: درمان آندروژنی یا اختلال غدد.",
      "low": "پایین: کاهش تولید یا تغییر پروتئین‌های حامل.",
      "factors": "روش سنجش مهم است؛ مقدار مستقیم و محاسبه‌شده قابل جایگزینی نیستند."
    }
  },
  "T3": {
    "en": {
      "title": "Triiodothyronine (T3)",
      "what": "Active thyroid hormone affecting metabolism, heart function and temperature.",
      "role": "It regulates metabolic activity, heat production, heart function, and development.",
      "high": "High: hyperthyroidism or excess thyroid medicine.",
      "low": "Low: hypothyroidism or significant non-thyroid illness.",
      "factors": "Determine free vs total; illness and medicines affect it."
    },
    "fa": {
      "title": "تری‌یودوتیرونین (T3)",
      "what": "هورمون فعال تیروئید مؤثر بر سوخت‌وساز، قلب و تنظیم دما.",
      "role": "فعالیت متابولیک، تولید گرما، عملکرد قلب و رشد را تنظیم می‌کند.",
      "high": "بالا: پرکاری تیروئید یا داروی زیاد.",
      "low": "پایین: کم‌کاری تیروئید یا بیماری شدید غیرتیروئیدی.",
      "factors": "مشخص شود آزاد است یا کل؛ بیماری و دارو مؤثرند."
    }
  },
  "T4": {
    "en": {
      "title": "Thyroxine (T4)",
      "what": "Main hormone released by thyroid; converted to active T3 in tissues.",
      "role": "It acts as a circulating reserve that can be converted into active T3.",
      "high": "High free T4: hyperthyroidism or excess replacement.",
      "low": "Low free T4: hypothyroidism or pituitary disease.",
      "factors": "Free vs total, binding proteins, pregnancy and medicines."
    },
    "fa": {
      "title": "تیروکسین (T4)",
      "what": "هورمون اصلی ترشحی تیروئید؛ در بافت‌ها به T3 فعال تبدیل می‌شود.",
      "role": "به‌عنوان ذخیره هورمونی در گردش خون عمل می‌کند و می‌تواند به T3 فعال تبدیل شود.",
      "high": "T4 آزاد بالا: پرکاری یا دوز جایگزین زیاد.",
      "low": "T4 آزاد پایین: کم‌کاری یا بیماری هیپوفیز.",
      "factors": "آزاد یا کل بودن، پروتئین حامل، بارداری و دارو."
    }
  },
  "TSH": {
    "en": {
      "title": "Thyroid-stimulating hormone",
      "what": "Pituitary signal controlling thyroid hormone production; key for monitoring hypothyroidism treatment.",
      "role": "It stimulates the thyroid gland to produce and release T3 and T4.",
      "high": "High: often underactive thyroid, depending on free T4.",
      "low": "Low: overactive thyroid, excess levothyroxine or pituitary causes.",
      "factors": "Levothyroxine timing, missed doses, iron/calcium supplements, illness and pregnancy."
    },
    "fa": {
      "title": "هورمون محرک تیروئید (TSH)",
      "what": "پیام هیپوفیز برای تنظیم تولید هورمون تیروئید؛ برای پایش درمان کم‌کاری مهم است.",
      "role": "غده تیروئید را برای تولید و ترشح T3 و T4 تحریک می‌کند.",
      "high": "بالا: اغلب کم‌کاری تیروئید، بسته به T4 آزاد.",
      "low": "پایین: پرکاری، لووتیروکسین بیش از حد یا علل هیپوفیزی.",
      "factors": "زمان لووتیروکسین، فراموشی دوز، مکمل آهن/کلسیم، بیماری و بارداری."
    }
  },
  "WBC HPF": {
    "en": {
      "title": "Urine white blood cells per HPF",
      "what": "White cells in urine microscopy can indicate urinary inflammation/infection.",
      "role": "It supports evaluation of urinary inflammation or infection.",
      "high": "High: UTI, stones or contamination.",
      "low": "Few/none: commonly expected.",
      "factors": "Clean-catch collection, menstruation, symptoms and culture."
    },
    "fa": {
      "title": "گلبول سفید ادرار در میدان بزرگ",
      "what": "گلبول سفید در میکروسکوپی ادرار می‌تواند التهاب یا عفونت ادراری را مطرح کند.",
      "role": "در بررسی التهاب یا عفونت مجاری ادراری کمک‌کننده است.",
      "high": "بالا: عفونت ادراری، سنگ یا آلودگی نمونه.",
      "low": "کم/عدم وجود: معمولاً طبیعی.",
      "factors": "جمع‌آوری صحیح، قاعدگی، علائم و کشت."
    }
  },
  "RBC HPF": {
    "en": {
      "title": "Urine red blood cells per HPF",
      "what": "Red cells in urine can indicate bleeding in the urinary tract or kidney.",
      "role": "It helps identify microscopic blood and investigate possible urinary or kidney causes.",
      "high": "High: stones, infection, exercise, kidney disease or contamination.",
      "low": "Few/none: commonly expected.",
      "factors": "Menstruation, exercise, collection method and repeat sample."
    },
    "fa": {
      "title": "گلبول قرمز ادرار در میدان بزرگ",
      "what": "گلبول قرمز ادرار می‌تواند خون‌ریزی در کلیه یا مجاری ادراری را مطرح کند.",
      "role": "وجود خون میکروسکوپی را مشخص می‌کند و به بررسی علل ادراری یا کلیوی کمک می‌کند.",
      "high": "بالا: سنگ، عفونت، ورزش، بیماری کلیه یا آلودگی.",
      "low": "کم/عدم وجود: معمولاً طبیعی.",
      "factors": "قاعدگی، ورزش، روش جمع‌آوری و تکرار نمونه."
    }
  },
  "EPITHELIAL CELLS HPF": {
    "en": {
      "title": "Urine epithelial cells",
      "what": "Cells shed from urinary tract lining; type and quantity matter.",
      "role": "Their type and amount help assess contamination or urinary-tract changes.",
      "high": "Many squamous cells: possible contamination. Renal tubular cells may indicate kidney injury.",
      "low": "",
      "factors": "Clean-catch technique and cell type."
    },
    "fa": {
      "title": "سلول‌های پوششی ادرار",
      "what": "سلول‌های ریخته‌شده از پوشش مجاری ادراری؛ نوع و تعداد مهم است.",
      "role": "نوع و تعداد آن‌ها به بررسی آلودگی نمونه یا تغییرات مجاری ادراری کمک می‌کند.",
      "high": "سلول سنگفرشی زیاد: احتمال آلودگی. سلول توبولی کلیه ممکن است آسیب کلیه را مطرح کند.",
      "low": "",
      "factors": "روش جمع‌آوری صحیح و نوع سلول."
    }
  },
  "SPECIFIC GRAVITY": {
    "en": {
      "title": "Urine specific gravity",
      "what": "Indicates urine concentration and gives clues about hydration and concentrating ability.",
      "role": "It indicates urine concentration and helps assess hydration and kidney concentrating ability.",
      "high": "High: dehydration, glucose or protein.",
      "low": "Low: high fluid intake or impaired concentration.",
      "factors": "Fluid intake, glucose, protein and collection time."
    },
    "fa": {
      "title": "وزن مخصوص ادرار",
      "what": "غلظت ادرار و سرنخی از آب بدن و توان تغلیظ کلیه را نشان می‌دهد.",
      "role": "غلظت ادرار را نشان می‌دهد و در ارزیابی آب بدن و توان تغلیظ کلیه کاربرد دارد.",
      "high": "بالا: کم‌آبی، گلوکز یا پروتئین.",
      "low": "پایین: مایعات زیاد یا اختلال تغلیظ.",
      "factors": "مایعات، گلوکز، پروتئین و زمان نمونه."
    }
  },
  "BACTERIA": {
    "en": {
      "title": "Urine bacteria",
      "what": "Bacteria may indicate infection but can enter through sample contamination.",
      "role": "They may indicate infection, but sample contamination is also possible.",
      "high": "Positive with symptoms, WBC or nitrite supports possible UTI; culture identifies organism.",
      "low": "",
      "factors": "Clean-catch collection and urine culture."
    },
    "fa": {
      "title": "باکتری ادرار",
      "what": "باکتری ممکن است عفونت را نشان دهد اما می‌تواند از آلودگی نمونه وارد شود.",
      "role": "ممکن است نشانه عفونت باشند، اما آلودگی نمونه نیز امکان‌پذیر است.",
      "high": "نتیجه مثبت همراه علائم، WBC یا نیتریت احتمال عفونت را تقویت می‌کند؛ کشت عامل را مشخص می‌کند.",
      "low": "",
      "factors": "جمع‌آوری صحیح و کشت ادرار."
    }
  },
  "MUCUS": {
    "en": {
      "title": "Urine mucus",
      "what": "Mucus threads can come from urinary/genital tract lining.",
      "role": "Small amounts are often nonspecific; larger amounts need interpretation with other findings.",
      "high": "Large amounts are nonspecific; irritation, inflammation or contamination may contribute.",
      "low": "",
      "factors": "Collection quality and other urine findings."
    },
    "fa": {
      "title": "موکوس ادرار",
      "what": "رشته‌های موکوس می‌توانند از پوشش مجاری ادراری/تناسلی منشأ بگیرند.",
      "role": "مقادیر کم آن اغلب غیراختصاصی است و مقدار زیاد باید همراه سایر یافته‌ها تفسیر شود.",
      "high": "مقدار زیاد غیراختصاصی است؛ تحریک، التهاب یا آلودگی ممکن است نقش داشته باشد.",
      "low": "",
      "factors": "کیفیت نمونه و سایر یافته‌های ادرار."
    }
  },
  "BILIRUBIN": {
    "en": {
      "title": "Urine bilirubin",
      "what": "Detects conjugated bilirubin that can pass into urine.",
      "role": "Its presence may indicate liver or bile-flow problems.",
      "high": "Positive: may occur with liver disease or bile obstruction.",
      "low": "Negative: expected.",
      "factors": "Fresh sample, light exposure and blood liver tests."
    },
    "fa": {
      "title": "بیلی‌روبین ادرار",
      "what": "بیلی‌روبین کونژوگه قابل دفع در ادرار را شناسایی می‌کند.",
      "role": "وجود آن ممکن است به مشکلات کبد یا جریان صفرا اشاره کند.",
      "high": "مثبت: ممکن است در بیماری کبد یا انسداد صفرا دیده شود.",
      "low": "منفی: نتیجه مورد انتظار.",
      "factors": "تازگی نمونه، نور و آزمایش‌های کبدی خون."
    }
  },
  "DYSMORPHIC RBC URINE": {
    "en": {
      "title": "Dysmorphic urine red cells",
      "what": "Abnormally shaped urinary red cells; some patterns suggest glomerular kidney bleeding.",
      "role": "They may suggest bleeding originating from kidney glomeruli.",
      "high": "Higher proportion may support glomerular source; expert microscopy is important.",
      "low": "",
      "factors": "Sample handling, microscopy method, proteinuria and kidney function."
    },
    "fa": {
      "title": "گلبول قرمز بدشکل ادرار",
      "what": "گلبول قرمز بدشکل در ادرار؛ برخی الگوها منشأ گلومرولی خون‌ریزی را مطرح می‌کنند.",
      "role": "ممکن است نشان‌دهنده منشأ گلومرولی خون‌ریزی کلیوی باشند.",
      "high": "درصد بیشتر می‌تواند منشأ گلومرولی را مطرح کند؛ میکروسکوپی تخصصی مهم است.",
      "low": "",
      "factors": "نگهداری نمونه، روش میکروسکوپی، پروتئین ادرار و عملکرد کلیه."
    }
  },
  "YEAST CELL": {
    "en": {
      "title": "Urine yeast cells",
      "what": "May represent contamination, colonization or, in selected cases, fungal infection.",
      "role": "They may reflect contamination or fungal presence and require clinical context.",
      "high": "More relevant with symptoms, diabetes, catheter or immune suppression; culture may be needed.",
      "low": "",
      "factors": "Collection, symptoms, catheter and culture."
    },
    "fa": {
      "title": "سلول مخمر ادرار",
      "what": "ممکن است آلودگی، کلونیزاسیون یا در موارد خاص عفونت قارچی باشد.",
      "role": "ممکن است ناشی از آلودگی نمونه یا حضور قارچ باشند و به بررسی بالینی نیاز دارند.",
      "high": "در علائم، دیابت، سوند یا سرکوب ایمنی مهم‌تر است؛ ممکن است کشت لازم باشد.",
      "low": "",
      "factors": "نمونه‌گیری، علائم، سوند و کشت."
    }
  },
  "CASTS LPF": {
    "en": {
      "title": "Urinary casts",
      "what": "Cylinder-shaped structures formed in kidney tubules; cast type helps localize disease.",
      "role": "Their type can provide clues about kidney-tubule or kidney-tissue conditions.",
      "high": "RBC/cellular casts can suggest kidney inflammation or injury; hyaline casts may follow exercise/dehydration.",
      "low": "",
      "factors": "Exact cast type, microscopy and kidney tests."
    },
    "fa": {
      "title": "کست‌های ادراری",
      "what": "ساختارهای استوانه‌ای تشکیل‌شده در لوله‌های کلیه؛ نوع کست به تعیین منشأ کمک می‌کند.",
      "role": "نوع آن‌ها می‌تواند درباره وضعیت توبول‌ها یا بافت کلیه سرنخ بدهد.",
      "high": "کست RBC/سلولی می‌تواند التهاب یا آسیب کلیه را مطرح کند؛ هیالین ممکن است پس از ورزش/کم‌آبی دیده شود.",
      "low": "",
      "factors": "نوع دقیق کست، میکروسکوپی و آزمایش کلیه."
    }
  },
  "URINE GLUCOSE": {
    "en": {
      "title": "Urine glucose",
      "what": "Glucose in urine appears when filtered glucose is not fully reabsorbed or with certain medicines.",
      "role": "It may occur when blood glucose exceeds kidney reabsorption capacity; it does not replace blood-glucose monitoring.",
      "high": "Positive may accompany high blood glucose but does not quantify it. SGLT2 medicines can cause positivity.",
      "low": "",
      "factors": "Use blood glucose/CGM for diabetes decisions; kidney threshold and medicines matter."
    },
    "fa": {
      "title": "گلوکز ادرار",
      "what": "گلوکز ادرار زمانی ظاهر می‌شود که بازجذب کامل نباشد یا برخی داروها مصرف شوند.",
      "role": "ممکن است وقتی قند خون از توان بازجذب کلیه بیشتر شود دیده شود؛ جایگزین پایش قند خون نیست.",
      "high": "مثبت ممکن است همراه قند خون بالا باشد اما مقدار قند را تعیین نمی‌کند؛ داروهای SGLT2 هم مثبت می‌کنند.",
      "low": "",
      "factors": "برای تصمیم دیابت از قند خون/CGM استفاده کن؛ آستانه کلیوی و دارو مهم‌اند."
    }
  },
  "UROBILINOGEN": {
    "en": {
      "title": "Urine urobilinogen",
      "what": "Bilirubin breakdown product formed in intestine; some is reabsorbed and excreted.",
      "role": "Urine levels can provide clues about liver function and red-cell breakdown.",
      "high": "High: increased red-cell breakdown or liver conditions.",
      "low": "Low/absent: may occur with blocked bile flow.",
      "factors": "Sample freshness, light, medicines and liver tests."
    },
    "fa": {
      "title": "اوروبیلینوژن ادرار",
      "what": "محصول تجزیه بیلی‌روبین در روده؛ بخشی بازجذب و دفع می‌شود.",
      "role": "مقدار آن در ادرار می‌تواند درباره عملکرد کبد و تجزیه گلبول قرمز سرنخ بدهد.",
      "high": "بالا: تخریب بیشتر گلبول قرمز یا بیماری کبد.",
      "low": "پایین/عدم وجود: ممکن است با انسداد صفرا باشد.",
      "factors": "تازگی نمونه، نور، دارو و آزمایش کبد."
    }
  },
  "CRYSTALS URINE": {
    "en": {
      "title": "Urine crystals",
      "what": "Crystal type reflects urine chemistry and sometimes stone risk.",
      "role": "Their type may help assess urine chemistry and kidney-stone risk.",
      "high": "Some types relate to stones/metabolic states; many can occur without disease.",
      "low": "",
      "factors": "Urine pH, hydration, diet, temperature and crystal type."
    },
    "fa": {
      "title": "کریستال‌های ادرار",
      "what": "نوع بلور بازتاب شیمی ادرار و گاهی خطر سنگ است.",
      "role": "نوع آن‌ها می‌تواند به ارزیابی ترکیب ادرار و خطر سنگ کلیه کمک کند.",
      "high": "برخی انواع با سنگ یا وضعیت متابولیک مرتبط‌اند؛ بسیاری بدون بیماری هم دیده می‌شوند.",
      "low": "",
      "factors": "pH ادرار، آب بدن، رژیم، دما و نوع بلور."
    }
  },
  "LEUKOCYTE ESTERASE": {
    "en": {
      "title": "Leukocyte esterase",
      "what": "Dipstick enzyme marker associated with white blood cells in urine.",
      "role": "A positive result supports possible urinary inflammation or infection but is not definitive alone.",
      "high": "Positive: urinary inflammation/infection or contamination.",
      "low": "Negative: lowers likelihood but does not exclude infection.",
      "factors": "Symptoms, microscopy, nitrite, culture and collection."
    },
    "fa": {
      "title": "لکوسیت‌استراز",
      "what": "نشانگر نواری آنزیم مرتبط با گلبول سفید در ادرار.",
      "role": "نتیجه مثبت احتمال التهاب یا عفونت ادراری را مطرح می‌کند، اما به‌تنهایی قطعی نیست.",
      "high": "مثبت: التهاب/عفونت ادراری یا آلودگی.",
      "low": "منفی: احتمال را کم می‌کند اما رد قطعی نیست.",
      "factors": "علائم، میکروسکوپی، نیتریت، کشت و نمونه‌گیری."
    }
  },
  "NITRITE": {
    "en": {
      "title": "Urine nitrite",
      "what": "Some urinary bacteria convert nitrate to nitrite; dipstick detects it.",
      "role": "A positive result supports possible bacterial UTI; a negative result does not rule it out.",
      "high": "Positive supports bacterial UTI.",
      "low": "Negative does not exclude UTI; not all bacteria produce nitrite.",
      "factors": "Bladder dwell time, bacteria type, diet and sample handling."
    },
    "fa": {
      "title": "نیتریت ادرار",
      "what": "برخی باکتری‌های ادرار نیترات را به نیتریت تبدیل می‌کنند و نوار آن را می‌سنجد.",
      "role": "نتیجه مثبت احتمال عفونت باکتریایی ادراری را تقویت می‌کند؛ نتیجه منفی آن را رد نمی‌کند.",
      "high": "مثبت احتمال عفونت باکتریایی را تقویت می‌کند.",
      "low": "منفی عفونت را رد نمی‌کند؛ همه باکتری‌ها نیتریت نمی‌سازند.",
      "factors": "مدت ماندن ادرار در مثانه، نوع باکتری، رژیم و نگهداری نمونه."
    }
  },
  "KETONE": {
    "en": {
      "title": "Urine ketones",
      "what": "Ketones form when the body uses fat for energy, such as fasting or low insulin availability.",
      "role": "They may occur with fasting, illness, low carbohydrate intake, or insufficient insulin. In type 1 diabetes, ketones with high glucose or illness can signal DKA risk. Follow your sick-day plan and seek urgent medical advice for concerning results or symptoms.",
      "high": "In type 1 diabetes, ketones with high glucose or illness may signal DKA risk; follow the sick-day plan and seek urgent help when indicated.",
      "low": "",
      "factors": "Fasting, vomiting, illness, exercise, carbohydrate and insulin. Blood ketones preferred if DKA suspected."
    },
    "fa": {
      "title": "کتون ادرار",
      "what": "کتون‌ها هنگام استفاده از چربی برای انرژی، مانند ناشتایی یا کمبود انسولین، ساخته می‌شوند.",
      "role": "کتون ممکن است در روزه‌داری، بیماری، مصرف کم کربوهیدرات یا کمبود انسولین دیده شود. در دیابت نوع ۱، همراهی کتون با قند بالا یا بیماری می‌تواند نشانه خطر کتواسیدوز باشد. طبق برنامه روزهای بیماری عمل کنید و در صورت نتیجه نگران‌کننده یا علائم هشدار، فوراً کمک پزشکی بگیرید.",
      "high": "در دیابت نوع ۱، کتون همراه قند بالا یا بیماری می‌تواند خطر DKA را مطرح کند؛ طبق برنامه روز بیماری اقدام و در صورت لزوم فوراً کمک پزشکی بگیر.",
      "low": "",
      "factors": "ناشتایی، استفراغ، بیماری، ورزش، کربوهیدرات و انسولین؛ در شک به DKA کتون خون ارجح است."
    }
  }
};
const ALIASES = {
  "NEUTROPHILS #": "NEUTROPHILS#",
  "LYMPHOCYTES #": "LYMPHOCYTES#",
  "MONOCYTES #": "MONOCYTES#",
  "EOSINOPHILS #": "EOSINOPHILS#",
  "BASOPHILS #": "BASOPHILS#",
  "HGB": "HEMOGLOBIN",
  "HB": "HEMOGLOBIN",
  "HCT": "HEMATOCRIT",
  "PLT": "PLATELETS",
  "AST": "SGOT AST",
  "SGOT AST": "SGOT AST",
  "ALT": "SGPT ALT",
  "SGPT ALT": "SGPT ALT",
  "ALP": "ALKALINE PHOSPHATASE",
  "TIBC": "IRON BINDING CAPACITY",
  "LDH": "LDH SERUM",
  "A1C": "HEMOGLOBIN A1C",
  "HBA1C": "HEMOGLOBIN A1C",
  "EAG": "EAG ESTIMATED AVERAGE GLUCOSE",
  "CRP": "CRP QUANTITATIVE",
  "PHOSPHORUS": "PHOSPHOR",
  "PHOSPHATE": "PHOSPHOR",
  "25 OH VITAMIN D": "VITAMIN D TOTAL25-OH",
  "VITAMIN D": "VITAMIN D TOTAL25-OH",
  "W B C HPF": "WBC HPF",
  "R B C HPF": "RBC HPF"
};

const normalize = value => String(value || '')
  .toUpperCase()
  .replace(/[()[\\].]/g, '')
  .replace(/%/g, '')
  .replace(/\\s+/g, ' ')
  .trim();

export function getLabInfo(name, language = 'en') {
  const key = normalize(name);
  const resolved = ALIASES[key] || key;
  const item = INFO[resolved];
  if (!item) return null;
  return item[language === 'fa' ? 'fa' : 'en'];
}

export const LAB_INFO_COUNT = Object.keys(INFO).length;
