"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { envoyerMessage, ETAT_INITIAL } from "./actions";

const CHAMP =
  "w-full border border-graphite-600 bg-graphite-800 px-4 py-3 text-corps text-graphite-50 " +
  "transition-colors duration-200 ease-sobre placeholder:text-graphite-500 " +
  "focus:border-encre-bleue-400 focus:outline-none";

const ETIQUETTE =
  "block font-mono text-etiquette uppercase text-graphite-400";

interface MessageErreurProps {
  id: string;
  erreurs?: string[];
}

function MessageErreur({ id, erreurs }: MessageErreurProps) {
  if (!erreurs?.length) return null;
  return (
    <p id={id} className="mt-2 text-corps-sm text-encre-bleue-300">
      {erreurs[0]}
    </p>
  );
}

export default function ContactForm() {
  const [etat, action, enAttente] = useActionState(
    envoyerMessage,
    ETAT_INITIAL
  );
  const [horodatage, setHorodatage] = useState("");
  const annonceRef = useRef<HTMLParagraphElement>(null);

  // Marque l'instant d'affichage : sert au garde-fou anti-automate.
  useEffect(() => {
    setHorodatage(String(Date.now()));
  }, []);

  // Porte le résultat à l'attention des lecteurs d'écran et du clavier.
  useEffect(() => {
    if (etat.statut !== "inactif") annonceRef.current?.focus();
  }, [etat]);

  const v = etat.valeurs ?? {};
  const e = etat.erreurs ?? {};

  if (etat.statut === "succes") {
    return (
      <div className="border border-graphite-600 bg-graphite-800 p-8 text-center">
        <p
          ref={annonceRef}
          tabIndex={-1}
          role="status"
          className="font-display text-titre-sm font-medium text-graphite-50 focus:outline-none"
        >
          {etat.message}
        </p>
        <p className="mt-3 text-corps-sm text-graphite-300">
          En attendant, la démonstration interactive reste accessible depuis
          l'accueil.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-corps-sm text-encre-bleue-400 underline underline-offset-4 hover:text-encre-bleue-300"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="space-y-7">
      {etat.statut === "erreur" && (
        <p
          ref={annonceRef}
          tabIndex={-1}
          role="alert"
          className="border-l-2 border-encre-bleue-400 bg-graphite-800 px-4 py-3 text-corps-sm text-graphite-100 focus:outline-none"
        >
          {etat.message}
        </p>
      )}

      {/* Piège à robots : masqué à l'œil comme aux lecteurs d'écran. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 overflow-hidden">
        <label htmlFor="site_web">Ne pas remplir</label>
        <input id="site_web" name="site_web" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="horodatage" value={horodatage} />

      <div>
        <label htmlFor="nom" className={ETIQUETTE}>
          Nom <span className="text-encre-bleue-400">*</span>
        </label>
        <input
          id="nom"
          name="nom"
          type="text"
          required
          autoComplete="name"
          defaultValue={v.nom}
          aria-invalid={Boolean(e.nom)}
          aria-describedby={e.nom ? "erreur-nom" : undefined}
          className={`mt-2 ${CHAMP}`}
        />
        <MessageErreur id="erreur-nom" erreurs={e.nom} />
      </div>

      <div>
        <label htmlFor="email" className={ETIQUETTE}>
          E-mail <span className="text-encre-bleue-400">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={v.email}
          aria-invalid={Boolean(e.email)}
          aria-describedby={e.email ? "erreur-email" : undefined}
          className={`mt-2 ${CHAMP}`}
        />
        <MessageErreur id="erreur-email" erreurs={e.email} />
      </div>

      <div>
        <label htmlFor="societe" className={ETIQUETTE}>
          Agence ou société
        </label>
        <input
          id="societe"
          name="societe"
          type="text"
          autoComplete="organization"
          defaultValue={v.societe}
          aria-invalid={Boolean(e.societe)}
          aria-describedby={e.societe ? "erreur-societe" : undefined}
          className={`mt-2 ${CHAMP}`}
        />
        <MessageErreur id="erreur-societe" erreurs={e.societe} />
      </div>

      <div>
        <label htmlFor="message" className={ETIQUETTE}>
          Votre projet <span className="text-encre-bleue-400">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={7}
          defaultValue={v.message}
          placeholder="Type de bien, surface approximative, échéance souhaitée…"
          aria-invalid={Boolean(e.message)}
          aria-describedby={e.message ? "erreur-message" : undefined}
          className={`mt-2 resize-y ${CHAMP}`}
        />
        <MessageErreur id="erreur-message" erreurs={e.message} />
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id="consentement"
            name="consentement"
            type="checkbox"
            required
            defaultChecked={v.consentement === "on"}
            aria-invalid={Boolean(e.consentement)}
            aria-describedby={
              e.consentement ? "erreur-consentement" : undefined
            }
            className="mt-1 h-4 w-4 shrink-0 accent-encre-bleue-500"
          />
          <label
            htmlFor="consentement"
            className="text-corps-sm leading-relaxed text-graphite-300"
          >
            J'accepte que mes informations soient utilisées pour traiter ma
            demande.{" "}
            <Link
              href="/confidentialite"
              className="text-encre-bleue-400 underline underline-offset-2 hover:text-encre-bleue-300"
            >
              Politique de confidentialité
            </Link>
          </label>
        </div>
        <MessageErreur id="erreur-consentement" erreurs={e.consentement} />
      </div>

      <button
        type="submit"
        disabled={enAttente}
        className="w-full bg-encre-bleue-500 px-7 py-4 font-display text-corps-sm font-medium tracking-wide text-graphite-50 transition-colors duration-200 ease-sobre hover:bg-encre-bleue-400 disabled:cursor-not-allowed disabled:bg-graphite-700 disabled:text-graphite-400 sm:w-auto"
      >
        {enAttente ? "Envoi en cours…" : "Envoyer ma demande"}
      </button>

      <p className="text-corps-sm text-graphite-500">
        Les champs marqués d'un astérisque sont obligatoires.
      </p>
    </form>
  );
}
