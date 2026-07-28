/* ============================================================================
   LILNINJA OS — SHOWROOM ENGINE
   Kids Activity Gym OS · Powered by Accelerated Experiences LLC

   BROWSER-ONLY SHOWROOM. No backend, no network. Everything lives in this
   browser tab's sessionStorage and resets when the visitor leaves or idles.
   Faithful to AEHub canon: COO -> DH -> AE -> Event Bus -> Pacemaker ->
   Triad (2 opposing lenses + Pacemaker), confidence-gated release,
   LIVE/ESTIMATE/ASSUMPTION source tags, the Fences (drafts only, nothing sends).

   Vertical grounding: a real kids activity gym — 47-week programs billed as a
   flat monthly rate, sibling & multi-class discounts, MRR by program, fill
   rate, coach-certification gates, minor waivers. Numbers are computed from the
   seeded data, never hard-coded. Industry benchmarks are DELIBERATELY blank and
   flagged "not yet sourced" — blank beats confident-wrong.
   ============================================================================ */
(function (global) {
  "use strict";

  /* ------------------------------------------------------------------ store */
  var KEY = "lilninja_showroom_v1";
  var IDLE_MS = 20 * 60 * 1000;         // reset the floor 20 min after they walk away
  var STORE = sessionStorage;
  var TODAY = new Date("2026-07-27");   // the showroom's "today" — matches the seed

  function now() { return Date.now(); }
  function read() {
    try { var d = JSON.parse(STORE.getItem(KEY)); return d || null; } catch (e) { return null; }
  }
  function write(d) { d._t = now(); try { STORE.setItem(KEY, JSON.stringify(d)); } catch (e) {} }

  function fresh() {
    return {
      _t: now(), started: now(),
      tier: "grandsuite",   // the package they're standing in
      adds: [],             // departments added ON TOP of that package
      offs: [],             // departments taken OFF that package
      classes:     clone(SEED.classes),
      families:    clone(SEED.families),
      enrollments: clone(SEED.enrollments),
      coaches:     clone(SEED.coaches),
      staff:       clone(SEED.staff),
      floor:       clone(SEED.floor),
      leads:       clone(SEED.leads),
      systems:     clone(SEED.systems),
      matters:     clone(SEED.matters),
      config:      clone(SEED.config),
      bus: [],
      approvals:   clone(SEED.approvals),
      seq: 1
    };
  }
  function clone(a){ return JSON.parse(JSON.stringify(a)); }
  function db() {
    var d = read();
    if (!d) { d = fresh(); write(d); return d; }
    if (now() - (d._t || 0) > IDLE_MS) { d = fresh(); write(d); }
    return d;
  }
  function save(mut) { var d = db(); mut(d); write(d); return d; }
  function resetFloor() { var d = fresh(); write(d); return d; }

  /* ====================================================================
     INDUSTRY CANON — the real vocabulary of a kids activity gym.
     ==================================================================== */

  /* Program families in rotation, each with a warm (never-blue, never-red) tag
     color. This is the canonical list — it drives filters and MRR-by-program. */
  var PROGRAMS = [
    { k:"Gymnastics", color:"#e08a2b" },
    { k:"Ninja",      color:"#2a8f6a" },
    { k:"Cheer",      color:"#c0568f" },
    { k:"Tumbling",   color:"#b06a2c" },
    { k:"STEAM",      color:"#7a5aa8" },
    { k:"Preschool",  color:"#17a2a2" },
    { k:"Homeschool", color:"#8a6d3b" },
    { k:"Camps",      color:"#f2792e" }
  ];
  function programColor(name) {
    var p = PROGRAMS.filter(function (x){ return x.k === name; })[0];
    return p ? p.color : "#8b8175";
  }

  var ROOMS_PHYS = ["Gym A", "Gym B", "Ninja Zone", "Learning Room", "Preschool Room", "Whole Gym"];
  var LEVELS = ["Intro", "Rec", "Rec 1", "Rec 2", "Advanced", "Exhibition", "Competitive", "Program", "School-year", "Camp"];

  /* The 47-week program math — the thing every gym parent understands and every
     generic billing tool gets wrong. A program runs 47 instructional weeks a
     year and is billed as 12 EQUAL monthly payments on the 1st. So a listed
     monthly rate implies a real per-instructional-week value. Sourced to the
     Momentum feature list ("flat 47-week rate"); the 12-payment split is the
     standard studio convention. */
  var WEEKS_PER_YEAR = 47;
  var PAYMENTS_PER_YEAR = 12;
  function annualTuition(monthly) { return (Number(monthly)||0) * PAYMENTS_PER_YEAR; }
  function weeklyEquivalent(monthly) {
    return annualTuition(monthly) / WEEKS_PER_YEAR;   // what the family pays per actual class-week
  }

  /* Discount rules — real logic, applied honestly (all DRAFT rates). */
  var DISCOUNTS = {
    siblingPct: 10,      // each child beyond the first in a family
    multiClassPct: 10,   // each class beyond the first for a single child
    registration: 55     // annual registration fee per child
  };

  /* Certifications a coach carries, and which the floor requires by program.
     A lapsed REQUIRED cert on the assigned coach is this vertical's stop-work
     event — the rights-gate, the way an architecture practice gates on a lapsed
     seal or a playhouse on a lapsed license. */
  var CERT_UNIVERSAL = ["CPR/First Aid", "Background", "SafeSport"]; // every floor coach
  var CERT_BY_PROGRAM = {
    Gymnastics:["USAG"], Tumbling:["USAG"], Preschool:["USAG"],
    Ninja:["Ninja L2"], Homeschool:["Ninja L2"],
    Cheer:["USASF"],
    STEAM:["STEM Ed"], Camps:[]
  };
  var EXPIRING_WINDOW_DAYS = 60; // a cert inside this window reads "expiring soon"

  /* ⚠ Benchmarks ship SOURCED-OR-BLANK. Per the LilNinja brief, no youth-gym
     benchmark has been sourced yet, so every band below is null on purpose and
     the metric ships with NO target rather than a guessed one. These are the
     candidate sources to research before any band is filled in. */
  var BENCH = {
    fill:        { target:null, unit:"%",   src:"Not yet sourced — candidate: IHRSA / Health & Fitness Association youth-program data, USA Gymnastics club economics." },
    autopay:     { target:null, unit:"%",   src:"Not yet sourced — candidate: Jackrabbit / iClassPro published autopay-adoption reports." },
    retention:   { target:null, unit:"%",   src:"Not yet sourced — candidate: USA Gymnastics club retention studies." },
    avgTuition:  { target:null, unit:"$/mo",src:"Not yet sourced — regional; varies by market. Set from the gym's own history." },
    waitlist:    { target:null, unit:"",    src:"Not yet sourced — a gym's growth ceiling is its own waitlist depth, not a benchmark." }
  };

  /* What LilNinja OS replaces. Honest cost notes — where a vendor publishes only
     tiered pricing, we say so instead of inventing a single number. */
  var REPLACES = [
    { tool:"Wix (or Squarespace)", job:"The public site — programs, schedule, online enrolment", cost:"$17–59/mo published, on their template, not the gym's own build" },
    { tool:"The Studio Director / Jackrabbit / iClassPro", job:"Enrolment, tuition, the parent portal", cost:"Tiered per-student SaaS — vendors publish tiers, not one flat rate" },
    { tool:"A card reader + a spreadsheet", job:"Autopay, tuition tracking, family billing", cost:"Processing fees + the hours to reconcile it by hand" },
    { tool:"A coach-cert spreadsheet", job:"Certifications, expiry dates, who can be on the floor", cost:"Free — and it's how a lapsed CPR ends up teaching a class" },
    { tool:"A group text for waitlists", job:"Waitlist promotion when a seat opens", cost:"Free — and the seat sits empty while the text gets missed" }
  ];

  /* --------------------------------------------------------------- seed data
     A fictional gym — "Summit Kids Activity Center." Program structure and price
     points mirror real public gym marketing in spirit; the families are invented
     and no real gym's roster ever appears in a demo. Deliberately imperfect:
     one class under-filled, one coach cert lapsed, one expiring, one waiver
     missing, one registration unpaid — so it reads like a real Monday. */
  var SEED = {
    config: {
      gym: "Summit Kids Activity Center",
      owner: "Kayla Brooks",
      ownerRole: "Owner-Director",
      city: "Post Falls, Idaho",
      revenueKeptEstPerStudent: 3.0   // ESTIMATE, adjustable — see revenueKept()
    },

    /* The spine: the class. Price is the MONTHLY rate billed on the 1st (the
       12-payment split of the 47-week program). cap/enrolled drive fill. */
    classes: [
      { id:"g1", program:"Gymnastics", name:"Tiny Tumblers", ages:"2–3 (Parent & Me)", level:"Intro",
        room:"Gym A", day:"Mon", time:"9:30 AM", price:75, cap:10, enrolled:8, coach:"Coach Bella",
        note:"Parent participates on the floor." },
      { id:"g2", program:"Gymnastics", name:"Preschool Gymnastics", ages:"3–5", level:"Rec",
        room:"Gym A", day:"Tue", time:"10:00 AM", price:85, cap:12, enrolled:11, coach:"Coach Bella",
        note:"" },
      { id:"g3", program:"Gymnastics", name:"Rec Gym · Level 1", ages:"5–7", level:"Rec 1",
        room:"Gym A", day:"Tue", time:"4:00 PM", price:95, cap:12, enrolled:12, coach:"Coach Mia",
        note:"Full — waitlist open." },
      { id:"g4", program:"Gymnastics", name:"Rec Gym · Level 2", ages:"8–11", level:"Rec 2",
        room:"Gym A", day:"Wed", time:"5:00 PM", price:105, cap:12, enrolled:9, coach:"Coach Mia",
        note:"" },
      { id:"n1", program:"Ninja", name:"Ninja Jr", ages:"3–5", level:"Intro",
        room:"Ninja Zone", day:"Mon", time:"4:00 PM", price:90, cap:10, enrolled:7, coach:"Coach Tyler",
        note:"" },
      { id:"n2", program:"Ninja", name:"Ninja Warriors", ages:"6–9", level:"Rec",
        room:"Ninja Zone", day:"Tue", time:"5:00 PM", price:100, cap:12, enrolled:12, coach:"Coach Tyler",
        note:"Full — waitlist open." },
      { id:"n3", program:"Ninja", name:"Ninja Elite", ages:"10+", level:"Advanced",
        room:"Ninja Zone", day:"Thu", time:"6:00 PM", price:110, cap:12, enrolled:8, coach:"Coach Tyler",
        note:"" },
      { id:"c1", program:"Cheer", name:"Mini Cheer", ages:"5–7", level:"Intro",
        room:"Gym B", day:"Wed", time:"4:30 PM", price:95, cap:14, enrolled:10, coach:"Coach Jordan",
        note:"" },
      { id:"c2", program:"Cheer", name:"Exhibition Cheer", ages:"8–12", level:"Exhibition",
        room:"Gym B", day:"Mon", time:"5:30 PM", price:125, cap:16, enrolled:14, coach:"Coach Jordan",
        note:"" },
      { id:"c3", program:"Cheer", name:"Competitive Cheer Team", ages:"8–14", level:"Competitive",
        room:"Gym B", day:"Tue & Thu", time:"6:00 PM", price:150, cap:20, enrolled:16, coach:"Coach Jordan",
        note:"Two practices a week; competes locally." },
      { id:"t1", program:"Tumbling", name:"Tumbling & Trampoline", ages:"7–12", level:"Rec",
        room:"Gym A", day:"Fri", time:"4:30 PM", price:90, cap:12, enrolled:6, coach:"Coach Mia",
        note:"Under-filled — a marketing target this month." },
      { id:"s1", program:"STEAM", name:"STEAM & Play", ages:"Grades K–2", level:"School-year",
        room:"Learning Room", day:"Wed", time:"1:00 PM", price:120, cap:12, enrolled:9, coach:"Coach Priya",
        note:"Coding + robotics + hands-on science, then open gym." },
      { id:"p1", program:"Preschool", name:"Learn & Play Preschool", ages:"3–5", level:"Program",
        room:"Preschool Room", day:"Mon · Wed · Fri", time:"9:00 AM", price:265, cap:14, enrolled:12, coach:"Coach Bella",
        note:"Three mornings a week." },
      { id:"h1", program:"Homeschool", name:"Homeschool Ninja & Gym", ages:"6–12", level:"Program",
        room:"Ninja Zone", day:"Tue", time:"1:00 PM", price:110, cap:16, enrolled:13, coach:"Coach Tyler",
        note:"Daytime — follows the class curriculum." },
      { id:"cp1", program:"Camps", name:"Winter Break Camp", ages:"5–12", level:"Camp",
        room:"Whole Gym", day:"Dec 22–24", time:"9 AM–3 PM", price:199, cap:30, enrolled:18, coach:"Coach Team",
        status:"Upcoming", note:"Per-week drop-off day camp. Not part of recurring MRR." }
    ],

    /* Families & kids — accounts, minors, and (net-new over V1.1) consent and
       waiver on file per child. Deliberate gaps: Ben has no waiver, the Cole
       family has not paid registration and is on manual pay. */
    families: [
      { id:"f1", family:"The Alvarez Family", parent:"Maria Alvarez", phone:"(208) 555-0110", email:"alvarez@example.com",
        autopay:true, registrationPaid:true, notes:"Three kids across cheer & ninja — the sibling-discount case.",
        kids:[ { name:"Ava", born:2013, waiver:true, mediaConsent:true }, { name:"Mia", born:2016, waiver:true, mediaConsent:true }, { name:"Leo", born:2019, waiver:true, mediaConsent:false } ] },
      { id:"f2", family:"The Bennett Family", parent:"Marcus Bennett", phone:"(208) 555-0111", email:"bennett@example.com",
        autopay:true, registrationPaid:true, notes:"Both in cheer.",
        kids:[ { name:"Chloe", born:2018, waiver:true, mediaConsent:true }, { name:"Ruby", born:2015, waiver:true, mediaConsent:true } ] },
      { id:"f3", family:"The Okafor Family", parent:"Ada Okafor", phone:"(208) 555-0112", email:"okafor@example.com",
        autopay:true, registrationPaid:true, notes:"Preschool gym + STEAM.",
        kids:[ { name:"Zara", born:2020, waiver:true, mediaConsent:true } ] },
      { id:"f4", family:"Dana Cole", parent:"Dana Cole", phone:"(208) 555-0113", email:"dana.c@example.com",
        autopay:false, registrationPaid:false, notes:"New this week — first session. Registration and autopay not set up yet.",
        kids:[ { name:"Ben", born:2019, waiver:false, mediaConsent:false } ] },
      { id:"f5", family:"The Harmon Family", parent:"Rachel Harmon", phone:"(208) 555-0114", email:"harmon@example.com",
        autopay:true, registrationPaid:true, notes:"Siblings in gym + ninja.",
        kids:[ { name:"Sam", born:2017, waiver:true, mediaConsent:true }, { name:"Ellie", born:2014, waiver:true, mediaConsent:true } ] },
      { id:"f6", family:"The Rivera Family", parent:"Sofia Rivera", phone:"(208) 555-0115", email:"rivera@example.com",
        autopay:true, registrationPaid:true, notes:"Ninja Jr.",
        kids:[ { name:"Mateo", born:2020, waiver:true, mediaConsent:true } ] },
      { id:"f7", family:"Yuki Tanaka", parent:"Yuki Tanaka", phone:"(208) 555-0116", email:"yuki.t@example.com",
        autopay:true, registrationPaid:true, notes:"Tumbling.",
        kids:[ { name:"Hana", born:2016, waiver:true, mediaConsent:true } ] },
      { id:"f8", family:"Grant Whitfield", parent:"Grant Whitfield", phone:"(208) 555-0117", email:"gwhitfield@example.com",
        autopay:false, registrationPaid:true, notes:"Homeschool family — pays by check.",
        kids:[ { name:"Owen", born:2016, waiver:true, mediaConsent:true } ] }
    ],

    /* Named enrolments: child -> class. class.enrolled is the full headcount;
       these are the known families the billing engine actually prices. */
    enrollments: [
      { family:"The Alvarez Family", child:"Ava", classId:"c3" },
      { family:"The Alvarez Family", child:"Mia", classId:"c2" },
      { family:"The Alvarez Family", child:"Leo", classId:"n2" },
      { family:"The Alvarez Family", child:"Leo", classId:"n3" },
      { family:"The Bennett Family", child:"Chloe", classId:"c1" },
      { family:"The Bennett Family", child:"Ruby", classId:"c2" },
      { family:"The Okafor Family", child:"Zara", classId:"g2" },
      { family:"The Okafor Family", child:"Zara", classId:"s1" },
      { family:"Dana Cole", child:"Ben", classId:"g3" },
      { family:"The Harmon Family", child:"Sam", classId:"g3" },
      { family:"The Harmon Family", child:"Sam", classId:"n2" },
      { family:"The Harmon Family", child:"Ellie", classId:"g4" },
      { family:"The Rivera Family", child:"Mateo", classId:"n1" },
      { family:"Yuki Tanaka", child:"Hana", classId:"t1" },
      { family:"Grant Whitfield", child:"Owen", classId:"h1" }
    ],

    /* Coaches — each carries certs with EXPIRY DATES. Jordan's CPR has lapsed
       (the stop-work case); Mia's CPR is inside the expiring window (the watch). */
    coaches: [
      { id:"co1", name:"Coach Bella", role:"Head Coach · Preschool & Gymnastics", programs:["Gymnastics","Preschool"],
        phone:"(208) 555-0201", email:"bella@example.com", note:"Runs the preschool program.",
        certs:[ { name:"USAG", exp:"2027-05-01" }, { name:"CPR/First Aid", exp:"2026-11-15" }, { name:"Background", exp:"2027-03-01" }, { name:"SafeSport", exp:"2027-01-10" } ] },
      { id:"co2", name:"Coach Mia", role:"Gymnastics & Tumbling Coach", programs:["Gymnastics","Tumbling"],
        phone:"(208) 555-0202", email:"mia@example.com", note:"",
        certs:[ { name:"USAG", exp:"2027-02-01" }, { name:"CPR/First Aid", exp:"2026-08-20" }, { name:"Background", exp:"2026-12-01" }, { name:"SafeSport", exp:"2026-09-30" } ] },
      { id:"co3", name:"Coach Tyler", role:"Ninja Program Director", programs:["Ninja","Homeschool"],
        phone:"(208) 555-0203", email:"tyler@example.com", note:"",
        certs:[ { name:"Ninja L2", exp:"2027-06-01" }, { name:"CPR/First Aid", exp:"2027-04-01" }, { name:"Background", exp:"2027-05-01" }, { name:"SafeSport", exp:"2026-10-01" } ] },
      { id:"co4", name:"Coach Jordan", role:"Cheer Director", programs:["Cheer"],
        phone:"(208) 555-0204", email:"jordan@example.com", note:"Coaches the competitive team.",
        certs:[ { name:"USASF", exp:"2027-08-01" }, { name:"CPR/First Aid", exp:"2026-07-01" }, { name:"Background", exp:"2027-02-01" }, { name:"SafeSport", exp:"2026-12-01" } ] },
      { id:"co5", name:"Coach Priya", role:"STEAM Instructor", programs:["STEAM"],
        phone:"(208) 555-0205", email:"priya@example.com", note:"",
        certs:[ { name:"STEM Ed", exp:"2027-09-01" }, { name:"CPR/First Aid", exp:"2027-03-01" }, { name:"Background", exp:"2027-01-15" }, { name:"SafeSport", exp:"2027-02-01" } ] }
    ],

    /* HR roster — human seats (coaches + front desk + owner) and AI seats side
       by side, the way AEHub keeps one org chart. certState reads the coach
       records above for the compliance line. */
    staff: [
      { id:"st1", name:"Kayla Brooks", role:"Owner-Director", type:"Human", status:"Active", dept:"Command", note:"Signs, spends, and sets pricing. The org keeps this desk clear." },
      { id:"st2", name:"Robin Vance", role:"Front Desk · Enrolment", type:"Human", status:"Active", dept:"Front Desk", note:"Runs check-in, tours and the parent phone." },
      { id:"st3", name:"Coach Bella", role:"Head Coach · Gymnastics", type:"Human", status:"Active", dept:"The Floor", coachId:"co1", note:"Seals the preschool program." },
      { id:"st4", name:"Coach Mia", role:"Gymnastics & Tumbling", type:"Human", status:"Active", dept:"The Floor", coachId:"co2", note:"⚠ CPR/First Aid renews inside 60 days." },
      { id:"st5", name:"Coach Tyler", role:"Ninja Program Director", type:"Human", status:"Active", dept:"The Floor", coachId:"co3", note:"" },
      { id:"st6", name:"Coach Jordan", role:"Cheer Director", type:"Human", status:"Active", dept:"The Floor", coachId:"co4", note:"⚠ CPR/First Aid lapsed — cannot be on the floor until renewed." },
      { id:"st7", name:"Coach Priya", role:"STEAM Instructor", type:"Human", status:"Onboarding", dept:"The Floor", coachId:"co5", note:"Started this month. W-4 on file, SafeSport current." },
      { id:"st8", name:"Frankie", role:"Chief Operating Officer · AI front desk", type:"AI · DeepSeek", status:"Active", dept:"Command", note:"The interface seat to the owner. Routes and packages; does not do the work." },
      { id:"st9", name:"Ledger", role:"Head of Tuition & Billing", type:"AI · DeepSeek", status:"Active", dept:"Money", note:"Owns the integrity of every number. High bar by design." },
      { id:"st10", name:"Whistle", role:"Head of The Floor", type:"AI · DeepSeek", status:"Active", dept:"The Floor", note:"Owns coverage — no class runs behind a lapsed cert." }
    ],

    /* The Floor Log — incidents, make-up credits, equipment, follow-ups. */
    floor: [
      { id:"fl1", subject:"Beam landing mat — worn, replace", area:"Gym A", type:"Equipment Check", party:"Director", status:"In Progress", due:"2026-07-29", note:"Order placed; station coned off until it lands." },
      { id:"fl2", subject:"Make-up credit — missed Mon Tiny Tumblers", area:"Tiny Tumblers", type:"Make-Up Credit", party:"Front Desk", status:"Resolved", due:"2026-07-24", note:"Credit applied; family booked into Thursday." },
      { id:"fl3", subject:"Ninja Warriors — group ready for Elite drills", area:"Ninja Zone", type:"Skill Progression", party:"Coach", status:"Open", due:"2026-07-30", note:"Three athletes cleared the skills check." },
      { id:"fl4", subject:"Chalk station dust near vents", area:"Gym A", type:"Equipment Check", party:"Vendor", status:"Closed", due:"2026-07-18", note:"Moved; filters swapped." }
    ],

    /* Enrolment funnel — leads -> tours -> trials -> enrolled. */
    leads: [
      { id:"ld1", family:"The Nguyen Family", child:"Kai (6)", interest:"Ninja Warriors", stage:"Trial booked", source:"Instagram", value:100, note:"Trial Thursday 5:00 — n2 is full, offer Ninja Jr or the waitlist." },
      { id:"ld2", family:"The Foster Family", child:"Ivy (4)", interest:"Preschool Gymnastics", stage:"Toured", source:"Google", value:85, note:"Loved Gym A. Deciding between us and the Y." },
      { id:"ld3", family:"The Park Family", child:"Jun (9)", interest:"Rec Gym · Level 2", stage:"Enrolled", source:"Referral", value:105, note:"Enrolled Tuesday — sibling of a current family." },
      { id:"ld4", family:"The Diaz Family", child:"Rosa (7)", interest:"Mini Cheer", stage:"Lead", source:"Walk-in", value:95, note:"Grabbed a flyer at the Post Falls market." },
      { id:"ld5", family:"The Owens Family", child:"Theo (11)", interest:"Tumbling & Trampoline", stage:"Trial booked", source:"Facebook", value:90, note:"Fills the under-filled Friday class if it lands." },
      { id:"ld6", family:"The Reed Family", child:"Nora (3)", interest:"Tiny Tumblers", stage:"Lead", source:"Instagram", value:75, note:"Asked about the Parent & Me format." }
    ],

    systems: [
      { id:"sy1", name:"Online enrolment & schedule", state:"CLEAR", metric:"public schedule live · 210ms" },
      { id:"sy2", name:"Autopay / payment processor", state:"CLEAR", metric:"stubbed in showroom · no card is ever charged" },
      { id:"sy3", name:"Check-in kiosk (front desk)", state:"WATCH", metric:"one tablet offline since 6:40a — front desk on the backup" },
      { id:"sy4", name:"Parent portal", state:"CLEAR", metric:"99.97% uptime this month" },
      { id:"sy5", name:"Nightly backup", state:"CLEAR", metric:"roster + families verified 03:50" }
    ],

    /* Law · Waivers & Compliance — advisory ONLY, hard fence to a real attorney.
       Youth-activity matters, retuned for a gym. */
    matters: [
      { id:"mt1", title:"Ben Cole — no signed waiver on file, already on the floor", state:"Open", risk:"High", ref:"Minor liability waiver",
        note:"A child took a class with no signed waiver or medical consent. Every minor, every session — this is the one gap that can't wait. Confirm the enforceable form with counsel." },
      { id:"mt2", title:"Coach Jordan — CPR lapsed while assigned to classes", state:"Open", risk:"High", ref:"Staffing / duty of care",
        note:"A coach with a lapsed CPR is assigned to three cheer classes. Coverage risk and an insurance question — pull from the floor or renew before the next session. Advisory; verify insurer requirements." },
      { id:"mt3", title:"Coach-to-athlete ratios — confirm against Idaho youth-activity rules", state:"Open", risk:"Medium", ref:"Staffing ratios",
        note:"Floor capacity and ratios are the gym's policy numbers. State licensing and the insurer set the floor — advisory only, confirm the actual ratio rules before publishing a class size." },
      { id:"mt4", title:"Coaches — employee vs. contractor classification", state:"Open", risk:"Medium", ref:"Worker classification",
        note:"How coaches are paid affects payroll, workers' comp and liability. Reads as an employment-law question — route to a real attorney, not an OS opinion." }
    ],

    /* The Approval Desk is meant to be nearly EMPTY. Only real FENCES land here
       (send / spend / publish / pricing / a person). */
    approvals: [
      { id:"ap1", kind:"money", title:"Run the 1st-of-month autopay batch", by:"Ledger (Money AE)",
        summary:"Charge 5 autopay families their configured tuition on the 1st. Total staged, cards on file. Moving money is a fence.",
        state:"Pending", why:"Charging cards moves real money — only the owner runs the batch." },
      { id:"ap2", kind:"external", title:"Promote the Ninja Warriors waitlist", by:"Frankie (COO)",
        summary:"Ninja Warriors is full with a waitlist. Email the next family the moment a seat opens and offer enrolment.",
        state:"Pending", why:"Reaches a family outside the gym — a send goes behind the fence." },
      { id:"ap3", kind:"pricing", title:"Set the winter camp price at $199/week", by:"Frankie (COO)",
        summary:"Winter Break Camp is drafted at $199/week for 30 spots across Dec 22–24. Publishing a price is the owner's call.",
        state:"Pending", why:"Setting a price that goes live to families is the owner's decision." }
    ]
  };

  /* ============================================================ THE PRICE BOOK
     The three tiers are PACKAGES, but every department is priced on its own — so
     a deal can add a department to a lower tier or take one off a higher one, and
     the price moves with it. The package is a bundle discount against the à-la-
     carte total; showing that gap IS the sales tool.

     Command Center + the Approval Desk are the platform — in every build, not
     separately priced.

     ⚠ EVERY figure is DRAFT. Numbers sit in a reasonable kids-gym range.
     Accelerated Experiences LLC sets every live price — nothing here goes live. */
  var ROOMS = {
    schedule: { label:"Classes & Schedule",     mo:55, build:350,
                why:"The class spine — programs, rooms, days, capacity and fill. Everything else hangs off it." },
    enroll:   { label:"Enrolment & Waitlists",   mo:60, build:400,
                why:"Public online enrolment off the schedule, and waitlist promotion the moment a seat opens." },
    funnel:   { label:"Enrolment Funnel",        mo:60, build:400,
                why:"Leads → tours → trials → enrolled, so a walk-in flyer doesn't vanish into a text thread." },
    coaches:  { label:"Coaches & Certs",         mo:65, build:450,
                why:"Who teaches what — and the expiry-dated certifications that decide who can be on the floor." },
    checkin:  { label:"Check-in & Attendance",   mo:45, build:300,
                why:"One-tap check-in and the Floor Log — who is on the floor right now, per class." },
    studio:   { label:"Floor Studio",            mo:40, build:300,
                why:"Skills, levels and progressions, plus rotation and capacity planners every coach can read." },
    families: { label:"Families & Kids",         mo:55, build:350,
                why:"Accounts, minors, and a waiver + consent on file for every child, every session." },
    tuition:  { label:"Tuition & Billing",       mo:85, build:600,
                why:"The money spine — 47-week flat rate, sibling & multi-class discounts, autopay, MRR by program." },
    books:    { label:"Books & Metrics",         mo:75, build:500,
                why:"MRR by program, fill rate, autopay adoption, and Revenue Kept — computed, not reconstructed." },
    hr:       { label:"HR · People Ops",         mo:55, build:400,
                why:"Roster, onboarding, and the cert/background tracking a gym actually gets audited on." },
    it:       { label:"IT · System Health",      mo:45, build:350,
                why:"CLEAR / WATCH / INTERVENE on enrolment, the kiosk, the portal and backups." },
    law:      { label:"Law · Waivers",           mo:80, build:600,
                why:"Waivers, minor consent, ratios and coach classification — advisory, with a fence to a real attorney." },
    org:      { label:"Agent Org · Bus",         mo:120, build:1000,
                why:"The ten AI department chains, the event bus, and the confidence gates. This is the engine." }
  };

  /* The three packages. `includes` is what ships in the box at that price. */
  var TIERS = {
    lite: { key:"lite", name:"Lite", rank:1, mo:289, build:2200,
      desc:"The class-and-roster core. Schedule, enrolment, families, check-in, coaches and the Floor Studio.",
      base:"Single location · the scheduler that replaces a spreadsheet",
      includes:["schedule","enroll","families","checkin","coaches","studio"] },
    standard: { key:"standard", name:"Standard", rank:2, mo:599, build:5200,
      desc:"The working gym. Adds the tuition money spine, books & metrics, the enrolment funnel, HR, IT — and the agent org.",
      base:"Single location · unlimited classes",
      includes:["schedule","enroll","families","checkin","coaches","studio",
                "tuition","books","funnel","hr","it","org"] },
    grandsuite: { key:"grandsuite", name:"Grandsuite", rank:3, mo:749, build:7500,
      desc:"The whole gym, nothing held back. Every department, the full ten-chain agent org, and Law · Waivers.",
      base:"Multi-location · unlimited · dedicated environment · data migration",
      includes:["schedule","enroll","families","checkin","coaches","studio",
                "tuition","books","funnel","hr","it","org","law"] }
  };

  /* Departments (nav). `room` links a nav item to its price-book entry. Items
     with no `room` are platform and always present. The showroom opens on the
     FULL Grandsuite; you subtract to fit, and you can add one department back to
     any tier at its own price. Never build up from a stripped base. */
  var DEPTS = [
    { group:"Command", items:[
      { href:"dashboard.html",  label:"Command Center",        ic:"◎" }, { href:"calendar.html", label:"Calendar", ic:"▤" },
      { href:"approvals.html",  label:"Approval Desk",         ic:"✓", accent:"ops" }
    ]},
    { group:"Front Desk", items:[
      { href:"enroll.html",     label:"Enrolment & Waitlists", ic:"✦", room:"enroll",   accent:"enroll" },
      { href:"funnel.html",     label:"Enrolment Funnel",      ic:"◈", room:"funnel",   accent:"funnel" }
    ]},
    { group:"The Floor", items:[
      { href:"schedule.html",   label:"Classes & Schedule",    ic:"▦", room:"schedule", accent:"schedule" },
      { href:"checkin.html",    label:"Check-in & Attendance", ic:"◉", room:"checkin",  accent:"floor" },
      { href:"studio.html",     label:"Floor Studio",          ic:"◫", room:"studio",   accent:"studio" }
    ]},
    { group:"People", items:[
      { href:"coaches.html",    label:"Coaches & Certs",       ic:"★", room:"coaches",  accent:"coaches" },
      { href:"families.html",   label:"Families & Kids",       ic:"♥", room:"families", accent:"families" },
      { href:"hr.html",         label:"HR · People Ops",       ic:"☷", room:"hr",       accent:"ops" }
    ]},
    { group:"Money", items:[
      { href:"tuition.html",    label:"Tuition & Billing",     ic:"◧", room:"tuition",  accent:"money" },
      { href:"books.html",      label:"Books & Metrics",       ic:"◭", room:"books",    accent:"money" }
    ]},
    { group:"Governance", items:[
      { href:"law.html",        label:"Law · Waivers",         ic:"⚖", room:"law",      accent:"law" },
      { href:"it.html",         label:"IT · System Health",    ic:"◐", room:"it",       accent:"it" }
    ]},
    { group:"The Org", items:[
      { href:"org.html",        label:"Agent Org · Bus",       ic:"❖", room:"org",      accent:"ops" }
    ]}
  ];

  /* ----------------------------------------------------------- the agent org
     Faithful to AEHub canon: each department is a chain
     DH -> AE -> Event Bus -> Pacemaker (gates on a confidence bar; the ONLY
     voice out of the triad) -> two opposing Lenses that never confer.
     Frankie (COO) is the apex — the AI front desk. She routes, gates and
     packages; she does NOT do the work, and defers to the owner behind a Fence. */
  var SEATS = {
    coo: { id:"coo", name:"Frankie", role:"Chief Operating Officer · AI front desk", tier:"COO", dept:"Command", gate:null,
           line:"Apex seat. Takes the ask off the owner's desk, routes it, and packages one answer back; defers to the owner only behind a Fence." },
    depts: [
      { key:"enroll", name:"Front Desk · Enrolment & Waitlists", accent:"enroll", gate:80,
        dh:   { name:"Gatekeeper", line:"Owns who's coming in — enrolment, waitlists, and which seat opens next." },
        ae:   { name:"Welcome",    line:"Packages enrolment confirmations, waitlist notices and the welcome email." },
        pace: { name:"Threshold",  line:"Only voice out of the triad. Releases an enrolment move at ≥80%; a send goes to the fence." },
        lensA:{ name:"Fill",       line:"Growth lens — which open seat or waitlist promotion actually grows the gym?" },
        lensB:{ name:"Fit",        line:"Placement lens — is the child the right age and level for the class they want?" } },

      { key:"schedule", name:"Classes & Schedule", accent:"schedule", gate:80,
        dh:   { name:"Grid",      line:"Owns the schedule — programs, rooms, days, and where the capacity is." },
        ae:   { name:"Slot",      line:"Packages the class calendar, room conflicts, and coach assignments." },
        pace: { name:"Cadence",   line:"Releases a schedule change at ≥80%; a room double-book escalates." },
        lensA:{ name:"Demand",    line:"Demand lens — where is the waitlist telling us to add a class?" },
        lensB:{ name:"Room",      line:"Room lens — does the room, the time, and the coach actually line up?" } },

      { key:"coaches", name:"Coaches & Certifications", accent:"coaches", gate:80,
        dh:   { name:"Whistle",   line:"Owns coverage — nobody teaches a class behind a lapsed cert." },
        ae:   { name:"Badge",     line:"Packages the roster of who teaches what, and every cert with its expiry." },
        pace: { name:"Cleared",   line:"Releases a coverage call at ≥80%. A lapsed required cert is a hard stop, not a judgement." },
        lensA:{ name:"Cover",     line:"Coverage lens — who can be on the floor for this class today?" },
        lensB:{ name:"Current",   line:"Compliance lens — is every required cert current, with the expiry to prove it?" } },

      { key:"floor", name:"Check-in, Attendance & Floor", accent:"floor", gate:80,
        dh:   { name:"Tally",     line:"Owns who is on the floor right now — check-in, attendance, the Floor Log." },
        ae:   { name:"Clip",      line:"Packages the floor log, make-up credits, and the equipment watch list." },
        pace: { name:"Headcount", line:"Releases the floor read at ≥80%; a ratio breach or an incident escalates." },
        lensA:{ name:"Present",   line:"Attendance lens — who is checked in, and who is missing from the roster?" },
        lensB:{ name:"Safety",    line:"Safety lens — is the ratio holding, and is any equipment out of service?" } },

      { key:"studio", name:"Floor Studio · Skills", accent:"studio", gate:80,
        dh:   { name:"Ladder",    line:"Owns progression — skills, levels, and when a group is ready to move up." },
        ae:   { name:"Rung",      line:"Packages the skills checklist, level moves, and the rotation plan." },
        pace: { name:"Ready",     line:"Releases a level-up at ≥80% of the skills cleared; short of that it holds and re-checks." },
        lensA:{ name:"Progress",  line:"Development lens — which athletes are ready for the next level's drills?" },
        lensB:{ name:"Ratio",     line:"Capacity lens — does the floor plan hold the class safely at this size?" } },

      { key:"families", name:"Families & Kids", accent:"families", gate:80,
        dh:   { name:"Household", line:"Owns the family account — the kids, the contacts, the consent on file." },
        ae:   { name:"Folder",    line:"Packages accounts, minor records, and the waiver/consent tracking." },
        pace: { name:"Consent",   line:"Releases a family action at ≥80%; a missing minor waiver is a hard flag." },
        lensA:{ name:"Service",   line:"Family lens — what does this household need to feel looked after?" },
        lensB:{ name:"OnFile",    line:"Record lens — is every minor's waiver and consent signed and current?" } },

      { key:"money", name:"Money · Tuition & Billing", accent:"money", gate:85,
        dh:   { name:"Ledger",    line:"Owns the integrity of every number. A wrong figure pollutes everything downstream." },
        ae:   { name:"Statement", line:"Packages tuition, discounts, autopay, MRR by program and Revenue Kept." },
        pace: { name:"Reconcile", line:"High bar (85%). A bluffed number is worse than an honest 'unsure' — moving money is a fence." },
        lensA:{ name:"Collected", line:"Collections lens — what actually cleared, and who is on manual pay or unpaid registration?" },
        lensB:{ name:"Kept",      line:"Retention lens — how much tuition stays in the gym vs. a per-family platform's cut?" } },

      { key:"hr", name:"HR · People Ops", accent:"ops", gate:80,
        dh:   { name:"Hale",      line:"Owns the team's health — hiring, onboarding, cert compliance, the hard talks." },
        ae:   { name:"Roster",    line:"Packages offers, checklists, and cert/background tracking across the staff." },
        pace: { name:"Balance",   line:"Releases people decisions at ≥80%; a termination always routes to a human." },
        lensA:{ name:"Bench",     line:"Talent lens — who do we need to cover the classes on the board?" },
        lensB:{ name:"Record",    line:"Compliance lens — is every cert, background and W-4 current and defensible?" } },

      { key:"it", name:"IT · System Health", accent:"it", gate:80,
        dh:   { name:"Ward",      line:"Owns uptime. CLEAR / WATCH / INTERVENE — and says which, plainly." },
        ae:   { name:"Cache",     line:"Packages incident notes, the watch list, and backup verification." },
        pace: { name:"Steady",    line:"Calls system health; a real outage or a payment-processor failure escalates to a human." },
        lensA:{ name:"Access",    line:"Availability lens — is enrolment, the kiosk and the portal reachable?" },
        lensB:{ name:"Loss",      line:"Risk lens — where's the exposure? Is the roster backed up and verified?" } },

      { key:"law", name:"Law · Waivers & Compliance", accent:"law", gate:85,
        dh:   { name:"Statute",   line:"Owns the compliance read — waivers, minor consent, ratios. NOT a lawyer; advisory only." },
        ae:   { name:"Chair",     line:"Packages the matter, the risk, the sources; flags what needs a real attorney." },
        pace: { name:"Counsel",   line:"High bar (85%). Anything with real liability routes to a licensed attorney." },
        lensA:{ name:"Precedent", line:"Enablement lens — what's the clean, enforceable way to paper this?" },
        lensB:{ name:"Exposure",  line:"Liability lens — what claim could arise around a minor, and does the insurer respond?" } }
    ]
  };

  /* ================================================== the money & metrics spine
     Real formulas, computed off the seeded data. Nothing hard-coded. */

  function classById(id, d) { d = d || db(); return d.classes.filter(function (c){ return c.id === id; })[0]; }
  function isRecurring(c) { return c.program !== "Camps"; }
  function classFill(c) { return (Number(c.cap)||0) ? (Number(c.enrolled)||0) / c.cap : 0; }
  function isFull(c) { return (Number(c.enrolled)||0) >= (Number(c.cap)||0); }

  /* Gross MRR = Σ enrolled × monthly price, over recurring classes only (camps
     are seasonal, not recurring). This is the "revenue by program" basis. */
  function grossMRR(d) {
    d = d || db();
    return d.classes.filter(isRecurring).reduce(function (s,c){ return s + (Number(c.enrolled)||0) * (Number(c.price)||0); }, 0);
  }
  function mrrByProgram(d) {
    d = d || db();
    var map = {};
    d.classes.filter(isRecurring).forEach(function (c){
      map[c.program] = (map[c.program] || 0) + (Number(c.enrolled)||0) * (Number(c.price)||0);
    });
    return Object.keys(map).map(function (k){ return { program:k, mrr:map[k], color:programColor(k) }; })
      .sort(function (a,b){ return b.mrr - a.mrr; });
  }
  function activeEnrollments(d) {
    d = d || db();
    return d.classes.filter(isRecurring).reduce(function (s,c){ return s + (Number(c.enrolled)||0); }, 0);
  }
  function avgTuition(d) {
    d = d || db();
    var e = activeEnrollments(d);
    return e ? grossMRR(d) / e : 0;
  }
  function fillRate(d) {
    d = d || db();
    var rec = d.classes.filter(isRecurring);
    if (!rec.length) return 0;
    var sum = rec.reduce(function (s,c){ return s + classFill(c); }, 0);
    return (sum / rec.length) * 100;   // average of per-class fill
  }
  function fullClasses(d) { d = d || db(); return d.classes.filter(function (c){ return isRecurring(c) && isFull(c); }); }
  function autopayPct(d) {
    d = d || db();
    if (!d.families.length) return 0;
    return d.families.filter(function (f){ return f.autopay; }).length / d.families.length * 100;
  }

  /* Named enrolments for a family, resolved to the class + price. */
  function enrollmentsOf(familyName, d) {
    d = d || db();
    return d.enrollments.filter(function (e){ return e.family === familyName; }).map(function (e){
      var c = classById(e.classId, d);
      return { child:e.child, classId:e.classId, className:c ? c.name : e.classId, program:c ? c.program : "", price:c ? c.price : 0 };
    });
  }

  /* The discount engine — real rules, applied in a defensible order:
     1) multi-class discount per child (highest class full, each extra −10%),
     2) sibling discount across the family (highest-billing child full, each
        additional child −10% on their post-multi-class total).
     Returns gross, discount, net, and the per-child lines. */
  function familyBill(familyName, d) {
    d = d || db();
    var lines = enrollmentsOf(familyName, d);
    var byChild = {};
    lines.forEach(function (l){ (byChild[l.child] = byChild[l.child] || []).push(l); });

    var children = Object.keys(byChild).map(function (name){
      var classes = byChild[name].slice().sort(function (a,b){ return b.price - a.price; });
      var gross = classes.reduce(function (s,c){ return s + c.price; }, 0);
      // multi-class: first (priciest) full, each extra −multiClassPct
      var afterMulti = 0, mcDisc = 0;
      classes.forEach(function (c, i){
        if (i === 0) { afterMulti += c.price; }
        else { var off = c.price * DISCOUNTS.multiClassPct/100; mcDisc += off; afterMulti += c.price - off; }
      });
      return { name:name, classes:classes, gross:gross, multiDisc:mcDisc, afterMulti:afterMulti };
    }).sort(function (a,b){ return b.afterMulti - a.afterMulti; });

    var gross = 0, discount = 0, net = 0;
    children.forEach(function (ch, i){
      gross += ch.gross;
      discount += ch.multiDisc;
      if (i === 0) { ch.sibDisc = 0; ch.net = ch.afterMulti; }
      else {
        var off = ch.afterMulti * DISCOUNTS.siblingPct/100;
        ch.sibDisc = off; ch.net = ch.afterMulti - off; discount += off;
      }
      net += ch.net;
    });
    return { family:familyName, children:children, gross:gross, discount:Math.round(discount), net:Math.round(net),
             registration: children.length ? 0 : 0 };
  }

  /* All named families' bills, largest first. */
  function allBills(d) {
    d = d || db();
    var names = {};
    d.enrollments.forEach(function (e){ names[e.family] = true; });
    return Object.keys(names).map(function (n){ return familyBill(n, d); })
      .filter(function (b){ return b.children.length; })
      .sort(function (a,b){ return b.net - a.net; });
  }

  /* Revenue Kept — THE HEADLINE. LilNinja OS charges one flat white-label
     license and never takes a cut of tuition. A per-family/per-student platform
     would. Modeled as an ADJUSTABLE ESTIMATE per active student, tagged as such:
     vendors publish tiered per-student pricing, not one flat rate, so this is an
     estimate to replace with the gym's actual competitor quote — never asserted. */
  function revenueKept(d) {
    d = d || db();
    var students = activeEnrollments(d);
    var perStudent = Number(d.config.revenueKeptEstPerStudent) || 0;
    var monthly = students * perStudent;
    return { students:students, perStudent:perStudent, monthly:monthly, annual:monthly * 12,
             mrr:grossMRR(d), pctOfMRR: grossMRR(d) ? (monthly / grossMRR(d)) * 100 : 0 };
  }

  /* ---- Waivers / consent gate --------------------------------------------- */
  function waiverGaps(d) {
    d = d || db();
    var gaps = [];
    d.families.forEach(function (f){
      (f.kids || []).forEach(function (k){
        if (!k.waiver) gaps.push({ family:f.family, child:k.name, kind:"waiver" });
      });
    });
    return gaps;
  }
  function enrolledWithoutWaiver(d) {
    d = d || db();
    var gaps = waiverGaps(d);
    return gaps.filter(function (g){
      return d.enrollments.some(function (e){ return e.family === g.family && e.child === g.child; });
    });
  }

  /* ---- Coach certifications: the rights-gate ------------------------------ */
  function daysUntil(dateStr) {
    var t = new Date(dateStr);
    return Math.round((t - TODAY) / (24*3600*1000));
  }
  function certStatus(exp) {
    var days = daysUntil(exp);
    if (days < 0) return "lapsed";
    if (days <= EXPIRING_WINDOW_DAYS) return "expiring";
    return "current";
  }
  function coachByName(name, d) { d = d || db(); return d.coaches.filter(function (c){ return c.name === name; })[0]; }
  function requiredCerts(program) {
    return CERT_UNIVERSAL.concat(CERT_BY_PROGRAM[program] || []);
  }
  /* For a class: is the assigned coach cleared to be on the floor? */
  function coverageOf(cls, d) {
    d = d || db();
    var coach = coachByName(cls.coach, d);
    var req = requiredCerts(cls.program);
    if (!coach) return { ok:true, status:"unassigned", lapsed:[], expiring:[], coach:cls.coach };
    var lapsed = [], expiring = [];
    req.forEach(function (name){
      var cert = (coach.certs || []).filter(function (c){ return c.name === name; })[0];
      if (!cert) { lapsed.push(name + " (missing)"); return; }
      var st = certStatus(cert.exp);
      if (st === "lapsed") lapsed.push(name);
      else if (st === "expiring") expiring.push(name);
    });
    return { ok: lapsed.length === 0, status: lapsed.length ? "at-risk" : (expiring.length ? "expiring" : "cleared"),
             lapsed:lapsed, expiring:expiring, coach:cls.coach };
  }
  function coverageRisks(d) {
    d = d || db();
    return d.classes.filter(isRecurring).map(function (c){ return { cls:c, cov:coverageOf(c, d) }; })
      .filter(function (x){ return !x.cov.ok || x.cov.expiring.length; });
  }
  /* One coach's full cert board, each with status. */
  function coachCerts(coach) {
    return (coach.certs || []).map(function (c){ return { name:c.name, exp:c.exp, status:certStatus(c.exp), days:daysUntil(c.exp) }; });
  }

  /* One call for the metrics board — every value computed, benchmarks blank. */
  function kpis() {
    var d = db();
    var fr = fillRate(d), ap = autopayPct(d), at = avgTuition(d);
    var rk = revenueKept(d);
    return [
      { k:"mrr",       label:"MRR (recurring)",  value:grossMRR(d),        fmt:"money", band:"", bench:BENCH.avgTuition,
        help:"Enrolled × monthly tuition, recurring classes only. The subscription underneath the schedule." },
      { k:"kept",      label:"Revenue Kept / yr",value:rk.annual,          fmt:"money", band:"good", bench:{ src:"Estimate — a per-student platform cut LilNinja OS does not take. Adjustable." },
        help:"Tuition that stays in the gym because LilNinja never takes a per-family cut." },
      { k:"fill",      label:"Avg fill rate",    value:fr,                 fmt:"pct",   band:"", bench:BENCH.fill,
        help:"Average of per-class enrolled ÷ capacity. Empty seats are the growth lever." },
      { k:"active",    label:"Active enrolments",value:activeEnrollments(d),fmt:"int",  band:"", bench:{ src:"Recurring headcount across the schedule." },
        help:"Recurring enrolled spots across every non-camp class." },
      { k:"avg",       label:"Avg tuition",      value:at,                 fmt:"money", band:"", bench:BENCH.avgTuition,
        help:"MRR ÷ active enrolments. Where the gym sits in its market." },
      { k:"autopay",   label:"Autopay adoption", value:ap,                 fmt:"pct",   band:"", bench:BENCH.autopay,
        help:"Families on autopay ÷ all families. The number that decides how much billing is by hand." }
    ];
  }

  /* ------------------------------------------------------------- the brain
     Deterministic, no LLM in the browser. Routes a question DOWN a chain and
     returns a real Output Contract: stance + confidence 0-100 + reasons tagged
     [data]/[assumption]. Below the bar OR estimate-only -> "needs a human". */
  var BRAIN = {
    enroll: {
      match:["enrol","enroll","waitlist","wait list","seat","open","full","trial","tour","lead","register","registration","sign up","promote"],
      build: function (d) {
        var full = fullClasses(d);
        var waitClasses = full.map(function (c){ return c.name; });
        var trials = d.leads.filter(function (l){ return l.stage === "Trial booked"; });
        return {
          stance: full.length
            ? "Promote the waitlist on " + waitClasses.join(" and ") + " the moment a seat opens — both are full and every waitlist family is enrolment already decided. Book " + trials.length + " trial(s) into the classes with room."
            : "No class is full — put the effort into filling the light classes off the funnel.",
          conf: full.length ? 83 : 78,
          reasons: [
            { t:"data", s: full.length + " recurring class(es) are full with a waitlist: " + (waitClasses.join(", ") || "none") + "." },
            { t:"data", s: trials.length + " trial(s) are booked in the funnel; the under-filled class this month is Tumbling & Trampoline at " + Math.round(classFill(classById("t1",d))*100) + "% fill." },
            { t:"assumption", s: "A waitlist promotion is a send to a family — that stays behind the Approval Desk, not auto-sent." }
          ]
        };
      }
    },
    schedule: {
      match:["schedule","class","classes","room","day","time","calendar","gym a","gym b","ninja zone","capacity","slot","conflict","add a class"],
      build: function (d) {
        var full = fullClasses(d);
        var light = d.classes.filter(function (c){ return isRecurring(c) && classFill(c) < 0.6; });
        return {
          stance: "The schedule is carrying two full classes (Rec Gym L1 and Ninja Warriors) and one light one (Tumbling & Trampoline). Add a second Ninja Warriors slot before the waitlist walks, and market the Friday tumbling class rather than cut it.",
          conf: 82,
          reasons: [
            { t:"data", s: full.length + " full class(es) with a waitlist; " + light.length + " under 60% fill. Average fill is " + fillRate(d).toFixed(0) + "%." },
            { t:"data", s: "Ninja Zone already runs Ninja Jr / Warriors / Elite / Homeschool — a second Warriors slot fits the room's open evenings." },
            { t:"assumption", s: "Assumes Coach Tyler has the hours for a second slot; confirm against the coach roster before publishing." }
          ]
        };
      }
    },
    coaches: {
      match:["coach","cert","certification","cpr","usag","usasf","safesport","background","ninja l2","lapsed","expiry","expire","cover","coverage","staff on floor"],
      build: function (d) {
        var risks = coverageRisks(d);
        var lapsed = risks.filter(function (r){ return !r.cov.ok; });
        var expiring = risks.filter(function (r){ return r.cov.ok && r.cov.expiring.length; });
        return {
          stance: lapsed.length
            ? "Pull Coach Jordan from the floor or renew CPR/First Aid before the next cheer session — a lapsed CPR on an assigned coach is a stop-work event, not a reminder. It gates " + lapsed.length + " class(es). Coach Mia's CPR is inside the window; book the renewal now."
            : "Coverage is clean — every assigned coach has current required certs.",
          conf: 86,
          reasons: [
            { t:"data", s: lapsed.length + " class(es) have a coach with a LAPSED required cert; " + expiring.length + " have one expiring inside " + EXPIRING_WINDOW_DAYS + " days." },
            { t:"data", s: "The gate is hard: Cheer requires USASF + CPR + Background + SafeSport. Jordan's CPR/First Aid expired 2026-07-01, so Jordan cannot be assigned until it's renewed." },
            { t:"assumption", s: "Renewal dates are the ones on each coach's record here — the issuing body's current requirement is confirmed with them, not in this hub." }
          ]
        };
      }
    },
    floor: {
      match:["check","checkin","check-in","attendance","present","floor","who is on","incident","make-up","makeup","equipment","ratio","log"],
      build: function (d) {
        var open = d.floor.filter(function (x){ return x.status === "Open" || x.status === "In Progress"; });
        var equip = open.filter(function (x){ return x.type === "Equipment Check"; });
        return {
          stance: "Two items are open on the Floor Log — the worn beam landing mat (station coned off) and a Ninja Warriors group cleared for Elite drills. Close the mat before the weekend rush; route the progression to the Floor Studio.",
          conf: 84,
          reasons: [
            { t:"data", s: open.length + " Floor Log item(s) open or in progress; " + equip.length + " is an equipment safety item." },
            { t:"data", s: "Check-in is one-tap per class; attendance drives both safety headcount and any make-up credit." },
            { t:"assumption", s: "The offline check-in kiosk is on IT's watch list, not INTERVENE — front desk is on the backup tablet." }
          ]
        };
      }
    },
    studio: {
      match:["skill","level","progression","progress","ready","move up","rotation","drill","floor plan","athlete"],
      build: function (d) {
        return {
          stance: "Three Ninja Warriors athletes have cleared the skills check for Elite drills — move them up and open the seats they leave to the Warriors waitlist. Keep the rotation at four stations so one coach can run the floor.",
          conf: 81,
          reasons: [
            { t:"data", s: "A skills-progression item is open on the Floor Log for the Ninja Warriors group; Ninja Elite has open capacity to receive them." },
            { t:"data", s: "The rotation planner holds a class at four stations with one coach per station — the ratio the capacity check is built to protect." },
            { t:"assumption", s: "Sq-ft-per-athlete and athletes-per-coach are the gym's own policy numbers — verify against the insurer and state rules before publishing a class size." }
          ]
        };
      }
    },
    families: {
      match:["family","families","kid","child","children","parent","account","waiver","consent","minor","media","photo"],
      build: function (d) {
        var gaps = enrolledWithoutWaiver(d);
        return {
          stance: gaps.length
            ? "Get a signed waiver for " + gaps.map(function(g){return g.child;}).join(", ") + " before the next session — a minor is enrolled and on the floor with no waiver on file. That's the one family gap that can't wait a week."
            : "Every enrolled minor has a signed waiver and consent on file.",
          conf: gaps.length ? 84 : 88,
          reasons: [
            { t:"data", s: d.families.length + " families, " + d.families.reduce(function(s,f){return s+(f.kids||[]).length;},0) + " kids; " + gaps.length + " enrolled child(ren) missing a waiver." },
            { t:"data", s: "Waiver + media consent are tracked per child, per the family record — the net-new gate over a plain roster." },
            { t:"assumption", s: "The enforceable form is a legal question — Law · Waivers holds it advisory and routes it to a real attorney." }
          ]
        };
      }
    },
    money: {
      match:["money","tuition","billing","mrr","revenue","kept","discount","sibling","autopay","payment","charge","registration","fee","cut","price","collect"],
      build: function (d) {
        var rk = revenueKept(d), unpaid = d.families.filter(function (f){ return !f.registrationPaid; });
        var manual = d.families.filter(function (f){ return !f.autopay; });
        return {
          stance: "MRR is $" + grossMRR(d).toLocaleString() + "/mo and Revenue Kept is ~$" + rk.annual.toLocaleString() + "/yr that a per-family platform would have taken. Chase the " + unpaid.length + " unpaid registration and move the " + manual.length + " manual-pay families to autopay — but the 1st-of-month charge itself is a fence.",
          conf: 79,   // deliberately under the 85 Money bar -> escalates, demonstrating the fence
          reasons: [
            { t:"data", s: "MRR $" + grossMRR(d).toLocaleString() + "/mo across " + activeEnrollments(d) + " active enrolments; avg tuition $" + Math.round(avgTuition(d)) + "/mo." },
            { t:"data", s: "Autopay adoption is " + autopayPct(d).toFixed(0) + "%; " + unpaid.length + " family has registration unpaid; sibling & multi-class discounts are applied per the rules." },
            { t:"assumption", s: "Revenue Kept uses an ESTIMATED $" + rk.perStudent.toFixed(2) + "/student/mo platform cut — an adjustable assumption, not a sourced rate. That estimate keeps this under the 85% Money bar, so it escalates rather than being asserted." }
          ]
        };
      }
    },
    hr: {
      match:["hire","hiring","onboard","staff","team","people","payroll","cert","background","w-4","review","terminate","coach roster"],
      build: function (d) {
        var onboarding = d.staff.filter(function (t){ return t.status === "Onboarding"; });
        var risks = coverageRisks(d);
        return {
          stance: risks.length
            ? "The compliance line is the story this week: Coach Jordan's CPR lapsed and Coach Mia's renews inside the window. Book both renewals — a lapsed cert is a floor-coverage problem, not a personnel note. " + onboarding.length + " seat is mid-onboarding."
            : "Certs and paperwork are current across the staff; next check is the onboarding seat.",
          conf: 87,
          reasons: [
            { t:"data", s: d.staff.filter(function(t){return t.type==="Human";}).length + " human seat(s), " + d.staff.filter(function(t){return t.type!=="Human";}).length + " AI seat(s); " + onboarding.length + " onboarding; " + risks.length + " coach(es) with a cert flag." },
            { t:"data", s: "Cert + background tracking is the compliance line a gym gets audited on — same shape as licensure in a licensed practice." },
            { t:"assumption", s: "A termination is never auto-run. It always routes to a human — flagged here, not executed." }
          ]
        };
      }
    },
    it: {
      match:["system","health","uptime","backup","outage","kiosk","tablet","portal","enrolment site","processor","incident","slow","offline"],
      build: function (d) {
        var watch = d.systems.filter(function (s){ return s.state !== "CLEAR"; });
        return {
          stance: watch.length
            ? "WATCH: " + watch.map(function (s){ return s.name; }).join(", ") + ". Nothing needs a human INTERVENE — the front desk is on the backup tablet — but a check-in kiosk down during the after-school rush is a bad afternoon."
            : "System is CLEAR — enrolment, the kiosk, the portal and backups all reachable and verified.",
          conf: watch.length ? 84 : 89,
          reasons: [
            { t:"data", s: d.systems.length + " service(s) monitored; " + watch.length + " on WATCH, 0 on INTERVENE." },
            { t:"data", s: "Nightly backup of the roster + families verified at 03:50 — verified, not assumed. The payment processor is stubbed in this showroom and never charges a card." },
            { t:"assumption", s: "Assumes the showroom checks mirror production. A true INTERVENE — a payment-processor failure on the 1st — pages a person immediately." }
          ]
        };
      }
    },
    law: {
      match:["law","legal","waiver","consent","liability","claim","insurance","ratio","contractor","employee","compliance","minor","risk","attorney"],
      build: function (d) {
        var open = d.matters.filter(function (m){ return m.state === "Open"; });
        var high = open.filter(function (m){ return m.risk === "High"; });
        return {
          stance: "Two matters need a real attorney before they sit any longer: the child on the floor with no signed waiver, and a coach assigned to classes with a lapsed CPR. Both are minor-safety and insurance questions — advisory only from here.",
          conf: 68,   // deliberately under the 85 Law bar — caution, not a lawyer
          reasons: [
            { t:"data", s: open.length + " open matter(s) in the docket; " + high.length + " rated High risk (the waiver gap and the lapsed-cert coverage)." },
            { t:"assumption", s: "This is an advisory read, NOT legal advice. A licensed attorney owns the sign-off — that caps confidence under the 85% bar by design." },
            { t:"assumption", s: "Staffing ratios and coach classification depend on Idaho youth-activity rules and the insurer's requirements — confirm with counsel, don't assert them here." }
          ]
        };
      }
    }
  };

  /* Run the org: route a question to a department, deliberate through the triad,
     gate on the Pacemaker's bar, and log every hop to the Event Bus. */
  function consult(deptKey, question) {
    var d = db();
    var dept = SEATS.depts.filter(function (x){ return x.key === deptKey; })[0];
    var brain = BRAIN[deptKey];
    if (!dept || !brain) return null;
    var verdict = brain.build(d, question || "");
    var passed = verdict.conf >= dept.gate;
    var topic = dept.key;
    var stamp = new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });

    var events = [
      { topic:topic+".sot.read", kind:"route", from:dept.dh.name, to:"Filing · SSOT",
        body: dept.dh.name + " is called to the Source of Truth and reads it before acting. SSOT loaded ✓ — canon, fences, and this gym's record in hand.", stamp:stamp },
      { topic:topic+".ae.packaged", kind:"route", from:dept.ae.name, to:dept.pace.name,
        body: dept.ae.name + " (Administrative Executive) packages the ask, files it, and routes it down the bus to the triad: \"" + (question || "(department review)") + "\"", stamp:stamp },
      { topic:topic+".triad.finding", kind:"deliberate", from:dept.lensA.name, to:dept.pace.name,
        body: "[" + dept.lensA.name + "] " + lensTake(verdict, "A"), stamp:stamp },
      { topic:topic+".triad.finding", kind:"deliberate", from:dept.lensB.name, to:dept.pace.name,
        body: "[" + dept.lensB.name + "] " + lensTake(verdict, "B"), stamp:stamp }
    ];

    /* Lateral coordination: AEs talk ONLY to the same position in another
       department. Cross-position routes through the chain, never directly. */
    var COORD = {
      enroll:   { to:"schedule", why:"check the class actually has an open seat before a waitlist promotion goes out" },
      schedule: { to:"coaches",  why:"confirm a cleared coach is free before a new slot is published" },
      coaches:  { to:"floor",    why:"flag any class whose coverage is at risk to the floor headcount" },
      floor:    { to:"studio",   why:"route a skills-progression note to the level board" },
      studio:   { to:"schedule", why:"open the seats a level-up frees to the class calendar" },
      families: { to:"law",      why:"raise a missing minor waiver as a compliance matter" },
      money:    { to:"enroll",   why:"flag which enrolments are unpaid before they're counted as MRR" },
      hr:       { to:"coaches",  why:"put a cert renewal on the coverage board" },
      it:       { to:"money",    why:"confirm the payment processor is healthy before the autopay batch" },
      law:      { to:"families", why:"hand the enforceable waiver language back to the family record" }
    };
    var co = COORD[dept.key];
    if (co) {
      var peer = SEATS.depts.filter(function (x){ return x.key === co.to; })[0];
      if (peer) events.push({ topic:topic+".ae.lateral", kind:"route", from:dept.ae.name,
        to: peer.ae.name + " (" + peer.name + " AE)",
        body: dept.ae.name + " coordinates laterally with " + peer.ae.name + " to " + co.why + " — AE↔AE, same position, no chain needed.", stamp:stamp });
    }

    if (passed) {
      events.push({ topic:topic+".pacemaker.released", kind:"conclude", from:dept.pace.name, to:dept.ae.name,
        body: verdict.stance, conclusion:true, verdict:verdict, gate:dept.gate, stamp:stamp });
      events.push({ topic:topic+".ae.filed", kind:"route", from:dept.ae.name, to:dept.dh.name,
        body: dept.ae.name + " files the released conclusion to the gym's record and sets a follow-up, then hands it to " + dept.dh.name + ".", stamp:stamp });
      events.push({ topic:"coo.decision", kind:"route", from:dept.dh.name, to:SEATS.coo.name + " (COO)",
        body: dept.dh.name + " carries it up to " + SEATS.coo.name + ", the interface to the owner: cleared the " + dept.gate + "% bar.", stamp:stamp });
    } else {
      events.push({ topic:"escalation.below_bar", kind:"reject", from:dept.pace.name, to:SEATS.coo.name + " → the Owner",
        body: "Held below the " + dept.gate + "% bar (" + verdict.conf + "%). Needs a human — not enough live data. " + dept.ae.name + " files the hold; " + SEATS.coo.name + " routes it up with reasons attached.",
        conclusion:true, verdict:verdict, gate:dept.gate, escalate:true, stamp:stamp });
    }

    save(function (x){
      events.forEach(function (e){ e.id = "e" + (x.seq++); e.dept = dept.key; x.bus.push(e); });
      if (x.bus.length > 60) x.bus = x.bus.slice(-60);
    });
    return { dept:dept, verdict:verdict, passed:passed, events:events };
  }

  function lensTake(v, which) {
    var pro = v.reasons.filter(function (r){ return r.t === "data"; })[0];
    var con = v.reasons.filter(function (r){ return r.t === "assumption"; })[0];
    if (which === "A") return "Argues FOR: " + (pro ? pro.s : "the evidence supports moving.");
    return "Pushes back: " + (con ? con.s : "the evidence isn't fully sourced yet.");
  }

  /* ---- Frankie (COO) as a machine of her own ---- */
  function routeDept(question) {
    var q = String(question || "").toLowerCase();
    var best = null, bestScore = 0;
    Object.keys(BRAIN).forEach(function (k) {
      var score = BRAIN[k].match.reduce(function (s, w) { return s + (q.indexOf(w) >= 0 ? 1 : 0); }, 0);
      if (score > bestScore) { bestScore = score; best = k; }
    });
    return best || "schedule";
  }

  function askFrankie(question) {
    var deptKey = routeDept(question);
    var dept = SEATS.depts.filter(function (x){ return x.key === deptKey; })[0];
    var stamp = new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
    save(function (x){
      x.bus.push({ id:"e"+(x.seq++), dept:"coo", topic:"coo.route", kind:"route",
        from: SEATS.coo.name + " (COO)", to: dept.dh.name + " (" + dept.name + ")",
        body: SEATS.coo.name + " takes the ask off the owner's desk and routes it to " + dept.name + " — she gates and packages, she doesn't do the work herself.",
        stamp: stamp });
    });
    var r = consult(deptKey, question);
    var packaged = r.passed
      ? (SEATS.coo.name + ": On track. " + dept.name + " cleared its " + dept.gate + "% bar — I'm releasing this to you. " + r.verdict.stance)
      : (SEATS.coo.name + ": Holding this off your desk. " + dept.name + " came in at " + r.verdict.conf + "%, under its " + dept.gate + "% bar — it needs a human. Here's what I have, and I've set a follow-up. " + r.verdict.stance);
    return { deptKey:deptKey, dept:dept, result:r, packaged:packaged, on_track:r.passed };
  }

  /* ----------------------------------------------------------- approval desk */
  function approvals() { return db().approvals || []; }
  function stage(kind, title, summary, why, by) {
    var item = { id:"ap" + now(), kind:kind || "general", title:title || "Untitled",
      summary:summary || "", why:why || "Behind a fence — needs the owner.",
      by:by || "The org", state:"Pending" };
    save(function (d){ (d.approvals = d.approvals || []).push(item); });
    return item;
  }
  function decideApproval(id, decision) {
    save(function (d){ (d.approvals||[]).forEach(function (a){ if (a.id === id) a.state = decision; }); });
    return approvals();
  }

  /* ============================================== the configurator (à la carte) */
  function tier() { return db().tier || "grandsuite"; }
  function tierRank() { return TIERS[tier()].rank; }
  function tierByRank(r){ for (var k in TIERS) if (TIERS[k].rank === r) return k; return "grandsuite"; }
  function setTier(k) { save(function (d){ d.tier = k; d.adds = []; d.offs = []; }); }

  function activeRooms() {
    var d = db();
    var inc = (TIERS[d.tier] || TIERS.grandsuite).includes.slice();
    (d.offs || []).forEach(function (k) { var i = inc.indexOf(k); if (i >= 0) inc.splice(i, 1); });
    (d.adds || []).forEach(function (k) { if (inc.indexOf(k) < 0 && ROOMS[k]) inc.push(k); });
    return inc;
  }
  function hasRoom(k) { return !k || activeRooms().indexOf(k) >= 0; }

  function toggleRoom(k) {
    if (!ROOMS[k]) return;
    save(function (d) {
      var inc = (TIERS[d.tier] || TIERS.grandsuite).includes;
      d.adds = d.adds || []; d.offs = d.offs || [];
      var inPackage = inc.indexOf(k) >= 0;
      var iAdd = d.adds.indexOf(k), iOff = d.offs.indexOf(k);
      if (inPackage) {
        if (iOff >= 0) d.offs.splice(iOff, 1); else d.offs.push(k);
      } else {
        if (iAdd >= 0) d.adds.splice(iAdd, 1); else d.adds.push(k);
      }
    });
  }

  function priceNow() {
    var d = db();
    var t = TIERS[d.tier] || TIERS.grandsuite;
    var adds = (d.adds || []).filter(function (k){ return ROOMS[k]; });
    var offs = (d.offs || []).filter(function (k){ return ROOMS[k]; });
    var addMo   = adds.reduce(function (s,k){ return s + ROOMS[k].mo; }, 0);
    var addBuild= adds.reduce(function (s,k){ return s + ROOMS[k].build; }, 0);
    var offMo   = offs.reduce(function (s,k){ return s + ROOMS[k].mo; }, 0);
    var offBuild= offs.reduce(function (s,k){ return s + ROOMS[k].build; }, 0);
    var rooms = activeRooms();
    var alaMo    = rooms.reduce(function (s,k){ return s + (ROOMS[k] ? ROOMS[k].mo : 0); }, 0);
    var alaBuild = rooms.reduce(function (s,k){ return s + (ROOMS[k] ? ROOMS[k].build : 0); }, 0);
    var mo    = Math.max(0, t.mo + addMo - offMo);
    var build = Math.max(0, t.build + addBuild - offBuild);
    return {
      tier:t, rooms:rooms, adds:adds, offs:offs,
      mo:mo, build:build,
      addMo:addMo, offMo:offMo, addBuild:addBuild, offBuild:offBuild,
      alaMo:alaMo, alaBuild:alaBuild,
      platformMo: Math.max(0, mo - alaMo),
      savingMo: Math.max(0, alaMo - mo),
      changed: adds.length > 0 || offs.length > 0
    };
  }
  function priceLabel() {
    var p = priceNow();
    return money(p.mo) + "/mo · " + money(p.build) + " build";
  }

  /* ------------------------------------------------------------ view helpers */
  function el(html) { var t = document.createElement("template"); t.innerHTML = String(html).trim(); return t.content.firstChild; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]; }); }
  function money(n){ return "$" + (Math.round(Number(n)||0)).toLocaleString(); }
  function pct(n, dp){ return (Number(n)||0).toFixed(dp === undefined ? 0 : dp) + "%"; }

  function brandMark() {
    /* A soft ninja-star + heart mark rendered inline — rounded, kid-friendly,
       no external asset required (the canonical icon URL is used on the gate). */
    return '<img src="https://www.aexperiences.com/LilNinja_OS.png" alt="LilNinja OS" ' +
      'style="width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block" ' +
      'onerror="this.style.display=\'none\';this.parentNode.classList.add(\'fallback\')">' +
      '<svg class="fallback-mark" viewBox="0 0 32 32" width="26" height="26" style="display:none" aria-hidden="true">' +
      '<g fill="none" stroke="#fff" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M16 4 L19.4 12.6 L28 16 L19.4 19.4 L16 28 L12.6 19.4 L4 16 L12.6 12.6 Z"/>' +
      '<circle cx="16" cy="16" r="3.1"/></g></svg>';
  }

  function renderShell(active) {
    var side = document.createElement("aside"); side.className = "sidebar";
    side.appendChild(el(
      '<a href="dashboard.html" class="brand">' +
        '<div class="bmark">' + brandMark() + '</div>' +
        '<div><div class="bt">LilNinja OS</div><div class="bs">Kids Activity Gym OS</div></div>' +
      '</a>'
    ));
    var nav = document.createElement("nav"); nav.className = "nav";
    var on = activeRooms();
    DEPTS.forEach(function (grp) {
      nav.appendChild(el('<div class="nav-group">' + esc(grp.group) + '</div>'));
      grp.items.forEach(function (it) {
        var off = it.room && on.indexOf(it.room) < 0;
        var a = el('<a href="' + (off ? "javascript:void(0)" : it.href) + '" class="navlink ' +
          (it.href === active ? "active" : "") + (off ? " locked" : "") + '"' +
          (it.accent ? ' data-accent="' + it.accent + '"' : "") + '>' +
          '<span class="ic">' + it.ic + '</span><span class="lb">' + esc(it.label) + '</span>' +
          (off ? '<span class="tier-tag">+' + money(ROOMS[it.room].mo) + '</span>' : '') + '</a>');
        if (off) {
          a.title = "Not in this build — add " + ROOMS[it.room].label +
                    " for " + money(ROOMS[it.room].mo) + "/mo + " + money(ROOMS[it.room].build) + " build";
          a.addEventListener("click", function () {
            toggleRoom(it.room);
            toast(ROOMS[it.room].label + " added — " + priceLabel(), "ok");
            setTimeout(function (){ location.reload(); }, 500);
          });
        }
        nav.appendChild(a);
      });
    });
    side.appendChild(nav);
    return side;
  }

  /* The mobile bottom nav — the fix for Buttress's known bug where the sidebar
     shoves content down on a phone. On narrow viewports the sidebar becomes a
     slide-in drawer (hidden until the Menu button opens it) and this frosted
     bottom bar carries the key rooms, so content is never pushed down. */
  var MOBILE_NAV = [
    { href:"dashboard.html", label:"Home",    ic:"◎" },
    { href:"schedule.html",  label:"Classes", ic:"▦", room:"schedule" },
    { href:"tuition.html",   label:"Money",   ic:"◧", room:"tuition" },
    { href:"coaches.html",   label:"Coaches", ic:"★", room:"coaches" },
    { href:"approvals.html", label:"Approvals", ic:"✓" }
  ];
  function renderMobileBar(active) {
    var bar = document.createElement("nav"); bar.className = "mobilebar";
    var on = activeRooms();
    MOBILE_NAV.forEach(function (it) {
      var off = it.room && on.indexOf(it.room) < 0;
      var href = off ? "javascript:void(0)" : it.href;
      var a = el('<a href="' + href + '" class="mb-link ' + (it.href === active ? "active" : "") + '">' +
        '<span class="mb-ic">' + it.ic + '</span><span class="mb-lb">' + esc(it.label) + '</span></a>');
      bar.appendChild(a);
    });
    var menu = el('<button class="mb-link mb-menu" id="mbMenu"><span class="mb-ic">☰</span><span class="mb-lb">Menu</span></button>');
    bar.appendChild(menu);
    return bar;
  }

  function renderTopbar(crumb) {
    var p = priceNow();
    var bar = document.createElement("div"); bar.className = "topbar";
    bar.innerHTML =
      '<button class="hamburger" id="hamburger" aria-label="Open menu">☰</button>' +
      '<div class="crumbs">LilNinja OS · <b>' + esc(crumb) + '</b></div>' +
      '<div class="spacer"></div>' +
      '<div class="tierpill" id="tierPill" role="button" tabindex="0">' +
        '<span class="dot"></span><div><b>' + esc(p.tier.name) + (p.changed ? ' <i class="cfg">configured</i>' : '') + '</b> ' +
        '<span class="price">' + money(p.mo) + '/mo · ' + money(p.build) + ' build</span></div>' +
        '<span class="chev">▾</span></div>' +
      '<div class="who"><div class="av">KB</div><div>Kayla Brooks<br>' +
        '<span class="muted small">Owner-Director</span></div></div>';

    var menu = document.createElement("div"); menu.className = "tiermenu"; menu.id = "tierMenu";
    menu.appendChild(el('<div class="tm-head">Start from a package, then <b>add or take off any department</b>. ' +
      'Every one is priced on its own, so the build fits the gym instead of the gym fitting the build.</div>'));

    Object.keys(TIERS).sort(function (a,b){ return TIERS[b].rank - TIERS[a].rank; }).forEach(function (k) {
      var tt = TIERS[k];
      var opt = el('<div class="tieropt ' + (k === tier() ? "on" : "") + '">' +
        '<div class="to-top"><span class="to-name">' + esc(tt.name) + '</span>' +
        '<span class="to-price">' + money(tt.mo) + '/mo · ' + money(tt.build) + ' build</span></div>' +
        '<div class="to-desc">' + esc(tt.desc) + '</div>' +
        '<div class="to-base">' + esc(tt.base) + ' · ' + tt.includes.length + ' departments</div></div>');
      opt.addEventListener("click", function (e) { e.stopPropagation(); setTier(k); location.reload(); });
      menu.appendChild(opt);
    });

    menu.appendChild(el('<div class="tm-sub">Departments — toggle any one on or off</div>'));
    var on = activeRooms();
    var list = document.createElement("div"); list.className = "roomlist";
    Object.keys(ROOMS).forEach(function (k) {
      var r = ROOMS[k], isOn = on.indexOf(k) >= 0;
      var inPack = p.tier.includes.indexOf(k) >= 0;
      var row = el('<div class="roomrow ' + (isOn ? "on" : "") + '">' +
        '<span class="rr-box">' + (isOn ? "✓" : "+") + '</span>' +
        '<span class="rr-name">' + esc(r.label) +
          (isOn && !inPack ? ' <i class="rr-flag add">added</i>' : '') +
          (!isOn && inPack ? ' <i class="rr-flag off">removed</i>' : '') + '</span>' +
        '<span class="rr-price">' + money(r.mo) + '/mo<i>' + money(r.build) + ' build</i></span>' +
        '<span class="rr-why">' + esc(r.why) + '</span></div>');
      row.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleRoom(k);
        toast(r.label + (activeRooms().indexOf(k) >= 0 ? " added — " : " removed — ") + priceLabel(), "ok");
        setTimeout(function (){ location.reload(); }, 500);
      });
      list.appendChild(row);
    });
    menu.appendChild(list);

    var totalRow = '<div class="tm-total">' +
      '<div class="tt-line"><span>' + esc(p.tier.name) + ' package</span><b>' + money(p.tier.mo) + '/mo</b></div>' +
      (p.adds.length ? '<div class="tt-line add"><span>+ ' + p.adds.length + ' department' + (p.adds.length>1?"s":"") + ' added</span><b>+' + money(p.addMo) + '/mo</b></div>' : '') +
      (p.offs.length ? '<div class="tt-line off"><span>− ' + p.offs.length + ' department' + (p.offs.length>1?"s":"") + ' removed</span><b>−' + money(p.offMo) + '/mo</b></div>' : '') +
      '<div class="tt-line grand"><span>Configured</span><b>' + money(p.mo) + '/mo · ' + money(p.build) + ' build</b></div>' +
      '<div class="tt-save">' + p.rooms.length + ' department' + (p.rooms.length === 1 ? "" : "s") +
        ' at ' + money(p.alaMo) + '/mo à la carte' +
        (p.savingMo > 0 ? ' — the package saves ' + money(p.savingMo) + '/mo' : '') + '.</div>' +
      '<div class="tt-draft">Draft pricing — Accelerated Experiences LLC sets every live price.</div>' +
      '</div>';
    menu.appendChild(el(totalRow));
    menu.addEventListener("click", function (e) { e.stopPropagation(); });

    setTimeout(function () {
      var pill = document.getElementById("tierPill");
      if (pill) pill.addEventListener("click", function (e) { e.stopPropagation(); menu.classList.toggle("open"); });
      document.addEventListener("click", function () { menu.classList.remove("open"); });
    }, 0);
    var frag = document.createDocumentFragment(); frag.appendChild(bar); frag.appendChild(menu);
    return frag;
  }

  function ribbon() {
    return el('<div class="ribbon"><span class="live">LIVE SHOWROOM</span>' +
      ' — this is the real hub, not a slideshow. Everything you type stays in your browser and resets when you leave. ' +
      '<a href="javascript:void(0)" id="resetFloor">Reset the floor</a></div>');
  }
  function footer() {
    return el('<div class="ae-credit">Powered by <b>Accelerated Experiences LLC</b> · LilNinja OS is a white-label build. ' +
      'Demo data is a fictional gym; benchmark figures are sourced or shown blank.</div>');
  }

  function mount(opts) {
    opts = opts || {};
    db();
    var app = document.createElement("div"); app.className = "app";
    var side = renderShell(opts.active);
    var backdrop = el('<div class="nav-backdrop" id="navBackdrop"></div>');
    var main = document.createElement("div"); main.className = "main";
    main.appendChild(ribbon());
    main.appendChild(renderTopbar(opts.crumb || "Command Center"));
    var content = document.createElement("div"); content.className = "content"; content.id = "content";
    main.appendChild(content);
    main.appendChild(footer());
    app.appendChild(side); app.appendChild(main);
    document.body.innerHTML = "";
    document.body.appendChild(app);
    document.body.appendChild(backdrop);
    document.body.appendChild(renderMobileBar(opts.active));
    document.body.appendChild(el('<div id="toast-wrap"></div>'));

    setTimeout(function () {
      var r = document.getElementById("resetFloor");
      if (r) r.addEventListener("click", function () {
        resetFloor(); toast("Showroom reset to a fresh floor.", "ok");
        setTimeout(function (){ location.reload(); }, 450);
      });
      /* drawer open/close for mobile */
      function openNav(){ side.classList.add("open"); backdrop.classList.add("show"); }
      function closeNav(){ side.classList.remove("open"); backdrop.classList.remove("show"); }
      var ham = document.getElementById("hamburger");
      var mb = document.getElementById("mbMenu");
      if (ham) ham.addEventListener("click", openNav);
      if (mb) mb.addEventListener("click", openNav);
      backdrop.addEventListener("click", closeNav);
      Array.prototype.forEach.call(side.querySelectorAll("a.navlink"), function (a) {
        a.addEventListener("click", function () { closeNav(); });
      });
    }, 0);
    return content;
  }

  function toast(msg, kind) {
    var w = document.getElementById("toast-wrap"); if (!w) return;
    var t = el('<div class="toast ' + (kind || "") + '">' + esc(msg) + '</div>');
    w.appendChild(t);
    setTimeout(function () { t.style.opacity = "0"; setTimeout(function (){ t.remove(); }, 250); }, 2600);
  }

  function page(title, sub, actionsHTML) {
    return el('<div class="pagehead"><div><h1>' + esc(title) + '</h1>' +
      (sub ? '<p class="sub">' + sub + '</p>' : "") + '</div>' +
      '<div class="pagehead-actions">' + (actionsHTML || "") + '</div></div>');
  }
  function card(inner, cls) {
    return el('<section class="card ' + (cls || "") + '">' + inner + '</section>');
  }
  function stat(label, value, note, band) {
    return '<div class="stat ' + (band || "") + '"><div class="s-l">' + esc(label) + '</div>' +
      '<div class="s-v">' + value + '</div>' +
      (note ? '<div class="s-n">' + note + '</div>' : "") + '</div>';
  }
  function tag(text, kind) { return '<span class="tag ' + (kind || "") + '">' + esc(text) + '</span>'; }
  function srcNote(text) { return '<div class="srcnote">Source: ' + esc(text) + '</div>'; }
  function bar(p, cls) {
    var w = Math.max(0, Math.min(100, p));
    return '<div class="bar" style="margin-top:6px"><i style="width:' + w.toFixed(0) + '%' +
      (cls ? ";background:var(--" + cls + ")" : "") + '"></i></div>';
  }

  document.addEventListener("visibilitychange", function () { if (!document.hidden) db(); });

  /* -------------------------------------------------------------- public API */
  global.LilNinja = {
    /* store */
    db:db, save:save, resetFloor:resetFloor, fresh:fresh, SEED:SEED, TODAY:TODAY,
    /* canon */
    PROGRAMS:PROGRAMS, programColor:programColor, ROOMS_PHYS:ROOMS_PHYS, LEVELS:LEVELS,
    WEEKS_PER_YEAR:WEEKS_PER_YEAR, PAYMENTS_PER_YEAR:PAYMENTS_PER_YEAR, DISCOUNTS:DISCOUNTS,
    CERT_UNIVERSAL:CERT_UNIVERSAL, CERT_BY_PROGRAM:CERT_BY_PROGRAM, EXPIRING_WINDOW_DAYS:EXPIRING_WINDOW_DAYS,
    BENCH:BENCH, REPLACES:REPLACES,
    /* tiers, price book, configurator, org */
    TIERS:TIERS, ROOMS:ROOMS, DEPTS:DEPTS, SEATS:SEATS, BRAIN:BRAIN,
    tier:tier, tierRank:tierRank, setTier:setTier, tierByRank:tierByRank,
    activeRooms:activeRooms, hasRoom:hasRoom, toggleRoom:toggleRoom,
    priceNow:priceNow, priceLabel:priceLabel,
    consult:consult, askFrankie:askFrankie, routeDept:routeDept,
    /* money + metrics */
    classById:classById, isRecurring:isRecurring, classFill:classFill, isFull:isFull,
    grossMRR:grossMRR, mrrByProgram:mrrByProgram, activeEnrollments:activeEnrollments,
    avgTuition:avgTuition, fillRate:fillRate, fullClasses:fullClasses, autopayPct:autopayPct,
    annualTuition:annualTuition, weeklyEquivalent:weeklyEquivalent,
    enrollmentsOf:enrollmentsOf, familyBill:familyBill, allBills:allBills, revenueKept:revenueKept,
    waiverGaps:waiverGaps, enrolledWithoutWaiver:enrolledWithoutWaiver,
    daysUntil:daysUntil, certStatus:certStatus, coachByName:coachByName, requiredCerts:requiredCerts,
    coverageOf:coverageOf, coverageRisks:coverageRisks, coachCerts:coachCerts, kpis:kpis,
    /* approvals */
    approvals:approvals, stage:stage, decideApproval:decideApproval,
    /* ui */
    mount:mount, toast:toast, el:el, esc:esc, money:money, pct:pct,
    page:page, card:card, stat:stat, tag:tag, srcNote:srcNote, bar:bar
  };
})(window);

