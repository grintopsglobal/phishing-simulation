/* ==========================================================================
   Bank soal pre-assessment + kategori red flag + pengaturan tes.
   File ini boleh diedit tim GRINTEC tanpa menyentuh logika. Lihat README.

   Semua nama brand, orang, dan domain di sini FIKTIF.
   ========================================================================== */

/* Kategori red flag. `anchor` = id kartu di learn.html untuk rekomendasi. */
window.GRINTEC_CATEGORIES = {
  domain:   { label: "Domain pengirim palsu",     anchor: "tanda-domain",   tip: "Baca bagian setelah @ huruf demi huruf, dan bandingkan dengan alamat yang biasa Anda terima." },
  urgensi:  { label: "Urgensi dan ancaman",       anchor: "tanda-urgensi",  tip: "Saat email membuat Anda panik atau penasaran, berhenti dulu dan periksa sebelum melakukan apa pun." },
  link:     { label: "Link yang tidak sesuai",    anchor: "tanda-link",     tip: "Arahkan kursor atau tekan lama link untuk melihat alamat aslinya sebelum mengklik." },
  lampiran: { label: "Lampiran berbahaya",        anchor: "tanda-lampiran", tip: "Jangan buka lampiran yang tidak Anda minta, terutama .exe, .zip, .html, atau file Office yang meminta Enable Content." },
  data:     { label: "Permintaan data sensitif",  anchor: "tanda-data",     tip: "Password, PIN, dan OTP tidak pernah diminta lewat email, chat, atau telepon, termasuk oleh tim IT." },
  salam:    { label: "Salam generik",             anchor: "tanda-salam",    tip: "Layanan yang Anda pakai biasanya menyapa dengan nama. Salam umum adalah alasan untuk memeriksa lebih teliti." },
  bahasa:   { label: "Kesalahan bahasa",          anchor: "tanda-bahasa",   tip: "Salah ketik, campuran bahasa, dan kalimat janggal jarang lolos di komunikasi resmi." },
  transfer: { label: "Permintaan transfer dana",  anchor: "tanda-transfer", tip: "Setiap permintaan transfer atau perubahan rekening harus dikonfirmasi lewat nomor yang sudah Anda simpan." },
  asli:     { label: "Mengenali email asli",      anchor: "email-aman",     tip: "Tidak semua email berbahaya. Cocokkan domain, konteks, dan tujuan link sebelum memutuskan." }
};

/* Pengaturan tes */
window.GRINTEC_CONFIG = {
  /* Jumlah soal yang diambil acak per tingkat kesulitan (total 15).
     Pastikan bank soal punya cukup soal di setiap tingkat. */
  perLevel: { mudah: 5, sedang: 5, sulit: 5 },

  /* Kategori hasil, diperiksa dari atas. `min` = persentase minimal. */
  levels: [
    { min: 85, label: "Sangat Waspada", desc: "Anda konsisten mengenali tanda phishing. Pertahankan kebiasaan memeriksa sebelum mengklik, dan bantu rekan yang masih ragu." },
    { min: 60, label: "Cukup Waspada",  desc: "Anda sudah mengenali banyak tanda, tetapi masih ada celah yang bisa dimanfaatkan penipu. Fokus pada kategori dengan skor terendah di bawah." },
    { min: 0,  label: "Rentan",         desc: "Beberapa jebakan masih lolos. Pelajari lagi tanda-tandanya, mulai dari kategori dengan skor terendah di bawah, lalu coba tes sekali lagi." }
  ]
};

/* --------------------------------------------------------------------------
   Bank soal.
   type:  "email"    → pengguna memilih Aman / Phishing. answer: "safe" | "phish"
          "scenario" → pilihan ganda. answer: id opsi
          "url"      → pilih URL yang diminta. answer: id opsi
   level: "mudah" | "sedang" | "sulit"
   cat:   salah satu kunci di GRINTEC_CATEGORIES
   Opsi pilihan ganda diacak otomatis saat tes dibuat.
   -------------------------------------------------------------------------- */
