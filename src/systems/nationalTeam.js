/* ===========================================================
   NATIONAL TEAM — الاستدعاء، المباريات الدولية، البطولات القارية
=========================================================== */
import { rand, clamp } from "../utils/helpers.js";
import { NATIONAL_TEAMS } from "../data/content.js";

export function flagFor(nationality) {
  const found = NATIONAL_TEAMS.find((n) => nationality && nationality.includes(n.name));
  return found ? found.flag : "🌍";
}

// فرصة الاستدعاء لأول مرة بناءً على السمعة والتقييم
export function checkCallUp(player) {
  if (player.national?.called) return null;
  const threshold = 42;
  if (player.reputation < threshold) return null;
  if (Math.random() > 0.25) return null;
  return { called: true, caps: 0, goals: 0, tournamentsWon: 0 };
}

// مباراة دولية مبسّطة أثناء فترة التوقف الدولي
export function simulateNationalMatch(player) {
  const scoreChance = clamp(0.15 + player.reputation / 200, 0.1, 0.55);
  const scored = Math.random() < scoreChance ? 1 : 0;
  const won = Math.random() < 0.5;
  const national = {
    ...player.national,
    caps: (player.national?.caps || 0) + 1,
    goals: (player.national?.goals || 0) + scored,
  };
  const repGain = won ? rand(1, 2) : 0;
  return {
    national,
    scored,
    won,
    repGain,
    text: `مباراة دولية: ${won ? "فوز" : "تعادل/خسارة"} ${scored ? "— وتسجيلك حاضر! ⚽" : ""}`,
  };
}

// بطولة قارية/عالمية كل عدة مواسم — محاكاة سريعة لمسار كامل
export function simulateTournament(player) {
  const rounds = 5; // مجموعات -> ثمن -> ربع -> نصف -> نهائي
  const baseChance = clamp(0.4 + player.reputation / 250, 0.25, 0.75);
  let round = 0;
  while (round < rounds && Math.random() < baseChance) round += 1;
  const won = round === rounds;
  const stageNames = ["دور المجموعات", "دور الـ16", "ربع النهائي", "نصف النهائي", "النهائي", "بطل البطولة!"];
  return { won, stageReached: stageNames[round], round };
}
