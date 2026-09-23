/* =========================================================
   Director's Cut — Vincent Lee
   timecode HUD · develop-on-hover reveals · act cross-fades
   horizontal reel · credits roll · viewfinder cursor
   ========================================================= */

/* ================= DATA ================= */

const ACT_LABELS = ["I", "II", "III", "IV", "V", "VI"];

const PROJECTS = [
  {
    frame: "01A", name: "KitchenCurator", lang: "TypeScript", year: "2026",
    desc: "Smart food expiry tracker that alerts before food goes bad, then auto-generates step-by-step composting guides.",
    signal: ["expiry data", "smart tracking", "alerts + composting guides"],
    chips: ["TypeScript", "Web app"],
    award: "🏆 Grand Winner · TFE × SCENT",
    slot: "reel-01", slotFile: "assets/reel-01.webp",
    image: "assets/reel-01.webp",
    alt: "KitchenCurator — food expiry tracker dashboard",
    link: null,
  },
  {
    frame: "02A", name: "ApaNewsHariTok", lang: "Python", year: "2025–2026",
    desc: "Sarawak local-news bot on Telegram powered by a locally hosted LLM — ~30-word summaries, categories, urgent alerts.",
    signal: ["Sarawak RSS", "Ollama · Llama 3.1", "Telegram digests"],
    chips: ["Python", "Final Year Project", "SDG 11"],
    award: null,
    slot: "reel-02", slotFile: "assets/reel-02.webp",
    image: "assets/reel-02.webp",
    alt: "ApaNewsHariTok — Sarawak news digest bot",
    link: null,
  },
  {
    frame: "03A", name: "adailocal", lang: "Python", year: "2026",
    desc: "Feishu news push bot, Malaysia-first — collects, summarises, classifies and pushes interactive cards to Lark groups.",
    signal: ["Malaysia RSS", "AI classify + summarise", "Feishu / Lark cards"],
    chips: ["Python", "Public repo"],
    award: null,
    slot: "reel-03", slotFile: "assets/reel-03.webp",
    image: "assets/reel-03.webp",
    alt: "adailocal — Malaysia news cards in Feishu / Lark",
    link: "https://github.com/vincentlee001804?tab=repositories",
  },
  {
    frame: "04A", name: "n8n-xiaomi-tech-news", lang: "n8n", year: "2026",
    desc: "Scheduled n8n workflows watching Xiaomi launches and aggregating tech news, with a global Telegram error handler.",
    signal: ["Xiaomi stores + RSS", "n8n workflows", "Bitable + Telegram"],
    chips: ["n8n", "Automation"],
    award: null,
    slot: "reel-04", slotFile: "assets/reel-04.webp",
    image: "assets/reel-04.webp",
    alt: "n8n-xiaomi-tech-news — scheduled Xiaomi watch workflow",
    link: null,
  },
];

const OTHER_WORK = [
  { name: "contentremixhelper", lang: "TypeScript" },
  { name: "leetechnews-draft-assistant", lang: "TypeScript" },
  { name: "Crisp-Lab-POS-System", lang: "TypeScript" },
  { name: "social_media_ai_platform", lang: "TypeScript" },
  { name: "education_website", lang: "HTML" },
  { name: "academic-website", lang: "TypeScript" },
  { name: "roboadvisor", lang: "HTML" },
  { name: "servease", lang: "JavaScript" },
  { name: "ai_assignment", lang: "Python" },
  { name: "ai_final_assignment", lang: "Python" },
  { name: "wic-learning-archive", lang: "HTML" },
];

const CALL_SHEET = [
  {
    prod: "ANCHR AI Labs", role: "Technical Facilitator & AI Youth Ambassador",
    dates: "Sep 2026 · 1 mo", loc: "Kuching",
    notes: [
      "Served as a Singapore AI Youth Ambassador Network 2026 (SAIYAN) and technical facilitator for the AI Friendship Design Hackathon 2026.",
      "Mentored and guided 11 participant teams through a high-pressure, 2-day sprint to build live sites for local Sarawakian SMEs.",
      "Ran hands-on technical troubleshooting, helping participants leverage Kimi AI to accelerate coding and deployment.",
      "Directed and filmed on-site interviews capturing project milestones and insights on AI integration.",
      "Edited fast-paced event reels and interview highlights in CapCut for official social campaigns.",
      "Collaborated with a four-person facilitation team to keep deliverables on technical standard.",
    ],
  },
  {
    prod: "ANCHR AI Labs", role: "AI Web Developer",
    dates: "Jul 2026 – Aug 2026", loc: "Singapore · Remote",
    notes: [
      "Built and launched a responsive, media-rich post-event learning archive for the inaugural Women in Claude Live Build Showcase.",
      "Designed pre-event feedback systems and used AI to analyse participant data, extracting key learning outcomes.",
      "Ensured 100% compliance with Singapore PDPA and MCCY public funding guidelines for digital publishing.",
    ],
  },
  {
    prod: "Lee Tech News", role: "Social Media Content Creator",
    dates: "Mar 2023 – Present", loc: "Malaysia · Self-employed",
    notes: [
      "Created tech content across social platforms covering Xiaomi products, AI developments and semiconductor news.",
      "Grew brand presence through product promotion and engagement strategies reaching 148+ impressions per post.",
      "Built an active tech community presence around Xiaomi and AI silicon coverage.",
    ],
  },
  {
    prod: "Harmony Mobile", role: "Social Media Content Creator",
    dates: "Nov 2022 – Present", loc: "Kuching · Part-time",
    notes: [
      "Managed Instagram advertising and product promotion campaigns for mobile device sales.",
      "Developed promotional content strategies driving customer engagement and brand visibility.",
    ],
  },
  {
    prod: "Xiaomi Community MY", role: "Moderator",
    dates: "Ongoing", loc: "Malaysia",
    notes: [
      "Support and engage with tech enthusiasts, fostering discussions and building connections among Xiaomi fans.",
    ],
  },
  {
    prod: "Jump Retail", role: "Xiaomi Sales Promoter",
    dates: "Aug 2022 – Nov 2022", loc: "Kuching · On-site",
    notes: [
      "Executed sales promotion and social promotion strategies for Xiaomi product lines.",
      "Delivered product demonstrations and customer engagement to drive in-store sales.",
    ],
  },
];

