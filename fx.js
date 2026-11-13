/* ==========================================================
   fx.js — 화려한 효과 모음. main.js 다음에 실행됩니다.
   ========================================================== */
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const APPS = window.APPS || [];
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const rand = (a, b) => a + Math.random() * (b - a);

  /* ---------- 인트로 글자 ---------- */
  const word = $("#intro .intro-word");
  if (word) {
    word.innerHTML = [...((window.SITE && window.SITE.name) || "매일앱")]
      .map((c, i) => `<span style="--i:${i}">${c}</span>`).join("");
    setTimeout(() => $("#intro")?.remove(), 2300);
  }

  /* ---------- 제목 글자 쪼개기 (단어 교체 영역은 제외) ---------- */
  let ci = 0;
  const split = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3 && !n.textContent.trim()) return; // 줄 사이 공백은 그대로 둠
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        for (const c of n.textContent) {
          if (c === "\n") continue;
          const s = document.createElement("span");
          s.className = c.trim() ? "ch" : "ch sp";
          s.textContent = c.trim() ? c : " ";
          s.style.setProperty("--i", ci++);
          frag.appendChild(s);
        }
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.id === "rotator") {
        n.classList.add("ch"); n.style.setProperty("--i", ci); ci += 4;
      } else if (n.nodeType === 1) split(n);
    });
  };
  const h1 = $(".hero h1");
  if (h1) split(h1);

  /* ---------- 스크롤 진행 막대 ---------- */
  const bar = $("#progress");
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- 폰 주위를 도는 아이콘 (3D 궤도) ---------- */
  const stage = $(".phone-stage");
  const ring = document.createElement("div");
  ring.className = "orbit-icons";
  const orbitApps = APPS.filter((a) => a.icon).slice(0, 10);
  const icons = orbitApps.map((a) => {
    const im = new Image(); im.src = a.icon; im.alt = ""; im.className = "orbit-icon"; ring.appendChild(im); return im;
  });
  stage?.appendChild(ring);
  let heroVisible = true;
  if (stage) new IntersectionObserver(([e]) => (heroVisible = e.isIntersecting)).observe(stage);
  let t0 = performance.now();
  const orbit = (now) => {
    if (heroVisible && stage) {
      const w = stage.clientWidth, h = stage.clientHeight;
      const R = Math.min(w / 2 - 34, 250), Ry = Math.min(h * 0.18, 90);
      const t = (now - t0) / 1000;
      icons.forEach((el, i) => {
        const a = t * 0.45 + (i / icons.length) * Math.PI * 2;
        const z = Math.sin(a);                       // -1(뒤) ~ 1(앞)
        const x = Math.cos(a) * R;
        const y = z * Ry + Math.sin(t * 1.3 + i) * 8;
        const s = 0.62 + (z + 1) * 0.28;
        el.style.transform = `translate(${x}px, ${y}px) scale(${s}) rotate(${Math.cos(a) * 12}deg)`;
        el.style.zIndex = z > 0 ? 10 : 1;
        el.style.opacity = (0.35 + (z + 1) * 0.33).toFixed(2);
        el.style.filter = z < -0.2 ? `blur(${(-z * 2).toFixed(1)}px)` : "none";
      });
    }
    requestAnimationFrame(orbit);
  };
  requestAnimationFrame(orbit);

  /* 폰 화면 속 항목을 차례로 반짝 */
  const items = $$(".ps-item");
  let hi = 0;
  setInterval(() => {
    items.forEach((el) => el.classList.remove("glow"));
    const el = items[hi++ % items.length]; if (!el) return;
    const a = APPS[(hi - 1) % items.length];
    el.style.setProperty("--hl", a?.colors?.[0] || "#7c3aed");
    el.classList.add("glow");
  }, 1400);

  /* ---------- 마우스 시차: 폰 기울기 ---------- */
  if (finePointer && stage) {
    addEventListener("pointermove", (e) => {
      const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
      stage.style.setProperty("--ry", `${nx * 22}deg`);
      stage.style.setProperty("--rx", `${-ny * 16}deg`);
      $$(".blob").forEach((b, i) => (b.style.translate = `${nx * (i + 1) * -40}px ${ny * (i + 1) * -30}px`));
    }, { passive: true });
  }

  /* ---------- 자석 버튼 ---------- */
  if (finePointer) {
    $$(".btn-primary, .nav .btn").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        b.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.3}px ${(e.clientY - r.top - r.height / 2) * 0.4}px`;
      });
      b.addEventListener("pointerleave", () => (b.style.translate = "0 0"));
    });
  }

  /* ---------- 카드 빛 줄기 ---------- */
  $$(".card").forEach((c) => { const s = document.createElement("span"); s.className = "shine"; c.appendChild(s); });

  /* ---------- 커서 링 ---------- */
  if (finePointer) {
    const cur = $("#cursor");
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      cur.classList.toggle("big", !!e.target.closest(".card, .btn, .chip, a"));
    }, { passive: true });
    addEventListener("pointerdown", () => cur.classList.add("down"));
    addEventListener("pointerup", () => cur.classList.remove("down"));
    const follow = () => {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cur.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(follow);
    };
    follow();
  }

  /* ---------- 클릭 파티클 폭죽 ---------- */
  const cv = $("#burst"), ctx = cv.getContext("2d");
  let parts = [], running = false;
  const fit = () => {
    const d = Math.min(devicePixelRatio || 1, 2);
    cv.width = innerWidth * d; cv.height = innerHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0);
  };
  fit(); addEventListener("resize", fit);
  const burst = (x, y, colors) => {
    for (let i = 0; i < 46; i++) {
      const a = rand(0, Math.PI * 2), v = rand(3, 10);
      parts.push({
        x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 3, life: 1, decay: rand(0.012, 0.025),
        size: rand(3, 7), rot: rand(0, 6), vr: rand(-0.3, 0.3),
        color: colors[i % colors.length], shape: i % 3,
      });
    }
    // 퍼지는 고리
    parts.push({ ring: true, x, y, r: 4, life: 1, color: colors[0] });
    if (!running) { running = true; requestAnimationFrame(tick); }
  };
  const star = (r) => {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 ? r * 0.45 : r, a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    ctx.closePath(); ctx.fill();
  };
  const tick = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter((p) => p.life > 0);
    for (const p of parts) {
      ctx.globalAlpha = Math.max(p.life, 0);
      if (p.ring) {
        p.r += 6; p.life -= 0.04;
        ctx.strokeStyle = p.color; ctx.lineWidth = 3 * p.life;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.stroke();
        continue;
      }
      p.vy += 0.28; p.vx *= 0.98; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= p.decay;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color;
      if (p.shape === 0) star(p.size);
      else if (p.shape === 1) ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      else { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, 7); ctx.fill(); }
      ctx.restore();
    }
    if (parts.length) requestAnimationFrame(tick); else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  };
  addEventListener("pointerdown", (e) => {
    const el = e.target.closest(".card, .btn-primary, .chip");
    if (!el) return;
    const cs = getComputedStyle(el);
    const a = cs.getPropertyValue("--a").trim() || "#a855f7", b = cs.getPropertyValue("--b").trim() || "#ec4899";
    burst(e.clientX, e.clientY, [a, b, "#ffffff", "#facc15", "#22d3ee"]);
  });

  /* ---------- CTA 뒤로 떠오르는 아이콘 ---------- */
  const cta = $(".cta-card");
  if (cta) {
    const wrap = document.createElement("div"); wrap.className = "bubbles";
    APPS.filter((a) => a.icon).forEach((a, i) => {
      const im = new Image(); im.src = a.icon; im.alt = ""; im.className = "bubble";
      im.style.cssText = `left:${rand(2, 92)}%;--s:${rand(30, 58)}px;--t:${rand(7, 12)}s;--dl:${-rand(0, 12)}s;--r:${rand(-60, 60)}deg`;
      wrap.appendChild(im);
    });
    cta.prepend(wrap);
  }

  /* ---------- 마키 두 번째 줄 (반대 방향, 아이콘) ---------- */
  const mq = $(".marquee");
  if (mq) {
    const row = APPS.map((a) => `<span>${a.icon ? `<img src="${a.icon}" alt="">` : ""} ${a.name}</span>`).join("");
    const t = document.createElement("div"); t.className = "marquee-track rev"; t.innerHTML = row + row;
    mq.appendChild(t);
  }
})();
