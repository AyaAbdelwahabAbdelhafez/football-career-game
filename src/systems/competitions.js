/* ===========================================================
   COMPETITIONS — ترتيب الدوري ومحاكاة الكأس المحلي
=========================================================== */
import { rand, clamp } from "../utils/helpers.js";
import { clubsInLeague } from "../data/clubs.js";

// يبني جدول ترتيب ابتدائي لكل أندية دوري اللاعب الحالي
export function initLeagueTable(club) {
  const rivals = clubsInLeague(club.league).filter((c) => c.name !== club.name);
  const all = [club, ...rivals];
  return all.map((c) => ({ name: c.name, color: c.color, strength: c.strength, played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }));
}

// يُحاكي جولة كاملة: نتيجة اللاعب معروفة سلفاً (من مباراته)، وبقية الأندية عشوائية حسب القوة
export function simulateMatchday(table, playerClubName, playerScoreline) {
  const next = table.map((row) => ({ ...row }));
  const rows = next.filter((r) => r.name !== playerClubName);

  // مباراة اللاعب
  const pRow = next.find((r) => r.name === playerClubName);
  if (pRow && playerScoreline) {
    const { gf, ga } = playerScoreline;
    pRow.played += 1; pRow.gf += gf; pRow.ga += ga;
    if (gf > ga) { pRow.w += 1; pRow.pts += 3; } else if (gf === ga) { pRow.d += 1; pRow.pts += 1; } else { pRow.l += 1; }
  }

  // مباريات بقية الأندية (تُقارَن بأزواج عشوائية)
  const shuffled = [...rows].sort(() => Math.random() - 0.5);
  for (let i = 0; i + 1 < shuffled.length; i += 2) {
    const a = shuffled[i], b = shuffled[i + 1];
    const diff = a.strength - b.strength;
    const aGoals = clamp(rand(0, 3) + (diff > 10 ? 1 : 0), 0, 5);
    const bGoals = clamp(rand(0, 3) + (diff < -10 ? 1 : 0), 0, 5);
    a.played += 1; b.played += 1;
    a.gf += aGoals; a.ga += bGoals; b.gf += bGoals; b.ga += aGoals;
    if (aGoals > bGoals) { a.w += 1; a.pts += 3; b.l += 1; }
    else if (aGoals < bGoals) { b.w += 1; b.pts += 3; a.l += 1; }
    else { a.d += 1; b.d += 1; a.pts += 1; b.pts += 1; }
  }
  return next.sort((x, y) => y.pts - x.pts || (y.gf - y.ga) - (x.gf - x.ga));
}

export function isSeasonOverForTable(table, matchesPerSeason = 8) {
  return table.some((r) => r.played >= matchesPerSeason);
}

export function crownChampion(table) {
  const sorted = [...table].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));
  return sorted[0];
}

/* ---------------------- كأس محلي مبسّط (بطولة إقصائية) ---------------------- */
export const CUP_STAGES = ["دور الـ32", "دور الـ16", "ربع النهائي", "نصف النهائي", "النهائي", "بطل الكأس"];

// يبدأ مسيرة جديدة في الكأس في بداية كل موسم
export function startCupRun() {
  return { stageIdx: 0, out: false };
}

// يُستدعى دورياً (كل عدة مباريات) لتقدّم اللاعب في مشوار الكأس حسب قوته وسمعته
export function progressCup(cup, playerPowerScore) {
  if (!cup || cup.out || cup.stageIdx >= CUP_STAGES.length - 1) return { cup, event: null };
  const winChance = clamp(0.35 + playerPowerScore / 300, 0.2, 0.85);
  if (Math.random() < winChance) {
    const stageIdx = cup.stageIdx + 1;
    const reachedFinalWin = stageIdx === CUP_STAGES.length - 1;
    return { cup: { ...cup, stageIdx }, event: { advanced: true, stage: CUP_STAGES[stageIdx], won: reachedFinalWin } };
  }
  return { cup: { ...cup, out: true }, event: { advanced: false, stage: CUP_STAGES[cup.stageIdx] } };
}
