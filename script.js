/* =========================================================
   Director's Cut — Vincent Lee
   timecode HUD · develop-on-hover reveals · act cross-fades
   horizontal reel · credits roll · viewfinder cursor
   ========================================================= */

/* ================= DATA ================= */

const TC_MARKS = [
  { id: "cold-open", h: 0, m: 0, s: 0 },
  { id: "logline", h: 0, m: 1, s: 22 },
  { id: "feature", h: 0, m: 3, s: 10 },
  { id: "reel", h: 0, m: 41, s: 5 },
  { id: "call-sheet", h: 1, m: 12, s: 40 },
  { id: "gear", h: 1, m: 28, s: 15 },
  { id: "credits", h: 1, m: 47, s: 30 },
];

/* ================= ENVIRONMENT ================= */

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointerMq = window.matchMedia("(hover: hover) and (pointer: fine)");
const isFinePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const finePointer = isFinePointer();
const hasGsap = Boolean(window.gsap && window.ScrollTrigger);
const motionOn = hasGsap && !prefersReduced;
const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

if (motionOn) document.documentElement.classList.add("motion-on");
if (prefersReduced) document.documentElement.classList.add("reduced-motion");
if (hasGsap) gsap.registerPlugin(ScrollTrigger);

/* ================= MARQUEE ================= */

function renderMarquee() {
  const track = document.getElementById("marquee-track");
  if (!track) return;

  const names = Array.from(document.querySelectorAll(".gear-name, .soft-skill-label"))
    .map((el) => el.textContent.trim())
    .filter(Boolean);
  const one = names.map((n) => `<span class="marquee-item">${n}</span>`).join("");
  track.innerHTML = one + one;
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
  bindGroup(Array.from(document.querySelectorAll(".soft-skill")));

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

  const mq = window.matchMedia("(min-width: 768px) and (pointer: fine)");
  const apply = () => (mq.matches ? start() : stop());
  if (mq.addEventListener) mq.addEventListener("change", apply);
  else mq.addListener(apply);
  apply();
}

/* ================= ACTS ================= */

/* Scrubber highlight, shared by the desktop pin and the native carousel. */
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

/* Fine-pointer desktops >1024px: the pinned, scrubbed stage. buildActsTl owns
   the grammar and must not change — titles cut at 0.02, shots cross-fade at 0.4s. */
