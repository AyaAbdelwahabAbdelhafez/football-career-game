import React, { useState, useEffect, useRef } from "react";
import { rand, clamp, attrAvg } from "./utils/helpers.js";
import { loadSave, writeSave, clearSave } from "./utils/helpers.js";
import { CLUBS, clubIndexByName, leagueOf, nextTierLeagues, clubsInLeague } from "./data/clubs.js";
import { NEWS_TEMPLATES } from "./data/content.js";
import { newPlayer, ensureLeagueTable } from "./systems/playerFactory.js";
import { simulateMatchday, crownChampion, progressCup } from "./systems/competitions.js";
import { payMatchWage, sponsorIncome, maybeGenerateSponsorOffer, acceptSponsor, invest, tickInvestments, buyLuxuryItem } from "./systems/finance.js";
import { applyTraining, isFitToPlay } from "./systems/training.js";
import { checkCallUp, simulateNationalMatch, simulateTournament } from "./systems/nationalTeam.js";
import { runAwardsCeremony } from "./systems/awards.js";
import { pushNews, generateSocialPost, growFollowers } from "./systems/news.js";

import { TopBar, BottomNav } from "./components/shared/Shared.jsx";
import { ModeChoiceScreen } from "./components/screens/ModeChoiceScreen.jsx";
import { RealPlayerSelectScreen } from "./components/screens/RealPlayerSelectScreen.jsx";
import { CreateScreen } from "./components/screens/CreateScreen.jsx";
import { HomeScreen } from "./components/screens/HomeScreen.jsx";
import { MatchesScreen } from "./components/screens/MatchesScreen.jsx";
import { MatchScreen } from "./components/screens/MatchScreen.jsx";
import { ClubScreen } from "./components/screens/ClubScreen.jsx";
import { TransfersScreen } from "./components/screens/TransfersScreen.jsx";
import { MoreScreen } from "./components/screens/MoreScreen.jsx";
import { PressScreen } from "./components/screens/PressScreen.jsx";
import { RetireScreen } from "./components/screens/RetireScreen.jsx";
import { SettingsScreen } from "./components/screens/SettingsScreen.jsx";
import { AwardsCeremonyScreen } from "./components/screens/AwardsCeremonyScreen.jsx";

const MATCHES_PER_SEASON = 8;

