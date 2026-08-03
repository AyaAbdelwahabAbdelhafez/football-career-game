import React, { useState } from "react";
import { ChevronRight, TrendingUp, Trophy, Flag, Wallet, Newspaper } from "lucide-react";
import { CareerScreen } from "./CareerScreen.jsx";
import { LeagueScreen } from "./LeagueScreen.jsx";
import { NationalTeamScreen } from "./NationalTeamScreen.jsx";
import { FinanceScreen } from "./FinanceScreen.jsx";
import { NewsScreen } from "./NewsScreen.jsx";

const HUB_ITEMS = [
  { id: "career", label: "المسيرة والإحصائيات", icon: TrendingUp },
  { id: "league", label: "الدوري والكأس", icon: Trophy },
  { id: "national", label: "المنتخب الوطني", icon: Flag },
  { id: "finance", label: "الشؤون المالية", icon: Wallet },
  { id: "news", label: "الأخبار والتواصل", icon: Newspaper },
];

export function MoreScreen({ player, financeProps }) {
  const [section, setSection] = useState(null);

  if (section === null) {
    return (
      <div className="screen">
        <div className="section-title" style={{ marginTop: 4 }}>المزيد</div>
        <div className="hub-grid">
          {HUB_ITEMS.map((it) => {
            const Icon = it.icon;
            return (
              <button key={it.id} className="hub-card" onClick={() => setSection(it.id)}>
                <div className="hub-card-icon"><Icon size={20} color="#E4B94B" /></div>
                <div className="hub-card-title">{it.label}</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const title = HUB_ITEMS.find((h) => h.id === section)?.label || "";
  return (
    <div className="screen">
      <div className="hub-back">
        <button className="icon-btn" onClick={() => setSection(null)} aria-label="رجوع"><ChevronRight size={16} /></button>
        <h2 style={{ margin: 0 }}>{title}</h2>
      </div>
      {section === "career" && <CareerScreen player={player} />}
      {section === "league" && <LeagueScreen player={player} />}
      {section === "national" && <NationalTeamScreen player={player} />}
      {section === "finance" && <FinanceScreen player={player} {...financeProps} />}
      {section === "news" && <NewsScreen player={player} />}
    </div>
  );
}
