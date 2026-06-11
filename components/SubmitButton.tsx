"use client";

import { useFormStatus } from "react-dom";
import { Loader2, ShieldCheck } from "lucide-react";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative w-full overflow-hidden rounded-xl bg-sepia-600 px-6 py-4 text-center text-base font-semibold text-white shadow-lg shadow-sepia-600/30 transition-all hover:bg-sepia-700 hover:shadow-xl hover:shadow-sepia-700/40 focus:outline-none focus:ring-4 focus:ring-sepia-400/50 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Enregistrement en cours…
        </span>
      ) : (
        <span className="flex flex-col items-center gap-1">
          <span className="flex items-center gap-2 text-lg">
            <ShieldCheck className="h-5 w-5" />
            Oui, je veux sauver mes photos !
          </span>
          <span className="text-xs font-normal text-sepia-100">
            (Bonus inclus : un test de restauration numérique offert pour votre
            photo la plus abîmée)
          </span>
        </span>
      )}
    </button>
  );
}
