import { NextRequest, NextResponse } from 'next/server'
import { getAffiliateUrl } from '@/lib/affiliates'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ partenaire: string }> }
) {
  const { partenaire } = await params
  const destination = getAffiliateUrl(partenaire)

  // Log le clic (visible dans les logs Vercel)
  const referer = request.headers.get('referer') ?? 'direct'
  const ua = request.headers.get('user-agent') ?? ''
  console.log(
    JSON.stringify({
      event: 'affiliate_click',
      partner: partenaire,
      referer,
      ua: ua.substring(0, 100),
      ts: new Date().toISOString(),
    })
  )

  if (destination === '/') {
    return NextResponse.redirect(new URL('/', request.url), { status: 302 })
  }

  return NextResponse.redirect(destination, { status: 307 })
}
