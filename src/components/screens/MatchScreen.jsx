import React, { useState, useEffect, useRef } from "react";
import { rand, attrAvg } from "../../utils/helpers.js";
import { CLUBS } from "../../data/clubs.js";
import { maybeMatchInjury } from "../../systems/training.js";

const CONFETTI_COLORS = ["#E4B94B", "#2FB673", "#4C9BD1", "#F3AFA5", "#EAF0F7"];

// مواقع أساسية تقريبية على الملعب لتوزيع اللاعبين (تشكيلة بسيطة 1-4-3)
const MY_SLOTS = [
  { x: 60, y: 200 }, { x: 150, y: 90 }, { x: 150, y: 200 }, { x: 150, y: 310 },
  { x: 260, y: 60 }, { x: 260, y: 200 }, { x: 260, y: 340 }, { x: 340, y: 130 },
];
const OPP_SLOTS = [
  { x: 640, y: 200 }, { x: 550, y: 90 }, { x: 550, y: 200 }, { x: 550, y: 310 },
  { x: 440, y: 60 }, { x: 440, y: 200 }, { x: 440, y: 340 }, { x: 360, y: 270 },
];

function jitter(slot, spread = 22) {
  return { x: slot.x + rand(-spread, spread), y: slot.y + rand(-spread, spread) };
}

