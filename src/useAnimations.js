import { useEffect } from "react";

export default function useAnimations() {
  useEffect(() => {
    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups = [];
    const timers = new Set();
    const frames = new Set();
    let active = true;

    const delay = (callback, ms) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        if (active) callback();
      }, ms);
      timers.add(id);
    };
    const frame = (callback) => {
      const id = window.requestAnimationFrame((time) => {
        frames.delete(id);
        if (active) callback(time);
      });
      frames.add(id);
    };
    const listen = (element, event, callback, options) => {
      if (!element) return;
      element.addEventListener(event, callback, options);
      cleanups.push(() => element.removeEventListener(event, callback, options));
    };
    const observe = (callback, options) => {
      const observer = new IntersectionObserver((entries) => {
        if (active) callback(entries, observer);
      }, options);
      cleanups.push(() => observer.disconnect());
      return observer;
    };
    // Restore only fields owned here; filters and other React state stay untouched.
    const saveClass = (element, name) => {
      if (!element) return;
      const original = element.classList.contains(name);
      cleanups.push(() => element.classList.toggle(name, original));
    };
    const saveStyle = (element, name) => {
      if (!element) return;
      const value = element.style.getPropertyValue(name);
      const priority = element.style.getPropertyPriority(name);
      cleanups.push(() => {
        if (value) element.style.setProperty(name, value, priority);
        else element.style.removeProperty(name);
      });
    };
    const saveText = (element) => {
      if (!element) return;
      const original = element.textContent;
      cleanups.push(() => { element.textContent = original; });
    };

    // Reveal siblings with the original CSS delay and intersection threshold.
    const revealObs = observe((entries, observer) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    }), { threshold: 0.15 });
    $$(".reveal").forEach((element) => {
      saveClass(element, "is-in");
      saveStyle(element, "--rd");
      const siblings = $$(".reveal", element.parentElement)
        .filter((sibling) => sibling.parentElement === element.parentElement);
      element.style.setProperty("--rd", `${siblings.indexOf(element) * 0.08}s`);
      revealObs.observe(element);
    });

    const countObs = observe((entries, observer) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.count);
      observer.unobserve(element);
      if (!Number.isFinite(target)) return;
      if (reduceMotion) {
        element.textContent = target;
        return;
      }
      const start = performance.now();
      const step = (time) => {
        const progress = Math.min((time - start) / 1400, 1);
        element.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
        if (progress < 1) frame(step);
      };
      frame(step);
    }), { threshold: 0.6 });
    $$("[data-count]").forEach((element) => {
      saveText(element);
      countObs.observe(element);
    });

    const indexItems = $$("#sidx li");
    const navLinks = $$(".nav__links a");
    [...indexItems, ...navLinks].forEach((element) => saveClass(element, "is-active"));
    indexItems.forEach((item) => {
      const navigate = () => document.getElementById(item.dataset.target)
        ?.scrollIntoView({ behavior: "smooth" });
      listen(item, "click", navigate);
      listen(item, "keydown", (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        navigate();
      });
    });
    const sectionObs = observe((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      indexItems.forEach((item) => item.classList.toggle("is-active", item.dataset.target === id));
      navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`));
    }), { rootMargin: "-45% 0px -50% 0px" });
    $$("[data-section]").forEach((section) => sectionObs.observe(section));

    const marker = $("#rulerMarker");
    const percent = $("#rulerPct");
    saveStyle(marker, "top");
    saveStyle(percent, "top");
    saveText(percent);
    const updateRuler = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (marker) marker.style.top = `${progress * 100}%`;
      if (percent) {
        percent.style.top = `${-progress * 20}px`;
        percent.textContent = String(Math.round(progress * 100)).padStart(2, "0");
      }
    };
    listen(window, "scroll", updateRuler, { passive: true });
    updateRuler();

    const journeyLine = $(".jr__line");
    const journeyFill = $("#jrFill");
    const nodes = $$(".node");
    saveStyle(journeyFill, "height");
    nodes.forEach((node) => saveClass(node, "is-on"));
    const updateJourney = () => {
      if (!journeyLine || !journeyFill) return;
      const mark = window.innerHeight * 0.6;
      const line = journeyLine.getBoundingClientRect();
      journeyFill.style.height = `${Math.min(Math.max(mark - line.top, 0), line.height)}px`;
      nodes.forEach((node) => {
        const dot = $(".node__dot", node);
        if (dot) node.classList.toggle("is-on", dot.getBoundingClientRect().top <= mark);
      });
    };
    listen(window, "scroll", updateJourney, { passive: true });
    listen(window, "resize", updateJourney);
    updateJourney();

    const cards = $$(".badge-card");
    const achXp = $("#achXp");
    const achCount = $("#achCount");
    const achTotal = $("#achTotal");
    const achBar = $("#achBar");
    const toast = $("#achToast");
    const toastText = $("#achToastText");
    [achXp, achCount, achTotal, toastText].forEach(saveText);
    saveStyle(achBar, "width");
    saveClass(toast, "is-show");
    cards.forEach((card) => {
      saveClass(card, "is-unlocked");
      card.classList.remove("is-unlocked");
    });
    let unlocked = 0;
    let xp = 0;
    let toastShown = false;
    if (achTotal) achTotal.textContent = cards.length;
    if (achCount) achCount.textContent = "0";
    if (achXp) achXp.textContent = "0";
    if (achBar) achBar.style.width = "0%";
    toast?.classList.remove("is-show");

    const unlockCard = (card) => {
      if (card.classList.contains("is-unlocked")) return;
      card.classList.add("is-unlocked");
      unlocked++;
      const reward = Number(card.dataset.xp);
      xp += Number.isFinite(reward) ? reward : 0;
      if (achCount) achCount.textContent = unlocked;
      if (achXp) achXp.textContent = xp.toLocaleString("en-US");
      if (achBar) achBar.style.width = `${(unlocked / cards.length) * 100}%`;
      if (unlocked === cards.length && !toastShown) {
        toastShown = true;
        if (toastText) toastText.textContent = `${unlocked}/${cards.length} · +${xp.toLocaleString("en-US")} XP`;
        toast?.classList.add("is-show");
        delay(() => toast?.classList.remove("is-show"), 3200);
      }
    };
    const unlockQueue = [];
    let unlocking = false;
    const drainQueue = () => {
      if (!unlockQueue.length) { unlocking = false; return; }
      unlocking = true;
      unlockCard(unlockQueue.shift());
      delay(drainQueue, reduceMotion ? 0 : 140);
    };
    const achievementObs = observe((entries, observer) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      unlockQueue.push(entry.target);
      observer.unobserve(entry.target);
      if (!unlocking) drainQueue();
    }), { threshold: 0.4 });
    cards.forEach((card) => achievementObs.observe(card));

    if (!reduceMotion) {
      const floats = $$(".float");
      floats.forEach((element) => {
        saveStyle(element, "--px");
        saveStyle(element, "--py");
      });
      listen($(".hero"), "pointermove", (event) => {
        const rx = event.clientX / window.innerWidth - 0.5;
        const ry = event.clientY / window.innerHeight - 0.5;
        floats.forEach((element, index) => {
          const depth = (index % 3 + 1) * 14;
          element.style.setProperty("--px", `${-rx * depth}px`);
          element.style.setProperty("--py", `${-ry * depth}px`);
        });
      });
    }

    return () => {
      active = false;
      timers.forEach((id) => window.clearTimeout(id));
      frames.forEach((id) => window.cancelAnimationFrame(id));
      timers.clear();
      frames.clear();
      unlockQueue.length = 0;
      cleanups.reverse().forEach((cleanup) => cleanup());
    };
  }, []);
}
