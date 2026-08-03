import React from "react";
import { Award } from "lucide-react";

const AWARD_DEFS = [
  { key: "ballonWon", title: "الكرة الذهبية", icon: "🏆" },
  { key: "goldenBootWon", title: "الحذاء الذهبي", icon: "👟" },
  { key: "youngPlayerWon", title: "أفضل لاعب شاب", icon: "⭐" },
];

export function AwardsCeremonyScreen({ result, onDone }) {
  const anyWon = result.awardsGained.length > 0;
  return (
    <div className="screen">
      <div className="hero-badge"><Award size={24} color="#E4B94B" /></div>
      <h2>حفل الجوائز الفردية</h2>
      <p className="sub">{anyWon ? "تهانينا! لقد كان موسماً استثنائياً" : "لم تفز بجائزة هذا الموسم — استمر في التألق"}</p>

      {AWARD_DEFS.map((a) => {
        const won = result[a.key];
        return (
          <div className={"award-result" + (won ? " won" : "")} key={a.key}>
            <div className="award-icon">{a.icon}</div>
            <div>
              <div className="award-title">{a.title}</div>
              <div className="award-status">{won ? "فزت بالجائزة! 🎉" : "لم تفز هذه المرة"}</div>
            </div>
          </div>
        );
      })}

      <button className="btn-primary wide" onClick={onDone}>متابعة</button>
    </div>
  );
}
