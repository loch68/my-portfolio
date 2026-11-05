/* ==========================================================================
   LOCHGRAPHY — portfolio interactions
   No dependencies. Every feature degrades gracefully without JavaScript:
   content is fully readable, the form falls back to plain mailto links.
   ========================================================================== */

(() => {
  "use strict";

  const CONFIG = {
    // Where contact-form messages are delivered (single source of truth).
    // To use a form service instead (e.g. Formspree), swap this handler.
    recipient: "lochgraphy@gmail.com",
  };

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Scroll reveal ---------- */

  const reveals = $$(".reveal");

  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    // Elements already in the first viewport reveal synchronously so the
    // hero never waits on IntersectionObserver scheduling.
    const inViewport = (el) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };

    reveals.forEach((el) =>
      inViewport(el) ? el.classList.add("is-in") : io.observe(el)
    );
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Navigation ---------- */

  const nav = $("#nav");
  const navToggle = $("#navToggle");

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setMenu = (open) => {
    nav.classList.toggle("menu-open", open);
    document.body.classList.toggle("menu-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  navToggle.addEventListener("click", () =>
    setMenu(!nav.classList.contains("menu-open"))
  );

  $$(".nav__links a").forEach((link) =>
    link.addEventListener("click", () => setMenu(false))
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("menu-open")) setMenu(false);
  });

  /* ---------- Active section highlight ---------- */

  const sectionLinks = new Map(
    $$(".nav__links a[href^='#']")
      .map((link) => [link.getAttribute("href").slice(1), link])
  );

  if ("IntersectionObserver" in window && sectionLinks.size) {
    const sections = [...sectionLinks.keys()]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const link = sectionLinks.get(entry.target.id);
          if (!link) continue;
          if (entry.isIntersecting) {
            sectionLinks.forEach((l) => l.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Contact form (mailto composer) ----------
     Honest no-backend delivery: the form validates input, then opens the
     visitor's own email client with the message pre-composed. There is no
     server storage — the status line says exactly that. */

  const form = $("#contactForm");
  const status = $("#formStatus");

  if (form && status) {
    const setStatus = (msg, kind) => {
      status.textContent = msg;
      status.classList.toggle("is-ok", kind === "ok");
      status.classList.toggle("is-err", kind === "err");
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.elements["name"].value.trim();
      const email = form.elements["email"].value.trim();
      const topic = form.elements["topic"].value;
      const message = form.elements["message"].value.trim();

      let firstInvalid = null;
      const invalidIf = (el, bad) => {
        el.classList.toggle("is-invalid", bad);
        if (bad && !firstInvalid) firstInvalid = el;
        return bad;
      };

      const nameBad = invalidIf(form.name, name.length < 2);
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const emailBad = invalidIf(form.email, !emailOk);
      const msgBad = invalidIf(form.message, message.length < 10);

      if (firstInvalid) {
        setStatus(
          nameBad || emailBad ? "Please check your name and email address." : "Please write a slightly longer message (at least a sentence).",
          "err"
        );
        firstInvalid.focus();
        return;
      }

      const subject = `[Portfolio] ${topic} — ${name}`;
      const body = `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`;
      const href = `mailto:${CONFIG.recipient}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      setStatus("Opening your email app with the message ready — just press send.", "ok");

      // Trigger the mail client via a transient anchor: no popup window,
      // no empty tab, works even while the form element is being reset.
      const mail = document.createElement("a");
      mail.href = href;
      mail.rel = "noopener";
      mail.style.display = "none";
      document.body.appendChild(mail);
      mail.click();
      mail.remove();

      // Let the visitor know a fallback address too.
      setTimeout(
        () => setStatus(`If nothing opened, email ${CONFIG.recipient} directly.`, "ok"),
        4000
      );
    });

    ["input", "change"].forEach((type) =>
      form.addEventListener(type, (e) => {
        if (e.target.classList?.contains("is-invalid")) {
          e.target.classList.remove("is-invalid");
          if (!status.classList.contains("is-ok")) {
            setStatus(
              "Opens your own email app with the message prepared — nothing is stored on this site.",
              ""
            );
          }
        }
      })
    );
  }

  /* ---------- Footer year ---------- */

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
