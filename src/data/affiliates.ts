export interface Affiliate {
  id: string;
  name: string;
  category: string;
  commission: string;
  type: 'CPL' | 'CPS' | 'Revshare' | 'Lead';
  description: string;
  cta: string;
  url: string;
  badge: 'high' | 'medium' | 'low';
  logo?: string;
}

export const affiliates: Record<string, Affiliate> = {
  wise: {
    id: 'wise',
    name: 'Wise',
    category: 'Transfert international',
    commission: '30–50€ / ouverture',
    type: 'CPL',
    description: 'Le meilleur outil pour vos virements internationaux. Taux de change réel, frais transparents, IBAN local dans 30+ pays.',
    cta: 'Ouvrir un compte Wise',
    url: '/aller/wise',
    badge: 'high',
  },
  revolut: {
    id: 'revolut',
    name: 'Revolut',
    category: 'Néobanque expat',
    commission: '20–45€ / compte',
    type: 'CPL',
    description: 'La carte pour voyager et vivre à l\'étranger sans frais cachés. Multi-devises, virement instantané, cryptos intégrées.',
    cta: 'Créer un compte Revolut',
    url: '/aller/revolut',
    badge: 'high',
  },
  n26: {
    id: 'n26',
    name: 'N26',
    category: 'Banque en ligne',
    commission: '25–40€ / compte',
    type: 'CPL',
    description: 'Banque 100% mobile, IBAN européen, carte Visa gratuite. Idéale pour les expatriés en Europe.',
    cta: 'Ouvrir N26',
    url: '/aller/n26',
    badge: 'medium',
  },
  acs: {
    id: 'acs',
    name: 'ACS',
    category: 'Assurance santé expat',
    commission: '60–120€ / lead',
    type: 'CPL',
    description: 'Leader français de l\'assurance expat depuis 30 ans. Couverture mondiale, rapatriement, hospitalisation.',
    cta: 'Comparer les offres ACS',
    url: '/aller/acs',
    badge: 'high',
  },
  cigna: {
    id: 'cigna',
    name: 'Cigna Global',
    category: 'Assurance santé internationale',
    commission: '80–150€ / contrat',
    type: 'CPL',
    description: 'Assurance santé internationale premium. Réseau mondial de 1,6 million de prestataires.',
    cta: 'Demander un devis Cigna',
    url: '/aller/cigna',
    badge: 'high',
  },
  april: {
    id: 'april',
    name: 'April International',
    category: 'Assurance expat',
    commission: '50–100€ / lead',
    type: 'CPL',
    description: 'Assureur expat reconnu, filiale du groupe April. Santé, prévoyance, rapatriement.',
    cta: 'Obtenir un devis April',
    url: '/aller/april',
    badge: 'medium',
  },
  waltio: {
    id: 'waltio',
    name: 'Waltio',
    category: 'Logiciel fiscal crypto',
    commission: '20–40% récurrent',
    type: 'Revshare',
    description: 'La solution française pour déclarer vos cryptos. Connexion automatique à vos exchanges, calcul automatique de la plus-value.',
    cta: 'Essayer Waltio gratuitement',
    url: '/aller/waltio',
    badge: 'medium',
  },
  koinly: {
    id: 'koinly',
    name: 'Koinly',
    category: 'Logiciel fiscal crypto',
    commission: '20–30% récurrent',
    type: 'Revshare',
    description: 'Outil international de déclaration crypto. Compatible 700+ exchanges et wallets, rapport fiscal en PDF.',
    cta: 'Essayer Koinly',
    url: '/aller/koinly',
    badge: 'medium',
  },
};

export const getAffiliate = (id: string): Affiliate | undefined => affiliates[id];
