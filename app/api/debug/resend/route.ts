import { NextResponse } from "next/server";
import { Resend } from "resend";

// ⚠️ Route de DIAGNOSTIC TEMPORAIRE — à supprimer après usage.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = process.env.RESEND_API_KEY ?? "";
  const from = process.env.RESEND_FROM ?? "";
  const to = new URL(request.url).searchParams.get("to") ?? "delivered@resend.dev";

  // On n'expose JAMAIS la clé en clair, seulement des métadonnées de contrôle.
  const diag = {
    has_RESEND_API_KEY: key.length > 0,
    key_len: key.length,
    key_prefix: key.slice(0, 3),
    key_has_spaces: /\s/.test(key),
    RESEND_FROM_raw: from,
    from_has_quotes: from.includes('"'),
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? null,
  };

  let send: unknown = null;
  try {
    const resend = new Resend(key);
    send = await resend.emails.send({
      from,
      to,
      subject: "Debug Resend prod",
      html: "<p>debug</p>",
    });
  } catch (e) {
    send = { thrown: String(e) };
  }

  return NextResponse.json({ diag, send });
}
