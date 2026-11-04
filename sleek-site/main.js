/* Abdulsamad Osunlana · portfolio motion */
(function () {
  const RM = document.documentElement.classList.contains("rm");
  const P = window.PROJECTS || [];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pad2 = (n) => String(n).padStart(2, "0");

  /* ---------- Work cards ---------- */
  const stack = $("[data-stack]");
  P.forEach((p, i) => {
    const li = document.createElement("li");
    li.className = p.shot ? "card" : "card no-shot";
    li.style.background = p.ink;
    li.style.color = p.paper;
    li.innerHTML = `
      <button class="card-btn" type="button" data-open="${i}" aria-label="Read the ${p.name} story">
        <span class="card-top"><span>${p.status} · ${p.period}</span></span>
        <span>
          <h3 class="card-name">${p.name}</h3>
        </span>
        <span class="card-bottom">
          <p class="card-hook">${p.tag}</p>
          <span class="card-cta"><span>Read the story</span></span>
        </span>
      </button>
      ${p.shot ? `<span class="card-shot" aria-hidden="true"><img src="${p.shot}" alt="" loading="lazy" width="1600" height="1000" /></span>` : ""}
      <span class="card-shade" aria-hidden="true"></span>`;
    stack.appendChild(li);
  });

  /* ---------- Word splitting for scroll-lit text ---------- */
  $$("[data-words]").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", el.textContent.trim());
    el.innerHTML = words.map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join(" ");
  });

  /* ---------- Theme switch (shared with the About page through localStorage "theme") ---------- */
  (function () {
    const html = document.documentElement;
    const btns = [...document.querySelectorAll("[data-theme-set]")];
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const get = () => { try { const t = localStorage.getItem("theme"); return t === "light" || t === "dark" ? t : "system"; } catch (e) { return "system"; } };
    function apply(choice) {
      const resolved = choice === "system" ? (mq.matches ? "dark" : "light") : choice;
      html.dataset.theme = resolved;
      html.classList.toggle("dark", resolved === "dark");
      btns.forEach((b) => b.setAttribute("aria-checked", String(b.dataset.themeSet === choice)));
    }
    btns.forEach((b) => b.addEventListener("click", () => {
      const c = b.dataset.themeSet;
      try { c === "system" ? localStorage.removeItem("theme") : localStorage.setItem("theme", c); } catch (e) {}
      apply(c);
    }));
    mq.addEventListener("change", () => get() === "system" && apply("system"));
    apply(get());
  })();

  if (RM || !window.gsap) {
    bindUI(null);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scroll ---------- */
  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ---------- Opening ---------- */
  const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
  intro
    .fromTo(".hero-photo", { clipPath: "inset(49.5% 0% 49.5% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut" }, 0.15)
    .from(".hero-photo img", { scale: 1.4, duration: 2, ease: "expo.out" }, 0.15)
    .from(".hero-line.l1", { xPercent: -30, opacity: 0, duration: 1.6 }, 0.35)
    .from(".hero-line.l2", { xPercent: 30, opacity: 0, duration: 1.6 }, 0.45)
    .from(".hero-role, .hero-claim", { y: 30, opacity: 0, duration: 1 }, 1.25)
    .from(".hero-cue, .bar", { opacity: 0, duration: 1 }, 1.4);

  /* Scroll away from the opening: the photo swells, the name parts */
  gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "+=70%", scrub: 0.6, pin: true } })
    .to(".hero-photo", { scale: 2.6, opacity: 0.18, ease: "none" }, 0)
    .to(".hero-line.l1", { xPercent: -24, ease: "none" }, 0)
    .to(".hero-line.l2", { xPercent: 24, ease: "none" }, 0)
    .to(".hero-foot", { opacity: 0, y: -40, ease: "none" }, 0);

  /* ---------- Scroll-lit words ---------- */
  $$("[data-words]").forEach((el) => {
    const ws = $$(".w", el);
    ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      end: "bottom 45%",
      scrub: true,
      onUpdate: (st) => {
        const n = Math.round(st.progress * ws.length);
        ws.forEach((w, i) => (w.style.color = i < n ? "currentColor" : ""));
      },
    });
  });

  /* ---------- Stacking cards ---------- */
  const cards = $$(".card");
  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (!next) return;
    gsap.timeline({ scrollTrigger: { trigger: next, start: "top bottom", end: "top 12%", scrub: true } })
      .to(card, { scale: 0.9, ease: "none" }, 0)
      .to($(".card-shade", card), { opacity: 0.55, ease: "none" }, 0);
  });
  cards.forEach((card) => {
    const shot = $(".card-shot", card);
    if (shot) gsap.fromTo(shot, { yPercent: 16 }, { yPercent: -3, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "top 10%", scrub: true } });
    gsap.from($(".card-name", card), { yPercent: 40, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 75%" } });
  });

  /* ---------- Reveals ---------- */
  $$("[data-reveal], .aspen, .about-photo, .contact-mail, .contact-links").forEach((el) => {
    gsap.from(el, { y: 50, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%" } });
  });

  /* ---------- Magnetic button ---------- */
  const mag = $("[data-magnetic]");
  if (mag && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const mx = gsap.quickTo(mag, "x", { duration: 0.5, ease: "power3" });
    const my = gsap.quickTo(mag, "y", { duration: 0.5, ease: "power3" });
    mag.addEventListener("pointermove", (e) => {
      const r = mag.getBoundingClientRect();
      mx((e.clientX - r.left - r.width / 2) * 0.25);
      my((e.clientY - r.top - r.height / 2) * 0.35);
    });
    mag.addEventListener("pointerleave", () => { mx(0); my(0); });
  }

  bindUI(lenis);

  /* ---------- Menu and case-study sheet ---------- */
  function bindUI(lenis) {
    const html = document.documentElement;
    const btn = $("[data-menu-toggle]");
    const menu = $("#menu");
    const sheet = $("[data-sheet]");
    let menuOpen = false;
    let current = -1;
    const anim = (el, from, to, dur, done) => {
      if (RM || !window.gsap) { if (done) done(); return; }
      gsap.fromTo(el, from, { ...to, duration: dur, ease: "expo.inOut", onComplete: done });
    };

    function setMenu(open) {
      menuOpen = open;
      btn.setAttribute("aria-expanded", String(open));
      btn.classList.toggle("menu-open", open);
      $(".menu-btn-label").textContent = open ? "Close" : "Menu";
      if (open) {
        menu.hidden = false;
        html.classList.add("menu-lock");
        lenis && lenis.stop();
        anim(menu, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)" }, 0.8);
        if (!RM && window.gsap) gsap.fromTo($$("li span", menu), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06, delay: 0.25 });
        $("a", menu).focus();
      } else {
        anim(menu, { clipPath: "inset(0 0 0% 0)" }, { clipPath: "inset(0 0 100% 0)" }, 0.6, () => { menu.hidden = true; });
        html.classList.remove("menu-lock");
        lenis && lenis.start();
      }
    }
    btn.addEventListener("click", () => setMenu(!menuOpen));
    $$("[data-close]", menu).forEach((a) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const target = a.getAttribute("href");
        setMenu(false);
        setTimeout(() => (lenis ? lenis.scrollTo(target, { offset: 0 }) : $(target).scrollIntoView()), 250);
      })
    );

    function fillSheet(i) {
      const p = P[i];
      current = i;
      const head = $("[data-sheet-head]");
      head.style.background = p.ink;
      head.style.color = p.paper;
      $("[data-sheet-kicker]").textContent = `${p.role} · ${p.status}`;
      $("[data-sheet-title]").textContent = p.name;
      $("[data-sheet-hook]").textContent = p.hook;
      const shotEl = $("[data-sheet-shot]");
      if (p.shot) { shotEl.hidden = false; shotEl.src = p.shot; } else shotEl.hidden = true;
      const link = $("[data-sheet-link]");
      if (p.link) { link.hidden = false; link.href = p.link; link.textContent = "Visit " + p.link.replace(/^https?:\/\/(www\.)?/, ""); }
      else link.hidden = true;
      const parts = [["The problem", p.problem], ["My role", p.role_text], ["How it works", p.approach], ["Key decisions", p.decisions], ["The outcome", p.outcome]];
      $("[data-sheet-body]").innerHTML = parts.filter(([, t]) => t).map(([h, t]) => `<section class="part"><h3>${h}</h3><p>${t}</p></section>`).join("");
      const n = P[(i + 1) % P.length];
      $("[data-sheet-next]").innerHTML = `<small>Next project</small><strong>${n.name}</strong>`;
      sheet.scrollTop = 0;
    }
    function openSheet(i) {
      fillSheet(i);
      sheet.hidden = false;
      html.classList.add("sheet-open");
      lenis && lenis.stop();
      anim(sheet, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)" }, 0.9);
      if (!RM && window.gsap) gsap.from([$("[data-sheet-title]"), $("[data-sheet-hook]")], { y: 60, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, delay: 0.35 });
      $("[data-sheet-close]").focus();
    }
    function closeSheet() {
      anim(sheet, { clipPath: "inset(0% 0 0 0)" }, { clipPath: "inset(0 0 100% 0)" }, 0.7, () => { sheet.hidden = true; });
      html.classList.remove("sheet-open");
      lenis && lenis.start();
      const opener = $(`[data-open="${current}"]`);
      opener && opener.focus({ preventScroll: true });
    }
    $$("[data-open]").forEach((b) => b.addEventListener("click", () => openSheet(+b.dataset.open)));
    $("[data-sheet-close]").addEventListener("click", closeSheet);
    $("[data-sheet-next]").addEventListener("click", () => {
      const i = (current + 1) % P.length;
      if (!RM && window.gsap) gsap.to(".sheet-inner", { opacity: 0, duration: 0.25, onComplete: () => { fillSheet(i); gsap.to(".sheet-inner", { opacity: 1, duration: 0.4 }); } });
      else fillSheet(i);
    });
    window.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!sheet.hidden) closeSheet();
      else if (menuOpen) { setMenu(false); btn.focus(); }
    });
  }
})();
