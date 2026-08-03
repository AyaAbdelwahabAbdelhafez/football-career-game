import React from "react";
import { Shield, Play } from "lucide-react";
import { CLUBS } from "../../data/clubs.js";

export function MatchesScreen({ player, onPlay, log }) {
  const club = CLUBS[player.clubIdx];
  const injured = !!player.injury;
  return (
    <div className="screen">
      <div className="section-title">المباراة القادمة</div>
      <div className="next-match-card" style={{ borderColor: club.color + "77" }}>
        <div className="nm-row">
          <div className="nm-team"><Shield size={20} color={club.color} /><span>{club.name}</span></div>
          <span className="nm-vs">VS</span>
          <div className="nm-team"><Shield size={20} color="#8B97AC" /><span>خصم عشوائي</span></div>
        </div>
        {injured ? (
          <p className="muted" style={{ padding: "6px 0 2px" }}>مصاب — لا يمكنك اللعب حتى تتعافى (استخدم الراحة من الرئيسية)</p>
        ) : (
          <button className="btn-primary wide" onClick={onPlay}><Play size={15} /> ابدأ المباراة</button>
        )}
      </div>

      <div className="section-title">آخر النتائج</div>
      <div className="results-list">
        {log.length === 0 && <p className="muted">لم تُلعب أي مباراة بعد.</p>}
        {log.slice(0, 8).map((m, i) => (
          <div className="result-row" key={i}>
            <span className={"badge " + (m.res === "W" ? "win" : m.res === "D" ? "draw" : "loss")}>{m.res}</span>
            <span className="rr-score">{m.g1} - {m.g2}</span>
            <span className="rr-info">{m.goals ? `⚽ ${m.goals}` : ""} {m.assists ? `🎯 ${m.assists}` : ""}</span>
            <span className="rr-rating">{m.rating}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
