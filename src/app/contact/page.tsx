import { Metadata } from 'next';
import ContactFormClient from '@/components/ContactFormClient';

export const metadata: Metadata = {
  title: 'Contact | Denis Masquet',
  description: 'Contactez-nous pour votre projet de visite virtuelle 3D immersive.'
};

export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col bg-black text-white">
      <div className="mx-auto w-full max-w-5xl px-6 py-24 md:py-28 lg:px-12">
        
        {/* Header avec titre et point émissif */}
        <div className="mb-16">
          <div className="flex items-start gap-6 mb-8">
            <h1 className="text-7xl md:text-8xl font-normal leading-tight tracking-tighter text-papier">
              Discutons<br />
              de votre<br />
              projet
            </h1>
            {/* Point émissif */}
            <div className="relative w-3.5 h-3.5 flex-shrink-0 mt-2">
              <div className="absolute inset-0 bg-orange-500 rounded-full"></div>
              <div className="absolute -inset-0.5 bg-orange-500 rounded-full blur-1 opacity-40"></div>
            </div>
          </div>

          <p className="text-sm md:text-base text-graphite-300 leading-relaxed max-w-2xl mb-12">
            Remplissez ce formulaire pour que nous comprenions mieux vos besoins. Nous vous répondrons sous 24 heures.
          </p>
        </div>

        {/* Formulaire */}
        <ContactFormClient />
      </div>
    </div>
  );
}