const GEAR = [
  {
    column: "Above the line",
    groups: [
      { title: "Languages", items: [
        { name: "Python", note: "ApaNewsHariTok · adailocal · CNN pipelines", icon: "python", color: "3776AB" },
        { name: "TypeScript", note: "KitchenCurator · contentremixhelper · POS system", icon: "typescript", color: "3178C6" },
        { name: "JavaScript", note: "servease booking system", icon: "javascript", color: "F7DF1E" },
        { name: "HTML", note: "education_website · roboadvisor · WIC archive", icon: "html5", color: "E34F26" },
      ]},
      { title: "Frameworks / Libraries", items: [
        { name: "Flask", note: "education_website full-stack platform", icon: "flask", color: "C9D1D9" },
        { name: "React", note: "academic-website · servease", icon: "react", color: "61DAFB" },
        { name: "PyTorch", note: "skin-cancer classification · DL pipeline", icon: "pytorch", color: "EE4C2C" },
        { name: "Tailwind CSS", note: "contentremixhelper · this very site", icon: "tailwindcss", color: "06B6D4" },
        { name: "Vite", note: "frontend builds across SPA projects", icon: "vite", color: "646CFF" },
      ]},
      { title: "AI / ML", items: [
        { name: "Google Gemini API", note: "roboadvisor receipt OCR · caption generation", icon: "googlegemini", color: "1B72E8" },
        { name: "Ollama (Llama 3.1)", note: "ApaNewsHariTok local news summaries", icon: "ollama", color: "C9D1D9" },
        { name: "CNN transfer learning", note: "11-architecture skin-cancer classifier", icon: null },
        { name: "Hyperparameter tuning", note: "model comparison & selection", icon: null },
        { name: "OCR", note: "receipt scanning in roboadvisor", icon: null },
        { name: "Prompt engineering", note: "Bahasa Rojak captions · editorial drafts", icon: null },
      ]},
    ],
  },
  {
    column: "Below the line",
    groups: [
      { title: "Automation", items: [
        { name: "n8n", note: "Xiaomi launch monitors · news aggregation", icon: "n8n", color: "EA4B71" },
        { name: "Telegram Bot API", note: "ApaNewsHariTok digests · crash alerts", icon: "telegram", color: "26A5E4" },
        { name: "Feishu / Lark", note: "adailocal cards · Bitable stores", icon: null },
        { name: "RSS pipelines", note: "Sarawak & Malaysia news ingestion", icon: "rss", color: "FF6600" },
      ]},
      { title: "Backend / DB", items: [
        { name: "Firebase", note: "academic-website · servease", icon: "firebase", color: "DD2C00" },
        { name: "SQLite", note: "ApaNewsHariTok local store", icon: "sqlite", color: "003B57" },
        { name: "JWT", note: "education_website auth", icon: "jsonwebtokens", color: "C9D1D9" },
        { name: "REST APIs", note: "across bots and web apps", icon: null },
      ]},
      { title: "Tools", items: [
        { name: "Git / GitHub", note: "15+ repos shipped", icon: "github", color: "C9D1D9" },
        { name: "Clerk auth", note: "contentremixhelper admin panel", icon: "clerk", color: "6C47FF" },
        { name: "Cloudflare", note: "Women in Claude archive live", icon: "cloudflare", color: "F38020" },
        { name: "Render", note: "roboadvisor deployed", icon: "render", color: "46E3B7" },
        { name: "CapCut", note: "hackathon reels & interview highlights", icon: "capcut", color: "C9D1D9" },
      ]},
    ],
  },
];

const SOFT_SKILLS = [
  { name: "Team Facilitation", note: "11 teams mentored at the hackathon" },
  { name: "Technical Leadership", note: "SAIYAN · facilitation team of four" },
  { name: "Video Editing", note: "event reels for official campaigns" },
  { name: "Videography", note: "on-site participant interviews" },
  { name: "Communication", note: "Lee Tech News · community moderation" },
];

const CREDITS = [
  { role: "Directed by", name: "Vincent Lee", cls: "hl" },
  { role: "Written by", name: "15+ shipped repos", cls: "" },
  { role: "Starring", name: "KitchenCurator", cls: "" },
  { role: "", name: "ApaNewsHariTok", cls: "" },
  { role: "", name: "adailocal", cls: "" },
  { role: "", name: "n8n-xiaomi-tech-news", cls: "" },
  { role: "Cinematography", name: "n8n workflows", cls: "" },
  { role: "Sound", name: "Keyboard clatter", cls: "" },
  { role: "Gaffer", name: "Ollama · Llama 3.1", cls: "" },
  { role: "Special thanks", name: "Team Tekkonologia", cls: "teal" },
  { role: "", name: "ANCHR AI Labs", cls: "teal" },
  { role: "", name: "UTS, Sibu", cls: "teal" },
  { role: "", name: "Xiaomi Community Malaysia", cls: "teal" },
  { role: "Shot on location", name: "Kuching, Sarawak", cls: "" },
  { role: "Runtime", name: "2023 – 2026", cls: "" },
  { role: "Rating", name: "R — relentless", cls: "hl" },
  { role: "Next", name: "Unwritten", cls: "hl" },
];

