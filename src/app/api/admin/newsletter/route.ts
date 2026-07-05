import { NextRequest, NextResponse } from 'next/server'
import { getAllArticleMetaSynced, type ArticleMeta } from '@/lib/articles'
import { buildNewsletterEmail, dateVerifSortKey } from '@/lib/newsletter-email'
import { getEnvInt } from '@/lib/env'
import { isValidEmail } from '@/lib/validation'
import { verifyAdminPassword } from '@/lib/adminAuth'
import { BREVO_SENDER } from '@/lib/mail'

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }

  const { password, action, slugs, testEmail } = body as {
    password?: string
    action?: string
    slugs?: string[]
    testEmail?: string
  }

  if (!(await verifyAdminPassword(password))) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
  }

  const metas = getAllArticleMetaSynced()

  // ── Lister les articles pour le sélecteur ────────────────────────────────
  if (action === 'list') {
    const articles = [...metas].sort((a, b) => {
      // actualités récentes d'abord, puis le reste
      const ka = a.pays === 'actualite' ? dateVerifSortKey(a.dateVerification) + 1_000_000 : 0
      const kb = b.pays === 'actualite' ? dateVerifSortKey(b.dateVerification) + 1_000_000 : 0
      if (kb !== ka) return kb - ka
      return a.title.localeCompare(b.title)
    })
    return NextResponse.json({
      articles: articles.map((a) => ({ slug: a.slug, title: a.title, pays: a.pays })),
    })
  }

  // ── Construire l'e-mail (test ou envoi) ──────────────────────────────────
  const selected = Array.isArray(slugs) ? slugs : []
  const featured = metas.filter((m) => selected.includes(m.slug))
  if (featured.length === 0) {
    return NextResponse.json({ error: 'Sélectionnez au moins un article' }, { status: 400 })
  }

  const vogue: ArticleMeta[] = metas
    .filter((m) => m.pays === 'actualite' && !selected.includes(m.slug))
    .sort((a, b) => dateVerifSortKey(b.dateVerification) - dateVerifSortKey(a.dateVerification))
    .slice(0, 5)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.leconseillerfiscal.com'
  const { subject, html, text } = buildNewsletterEmail(featured, vogue, siteUrl)

  const brevoKey = process.env.BREVO_API_KEY
  if (!brevoKey) {
    return NextResponse.json(
      { error: 'BREVO_API_KEY non configurée sur le serveur' },
      { status: 500 },
    )
  }
  const HEADERS = { 'api-key': brevoKey, 'Content-Type': 'application/json', accept: 'application/json' }

  // ── Envoi d'un test à une seule adresse ──────────────────────────────────
  if (action === 'test') {
    if (!isValidEmail(testEmail)) {
      return NextResponse.json({ error: 'Adresse e-mail de test invalide' }, { status: 400 })
    }
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        sender: BREVO_SENDER,
        to: [{ email: testEmail }],
        subject: `[TEST] ${subject}`,
        htmlContent: html,
        textContent: text,
      }),
    })
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Échec de l’envoi du test : ' + (await res.text()) },
        { status: 502 },
      )
    }
    return NextResponse.json({ ok: true, sent: 'test', to: testEmail })
  }

  // ── Envoi de la campagne à toute la liste newsletter ─────────────────────
  if (action === 'send') {
    const listId = getEnvInt('BREVO_NEWSLETTER_LIST_ID')
    if (!listId) {
      return NextResponse.json(
        { error: 'BREVO_NEWSLETTER_LIST_ID non configuré sur le serveur' },
        { status: 500 },
      )
    }
    const createRes = await fetch('https://api.brevo.com/v3/emailCampaigns', {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        name: `Newsletter ${new Date().toISOString().slice(0, 16)} — ${subject}`.slice(0, 120),
        subject,
        sender: BREVO_SENDER,
        type: 'classic',
        htmlContent: html,
        recipients: { listIds: [listId] },
      }),
    })
    if (!createRes.ok) {
      return NextResponse.json(
        { error: 'Création de campagne échouée : ' + (await createRes.text()) },
        { status: 502 },
      )
    }
    const { id } = (await createRes.json()) as { id: number }
    const sendRes = await fetch(`https://api.brevo.com/v3/emailCampaigns/${id}/sendNow`, {
      method: 'POST',
      headers: HEADERS,
    })
    if (!sendRes.ok && sendRes.status !== 204) {
      return NextResponse.json(
        { error: 'Envoi de campagne échoué : ' + (await sendRes.text()) },
        { status: 502 },
      )
    }
    return NextResponse.json({ ok: true, sent: 'campaign', campaignId: id })
  }

  return NextResponse.json({ error: 'Action inconnue' }, { status: 400 })
}
