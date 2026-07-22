import { NextRequest, NextResponse } from 'next/server'
import { isValidEmail, isBodyTooLarge, sanitizeText } from '@/lib/validation'
import { getEnvInt } from '@/lib/env'
import { supabase } from '@/lib/supabase'
import { BREVO_SENDER } from '@/lib/mail'
import { pickAttribution } from '@/lib/attribution'

// Simple in-memory rate limiter (best-effort on serverless)
const rateLimit = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

const CHECKLIST_PDF_PATH = '/checklist-fiscale-expatrie.pdf'

function buildWelcomeEmail(email: string, siteUrl: string): string {
  const pdfUrl = `${siteUrl}${CHECKLIST_PDF_PATH}`
  const checklistUrl = `${siteUrl}/ressources/checklist-fiscale-expatrie`
  const bilanUrl = `${siteUrl}/bilan-fiscal`

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Votre checklist fiscale gratuite</title></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;background:#f5f0e8;">

    <!-- Header -->
    <div style="background:#0f0e0b;padding:32px 40px;text-align:center;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="text-align:center;">
          <div style="display:inline-block;width:40px;height:40px;background:#c9a84c;border-radius:50%;line-height:40px;text-align:center;margin-bottom:12px;">
            <span style="color:#0f0e0b;font-weight:900;font-size:20px;font-family:Georgia,serif;">C</span>
          </div>
          <div style="color:#f5f0e8;font-family:Georgia,serif;font-size:18px;font-weight:700;letter-spacing:0.02em;">
            Le Conseiller <em style="color:#c9a84c;">Fiscal</em>
          </div>
        </td>
      </tr></table>
    </div>

    <!-- Gold bar -->
    <div style="height:4px;background:#c9a84c;"></div>

    <!-- Body -->
    <div style="padding:48px 40px;">

      <p style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#c9a84c;margin:0 0 16px;">
        Ressource gratuite
      </p>
      <h1 style="font-family:Georgia,serif;font-size:30px;font-weight:900;color:#0f0e0b;margin:0 0 20px;line-height:1.2;">
        Votre checklist fiscale est prête.
      </h1>
      <p style="font-size:16px;color:#555;line-height:1.7;margin:0 0 32px;font-family:Arial,sans-serif;">
        Merci de rejoindre la communauté du Conseiller Fiscal.<br>
        Comme promis, voici votre checklist <strong style="color:#0f0e0b;">10 étapes fiscales obligatoires avant de quitter la France</strong> — un guide pratique pour sécuriser votre départ sans mauvaises surprises.
      </p>

      <!-- CTA principal : téléchargement direct du PDF -->
      <div style="text-align:center;margin:0 0 40px;">
        <a href="${pdfUrl}" download
           style="display:inline-block;background:#c9a84c;color:#0f0e0b;padding:16px 36px;font-family:monospace;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;text-decoration:none;">
          ⬇ Télécharger votre checklist (PDF)
        </a>
        <p style="margin:12px 0 0;font-family:monospace;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.1em;">
          Le PDF est également joint à cet e-mail · <a href="${checklistUrl}" style="color:#999;">version en ligne</a>
        </p>
      </div>

      <!-- Contenu résumé -->
      <div style="background:#fff;border:1px solid #e5e0d8;padding:32px;">
        <p style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#999;margin:0 0 20px;">
          Ce que vous trouverez dans la checklist
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${[
            ['01', 'Vérifier votre domicile fiscal actuel'],
            ['02', 'Identifier la convention fiscale applicable'],
            ['03', "Évaluer votre exposition à l'exit tax"],
            ['04', 'Sécuriser votre date de départ fiscale'],
            ['05', 'Déposer votre déclaration de départ'],
            ['06', 'Organiser vos revenus français résiduels'],
            ['07', "Anticiper la fiscalité de votre épargne"],
            ['08', 'Préparer votre couverture sociale'],
            ['09', "Ouvrir vos comptes à l'étranger"],
            ['10', 'Consulter un fiscaliste avant le départ'],
          ].map(([n, t]) => `
          <tr>
            <td style="width:36px;padding:6px 12px 6px 0;vertical-align:top;">
              <div style="background:#c9a84c;color:#0f0e0b;width:28px;height:28px;line-height:28px;text-align:center;font-family:monospace;font-size:11px;font-weight:700;">
                ${n}
              </div>
            </td>
            <td style="padding:6px 0;vertical-align:middle;font-family:Arial,sans-serif;font-size:14px;color:#0f0e0b;border-bottom:1px solid #f0ebe0;">
              ${t}
            </td>
          </tr>`).join('')}
        </table>
      </div>

      <!-- Separator -->
      <div style="height:1px;background:#e5e0d8;margin:40px 0;"></div>

      <!-- Bilan CTA -->
      <div style="background:#0f0e0b;padding:28px 32px;">
        <p style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#c9a84c;margin:0 0 12px;">
          Analyse personnalisée
        </p>
        <p style="color:#f5f0e8;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;margin:0 0 20px;">
          Cette checklist est un point de départ. Pour une analyse personnalisée de votre profil fiscal — pays cible, épargne, exit tax, convention — demandez votre bilan gratuit.
        </p>
        <a href="${bilanUrl}"
           style="display:inline-block;background:#c9a84c;color:#0f0e0b;padding:12px 24px;font-family:monospace;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;text-decoration:none;">
          Demander mon bilan fiscal gratuit →
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="padding:24px 40px;border-top:1px solid #e5e0d8;text-align:center;">
      <p style="font-family:monospace;font-size:10px;color:#bbb;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px;">
        leconseillerfiscal.com
      </p>
      <p style="font-family:Arial,sans-serif;font-size:11px;color:#ccc;margin:0;line-height:1.5;">
        Vous recevez cet email car vous vous êtes inscrit à notre newsletter.<br>
        <a href="${siteUrl}/confidentialite" style="color:#c9a84c;text-decoration:none;">Politique de confidentialité</a>
        &nbsp;·&nbsp;
        Pour vous désabonner, répondez avec l'objet « Désabonnement ».
      </p>
    </div>

  </div>
</body>
</html>`
}

// Version texte brut (multipart) : améliore le classement en boîte principale
// et réduit le score spam par rapport à un e-mail 100% HTML.
function buildWelcomeText(siteUrl: string): string {
  const pdfUrl = `${siteUrl}${CHECKLIST_PDF_PATH}`
  const bilanUrl = `${siteUrl}/bilan-fiscal`
  return [
    'Le Conseiller Fiscal',
    '',
    'Votre checklist fiscale est prête.',
    '',
    'Merci de rejoindre la communauté du Conseiller Fiscal. Comme promis, voici',
    'votre checklist « 10 étapes fiscales obligatoires avant de quitter la France ».',
    '',
    'Telecharger le PDF : ' + pdfUrl,
    '(Le PDF est aussi joint a cet e-mail.)',
    '',
    'Les 10 etapes :',
    '01. Verifier votre domicile fiscal actuel',
    '02. Identifier la convention fiscale applicable',
    "03. Evaluer votre exposition a l'exit tax",
    '04. Securiser votre date de depart fiscale',
    '05. Deposer votre declaration de depart',
    '06. Organiser vos revenus francais residuels',
    "07. Anticiper la fiscalite de votre epargne",
    '08. Preparer votre couverture sociale',
    "09. Ouvrir vos comptes a l'etranger",
    '10. Consulter un fiscaliste avant le depart',
    '',
    'Pour une analyse personnalisee de votre situation, demandez votre bilan',
    'fiscal gratuit : ' + bilanUrl,
    '',
    '---',
    siteUrl.replace(/^https?:\/\//, ''),
    "Vous recevez cet e-mail car vous vous etes inscrit sur notre site.",
  ].join('\n')
}

export async function POST(request: NextRequest) {
  try {
    if (isBodyTooLarge(request.headers.get('content-length'))) {
      return NextResponse.json({ error: 'Corps de requête trop volumineux' }, { status: 413 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Trop de requêtes. Réessayez plus tard.' }, { status: 429 })
    }

    const body = await request.json()
    const { email } = body

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const brevoKey = process.env.BREVO_API_KEY
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leconseillerfiscal.com'

    // ── Double écriture (best-effort) : persistance Supabase comme lead ────
    const { error: dbError } = await supabase.from('lcf_leads').insert({
      email,
      source: 'newsletter',
      ...pickAttribution(body, sanitizeText),
    })
    if (dbError) {
      console.error('[newsletter] Supabase insert error:', dbError.message)
    }

    if (!brevoKey) {
      console.log(`[newsletter] New subscriber (dev): ${email}`)
      console.log(`[newsletter] Would send checklist to: ${email}`)
      return NextResponse.json({ ok: true })
    }

    const HEADERS = { 'api-key': brevoKey, 'Content-Type': 'application/json' }

    // ── 1. Ajouter à la liste newsletter ────────────────────────────────────
    const listId = getEnvInt('BREVO_NEWSLETTER_LIST_ID')

    const contactPayload: Record<string, unknown> = {
      email,
      updateEnabled: true,
    }
    if (listId) contactPayload.listIds = [listId]

    // ── Brevo best-effort : ne JAMAIS faire échouer l'inscription ───────────
    // Le lead est déjà enregistré dans Supabase et le PDF est téléchargeable
    // immédiatement côté client. Toute erreur Brevo (ex. restriction d'IP
    // autorisées, domaine non authentifié) est loguée mais non bloquante :
    // l'utilisateur voit toujours l'état "succès" et son bouton de téléchargement.
    try {
      const contactRes = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(contactPayload),
      })
      if (!contactRes.ok && contactRes.status !== 204) {
        console.error('[newsletter] Brevo contact error:', await contactRes.text())
      }
    } catch (e) {
      console.error('[newsletter] Brevo contact exception:', e)
    }

    // ── 2. Envoyer l'email de bienvenue + checklist (best-effort) ────────────
    try {
      const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          sender: BREVO_SENDER,
          to: [{ email }],
          subject: 'Votre checklist fiscale — 10 étapes avant de quitter la France',
          htmlContent: buildWelcomeEmail(email, siteUrl),
        textContent: buildWelcomeText(siteUrl),
          // PDF joint (Brevo récupère le fichier depuis l'URL publique)
          attachment: [
            { url: `${siteUrl}${CHECKLIST_PDF_PATH}`, name: 'checklist-fiscale-expatrie.pdf' },
          ],
          tags: ['welcome', 'checklist'],
        }),
      })
      if (!emailRes.ok) {
        console.error('[newsletter] Brevo email error:', await emailRes.text())
      }
    } catch (e) {
      console.error('[newsletter] Brevo email exception:', e)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[newsletter] Error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
