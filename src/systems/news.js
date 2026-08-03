/* ===========================================================
   NEWS & SOCIAL — الأخبار وشبكة التواصل الافتراضية
=========================================================== */
import { rand, clamp } from "../utils/helpers.js";

export function pushNews(feed, text) {
  return [{ id: Date.now() + rand(0, 999), text }, ...(feed || [])].slice(0, 40);
}

// منشور اجتماعي مبني على العلاقات الحالية — يُستدعى بشكل دوري
export function generateSocialPost(player) {
  const { fans, media } = player.relationships;
  let mood = "محايد";
  if (fans > 70) mood = "متحمس جداً";
  else if (fans < 35) mood = "منتقد";

  const templates = {
    "متحمس جداً": [
      `الجماهير: "${player.name} أفضل لاعب رأيته هذا الموسم! 🔥"`,
      `آلاف التعليقات المتفائلة تحت آخر صورة لـ${player.name}`,
    ],
    "منتقد": [
      `بعض المشجعين يطالبون بمستوى أفضل من ${player.name} مؤخراً`,
      `جدل على منصات التواصل حول أداء ${player.name} الأخير`,
    ],
    "محايد": [
      `متابعو ${player.name} يترقبون المباراة القادمة بحماس`,
      `${player.name} ينشر صورة من التدريبات اليومية`,
    ],
  };
  const list = templates[mood];
  return list[rand(0, list.length - 1)];
}

// نمو المتابعين على شبكات التواصل — يتأثر بالأداء والجماهيرية
export function growFollowers(current, { goalsScored, won, relationships }) {
  let gain = rand(50, 300);
  if (goalsScored > 0) gain += goalsScored * rand(200, 600);
  if (won) gain += rand(50, 200);
  gain = Math.round(gain * (0.6 + relationships.fans / 100));
  return current + gain;
}