function startPinActs(shots, metas, frames, setActive, setJump) {
  if (!hasGsap) return () => {};
  gsap.set(shots, { opacity: 0 });
  gsap.set(metas, { opacity: 0 });
  gsap.set([shots[0], metas[0]], { opacity: 1 });

  const st = ScrollTrigger.create({
    trigger: ".feature-pin",
    start: "top top",
    /* Phones, tablets and coarse pointers use startActCarousel instead, so
       touch visitors get no pin and no scroll-jacking. */
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

/* <=1024px and coarse pointers: a swipe carousel of paired slides. Pure CSS
   scroll-snap does the gesture; this only drives the scrubber highlight and
   jump-to-act. One passive scroll listener — no rAF loop. */
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
    if (s) s.scrollIntoView({
      inline: i === slides.length - 1 ? "center" : "start",
      block: "nearest",
      behavior: prefersReduced ? "auto" : "smooth",
    });
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
  const carouselMq = window.matchMedia("(max-width: 1024px), (pointer: coarse)");
  function apply() {
    if (stop) { stop(); stop = null; }
    stop = carouselMq.matches
      ? startActCarousel(slides, frames, setActive, (fn) => { jump = fn; })
      : startPinActs(shots, metas, frames, setActive, (fn) => { jump = fn; });
    setActive(0);
  }

  if (carouselMq.addEventListener) carouselMq.addEventListener("change", apply);
  else if (carouselMq.addListener) carouselMq.addListener(apply);
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

/* initReelAutoDevelop installs the shared active-card driver. Keeping this
   beside the index means the visible frame number and developed card can never
   disagree, regardless of whether a pin or native swipe produced the update. */
let driveReelCard = () => {};
let syncReelInputMode = () => {};

function setReelIndexLabel(idx, total) {
  const out = document.getElementById("reel-index");
  if (out && total) {
    const pad = (n) => String(n).padStart(2, "0");
    out.textContent = `${pad(idx + 1)} — ${pad(total)}`;
  }
  syncReelInputMode();
  driveReelCard(idx);
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
    const snapStart = x + 28; /* 24px scroll padding + 4px tolerance */
    let idx = 0;
    /* Native cards snap start, so frame 01 always owns scrollLeft 0 — even
       when two complete cards fit on a wide tablet. */
    cards.forEach((card, i) => {
      if (card.offsetLeft <= snapStart) idx = i;
    });
    /* The last card snaps centre instead, so its left edge never reaches the
       start marker. Detect that end state explicitly to reach frame 05. */
    const last = cards[cards.length - 1];
    const centre = x + wrap.clientWidth / 2;
    const lastCentre = last.offsetLeft + last.offsetWidth / 2;
    if (Math.abs(lastCentre - centre) < 2) idx = cards.length - 1;
    setReelIndexLabel(idx, cards.length);
  }

  measure();
  paint();
  wrap.addEventListener("scroll", paint, { passive: true });
  window.addEventListener("resize", () => { measure(); paint(); }, { passive: true });
}

/* >=768px: the pinned, scrubbed storyscroll, except short coarse-pointer
   landscapes. In either native-carousel mode initReelIndex paints the frame
   index from wrap.scrollLeft.

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
  const desktopMq = window.matchMedia("(min-width: 768px)");
  const shortTouchMq = window.matchMedia("(pointer: coarse) and (max-height: 720px)");
  function apply() {
    if (stop) { stop(); stop = null; }
    wrap.scrollLeft = 0;
    /* A short touch landscape cannot show a tall pinned Reel and its index at
       once. The matching CSS media query gives it the native swipe carousel;
       wider/taller desktops keep the cinematic scrub. */
    stop = desktopMq.matches && !shortTouchMq.matches ? startReelPin(strip, wrap) : () => {};
  }

  [desktopMq, shortTouchMq].forEach((mq) => {
    if (mq.addEventListener) mq.addEventListener("change", apply);
    else if (mq.addListener) mq.addListener(apply);
  });
  apply();
}

/* ================= CREDITS ROLL ================= */