const TC_MARKS = [
  { id: "cold-open", h: 0, m: 0, s: 0 },
  { id: "logline", h: 0, m: 1, s: 22 },
  { id: "feature", h: 0, m: 3, s: 10 },
  { id: "reel", h: 0, m: 41, s: 5 },
  { id: "call-sheet", h: 1, m: 12, s: 40 },
  { id: "gear", h: 1, m: 28, s: 15 },
  { id: "credits", h: 1, m: 47, s: 30 },
];

const GITHUB_REPOS = "https://github.com/vincentlee001804?tab=repositories";

/* ================= ENVIRONMENT ================= */

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const hasGsap = Boolean(window.gsap && window.ScrollTrigger);
const motionOn = hasGsap && !prefersReduced;
const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

if (motionOn) document.documentElement.classList.add("motion-on");
if (prefersReduced) document.documentElement.classList.add("reduced-motion");
if (hasGsap) gsap.registerPlugin(ScrollTrigger);

/* ================= RENDER ================= */

function slotHtml(slot, tag, file, ratio) {
  return `<div class="img-slot" data-slot="${slot}">
      <div class="img-slot-inner">
        <span class="img-slot-tag">${tag}</span>
        <span class="img-slot-file">${file}</span>
        <span class="img-slot-ratio">${ratio}</span>
      </div>
      <div class="img-slot-corners" aria-hidden="true"></div>
    </div>`;
}

function signalHtml(signal) {
  return signal.map((s, i) =>
    i === 0 ? `[${s}]` : ` <span class="sig-arrow">→</span> [${s}]`
  ).join("");
}

function renderReel() {
  const strip = document.getElementById("reel-strip");
  if (!strip) return;

  let html = PROJECTS.map((p) => {
    const media = p.image
      ? `<img src="${p.image}" alt="${p.alt || p.name}" loading="lazy" />`
      : slotHtml(p.slot, `${p.frame} — shot`, p.slotFile, "4 : 5");
    const chips = p.chips.map((c) => `<span class="chip">${c}</span>`).join("");
    const award = p.award ? `<span class="chip chip-award">${p.award}</span>` : "";
    const link = p.link
      ? `<a class="slate-link" href="${p.link}" target="_blank" rel="noopener">View on GitHub ↗</a>`
      : `<span class="chip">Private</span>`;
    /* .frame-expand is a SIBLING of the article, never nested inside it — the
       article is role="button" and a <button> inside role="button" is invalid
       interactive nesting. Only frames with a real image get one. */
    const expand = p.image
      ? `<button class="frame-expand" type="button" data-full="${p.image}" data-alt="${p.alt || p.name}" data-name="${p.name}" data-frame="${p.frame}" aria-label="View ${p.name} full frame">⤢</button>`
      : "";
    return `<div class="reel-card">
        <article class="develop-card" data-reveal tabindex="0" role="button" aria-expanded="false" aria-label="${p.name} — reveal details">
          <div class="develop-media">
            ${media}
            <div class="sheen" aria-hidden="true"></div>
            <div class="develop-slate">
              <div class="slate-top"><span>${p.lang} · ${p.year}</span><span>Frame ${p.frame}</span></div>
              <h3>${p.name}</h3>
              <p class="text-[#6b6b76] text-[0.78rem] leading-relaxed mb-2">${p.desc}</p>
              <p class="signal-line">${signalHtml(p.signal)}</p>
              <div class="slate-chips">${chips}${award}</div>
              ${link}
            </div>
          </div>
          <div class="develop-label">
            <span class="frame-num">${p.frame}</span>
            <span class="frame-name">${p.name}</span>
          </div>
        </article>
        ${expand}
      </div>`;
  }).join("");

  html += `<div class="reel-card">
      <article class="develop-card" data-reveal tabindex="0" role="button" aria-expanded="false" aria-label="More in the can — reveal details">
        <div class="develop-media">
          <div class="can-grid">
            ${OTHER_WORK.map((o) => `<div class="can-item"><strong>${o.name}</strong>${o.lang}</div>`).join("")}
          </div>
          <div class="sheen" aria-hidden="true"></div>
          <div class="develop-slate">
            <div class="slate-top"><span>Archive</span><span>Frame 05A</span></div>
            <h3>More in the can</h3>
            <p class="text-[#6b6b76] text-[0.78rem] leading-relaxed mb-2">Eleven more cuts in the vault — robo-advisor with receipt OCR, education platforms, booking systems, deep-learning pipelines.</p>
            <p class="signal-line">[curiosity] <span class="sig-arrow">→</span> [15+ repos]</p>
            <a class="slate-link" href="${GITHUB_REPOS}" target="_blank" rel="noopener">View all repos on GitHub ↗</a>
          </div>
        </div>
        <div class="develop-label">
          <span class="frame-num">05A</span>
          <span class="frame-name">More in the can</span>
        </div>
      </article>
    </div>`;

  strip.innerHTML = html;
}

function renderCallSheet() {
  const table = document.getElementById("call-table");
  if (!table) return;

  let html = `<div class="call-head-row" aria-hidden="true">
      <span>Production</span><span>Role</span><span>Dates</span><span>Location</span>
    </div>`;

  html += CALL_SHEET.map((c, i) => {
    const notes = c.notes.map((n) => `<li>${n}</li>`).join("");
    return `<div class="call-row reveal">
        <button class="call-row-btn" type="button" aria-expanded="false" aria-controls="call-notes-${i}">
          <span class="call-prod">${c.prod}</span>
          <span class="call-role">${c.role}</span>
          <span class="call-dates">${c.dates}</span>
          <span class="call-loc">${c.loc}</span>
        </button>
        <div class="call-notes" id="call-notes-${i}">
          <div><ul>${notes}</ul></div>
        </div>
      </div>`;
  }).join("");

  table.innerHTML = html;
}

