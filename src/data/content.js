/* ===========================================================
   CONTENT — نصوص وبيانات ثابتة للعبة
=========================================================== */

export const POSITIONS = ["حارس مرمى", "مدافع", "وسط", "جناح", "مهاجم"];
export const ATTR_LABELS = { pace: "السرعة", shooting: "التسديد", passing: "التمرير", dribbling: "المراوغة", defending: "الدفاع", physical: "اللياقة" };
export const REL_LABELS = { coach: "المدرب", teammates: "الزملاء", fans: "الجماهير", media: "وسائل الإعلام", family: "العائلة" };

// نقطة انطلاق خيالية فقط لقصة داخل اللعبة — كل الأحداث بعدها من نسج المحاكاة.
export const REAL_PLAYERS = [
  { name: "ليونيل ميسي", nationality: "الأرجنتين", flag: "🇦🇷", position: "جناح", color: "#75AADB",
    attrs: { pace: 78, shooting: 88, passing: 90, dribbling: 96, defending: 32, physical: 60 } },
  { name: "كريستيانو رونالدو", nationality: "البرتغال", flag: "🇵🇹", position: "مهاجم", color: "#C0453A",
    attrs: { pace: 82, shooting: 93, passing: 78, dribbling: 85, defending: 30, physical: 82 } },
  { name: "كيليان مبابي", nationality: "فرنسا", flag: "🇫🇷", position: "مهاجم", color: "#4C9BD1",
    attrs: { pace: 97, shooting: 88, passing: 78, dribbling: 90, defending: 26, physical: 76 } },
  { name: "إيرلينغ هالاند", nationality: "النرويج", flag: "🇳🇴", position: "مهاجم", color: "#8CC0E8",
    attrs: { pace: 90, shooting: 91, passing: 62, dribbling: 76, defending: 35, physical: 88 } },
  { name: "كيفن دي بروين", nationality: "بلجيكا", flag: "🇧🇪", position: "وسط", color: "#6CB1E0",
    attrs: { pace: 72, shooting: 82, passing: 94, dribbling: 84, defending: 55, physical: 74 } },
  { name: "محمد صلاح", nationality: "مصر", flag: "🇪🇬", position: "جناح", color: "#C0453A",
    attrs: { pace: 90, shooting: 86, passing: 79, dribbling: 88, defending: 38, physical: 68 } },
  { name: "فينيسيوس جونيور", nationality: "البرازيل", flag: "🇧🇷", position: "جناح", color: "#E4B94B",
    attrs: { pace: 95, shooting: 78, passing: 74, dribbling: 92, defending: 28, physical: 62 } },
  { name: "جود بيلينجهام", nationality: "إنجلترا", flag: "🏴", position: "وسط", color: "#EAF0F7",
    attrs: { pace: 80, shooting: 82, passing: 84, dribbling: 85, defending: 62, physical: 80 } },
  { name: "أشرف حكيمي", nationality: "المغرب", flag: "🇲🇦", position: "مدافع", color: "#C0453A",
    attrs: { pace: 93, shooting: 68, passing: 78, dribbling: 82, defending: 76, physical: 72 } },
  { name: "روبرت ليفاندوفسكي", nationality: "بولندا", flag: "🇵🇱", position: "مهاجم", color: "#C0453A",
    attrs: { pace: 76, shooting: 92, passing: 72, dribbling: 80, defending: 34, physical: 80 } },
];

// أسماء منافسين وهميين تُستخدم لمقارنة الجوائز الفردية في نهاية الموسم
export const RIVAL_CANDIDATES = [
  "أندريه سيلفا", "توماس فيرنر", "لوكاس مارتينيز", "كارلوس دياز", "يوري بتروف",
  "دييغو رامون", "سامي عثمان", "فيكتور نوفاك", "هنري دوبوا", "ماركو روسي",
];

export const NATIONAL_TEAMS = [
  { name: "مصر", flag: "🇪🇬" }, { name: "السعودية", flag: "🇸🇦" }, { name: "المغرب", flag: "🇲🇦" },
  { name: "فرنسا", flag: "🇫🇷" }, { name: "إسبانيا", flag: "🇪🇸" }, { name: "إنجلترا", flag: "🏴" },
  { name: "البرازيل", flag: "🇧🇷" }, { name: "الأرجنتين", flag: "🇦🇷" }, { name: "إيطاليا", flag: "🇮🇹" },
  { name: "ألمانيا", flag: "🇩🇪" }, { name: "الجزائر", flag: "🇩🇿" }, { name: "تونس", flag: "🇹🇳" },
];

