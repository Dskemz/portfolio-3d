import { z } from "zod";

/**
 * Schéma du formulaire de contact.
 *
 * Il sert des deux côtés : le client pour le retour immédiat, le serveur
 * comme rempart. La validation navigateur est un confort d'usage, jamais
 * une sécurité, un envoi forgé ne passe pas par elle.
 */
export const schemaContact = z.object({
  nom: z
    .string()
    .trim()
    .min(2, "Indiquez votre nom.")
    .max(80, "Ce nom dépasse la longueur autorisée."),

  email: z
    .string()
    .trim()
    .min(1, "Indiquez votre adresse e-mail.")
    .email("Cette adresse e-mail ne semble pas valide.")
    .max(160, "Cette adresse dépasse la longueur autorisée."),

  societe: z
    .string()
    .trim()
    .max(120, "Ce nom dépasse la longueur autorisée.")
    .optional()
    .or(z.literal("")),

  message: z
    .string()
    .trim()
    .min(20, "Décrivez votre projet en quelques lignes (20 caractères minimum).")
    .max(2000, "Message trop long : 2000 caractères maximum."),

  consentement: z
    .string()
    .refine((v) => v === "on", {
      message: "Votre accord est nécessaire pour traiter votre demande.",
    }),
});

export type DonneesContact = z.infer<typeof schemaContact>;
