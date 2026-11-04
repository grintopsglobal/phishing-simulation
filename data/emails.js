/* ==========================================================================
   Emails for the inbox simulation ("Spot the Phish"), ENGLISH.
   The Indonesian version is data/emails.id.js. Keep the same ids, phishing
   values, and flagged parts in both files.
   All brands, people, and domains here are FICTIONAL. Links are never opened.

   One email:
   {
     id:        unique code, for example "e13"
     phishing:  true | false
     context:   (optional) context sentence shown above the email
     from:      { name, address, flag? }
     replyTo:   (optional) reply-to address
     returnPath:(optional) Return-Path address
     date:      date text
     subject:   { text, flag? }
     body:      list of blocks, in order:
                  { text: "..." }                          paragraph
                  { link: "text", url: "...", button: true } link (button = shown as a button)
     attachments: (optional) [{ name, size, flag? }]
     safeReason:  (safe emails) why this email is safe
     lesson:      one-sentence takeaway
   }
   flag = { cat: category key in data/questions.js, note: "explanation" }
   Any part (from, subject, body block, attachment) can have a flag.
   Write {nama} in text to insert the user's name (or "there").
   ========================================================================== */
window.GRINTEC_RECIPIENT = "you@contohsejahtera.co.id";

window.GRINTEC_EMAILS = [
  {
    id: "e01",
    phishing: true,
    from: { name: "KirimCepat Express", address: "info@kirimcepat-delivery.net",
      flag: { cat: "domain", note: "KirimCepat's official domain is kirimcepat.co.id. This address uses kirimcepat-delivery.net." } },
    replyTo: "cs.kirimcepat@mailbox-pro.net",
    returnPath: "bounce@srv3.mailbox-pro.net",
    date: "Mon, 3 Nov 2026, 8:12 AM",
    subject: { text: "Your parcel is on hold: confirm within 24 hours",
      flag: { cat: "urgensi", note: "The 24-hour deadline is there so you pay without checking." } },
    body: [
      { text: "Dear Customer,",
        flag: { cat: "salam", note: "It does not use your name, although a real courier knows the recipient's name." } },
      { text: "Your parcel with tracking number KC88213 could not be delivered because the address is incomplete. It will be returned to the sender unless the redelivery fee of Rp12,500 is paid within 24 hours." },
      { text: "Have your debit or credit card number and CVV code ready for payment.",
        flag: { cat: "data", note: "Never give your card's CVV to a page you opened from an email." } },
      { link: "Reschedule delivery", url: "http://kirimcepat-delivery.net/bayar?id=KC88213", button: true,
        flag: { cat: "link", note: "The button goes to kirimcepat-delivery.net, not the courier's official site." } },
      { text: "Regards,\nKirimCepat Customer Service" }
    ],
    lesson: "The small fee is bait, so check your parcel status directly in the courier's official app or website."
  },
  {
    id: "e02",
    phishing: false,
    from: { name: "Contoh Sejahtera HR Team", address: "hr@contohsejahtera.co.id" },
    returnPath: "hr@contohsejahtera.co.id",
    date: "Mon, 3 Nov 2026, 7:30 AM",
    subject: { text: "Your October 2026 payslip is ready" },
    body: [
      { text: "Hi {nama}," },
      { text: "Your October 2026 payslip is now available on the HR portal. As usual, sign in with your work account." },
      { link: "hr.contohsejahtera.co.id/slip", url: "https://hr.contohsejahtera.co.id/slip" },
      { text: "If you have questions, contact the HR team on extension 210.\n\nRegards,\nHR Team" }
    ],
    safeReason: "The sender uses the correct company domain, the link goes to the company's own subdomain and its text matches the real address, there is no pressure, and it does not ask for your password by email.",
    lesson: "Real emails can contain links too, so check that the destination is a domain you know. Safer still, open the HR portal from your bookmarks."
  },
  {
    id: "e03",
    phishing: true,
    from: { name: "IT Helpdesk", address: "it-helpdesk@contohsejahtera-support.com",
      flag: { cat: "domain", note: "Your company's IT team uses contohsejahtera.co.id. This domain adds \"-support.com\"." } },
    replyTo: "it-helpdesk@contohsejahtera-support.com",
    returnPath: "mailer@bulk-send.click",
    date: "Fri, 31 Oct 2026, 4:47 PM",
    subject: { text: "Your password expires today",
      flag: { cat: "urgensi", note: "\"Today\" makes you feel you must act before leaving work." } },
    body: [
      { text: "Hello user," },
      { text: "Your AkunKerja 365 password will expire at 5:00 PM today. To keep your current password, confirm using the button below." },
      { link: "Keep current password", url: "https://akunkerja365.login-portal-verify.com/keep", button: true,
        flag: { cat: "link", note: "The real address is login-portal-verify.com. \"akunkerja365\" in front is just a subdomain anyone can create." } },
      { text: "You will be asked to enter your old password and a new one.",
        flag: { cat: "data", note: "A page that asks for your old password is a way to steal it." } },
      { text: "Thank you,\nIT Helpdesk" }
    ],
    lesson: "Change your password only through the official menu in an app or site you open yourself, never from an email link."
  },
  {
    id: "e04",
    phishing: false,
    context: "Yesterday you really did order a headset from TokoLaris.",
    from: { name: "TokoLaris", address: "pesanan@tokolaris.co.id" },
    returnPath: "bounce@mail.tokolaris.co.id",
    date: "Fri, 31 Oct 2026, 10:05 AM",
    subject: { text: "Order #TL-2611-0457 is being packed" },
    body: [
      { text: "Hi {nama}," },
      { text: "Your order (Wireless headset, 1 item) has been paid and is being packed by the seller. You will get a tracking number once the parcel is handed to the courier." },
      { link: "View order status", url: "https://www.tokolaris.co.id/pesanan/TL-2611-0457", button: true },
      { text: "TokoLaris never asks for your password, PIN, or OTP code." }
    ],
    safeReason: "It matches a purchase you really made, the sender and the link both use tokolaris.co.id, and there is no request for a repeat payment or secret data.",
    lesson: "An email that matches something you actually did, and comes from the right domain, is usually safe."
  },
  {
    id: "e05",
    phishing: true,
    from: { name: "Bank Nusantara Raya", address: "hadiah@nusantararaya-undian.com",
      flag: { cat: "domain", note: "Not the bank's domain. The bank uses nusantararaya.co.id." } },
    replyTo: "klaim.hadiah.nrr@mailbox-pro.net",
    returnPath: "bounce@mailbox-pro.net",
    date: "Thu, 30 Oct 2026, 1:20 PM",
    subject: { text: "CONGRATULATIONS!!! You won our 30th anniversary draw" },
    body: [
      { text: "Dear Winner,",
        flag: { cat: "salam", note: "A real prize draw knows the winner's name." } },
      { text: "Congratulation, you're account number has been choosen as winner of a Rp25,000,000 cash prize for Bank Nusantara Raya 30th anniversary. The prize will be transfer soon after the claim process is complete.",
        flag: { cat: "bahasa", note: "\"Congratulation\", \"you're account\", \"choosen\", and \"will be transfer\". Banks proofread before sending." } },
      { text: "To claim, send a photo of your ID card and transfer the admin fee and prize tax of Rp1,250,000 to the committee account below.",
        flag: { cat: "transfer", note: "A real prize never asks the winner to pay. An ID card photo can also be used for other fraud." } },
      { text: "30th Anniversary Prize Committee" }
    ],
    lesson: "If you never entered a draw, you cannot have won it. A prize you must pay for is a scam."
  },
  {
    id: "e06",
    phishing: true,
    from: { name: "Hendra Wijaya", address: "hendra.wijaya@contohsejahtera-co.com",
      flag: { cat: "domain", note: "The company domain is contohsejahtera.co.id, not contohsejahtera-co.com." } },
    replyTo: "hendra.wijaya.dir@mailbox-pro.net",
    returnPath: "bounce@mailbox-pro.net",
    date: "Thu, 30 Oct 2026, 9:02 AM",
    subject: { text: "Confidential: supplier payment today",
      flag: { cat: "urgensi", note: "\"Confidential\" and \"today\" are used so you don't ask anyone else." } },
    body: [
      { text: "Hi {nama}, I'm on a business trip and hard to reach." },
      { text: "Please process a payment of Rp186,400,000 to our new supplier today. The account details are below. This is related to an acquisition, so please don't discuss it with the rest of the team yet.",
        flag: { cat: "transfer", note: "A large transfer to a new account, with no approval process and a request for secrecy. This is the pattern of BEC, or a scam impersonating a manager." } },
      { text: "Bank Sentosa Abadi, account name PT Mitra Global Niaga, account no. 7710 2289 4410" },
      { text: "Let me know by email only once it's done.\n\nHendra Wijaya\nFinance Director" }
    ],
    lesson: "Confirm every transfer request by phone, on a number you already have saved, and follow the finance procedure, even if the sender looks like a director."
  },
  {
    id: "e07",
    phishing: false,
    context: "PT Sinar Kemas Indo is a regular supplier of your company and always sends its invoice at the start of the month.",
    from: { name: "Finance PT Sinar Kemas Indo", address: "finance@sinarkemasindo.co.id" },
    returnPath: "finance@sinarkemasindo.co.id",
    date: "Wed, 29 Oct 2026, 11:15 AM",
    subject: { text: "November 2026 invoice for PO 4471" },
    body: [
      { text: "Good afternoon {nama}," },
      { text: "Please find attached the November 2026 invoice for PO 4471. Payment goes to the same account as in the contract, nothing has changed." },
      { text: "The due date follows the usual terms, 30 days after the invoice is received." },
      { text: "Thank you,\nRatna\nFinance, PT Sinar Kemas Indo\n(021) 555 0147" }
    ],
    attachments: [{ name: "INV-SKI-1126.pdf", size: "182 KB" }],
    safeReason: "The supplier's domain is the usual one, the attachment is the PDF you were expecting, the bank account has not changed, and the due date follows normal terms with no pressure.",
    lesson: "Regular invoices are normal, while a sudden change of bank account deserves suspicion. If that happens, confirm by phone."
  },
  {
    id: "e08",
    phishing: true,
    from: { name: "e-Lapor Pajak Nusantara", address: "noreply@elapor-pajaknusantara.info",
      flag: { cat: "domain", note: "Government services don't use .info domains. Always check the end of the domain." } },
    returnPath: "bounce@mass-mailer.info",
    date: "Tue, 28 Oct 2026, 3:40 PM",
    subject: { text: "Notice of penalty for late annual tax return",
      flag: { cat: "urgensi", note: "Threats of penalties and fines make people open the attachment straight away." } },
    body: [
      { text: "Dear Taxpayer,",
        flag: { cat: "salam", note: "It does not use your name or taxpayer number." } },
      { text: "According to our records, your annual tax return has not been received. You have been charged an administrative penalty. Details of the penalty and an objection form are attached. Please process them within 3 days." },
      { text: "Sincerely,\ne-Lapor Pajak Service" }
    ],
    attachments: [{ name: "Surat_Teguran_SPT.zip", size: "1.4 MB",
      flag: { cat: "lampiran", note: "Official letters are not sent as .zip files. Archives are often used to hide malware." } }],
    lesson: "Check your tax status only through the official website or app you open yourself. Don't open archive attachments from unexpected emails."
  },
  {
    id: "e09",
    phishing: false,
    from: { name: "Contoh Sejahtera IT Team", address: "it@contohsejahtera.co.id" },
    returnPath: "it@contohsejahtera.co.id",
    date: "Tue, 28 Oct 2026, 9:00 AM",
    subject: { text: "Email server maintenance, Saturday 8 November at 10 PM" },
    body: [
      { text: "Hello everyone," },
      { text: "The company email server will undergo routine maintenance on Saturday, 8 November 2026, from 10 PM to midnight (WIB). During this time emails may arrive late." },
      { text: "You don't need to do anything. The IT team will never ask for your password by email or phone." },
      { text: "Thank you,\nIT Team" }
    ],
    safeReason: "The right company domain, no links or attachments, no action required, and it even reminds you not to share your password. \"Hello everyone\" is a normal greeting for a company-wide announcement.",
    lesson: "A generic greeting does not automatically mean phishing. Look at the whole email: who sent it and what it asks for."
  },
  {
    id: "e10",
    phishing: true,
    from: { name: "Jaminan Sehat Nasional", address: "layanan@jsn-iuran.org",
      flag: { cat: "domain", note: "An unknown .org domain, not the official address of the health insurance provider." } },
    returnPath: "bounce@perbarui-jsn.site",
    date: "Mon, 27 Oct 2026, 7:25 PM",
    subject: { text: "Your membership has been deactivated, update your data now" },
    body: [
      { text: "Dear Member," },
      { text: "you're membership has been deactivate temporarily due to incomplete datas. Please update immediately so health services can be use again.",
        flag: { cat: "bahasa", note: "\"you're membership\", \"deactivate\", \"datas\", and \"can be use\". The sentence is also urgent without any clear details." } },
      { text: "Required data: national ID number, mother's maiden name, bank account number, and a photo of your membership card.",
        flag: { cat: "data", note: "Your mother's maiden name and bank account number are often used to break into bank accounts." } },
      { link: "Official Member Portal", url: "http://perbarui-jsn.site/form", button: true,
        flag: { cat: "link", note: "The button says \"official\", but the address is perbarui-jsn.site." } }
    ],
    lesson: "Check your membership through the official app or service office. Never enter details like your mother's maiden name in a form from an email."
  },
  {
    id: "e11",
    phishing: false,
    context: "Your company uses the AkunKerja 365 email service. This morning you signed in from a new laptop.",
    from: { name: "AkunKerja 365", address: "no-reply@akunkerja365.com" },
    returnPath: "no-reply@akunkerja365.com",
    date: "Mon, 27 Oct 2026, 8:03 AM",
    subject: { text: "New sign-in to your account" },
    body: [
      { text: "Hi {nama}," },
      { text: "We noticed a new sign-in to your AkunKerja 365 account from a Windows device in Jakarta at 7:58 AM (WIB)." },
      { text: "If this was you, you can ignore this email. If not, open the AkunKerja app or type akunkerja365.com in your browser, then change your password from the Security menu." },
      { text: "AkunKerja 365 Security Team" }
    ],
    safeReason: "The email was triggered by your own action, the domain is right, there are no links or attachments, and if something is wrong it tells you to open the app yourself.",
    lesson: "A real security alert tells you to open the official app or website yourself instead of pushing you to click a link."
  },
  {
    id: "e12",
    phishing: true,
    from: { name: "AkunKerja Docs", address: "notifikasi@docs-share-akunkerja.com",
      flag: { cat: "domain", note: "Real document sharing notifications are sent from akunkerja365.com." } },
    returnPath: "bounce@share-file.co",
    date: "Sat, 25 Oct 2026, 9:10 PM",
    subject: { text: "Rina (Finance) shared \"Revisi_Gaji_2027.xlsx\" with you",
      flag: { cat: "urgensi", note: "Salary topics trigger curiosity. It was sent on a weekend night, when people are less careful." } },
    body: [
      { text: "Rina from Finance shared a document with you." },
      { text: "\"Please check this before Monday, and don't share it yet.\"" },
      { link: "Open document", url: "https://akunkerja365-docs.share-file.co/login?doc=88412", button: true,
        flag: { cat: "link", note: "The address is share-file.co. \"akunkerja365-docs\" is just a subdomain." } },
      { text: "You will need to sign in again to open shared documents.",
        flag: { cat: "data", note: "A \"sign in again\" page after clicking a link is a classic way to steal passwords." } }
    ],
    lesson: "If a colleague shares a document, open it from your own company document app, or ask the colleague directly."
  }
];
