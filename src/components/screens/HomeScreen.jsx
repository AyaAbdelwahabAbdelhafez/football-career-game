import React from "react";
import { Trophy, Shield, Dumbbell, Apple, Bed, Flag, ShieldAlert, Users } from "lucide-react";
import { overallOf } from "../../utils/helpers.js";
import { ATTR_LABELS, REL_LABELS } from "../../data/content.js";
import { CLUBS } from "../../data/clubs.js";
import { OvrRing } from "../shared/Shared.jsx";

export function HomeScreen({ player, onAction, onGoTab }) {
  const club = CLUBS[player.clubIdx];
  const ovr = overallOf(player);
  const avgRating = player.matches ? (player.ratingSum / player.matches).toFixed(1) : "—";
  const injured = !!player.injury;

  return (
    <div className="screen">
      <div className="hero-card" style={{ borderColor: club.color + "88" }}>
        <div className="hero-left">
          <OvrRing value={ovr} size={68} />
          <div>
            <div className="hero-name">{player.name}</div>
            <div className="hero-meta">{player.position} · {player.age} سنة · {player.nationality}</div>
            <div className="hero-club" style={{ color: club.color }}><Shield size={12} /> {club.name}</div>
          </div>
        </div>
        <div className="hero-form">
          <span className="label">آخر تقييم</span>
          <span className="value">{player.lastRatings.length ? player.lastRatings[0] : "—"}</span>
        </div>
      </div>

      {injured && (
        <div className="injury-banner">
          <ShieldAlert size={15} /> {player.injury.name} — يتبقّى {player.injury.matches} مباراة/مباريات للتعافي
        </div>
      )}
      {player.national?.called && (
        <div className="injury-banner" style={{ background: "#4C9BD122", borderColor: "#4C9BD166", color: "#BEE0F7" }}>
          <Users size={15} /> لاعب دولي — {player.national.caps} مباراة مع منتخب {player.nationality}
        </div>
      )}

      <div className="stat-grid small">
        <div className="stat-box"><span>{player.matches}</span><label>مباراة</label></div>
        <div className="stat-box"><span>{player.goals}</span><label>هدف</label></div>
        <div className="stat-box"><span>{player.assists}</span><label>صناعة</label></div>
        <div className="stat-box"><span>{avgRating}</span><label>التقييم</label></div>
      </div>

      <div className="section-title">أبرز الصفات</div>
      <div className="attr-list">
        {Object.keys(player.attrs).map((k) => (
          <div className="attr-row view" key={k}>
            <span className="attr-name">{ATTR_LABELS[k]}</span>
            <div className="attr-bar"><div className="attr-fill" style={{ width: player.attrs[k] + "%" }} /></div>
            <span className="attr-val">{player.attrs[k]}</span>
          </div>
        ))}
      </div>

      <div className="section-title">العلاقات</div>
      <div className="rel-list">
        {Object.entries(player.relationships).map(([k, v]) => (
          <div className="rel-row" key={k}>
            <Users size={12} />
            <span className="rel-label">{REL_LABELS[k]}</span>
            <div className="rel-bar"><div className="rel-fill" style={{ width: v + "%" }} /></div>
            <span className="rel-val">{v}</span>
          </div>
        ))}
      </div>

      <div className="section-title">الإجراءات</div>
      <div className="action-grid">
        <button className="action-btn primary" onClick={() => onGoTab("matches")}><Trophy size={18} /> المباريات</button>
        <button className="action-btn" disabled={injured} onClick={() => onAction("technical")}><Dumbbell size={18} /> تدريب فني</button>
        <button className="action-btn" disabled={injured} onClick={() => onAction("gym")}><Dumbbell size={18} /> الجيم</button>
        <button className="action-btn" onClick={() => onAction("nutrition")}><Apple size={18} /> تغذية (5k)</button>
        <button className="action-btn" onClick={() => onAction("rest")}><Bed size={18} /> راحة واستشفاء</button>
        <button className="action-btn danger" onClick={() => onAction("retire")}><Flag size={18} /> اعتزال</button>
      </div>
    </div>
  );
}
