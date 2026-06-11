"use client";

import { useState, useCallback } from "react";
import { Camera, Clock, Heart } from "lucide-react";
import Benefits from "./Benefits";
import LeadForm from "./LeadForm";
import SuccessState from "./SuccessState";

export default function ConversionExperience() {
  const [done, setDone] = useState(false);
  const [firstName, setFirstName] = useState<string | undefined>();

  const handleSuccess = useCallback((name?: string) => {
    setFirstName(name);
    setDone(true);
    // Remonte en haut pour que l'utilisateur voie le nouvel écran.
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  if (done) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <SuccessState firstName={firstName} />
      </div>
    );
  }

  return (
    <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Colonne gauche : argumentaire émotionnel */}
      <div className="animate-fade-up">
        {/* Pré-titre alerte */}
        <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 ring-1 ring-inset ring-red-200">
          🚨 À l&apos;attention de tous ceux qui possèdent des archives
          familiales : vos souvenirs sont en danger.
        </p>

        {/* Titre principal */}
        <h1 className="font-serif text-4xl font-bold leading-[1.1] text-ink sm:text-5xl">
          Comment Sauver Vos Vieilles Photos de Famille Avant Qu&apos;Elles Ne
          S&apos;effacent À Tout Jamais
        </h1>

        {/* Sous-titre */}
        <p className="mt-6 text-lg leading-relaxed text-ink-soft">
          Téléchargez ce{" "}
          <span className="font-semibold text-ink">
            Guide d&apos;Urgence Gratuit
          </span>{" "}
          et découvrez les 3 actions immédiates à réaliser dès aujourd&apos;hui
          pour stopper la dégradation de vos précieux tirages photo (et les
          transmettre intacts aux générations futures).
        </p>

        {/* Bénéfices */}
        <div className="mt-8">
          <Benefits />
        </div>

        {/* Mini réassurance visuelle */}
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-sepia-700">
          <span className="flex items-center gap-1.5">
            <Camera className="h-4 w-4" /> Guide PDF illustré
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> Lecture en 7 minutes
          </span>
          <span className="flex items-center gap-1.5">
            <Heart className="h-4 w-4" /> +2 300 familles protégées
          </span>
        </div>
      </div>

      {/* Colonne droite : carte formulaire */}
      <div className="animate-fade-up lg:sticky lg:top-8">
        <div className="rounded-3xl border border-sepia-200 bg-white p-7 shadow-xl shadow-sepia-600/10 sm:p-8">
          <h2 className="text-center font-serif text-2xl font-bold text-ink">
            Recevez le Guide d&apos;Urgence gratuitement
          </h2>
          <p className="mb-6 mt-2 text-center text-sm text-ink-soft">
            Indiquez où nous devons envoyer votre guide.
          </p>
          <LeadForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}
