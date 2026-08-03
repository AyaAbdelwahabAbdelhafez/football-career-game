import React from "react";
import { Shield } from "lucide-react";
import { rand, clamp } from "../../utils/helpers.js";
import { CLUBS, leagueOf } from "../../data/clubs.js";

export function ClubScreen({ player }) {
  const club = CLUBS[player.clubIdx];
  const league = leagueOf(club);
  return (
    <div className="screen">
      <div className="club-hero" style={{ borderColor: club.color + "88" }}>
        <div className="club-hero-badge" style={{ background: club.color }}><Shield size={26} color="#070B14" /></div>
        <div className="club-hero-name">{club.name}</div>
        <div className="club-hero-country">{league.flag} {league.name}</div>
      </div>
      <div className="stat-grid">
        <div className="stat-box"><span>{club.founded}</span><label>التأسيس</label></div>
        <div className="stat-box"><span>{club.strength}</span><label>قوة الفريق</label></div>
        <div className="stat-box"><span>{club.capacity}</span><label>سعة الملعب</label></div>
      </div>
      <div className="section-title">معلومات النادي</div>
      <div className="info-list">
        <div className="info-row"><span>الملعب</span><b>{club.stadium}</b></div>
        <div className="info-row"><span>الدوري</span><b>{league.flag} {league.name}</b></div>
        <div className="info-row"><span>مستواك في التشكيلة</span><b>{player.reputation >= club.tier * 15 ? "أساسي" : "احتياطي"}</b></div>
      </div>
      <div className="section-title">زملاء الفريق</div>
      <div className="teammate-list">
        {["حارس المرمى", "قلب دفاع", "صانع ألعاب", "جناح أيمن"].map((role, i) => (
          <div className="teammate-row" key={i}>
            <div className="tm-avatar" style={{ background: club.color }}>{role.charAt(0)}</div>
            <div>
              <div className="tm-role">{role}</div>
              <div className="tm-ovr">تقييم {clamp(club.strength + rand(-6, 6), 40, 95)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
