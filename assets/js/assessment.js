/* ==========================================================================
   assessment.js: pre-assessment (assessment.html) dan halaman hasil (result.html).
   Data dari data/questions(.id).js. Tes yang sedang berjalan ada di
   App.state.test, hasil akhir di App.state.result.

   Selama tes, halaman masuk "mode ujian" (body.exam-mode): header dan footer
   situs disembunyikan, tampil bar ujian, daftar nomor soal, dan tombol
   layar penuh (jika browser mendukung).
   ========================================================================== */
(function () {
  "use strict";

  var App = window.App;
  var t = App.t;
  var esc = App.esc;
  var BANK = window.GRINTEC_QUESTIONS;
  var CATS = window.GRINTEC_CATEGORIES || {};
  var CONFIG = window.GRINTEC_CONFIG || { perLevel: { mudah: 5, sedang: 5, sulit: 5 }, levels: [] };
  var LEVEL_ORDER = ["mudah", "sedang", "sulit"];

  var root;
  var timerId = null;
  var checking = false; /* true = layar konfirmasi "Selesaikan tes?" */

  function q(id) { return BANK.filter(function (x) { return x.id === id; })[0]; }
  function catLabel(c) { return CATS[c] ? CATS[c].label : c; }
  function levelLabel(l) { return t("lvl_" + l); }

  function fmtTime(sec) {
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }
  function fmtDuration(sec) {
    var m = Math.floor(sec / 60);
    return (m ? t("minutes", { n: m }) : "") + t("seconds", { n: sec % 60 });
  }

  /* Teks jawaban untuk ditampilkan */
  function answerText(item, val) {
    if (val == null) return t("not_answered");
    if (item.type === "email") return t(val === "phish" ? "phish" : "safe");
    var opt = item.options.filter(function (o) { return o.id === val; })[0];
    return opt ? opt.text : t("not_answered");
  }

  /* Ringkasan email kecil untuk soal tipe email */
  function mailBox(m) {
    return '<div class="q-mail"><dl>' +
      "<dt>" + t("q_from") + "</dt><dd>" + esc(m.fromName) + " &lt;" + esc(m.fromAddress) + "&gt;</dd>" +
      "<dt>" + t("q_subject") + "</dt><dd>" + esc(m.subject) + "</dd>" +
      (m.attachment ? "<dt>" + t("q_attachment") + "</dt><dd>" + esc(m.attachment) + "</dd>" : "") +
      "</dl><p>" + esc(m.snippet) + "</p></div>";
  }

  /* ======================= TES ======================= */

  /* Ambil soal acak per tingkat, urut dari mudah ke sulit */
  function buildTest(withTimer) {
    var ids = [];
    LEVEL_ORDER.forEach(function (lvl) {
      var pool = BANK.filter(function (x) { return x.level === lvl; });
      var n = Math.min(CONFIG.perLevel[lvl] || 0, pool.length);
      App.shuffle(pool).slice(0, n).forEach(function (x) { ids.push(x.id); });
    });
    var order = {};
    ids.forEach(function (id) {
      var item = q(id);
      if (item.options) order[id] = App.shuffle(item.options.map(function (o) { return o.id; }));
    });
    App.update(function (s) {
      s.test = { ids: ids, order: order, answers: {}, flags: {}, current: 0, timer: !!withTimer, elapsed: 0 };
    });
  }

  function renderIntro() {
    exitExamMode();
    var test = App.state.test;
    var prof = App.state.profile || {};
    var total = LEVEL_ORDER.reduce(function (sum, l) { return sum + (CONFIG.perLevel[l] || 0); }, 0);
    var who = prof.name
      ? t("intro_who_named", { name: esc(prof.name), division: prof.division ? " (" + esc(prof.division) + ")" : "" })
      : t("intro_who_anon");
    who += '<a href="index.html#identity-title">' + t(prof.name ? "intro_change_name" : "intro_add_name") + "</a>";

    if (test) {
      root.innerHTML =
        '<div class="panel reveal">' +
        "<h2>" + t("resume_title") + "</h2>" +
        "<p>" + t("resume_text", { done: Object.keys(test.answers).length, total: test.ids.length }) + "</p>" +
        '<div class="btn-row"><button class="btn btn-primary" type="button" data-resume>' + t("resume_btn") + "</button>" +
        '<button class="btn btn-quiet" type="button" data-new>' + t("new_btn") + "</button></div></div>";
      return;
    }

    root.innerHTML =
      '<div class="panel reveal">' +
      "<h2>" + t("intro_title") + "</h2>" +
      "<ul>" +
      "<li>" + t("intro_1", { total: total }) + "</li>" +
      "<li>" + t("intro_2") + "</li>" +
      "<li>" + t("intro_3") + "</li>" +
      "<li>" + t("intro_4") + "</li>" +
      "<li>" + t("intro_5") + "</li>" +
      "</ul>" +
      '<p class="small muted">' + who + "</p>" +
      (App.state.result ? '<p class="notice notice-warn small">' + t("intro_replace", { pct: App.state.result.percent }) + "</p>" : "") +
      '<p><label class="option" style="max-width:360px"><input type="checkbox" id="use-timer"> <span>' + t("use_timer") + "</span></label></p>" +
      '<button class="btn btn-primary" type="button" data-start>' + t("start_btn") + "</button></div>";
  }

  function progressCurve(answered, total) {
    var pct = total ? Math.round(answered / total * 100) : 0;
    return '<div class="exam-progress" role="progressbar" aria-label="' + t("progress_label") + '" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + answered + '" aria-valuetext="' + t("progress_text", { done: answered, total: total }) + '">' +
      '<svg class="curve" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="g-test" x1="0" x2="1"><stop offset="0" stop-color="#B9D535"/><stop offset=".5" stop-color="#00A651"/><stop offset="1" stop-color="#00663A"/></linearGradient></defs>' +
      '<path class="track" d="M4 32 C 300 4, 700 4, 996 32" fill="none" stroke-width="6"/>' +
      '<path class="fill" d="M4 32 C 300 4, 700 4, 996 32" fill="none" stroke="url(#g-test)" stroke-width="6" stroke-linecap="butt" pathLength="100" stroke-dasharray="100" stroke-dashoffset="' + (100 - pct) + '"/>' +
      "</svg></div>";
  }

  /* ---------- Mode ujian ---------- */
  function enterExamMode() { document.body.classList.add("exam-mode"); }
  function exitExamMode() {
    document.body.classList.remove("exam-mode");
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
  }

  function navStatus(id) {
    var test = App.state.test;
    var s = t(test.answers[id] != null ? "st_answered" : "st_empty");
    if (test.flags && test.flags[id]) s += ", " + t("st_flagged");
    return s;
  }

  /* Daftar nomor soal di sisi kanan (atau di bawah pada HP) */
  function navGrid() {
    var test = App.state.test;
    return '<aside class="exam-nav" aria-labelledby="exam-nav-title">' +
      '<h2 id="exam-nav-title">' + t("exam_nav") + "</h2>" +
      '<ol class="qgrid">' +
      test.ids.map(function (id, i) {
        var cls = (test.answers[id] != null ? " is-answered" : "") + (test.flags && test.flags[id] ? " is-flagged" : "");
        return '<li><button type="button" class="qnum' + cls + '" data-go="' + i + '"' +
          (i === test.current && !checking ? ' aria-current="step"' : "") +
          ' aria-label="' + t("q_n", { n: i + 1 }) + ", " + navStatus(id) + '">' + (i + 1) + "</button></li>";
      }).join("") +
      "</ol>" +
      '<ul class="qlegend">' +
      '<li><span class="qnum is-answered" aria-hidden="true"></span>' + t("st_answered") + "</li>" +
      '<li><span class="qnum is-flagged" aria-hidden="true"></span>' + t("st_flagged") + "</li>" +
      '<li><span class="qnum" aria-hidden="true"></span>' + t("st_empty") + "</li>" +
      "</ul></aside>";
  }

  function examBar() {
    var test = App.state.test;
    var logo = App.$(".brand img");
    var fs = document.fullscreenEnabled
      ? '<button class="btn btn-quiet" type="button" data-fs>' + t(document.fullscreenElement ? "exam_fs_exit" : "exam_fs") + "</button>"
      : "";
    return '<div class="exam-bar">' +
      '<div class="exam-id">' + (logo ? '<img src="' + esc(logo.getAttribute("src")) + '" alt="GRINTEC" width="800" height="229">' : "") +
      '<span class="exam-title">' + t("exam_title") + "</span></div>" +
      '<div class="exam-status">' +
      "<span>" + (checking ? t("finish_check_title") : t("q_of", { n: test.current + 1, total: test.ids.length })) + "</span>" +
      (test.timer ? '<span class="timer" id="timer" aria-label="' + t("timer_label") + '">' + fmtTime(test.elapsed || 0) + "</span>" : "") +
      "</div>" +
      '<div class="exam-tools">' + fs +
      '<button class="btn btn-quiet" type="button" data-leave>' + t("exam_leave") + "</button>" +
      '<button class="btn btn-primary" type="button" data-check>' + t("exam_finish") + "</button>" +
      "</div></div>";
  }

  function questionHtml() {
    var test = App.state.test;
    var id = test.ids[test.current];
    var item = q(id);
    if (!item) {
      return '<div class="notice notice-bad"><p>' + t("q_missing") + '</p><button class="btn btn-primary" type="button" data-new>' + t("new_btn") + "</button></div>";
    }
    var val = test.answers[id];
    var flagged = test.flags && test.flags[id];
    var last = test.current === test.ids.length - 1;

    var opts = item.type === "email"
      ? [{ id: "safe", text: t("safe") }, { id: "phish", text: t("phish") }]
      : (test.order[id] || item.options.map(function (o) { return o.id; })).map(function (oid) {
          return item.options.filter(function (o) { return o.id === oid; })[0];
        }).filter(Boolean);

    return '<div class="q-head"><span class="level">' + levelLabel(item.level) + "</span>" +
      (flagged ? '<span class="flag-chip">' + t("st_flagged") + "</span>" : "") + "</div>" +
      '<h2 class="q-prompt" id="q-prompt" tabindex="-1">' + esc(item.prompt) + "</h2>" +
      (item.type === "email" ? mailBox(item.mail) : "") +
      '<fieldset class="options" aria-labelledby="q-prompt">' +
      opts.map(function (o) {
        return '<label class="option"><input type="radio" name="answer" value="' + esc(o.id) + '"' + (val === o.id ? " checked" : "") + ">" +
          '<span class="' + (item.type === "url" ? "mono" : "") + '">' + esc(o.text) + "</span></label>";
      }).join("") +
      "</fieldset>" +
      '<div class="test-nav">' +
      '<button class="btn btn-quiet" type="button" data-prev' + (test.current === 0 ? " disabled" : "") + ">" + t("prev") + "</button>" +
      '<button class="btn btn-flag" type="button" data-flag aria-pressed="' + (flagged ? "true" : "false") + '">' + t(flagged ? "unflag_btn" : "flag_btn") + "</button>" +
      (last ? '<button class="btn btn-primary" type="button" data-check>' + t("finish") + "</button>"
            : '<button class="btn btn-primary" type="button" data-next>' + t("next") + "</button>") +
      "</div>";
  }

  function checkHtml() {
    var test = App.state.test;
    var missing = [], flagged = [];
    test.ids.forEach(function (id, i) {
      if (test.answers[id] == null) missing.push(i);
      if (test.flags && test.flags[id]) flagged.push(i);
    });
    function list(arr) {
      return '<ul class="unanswered-list">' + arr.map(function (i) {
        return '<li><button class="btn btn-secondary" type="button" data-go="' + i + '">' + t("q_n", { n: i + 1 }) + "</button></li>";
      }).join("") + "</ul>";
    }
    return '<h2 id="q-prompt" tabindex="-1">' + t("finish_check_title") + "</h2>" +
      "<p>" + t("finish_check_text", { answered: test.ids.length - missing.length, total: test.ids.length }) + "</p>" +
      (missing.length ? '<div class="notice notice-warn"><p><strong>' + t("miss_title", { n: missing.length }) + "</strong> " + t("miss_text") + "</p>" + list(missing) + "</div>" : "") +
      (flagged.length ? '<div class="notice" style="margin-top:12px"><p><strong>' + t("flagged_title", { n: flagged.length }) + "</strong></p>" + list(flagged) + "</div>" : "") +
      '<div class="btn-row" style="margin-top:20px">' +
      '<button class="btn btn-primary" type="button" data-finish>' + t("confirm_finish") + "</button>" +
      '<button class="btn btn-quiet" type="button" data-back-test>' + t("back_to_test") + "</button></div>";
  }

  function renderExam() {
    enterExamMode();
    var test = App.state.test;
    root.innerHTML =
      '<div class="exam">' + examBar() +
      progressCurve(Object.keys(test.answers).length, test.ids.length) +
      '<div class="exam-body">' +
      '<section class="exam-main panel reveal" aria-live="off">' + (checking ? checkHtml() : questionHtml()) + "</section>" +
      navGrid() +
      "</div></div>";
    var h = App.$("#q-prompt");
    if (h) h.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function finish() {
    var test = App.state.test;
    var byCat = {};
    var score = 0;
    test.ids.forEach(function (id) {
      var item = q(id);
      if (!item) return;
      var ok = test.answers[id] === item.answer;
      if (ok) score++;
      byCat[item.cat] = byCat[item.cat] || { correct: 0, total: 0 };
      byCat[item.cat].total++;
      if (ok) byCat[item.cat].correct++;
    });
    var total = test.ids.length;
    App.update(function (s) {
      s.result = {
        date: new Date().toISOString(),
        score: score, total: total,
        percent: total ? Math.round(score / total * 100) : 0,
        byCat: byCat, ids: test.ids.slice(), answers: test.answers,
        timer: test.timer, elapsed: test.elapsed || 0
      };
      delete s.test;
    });
    stopTimer();
    exitExamMode();
    location.href = "result.html";
  }

  function startTimer() {
    stopTimer();
    var test = App.state.test;
    if (!test || !test.timer) return;
    timerId = setInterval(function () {
      if (!App.state.test) return stopTimer();
      App.update(function (s) { s.test.elapsed = (s.test.elapsed || 0) + 1; });
      var el = document.getElementById("timer");
      if (el) el.textContent = fmtTime(App.state.test.elapsed);
    }, 1000);
  }
  function stopTimer() { if (timerId) clearInterval(timerId); timerId = null; }

  function go(i) {
    checking = false;
    App.update(function (s) { s.test.current = Math.max(0, Math.min(i, s.test.ids.length - 1)); });
    renderExam();
  }

  function bindTest() {
    root.addEventListener("change", function (ev) {
      if (ev.target.name !== "answer") return;
      var test = App.state.test;
      var id = test.ids[test.current];
      App.update(function (s) { s.test.answers[id] = ev.target.value; });
      /* Perbarui progress dan daftar soal tanpa render ulang, supaya fokus tidak pindah */
      var pb = App.$(".exam-progress", root);
      if (pb) pb.outerHTML = progressCurve(Object.keys(test.answers).length, test.ids.length);
      var btn = App.$('.qgrid [data-go="' + test.current + '"]', root);
      if (btn) {
        btn.classList.add("is-answered");
        btn.setAttribute("aria-label", t("q_n", { n: test.current + 1 }) + ", " + navStatus(id));
      }
    });

    root.addEventListener("click", function (ev) {
      var b = ev.target.closest("button");
      if (!b) return;
      if (b.hasAttribute("data-start")) {
        var timer = App.$("#use-timer");
        buildTest(timer && timer.checked);
        checking = false;
        startTimer();
        renderExam();
      } else if (b.hasAttribute("data-resume")) {
        checking = false;
        startTimer();
        renderExam();
      } else if (b.hasAttribute("data-new")) {
        stopTimer();
        App.update(function (s) { delete s.test; });
        renderIntro();
      } else if (b.hasAttribute("data-prev")) {
        go(App.state.test.current - 1);
      } else if (b.hasAttribute("data-next")) {
        go(App.state.test.current + 1);
      } else if (b.hasAttribute("data-go")) {
        go(parseInt(b.getAttribute("data-go"), 10));
      } else if (b.hasAttribute("data-flag")) {
        App.update(function (s) {
          var id = s.test.ids[s.test.current];
          s.test.flags = s.test.flags || {};
          if (s.test.flags[id]) delete s.test.flags[id]; else s.test.flags[id] = true;
        });
        renderExam();
        var fb = App.$("[data-flag]", root);
        if (fb) fb.focus();
      } else if (b.hasAttribute("data-check")) {
        checking = true;
        renderExam();
      } else if (b.hasAttribute("data-back-test")) {
        go(App.state.test.current);
      } else if (b.hasAttribute("data-finish")) {
        finish();
      } else if (b.hasAttribute("data-leave")) {
        /* Progres sudah tersimpan; kembali ke layar "Lanjutkan tes?" */
        stopTimer();
        checking = false;
        renderIntro();
        window.scrollTo(0, 0);
      } else if (b.hasAttribute("data-fs")) {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen().catch(function () { /* ditolak browser, abaikan */ });
      }
    });

    /* Perbarui label tombol layar penuh (juga saat pengguna menekan Esc) */
    document.addEventListener("fullscreenchange", function () {
      var fs = App.$("[data-fs]", root);
      if (fs) fs.textContent = t(document.fullscreenElement ? "exam_fs_exit" : "exam_fs");
    });
  }

  /* ======================= HASIL ======================= */

  function levelOf(pct) {
    var lv = CONFIG.levels;
    for (var i = 0; i < lv.length; i++) if (pct >= lv[i].min) return { idx: i, data: lv[i] };
    return { idx: lv.length - 1, data: lv[lv.length - 1] || { label: "", desc: "" } };
  }

  function renderResult() {
    var r = App.state.result;
    if (!r) {
      root.innerHTML =
        '<div class="panel">' +
        "<h2>" + t("no_result_title") + "</h2>" +
        "<p>" + t("no_result_text") + "</p>" +
        '<div class="btn-row">' +
        '<a class="btn btn-primary" href="assessment.html">' + t(App.state.test ? "resume_btn" : "start_btn") + "</a>" +
        '<a class="btn btn-secondary" href="learn.html">' + t("learn_first") + "</a></div></div>";
      return;
    }

    var prof = App.state.profile || {};
    var lv = levelOf(r.percent);
    var date = new Date(r.date);
    var dateText = isNaN(date) ? "" : date.toLocaleDateString(t("date_locale"), { day: "numeric", month: "long", year: "numeric" });
    var whoParts = [prof.name, prof.division, dateText].filter(Boolean).map(esc);

    /* Kategori, urut sesuai file data */
    var cats = Object.keys(CATS).filter(function (c) { return r.byCat[c]; });
    Object.keys(r.byCat).forEach(function (c) { if (cats.indexOf(c) === -1) cats.push(c); });
    var bars = cats.map(function (c) {
      var d = r.byCat[c];
      var pct = Math.round(d.correct / d.total * 100);
      return "<li><span>" + esc(catLabel(c)) + (pct < 60 ? '<span class="weak">' + t("weak") + "</span>" : "") + "</span>" +
        '<div class="bar" role="img" aria-label="' + esc(t("bar_label", { cat: catLabel(c), correct: d.correct, total: d.total })) + '"><span style="width:' + pct + '%"></span></div>' +
        '<span class="bar-val">' + d.correct + "/" + d.total + " (" + pct + "%)</span></li>";
    }).join("");

    /* Rekomendasi: maksimal 3 kategori dengan persentase terendah di bawah 100% */
    var weak = cats.map(function (c) { return { c: c, pct: r.byCat[c].correct / r.byCat[c].total }; })
      .filter(function (x) { return x.pct < 1; })
      .sort(function (a, b) { return a.pct - b.pct; })
      .slice(0, 3);
    var recs = weak.length
      ? weak.map(function (x) {
          var info = CATS[x.c] || {};
          return '<a href="learn.html#' + esc(info.anchor || "") + '"><strong>' + esc(catLabel(x.c)) + "</strong>" + esc(info.tip || "") + "</a>";
        }).join("")
      : "<p>" + t("all_perfect") + "</p>";

    /* Review jawaban salah */
    var wrong = r.ids.map(function (id, i) { return { id: id, n: i + 1, item: q(id) }; })
      .filter(function (x) { return x.item && r.answers[x.id] !== x.item.answer; });
    var review = wrong.length
      ? '<ol class="review">' + wrong.map(function (x) {
          var it = x.item;
          return '<li><p class="small muted" style="margin:0 0 4px">' + t("q_n", { n: x.n }) + " · " + levelLabel(it.level) + " · " + esc(catLabel(it.cat)) + "</p>" +
            "<p><strong>" + esc(it.prompt) + "</strong></p>" +
            (it.type === "email" ? mailBox(it.mail) : "") +
            '<div class="ans"><span class="yours">' + t("your_answer") + " " + esc(answerText(it, r.answers[x.id])) + "</span>" +
            '<span class="right">' + t("right_answer") + " " + esc(answerText(it, it.answer)) + "</span></div>" +
            '<p style="margin:0">' + esc(it.explanation) + "</p></li>";
        }).join("") + "</ol>"
      : "<p>" + t("no_wrong") + "</p>";

    root.innerHTML =
      '<section class="panel result-head" aria-label="' + t("summary_label") + '">' +
      '<div class="score" aria-label="' + t("score_label", { score: r.score, total: r.total }) + '">' + r.score + "<small>/" + r.total + "</small></div>" +
      "<div>" +
      (whoParts.length ? '<p class="who">' + whoParts.join(" · ") + "</p>" : "") +
      '<span class="level-badge" data-l="' + lv.idx + '">' + esc(lv.data.label) + "</span>" +
      "<p>" + esc(lv.data.desc) + "</p>" +
      '<p class="small muted" style="margin:0">' + t("pct_correct", { pct: r.percent }) + (r.timer ? " · " + t("time_spent", { time: fmtDuration(r.elapsed) }) : "") + "</p>" +
      "</div></section>" +

      '<div class="btn-row no-print result-section" style="margin-top:20px">' +
      '<button class="btn btn-primary" type="button" data-print>' + t("print") + "</button>" +
      '<a class="btn btn-secondary" href="assessment.html">' + t("retake") + "</a></div>" +

      '<section class="result-section" aria-labelledby="cat-title"><h2 id="cat-title">' + t("by_cat") + '</h2><ul class="bars">' + bars + "</ul></section>" +
      '<section class="result-section" aria-labelledby="rec-title"><h2 id="rec-title">' + t("recs") + '</h2><div class="recs">' + recs + "</div></section>" +
      '<section class="result-section" aria-labelledby="rev-title"><h2 id="rev-title">' + t("review", { n: wrong.length }) + "</h2>" + review + "</section>";

    App.$("[data-print]", root).addEventListener("click", function () { window.print(); });
    var rw = document.getElementById("reset-wrap");
    if (rw) rw.hidden = false;
  }

  /* ======================= INIT ======================= */
  document.addEventListener("DOMContentLoaded", function () {
    var testRoot = document.getElementById("test-root");
    var resultRoot = document.getElementById("result-root");
    root = testRoot || resultRoot;
    if (!root) return;

    if (!Array.isArray(BANK) || BANK.length === 0) {
      root.innerHTML = '<div class="notice notice-bad"><p>' + t("bank_error") + "</p></div>";
      return;
    }

    if (testRoot) {
      bindTest();
      renderIntro();
    } else {
      renderResult();
    }
  });
})();