function initCreditsRoll() {
  const list = document.getElementById("credits-list");
  const win = document.querySelector(".credits-window");
  const card = document.querySelector(".credits-final");
  /* card is guarded too: a missing node would make tl.to(card, …) a silent
     no-op and leave the end card in whatever state CSS left it in. */
  if (!list || !win || !card) return;

  const travel = () => list.scrollHeight;
  if (travel() < win.clientHeight * 0.35) return;

  /* Only now that the timeline is committed do we hide the end card. CSS
     leaves it visible so a bail above can never trap it at opacity 0. */
  gsap.set(card, { opacity: 0 });

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

  /* Re-timed with a finale hold. The roll parks its tail by 0.56, dissolves
     by 0.72, the card rises 0.72 -> 0.84, and the last 16% of the scrub is a
     HOLD: card pinned at opacity 1, roll pinned at 0. Without the hold the
     card only reached opacity 1 at progress 1.0 — the exact footer boundary —
     so reversing scroll even slightly re-exposed the roll (the mobile
     glitch). The roll fades out BEFORE the card fades in: the two never
     share the screen as readable layers. */
  tl.fromTo(list, { y: 0 }, {
    y: () => -(travel() - win.clientHeight * 0.28),
    ease: "none",
    duration: 0.56,
  }, 0);

  if (card) {
    tl.to(list, { opacity: 0, ease: "none", duration: 0.14 }, 0.58);
    tl.to(card, { opacity: 1, ease: "none", duration: 0.12 }, 0.72);
    /* finale hold: explicit padding so scroll progress still maps 1:1 across
       the whole track — the last stretch of scroll changes nothing */
    tl.to({}, { duration: 0.16 }, 0.84);
  }
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

  /* Hide ONLY what is still below the fold. Anything already in view (the
     hero on first paint, or a mid-page reload) has painted — hiding it now
     would flash content out and back in when the GSAP CDN arrives after
     first paint, which on a phone is the 闪烁 at the very beginning. Those
     items are marked revealed so neither the batch nor the sweep touches
     them. */
  const inView = items.filter((el) => el.getBoundingClientRect().top < window.innerHeight);
  inView.forEach((el) => { el.dataset.revealed = "1"; });
  const below = items.filter((el) => !inView.includes(el));
  if (!below.length) return;

  gsap.set(below, { opacity: 0, y: 22 });
  ScrollTrigger.batch(below, {
    start: "top 88%",
    onEnter: revealBatch,
    onEnterBack: revealBatch,
  });
  /* Safety net for anything the batch misses (notably content inside a pin). */
  below.forEach((el) => queueReveal(el, (e) => reveal(e, 0)));
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
    const hit = e.target.closest("[data-reveal], .develop-card, .call-row, .gear-item, .portrait-reveal, .frame-expand, .frame-view button, .back-top");
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

  const frames = Array.from(document.querySelectorAll(".frame-expand")).map((btn) => ({
    src: btn.dataset.full,
    alt: btn.dataset.alt || btn.dataset.name,
    name: btn.dataset.name,
    frame: btn.dataset.frame,
  }));
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
    /* Focus restoration is a keyboard / fine-pointer courtesy. On touch it
       re-focuses the tapped card, and :focus-within then keeps the slate
       revealed even after auto-develop moves on — the stuck-open card bug.
       Leaving focus on <body> there keeps auto-drive in charge of the
       reveal. */
    if (returnTo && isFinePointer() && returnTo.focus) returnTo.focus();
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

  /* Touch rewrite: on coarse pointers the ⤢ trigger is hidden (style.css) and
     the reveal is auto-driven (initReelAutoDevelop), so a tap must NOT toggle
     the reveal — it opens the full frame instead. Capturing on the strip
     stops the event before it reaches the card: bindGroup never sees an
     open/close click, and auto-develop's userToggled handoff never fires, so
     auto-drive stays in charge of the reveal. Links inside the developed
     slate still navigate normally; cards without a real image ("More in the
     can") keep their toggle. Enter/Space on a focused card synthesizes a
     click, which this same capture path turns into "open". */
  const stripEl = document.getElementById("reel-strip");
  if (stripEl) {
    stripEl.addEventListener("click", (e) => {
      /* Always bind: a desktop session can become coarse without reloading.
         Fine pointers keep the original card toggle and separate ⤢ button. */
      if (isFinePointer() || e.target.closest("a")) return;
      const card = e.target.closest(".develop-card");
      if (!card) return;
      const imgEl = card.querySelector(".develop-media img");
      if (!imgEl) return;
      const i = frames.findIndex((f) => f.src === imgEl.getAttribute("src"));
      if (i < 0) return;
      e.preventDefault();
      e.stopPropagation();
      open(i);
    }, true);

    function syncCardLabels() {
      stripEl.querySelectorAll(".develop-card").forEach((card) => {
        const imgEl = card.querySelector(".develop-media img");
        if (!imgEl) return;
        const f = frames.find((fr) => fr.src === imgEl.getAttribute("src"));
        if (!f) return;
        const label = isFinePointer()
          ? `${f.name} — reveal details`
          : `${f.name} — view full frame`;
        if (card.getAttribute("aria-label") !== label) card.setAttribute("aria-label", label);
      });
    }
    syncReelInputMode = syncCardLabels;
    syncCardLabels();
    if (finePointerMq.addEventListener) finePointerMq.addEventListener("change", syncCardLabels);
    else if (finePointerMq.addListener) finePointerMq.addListener(syncCardLabels);
  }

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

/* ================= BACK TO TOP ================= */

/* Floating ↑ that appears once the visitor reaches the end credits and scrolls
   back to the top on tap. Visibility is class-toggled by an
   IntersectionObserver on the end card (no scroll listener); html's
   scroll-behavior owns smoothness, and the reduced-motion media query in
   style.css already drops that to auto. Without IntersectionObserver the
   button falls back to always-visible — still useful from anywhere. */
function initBackToTop() {
  const btn = document.getElementById("back-top");
  if (!btn) return;
  btn.addEventListener("click", () => window.scrollTo(0, 0));
  const target = document.querySelector(".credits-final") || document.getElementById("credits");
  if (!target || typeof IntersectionObserver === "undefined") {
    btn.classList.add("is-visible");
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => btn.classList.toggle("is-visible", e.isIntersecting));
  }, { rootMargin: "0px 0px -35% 0px", threshold: 0 });
  io.observe(target);
}

