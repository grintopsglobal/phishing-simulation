/* ==========================================================================
   Multi-channel phishing simulation, ENGLISH.
   The Indonesian version is data/sim.id.js. Keep the same ids, phishing
   values, stage order, and flag categories in both files.
   All brands, people, numbers, and domains here are FICTIONAL. Links never open.

   Four stages, played in order. Each stage has a countdown (seconds).
   Clicking any link, button, or QR "Open link" ends the stage.

   Common fields per item:
     id, phishing (true | false)
     flags:      (phishing) [{ cat: key in GRINTEC_CATEGORIES, note }]
     trap:       (phishing) what the click would have led to
     safeReason: (safe) why it is safe
   Channel fields:
     email: from { name, address }, time, subject, body [text], link { label, url, button }
     sms:   from, time, text, link { url }
     chat:  name, number, saved, time, messages [text], link { label, url, button }
     qr:    place, sign { title, sub }, url, tampered
   Write {nama} to insert the user's name.
   ========================================================================== */
window.GRINTEC_SIM = {
  stages: [
    {
      id: "email",
      seconds: 90,
      context: "It is Monday morning. You open your work inbox at PT Contoh Sejahtera (contohsejahtera.co.id).",
      items: [
        {
          id: "m1",
          phishing: true,
          from: { name: "IT Service Desk", address: "it-servicedesk@contohsejahtera-id.com" },
          time: "08:14",
          subject: "Action required: your mailbox password expires today",
          body: [
            "Dear user,",
            "Your mailbox password expires at 17:00 today. After that you will not be able to send or receive email until IT resets your account.",
            "Keep your current password with one click:"
          ],
          link: { label: "Keep my password", url: "https://contohsejahtera-id.com/owa/keep-password", button: true },
          footer: "IT Service Desk · PT Contoh Sejahtera",
          flags: [
            { cat: "domain", note: "The sender uses contohsejahtera-id.com. Your company domain is contohsejahtera.co.id." },
            { cat: "urgensi", note: "A same-day deadline pushes you to click before you think." },
            { cat: "salam", note: "Your own IT team knows your name and would not write \"Dear user\"." },
            { cat: "data", note: "The button opens a login page outside the company domain to collect your password." }
          ],
          trap: "A copy of the company login page that records the password you type."
        },
        {
          id: "m2",
          phishing: true,
          from: { name: "AkunKerja Docs", address: "share@akunkerja-docs.net" },
          time: "07:52",
          subject: "Hendra Wijaya shared \"Salary adjustment 2027.xlsx\" with you",
          body: [
            "Hendra Wijaya (hendra.wijaya@contohsejahtera.co.id) shared a file with you.",
            "\"Salary adjustment 2027.xlsx\". Please review before Friday and keep it confidential."
          ],
          link: { label: "Open in AkunKerja", url: "https://akunkerja-docs.net/s/9fK2x/view?login=required", button: true },
          footer: "You received this email because a file was shared with you. AkunKerja 365",
          flags: [
            { cat: "domain", note: "Real AkunKerja notifications come from akunkerja365.com. This one is akunkerja-docs.net." },
            { cat: "urgensi", note: "Salary data marked confidential is bait. It makes you curious enough to open it right away." },
            { cat: "link", note: "The link asks you to sign in again on a domain that is not AkunKerja's." }
          ],
          trap: "A fake AkunKerja sign-in page. With your password, the attacker can read your whole mailbox."
        },
        {
          id: "m3",
          phishing: false,
          from: { name: "HR Contoh Sejahtera", address: "hr@contohsejahtera.co.id" },
          time: "Yesterday",
          subject: "Annual medical check-up: pick your time slot",
          body: [
            "Hi {nama},",
            "The annual medical check-up runs from 17 to 21 November at the clinic on the 2nd floor.",
            "Please pick a time slot on the HR page of the intranet:"
          ],
          link: { label: "intranet.contohsejahtera.co.id/hr/mcu-2026", url: "https://intranet.contohsejahtera.co.id/hr/mcu-2026" },
          footer: "Questions? Reply to this email or call ext. 2104. HR Team",
          safeReason: "It comes from the company domain, greets you by name, the link goes to the company intranet, and it asks for nothing secret. You can also check by calling ext. 2104."
        }
      ]
    },
    {
      id: "sms",
      seconds: 60,
      context: "Two days ago you ordered a monitor stand from the online shop TokoLaris.",
      items: [
        {
          id: "s1",
          phishing: true,
          from: "+62 813-9027-4416",
          time: "09:03",
          text: "BANK NUSANTARA RAYA: Your account has been temporarily blocked due to suspicious activity. Verify within 1x24 hours to avoid permanent closure:",
          link: { url: "https://nusantararaya-verifikasi.com/id" },
          flags: [
            { cat: "domain", note: "It comes from an ordinary mobile number. Banks send SMS under their registered name." },
            { cat: "urgensi", note: "A blocked account and a 24-hour deadline are there to make you panic." },
            { cat: "link", note: "The link goes to nusantararaya-verifikasi.com, not the bank's official domain." },
            { cat: "data", note: "The \"verification\" page asks for your card number, PIN, and OTP." }
          ],
          trap: "A fake bank page that asks for your card number, PIN, and the OTP code."
        },
        {
          id: "s2",
          phishing: false,
          from: "KirimCepat",
          time: "08:40",
          text: "KirimCepat: Your parcel KC7712093 from TokoLaris will be delivered today between 13:00 and 17:00. Track it at",
          link: { url: "https://kirimcepat.co.id/lacak/KC7712093" },
          safeReason: "You are expecting this parcel, the sender is KirimCepat's registered name, the link goes to the official domain kirimcepat.co.id, and it asks for no payment or data."
        }
      ]
    },
    {
      id: "chat",
      seconds: 60,
      context: "Your manager is Hendra Wijaya. His number has been saved in your phone for two years.",
      items: [
        {
          id: "c1",
          phishing: true,
          name: "~Hendra Wijaya",
          number: "+62 821-7740-1983",
          saved: false,
          time: "10:21",
          messages: [
            "Hi, it's Hendra. This is my new number, please save it.",
            "I'm in a meeting with a client and can't call. Can you process a vendor payment today? The invoice and the new account details are here:",
            "Please keep this between us for now. I'll explain after the meeting."
          ],
          link: { label: "Open invoice", url: "https://dokumen-vendor.share-files.net/inv/2211", button: true },
          flags: [
            { cat: "transfer", note: "An unsaved number claims to be your manager and asks for a payment. Call him on the number you already have." },
            { cat: "urgensi", note: "Today, no calls, and keep it secret: three pressures in one chat." },
            { cat: "link", note: "The invoice is on share-files.net, not the company's file storage." }
          ],
          trap: "A page that installs malware or asks for your login, and a request to pay into the scammer's account."
        },
        {
          id: "c2",
          phishing: false,
          name: "Rina (HR)",
          number: "+62 812-3301-5528",
          saved: true,
          time: "09:47",
          messages: [
            "Morning! Just a reminder that the town hall is this Friday at 14:00 in the main hall.",
            "The agenda is on the intranet. No need to register."
          ],
          link: { label: "intranet.contohsejahtera.co.id/townhall", url: "https://intranet.contohsejahtera.co.id/townhall" },
          safeReason: "Rina is a saved contact, the town hall was already announced, the link goes to the company intranet, and she asks you for nothing."
        }
      ]
    },
    {
      id: "qr",
      seconds: 45,
      context: "You are at the office. Below are two QR codes you see today. Tap a QR code to scan it with your phone.",
      items: [
        {
          id: "r1",
          phishing: true,
          place: "Parking payment machine, basement B1",
          sign: { title: "Pay parking here", sub: "Scan to pay. No ticket needed." },
          url: "https://bayarparkir-online.com/pay?loc=B1",
          tampered: true,
          flags: [
            { cat: "link", note: "The QR is a sticker stuck over the printed one. Look at the edges before you scan." },
            { cat: "domain", note: "It opens bayarparkir-online.com, not the building manager's site." },
            { cat: "data", note: "The payment page asks for your full card number and CVV." }
          ],
          trap: "A payment page that takes your card details and charges far more than the parking fee."
        },
        {
          id: "r2",
          phishing: false,
          place: "Door of meeting room 3.01",
          sign: { title: "Book this room", sub: "Meeting room 3.01 · 8 seats" },
          url: "https://intranet.contohsejahtera.co.id/rooms/3-01",
          tampered: false,
          safeReason: "The QR is printed as part of the official room sign, it opens the company intranet, and the page only shows the room schedule."
        }
      ]
    }
  ]
};
