import { Metadata } from 'next';
import ContactFormClient from '@/components/ContactFormClient';

export const metadata: Metadata = {
  title: 'Contact | Denis Masquet',
  description: 'Contactez-nous pour votre projet de visite virtuelle 3D immersive.'
};

export default function ContactPage() {
  return (
    /*
      flex-1 + justify-center : le bloc est centré verticalement dans
      l'espace laissé libre par le layout, le footer restant collé en bas.
      Respiration symétrique : 8rem au-dessus du titre comme sous le bouton.
      La navbar étant fixe (h-16 / md:h-20), on l'ajoute au padding haut
      pour que l'espace VISIBLE soit identique en haut et en bas.
      Plus de <main> ici : le layout racine en fournit déjà un.
    */
    <div className="flex flex-1 flex-col justify-center bg-black text-white">
      <div className="mx-auto w-full max-w-7xl px-6 pt-48 pb-32 md:pt-52 lg:px-12">
        {/* Heading */}
        <h1 className="text-7xl font-light mb-24">Contact</h1>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Left: Contact Info */}
          <div className="space-y-12">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Email</p>
              <a
                href="mailto:contact@example.com"
                className="text-xl font-light hover:text-gray-400 transition-colors"
              >
                denis.masquet@gmail.com
              </a>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Téléphone</p>
              <a
                href="tel:06 86 68 46 90"
                className="text-xl font-light hover:text-gray-400 transition-colors"
              >
                06 86 68 46 90
              </a>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Adresse</p>
              <p className="text-lg font-light leading-relaxed text-gray-300">
                Rambouillet<br />
                78120<br />
                France
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Délai de réponse</p>
              <p className="text-lg font-light text-gray-300">
                Sous 24 heures
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div>
            <ContactFormClient />
          </div>
        </div>
      </div>
    </div>
  );
}
