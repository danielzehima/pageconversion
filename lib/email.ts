import { Resend } from "resend";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { WHATSAPP_LINK } from "./whatsapp";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM ?? "Mémoires Intactes <onboarding@resend.dev>";

// Instancié uniquement si la clé est présente, pour ne pas crasher en dev sans config.
const resend = apiKey ? new Resend(apiKey) : null;

// Chemin du guide PDF joint à l'email, et nom propre affiché au destinataire.
const GUIDE_PDF_PATH = path.join(
  process.cwd(),
  "app",
  "assets",
  "pdf",
  "Le Guide d'Urgence _ Comment sauver vos vieilles photos de famille avant qu'elles ne s'effacent à tout jamais.pdf"
);
const GUIDE_PDF_FILENAME =
  "Guide d'Urgence - Sauver vos vieilles photos.pdf";

/** Lit le PDF du guide depuis le disque (ou null si introuvable). */
async function readGuidePdf(): Promise<Buffer | null> {
  try {
    return await readFile(GUIDE_PDF_PATH);
  } catch (e) {
    console.error("[EMAIL] Impossible de lire le PDF du guide :", e);
    return null;
  }
}

/**
 * Email envoyé au prospect avec son Guide d'Urgence.
 * (Remplacez le lien du guide par votre vrai PDF hébergé.)
 */
export async function sendGuideEmail(opts: { firstName: string; email: string }) {
  if (!resend) {
    console.warn("[EMAIL] RESEND_API_KEY absente — email non envoyé (mode dev).");
    return { skipped: true as const };
  }

  const { firstName, email } = opts;
  const pdf = await readGuidePdf();

  const html = `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1c1917;">
    <div style="background:#a86c3f;padding:28px;text-align:center;border-radius:16px 16px 0 0;">
      <h1 style="color:#fff;margin:0;font-size:22px;">Mémoires Intactes</h1>
    </div>
    <div style="background:#fbf8f3;padding:32px;border-radius:0 0 16px 16px;border:1px solid #e8d6bf;border-top:none;">
      <p style="font-size:16px;">Bonjour ${firstName},</p>
      <p style="font-size:16px;line-height:1.6;">
        Merci ! Votre <strong>Guide d'Urgence</strong> pour sauver vos vieilles
        photos de famille est <strong>en pièce jointe</strong> de cet email
        (fichier PDF) 📎
      </p>
      <div style="background:#fff;border:1px solid #e8d6bf;border-radius:10px;padding:16px;margin:24px 0;display:flex;align-items:center;gap:12px;">
        <span style="font-size:28px;">📄</span>
        <span style="font-size:15px;color:#724631;">
          ${GUIDE_PDF_FILENAME}
        </span>
      </div>
      <p style="font-size:15px;line-height:1.6;">
        Et n'oubliez pas votre <strong>bonus</strong> : un test de restauration
        numérique gratuit. Répondez simplement à cet email avec votre photo la
        plus abîmée 📸
      </p>
      <p style="font-size:14px;color:#724631;margin-top:28px;">
        À très vite,<br/>L'équipe Mémoires Intactes
      </p>
    </div>
  </div>`;

  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: `${firstName}, voici votre Guide d'Urgence pour sauver vos photos 📸`,
    html,
    attachments: pdf
      ? [{ filename: GUIDE_PDF_FILENAME, content: pdf }]
      : undefined,
  });

  if (error) {
    console.error("[EMAIL] Échec envoi guide :", error);
    return { error } as const;
  }

  console.log(`[EMAIL] Guide envoyé à ${email} ✓`);
  return { ok: true as const };
}

// Contenu des emails de relance, selon l'étape (1 = J+1, 2 = J+4).
const RELANCE_CONTENT: Record<
  1 | 2,
  { subject: (firstName: string) => string; intro: string; cta: string }
> = {
  1: {
    subject: (f) => `${f}, vous n'avez pas encore envoyé votre photo ? 📸`,
    intro:
      "Hier vous avez téléchargé le Guide d'Urgence — bravo, c'est déjà un grand pas pour vos souvenirs ! Mais vous n'avez pas encore profité de votre <strong>test de restauration gratuit</strong>. Ce serait dommage de passer à côté…",
    cta: "Envoyer ma photo maintenant",
  },
  2: {
    subject: (f) => `${f}, votre test de restauration gratuit vous attend toujours ✨`,
    intro:
      "Je voulais juste m'assurer que vous n'aviez pas oublié : votre <strong>test de restauration offert</strong> est toujours disponible. Une seule photo abîmée suffit pour voir la magie opérer — sans aucun engagement.",
    cta: "Profiter de mon test gratuit",
  },
};

/** Bloc HTML des exemples avant/après (si l'URL du site est connue). */
function relanceImagesBlock(): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) return "";
  return `
    <p style="font-size:15px;line-height:1.6;margin-top:20px;">Voici ce que je peux faire pour vos photos :</p>
    <table role="presentation" width="100%" style="margin:12px 0;"><tr>
      <td style="padding-right:6px;"><img src="${base}/exemples/restauration-1.png" alt="Avant / après" width="100%" style="border-radius:10px;display:block;"/></td>
      <td style="padding-left:6px;"><img src="${base}/exemples/restauration-2.png" alt="Avant / après" width="100%" style="border-radius:10px;display:block;"/></td>
    </tr></table>`;
}

/**
 * Email de relance automatique (séquence J+1 puis J+4).
 * @param step 1 = première relance, 2 = seconde relance.
 */
export async function sendRelanceEmail(opts: {
  firstName: string;
  email: string;
  step: 1 | 2;
}) {
  if (!resend) {
    console.warn("[EMAIL] RESEND_API_KEY absente — relance non envoyée (mode dev).");
    return { skipped: true as const };
  }

  const { firstName, email, step } = opts;
  const c = RELANCE_CONTENT[step];

  const html = `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1c1917;">
    <div style="background:#a86c3f;padding:28px;text-align:center;border-radius:16px 16px 0 0;">
      <h1 style="color:#fff;margin:0;font-size:22px;">Mémoires Intactes</h1>
    </div>
    <div style="background:#fbf8f3;padding:32px;border-radius:0 0 16px 16px;border:1px solid #e8d6bf;border-top:none;">
      <p style="font-size:16px;">Bonjour ${firstName},</p>
      <p style="font-size:16px;line-height:1.6;">${c.intro}</p>
      ${relanceImagesBlock()}
      <p style="text-align:center;margin:28px 0;">
        <a href="${WHATSAPP_LINK}" style="background:#25D366;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:bold;display:inline-block;">
          👉 ${c.cta}
        </a>
      </p>
      <p style="font-size:14px;color:#724631;margin-top:28px;">
        À très vite,<br/>L'équipe Mémoires Intactes
      </p>
    </div>
  </div>`;

  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: c.subject(firstName),
    html,
  });

  if (error) {
    console.error(`[EMAIL] Échec relance #${step} à ${email} :`, error);
    return { error } as const;
  }

  console.log(`[EMAIL] Relance #${step} envoyée à ${email} ✓`);
  return { ok: true as const };
}

/**
 * Notification interne (optionnelle) à chaque nouveau prospect.
 */
export async function notifyNewLead(opts: { firstName: string; email: string }) {
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  if (!resend || !to) return;

  await resend.emails.send({
    from,
    to,
    subject: `🎯 Nouveau prospect : ${opts.firstName}`,
    html: `<p>Nouveau lead capturé :</p>
           <ul><li><b>Prénom :</b> ${opts.firstName}</li>
           <li><b>Email :</b> ${opts.email}</li></ul>`,
  });
}
