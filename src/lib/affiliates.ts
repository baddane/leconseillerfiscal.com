// URLs d'affiliation — remplacez par vos vrais liens de partenaires
export const affiliateUrls: Record<string, string> = {
  wise: 'https://wise.com/invite/u/leconseillerfiscal',
  revolut: 'https://revolut.com/referral/leconseillerfiscal',
  april: 'https://www.april-international.com/',
  acs: 'https://www.acs-ami.com/',
  cigna: 'https://www.cigna.com/global-individual/',
  waltio: 'https://waltio.co/',
  koinly: 'https://koinly.io/',
  n26: 'https://n26.com/r/leconseillerfiscal',
}

export function getAffiliateUrl(partner: string): string {
  return affiliateUrls[partner] ?? '/'
}

// Métadonnées d'affichage pour les encarts affiliés
export interface AffiliateDisplay {
  id: string
  name: string
  category: string
  commission: string
  description: string
  cta: string
  badge: 'high' | 'medium' | 'low'
}

export const affiliateDisplay: Record<string, AffiliateDisplay> = {
  wise: {
    id: 'wise',
    name: 'Wise',
    category: 'Transfert international',
    commission: '30–50€ / compte ouvert',
    description: 'Taux de change réel, frais transparents, IBAN local dans 10+ pays. L\'outil n°1 des expatriés.',
    cta: 'Ouvrir un compte Wise',
    badge: 'high',
  },
  revolut: {
    id: 'revolut',
    name: 'Revolut',
    category: 'Néobanque expat',
    commission: '20–45€ / compte',
    description: 'Carte multi-devises, virement instantané, cryptos intégrées. Parfait pour les dépenses à l\'étranger.',
    cta: 'Créer un compte Revolut',
    badge: 'high',
  },
  acs: {
    id: 'acs',
    name: 'ACS',
    category: 'Assurance santé expat',
    commission: '60–120€ / lead qualifié',
    description: 'Leader français de l\'assurance expatriée depuis 30 ans. Couverture mondiale, rapatriement, hospitalisation.',
    cta: 'Comparer les offres ACS',
    badge: 'high',
  },
  cigna: {
    id: 'cigna',
    name: 'Cigna Global',
    category: 'Assurance santé internationale',
    commission: '80–150€ / contrat',
    description: 'Réseau mondial de 1,6 million de prestataires. Idéal pour les États-Unis et les grandes mobilités.',
    cta: 'Demander un devis Cigna',
    badge: 'high',
  },
  april: {
    id: 'april',
    name: 'April International',
    category: 'Assurance expat',
    commission: '50–100€ / lead',
    description: 'Assureur expat du groupe April. Service client français, formules flexibles, excellent dentaire.',
    cta: 'Obtenir un devis April',
    badge: 'medium',
  },
  waltio: {
    id: 'waltio',
    name: 'Waltio',
    category: 'Fiscal crypto',
    commission: '20–40% récurrent',
    description: 'Solution française pour déclarer vos cryptos. Connexion automatique à 400+ exchanges.',
    cta: 'Essayer Waltio gratuitement',
    badge: 'medium',
  },
  koinly: {
    id: 'koinly',
    name: 'Koinly',
    category: 'Fiscal crypto',
    commission: '20–30% récurrent',
    description: 'Compatible 700+ exchanges et wallets. Rapport fiscal PDF en quelques clics.',
    cta: 'Essayer Koinly',
    badge: 'medium',
  },
  n26: {
    id: 'n26',
    name: 'N26',
    category: 'Banque en ligne',
    commission: '25–40€ / compte',
    description: 'Banque 100% mobile, IBAN européen, carte Visa gratuite.',
    cta: 'Ouvrir N26',
    badge: 'medium',
  },
}