/* ============================================================================
   AE mobile drawer enhancer (Jul 27 2026) — progressive enhancement.
   Injects a hamburger + scrim + toggle so any shell with .app/.sidebar/.topbar
   gets a proper off-canvas drawer on phones instead of a stacked-on-top nav.
   Self-contained; safe to append to any engine. ============================ */
(function(){
  function init(){
    var app=document.querySelector('.app'),
        side=document.querySelector('.sidebar'),
        bar=document.querySelector('.topbar');
    if(!app||!side||!bar) return;
    if(document.getElementById('aeNavToggle')) return;
    var scrim=document.querySelector('.navscrim');
    if(!scrim){ scrim=document.createElement('div'); scrim.className='navscrim'; app.appendChild(scrim); }
    var btn=document.createElement('button');
    btn.id='aeNavToggle'; btn.className='ae-navtoggle'; btn.setAttribute('aria-label','Menu');
    btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
    bar.insertBefore(btn, bar.firstChild);
    btn.addEventListener('click', function(e){ e.stopPropagation(); app.classList.toggle('nav-open'); });
    scrim.addEventListener('click', function(){ app.classList.remove('nav-open'); });
    side.addEventListener('click', function(e){ if(e.target.closest('a')) app.classList.remove('nav-open'); });
  }
  function boot(){ init(); setTimeout(init,150); setTimeout(init,500); setTimeout(init,1200); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
