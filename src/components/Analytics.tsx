'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getConsent } from './CookieBanner'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

// Charge GA4 (si consentement « analytics ») et Meta Pixel (si consentement
// « marketing »). Rien n'est chargé tant que l'utilisateur n'a pas accepté,
// ni si l'ID correspondant n'est pas configuré.
export default function Analytics() {
  const [consent, setConsent] = useState<{ analytics: boolean; marketing: boolean } | null>(null)
  const pathname = usePathname()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    const read = () => {
      const c = getConsent()
      setConsent(c ? { analytics: c.analytics, marketing: c.marketing } : null)
    }
    read()
    window.addEventListener('lcf_consent_changed', read)
    return () => window.removeEventListener('lcf_consent_changed', read)
  }, [])

  const gaOn = !!GA_ID && !!consent?.analytics
  const metaOn = !!META_PIXEL_ID && !!consent?.marketing

  // Page views sur navigation SPA (le premier chargement est déjà compté)
  useEffect(() => {
    if (!gaOn && !metaOn) return
    if (lastPath.current === null) { lastPath.current = pathname; return }
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    if (gaOn) window.gtag?.('event', 'page_view', { page_path: pathname })
    if (metaOn) window.fbq?.('track', 'PageView')
  }, [pathname, gaOn, metaOn])

  return (
    <>
      {gaOn && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {metaOn && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  )
}
