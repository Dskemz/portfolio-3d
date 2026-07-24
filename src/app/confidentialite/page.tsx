/**
 * Politique de Confidentialité
 *
 * Modèle compliant RGPD (Règlement Général sur la Protection des Données)
 * À adapter avec vos informations spécifiques
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité | Visite3D',
  description: 'Politique de confidentialité et traitement des données personnelles de Visite3D',
  robots: 'index, follow',
  openGraph: {
    title: 'Politique de Confidentialité | Visite3D',
    description: 'Politique de confidentialité et traitement des données personnelles',
    type: 'website'
  }
};

export default function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Politique de Confidentialité</h1>
        <p className="text-sm text-gray-600 mb-8">
          Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
        </p>

        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Introduction</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Visite3D ("nous", "notre" ou "nos") s'engage à protéger votre vie privée. Cette
              Politique de Confidentialité explique comment nous collectons, utilisons, divulguons
              et stockons vos données personnelles.
            </p>
            <p>
              Cette politique s'applique à tous les services fournis par Visite3D, y compris:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Hub_Visite3D (plateforme de création de visites virtuelles)</li>
              <li>MotionLogo (générateur d'icônes IA)</li>
              <li>Site web et formulaires de contact</li>
              <li>Tous les services futurs</li>
            </ul>
          </div>
        </section>

        {/* 1. Données collectées */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            1. Quelles données collectons-nous?
          </h2>
          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">1.1 Données de contact</h3>
              <p className="mb-2">
                <strong>Collecte:</strong> Via formulaire de contact, inscription, email
              </p>
              <p>
                <strong>Données:</strong> Nom, prénom, email, téléphone, entreprise, message
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">1.2 Données d'utilisation</h3>
              <p className="mb-2">
                <strong>Collecte:</strong> Automatiquement lors de l'utilisation du site/service
              </p>
              <p>
                <strong>Données:</strong> Adresse IP, type de navigateur, pages visitées, temps
                d'accès, cookie IDs
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">1.3 Données de compte</h3>
              <p className="mb-2">
                <strong>Collecte:</strong> Lors de l'inscription à Hub_Visite3D ou MotionLogo
              </p>
              <p>
                <strong>Données:</strong> Identifiants, mot de passe haché, profil, préférences,
                historique de création
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">1.4 Données de paiement</h3>
              <p className="mb-2">
                <strong>Collecte:</strong> Via Stripe/PayPal (jamais stocké par Visite3D)
              </p>
              <p>
                <strong>Données:</strong> Fournisseur de paiement traite les données bancaires
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">1.5 Données de contenu</h3>
              <p className="mb-2">
                <strong>Collecte:</strong> Modèles 3D, images, vidéos uploadés
              </p>
              <p>
                <strong>Données:</strong> Fichiers, métadonnées, dimensions, dates de création
              </p>
            </div>
          </div>
        </section>

        {/* 2. Base légale */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            2. Base légale de traitement (RGPD Art. 6)
          </h2>
          <div className="space-y-4 text-gray-700">
            <div className="border-l-4 border-bleu-encre pl-4">
              <h3 className="font-semibold mb-2">📋 Consentement (Art. 6.1.a)</h3>
              <p>Formulaire de contact, newsletter, marketing</p>
            </div>
            <div className="border-l-4 border-bleu-encre pl-4">
              <h3 className="font-semibold mb-2">📜 Contrat (Art. 6.1.b)</h3>
              <p>Données d'utilisation des services Hub_Visite3D, MotionLogo</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold mb-2">⚖️ Obligation légale (Art. 6.1.c)</h3>
              <p>Factures, données fiscales (micro-entrepreneur)</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold mb-2">🛡️ Intérêts légitimes (Art. 6.1.f)</h3>
              <p>Sécurité, prévention fraude, analytics, amélioration service</p>
            </div>
          </div>
        </section>

        {/* 3. Utilisation des données */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Comment utilisons-nous vos données?</h2>
          <div className="space-y-3 text-gray-700">
            <p>✉️ Répondre à vos demandes via formulaire de contact</p>
            <p>🔐 Fournir et maintenir les services</p>
            <p>📧 Envoi newsletter (avec consentement)</p>
            <p>📊 Analytics pour améliorer UX/performance</p>
            <p>🛡️ Prévention fraude et sécurité</p>
            <p>💾 Conformité légale et tenue d'archives</p>
            <p>📱 Notifications importantes concernant les services</p>
          </div>
        </section>

        {/* 4. Partage des données */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Partage des données</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Nous ne vendons jamais vos données.</strong> Vos données peuvent être partagées
              avec:
            </p>
            <div className="border-l-4 border-gray-300 pl-4 space-y-3">
              <div>
                <p className="font-semibold">Prestataires de services</p>
                <p className="text-sm">Vercel (hébergement), Resend (emails), Stripe (paiements)</p>
              </div>
              <div>
                <p className="font-semibold">Analytics</p>
                <p className="text-sm">Google Analytics, Vercel Analytics (consentement requis)</p>
              </div>
              <div>
                <p className="font-semibold">Marketing</p>
                <p className="text-sm">
                  Meta (Pixel Facebook), LinkedIn (consentement requis)
                </p>
              </div>
              <div>
                <p className="font-semibold">Autorités</p>
                <p className="text-sm">Si légalement requis (police, justice)</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Durée de conservation */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Combien de temps gardons-nous vos données?</h2>
          <div className="space-y-3 text-gray-700">
            <div className="border-l-4 border-gray-300 pl-4">
              <p className="font-semibold">Données de contact (formulaire)</p>
              <p className="text-sm">3 ans (intérêts légitimes)</p>
            </div>
            <div className="border-l-4 border-gray-300 pl-4">
              <p className="font-semibold">Compte utilisateur</p>
              <p className="text-sm">Pendant la durée du compte + 30 jours après suppression</p>
            </div>
            <div className="border-l-4 border-gray-300 pl-4">
              <p className="font-semibold">Analytics</p>
              <p className="text-sm">26 mois (Google Analytics default)</p>
            </div>
            <div className="border-l-4 border-gray-300 pl-4">
              <p className="font-semibold">Logs serveur</p>
              <p className="text-sm">30 jours (sécurité)</p>
            </div>
            <div className="border-l-4 border-gray-300 pl-4">
              <p className="font-semibold">Données fiscales</p>
              <p className="text-sm">6 ans (conformité légale)</p>
            </div>
          </div>
        </section>

        {/* 6. Vos droits RGPD */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Vos droits RGPD</h2>
          <div className="space-y-4 text-gray-700">
            <div className="bg-bleu-encre/10 p-4 rounded-lg border-l-4 border-bleu-encre">
              <p className="font-semibold mb-2">📖 Droit d'accès (Art. 15)</p>
              <p className="text-sm">Vous avez le droit d'accéder à vos données personnelles.</p>
            </div>
            <div className="bg-bleu-encre/10 p-4 rounded-lg border-l-4 border-bleu-encre">
              <p className="font-semibold mb-2">✏️ Droit de rectification (Art. 16)</p>
              <p className="text-sm">Vous pouvez corriger vos données inexactes.</p>
            </div>
            <div className="bg-bleu-encre/10 p-4 rounded-lg border-l-4 border-bleu-encre">
              <p className="font-semibold mb-2">🗑️ Droit à l'oubli (Art. 17)</p>
              <p className="text-sm">
                Vous pouvez demander la suppression de vos données (sauf obligations légales).
              </p>
            </div>
            <div className="bg-bleu-encre/10 p-4 rounded-lg border-l-4 border-bleu-encre">
              <p className="font-semibold mb-2">⛔ Droit d'opposition (Art. 21)</p>
              <p className="text-sm">Vous pouvez vous opposer au traitement de vos données.</p>
            </div>
            <div className="bg-bleu-encre/10 p-4 rounded-lg border-l-4 border-bleu-encre">
              <p className="font-semibold mb-2">📤 Droit à la portabilité (Art. 20)</p>
              <p className="text-sm">Vous pouvez demander l'export de vos données.</p>
            </div>
            <div className="bg-bleu-encre/10 p-4 rounded-lg border-l-4 border-bleu-encre">
              <p className="font-semibold mb-2">🚫 Droit de limitation (Art. 18)</p>
              <p className="text-sm">Vous pouvez demander la limitation du traitement.</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Pour exercer ces droits, contactez-nous à: contact@example.com
          </p>
        </section>

        {/* 7. Sécurité */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Sécurité des données</h2>
          <div className="space-y-4 text-gray-700">
            <p>Visite3D implémente des mesures de sécurité techniques et organisationnelles:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Chiffrement SSL/TLS pour toutes les transmissions</li>
              <li>Authentification JWT pour l'accès aux services</li>
              <li>Hachage bcrypt pour les mots de passe</li>
              <li>Isolation des données dans des conteneurs Docker</li>
              <li>Logs d'audit pour traçabilité des accès</li>
              <li>Vérifications de sécurité régulières</li>
            </ul>
            <p className="text-sm text-red-600 mt-4">
              ⚠️ Aucune transmission Internet n'est 100% sécurisée. Nous ne pouvons pas garantir
              la sécurité absolue.
            </p>
          </div>
        </section>

        {/* 8. Cookies */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Cookies et technologies similaires</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <p className="font-semibold mb-2">🍪 Cookies essentiels</p>
              <p className="text-sm">
                Authentification, CSRF token, préférences. Obligatoires pour le site.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-2">📊 Cookies analytics</p>
              <p className="text-sm">Google Analytics pour comprendre l'utilisation du site.</p>
            </div>
            <div>
              <p className="font-semibold mb-2">📢 Cookies marketing</p>
              <p className="text-sm">Pixel Facebook, LinkedIn pour retargeting publicitaire.</p>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              ✅ Vous pouvez gérer vos préférences cookie via le bandeau cookie en bas de page.
            </p>
          </div>
        </section>

        {/* 9. Sous-traitants */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Sous-traitants (Art. 28 RGPD)</h2>
          <div className="space-y-3 text-gray-700">
            <p>Nous avons signé des contrats de traitement avec nos sous-traitants:</p>
            <div className="border border-gray-300 rounded p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-semibold py-2">Sous-traitant</th>
                    <th className="text-left font-semibold py-2">Service</th>
                    <th className="text-left font-semibold py-2">Localisation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Vercel</td>
                    <td>Hébergement</td>
                    <td>USA/EU</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Resend</td>
                    <td>Emails</td>
                    <td>USA</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Stripe</td>
                    <td>Paiements</td>
                    <td>USA</td>
                  </tr>
                  <tr>
                    <td className="py-2">Google Analytics</td>
                    <td>Analytics</td>
                    <td>USA</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600">
              Note: Certains sous-traitants sont basés aux USA. Nous utilisons les mécanismes
              appropriés (clauses contractuelles standard).
            </p>
          </div>
        </section>

        {/* 10. Contact / Réclamations */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Contact et réclamations</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <p className="font-semibold mb-2">📧 Responsable de traitement</p>
              <p className="text-sm">D, Visite3D</p>
              <p className="text-sm">contact@example.com</p>
            </div>
            <div>
              <p className="font-semibold mb-2">🔐 Délégué à la protection des données</p>
              <p className="text-sm">contact@example.com</p>
            </div>
            <div>
              <p className="font-semibold mb-2">📋 CNIL</p>
              <p className="text-sm">
                Si vous estimez que le traitement viole le RGPD, vous avez le droit de déposer
                plainte auprès de la CNIL:{' '}
                <a href="https://www.cnil.fr" className="text-bleu-encre hover:underline">
                  www.cnil.fr
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Modifications */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Modifications de cette politique</h2>
          <p className="text-gray-700">
            Nous pouvons modifier cette politique. Les modifications importantes seront notifiées
            par email. Votre utilisation continue du site constitue l'acceptation des modifications.
          </p>
        </section>
      </div>
    </div>
  );
}
