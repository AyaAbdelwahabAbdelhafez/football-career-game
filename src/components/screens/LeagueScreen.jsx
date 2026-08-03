import React, { useState } from "react";
import { CLUBS, leagueOf } from "../../data/clubs.js";
import { CUP_STAGES } from "../../systems/competitions.js";

export function LeagueScreen({ player }) {
  const [tab, setTab] = useState("table");
  const club = CLUBS[player.clubIdx];
  const league = leagueOf(club);

  if (club.league === "academy") {
    return (
      <div className="screen">
        <div className="section-title">الدوري والكأس</div>
        <p className="muted">أنت حالياً في الأكاديمية — الترتيب والبطولات تبدأ عند انضمامك لأول نادٍ في دوري رسمي.</p>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="subtabs">
        <button className={"subtab" + (tab === "table" ? " active" : "")} onClick={() => setTab("table")}>{league.name}</button>
        <button className={"subtab" + (tab === "cup" ? " active" : "")} onClick={() => setTab("cup")}>الكأس المحلي</button>
      </div>

      {tab === "table" && (
        <>
          {!player.leagueTable ? (
            <p className="muted">لا توجد بيانات ترتيب بعد — العب أول مباراة دورية لبناء الجدول.</p>
          ) : (
            <table className="league-table">
              <thead>
                <tr>
                  <th style={{ textAlign: "start" }}>#</th>
                  <th>لعب</th><th>ف</th><th>ت</th><th>خ</th><th>+/-</th><th>نقاط</th>
                </tr>
              </thead>
              <tbody>
                {player.leagueTable.map((r, i) => (
                  <tr key={r.name} className={r.name === club.name ? "me" : ""}>
                    <td className="team-cell">
                      <span>{i + 1}.</span>
                      <span className="dot" style={{ background: r.color }} />
                      <span>{r.name}</span>
                    </td>
                    <td>{r.played}</td><td>{r.w}</td><td>{r.d}</td><td>{r.l}</td>
                    <td>{r.gf - r.ga}</td><td className="pts">{r.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {tab === "cup" && (
        <div className="cup-stage-list">
          {CUP_STAGES.map((stage, i) => {
            const cup = player.cup || { stageIdx: -1, out: false };
            let status = "pending";
            if (i < cup.stageIdx) status = "done";
            else if (i === cup.stageIdx && !cup.out) status = "current";
            else if (i === cup.stageIdx && cup.out) status = "current";
            return (
              <div key={stage} className={"cup-stage-row " + status}>
                <span>{stage}</span>
                <span>{status === "done" ? "✅ تجاوزته" : status === "current" && cup.out ? "❌ خرجت هنا" : status === "current" ? "🔵 المرحلة الحالية" : "—"}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
