import { AlertTriangle, Smartphone, Archive } from "lucide-react";

const BENEFITS = [
  {
    icon: AlertTriangle,
    title: "Le danger invisible",
    text: "Pourquoi les albums à pages adhésives de votre enfance détruisent chimiquement vos photos à petit feu.",
  },
  {
    icon: Smartphone,
    title: "La sauvegarde rapide",
    text: "La méthode simple (avec votre smartphone) pour créer une copie de sécurité d'urgence ce soir.",
  },
  {
    icon: Archive,
    title: "Le stockage parfait",
    text: "L'erreur numéro 1 qui jaunit le papier photo et comment l'éviter facilement à la maison.",
  },
];

export default function Benefits() {
  return (
    <ul className="space-y-4">
      {BENEFITS.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex gap-4">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sepia-100 text-sepia-700">
            <Icon className="h-5 w-5" strokeWidth={2} />
          </span>
          <p className="text-base leading-relaxed text-ink-soft">
            <span className="font-semibold text-ink">{title} :</span> {text}
          </p>
        </li>
      ))}
    </ul>
  );
}
