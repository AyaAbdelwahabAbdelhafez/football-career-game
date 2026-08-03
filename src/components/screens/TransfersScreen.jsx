import React from "react";
import { Shield, Check, X } from "lucide-react";

export function TransfersScreen({ player, offers, selected, setSelected, onAccept, onReject }) {
  if (offers.length === 0) {
    return (
      <div className="screen">
        <div className="section-title">عروض الانتقال</div>
        <p className="muted">لا توجد عروض حالياً — استمر في الأداء الجيد لجذب اهتمام الأندية.</p>
      </div>
    );
  }
  const off = offers[selected] || offers[0];
  const club = off.club;
  return (
    <div className="screen">
      <div className="section-title">العروض المتاحة ({offers.length})</div>
      <div className="offer-list-row">
        {offers.map((o, i) => (
          <button key={i} className={"offer-chip" + (i === selected ? " active" : "")} style={{ borderColor: o.club.color }} onClick={() => setSelected(i)}>
            <Shield size={13} color={o.club.color} /> {o.club.name}
          </button>
        ))}
      </div>

      <div className="offer-card" style={{ borderColor: club.color }}>
        <div className="offer-club" style={{ color: club.color }}>{club.name}</div>
        <div className="offer-row"><span>قيمة العرض</span><b>€{off.fee}M</b></div>
        <div className="offer-row"><span>راتب سنوي مقترح</span><b>€{off.wage}k</b></div>
        <div className="offer-row"><span>مكافأة التوقيع</span><b>€{off.bonus}k</b></div>
        <div className="offer-row"><span>مدة العقد</span><b>{off.years} مواسم</b></div>
        <div className="offer-row"><span>قوة النادي</span><b>{club.strength}</b></div>
        <div className="offer-row"><span>دور اللاعب</span><b>{off.role}</b></div>
      </div>

      <button className="btn-primary wide" onClick={() => onAccept(off)}><Check size={16} /> قبول الانتقال</button>
      <button className="btn-secondary wide" onClick={() => onReject(off)}><X size={16} /> رفض العرض</button>
    </div>
  );
}