export function MatchScreen({ player, onFinish }) {
  const [log, setLog] = useState(["صافرة البداية!"]);
  const [minute, setMinute] = useState(0);
  const [score, setScore] = useState([0, 0]);
  const [ballPos, setBallPos] = useState({ x: 350, y: 200 });
  const [heroPos, setHeroPos] = useState({ x: 260, y: 200 });
  const [myPos, setMyPos] = useState(MY_SLOTS.slice(1).map((s) => jitter(s)));
  const [oppPos, setOppPos] = useState(OPP_SLOTS.slice(1).map((s) => jitter(s)));
  const [done, setDone] = useState(false);
  const [flash, setFlash] = useState(null); // 'me' | 'opp' | null
  const [heroPose, setHeroPose] = useState("run"); // run | celebrate | down
  const [confetti, setConfetti] = useState([]);
  const [momentum, setMomentum] = useState(50); // % لصالحك
  const timerRef = useRef(null);
  const eventsRef = useRef([]);
  const flashTimeoutRef = useRef(null);
  const poseTimeoutRef = useRef(null);

  const triggerFlash = (kind) => {
    setFlash(kind);
    clearTimeout(flashTimeoutRef.current);
    flashTimeoutRef.current = setTimeout(() => setFlash(null), 900);
  };

  const triggerCelebration = () => {
    setHeroPose("celebrate");
    setConfetti(
      Array.from({ length: 22 }, (_, i) => ({
        id: `${Date.now()}-${i}`,
        left: rand(6, 94),
        delay: rand(0, 250) / 1000,
        dur: rand(900, 1500) / 1000,
        color: CONFETTI_COLORS[rand(0, CONFETTI_COLORS.length - 1)],
        rot: rand(-90, 90),
      }))
    );
    clearTimeout(poseTimeoutRef.current);
    poseTimeoutRef.current = setTimeout(() => { setHeroPose("run"); setConfetti([]); }, 1600);
  };

  const triggerInjuryPose = () => {
    setHeroPose("down");
    clearTimeout(poseTimeoutRef.current);
    poseTimeoutRef.current = setTimeout(() => setHeroPose("run"), 1400);
  };

  useEffect(() => {
    const club = CLUBS[player.clubIdx];
    const oppStrength = club.strength + rand(-8, 12);
    const myStrength = attrAvg(player.attrs) + player.reputation;
    const myChance = myStrength / (myStrength + oppStrength);
    setMomentum(Math.round(myChance * 100));

    const events = [];
    for (let i = 0; i < 6; i++) {
      const minuteMark = rand(i * 15 + 3, i * 15 + 14);
      const roll = Math.random();
      let type = "possession";
      if (roll < myChance * 0.35) type = "goal_me";
      else if (roll < myChance * 0.35 + (1 - myChance) * 0.3) type = "goal_opp";
      else if (roll < myChance * 0.35 + (1 - myChance) * 0.3 + 0.12) type = "chance_me";
      events.push({ minute: minuteMark, type });
    }
    events.sort((a, b) => a.minute - b.minute);
    eventsRef.current = events;

    let idx = 0, m = 0, g1 = 0, g2 = 0, goalsScored = 0, assistsMade = 0, injury = null;

    timerRef.current = setInterval(() => {
      m += 3;
      setMinute((v) => Math.min(v + 3, 90));
      setBallPos({ x: rand(90, 610), y: rand(60, 340) });
      setHeroPos(jitter(MY_SLOTS[5], 55));
      setMyPos(MY_SLOTS.slice(1).map((s) => jitter(s)));
      setOppPos(OPP_SLOTS.slice(1).map((s) => jitter(s)));
      setMomentum((v) => Math.max(18, Math.min(82, v + rand(-6, 6))));

      while (idx < events.length && events[idx].minute <= m) {
        const ev = events[idx];
        if (ev.type === "goal_me") {
          g1 += 1;
          triggerFlash("me");
          triggerCelebration();
          if (Math.random() < 0.55) { goalsScored += 1; setLog((l) => [`⚽ ${ev.minute}' هدف لك! تسديدة رائعة`, ...l]); }
          else { assistsMade += 1; setLog((l) => [`⚽ ${ev.minute}' هدف لفريقك — صناعتك كانت المفتاح`, ...l]); }
        } else if (ev.type === "goal_opp") {
          g2 += 1;
          triggerFlash("opp");
          setLog((l) => [`💢 ${ev.minute}' هدف للخصم`, ...l]);
        } else if (ev.type === "chance_me") {
          setLog((l) => [`🔥 ${ev.minute}' فرصة خطيرة لك.. اصطدمت بالحارس`, ...l]);
          if (!injury) {
            const inj = maybeMatchInjury(0.06);
            if (inj) {
              injury = inj;
              triggerInjuryPose();
              setLog((l) => [`🚑 ${ev.minute}' ${inj.name} أثناء المحاولة`, ...l]);
            }
          }
        }
        idx += 1;
      }
      setScore([g1, g2]);

      if (m >= 90) {
        clearInterval(timerRef.current);
        setLog((l) => ["🏁 صافرة النهاية", ...l]);
        setDone(true);
        setTimeout(() => onFinish({ g1, g2, goalsScored, assistsMade, injury }), 900);
      }
    }, 480);

    return () => { clearInterval(timerRef.current); clearTimeout(flashTimeoutRef.current); clearTimeout(poseTimeoutRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const oppColor = "#C0453A";
  const clubName = CLUBS[player.clubIdx].name;

  return (
    <div className="screen match">
      {flash && (
        <div className={"goal-flash " + flash}>
          {flash === "me" ? "⚽ GOAL!" : "💢"}
        </div>
      )}
      <div className={"pitch-shell" + (flash === "me" ? " shake" : "")}>
        <div className="match-head">
          <span className="mh-badge" style={{ background: player.color }}>{clubName.slice(0, 1)}</span>
          <div className="mh-center">
            <span className="mh-min">الدقيقة {minute}'</span>
            <span className="score">{score[0]} - {score[1]}</span>
          </div>
          <span className="mh-badge opp">{"خ"}</span>
        </div>

        <div className="momentum-bar" title="السيطرة على المباراة">
          <div className="momentum-fill" style={{ width: momentum + "%" }} />
        </div>

        <svg viewBox="0 0 700 400" className="pitch">
          <defs>
            <linearGradient id="floodlight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EAF0F7" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#EAF0F7" stopOpacity="0" />
            </linearGradient>
            <symbol id="p-run" viewBox="-10 -16 20 32">
              <circle cx="0" cy="-10" r="4" />
              <line className="torso" x1="0" y1="-6" x2="0" y2="4" strokeWidth="4" strokeLinecap="round" />
              <line className="leg leg-a" x1="0" y1="4" x2="-5" y2="14" strokeWidth="3.4" strokeLinecap="round" />
              <line className="leg leg-b" x1="0" y1="4" x2="5" y2="14" strokeWidth="3.4" strokeLinecap="round" />
            </symbol>
            <symbol id="p-celebrate" viewBox="-10 -20 20 34">
              <circle cx="0" cy="-14" r="4" />
              <line x1="0" y1="-10" x2="0" y2="2" strokeWidth="4" strokeLinecap="round" />
              <line x1="0" y1="-9" x2="-8" y2="-18" strokeWidth="3.2" strokeLinecap="round" />
              <line x1="0" y1="-9" x2="8" y2="-18" strokeWidth="3.2" strokeLinecap="round" />
              <line x1="0" y1="2" x2="-6" y2="12" strokeWidth="3.4" strokeLinecap="round" />
              <line x1="0" y1="2" x2="6" y2="12" strokeWidth="3.4" strokeLinecap="round" />
            </symbol>
            <symbol id="p-down" viewBox="-16 -6 32 12">
              <circle cx="-11" cy="0" r="4" />
              <line x1="-7" y1="0" x2="9" y2="0" strokeWidth="4" strokeLinecap="round" />
              <line x1="9" y1="0" x2="14" y2="-4" strokeWidth="3" strokeLinecap="round" />
              <line x1="9" y1="0" x2="14" y2="4" strokeWidth="3" strokeLinecap="round" />
            </symbol>
          </defs>

          {/* أرضية الملعب */}
          <rect x="0" y="0" width="700" height="400" fill="#0E3B2A" />
          {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={i * 140} y="0" width="140" height="400" fill={i % 2 === 0 ? "#123f2c" : "#0E3B2A"} />)}
          <rect x="8" y="8" width="684" height="384" fill="none" stroke="#EAF0F755" strokeWidth="2" />
          <line x1="350" y1="8" x2="350" y2="392" stroke="#EAF0F755" strokeWidth="2" />
          <circle cx="350" cy="200" r="55" fill="none" stroke="#EAF0F755" strokeWidth="2" />
          <rect x="8" y="120" width="70" height="160" fill="none" stroke="#EAF0F755" strokeWidth="2" />
          <rect x="622" y="120" width="70" height="160" fill="none" stroke="#EAF0F755" strokeWidth="2" />

          {/* أضواء الملعب */}
          <rect x="0" y="0" width="700" height="90" fill="url(#floodlight)" className="floodlight-glow" />

          {/* لاعبو فريقك */}
          {myPos.map((p, i) => (
            <g key={"m" + i} className="player-figure" style={{ transform: `translate(${p.x}px, ${p.y}px)` }}>
              <use href="#p-run" width="20" height="32" x="-10" y="-16" style={{ color: player.color }} />
            </g>
          ))}
          {/* بطلك */}
          <g className={"player-figure hero " + heroPose} style={{ transform: `translate(${heroPos.x}px, ${heroPos.y}px)` }}>
            <circle r="15" className="hero-ring" fill="none" />
            <use
              href={heroPose === "celebrate" ? "#p-celebrate" : heroPose === "down" ? "#p-down" : "#p-run"}
              width={heroPose === "down" ? "32" : "22"}
              height={heroPose === "down" ? "12" : "36"}
              x={heroPose === "down" ? "-16" : "-11"}
              y={heroPose === "down" ? "-6" : "-18"}
              style={{ color: player.color }}
            />
          </g>

          {/* لاعبو الخصم */}
          {oppPos.map((p, i) => (
            <g key={"o" + i} className="player-figure opp" style={{ transform: `translate(${p.x}px, ${p.y}px)` }}>
              <use href="#p-run" width="20" height="32" x="-10" y="-16" style={{ color: oppColor }} />
            </g>
          ))}

          {/* الكرة */}
          <g className="ball-wrap" style={{ transform: `translate(${ballPos.x}px, ${ballPos.y}px)` }}>
            <circle r="6.5" className="ball" />
          </g>
        </svg>

        {confetti.length > 0 && (
          <div className="confetti-layer">
            {confetti.map((c) => (
              <span
                key={c.id}
                className="confetti-piece"
                style={{
                  left: c.left + "%",
                  background: c.color,
                  animationDelay: c.delay + "s",
                  animationDuration: c.dur + "s",
                  "--rot": c.rot + "deg",
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="match-log">
        {log.slice(0, 5).map((l, i) => <div key={i} className="log-line">{l}</div>)}
      </div>
      {done && <div className="match-done-tag">جاري إعداد التقرير…</div>}
    </div>
  );
}
