// Telegram bot sozlamalari.
// 1) @BotFather orqali bot yarating va tokenni BOT_TOKEN ga qo'ying.
// 2) Botga o'zingiz (yoki komissiya guruhi) /start yozing, so'ng CHAT_ID ni toping
//    (https://api.telegram.org/bot<TOKEN>/getUpdates  ->  message.chat.id).
// DIQQAT: token sayt kodida ochiq turadi. Faqat shu maqsad uchun alohida bot ishlating.
// ALLOW_RETAKE: true bo'lsa, natija sahifasida "Qaytadan topshirish" tugmasi chiqadi.
// Haqiqiy imtihonda nomzodlar uchun false qiling.
window.ALLOW_RETAKE = true;

window.TG = {
  BOT_TOKEN: "",
  CHAT_ID: ""
};