function gearIcon(it) {
  if (!it.icon) return `<span class="gear-icon gear-glyph" aria-hidden="true">◆</span>`;
  return `<img class="gear-icon" src="https://cdn.simpleicons.org/${it.icon}/${it.color || "C9D1D9"}" alt="" loading="lazy"
       onerror="this.classList.add('icon-fallback');this.removeAttribute('src');this.textContent='◆';" />`;
}

function renderGear() {
  const grid = document.getElementById("gear-grid");
  if (!grid) return;

  let take = 0;
  const pad = (n) => String(n).padStart(2, "0");

  /* Emit a flat list: each column contributes its title then its group units.
     At md+ CSS places these on a shared grid with grid-auto-flow: column so the
     three groups line up across columns (see .gear-grid). Keep GEAR at
     2 columns x 3 groups — the grid-template-rows count depends on it. */
  grid.innerHTML = GEAR.map((col) =>
    `<p class="gear-col-title">${col.column}</p>` +
    col.groups.map((g, gi) => `<div class="gear-unit${gi === 0 ? " is-first" : ""}">
        <div class="gear-sprocket" aria-hidden="true"></div>
        <div class="gear-group">
          <h4>${g.title}</h4>
          ${g.items.map((it) => {
            take += 1;
            return `<div class="gear-item reveal" data-reveal tabindex="0" role="button" aria-expanded="false">
                <span class="gear-take" aria-hidden="true">${pad(take)}</span>
                ${gearIcon(it)}
                <div class="gear-body">
                  <span class="gear-name">${it.name}</span>
                  <div class="gear-note"><div>${it.note}</div></div>
                </div>
              </div>`;
          }).join("")}
        </div>
      </div>`).join("")
  ).join("");

  const soft = document.getElementById("soft-skills");
  if (soft) {
    soft.innerHTML = SOFT_SKILLS
      .map((s) => `<span class="fact-chip" title="${s.note}">${s.name}</span>`)
      .join("");
  }
}

function renderMarquee() {
  const track = document.getElementById("marquee-track");
  if (!track) return;

  const names = GEAR.flatMap((c) => c.groups.flatMap((g) => g.items.map((i) => i.name)))
    .concat(SOFT_SKILLS.map((s) => s.name));
  const one = names.map((n) => `<span class="marquee-item">${n}</span>`).join("");
  track.innerHTML = one + one;
}

function renderCredits() {
  const list = document.getElementById("credits-list");
  if (!list) return;

  list.innerHTML = CREDITS.map((c) => `<div class="credit-line">
      <span class="credit-role">${c.role}</span>
      <span class="credit-dots" aria-hidden="true"></span>
      <span class="credit-name ${c.cls}">${c.name}</span>
    </div>`).join("");
}

function renderScrubber() {
  const track = document.getElementById("scrub-track");
  if (!track) return;

  track.innerHTML = ACT_LABELS.map((l, i) =>
    `<button class="scrub-frame${i === 0 ? " is-active" : ""}" type="button" data-act="${i}" role="tab" aria-selected="${i === 0}" aria-label="Act ${l}">0${i + 1}</button>`
  ).join("");
}

/* ================= REVEALS ================= */

function setRevealState(el, open) {
  el.classList.toggle("is-open", open);
  el.classList.toggle("is-collapsed", !open);
  el.setAttribute("aria-expanded", open ? "true" : "false");
}

function bindGroup(items, onOpen) {
  items.forEach((el) => {
    if (!el.hasAttribute("aria-expanded")) el.setAttribute("aria-expanded", "false");
    el.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      const open = el.classList.contains("is-open");
      items.forEach((s) => {
        if (s === el) return;
        s.classList.remove("is-open", "is-collapsed");
        delete s.dataset.pointerClosed;
        s.setAttribute("aria-expanded", "false");
        if (onOpen) onOpen(s, false);
      });
      setRevealState(el, !open);
      if (!open) delete el.dataset.pointerClosed;
      /* e.detail === 0 means keyboard-activated. A pointer close leaves DOM
         focus on the control and mouse movement never blurs it, so without a
         marker the :hover rules would stay dead for that item forever. */
      else if (e.detail > 0) el.dataset.pointerClosed = "1";
      if (onOpen) onOpen(el, !open);
    });
    el.addEventListener("keydown", (e) => {
      if (e.target !== el) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        el.click();
      }
    });
    /* Explicit close is sticky while the pointer is still on the item and while
       focus is retained — otherwise :hover / :focus-within re-open it the moment
       we collapse it. It clears on pointerleave (so the NEXT hover works) or on
       focusout (so Tab-in re-reveals). */
    el.addEventListener("focusout", () => {
      requestAnimationFrame(() => {
        if (!el.contains(document.activeElement)) {
          el.classList.remove("is-collapsed");
          delete el.dataset.pointerClosed;
        }
      });
    });
    el.addEventListener("mouseleave", () => {
      if (el.dataset.pointerClosed !== "1") return;
      delete el.dataset.pointerClosed;
      el.classList.remove("is-collapsed");
      const f = document.activeElement;
      if (el.contains(f)) f.blur();
    });
  });
}

