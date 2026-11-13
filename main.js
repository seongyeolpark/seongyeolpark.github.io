(() => {
  const SITE = window.SITE || {};
  const APPS = (window.APPS || []).map((a) => ({ ...a, link: a.link || `intoss://${a.appName}` }));
  const $ = (s, el = document) => el.querySelector(s);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 사이트 텍스트 ---------- */
  document.querySelectorAll("[data-site]").forEach((el) => {
    const v = SITE[el.dataset.site];
    if (v) el.textContent = v;
  });
  if (SITE.name) document.title = `${SITE.name} — ${SITE.tagline || ""}`;
  $("#year").textContent = new Date().getFullYear();
  if (SITE.contact) Object.assign($("#contact"), { href: SITE.contact, hidden: false });

  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const iconHTML = (a) => (a.icon ? `<img src="${esc(a.icon)}" alt="" loading="lazy" />` : esc(a.emoji || "✨"));

  /* ---------- 카드 렌더 ---------- */
  const grid = $("#grid");
  grid.innerHTML = APPS.map((a, i) => `
    <article class="card reveal" tabindex="0" role="link" data-i="${i}" data-tag="${esc(a.tag)}"
      style="--a:${a.colors?.[0] || "#7c3aed"};--b:${a.colors?.[1] || "#ec4899"};--d:${(i % 3) * 0.08}s">
      <div class="card-top">
        <div class="card-icon">${iconHTML(a)}</div>
        ${a.badge ? `<span class="badge">${esc(a.badge)}</span>` : ""}
      </div>
      <h3>${esc(a.name)}</h3>
      <span class="tag">#${esc(a.tag || "앱")}</span>
      <p class="desc">${esc(a.desc)}</p>
      ${a.note ? `<span class="note">${esc(a.note)}</span>` : ""}
      <span class="card-cta">토스에서 열기
        <span class="arrow"><svg viewBox="0 0 24 24" width="14" height="14"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      </span>
    </article>`).join("");

  /* ---------- 필터 ---------- */
  const tags = ["전체", ...new Set(APPS.map((a) => a.tag).filter(Boolean))];
  const filters = $("#filters");
  filters.innerHTML = tags.map((t, i) => `<button class="chip${i ? "" : " active"}" role="tab" data-tag="${esc(t)}">${esc(t)}</button>`).join("");
  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    filters.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === btn));
    grid.querySelectorAll(".card").forEach((c) => {
      c.classList.toggle("hide", btn.dataset.tag !== "전체" && c.dataset.tag !== btn.dataset.tag);
    });
  });

  /* ---------- 폰 목업 / 마키 / 통계 ---------- */
  $("#phone-screen").innerHTML = `<div class="ps-title">${esc(SITE.name || "내 앱")}</div>` +
    APPS.slice(0, 6).map((a, i) => `
      <div class="ps-item" style="animation-delay:${0.4 + i * 0.12}s">
        <span class="ic" style="background:linear-gradient(135deg,${a.colors?.[0]},${a.colors?.[1]})">${a.icon ? `<img src="${esc(a.icon)}" alt="" style="border-radius:12px">` : esc(a.emoji)}</span>
        <span><b>${esc(a.name)}</b><small>${esc(a.desc)}</small></span>
      </div>`).join("");

  const words = APPS.map((a) => `<span>${esc(a.emoji || "")} ${esc(a.name)}</span>`).join("");
  $("#marquee").innerHTML = words + words;

  const statEl = $("#stat-apps");
  const target = APPS.length;
  let n = 0;
  const tick = () => { statEl.textContent = n; if (n++ < target) setTimeout(tick, 90); };
  setTimeout(tick, 600);

  /* ---------- 히어로 단어 순환 ---------- */
  const rot = $("#rotator");
  const phrases = ["바로 실행", "설치 없이", "한 번에"];
  let pi = 0;
  // 글자가 무작위 한글로 뒤섞였다가 새 단어로 맞춰지는 스크램블 효과
  const POOL = "가나다라마바사아자차카타파하토스앱매일운세달꿈별빛";
  const scramble = (to) => {
    const from = rot.textContent, len = Math.max(from.length, to.length);
    const q = [...Array(len)].map((_, i) => ({ to: to[i] || "", start: Math.floor(Math.random() * 10), end: 10 + Math.floor(Math.random() * 14) }));
    let f = 0;
    rot.classList.add("scrambling");
    const step = () => {
      let out = "", done = 0;
      for (const c of q) {
        if (f >= c.end) { out += c.to; done++; }
        else if (f >= c.start) out += c.to === " " ? " " : POOL[Math.floor(Math.random() * POOL.length)];
        else out += from[q.indexOf(c)] || "";
      }
      rot.textContent = out;
      if (done < q.length) { f++; requestAnimationFrame(step); } else rot.classList.remove("scrambling");
    };
    step();
  };
  if (!reduced) setInterval(() => { pi = (pi + 1) % phrases.length; scramble(phrases[pi]); }, 2800);

  /* ---------- 앱 열기 ---------- */
  const track = (a) => {
    // GA4 / 기타 분석 도구가 있으면 클릭 이벤트 전송
    if (window.gtag) window.gtag("event", "open_app", { app_name: a.name });
  };
  const modal = $("#modal");
  let current = null;
  const openApp = (a) => {
    track(a);
    if (isMobile) {
      // 터치 폭죽이 보이도록 아주 잠깐 기다렸다 이동
      setTimeout(() => { location.href = a.link; }, reduced ? 0 : 280);
      // 토스 앱이 없거나 링크가 열리지 않으면 검색 안내
      const t = setTimeout(() => { if (!document.hidden) toast(`토스 앱에서 '${a.name}'을(를) 검색해 보세요`, 4000); }, 1600);
      addEventListener("visibilitychange", () => clearTimeout(t), { once: true });
      return;
    }
    current = a;
    $("#modal-title").textContent = a.name;
    const mi = $("#modal-icon");
    mi.innerHTML = iconHTML(a);
    mi.style.background = `linear-gradient(135deg,${a.colors?.[0]},${a.colors?.[1]})`;
    $("#open-link").href = a.link;
    $("#modal-search").textContent = a.name;
    const qr = $("#qr");
    qr.innerHTML = "";
    if (window.QRCode) new QRCode(qr, { text: a.link, width: 368, height: 368, colorDark: "#0e0c1d", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
    else qr.textContent = "QR을 불러오지 못했어요";
    modal.hidden = false;
    $(".modal-x").focus();
  };
  const closeModal = () => { modal.hidden = true; };
  modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  const toast = (msg, ms = 1800) => { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), ms); };
  $("#copy-link").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(current.link); toast("링크를 복사했어요"); }
    catch { toast("복사에 실패했어요"); }
  });

  grid.addEventListener("click", (e) => { const c = e.target.closest(".card"); if (c) openApp(APPS[c.dataset.i]); });
  grid.addEventListener("keydown", (e) => {
    const c = e.target.closest(".card");
    if (c && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openApp(APPS[c.dataset.i]); }
  });
  const hot = APPS.find((a) => a.badge === "HOT") || APPS[0];
  $("#cta-top").addEventListener("click", (e) => { e.preventDefault(); if (hot) openApp(hot); });

  /* ---------- 카드 3D 틸트 + 스포트라이트 ---------- */
  if (!isMobile && !reduced) {
    grid.addEventListener("pointermove", (e) => {
      const c = e.target.closest(".card");
      if (!c) return;
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty("--px", `${x * 100}%`);
      c.style.setProperty("--py", `${y * 100}%`);
      c.style.setProperty("--ry", `${(x - 0.5) * 14}deg`);
      c.style.setProperty("--rx", `${(0.5 - y) * 14}deg`);
    });
    grid.addEventListener("pointerout", (e) => {
      const c = e.target.closest(".card");
      if (c && !c.contains(e.relatedTarget)) { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); }
    });
    // body에 변수를 쓰면 페이지 전체 스타일을 다시 계산하므로 빛 요소만 직접 움직임
    const glow = $(".cursor-glow");
    let gx = innerWidth / 2, gy = innerHeight * 0.3, tgx = gx, tgy = gy, gRun = false;
    const glowStep = () => {
      gx += (tgx - gx) * 0.15; gy += (tgy - gy) * 0.15;
      glow.style.transform = `translate(${gx}px, ${gy}px)`;
      if (Math.abs(tgx - gx) + Math.abs(tgy - gy) > 0.5) requestAnimationFrame(glowStep); else gRun = false;
    };
    addEventListener("pointermove", (e) => {
      tgx = e.clientX; tgy = e.clientY;
      if (!gRun) { gRun = true; requestAnimationFrame(glowStep); }
    }, { passive: true });
  }

  /* ---------- 스크롤 등장 / 네비 ---------- */
  const io = new IntersectionObserver((es) => es.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el, i) => {
    if (!el.closest(".grid") && el.closest(".hero")) el.style.setProperty("--d", `${i * 0.08}s`);
    io.observe(el);
  });
  const nav = $(".nav");
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 30), { passive: true });

  /* ---------- 별 파티클 ---------- */
  const cv = $("#stars"), ctx = cv.getContext("2d");
  let W, H, stars = [];
  const resize = () => {
    const dpr = 1; // 작은 점이라 고해상도가 필요 없음
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + "px"; cv.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.min(140, Math.round((W * H) / 12000)) }, () => ({
      x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + 0.2,
      v: Math.random() * 0.25 + 0.05, t: Math.random() * Math.PI * 2,
    }));
  };
  resize(); addEventListener("resize", resize);
  // 마우스 근처 별자리 선 + 별똥별
  let mx = -999, my = -999;
  addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
  let meteors = [];
  let last = 0;
  const draw = (now = 0) => {
    if (!reduced) requestAnimationFrame(draw);
    if (document.hidden || now - last < 33) return; // 30fps면 충분
    last = now;
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.t += 0.04; s.y -= s.v * 2; if (s.y < 0) { s.y = H; s.x = Math.random() * W; }
      const dx = s.x - mx, dy = s.y - my, d = Math.hypot(dx, dy);
      if (d < 140) {
        ctx.globalAlpha = (1 - d / 140) * 0.55;
        ctx.strokeStyle = "#c4b5fd"; ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(mx, my); ctx.stroke();
      }
      ctx.globalAlpha = 0.35 + Math.sin(s.t) * 0.3 + (d < 140 ? 0.4 : 0);
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(s.x, s.y, s.r * (d < 140 ? 1.8 : 1), 0, 7); ctx.fill();
    }
    if (Math.random() < 0.024) meteors.push({ x: Math.random() * W * 1.2, y: -20, v: 9 + Math.random() * 7, life: 1 });
    meteors = meteors.filter((m) => m.life > 0 && m.y < H + 50);
    for (const m of meteors) {
      m.x -= m.v * 1.4; m.y += m.v; m.life -= 0.024;
      const g = ctx.createLinearGradient(m.x, m.y, m.x + 120, m.y - 85);
      g.addColorStop(0, "rgba(255,255,255,0.95)"); g.addColorStop(0.3, "rgba(196,181,253,0.5)"); g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.globalAlpha = m.life; ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x + 120, m.y - 85); ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(m.x, m.y, 1.8, 0, 7); ctx.fill();
    }
  };
  draw();
})();
