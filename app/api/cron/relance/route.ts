import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { sendRelanceEmail } from "@/lib/email";

// Toujours exécuté à la demande (pas de cache).
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Cadence des relances (en jours).
const RELANCE_1_AFTER_DAYS = 1; // J+1 après l'inscription
const RELANCE_2_AFTER_DAYS = 3; // 3 jours après la 1re relance (≈ J+4)

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Tâche planifiée (Vercel Cron, 1×/jour) qui envoie les relances :
 *  - Relance #1 : prospects inscrits il y a ≥ 1 jour, jamais relancés.
 *  - Relance #2 : prospects relancés une fois, dont la 1re relance date de ≥ 3 jours.
 * Protégée par CRON_SECRET (Vercel l'envoie dans l'en-tête Authorization).
 */
export async function GET(request: Request) {
  // 1. Authentification du cron
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const now = Date.now();
  const results = { relance1: 0, relance2: 0, errors: 0 };

  // 2. Relance #1
  const cutoff1 = new Date(now - RELANCE_1_AFTER_DAYS * DAY_MS).toISOString();
  const { data: batch1, error: err1 } = await supabase
    .from("prospects")
    .select("id, first_name, email")
    .eq("relance_count", 0)
    .lte("created_at", cutoff1);

  if (err1) {
    console.error("[CRON] Lecture relance #1 échouée :", err1);
    return NextResponse.json({ error: err1.message }, { status: 500 });
  }

  for (const p of batch1 ?? []) {
    try {
      await sendRelanceEmail({ firstName: p.first_name, email: p.email, step: 1 });
      await supabase
        .from("prospects")
        .update({ relance_count: 1, last_relance_at: new Date().toISOString() })
        .eq("id", p.id);
      results.relance1++;
    } catch (e) {
      console.error("[CRON] Erreur relance #1 :", e);
      results.errors++;
    }
  }

  // 3. Relance #2
  const cutoff2 = new Date(now - RELANCE_2_AFTER_DAYS * DAY_MS).toISOString();
  const { data: batch2, error: err2 } = await supabase
    .from("prospects")
    .select("id, first_name, email")
    .eq("relance_count", 1)
    .lte("last_relance_at", cutoff2);

  if (err2) {
    console.error("[CRON] Lecture relance #2 échouée :", err2);
    return NextResponse.json({ error: err2.message }, { status: 500 });
  }

  for (const p of batch2 ?? []) {
    try {
      await sendRelanceEmail({ firstName: p.first_name, email: p.email, step: 2 });
      await supabase
        .from("prospects")
        .update({ relance_count: 2, last_relance_at: new Date().toISOString() })
        .eq("id", p.id);
      results.relance2++;
    } catch (e) {
      console.error("[CRON] Erreur relance #2 :", e);
      results.errors++;
    }
  }

  console.log("[CRON] Relances terminées :", results);
  return NextResponse.json({ ok: true, ...results });
}
