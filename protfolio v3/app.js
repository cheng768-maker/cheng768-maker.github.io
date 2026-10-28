/* ============================================================
   Portfolio Engine — v4.0
   Renders content from data.js into the existing HTML skeleton.
   The HTML already contains: #casesList, #videoTabs, #videoPanels,
   #timeline, #topBtn, nav-links, etc.
============================================================ */
(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const esc = (v) =>
    String(v == null ? '' : v).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );

  document.addEventListener('DOMContentLoaded', () => {
    if (!window.PORTFOLIO) {
      console.error('[portfolio] data.js not loaded');
      return;
    }
    const D = window.PORTFOLIO;

    renderCases(D);
    renderVideo(D);
    renderTimeline(D);
    renderYear();
    setupParticles();
    setupScrollReveal();
    setupNavScroll();
    setupTopBtn();
  });

  /* ============================ CASES ============================ */
  function renderCases(D) {
    const host = $('#casesList');
    if (!host) return;
    host.innerHTML = D.cases
      .map(
        (c, i) => `
      <article class="case-card reveal">
        <div class="case-index">${String(i + 1).padStart(2, '0')}</div>
        <div class="case-role">${esc(c.role)}</div>
        <h3 class="case-title">${esc(c.title)}</h3>
        <div class="case-meta">
          <span>📍 ${esc(c.meta.place)}</span>
          <span>⏱ ${esc(c.meta.duration)}</span>
          ${c.meta.team ? `<span>👥 ${esc(c.meta.team)}</span>` : ''}
        </div>
        <p class="case-summary">${esc(c.summary)}</p>
        <button class="case-toggle" aria-expanded="false">
          <span>Read the breakdown</span>
          <i class="toggle-icon"></i>
        </button>
        <div class="case-detail">
          ${c.blocks
            .map(
              (b) => `
            <div class="detail-block">
              <h4 class="detail-h">${b.icon ? b.icon + ' ' : ''}${esc(b.heading)}</h4>
              ${b.text ? `<p>${esc(b.text)}</p>` : ''}
              ${
                b.items
                  ? `<ul>${b.items.map((it) => `<li>${esc(it)}</li>`).join('')}</ul>`
                  : ''
              }
            </div>`
            )
            .join('')}
          <div class="detail-results">
            <h4 class="detail-h">📊 Key Results</h4>
            <div class="results-grid">
              ${c.results
                .map(
                  (r) => `
                <div class="result-item">
                  <span class="result-num">${esc(r.num)}</span>
                  <span class="result-label">${esc(r.label)}</span>
                </div>`
                )
                .join('')}
            </div>
          </div>
          ${
            c.plans
              ? `<div class="detail-plans">
                   <h4 class="detail-h">📂 方案案例 · 这是我写的</h4>
                   <div class="plans-grid">
                     ${c.plans
                       .map(
                         (p) => `
                     <div class="plan-card">
                       <div class="plan-tag">${p.icon ? p.icon + ' ' : ''}${esc(p.tag)}</div>
                       <h5>${esc(p.title)}</h5>
                       <p>${esc(p.desc)}</p>
                       <ul>${(p.points || []).map((pt) => `<li>${esc(pt)}</li>`).join('')}</ul>
                       ${
                         p.mechanics
                           ? `<div class="plan-kv"><b>参与机制</b><span>${esc(p.mechanics)}</span></div>`
                           : ''
                       }
                       ${
                         p.metrics
                           ? `<div class="plan-kv"><b>话题热度</b><span>${esc(p.metrics)}</span></div>`
                           : ''
                       }
                       ${
                         p.refs
                           ? `<div class="plan-kv"><b>竞品参考</b><span>${esc(p.refs.join(' / '))}</span></div>`
                           : ''
                       }
                       ${
                         p.learnings
                           ? `<div class="plan-kv"><b>方法论沉淀</b><span>${esc(p.learnings)}</span></div>`
                           : ''
                       }
                     </div>`
                       )
                       .join('')}
                   </div>
                 </div>`
              : ''
          }

          ${
            c.gallery && c.gallery.length
              ? `<div class="detail-gallery">
                   <h4 class="detail-h">🖼 Gallery · 现场实拍</h4>
                   <p class="gallery-intro">知行互动任职期间的<b>现场执行与方案氛围参考</b>，点击任意图片可放大查看。</p>
                   <div class="gallery-grid">
                     ${c.gallery
                       .map(
                         (g, gi) => `
                     <figure class="g-item" data-lightbox-src="${esc(g.src)}" data-lightbox-cap="${esc(g.title)}" tabindex="0" role="button" aria-label="放大查看 ${esc(g.title)}">
                       <div class="g-wrap">
                         <img loading="lazy" src="${esc(g.src)}" alt="${esc(g.title)}">
                       </div>
                       <figcaption>${esc(g.title)}</figcaption>
                     </figure>`
                       )
                       .join('')}
                   </div>
                 </div>`
              : ''
          }

          ${
            c.reflection
              ? `<div class="detail-reflection">
                   <h4 class="detail-h">🔄 Reflection</h4>
                   <p>${esc(c.reflection)}</p>
                 </div>`
              : ''
          }
        </div>
      </article>`
      )
      .join('');

    $$('.case-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.case-card');
        const open = btn.getAttribute('aria-expanded') === 'true';
        $$('.case-card').forEach((other) => {
          if (other !== card) {
            other.classList.remove('is-open');
            other.querySelector('.case-toggle').setAttribute('aria-expanded', 'false');
          }
        });
        btn.setAttribute('aria-expanded', String(!open));
        card.classList.toggle('is-open', !open);
      });
    });
  }

  /* ============================ VIDEO / CONTENT IN ACTION ============================ */
  function renderVideo(D) {
    const tabsHost = $('#videoTabs');
    const panelsHost = $('#videoPanels');
    if (!tabsHost || !panelsHost) return;
    const scripts = D.contentSection.scripts;

    tabsHost.innerHTML = scripts
      .map(
        (s, i) => `
      <button class="video-tab ${i === 0 ? 'is-active' : ''}" data-idx="${i}">
        <span class="vt-num">${esc(s.tag)}</span>
        <span class="vt-title">${esc(s.tabTitle)}</span>
      </button>`
      )
      .join('');

    panelsHost.innerHTML = scripts
      .map(
        (s, i) => `
      <div class="video-panel ${i === 0 ? 'is-active' : ''}" data-idx="${i}">
        <div class="vp-left">
          <div class="vp-meta">
            <span class="vt-badge"><i class="rec-dot"></i> REEL</span>
            <span class="vt-views">${
              s.metrics ? esc(s.metrics.views) + ' · ' + esc(s.metrics.likes) : '– views · – likes'
            }</span>
          </div>
          <div class="vp-frame">
            ${renderVideoNode(s.video, D.contentSection.reelPlaceholder)}
            <div class="vp-caption">
              ${s.video && s.video.href ? `<span class="vc-tag">${esc(s.tag)}</span> ${esc(s.videoCaption || '')}` : ''}
            </div>
          </div>
          ${
            s.video && s.video.href
              ? `<a class="btn-mini" href="${esc(s.video.href)}" target="_blank" rel="noopener">🎬 在抖音打开原片 ↗</a>`
              : ''
          }
        </div>

        <div class="vp-right">
          <div class="script-head">
            <span class="sh-tag">SCRIPT</span>
            <h4>${esc(s.title)}</h4>
          </div>
          <div class="script-meta">
            <div class="sm-row"><span>对标账号</span><b>${esc(s.account)}</b></div>
            <div class="sm-row"><span>脚本标题</span><b>${esc(s.title)}</b></div>
            <div class="sm-row"><span>演员构成</span><span>${esc(s.cast)}</span></div>
            <div class="sm-row"><span>拍摄镜数</span><span>${esc(s.shots)}</span></div>
            <div class="sm-row full"><span>对标拆解</span><span>${esc(s.deconstruct)}</span></div>
          </div>
          <div class="script-stats">
            ${(s.stats || [])
              .map(
                (st) => `
              <div class="sm-stat">
                <span class="sms-num">${esc(st.num)}</span>
                <span class="sms-label">${esc(st.label)}</span>
              </div>`
              )
              .join('')}
          </div>
        </div>

        <div class="vp-storyboard">
          <div class="sb-head">
            <h4>📖 Storyboard &amp; shot breakdown</h4>
            <span class="sb-hint">↓ scroll</span>
          </div>
          <div class="sb-track">
            ${(s.storyboard || [])
              .map(
                (shot) => `
              <div class="sb-card">
                <div class="sb-top">
                  <span class="sb-num">${esc(shot.num)}</span>
                  <span class="sb-scene">${esc(shot.scene)}</span>
                </div>
                <div class="sb-frame">
                  <span>${esc(shot.size)}</span>
                  <span>${esc(shot.angle)}</span>
                  <span>${esc(shot.move || '固定')}</span>
                </div>
                <p class="sb-note">${esc(shot.note)}</p>
                <div class="sb-think">
                  <span class="sb-think-label">设计思路</span>
                  <p>${esc(shot.thinking)}</p>
                </div>
              </div>`
              )
              .join('')}
          </div>
          <div class="sb-insight">
            <span class="sbi-icon">💡</span>
            <div>
              <h5>My Insight · ${esc(s.tag)}</h5>
              <p>${esc(s.insight)}</p>
            </div>
          </div>
        </div>
      </div>`
      )
      .join('');

    /* tab switching */
    const tabs = $$('.video-tab');
    const panels = $$('.video-panel');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const idx = Number(tab.dataset.idx);
        tabs.forEach((t) => t.classList.toggle('is-active', Number(t.dataset.idx) === idx));
        panels.forEach((p) => p.classList.toggle('is-active', Number(p.dataset.idx) === idx));
      });
    });
  }

  function renderVideoNode(video, placeholder) {
    if (!video) return placeholderHTML(placeholder);
    if (video.embed) return video.embed;
    if (video.src) {
      return `<video controls preload="metadata" playsinline poster="${esc(video.poster || '')}">
        <source src="${esc(video.src)}" type="video/mp4">
        Your browser does not support the video tag.
      </video>`;
    }
    return placeholderHTML(placeholder);
  }

  function placeholderHTML(p) {
    return `
      <div class="vp-placeholder">
        <div class="vp-glow"></div>
        <div class="vp-ic">🎬</div>
        <div class="vp-t1">${esc(p.title)}</div>
        <div class="vp-t2">${esc(p.sub)}</div>
        <div class="vp-tags">${(p.tags || []).map((t) => `<span>${esc(t)}</span>`).join('')}</div>
        <pre class="vp-code">${esc(p.code || '')}</pre>
        <div class="vp-hint">${esc(p.hint || '')}</div>
      </div>`;
  }

  /* ============================ TIMELINE ============================ */
  function renderTimeline(D) {
    const host = $('#timeline');
    if (!host) return;
    host.innerHTML = D.journey
      .map(
        (j, i) => `
      <div class="timeline-item reveal ${i % 2 === 0 ? 'left' : 'right'}">
        <div class="tl-dot"><span>${esc(j.icon)}</span></div>
        <div class="tl-card">
          <div class="tl-date">${esc(j.date)}</div>
          <div class="tl-title">${esc(j.title)}</div>
          <div class="tl-org">${esc(j.org)} · ${esc(j.place)}</div>
          <p>${esc(j.desc)}</p>
        </div>
      </div>`
      )
      .join('');
  }

  /* ============================ YEAR ============================ */
  function renderYear() {
    const el = $('#year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ============================ PARTICLES ============================ */
  function setupParticles() {
    const canvas = $('#bg-canvas');
    if (!canvas) return;
    let ctx;
    try { ctx = canvas.getContext('2d'); } catch (e) { return; }
    if (!ctx) return;
    let w, h, particles, raf;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const COUNT = window.innerWidth < 768 ? 40 : 80;

    function resize() {
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    }
    function getCSS(name) {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#39ff14';
    }
    function initParticles() {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35 * dpr,
        vy: (Math.random() - 0.5) * 0.35 * dpr,
        r: (Math.random() * 2 + 0.6) * dpr,
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      const accent = getCSS('--accent');
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140 * dpr) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = accent
              .replace('rgb', 'rgba')
              .replace(')', `,${(1 - dist / (140 * dpr)) * 0.25})`);
            ctx.lineWidth = 1 * dpr;
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = accent.replace('rgb', 'rgba').replace(')', ',0.55)');
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    resize();
    initParticles();
    draw();
    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else draw();
    });
  }

  /* ============================ SCROLL REVEAL ============================ */
  function setupScrollReveal() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ============================ NAV SCROLL STATE ============================ */
  function setupNavScroll() {
    const nav = $('#nav');
    if (!nav) return;
    const links = $$('.nav-link');
    const sections = links
      .map((a) => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);
    function onScroll() {
      nav.classList.toggle('scrolled', window.scrollY > 40);
      let current = '';
      sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 140) current = s.id;
      });
      links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* mobile menu toggle */
    const menuBtn = $('#menuBtn');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        document.body.classList.toggle('menu-open');
      });
      links.forEach((a) =>
        a.addEventListener('click', () => document.body.classList.remove('menu-open'))
      );
    }
  }

  /* ============================ TOP BUTTON ============================ */
  function setupTopBtn() {
    const btn = $('#topBtn');
    if (!btn) return;
    window.addEventListener(
      'scroll',
      () => btn.classList.toggle('show', window.scrollY > 500),
      { passive: true }
    );
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ============================ LIGHTBOX ============================ */
  /* 点击 Gallery 图片 → 全屏放大查看；点遮罩 / 关闭按钮 / Esc 退出 */
  function setupLightbox() {
    const lb = $('#lightbox');
    if (!lb) return;
    const img = lb.querySelector('.lightbox-img');
    const cap = lb.querySelector('.lightbox-cap');
    const close = lb.querySelector('.lightbox-close');

    function open(src, caption) {
      img.src = src;
      img.alt = caption || '';
      cap.textContent = caption || '';
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function shut() {
      lb.classList.remove('is-open');
      img.src = '';
      cap.textContent = '';
      document.body.style.overflow = '';
    }

    document.addEventListener('click', (e) => {
      const item = e.target.closest('[data-lightbox-src]');
      if (item) open(item.dataset.lightboxSrc, item.dataset.lightboxCap);
      else if (e.target === lb) shut();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lb.classList.contains('is-open')) shut();
    });
    if (close) close.addEventListener('click', shut);
  }

  /* ============================ GALLERY IMG GUARD ============================ */
  /* 若 gallery 图片缺失，给出明确提示而不是留空白框 */
  function guardGalleryImages() {
    document.querySelectorAll('.g-item img').forEach((im) => {
      im.addEventListener('error', () => {
        const wrap = im.closest('.g-wrap');
        if (wrap) {
          wrap.innerHTML =
            '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:14px;text-align:center;font-size:12px;color:rgba(255,255,255,.65);line-height:1.6;">⚠ 图片未找到<br><small style="opacity:.7">请确认 ' +
            im.getAttribute('src') +
            ' 已上传到仓库</small></div>';
        }
      });
    });
  }

  /* ============================ CAPABILITY ORB ============================ */
  /* 中心球：点击后 9 个能力标签按环形分裂散开，再点一次收回；
     点击单个标签 → 弹出该能力的熟练度与证据卡片。 */
  function setupOrb() {
    const orbit = $('#orbit');
    const core = $('#orbitCore');
    const hint = $('#orbitHint');
    if (!orbit || !core) return;

    const caps = window.PORTFOLIO && window.PORTFOLIO.capabilities;
    if (!caps || !caps.length) return;

    /* ---- 渲染标签 ---- */
    const TOTAL = caps.length;
    caps.forEach((c, i) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'chip';
      el.style.setProperty('--i', i);
      el.style.setProperty('--total', TOTAL);
      el.dataset.capIndex = i;
      el.innerHTML = '<span class="chip-icon">' + c.icon + '</span><span class="chip-label">' + c.label + '</span>';
      orbit.appendChild(el);
    });

    const chips = Array.prototype.slice.call(orbit.querySelectorAll('.chip'));

    /* 计算并写入每个标签的圆周坐标。
       起始角度偏上（-90°），按顺时针均匀分布；
       分裂时通过 --tx/--ty 变量驱动，收起时归零回到球心。 */
    const RADIUS = 168; /* 分裂半径，单位 px */
    function layout() {
      chips.forEach(function (ch, i) {
        var angle = (360 / TOTAL) * i - 90; /* 从正上方开始 */
        var rad = (angle * Math.PI) / 180;
        var tx = Math.cos(rad) * RADIUS;
        var ty = Math.sin(rad) * RADIUS;
        ch.style.setProperty('--tx', tx.toFixed(2) + 'px');
        ch.style.setProperty('--ty', ty.toFixed(2) + 'px');
      });
    }
    /* CSS 侧配合：chip 默认 transform 用这两个变量 */
    var styleTag = document.createElement('style');
    styleTag.textContent =
      '.orbit .chip{transform:translate(calc(-50% + var(--tx,0px)),calc(-50% + var(--ty,0px))) scale(var(--s,1));}' +
      '.orbit .chip.is-active{--s:1.08;}';
    document.head.appendChild(styleTag);
    layout();
    window.addEventListener('resize', layout);

    /* ---- 分裂 / 收回 ---- */
    let expanded = false;
    function setExpanded(v) {
      expanded = v;
      orbit.classList.toggle('is-expanded', expanded);
      const label = core.querySelector('.core-label');
      const sub = core.querySelector('small');
      if (expanded) {
        if (label) label.textContent = '收起';
        if (sub) sub.textContent = 'click to fold';
      } else {
        if (label) label.textContent = '能出镜';
        if (sub) sub.textContent = 'click to split';
        closeCard();
      }
    }

    /* ---- 证据卡片 ---- */
    const card = document.createElement('div');
    card.className = 'cap-card';
    card.innerHTML =
      '<button class="cap-card-close" aria-label="关闭">×</button>' +
      '<div class="cap-card-head">' +
        '<span class="cap-card-icon"></span>' +
        '<div>' +
          '<h4 class="cap-card-title"></h4>' +
          '<div class="cap-card-group"></div>' +
        '</div>' +
      '</div>' +
      '<div class="cap-card-level"><div class="cap-level-track"><i></i></div><b class="cap-level-text"></b></div>' +
      '<p class="cap-card-proof"></p>';
    document.querySelector('.hero-right').appendChild(card);

    let activeChip = null;
    function openCard(i) {
      const c = caps[i];
      if (!c) return;
      card.querySelector('.cap-card-icon').textContent = c.icon;
      card.querySelector('.cap-card-title').textContent = c.label;
      card.querySelector('.cap-card-group').textContent = c.group;
      card.querySelector('.cap-level-track i').style.width = (c.level * 20) + '%';
      card.querySelector('.cap-level-text').textContent = '熟练度 ' + c.level + ' / 5';
      card.querySelector('.cap-card-proof').textContent = c.proof;
      card.classList.add('is-open');
      if (activeChip) activeChip.classList.remove('is-active');
      activeChip = chips[i];
      if (activeChip) activeChip.classList.add('is-active');
    }
    function closeCard() {
      card.classList.remove('is-open');
      if (activeChip) activeChip.classList.remove('is-active');
      activeChip = null;
    }

    core.addEventListener('click', function (e) {
      e.stopPropagation();
      setExpanded(!expanded);
    });
    chips.forEach(function (ch, i) {
      ch.addEventListener('click', function (e) {
        e.stopPropagation();
        if (!expanded) {
          setExpanded(true);
          /* 等布局完成再开卡，避免定位跳动 */
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              openCard(i);
            });
          });
        } else {
          if (activeChip === ch && card.classList.contains('is-open')) {
            closeCard();
          } else {
            openCard(i);
          }
        }
      });
    });
    if (hint) {
      hint.addEventListener('click', function () {
        setExpanded(true);
      });
    }
    card.querySelector('.cap-card-close').addEventListener('click', closeCard);

    /* 点击空白处收起整组 */
    document.addEventListener('click', function (e) {
      if (!expanded) return;
      if (e.target.closest('.orbit') || e.target.closest('.cap-card') || e.target.closest('.orbit-hint')) {
        return;
      }
      setExpanded(false);
    });

    /* 首次进入视口时自动演示一次分裂，2.4 秒后收回 */
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            setExpanded(true);
            setTimeout(function () {
              if (expanded && !card.classList.contains('is-open')) setExpanded(false);
            }, 2600);
            io.disconnect();
          }
        });
      }, { threshold: 0.4 });
      io.observe(orbit);
    }
  }

  setupLightbox();
  guardGalleryImages();
  setupOrb();
})();