function initReveals() {
  bindGroup(Array.from(document.querySelectorAll(".develop-card")));
  bindGroup(Array.from(document.querySelectorAll(".portrait-reveal")));
  bindGroup(Array.from(document.querySelectorAll(".gear-item")));

  const rows = Array.from(document.querySelectorAll(".call-row"));
  rows.forEach((row) => {
    const btn = row.querySelector(".call-row-btn");
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      const open = row.classList.contains("is-open");
      rows.forEach((r) => {
        r.classList.remove("is-open", "is-collapsed");
        delete r.dataset.pointerClosed;
        const b = r.querySelector(".call-row-btn");
        if (b) b.setAttribute("aria-expanded", "false");
      });
      if (open) {
        row.classList.add("is-collapsed");
        btn.setAttribute("aria-expanded", "false");
        if (e.detail > 0) row.dataset.pointerClosed = "1";
      } else {
        row.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
    row.addEventListener("focusout", () => {
      requestAnimationFrame(() => {
        if (!row.contains(document.activeElement)) {
          row.classList.remove("is-collapsed");
          delete row.dataset.pointerClosed;
        }
      });
    });
    row.addEventListener("mouseleave", () => {
      if (row.dataset.pointerClosed !== "1") return;
      delete row.dataset.pointerClosed;
      row.classList.remove("is-collapsed");
      const f = document.activeElement;
      if (row.contains(f)) f.blur();
    });
  });
}

/* ================= TIMECODE HUD ================= */

function initHud() {
  const el = document.getElementById("hud-tc");
  if (!el) return;

  const toSec = (t) => t.h * 3600 + t.m * 60 + t.s;
  let marks = [];
  let active = false;

  function measure() {
    marks = TC_MARKS.map((t) => {
      const node = document.getElementById(t.id);
      return { y: node ? node.getBoundingClientRect().top + window.scrollY : 0, sec: toSec(t) };
    });
  }

  function formatTc(sec, progress) {
    const p = (n) => String(Math.max(0, Math.floor(n))).padStart(2, "0");
    const f = Math.min(23, Math.floor(progress * 24));
    return `${p(sec / 3600)}:${p((sec % 3600) / 60)}:${p(sec % 60)}:${p(f)}`;
  }

  /* HH:MM:SS is locked to the current cut's TC mark so the HUD always agrees
     with the section kicker. Only FF sweeps with scroll. Crossing into the next
     cut makes the timecode *cut* — same grammar as the act titles. */
  function paint() {
    if (!marks.length) return;
    const y = window.scrollY + 2;
    let idx = 0;
    for (let i = 0; i < marks.length; i++) {
      if (y >= marks[i].y) idx = i;
    }
    const start = marks[idx].y;
    /* Last band runs to the end of the document, not just one viewport, so FF
       keeps sweeping through the credit roll and the end card. */
    const maxScroll = Math.max(
      start + window.innerHeight,
      document.documentElement.scrollHeight - window.innerHeight
    );
    const end = idx < marks.length - 1 ? marks[idx + 1].y : maxScroll;
    const progress = Math.min(1, Math.max(0, (y - start) / (end - start || 1)));
    el.textContent = formatTc(marks[idx].sec, progress);
  }

  function onScroll() { paint(); }
  function onResize() { measure(); paint(); }

  /* The HUD is display:none below 768px (see style.css) — skip the scroll work
     there and follow the breakpoint if the window crosses it. Listeners are
     added and removed as one pair so nothing duplicates across that change. */
  function start() {
    if (active) return;
    active = true;
    measure();
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
  }
  function stop() {
    if (!active) return;
    active = false;
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
  }

  const mq = window.matchMedia("(min-width: 768px)");
  const apply = () => (mq.matches ? start() : stop());
  if (mq.addEventListener) mq.addEventListener("change", apply);
  else mq.addListener(apply);
  apply();
}

/* ================= ACTS ================= */

/* Scrubber highlight, shared by the desktop pin and the mobile carousel. */
function makeSetActive(frames) {
  let active = -1;
  return (idx) => {
    if (idx === active) return;
    active = idx;
    frames.forEach((f, i) => {
      f.classList.toggle("is-active", i === idx);
      f.setAttribute("aria-selected", String(i === idx));
    });
  };
}

/* >=768px: the pinned, scrubbed stage. buildActsTl owns the grammar and must
   not change — titles cut at 0.02, shots cross-fade at 0.4s. */
function startPinActs(shots, metas, frames, setActive, setJump) {
  if (!hasGsap) return () => {};
  gsap.set(shots, { opacity: 0 });
  gsap.set(metas, { opacity: 0 });
  gsap.set([shots[0], metas[0]], { opacity: 1 });

  const st = ScrollTrigger.create({
    trigger: ".feature-pin",
    start: "top top",
    /* Desktop only — below 768px the acts are a swipe carousel (see
       startActCarousel), so phones get no pin and no scroll-jacking. */
    end: "+=3200",
    pin: true,
    scrub: 0.6,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const idx = Math.min(shots.length - 1, Math.floor(self.progress * shots.length));
      setActive(idx);
    },
    animation: buildActsTl(shots, metas),
  });

  setJump((i) => {
    const t = (i + 0.45) / shots.length;
    const y = st.start + (st.end - st.start) * t;
    window.scrollTo({ top: y, behavior: prefersReduced ? "auto" : "smooth" });
  });

  return () => {
    st.kill();
    gsap.set([...shots, ...metas], { clearProps: "opacity" });
    ScrollTrigger.refresh();
  };
}

/* <=767px: a swipe carousel of paired slides. Pure CSS scroll-snap does the
   gesture; this only drives the scrubber highlight and jump-to-act. One
   passive scroll listener — no rAF loop. */
function startActCarousel(slides, frames, setActive, setJump) {
  const track = document.getElementById("act-track");
  if (!track || !slides.length) return () => {};

  function paint() {
    const centre = track.scrollLeft + track.clientWidth / 2;
    let idx = 0;
    for (let i = 0; i < slides.length; i++) {
      const s = slides[i];
      if (s.offsetLeft <= centre) idx = i;
    }
    setActive(idx);
  }

  setJump((i) => {
    const s = slides[i];
    if (s) s.scrollIntoView({ inline: "start", block: "nearest", behavior: prefersReduced ? "auto" : "smooth" });
  });

  track.addEventListener("scroll", paint, { passive: true });
  paint();

  return () => {
    track.removeEventListener("scroll", paint);
    track.scrollLeft = 0;
  };
}

