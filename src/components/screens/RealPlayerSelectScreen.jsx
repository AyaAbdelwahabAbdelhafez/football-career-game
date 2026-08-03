import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { REAL_PLAYERS, ATTR_LABELS } from "../../data/content.js";
import { newPlayer } from "../../systems/playerFactory.js";

export function RealPlayerSelectScreen({ onBack, onCreate }) {
  const [sel, setSel] = useState(null);

  if (sel !== null) {
    const rp = REAL_PLAYERS[sel];
    return (
      <div className="screen create">
        <div className="hero-badge" style={{ borderColor: rp.color + "77" }}>
          <div className="avatar" style={{ background: rp.color, width: 40, height: 40 }}>{rp.name.charAt(0)}</div>
        </div>
        <h2>{rp.name}</h2>
        <p className="sub">{rp.flag} {rp.nationality} · {rp.position}</p>
        <div className="attr-list">
          {Object.keys(rp.attrs).map((k) => (
            <div className="attr-row view" key={k}>
              <span className="attr-name">{ATTR_LABELS[k]}</span>
              <div className="attr-bar"><div className="attr-fill" style={{ width: rp.attrs[k] + "%" }} /></div>
              <span className="attr-val">{rp.attrs[k]}</span>
            </div>
          ))}
        </div>
        <button className="btn-primary wide" onClick={() => onCreate(newPlayer(rp.name, rp.nationality, rp.position, rp.color, rp.attrs))}>
          ابدأ المسيرة بهذا اللاعب <ChevronLeft size={16} />
        </button>
        <button className="btn-secondary wide" onClick={() => setSel(null)}>رجوع للقائمة</button>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="section-title" style={{ marginTop: 4 }}>اختر لاعباً</div>
      <div className="real-player-list">
        {REAL_PLAYERS.map((rp, i) => (
          <button key={rp.name} className="real-player-row" onClick={() => setSel(i)}>
            <div className="avatar" style={{ background: rp.color }}>{rp.name.charAt(0)}</div>
            <div className="rp-info">
              <div className="rp-name">{rp.name}</div>
              <div className="rp-meta">{rp.flag} {rp.nationality} · {rp.position}</div>
            </div>
            <ChevronLeft size={16} color="#8B97AC" />
          </button>
        ))}
      </div>
      <button className="btn-secondary wide" onClick={onBack}>رجوع</button>
    </div>
  );
}
