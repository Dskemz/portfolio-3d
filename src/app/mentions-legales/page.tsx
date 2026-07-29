/**
 * Mentions Légales
 *
 * Modèle compliant RGPD à adapter avec vos informations
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions Légales | Visite3D',
  description: 'Mentions légales et informations légales de Visite3D',
  robots: 'index, follow',
  openGraph: {
    title: 'Mentions Légales | Visite3D',
    description: 'Mentions légales et informations légales de Visite3D',
    type: 'website'
  }
};

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Mentions Légales</h1>

        {/* À ADAPTER: Informations générales */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Éditeur du site</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Nom:</strong> Denis Masquet
            </p>
            <p>
              <strong>Statut:</strong> Micro-entreprise (EI)
            </p>
            <p>
              <strong>SIRET:</strong> 880727649
            </p>
            <p>
              <strong>Adresse:</strong> Rambouillet, 78120 France
            </p>
            <p>
              <strong>Email:</strong> denis.masquet@gmail.com
            </p>
            <p>
              <strong>Téléphone:</strong> +33 6 86 68 46 90
            </p>
            <p>
              <strong>Directeur de publication:</strong> Denis Masquet
            </p>
          </div>
        </section>

        {/* Hébergement */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Hébergeur du site</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Nom:</strong> Vercel Inc.
            </p>
            <p>
              <strong>Adresse:</strong> 340 S Lemon Ave, Walnut, CA 91789, USA
            </p>
            <p>
              <strong>Site web:</strong>{' '}
              <a href="https://vercel.com" className="text-bleu-encre hover:underline">
                vercel.com
              </a>
            </p>
          </div>
        </section>

        {/* Propriété intellectuelle */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            3. Propriété intellectuelle
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Tous les contenus du site (textes, images, vidéos, codes, structures) sont la
              propriété exclusive de Visite3D ou de ses partenaires, sauf mention contraire.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4">Licences et attributions:</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                Code source: Disponible sous license MIT (voir{' '}
                <a href="https://github.com/dskemz" className="text-bleu-encre hover:underline">
                  GitHub
                </a>
                )
              </li>
              <li>Assets 3D: Babylon.js (Apache 2.0 license)</li>
              <li>
                Icônes: Font Awesome (CC BY 4.0) / Material Icons (Apache 2.0)
              </li>
              <li>Polices: Inter, Mono (Google Fonts, SIL OFL 1.1)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-4">Restrictions:</h3>
            <p>
              Toute reproduction, représentation, modification ou utilisation du contenu est
              strictement interdite sans autorisation écrite préalable.
            </p>
          </div>
        </section>

        {/* Responsabilité */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Limitation de responsabilité</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Visite3D s'efforce de maintenir l'exactitude des informations, mais ne garantit pas
              l'absence d'erreurs. Visite3D ne peut être tenu responsable des:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Interruptions ou indisponibilités du service</li>
              <li>Pertes de données ou accès non autorisé</li>
              <li>Dommages directs ou indirects résultant de l'utilisation du site</li>
              <li>Contenu des sites tiers (liens externes)</li>
            </ul>
          </div>
        </section>

        {/* Liens externes */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Liens externes</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              Le site contient des liens vers des sites externes. Visite3D n'est pas responsable du
              contenu de ces sites. L'existence d'un lien ne constitue pas une approbation de la
              part de Denis Masquet.
            </p>
          </div>
        </section>

        {/* Services fournis */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Services fournis</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Denis Masquet fournit une plateforme de création de visites virtuelles 3D (Hub_Visite3D)
              et un viewer de consultation. Les services sont fournis "en l'état",
              sans garantie spécifique.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mt-4">Conditions d'utilisation:</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Accès réservé aux utilisateurs autorisés</li>
              <li>Interdiction d'utilisation commerciale sans licence</li>
              <li>Respect des conditions de chaque service individuel</li>
            </ul>
          </div>
        </section>

        {/* RGPD / Données personnelles */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            7. Données personnelles et RGPD
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Pour les informations complètes sur le traitement des données personnelles, veuillez
              consulter notre{' '}
              <a href="/confidentialite" className="text-bleu-encre hover:underline">
                Politique de Confidentialité
              </a>
              .
            </p>
            <p>
              <strong>Responsable du traitement:</strong> Denis Masquet
            </p>
            <p>
              <strong>Délégué à la protection des données (DPO):</strong> denis.masquet@gmail.com
            </p>
          </div>
        </section>

        {/* Cookies */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Cookies</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Le site utilise des cookies pour améliorer l'expérience utilisateur. Vous pouvez
              configurer vos préférences via le bandeau cookie en bas de page.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mt-4">Types de cookies:</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <strong>Essentiels:</strong> Authentification, sécurité (obligatoires)
              </li>
              <li>
                <strong>Analytics:</strong> Google Analytics (consentement requis)
              </li>
              <li>
                <strong>Marketing:</strong> Pixel Facebook, LinkedIn (consentement requis)
              </li>
            </ul>
          </div>
        </section>

        {/* Contact / Réclamations */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Contact et réclamations</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Pour toute question concernant ces mentions légales ou le site, veuillez nous
              contacter à:
            </p>
            <p>
              <strong>Email:</strong> contact@example.com
            </p>
            <p>
              <strong>Formulaire:</strong>{' '}
              <a href="/contact" className="text-bleu-encre hover:underline">
                Formulaire de contact
              </a>
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4">Droits RGPD:</h3>
            <p>
              Vous avez le droit d'accéder, rectifier, supprimer ou porter vos données.
              Contactez-nous pour exercer ces droits. Vous avez également le droit de déposer une
              plainte auprès de la CNIL.
            </p>
          </div>
        </section>

        {/* Modifications */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Modifications</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              Denis Masquet se réserve le droit de modifier ces mentions légales à tout moment. Les
              modifications entrent en vigueur dès leur publication.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              <strong>Dernière mise à jour:</strong> {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className="border-t pt-8 mt-12">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Denis Masquet. Tous droits réservés.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Denis Masquet est une marque déposée. All third-party trademarks are property of their
            respective owners.
          </p>
        </div>
      </div>
    </div>
  );
}
