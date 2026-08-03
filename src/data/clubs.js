/* ===========================================================
   CLUBS & LEAGUES
   كل نادٍ ينتمي لدوري (league). الأندية من tier 1+ مقسّمة على
   دوريات محلية حقيقية الطابع (خيالية الأسماء) في عدة دول، بحيث
   يمكن محاكاة ترتيب الدوري وبطولاته. tier 0 هي الأكاديمية فقط.
=========================================================== */

export const LEAGUES = [
  { id: "academy", name: "الأكاديمية", country: "—", flag: "🎓", tier: 0 },
  { id: "eg", name: "الدوري المصري الممتاز", country: "مصر", flag: "🇪🇬", tier: 1 },
  { id: "sa", name: "دوري روشن السعودي", country: "السعودية", flag: "🇸🇦", tier: 2 },
  { id: "fr", name: "الدوري الفرنسي", country: "فرنسا", flag: "🇫🇷", tier: 3 },
  { id: "it", name: "الدوري الإيطالي", country: "إيطاليا", flag: "🇮🇹", tier: 3 },
  { id: "es", name: "الليغا الإسبانية", country: "إسبانيا", flag: "🇪🇸", tier: 4 },
  { id: "en", name: "الدوري الإنجليزي الممتاز", country: "إنجلترا", flag: "🏴", tier: 5 },
];

