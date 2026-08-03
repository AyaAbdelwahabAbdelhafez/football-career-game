/* ===========================================================
   HELPERS — أدوات عامة تُستخدم في كل أنحاء اللعبة
=========================================================== */

export const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
export const pick = (arr) => arr[rand(0, arr.length - 1)];
export const attrAvg = (attrs) => Object.values(attrs).reduce((a, b) => a + b, 0) / Object.values(attrs).length;
export const overallOf = (p) => clamp(Math.round(attrAvg(p.attrs) * 0.72 + p.reputation * 0.5 + 14), 40, 99);

export const fmtMoney = (n) => {
  const v = Math.round(n);
  if (Math.abs(v) >= 1000) return (v / 1000).toFixed(1).replace(/\.0$/, "") + "M";
  return v + "K";
};

/* ---------------------- Save system (localStorage) ---------------------- */
const SAVE_KEY = "football-career-save-v2";

export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || !data.player) return null;
    return data;
  } catch {
    return null;
  }
}

export function writeSave(data) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable — اللعبة تستمر بدون حفظ */
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* ignore */
  }
}
