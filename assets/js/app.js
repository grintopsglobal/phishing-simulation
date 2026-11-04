/* ==========================================================================
   app.js: logika umum untuk semua halaman.
   - Bahasa aktif + App.t() untuk teks dari assets/js/i18n.js
   - State aplikasi di localStorage (satu kunci, satu objek JSON)
   - Navigasi aktif, tombol "Mulai ulang", peringatan jika penyimpanan diblokir
   - Logika halaman beranda (index.html) dan belajar (learn.html)
   simulation.js dan assessment.js memakai window.App dari file ini.
   ========================================================================== */
(function () {
  "use strict";

  var KEY = "grintec-pa-v1";
  var storageOK = true;

  /* Bahasa: dari <html lang>. Default Inggris. */
  var LANG = /^id/i.test(document.documentElement.lang) ? "id" : "en";
  var STRINGS = window.GRINTEC_STRINGS || { id: {}, en: {} };

  /* Ambil teks dan isi {variabel}. Jika kunci tidak ada, kembali ke bahasa Inggris. */
  function t(key, vars) {
    var s = (STRINGS[LANG] && STRINGS[LANG][key]) || (STRINGS.en && STRINGS.en[key]) || key;
    return s.replace(/\{(\w+)\}/g, function (m, k) { return vars && k in vars ? vars[k] : m; });
  }

  /* Bentuk state (sama untuk kedua bahasa, sehingga progres ikut saat ganti bahasa):
     {
       profile: { name, division },
       learn:   { read: [cardId], spots: [spotId] },
       sim:     { v: 2, stage, phase, remaining, log, ends, done }  (lihat simulation.js),
       test:    { ids, order: { qid: [optId] }, answers: { qid: optId }, flags: { qid: true }, current, timer, elapsed },
       result:  { date, score, total, percent, byCat, answers, ids, elapsed, timer }
     } */
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var s = raw ? JSON.parse(raw) : {};
      return s && typeof s === "object" ? s : {};
    } catch (e) {
      storageOK = false;
      return {};
    }
  }

  var state = load();

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      storageOK = false;
      showStorageWarning();
    }
  }

  function showStorageWarning() {
    if (document.querySelector(".storage-warning")) return;
    var div = document.createElement("div");
    div.className = "storage-warning";
    div.setAttribute("role", "status");
    div.textContent = t("storage_blocked");
    document.body.insertBefore(div, document.querySelector("main"));
  }

  /* Uji penyimpanan sekali di awal (mode privat atau kebijakan kantor bisa memblokir) */
  try {
    localStorage.setItem(KEY + "-test", "1");
    localStorage.removeItem(KEY + "-test");
  } catch (e) {
    storageOK = false;
  }

  var App = {
    lang: LANG,
    t: t,
    state: state,
    save: save,
    /* Ubah state lalu simpan: App.update(function (s) { s.x = 1; }) */
    update: function (fn) { fn(state); save(); },
    reset: function () {
      Object.keys(state).forEach(function (k) { delete state[k]; });
      try { localStorage.removeItem(KEY); } catch (e) { /* abaikan */ }
    },
    /* Escape teks sebelum dimasukkan ke innerHTML */
    esc: function (str) {
      return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    },
    /* Fisher-Yates, mengembalikan salinan baru */
    shuffle: function (arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
      }
      return a;
    },
    $: function (sel, root) { return (root || document).querySelector(sel); },
    $$: function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); },
    /* Tampilkan URL asli sebuah link simulasi di elemen target */
    bindReveal: function (btn, target) {
      function show() {
        target.textContent = btn.getAttribute("data-url");
        target.hidden = false;
      }
      btn.addEventListener("mouseenter", show);
      btn.addEventListener("focus", show);
      btn.addEventListener("click", show);
    }
  };
  window.App = App;

  /* ---------- Umum: navigasi aktif ---------- */
  function markNav() {
    var page = location.pathname.split("/").pop() || "index.html";
    App.$$(".site-nav a").forEach(function (a) {
      if (a.getAttribute("href") === page) a.setAttribute("aria-current", "page");
    });
    /* Link ganti bahasa membawa hash (misalnya #tanda-link) */
    var sw = App.$(".lang-switch");
    if (sw && location.hash) sw.href = sw.getAttribute("href").split("#")[0] + location.hash;
  }

  /* ---------- Umum: konfirmasi "Mulai ulang" ----------
     Tombol [data-reset-open] membuka panel (aria-controls).
     Di dalam panel: [data-reset-confirm] menghapus, [data-reset-cancel] menutup.
     [data-reset-scope="sim"] pada panel membatasi yang dihapus. */
  function bindReset() {
    App.$$("[data-reset-open]").forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (!panel) return;
      var cancel = App.$("[data-reset-cancel]", panel);
      btn.addEventListener("click", function () {
        var open = panel.hidden;
        panel.hidden = !open;
        btn.setAttribute("aria-expanded", String(open));
        if (open) cancel.focus();
      });
      cancel.addEventListener("click", function () {
        panel.hidden = true;
        btn.setAttribute("aria-expanded", "false");
        btn.focus();
      });
      App.$("[data-reset-confirm]", panel).addEventListener("click", function () {
        var scope = panel.getAttribute("data-reset-scope");
        if (scope) App.update(function (s) { delete s[scope]; });
        else App.reset();
        location.reload();
      });
      panel.addEventListener("keydown", function (e) {
        if (e.key === "Escape") cancel.click();
      });
    });
  }

  /* ---------- Ringkasan progres (dipakai di beranda) ---------- */
  var LEARN_TOTAL = 8;

  function progress() {
    var learnRead = (state.learn && state.learn.read || []).length;
    /* Simulasi: 4 tahap. State lama (inbox 12 email) tidak dihitung. */
    var sim = state.sim && state.sim.v === 2 ? state.sim : null;
    var simTotal = 4;
    var simDone = sim ? (sim.done ? simTotal : sim.stage || 0) : 0;
    var test = state.test;
    return {
      learn: { done: Math.min(learnRead, LEARN_TOTAL), total: LEARN_TOTAL },
      sim: { done: simDone, total: simTotal },
      test: { active: !!test, done: test && test.answers ? Object.keys(test.answers).length : 0, total: test && test.ids ? test.ids.length : 15 },
      result: state.result || null
    };
  }

  function initHome() {
    var p = progress();

    function setStatus(stage, kind, text) {
      var el = App.$('[data-stage="' + stage + '"]');
      if (!el) return;
      el.setAttribute("data-s", kind);
      el.textContent = text;
    }

    function stageText(done, total, doneKey) {
      if (done >= total) return ["done", t(doneKey || "stage_done")];
      if (done > 0) return ["progress", t("stage_progress", { done: done, total: total })];
      return ["todo", t("stage_todo")];
    }

    var l = stageText(p.learn.done, p.learn.total, "stage_learn_done");
    setStatus("learn", l[0], l[1]);
    var s = stageText(p.sim.done, p.sim.total);
    setStatus("sim", s[0], s[1]);
    if (p.test.active) setStatus("test", "progress", t("stage_test_progress", { done: p.test.done, total: p.test.total }));
    else if (p.result) setStatus("test", "done", t("stage_done"));
    if (p.result) setStatus("result", "done", t("stage_score", { pct: p.result.percent }));

    /* Isi garis lengkung sesuai rata-rata progres empat tahap */
    var frac = (p.learn.done / p.learn.total) + Math.min(p.sim.done / p.sim.total, 1) +
      (p.result ? 1 : (p.test.active ? p.test.done / p.test.total : 0)) + (p.result ? 1 : 0);
    var fill = document.getElementById("journey-fill");
    if (fill) fill.setAttribute("stroke-dashoffset", String(100 - Math.round(frac / 4 * 100)));

    /* Banner lanjutkan */
    if (p.learn.done || p.sim.done || p.test.active || p.result) {
      var parts = [t("resume_learn", p.learn), t("resume_sim", p.sim)];
      if (p.test.active) parts.push(t("resume_test", p.test));
      if (p.result) parts.push(t("resume_result", { pct: p.result.percent }));
      App.$("#resume-text").innerHTML = "<strong>" + t("resume_label") + "</strong> " + App.esc(parts.join(" · "));
      var link = App.$("#resume-link");
      var go;
      if (p.test.active) go = ["assessment.html", "resume_go_test"];
      else if (p.result) go = ["result.html", "resume_see_result"];
      else if (p.learn.done < p.learn.total) go = ["learn.html", "resume_go_learn"];
      else if (p.sim.done < p.sim.total) go = ["simulation.html", "resume_go_sim"];
      else go = ["assessment.html", "resume_start_test"];
      link.href = go[0];
      link.textContent = t(go[1]);
      App.$("#resume").hidden = false;
    }

    /* Form identitas */
    var form = App.$("#identity-form");
    var prof = state.profile || {};
    form.name.value = prof.name || "";
    form.division.value = prof.division || "";
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var division = form.division.value.trim();
      App.update(function (st) { st.profile = { name: name, division: division }; });
      App.$("#identity-status").textContent = t(name || division ? "identity_saved" : "identity_empty");
    });
  }

  /* ---------- Halaman belajar ---------- */
  function initLearn() {
    App.update(function (s) { s.learn = s.learn || {}; s.learn.read = s.learn.read || []; s.learn.spots = s.learn.spots || []; });
    var learn = state.learn;
    var countEl = App.$("#learn-count");

    function updateLearnCount() {
      if (countEl) countEl.textContent = t("learn_count", { done: learn.read.length, total: LEARN_TOTAL });
    }

    /* Kartu <details>: dibuka = dianggap sudah dibaca */
    App.$$(".flag-card").forEach(function (card) {
      var mark = App.$(".read-mark", card);
      function paint() { if (mark) mark.textContent = learn.read.indexOf(card.id) > -1 ? t("learn_read") : ""; }
      paint();
      card.addEventListener("toggle", function () {
        if (card.open && learn.read.indexOf(card.id) === -1) {
          App.update(function () { learn.read.push(card.id); });
          paint();
          updateLearnCount();
        }
      });
    });
    /* Buka kartu jika datang dari rekomendasi (learn.html#tanda-xxx) */
    if (location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      if (target && target.tagName === "DETAILS") target.open = true;
    }
    updateLearnCount();

    /* Link contoh: tampilkan URL asli */
    App.$$("[data-url]").forEach(function (btn) {
      var target = document.getElementById(btn.getAttribute("aria-controls"));
      if (target) App.bindReveal(btn, target);
    });

    /* Email beranotasi: hotspot bernomor */
    var spots = App.$$(".spot-btn");
    var counter = App.$("#annot-count");
    function paintCount() {
      if (counter) counter.textContent = t("annot_count", { done: learn.spots.length, total: spots.length });
    }
    spots.forEach(function (btn) {
      var note = document.getElementById(btn.getAttribute("aria-controls"));
      var id = btn.getAttribute("data-spot");
      if (learn.spots.indexOf(id) > -1) btn.classList.add("found");
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") !== "true";
        btn.setAttribute("aria-expanded", String(open));
        note.hidden = !open;
        if (open) note.classList.add("reveal");
        if (learn.spots.indexOf(id) === -1) {
          App.update(function () { learn.spots.push(id); });
          btn.classList.add("found");
          paintCount();
        }
      });
    });
    paintCount();

    var showAll = App.$("#annot-all");
    if (showAll) showAll.addEventListener("click", function () {
      spots.forEach(function (btn) { if (btn.getAttribute("aria-expanded") !== "true") btn.click(); });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!storageOK) showStorageWarning();
    markNav();
    bindReset();
    if (App.$("#identity-form")) initHome();
    if (App.$("#flags")) initLearn();
  });
})();