/* One entry point so the breakpoint swap can tear one mode down before
   starting the other — no duplicate listeners across resizes (AGENTS rule). */
function initActsMode() {
  const track = document.getElementById("act-track");
  const slides = track ? Array.from(track.querySelectorAll(".act-slide")) : [];
  const shots = Array.from(document.querySelectorAll(".act-shot"));
  const metas = Array.from(document.querySelectorAll(".act-meta"));
  const frames = Array.from(document.querySelectorAll(".scrub-frame"));
  if (shots.length < 2) return;

  const setActive = makeSetActive(frames);
  let jump = () => {};
  frames.forEach((f) => f.addEventListener("click", () => jump(Number(f.dataset.act))));

  let stop = null;
  function apply() {
    if (stop) { stop(); stop = null; }
    stop = isDesktop()
      ? startPinActs(shots, metas, frames, setActive, (fn) => { jump = fn; })
      : startActCarousel(slides, frames, setActive, (fn) => { jump = fn; });
    setActive(0);
  }

  const mq = window.matchMedia("(min-width: 768px)");
  if (mq.addEventListener) mq.addEventListener("change", apply);
  else if (mq.addListener) mq.addListener(apply);
  apply();
}

function buildActsTl(shots, metas) {
  const tl = gsap.timeline();
  for (let i = 1; i < shots.length; i++) {
    const at = i;
    tl.to(shots[i - 1], { opacity: 0, duration: 0.4, ease: "power1.inOut" }, at - 0.2);
    tl.to(shots[i], { opacity: 1, duration: 0.4, ease: "power1.inOut" }, at - 0.2);
    tl.to(metas[i - 1], { opacity: 0, duration: 0.02 }, at);
    tl.to(metas[i], { opacity: 1, duration: 0.02 }, at);
  }
  tl.to({}, { duration: 0.5 });
  return tl;
}

/* ================= REEL (horizontal) ================= */

function setReelIndexLabel(idx, total) {
  const out = document.getElementById("reel-index");
  if (!out || !total) return;
  const pad = (n) => String(n).padStart(2, "0");
  out.textContent = `${pad(idx + 1)} — ${pad(total)}`;
}

/* Mobile: the strip is a native horizontal scroller, so paint the frame index
   from scrollLeft. Desktop motion-on paints it from the pin progress in
   initReelScroll instead. */
function initReelIndex() {
  const wrap = document.querySelector(".reel-wrap");
  if (!wrap) return;

  let cards = [];
  function measure() {
    cards = Array.from(wrap.querySelectorAll(".reel-card"));
  }
  function paint() {
    if (!cards.length) return;
    const x = wrap.scrollLeft;
    let idx = 0;
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].offsetLeft <= x + 4) idx = i;
    }
    setReelIndexLabel(idx, cards.length);
  }

  measure();
  paint();
  wrap.addEventListener("scroll", paint, { passive: true });
  window.addEventListener("resize", () => { measure(); paint(); }, { passive: true });
}

/* >=768px: the pinned, scrubbed storyscroll. Desktop only — below 768px the
   Reel is a native swipe carousel and initReelIndex paints the frame index
   from wrap.scrollLeft.

   OWNERSHIP: this is the only tween allowed to touch #reel-strip's transform.
   initReelIntro animates .reel-wrap instead — an overwrite:true tween on the
   strip here kills this scrub and strands the pin-spacer as dead scroll.

   The returned stop() MUST kill the ScrollTrigger, not just the tween: a pin
   created at desktop width and left live after shrinking to a phone is exactly
   the stale pin-spacer that opens a ~950px black band after the Reel. */
function startReelPin(strip, wrap) {
  if (!hasGsap) return () => {};

  const amount = () => -(strip.scrollWidth - wrap.clientWidth);
  if (Math.abs(amount()) < 24) return () => {};

  const tween = gsap.to(strip, {
    x: () => -(strip.scrollWidth - wrap.clientWidth),
    ease: "none",
    scrollTrigger: {
      trigger: "#reel",
      start: "top top",
      end: () => `+=${Math.abs(amount()) + 320}`,
      pin: true,
      scrub: 0.5,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const total = wrap.querySelectorAll(".reel-card").length;
        const idx = Math.min(total - 1, Math.floor(self.progress * total));
        setReelIndexLabel(idx, total);
      },
    },
  });

  return () => {
    if (tween.scrollTrigger) tween.scrollTrigger.kill();
    tween.kill();
    gsap.set(strip, { clearProps: "transform" });
    const total = wrap.querySelectorAll(".reel-card").length;
    setReelIndexLabel(0, total);
    ScrollTrigger.refresh();
  };
}

/* One entry point so the breakpoint swap can tear the pin down before the
   native carousel takes over. Mirrors initActsMode: each mode returns a stop()
   and only one is live at a time — no stale pins, no duplicate listeners. */
function initReelScrollMode() {
  const strip = document.getElementById("reel-strip");
  const wrap = document.querySelector(".reel-wrap");
  if (!strip || !wrap) return;

  let stop = null;
  function apply() {
    if (stop) { stop(); stop = null; }
    stop = isDesktop() ? startReelPin(strip, wrap) : () => {};
  }

  const mq = window.matchMedia("(min-width: 768px)");
  if (mq.addEventListener) mq.addEventListener("change", apply);
  else if (mq.addListener) mq.addListener(apply);
  apply();
}

/* ================= CREDITS ROLL ================= */