// tier: كلما زاد كلما كان النادي أقوى وأصعب اختراقاً قادماً من دوري أدنى
export const CLUBS = [
  { name: "أكاديمية الفجر", league: "academy", tier: 0, strength: 30, color: "#4C9BD1", stadium: "ملعب التدريب", founded: "—", capacity: "—" },

  // الدوري المصري
  { name: "نادي الشباب المتحد", league: "eg", tier: 1, strength: 44, color: "#E2963B", stadium: "استاد الشباب", founded: 1988, capacity: "18,500" },
  { name: "النادي الأهلاوي الحديث", league: "eg", tier: 1, strength: 52, color: "#C0453A", stadium: "استاد القاهرة الكبير", founded: 1907, capacity: "74,000" },
  { name: "نادي الزمالكاوي", league: "eg", tier: 1, strength: 50, color: "#EAF0F7", stadium: "استاد الزمالك", founded: 1911, capacity: "20,000" },
  { name: "اتحاد الإسكندرية", league: "eg", tier: 1, strength: 42, color: "#4C9BD1", stadium: "استاد الإسكندرية", founded: 1914, capacity: "18,000" },
  { name: "المصري البورسعيدي", league: "eg", tier: 1, strength: 40, color: "#2FB673", stadium: "استاد بورسعيد", founded: 1920, capacity: "17,988" },
  { name: "نادي المقاولون الشباب", league: "eg", tier: 1, strength: 38, color: "#8E5CD9", stadium: "استاد المقاولون", founded: 1975, capacity: "30,000" },

  // الدوري السعودي
  { name: "نادي النجوم الذهبية", league: "sa", tier: 2, strength: 62, color: "#D9B44A", stadium: "استاد النجوم", founded: 1975, capacity: "42,000" },
  { name: "نادي الهلال الأزرق", league: "sa", tier: 2, strength: 68, color: "#4C9BD1", stadium: "استاد الملك فهد", founded: 1957, capacity: "68,000" },
  { name: "نادي النصر الأصفر", league: "sa", tier: 2, strength: 66, color: "#E4B94B", stadium: "استاد المرسول", founded: 1955, capacity: "25,000" },
  { name: "نادي الاتحاد الأخضر", league: "sa", tier: 2, strength: 64, color: "#2FB673", stadium: "استاد الجوهرة", founded: 1927, capacity: "62,000" },
  { name: "نادي الأهلي الأخضر", league: "sa", tier: 2, strength: 60, color: "#1F8F58", stadium: "استاد الأمير عبدالله", founded: 1937, capacity: "22,000" },
  { name: "نادي الشباب البرتقالي", league: "sa", tier: 2, strength: 56, color: "#E2963B", stadium: "استاد الأمير فيصل", founded: 1947, capacity: "22,000" },

  // الدوري الفرنسي
  { name: "نادي القمة الفرنسي", league: "fr", tier: 3, strength: 74, color: "#8E5CD9", stadium: "ملعب القمة", founded: 1970, capacity: "48,000" },
  { name: "أولمبيك الجنوب", league: "fr", tier: 3, strength: 72, color: "#4C9BD1", stadium: "فيلودروم الجنوب", founded: 1899, capacity: "67,000" },
  { name: "ليون الرياضي", league: "fr", tier: 3, strength: 70, color: "#C0453A", stadium: "استاد الضوء", founded: 1950, capacity: "59,000" },
  { name: "موناكو الأميري", league: "fr", tier: 3, strength: 71, color: "#E2963B", stadium: "استاد لويس الثاني", founded: 1924, capacity: "18,500" },
  { name: "ليل الشمالي", league: "fr", tier: 3, strength: 66, color: "#8CC0E8", stadium: "استاد بيار موروا", founded: 1944, capacity: "50,000" },

  // الدوري الإيطالي
  { name: "يوفنتوزو", league: "it", tier: 3, strength: 76, color: "#EAF0F7", stadium: "الاستاد القديم", founded: 1897, capacity: "41,500" },
  { name: "إنتر الشمال", league: "it", tier: 3, strength: 75, color: "#4C9BD1", stadium: "سان سيرو الجديد", founded: 1908, capacity: "75,900" },
  { name: "ميلانو الأحمر", league: "it", tier: 3, strength: 74, color: "#C0453A", stadium: "سان سيرو", founded: 1899, capacity: "75,900" },
  { name: "روما الخالدة", league: "it", tier: 3, strength: 70, color: "#E2963B", stadium: "استاد الأولمبيكو", founded: 1927, capacity: "70,600" },
  { name: "نابولي الجنوبي", league: "it", tier: 3, strength: 73, color: "#4C9BD1", stadium: "استاد دييغو مارادونا", founded: 1926, capacity: "54,700" },

  // الليغا الإسبانية
  { name: "نادي القمة الأوروبي", league: "es", tier: 4, strength: 82, color: "#8E5CD9", stadium: "ملعب القمة", founded: 1950, capacity: "61,200" },
  { name: "أتلتيكو العاصمة", league: "es", tier: 4, strength: 80, color: "#C0453A", stadium: "استاد المدينة الحمراء", founded: 1903, capacity: "68,000" },
  { name: "برشلونيا الكتالوني", league: "es", tier: 4, strength: 84, color: "#8E5CD9", stadium: "ملعب الأحلام", founded: 1899, capacity: "99,000" },
  { name: "إشبيلية الأندلسي", league: "es", tier: 4, strength: 74, color: "#E4B94B", stadium: "استاد رامون سانشيز", founded: 1890, capacity: "43,900" },
  { name: "فالنسيا الشرقي", league: "es", tier: 4, strength: 71, color: "#E2963B", stadium: "استاد ميستايا", founded: 1919, capacity: "49,400" },

  // الدوري الإنجليزي
  { name: "النخبة العالمي", league: "en", tier: 5, strength: 92, color: "#C0453A", stadium: "استاد النخبة", founded: 1902, capacity: "74,800" },
  { name: "سيتي الأزرق", league: "en", tier: 5, strength: 91, color: "#4C9BD1", stadium: "استاد الاتحاد", founded: 1880, capacity: "55,000" },
  { name: "ليفربولو الأحمر", league: "en", tier: 5, strength: 89, color: "#C0453A", stadium: "استاد أنفيلد الجديد", founded: 1892, capacity: "61,000" },
  { name: "آرسنالو الشمالي", league: "en", tier: 5, strength: 86, color: "#C0453A", stadium: "استاد الإمارات", founded: 1886, capacity: "60,700" },
  { name: "تشيلسيا الملكي", league: "en", tier: 5, strength: 85, color: "#4C9BD1", stadium: "استاد ستامفورد", founded: 1905, capacity: "40,300" },
  { name: "توتنهامو الشمالي", league: "en", tier: 5, strength: 82, color: "#EAF0F7", stadium: "استاد توتنهام الجديد", founded: 1882, capacity: "62,800" },
];

export const clubIndexByName = (name) => CLUBS.findIndex((c) => c.name === name);
export const leagueOf = (club) => LEAGUES.find((l) => l.id === club.league);
export const clubsInLeague = (leagueId) => CLUBS.filter((c) => c.league === leagueId);

// الدوريات المرشّحة للانتقال إليها القادمة من دوري بمستوى tier معيّن
export const nextTierLeagues = (currentTier) => LEAGUES.filter((l) => l.tier === currentTier + 1 || l.tier === currentTier);
