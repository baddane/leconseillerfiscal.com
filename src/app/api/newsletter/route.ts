import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiter
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

function buildWelcomeEmail(email: string, siteUrl: string): string {
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

      <!-- CTA principal -->
      <div style="text-align:center;margin:0 0 40px;">
        <a href="${checklistUrl}"
           style="display:inline-block;background:#c9a84c;color:#0f0e0b;padding:16px 36px;font-family:monospace;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;text-decoration:none;">
          Accéder à la checklist →
        </a>
        <p style="margin:12px 0 0;font-family:monospace;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.1em;">
          Ouvrir dans votre navigateur · Imprimer en PDF
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
          Votre situation est unique
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

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Trop de requêtes. Réessayez plus tard.' }, { status: 429 })
    }

    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const brevoKey = process.env.BREVO_API_KEY
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leconseillerfiscal.com'

    if (!brevoKey) {
      console.log(`[newsletter] New subscriber (dev): ${email}`)
      console.log(`[newsletter] Would send checklist to: ${email}`)
      return NextResponse.json({ ok: true })
    }

    const HEADERS = { 'api-key': brevoKey, 'Content-Type': 'application/json' }

    // ── 1. Ajouter à la liste newsletter ────────────────────────────────────
    const listId = process.env.BREVO_NEWSLETTER_LIST_ID
      ? parseInt(process.env.BREVO_NEWSLETTER_LIST_ID)
      : null

    const contactPayload: Record<string, unknown> = {
      email,
      updateEnabled: true,
    }
    if (listId) contactPayload.listIds = [listId]

    const contactRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(contactPayload),
    })

    if (!contactRes.ok && contactRes.status !== 204) {
      const err = await contactRes.text()
      console.error('[newsletter] Brevo contact error:', err)
      return NextResponse.json({ error: 'Erreur inscription' }, { status: 500 })
    }

    // ── 2. Envoyer l'email de bienvenue + checklist ──────────────────────────
    const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        sender: { name: 'Le Conseiller Fiscal', email: 'noreply@leconseillerfiscal.com' },
        to: [{ email }],
        subject: '✓ Votre checklist fiscale — 10 étapes avant de quitter la France',
        htmlContent: buildWelcomeEmail(email, siteUrl),
        tags: ['welcome', 'checklist'],
      }),
    })

    if (!emailRes.ok) {
      const err = await emailRes.text()
      console.error('[newsletter] Brevo email error:', err)
      // Non-bloquant : l'inscription est confirmée même si l'email échoue
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[newsletter] Error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
