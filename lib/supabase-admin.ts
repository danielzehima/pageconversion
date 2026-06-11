import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase avec la clé `service_role` — réservé au SERVEUR (cron, tâches admin).
 * Il IGNORE le RLS : il peut donc lire et mettre à jour la table `prospects`.
 * ⚠️ Ne JAMAIS exposer cette clé côté client.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Config admin manquante : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis."
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