export default function FootballCareerV2() {
  const initialSave = useRef(loadSave()).current;
  const [player, setPlayer] = useState(null);
  const [createMode, setCreateMode] = useState(null); // null | 'real' | 'custom'
  const [tab, setTab] = useState("home");
  const [overlay, setOverlay] = useState(null); // 'match' | 'press' | 'retire' | 'settings' | 'awards'
  const [pressContext, setPressContext] = useState("general");
  const [awardsResult, setAwardsResult] = useState(null);
  const [toast, setToast] = useState(null);
  const [matchLog, setMatchLog] = useState(initialSave?.matchLog || []);
  const [offers, setOffers] = useState(initialSave?.offers || []);
  const [selectedOffer, setSelectedOffer] = useState(0);
  const [savedPlayer, setSavedPlayer] = useState(initialSave?.player || null);
  const [pendingSponsor, setPendingSponsor] = useState(initialSave?.pendingSponsor || null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  // حفظ تلقائي بعد كل تغيير، حتى تُستأنف المسيرة لاحقاً
  useEffect(() => {
    if (!player) return;
    writeSave({ player, matchLog, offers, pendingSponsor });
  }, [player, matchLog, offers, pendingSponsor]);

  const handleContinue = () => {
    if (!savedPlayer) return;
    setPlayer(savedPlayer);
  };

  const handleStartNewCareer = () => {
    clearSave();
    setPlayer(null);
    setSavedPlayer(null);
    setCreateMode(null);
    setTab("home");
    setOverlay(null);
    setOffers([]);
    setMatchLog([]);
    setPendingSponsor(null);
  };

  const genOffers = (p) => {
    const club = CLUBS[p.clubIdx];
    const candidateLeagues = nextTierLeagues(club.tier).map((l) => l.id);
    const pool = CLUBS.filter((c) => c.name !== club.name && candidateLeagues.includes(c.league));
    const picks = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
    return picks.map((c) => ({
      club: c,
      fee: rand(8, 20) + c.tier * 25,
      wage: rand(3, 8) + c.tier * 6,
      bonus: rand(1, 6) + c.tier * 3,
      years: rand(3, 5),
      role: c.strength <= (attrAvg(p.attrs) + p.reputation) ? "أساسي" : "دوري احتياطي",
    }));
  };

  useEffect(() => {
    if (player && player.matches > 0 && player.matches % 6 === 0 && offers.length === 0) {
      const generated = genOffers(player);
      if (generated.length > 0) { setOffers(generated); setSelectedOffer(0); }
    }
    // eslint-disable-next-line
  }, [player?.matches]);

  /* ---------------------- Training / rest actions ---------------------- */
  const handleAction = (action) => {
    if (action === "retire") { setOverlay("retire"); return; }
    if (["technical", "gym", "nutrition", "rest"].includes(action)) {
      const { player: np, message } = applyTraining(player, action);
      setPlayer(np);
      if (message) showToast(message);
      return;
    }
  };

  /* ---------------------- Season progression ---------------------- */
  const advanceSeasonMaybe = (p0) => {
    if (!p0 || p0.matches === 0 || p0.matches % MATCHES_PER_SEASON !== 0) return;
    let np = { ...p0 };
    const club = CLUBS[np.clubIdx];

    // بطولة الدوري
    if (np.leagueTable) {
      const champion = crownChampion(np.leagueTable);
      if (champion && champion.name === club.name) {
        const league = leagueOf(club);
        const title = `بطل ${league.name} — موسم ${np.season}`;
        np.trophies = [...np.trophies, title];
        np.newsFeed = pushNews(np.newsFeed, NEWS_TEMPLATES.leagueTitle(club.name));
        showToast("🏆 لقد توّجت بلقب الدوري!");
      }
    }

    // حفل الجوائز الفردية
    const result = runAwardsCeremony(np, np.matches);
    if (result.awardsGained.length > 0) {
      np.awardsHistory = [...np.awardsHistory, { season: np.season, awards: result.awardsGained }];
      result.awardsGained.forEach((a) => {
        np.newsFeed = pushNews(np.newsFeed, NEWS_TEMPLATES.award(np.name, a));
      });
    }
    setAwardsResult(result);

    np.season += 1;
    np.age += 1;
    setPlayer(np);
    setOverlay("awards");
  };

  /* ---------------------- Match resolution ---------------------- */
  const handleMatchFinish = ({ g1, g2, goalsScored, assistsMade, injury }) => {
    const club = CLUBS[player.clubIdx];
    const won = g1 > g2, draw = g1 === g2;
    const rating = clamp(5.5 + goalsScored * 1.3 + assistsMade * 0.8 + (won ? 0.6 : draw ? 0.1 : -0.4) + rand(-3, 5) / 10, 4, 10);
    const repGain = won ? rand(1, 2) : draw ? 0 : -1;

    setMatchLog((l) => [{ res: won ? "W" : draw ? "D" : "L", g1, g2, goals: goalsScored, assists: assistsMade, rating: rating.toFixed(1) }, ...l]);

    let np = {
      ...player,
      matches: player.matches + 1, goals: player.goals + goalsScored, assists: player.assists + assistsMade,
      ratingSum: player.ratingSum + rating, energy: clamp(player.energy - rand(15, 25), 0, 100),
      morale: clamp(player.morale + (won ? 6 : draw ? 1 : -5), 0, 100), reputation: clamp(player.reputation + repGain, 1, 99),
      injury: injury || player.injury, lastRatings: [rating.toFixed(1), ...player.lastRatings].slice(0, 5),
    };

    // المالية: راتب + دخل رعاية + نضج الاستثمارات
    np = payMatchWage(np, club);
    np.money += sponsorIncome(np);
    np = tickInvestments(np);

    // ترتيب الدوري
    if (np.leagueTable) {
      np.leagueTable = simulateMatchday(np.leagueTable, club.name, { gf: g1, ga: g2 });
    }

    // الكأس المحلي — تقدّم كل 3 مباريات تقريباً
    if (np.cup && np.matches % 3 === 0) {
      const power = attrAvg(np.attrs) + np.reputation;
      const { cup, event } = progressCup(np.cup, power);
      np.cup = cup;
      if (event?.advanced) {
        showToast(`⚽ تقدّمت في الكأس: ${event.stage}`);
        if (event.won) {
          np.trophies = [...np.trophies, `بطل الكأس المحلي — موسم ${np.season}`];
          showToast("🏆 لقد أحرزت الكأس المحلي!");
        }
      }
    }

    // المنتخب الوطني
    if (!np.national?.called) {
      const callUp = checkCallUp(np);
      if (callUp) {
        np.national = callUp;
        np.newsFeed = pushNews(np.newsFeed, NEWS_TEMPLATES.callUp(np.name, np.nationality));
        showToast(`🇺🇳 تم استدعاؤك لأول مرة لمنتخب ${np.nationality}!`);
      }
    } else if (np.matches % 4 === 0) {
      const { national, scored, repGain: ntRep, text } = simulateNationalMatch(np);
      np.national = national;
      np.reputation = clamp(np.reputation + ntRep, 1, 99);
      showToast(text);
      if (np.matches % 16 === 0) {
        const t = simulateTournament(np);
        if (t.won) {
          np.national = { ...np.national, tournamentsWon: (np.national.tournamentsWon || 0) + 1 };
          np.trophies = [...np.trophies, "بطولة دولية مع المنتخب"];
          showToast("🏆 لقد فزت ببطولة دولية مع منتخبك!");
        } else {
          showToast(`المنتخب توقف عند ${t.stageReached}`);
        }
      }
    }

    // الأخبار والتواصل الاجتماعي
    if (goalsScored >= 2) np.newsFeed = pushNews(np.newsFeed, NEWS_TEMPLATES.goalStreak(np.name, goalsScored));
    if (won && (g1 - g2) >= 2) np.newsFeed = pushNews(np.newsFeed, NEWS_TEMPLATES.bigWin(np.name, club.name));
    if (injury) np.newsFeed = pushNews(np.newsFeed, NEWS_TEMPLATES.injury(np.name));
    np.socialFollowers = growFollowers(np.socialFollowers || 0, { goalsScored, won, relationships: np.relationships });
    if (Math.random() < 0.35) np.socialPosts = [generateSocialPost(np), ...(np.socialPosts || [])].slice(0, 20);

    // عرض رعاية عشوائي جديد
    if (!pendingSponsor) {
      const sponsorOffer = maybeGenerateSponsorOffer(np);
      if (sponsorOffer) setPendingSponsor(sponsorOffer);
    }

    setPlayer(np);

    setTimeout(() => {
      setOverlay(null);
      const context = injury ? "post_injury" : won ? "post_win" : draw ? "general" : "post_loss";
      if (Math.random() < 0.3) {
        setPressContext(context);
        setOverlay("press");
      } else {
        advanceSeasonMaybe(np);
      }
    }, 200);
  };

  const handlePressDone = (rel) => {
    const np = { ...player, relationships: rel };
    setPlayer(np);
    setOverlay(null);
    advanceSeasonMaybe(np);
  };

  const handleAwardsDone = () => {
    setOverlay(null);
    setAwardsResult(null);
  };

  /* ---------------------- Transfers ---------------------- */
  const handleAcceptOffer = (off) => {
    const newIdx = clubIndexByName(off.club.name);
    const updatedHistory = player.history.map((h, i) => (i === player.history.length - 1 ? { ...h, to: player.season } : h));
    updatedHistory.push({ club: off.club.name, color: off.club.color, from: player.season, to: null });
    let np = { ...player, clubIdx: newIdx, money: player.money + off.fee, morale: clamp(player.morale + 10, 0, 100), history: updatedHistory };
    np = ensureLeagueTable(np, off.club);
    np.newsFeed = pushNews(np.newsFeed, NEWS_TEMPLATES.transfer(np.name, off.club.name));
    setPlayer(np);
    showToast(`انضممت إلى ${off.club.name}! 🎉`);
    setOffers([]);
    setTab("club");
  };

  const handleRejectOffer = (off) => {
    setOffers((os) => os.filter((o) => o.club.name !== off.club.name));
    setSelectedOffer(0);
    showToast("تم رفض العرض");
  };

  /* ---------------------- Finance handlers ---------------------- */
  const handleAcceptSponsor = () => {
    if (!pendingSponsor) return;
    let np = acceptSponsor(player, pendingSponsor);
    np.newsFeed = pushNews(np.newsFeed, NEWS_TEMPLATES.contract(np.name, CLUBS[np.clubIdx].name));
    setPlayer(np);
    setPendingSponsor(null);
    showToast("تم توقيع عقد الرعاية ✅");
  };
  const handleDeclineSponsor = () => { setPendingSponsor(null); showToast("تم رفض عرض الرعاية"); };
  const handleInvest = (amount) => { setPlayer((p) => invest(p, amount)); showToast("تم استثمار المبلغ"); };
  const handleBuyItem = (itemId) => { setPlayer((p) => buyLuxuryItem(p, itemId)); showToast("تم الشراء بنجاح 🎉"); };

  const financeProps = {
    pendingSponsor, onAcceptSponsor: handleAcceptSponsor, onDeclineSponsor: handleDeclineSponsor,
    onInvest: handleInvest, onBuyItem: handleBuyItem,
  };

  return (
    <div className="app-root" dir="rtl">
      {player && overlay === null && <TopBar p={player} onOpenSettings={() => setOverlay("settings")} />}

      {!player && createMode === null && <ModeChoiceScreen onPick={setCreateMode} savedPlayer={savedPlayer} onContinue={handleContinue} />}
      {!player && createMode === "real" && <RealPlayerSelectScreen onBack={() => setCreateMode(null)} onCreate={(p) => setPlayer(p)} />}
      {!player && createMode === "custom" && <CreateScreen onBack={() => setCreateMode(null)} onCreate={(p) => setPlayer(p)} />}

      {player && overlay === null && tab === "home" && <HomeScreen key="home" player={player} onAction={handleAction} onGoTab={setTab} />}
      {player && overlay === null && tab === "matches" && <MatchesScreen key="matches" player={player} log={matchLog} onPlay={() => isFitToPlay(player) && setOverlay("match")} />}
      {player && overlay === null && tab === "club" && <ClubScreen key="club" player={player} />}
      {player && overlay === null && tab === "transfers" && (
        <TransfersScreen key="transfers" player={player} offers={offers} selected={selectedOffer} setSelected={setSelectedOffer} onAccept={handleAcceptOffer} onReject={handleRejectOffer} />
      )}
      {player && overlay === null && tab === "more" && <MoreScreen key="more" player={player} financeProps={financeProps} />}

      {player && overlay === "match" && <MatchScreen player={player} onFinish={handleMatchFinish} />}
      {player && overlay === "press" && <PressScreen player={player} context={pressContext} onDone={handlePressDone} />}
      {player && overlay === "retire" && <RetireScreen player={player} onRestart={handleStartNewCareer} />}
      {player && overlay === "awards" && awardsResult && <AwardsCeremonyScreen result={awardsResult} onDone={handleAwardsDone} />}
      {player && overlay === "settings" && (
        <SettingsScreen player={player} onClose={() => setOverlay(null)} onNewCareer={handleStartNewCareer} />
      )}

      {player && overlay === null && <BottomNav tab={tab} setTab={setTab} />}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
