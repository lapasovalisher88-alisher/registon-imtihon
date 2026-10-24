(function () {
  const PASSWORD = "komissiya2026"; // O'zgartiring! Bu faqat oddiy to'siq, haqiqiy himoya emas.
  const KEY = "exam_admin_v1";
  const E = window.EXAM;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  let list = [];
  try { list = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} };

  function enter() { $("login").classList.add("hidden"); $("panel").classList.remove("hidden"); draw(); }
  $("btnLogin").onclick = () => {
    if ($("pw").value === PASSWORD) { sessionStorage.setItem("adm", "1"); enter(); }
    else $("loginErr").classList.remove("hidden");
  };
  $("pw").onkeydown = (e) => { if (e.key === "Enter") $("btnLogin").click(); };
  if (sessionStorage.getItem("adm")) enter();

  $("files").onchange = async (e) => {
    for (const f of e.target.files) {
      try {
        const d = JSON.parse(await f.text());
        if (!d.candidate || !d.test) continue;
        d.id = d.candidate.phone + "|" + d.startedAt;
        if (!d.scores) d.scores = d.cases.map(() => 0);
        const i = list.findIndex((x) => x.id === d.id);
        if (i >= 0) d.scores = list[i].scores, list[i] = d; else list.push(d);
      } catch (err) {}
    }
    e.target.value = "";
    save(); draw();
  };

  const caseMax = () => E.cases.length * 5;
  const caseSum = (d) => d.scores.reduce((a, b) => a + (+b || 0), 0);
  // Jami: test 60% + keys 40%
  const total = (d) => Math.round(d.test.percent * 0.6 + (caseSum(d) / caseMax()) * 100 * 0.4);

  function draw() {
    $("count").textContent = list.length + " ta nomzod";
    const sorted = list.slice().sort((a, b) => total(b) - total(a));
    $("rows").innerHTML = sorted.length ? sorted.map((d) => {
      const i = list.indexOf(d);
      return `<tr><td><b>${esc(d.candidate.fio)}</b><br><span class="muted">${esc(d.candidate.region)} · ${esc(d.candidate.phone)}</span></td>` +
        `<td>${d.test.percent}%</td><td>${caseSum(d)}/${caseMax()}</td><td><b>${total(d)}%</b></td>` +
        `<td><button class="ghost" data-i="${i}">Ochish</button></td></tr>`;
    }).join("") : '<tr><td colspan="5" class="muted">Hozircha natija yo\'q</td></tr>';
    $("rows").querySelectorAll("button[data-i]").forEach((b) => (b.onclick = () => detail(+b.dataset.i)));
  }

  function detail(i) {
    const d = list[i];
    const box = $("detail");
    box.classList.remove("hidden");
    box.innerHTML = `<h2>${esc(d.candidate.fio)}</h2><p class="muted">Test: ${d.test.correct}/${d.test.total}${d.timedOut ? " · vaqt tugagan" : ""}</p>` +
      d.cases.map((c, k) => `<p><b>${k + 1}. ${esc(c.question)}</b></p><div class="answer">${esc(c.answer || "(javob yo'q)")}</div>` +
        `<label>Ball (0–5)</label><select data-k="${k}">${[0, 1, 2, 3, 4, 5].map((n) => `<option ${d.scores[k] == n ? "selected" : ""}>${n}</option>`).join("")}</select>`).join("");
    box.querySelectorAll("select").forEach((s) => (s.onchange = () => { d.scores[+s.dataset.k] = +s.value; save(); draw(); }));
    box.scrollIntoView({ behavior: "smooth" });
  }

  $("btnClear").onclick = () => { if (confirm("Barcha yuklangan natijalar o'chiriladi. Davom etasizmi?")) { list = []; save(); $("detail").classList.add("hidden"); draw(); } };

  $("btnCsv").onclick = () => {
    const q = (v) => '"' + String(v).replace(/"/g, '""') + '"';
    const head = ["FIO", "Telefon", "Hudud", "Test %", ...Object.values(E.topics).map((t) => "Test: " + t), "Keys ball", "Jami %"];
    const rows = list.map((d) => [d.candidate.fio, d.candidate.phone, d.candidate.region, d.test.percent,
      ...Object.keys(E.topics).map((t) => d.test.byTopic[t].correct + "/" + d.test.byTopic[t].total),
      caseSum(d) + "/" + caseMax(), total(d)]);
    const csv = "﻿" + [head, ...rows].map((r) => r.map(q).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = "natijalar.csv";
    a.click();
  };
})();