/* ================= REEL AUTO-DEVELOP ================= */

/* The frame index owns automatic development. Every input mode gets a
   one-at-a-time reveal on every index change, including the desktop pin and
   scrolling backwards. Fine-pointer hover/focus temporarily overrides the
   automatic card; leaving that card resumes the current index. Because the
   current media query is checked on every drive, desktop ↔ touch switching
   works without a reload.

   A click takes ownership (data-userToggled) until that card leaves the viewport.
   IntersectionObserver is used ONLY to release that ownership — never to choose
   the active card — so asynchronous observer ratios cannot skip frame 01 or jump
   ahead of the 01–05 index. */
function initReelAutoDevelop() {
  const cards = Array.from(document.querySelectorAll(".develop-card"));
  if (cards.length < 2 || prefersReduced) return;

  let currentIdx = 0;
  let lastFine = isFinePointer();

  function show(card) {
    cards.forEach((c) => {
      const open = c === card;
      if (c.classList.contains("is-open") !== open) c.classList.toggle("is-open", open);
      const aria = open ? "true" : "false";
      if (c.getAttribute("aria-expanded") !== aria) c.setAttribute("aria-expanded", aria);
    });
  }

  function drive(idx) {
    currentIdx = Math.max(0, Math.min(cards.length - 1, idx));
    const fine = isFinePointer();
    /* Check the mode transition here too, not only in the media-query event.
       The next index update must work even if the browser delivers that event
       late during emulation, rotation or a detachable-keyboard change. */
    if (fine !== lastFine) {
      lastFine = fine;
      cards.forEach((c) => delete c.dataset.userToggled);
    }
    if (cards.some((c) => c.dataset.userToggled)) return;
    if (fine && cards.some((card) =>
      card.matches(":hover") || card.contains(document.activeElement)
    )) return;
    show(cards[currentIdx]);
  }
  driveReelCard = drive;

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      card.dataset.userToggled = "1";
    }, true);

    /* A hovered or focused neighbour temporarily owns the presentation without
       leaving the automatic card open beside it. drive() checks the live
       hover/focus state, so leaving the card resumes the current index. */
    const takeDesktopControl = () => {
      if (!isFinePointer()) return;
      cards.forEach((other) => {
        if (other === card) return;
        other.classList.remove("is-open");
        other.setAttribute("aria-expanded", "false");
      });
    };
    const releaseDesktopControl = () => {
      if (!isFinePointer()) return;
      requestAnimationFrame(() => drive(currentIdx));
    };
    card.addEventListener("mouseenter", takeDesktopControl);
    card.addEventListener("focusin", takeDesktopControl);
    card.addEventListener("mouseleave", releaseDesktopControl);
    card.addEventListener("focusout", releaseDesktopControl);
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting || !e.target.dataset.userToggled) return;
        delete e.target.dataset.userToggled;
        drive(currentIdx);
      });
    }, { threshold: 0 });
    cards.forEach((c) => io.observe(c));
  }

  const onPointerChange = () => drive(currentIdx);
  if (finePointerMq.addEventListener) finePointerMq.addEventListener("change", onPointerChange);
  else if (finePointerMq.addListener) finePointerMq.addListener(onPointerChange);

  /* Pins and native scrollers have already painted their index by this point.
     Honour a mid-Reel reload, but make the normal 01 — 05 entry deterministic. */
  const label = document.getElementById("reel-index");
  const initialIdx = label ? Number.parseInt(label.textContent, 10) - 1 : 0;
  drive(Number.isFinite(initialIdx) && initialIdx >= 0 ? initialIdx : 0);
}

/* ================= SCENE NAV ================= */

