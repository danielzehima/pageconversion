import { Aperture } from "lucide-react";
import ConversionExperience from "@/components/ConversionExperience";

export default function Home() {
  return (
    <main className="paper-texture flex min-h-screen flex-col bg-gradient-to-b from-sepia-50 via-white to-sepia-50">
      {/* En-tête / logo */}
      <header className="mx-auto flex w-full max-w-5xl items-center gap-2 px-6 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sepia-600 text-white">
          <Aperture className="h-5 w-5" />
        </span>
        <span className="font-serif text-lg font-bold tracking-tight text-ink">
          Mémoires Intactes
        </span>
      </header>

      {/* Contenu principal */}
      <div className="flex flex-1 items-center justify-center px-6 py-8">
        <ConversionExperience />
      </div>

      {/* Pied de page */}
      <footer className="mx-auto w-full max-w-5xl px-6 py-8 text-center text-xs text-sepia-600">
        © {new Date().getFullYear()} Mémoires Intactes — Vos souvenirs méritent
        de durer. · Mentions légales · Confidentialité
      </footer>
    </main>
  );
}
