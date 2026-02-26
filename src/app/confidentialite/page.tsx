import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description: 'Politique de confidentialité du site leconseillerfiscal.com — collecte de données, cookies, droits RGPD.',
  robots: { index: false },
}

export default function ConfidentialitePage() {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto prose prose-lg">
        <h1 className="font-serif text-4xl font-black mb-8">Politique de Confidentialité</h1>

        <p className="text-ink/60 text-sm font-mono">Dernière mise à jour : février 2025</p>

        <h2>Données collectées</h2>
        <p>
          Nous collectons uniquement les données strictement nécessaires au fonctionnement du site :
        </p>
        <ul>
          <li><strong>Newsletter :</strong> votre adresse email, collectée avec votre consentement explicite via le formulaire d&apos;inscription</li>
          <li><strong>Formulaire de contact :</strong> nom, email, sujet et message, collectés dans le cadre de votre demande</li>
          <li><strong>Liens d&apos;affiliation :</strong> données anonymisées de navigation (page de provenance, horodatage) pour le suivi de performance</li>
        </ul>

        <h2>Utilisation des données</h2>
        <p>Vos données sont utilisées exclusivement pour :</p>
        <ul>
          <li>Vous envoyer notre newsletter (si vous vous êtes inscrit)</li>
          <li>Répondre à vos demandes de contact</li>
          <li>Améliorer le contenu et les recommandations du site</li>
        </ul>
        <p>
          Nous ne vendons, ne louons et ne partageons jamais vos données personnelles avec des tiers à des fins commerciales.
        </p>

        <h2>Cookies</h2>
        <p>
          Ce site utilise uniquement des cookies techniques essentiels au fonctionnement du site. Nous n&apos;utilisons pas de cookies de tracking publicitaire.
        </p>
        <p>
          Si nous intégrons des outils d&apos;analyse (type Vercel Analytics), ils collectent des données anonymisées et agrégées ne permettant pas l&apos;identification individuelle.
        </p>

        <h2>Hébergement des données</h2>
        <p>
          Les données sont hébergées par Vercel Inc. (États-Unis) et Resend (pour les emails). Ces prestataires offrent des garanties de protection conformes au RGPD via les clauses contractuelles types de la Commission européenne.
        </p>

        <h2>Vos droits (RGPD)</h2>
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
        </p>
        <ul>
          <li><strong>Droit d&apos;accès :</strong> obtenir une copie de vos données personnelles</li>
          <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
          <li><strong>Droit de suppression :</strong> demander l&apos;effacement de vos données</li>
          <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement de vos données</li>
          <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
          <li><strong>Droit de retrait du consentement :</strong> retirer votre consentement à tout moment (désabonnement newsletter)</li>
        </ul>
        <p>
          Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@leconseillerfiscal.com">contact@leconseillerfiscal.com</a>
        </p>

        <h2>Durée de conservation</h2>
        <ul>
          <li><strong>Newsletter :</strong> jusqu&apos;à votre désinscription</li>
          <li><strong>Contact :</strong> 3 ans à compter du dernier échange</li>
          <li><strong>Logs de navigation :</strong> 13 mois maximum</li>
        </ul>

        <h2>Modifications</h2>
        <p>
          Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Toute modification significative sera signalée sur le site.
        </p>
      </div>
    </div>
  )
}
