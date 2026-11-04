/* ==========================================================================
   simulation.js: kotak masuk simulasi "Spot the Phish".
   Data dari data/emails(.id).js. Jawaban disimpan di App.state.sim.answers.
   Alur per email: buka → Aman / Phishing → (jika Phishing) tandai bagian
   yang dicurigai, opsional → feedback.
   ========================================================================== */
(function () {
  "use strict";

  var App = window.App;
  var t = App.t;
  var esc = App.esc;
  var EMAILS = window.GRINTEC_EMAILS;
  var CATS = window.GRINTEC_CATEGORIES || {};
  var RECIPIENT = window.GRINTEC_RECIPIENT || "you@company";

  var sim, list, pane, progressEl, doneEl;
  var currentId = null;
  var marking = false;
  var marked = [];

  function answers() { return App.state.sim.answers; }
  function byId(id) { return EMAILS.filter(function (e) { return e.id === id; })[0]; }
  function catLabel(cat) { return CATS[cat] ? CATS[cat].label : cat; }
  function userName() { return (App.state.profile && App.state.profile.name) || t("name_fallback"); }

  /* Ganti {nama} dengan nama pengguna, lalu escape */
  function fill(text) {
    return esc(String(text).replace(/\{nama\}/g, userName()));
  }

  /* Semua bagian email yang bisa ditandai, berurutan sesuai tampilan */
  function partsOf(e) {
    var parts = [{ id: "subject", flag: e.subject.flag }, { id: "from", flag: e.from.flag }];
    e.body.forEach(function (b, i) { parts.push({ id: "b" + i, flag: b.flag }); });
    (e.attachments || []).forEach(function (a, i) { parts.push({ id: "a" + i, flag: a.flag }); });
    return parts;
  }

  function preview(e) {
    var txt = e.body.filter(function (b) { return b.text; }).map(function (b) { return b.text; }).join(" ");
    txt = txt.replace(/\{nama\}/g, userName()).replace(/\s+/g, " ");
    return txt.length > 90 ? txt.slice(0, 90) + "…" : txt;
  }

  /* ---------- Daftar inbox ---------- */
  function renderList() {
    list.innerHTML = EMAILS.map(function (e) {
      var a = answers()[e.id];
      var res = a ? '<span class="res ' + (a.correct ? "res-ok" : "res-bad") + '">' + t(a.correct ? "sim_correct" : "sim_wrong") + "</span>" : "";
      return '<li><button type="button" class="inbox-item' + (a ? "" : " unread") + '" data-open="' + esc(e.id) + '"' +
        (e.id === currentId ? ' aria-current="true"' : "") + ">" +
        '<span class="from">' + (a ? "" : '<span class="visually-hidden">' + t("sim_unanswered") + "</span>") + esc(e.from.name) + "</span>" +
        '<span class="date">' + esc(e.date.split(",")[1] || e.date) + "</span>" +
        '<span class="subj">' + esc(e.subject.text) + "</span>" +
        '<span class="prev">' + esc(preview(e)) + "</span>" + res +
        "</button></li>";
    }).join("");
  }

  function renderProgress() {
    var ids = Object.keys(answers());
    var correct = ids.filter(function (id) { return answers()[id].correct; }).length;
    progressEl.textContent = t("sim_progress", { done: ids.length, total: EMAILS.length, correct: correct });

    if (ids.length >= EMAILS.length) {
      doneEl.hidden = false;
      doneEl.innerHTML =
        '<div class="next-step">' +
        "<div><h2>" + t("sim_done_title") + "</h2>" +
        '<p class="muted" style="margin:0">' + t("sim_done_text", { correct: correct, total: EMAILS.length }) + "</p></div>" +
        '<a class="btn btn-primary" href="assessment.html">' + t("go_test") + "</a></div>";
    } else {
      doneEl.hidden = true;
    }
  }

  /* ---------- Isi email ---------- */
  function openEmail(id) {
    currentId = id;
    marking = false;
    marked = [];
    sim.setAttribute("data-view", "mail");
    renderList();
    renderMail();
    var h = document.getElementById("mail-subject");
    if (h) h.focus();
  }

  function backToList() {
    sim.setAttribute("data-view", "list");
    var btn = App.$('[data-open="' + currentId + '"]', list);
    if (btn) btn.focus();
  }

  function renderMail() {
    var e = byId(currentId);

    var body = e.body.map(function (b, i) {
      if (b.link) {
        return '<p><button type="button" class="sim-link' + (b.button ? " as-button" : "") + '" data-part="b' + i + '" data-url="' + esc(b.url) + '">' + fill(b.link) + "</button></p>";
      }
      return '<p data-part="b' + i + '">' + fill(b.text) + "</p>";
    }).join("");

    var atts = (e.attachments || []).map(function (a, i) {
      return '<li><button type="button" class="att" data-part="a' + i + '" data-file="' + esc(a.name) + '">' + t("attachment") + " <strong>" + esc(a.name) + "</strong> (" + esc(a.size) + ")</button></li>";
    }).join("");

    pane.innerHTML =
      '<button class="btn btn-quiet mail-back" type="button" data-back>' + t("back_inbox") + "</button>" +
      (e.context ? '<p class="notice mail-context"><strong>' + t("context") + "</strong> " + esc(e.context) + "</p>" : "") +
      '<article id="mail" aria-labelledby="mail-subject">' +
      '<h2 class="mail-subject" id="mail-subject" tabindex="-1" data-part="subject">' + esc(e.subject.text) + "</h2>" +
      '<div class="mail-from-row">' +
      '<div class="mail-from" data-part="from"><span class="avatar" aria-hidden="true">' + esc(e.from.name.charAt(0).toUpperCase()) + "</span><strong>" + esc(e.from.name) + "</strong></div>" +
      '<span class="mail-date">' + esc(e.date) + "</span></div>" +
      '<button class="link-btn" type="button" data-details aria-expanded="false" aria-controls="mail-details">' + t("details_show") + "</button>" +
      '<dl class="mail-details" id="mail-details" hidden>' +
      "<dt>" + t("h_from") + "</dt><dd>" + esc(e.from.name) + " &lt;" + esc(e.from.address) + "&gt;</dd>" +
      "<dt>" + t("h_reply") + "</dt><dd>" + esc(e.replyTo || e.from.address) + "</dd>" +
      (e.returnPath ? "<dt>" + t("h_return") + "</dt><dd>" + esc(e.returnPath) + "</dd>" : "") +
      "<dt>" + t("h_to") + "</dt><dd>" + esc(RECIPIENT) + "</dd>" +
      "<dt>" + t("h_date") + "</dt><dd>" + esc(e.date) + "</dd></dl>" +
      '<div class="mail-body">' + body + "</div>" +
      (atts ? '<ul class="mail-atts">' + atts + "</ul>" : "") +
      "</article>" +
      '<div class="statusbar" id="statusbar" aria-live="polite">' + t("sim_status_default") + "</div>" +
      '<div class="mail-actions" id="mail-actions"></div>';

    renderActions();
  }

  function setStatus(text, isUrl) {
    var bar = document.getElementById("statusbar");
    if (!bar) return;
    bar.textContent = text;
    bar.classList.toggle("has-url", !!isUrl);
  }

  /* ---------- Jawaban & mode tandai ---------- */
  function setMarking(on) {
    marking = on;
    pane.classList.toggle("is-marking", on);
    App.$$("#mail [data-part]", pane).forEach(function (el) {
      var isButton = el.tagName === "BUTTON";
      if (on) {
        if (!isButton) { el.setAttribute("role", "button"); el.setAttribute("tabindex", "0"); }
        el.setAttribute("aria-pressed", marked.indexOf(el.getAttribute("data-part")) > -1 ? "true" : "false");
      } else {
        el.removeAttribute("aria-pressed");
        if (!isButton) {
          el.removeAttribute("role");
          if (el.id === "mail-subject") el.setAttribute("tabindex", "-1");
          else el.removeAttribute("tabindex");
        }
      }
    });
  }

  function toggleMark(el) {
    var id = el.getAttribute("data-part");
    var i = marked.indexOf(id);
    if (i > -1) marked.splice(i, 1); else marked.push(id);
    el.setAttribute("aria-pressed", i > -1 ? "false" : "true");
    var c = document.getElementById("mark-count");
    if (c) c.textContent = t("mark_count", { n: marked.length });
  }

  function renderActions() {
    var box = document.getElementById("mail-actions");
    var e = byId(currentId);
    var a = answers()[e.id];

    if (a) { renderFeedback(box, e, a); return; }

    if (marking) {
      box.innerHTML =
        '<div class="notice mark-hint"><p>' + t("mark_hint") + "</p></div>" +
        '<p id="mark-count" role="status">' + t("mark_count", { n: marked.length }) + "</p>" +
        '<div class="btn-row"><button class="btn btn-primary" type="button" data-mark-done>' + t("mark_done") + "</button>" +
        '<button class="btn btn-quiet" type="button" data-mark-cancel>' + t("mark_cancel") + "</button></div>";
      setMarking(true);
      return;
    }

    setMarking(false);
    box.innerHTML =
      "<h3>" + t("ask_verdict") + "</h3>" +
      '<div class="choice">' +
      '<button class="btn btn-safe" type="button" data-choice="safe">' + t("safe") + "</button>" +
      '<button class="btn btn-phish" type="button" data-choice="phish">' + t("phish") + "</button></div>";
  }

  function submit(choice) {
    var e = byId(currentId);
    var correct = (choice === "phish") === !!e.phishing;
    var savedMarks = choice === "phish" ? marked.slice() : [];
    App.update(function (s) { s.sim.answers[e.id] = { choice: choice, correct: correct, marked: savedMarks }; });
    setMarking(false);
    renderList();
    renderProgress();
    renderActions();
    var fb = document.getElementById("fb-title");
    if (fb) fb.focus();
  }

  function renderFeedback(box, e, a) {
    setMarking(false);
    var flags = partsOf(e).filter(function (p) { return p.flag; });
    var key = e.phishing ? (a.correct ? "fb_phish_ok" : "fb_phish_bad") : (a.correct ? "fb_safe_ok" : "fb_safe_bad");

    var html = '<div class="feedback notice reveal ' + (a.correct ? "notice-ok" : "notice-bad") + '">' +
      '<h3 id="fb-title" tabindex="-1">' + t(key) + "</h3>";

    if (e.phishing) {
      var showHits = a.marked && a.marked.length > 0;
      if (showHits) {
        var hits = flags.filter(function (f) { return a.marked.indexOf(f.id) > -1; }).length;
        html += "<p>" + t("fb_hits", { hits: hits, total: flags.length }) + "</p>";
      }
      html += "<p>" + t("fb_flags") + "</p><ol>";
      flags.forEach(function (f) {
        html += '<li><span class="cat">' + esc(catLabel(f.flag.cat)) + ":</span> " + esc(f.flag.note);
        if (showHits) {
          html += a.marked.indexOf(f.id) > -1
            ? ' <span class="hit res-ok">' + t("fb_marked") + "</span>"
            : ' <span class="hit res-bad">' + t("fb_missed") + "</span>";
        }
        html += "</li>";
      });
      html += "</ol>";
    } else {
      html += "<p>" + esc(e.safeReason) + "</p>";
    }
    html += "<p><strong>" + t("fb_lesson") + "</strong> " + esc(e.lesson) + "</p></div>";

    var next = EMAILS.filter(function (x) { return !answers()[x.id]; })[0];
    html += '<div class="btn-row" style="margin-top:16px">' +
      (next ? '<button class="btn btn-primary" type="button" data-open="' + esc(next.id) + '">' + t("next_email") + "</button>"
            : '<a class="btn btn-primary" href="assessment.html">' + t("go_test") + "</a>") +
      '<button class="btn btn-quiet" type="button" data-back>' + t("back_inbox_long") + "</button></div>";
    box.innerHTML = html;

    /* Beri nomor pada bagian email yang mengandung red flag */
    if (e.phishing) {
      flags.forEach(function (f, i) {
        var el = App.$('#mail [data-part="' + f.id + '"]', pane);
        if (!el || el.querySelector(".flag-num")) return;
        el.classList.add("flag-hit");
        el.insertAdjacentHTML("afterbegin", '<span class="flag-num" aria-label="' + t("flag_n", { n: i + 1 }) + '">' + (i + 1) + "</span>");
      });
    }
  }

  /* ---------- Event (delegasi) ---------- */
  function bind() {
    list.addEventListener("click", function (ev) {
      var btn = ev.target.closest("[data-open]");
      if (btn) openEmail(btn.getAttribute("data-open"));
    });

    pane.addEventListener("click", function (ev) {
      var el = ev.target;

      if (marking) {
        var part = el.closest("#mail [data-part]");
        if (part) { ev.preventDefault(); toggleMark(part); return; }
      }

      var link = el.closest(".sim-link");
      if (link) { setStatus(link.getAttribute("data-url") + "  " + t("link_not_opened"), true); return; }

      var att = el.closest(".att");
      if (att) { setStatus(t("att_not_opened", { name: att.getAttribute("data-file") }), true); return; }

      var det = el.closest("[data-details]");
      if (det) {
        var dl = document.getElementById("mail-details");
        var open = dl.hidden;
        dl.hidden = !open;
        det.setAttribute("aria-expanded", String(open));
        det.textContent = t(open ? "details_hide" : "details_show");
        return;
      }

      if (el.closest("[data-back]")) { backToList(); return; }

      var ch = el.closest("[data-choice]");
      if (ch) {
        if (ch.getAttribute("data-choice") === "safe") {
          submit("safe");
        } else {
          marking = true;
          renderActions();
          var hint = App.$(".mark-hint", pane);
          if (hint) hint.scrollIntoView({ block: "nearest" });
        }
        return;
      }
      if (el.closest("[data-mark-done]")) { submit("phish"); return; }
      if (el.closest("[data-mark-cancel]")) { marking = false; marked = []; renderActions(); return; }

      var nx = el.closest("[data-open]");
      if (nx) openEmail(nx.getAttribute("data-open"));
    });

    /* Keyboard untuk bagian teks yang menjadi tombol di mode tandai */
    pane.addEventListener("keydown", function (ev) {
      if (!marking) return;
      var part = ev.target.closest && ev.target.closest('#mail [data-part][role="button"]');
      if (part && (ev.key === "Enter" || ev.key === " ")) { ev.preventDefault(); toggleMark(part); }
    });

    /* Hover/fokus pada link: tampilkan URL asli seperti status bar browser */
    function hover(ev) {
      var link = ev.target.closest && ev.target.closest(".sim-link");
      if (link && !marking) setStatus(link.getAttribute("data-url"), true);
    }
    pane.addEventListener("mouseover", hover);
    pane.addEventListener("focusin", hover);
    pane.addEventListener("mouseout", function (ev) {
      if (ev.target.closest && ev.target.closest(".sim-link")) setStatus(t("sim_status_default"), false);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    sim = App.$("#sim");
    list = App.$("#inbox-list");
    pane = App.$("#mailpane");
    progressEl = App.$("#sim-progress");
    doneEl = App.$("#sim-done");
    if (!sim) return;

    if (!Array.isArray(EMAILS) || EMAILS.length === 0) {
      list.innerHTML = '<li class="state-msg" style="padding:16px">' + t("sim_no_email") + "</li>";
      pane.innerHTML = '<div class="notice notice-bad"><p>' + t("sim_load_error") + "</p></div>";
      sim.setAttribute("data-view", "mail");
      return;
    }

    App.update(function (s) {
      s.sim = s.sim || {};
      s.sim.answers = s.sim.answers || {};
      s.sim.total = EMAILS.length;
    });

    bind();
    renderList();
    renderProgress();
  });
})();
