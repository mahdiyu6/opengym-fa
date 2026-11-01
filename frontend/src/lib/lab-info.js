// Bilingual laboratory information
// what = scientific definition
// role = physiological function or clinical relevance

const ROWS = [
  ["WBC","گلبول‌های سفید","White blood cells are immune cells circulating in blood.","گلبول‌های سفید، سلول‌های دستگاه ایمنی هستند که در خون گردش می‌کنند.","They help recognize and respond to infections and inflammation.","در شناسایی و مقابله با عفونت‌ها و التهاب نقش دارند."],
  ["Neutrophils#","نوتروفیل مطلق","The absolute number of neutrophils in blood.","تعداد مطلق نوتروفیل‌ها در خون.","They provide rapid defense, especially against bacterial and fungal infections.","خط دفاعی سریع بدن، به‌ویژه در برابر عفونت‌های باکتریایی و قارچی هستند."],
  ["Lymphocytes#","لنفوسیت مطلق","The absolute number of lymphocytes in blood.","تعداد مطلق لنفوسیت‌ها در خون.","They coordinate adaptive immunity; B cells produce antibodies and T cells regulate cellular immunity.","ایمنی اختصاصی را هدایت می‌کنند؛ سلول‌های B پادتن می‌سازند و سلول‌های T ایمنی سلولی را تنظیم می‌کنند."],
  ["Monocytes#","مونوسیت مطلق","The absolute number of monocytes in blood.","تعداد مطلق مونوسیت‌ها در خون.","They can become macrophages in tissues and help remove microbes and damaged cells.","می‌توانند در بافت‌ها به ماکروفاژ تبدیل شوند و میکروب‌ها و سلول‌های آسیب‌دیده را پاک‌سازی کنند."],
  ["Eosinophils#","ائوزینوفیل مطلق","The absolute number of eosinophils in blood.","تعداد مطلق ائوزینوفیل‌ها در خون.","They participate in parasite defense and allergic inflammation.","در مقابله با انگل‌ها و واکنش‌های التهابی آلرژیک نقش دارند."],
  ["Basophils#","بازوفیل مطلق","The absolute number of basophils in blood.","تعداد مطلق بازوفیل‌ها در خون.","They release histamine and other mediators involved in allergic reactions.","با آزادسازی هیستامین و مواد دیگر در واکنش‌های آلرژیک مشارکت دارند."],
  ["Neutrophils","درصد نوتروفیل","The percentage of white blood cells that are neutrophils.","درصد نوتروفیل‌ها از کل گلبول‌های سفید.","It helps assess the distribution of innate immune cells.","برای ارزیابی سهم سلول‌های ایمنی ذاتی در ترکیب گلبول‌های سفید استفاده می‌شود."],
  ["Lymphocytes","درصد لنفوسیت","The percentage of white blood cells that are lymphocytes.","درصد لنفوسیت‌ها از کل گلبول‌های سفید.","It helps assess the relative proportion of adaptive immune cells.","برای ارزیابی سهم نسبی سلول‌های ایمنی اختصاصی استفاده می‌شود."],
  ["Monocytes","درصد مونوسیت","The percentage of white blood cells that are monocytes.","درصد مونوسیت‌ها از کل گلبول‌های سفید.","It contributes to assessment of immune surveillance and cellular cleanup.","در ارزیابی فعالیت پایش ایمنی و پاک‌سازی سلولی کمک‌کننده است."],
  ["Eosinophils","درصد ائوزینوفیل","The percentage of white blood cells that are eosinophils.","درصد ائوزینوفیل‌ها از کل گلبول‌های سفید.","It helps interpret allergic and parasite-related immune patterns.","به تفسیر الگوهای ایمنی مرتبط با آلرژی و انگل کمک می‌کند."],
  ["Basophils","درصد بازوفیل","The percentage of white blood cells that are basophils.","درصد بازوفیل‌ها از کل گلبول‌های سفید.","It adds context to allergic and inflammatory patterns.","برای تفسیر الگوهای آلرژیک و التهابی اطلاعات تکمیلی فراهم می‌کند."],
  ["RBC","گلبول قرمز","Red blood cells are cells containing hemoglobin.","گلبول‌های قرمز سلول‌هایی حاوی هموگلوبین هستند.","They transport oxygen from the lungs to tissues and help carry carbon dioxide back.","اکسیژن را از ریه به بافت‌ها می‌رسانند و در بازگرداندن دی‌اکسیدکربن نقش دارند."],
  ["Hemoglobin","هموگلوبین","Hemoglobin is an iron-containing protein inside red blood cells.","هموگلوبین پروتئینی حاوی آهن درون گلبول‌های قرمز است.","It binds oxygen in the lungs and releases it to body tissues.","در ریه به اکسیژن متصل می‌شود و آن را در بافت‌های بدن آزاد می‌کند."],
  ["Hematocrit","هماتوکریت","Hematocrit is the percentage of blood volume occupied by red blood cells.","هماتوکریت درصد حجم خون اشغال‌شده توسط گلبول‌های قرمز است.","It helps assess red-cell concentration and investigate anemia or dehydration.","برای ارزیابی غلظت گلبول‌های قرمز و بررسی کم‌خونی یا کم‌آبی استفاده می‌شود."],
  ["MCV","حجم متوسط گلبول قرمز","MCV is the average volume of a red blood cell.","MCV میانگین حجم هر گلبول قرمز است.","It classifies red cells by size and helps identify anemia patterns.","اندازه گلبول‌ها را مشخص می‌کند و به دسته‌بندی انواع کم‌خونی کمک می‌کند."],
  ["MCH","هموگلوبین متوسط هر گلبول","MCH is the average amount of hemoglobin in one red blood cell.","MCH میانگین مقدار هموگلوبین در هر گلبول قرمز است.","It helps evaluate the hemoglobin content of individual red cells.","برای ارزیابی مقدار هموگلوبین موجود در هر گلبول قرمز کاربرد دارد."],
  ["MCHC","غلظت هموگلوبین گلبول قرمز","MCHC is the average concentration of hemoglobin inside red blood cells.","MCHC میانگین غلظت هموگلوبین درون گلبول‌های قرمز است.","It helps characterize red-cell hemoglobinization and anemia patterns.","به بررسی میزان هموگلوبین‌دار بودن گلبول‌ها و الگوهای کم‌خونی کمک می‌کند."],
  ["RDW-CV","پهنای توزیع گلبول قرمز CV","RDW-CV is a percentage-based measure of variation in red-cell size.","RDW-CV معیاری درصدی از تفاوت اندازه گلبول‌های قرمز است.","It helps detect variation in red-cell size when evaluating anemia.","برای شناسایی تفاوت اندازه گلبول‌های قرمز در بررسی کم‌خونی استفاده می‌شود."],
  ["RDW-SD","پهنای توزیع گلبول قرمز SD","RDW-SD measures the spread of red-cell volumes in femtoliters.","RDW-SD گستردگی حجم گلبول‌های قرمز را بر حسب فمتولیتر اندازه می‌گیرد.","It quantifies red-cell size variability and complements MCV.","میزان پراکندگی اندازه گلبول‌ها را کمی می‌کند و مکمل MCV است."],
  ["Platelets","پلاکت","Platelets are small blood components derived from megakaryocytes.","پلاکت‌ها اجزای کوچک خون هستند که از مگاکاریوسیت‌ها منشأ می‌گیرند.","They form an initial plug at injured vessels and support blood clotting.","در محل آسیب رگ پلاک اولیه تشکیل می‌دهند و به انعقاد خون کمک می‌کنند."],
  ["MPV","حجم متوسط پلاکت","MPV is the average size of circulating platelets.","MPV میانگین اندازه پلاکت‌های در گردش خون است.","It provides clues about platelet production and turnover.","می‌تواند درباره میزان تولید و جایگزینی پلاکت‌ها اطلاعات بدهد."],
  ["PDW","پهنای توزیع پلاکت","PDW describes variation in platelet size.","PDW میزان تفاوت اندازه پلاکت‌ها را توصیف می‌کند.","It helps characterize platelet-size variability alongside MPV and platelet count.","همراه MPV و تعداد پلاکت به بررسی تغییرپذیری اندازه پلاکت‌ها کمک می‌کند."],
  ["P-LCR","درصد پلاکت‌های بزرگ","P-LCR is the proportion of large platelets in circulation.","P-LCR سهم پلاکت‌های بزرگ در گردش خون است.","It can provide additional information about platelet turnover.","می‌تواند اطلاعات تکمیلی درباره روند تولید و جایگزینی پلاکت‌ها بدهد."],
  ["ESR 1st","سرعت رسوب گلبول قرمز","ESR measures how far red blood cells settle in a tube over one hour.","ESR میزان ته‌نشینی گلبول‌های قرمز در لوله طی یک ساعت را اندازه می‌گیرد.","It is a nonspecific marker used in evaluating inflammation.","شاخصی غیراختصاصی برای ارزیابی و پیگیری التهاب است."],
  ["BUN","نیتروژن اوره خون","BUN measures the nitrogen portion of urea in blood.","BUN بخش نیتروژنی اوره موجود در خون را اندازه می‌گیرد.","It helps assess kidney waste handling together with hydration and other kidney tests.","همراه وضعیت آب بدن و سایر آزمایش‌های کلیوی به ارزیابی دفع مواد زائد کمک می‌کند."],
  ["Creatinine","کراتینین","Creatinine is a waste product formed mainly from normal muscle metabolism.","کراتینین ماده دفعی حاصل از متابولیسم طبیعی عضلات است.","It is used to estimate kidney filtration, commonly through eGFR.","برای برآورد توان تصفیه کلیه‌ها، معمولاً از طریق eGFR، استفاده می‌شود."],
  ["Uric Acid","اسید اوریک","Uric acid is the final product of purine breakdown in humans.","اسید اوریک محصول نهایی تجزیه پورین‌ها در بدن انسان است.","Excess may lead to urate crystal formation and gout.","افزایش آن می‌تواند به تشکیل بلورهای اورات و بروز نقرس منجر شود."],
  ["Cholesterol","کلسترول کل","Total cholesterol measures cholesterol carried by major blood lipoproteins.","کلسترول کل، مقدار کلسترول حمل‌شده توسط لیپوپروتئین‌های اصلی خون است.","It helps assess cardiovascular risk and reflects cholesterol transport in blood.","در ارزیابی خطر قلبی‌عروقی و بررسی وضعیت انتقال کلسترول کاربرد دارد."],
  ["Triglycerides","تری‌گلیسرید","Triglycerides are fats composed of glycerol and three fatty acids.","تری‌گلیسریدها چربی‌هایی متشکل از گلیسرول و سه اسید چرب هستند.","They serve as an energy reserve; very high levels increase pancreatitis risk.","ذخیره انرژی بدن هستند و افزایش بسیار زیاد آن‌ها خطر التهاب پانکراس را بالا می‌برد."],
  ["LDL","کلسترول LDL","LDL is a lipoprotein that transports cholesterol from the liver toward tissues.","LDL لیپوپروتئینی است که کلسترول را از کبد به سمت بافت‌ها منتقل می‌کند.","High LDL is associated with cholesterol buildup in artery walls and cardiovascular risk.","افزایش LDL با تجمع کلسترول در دیواره شریان‌ها و افزایش خطر قلبی‌عروقی ارتباط دارد."],
  ["HDL","کلسترول HDL","HDL is a lipoprotein involved in transporting cholesterol toward the liver.","HDL لیپوپروتئینی است که در انتقال کلسترول به سمت کبد نقش دارد.","It participates in reverse cholesterol transport and cardiovascular-risk assessment.","در انتقال معکوس کلسترول و ارزیابی خطر قلبی‌عروقی نقش دارد."],
  ["LDL/HDL (Atherogenic Factor)","نسبت LDL به HDL","This ratio compares LDL cholesterol with HDL cholesterol.","این نسبت مقدار کلسترول LDL را با HDL مقایسه می‌کند.","It provides a derived view of the lipid profile and must be interpreted with other risk factors.","نمایی محاسباتی از پروفایل چربی ارائه می‌دهد و باید همراه سایر عوامل خطر تفسیر شود."],
  ["Total Bilirubin","بیلی‌روبین کل","Total bilirubin includes conjugated and unconjugated bilirubin in blood.","بیلی‌روبین کل شامل بیلی‌روبین مستقیم و غیرمستقیم خون است.","It helps assess heme breakdown, liver processing, and bile flow.","برای بررسی تجزیه هِم، پردازش کبدی و جریان صفرا کاربرد دارد."],
  ["Direct Bilirubin","بیلی‌روبین مستقیم","Direct bilirubin is mainly conjugated bilirubin processed by the liver.","بیلی‌روبین مستقیم عمدتاً نوع کونژوگه‌ای است که در کبد پردازش شده است.","It helps evaluate bilirubin excretion and possible bile-flow problems.","به بررسی دفع بیلی‌روبین و احتمال اختلال در جریان صفرا کمک می‌کند."],
  ["SGOT ( AST )","AST","AST is an enzyme found in liver, muscle, heart, and other tissues.","AST آنزیمی است که در کبد، عضلات، قلب و بافت‌های دیگر وجود دارد.","It helps identify possible cell injury but is not specific to the liver.","به شناسایی آسیب احتمالی سلولی کمک می‌کند، اما اختصاصی کبد نیست."],
  ["SGPT ( ALT )","ALT","ALT is an enzyme found mainly in liver cells.","ALT آنزیمی است که عمدتاً در سلول‌های کبدی وجود دارد.","It is commonly used to assess possible liver-cell injury.","معمولاً برای بررسی آسیب احتمالی سلول‌های کبدی استفاده می‌شود."],
  ["FIB-4","شاخص FIB-4","FIB-4 is a calculated score based on age, AST, ALT, and platelet count.","FIB-4 امتیازی محاسباتی بر پایه سن، AST، ALT و تعداد پلاکت است.","It estimates the likelihood of advanced liver fibrosis and is a screening aid, not a diagnosis.","احتمال فیبروز پیشرفته کبد را برآورد می‌کند و ابزار غربالگری است، نه تشخیص قطعی."],
  ["Alkaline Phosphatase","آلکالین فسفاتاز","Alkaline phosphatase is an enzyme found especially in bone and bile ducts.","آلکالین فسفاتاز آنزیمی است که به‌ویژه در استخوان و مجاری صفراوی وجود دارد.","It helps assess bile-duct conditions and bone activity.","برای ارزیابی وضعیت مجاری صفراوی و فعالیت استخوان کاربرد دارد."],
  ["Albumin","آلبومین","Albumin is the most abundant protein in blood plasma and is produced by the liver.","آلبومین فراوان‌ترین پروتئین پلاسمای خون است و در کبد ساخته می‌شود.","It maintains oncotic pressure and transports hormones, drugs, and fatty acids.","فشار اونکوتیک خون را حفظ می‌کند و هورمون‌ها، داروها و اسیدهای چرب را حمل می‌کند."],
  ["Serum Iron","آهن سرم","Serum iron measures iron circulating in blood, mostly bound to transferrin.","آهن سرم مقدار آهن در گردش خون را اندازه می‌گیرد که عمدتاً به ترانسفرین متصل است.","Iron is essential for hemoglobin production and many enzymes.","آهن برای تولید هموگلوبین و عملکرد بسیاری از آنزیم‌ها ضروری است."],
  ["Iron Binding Capacity","ظرفیت اتصال آهن","TIBC estimates the blood's capacity to bind and transport iron.","TIBC ظرفیت خون برای اتصال و انتقال آهن را برآورد می‌کند.","Together with serum iron and ferritin, it helps evaluate iron deficiency or overload.","همراه آهن سرم و فریتین به بررسی کمبود یا اضافه‌بار آهن کمک می‌کند."],
  ["Calcium","کلسیم","Calcium is a mineral present in bones, teeth, blood, and cells.","کلسیم ماده معدنی موجود در استخوان، دندان، خون و سلول‌هاست.","It supports bone structure, muscle contraction, nerve signaling, and clotting.","در استحکام استخوان، انقباض عضلات، پیام‌رسانی عصبی و انعقاد خون نقش دارد."],
  ["Phosphor","فسفر","Phosphorus is a mineral found mainly in bone and inside cells as phosphate.","فسفر ماده معدنی‌ای است که عمدتاً در استخوان و داخل سلول‌ها به شکل فسفات وجود دارد.","It is essential for ATP energy transfer, cell membranes, and bone mineralization.","برای انتقال انرژی در ATP، ساخت غشای سلولی و معدنی‌شدن استخوان ضروری است."],
  ["Sodium","سدیم","Sodium is the main positively charged electrolyte in extracellular fluid.","سدیم الکترولیت با بار مثبت اصلی در مایع خارج سلولی است.","It regulates fluid balance and supports nerve and muscle function.","به تنظیم تعادل مایعات و عملکرد اعصاب و عضلات کمک می‌کند."],
  ["Potassium","پتاسیم","Potassium is the main positively charged electrolyte inside cells.","پتاسیم الکترولیت با بار مثبت اصلی درون سلول‌هاست.","It is essential for heart rhythm, nerve signals, and muscle contraction.","برای ریتم قلب، پیام‌های عصبی و انقباض عضلات ضروری است."],
  ["Zinc","روی","Zinc is an essential trace mineral used by many proteins and enzymes.","روی ماده معدنی کم‌مقدار ضروری است که بسیاری از پروتئین‌ها و آنزیم‌ها به آن نیاز دارند.","It supports immunity, wound healing, DNA synthesis, and taste and smell.","از ایمنی بدن، ترمیم زخم، ساخت DNA و حس چشایی و بویایی پشتیبانی می‌کند."],
  ["LDH Serum","LDH سرم","LDH is an enzyme found in many tissues and involved in energy metabolism.","LDH آنزیمی است که در بسیاری از بافت‌ها وجود دارد و در متابولیسم انرژی نقش دارد.","Raised levels can indicate cell damage but are nonspecific.","افزایش آن می‌تواند نشانه آسیب سلولی باشد، اما اختصاصی نیست."],
  ["Hemoglobin A1c","هموگلوبین A1c","HbA1c is hemoglobin with glucose attached to it.","HbA1c هموگلوبینی است که گلوکز به آن متصل شده است.","It estimates average glucose over roughly 2–3 months and helps monitor diabetes; it does not show daily glucose fluctuations.","میانگین تقریبی قند خون در ۲ تا ۳ ماه گذشته را نشان می‌دهد و برای پایش دیابت کاربرد دارد؛ نوسان روزانه قند را نشان نمی‌دهد."],
  ["eAG (estimated Average Glucose)","میانگین تخمینی قند خون","eAG is an estimated average glucose value calculated from HbA1c.","eAG میانگین تخمینی قند خون است که از روی HbA1c محاسبه می‌شود.","It translates HbA1c into familiar glucose units; it is not a separate glucose test.","HbA1c را به واحدهای آشناتر قند خون تبدیل می‌کند و آزمایش مستقل قند نیست."],
  ["Ferritin","فریتین","Ferritin is a protein that stores iron inside cells.","فریتین پروتئینی است که آهن را درون سلول‌ها ذخیره می‌کند.","Blood ferritin is used to estimate iron stores but can also rise with inflammation.","فریتین خون برای برآورد ذخایر آهن استفاده می‌شود، اما در التهاب نیز ممکن است افزایش یابد."],
  ["Folic Acid","اسید فولیک","Folate is a B vitamin; folic acid is its common supplemental form.","فولات ویتامینی از گروه B است و اسید فولیک شکل رایج مکمل آن است.","It is needed for DNA synthesis and normal red-cell production.","برای ساخت DNA و تولید طبیعی گلبول‌های قرمز لازم است."],
  ["Vitamin D Total(25-OH)","ویتامین D کل","25-hydroxyvitamin D is the main circulating form used to assess vitamin D status.","25-هیدروکسی ویتامین D شکل اصلی در گردش خون برای ارزیابی وضعیت ویتامین D است.","It regulates calcium and phosphate absorption and supports bone and muscle health.","جذب کلسیم و فسفات را تنظیم می‌کند و برای سلامت استخوان و عضله اهمیت دارد."],
  ["CRP (Quantitative)","پروتئین واکنشی C","CRP is an acute-phase protein produced by the liver during inflammation.","CRP پروتئین فاز حادی است که کبد هنگام التهاب تولید می‌کند.","It helps monitor inflammation but does not identify its cause.","به پایش التهاب کمک می‌کند، اما علت التهاب را مشخص نمی‌کند."],
  ["FSH","هورمون محرک فولیکول","FSH is a reproductive hormone released by the pituitary gland.","FSH هورمون تولیدمثلی ترشح‌شده از غده هیپوفیز است.","In men it supports sperm production through its action on the testes.","در مردان از طریق اثر بر بیضه‌ها به تولید اسپرم کمک می‌کند."],
  ["LH","هورمون لوتئینه‌کننده","LH is a hormone released by the pituitary gland.","LH هورمونی است که از غده هیپوفیز ترشح می‌شود.","In men it stimulates Leydig cells in the testes to produce testosterone.","در مردان سلول‌های لیدیگ بیضه را برای تولید تستوسترون تحریک می‌کند."],
  ["Testosterone","تستوسترون","Testosterone is the principal androgen hormone, produced mainly by the testes in men.","تستوسترون هورمون اصلی آندروژنی است که در مردان عمدتاً در بیضه‌ها تولید می‌شود.","It contributes to libido, reproductive function, muscle and bone maintenance, and red-cell production.","در میل و عملکرد جنسی، حفظ عضله و استخوان و تولید گلبول قرمز نقش دارد."],
  ["Free Testosterone","تستوسترون آزاد","Free testosterone is the fraction of testosterone not bound to carrier proteins.","تستوسترون آزاد بخشی از تستوسترون است که به پروتئین‌های حامل متصل نیست.","It is available to enter tissues; interpretation may require SHBG and albumin.","قابلیت ورود به بافت‌ها را دارد و تفسیر آن ممکن است به SHBG و آلبومین نیاز داشته باشد."],
  ["T3","تری‌یُدوتیرونین","T3 is an active thyroid hormone containing three iodine atoms.","T3 هورمون فعال تیروئید است که سه اتم ید دارد.","It regulates metabolic activity, heat production, heart function, and development.","فعالیت متابولیک، تولید گرما، عملکرد قلب و رشد را تنظیم می‌کند."],
  ["T4","تیروکسین","T4 is the main hormone released by the thyroid gland and contains four iodine atoms.","T4 هورمون اصلی ترشح‌شده از غده تیروئید است و چهار اتم ید دارد.","It acts as a circulating reserve that can be converted into active T3.","به‌عنوان ذخیره هورمونی در گردش خون عمل می‌کند و می‌تواند به T3 فعال تبدیل شود."],
  ["TSH","هورمون محرک تیروئید","TSH is a hormone released by the pituitary gland.","TSH هورمونی است که از غده هیپوفیز ترشح می‌شود.","It stimulates the thyroid gland to produce and release T3 and T4.","غده تیروئید را برای تولید و ترشح T3 و T4 تحریک می‌کند."],
  ["W.B.C. (HPF)","گلبول سفید ادرار","The number of white blood cells seen in a high-power microscopic field of urine.","تعداد گلبول‌های سفید مشاهده‌شده در یک میدان پرقدرت میکروسکوپی ادرار.","It supports evaluation of urinary inflammation or infection.","در بررسی التهاب یا عفونت مجاری ادراری کمک‌کننده است."],
  ["R.B.C. (HPF)","گلبول قرمز ادرار","The number of red blood cells seen in a high-power microscopic field of urine.","تعداد گلبول‌های قرمز مشاهده‌شده در یک میدان پرقدرت میکروسکوپی ادرار.","It helps identify microscopic blood and investigate possible urinary or kidney causes.","وجود خون میکروسکوپی را مشخص می‌کند و به بررسی علل ادراری یا کلیوی کمک می‌کند."],
  ["Epithelial Cells (HPF)","سلول‌های اپیتلیال ادرار","These are lining cells shed into urine from the urinary or genital tract.","این سلول‌ها از پوشش مجاری ادراری یا تناسلی وارد نمونه ادرار می‌شوند.","Their type and amount help assess contamination or urinary-tract changes.","نوع و تعداد آن‌ها به بررسی آلودگی نمونه یا تغییرات مجاری ادراری کمک می‌کند."],
  ["Specific Gravity","وزن مخصوص ادرار","Urine specific gravity compares urine density with water density.","وزن مخصوص ادرار چگالی ادرار را با چگالی آب مقایسه می‌کند.","It indicates urine concentration and helps assess hydration and kidney concentrating ability.","غلظت ادرار را نشان می‌دهد و در ارزیابی آب بدن و توان تغلیظ کلیه کاربرد دارد."],
  ["Bacteria","باکتری ادرار","Bacteria are microorganisms observed in a urine sample under microscopy.","باکتری‌ها میکروارگانیسم‌هایی هستند که در نمونه ادرار زیر میکروسکوپ مشاهده می‌شوند.","They may indicate infection, but sample contamination is also possible.","ممکن است نشانه عفونت باشند، اما آلودگی نمونه نیز امکان‌پذیر است."],
  ["Mucus","موکوس ادرار","Mucus is a slippery secretion that may appear in urine sediment.","موکوس ترشح لغزنده‌ای است که ممکن است در رسوب ادرار دیده شود.","Small amounts are often nonspecific; larger amounts need interpretation with other findings.","مقادیر کم آن اغلب غیراختصاصی است و مقدار زیاد باید همراه سایر یافته‌ها تفسیر شود."],
  ["Bilirubin","بیلی‌روبین ادرار","Urine bilirubin is conjugated bilirubin that has entered the urine.","بیلی‌روبین ادرار، بیلی‌روبین کونژوگه‌ای است که وارد ادرار شده است.","Its presence may indicate liver or bile-flow problems.","وجود آن ممکن است به مشکلات کبد یا جریان صفرا اشاره کند."],
  ["Dysmorphic RBC (Urine)","گلبول قرمز بدشکل ادرار","Dysmorphic red cells are red blood cells with irregular shapes seen in urine.","گلبول‌های قرمز بدشکل، سلول‌هایی با شکل غیرطبیعی هستند که در ادرار دیده می‌شوند.","They may suggest bleeding originating from kidney glomeruli.","ممکن است نشان‌دهنده منشأ گلومرولی خون‌ریزی کلیوی باشند."],
  ["Yeast Cell","سلول مخمر ادرار","Yeast cells are fungal cells that may be seen in urine microscopy.","سلول‌های مخمر سلول‌های قارچی هستند که ممکن است در میکروسکوپی ادرار دیده شوند.","They may reflect contamination or fungal presence and require clinical context.","ممکن است ناشی از آلودگی نمونه یا حضور قارچ باشند و به بررسی بالینی نیاز دارند."],
  ["Casts (LPF)","سیلندرهای ادراری","Casts are tube-shaped structures formed in kidney tubules.","سیلندرها ساختارهای لوله‌ای‌شکلی هستند که در توبول‌های کلیه تشکیل می‌شوند.","Their type can provide clues about kidney-tubule or kidney-tissue conditions.","نوع آن‌ها می‌تواند درباره وضعیت توبول‌ها یا بافت کلیه سرنخ بدهد."],
  ["Urine Glucose","گلوکز ادرار","Urine glucose detects glucose that has passed into the urine.","گلوکز ادرار وجود گلوکزی را نشان می‌دهد که وارد ادرار شده است.","It may occur when blood glucose exceeds kidney reabsorption capacity; it does not replace blood-glucose monitoring.","ممکن است وقتی قند خون از توان بازجذب کلیه بیشتر شود دیده شود؛ جایگزین پایش قند خون نیست."],
  ["Urobilinogen","اوروبیلینوژن","Urobilinogen is formed in the intestine from bilirubin by gut bacteria.","اوروبیلینوژن در روده و با فعالیت باکتری‌ها از بیلی‌روبین تشکیل می‌شود.","Urine levels can provide clues about liver function and red-cell breakdown.","مقدار آن در ادرار می‌تواند درباره عملکرد کبد و تجزیه گلبول قرمز سرنخ بدهد."],
  ["Crystals (Urine)","کریستال‌های ادرار","Urine crystals are microscopic solid deposits formed from dissolved substances.","کریستال‌های ادرار رسوبات جامدی هستند که از مواد حل‌شده در ادرار تشکیل می‌شوند.","Their type may help assess urine chemistry and kidney-stone risk.","نوع آن‌ها می‌تواند به ارزیابی ترکیب ادرار و خطر سنگ کلیه کمک کند."],
  ["Leukocyte Esterase","لکوسیت استراز","Leukocyte esterase is an enzyme associated with white blood cells and detected by urine dipstick.","لکوسیت استراز آنزیمی مرتبط با گلبول‌های سفید است که با نوار ادراری شناسایی می‌شود.","A positive result supports possible urinary inflammation or infection but is not definitive alone.","نتیجه مثبت احتمال التهاب یا عفونت ادراری را مطرح می‌کند، اما به‌تنهایی قطعی نیست."],
  ["Nitrite","نیتریت ادرار","The nitrite test detects nitrite produced by certain bacteria in urine.","آزمایش نیتریت، نیتریتی را شناسایی می‌کند که برخی باکتری‌ها در ادرار تولید می‌کنند.","A positive result supports possible bacterial UTI; a negative result does not rule it out.","نتیجه مثبت احتمال عفونت باکتریایی ادراری را تقویت می‌کند؛ نتیجه منفی آن را رد نمی‌کند."],
  ["Ketone","کتون ادرار","Urine ketones are products of fat breakdown that appear when ketone production increases.","کتون ادرار محصولات حاصل از تجزیه چربی هستند که هنگام افزایش تولید کتون ظاهر می‌شوند.","They may occur with fasting, illness, low carbohydrate intake, or insufficient insulin. In type 1 diabetes, ketones with high glucose or illness can signal DKA risk. Follow your sick-day plan and seek urgent medical advice for concerning results or symptoms.","کتون ممکن است در روزه‌داری، بیماری، مصرف کم کربوهیدرات یا کمبود انسولین دیده شود. در دیابت نوع ۱، همراهی کتون با قند بالا یا بیماری می‌تواند نشانه خطر کتواسیدوز باشد. طبق برنامه روزهای بیماری عمل کنید و در صورت نتیجه نگران‌کننده یا علائم هشدار، فوراً کمک پزشکی بگیرید."]
];

