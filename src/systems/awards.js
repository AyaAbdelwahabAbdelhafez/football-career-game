/* ===========================================================
   AWARDS — الجوائز الفردية نهاية الموسم
=========================================================== */
import { rand } from "../utils/helpers.js";
import { RIVAL_CANDIDATES } from "../data/content.js";

function playerScore(p) {
  const avgRating = p.matches ? p.ratingSum / p.matches : 5;
  return p.goals * 2 + p.assists * 1.5 + avgRating * 10 + p.trophies.length * 15 + (p.national?.caps || 0) * 0.5;
}

function randomRival() {
  const name = RIVAL_CANDIDATES[rand(0, RIVAL_CANDIDATES.length - 1)];
  return { name, score: rand(60, 150), goals: rand(10, 30) };
}

// تُستدعى في نهاية الموسم — تُرجع نتائج الجوائز الثلاث الرئيسية
export function runAwardsCeremony(player, seasonMatches) {
  const rivals = [randomRival(), randomRival(), randomRival()];
  const myScore = playerScore(player);

  const ballonField = [{ name: player.name, score: myScore }, ...rivals.map((r) => ({ name: r.name, score: r.score }))]
    .sort((a, b) => b.score - a.score);
  const ballonWon = ballonField[0].name === player.name;

  const goldenBootField = [{ name: player.name, goals: player.goals }, ...rivals.map((r) => ({ name: r.name, goals: r.goals }))]
    .sort((a, b) => b.goals - a.goals);
  const goldenBootWon = goldenBootField[0].name === player.name && player.goals > 0;

  const youngPlayerWon = player.age <= 21 && myScore > 70;

  const awardsGained = [];
  if (ballonWon) awardsGained.push("الكرة الذهبية");
  if (goldenBootWon) awardsGained.push("الحذاء الذهبي");
  if (youngPlayerWon) awardsGained.push("أفضل لاعب شاب");

  return { ballonWon, goldenBootWon, youngPlayerWon, awardsGained, standings: ballonField };
}
