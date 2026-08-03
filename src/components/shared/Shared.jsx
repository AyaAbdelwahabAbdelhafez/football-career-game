import React from "react";
import { Home, CalendarDays, Shield, ArrowLeftRight, Grid3x3, Zap, DollarSign, Coins, Settings } from "lucide-react";
import { clamp, overallOf, fmtMoney } from "../../utils/helpers.js";
import { CLUBS } from "../../data/clubs.js";

export function OvrRing({ value, size = 64 }) {
  const pct = clamp(value, 0, 99) / 99;
  const bg = `conic-gradient(#E4B94B ${pct * 360}deg, #23304a 0deg)`;
  return (
    <div className="ovr-ring" style={{ width: size, height: size, background: bg }}>
      <div className="ovr-ring-inner" style={{ width: size - 10, height: size - 10 }}>
        <span>{value}</span>
      </div>
    </div>
  );
}

export function TopBar({ p, onOpenSettings }) {
  return (
    <div className="topbar">
      <div className="tb-id">
        <div className="tb-avatar" style={{ background: p.color }}>{p.name.charAt(0)}</div>
        <div>
          <div className="tb-name">{p.name.toUpperCase()}</div>
          <div className="tb-sub">{p.position}</div>
        </div>
      </div>
      <div className="tb-pills">
        <span className="pill"><Zap size={12} color="#E4B94B" />{p.energy}/100</span>
        <span className="pill"><DollarSign size={12} color="#2FB673" />{fmtMoney(p.money)}</span>
        <span className="pill"><Coins size={12} color="#E4B94B" />{p.reputation * 25}</span>
        <button className="icon-btn" onClick={onOpenSettings} aria-label="الإعدادات"><Settings size={14} /></button>
      </div>
    </div>
  );
}

export function BottomNav({ tab, setTab }) {
  const items = [
    { id: "home", label: "الرئيسية", icon: Home },
    { id: "matches", label: "المباريات", icon: CalendarDays },
    { id: "club", label: "النادي", icon: Shield },
    { id: "transfers", label: "الانتقالات", icon: ArrowLeftRight },
    { id: "more", label: "المزيد", icon: Grid3x3 },
  ];
  return (
    <div className="bottomnav">
      {items.map((it) => {
        const Icon = it.icon;
        const active = tab === it.id;
        return (
          <button key={it.id} className={"nav-btn" + (active ? " active" : "")} onClick={() => setTab(it.id)}>
            <Icon size={19} />
            <span>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function currentClub(player) {
  return CLUBS[player.clubIdx];
}
