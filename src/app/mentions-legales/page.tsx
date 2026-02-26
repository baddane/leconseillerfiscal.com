import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions Légales',
  description: 'Mentions légales du site leconseillerfiscal.com — éditeur, hébergement, propriété intellectuelle et responsabilité.',
  robots: { index: false },
}

export default function MentionsLegalesPage() {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto prose prose-lg">
        <h1 className="font-serif text-4xl font-black mb-8">Mentions Légales</h1>

        <h2>Éditeur du site</h2>
        <p>
          Le site <strong>leconseillerfiscal.com</strong> est édité par Le Conseiller Fiscal.
        </p>
        <ul>
          <li>Email : contact@leconseillerfiscal.com</li>
          <li>Directeur de la publication : Le Conseiller Fiscal</li>
        </ul>

        <h2>Hébergement</h2>
        <p>
          Ce site est hébergé par <strong>Vercel Inc.</strong>, 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
          Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble du contenu publié sur ce site (textes, images, graphiques, logos, icônes) est protégé par le droit d&apos;auteur et le droit de la propriété intellectuelle. Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site est interdite sans l&apos;autorisation écrite préalable de l&apos;éditeur.
        </p>

        <h2>Liens d&apos;affiliation</h2>
        <p>
          Certains liens présents sur ce site sont des liens d&apos;affiliation. Lorsque vous cliquez sur ces liens et effectuez un achat ou une inscription, nous pouvons recevoir une commission. Cela ne modifie pas le prix que vous payez et nous permet de financer la production de contenu gratuit.
        </p>
        <p>
          Nos recommandations sont basées sur notre analyse indépendante. Le statut d&apos;affilié n&apos;influence pas notre jugement éditorial.
        </p>

        <h2>Responsabilité</h2>
        <p>
          Les informations publiées sur ce site sont fournies à titre purement informatif et ne constituent en aucun cas un conseil fiscal, juridique ou financier personnalisé. L&apos;éditeur décline toute responsabilité quant aux décisions prises sur la base des informations contenues dans ce site.
        </p>
        <p>
          La fiscalité évolue régulièrement. Malgré nos efforts pour maintenir les informations à jour, certaines données peuvent être obsolètes. Nous vous encourageons à consulter un professionnel qualifié avant toute décision fiscale importante.
        </p>

        <h2>Droit applicable</h2>
        <p>
          Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.
        </p>
      </div>
    </div>
  )
}
