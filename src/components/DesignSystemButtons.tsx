'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

/**
 * Bouton arrondi (border-radius: 999px)
 * Pour éléments d'action
 */
export function ButtonRounded({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-semibold transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantStyles = {
    primary:
      'bg-accent-500 text-dark-950 hover:bg-accent-600 active:bg-accent-700 focus:ring-accent-500',
    secondary:
      'bg-dark-800 text-dark-50 border border-dark-600 hover:bg-dark-700 active:bg-dark-600 focus:ring-accent-500',
    ghost:
      'bg-transparent text-dark-50 border border-dark-600 hover:bg-dark-800 hover:border-dark-500 focus:ring-accent-500'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Lien arrondi (border-radius: 999px)
 */
export function LinkRounded({
  href = '#',
  className = '',
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string }) {
  return (
    <a
      href={href}
      className={`inline-block px-6 py-3 text-base font-semibold text-dark-950 bg-accent-500 rounded-full hover:bg-accent-600 transition-colors duration-300 ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

/**
 * Section avec structure carrée (angles droits)
 */
export function SectionSquare({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={`bg-dark-900 px-6 py-12 md:px-12 md:py-16 border border-dark-800 ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

/**
 * Conteneur avec structure carrée
 */
export function ContainerSquare({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-dark-900 p-6 md:p-8 border border-dark-800 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Diviseur minimaliste
 */
export function Divider({ className = '' }: { className?: string }) {
  return <div className={`h-px bg-dark-800 ${className}`} />;
}

/**
 * Badge accent
 */
export function Badge({
  variant = 'accent',
  children,
  className = ''
}: {
  variant?: 'accent' | 'dark' | 'neutral';
  children: React.ReactNode;
  className?: string;
}) {
  const variantStyles = {
    accent: 'bg-accent-500 text-dark-950',
    dark: 'bg-dark-800 text-dark-50 border border-dark-600',
    neutral: 'bg-dark-700 text-dark-300'
  };

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
