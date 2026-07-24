import { Metadata } from 'next';
import ContactFormClient from '@/components/ContactFormClient';

export const metadata: Metadata = {
  title: 'Contact | Denis Masquet',
  description: 'Contactez-nous pour votre projet de visite virtuelle 3D immersive.'
};

export default function ContactPage() {
  return (
    /*
      `overflow-x-clip` est indispensable : le fil qui part du mot « projet »
      est dimensionné en `w-screen` pour être certain d'atteindre le bord droit
      quelle que soit la largeur. Sans le clip, il créerait une barre de
      défilement horizontale.
    */
    <div className="flex flex-1 flex-col overflow-x-clip bg-black text-white">
      <div className="mx-auto w-full max-w-5xl px-6 py-24 md:py-28 lg:px-12">

        <div className="mb-16">
          <h1 className="font-display text-7xl font-normal leading-tight tracking-tighter text-papier md:text-8xl">
            Discutons<br />
            de votre<br />
            {/*
              Le fil part exactement de la fin du mot, pas du bloc de titre :
              c'est le `inline-block relative` sur « projet » qui donne le point
              d'ancrage, et `left-full` colle le départ au « t ».
            */}
            <span className="relative inline-block">
              projet
              <span
                aria-hidden="true"
                className="absolute left-full top-1/2 ml-5 h-[3px] w-screen -translate-y-1/2 bg-orange-500/25 blur-[3px]"
              />
              <span
                aria-hidden="true"
                className="absolute left-full top-1/2 ml-5 h-px w-screen -translate-y-1/2 bg-orange-500"
              />
              <span
                aria-hidden="true"
                className="absolute left-full top-1/2 ml-5 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500"
              />
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-sm font-light leading-relaxed text-papier/60 md:text-base">
            Remplissez ce formulaire pour que nous comprenions mieux vos besoins.
            Nous vous répondrons sous 24 heures.
          </p>
        </div>

        <ContactFormClient />
      </div>
    </div>
  );
}
