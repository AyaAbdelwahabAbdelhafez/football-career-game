import React, { useState } from "react";
import { Trophy, ChevronLeft } from "lucide-react";
import { POSITIONS, ATTR_LABELS } from "../../data/content.js";
import { clamp } from "../../utils/helpers.js";
import { newPlayer } from "../../systems/playerFactory.js";

export function CreateScreen({ onBack, onCreate }) {
  const [name, setName] = useState("");
  const [nat, setNat] = useState("");
  const [position, setPosition] = useState(POSITIONS[4]);
  const [color, setColor] = useState("#E4B94B");
  const base = 45;
  const [pool, setPool] = useState(24);
  const [attrs, setAttrs] = useState({ pace: base, shooting: base, passing: base, dribbling: base, defending: base, physical: base });

  const bump = (k, d) => {
    if (d > 0 && pool <= 0) return;
    if (d < 0 && attrs[k] <= base) return;
    setAttrs((a) => ({ ...a, [k]: clamp(a[k] + d, base, 80) }));
    setPool((v) => v - d);
  };
  const colors = ["#E4B94B", "#4C9BD1", "#C0453A", "#8E5CD9", "#E2963B", "#2FB673"];

  return (
    <div className="screen create">
      <div className="hero-badge"><Trophy size={26} color="#E4B94B" /></div>
      <h1>ابدأ مسيرتك الاحترافية</h1>
      <p className="sub">أنشئ لاعبك وابدأ الرحلة من الأكاديمية إلى قمة العالم</p>

      <label className="field">
        <span>الاسم</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اكتب اسم اللاعب" />
      </label>
      <label className="field">
        <span>الجنسية</span>
        <input value={nat} onChange={(e) => setNat(e.target.value)} placeholder="مثال: المغرب" />
      </label>
      <label className="field">
        <span>مركز اللعب</span>
        <div className="chip-row">
          {POSITIONS.map((p) => (
            <button key={p} className={"chip" + (position === p ? " active" : "")} onClick={() => setPosition(p)}>{p}</button>
          ))}
        </div>
      </label>
      <label className="field">
        <span>لون الطاقم</span>
        <div className="chip-row">
          {colors.map((c) => (
            <button key={c} className={"swatch" + (color === c ? " active" : "")} style={{ background: c }} onClick={() => setColor(c)} />
          ))}
        </div>
      </label>

      <div className="field">
        <span>توزيع السمات — نقاط متبقية: <b className="pool">{pool}</b></span>
        {Object.keys(attrs).map((k) => (
          <div className="attr-row" key={k}>
            <span className="attr-name">{ATTR_LABELS[k]}</span>
            <button className="mini-btn" onClick={() => bump(k, -1)}>−</button>
            <div className="attr-bar"><div className="attr-fill" style={{ width: attrs[k] + "%" }} /></div>
            <span className="attr-val">{attrs[k]}</span>
            <button className="mini-btn" onClick={() => bump(k, 1)}>+</button>
          </div>
        ))}
      </div>

      <button className="btn-primary wide" disabled={!name.trim() || !nat.trim()}
        onClick={() => onCreate(newPlayer(name.trim(), nat.trim(), position, color, attrs))}>
        انضم إلى الأكاديمية <ChevronLeft size={16} />
      </button>
      <button className="btn-secondary wide" onClick={onBack}>رجوع</button>
    </div>
  );
}
