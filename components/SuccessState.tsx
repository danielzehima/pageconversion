import Image from "next/image";
import { Sun, Send, Sparkles } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/whatsapp";

const STEPS = [
  "Prenez en photo votre tirage original le plus abîmé avec votre smartphone (placez-vous près d'une fenêtre pour avoir une bonne lumière).",
  "Cliquez sur le bouton ci-dessous pour m'envoyer la photo directement sur mon WhatsApp privé.",
  "Laissez-moi opérer la magie. Je vous renvoie un aperçu du résultat bluffant d'ici 24h à 48h !",
];

type SuccessStateProps = {
  firstName?: string;
};

export default function SuccessState({ firstName }: SuccessStateProps) {
  return (
    <div className="animate-fade-up rounded-3xl border border-sepia-200 bg-white p-8 shadow-xl shadow-sepia-600/10 sm:p-10">
      {/* Titre */}
      <h1 className="text-center font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl">
        🎉 Félicitations{firstName ? `, ${firstName}` : ""} ! Votre Guide
        d&apos;Urgence arrive dans votre boîte mail dans 2 minutes.
      </h1>

      {/* Sous-titre */}
      <p className="mt-5 text-center text-lg font-bold text-sepia-700">
        Mais avant de partir, j&apos;ai une surprise pour vous…
      </p>

      {/* Paragraphe */}
      <p className="mx-auto mt-4 max-w-xl text-center text-base leading-relaxed text-ink-soft">
        Ne laissez pas vos précieux souvenirs disparaître. Je vous offre
        aujourd&apos;hui un{" "}
        <span className="font-semibold text-ink">
          test de restauration gratuit
        </span>{" "}
        sur l&apos;une de vos photos.
      </p>

      {/* Galerie d'exemples avant / après */}
      <div className="mx-auto mt-8 max-w-xl">
        <p className="text-center text-sm font-semibold uppercase tracking-wide text-sepia-600">
          Voici ce que je peux faire pour vos photos
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { src: "/exemples/restauration-1.png", alt: "Portrait de femme restauré (avant / après)" },
            { src: "/exemples/restauration-2.png", alt: "Portrait d'homme restauré (avant / après)" },
          ].map((img) => (
            <figure
              key={img.src}
              className="overflow-hidden rounded-2xl border border-sepia-200 bg-sepia-50 shadow-sm"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={896}
                height={1195}
                sizes="(max-width: 640px) 100vw, 280px"
                className="h-auto w-full object-cover"
              />
            </figure>
          ))}
        </div>
        <p className="mt-3 text-center text-sm italic text-sepia-700">
          Des exemples réels de tirages abîmés que j&apos;ai redonnés à la vie. ✨
        </p>
      </div>

      {/* Étapes */}
      <ol className="mx-auto mt-8 max-w-xl space-y-4">
        {STEPS.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sepia-600 text-sm font-bold text-white">
              {i + 1}
            </span>
            <p className="pt-0.5 text-base leading-relaxed text-ink-soft">
              {i === 0 && (
                <Sun className="mr-1 inline h-5 w-5 -translate-y-0.5 text-sepia-500" />
              )}
              {step}
            </p>
          </li>
        ))}
      </ol>

      {/* Bouton WhatsApp */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#25D366] px-6 py-4 text-center text-base font-bold text-white shadow-lg shadow-[#25D366]/30 transition-all hover:bg-[#1da851] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#25D366]/50 sm:text-lg"
      >
        <Send className="h-5 w-5" />
        👉 Cliquez ici pour m&apos;envoyer votre photo sur WhatsApp
      </a>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-sm text-sepia-700">
        <Sparkles className="h-4 w-4" />
        Réponse personnelle garantie sous 24h à 48h.
      </p>
    </div>
  );
}
