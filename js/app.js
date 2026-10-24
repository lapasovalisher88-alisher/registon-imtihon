(function () {
  const E = window.EXAM;
  const KEY = "exam_state_v1";
  const $ = (id) => document.getElementById(id);
  const show = (name) => ["start", "exam", "result"].forEach((s) => $("screen-" + s).classList.toggle("hidden", s !== name));

  const shuffle = (a) => {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  let state = null, tick = null;

  $("examTitle").textContent = E.title;
  $("intro").textContent = `Imtihon ${E.questions.length} ta test savoli va ${E.cases.length} ta ochiq keysdan iborat. Vaqt: ${E.timeMinutes} daqiqa. O'tish bali: ${E.passPercent}%.`;

  // Savollar tartibini va variantlarni aralashtirib, indeksni saqlab qolamiz
  function buildItems() {
    const tests = shuffle(E.questions.map((q, i) => i)).map((qi) => {
      const order = shuffle(E.questions[qi].options.map((_, k) => k));
      return { type: "test", qi, order };
    });
    const cases = E.cases.map((_, ci) => ({ type: "case", ci }));
    return tests.concat(cases);
  }

  $("btnStart").onclick = () => {
    const fio = $("fio").value.trim(), phone = $("phone").value.trim(), region = $("region").value.trim();
    const err = $("startErr");
    if (fio.length < 5 || phone.replace(/\D/g, "").length < 9 || !region) {
      err.textContent = "Iltimos, ism-familiya, telefon va hududni to'g'ri kiriting.";
      err.classList.remove("hidden");
      return;
    }
    state = { fio, phone, region, started: Date.now(), items: buildItems(), pos: 0, answers: {}, finished: false };
    save();
    sendLead();
    run();
  };

  function run() {
    show("exam");
    $("timer").classList.remove("hidden");
    render();
    clearInterval(tick);
    tick = setInterval(updateTimer, 500);
    updateTimer();
  }

  function remaining() { return state.started + E.timeMinutes * 60000 - Date.now(); }

  function updateTimer() {
    const ms = remaining();
    if (ms <= 0) { finish(true); return; }
    const s = Math.ceil(ms / 1000);
    const t = $("timer");
    t.textContent = String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
    t.classList.toggle("warn", s <= 300);
  }

  function render() {
    const it = state.items[state.pos];
    const total = state.items.length;
    $("bar").style.width = (state.pos / total) * 100 + "%";
    $("counter").textContent = `${state.pos + 1} / ${total}`;
    $("btnPrev").disabled = state.pos === 0;
    $("btnNext").textContent = state.pos === total - 1 ? "Yakunlash" : "Keyingisi";

    let html = "";
    if (it.type === "test") {
      const q = E.questions[it.qi];
      const cur = state.answers["t" + it.qi];
      html = `<span class="tag">${esc(E.topics[q.topic])}</span><div class="q">${esc(q.q)}</div>` +
        it.order.map((k) => `<label class="opt ${cur === k ? "sel" : ""}"><input type="radio" name="o" value="${k}" ${cur === k ? "checked" : ""}><span>${esc(q.options[k])}</span></label>`).join("");
    } else {
      const c = E.cases[it.ci];
      const cur = state.answers["c" + it.ci] || "";
      html = `<span class="tag">Keys · ${esc(E.topics[c.topic])}</span><div class="q">${esc(c.q)}</div>` +
        `<textarea id="caseText" placeholder="Javobingizni batafsil yozing...">${esc(cur)}</textarea>`;
    }
    $("qBox").innerHTML = html;

    if (it.type === "test") {
      $("qBox").querySelectorAll("input[name=o]").forEach((r) => (r.onchange = () => {
        state.answers["t" + it.qi] = +r.value;
        save();
        $("qBox").querySelectorAll(".opt").forEach((o) => o.classList.toggle("sel", o.contains(r) && r.checked));
      }));
    } else {
      $("caseText").oninput = (e) => { state.answers["c" + it.ci] = e.target.value; save(); };
    }
  }

  $("btnPrev").onclick = () => { if (state.pos > 0) { state.pos--; save(); render(); } };
  $("btnNext").onclick = () => {
    if (state.pos < state.items.length - 1) { state.pos++; save(); render(); return; }
    const unanswered = state.items.filter((it) => it.type === "test" && state.answers["t" + it.qi] === undefined).length;
    const msg = unanswered ? `${unanswered} ta savolga javob berilmagan. Baribir yakunlaysizmi?` : "Imtihonni yakunlaysizmi? Keyin o'zgartirib bo'lmaydi.";
    if (confirm(msg)) finish(false);
  };

  function compute() {
    const byTopic = {};
    Object.keys(E.topics).forEach((t) => (byTopic[t] = { correct: 0, total: 0 }));
    let correct = 0;
    E.questions.forEach((q, i) => {
      byTopic[q.topic].total++;
      if (state.answers["t" + i] === q.correct) { byTopic[q.topic].correct++; correct++; }
    });
    const total = E.questions.length;
    const percent = Math.round((correct / total) * 100);
    return { correct, total, percent, passed: percent >= E.passPercent, byTopic };
  }

  function payload() {
    const r = compute();
    return {
      version: 1,
      exam: E.title,
      candidate: { fio: state.fio, phone: state.phone, region: state.region },
      startedAt: new Date(state.started).toISOString(),
      finishedAt: new Date(state.finishedAt || Date.now()).toISOString(),
      timedOut: !!state.timedOut,
      test: r,
      cases: E.cases.map((c, i) => ({ topic: c.topic, question: c.q, answer: state.answers["c" + i] || "" }))
    };
  }

  function finish(timedOut) {
    clearInterval(tick);
    state.finished = true; state.timedOut = timedOut; state.finishedAt = Date.now();
    save();
    showResult();
    if (!state.sent) sendToBot();
  }

  // ---- Telegram ----
  function reportText() {
    const p = payload(), r = p.test;
    const lines = [
      `📋 ${p.exam}`,
      `👤 ${p.candidate.fio}`,
      `📞 ${p.candidate.phone}`,
      `📍 ${p.candidate.region}`,
      `🕒 ${new Date(p.finishedAt).toLocaleString("uz-UZ")}${p.timedOut ? " (vaqt tugadi)" : ""}`,
      "",
      `✅ Test: ${r.correct}/${r.total} (${r.percent}%) — ${r.passed ? "O'TDI" : "O'TMADI"}`,
      ...Object.keys(E.topics).map((t) => `• ${E.topics[t]}: ${r.byTopic[t].correct}/${r.byTopic[t].total}`),
      "",
      "📝 Keys javoblari:"
    ];
    p.cases.forEach((c, i) => lines.push("", `${i + 1}) ${c.question}`, c.answer || "(javob yo'q)"));
    return lines.join("\n");
  }

  function pdfData(p) {
    const tests = E.questions.map((q, i) => {
      const a = state.answers["t" + i];
      return { q: q.q, chosen: a === undefined ? "" : q.options[a], correctText: q.options[q.correct], ok: a === q.correct };
    });
    return Object.assign({}, p, { topics: E.topics, tests });
  }

  async function tg(method, body) {
    const res = await fetch(`https://api.telegram.org/bot${window.TG.BOT_TOKEN}/${method}`, { method: "POST", body });
    const j = await res.json();
    if (!j.ok) throw new Error(j.description || "Telegram xatosi");
  }

  async function sendToBot() {
    const st = $("sendStatus");
    if (!window.TG || !window.TG.BOT_TOKEN || !window.TG.CHAT_ID) {
      st.textContent = "Bot sozlanmagan. Natija faylini yuklab olib, komissiyaga yuboring.";
      st.className = "note fail";
      return;
    }
    st.textContent = "Natija komissiyaga yuborilmoqda...";
    st.className = "note";
    $("btnRetry").classList.add("hidden");
    try {
      const p = payload();
      let pdf = null;
      try { pdf = await window.buildPdf(pdfData(p)); } catch (e) { console.warn("PDF yaratilmadi:", e); }
      if (pdf) {
        const f = new FormData();
        f.append("chat_id", window.TG.CHAT_ID);
        f.append("caption", `📋 ${p.candidate.fio} — ${p.test.percent}% (${p.test.passed ? "o'tdi" : "o'tmadi"})\n📞 ${p.candidate.phone} · 📍 ${p.candidate.region}`);
        f.append("document", pdf, "natija_" + state.fio.replace(/\s+/g, "_") + ".pdf");
        await tg("sendDocument", f);
      } else {
        // PDF bo'lmasa, matn ko'rinishida yuboramiz
        const text = reportText();
        for (let i = 0; i < text.length; i += 3800) {
          const f = new FormData();
          f.append("chat_id", window.TG.CHAT_ID);
          f.append("text", text.slice(i, i + 3800));
          await tg("sendMessage", f);
        }
      }
      const d = new FormData();
      d.append("chat_id", window.TG.CHAT_ID);
      d.append("document", new Blob([JSON.stringify(payload(), null, 2)], { type: "application/json" }), "natija_" + state.fio.replace(/\s+/g, "_") + ".json");
      await tg("sendDocument", d);
      state.sent = true; save();
      st.textContent = "✓ Natijangiz komissiyaga yuborildi. Rahmat!";
      st.className = "note pass";
    } catch (e) {
      st.textContent = "Yuborib bo'lmadi (" + e.message + "). Qayta urinib ko'ring yoki natija faylini yuklab oling.";
      st.className = "note fail";
      $("btnRetry").classList.remove("hidden");
    }
  }
  $("btnRetry").onclick = sendToBot;

  $("btnRetake").onclick = () => {
    if (!confirm("Imtihon boshidan boshlanadi, oldingi javoblar o'chadi. Davom etasizmi?")) return;
    try { localStorage.removeItem(KEY); } catch (e) {}
    location.reload();
  };

  function showResult() {
    show("result");
    $("timer").classList.add("hidden");
    $("btnRetake").classList.toggle("hidden", !window.ALLOW_RETAKE);
    const r = compute();
    const rows = Object.keys(E.topics).map((t) => {
      const b = r.byTopic[t], p = b.total ? Math.round((b.correct / b.total) * 100) : 0;
      return `<tr><td>${esc(E.topics[t])}</td><td>${b.correct}/${b.total}</td><td><div class="bar"><div style="width:${p}%"></div></div></td></tr>`;
    }).join("");
    $("resultBox").innerHTML =
      `<p class="muted">${esc(state.fio)}${state.timedOut ? " · vaqt tugadi" : ""}</p>` +
      `<div class="score ${r.passed ? "pass" : "fail"}">${r.percent}%</div>` +
      `<p>Test bo'yicha ${r.correct} / ${r.total} to'g'ri javob. ${r.passed ? "Test qismidan o'tdingiz." : "Test qismi bo'yicha o'tish balidan past."}</p>` +
      `<table><tbody>${rows}</tbody></table>`;
  }

  $("btnDownload").onclick = async () => {
    const btn = $("btnDownload"), label = btn.textContent;
    btn.disabled = true; btn.textContent = "PDF tayyorlanmoqda...";
    try {
      const blob = await window.buildPdf(pdfData(payload()));
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "natija_" + state.fio.replace(/\s+/g, "_") + ".pdf";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    } catch (e) {
      alert("PDF yaratib bo'lmadi. Internet aloqasini tekshirib, qayta urinib ko'ring.");
    }
    btn.disabled = false; btn.textContent = label;
  };

  // Lid: nomzod ro'yxatdan o'tishi bilan guruhga xabar
  async function sendLead() {
    if (!window.TG || !window.TG.BOT_TOKEN || !window.TG.CHAT_ID || state.leadSent) return;
    try {
      const f = new FormData();
      f.append("chat_id", window.TG.CHAT_ID);
      f.append("text", `🆕 Yangi nomzod imtihonni boshladi\n👤 ${state.fio}\n📞 ${state.phone}\n📍 ${state.region}\n🕒 ${new Date(state.started).toLocaleString("uz-UZ")}`);
      await tg("sendMessage", f);
      state.leadSent = true; save();
    } catch (e) { console.warn("Lid yuborilmadi:", e); }
  }

  // Sahifa qayta yuklansa, davom ettirish (vaqt to'xtamaydi)
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved && saved.items) {
      state = saved;
      if (state.finished) { showResult(); if (!state.sent) sendToBot(); }
      else if (remaining() <= 0) finish(true);
      else run();
    }
  } catch (e) {}
})();
