/* ===========================================================
   FINANCE SYSTEM — الراتب، الرعاية، الاستثمار، المقتنيات
   كل المبالغ مخزّنة بوحدة "ألف" (k)، وتُعرض كـ M عند تجاوز 1000.
=========================================================== */
import { rand, clamp } from "../utils/helpers.js";
import { SPONSOR_TEMPLATES, LUXURY_ITEMS } from "../data/content.js";

// راتب أسبوعي تقريبي مبني على قوة النادي وسمعة اللاعب
export function weeklyWage(club, reputation) {
  return Math.round(club.strength * 0.6 + reputation * 1.4 + 3);
}

// دفعة راتب دورية تُضاف بعد كل مباراة
export function payMatchWage(player, club) {
  const wage = weeklyWage(club, player.reputation);
  return { ...player, money: player.money + wage, lastWage: wage };
}

// عرض رعاية تجارية عشوائي (يظهر بين الحين والآخر حسب السمعة)
export function maybeGenerateSponsorOffer(player) {
  if (player.reputation < 15) return null;
  if (Math.random() > 0.35) return null;
  const t = SPONSOR_TEMPLATES[rand(0, SPONSOR_TEMPLATES.length - 1)];
  const scale = 1 + player.reputation / 60;
  return {
    id: `${t.brand}-${Date.now()}`,
    brand: t.brand,
    type: t.type,
    signing: Math.round(rand(t.signing[0], t.signing[1]) * scale),
    weekly: Math.round(rand(t.weekly[0], t.weekly[1]) * scale),
  };
}

export function acceptSponsor(player, offer) {
  const sponsors = [...(player.sponsors || []), offer];
  return { ...player, money: player.money + offer.signing, sponsors };
}

// دخل الرعاية الدوري (يُحتسب مع كل مباراة)
export function sponsorIncome(player) {
  return (player.sponsors || []).reduce((sum, s) => sum + s.weekly, 0);
}

// استثمار مبلغ من المال — يُقفَل لعدد مباريات ثم يعود بعائد عشوائي
export function invest(player, amount, matchesToMature = 6) {
  if (amount <= 0 || amount > player.money) return player;
  const multiplier = 1 + rand(-15, 45) / 100; // من -15% إلى +45%
  const investment = { id: Date.now(), amount, multiplier, maturesInMatches: matchesToMature };
  return { ...player, money: player.money - amount, investments: [...(player.investments || []), investment] };
}

// يُستدعى بعد كل مباراة لتحديث الاستثمارات الناضجة
export function tickInvestments(player) {
  const list = player.investments || [];
  if (list.length === 0) return player;
  let cashback = 0;
  const remaining = [];
  const matured = [];
  for (const inv of list) {
    const left = inv.maturesInMatches - 1;
    if (left <= 0) {
      const returned = Math.round(inv.amount * inv.multiplier);
      cashback += returned;
      matured.push({ ...inv, returned });
    } else {
      remaining.push({ ...inv, maturesInMatches: left });
    }
  }
  return { ...player, money: player.money + cashback, investments: remaining, lastMaturedInvestments: matured };
}

export function buyLuxuryItem(player, itemId) {
  const item = LUXURY_ITEMS.find((i) => i.id === itemId);
  if (!item || player.money < item.cost || (player.assets || []).includes(itemId)) return player;
  return {
    ...player,
    money: player.money - item.cost,
    assets: [...(player.assets || []), itemId],
    morale: clamp(player.morale + item.moraleBoost, 0, 100),
    reputation: clamp(player.reputation + item.repBoost, 0, 99),
    relationships: item.fanBoost
      ? { ...player.relationships, fans: clamp(player.relationships.fans + item.fanBoost, 0, 100) }
      : player.relationships,
  };
}

export function netWorth(player) {
  const investedValue = (player.investments || []).reduce((s, i) => s + i.amount, 0);
  const assetsValue = (player.assets || []).reduce((s, id) => {
    const item = LUXURY_ITEMS.find((i) => i.id === id);
    return s + (item ? item.cost : 0);
  }, 0);
  return player.money + investedValue + assetsValue;
}
