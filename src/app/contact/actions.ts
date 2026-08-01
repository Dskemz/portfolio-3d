"use server";

import { Resend } from "resend";
import { schemaContact } from "@/lib/validation";

export interface EtatFormulaire {
  statut: "inactif" | "succes" | "erreur";
  message?: string;
  /** Erreurs par champ, pour un affichage au plus près de la saisie. */
  erreurs?: Partial<Record<string, string[]>>;
  /** Saisie renvoyée au client : une erreur ne doit pas vider le formulaire. */
  valeurs?: Record<string, string>;
}

export const ETAT_INITIAL: EtatFormulaire = { statut: "inactif" };

/** Délai minimal de remplissage. En deçà, l'envoi vient d'un automate. */
const DELAI_MINIMAL_MS = 3000;

function envoyeur(): Resend | null {
  const cle = process.env.RESEND_API_KEY;
  return cle ? new Resend(cle) : null;
}

export async function envoyerMessage(
  _precedent: EtatFormulaire,
  donnees: FormData
): Promise<EtatFormulaire> {
  const brut = {
    nom: String(donnees.get("nom") ?? ""),
    email: String(donnees.get("email") ?? ""),
    societe: String(donnees.get("societe") ?? ""),
    message: String(donnees.get("message") ?? ""),
    consentement: String(donnees.get("consentement") ?? ""),
  };

  // Piège à robots : ce champ est masqué, un humain ne le remplit jamais.
  // On répond « succès » sans rien envoyer, pour ne pas renseigner l'automate.
  if (String(donnees.get("site_web") ?? "").length > 0) {
    return { statut: "succes", message: "Message envoyé." };
  }

  // Second garde-fou : un formulaire rempli en moins de trois secondes.
  const rendu = Number(donnees.get("horodatage") ?? 0);
  if (rendu && Date.now() - rendu < DELAI_MINIMAL_MS) {
    return { statut: "succes", message: "Message envoyé." };
  }

  const analyse = schemaContact.safeParse(brut);

  if (!analyse.success) {
    return {
      statut: "erreur",
      message: "Certains champs demandent une correction.",
      erreurs: analyse.error.flatten().fieldErrors,
      valeurs: brut,
    };
  }

  const { nom, email, societe, message } = analyse.data;
  const client = envoyeur();

  if (!client) {
    console.error("RESEND_API_KEY absente : envoi impossible.");
    return {
      statut: "erreur",
      message:
        "L'envoi est momentanément indisponible. Écrivez-moi directement par e-mail.",
      valeurs: brut,
    };
  }

  try {
    const { error } = await client.emails.send({
      from: process.env.CONTACT_EMAIL_FROM ?? "onboarding@resend.dev",
      to: process.env.CONTACT_EMAIL_TO ?? "",
      // Permet de répondre au visiteur d'un simple « Répondre ».
      replyTo: email,
      subject: `Demande via graphite3d.fr, ${nom}${societe ? ` (${societe})` : ""}`,
      text: [
        `Nom      : ${nom}`,
        `E-mail   : ${email}`,
        `Société  : ${societe || "non renseignée"}`,
        "",
        "Message :",
        message,
      ].join("\n"),
    });

    if (error) {
      console.error("Échec Resend :", error);
      return {
        statut: "erreur",
        message:
          "Le message n'a pas pu être transmis. Réessayez dans un instant.",
        valeurs: brut,
      };
    }

    return {
      statut: "succes",
      message: "Message reçu. Je vous réponds sous 48 heures ouvrées.",
    };
  } catch (erreur) {
    console.error("Erreur inattendue à l'envoi :", erreur);
    return {
      statut: "erreur",
      message:
        "Le message n'a pas pu être transmis. Réessayez dans un instant.",
      valeurs: brut,
    };
  }
}
