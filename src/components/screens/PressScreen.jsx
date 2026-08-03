import React, { useState, useRef } from "react";
import { Newspaper } from "lucide-react";
import { clamp, rand } from "../../utils/helpers.js";
import { PRESS_BANKS } from "../../data/content.js";

export function PressScreen({ player, context, onDone }) {
  const bank = PRESS_BANKS[context] || PRESS_BANKS.general;
  const general = PRESS_BANKS.general;
  const questionsRef = useRef([
    bank[rand(0, bank.length - 1)],
    general[rand(0, general.length - 1)],
  ]);
  const questions = questionsRef.current;

  const [i, setI] = useState(0);
  const [rel, setRel] = useState(player.relationships);
  const pick = (opt) => {
    const nr = { ...rel };
    Object.entries(opt.d).forEach(([k, v]) => (nr[k] = clamp((nr[k] || 50) + v, 0, 100)));
    setRel(nr);
    if (i + 1 < questions.length) setI(i + 1); else onDone(nr);
  };
  return (
    <div className="screen press">
      <div className="hero-badge"><Newspaper size={22} color="#E4B94B" /></div>
      <h2>المؤتمر الصحفي</h2>
      <p className="press-q">الصحفي: {questions[i].q}</p>
      <div className="press-opts">
        {questions[i].options.map((o, idx) => (
          <button key={idx} className="btn-secondary wide" onClick={() => pick(o)}>{o.t}</button>
        ))}
      </div>
    </div>
  );
}
