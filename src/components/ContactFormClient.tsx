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
    <form onSubmit={handleSubmit} className="space-y-6 font-mono text-sm">
      {submitted && (
        <div className="rounded-[8px] border border-[#ff6a3d]/45 bg-[#ff6a3d]/10 p-4 text-sm text-white/80">
          Merci. Votre message a bien été envoyé.
        </div>
      )}

      {/* Prénom + Nom */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/75">
            <span className="text-[#ff6a3d]">●</span> Prénom
          </label>
          <input
            type="text"
            name="firstName"
            required
            className="rounded-[14px] border border-white/15 bg-[#0b0f14] px-4 py-3 text-sm text-white transition-colors placeholder:text-white/30 focus:border-[#ff6a3d] focus:outline-none focus:ring-1 focus:ring-[#ff6a3d]/35"
            placeholder="Samuel"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/75">
            <span className="text-[#ff6a3d]">●</span> Nom
          </label>
          <input
            type="text"
            name="lastName"
            className="rounded-[14px] border border-white/15 bg-[#0b0f14] px-4 py-3 text-sm text-white transition-colors placeholder:text-white/30 focus:border-[#ff6a3d] focus:outline-none focus:ring-1 focus:ring-[#ff6a3d]/35"
            placeholder="Bernard"
          />
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium uppercase tracking-[0.15em] text-white/75">
          <span className="text-[#ff6a3d]">●</span> Email
        </label>
        <input
          type="email"
          name="email"
          required
          className="rounded-[14px] border border-white/15 bg-[#0b0f14] px-4 py-3 text-sm text-white transition-colors placeholder:text-white/30 focus:border-[#ff6a3d] focus:outline-none focus:ring-1 focus:ring-[#ff6a3d]/35"
          placeholder="samuel@example.com"
        />
      </div>

      {/* Type de projet + Budget */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-[0.15em] text-white/75">
            <span className="text-[#ff6a3d]">●</span> Type de projet
          </label>
          <select
            name="projectType"
            className="rounded-[14px] border border-white/15 bg-[#0b0f14] px-4 py-3 text-xs text-white transition-colors focus:border-[#ff6a3d] focus:outline-none focus:ring-1 focus:ring-[#ff6a3d]/35"
          >
            <option value="">Sélectionnez un type…</option>
            <option value="visite">Visite virtuelle 3D</option>
            <option value="modelisation">Modélisation 3D</option>
            <option value="web">Web 3D & Babylon.js</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-[0.15em] text-white/75">
            <span className="text-[#ff6a3d]">●</span> Budget estimé
          </label>
          <input
            type="text"
            name="budget"
            className="rounded-[14px] border border-white/15 bg-[#0b0f14] px-4 py-3 text-xs text-white transition-colors placeholder:text-white/30 focus:border-[#ff6a3d] focus:outline-none focus:ring-1 focus:ring-[#ff6a3d]/35"
            placeholder="Ex: 5 000 - 10 000 €"
          />
        </div>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-[0.15em] text-white/75">
          <span className="text-[#ff6a3d]">●</span> Message
        </label>
        <textarea
          name="message"
          required
          rows={10}
          className="resize-none rounded-[14px] border border-white/15 bg-[#0b0f14] px-4 py-3 text-xs text-white transition-colors placeholder:text-white/30 focus:border-[#ff6a3d] focus:outline-none focus:ring-1 focus:ring-[#ff6a3d]/35"
          placeholder="Décrivez votre projet…"
        />
      </div>

      {/* Bouton */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-[14px] bg-[#ff6a3d] px-8 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#090c11] transition-colors duration-200 hover:bg-[#ff855f] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
      </button>
    </form>
  );
}
