/* ==========================================================================
   simulation.js: simulasi phishing multi-kanal (wizard 4 tahap + hasil).
   Data dari data/sim(.id).js. State di App.state.sim:
     { v: 2, stage, phase: "brief" | "play", remaining,
       log: { itemId: { opened, clicked, reported } },
       ends: { stageId: "click" | "skip" | "timeout" }, done }
   Alur: intro → (brief → main) × 4 → hasil.
   Klik link/tombol/QR mana pun langsung menutup tahap, seperti di dunia nyata.
   ========================================================================== */
(function () {
  "use strict";

  var App = window.App;
  var t = App.t;
  var esc = App.esc;
  var SIM = window.GRINTEC_SIM;
  var CATS = window.GRINTEC_CATEGORIES || {};
  var STAGES = SIM && SIM.stages || [];

  var root, live;
  var view = null;   /* id pesan yang sedang dibuka di tahap aktif */
  var tick = null;

  function sim() { return App.state.sim; }
  function stage() { return STAGES[sim().stage]; }
  function logOf(id) {
    var l = sim().log;
    return l[id] || (l[id] = { opened: false, clicked: false, reported: false });
  }
  function itemById(id) {
    for (var i = 0; i < STAGES.length; i++) {
      var hit = STAGES[i].items.filter(function (x) { return x.id === id; })[0];
      if (hit) return hit;
    }
  }
  function userName() { return (App.state.profile && App.state.profile.name) || t("name_fallback"); }
  function fill(text) { return esc(String(text).replace(/\{nama\}/g, userName())); }
  function fmt(sec) { sec = Math.max(0, sec); return Math.floor(sec / 60) + ":" + ("0" + sec % 60).slice(-2); }
  function say(msg) { live.textContent = ""; setTimeout(function () { live.textContent = msg; }, 50); }
  function focusFirst(sel) { var el = App.$(sel, root) || App.$("#wiz-h", root); if (el) el.focus(); }

  function newState() {
    App.update(function (s) {
      s.sim = { v: 2, stage: 0, phase: "brief", remaining: STAGES[0].seconds, log: {}, ends: {}, done: false };
    });
  }

  /* ======================= TIMER ======================= */
  function stopTimer() { if (tick) { clearInterval(tick); tick = null; } }
  function startTimer() {
    stopTimer();
    tick = setInterval(function () {
      App.update(function (s) { s.sim.remaining -= 1; });
      var r = sim().remaining;
      var el = document.getElementById("sim-timer");
      if (el) { el.textContent = fmt(r); el.classList.toggle("is-low", r <= 10); }
      if (r === 10) say(t("s_ten_left"));
      if (r <= 0) endStage("timeout");
    }, 1000);
  }

  /* ======================= ALUR ======================= */
  function enterExam() { document.body.classList.add("exam-mode"); window.scrollTo(0, 0); }
  function exitExam() {
    document.body.classList.remove("exam-mode");
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
  }

  function endStage(reason) {
    stopTimer();
    var dlg = App.$("dialog[open]", root);
    if (dlg) dlg.close();
    App.update(function (s) {
      s.sim.ends[STAGES[s.sim.stage].id] = reason;
      s.sim.stage += 1;
      if (s.sim.stage >= STAGES.length) { s.sim.done = true; s.sim.stage = STAGES.length; }
      else { s.sim.phase = "brief"; s.sim.remaining = STAGES[s.sim.stage].seconds; }
    });
    view = null;
    if (sim().done) { exitExam(); renderResult(); window.scrollTo(0, 0); }
    else renderBrief(reason);
  }

  /* ======================= BAR & STEPPER ======================= */
  function bar(playing) {
    var logo = App.$(".brand img");
    var cur = sim().stage;
    var steps = STAGES.map(function (s, i) {
      var cls = i < cur ? "is-done" : (i === cur ? "is-current" : "");
      return '<li class="' + cls + '"' + (i === cur ? ' aria-current="step"' : "") + '><span class="wiz-n" aria-hidden="true">' + (i + 1) + "</span>" +
        t("ch_" + s.id) + (i < cur ? '<span class="visually-hidden"> (' + t("stage_done") + ")</span>" : "") + "</li>";
    }).join("") + '<li><span class="wiz-n" aria-hidden="true">' + (STAGES.length + 1) + "</span>" + t("s_result") + "</li>";
    var fs = document.fullscreenEnabled
      ? '<button class="btn btn-quiet" type="button" data-fs>' + t(document.fullscreenElement ? "exam_fs_exit" : "exam_fs") + "</button>" : "";
    var r = sim().remaining;
    return '<div class="exam-bar">' +
      '<div class="exam-id">' + (logo ? '<img src="' + esc(logo.getAttribute("src")) + '" alt="GRINTEC" width="800" height="229">' : "") +
      '<span class="exam-title">' + t("s_title") + "</span></div>" +
      '<ol class="wiz-steps" aria-label="' + t("s_steps") + '">' + steps + "</ol>" +
      '<div class="exam-tools">' +
      (playing ? '<span class="sim-timer' + (r <= 10 ? " is-low" : "") + '" role="timer" aria-label="' + t("s_time_left") + '"><span id="sim-timer">' + fmt(r) + "</span></span>" : "") +
      fs + '<button class="btn btn-quiet" type="button" data-leave>' + t("exam_leave") + "</button></div></div>";
  }

  /* ======================= INTRO ======================= */
  function renderIntro() {
    stopTimer();
    exitExam();
    var s = sim();
    var inProgress = s && !s.done && (s.stage > 0 || Object.keys(s.log).length);
    var total = STAGES.reduce(function (a, st) { return a + st.seconds; }, 0);
    root.innerHTML =
      '<div class="panel sim-intro">' +
      "<h2>" + t("s_intro_title") + "</h2>" +
      '<ol class="sim-intro-steps">' + STAGES.map(function (st) {
        return "<li><strong>" + t("ch_" + st.id) + "</strong> <span class=\"muted\">" + t("s_intro_" + st.id, { n: st.items.length, sec: st.seconds }) + "</span></li>";
      }).join("") + "</ol>" +
      "<ul>" +
      "<li>" + t("s_intro_1") + "</li>" +
      "<li>" + t("s_intro_2") + "</li>" +
      "<li>" + t("s_intro_3", { min: Math.ceil(total / 60) }) + "</li>" +
      "</ul>" +
      (inProgress ? '<p class="notice">' + t("s_resume", { n: s.stage + 1, ch: t("ch_" + STAGES[s.stage].id) }) + "</p>" : "") +
      '<div class="btn-row">' +
      (inProgress
        ? '<button class="btn btn-primary" type="button" data-resume>' + t("s_resume_btn") + "</button>" +
          '<button class="btn btn-quiet" type="button" data-new>' + t("s_new_btn") + "</button>"
        : '<button class="btn btn-primary" type="button" data-new>' + t("s_start") + "</button>") +
      "</div></div>";
  }

  /* ======================= BRIEF ======================= */
  function renderBrief(prev) {
    stopTimer();
    enterExam();
    App.update(function (s) { s.sim.phase = "brief"; });
    var st = stage();
    var n = sim().stage + 1;
    root.innerHTML = '<div class="exam">' + bar(false) +
      '<div class="wiz-brief"><div class="panel reveal">' +
      (prev ? '<p class="wiz-prev">' + t("s_end_" + prev) + "</p>" : "") +
      '<p class="wiz-kicker">' + t("s_stage_of", { n: n, total: STAGES.length }) + "</p>" +
      '<h1 id="wiz-h" tabindex="-1">' + t("s_brief_" + st.id) + "</h1>" +
      '<p class="notice"><strong>' + t("context") + "</strong> " + esc(st.context) + "</p>" +
      "<p>" + t("s_brief_rule", { sec: st.seconds }) + "</p>" +
      '<button class="btn btn-primary" type="button" data-play>' + t("s_brief_go", { ch: t("ch_" + st.id) }) + "</button>" +
      "</div></div></div>";
    focusFirst("#wiz-h");
  }

  /* ======================= MAIN (TAHAP AKTIF) ======================= */
  function renderPlay(focusSel) {
    enterExam();
    var st = stage();
    root.innerHTML = '<div class="exam">' + bar(true) +
      '<div class="wiz-task">' +
      '<div><h1 id="wiz-h" tabindex="-1">' + t("s_task_" + st.id) + "</h1>" +
      '<p class="muted">' + t("s_task_rule") + "</p></div>" +
      '<button class="btn btn-quiet" type="button" data-skip>' + t("s_skip") + "</button></div>" +
      '<div class="wiz-stage wiz-' + st.id + '">' + device(st) + "</div></div>";
    focusFirst(focusSel || "#wiz-h");
  }

  function device(st) {
    if (st.id === "email") return mailApp(st);
    if (st.id === "sms") return phone(st, smsApp(st), t("dev_sms"));
    if (st.id === "chat") return phone(st, chatApp(st), t("dev_chat"));
    return qrBoard(st);
  }

  function reportedChip() { return '<span class="chip chip-rep">' + t("s_reported") + "</span>"; }

  /* ---------- Email ---------- */
  function mailApp(st) {
    var unread = st.items.filter(function (x) { return !logOf(x.id).opened; }).length;
    var me = ((App.state.profile && App.state.profile.name) || "").charAt(0).toUpperCase();
    var pane;
    var open = view && itemById(view);

    if (!open) {
      pane = '<h2 class="visually-hidden">' + t("dev_inbox") + "</h2>" +
        '<ul class="mlist">' + st.items.map(function (m) {
          var lg = logOf(m.id);
          var snippet = m.body.join(" ").replace(/\{nama\}/g, userName());
          var inner = '<span class="mrow-from">' + esc(m.from.name) + "</span>" +
            '<span class="mrow-text"><strong>' + esc(m.subject) + "</strong> <span class=\"muted\">- " + esc(snippet) + "</span></span>" +
            '<span class="mrow-time">' + (lg.reported ? reportedChip() : esc(m.time)) + "</span>";
          return "<li>" + (lg.reported
            ? '<div class="mrow is-reported">' + inner + "</div>"
            : '<button type="button" class="mrow' + (lg.opened ? "" : " is-unread") + '" data-open="' + m.id + '">' +
              (lg.opened ? "" : '<span class="visually-hidden">' + t("s_unread") + " </span>") + inner + "</button>") + "</li>";
        }).join("") + "</ul>";
    } else {
      var m = open;
      pane = '<div class="mtools">' +
        '<button class="btn btn-quiet" type="button" data-back>' + t("s_back_inbox") + "</button>" +
        '<button class="btn btn-report" type="button" data-report="' + m.id + '">' + t("s_report_phish") + "</button></div>" +
        '<article class="mread" aria-labelledby="mread-subj">' +
        '<h2 id="mread-subj" tabindex="-1">' + esc(m.subject) + ' <span class="chip">' + t("dev_inbox") + "</span></h2>" +
        '<div class="mread-from"><span class="avatar" aria-hidden="true">' + esc(m.from.name.charAt(0)) + "</span>" +
        "<div><strong>" + esc(m.from.name) + '</strong> <span class="mono">&lt;' + esc(m.from.address) + "&gt;</span>" +
        '<div class="muted small">' + t("s_to_me") + "</div></div>" +
        '<span class="muted small mread-time">' + esc(m.time) + "</span></div>" +
        '<div class="mread-body">' + m.body.map(function (p) { return "<p>" + fill(p) + "</p>"; }).join("") +
        '<p><button type="button" class="sim-link' + (m.link.button ? " as-button" : "") + '" data-click="' + m.id + '" data-url="' + esc(m.link.url) + '">' + esc(m.link.label) + "</button></p>" +
        '<p class="muted small">' + esc(m.footer) + "</p></div></article>";
    }

    return '<div class="mailapp" role="region" aria-label="' + t("dev_mail") + '">' +
      '<div class="mailapp-top" aria-hidden="true"><span class="mailapp-name">' + t("dev_mail_name") + '</span>' +
      '<span class="mailapp-search">' + t("dev_search") + '</span><span class="mailapp-me">' + esc(me) + "</span></div>" +
      '<div class="mailapp-main">' +
      '<div class="mailapp-rail" aria-hidden="true"><span class="mailapp-compose">' + t("dev_compose") + "</span>" +
      '<span class="is-on">' + t("dev_inbox") + (unread ? " <b>" + unread + "</b>" : "") + "</span><span>" + t("dev_starred") + "</span><span>" + t("dev_sent") + "</span><span>" + t("dev_spam") + "</span></div>" +
      '<section class="mailapp-pane">' + pane + "</section></div>" +
      '<div class="statusbar" id="statusbar" aria-live="polite">' + t("sim_status_default") + "</div></div>";
  }

  /* ---------- Bingkai HP ---------- */
  function phone(st, app, label) {
    return '<div class="phone" role="region" aria-label="' + label + '">' +
      '<div class="phone-status" aria-hidden="true"><span>' + t("phone_time") + "</span><span>4G ▮▮▮</span></div>" + app + "</div>";
  }

  function threadHead(title, sub, id) {
    return '<div class="app-head">' +
      '<button class="app-back" type="button" data-back aria-label="' + t("s_back_list") + '">←</button>' +
      '<div class="app-head-who"><strong>' + esc(title) + "</strong>" + (sub ? '<span class="small">' + esc(sub) + "</span>" : "") + "</div>" +
      '<button class="btn btn-report btn-sm" type="button" data-report="' + id + '">' + t("s_report") + "</button></div>";
  }

  function listRows(st, title, mapper) {
    return '<div class="app-head"><strong class="app-head-title">' + title + "</strong></div>" +
      '<h2 class="visually-hidden">' + title + "</h2>" +
      '<ul class="app-list">' + st.items.map(function (x) {
        var lg = logOf(x.id), r = mapper(x);
        var inner = '<span class="avatar" aria-hidden="true">' + esc(r.initial) + "</span>" +
          '<span class="app-row-main"><strong>' + esc(r.title) + "</strong><span class=\"muted\">" + esc(r.snippet) + "</span></span>" +
          '<span class="app-row-time small">' + (lg.reported ? reportedChip() : esc(x.time)) + "</span>";
        return "<li>" + (lg.reported
          ? '<div class="app-row is-reported">' + inner + "</div>"
          : '<button type="button" class="app-row' + (lg.opened ? "" : " is-unread") + '" data-open="' + x.id + '">' +
            (lg.opened ? "" : '<span class="visually-hidden">' + t("s_unread") + " </span>") + inner + "</button>") + "</li>";
      }).join("") + "</ul>";
  }

  /* ---------- SMS ---------- */
  function smsApp(st) {
    var x = view && itemById(view);
    if (!x) {
      return '<div class="app app-sms">' + listRows(st, t("dev_messages"), function (s) {
        return { initial: /^\+/.test(s.from) ? "#" : s.from.charAt(0), title: s.from, snippet: s.text };
      }) + "</div>";
    }
    return '<div class="app app-sms">' + threadHead(x.from, /^\+/.test(x.from) ? t("s_unknown_no") : "", x.id) +
      '<div class="thread" aria-labelledby="thread-h"><h2 class="visually-hidden" id="thread-h" tabindex="-1">' + esc(x.from) + "</h2>" +
      '<p class="thread-day small">' + t("s_today") + " " + esc(x.time) + "</p>" +
      '<div class="bubble-in">' + esc(x.text) + ' <button type="button" class="sim-url" data-click="' + x.id + '">' + esc(x.link.url) + "</button></div>" +
      '</div><div class="app-compose" aria-hidden="true">' + t("dev_text_msg") + "</div></div>";
  }

  /* ---------- Chat ---------- */
  function chatApp(st) {
    var x = view && itemById(view);
    if (!x) {
      return '<div class="app app-chat">' + listRows(st, t("dev_chats"), function (c) {
        return { initial: c.name.replace("~", "").charAt(0), title: c.saved ? c.name : c.number, snippet: c.messages[c.messages.length - 1].replace(/\{nama\}/g, userName()) };
      }) + "</div>";
    }
    var host = x.link.url.replace(/^https?:\/\//, "").split("/")[0];
    var msgs = x.messages.slice();
    var last = x.phishing ? msgs.pop() : null;
    return '<div class="app app-chat">' + threadHead(x.saved ? x.name : x.number, x.saved ? t("s_online") : x.name, x.id) +
      '<div class="thread" aria-labelledby="thread-h"><h2 class="visually-hidden" id="thread-h" tabindex="-1">' + esc(x.saved ? x.name : x.number) + "</h2>" +
      (x.saved ? "" : '<p class="thread-warn small">' + t("s_not_contact") + "</p>") +
      msgs.map(function (m) { return '<div class="bubble-in">' + fill(m) + "</div>"; }).join("") +
      '<div class="bubble-in bubble-link">' +
      '<button type="button" class="link-card" data-click="' + x.id + '"><strong>' + esc(x.link.label) + '</strong><span class="small">' + esc(host) + "</span></button>" +
      '<button type="button" class="sim-url" data-click="' + x.id + '">' + esc(x.link.url) + "</button></div>" +
      (last ? '<div class="bubble-in">' + fill(last) + "</div>" : "") +
      '<p class="thread-day small">' + esc(x.time) + "</p>" +
      '</div><div class="app-compose" aria-hidden="true">' + t("dev_type_msg") + "</div></div>";
  }

  /* ---------- QR ---------- */
  /* QR dekoratif yang sengaja TIDAK bisa dipindai: pola acak tetap + tiga penanda sudut */
  function qrSvg(seed) {
    var n = 25, s = 0, d = "", i, x, y;
    for (i = 0; i < seed.length; i++) s = (Math.imul(s, 31) + seed.charCodeAt(i)) >>> 0;
    function rnd() { s = (Math.imul(s, 1103515245) + 12345) >>> 0; return s / 4294967296; }
    function inFinder(x, y) { return (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9); }
    for (y = 0; y < n; y++) for (x = 0; x < n; x++) if (!inFinder(x, y) && rnd() < 0.5) d += "M" + x + " " + y + "h1v1h-1z";
    function finder(x, y) { return "M" + x + " " + y + "h7v7h-7zM" + (x + 1) + " " + (y + 1) + "v5h5v-5zM" + (x + 2) + " " + (y + 2) + "h3v3h-3z"; }
    return '<svg viewBox="-2 -2 29 29" aria-hidden="true" focusable="false"><rect x="-2" y="-2" width="29" height="29" fill="#fff"/>' +
      '<path fill="#111" fill-rule="evenodd" d="' + d + finder(0, 0) + finder(n - 7, 0) + finder(0, n - 7) + '"/></svg>';
  }

  function qrBoard(st) {
    var scan = view && itemById(view);
    return '<div class="qr-board">' + st.items.map(function (q) {
      var lg = logOf(q.id);
      return '<figure class="qr-spot">' +
        '<div class="qr-sign' + (q.tampered ? " is-tampered" : "") + '">' +
        '<p class="qr-sign-title">' + esc(q.sign.title) + "</p>" +
        '<div class="qr-code">' + (q.tampered ? '<span class="qr-under">' + qrSvg(q.id + "-x") + "</span>" : "") +
        (lg.reported
          ? '<span class="qr-img">' + qrSvg(q.id) + "</span>"
          : '<button type="button" class="qr-img" data-scan="' + q.id + '" aria-label="' + t("s_scan_label", { title: q.sign.title }) + '">' + qrSvg(q.id) + "</button>") +
        "</div>" +
        '<p class="qr-sign-sub">' + esc(q.sign.sub) + "</p></div>" +
        "<figcaption>" + esc(q.place) + "</figcaption>" +
        (lg.reported ? reportedChip() : '<button class="btn btn-report btn-sm" type="button" data-report="' + q.id + '">' + t("s_report_qr") + "</button>") +
        "</figure>";
    }).join("") + "</div>" +
      '<dialog class="qr-scan" aria-labelledby="qr-scan-h">' +
      (scan
        ? '<p class="small muted">' + t("s_scan_cam") + "</p>" +
          '<h2 id="qr-scan-h">' + t("s_scan_found") + "</h2>" +
          '<p class="mono qr-url">' + esc(scan.url) + "</p>" +
          '<div class="btn-row"><button class="btn btn-primary" type="button" data-click="' + scan.id + '">' + t("s_scan_open") + "</button>" +
          '<button class="btn btn-quiet" type="button" data-scan-close>' + t("s_scan_cancel") + "</button></div>"
        : "") +
      "</dialog>";
  }

  /* ======================= HASIL ======================= */
  function outcome(item) {
    var lg = sim().log[item.id] || {};
    if (item.phishing) {
      if (lg.clicked) return ["bad", "o_clicked"];
      if (lg.reported) return ["ok", "o_reported"];
      if (lg.opened) return ["warn", "o_opened"];
      return ["neutral", "o_ignored"];
    }
    if (lg.clicked) return ["ok", "o_safe_clicked"];
    if (lg.reported) return ["warn", "o_safe_reported"];
    return ["neutral", "o_safe_left"];
  }

  function titleOf(stId, x) {
    if (stId === "email") return x.subject;
    if (stId === "sms") return x.from;
    if (stId === "chat") return x.saved ? x.name : x.number + " (" + x.name + ")";
    return x.sign.title + " · " + x.place;
  }

  function renderResult() {
    stopTimer();
    var all = [];
    STAGES.forEach(function (st) { st.items.forEach(function (x) { all.push({ st: st.id, x: x, lg: sim().log[x.id] || {} }); }); });
    var phish = all.filter(function (a) { return a.x.phishing; });
    var safe = all.filter(function (a) { return !a.x.phishing; });
    var clicked = phish.filter(function (a) { return a.lg.clicked; }).length;
    var reported = phish.filter(function (a) { return a.lg.reported; }).length;
    var opened = all.filter(function (a) { return a.lg.opened; }).length;
    var falseRep = safe.filter(function (a) { return a.lg.reported; }).length;
    var lvl = clicked > 0 ? 2 : (reported >= phish.length - 1 ? 0 : 1);
    var en = App.lang === "en";

    var review = STAGES.map(function (st) {
      return '<section class="sim-review"><h3>' + t("ch_" + st.id) + "</h3><ul>" + st.items.map(function (x) {
        var o = outcome(x);
        var body = x.phishing
          ? '<ul class="flag-list">' + x.flags.map(function (f) {
              var c = CATS[f.cat];
              return "<li>" + (c ? '<a href="learn.html#' + c.anchor + '">' + esc(c.label) + "</a>: " : "") + esc(f.note) + "</li>";
            }).join("") + "</ul>" +
            '<p class="small"><strong>' + t("s_if_clicked") + "</strong> " + esc(x.trap) + "</p>"
          : '<p class="small">' + esc(x.safeReason) + "</p>";
        return '<li class="sim-review-item">' +
          '<div class="sim-review-head"><span class="chip ' + (x.phishing ? "chip-phish" : "chip-real") + '">' + t(x.phishing ? "s_was_phish" : "s_was_real") + "</span>" +
          '<strong>' + fill(titleOf(st.id, x)) + "</strong>" +
          '<span class="outcome o-' + o[0] + '">' + t(o[1]) + "</span></div>" + body + "</li>";
      }).join("") + "</ul></section>";
    }).join("");

    root.innerHTML =
      '<div class="panel result-head">' +
      '<div class="score">' + clicked + "<small>/" + phish.length + "</small></div>" +
      '<div><span class="level-badge" data-l="' + lvl + '">' + t("s_lvl" + lvl) + "</span>" +
      '<p class="sim-headline">' + t("s_headline", { n: clicked, total: phish.length }) + "</p>" +
      '<p class="muted" style="margin:0">' + t("s_lvl" + lvl + "_desc") + "</p></div></div>" +

      '<section class="result-section" aria-labelledby="s-metrics"><h2 id="s-metrics">' + t("s_metrics") + "</h2>" +
      '<p class="muted">' + t("s_metrics_lead") + "</p>" +
      '<dl class="case-figures">' +
      "<div><dt>" + t("m_opened") + "</dt><dd>" + opened + "/" + all.length + "</dd></div>" +
      "<div><dt>" + t("m_clicked") + "</dt><dd>" + clicked + "/" + phish.length + "</dd></div>" +
      '<div class="case-key"><dt>' + t("m_reported") + "</dt><dd>" + reported + "/" + phish.length + "</dd></div>" +
      "<div><dt>" + t("m_false") + "</dt><dd>" + falseRep + "/" + safe.length + "</dd></div>" +
      "</dl>" +
      '<p class="small muted sim-case-line">' + t("s_case_line", { url: en ? "https://grintecs.com/en/works/phishing-simulation-casestudy/" : "https://grintecs.com/id/works/phishing-simulation-casestudy/" }) + "</p></section>" +

      '<section class="result-section" aria-labelledby="s-review"><h2 id="s-review">' + t("s_review") + "</h2>" + review + "</section>" +

      '<section class="phaas sim-offer" aria-labelledby="s-offer"><div>' +
      '<h2 id="s-offer">' + t("s_offer_title") + "</h2>" +
      "<p>" + t("s_offer_lead") + "</p>" +
      "<ul><li>" + t("s_offer_1") + "</li><li>" + t("s_offer_2") + "</li><li>" + t("s_offer_3") + "</li></ul>" +
      '<p style="margin-top:8px">' + t("s_offer_contact") + "</p></div>" +
      '<a class="btn btn-primary" href="' + (en ? "https://grintecs.com/en/contact/" : "https://grintecs.com/id/contact/") + '" rel="noopener">' + t("s_cta") + "</a></section>" +

      '<div class="btn-row result-section">' +
      '<a class="btn btn-secondary" href="assessment.html">' + t("go_test") + "</a>" +
      '<button class="btn btn-quiet" type="button" data-new>' + t("s_retake") + "</button></div>";
  }

  /* ======================= EVENT ======================= */
  function bind() {
    root.addEventListener("click", function (ev) {
      var el = ev.target.closest("button, [data-click]");
      if (!el || !root.contains(el)) return;
      var id;

      if (el.hasAttribute("data-new")) { newState(); renderBrief(); return; }
      if (el.hasAttribute("data-resume")) {
        if (sim().phase === "play") { renderPlay(); startTimer(); } else renderBrief();
        return;
      }
      if (el.hasAttribute("data-play")) {
        App.update(function (s) { s.sim.phase = "play"; });
        view = null;
        renderPlay();
        startTimer();
        say(t("s_started", { sec: sim().remaining }));
        return;
      }
      if (el.hasAttribute("data-leave")) { stopTimer(); view = null; renderIntro(); window.scrollTo(0, 0); return; }
      if (el.hasAttribute("data-skip")) { endStage("skip"); return; }
      if (el.hasAttribute("data-fs")) {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen().catch(function () { /* ditolak browser, abaikan */ });
        return;
      }

      if ((id = el.getAttribute("data-click"))) {
        App.update(function () { var l = logOf(id); l.opened = true; l.clicked = true; });
        endStage("click");
        return;
      }
      if ((id = el.getAttribute("data-open"))) {
        view = id;
        App.update(function () { logOf(id).opened = true; });
        renderPlay(stage().id === "email" ? "#mread-subj" : "#thread-h");
        return;
      }
      if (el.hasAttribute("data-back")) {
        var back = view;
        view = null;
        renderPlay('[data-open="' + back + '"]');
        return;
      }
      if ((id = el.getAttribute("data-report"))) {
        App.update(function () { logOf(id).reported = true; });
        view = null;
        renderPlay(stage().id === "qr" ? "#wiz-h" : "button.mrow, button.app-row");
        say(t("s_reported_msg"));
        return;
      }
      if ((id = el.getAttribute("data-scan"))) {
        view = id;
        App.update(function () { logOf(id).opened = true; });
        renderPlay();
        App.$("dialog.qr-scan", root).showModal();
        return;
      }
      if (el.hasAttribute("data-scan-close")) {
        var q = view;
        App.$("dialog.qr-scan", root).close();
        view = null;
        renderPlay('[data-scan="' + q + '"]');
      }
    });

    /* Esc pada dialog QR: kembalikan fokus ke kode QR */
    root.addEventListener("cancel", function (ev) {
      if (!ev.target.matches("dialog.qr-scan")) return;
      ev.preventDefault();
      var b = App.$("[data-scan-close]", root);
      if (b) b.click();
    }, true);

    /* Hover/fokus link email: tampilkan alamat asli di status bar */
    function hover(ev) {
      var link = ev.target.closest && ev.target.closest(".mailapp [data-url]");
      var bar = document.getElementById("statusbar");
      if (!bar) return;
      bar.textContent = link ? link.getAttribute("data-url") : t("sim_status_default");
      bar.classList.toggle("has-url", !!link);
    }
    root.addEventListener("mouseover", hover);
    root.addEventListener("focusin", hover);

    document.addEventListener("fullscreenchange", function () {
      var fs = App.$("[data-fs]", root);
      if (fs) fs.textContent = t(document.fullscreenElement ? "exam_fs_exit" : "exam_fs");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    root = App.$("#sim-root");
    live = App.$("#sim-live");
    if (!root) return;
    if (!STAGES.length) {
      root.innerHTML = '<div class="notice notice-bad"><p>' + t("sim_load_error") + "</p></div>";
      return;
    }
    /* State lama (inbox 12 email, tanpa v:2) dibuang */
    if (sim() && sim().v !== 2) App.update(function (s) { delete s.sim; });

    bind();
    if (sim() && sim().done) renderResult();
    else renderIntro();
  });
})();
