/* ==========================================================================
   Email untuk simulasi inbox ("Spot the Phish").
   Semua brand, orang, dan domain di sini FIKTIF. Link tidak pernah dibuka.

   Struktur satu email:
   {
     id:        kode unik, misalnya "e13"
     phishing:  true | false
     context:   (opsional) kalimat konteks yang ditampilkan di atas email
     from:      { name, address, flag? }
     replyTo:   (opsional) alamat balasan
     returnPath:(opsional) alamat Return-Path
     date:      teks tanggal
     subject:   { text, flag? }
     body:      daftar blok, berurutan:
                  { text: "..." }                          paragraf
                  { link: "teks", url: "...", button: true } link (button = tampil sebagai tombol)
     attachments: (opsional) [{ name, size, flag? }]
     safeReason:  (email aman) alasan email ini aman
     lesson:      satu kalimat pelajaran utama
   }
   flag = { cat: kunci kategori di data/questions.js, note: "penjelasan" }
   Bagian apa pun (from, subject, blok body, lampiran) boleh punya flag.
   Tulis {nama} di teks untuk diganti nama pengguna (atau "Rekan").
   ========================================================================== */
window.GRINTEC_RECIPIENT = "anda@contohsejahtera.co.id";

window.GRINTEC_EMAILS = [
  {
    id: "e01",
    phishing: true,
    from: { name: "KirimCepat Express", address: "info@kirimcepat-delivery.net",
      flag: { cat: "domain", note: "Domain resmi KirimCepat adalah kirimcepat.co.id. Alamat ini memakai kirimcepat-delivery.net." } },
    replyTo: "cs.kirimcepat@mailbox-pro.net",
    returnPath: "bounce@srv3.mailbox-pro.net",
    date: "Sen, 3 Nov 2026, 08.12",
    subject: { text: "Paket Anda tertahan: konfirmasi dalam 24 jam",
      flag: { cat: "urgensi", note: "Batas 24 jam dibuat agar Anda segera membayar tanpa mengecek." } },
    body: [
      { text: "Pelanggan Yth.,",
        flag: { cat: "salam", note: "Tidak menyebut nama Anda, padahal kurir asli mencantumkan nama penerima." } },
      { text: "Paket dengan nomor resi KC88213 tidak dapat diantar karena alamat kurang lengkap. Paket akan dikembalikan ke pengirim jika biaya kirim ulang Rp12.500 tidak dibayar dalam 24 jam." },
      { text: "Siapkan nomor kartu debit atau kredit beserta kode CVV untuk pembayaran.",
        flag: { cat: "data", note: "CVV kartu tidak boleh diberikan ke halaman yang Anda buka dari email." } },
      { link: "Atur ulang pengiriman", url: "http://kirimcepat-delivery.net/bayar?id=KC88213", button: true,
        flag: { cat: "link", note: "Tombol menuju kirimcepat-delivery.net, bukan situs resmi kurir." } },
      { text: "Salam,\nTim Layanan KirimCepat" }
    ],
    lesson: "Biaya kecil itu dipakai sebagai umpan, jadi cek status paket langsung di aplikasi atau situs resmi kurir."
  },
  {
    id: "e02",
    phishing: false,
    from: { name: "Tim HR Contoh Sejahtera", address: "hr@contohsejahtera.co.id" },
    returnPath: "hr@contohsejahtera.co.id",
    date: "Sen, 3 Nov 2026, 07.30",
    subject: { text: "Slip gaji Oktober 2026 sudah tersedia" },
    body: [
      { text: "Halo {nama}," },
      { text: "Slip gaji bulan Oktober 2026 sudah bisa dilihat di portal HR. Seperti biasa, login memakai akun kantor Anda." },
      { link: "hr.contohsejahtera.co.id/slip", url: "https://hr.contohsejahtera.co.id/slip" },
      { text: "Jika ada pertanyaan, hubungi tim HR di ekstensi 210.\n\nSalam,\nTim HR" }
    ],
    safeReason: "Pengirim memakai domain kantor yang benar, link menuju subdomain kantor sendiri dan teksnya sama dengan alamat aslinya, tidak ada desakan, dan tidak meminta password lewat email.",
    lesson: "Email asli tetap bisa berisi link, jadi pastikan alamat tujuannya domain yang Anda kenal. Lebih aman lagi, buka portal HR dari bookmark."
  },
  {
    id: "e03",
    phishing: true,
    from: { name: "IT Helpdesk", address: "it-helpdesk@contohsejahtera-support.com",
      flag: { cat: "domain", note: "Tim IT kantor memakai contohsejahtera.co.id. Domain ini menambahkan \"-support.com\"." } },
    replyTo: "it-helpdesk@contohsejahtera-support.com",
    returnPath: "mailer@bulk-send.click",
    date: "Jum, 31 Okt 2026, 16.47",
    subject: { text: "Password Anda kedaluwarsa hari ini",
      flag: { cat: "urgensi", note: "\"Hari ini\" membuat Anda merasa harus bertindak sebelum pulang kerja." } },
    body: [
      { text: "Halo pengguna," },
      { text: "Password AkunKerja 365 Anda akan kedaluwarsa pukul 17.00 hari ini. Untuk tetap memakai password lama, konfirmasi melalui tombol di bawah." },
      { link: "Pertahankan password saat ini", url: "https://akunkerja365.login-portal-verify.com/keep", button: true,
        flag: { cat: "link", note: "Alamat aslinya login-portal-verify.com. Kata \"akunkerja365\" di depannya hanya subdomain yang bisa dibuat siapa saja." } },
      { text: "Anda akan diminta memasukkan password lama dan password baru.",
        flag: { cat: "data", note: "Halaman yang meminta password lama adalah cara mencuri password Anda." } },
      { text: "Terima kasih,\nIT Helpdesk" }
    ],
    lesson: "Ganti password hanya lewat menu resmi di aplikasi atau situs yang Anda buka sendiri, bukan dari link email."
  },
  {
    id: "e04",
    phishing: false,
    context: "Kemarin Anda memang memesan headset di TokoLaris.",
    from: { name: "TokoLaris", address: "pesanan@tokolaris.co.id" },
    returnPath: "bounce@mail.tokolaris.co.id",
    date: "Jum, 31 Okt 2026, 10.05",
    subject: { text: "Pesanan #TL-2611-0457 sedang dikemas" },
    body: [
      { text: "Hai {nama}," },
      { text: "Pesanan Anda (Headset nirkabel, 1 barang) sudah dibayar dan sedang dikemas oleh penjual. Nomor resi akan dikirim setelah paket diserahkan ke kurir." },
      { link: "Lihat status pesanan", url: "https://www.tokolaris.co.id/pesanan/TL-2611-0457", button: true },
      { text: "TokoLaris tidak pernah meminta password, PIN, atau kode OTP Anda." }
    ],
    safeReason: "Isinya cocok dengan belanja yang memang Anda lakukan, domain pengirim dan link sama-sama tokolaris.co.id, dan tidak ada permintaan pembayaran ulang atau data rahasia.",
    lesson: "Email yang sesuai dengan tindakan Anda sendiri dan berasal dari domain yang benar umumnya aman."
  },
  {
    id: "e05",
    phishing: true,
    from: { name: "Bank Nusantara Raya", address: "hadiah@nusantararaya-undian.com",
      flag: { cat: "domain", note: "Bukan domain bank. Bank memakai nusantararaya.co.id." } },
    replyTo: "klaim.hadiah.nrr@mailbox-pro.net",
    returnPath: "bounce@mailbox-pro.net",
    date: "Kam, 30 Okt 2026, 13.20",
    subject: { text: "SELAMAT!!! Anda pemenang undian HUT ke-30" },
    body: [
      { text: "Kepada Pemenang Yth.,",
        flag: { cat: "salam", note: "Penyelenggara undian asli tahu nama pemenangnya." } },
      { text: "Selamat, nomor rekening anda terpilih sebagai pemenang hadiah uang tunai Rp25.000.000 dalam rangka HUT ke-30 Bank Nusantara Raya. Hadiah akan segera di transfer setelah proses klaim selesai.",
        flag: { cat: "bahasa", note: "\"anda\" dengan huruf kecil dan \"di transfer\" dipisah. Bank biasanya memeriksa tulisan sebelum dikirim." } },
      { text: "Untuk klaim, kirim foto KTP dan transfer biaya administrasi serta pajak hadiah sebesar Rp1.250.000 ke rekening panitia di bawah ini.",
        flag: { cat: "transfer", note: "Undian asli tidak meminta pemenang membayar. Permintaan foto KTP juga bisa dipakai untuk penipuan lain." } },
      { text: "Panitia Undian HUT ke-30" }
    ],
    lesson: "Jika Anda tidak pernah ikut undian, Anda tidak mungkin menang. Hadiah yang harus ditebus dengan uang adalah penipuan."
  },
  {
    id: "e06",
    phishing: true,
    from: { name: "Hendra Wijaya", address: "hendra.wijaya@contohsejahtera-co.com",
      flag: { cat: "domain", note: "Domain kantor adalah contohsejahtera.co.id, bukan contohsejahtera-co.com." } },
    replyTo: "hendra.wijaya.dir@mailbox-pro.net",
    returnPath: "bounce@mailbox-pro.net",
    date: "Kam, 30 Okt 2026, 09.02",
    subject: { text: "Rahasia: pembayaran vendor hari ini",
      flag: { cat: "urgensi", note: "\"Rahasia\" dan \"hari ini\" dipakai agar Anda tidak bertanya ke orang lain." } },
    body: [
      { text: "{nama}, saya sedang di perjalanan dinas dan sulit dihubungi." },
      { text: "Tolong proses pembayaran ke vendor baru kita sebesar Rp186.400.000 hari ini juga. Rekening tujuan ada di bawah. Ini terkait akuisisi, jadi jangan dibahas dengan tim lain dulu.",
        flag: { cat: "transfer", note: "Transfer besar ke rekening baru tanpa prosedur persetujuan, dengan permintaan dirahasiakan. Ini pola BEC atau penipuan mengatasnamakan atasan." } },
      { text: "Bank Sentosa Abadi, a.n. PT Mitra Global Niaga, No. rek 7710 2289 4410" },
      { text: "Kabari saya lewat email ini saja kalau sudah.\n\nHendra Wijaya\nDirektur Keuangan" }
    ],
    lesson: "Konfirmasi setiap permintaan transfer lewat telepon ke nomor yang sudah Anda simpan dan ikuti prosedur keuangan, meskipun pengirimnya tampak seperti direktur."
  },
  {
    id: "e07",
    phishing: false,
    context: "PT Sinar Kemas Indo adalah vendor rutin kantor Anda dan selalu mengirim tagihan di awal bulan.",
    from: { name: "Finance PT Sinar Kemas Indo", address: "finance@sinarkemasindo.co.id" },
    returnPath: "finance@sinarkemasindo.co.id",
    date: "Rab, 29 Okt 2026, 11.15",
    subject: { text: "Tagihan November 2026 untuk PO 4471" },
    body: [
      { text: "Selamat siang {nama}," },
      { text: "Terlampir tagihan bulan November 2026 untuk PO 4471. Pembayaran ke rekening yang sama seperti di kontrak, tidak ada perubahan." },
      { text: "Jatuh tempo mengikuti termin biasa, 30 hari setelah tagihan diterima." },
      { text: "Terima kasih,\nRatna\nFinance PT Sinar Kemas Indo\n(021) 555 0147" }
    ],
    attachments: [{ name: "INV-SKI-1126.pdf", size: "182 KB" }],
    safeReason: "Domain vendor sama seperti biasanya, lampiran berupa PDF yang memang ditunggu, rekening tidak berubah, dan tenggat mengikuti termin normal tanpa desakan.",
    lesson: "Tagihan rutin itu wajar, sedangkan yang patut dicurigai adalah perubahan rekening yang mendadak. Bila itu terjadi, konfirmasi lewat telepon."
  },
  {
    id: "e08",
    phishing: true,
    from: { name: "e-Lapor Pajak Nusantara", address: "noreply@elapor-pajaknusantara.info",
      flag: { cat: "domain", note: "Layanan pemerintah tidak memakai domain .info. Periksa selalu akhiran domainnya." } },
    returnPath: "bounce@mass-mailer.info",
    date: "Sel, 28 Okt 2026, 15.40",
    subject: { text: "Pemberitahuan sanksi keterlambatan SPT Tahunan",
      flag: { cat: "urgensi", note: "Ancaman sanksi dan denda membuat orang langsung membuka lampiran." } },
    body: [
      { text: "Yth. Wajib Pajak,",
        flag: { cat: "salam", note: "Tidak menyebut nama atau nomor wajib pajak Anda." } },
      { text: "Berdasarkan data kami, SPT Tahunan Anda belum diterima. Anda dikenakan sanksi administrasi. Rincian sanksi dan formulir keberatan terlampir. Mohon diproses paling lambat 3 hari." },
      { text: "Hormat kami,\nLayanan e-Lapor Pajak" }
    ],
    attachments: [{ name: "Surat_Teguran_SPT.zip", size: "1,4 MB",
      flag: { cat: "lampiran", note: "Surat resmi tidak dikirim dalam file .zip. File arsip sering dipakai untuk menyembunyikan program jahat." } }],
    lesson: "Cek status pajak hanya lewat situs atau aplikasi resmi yang Anda buka sendiri. Jangan buka lampiran arsip dari email tak terduga."
  },
  {
    id: "e09",
    phishing: false,
    from: { name: "Tim IT Contoh Sejahtera", address: "it@contohsejahtera.co.id" },
    returnPath: "it@contohsejahtera.co.id",
    date: "Sel, 28 Okt 2026, 09.00",
    subject: { text: "Pemeliharaan server email, Sabtu 8 November pukul 22.00" },
    body: [
      { text: "Halo semua," },
      { text: "Server email kantor akan menjalani pemeliharaan rutin pada Sabtu, 8 November 2026, pukul 22.00 sampai 24.00 WIB. Selama waktu itu email mungkin terlambat masuk." },
      { text: "Tidak ada tindakan yang perlu Anda lakukan. Tim IT tidak akan pernah meminta password Anda lewat email atau telepon." },
      { text: "Terima kasih,\nTim IT" }
    ],
    safeReason: "Domain kantor yang benar, tidak ada link atau lampiran, tidak meminta tindakan apa pun, dan justru mengingatkan agar password tidak dibagikan. Salam \"Halo semua\" wajar untuk pengumuman ke seluruh karyawan.",
    lesson: "Salam umum tidak otomatis berarti phishing. Lihat keseluruhan email: siapa pengirimnya dan apa yang diminta."
  },
  {
    id: "e10",
    phishing: true,
    from: { name: "Jaminan Sehat Nasional", address: "layanan@jsn-iuran.org",
      flag: { cat: "domain", note: "Domain .org yang tidak dikenal, bukan alamat resmi penyelenggara jaminan kesehatan." } },
    returnPath: "bounce@perbarui-jsn.site",
    date: "Sen, 27 Okt 2026, 19.25",
    subject: { text: "Kepesertaan Anda dinonaktifkan, segera perbarui data" },
    body: [
      { text: "Peserta Yth.," },
      { text: "Kepesertaan anda telah di nonaktifkan sementara karena data tidak lengkap. Segera lakukan pembaruan supaya layanan kesehatan bisa digunakan kembali.",
        flag: { cat: "bahasa", note: "\"anda\" huruf kecil dan \"di nonaktifkan\" dipisah. Kalimatnya juga mendesak tanpa rincian yang jelas." } },
      { text: "Data yang dibutuhkan: NIK, nama ibu kandung, nomor rekening, dan foto kartu peserta.",
        flag: { cat: "data", note: "Nama ibu kandung dan nomor rekening sering dipakai untuk membobol akun bank." } },
      { link: "Portal Peserta Resmi", url: "http://perbarui-jsn.site/form", button: true,
        flag: { cat: "link", note: "Teks tombol bertuliskan \"resmi\", tetapi alamatnya perbarui-jsn.site." } }
    ],
    lesson: "Cek status kepesertaan lewat aplikasi atau kantor layanan resmi. Data seperti nama ibu kandung jangan diisi di formulir dari email."
  },
  {
    id: "e11",
    phishing: false,
    context: "Kantor Anda memakai layanan email AkunKerja 365. Tadi pagi Anda login dari laptop baru.",
    from: { name: "AkunKerja 365", address: "no-reply@akunkerja365.com" },
    returnPath: "no-reply@akunkerja365.com",
    date: "Sen, 27 Okt 2026, 08.03",
    subject: { text: "Login baru ke akun Anda" },
    body: [
      { text: "Halo {nama}," },
      { text: "Kami mendeteksi login baru ke akun AkunKerja 365 Anda dari perangkat Windows di Jakarta, pukul 07.58 WIB." },
      { text: "Jika itu Anda, abaikan email ini. Jika bukan, buka aplikasi AkunKerja atau ketik akunkerja365.com di browser, lalu ganti password Anda dari menu Keamanan." },
      { text: "Tim Keamanan AkunKerja 365" }
    ],
    safeReason: "Email muncul karena tindakan Anda sendiri, domainnya benar, tidak ada link atau lampiran, dan Anda diarahkan untuk membuka aplikasi sendiri bila ada masalah.",
    lesson: "Notifikasi keamanan yang asli menyarankan Anda membuka aplikasi atau situs resmi sendiri, tanpa mendesak Anda mengklik link."
  },
  {
    id: "e12",
    phishing: true,
    from: { name: "AkunKerja Docs", address: "notifikasi@docs-share-akunkerja.com",
      flag: { cat: "domain", note: "Notifikasi berbagi dokumen yang asli dikirim dari akunkerja365.com." } },
    returnPath: "bounce@share-file.co",
    date: "Sab, 25 Okt 2026, 21.10",
    subject: { text: "Rina (Keuangan) membagikan \"Revisi_Gaji_2027.xlsx\" dengan Anda",
      flag: { cat: "urgensi", note: "Topik gaji memancing rasa penasaran. Dikirim malam hari pada akhir pekan, saat orang kurang teliti." } },
    body: [
      { text: "Rina dari Keuangan membagikan dokumen dengan Anda." },
      { text: "\"Mohon dicek sebelum Senin, jangan disebarkan dulu ya.\"" },
      { link: "Buka dokumen", url: "https://akunkerja365-docs.share-file.co/login?doc=88412", button: true,
        flag: { cat: "link", note: "Alamatnya share-file.co. Bagian \"akunkerja365-docs\" hanya subdomain." } },
      { text: "Anda perlu login ulang untuk membuka dokumen yang dibagikan.",
        flag: { cat: "data", note: "Halaman \"login ulang\" setelah klik link adalah cara klasik mencuri password." } }
    ],
    lesson: "Jika rekan membagikan dokumen, buka dari aplikasi dokumen kantor Anda sendiri, atau tanyakan langsung kepada rekan tersebut."
  }
];
