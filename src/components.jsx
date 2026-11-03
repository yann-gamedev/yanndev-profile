import { useEffect, useRef, useState } from "react";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const bootLines = [
  "YANN-BIOS v2.6 (C) 2026",
  "MEMORY CHECK ........ 640K OK",
  "LOADING PIXELS ...... OK",
  "MOUNTING /portfolio . OK",
  "USER: CHRISTIAN ..... OK",
  "> HELLO, WORLD.",
];
const glyphs = "!<>-_\\/[]{}=+*^?#░▒▓█";
const levels = ["", "NOVICE", "APPRENTICE", "ADEPT", "EXPERT", "MASTER"];
const assetPaths = new Set(Object.keys(import.meta.glob("/public/assets/**/*.{png,jpg,jpeg,webp}")));
const clampPage = (index, length) => Math.min(Math.max(index, 0), Math.max(0, length - 1));
if (import.meta.env.DEV) {
  console.assert(clampPage(-1, 3) === 0 && clampPage(3, 3) === 2 && clampPage(1, 0) === 0,
    "Viewer page bounds self-check failed");
}

export function Boot() {
  const boot = useRef(null);
  const log = useRef(null);
  const bar = useRef(null);

  useEffect(() => {
    let timer;
    let seen;
    try { seen = sessionStorage.getItem("booted"); } catch {}
    const body = document.body;
    const element = boot.current;
    element.classList.remove("is-done");
    log.current.textContent = "";
    bar.current.style.width = "0%";
    if (reducedMotion() || seen) {
      element.style.display = "none";
      body.classList.remove("is-booting");
      body.classList.add("is-loaded");
    } else {
      element.style.removeProperty("display");
      body.classList.remove("is-loaded");
      body.classList.add("is-booting");
      let index = 0;
      const tick = () => {
        log.current.textContent += `${bootLines[index]}\n`;
        bar.current.style.width = `${((index + 1) / bootLines.length) * 100}%`;
        index++;
        if (index < bootLines.length) timer = setTimeout(tick, 230);
        else timer = setTimeout(() => {
          element.classList.add("is-done");
          body.classList.remove("is-booting");
          timer = setTimeout(() => {
            body.classList.add("is-loaded");
            // Persist only after completion; StrictMode's first setup is disposable.
            try { sessionStorage.setItem("booted", "1"); } catch {}
          }, 250);
        }, 450);
      };
      tick();
    }
    return () => {
      clearTimeout(timer);
      body.classList.remove("is-booting", "is-loaded");
    };
  }, []);

  return (
    <div className="boot" id="boot" aria-hidden="true" ref={boot}>
      <pre className="boot__log" id="bootLog" ref={log} />
      <div className="boot__bar"><span id="bootBar" ref={bar} /></div>
    </div>
  );
}