function initCreditsRoll() {
  const list = document.getElementById("credits-list");
  const win = document.querySelector(".credits-window");
  const card = document.querySelector(".credits-final");
  if (!list || !win) return;

  const travel = () => list.scrollHeight;
  if (travel() < win.clientHeight * 0.35) return;

  /* One scrubbed timeline over .credits-roll-track so the roll and the end
     card share a single pinned screen: the roll plays first and parks its tail
     ("Next / Unwritten") in the mask's faded top 28%, then the end card
     cross-fades in over it as a full-page black cover. No handoff, so no black
     gap and no tail showing through. */
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".credits-roll-track",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
      invalidateOnRefresh: true,
    },
  });

  tl.fromTo(list, { y: 0 }, {
    y: () => -(travel() - win.clientHeight * 0.28),
    ease: "none",
    duration: 0.82,
  }, 0);

  if (card) tl.to(card, { opacity: 1, ease: "none", duration: 0.18 }, 0.82);
}

/* ================= SCROLL REVEALS ================= */

/* Content is visible by default in CSS — only motion-on hides it here, so a
   GSAP failure or prefers-reduced-motion leaves every block readable.

   TWO INVARIANTS, both learned the hard way:
   1. NEVER `once: true` on a reveal trigger. A self-killing trigger can die
      before onEnter fires and strand a block at opacity: 0 forever — that is
      exactly what turned the whole Reel into a ~1000px black band.
   2. The safety sweep is rect-based (getBoundingClientRect), so it stays
      correct inside a ScrollTrigger pin, where "top 88%" positions are not.
      It runs on init, on ScrollTrigger refresh, AND on scroll: a refresh-only
      net never fires while the user is actually scrolling. One passive scroll
      listener, coalesced to at most one pass per frame — not a loop. */

const revealQueue = [];
function queueReveal(el, show) {
  revealQueue.push({ el, show });
}
function sweepReveals() {
  for (const item of revealQueue) {
    if (item.el.dataset.revealed) continue;
    const r = item.el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) item.show(item.el);
  }
}
let sweepQueued = false;
function scheduleSweep() {
  if (sweepQueued) return;
  sweepQueued = true;
  requestAnimationFrame(() => {
    sweepQueued = false;
    sweepReveals();
  });
}
function bindRevealSweep() {
  window.addEventListener("scroll", scheduleSweep, { passive: true });
  ScrollTrigger.addEventListener("refresh", sweepReveals);
  sweepReveals();
}

function initScrollReveals() {
  const items = gsap.utils.toArray(".reveal");
  if (!items.length) return;

  function reveal(el, i) {
    if (el.dataset.revealed) return;
    el.dataset.revealed = "1";
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: (i || 0) * 0.08,
      ease: "power2.out",
    });
  }
  function revealBatch(batch) {
    batch.forEach((el, i) => reveal(el, i));
  }

  gsap.set(items, { opacity: 0, y: 22 });
  ScrollTrigger.batch(items, {
    start: "top 88%",
    onEnter: revealBatch,
    onEnterBack: revealBatch,
  });
  /* Safety net for anything the batch misses (notably content inside a pin). */
  items.forEach((el) => queueReveal(el, (e) => reveal(e, 0)));
}

/* The Reel gets its own entrance instead of scroll-reveal: on desktop
   initReelScroll pins #reel, and .reveal targets inside a pin have no
   meaningful vertical scroll position. This trigger fires BEFORE the pin
   engages (top 78% vs the pin's top top), so it is pin-safe at every width.

   OWNERSHIP: this animates .reel-wrap and the header — NEVER #reel-strip.
   initReelScroll owns #reel-strip exclusively (its scrubbed x tween plus the
   pin). A gsap tween with overwrite:true on #reel-strip kills that tween, and
   the ScrollTrigger's pin-spacer then survives as ~950px of dead scroll. Also
   never use overwrite:true here — it would do the same to a sibling tween. */
function initReelIntro() {
  const head = document.querySelectorAll("#reel .max-w-6xl > *");
  const wrap = document.querySelector("#reel .reel-wrap");
  const items = [...head, wrap].filter(Boolean);
  if (!items.length) return;

  function reveal(el, i) {
    if (el.dataset.revealed) return;
    el.dataset.revealed = "1";
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: (i || 0) * 0.08,
      ease: "power2.out",
    });
  }
  function revealAll() {
    items.forEach((el, i) => reveal(el, i));
  }

  gsap.set(items, { opacity: 0, y: 22 });
  /* No `once: true` (see invariant 1) and no overwrite:true (see OWNERSHIP).
     revealQueue + bindRevealSweep is the guarantee that these can never stay
     invisible, whatever the trigger does. */
  items.forEach((el, i) => queueReveal(el, (e) => reveal(e, i)));
  ScrollTrigger.create({
    trigger: "#reel",
    start: "top 78%",
    onEnter: revealAll,
    onEnterBack: revealAll,
  });
}

/* ================= SKILLS MARQUEE ================= */

/* Decorative (aria-hidden). Tap toggles a pause for touch — hover-pause is
   desktop-only — and the track freezes whenever the marquee is offscreen. */
function initMarquee() {
  const el = document.querySelector(".marquee");
  if (!el) return;

  el.addEventListener("click", () => el.classList.toggle("is-paused"));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => el.classList.toggle("is-offscreen", !e.isIntersecting));
    });
    io.observe(el);
  }
}

/* ================= MAGNETIC BUTTONS ================= */

function initMagnetic() {
  if (prefersReduced || !finePointer) return;
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.16}px, ${y * 0.22}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}

/* ================= VIEWFINDER CURSOR ================= */

function initCursor() {
  const cur = document.getElementById("cursor-view");
  if (!cur || prefersReduced || !finePointer) return;

  document.documentElement.classList.add("has-cursor");

  window.addEventListener("mousemove", (e) => {
    cur.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    cur.classList.add("is-live");
  }, { passive: true });

  document.addEventListener("mouseleave", () => cur.classList.remove("is-live"));
  document.addEventListener("mouseenter", () => cur.classList.add("is-live"));

  document.addEventListener("mouseover", (e) => {
    const hit = e.target.closest("[data-reveal], .develop-card, .call-row, .gear-item, .portrait-reveal, .frame-expand, .frame-view button");
    cur.classList.toggle("is-framed", Boolean(hit));
  });
}

