/* ==========================================================================
   Simulasi phishing multi-kanal, BAHASA INDONESIA.
   Versi Inggris ada di data/sim.js. Samakan id, nilai phishing, urutan tahap,
   dan kategori flag di kedua file. Struktur lengkap ada di komentar data/sim.js.
   Semua merek, orang, nomor, dan domain di sini FIKTIF. Link tidak pernah dibuka.
   ========================================================================== */
window.GRINTEC_SIM = {
  stages: [
    {
      id: "email",
      seconds: 90,
      context: "Senin pagi. Anda membuka kotak masuk kantor di PT Contoh Sejahtera (contohsejahtera.co.id).",
      items: [
        {
          id: "m1",
          phishing: true,
          from: { name: "IT Service Desk", address: "it-servicedesk@contohsejahtera-id.com" },
          time: "08.14",
          subject: "Segera: password email Anda kedaluwarsa hari ini",
          body: [
            "Yth. Pengguna,",
            "Password email Anda akan kedaluwarsa hari ini pukul 17.00. Setelah itu Anda tidak bisa mengirim atau menerima email sampai akun di-reset oleh tim IT.",
            "Pertahankan password Anda sekarang dengan satu klik:"
          ],
          link: { label: "Pertahankan password saya", url: "https://contohsejahtera-id.com/owa/keep-password", button: true },
          footer: "IT Service Desk · PT Contoh Sejahtera",
          flags: [
            { cat: "domain", note: "Pengirimnya memakai contohsejahtera-id.com, padahal domain kantor Anda contohsejahtera.co.id." },
            { cat: "urgensi", note: "Tenggat hari ini membuat Anda mengklik sebelum sempat berpikir." },
            { cat: "salam", note: "Tim IT kantor sendiri tahu nama Anda dan tidak akan menulis \"Yth. Pengguna\"." },
            { cat: "data", note: "Tombolnya membuka halaman login di luar domain kantor untuk mengambil password Anda." }
          ],
          trap: "Tiruan halaman login kantor yang merekam password yang Anda ketik."
        },
        {
          id: "m2",
          phishing: true,
          from: { name: "AkunKerja Docs", address: "share@akunkerja-docs.net" },
          time: "07.52",
          subject: "Hendra Wijaya membagikan \"Penyesuaian gaji 2027.xlsx\" dengan Anda",
          body: [
            "Hendra Wijaya (hendra.wijaya@contohsejahtera.co.id) membagikan file dengan Anda.",
            "\"Penyesuaian gaji 2027.xlsx\". Mohon ditinjau sebelum Jumat dan dijaga kerahasiaannya."
          ],
          link: { label: "Buka di AkunKerja", url: "https://akunkerja-docs.net/s/9fK2x/view?login=required", button: true },
          footer: "Anda menerima email ini karena ada file yang dibagikan kepada Anda. AkunKerja 365",
          flags: [
            { cat: "domain", note: "Notifikasi AkunKerja yang asli dikirim dari akunkerja365.com, sedangkan yang ini dari akunkerja-docs.net." },
            { cat: "urgensi", note: "Data gaji yang katanya rahasia sengaja dipakai sebagai umpan agar Anda penasaran dan langsung membukanya." },
            { cat: "link", note: "Link-nya meminta Anda login ulang di domain yang bukan milik AkunKerja." }
          ],
          trap: "Halaman login AkunKerja palsu. Dengan password Anda, penyerang bisa membaca seluruh isi email Anda."
        },
        {
          id: "m3",
          phishing: false,
          from: { name: "HR Contoh Sejahtera", address: "hr@contohsejahtera.co.id" },
          time: "Kemarin",
          subject: "Medical check-up tahunan: pilih jadwal Anda",
          body: [
            "Halo {nama},",
            "Medical check-up tahunan berlangsung 17 sampai 21 November di klinik lantai 2.",
            "Silakan pilih jadwal di halaman HR intranet:"
          ],
          link: { label: "intranet.contohsejahtera.co.id/hr/mcu-2026", url: "https://intranet.contohsejahtera.co.id/hr/mcu-2026" },
          footer: "Ada pertanyaan? Balas email ini atau hubungi ext. 2104. Tim HR",
          safeReason: "Email ini dikirim dari domain kantor, menyapa Anda dengan nama, link-nya mengarah ke intranet kantor, dan tidak meminta data rahasia. Anda juga bisa memastikannya lewat ext. 2104."
        }
      ]
    },
    {
      id: "sms",
      seconds: 60,
      context: "Dua hari lalu Anda memesan dudukan monitor di toko online TokoLaris.",
      items: [
        {
          id: "s1",
          phishing: true,
          from: "+62 813-9027-4416",
          time: "09.03",
          text: "BANK NUSANTARA RAYA: Rekening Anda diblokir sementara karena aktivitas mencurigakan. Lakukan verifikasi dalam 1x24 jam agar rekening tidak ditutup permanen:",
          link: { url: "https://nusantararaya-verifikasi.com/id" },
          flags: [
            { cat: "domain", note: "SMS ini dikirim dari nomor HP biasa, padahal bank mengirim SMS atas nama resminya." },
            { cat: "urgensi", note: "Rekening diblokir dan tenggat 24 jam dibuat supaya Anda panik." },
            { cat: "link", note: "Link-nya mengarah ke nusantararaya-verifikasi.com, bukan domain resmi bank." },
            { cat: "data", note: "Halaman \"verifikasi\" itu meminta nomor kartu, PIN, dan OTP." }
          ],
          trap: "Halaman bank palsu yang meminta nomor kartu, PIN, dan kode OTP Anda."
        },
        {
          id: "s2",
          phishing: false,
          from: "KirimCepat",
          time: "08.40",
          text: "KirimCepat: Paket KC7712093 dari TokoLaris akan diantar hari ini pukul 13.00 sampai 17.00. Lacak paket di",
          link: { url: "https://kirimcepat.co.id/lacak/KC7712093" },
          safeReason: "Anda memang sedang menunggu paket ini, pengirimnya nama resmi KirimCepat, link-nya ke domain resmi kirimcepat.co.id, dan tidak ada permintaan bayar atau data."
        }
      ]
    },
    {
      id: "chat",
      seconds: 60,
      context: "Atasan Anda bernama Hendra Wijaya. Nomornya sudah tersimpan di HP Anda sejak dua tahun lalu.",
      items: [
        {
          id: "c1",
          phishing: true,
          name: "~Hendra Wijaya",
          number: "+62 821-7740-1983",
          saved: false,
          time: "10.21",
          messages: [
            "Halo, ini Hendra. Ini nomor baru saya, tolong disimpan ya.",
            "Saya lagi meeting dengan klien dan tidak bisa telepon. Bisa bantu proses pembayaran vendor hari ini? Invoice dan rekening barunya ada di sini:",
            "Tolong jangan dibahas dulu dengan yang lain, nanti saya jelaskan setelah meeting."
          ],
          link: { label: "Buka invoice", url: "https://dokumen-vendor.share-files.net/inv/2211", button: true },
          flags: [
            { cat: "transfer", note: "Nomor yang tidak tersimpan mengaku sebagai atasan dan meminta pembayaran. Telepon beliau di nomor yang sudah Anda simpan." },
            { cat: "urgensi", note: "Harus hari ini, tidak bisa ditelepon, dan diminta merahasiakan. Tiga tekanan sekaligus dalam satu chat." },
            { cat: "link", note: "Invoice-nya ada di share-files.net, bukan penyimpanan file kantor." }
          ],
          trap: "Halaman yang memasang malware atau meminta login, ditambah permintaan transfer ke rekening penipu."
        },
        {
          id: "c2",
          phishing: false,
          name: "Rina (HR)",
          number: "+62 812-3301-5528",
          saved: true,
          time: "09.47",
          messages: [
            "Pagi {nama}, sekadar mengingatkan town hall Jumat ini jam 14.00 di aula utama.",
            "Agendanya ada di intranet, tidak perlu daftar."
          ],
          link: { label: "intranet.contohsejahtera.co.id/townhall", url: "https://intranet.contohsejahtera.co.id/townhall" },
          safeReason: "Rina kontak yang tersimpan, town hall-nya sudah diumumkan sebelumnya, link-nya ke intranet kantor, dan ia tidak meminta apa pun dari Anda."
        }
      ]
    },
    {
      id: "qr",
      seconds: 45,
      context: "Anda sedang di kantor dan melihat dua kode QR di bawah ini. Ketuk kode QR untuk memindainya dengan HP.",
      items: [
        {
          id: "r1",
          phishing: true,
          place: "Mesin bayar parkir, basement B1",
          sign: { title: "Bayar parkir di sini", sub: "Scan untuk bayar. Tanpa karcis." },
          url: "https://bayarparkir-online.com/pay?loc=B1",
          tampered: true,
          flags: [
            { cat: "link", note: "QR-nya berupa stiker yang ditempel di atas QR cetakan. Periksa tepinya sebelum memindai." },
            { cat: "domain", note: "QR ini membuka bayarparkir-online.com, bukan situs pengelola gedung." },
            { cat: "data", note: "Halaman pembayarannya meminta nomor kartu lengkap dan CVV." }
          ],
          trap: "Halaman pembayaran yang mengambil data kartu Anda dan menarik dana jauh di atas tarif parkir."
        },
        {
          id: "r2",
          phishing: false,
          place: "Pintu ruang rapat 3.01",
          sign: { title: "Pesan ruangan ini", sub: "Ruang rapat 3.01 · 8 kursi" },
          url: "https://intranet.contohsejahtera.co.id/rooms/3-01",
          tampered: false,
          safeReason: "QR-nya tercetak menyatu dengan papan resmi ruangan, membuka intranet kantor, dan halamannya hanya menampilkan jadwal ruangan."
        }
      ]
    }
  ]
};