/* ---------------------- مؤتمرات صحفية ---------------------- */
// كل بنك أسئلة مرتبط بسياق (عام / بعد فوز / بعد خسارة / بعد إصابة / شائعات انتقال / بعد جائزة)
export const PRESS_BANKS = {
  general: [
    { q: "كيف تقيّم أداءك هذا الموسم؟", options: [
      { t: "أعطي نفسي علامة عالية بثقة", d: { media: -4, fans: 6 } },
      { t: "ما زال أمامي الكثير لأتعلمه", d: { media: 6, coach: 5 } },
      { t: "التركيز الآن على الفريق فقط", d: { teammates: 6, media: 2 } },
    ]},
    { q: "ما هو هدفك القادم في المسيرة؟", options: [
      { t: "أطمح لإحراز الألقاب الكبرى", d: { fans: 7, media: 2 } },
      { t: "أريد التطور يوماً بعد يوم فقط", d: { coach: 6 } },
      { t: "الوصول للمنتخب الوطني هدفي القادم", d: { fans: 5, media: 3 } },
    ]},
  ],
  post_win: [
    { q: "فوز رائع اليوم.. ما سر هذا الأداء؟", options: [
      { t: "هذا مجهود جماعي بالكامل", d: { teammates: 8, media: 3 } },
      { t: "التزامي بالتدريب أعطى ثماره", d: { coach: 7, media: 2 } },
      { t: "كنت أشعر بثقة كبيرة اليوم", d: { fans: 6, media: -2 } },
    ]},
  ],
  post_loss: [
    { q: "خسارة مؤلمة.. ما تعليقك؟", options: [
      { t: "نتحمل المسؤولية ونعمل على التحسّن", d: { coach: 6, media: 4 } },
      { t: "الحكم أثّر في نتيجة المباراة", d: { media: -6, fans: 4 } },
      { t: "سنعود أقوى في المباراة القادمة", d: { teammates: 5, fans: 3 } },
    ]},
  ],
  post_injury: [
    { q: "كيف حالك بعد الإصابة الأخيرة؟", options: [
      { t: "سأعود أقوى مما كنت", d: { fans: 8, coach: 3 } },
      { t: "أحتاج وقتاً للتعافي الكامل", d: { coach: 6, media: 2 } },
      { t: "أشعر بالإحباط لكنني سأصبر", d: { fans: 4, family: 6 } },
    ]},
  ],
  transfer_rumors: [
    { q: "هناك شائعات عن انتقالك.. تعليقك؟", options: [
      { t: "أرفض التعليق على الشائعات", d: { media: -2 } },
      { t: "أنا سعيد هنا حالياً", d: { fans: 8, coach: 4 } },
      { t: "كل شيء وارد في المستقبل", d: { media: 5, fans: -5 } },
    ]},
  ],
  post_award: [
    { q: "تهانينا على الجائزة! ما شعورك؟", options: [
      { t: "هذا تتويج لعمل سنوات طويلة", d: { fans: 10, media: 4 } },
      { t: "أهدي الجائزة لعائلتي وزملائي", d: { family: 10, teammates: 6 } },
      { t: "هذا يحفّزني للمزيد فقط", d: { media: 6, coach: 4 } },
    ]},
  ],
};

/* ---------------------- الرعاية والاستثمار والمقتنيات ---------------------- */
export const SPONSOR_TEMPLATES = [
  { brand: "أباكس سبورت", type: "مستلزمات رياضية", signing: [15, 40], weekly: [1, 3] },
  { brand: "فولت إنرجي", type: "مشروبات طاقة", signing: [10, 25], weekly: [1, 2] },
  { brand: "زينيث للساعات", type: "ساعات فاخرة", signing: [20, 55], weekly: [2, 4] },
  { brand: "أوربت موبايل", type: "هواتف ذكية", signing: [12, 30], weekly: [1, 3] },
  { brand: "نوفا وير", type: "أزياء رياضية", signing: [18, 45], weekly: [2, 4] },
];

export const LUXURY_ITEMS = [
  { id: "car1", name: "سيارة رياضية فارهة", cost: 60, moraleBoost: 8, repBoost: 1, icon: "🚗" },
  { id: "watch1", name: "ساعة فاخرة محدودة", cost: 25, moraleBoost: 4, repBoost: 0, icon: "⌚" },
  { id: "house1", name: "فيلا خاصة", cost: 180, moraleBoost: 14, repBoost: 2, icon: "🏠" },
  { id: "jet1", name: "حصة في طائرة خاصة", cost: 320, moraleBoost: 18, repBoost: 3, icon: "✈️" },
  { id: "charity1", name: "مؤسسة خيرية باسمك", cost: 90, moraleBoost: 10, repBoost: 2, icon: "❤️", fanBoost: 12 },
];

/* ---------------------- قوالب الأخبار ---------------------- */
export const NEWS_TEMPLATES = {
  goalStreak: (name, n) => `⚽ ${name} يواصل تألقه بتسجيل ${n} أهداف في آخر المباريات!`,
  bigWin: (name, club) => `🔥 أداء لافت من ${name} في فوز ${club} الأخير`,
  transfer: (name, club) => `🚨 عاجل: ${name} ينتقل رسمياً إلى ${club}!`,
  injury: (name) => `🚑 إصابة تُبعد ${name} عن الملاعب لفترة`,
  award: (name, award) => `🏆 ${name} يحصد جائزة ${award}!`,
  callUp: (name, nation) => `🇺🇳 ${name} يتلقى أول استدعاء لمنتخب ${nation}!`,
  contract: (name, club) => `✍️ ${name} يوقّع عقد رعاية جديد مع نادي ${club}`,
  leagueTitle: (club) => `🏆 ${club} يتوّج بلقب الدوري هذا الموسم!`,
  retirement: (name) => `👋 ${name} يعلن الاعتزال بعد مسيرة حافلة`,
};
