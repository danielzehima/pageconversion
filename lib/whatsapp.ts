// 🔧 Numéro WhatsApp au format international SANS "+" ni espaces (ex. "2250710075257").
export const WHATSAPP_NUMBER = "2250710075257";

export const WHATSAPP_MESSAGE =
  "Bonjour ! Je viens de télécharger votre Guide d'Urgence et je souhaite profiter du test de restauration gratuit. Voici ma photo la plus abîmée :";

export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;
