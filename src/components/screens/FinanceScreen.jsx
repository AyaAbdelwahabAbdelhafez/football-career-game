import React, { useState } from "react";
import { fmtMoney } from "../../utils/helpers.js";
import { netWorth } from "../../systems/finance.js";
import { LUXURY_ITEMS } from "../../data/content.js";

export function FinanceScreen({ player, pendingSponsor, onAcceptSponsor, onDeclineSponsor, onInvest, onBuyItem }) {
  const [tab, setTab] = useState("overview");
  const [investAmount, setInvestAmount] = useState("");

  return (
    <div className="screen">
      <div className="finance-hero">
        <span className="value">€{fmtMoney(netWorth(player))}</span>
        <span className="label">صافي الثروة (نقد + استثمارات + مقتنيات)</span>
      </div>

      <div className="subtabs">
        <button className={"subtab" + (tab === "overview" ? " active" : "")} onClick={() => setTab("overview")}>نظرة عامة</button>
        <button className={"subtab" + (tab === "invest" ? " active" : "")} onClick={() => setTab("invest")}>استثمار</button>
        <button className={"subtab" + (tab === "shop" ? " active" : "")} onClick={() => setTab("shop")}>مقتنيات</button>
      </div>

      {tab === "overview" && (
        <>
          {pendingSponsor && (
            <div className="sponsor-card" style={{ borderColor: "#E4B94B77" }}>
              <div className="sponsor-card-head"><span>عرض رعاية جديد!</span></div>
              <div className="offer-row"><span>الجهة</span><b>{pendingSponsor.brand}</b></div>
              <div className="offer-row"><span>النوع</span><b>{pendingSponsor.type}</b></div>
              <div className="offer-row"><span>مكافأة التوقيع</span><b>€{fmtMoney(pendingSponsor.signing)}</b></div>
              <div className="offer-row"><span>دخل دوري</span><b>€{fmtMoney(pendingSponsor.weekly)} / مباراة</b></div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button className="btn-primary wide" style={{ marginTop: 0 }} onClick={onAcceptSponsor}>قبول</button>
                <button className="btn-secondary wide" style={{ marginTop: 0 }} onClick={onDeclineSponsor}>رفض</button>
              </div>
            </div>
          )}

          <div className="section-title">عقود الرعاية الحالية</div>
          {(!player.sponsors || player.sponsors.length === 0) && <p className="muted">لا توجد عقود رعاية بعد.</p>}
          {(player.sponsors || []).map((s) => (
            <div className="sponsor-card" key={s.id}>
              <div className="sponsor-card-head"><span>{s.brand}</span><span className="muted" style={{ padding: 0 }}>{s.type}</span></div>
              <div className="offer-row"><span>دخل دوري</span><b>€{fmtMoney(s.weekly)} / مباراة</b></div>
            </div>
          ))}
        </>
      )}

      {tab === "invest" && (
        <>
          <p className="muted" style={{ textAlign: "start", padding: "0 2px 10px" }}>استثمر جزءاً من أموالك؛ يعود المبلغ بعد عدة مباريات بربح أو خسارة عشوائية.</p>
          <div className="invest-input-row" style={{ marginBottom: 14 }}>
            <input type="number" placeholder="المبلغ (k)" value={investAmount} onChange={(e) => setInvestAmount(e.target.value)} />
            <button className="small-btn" onClick={() => { const n = Number(investAmount); if (n > 0) { onInvest(n); setInvestAmount(""); } }}>استثمر</button>
          </div>
          <div className="section-title">استثمارات نشطة</div>
          {(!player.investments || player.investments.length === 0) && <p className="muted">لا توجد استثمارات نشطة.</p>}
          {(player.investments || []).map((inv) => (
            <div className="invest-card" key={inv.id}>
              <div className="offer-row"><span>المبلغ المستثمر</span><b>€{fmtMoney(inv.amount)}</b></div>
              <div className="offer-row"><span>ينضج خلال</span><b>{inv.maturesInMatches} مباراة/مباريات</b></div>
            </div>
          ))}
        </>
      )}

      {tab === "shop" && (
        <>
          <p className="muted" style={{ textAlign: "start", padding: "0 2px 10px" }}>مشتريات فاخرة ترفع من راحتك النفسية وسمعتك.</p>
          {LUXURY_ITEMS.map((item) => {
            const owned = (player.assets || []).includes(item.id);
            return (
              <div className="item-card" key={item.id}>
                <span className="item-icon">{item.icon}</span>
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-meta">€{fmtMoney(item.cost)} · معنويات +{item.moraleBoost}</div>
                </div>
                {owned ? <span className="owned-tag">مملوك ✓</span> : (
                  <button className="small-btn" disabled={player.money < item.cost} onClick={() => onBuyItem(item.id)}>شراء</button>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
