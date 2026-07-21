export default function ServicesPage() {
  const SERVICES = [
    { id: '01', number: '01', title: 'Visite Virtuelle\nStandard', description: 'Une immersion 3D haute définition, pensée pour offrir une navigation fluide et intuitive sur tous vos supports.', details: ['Modélisation 3D haute fidélité', 'Navigation immersive 360°', 'Optimisation mobile et desktop', 'Hébergement sécurisé 12 mois'] },
    { id: '02', number: '02', title: 'Visite\nPremium', description: 'Une expérience augmentée par l\'interactivité pour transformer chaque visite en un véritable outil de communication.', details: ['Annotations et points interactifs', 'Branding UI personnalisé', 'Analytics avancés', 'Support client prioritaire'] },
    { id: '03', number: '03', title: 'Enterprise\nSuite', description: 'Une solution sur-mesure pour les projets complexes nécessitant une intégration technique poussée et un accompagnement dédié.', details: ['Intégration API personnalisée', 'Connexion CRM/ERP', 'Consultations stratégiques', 'Support réactif 24/7'] },
    { id: '04', number: '04', title: 'Maintenance\n& Support', description: 'Un suivi continu pour garantir la performance, la mise à jour et la pérennité de vos espaces virtuels.', details: ['Mises à jour régulières', 'Optimisation des performances', 'Rapports d\'audience détaillés', 'Modifications de contenu'] }
  ];

  return (
    <div className="bg-black text-white min-h-screen flex flex-col justify-between">
      {/* Header avec espaces doublés */}
      <section className="border-b border-gray-800 pt-16 pb-12">
        <div className="max-w-6xl mx-auto px-12">
          <span className="text-[10px] tracking-[0.2em] text-gray-500 uppercase">Notre approche</span>
          
          {/* mt-32 : Espace doublé par rapport au précédent */}
          <h1 className="text-4xl font-light mt-32 mb-32 leading-tight">
            Nous concevons des expériences immersives qui allient esthétique et fluidité.
          </h1>
        </div>
      </section>

      {/* Main Services */}
      <main className="flex-grow my-8">
        <div className="max-w-6xl mx-auto px-12">
          {SERVICES.map((service, index) => (
            <div key={service.id} className={`border-b border-gray-800 py-8 grid grid-cols-[80px_1fr_1fr] gap-12 ${index === SERVICES.length - 1 ? 'border-b-0' : ''}`}>
              <span className="text-sm font-light text-gray-700">/{service.number}</span>
              <h2 className="text-4xl font-light leading-none whitespace-pre-line">{service.title}</h2>
              <div className="flex flex-col">
                <p className="text-sm text-gray-400 font-light mb-4">{service.description}</p>
                <div className="space-y-1">
                  {service.details.map((detail, idx) => (
                    <p key={idx} className="text-xs text-gray-500 flex items-center">
                      <span className="mr-3 text-gray-800">—</span> {detail}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-10">
        <div className="max-w-6xl mx-auto px-12 flex justify-between items-center">
          <div className="flex gap-12">
            {['01 CONSULTATION', '02 CRÉATION', '03 RÉVISION', '04 DÉPLOIEMENT'].map((step, i) => (
              <span key={i} className="text-[10px] text-gray-500 uppercase tracking-widest">{step}</span>
            ))}
          </div>
          <a href="#contact" className="px-8 py-3 border border-white text-[10px] tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all">
            CONSULTATION
          </a>
        </div>
      </footer>
    </div>
  );
}