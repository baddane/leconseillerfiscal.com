import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité & Cookies',
  description: 'Politique de confidentialité du site leconseillerfiscal.com — collecte de données, gestion des cookies, droits RGPD et CNIL.',
  robots: { index: false },
}

export default function ConfidentialitePage() {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">

        <span className="font-mono text-xs uppercase tracking-widest text-gold block mb-4">
          Informations légales
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-black mb-4">
          Politique de Confidentialité & Cookies
        </h1>
        <p className="text-ink/40 text-sm font-mono mb-12">Dernière mise à jour : mars 2026</p>

        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-black prose-a:text-gold prose-a:no-underline hover:prose-a:underline">

          <h2>1. Responsable du traitement</h2>
          <p>
            Le site <strong>leconseillerfiscal.com</strong> est édité à titre personnel.
            Pour toute question relative à vos données, contactez-nous :{' '}
            <a href="mailto:contact@leconseillerfiscal.com">contact@leconseillerfiscal.com</a>.
          </p>

          <h2>2. Données collectées</h2>
          <p>Nous collectons uniquement les données strictement nécessaires :</p>
          <ul>
            <li><strong>Newsletter :</strong> adresse email, collectée avec votre consentement explicite.</li>
            <li><strong>Formulaire de contact :</strong> nom, email, sujet et message, dans le cadre de votre demande.</li>
            <li><strong>Bilan fiscal :</strong> nom, email, téléphone (optionnel), pays d&apos;intérêt, situation, tranche de revenus et message, pour la fourniture d&apos;une analyse personnalisée gratuite.</li>
            <li><strong>Liens d&apos;affiliation :</strong> données anonymisées de navigation (page de provenance, horodatage) via les traceurs partenaires.</li>
          </ul>

          <h2>3. Cookies et traceurs</h2>
          <p>
            Conformément aux recommandations de la <strong>CNIL</strong> et au <strong>RGPD</strong>,
            nous sollicitons votre consentement avant de déposer tout cookie non essentiel sur votre terminal.
            Votre choix est conservé <strong>13 mois maximum</strong>, après quoi nous vous demandons de confirmer à nouveau vos préférences.
          </p>

          <div className="not-prose mt-6 mb-6 border border-ink/10 overflow-hidden">
            <div className="grid grid-cols-3 bg-ink text-paper px-4 py-2.5">
              <span className="font-mono text-xs uppercase tracking-widest">Catégorie</span>
              <span className="font-mono text-xs uppercase tracking-widest">Finalité</span>
              <span className="font-mono text-xs uppercase tracking-widest">Durée</span>
            </div>

            {[
              {
                cat: 'Nécessaires',
                badge: 'Toujours actifs',
                badgeColor: 'bg-green-100 text-green-700',
                finalite: 'Fonctionnement du site, mémorisation de vos préférences (bandeau cookie, modaux dismissibles)',
                duree: 'Session / 1 an',
              },
              {
                cat: 'Analytiques',
                badge: 'Consentement requis',
                badgeColor: 'bg-gold/20 text-ink/60',
                finalite: 'Mesure d\'audience anonymisée (pages vues, sources de trafic). Aucune identification individuelle.',
                duree: '13 mois',
              },
              {
                cat: 'Affiliation',
                badge: 'Consentement requis',
                badgeColor: 'bg-gold/20 text-ink/60',
                finalite: 'Suivi anonymisé des clics vers nos partenaires (Wise, Revolut, ACS, Cigna, April, Waltio, Koinly, N26) pour la mesure des performances.',
                duree: '30 jours',
              },
            ].map((row, i) => (
              <div
                key={row.cat}
                className={`grid grid-cols-3 gap-4 px-4 py-3 text-sm font-sans ${i % 2 === 0 ? 'bg-white' : 'bg-paper/60'} border-t border-ink/5`}
              >
                <div>
                  <div className="font-mono text-xs font-bold mb-1">{row.cat}</div>
                  <span className={`inline-block px-1.5 py-0.5 text-[10px] font-mono ${row.badgeColor}`}>
                    {row.badge}
                  </span>
                </div>
                <div className="text-ink/60 text-xs leading-relaxed">{row.finalite}</div>
                <div className="text-ink/60 text-xs font-mono">{row.duree}</div>
              </div>
            ))}
          </div>

          <p>
            Vous pouvez modifier vos préférences à tout moment en effaçant les données de votre
            navigateur (localStorage), ce qui fera réapparaître le bandeau de consentement.
          </p>

          <h2>4. Utilisation des données</h2>
          <p>Vos données sont utilisées exclusivement pour :</p>
          <ul>
            <li>Vous envoyer notre newsletter (si vous vous êtes inscrit)</li>
            <li>Répondre à vos demandes de contact ou de bilan fiscal</li>
            <li>Améliorer le contenu et les recommandations du site (données agrégées)</li>
          </ul>
          <p>
            Nous ne vendons, ne louons et ne partageons jamais vos données personnelles avec des
            tiers à des fins commerciales.
          </p>

          <h2>5. Hébergement et sous-traitants</h2>
          <ul>
            <li><strong>Vercel Inc.</strong> (États-Unis) — hébergement du site. Conformité RGPD via clauses contractuelles types (SCCs).</li>
            <li><strong>Resend</strong> — envoi des emails transactionnels et de la newsletter.</li>
          </ul>

          <h2>6. Vos droits (RGPD — Art. 13 à 22)</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li><strong>Accès :</strong> obtenir une copie de vos données</li>
            <li><strong>Rectification :</strong> corriger des données inexactes</li>
            <li><strong>Effacement (&laquo; droit à l&apos;oubli &raquo;) :</strong> demander la suppression de vos données</li>
            <li><strong>Opposition :</strong> vous opposer au traitement</li>
            <li><strong>Portabilité :</strong> recevoir vos données dans un format structuré</li>
            <li><strong>Retrait du consentement :</strong> à tout moment, sans préjudice du traitement antérieur</li>
          </ul>
          <p>
            Pour exercer ces droits :{' '}
            <a href="mailto:contact@leconseillerfiscal.com">contact@leconseillerfiscal.com</a>.
            En cas de litige, vous pouvez saisir la{' '}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>{' '}
            (Commission Nationale de l&apos;Informatique et des Libertés).
          </p>

          <h2>7. Durée de conservation</h2>
          <ul>
            <li><strong>Newsletter :</strong> jusqu&apos;à votre désinscription</li>
            <li><strong>Contact / Bilan fiscal :</strong> 3 ans à compter du dernier échange</li>
            <li><strong>Logs de navigation :</strong> 13 mois maximum</li>
            <li><strong>Consentement cookies :</strong> 13 mois</li>
          </ul>

          <h2>8. Modifications</h2>
          <p>
            Toute modification substantielle de cette politique sera signalée sur le site avec
            mise à jour de la date ci-dessus.
          </p>
        </div>
      </div>
    </div>
  )
}
