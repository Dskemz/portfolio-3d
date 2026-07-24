'use client';

import { useState } from 'react';

export default function ContactFormClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      (e.target as HTMLFormElement).reset();

      setTimeout(() => setSubmitted(false), 3000);
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {submitted && (
        <div className="p-4 border border-graphite-600 text-papier/75 text-sm bg-graphite-800/40">
          Merci. Votre message a bien été envoyé.
        </div>
      )}

      {/* Prénom + Nom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-[0.15em] uppercase text-papier font-medium">
            ● Prénom
          </label>
          <input
            type="text"
            name="firstName"
            required
            className="bg-graphite-800 border border-graphite-600 text-papier text-sm px-4 py-3 rounded-[2px] focus:outline-none focus:border-orange-500 transition-colors placeholder:text-trait"
            placeholder="Samuel"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-[0.15em] uppercase text-papier font-medium">
            ● Nom
          </label>
          <input
            type="text"
            name="lastName"
            className="bg-graphite-800 border border-graphite-600 text-papier text-sm px-4 py-3 rounded-[2px] focus:outline-none focus:border-orange-500 transition-colors placeholder:text-trait"
            placeholder="Bernard"
          />
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className="text-xs tracking-[0.15em] uppercase text-papier font-medium">
          ● Email
        </label>
        <input
          type="email"
          name="email"
          required
          className="bg-graphite-800 border border-graphite-600 text-papier text-sm px-4 py-3 rounded-[2px] focus:outline-none focus:border-orange-500 transition-colors placeholder:text-trait"
          placeholder="samuel@example.com"
        />
      </div>

      {/* Type de projet + Budget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-[0.15em] uppercase text-papier font-medium">
            ● Type de projet
          </label>
          <select
            name="projectType"
            className="bg-graphite-800 border border-graphite-600 text-papier text-sm px-4 py-3 rounded-[2px] focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">Sélectionnez un type…</option>
            <option value="visite">Visite virtuelle 3D</option>
            <option value="modelisation">Modélisation 3D</option>
            <option value="web">Web 3D & Babylon.js</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-[0.15em] uppercase text-papier font-medium">
            ● Budget estimé
          </label>
          <input
            type="text"
            name="budget"
            className="bg-graphite-800 border border-graphite-600 text-papier text-sm px-4 py-3 rounded-[2px] focus:outline-none focus:border-orange-500 transition-colors placeholder:text-trait"
            placeholder="Ex: 5 000 - 10 000 €"
          />
        </div>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <label className="text-xs tracking-[0.15em] uppercase text-papier font-medium">
          ● Message
        </label>
        <textarea
          name="message"
          required
          rows={6}
          className="bg-graphite-800 border border-graphite-600 text-papier text-sm px-4 py-3 rounded-[2px] focus:outline-none focus:border-orange-500 transition-colors resize-none placeholder:text-trait"
          placeholder="Décrivez votre projet…"
        />
      </div>

      {/* Bouton */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-papier text-black px-8 py-3 text-xs tracking-[0.1em] uppercase font-semibold rounded-[2px] hover:bg-graphite-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
      </button>
    </form>
  );
}