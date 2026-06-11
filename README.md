# Guide d'Urgence — Landing page de capture (Lead Magnet)

Landing page Next.js (App Router) à haute conversion : guide gratuit sur la
restauration de vieilles photos + upsell WhatsApp.

## Démarrer

```bash
npm install
npm run dev
```

Ouvrir http://localhost:3000

## Configuration (.env.local)

Le projet est déjà branché sur **Supabase** (table `prospects`) et **Resend**.
Avant de lancer en production, complétez `.env.local` :

| Variable | État | Action |
|----------|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ rempli | projet « demeure » |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ rempli | clé publishable (insert-only via RLS) |
| `RESEND_API_KEY` | 🔧 **à remplir** | votre clé sur https://resend.com/api-keys |
| `RESEND_FROM` | ✅ rempli | `noreply@digit-agence.com` (domaine vérifié) |
| `LEAD_NOTIFICATION_EMAIL` | ⚪ optionnel | reçoit un mail à chaque nouveau prospect |

> Sans `RESEND_API_KEY`, le lead est **quand même enregistré** dans Supabase ;
> seul l'email est ignoré (avec un warning en console).

Le **guide PDF** (`app/assets/pdf/…`) est envoyé en **pièce jointe** de l'email
de bienvenue (lu via `fs` dans `lib/email.ts`, inclus dans le bundle prod via
`outputFileTracingIncludes` de `next.config.mjs`). Pour changer de guide,
remplacez le fichier et ajustez `GUIDE_PDF_PATH` dans `lib/email.ts`.

## Reste à personnaliser

1. **Numéro WhatsApp** — déjà défini dans `components/SuccessState.tsx`
   (`WHATSAPP_NUMBER = "2250710075257"`).
2. **Marque** — nom « Mémoires Intactes » dans `app/page.tsx` et `app/layout.tsx`.

## Base de données

Table `public.prospects` (Supabase, projet « demeure ») :

```
id          uuid (pk)
first_name  text
email       text
source      text   -- 'guide-restauration-photos'
created_at  timestamptz
```

RLS activé : le rôle public (`anon`) peut **insérer** mais **pas lire** —
consultez les prospects depuis le dashboard Supabase ou avec la service role key.
Index unique sur `(lower(email), source)` → pas de doublons.

## Architecture

```
app/
  layout.tsx        — fonts (Inter + Playfair), métadonnées SEO
  page.tsx          — structure de page (header/footer) + orchestrateur
  actions.ts        — Server Action : validation + insert Supabase + email Resend
  globals.css       — Tailwind + texture papier
lib/
  supabase.ts       — client Supabase (insert-only via RLS)
  email.ts          — envoi du guide + notification interne (Resend)
components/
  ConversionExperience.tsx — bascule état initial ⇄ succès (client)
  LeadForm.tsx             — formulaire (useActionState)
  SubmitButton.tsx         — bouton avec état pending (useFormStatus)
  Benefits.tsx             — puces bénéfices
  SuccessState.tsx         — écran de remerciement + CTA WhatsApp
```

## Stack

Next.js 15 · React 19 · Tailwind CSS 3 · lucide-react · Server Actions
