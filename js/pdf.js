// PDF hisobot (jsPDF). Unicode (o'zbek lotin/kirill) uchun DejaVu shrifti yuklanadi.
(function () {
  const FONT_BASE = "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/";
  let fonts = null;

  async function loadFont(name) {
    const buf = await (await fetch(FONT_BASE + name)).arrayBuffer();
    const bytes = new Uint8Array(buf);
    let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }

  // data: { exam, candidate, finishedAt, timedOut, test, topics, tests:[{topic,q,chosen,correctText,ok}], cases:[{topic,question,answer}] }
  window.buildPdf = async function (data) {
    if (!window.jspdf) throw new Error("jsPDF yuklanmadi");
    if (!fonts) fonts = { reg: await loadFont("DejaVuSans.ttf"), bold: await loadFont("DejaVuSans-Bold.ttf") };

    const doc = new window.jspdf.jsPDF({ unit: "mm", format: "a4" });
    doc.addFileToVFS("DejaVuSans.ttf", fonts.reg);
    doc.addFont("DejaVuSans.ttf", "DV", "normal");
    doc.addFileToVFS("DejaVuSans-Bold.ttf", fonts.bold);
    doc.addFont("DejaVuSans-Bold.ttf", "DV", "bold");

    const M = 15, W = 210 - M * 2, BOTTOM = 285;
    let y = M;
    const need = (h) => { if (y + h > BOTTOM) { doc.addPage(); y = M; } };
    const write = (text, size, style, color, indent) => {
      doc.setFont("DV", style || "normal"); doc.setFontSize(size || 10); doc.setTextColor.apply(doc, color || [30, 35, 50]);
      const lines = doc.splitTextToSize(String(text), W - (indent || 0));
      const lh = (size || 10) * 0.45;
      lines.forEach((l) => { need(lh); doc.text(l, M + (indent || 0), y + lh * 0.8); y += lh; });
      y += 1;
    };

    const t = data.test, c = data.candidate;
    if (window.LOGO) {
      const lh = 16, lw = lh * (window.LOGO.w / window.LOGO.h);
      doc.addImage(window.LOGO.data, "PNG", M, y, lw, lh);
      y += lh + 2;
    }
    doc.setFillColor(232, 83, 31); doc.rect(M, y, W, 0.8, "F"); y += 5;
    write(data.exam, 16, "bold");
    y += 2;
    write("Nomzod: " + c.fio, 11, "bold");
    write("Telefon: " + c.phone + "    Hudud: " + c.region, 10);
    write("Yakunlangan: " + new Date(data.finishedAt).toLocaleString("uz-UZ") + (data.timedOut ? " (vaqt tugadi)" : ""), 10);
    y += 3;

    write("Test natijasi: " + t.correct + " / " + t.total + " (" + t.percent + "%) — " + (t.passed ? "O'TDI" : "O'TMADI"), 13, "bold", t.passed ? [18, 128, 92] : [192, 57, 43]);
    Object.keys(data.topics).forEach((k) => write("• " + data.topics[k] + ": " + t.byTopic[k].correct + " / " + t.byTopic[k].total, 10, "normal", null, 3));
    y += 4;

    write("Test savollari bo'yicha javoblar", 12, "bold");
    data.tests.forEach((r, i) => {
      need(18);
      write((i + 1) + ". " + r.q, 10, "bold");
      write("Nomzod javobi: " + (r.chosen || "(javob berilmagan)") + (r.ok ? "  ✓" : "  ✗"), 9.5, "normal", r.ok ? [18, 128, 92] : [192, 57, 43], 4);
      if (!r.ok) write("To'g'ri javob: " + r.correctText, 9.5, "normal", [90, 100, 120], 4);
      y += 1.5;
    });

    y += 3;
    write("Ochiq keys javoblari (komissiya baholaydi)", 12, "bold");
    data.cases.forEach((k, i) => {
      need(20);
      write((i + 1) + ". [" + data.topics[k.topic] + "] " + k.question, 10, "bold");
      write(k.answer || "(javob yo'q)", 10, "normal", null, 4);
      y += 2;
    });

    return doc.output("blob");
  };
})();