/* ================= FULL FRAME VIEWER ================= */

/* Plain DOM + CSS — no GSAP dependency, so it works on a GSAP failure and
   under prefers-reduced-motion (the open transition is gated on motion-on).
   Scope is the reel frames that have a real image; "More in the can" has no
   single full frame and stays develop-only. The reel's own stills stay in the
   DOM at all times — this dialog only ever shows a second copy of them. */

function initFrameView() {
  const view = document.getElementById("frame-view");
  const img = document.getElementById("frame-view-img");
  const cap = document.getElementById("frame-view-cap");
  const indexEl = document.getElementById("frame-view-index");
  if (!view || !img) return;

  const frames = PROJECTS
    .filter((p) => p.image)
    .map((p) => ({ src: p.image, alt: p.alt || p.name, name: p.name, frame: p.frame }));
  if (!frames.length) return;

  let at = 0;
  let returnTo = null;

  const pad = (n) => String(n).padStart(2, "0");

  function paint() {
    const f = frames[at];
    img.src = f.src;
    img.alt = f.alt;
    if (cap) cap.textContent = `${f.frame} — ${f.name}`;
    if (indexEl) indexEl.textContent = `${pad(at + 1)} — ${pad(frames.length)}`;
  }

  function open(i) {
    at = ((i % frames.length) + frames.length) % frames.length;
    returnTo = document.activeElement;
    paint();
    view.hidden = false;
    view.classList.add("is-open");
    document.documentElement.style.overflow = "hidden";
    const close = view.querySelector(".frame-view-close");
    if (close) close.focus();
  }

  function close() {
    view.classList.remove("is-open");
    view.hidden = true;
    document.documentElement.style.overflow = "";
    if (returnTo && returnTo.focus) returnTo.focus();
    returnTo = null;
  }

  function step(d) {
    at = ((at + d) % frames.length + frames.length) % frames.length;
    paint();
  }

  document.querySelectorAll(".frame-expand").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = frames.findIndex((f) => f.src === btn.dataset.full);
      open(i < 0 ? 0 : i);
    });
  });

  view.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", close));
  const prev = view.querySelector(".fv-prev");
  const next = view.querySelector(".fv-next");
  if (prev) prev.addEventListener("click", () => step(-1));
  if (next) next.addEventListener("click", () => step(1));

  document.addEventListener("keydown", (e) => {
    if (view.hidden) return;
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); return; }
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); return; }
    if (e.key !== "Tab") return;
    /* Trap Tab between close / prev / next while the dialog is open. */
    const f = Array.from(view.querySelectorAll("button")).filter((b) => !b.disabled);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

/* ================= REEL AUTO-DEVELOP (touch) ================= */

/* Hover is gated to fine pointers, so on a phone the develop slate is otherwise
   undiscoverable. This develops whichever card is most on screen, mirroring
   bindGroup's one-at-a-time exclusivity.

   A click takes ownership of a card (data-userToggled): bindGroup keeps full
   control of it and auto-drive stands down entirely until it leaves the
   viewport. So auto-reveal can never re-open something the visitor just
   closed, and never close something they just opened.

   Deliberately no `once: true` and no extra scroll listener (initReelIndex
   already owns that one) — IntersectionObserver is its own trigger. */
function initReelAutoDevelop() {
  if (finePointer) return;
  const cards = Array.from(document.querySelectorAll(".develop-card"));
  if (cards.length < 2 || typeof IntersectionObserver === "undefined") return;

  const ratio = new Map();
  cards.forEach((c) => ratio.set(c, 0));

  function drive() {
    if (cards.some((c) => c.dataset.userToggled)) return;
    let best = null;
    let bestRatio = 0;
    ratio.forEach((r, card) => {
      if (r > bestRatio) { bestRatio = r; best = card; }
    });
    cards.forEach((c) => {
      const open = c === best && bestRatio > 0.55;
      c.classList.toggle("is-open", open);
      c.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      ratio.set(e.target, e.isIntersecting ? e.intersectionRatio : 0);
      if (!e.isIntersecting) delete e.target.dataset.userToggled;
    });
    drive();
  }, { threshold: [0, 0.25, 0.55, 0.8, 1] });

  cards.forEach((c) => {
    c.addEventListener("click", () => { c.dataset.userToggled = "1"; }, true);
    io.observe(c);
  });
  drive();
}

/* ================= INIT ================= */

function init() {
  renderScrubber();
  renderReel();
  renderCallSheet();
  renderGear();
  renderMarquee();
  renderCredits();
  initReveals();
  initMagnetic();
  initCursor();
  initReelIndex();
  initMarquee();
  initFrameView();

  /* Pins first, then the reveal triggers that must fire around them (the Reel
     intro is documented to fire before its pin engages). Not gated on
     motionOn: the acts carousel is pure CSS scroll-snap and must work even
     when GSAP is missing (startPinActs/startReelPin no-op then), and the Reel
     pin must be tear-down-able across the 768px boundary regardless. Only
     reduced motion is excluded, which is what AGENTS requires. */
  if (!prefersReduced) {
    initActsMode();
    initReelScrollMode();
  }
  if (motionOn) {
    initCreditsRoll();
    initReelIntro();
    initScrollReveals();
    bindRevealSweep();
    ScrollTrigger.refresh();
  }
  initReelAutoDevelop();

  /* Measure last: ScrollTrigger inserts pin-spacers for the acts and the reel,
     which push every section below them down the page. Measuring before that
     put the marks hundreds of px too high, so the HUD showed the credits
     timecode while the gear list was still on screen. */
  initHud();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
