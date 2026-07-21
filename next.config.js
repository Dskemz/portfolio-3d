/** @type {import('next').NextConfig} */

const nextConfig = {
  // ... autres configurations Next.js

  // ============================================
  // 🔒 HEADERS DE SÉCURITÉ & CSP
  // ============================================
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // ============================================================
          // Content Security Policy (CSP) - Stricte mais compatible
          // ============================================================
          {
            key: "Content-Security-Policy",
            value: [
              // Directive par défaut
              "default-src 'self'",

              // Scripts - Next.js exige 'unsafe-inline' pour les inline scripts
              // À terme, migrer vers strict CSP + script nonces
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.example.com",

              // Styles - Tailwind nécessite unsafe-inline
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

              // Fonts
              "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",

              // Images - autoriser https et data URLs (pour SVG inline)
              "img-src 'self' https: data:",

              // Iframes - ESSENTIEL pour l'éditeur 3D
              "frame-src 'self' https://hub-visite-3d.vercel.app",

              // Connexions (XHR, fetch, WebSocket)
              "connect-src 'self' https://api.example.com https://visite3d.example.com wss: https:",

              // Media (audio, video)
              "media-src 'self' https:",

              // Manifests
              "manifest-src 'self'",

              // Worker sources (Service Worker, Web Worker)
              "worker-src 'self'",

              // Base URI - restriction du <base> tag
              "base-uri 'self'",

              // Form submission
              "form-action 'self'",

              // Framing - empêcher le clickjacking
              "frame-ancestors 'none'",

              // Upgrade insecure requests en production
              process.env.NODE_ENV === "production"
                ? "upgrade-insecure-requests"
                : "",
            ]
              .filter(Boolean)
              .join("; "),
          },

          // ============================================================
          // Autres headers de sécurité
          // ============================================================

          // Empêcher le sniffing MIME
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          // Protection contre le clickjacking
          {
            key: "X-Frame-Options",
            value: "DENY",
          },

          // Activer la protection XSS du navigateur
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },

          // Referrer Policy - limiter les infos envoyées au serveur
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          // Permissions Policy (ex-Feature Policy)
          // Restrict features accessed by the page
          {
            key: "Permissions-Policy",
            value: [
              "accelerometer=()",
              "camera=()",
              "geolocation=()",
              "gyroscope=()",
              "magnetometer=()",
              "microphone=()",
              "payment=()",
              "usb=()",
            ].join(", "),
          },

          // HSTS - forcer HTTPS
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },

      // Routes spécifiques (ex: /api)
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'",
          },
        ],
      },
    ];
  },

  // ============================================
  // Autres configurations de sécurité
  // ============================================

  // Activer les headers de sécurité par défaut
  poweredByHeader: false,

  // Configurer les redirects si nécessaire
  async redirects() {
    return [
      // Rediriger HTTP vers HTTPS en production
      {
        source: "/:path*",
        destination: "https://:host/:path*",
        permanent: true,
        has: [
          {
            type: "header",
            key: "x-forwarded-proto",
            value: "(?!https)",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
