/* ==========================================================================
   Pre-assessment question bank + red flag categories + test settings (ENGLISH).
   The Indonesian version is data/questions.id.js. Keep the same ids, answers,
   levels, and categories in both files so progress works across languages.
   The GRINTEC team can edit this file without touching any logic. See README.

   All brands, people, and domains here are FICTIONAL.
   ========================================================================== */

/* Red flag categories. `anchor` = card id in learn.html, used by recommendations. */
window.GRINTEC_CATEGORIES = {
  domain:   { label: "Fake sender domain",       anchor: "tanda-domain",   tip: "Read the part after @ letter by letter and compare it with the address you normally receive." },
  urgensi:  { label: "Urgency and threats",      anchor: "tanda-urgensi",  tip: "When an email makes you panic or curious, that is a signal to pause, not to act fast." },
  link:     { label: "Mismatched links",         anchor: "tanda-link",     tip: "Hover over or long-press a link to see its real address before you click." },
  lampiran: { label: "Dangerous attachments",    anchor: "tanda-lampiran", tip: "Do not open attachments you did not ask for, especially .exe, .zip, .html, or Office files that ask you to Enable Content." },
  data:     { label: "Requests for sensitive data", anchor: "tanda-data",  tip: "Passwords, PINs, and OTP codes are never requested by email, chat, or phone, not even by the IT team." },
  salam:    { label: "Generic greetings",        anchor: "tanda-salam",    tip: "Services you use usually greet you by name. A generic greeting is a reason to look more closely." },
  bahasa:   { label: "Language mistakes",        anchor: "tanda-bahasa",   tip: "Typos, mixed languages, and awkward sentences rarely get through in official communication." },
  transfer: { label: "Money transfer requests",  anchor: "tanda-transfer", tip: "Confirm every request to transfer money or change bank details through a number you already have." },
  asli:     { label: "Recognising real emails",  anchor: "email-aman",     tip: "Not every email is dangerous. Check the domain, the context, and where links go before you decide." }
};

/* Test settings */
window.GRINTEC_CONFIG = {
  /* Questions drawn at random per difficulty level (15 in total).
     Make sure the bank has enough questions at every level.
     The level keys (mudah = easy, sedang = medium, sulit = hard) stay the same in both languages. */
  perLevel: { mudah: 5, sedang: 5, sulit: 5 },

  /* Result levels, checked from the top. `min` = minimum percentage. */
  levels: [
    { min: 85, label: "Highly Alert",     desc: "You consistently spot the signs of phishing. Keep checking before you click, and help colleagues who are still unsure." },
    { min: 60, label: "Fairly Alert",     desc: "You already recognise many signs, but there are still gaps a scammer could use. Focus on the categories with the lowest scores below." },
    { min: 0,  label: "Vulnerable",       desc: "Some traps still got through. That is fine, it is exactly what this test is for. Go through the signs again, then try the test once more." }
  ]
};

/* --------------------------------------------------------------------------
   Question bank.
   type:  "email"    → choose Safe / Phishing. answer: "safe" | "phish"
          "scenario" → multiple choice. answer: option id
          "url"      → pick the requested URL. answer: option id
   level: "mudah" (easy) | "sedang" (medium) | "sulit" (hard)
   cat:   one of the keys in GRINTEC_CATEGORIES
   Multiple-choice options are shuffled automatically when a test is built.
   -------------------------------------------------------------------------- */
