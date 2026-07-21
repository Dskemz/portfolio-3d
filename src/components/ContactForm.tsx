'use client';

import { useState } from 'react';
import { ButtonRounded } from './DesignSystemButtons';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage('Message envoyé avec succès!');
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Prénom */}
      <div>
        <label className="block text-sm font-semibold text-dark-50 mb-2">
          Prénom
        </label>
        <input
          type="text"
          name="firstName"
          required
          className="w-full px-4 py-3 bg-dark-800 border border-dark-700 text-dark-50 placeholder-dark-500 focus:outline-none focus:border-accent-500 transition-colors"
          placeholder="Jean"
        />
      </div>

      {/* Nom */}
      <div>
        <label className="block text-sm font-semibold text-dark-50 mb-2">
          Nom
        </label>
        <input
          type="text"
          name="lastName"
          required
          className="w-full px-4 py-3 bg-dark-800 border border-dark-700 text-dark-50 placeholder-dark-500 focus:outline-none focus:border-accent-500 transition-colors"
          placeholder="Dupont"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-dark-50 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          className="w-full px-4 py-3 bg-dark-800 border border-dark-700 text-dark-50 placeholder-dark-500 focus:outline-none focus:border-accent-500 transition-colors"
          placeholder="jean@example.com"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-semibold text-dark-50 mb-2">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full px-4 py-3 bg-dark-800 border border-dark-700 text-dark-50 placeholder-dark-500 focus:outline-none focus:border-accent-500 transition-colors resize-none"
          placeholder="Décrivez votre projet..."
        />
      </div>

      {/* Message feedback */}
      {message && (
        <div className="p-4 bg-accent-500 bg-opacity-10 border border-accent-500 text-accent-500 text-sm font-semibold rounded">
          {message}
        </div>
      )}

      {/* Submit Button */}
      <ButtonRounded
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Envoi...' : 'Envoyer'}
      </ButtonRounded>
    </form>
  );
}
