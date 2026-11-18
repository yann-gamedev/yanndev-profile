import { useCallback, useEffect, useState } from 'react';
import { Asset, Boot, Clock, ScrambleLink, Skill, Viewer } from './components';
import useAnimations from './useAnimations';
import { ArticlesPreview } from './Articles';

export default function App() {
  const [filter, setFilter] = useState('all');
  const [viewer, setViewer] = useState(null);
  useAnimations();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') document.documentElement.dataset.theme = saved;
    } catch { /* Storage can be disabled. */ }
  }, []);

  function toggleTheme() {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* Theme still works without storage. */ }
  }

  const closeViewer = useCallback(() => setViewer(null), []);

  function openCertificate(event) {
    const opener = event.currentTarget;
    const card = opener.closest('.badge-card');
    const title = card.querySelector('h3').textContent;
    setViewer({
      app: 'CERT_VIEWER.EXE',
      pages: card.dataset.preview.split('|'),
      title,
      org: card.querySelector('.badge-card__org').textContent,
      tag: card.querySelector('.rarity').textContent,
      color: getComputedStyle(card).getPropertyValue('--r'),
      verify: card.querySelector('.badge-card__foot a')?.href,
      alt: `Certificate: ${title}`,
      opener,
    });
  }

  function openPhoto(event) {
    const opener = event.currentTarget;
    const image = opener.querySelector('.slot__img.has-img img');
    if (!image) {
      opener.classList.remove('is-shake');
      void opener.offsetWidth;
      opener.classList.add('is-shake');
      return;
    }
    const [num, year] = [...opener.querySelectorAll('.slot__top span')].map(el => el.textContent);
    const title = opener.querySelector('.slot__cap b').textContent;
    setViewer({
      app: 'PHOTO_VIEWER.EXE', pages: [image.src], title,
      org: opener.querySelector('.slot__cap span').textContent,
      tag: `◆ ${num} · ${year}`,
      color: getComputedStyle(opener).getPropertyValue('--c'),
      alt: `Photo: ${title}`, opener,
    });
  }

  return <>
  <Boot />

  <div className="crt" aria-hidden="true"></div>

  {/* Header */}
  <header className="nav">
    <a href="#top" className="nav__logo" aria-label="Home">
      <span className="logo-mark">Y_</span>
    </a>
    <nav className="nav__links">
      <ScrambleLink href="#about">ABOUT</ScrambleLink>
      <ScrambleLink href="#stack">STACK</ScrambleLink>
      <ScrambleLink href="#work">WORK</ScrambleLink>
      <ScrambleLink href="#journey">JOURNEY</ScrambleLink>
      <ScrambleLink href="#achievements">CERTS</ScrambleLink>
      <ScrambleLink href="#articles">ARTICLES</ScrambleLink>
      <ScrambleLink href="#contact">CONTACT</ScrambleLink>
    </nav>
    <div className="nav__right">
      <Clock />
      <button className="nav__theme" id="themeToggle" aria-label="Toggle theme" onClick={toggleTheme}>◐</button>
      <a href="#contact" className="nav__cta">HIRE ME</a>
    </div>
  </header>

  {/* Section index (bottom right) */}
  <ol className="sidx" id="sidx">
    <li data-target="top" role="link" tabIndex={0}>YANNDEV</li>
    <li data-target="about" role="link" tabIndex={0}>ABOUT</li>
    <li data-target="stack" role="link" tabIndex={0}>STACK</li>
    <li data-target="work" role="link" tabIndex={0}>WORK</li>
    <li data-target="journey" role="link" tabIndex={0}>JOURNEY</li>
    <li data-target="achievements" role="link" tabIndex={0}>CERTS</li>
    <li data-target="articles" role="link" tabIndex={0}>ARTICLES</li>
    <li data-target="contact" role="link" tabIndex={0}>CONTACT</li>
  </ol>

  {/* Scroll ruler (right edge) */}
  <div className="ruler" aria-hidden="true">
    <div className="ruler__ticks"></div>
    <div className="ruler__marker" id="rulerMarker"><span id="rulerPct">00</span></div>
  </div>

  <main>
    {/* HERO */}
    <section className="hero" id="top" data-section>
      <svg className="hero__orbits" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <ellipse cx="600" cy="400" rx="560" ry="210" className="orbit o1" />
        <ellipse cx="600" cy="400" rx="520" ry="300" className="orbit o2" />
        <ellipse cx="600" cy="400" rx="430" ry="360" className="orbit o3" />
      </svg>

      {/* Floating windows */}
      <div className="float" style={{'--x': '6%', '--y': '16%', '--r': '-6deg', '--d': '0s'}}>
        <div className="win">
          <div className="win__bar"><i></i><i></i><i></i><span>me.py</span></div>
          <pre className="win__code"><b>dev</b>{" = {\n  name: "}<em>"christian"</em>{",\n  learning: "}<u>True</u>{",\n}"}</pre>
        </div>
      </div>
      <div className="float" style={{'--x': '74%', '--y': '13%', '--r': '5deg', '--d': '-2s'}}>
        <div className="win win--art art-sunset"><div className="win__bar"><i></i><i></i><i></i><span>sunset.png</span></div><div className="win__art"></div></div>
      </div>
      <div className="float" style={{'--x': '3%', '--y': '62%', '--r': '4deg', '--d': '-4s'}}>
        <div className="win win--art art-grid"><div className="win__bar"><i></i><i></i><i></i><span>network.map</span></div><div className="win__art"></div></div>
      </div>
      <div className="float" style={{'--x': '80%', '--y': '58%', '--r': '-4deg', '--d': '-1s'}}>
        <div className="win">
          <div className="win__bar"><i></i><i></i><i></i><span>terminal</span></div>
          <pre className="win__code">{"$ whoami\n"}<em>christian</em>{"\n$ ./learn --by "}<u>doing</u><span className="cursor">█</span></pre>
        </div>
      </div>
      <div className="float float--sm" style={{'--x': '20%', '--y': '80%', '--r': '-8deg', '--d': '-3s'}}>
        <div className="win win--art art-wave"><div className="win__bar"><i></i><i></i><i></i><span>signal.gif</span></div><div className="win__art"></div></div>
      </div>
      <div className="float float--sm" style={{'--x': '66%', '--y': '82%', '--r': '7deg', '--d': '-5s'}}>
        <div className="win win--art art-dither"><div className="win__bar"><i></i><i></i><i></i><span>sprite.bmp</span></div><div className="win__art"></div></div>
      </div>

      <div className="hero__inner">
        <p className="label reveal">◆ INFORMATICS STUDENT · SURABAYA, ID</p>
        <h1 className="hero__title" aria-label="YANNDEV">
          <span className="split">{[..."YANNDEV"].map((char, i) => <span className="ch" key={i} style={{ transitionDelay: `${i * 0.06}s` }}>{char}</span>)}</span>
        </h1>
        <p className="hero__tag reveal">Build it, run it, <em className="serif">secure it.</em></p>
        <p className="hero__lead reveal">
          Hi, I'm Christian — an Informatics student exploring how systems are built,
          managed, and secured. Into software engineering, networking, cybersecurity,
          AI and game development.
        </p>
        <div className="hero__btns reveal">
          <a href="#work" className="btn btn--solid">▸ VIEW WORK</a>
          <a href="#contact" className="btn">✉ GET IN TOUCH</a>
        </div>
        <p className="hero__meta reveal">
          <span className="dot-live"></span> OPEN TO WORK · ANY IT PROJECT · GMT+7
        </p>
      </div>
    </section>

    {/* 01 ABOUT */}
    <section className="sec" id="about" data-section>
      <div className="sec__head">
        <span>01 / ABOUT</span><span>WHO_AM_I.TXT</span>
      </div>
      <div className="about">
        <h2 className="big reveal">Curious about how <em className="serif">systems</em> work.</h2>
        <div className="about__main">
        {/* Player card */}
        <aside className="player reveal">
          <div className="player__bar"><span>PLAYER 1</span><span className="player__online">● ONLINE</span></div>
          <Asset className="player__photo" base="assets/images/fasilkom_zuma">
            <span className="player__ph">INSERT<br />PHOTO<span className="cursor">█</span></span>
          </Asset>
          <div className="player__info">
            <h3>Christian B. P.</h3>
            <p className="player__class">CLASS · INFORMATICS STUDENT</p>
            <dl className="player__attrs">
              <div><dt>BASE</dt><dd>SURABAYA, ID</dd></div>
              <div><dt>GUILD</dt><dd>BEM FASILKOM</dd></div>
              <div><dt>MAIN</dt><dd>NETWORK · SECURITY</dd></div>
              <div><dt>SIDE</dt><dd>AI · GAME DEV</dd></div>
            </dl>
            <div className="meter" style={{'--v': '96%', '--c': 'var(--orange)'}}><span>HP</span><i></i><b>CURIOSITY</b></div>
            <div className="meter" style={{'--v': '78%', '--c': 'var(--blue)'}}><span>MP</span><i></i><b>COFFEE</b></div>
            <div className="meter" style={{'--v': '64%', '--c': 'var(--green)'}}><span>XP</span><i></i><b>LEVELING UP</b></div>
          </div>
        </aside>
        <div className="about__grid">
          <p className="reveal">
            I'm <strong>Christian Bagus Prasetya</strong>, an Informatics student at{' '}
            <strong>UPN “ Veteran” Jawa Timur</strong> with a background in Computer and Network
            Engineering from SMK Katolik St. Louis Surabaya. I care about understanding how
            systems are built, managed, and secured.
          </p>
          <p className="reveal">
            Before university I worked as an <strong>IT Support Intern at Universitas Surabaya
            (UBAYA)</strong>, handling daily troubleshooting and helpdesk work. I hold a national
            competency certification in Network Security Design and Dynamic Routing, and keep
            sharpening my security skills on <strong>TryHackMe</strong>.
          </p>
          <p className="reveal">
            On campus I'm part of the Research &amp; Development Department at{' '}
            <strong>BEM FASILKOM UPNVJT</strong>, managing the organization's website and running
            technical learning programs like Skill Sprints. Leading events and teams has taught me
            coordination and problem-solving beyond the technical side.
          </p>
          <p className="reveal">
            Right now I'm strengthening my fundamentals through real projects. Long term, I want to
            not only understand technology, but use it to build, contribute, and help others learn.
          </p>
        </div>
        </div>
        <div className="stats">
          <div className="stat reveal"><span className="stat__n" data-count="3">0</span><span className="stat__l">YEARS IN IT</span></div>
          <div className="stat reveal"><span className="stat__n" data-count="15">0</span><span className="stat__l">PROJECTS BUILT</span></div>
          <div className="stat reveal"><span className="stat__n" data-count="350">0</span><span className="stat__l">GITHUB CONTRIBUTIONS IN 2026</span></div>
          <div className="stat reveal"><span className="stat__n" data-count="6">0</span><span className="stat__l">MONTHS AS IT SUPPORT</span></div>
        </div>

        {/* Activity gallery */}
        <div className="gallery">
          <div className="gallery__head reveal">
            <h3>Save files</h3>
            <p className="label">◆ MEMORIES FROM THE ROAD · CLICK A SLOT TO LOAD</p>
          </div>
          <div className="gallery__grid">
            <button type="button" className="slot reveal" onClick={openPhoto} style={{'--c': '#E0368F'}}>
              <span className="slot__top"><span>SLOT 01</span><span>2026</span></span>
              <Asset as="span" className="slot__img" base="assets/images/fastera" />
              <span className="slot__cap"><b>FASTERA 2026</b><span>Head of Event Division</span></span>
            </button>
            <button type="button" className="slot reveal" onClick={openPhoto} style={{'--c': '#2F7BF5'}}>
              <span className="slot__top"><span>SLOT 02</span><span>2026</span></span>
              <Asset as="span" className="slot__img" base="assets/images/fasilkom_zuma" />
              <span className="slot__cap"><b>Fasilkom Zuma 2026</b><span>Head of Web Division · Watuagung</span></span>
            </button>
            <button type="button" className="slot reveal" onClick={openPhoto} style={{'--c': '#14A9C4'}}>
              <span className="slot__top"><span>SLOT 03</span><span>2026</span></span>
              <Asset as="span" className="slot__img" base="assets/images/mosaik" />
              <span className="slot__cap"><b>MOSAIK 2026</b><span>Senior Companion · Group Spring</span></span>
            </button>
            <button type="button" className="slot reveal" onClick={openPhoto} style={{'--c': '#8B5CF6'}}>
              <span className="slot__top"><span>SLOT 04</span><span>2026</span></span>
              <Asset as="span" className="slot__img" base="assets/images/bem" />
              <span className="slot__cap"><b>BEM FASILKOM R&amp;D</b><span>Skill Sprints</span></span>
            </button>
            <button type="button" className="slot reveal" onClick={openPhoto} style={{'--c': '#F2A516'}}>
              <span className="slot__top"><span>SLOT 05</span><span>2025</span></span>
              <Asset as="span" className="slot__img" base="assets/images/lkmm" />
              <span className="slot__cap"><b>LKMM-TD SLAMP 2025</b><span>Leadership Training</span></span>
            </button>
            <button type="button" className="slot reveal" onClick={openPhoto} style={{'--c': '#E8573F'}}>
              <span className="slot__top"><span>SLOT 06</span><span>2024</span></span>
              <Asset as="span" className="slot__img" base="assets/images/ubaya" />
              <span className="slot__cap"><b>UBAYA Informatics Lab</b><span>IT Support Assistant</span></span>
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* 02 STACK marquee */}
    <section className="sec sec--flush" id="stack" data-section>
      <div className="sec__head">
        <span>02 / STACK</span><span>TOOLS &amp; FIELDS</span>
      </div>
      <div className="marquee">
        <div className="marquee__track">
          <span>▪ C</span><span>▪ C++</span><span>▪ PYTHON</span><span>▪ JAVASCRIPT</span><span>▪ PHP</span><span>▪ LARAVEL</span><span>▪ NEXT.JS</span><span>▪ REACT</span><span>▪ ASTRO</span><span>▪ POSTGRESQL</span><span>▪ DOCKER</span>
          <span>▪ C</span><span>▪ C++</span><span>▪ PYTHON</span><span>▪ JAVASCRIPT</span><span>▪ PHP</span><span>▪ LARAVEL</span><span>▪ NEXT.JS</span><span>▪ REACT</span><span>▪ ASTRO</span><span>▪ POSTGRESQL</span><span>▪ DOCKER</span>
        </div>
      </div>
      <div className="marquee marquee--rev">
        <div className="marquee__track">
          <span>● NETWORKING</span><span>● CYBERSECURITY</span><span>● CTF</span><span>● SOFTWARE ENGINEERING</span><span>● MACHINE LEARNING</span><span>● PROMPT ENGINEERING</span><span>● LOGIC</span><span>● GAME DEV</span>
          <span>● NETWORKING</span><span>● CYBERSECURITY</span><span>● CTF</span><span>● SOFTWARE ENGINEERING</span><span>● MACHINE LEARNING</span><span>● PROMPT ENGINEERING</span><span>● LOGIC</span><span>● GAME DEV</span>
        </div>
      </div>
      {/* Skill tree: data-lv is 1–5 (Novice → Master) */}
      <div className="skills">
        <div className="skills__head reveal">
          <h3>Skill tree</h3>
          <p className="label">◆ <b id="skillCount">18</b> SKILLS · <b id="skillPoints">47</b> SKILL POINTS · LV 1–5</p>
        </div>
        <div className="skills__grid">
          <section className="tree reveal" style={{'--c': 'var(--blue)'}}>
            <header className="tree__head"><span>◆ LANGUAGES</span><span className="tree__sp">15 SP</span></header>
            <ul>
              <Skill level={3} icon="C" row={0}>C</Skill>
              <Skill level={3} icon="C++" row={1}>C++</Skill>
              <Skill level={3} icon="PY" row={2}>Python</Skill>
              <Skill level={3} icon="JS" row={3}>JavaScript</Skill>
              <Skill level={3} icon="PHP" row={4}>PHP</Skill>
            </ul>
          </section>
          <section className="tree reveal" style={{'--c': 'var(--violet)'}}>
            <header className="tree__head"><span>◆ FRAMEWORKS &amp; TOOLS</span><span className="tree__sp">14 SP</span></header>
            <ul>
              <Skill level={3} icon="LV" row={0}>Laravel</Skill>
              <Skill level={3} icon="RE" row={1}>React</Skill>
              <Skill level={2} icon="NX" row={2}>Next.js</Skill>
              <Skill level={2} icon="AS" row={3}>Astro</Skill>
              <Skill level={2} icon="PG" row={4}>PostgreSQL</Skill>
              <Skill level={2} icon="DK" row={5}>Docker</Skill>
            </ul>
          </section>
          <section className="tree reveal" style={{'--c': 'var(--amber)'}}>
            <header className="tree__head"><span>◆ ABILITIES</span><span className="tree__sp">18 SP</span></header>
            <ul>
              <Skill level={4} icon="NET" row={0}>Networking</Skill>
              <Skill level={3} icon="SE" row={1}>Software Engineering</Skill>
              <Skill level={3} icon="LG" row={2}>Logic</Skill>
              <Skill level={3} icon="PE" row={3}>Prompt Engineering</Skill>
              <Skill level={2} icon="CTF" row={4}>CTF</Skill>
              <Skill level={2} icon="ML" row={5}>Machine Learning</Skill>
              <Skill level={1} icon="GD" row={6}>Game Dev</Skill>
            </ul>
          </section>
        </div>
      </div>
    </section>

    {/* 03 WORK */}
    <section className="sec" id="work" data-section>
      <div className="sec__head">
        <span>03 / SELECTED WORK</span><span>PROJECTS.DIR</span>
      </div>
      <div className="intro">
        <h2 className="big reveal">Work that <em className="serif">speaks</em> for itself.</h2>
        <p className="reveal">Selected projects — built for real people, from community service to personal experiments.</p>
      </div>
      <div className="cards">
        <article className="card reveal" style={{'--c': '#2F7BF5'}}>
          <div className="card__top"><span>WEB APP · TECH LEAD</span><span>01</span></div>
          <Asset className="card__media art-grid" base="assets/images/zuma" />
          <div className="card__body">
            <h3>Website Desa Watuagung</h3>
            <p>
              A village service platform that helps Watuagung residents submit letter requests and
              public complaints online. Built for FASILKOM ZUMA's community service program
              (BEM Fasilkom UPNVJT), where I led a team of two developers as Head of Web Division.
            </p>
            <div className="tags"><span>REACT</span><span>LARAVEL</span><span>TEAM OF 3</span></div>
            <div className="card__links">
              <a href="https://desawatuagung.com" target="_blank" rel="noopener" className="btn btn--solid">▸ LIVE DEMO</a>
              <a href="https://github.com/yann-gamedev/watuagung_zuma" target="_blank" rel="noopener" className="btn">⌥ SOURCE</a>
            </div>
          </div>
        </article>
        <article className="card card--cta reveal">
          <div className="card__top"><span>MORE</span><span>02</span></div>
          <div className="card__body">
            <p className="label">GITHUB.COM/YANN-GAMEDEV</p>
            <h3>More projects on GitHub</h3>
            <p>Code, experiments, and learning projects — all open on GitHub. More case studies coming here soon.</p>
            <a href="https://github.com/yann-gamedev" target="_blank" rel="noopener" className="btn btn--solid">▸ OPEN GITHUB</a>
          </div>
        </article>
      </div>
    </section>

    {/* 04 JOURNEY */}
    <section className="sec sec--flush" id="journey" data-section>
      <div className="sec__head">
        <span>04 / JOURNEY</span><span>EXPERIENCE.LOG</span>
      </div>
      <div className="jr">
          <div className="jr__intro">
            <h2 className="big reveal">The journey <em className="serif">so far.</em></h2>
            <p className="label reveal">2022 → NOW</p>
          </div>
            <div className="jr__track" id="jrTrack">
              <div className="jr__line"><span className="jr__fill" id="jrFill"></span></div>

              <article className="node node--left" style={{'--c': '#2F7BF5'}}>
                <span className="node__dot"></span>
                <span className="node__date">JUL 2022</span>
                <div className="node__card">
                  <div className="node__top"><span>EDUCATION</span><span className="badge">GRADUATED</span></div>
                  <h3>Computer &amp; Network Engineering</h3>
                  <p className="node__org">SMK Katolik St. Louis Surabaya</p>
                  <p className="node__period">JUL 2022 — JUN 2025</p>
                  <p>Where it started — hardware, networking fundamentals, and troubleshooting real systems.</p>
                </div>
              </article>

              <article className="node node--right" style={{'--c': '#E8573F'}}>
                <span className="node__dot"></span>
                <span className="node__date">MAR 2024</span>
                <div className="node__card">
                  <div className="node__top"><span>INTERNSHIP</span><span className="badge">DONE</span></div>
                  <h3>IT Support Assistant</h3>
                  <p className="node__org">Informatics Lab, Universitas Surabaya</p>
                  <p className="node__period">MAR 2024 — AUG 2024</p>
                  <p>Built an exam monitoring system for lecturers, ran daily &amp; weekly lab maintenance, and repaired PCs and printers.</p>
                </div>
              </article>

              <article className="node node--left" style={{'--c': '#F2A516'}}>
                <span className="node__dot"></span>
                <span className="node__date">MAR 2025</span>
                <div className="node__card">
                  <div className="node__top"><span>CERTIFICATION</span><span className="badge">EARNED</span></div>
                  <h3>Network Security Design &amp; Dynamic Routing</h3>
                  <p className="node__org">National Competency Certification</p>
                  <p>Certified in designing secure networks and configuring dynamic routing.</p>
                </div>
              </article>

              <article className="node node--right" style={{'--c': '#02DA96'}}>
                <span className="node__dot"></span>
                <span className="node__date">MAY 2025</span>
                <div className="node__card">
                  <div className="node__top"><span>EDUCATION</span><span className="badge badge--live">ONGOING</span></div>
                  <h3>Informatics</h3>
                  <p className="node__org">UPN “Veteran” Jawa Timur</p>
                  <p className="node__period">MAY 2025 — PRESENT</p>
                  <p>Studying software engineering, networking and cybersecurity, with hands-on practice on TryHackMe.</p>
                </div>
              </article>

              <article className="node node--left" style={{'--c': '#8B5CF6'}}>
                <span className="node__dot"></span>
                <span className="node__date">MAY 2026</span>
                <div className="node__card">
                  <div className="node__top"><span>ORGANIZATION</span><span className="badge badge--live">ONGOING</span></div>
                  <h3>R&amp;D Staff</h3>
                  <p className="node__org">BEM FASILKOM UPNVJT</p>
                  <p className="node__period">MAY 2026 — PRESENT</p>
                  <p>Managing the organization's website and running technical learning programs like Skill Sprints.</p>
                </div>
              </article>

              <article className="node node--right" style={{'--c': '#E0368F'}}>
                <span className="node__dot"></span>
                <span className="node__date">JUN 2026</span>
                <div className="node__card">
                  <div className="node__top"><span>LEADERSHIP</span><span className="badge">DONE</span></div>
                  <h3>Head of Event Division</h3>
                  <p className="node__org">FASTERA 2026</p>
                  <p className="node__period">JUN 2026 — OCT 2026</p>
                  <p>Led the event division — coordinating people, schedules and responsibilities from planning to execution.</p>
                </div>
              </article>

              <article className="node node--left" style={{'--c': '#14A9C4'}}>
                <span className="node__dot"></span>
                <span className="node__date">JUL 2026</span>
                <div className="node__card">
                  <div className="node__top"><span>MENTORING</span><span className="badge">DONE</span></div>
                  <h3>Senior Companion Staff</h3>
                  <p className="node__org">MOSAIK 2026 · Group Spring</p>
                  <p className="node__period">JUL 2026 — AUG 2026</p>
                  <p>Mentored a group of new students through their campus onboarding program.</p>
                </div>
              </article>

              <article className="node node--right" style={{'--c': '#2F7BF5'}}>
                <span className="node__dot"></span>
                <span className="node__date">SEP 2026</span>
                <div className="node__card">
                  <div className="node__top"><span>LEADERSHIP</span><span className="badge badge--live">ONGOING</span></div>
                  <h3>Head of Web Division</h3>
                  <p className="node__org">Fasilkom Zuma 2026</p>
                  <p className="node__period">SEP 2026 — PRESENT</p>
                  <p>Leading a team of two to build the Watuagung village website for letter requests and public complaints.</p>
                </div>
              </article>

              <article className="node node--left node--next" style={{'--c': '#F2F1EE'}}>
                <span className="node__dot"></span>
                <span className="node__date">NEXT</span>
                <a href="#contact" className="node__card">
                  <div className="node__top"><span>???</span><span className="badge badge--live">OPEN</span></div>
                  <h3>Your project here?</h3>
                  <p>Open to work and any IT-related project. Let's write the next stop together ▸</p>
                </a>
              </article>
            </div>
      </div>
    </section>

    {/* 05 ACHIEVEMENTS */}
    <section className="sec" id="achievements" data-section>
      <div className="sec__head">
        <span>05 / ACHIEVEMENTS</span><span>CERTIFICATES.SAV</span>
      </div>
      <div className="intro">
        <h2 className="big reveal">Achievements <em className="serif">unlocked.</em></h2>
        <p className="reveal">Certifications, courses, and trainings collected along the way — each one a level cleared.</p>
      </div>

      <div className="ach">
        {/* HUD */}
        <div className="hud reveal">
          <div className="hud__stat"><span className="hud__k">PLAYER</span><span className="hud__v">CHRISTIAN</span></div>
          <div className="hud__stat"><span className="hud__k">TOTAL XP</span><span className="hud__v" id="achXp">0</span></div>
          <div className="hud__progress">
            <span className="hud__k">UNLOCKED <b id="achCount">0</b>/<b id="achTotal">0</b></span>
            <div className="hud__bar"><span id="achBar"></span></div>
          </div>
          <div className="ach__tabs" role="group" aria-label="Filter achievements">
            <button type="button" data-filter="all" className={filter === "all" ? "is-active" : ""} aria-pressed={filter === "all"} onClick={() => setFilter("all")}>ALL</button>
            <button type="button" data-filter="main" className={filter === "main" ? "is-active" : ""} aria-pressed={filter === "main"} onClick={() => setFilter("main")}>MAIN QUEST</button>
            <button type="button" data-filter="guild" className={filter === "guild" ? "is-active" : ""} aria-pressed={filter === "guild"} onClick={() => setFilter("guild")}>GUILD</button>
          </div>
        </div>

        <div className="ach__grid" id="achGrid">
          <article className="badge-card" data-cat="main" style={{ display: filter !== "all" && filter !== "main" ? "none" : undefined }} data-rarity="legendary" data-xp="1000">
            <div className="badge-card__icon">NS</div>
            <div className="badge-card__body">
              <div className="badge-card__top"><span className="rarity">★ LEGENDARY</span><span>MAR 2025</span></div>
              <h3>Network Security Design &amp; Dynamic Routing</h3>
              <p className="badge-card__org">National Competency Certification</p>
              <div className="badge-card__foot"><span>COMPETENCY TEST</span><span className="xp">+1000 XP</span></div>
            </div>
          </article>

          <article className="badge-card" data-cat="main" style={{ display: filter !== "all" && filter !== "main" ? "none" : undefined }} data-rarity="epic" data-preview="assets/certificate/preview/dicoding-ai-1.jpg|assets/certificate/preview/dicoding-ai-2.jpg" data-xp="500">
            <div className="badge-card__icon">AI</div>
            <div className="badge-card__body">
              <div className="badge-card__top"><span className="rarity">◆ EPIC</span><span>SEP 2026</span></div>
              <h3>Belajar Dasar AI</h3>
              <p className="badge-card__org">Dicoding Indonesia</p>
              <div className="badge-card__foot"><button type="button" className="badge-card__view" onClick={openCertificate}>▣ VIEW</button><a href="https://www.dicoding.com/certificates/53XEMN630PRN" target="_blank" rel="noopener">VERIFY ↗</a><span className="xp">+500 XP</span></div>
            </div>
          </article>

          <article className="badge-card" data-cat="main" style={{ display: filter !== "all" && filter !== "main" ? "none" : undefined }} data-rarity="epic" data-preview="assets/certificate/preview/dicoding-prompt-engineering-1.jpg|assets/certificate/preview/dicoding-prompt-engineering-2.jpg" data-xp="500">
            <div className="badge-card__icon">PE</div>
            <div className="badge-card__body">
              <div className="badge-card__top"><span className="rarity">◆ EPIC</span><span>SEP 2026</span></div>
              <h3>Prompt Engineering for Software Developers</h3>
              <p className="badge-card__org">Dicoding Indonesia</p>
              <div className="badge-card__foot"><button type="button" className="badge-card__view" onClick={openCertificate}>▣ VIEW</button><a href="https://www.dicoding.com/certificates/KEXLMLLERZG2" target="_blank" rel="noopener">VERIFY ↗</a><span className="xp">+500 XP</span></div>
            </div>
          </article>

          <article className="badge-card" data-cat="main" style={{ display: filter !== "all" && filter !== "main" ? "none" : undefined }} data-rarity="epic" data-preview="assets/certificate/preview/dicoding-data-science-1.jpg|assets/certificate/preview/dicoding-data-science-2.jpg|assets/certificate/preview/dicoding-data-science-3.jpg|assets/certificate/preview/dicoding-data-science-4.jpg" data-xp="500">
            <div className="badge-card__icon">DS</div>
            <div className="badge-card__body">
              <div className="badge-card__top"><span className="rarity">◆ EPIC</span><span>OCT 2026</span></div>
              <h3>Belajar Dasar Data Science</h3>
              <p className="badge-card__org">Dicoding Indonesia</p>
              <div className="badge-card__foot"><button type="button" className="badge-card__view" onClick={openCertificate}>▣ VIEW</button><a href="https://www.dicoding.com/certificates/6RPNOY1K5X2M" target="_blank" rel="noopener">VERIFY ↗</a><span className="xp">+500 XP</span></div>
            </div>
          </article>

          <article className="badge-card" data-cat="main" style={{ display: filter !== "all" && filter !== "main" ? "none" : undefined }} data-rarity="epic" data-preview="assets/certificate/preview/dicoding-financial-literacy-1.jpg|assets/certificate/preview/dicoding-financial-literacy-2.jpg|assets/certificate/preview/dicoding-financial-literacy-3.jpg" data-xp="500">
            <div className="badge-card__icon">FL</div>
            <div className="badge-card__body">
              <div className="badge-card__top"><span className="rarity">◆ EPIC</span><span>SEP 2026</span></div>
              <h3>Introduction to Financial Literacy</h3>
              <p className="badge-card__org">Dicoding Indonesia</p>
              <div className="badge-card__foot"><button type="button" className="badge-card__view" onClick={openCertificate}>▣ VIEW</button><a href="https://www.dicoding.com/certificates/JLX1KDOQGP72" target="_blank" rel="noopener">VERIFY ↗</a><span className="xp">+500 XP</span></div>
            </div>
          </article>

          <article className="badge-card" data-cat="main" style={{ display: filter !== "all" && filter !== "main" ? "none" : undefined }} data-rarity="rare" data-preview="assets/certificate/preview/oil-gas-workshop-1.jpg|assets/certificate/preview/oil-gas-workshop-2.jpg" data-xp="250">
            <div className="badge-card__icon">OG</div>
            <div className="badge-card__body">
              <div className="badge-card__top"><span className="rarity">▲ RARE</span><span>JUL 2026</span></div>
              <h3>From Coding to Oil &amp; Gas 2026</h3>
              <p className="badge-card__org">Workshop · BEM FASILKOM UPNVJT</p>
              <div className="badge-card__foot"><button type="button" className="badge-card__view" onClick={openCertificate}>▣ VIEW</button><span>SCORE 100/100</span><span className="xp">+250 XP</span></div>
            </div>
          </article>

          <article className="badge-card" data-cat="main" style={{ display: filter !== "all" && filter !== "main" ? "none" : undefined }} data-rarity="common" data-preview="assets/certificate/preview/ctf-1.jpg" data-xp="100">
            <div className="badge-card__icon">CTF</div>
            <div className="badge-card__body">
              <div className="badge-card__top"><span className="rarity">● COMMON</span><span>AUG 2026</span></div>
              <h3>Capture The Flag: The Champion's Blueprint</h3>
              <p className="badge-card__org">Cybersecurity Webinar · Linuxhackingid</p>
              <div className="badge-card__foot"><button type="button" className="badge-card__view" onClick={openCertificate}>▣ VIEW</button><span>PARTICIPANT</span><span className="xp">+100 XP</span></div>
            </div>
          </article>

          <article className="badge-card" data-cat="guild" style={{ display: filter !== "all" && filter !== "guild" ? "none" : undefined }} data-rarity="rare" data-preview="assets/certificate/LKMM-TD.png" data-xp="250">
            <div className="badge-card__icon">LK</div>
            <div className="badge-card__body">
              <div className="badge-card__top"><span className="rarity">▲ RARE</span><span>OCT 2025</span></div>
              <h3>LKMM-TD SLAMP 2025</h3>
              <p className="badge-card__org">Leadership Training · BEM FASILKOM UPNVJT</p>
              <div className="badge-card__foot"><button type="button" className="badge-card__view" onClick={openCertificate}>▣ VIEW</button><span>PARTICIPANT</span><span className="xp">+250 XP</span></div>
            </div>
          </article>

          <article className="badge-card" data-cat="guild" style={{ display: filter !== "all" && filter !== "guild" ? "none" : undefined }} data-rarity="rare" data-preview="assets/certificate/LANIK.jpg" data-xp="250">
            <div className="badge-card__icon">HM</div>
            <div className="badge-card__body">
              <div className="badge-card__top"><span className="rarity">▲ RARE</span><span>2025/2026</span></div>
              <h3>Pengkaderan HIMATIFA</h3>
              <p className="badge-card__org">Informatics Student Association · UPNVJT</p>
              <div className="badge-card__foot"><button type="button" className="badge-card__view" onClick={openCertificate}>▣ VIEW</button><span>CADRE PROGRAM</span><span className="xp">+250 XP</span></div>
            </div>
          </article>

          <article className="badge-card" data-cat="guild" style={{ display: filter !== "all" && filter !== "guild" ? "none" : undefined }} data-rarity="common" data-preview="assets/certificate/MOSAIK.png" data-xp="100">
            <div className="badge-card__icon">MO</div>
            <div className="badge-card__body">
              <div className="badge-card__top"><span className="rarity">● COMMON</span><span>AUG 2025</span></div>
              <h3>MOSAIK 2025</h3>
              <p className="badge-card__org">Student Onboarding · BEM FASILKOM UPNVJT</p>
              <div className="badge-card__foot"><button type="button" className="badge-card__view" onClick={openCertificate}>▣ VIEW</button><span>PARTICIPANT</span><span className="xp">+100 XP</span></div>
            </div>
          </article>
        </div>
      </div>

      {/* Certificate viewer */}
      <Viewer item={viewer} onClose={closeViewer} />

      <div className="toast" id="achToast" role="status" aria-live="polite">
        <span className="toast__icon">★</span>
        <div><b>ACHIEVEMENTS UNLOCKED</b><span id="achToastText"></span></div>
      </div>
    </section>

    <ArticlesPreview />

    {/* 07 CONTACT */}
    <section className="sec contact" id="contact" data-section>
      <div className="sec__head">
        <span>07 / CONTACT</span><span>SAY_HELLO.SH</span>
      </div>
      <div className="contact__inner">
        <p className="label reveal">OPEN TO WORK · ANY IT PROJECT · FAST RESPONSE</p>
        <h2 className="contact__title reveal">Let's build <em className="serif">something.</em></h2>
        <p className="reveal">Have a project, an opportunity, or just want to talk tech? If it's IT, I'm interested — my inbox is always open.</p>
        <a href="mailto:christiannbaguss@gmail.com" className="contact__mail reveal">christiannbaguss@gmail.com</a>
        <div className="socials reveal">
          <a href="https://github.com/yann-gamedev" target="_blank" rel="noopener">GITHUB ↗</a>
          <a href="https://www.linkedin.com/in/christian-bagus/" target="_blank" rel="noopener">LINKEDIN ↗</a>
          <a href="https://www.instagram.com/yannnxt_/" target="_blank" rel="noopener">INSTAGRAM ↗</a>
        </div>
      </div>
    </section>
  </main>

  <footer className="foot">
    <span>© 2026 CHRISTIAN BAGUS PRASETYA</span>
    <span>YANNDEV · MADE IN INDONESIA</span>
    <a href="#top">BACK TO TOP ↑</a>
  </footer>

  </>;
}