window.GRINTEC_QUESTIONS = [
  /* ---------- EASY ---------- */
  {
    id: "q01", type: "email", level: "mudah", cat: "urgensi",
    prompt: "This email lands in your work inbox. Safe or phishing?",
    mail: { fromName: "System Admin", fromAddress: "admin@sistem-verifikasi.net", subject: "YOUR EMAIL ACCOUNT WILL BE DELETED IN 1 HOUR", snippet: "Click the link below to cancel the deletion. Otherwise all your emails will be lost permanently." },
    answer: "phish",
    explanation: "The one-hour deletion threat is designed to make you panic and click right away. The sender is not your company domain either."
  },
  {
    id: "q02", type: "scenario", level: "mudah", cat: "data",
    prompt: "Someone calls, says they are from your company's IT team, and asks for the OTP code that just arrived on your phone so they can \"fix\" your account. What do you do?",
    options: [
      { id: "a", text: "Give them the code, since they are from IT." },
      { id: "b", text: "Refuse, hang up, and report it to the IT team through an official contact." },
      { id: "c", text: "Give them only half of the code." },
      { id: "d", text: "Ask them to send an email first, then give them the code." }
    ],
    answer: "b",
    explanation: "An OTP code is for you only. The real IT team never asks for it. Anyone asking for your OTP is trying to get into your account."
  },
  {
    id: "q03", type: "url", level: "mudah", cat: "domain",
    prompt: "Bank Nusantara Raya's official website is nusantararaya.co.id. Which address is FAKE?",
    options: [
      { id: "a", text: "https://www.nusantararaya.co.id/kartu" },
      { id: "b", text: "https://ib.nusantararaya.co.id" },
      { id: "c", text: "https://nusantararaya-co-id.login-aman.com" },
      { id: "d", text: "https://nusantararaya.co.id/promo" }
    ],
    answer: "c",
    explanation: "The real domain here is login-aman.com. \"nusantararaya-co-id\" is just decoration at the front to look convincing."
  },
  {
    id: "q04", type: "email", level: "mudah", cat: "salam",
    prompt: "Safe or phishing?",
    mail: { fromName: "Prize Committee", fromAddress: "undian@hadiah-nusantara.com", subject: "Congratulations! You won a car", snippet: "Dear Winner, to claim your prize, transfer the ownership fee of Rp2,500,000 to the committee's account." },
    answer: "phish",
    explanation: "The scammer does not know your name, so they use a generic greeting like \"Dear Winner\". A real prize draw never asks you to pay to receive a prize."
  },
  {
    id: "q05", type: "scenario", level: "mudah", cat: "lampiran",
    prompt: "You receive an email from an unknown address titled \"Office event photos\" with an attachment called Foto_Acara.zip. You don't remember any event. What do you do?",
    options: [
      { id: "a", text: "Open it to see what is inside." },
      { id: "b", text: "Forward it to a colleague so they can open it." },
      { id: "c", text: "Leave it unopened and report it to the IT team." },
      { id: "d", text: "Reply and ask what is in it." }
    ],
    answer: "c",
    explanation: ".zip files from unknown senders often contain malware. Forwarding spreads the risk, and replying tells the scammer your address is active."
  },
  {
    id: "q06", type: "email", level: "mudah", cat: "asli",
    prompt: "Safe or phishing?",
    mail: { fromName: "HR Team", fromAddress: "hr@contohsejahtera.co.id", subject: "Reminder: annual attendance form", snippet: "Please fill it in through the HR portal as usual before 30 November. No need to reply to this email." },
    answer: "safe",
    explanation: "The sender uses the correct company domain, asks for no data, has no suspicious link, and creates no pressure. It is a normal reminder."
  },
  {
    id: "q07", type: "scenario", level: "mudah", cat: "link",
    prompt: "An email asks you to click a \"View Invoice\" button. When you hover over it, the address shown is http://tagihan-cek.top/inv. What is the best next step?",
    options: [
      { id: "a", text: "Click it, it is only an invoice." },
      { id: "b", text: "Don't click. Open the billing company's official website by typing the address yourself." },
      { id: "c", text: "Click it, but don't fill anything in." },
      { id: "d", text: "Forward the email to a colleague so they can check too." }
    ],
    answer: "b",
    explanation: "The address shown is not the billing company's website. Opening the official site yourself is the safe way to check an invoice."
  },
  {
    id: "q08", type: "url", level: "mudah", cat: "link",
    prompt: "KirimCepat Express's official website is kirimcepat.co.id. Which address REALLY belongs to KirimCepat?",
    options: [
      { id: "a", text: "http://kirimcepat.co.id.lacak-paket.com" },
      { id: "b", text: "https://lacak.kirimcepat.co.id" },
      { id: "c", text: "https://kirimcepat-co-id.info" },
      { id: "d", text: "https://kirimcepat.co.id-resi.net" }
    ],
    answer: "b",
    explanation: "\"lacak.\" at the front is only a subdomain, and the domain is still kirimcepat.co.id. The others end in lacak-paket.com, kirimcepat-co-id.info, and co.id-resi.net."
  },
  {
    id: "q09", type: "email", level: "mudah", cat: "bahasa",
    prompt: "Safe or phishing?",
    mail: { fromName: "Bank Nusantara Raya", fromAddress: "bank.nusantararaya@notif-nasabah.com", subject: "Important Notice!!!", snippet: "dear costumer, you're ATM card has been deactivate because our sistem detect suspicious activty. please click the link bellow." },
    answer: "phish",
    explanation: "Lots of typos (\"costumer\", \"you're card\", \"sistem\", \"bellow\"), lowercase sentence starts, and too many exclamation marks. The domain does not belong to the bank either."
  },

  /* ---------- MEDIUM ---------- */
  {
    id: "q10", type: "email", level: "sedang", cat: "domain",
    prompt: "Safe or phishing?",
    mail: { fromName: "KirimCepat Express", fromAddress: "notifikasi@kirimcepat.co.id.resi-info.com", subject: "Tracking KC-7781 is waiting for address confirmation", snippet: "Confirm your address so the courier can deliver today." },
    answer: "phish",
    explanation: "Read the domain from the right: this address belongs to resi-info.com, not kirimcepat.co.id. The scammer put the real name at the front on purpose."
  },
  {
    id: "q11", type: "scenario", level: "sedang", cat: "transfer",
    prompt: "Your manager sends a WhatsApp from a new number: \"This is my new number. Please transfer Rp15 million to this account as a deposit for the event, I'll pay you back. I'm in a meeting, don't call.\" What do you do?",
    options: [
      { id: "a", text: "Transfer it, the message is from your manager." },
      { id: "b", text: "Reply and ask for a photo of their ID card as proof." },
      { id: "c", text: "Call your manager on the old number you have saved, or ask in person, and follow the finance procedure." },
      { id: "d", text: "Transfer half of it first." }
    ],
    answer: "c",
    explanation: "A new number, a money request, pressure, and \"don't call\" are the pattern of a scam that impersonates a manager. Always verify through a contact you already know."
  },
  {
    id: "q12", type: "url", level: "sedang", cat: "domain",
    prompt: "Your company email uses the AkunKerja 365 service at akunkerja365.com. Which address is FAKE?",
    options: [
      { id: "a", text: "https://akunkerja365.com/masuk" },
      { id: "b", text: "https://login.akunkerja365.com" },
      { id: "c", text: "https://akunkerja356.com/masuk" },
      { id: "d", text: "https://akunkerja365.com/bantuan" }
    ],
    answer: "c",
    explanation: "365 was changed to 356. This trick is called typosquatting: the address is made to look similar so our eyes don't notice."
  },
  {
    id: "q13", type: "email", level: "sedang", cat: "asli",
    prompt: "Yesterday you really did shop at TokoLaris. Then this email arrives. Safe or phishing?",
    mail: { fromName: "TokoLaris", fromAddress: "pesanan@tokolaris.co.id", subject: "Payment for order #TL-1103-2291 received", snippet: "Thank you. Your order ships within 1 to 2 working days. See the details in the TokoLaris app." },
    answer: "safe",
    explanation: "It matches a purchase you actually made, the domain is right, it asks for no data or repeat payment, and it points you to the official app."
  },
  {
    id: "q14", type: "scenario", level: "sedang", cat: "lampiran",
    prompt: "An email from a regular supplier has an attachment called Invoice_Nov.pdf.exe. What do you do?",
    options: [
      { id: "a", text: "Open it, it is from a regular supplier." },
      { id: "b", text: "Leave it unopened, call the supplier on the number you have saved, and report it to the IT team." },
      { id: "c", text: "Rename the file to .pdf and then open it." },
      { id: "d", text: "Forward it to the finance team." }
    ],
    answer: "b",
    explanation: "The .exe ending means the file is a program, not a PDF. The supplier's email account may have been hacked, so confirm through another channel."
  },
  {
    id: "q15", type: "email", level: "sedang", cat: "bahasa",
    prompt: "Safe or phishing?",
    mail: { fromName: "Customer Service", fromAddress: "cs@layanan-nusantararaya.com", subject: "Important Notification For Your Account", snippet: "Dear valued costumer, we have detected an unauthorize login. kindly verify you account immediately to avoid it get block." },
    answer: "phish",
    explanation: "\"costumer\", \"unauthorize\", \"you account\", \"get block\", and a lowercase sentence start are signs of writing that never went through an official review."
  },
  {
    id: "q16", type: "scenario", level: "sedang", cat: "urgensi",
    prompt: "An email from the \"Security Team\" says your account was hacked and you must click a link within 10 minutes. Why is this deadline suspicious?",
    options: [
      { id: "a", text: "It isn't. Security issues really must be handled fast." },
      { id: "b", text: "The time pressure is designed to make you panic so you don't stop to check." },
      { id: "c", text: "Because security emails are always in English." },
      { id: "d", text: "Because 10 minutes is too long." }
    ],
    answer: "b",
    explanation: "Scammers use panic to stop you thinking. If you are unsure, contact the IT team through an official channel, not through the link in the email."
  },
  {
    id: "q17", type: "email", level: "sedang", cat: "salam",
    prompt: "Safe or phishing?",
    mail: { fromName: "Payroll", fromAddress: "payroll-hr@contohsejahtera-mail.com", subject: "Employee salary adjustment", snippet: "Dear Employee, please confirm your bank account details for this month's salary adjustment using the attached form." },
    answer: "phish",
    explanation: "Your company's HR knows your name and would not write \"Dear Employee\". The domain is not contohsejahtera.co.id either, and bank details are requested through an attached form."
  },

  /* ---------- HARD ---------- */
  {
    id: "q18", type: "email", level: "sulit", cat: "domain",
    prompt: "Safe or phishing? Look at the address carefully.",
    mail: { fromName: "IT Team", fromAddress: "it@contohsejahtera.co.ld", subject: "Mandatory office VPN update", snippet: "Install the VPN update from the link below before Monday so remote access keeps working." },
    answer: "phish",
    explanation: "It ends in .co.ld (letter L), not .co.id (letter I). One letter is enough to make a completely different domain."
  },
  {
    id: "q19", type: "email", level: "sulit", cat: "asli",
    prompt: "You just tried to log in to your work email and asked for a verification code. Then this email arrives. Safe or phishing?",
    mail: { fromName: "AkunKerja 365", fromAddress: "no-reply@akunkerja365.com", subject: "Your verification code: 482913", snippet: "Enter this code to finish signing in. Never share this code with anyone, including the IT team." },
    answer: "safe",
    explanation: "This email was triggered by your own action, it comes from the right domain, and it even warns you not to share the code. There is no link and no request for data."
  },
  {
    id: "q20", type: "scenario", level: "sulit", cat: "transfer",
    prompt: "A regular supplier emails from their usual address: \"Starting this month our account has moved to another bank. Please send the next payment to the new account attached.\" What do you do?",
    options: [
      { id: "a", text: "Pay to the new account, the email address is the usual one." },
      { id: "b", text: "Call the supplier contact already on file (not a number in the email) and follow the bank-detail change procedure." },
      { id: "c", text: "Reply to the email to ask for confirmation." },
      { id: "d", text: "Keep paying the old account without telling anyone." }
    ],
    answer: "b",
    explanation: "A supplier's real email account can be hacked. Replying means asking the scammer. Bank detail changes must be confirmed through another channel."
  },
  {
    id: "q21", type: "url", level: "sulit", cat: "link",
    prompt: "A link in an email reads www.tokolaris.co.id/promo. When you hover over it, which real address would be SAFE?",
    options: [
      { id: "a", text: "https://tokolaris.co.id.promo-spesial.com/" },
      { id: "b", text: "https://www.tokolaris.co.id/promo" },
      { id: "c", text: "https://www.tokolaris.co/promo" },
      { id: "d", text: "https://tokolaris-co-id.promo.id" }
    ],
    answer: "b",
    explanation: "Only this option has the domain tokolaris.co.id. Watch out for .co (without .id) and addresses that put the shop name in front of another domain."
  },
  {
    id: "q22", type: "email", level: "sulit", cat: "lampiran",
    prompt: "You never asked for this file. Safe or phishing?",
    mail: { fromName: "Dimas (Finance)", fromAddress: "dimas.keuangan@contohsejahtera.co.id", subject: "Re: quarterly report", snippet: "Here's the file you asked for. Click Enable Content so the tables show up.", attachment: "Laporan_Q3.xlsm" },
    answer: "phish",
    explanation: "The address is real, but a colleague's account can be hacked. An .xlsm file that asks you to Enable Content can run a program. Confirm with your colleague by chat or phone before opening it."
  },
  {
    id: "q23", type: "scenario", level: "sulit", cat: "link",
    prompt: "A poster in the lift says \"Fill in the employee satisfaction survey, get a voucher\" with a QR code. When you scan it, the address shown is not your company's domain. What do you do?",
    options: [
      { id: "a", text: "Carry on, the poster is in the office building." },
      { id: "b", text: "Stop, and report the poster to the IT team or building security." },
      { id: "c", text: "Fill in the survey, but without your real name." },
      { id: "d", text: "Take a photo of the poster and share it in the office group chat." }
    ],
    answer: "b",
    explanation: "A QR code is a link you cannot see. Anyone can put up a poster. A destination that is not your company domain is a warning sign."
  },
  {
    id: "q24", type: "url", level: "sulit", cat: "domain",
    prompt: "Which address really belongs to contohsejahtera.co.id?",
    options: [
      { id: "a", text: "https://contohsejahtera.co.id.portal-karyawan.com" },
      { id: "b", text: "https://contohsejahtera.co.id@portal-login.net" },
      { id: "c", text: "https://hr.portal.contohsejahtera.co.id/login" },
      { id: "d", text: "https://portal-contohsejahtera.co.id.net/login" }
    ],
    answer: "c",
    explanation: "The domain is the rightmost part before the first slash. In the option with @, the browser ignores everything before the @, so it goes to portal-login.net."
  },
  {
    id: "q25", type: "scenario", level: "sulit", cat: "data",
    prompt: "You already typed your work email password into a page that turned out to be fake. What is the first step?",
    options: [
      { id: "a", text: "Wait and see if anything goes wrong." },
      { id: "b", text: "Change the password right away on the official site and report it to the IT team." },
      { id: "c", text: "Clear your browser history." },
      { id: "d", text: "Turn off your computer." }
    ],
    answer: "b",
    explanation: "Scammers can use that password within minutes. Changing it and reporting quickly helps the IT team cut off access and stop it spreading."
  }
];