/* Desktop: the HUD cue strip (00–06) glides to each cut. Mobile: the
   bottom scene bar (● NN / 06 — NAME) plus a Scenes button that opens the
   full-width scene slate. Both share the same active-scene math as the HUD
   (last TC mark at or above the scroll position), and jumps ride the page's
   native smooth scroll — the playhead sweeps through the intermediate
   scenes during the glide, exactly like wheel scrolling (reduced-motion
   jumps stay instant). Links are real anchors, so no-JS visitors keep
   ordinary hash navigation. */
const SCENE_NAMES = {
  "cold-open": "Home",
  logline: "About",
  feature: "Journey",
  reel: "Projects",
  "call-sheet": "Experience",
  gear: "Skills",
  credits: "Contact",
};

function initSceneNav() {
  const hudNav = document.getElementById("hud-nav");
  const ticks = hudNav ? Array.from(hudNav.querySelectorAll(".hud-cut")) : [];
  const bar = document.getElementById("scene-bar");
  const barNow = document.getElementById("scene-bar-now");
  const barBtn = document.getElementById("scene-bar-btn");
  const slate = document.getElementById("scene-slate");
  const slateClose = slate ? slate.querySelector(".scene-slate-close") : null;
  const rows = slate ? Array.from(slate.querySelectorAll(".scene-row")) : [];
  const backTopEl = document.getElementById("back-top");
  if (!ticks.length && !bar) return;

  let marks = [];
  let activeIdx = -1;
  let barLive = false;
  let raf = 0;
  let lastFocus = null;

  /* #reel is the pinned element itself, so while its pin is engaged its own
     rect is fixed-position fiction; the pin-spacer holds its true document
     position. (.feature-pin is pinned *inside* #feature, which never moves,
     so the spacer branch simply never triggers for it.) */
  function sceneY(node) {
    const holder =
      node.parentElement && node.parentElement.classList.contains("pin-spacer")
        ? node.parentElement
        : node;
    return holder.getBoundingClientRect().top + window.scrollY;
  }

  function measure() {
    marks = TC_MARKS.map((t) => {
      const node = document.getElementById(t.id);
      return { id: t.id, y: node ? sceneY(node) : 0 };
    });
  }

  function currentIndex() {
    const y = window.scrollY + 2;
    let idx = 0;
    for (let i = 0; i < marks.length; i++) if (y >= marks[i].y) idx = i;
    return idx;
  }

  function paint() {
    if (!marks.length) return;
    const idx = currentIndex();
    if (idx !== activeIdx) {
      activeIdx = idx;
      const id = marks[idx].id;
      [...ticks, ...rows].forEach((l) => {
        if (l.dataset.scene === id) l.setAttribute("aria-current", "location");
        else l.removeAttribute("aria-current");
      });
      if (barNow) {
        barNow.innerHTML =
          `<span class="scene-bar-dot">●</span> ${String(idx).padStart(2, "0")} / 06 — ` +
          (SCENE_NAMES[id] || id).toUpperCase();
      }
    }
    if (!bar) return;
    /* The bar stays hidden over the cold open (title card stays clean) and
       near the footer/end card (never covers the last CTAs or the footer
       itself), and while the slate is open. */
    const vh = window.innerHeight;
    const foot = document.querySelector(".site-footer");
    const footTop = foot ? sceneY(foot) : Infinity;
    const slateOpen = slate && !slate.hidden;
    /* The back-to-top arrow owns the corner once the end credits are reached
       — the bar never shares the bottom edge with it. */
    const backTopShown = backTopEl && backTopEl.classList.contains("is-visible");
    const live =
      window.scrollY > vh * 0.6 &&
      footTop - window.scrollY >= vh * 0.9 &&
      !slateOpen &&
      !backTopShown;
    if (live !== barLive) {
      barLive = live;
      bar.classList.toggle("is-live", live);
    }
  }

  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      paint();
    });
  }

  function onResize() {
    measure();
    paint();
  }

  /* Glide to a scene like ordinary scrolling — html { scroll-behavior:
     smooth } owns the motion, so the playhead sweeps through the intermediate
     scenes during the glide, same as wheel scrolling (reduced-motion sets
     scroll-behavior back to auto, so those jumps stay instant). Scene 06
     lands on the end card ("Want in on the next one?") rather than the top
     of the roll — the roll is the journey, the card is the destination.
     Active-scene tracking still keys off #credits' own top, so the whole
     roll reads as scene 06. */
  /* Glide to a scene like ordinary scrolling, with the target re-measured
     EVERY FRAME. Two hard-won lessons live here:
     1. A once-measured smooth scroll targets an absolute offset. When the
        document shifts underneath the glide — webfonts swapping metrics
        mid-flight is the classic, and it moves the tall credits list enough
        to strand scene 06 inside the roll — the glide ends where the target
        USED to be. Re-measuring each frame makes the glide chase the live
        target and land exactly.
     2. The tween is ours (rAF, ease-out-cubic, duration scaled to distance)
        rather than the native scroll-behavior animation, so per-frame sets
        stay instant — html { scroll-behavior: smooth } would re-animate
        every set. Wheel / touch / keys mid-glide hand control back to the
        visitor and cancel the tween (bounded rAF, never a loop).
     Scene 06 lands on the end card ("Want in on the next one?"), not the
     top of the roll — the roll is the journey, the card is the destination.
     Active-scene tracking still keys off #credits' own top. */
  function targetTop(id) {
    /* The credits end card is an ABSOLUTE overlay on the 100dvh sticky
       screen (motion-on), so its own rect is glued to the TOP of the roll
       track — measuring it lands the visitor at the roll's first frame,
       not the finale. The completed state lives at the end of the
       ScrollTrigger scrub ("bottom bottom" on the track), i.e.
       trackTop + trackHeight - viewport. The same formula is right without
       GSAP: the card then sits in normal flow and the track's end is
       exactly where it fills the screen. */
    if (id === "credits") {
      const track = document.querySelector("#credits .credits-roll-track");
      if (track) {
        const top = track.getBoundingClientRect().top + window.scrollY;
        return top + track.offsetHeight - window.innerHeight;
      }
    }
    const target = document.getElementById(id);
    if (!target) return null;
    const holder =
      target.parentElement && target.parentElement.classList.contains("pin-spacer")
        ? target.parentElement
        : target;
    return holder.getBoundingClientRect().top + window.scrollY;
  }

  let glideRaf = 0;
  let glidePrevBehavior = "";

  function jumpTo(id) {
    /* a new jump supersedes any glide already in flight */
    if (glideRaf) cancelAnimationFrame(glideRaf);
    glideRaf = 0;
    const y0 = window.scrollY;
    const live = targetTop(id);
    if (live === null) return;
    if (prefersReduced) {
      window.scrollTo(0, live + 2);
      return;
    }
    const de = document.documentElement;
    glidePrevBehavior = de.style.scrollBehavior;
    de.style.scrollBehavior = "auto"; /* per-frame sets must not re-smooth */
    const duration = Math.min(1100, Math.max(450, Math.abs(live - y0) / 2.2));
    const t0 = performance.now();
    let canceled = false;
    const hijack = () => { canceled = true; };
    window.addEventListener("wheel", hijack, { once: true, passive: true });
    window.addEventListener("touchstart", hijack, { once: true, passive: true });
    window.addEventListener("keydown", hijack, { once: true });
    const finish = () => {
      window.removeEventListener("wheel", hijack);
      window.removeEventListener("touchstart", hijack);
      window.removeEventListener("keydown", hijack);
      de.style.scrollBehavior = glidePrevBehavior;
      glideRaf = 0;
    };
    const frame = (now) => {
      glideRaf = 0;
      if (canceled) {
        finish();
        return;
      }
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const target = targetTop(id); /* live — chase a moving target */
      if (target === null) {
        finish();
        return;
      }
      window.scrollTo(0, y0 + (target - y0) * eased + 2);
      if (t < 1) glideRaf = requestAnimationFrame(frame);
      else finish();
    };
    glideRaf = requestAnimationFrame(frame);
  }

  /* Every in-page scene link — HUD ticks, slate rows, and content buttons
     like Act VI's "Write the next scene with me" — glides to the same
     destination. Delegated so future anchors get it for free; preventDefault
     keeps the hash out of the URL (scene 06 as a raw #credits anchor would
     land on the roll, not the end card). */
  document.addEventListener("click", (e) => {
    const a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    const id = a.getAttribute("href").slice(1);
    if (!SCENE_NAMES[id]) return;
    e.preventDefault();
    const fromSlate = slate && !slate.hidden;
    if (fromSlate) closeSlate(false);
    jumpTo(id);
    /* focus leaves the closing slate — park it on the bar button */
    if (fromSlate && barBtn) barBtn.focus();
  });

  /* Correct a plain-hash arrival (restored tab, shared link, a click that
     ran without this handler): #credits must still end on the end card,
     not the roll. Fires at init AND again after load — the browser's own
     fragment scroll lands around the load event and would otherwise stomp
     an early correction. A second call mid-glide just re-targets. */
  const correctHash = () => {
    const id = location.hash.slice(1);
    if (SCENE_NAMES[id]) jumpTo(id);
  };
  requestAnimationFrame(correctHash);
  window.addEventListener("load", () => requestAnimationFrame(correctHash));

  let slateIsOpen = false;

  function openSlate() {
    if (!slate || slateIsOpen) return;
    slateIsOpen = true;
    lastFocus = document.activeElement;
    slate.hidden = false;
    /* two frames: display:none → laid out, then the transform animates in
       from the closed state (see .scene-slate.is-open in style.css) */
    requestAnimationFrame(() =>
      requestAnimationFrame(() => slate.classList.add("is-open"))
    );
    /* same scroll lock as the full-frame viewer */
    document.documentElement.style.overflow = "hidden";
    if (barBtn) barBtn.setAttribute("aria-expanded", "true");
    barLive = false;
    bar.classList.remove("is-live");
    const current = rows.find((r) => r.hasAttribute("aria-current")) || rows[0];
    if (current) current.focus();
  }

  function closeSlate(restoreFocus) {
    if (!slate || !slateIsOpen) return;
    slateIsOpen = false;
    slate.classList.remove("is-open");
    if (barBtn) barBtn.setAttribute("aria-expanded", "false");
    const finish = () => {
      slate.hidden = true;
      document.documentElement.style.overflow = "";
      if (restoreFocus && lastFocus && document.contains(lastFocus)) lastFocus.focus();
      paint();
    };
    if (prefersReduced) {
      finish();
      return;
    }
    /* let the panel slide down before display:none drops it; the timeout
       backstops transitionend, which can be swallowed (resize-to-desktop
       hides the slate via CSS mid-animation, so no transition runs) */
    let done = false;
    const onEnd = () => {
      if (done) return;
      done = true;
      finish();
    };
    slate
      .querySelector(".scene-slate-panel")
      .addEventListener("transitionend", onEnd, { once: true });
    setTimeout(onEnd, 450);
  }

  if (slate) {
    slate.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeSlate(true);
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = [slateClose, ...rows].filter(Boolean);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
    slate.querySelectorAll("[data-scene-close]").forEach((el) => {
      el.addEventListener("click", () => closeSlate(true));
    });
  }

  if (barBtn) {
    barBtn.addEventListener("click", () => {
      if (!slateIsOpen) openSlate();
      else closeSlate(true);
    });
  }

  /* One passive rAF-coalesced scroll listener serves both breakpoints —
     added once here, never re-added, so nothing can duplicate across the
     768px boundary (AGENTS: duplicate listeners across resizes). */
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  const mq = window.matchMedia("(min-width: 768px)");
  const onMq = () => {
    /* a slate left open across a resize-to-desktop must not strand */
    closeSlate(false);
    measure();
    paint();
  };
  if (mq.addEventListener) mq.addEventListener("change", onMq);
  else mq.addListener(onMq);

  /* Measure after the pins exist (init() calls us last, same as initHud) */
  measure();
  paint();
}

/* ================= INIT ================= */

function init() {
  renderMarquee();
  initReveals();
  initMagnetic();
  initCursor();
  initReelIndex();
  initMarquee();
  initFrameView();
  initBackToTop();

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
  initSceneNav();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
