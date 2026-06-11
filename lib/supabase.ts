import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Variables Supabase manquantes : renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local"
  );
}

/**
 * Client Supabase côté serveur (utilisé dans la Server Action).
 * La clé anon n'a le droit que d'INSÉRER dans `prospects` (RLS),
 * jamais de lire — aucune donnée ne fuit côté client.
 */
export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
});

export type ProspectInsert = {
  first_name: string;
  email: string;
  source?: string;
};
