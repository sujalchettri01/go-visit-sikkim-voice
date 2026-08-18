// ─── aidata2.ts ─────────────────────────────────────────────────────────
// SENSITIVE DATA ONLY — permits (PAP, RAP), documents required, and
// responsible-tourism Do's & Don'ts. This is Tier 2: unlike business data
// (aidata1.ts), wrong information here isn't just an awkward correction —
// it could mean someone gets turned away at a checkpoint, misses a required
// document, or puts themselves at risk. Kept in its own file specifically
// so it's never mixed in with pricing/package edits and always gets the
// same "copy it exactly, don't paraphrase" treatment.
//
// Every fact below is copied VERBATIM from Sikkim Tourism's real permit
// documentation — never paraphrased, never summarized loosely. The AI is
// instructed (see chatPrompt.cjs) to ALWAYS call searchFacts for any
// permit-related question — general or place-specific — rather than answer
// from its own training knowledge, because a plausible-sounding but wrong
// permit rule is exactly the kind of error that matters most here.
//
// How it's used: aiTools.ts reads FACTS from this file (separately from
// aidata1.ts's business data) and exposes it via the searchFacts tool.


// ═══════════════════════════════════════════════════════════════════════
// OTHER EXACT FACTS
// ═══════════════════════════════════════════════════════════════════════
// Checked BEFORE the AI is ever called for general questions (see
// findLocalAnswer in chatLogic.tsx) — but more importantly, ALSO reachable
// via the searchFacts tool (aiTools.ts) mid-conversation, so the AI can
// pull an exact fact even in the middle of a longer answer instead of only
// on the very first message. Every answer below is copied verbatim from
// Sikkim Tourism's real Protected Area Permit (PAP) requirements — the AI
// is instructed to retrieve these rather than paraphrase permit rules from
// memory, since a paraphrased permit rule is exactly the kind of thing that
// could mislead a traveler.
export const FACTS: string[] = [
  "Protected Area Permit (PAP) overview: Required for domestic and foreign tourists visiting Sikkim's protected areas, issued by the Tourism & Civil Aviation Department, Police Check Posts, and authorised offices through registered Travel Agencies. Domestic tourists and locals can get PAPs for protected areas across Sikkim. Foreign tourists are only permitted for Tsomgo Lake (East Sikkim) and the Lachen–Lachung–Yumthang–Thangu Valley area (North Sikkim) — foreigners are not permitted at Nathula Pass, Gurudongmar Lake, or Zuluk. Motorbikes must have an engine capacity of 150cc or higher to enter PAP areas.",

  "Nathula Pass permit: For Indian nationals only — foreigners are NOT allowed. Permit is issued by the Tourism Department, and the vehicle permit by the Police Check Post, applied through a registered Travel Agency. Documents required for Indians: Voter ID or Driving License, plus 2 passport-size photographs. Kids below 18 need their birth certificate or father's Voter ID/passport — Aadhaar card is NOT accepted as ID for this permit.",

  "Gurudongmar Lake permit: For Indian nationals, permit is issued by the Police Check Post. Documents required: Voter ID or Driving License, plus 2 passport-size photographs (kids below 18 need birth certificate or father's Voter ID/passport — Aadhaar is NOT accepted). Foreigners are NOT allowed to Gurudongmar Lake itself, but foreigners MAY visit Lachen and Yumthang — for that, foreigners need a photocopy of a valid passport, Indian visa, 2 passport-size photos, original documents, and an Inner Line Permit (ILP).",

  "Zuluk permit: For Indian nationals only — foreigners are NOT allowed. Documents required: Voter ID or Driving License, plus 2 passport-size photographs. Kids below 18 need birth certificate or father's Voter ID/passport — Aadhaar is NOT accepted as ID for this permit.",

  "Tsomgo Lake and Baba Mandir permit: Issued by the Police Check Post for domestic tourists. Foreign tourists ARE allowed here (unlike Nathula or Gurudongmar) — the permit for foreigners is issued by the Tourism & Civil Aviation Department, with the vehicle permit from the Police Check Post, applied through a registered Travel Agency.",

  "Yumthang Valley permit: Issued by the Police Check Post for domestic tourists. For foreign tourists, the permit is issued by the Tourism Department and the vehicle permit from the Police Check Post.",

  "Yumesamdong (Zero Point) permit: Issued by the Police Check Post for domestic tourists. For foreign tourists, the permit is issued by the Tourism Department and the vehicle pass from the Police Check Post.",

  "Thangu–Chopta Valley permit: Issued by the Police Check Post for domestic tourists. For foreign tourists, the permit is issued by the Tourism Department and the vehicle permit by the Police Check Post — foreigners must apply through a Sikkim Tourism registered Travel Agent, and must travel in groups of two or more.",

  "Dzongri Trek permit: Issued by TIC (Tourist Information Centre) Pelling and TIC Gangtok.",

  "Singalila Trek permit: Issued by TIC Pelling, after clearance from the Home Department, Forest Department, and Army — applied through a registered Travel Agency.",

  "Maenam Trekking permit: Issued from TIC Pelling and TIC Gangtok through a registered Travel Agency, after clearance from Home Department, Army, Forest Department, and Police.",

  "Green Lake Trek permit: Issued by the Adventure Cell of the Tourism Department, after clearance from the Forest Department, Home Department, and Army — applied through a registered Travel Agency.",

  "Alpine Mountaineering Expedition permit: Issued by the Tourism Department after clearance from the Home Department, Forest Department, Army, and Police, for notified peaks only (per Home Department Notification No. 25/Home/2006 dated 20/03/2006). Notified peaks: Tinchen Khang (5,603m, West Sikkim), Jopuno (5,935m, West Sikkim), Frey's Peak (5,830m, West Sikkim), Lama Angden (5,868m, North Sikkim), Brum Khangse (5,433m, North Sikkim).",

  "National Park and Wildlife Sanctuary entry permit: Entry permits for Sikkim's national parks and wildlife sanctuaries are issued by the Forest Department at Gangtok.",

  "Two-wheeler / motorbike permit for PAP areas: Engine capacity must be 150cc or higher to enter Protected Area Permit (PAP) areas. Documents required: registration certificate of the bike, driving license, pollution certificate, insurance certificate, 2 passport-size photographs, and identity proof of both rider and co-rider.",

  // ─── Restricted Area Permit (RAP) — for foreign tourists ───────────────
  "Restricted Area Permit (RAP) overview: Every foreigner (excluding people of Bhutanese origin) who wishes to enter and stay in a Protected or Restricted Area of Sikkim must obtain a Restricted Area Permit (RAP), issued FREE OF COST by authorised offices of the Government of India and the Tourism Department. Citizens of Nepal or Bangladesh may produce a valid identity card reflecting their origin instead. All foreigners must register within 24 hours of arrival in Sikkim.",

  "RAP prior clearance — Pakistan/Afghanistan/China (PRC category): Nationals, OCIs, or citizens of Pakistan, Afghanistan, or China (including Hong Kong and Macau) — classified under the Prior Reference Category (PRC) — must obtain prior approval from the Ministry of Home Affairs, Government of India, New Delhi, before applying for a Restricted Area Permit (RAP). This also applies to individuals of Pakistani, Afghan, or Chinese origin by birth.",

  "RAP prior clearance — Myanmar/Nigeria: Individuals born in, or who are nationals, OCIs, or citizens of Myanmar or Nigeria need prior clearance from either the Ministry of Home Affairs or the Home Department of Sikkim before entering the state on a Restricted Area Permit (RAP).",

  "Restricted areas open to foreigners under RAP, by district: East District (8 places) — Gangtok, Rumtek, Pakyong, Barapathing, Rongli, Rhenock, Aritar, Rorathang. West District (6 places) — Gyalshing, Soreng, Pemayangtse, Khecheopalri, Tashiding, Yuksom. South District (2 places) — Namchi, Ravangla. North District (3 places) — Phodong, Mangan, Singhik (up to Toong). Note: visiting Tsomgo Lake (East) or the Lachen–Lachung–Yumthang–Thangu Valley (North) needs a SEPARATE Protected Area Permit (PAP), not covered by the RAP alone — Tsomgo Lake is a day excursion, and North Sikkim valleys are issued for a minimum of 3 days/2 nights up to a maximum of 5 days/4 nights, supervised by a registered guide.",

  "RAP validity and extension: Foreigners are allowed to stay up to 30 days on issue of a Restricted Area Permit (RAP). Any extension must be applied for at least 2 days before expiry. Extensions beyond 30 days are granted by the Foreigners Registration Office (FRO) Gangtok, and the Superintendent of Police at Namchi, Mangan, and Gyalshing — total stay must not exceed 60 days.",

  "Where to obtain a RAP: Ministry of Home Affairs (Lok Nayak Bhawan, New Delhi); all Indian Missions/embassies abroad; Airport Immigration Offices at Pakyong and Bagdogra; Tourist Information Centre, Siliguri (SNT Complex, Tourism Department); Assistant Director, Tourism Department offices in Kolkata (4/1 Middleton Street), Melli (South Sikkim, near Melli Police Check Post), and Rangpo (East Sikkim); Sikkim House, New Delhi; Deputy Commissioner, Darjeeling; Home Department, Government of West Bengal, Kolkata; and Tourist Information Centres at Bagdogra, Pakyong, Rambam, and Reshi. The RAP is issued free of cost from all these offices. ILP issuing time at the Melli office is 8 AM to 8 PM every day; other Tourist Information Centres generally operate 9:30 AM to 5:00 PM.",

  "How to apply for a RAP (step by step): 1) Fill the application form with name, nationality, passport number and validity date, entry date and exit date, and submit at the permit office. 2) Submit a copy of your valid passport, visa, and a passport-size photo — the office verifies these details, and invalid documents make the application invalid. 3) On successful verification, the permit is issued with a unique reference number, valid for 30 days. 4) A copy of the application/permit is submitted to the Foreigners Registration Office (FRO) for record and database entry. 5) The foreigner may stay for 30 days unless prior permission for an extension is obtained. 6) On exiting Sikkim, the foreigner must present themselves at the FRO office to record their exit details.",

  "RAP special conditions: A Protected Area Permit (PAP) for a group of two or more foreign tourists can be obtained through a Sikkim Tourism registered Travel Agent (per the Sikkim Registration of Tourist Trade Rules, 2008). Trekking permits in protected areas are issued free of cost by the Assistant Director, Sikkim Tourism Office, Gangtok — trekkers must also provide a valid physical fitness certificate from a competent central/state government medical officer. If a foreigner intends to visit a Protected/Restricted Area for non-tourism purposes (business, employment, studies) on a non-tourist visa, prior permission from the Ministry of Home Affairs is required, and the permit is endorsed on the passport for that specific purpose. A foreigner holding a non-tourist visa but visiting only for tourism may instead be granted a Special Permit for places open to tourism.",

  // ─── Responsible Tourism / Do's & Don'ts ────────────────────────────────
  "Sikkim responsible tourism — environment & waste: Use designated dustbins; carry reusable water bottles and shopping bags; protect forests, alpine meadows, rivers, waterfalls and lakes; stay only on designated trekking trails and tourist routes; report forest fires, landslides or environmental hazards to local authorities; carry your waste back if bins are unavailable; never throw garbage into rivers, lakes or valleys, or burn plastic or other waste. Sikkim enforces strict environmental protection policies with penalties for littering.",

  "Sikkim wildlife protection rules: Do not feed wild animals or birds; never disturb wildlife or their habitats; do not collect plants, flowers, medicinal herbs or rare species; avoid loud music inside forests and protected areas; never purchase products made from endangered wildlife.",

  "Sikkim single-use plastic ban: Sikkim has one of India's strongest environmental protection policies — many single-use plastic items are prohibited, with regular enforcement drives and penalties for violations. Avoid carrying: plastic carry bags, plastic cups and plates, plastic straws, disposable cutlery, thermocol items, plastic flags, and certain PET bottles and other banned plastic products. Choose reusable, eco-friendly alternatives instead.",

  "Sikkim high-altitude safety: Many destinations in Sikkim are above 3,000–5,000 metres. Stay hydrated, avoid excessive alcohol, ascend gradually whenever possible, rest if you experience altitude sickness symptoms, follow medical advice immediately if symptoms worsen, and carry any prescribed medicines you may need.",

  "Sikkim road travel safety: Hire only registered travel agencies and licensed taxi operators; follow speed limits on mountain roads; wear seat belts at all times; wear helmets while riding motorcycles; avoid driving during heavy rainfall, snowfall or landslides unless advised it is safe; follow police and traffic advisories.",

  "Sikkim monastery and religious site etiquette: Dress modestly; remove footwear where required; maintain silence inside monasteries; ask permission before photographing monks, ceremonies or local residents; respect prayer flags, prayer wheels and sacred monuments; walk clockwise around stupas and religious structures where customary; make donations only through authorised donation boxes.",

  "Sikkim photography etiquette: Ask permission before photographing individuals; respect photography restrictions in religious and military areas; never fly drones in restricted or protected zones without official approval; avoid disturbing wildlife for photographs.",

  "Sikkim adventure tourism safety: Before trekking, mountain biking, rafting or other adventure activities — choose only authorised operators, wear certified safety equipment, follow guide instructions, inform someone about your itinerary, and check weather conditions before departure.",

  "Sikkim smoking and alcohol rules: Avoid smoking near monasteries, temples and sacred places; avoid consuming alcohol in religious or culturally sensitive locations; do not litter cigarette butts; never drink and drive under any circumstances.",

  "Sikkim emergency guidance: During emergencies, follow directions issued by Police, Tourism Officials, Forest Officials and Disaster Management Authorities. Cooperate during landslides, road closures or weather-related restrictions. Do not cross road barricades or enter restricted areas.",

  "Sikkim responsible community tourism: Buy authentic local handicrafts, stay in registered hotels and homestays, respect local traditions and festivals, support local guides and businesses, and avoid bargaining that may unfairly impact small vendors.",
];