export function Clock() {
  const [time, setTime] = useState("00:00:00");
  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      setTime([date.getHours(), date.getMinutes(), date.getSeconds()]
        .map((part) => String(part).padStart(2, "0")).join(":"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return <span className="nav__clock" id="clock">{time}</span>;
}

export function ScrambleLink({ children, onMouseEnter, ...props }) {
  const link = useRef(null);
  const frame = useRef(null);
  useEffect(() => {
    link.current.textContent = children;
    return () => cancelAnimationFrame(frame.current);
  }, [children]);

  const scramble = (event) => {
    onMouseEnter?.(event);
    cancelAnimationFrame(frame.current);
    if (reducedMotion()) return;
    let step = 0;
    const run = () => {
      link.current.textContent = [...children]
        .map((char, index) => index < step / 2 ? char : glyphs[Math.floor(Math.random() * glyphs.length)])
        .join("");
      step++;
      if (step / 2 <= children.length) frame.current = requestAnimationFrame(run);
      else link.current.textContent = children;
    };
    run();
  };

  return <a {...props} ref={link} data-scramble="" aria-label={children} onMouseEnter={scramble}>{children}</a>;
}

export function Asset({ as: Tag = "div", base, className = "", children, ...props }) {
  const path = `/public/${base.replace(/^\/+/, "")}`;
  const source = ["png", "jpg", "jpeg", "webp"]
    .map((extension) => `${path}.${extension}`)
    .find((candidate) => assetPaths.has(candidate))?.replace(/^\/public/, "");
  const [loadedSource, setLoadedSource] = useState(null);
  const [failedSource, setFailedSource] = useState(null);
  const loaded = Boolean(source && loadedSource === source && failedSource !== source);
  return (
    <Tag {...props} data-img={base} className={`${className}${loaded ? " has-img" : ""}`}>
      {children}
      {source && failedSource !== source && (
        <img key={source} src={source} alt="" style={loaded ? undefined : { display: "none" }}
          onLoad={() => setLoadedSource(source)} onError={() => setFailedSource(source)} />
      )}
    </Tag>
  );
}

export function Skill({ level, icon, children, row = 0 }) {
  return (
    <li className="skill" data-lv={level}>
      <span className="skill__icon">{icon}</span>
      <span className="skill__name">{children}</span>
      <span className="skill__lv"><b>LV {level}</b> {levels[level]}</span>
      <span className="skill__pips">
        {Array.from({ length: 5 }, (_, col) => (
          <i key={col} className={col < level ? "on" : undefined}
            style={{ transitionDelay: `${0.25 + row * 0.08 + col * 0.06}s` }} />
        ))}
      </span>
    </li>
  );
}

export function Viewer({ item, onClose }) {
  const dialog = useRef(null);
  const imageElement = useRef(null);
  const close = useRef(() => {});
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [page, setPage] = useState({ item: null, index: 0 });
  const [image, setImage] = useState({ item: null, source: null, status: "loading" });
  const pages = item?.pages ?? [];
  const index = page.item === item ? clampPage(page.index, pages.length) : 0;
  const source = pages[index];
  const status = !source ? "error" : image.item === item && image.source === source ? image.status : "loading";
  const current = useRef(null);
  current.current = { item, index, pages };

  const changePage = (delta) => {
    const value = current.current;
    if (!value.item || dialog.current.classList.contains("is-closing")) return;
    setPage({ item: value.item, index: clampPage(value.index + delta, value.pages.length) });
  };

  useEffect(() => {
    const element = dialog.current;
    if (!item) return;
    let timer;
    let finished = false;
    let closing = false;
    const opener = item.opener ?? document.activeElement;
    setPage({ item, index: 0 });
    setImage({ item, source: item.pages?.[0], status: "loading" });
    element.classList.remove("is-closing");
    document.body.classList.add("is-modal");
    if (!element.open) element.showModal();

    const done = () => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      element.classList.remove("is-closing");
      if (element.open) element.close();
      document.body.classList.remove("is-modal");
      if (opener?.isConnected) opener.focus?.();
      onCloseRef.current?.();
    };
    const requestClose = () => {
      if (!element.open || closing || finished) return;
      closing = true;
      if (reducedMotion()) return done();
      element.classList.add("is-closing");
      timer = setTimeout(done, 450);
    };
    close.current = requestClose;
    const onAnimationEnd = (event) => {
      if (closing && event.target === element && event.animationName === "crtOff") done();
    };
    const onCancel = (event) => { event.preventDefault(); requestClose(); };
    const onBackdrop = (event) => { if (event.target === element) requestClose(); };
    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        changePage(event.key === "ArrowLeft" ? -1 : 1);
      }
    };
    element.addEventListener("animationend", onAnimationEnd);
    element.addEventListener("cancel", onCancel);
    element.addEventListener("click", onBackdrop);
    element.addEventListener("keydown", onKeyDown);
    return () => {
      finished = true;
      clearTimeout(timer);
      close.current = () => {};
      element.removeEventListener("animationend", onAnimationEnd);
      element.removeEventListener("cancel", onCancel);
      element.removeEventListener("click", onBackdrop);
      element.removeEventListener("keydown", onKeyDown);
      element.classList.remove("is-closing");
      if (element.open) element.close();
      document.body.classList.remove("is-modal");
      if (opener?.isConnected) opener.focus?.();
    };
  }, [item]);

  useEffect(() => {
    const element = imageElement.current;
    if (source && element.complete) {
      setImage({ item, source, status: element.naturalWidth ? "loaded" : "error" });
    }
  }, [item, source]);

  return (
    <dialog className="viewer" id="viewer" aria-labelledby="viewerTitle" ref={dialog} style={{ "--r": item?.color }}>
      <div className="viewer__bar">
        <i /><i /><i />
        <span id="viewerApp">{item?.app ?? "CERT_VIEWER.EXE"}</span>
        <button type="button" className="viewer__close" id="viewerClose" aria-label="Close preview" onClick={() => close.current()}>✕</button>
      </div>
      <div className="viewer__head">
        <span className="rarity" id="viewerRarity" style={{ color: "var(--r)" }}>{item?.tag}</span>
        <h3 id="viewerTitle">{item?.title}</h3>
        <p id="viewerOrg">{item?.org}</p>
      </div>
      <div className="viewer__stage" aria-busy={status === "loading"}>
        <img key={source ?? "empty"} ref={imageElement} id="viewerImg" src={source || undefined} alt={item?.alt ?? ""} draggable="false"
          className={status === "loading" ? "is-loading" : undefined} hidden={status === "error" || !source}
          onLoad={() => setImage({ item, source, status: "loaded" })}
          onError={() => setImage({ item, source, status: "error" })}
          onContextMenu={(event) => event.preventDefault()} />
        <span className="viewer__loading" id="viewerLoading" role="status"
          style={status === "error" ? { display: "block" } : undefined}>
          {status === "error" ? "IMAGE COULD NOT BE LOADED" : <>LOADING<span className="cursor">█</span></>}
        </span>
      </div>
      <div className="viewer__foot" hidden={!item?.verify && pages.length < 2}>
        <div className={`viewer__pager${pages.length < 2 ? " is-single" : ""}`} id="viewerPager">
          <button type="button" id="viewerPrev" aria-label="Previous page" disabled={index === 0} onClick={() => changePage(-1)}>◀</button>
          <span id="viewerPage">PAGE {index + 1}/{Math.max(1, pages.length)}</span>
          <button type="button" id="viewerNext" aria-label="Next page" disabled={index >= pages.length - 1} onClick={() => changePage(1)}>▶</button>
        </div>
        <a id="viewerVerify" className="btn btn--solid" target="_blank" rel="noopener" hidden={!item?.verify} href={item?.verify}>✓ VERIFY ONLINE ↗</a>
      </div>
    </dialog>
  );
}