const INFO = Object.fromEntries(
  ROWS.map(([key, faTitle, enWhat, faWhat, enRole, faRole]) => [
    key,
    {
      en: {
        title: key,
        what: enWhat,
        role: enRole
      },
      fa: {
        title: faTitle,
        what: faWhat,
        role: faRole
      }
    }
  ])
);

const ALIASES = {
  "AST": "SGOT ( AST )",
  "SGOT": "SGOT ( AST )",
  "ALT": "SGPT ( ALT )",
  "SGPT": "SGPT ( ALT )",
  "HbA1c": "Hemoglobin A1c",
  "A1C": "Hemoglobin A1c",
  "TIBC": "Iron Binding Capacity",
  "ALP": "Alkaline Phosphatase",
  "WBC (URINE)": "W.B.C. (HPF)",
  "RBC (URINE)": "R.B.C. (HPF)",
  "URINE KETONE": "Ketone",
  "KETONES": "Ketone",
  "FREE TESTOSTERONE": "Free Testosterone",
  "TOTAL BILIRUBIN": "Total Bilirubin",
  "DIRECT BILIRUBIN": "Direct Bilirubin"
};

function normalizeLabName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[._]/g, "")
    .replace(/\s+/g, " ");
}

export function getLabInfo(name, language = "en") {
  const raw = String(name || "").trim();

  const alias = ALIASES[raw] || ALIASES[raw.toUpperCase()];

  const key = alias || Object.keys(INFO).find(
    item => normalizeLabName(item) === normalizeLabName(raw)
  );

  const item = key ? INFO[key] : null;

  if (!item) return null;

  return item[language === "fa" ? "fa" : "en"];
}

export const LAB_INFO_COUNT = Object.keys(INFO).length;

export default INFO;
