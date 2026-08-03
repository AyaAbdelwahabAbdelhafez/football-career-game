import React, { useState } from "react";

export function NewsScreen({ player }) {
  const [tab, setTab] = useState("news");
  return (
    <div className="screen">
      <div className="subtabs">
        <button className={"subtab" + (tab === "news" ? " active" : "")} onClick={() => setTab("news")}>الأخبار</button>
        <button className={"subtab" + (tab === "social" ? " active" : "")} onClick={() => setTab("social")}>التواصل الاجتماعي</button>
      </div>

      {tab === "news" && (
        <>
          {(!player.newsFeed || player.newsFeed.length === 0) && <p className="muted">لا توجد أخبار بعد — ابدأ مسيرتك لتظهر هنا.</p>}
          {(player.newsFeed || []).map((n) => <div className="news-item" key={n.id}>{n.text}</div>)}
        </>
      )}

      {tab === "social" && (
        <>
          <div className="social-followers">
            <span className="value">{(player.socialFollowers || 0).toLocaleString("en-US")}</span>
            <div className="muted" style={{ padding: 0 }}>متابع</div>
          </div>
          {(!player.socialPosts || player.socialPosts.length === 0) && <p className="muted">لا توجد منشورات بعد.</p>}
          {(player.socialPosts || []).map((p, i) => <div className="social-post" key={i}>{p}</div>)}
        </>
      )}
    </div>
  );
}
