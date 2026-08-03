import React, { useState } from "react";
import { ChevronRight, Flag } from "lucide-react";
import { CLUBS } from "../../data/clubs.js";

export function SettingsScreen({ player, onClose, onNewCareer }) {
  const [confirmNew, setConfirmNew] = useState(false);
  return (
    <div className="screen settings">
      <div className="settings-head">
        <button className="icon-btn" onClick={onClose} aria-label="رجوع"><ChevronRight size={16} /></button>
        <h2>الإعدادات</h2>
        <span style={{ width: 26 }} />
      </div>

      <div className="section-title">اللاعب الحالي</div>
      <div className="info-list">
        <div className="info-row"><span>الاسم</span><b>{player.name}</b></div>
        <div className="info-row"><span>النادي</span><b>{CLUBS[player.clubIdx].name}</b></div>
        <div className="info-row"><span>الموسم</span><b>{player.season}</b></div>
      </div>

      <div className="section-title">الحفظ</div>
      <p className="muted" style={{ padding: "0 4px 6px", textAlign: "start" }}>
        يتم حفظ مسيرتك تلقائياً على هذا الجهاز بعد كل إجراء، ويمكنك متابعتها لاحقاً من الشاشة الرئيسية.
      </p>

      <div className="section-title">حول اللعبة</div>
      <p className="muted" style={{ padding: "0 4px 6px", textAlign: "start" }}>
        مسيرة اللاعب الاحترافية — نموذج أولي للعب والتجربة. كل الأحداث (المباريات، الانتقالات، التصريحات الصحفية)
        نتاج محاكاة عشوائية داخل اللعبة وليست وقائع حقيقية.
      </p>

      {!confirmNew ? (
        <button className="action-btn danger wide-btn" onClick={() => setConfirmNew(true)}>
          <Flag size={16} /> بدء مسيرة جديدة (حذف المحفوظة الحالية)
        </button>
      ) : (
        <div className="confirm-box">
          <p>هل أنت متأكد؟ ستفقد كل تقدمك الحالي نهائياً.</p>
          <div className="confirm-row">
            <button className="btn-secondary" onClick={() => setConfirmNew(false)}>تراجع</button>
            <button className="btn-primary danger-btn" onClick={onNewCareer}>تأكيد الحذف</button>
          </div>
        </div>
      )}
    </div>
  );
}
