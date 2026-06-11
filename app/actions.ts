"use server";

import { supabase } from "@/lib/supabase";
import { sendGuideEmail, notifyNewLead } from "@/lib/email";

export type LeadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: {
    firstName?: string;
    email?: string;
  };
  // On renvoie le prénom pour personnaliser l'écran de succès
  firstName?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SOURCE = "guide-restauration-photos";

/**
 * Server Action de capture du lead.
 * 1. Valide les données (prénom + email).
 * 2. Enregistre le prospect dans Supabase (table `prospects`).
 * 3. Envoie le guide par email (Resend) + notifie en interne.
 * 4. Retourne un statut au client.
 */
export async function submitLead(
  _prevState: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  // 1. Validation
  const errors: LeadFormState["errors"] = {};

  if (!firstName || firstName.length < 2) {
    errors.firstName = "Merci d'indiquer votre prénom.";
  }
  if (!email) {
    errors.email = "L'adresse e-mail est requise.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Cette adresse e-mail ne semble pas valide.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Veuillez corriger les champs indiqués.",
      errors,
    };
  }

  // 2. Enregistrement dans Supabase
  const { error: dbError } = await supabase
    .from("prospects")
    .insert({ first_name: firstName, email, source: SOURCE });

  // Code 23505 = violation de contrainte unique => l'email existe déjà.
  // On traite ce cas comme un succès (le prospect est déjà dans la liste).
  if (dbError && dbError.code !== "23505") {
    console.error("[SUPABASE] Échec insertion prospect :", dbError);
    return {
      status: "error",
      message:
        "Une erreur est survenue lors de l'enregistrement. Merci de réessayer.",
    };
  }

  const alreadyExists = dbError?.code === "23505";

  // 3. Emails (uniquement pour un nouveau prospect ; on n'attend pas l'échec email
  //    pour bloquer l'utilisateur, mais on logge).
  try {
    if (!alreadyExists) {
      await Promise.all([
        sendGuideEmail({ firstName, email }),
        notifyNewLead({ firstName, email }),
      ]);
    }
  } catch (e) {
    console.error("[EMAIL] Erreur lors de l'envoi :", e);
    // On ne bloque pas : le lead est sauvegardé, l'email pourra être renvoyé.
  }

  console.log(
    `[LEAD] ${alreadyExists ? "déjà connu" : "nouveau"} -> ${firstName} <${email}>`
  );

  // 4. Succès
  return {
    status: "success",
    firstName,
  };
}
