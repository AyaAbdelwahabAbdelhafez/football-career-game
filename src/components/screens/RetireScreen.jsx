import React, { useState } from "react";
import { Flag, Award, Mic2, GraduationCap, Briefcase, Sofa } from "lucide-react";
import { CLUBS } from "../../data/clubs.js";

const PATHS = [
  { id: "coach", label: "مدرّب كرة قدم", icon: GraduationCap, desc: "انقل خبرتك لجيل جديد من اللاعبين" },
  { id: "pundit", label: "محلل رياضي إعلامي", icon: Mic2, desc: "شارك آراءك عبر الشاشات والبرامج الرياضية" },
  { id: "academy", label: "مالك أكاديمية ناشئين", icon: Briefcase, desc: "استثمر في اكتشاف المواهب القادمة" },
  { id: "relax", label: "استمتع بالتقاعد", icon: Sofa, desc: "استرخِ واستمتع بثمار مسيرتك الطويلة" },
];

export function RetireScreen({ player, onRestart }) {
  const [path, setPath] = useState(null);
  const avgRating = player.matches ? (player.ratingSum / player.matches).toFixed(1) : "—";

  return (
    <div className="screen retire">
      <div className="hero-badge"><Flag size={24} color="#E4B94B" /></div>
      <h2>نهاية مسيرة أسطورية</h2>
      <p className="sub">{player.name} يعلن الاعتزال بعد {player.season} مواسم من الاحتراف</p>
      <div className="stat-grid">
        <div className="stat-box"><span>{player.matches}</span><label>مباراة</label></div>
        <div className="stat-box"><span>{player.goals}</span><label>هدف</label></div>
        <div className="stat-box"><span>{player.assists}</span><label>حاسمة</label></div>
        <div className="stat-box"><span>{avgRating}</span><label>متوسط التقييم</label></div>
        <div className="stat-box"><span>{player.trophies.length}</span><label>بطولة</label></div>
        <div className="stat-box"><span>{CLUBS[player.clubIdx].name}</span><label>آخر نادٍ</label></div>
      </div>
      {player.awardsHistory?.length > 0 && (
        <>
          <div className="section-title">الجوائز الفردية</div>
          <div className="trophy-grid">
            {player.awardsHistory.flatMap((a) => a.awards).map((a, i) => (
              <div className="trophy-card" key={i}><Award size={18} color="#E4B94B" /><span>{a}</span></div>
            ))}
          </div>
        </>
      )}
      <div className="trophy-grid">
        {player.trophies.length === 0 && <p className="muted">لم يتم إحراز بطولات — حاول مسيرة أطول!</p>}
        {player.trophies.map((t, i) => <div className="trophy-card" key={i}><Award size={18} color="#E4B94B" /><span>{t}</span></div>)}
      </div>

      <div className="section-title">ماذا بعد الاعتزال؟</div>
      <div className="action-grid">
        {PATHS.map((p) => {
          const Icon = p.icon;
          return (
            <button key={p.id} className={"action-btn" + (path === p.id ? " primary" : "")} onClick={() => setPath(p.id)}>
              <Icon size={18} /> {p.label}
            </button>
          );
        })}
      </div>
      {path && <p className="muted" style={{ marginTop: 10 }}>{PATHS.find((p) => p.id === path).desc}</p>}

      <button className="btn-primary wide" disabled={!path} onClick={onRestart}>ابدأ مسيرة جديدة</button>
    </div>
  );
}
