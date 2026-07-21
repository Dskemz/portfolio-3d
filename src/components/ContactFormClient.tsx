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
        <div className="p-4 border border-gray-600 text-gray-300 text-sm">
          Merci. Votre message a bien été envoyé.
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        <div>
          <label className="text-xs tracking-widest uppercase text-gray-600 block mb-3">
            Prénom<span className="text-gray-500">(obligatoire)</span>
          </label>
          <input
            type="text"
            name="firstName"
            required
            className="w-full bg-transparent border-b border-gray-700 text-white text-base font-light pb-2 focus:outline-none focus:border-white transition-colors"
            placeholder=""
          />
        </div>

        <div>
          <label className="text-xs tracking-widest uppercase text-gray-600 block mb-3">
            Nom
          </label>
          <input
            type="text"
            name="lastName"
            className="w-full bg-transparent border-b border-gray-700 text-white text-base font-light pb-2 focus:outline-none focus:border-white transition-colors"
            placeholder=""
          />
        </div>
      </div>

      <div>
        <label className="text-xs tracking-widest uppercase text-gray-600 block mb-3">
          E-mail<span className="text-gray-500">(obligatoire)</span>
        </label>
        <input
          type="email"
          name="email"
          required
          className="w-full bg-transparent border-b border-gray-700 text-white text-base font-light pb-2 focus:outline-none focus:border-white transition-colors"
          placeholder=""
        />
      </div>

      <div>
        <label className="text-xs tracking-widest uppercase text-gray-600 block mb-3">
          Message<span className="text-gray-500">(obligatoire)</span>
        </label>
        <textarea
          name="message"
          required
          rows={6}
          className="w-full bg-transparent border-b border-gray-700 text-white text-base font-light pb-2 focus:outline-none focus:border-white transition-colors resize-none"
          placeholder=""
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 border border-white text-white text-xs tracking-widest uppercase font-light hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
        </button>
      </div>
    </form>
  );
}