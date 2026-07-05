// Identité d'expédition unifiée des e-mails sortants.
// Le domaine leconseillerfiscal.com est authentifié (DKIM) chez Brevo et
// vérifié chez Resend, donc contact@ peut servir d'expéditeur — et les
// réponses arrivent directement sur cette boîte (via Cloudflare Email Routing).
// Surchargeable par la variable d'env MAIL_FROM_EMAIL si besoin.
export const MAIL_FROM_NAME = 'Le Conseiller Fiscal'
export const MAIL_FROM_EMAIL = process.env.MAIL_FROM_EMAIL ?? 'contact@leconseillerfiscal.com'

// Format Brevo : { name, email }
export const BREVO_SENDER = { name: MAIL_FROM_NAME, email: MAIL_FROM_EMAIL }

// Format Resend : "Nom <email>"
export const RESEND_FROM = `${MAIL_FROM_NAME} <${MAIL_FROM_EMAIL}>`
