// Imtihon savollari. Tahrirlash uchun faqat shu faylni o'zgartiring.
// correct — to'g'ri variantning indeksi (0 dan boshlanadi).
window.EXAM = {
  title: "Yangi filial rahbari imtihoni",
  passPercent: 70,
  timeMinutes: 45,
  topics: {
    leadership: "Liderlik va jamoa",
    finance: "Moliya va byudjet",
    sales: "Sotuv va marketing",
    ops: "Operatsion boshqaruv"
  },
  questions: [
    // ---------- Liderlik ----------
    { topic: "leadership", q: "Jamoadagi ikki yetakchi xodim o'rtasida mojaro chiqdi va ish sifati pasaymoqda. Birinchi qadamingiz?",
      options: ["Ikkalasini ham ogohlantirib, jarima qo'llayman", "Har biri bilan alohida, so'ng birgalikda gaplashib, muammo ildizini aniqlayman", "Mojaro o'z-o'zidan hal bo'lishini kutaman", "Bittasini boshqa filialga o'tkazaman"], correct: 1 },
    { topic: "leadership", q: "Yangi filialda birinchi 30 kunda rahbarning eng muhim vazifasi qaysi?",
      options: ["Barcha jarayonlarni o'zi bajarish", "Aniq maqsad, rol va qoidalarni jamoaga tushuntirish va ishonch qurish", "Xarajatlarni maksimal qisqartirish", "Bosh ofisga kunlik hisobot yozish"], correct: 1 },
    { topic: "leadership", q: "Xodim vazifani muddatida bajarmadi. Eng samarali yondashuv?",
      options: ["Jamoa oldida tanqid qilish", "Sababini aniqlash, kutilmani qayta kelishish, kerak bo'lsa yordam berish", "Vazifani boshqaga berib, indamaslik", "Darhol ishdan bo'shatish"], correct: 1 },
    { topic: "leadership", q: "Vakolat berish (delegatsiya) haqida qaysi fikr to'g'ri?",
      options: ["Rahbar muhim ishlarni faqat o'zi qilishi kerak", "Natija va mas'uliyat aniq belgilansa, vakolat berish jamoani o'stiradi", "Vakolat berilsa, nazorat butunlay to'xtatiladi", "Vakolat faqat eng tajribali xodimga beriladi"], correct: 1 },
    { topic: "leadership", q: "Jamoani yollashda eng to'g'ri mezon qaysi?",
      options: ["Tanish-bilishlik", "Eng past maosh so'ragan nomzod", "Kompetensiya, qadriyatlarga mosligi va o'sish salohiyati", "Faqat diplom"], correct: 2 },

    // ---------- Moliya ----------
    { topic: "finance", q: "Oylik doimiy xarajat 40 mln so'm, mahsulot marjasi 40%. Zararsizlik nuqtasi (oylik tushum) qancha?",
      options: ["40 mln", "80 mln", "100 mln", "160 mln"], correct: 2 },
    { topic: "finance", q: "Yangi filial uchun byudjet tuzishda birinchi navbatda nima hisobga olinadi?",
      options: ["Faqat kutilayotgan foyda", "Ochilish xarajatlari, doimiy va o'zgaruvchan xarajatlar hamda daromadga chiqish muddati", "Raqobatchining byudjeti", "Faqat ijara narxi"], correct: 1 },
    { topic: "finance", q: "Pul oqimi (cash flow) nima uchun foydadan ham muhimroq bo'lishi mumkin?",
      options: ["Chunki foyda hisobotda ko'rinmaydi", "Foydali biznes ham naqd pul yetishmasa to'lovlarni to'lay olmay qolishi mumkin", "Chunki soliq faqat pul oqimiga qarab olinadi", "Ular bir xil narsa"], correct: 1 },
    { topic: "finance", q: "Marja va ustama (markup) farqi haqida qaysi javob to'g'ri? (Tannarx 80, sotuv narxi 100)",
      options: ["Marja 25%, ustama 20%", "Marja 20%, ustama 25%", "Ikkalasi 20%", "Ikkalasi 25%"], correct: 1 },
    { topic: "finance", q: "Filial rejadagi tushumning 60% ini qilmoqda, xarajatlar esa rejada. Birinchi harakatingiz?",
      options: ["Barcha xodimlarning maoshini kamaytirish", "Sabablarni tahlil qilish (trafik, konversiya, o'rtacha chek), so'ng tuzatuvchi reja tuzish", "Reklama byudjetini to'liq to'xtatish", "Rejani yashirib, keyingi oyni kutish"], correct: 1 },

    // ---------- Sotuv va marketing ----------
    { topic: "sales", q: "Yangi hududda brend tanilmagan. Dastlabki eng samarali qadam?",
      options: ["Narxni raqobatchidan ancha pasaytirish", "Maqsadli auditoriyani aniqlab, mahalliy kanallar orqali tanishtirish va birinchi mijozlarni jalb qilish", "Faqat katta reklama bannerlari", "Hech narsa qilmay, og'zaki xabarni kutish"], correct: 1 },
    { topic: "sales", q: "Konversiya 5%, kuniga 200 tashrif. Kuniga nechta xarid kutiladi?",
      options: ["5", "10", "20", "40"], correct: 1 },
    { topic: "sales", q: "Mijozni saqlab qolish (retention) nima uchun muhim?",
      options: ["Yangi mijoz jalb qilish odatda mavjud mijozni saqlashdan qimmatroq", "Mavjud mijozlar hech qachon ketmaydi", "Marketing kerak bo'lmay qoladi", "Narxni oshirish mumkin bo'ladi"], correct: 0 },
    { topic: "sales", q: "Mijoz shikoyat bilan keldi, shikoyat qisman asossiz. Qanday yo'l tutasiz?",
      options: ["Mijozning noto'g'ri ekanini isbotlayman", "Tinglayman, hamdardlik bildiraman, faktlarni tekshirib, adolatli yechim taklif qilaman", "E'tibor bermayman", "Darhol pulni qaytaraman, so'ramasdan"], correct: 1 },
    { topic: "sales", q: "Marketing kampaniyasi natijasini o'lchash uchun eng to'g'ri ko'rsatkich?",
      options: ["Ijtimoiy tarmoqdagi layklar soni", "Bir mijozni jalb qilish narxi (CAC) va undan olingan daromad", "Reklama ko'rilgan soni", "Reklama byudjeti hajmi"], correct: 1 },

    // ---------- Operatsion ----------
    { topic: "ops", q: "Filial ochishdan oldin eng muhim tayyorgarlik bosqichi qaysi?",
      options: ["Dizayn va ochilish marosimi", "Joylashuv tahlili, litsenziya/ruxsatnomalar, jarayon va xodimlar tayyorligi", "Faqat ijara shartnomasi", "Ijtimoiy tarmoq sahifasi"], correct: 1 },
    { topic: "ops", q: "Jarayonlar barqaror ishlashi uchun nima kerak?",
      options: ["Rahbarning doimiy aralashuvi", "Yozilgan standartlar (SOP), o'qitish va muntazam nazorat", "Xodimlarning tajribasiga to'liq tayanish", "Faqat jarima tizimi"], correct: 1 },
    { topic: "ops", q: "Asosiy yetkazib beruvchi yetkazishni kechiktirdi, ombor 2 kunga yetadi. Nima qilasiz?",
      options: ["Kutaman, hammasi o'zi hal bo'ladi", "Muqobil yetkazib beruvchiga murojaat qilaman, mijozlarni ogohlantiraman va kelajak uchun zaxira rejasini tuzaman", "Sotuvni to'xtatib qo'yaman", "Sifatsiz bo'lsa ham arzon tovar sotib olaman"], correct: 1 },
    { topic: "ops", q: "Filial samaradorligini kuzatish uchun qaysi to'plam to'g'ri?",
      options: ["Faqat tushum", "Tushum, foyda, mijoz mamnunligi, xodimlar aylanmasi va jarayon sifati ko'rsatkichlari", "Faqat xodimlar soni", "Faqat xarajatlar"], correct: 1 },
    { topic: "ops", q: "Xavfsizlik qoidasi buzilgani aniqlandi, lekin bu eng yaxshi xodimingiz. Nima qilasiz?",
      options: ["Yaxshi xodim uchun istisno qilaman", "Qoida hamma uchun bir xil: voqeani tekshirib, choralarni ko'raman va qayta takrorlanmasligini ta'minlayman", "Hech kimga aytmayman", "Darhol ishdan bo'shataman, tekshirmasdan"], correct: 1 }
  ],

  // Ochiq keys-savollar: qo'lda baholanadi (1-5 ball)
  cases: [
    { topic: "leadership", q: "Siz yangi filialga rahbar etib tayinlandingiz. Jamoa 8 kishidan iborat, ularning yarmi bir-birini tanimaydi. Birinchi 2 haftalik rejangizni yozing." },
    { topic: "finance", q: "Filial ochish uchun sizga 300 mln so'm byudjet ajratildi. Uni qanday taqsimlaysiz va qancha vaqtda daromadga chiqishni rejalashtirasiz? Asoslang." },
    { topic: "sales", q: "Yangi hududda raqobatchi allaqachon 2 yildan beri ishlamoqda va ancha past narx qo'yadi. Siz mijozlarni qanday jalb qilasiz?" },
    { topic: "ops", q: "Ochilgandan 1 oy o'tib, mijozlar navbat va sekin xizmatdan shikoyat qilmoqda, xodimlar esa charchaganini aytmoqda. Vaziyatni qanday hal qilasiz?" }
  ]
};
