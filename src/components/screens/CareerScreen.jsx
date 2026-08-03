import React, { useState } from "react";
import { Trophy, Award } from "lucide-react";
import { overallOf } from "../../utils/helpers.js";
import { OvrRing } from "../shared/Shared.jsx";

export function CareerScreen({ player }) {
  const [tab, setTab] = useState("history");
  const avgRating = player.matches ? (player.ratingSum / player.matches).toFixed(1) : "—";
  const ovr = overallOf(player);
  const individualAwards = (player.awardsHistory || []).flatMap((a) => a.awards.map((name) => ({ season: a.season, name })));

  return (
    <div className="screen">
      <div className="subtabs">
        {[["history", "السجل"], ["trophies", "الألقاب"], ["stats", "الإحصائيات"]].map(([id, label]) => (
          <button key={id} className={"subtab" + (tab === id ? " active" : "")} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {tab === "history" && (
        <div className="timeline">
          {[...player.history].reverse().map((h, i) => (
            <div className="tl-item" key={i}>
              <div className="tl-dot" style={{ background: h.color }} />
              {i !== player.history.length - 1 && <div className="tl-line" />}
              <div className="tl-card" style={{ borderInlineStartColor: h.color }}>
                <div className="tl-club" style={{ color: h.color }}>{h.club}</div>
                <div className="tl-range">{h.to ? `موسم ${h.from} – ${h.to}` : `موسم ${h.from} – الآن`}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "trophies" && (
        <>
          <div className="trophy-grid">
            {player.trophies.length === 0 && <p className="muted">لم يتم إحراز بطولات بعد — استمر في المسيرة!</p>}
            {player.trophies.map((t, i) => (
              <div className="trophy-card" key={i}>
                <Trophy size={22} color="#E4B94B" />
                <span>{t}</span>
              </div>
            ))}
          </div>
          {individualAwards.length > 0 && (
            <>
              <div className="section-title">الجوائز الفردية</div>
              <div className="trophy-grid">
                {individualAwards.map((a, i) => (
                  <div className="trophy-card" key={i}>
                    <Award size={20} color="#E4B94B" />
                    <span>{a.name}</span>
                    <span className="muted" style={{ padding: 0 }}>موسم {a.season}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {tab === "stats" && (
        <div className="stats-panel">
          <div className="ovr-hero">
            <OvrRing value={ovr} size={84} />
            <span>التقييم الإجمالي</span>
          </div>
          <div className="stat-grid">
            <div className="stat-box"><span>{player.matches}</span><label>مباراة</label></div>
            <div className="stat-box"><span>{player.goals}</span><label>هدف</label></div>
            <div className="stat-box"><span>{player.assists}</span><label>صناعة</label></div>
            <div className="stat-box"><span>{avgRating}</span><label>متوسط التقييم</label></div>
            <div className="stat-box"><span>{player.trophies.length}</span><label>بطولة</label></div>
            <div className="stat-box"><span>{player.season}</span><label>موسم احترافي</label></div>
          </div>
        </div>
      )}
    </div>
  );
}
