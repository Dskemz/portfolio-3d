import { Metadata } from 'next';
import Container from '@/components/layout/Container';
import ContactFormClient from '@/components/ContactFormClient';

export const metadata: Metadata = {
  title: 'Contact | Denis Masquet',
  description: 'Contactez-nous pour votre projet de visite virtuelle 3D immersive.'
};

export default function ContactPage() {
  return (
    <main className="contact-page flex min-h-0 flex-1 flex-col overflow-hidden bg-[#090c11] text-white">
      <Container taille="plein" gouttiere={false} className="flex min-h-0 flex-1 flex-col px-5 pb-8 pt-6 sm:px-10 lg:px-16">
        <header className="mb-8 shrink-0 font-mono text-[10px] uppercase tracking-[.2em] text-white/50">
          <span>M3D STUDIO</span>
        </header>
        <div className="mx-auto grid min-h-0 w-full max-w-[1180px] flex-1 grid-cols-1 gap-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-0">
          <div className="relative flex min-h-0 flex-col justify-center py-6 lg:py-10 lg:pr-16 xl:pr-24 lg:after:absolute lg:after:right-0 lg:after:top-1/4 lg:after:h-1/2 lg:after:w-px lg:after:bg-white/20">
            <p className="mb-6 font-mono text-[10px] uppercase tracking-[.22em] text-white/45">PROJET SUR MESURE</p>
            <h1 className="max-w-lg font-display text-[clamp(2.6rem,6vw,5.5rem)] font-semibold uppercase leading-[.92] tracking-[-.06em]">
              Parlons de votre <span className="text-[#ff6a3d]">projet.</span>
            </h1>
            <p className="mt-8 max-w-lg text-sm leading-7 text-white/70 md:text-base">
              Décrivez-nous votre besoin. Nous construirons ensemble une expérience 3D claire, utile et pensée pour vos usages.
            </p>
            <div className="mt-10 grid max-w-lg grid-cols-2 gap-6 border-t border-white/15 pt-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.18em] text-white/40">Ce que nous étudions</p>
                <p className="mt-2 text-xs leading-5 text-white/65">Votre besoin, vos usages et le niveau d’interactivité attendu.</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.18em] text-white/40">Notre engagement</p>
                <p className="mt-2 text-xs leading-5 text-white/65">Une première réponse claire sous 24 heures.</p>
              </div>
            </div>
          </div>
          <div className="flex min-h-0 items-center lg:pl-16 xl:pl-24">
            <div className="w-full rounded-[14px] border border-white/15 bg-black p-4 sm:p-6 lg:p-7">
              <ContactFormClient />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
