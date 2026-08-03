import React from "react";
import { Flag } from "lucide-react";
import { flagFor } from "../../systems/nationalTeam.js";

export function NationalTeamScreen({ player }) {
  const national = player.national;

  if (!national?.called) {
    return (
      <div className="screen">
        <div className="section-title">المنتخب الوطني</div>
        <div className="nt-hero">
          <div className="nt-flag">{flagFor(player.nationality)}</div>
          <h2 style={{ marginTop: 8 }}>لم يتم استدعاؤك بعد</h2>
          <p className="muted" style={{ padding: 0 }}>واصل تألقك مع ناديك لتصل السمعة المطلوبة لاستدعاء منتخب {player.nationality}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="section-title">المنتخب الوطني</div>
      <div className="nt-hero">
        <div className="nt-flag">{flagFor(player.nationality)}</div>
        <h2 style={{ marginTop: 8 }}>منتخب {player.nationality}</h2>
        <p className="muted" style={{ padding: 0 }}>عضو رسمي في التشكيلة الدولية</p>
      </div>
      <div className="stat-grid">
        <div className="stat-box"><span>{national.caps}</span><label>مباراة دولية</label></div>
        <div className="stat-box"><span>{national.goals}</span><label>هدف دولي</label></div>
        <div className="stat-box"><span>{national.tournamentsWon || 0}</span><label>بطولة قارية/عالمية</label></div>
      </div>
      {national.tournamentsWon > 0 && (
        <div className="trophy-grid">
          {[...Array(national.tournamentsWon)].map((_, i) => (
            <div className="trophy-card" key={i}><Flag size={20} color="#E4B94B" /><span>بطولة دولية</span></div>
          ))}
        </div>
      )}
    </div>
  );
}
