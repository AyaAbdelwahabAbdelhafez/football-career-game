import React from "react";
import { Trophy, Users, Star, ChevronLeft, Play } from "lucide-react";
import { CLUBS } from "../../data/clubs.js";

export function ModeChoiceScreen({ onPick, savedPlayer, onContinue }) {
  return (
    <div className="screen create">
      <div className="hero-badge"><Trophy size={26} color="#E4B94B" /></div>
      <h1>ابدأ مسيرتك الاحترافية</h1>
      <p className="sub">اختر كيف تريد بدء رحلتك</p>

      {savedPlayer && (
        <button className="mode-card continue-card" onClick={onContinue}>
          <div className="mode-card-icon"><Play size={20} color="#2FB673" /></div>
          <div className="mode-card-text">
            <div className="mode-card-title">تابع مسيرتك المحفوظة</div>
            <div className="mode-card-sub">{savedPlayer.name} · {CLUBS[savedPlayer.clubIdx].name} · موسم {savedPlayer.season}</div>
          </div>
          <ChevronLeft size={16} />
        </button>
      )}

      <button className="mode-card" onClick={() => onPick("real")}>
        <div className="mode-card-icon"><Users size={22} color="#E4B94B" /></div>
        <div className="mode-card-text">
          <div className="mode-card-title">ابدأ بلاعب حقيقي</div>
          <div className="mode-card-sub">اختر نجماً معروفاً وابدأ قصة خيالية جديدة من نقطة انطلاقه</div>
        </div>
        <ChevronLeft size={16} />
      </button>

      <button className="mode-card" onClick={() => onPick("custom")}>
        <div className="mode-card-icon"><Star size={22} color="#4C9BD1" /></div>
        <div className="mode-card-text">
          <div className="mode-card-title">أنشئ لاعباً جديداً</div>
          <div className="mode-card-sub">صمّم لاعبك الخاص بالاسم والمركز والسمات التي تريدها</div>
        </div>
        <ChevronLeft size={16} />
      </button>

      <p className="muted disclaimer">ملاحظة: الأسماء الحقيقية هنا هي نقطة انطلاق فقط لقصة خيالية داخل اللعبة — كل الأحداث بعد ذلك (المباريات، الانتقالات، التصريحات) من نسج خيال المحاكاة وليست وقائع حقيقية.</p>
    </div>
  );
}