window.GRINTEC_QUESTIONS = [
  /* ---------- MUDAH ---------- */
  {
    id: "q01", type: "email", level: "mudah", cat: "urgensi",
    prompt: "Email ini masuk ke kotak masuk kantor Anda. Aman atau phishing?",
    mail: { fromName: "Admin Sistem", fromAddress: "admin@sistem-verifikasi.net", subject: "AKUN EMAIL ANDA AKAN DIHAPUS DALAM 1 JAM", snippet: "Klik link di bawah untuk membatalkan penghapusan. Jika tidak, semua email Anda hilang permanen." },
    answer: "phish",
    explanation: "Ancaman penghapusan dalam satu jam dibuat agar Anda panik dan langsung mengklik. Pengirimnya juga bukan domain kantor Anda."
  },
  {
    id: "q02", type: "scenario", level: "mudah", cat: "data",
    prompt: "Seseorang menelepon, mengaku dari tim IT kantor, dan meminta kode OTP yang baru masuk ke HP Anda agar akun bisa \"diperbaiki\". Apa yang Anda lakukan?",
    options: [
      { id: "a", text: "Memberikan kodenya, karena ia dari tim IT." },
      { id: "b", text: "Menolak, menutup telepon, lalu melapor ke tim IT lewat kontak resmi." },
      { id: "c", text: "Memberikan setengah kodenya saja." },
      { id: "d", text: "Meminta ia mengirim email dulu, lalu memberikan kodenya." }
    ],
    answer: "b",
    explanation: "Kode OTP hanya untuk Anda dan tim IT asli tidak pernah memintanya, sehingga siapa pun yang meminta OTP sedang mencoba masuk ke akun Anda."
  },
  {
    id: "q03", type: "url", level: "mudah", cat: "domain",
    prompt: "Situs resmi Bank Nusantara Raya beralamat di nusantararaya.co.id. Mana alamat yang PALSU?",
    options: [
      { id: "a", text: "https://www.nusantararaya.co.id/kartu" },
      { id: "b", text: "https://ib.nusantararaya.co.id" },
      { id: "c", text: "https://nusantararaya-co-id.login-aman.com" },
      { id: "d", text: "https://nusantararaya.co.id/promo" }
    ],
    answer: "c",
    explanation: "Domain aslinya adalah login-aman.com. Tulisan \"nusantararaya-co-id\" hanya hiasan di depan agar terlihat meyakinkan."
  },
  {
    id: "q04", type: "email", level: "mudah", cat: "salam",
    prompt: "Aman atau phishing?",
    mail: { fromName: "Panitia Undian", fromAddress: "undian@hadiah-nusantara.com", subject: "Selamat! Anda pemenang mobil", snippet: "Kepada Pemenang Yth., untuk klaim hadiah, transfer biaya balik nama Rp2.500.000 ke rekening panitia." },
    answer: "phish",
    explanation: "Penipu tidak tahu nama Anda, jadi memakai salam umum seperti \"Kepada Pemenang Yth.\". Undian asli juga tidak meminta Anda membayar untuk menerima hadiah."
  },
  {
    id: "q05", type: "scenario", level: "mudah", cat: "lampiran",
    prompt: "Anda menerima email dari alamat tak dikenal berjudul \"Foto acara kantor\" dengan lampiran Foto_Acara.zip. Anda tidak ingat ada acara. Apa yang Anda lakukan?",
    options: [
      { id: "a", text: "Membukanya untuk melihat isinya." },
      { id: "b", text: "Meneruskannya ke rekan agar mereka yang membuka." },
      { id: "c", text: "Tidak membukanya, lalu melaporkannya ke tim IT." },
      { id: "d", text: "Membalas email untuk menanyakan isinya." }
    ],
    answer: "c",
    explanation: "File .zip dari pengirim tak dikenal sering berisi program jahat. Meneruskan atau membalas justru menyebarkan risiko atau memberi tahu penipu bahwa alamat Anda aktif."
  },
  {
    id: "q06", type: "email", level: "mudah", cat: "asli",
    prompt: "Aman atau phishing?",
    mail: { fromName: "Tim HR", fromAddress: "hr@contohsejahtera.co.id", subject: "Pengingat: pengisian absensi tahunan", snippet: "Silakan isi lewat portal HR seperti biasa sebelum 30 November. Tidak perlu membalas email ini." },
    answer: "safe",
    explanation: "Pengirim memakai domain kantor yang benar, tidak meminta data, tidak menyertakan link mencurigakan, dan tidak mendesak. Ini pengingat biasa."
  },
  {
    id: "q07", type: "scenario", level: "mudah", cat: "link",
    prompt: "Email meminta Anda klik tombol \"Lihat Tagihan\". Saat kursor diarahkan ke tombol, muncul alamat http://tagihan-cek.top/inv. Apa langkah paling tepat?",
    options: [
      { id: "a", text: "Mengkliknya, karena hanya melihat tagihan." },
      { id: "b", text: "Tidak mengklik. Membuka situs resmi penyedia tagihan dengan mengetik alamatnya sendiri." },
      { id: "c", text: "Mengkliknya, tetapi tidak mengisi apa pun." },
      { id: "d", text: "Meneruskan email ke rekan agar ikut mengecek." }
    ],
    answer: "b",
    explanation: "Alamat yang muncul bukan situs penyedia tagihan. Membuka situs resmi sendiri adalah cara aman untuk mengecek tagihan."
  },
  {
    id: "q08", type: "url", level: "mudah", cat: "link",
    prompt: "Situs resmi KirimCepat Express beralamat di kirimcepat.co.id. Mana alamat yang BENAR-BENAR milik KirimCepat?",
    options: [
      { id: "a", text: "http://kirimcepat.co.id.lacak-paket.com" },
      { id: "b", text: "https://lacak.kirimcepat.co.id" },
      { id: "c", text: "https://kirimcepat-co-id.info" },
      { id: "d", text: "https://kirimcepat.co.id-resi.net" }
    ],
    answer: "b",
    explanation: "\"lacak.\" di depan hanya subdomain, dan domainnya tetap kirimcepat.co.id. Alamat lain berakhir di lacak-paket.com, kirimcepat-co-id.info, dan co.id-resi.net."
  },
  {
    id: "q09", type: "email", level: "mudah", cat: "bahasa",
    prompt: "Aman atau phishing?",
    mail: { fromName: "Bank Nusantara Raya", fromAddress: "bank.nusantararaya@notif-nasabah.com", subject: "Pemberitahuan Penting!!!", snippet: "Yth nasabah, kartu ATM anda telah di nonaktifkan karena sistim kami mendeteksi aktifitas mencurigakan. silahkan klik link dibawah ini." },
    answer: "phish",
    explanation: "Banyak salah ketik (\"di nonaktifkan\", \"sistim\", \"aktifitas\"), huruf kecil di awal kalimat, dan tanda seru berlebihan. Domainnya pun bukan milik bank."
  },

  /* ---------- SEDANG ---------- */
  {
    id: "q10", type: "email", level: "sedang", cat: "domain",
    prompt: "Aman atau phishing?",
    mail: { fromName: "KirimCepat Express", fromAddress: "notifikasi@kirimcepat.co.id.resi-info.com", subject: "Resi KC-7781 menunggu konfirmasi alamat", snippet: "Konfirmasi alamat Anda agar kurir bisa mengantar hari ini." },
    answer: "phish",
    explanation: "Baca domain dari kanan: alamat ini milik resi-info.com, bukan kirimcepat.co.id. Penipu sengaja menaruh nama asli di depan."
  },
  {
    id: "q11", type: "scenario", level: "sedang", cat: "transfer",
    prompt: "Atasan Anda mengirim WhatsApp dari nomor baru: \"Ini nomor baru saya. Tolong transfer Rp15 juta ke rekening ini untuk DP acara, nanti saya ganti. Saya sedang rapat, jangan telepon.\" Apa yang Anda lakukan?",
    options: [
      { id: "a", text: "Mentransfer, karena pesannya dari atasan." },
      { id: "b", text: "Membalas dan meminta foto KTP sebagai bukti." },
      { id: "c", text: "Menelepon atasan di nomor lama yang tersimpan atau bertanya langsung, dan mengikuti prosedur keuangan." },
      { id: "d", text: "Mentransfer setengahnya dulu." }
    ],
    answer: "c",
    explanation: "Nomor baru, permintaan uang, desakan, dan larangan menelepon adalah pola penipuan yang mengatasnamakan atasan. Verifikasi selalu lewat kontak yang sudah Anda kenal."
  },
  {
    id: "q12", type: "url", level: "sedang", cat: "domain",
    prompt: "Email kantor Anda memakai layanan AkunKerja 365 di akunkerja365.com. Mana alamat yang PALSU?",
    options: [
      { id: "a", text: "https://akunkerja365.com/masuk" },
      { id: "b", text: "https://login.akunkerja365.com" },
      { id: "c", text: "https://akunkerja356.com/masuk" },
      { id: "d", text: "https://akunkerja365.com/bantuan" }
    ],
    answer: "c",
    explanation: "Angka 365 diubah menjadi 356. Teknik ini disebut typosquatting: alamat dibuat mirip agar mata kita tidak menyadarinya."
  },
  {
    id: "q13", type: "email", level: "sedang", cat: "asli",
    prompt: "Kemarin Anda memang berbelanja di TokoLaris. Lalu email ini masuk. Aman atau phishing?",
    mail: { fromName: "TokoLaris", fromAddress: "pesanan@tokolaris.co.id", subject: "Pembayaran pesanan #TL-1103-2291 berhasil", snippet: "Terima kasih. Pesanan Anda dikirim dalam 1 sampai 2 hari kerja. Lihat detailnya di aplikasi TokoLaris." },
    answer: "safe",
    explanation: "Sesuai dengan belanja yang memang Anda lakukan, domainnya benar, tidak meminta data atau pembayaran ulang, dan mengarahkan Anda ke aplikasi resmi."
  },
  {
    id: "q14", type: "scenario", level: "sedang", cat: "lampiran",
    prompt: "Email dari vendor rutin berisi lampiran bernama Invoice_Nov.pdf.exe. Apa yang Anda lakukan?",
    options: [
      { id: "a", text: "Membukanya, karena dari vendor rutin." },
      { id: "b", text: "Tidak membukanya, menghubungi vendor lewat nomor yang tersimpan, dan melapor ke tim IT." },
      { id: "c", text: "Mengganti nama file menjadi .pdf lalu membukanya." },
      { id: "d", text: "Meneruskannya ke bagian keuangan." }
    ],
    answer: "b",
    explanation: "Akhiran .exe berarti file itu program, bukan PDF. Akun email vendor bisa saja dibajak, jadi konfirmasi lewat saluran lain."
  },
  {
    id: "q15", type: "email", level: "sedang", cat: "bahasa",
    prompt: "Aman atau phishing?",
    mail: { fromName: "Layanan Pelanggan", fromAddress: "cs@layanan-nusantararaya.com", subject: "Pemberitahuan Penting Untuk Akun Anda", snippet: "Dear nasabah, kami telah mendeteksi login tidak sah. mohon segera verifikasi akun anda agar tidak di blokir." },
    answer: "phish",
    explanation: "Campuran \"Dear\" dengan bahasa Indonesia, huruf kecil di awal kalimat, dan \"di blokir\" adalah tanda tulisan yang tidak melalui pemeriksaan resmi."
  },
  {
    id: "q16", type: "scenario", level: "sedang", cat: "urgensi",
    prompt: "Email dari \"Tim Keamanan\" menyatakan akun Anda dibobol dan Anda harus klik link dalam 10 menit. Mengapa batas waktu ini mencurigakan?",
    options: [
      { id: "a", text: "Tidak mencurigakan. Urusan keamanan memang harus cepat." },
      { id: "b", text: "Desakan waktu dibuat agar Anda panik dan tidak sempat memeriksa." },
      { id: "c", text: "Karena email keamanan selalu berbahasa Inggris." },
      { id: "d", text: "Karena 10 menit terlalu lama." }
    ],
    answer: "b",
    explanation: "Penipu memakai rasa panik untuk menghentikan Anda berpikir. Jika ragu, hubungi tim IT lewat kontak resmi, bukan lewat link di email."
  },
  {
    id: "q17", type: "email", level: "sedang", cat: "salam",
    prompt: "Aman atau phishing?",
    mail: { fromName: "Payroll", fromAddress: "payroll-hr@contohsejahtera-mail.com", subject: "Penyesuaian gaji karyawan", snippet: "Dear Karyawan, silakan konfirmasi data rekening Anda untuk penyesuaian gaji bulan ini melalui formulir terlampir." },
    answer: "phish",
    explanation: "HR kantor Anda tahu nama Anda dan tidak menyapa \"Dear Karyawan\". Domainnya juga bukan contohsejahtera.co.id, dan data rekening diminta lewat formulir lampiran."
  },

  /* ---------- SULIT ---------- */
  {
    id: "q18", type: "email", level: "sulit", cat: "domain",
    prompt: "Aman atau phishing? Perhatikan alamatnya dengan teliti.",
    mail: { fromName: "Tim IT", fromAddress: "it@contohsejahtera.co.ld", subject: "Pembaruan wajib VPN kantor", snippet: "Instal pembaruan VPN dari link berikut sebelum Senin agar akses kerja dari rumah tetap berjalan." },
    answer: "phish",
    explanation: "Akhirannya .co.ld (huruf L), bukan .co.id (huruf I). Satu huruf saja sudah cukup untuk membuat domain yang sepenuhnya berbeda."
  },
  {
    id: "q19", type: "email", level: "sulit", cat: "asli",
    prompt: "Anda baru saja mencoba login ke email kantor dan meminta kode verifikasi. Lalu email ini masuk. Aman atau phishing?",
    mail: { fromName: "AkunKerja 365", fromAddress: "no-reply@akunkerja365.com", subject: "Kode verifikasi Anda: 482913", snippet: "Masukkan kode ini untuk menyelesaikan login. Jangan berikan kode ini kepada siapa pun, termasuk tim IT." },
    answer: "safe",
    explanation: "Email ini datang karena tindakan Anda sendiri, dari domain yang benar, dan justru mengingatkan agar kode tidak dibagikan. Tidak ada link atau permintaan data."
  },
  {
    id: "q20", type: "scenario", level: "sulit", cat: "transfer",
    prompt: "Vendor rutin mengirim email dari alamat yang biasa: \"Mulai bulan ini rekening kami pindah bank. Mohon pembayaran berikutnya ke rekening baru terlampir.\" Apa yang Anda lakukan?",
    options: [
      { id: "a", text: "Membayar ke rekening baru, karena alamat emailnya sama seperti biasa." },
      { id: "b", text: "Menelepon kontak vendor yang sudah tercatat (bukan nomor di email) dan mengikuti prosedur perubahan rekening." },
      { id: "c", text: "Membalas email itu untuk meminta konfirmasi." },
      { id: "d", text: "Tetap membayar ke rekening lama tanpa memberi tahu siapa pun." }
    ],
    answer: "b",
    explanation: "Akun email vendor yang asli bisa dibajak, sehingga membalas email itu sama saja dengan bertanya kepada penipunya. Perubahan rekening wajib dikonfirmasi lewat saluran lain."
  },
  {
    id: "q21", type: "url", level: "sulit", cat: "link",
    prompt: "Teks link di email tertulis www.tokolaris.co.id/promo. Saat kursor diarahkan, mana alamat asli yang AMAN?",
    options: [
      { id: "a", text: "https://tokolaris.co.id.promo-spesial.com/" },
      { id: "b", text: "https://www.tokolaris.co.id/promo" },
      { id: "c", text: "https://www.tokolaris.co/promo" },
      { id: "d", text: "https://tokolaris-co-id.promo.id" }
    ],
    answer: "b",
    explanation: "Hanya opsi ini yang domainnya tokolaris.co.id. Perhatikan .co (tanpa .id) dan alamat yang menaruh nama toko di depan domain lain."
  },
  {
    id: "q22", type: "email", level: "sulit", cat: "lampiran",
    prompt: "Anda tidak pernah meminta file ini. Aman atau phishing?",
    mail: { fromName: "Dimas (Keuangan)", fromAddress: "dimas.keuangan@contohsejahtera.co.id", subject: "Re: laporan kuartal", snippet: "Ini file yang kamu minta. Klik Enable Content agar tabelnya muncul.", attachment: "Laporan_Q3.xlsm" },
    answer: "phish",
    explanation: "Alamatnya asli, tetapi akun rekan bisa dibajak. File .xlsm yang meminta Enable Content dapat menjalankan program. Konfirmasi ke rekan lewat chat atau telepon sebelum membuka."
  },
  {
    id: "q23", type: "scenario", level: "sulit", cat: "link",
    prompt: "Ada poster di lift: \"Isi survei kepuasan karyawan, dapat voucher\" dengan kode QR. Saat dipindai, alamat yang muncul bukan domain kantor. Apa yang Anda lakukan?",
    options: [
      { id: "a", text: "Lanjut mengisi, karena posternya ada di gedung kantor." },
      { id: "b", text: "Tidak melanjutkan, lalu melaporkan poster itu ke tim IT atau keamanan gedung." },
      { id: "c", text: "Mengisi survei, tetapi tanpa nama asli." },
      { id: "d", text: "Memotret posternya dan membagikannya ke grup kantor." }
    ],
    answer: "b",
    explanation: "Kode QR adalah link yang tidak terlihat, dan siapa pun bisa menempel poster. Alamat tujuan yang bukan domain kantor adalah tanda bahaya."
  },
  {
    id: "q24", type: "url", level: "sulit", cat: "domain",
    prompt: "Mana alamat yang benar-benar milik contohsejahtera.co.id?",
    options: [
      { id: "a", text: "https://contohsejahtera.co.id.portal-karyawan.com" },
      { id: "b", text: "https://contohsejahtera.co.id@portal-login.net" },
      { id: "c", text: "https://hr.portal.contohsejahtera.co.id/login" },
      { id: "d", text: "https://portal-contohsejahtera.co.id.net/login" }
    ],
    answer: "c",
    explanation: "Domain ditentukan oleh bagian paling kanan sebelum garis miring pertama. Pada opsi dengan @, semua yang ada di depan @ diabaikan browser, sehingga tujuannya portal-login.net."
  },
  {
    id: "q25", type: "scenario", level: "sulit", cat: "data",
    prompt: "Anda terlanjur mengetik password email kantor di halaman yang ternyata palsu. Apa langkah pertama?",
    options: [
      { id: "a", text: "Menunggu dan melihat apakah ada masalah." },
      { id: "b", text: "Segera mengganti password lewat situs resmi dan melapor ke tim IT." },
      { id: "c", text: "Menghapus riwayat browser." },
      { id: "d", text: "Mematikan komputer." }
    ],
    answer: "b",
    explanation: "Penipu bisa memakai password itu dalam hitungan menit. Mengganti password dan melapor cepat membantu tim IT memutus akses dan mencegah penyebaran."
  }
];
