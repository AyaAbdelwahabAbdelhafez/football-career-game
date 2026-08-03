/* ===========================================================
   TRAINING & INJURIES — التدريب المتقدم ونظام الإصابات المتدرّج
=========================================================== */
import { rand, clamp } from "../utils/helpers.js";
import { ATTR_LABELS } from "../data/content.js";

export const TRAINING_TYPES = {
  technical: { label: "تدريب فني", energyCost: 12, injuryRisk: 0.03, gainRange: [1, 3] },
  gym: { label: "الجيم (بدني)", energyCost: 18, injuryRisk: 0.08, gainRange: [1, 4], physicalFocus: true },
  nutrition: { label: "التغذية", energyCost: 4, injuryRisk: 0, gainRange: [0, 1], cost: 5, moraleBoost: 4 },
  rest: { label: "راحة واستشفاء", energyCost: -25, injuryRisk: 0, gainRange: [0, 0], moraleBoost: 5 },
};

const SEVERITY_TABLE = [
  { name: "إصابة طفيفة", matches: 1, weight: 55 },
  { name: "إصابة متوسطة", matches: 3, weight: 30 },
  { name: "إصابة خطيرة", matches: 6, weight: 15 },
];

function rollInjury() {
  const total = SEVERITY_TABLE.reduce((s, x) => s + x.weight, 0);
  let r = rand(1, total);
  for (const s of SEVERITY_TABLE) {
    if (r <= s.weight) return { name: s.name, severity: s.name, matches: s.matches };
    r -= s.weight;
  }
  return { name: SEVERITY_TABLE[0].name, matches: SEVERITY_TABLE[0].matches };
}

// تطبيق جلسة تدريب (فني/جيم/تغذية/راحة) وإرجاع اللاعب المحدَّث + رسالة
export function applyTraining(player, typeKey) {
  const t = TRAINING_TYPES[typeKey];
  if (!t) return { player, message: "" };
  if (t.cost && player.money < t.cost) return { player, message: "لا يوجد رصيد كافٍ لهذا الخيار" };
  if (player.injury && typeKey !== "rest") return { player, message: "أنت مصاب — يجب الراحة والاستشفاء أولاً" };

  let np = { ...player, attrs: { ...player.attrs } };
  let message = "";

  if (t.gainRange[1] > 0) {
    const keys = t.physicalFocus ? ["physical", "pace"] : Object.keys(np.attrs);
    const key = keys[rand(0, keys.length - 1)];
    const gain = rand(t.gainRange[0], t.gainRange[1]);
    np.attrs[key] = clamp(np.attrs[key] + gain, 30, 99);
    message = `${t.label}: +${gain} ${ATTR_LABELS[key]}`;
  } else {
    message = t.label + " مكتملة";
  }

  np.energy = clamp(np.energy - t.energyCost, 0, 100);
  if (t.moraleBoost) np.morale = clamp(np.morale + t.moraleBoost, 0, 100);
  if (t.cost) np.money = np.money - t.cost;

  // الراحة تُخفّض مدة الإصابة الحالية
  if (typeKey === "rest" && np.injury) {
    const remaining = np.injury.matches - 1;
    np.injury = remaining <= 0 ? null : { ...np.injury, matches: remaining };
    if (!np.injury) message = "تعافيت بالكامل ✅";
    else message = `راحة واستشفاء — تبقّى ${remaining} مباراة للتعافي`;
  }

  // خطر إصابة أثناء الجيم/التدريب الفني
  if (t.injuryRisk && !np.injury && Math.random() < t.injuryRisk) {
    const inj = rollInjury();
    np.injury = inj;
    message += ` — ⚠️ ${inj.name}! ستغيب ${inj.matches} مباراة/مباريات`;
  }

  return { player: np, message };
}

// إصابة أثناء المباراة نفسها (تُستدعى من محرّك محاكاة المباراة)
export function maybeMatchInjury(chance = 0.06) {
  if (Math.random() >= chance) return null;
  return rollInjury();
}

export function isFitToPlay(player) {
  return !player.injury || player.injury.matches <= 0;
}
