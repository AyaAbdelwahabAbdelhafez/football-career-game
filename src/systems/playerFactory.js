/* ===========================================================
   PLAYER FACTORY — إنشاء كائن لاعب جديد بكل الحقول المطلوبة
   لكل الأنظمة (المالية، الإصابات، المنتخب، الدوري، الأخبار...)
=========================================================== */
import { CLUBS } from "../data/clubs.js";
import { initLeagueTable, startCupRun } from "./competitions.js";

export function newPlayer(name, nationality, position, color, attrs) {
  const startClub = CLUBS[0];
  return {
    name, nationality, position, color, attrs,
    age: 16, season: 1, clubIdx: 0, reputation: 5, morale: 72, energy: 100, money: 200,
    matches: 0, goals: 0, assists: 0, ratingSum: 0, trophies: [],
    relationships: { coach: 60, teammates: 65, fans: 40, media: 50, family: 80 },
    injury: null, retired: false,
    history: [{ club: startClub.name, color: startClub.color, from: 1, to: null }],
    lastRatings: [],

    // ---- النظام المالي ----
    sponsors: [],
    investments: [],
    assets: [],
    lastWage: 0,

    // ---- الدوري والكأس ----
    leagueTable: null, // يُبنى عند أول انضمام لدوري فعلي (ليس الأكاديمية)
    cup: null,

    // ---- المنتخب الوطني ----
    national: null, // { called, caps, goals, tournamentsWon }

    // ---- الجوائز ----
    awardsHistory: [], // [{season, awards: [...]}]

    // ---- الأخبار والتواصل الاجتماعي ----
    newsFeed: [],
    socialFollowers: rand0(500, 2000),
    socialPosts: [],
  };
}

function rand0(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function ensureLeagueTable(player, club) {
  if (club.league === "academy") return player;
  if (player.leagueTable && player.leagueTable.some((r) => r.name === club.name)) return player;
  return { ...player, leagueTable: initLeagueTable(club), cup: startCupRun() };
}
