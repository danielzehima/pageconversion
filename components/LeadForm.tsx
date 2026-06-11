"use client";

import { useActionState, useEffect } from "react";
import { Lock, User, Mail, AlertCircle } from "lucide-react";
import { submitLead, type LeadFormState } from "@/app/actions";
import SubmitButton from "./SubmitButton";

const initialState: LeadFormState = { status: "idle" };

type LeadFormProps = {
  onSuccess: (firstName?: string) => void;
};

export default function LeadForm({ onSuccess }: LeadFormProps) {
  const [state, formAction] = useActionState(submitLead, initialState);

  // Quand l'action réussit, on remonte l'info au parent pour basculer d'écran.
  useEffect(() => {
    if (state.status === "success") {
      onSuccess(state.firstName);
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      {/* Champ Prénom */}
      <div>
        <label
          htmlFor="firstName"
          className="mb-1.5 block text-sm font-medium text-ink-soft"
        >
          Prénom
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-sepia-400" />
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            placeholder="Votre prénom"
            className="w-full rounded-xl border border-sepia-200 bg-white py-3 pl-11 pr-4 text-ink placeholder:text-sepia-300 focus:border-sepia-500 focus:outline-none focus:ring-2 focus:ring-sepia-400/40"
          />
        </div>
        {state.errors?.firstName && (
          <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {state.errors.firstName}
          </p>
        )}
      </div>

      {/* Champ Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-ink-soft"
        >
          Adresse e-mail
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-sepia-400" />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="vous@exemple.com"
            className="w-full rounded-xl border border-sepia-200 bg-white py-3 pl-11 pr-4 text-ink placeholder:text-sepia-300 focus:border-sepia-500 focus:outline-none focus:ring-2 focus:ring-sepia-400/40"
          />
        </div>
        {state.errors?.email && (
          <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {state.errors.email}
          </p>
        )}
      </div>

      {/* Bouton de soumission */}
      <SubmitButton />

      {/* Réassurance */}
      <p className="flex items-center justify-center gap-1.5 text-center text-sm text-sepia-700">
        <Lock className="h-4 w-4" />
        100% Gratuit. Vos informations sont en sécurité et vous ne recevrez
        aucun spam.
      </p>
    </form>
  );
}
