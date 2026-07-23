# Prompt récurrent — Publication de 2 articles SEO fiscalité/expatriation

> **Usage :** copier-coller ce prompt tel quel dans le chat pour déclencher une nouvelle vague de publication. Ne pas modifier la structure : le prompt est auto-porteur et exploite la connaissance de l'agent sur l'état actuel du site.

---

## Mission

Tu es en charge de la **stratégie éditoriale SEO** de `leconseillerfiscal.com`. Chaque déclenchement de ce prompt doit produire **deux nouveaux articles MDX** de très haute qualité, publiés sur la branche `claude/add-tax-expatriation-articles-<random>` (tu peux réutiliser une branche dédiée du type `claude/seo-articles-batch-<date>`).

L'objectif est double :
1. **Ranker sur la SERP Google France** sur des requêtes fiscalité + expatriation française.
2. **Densifier le maillage interne** du site pour renforcer l'autorité topique et le crawl.

## Étapes obligatoires

### 1. Audit rapide avant rédaction

Avant d'écrire quoi que ce soit :

1. Liste les articles déjà présents dans `content/articles/*.mdx` (ne pas créer de doublon — un article traitant déjà le sujet disqualifie l'idée).
2. Consulte `src/data/countries.ts` pour connaître les pays déjà couverts et leurs angles.
3. Consulte `src/data/affiliates.ts` pour n'utiliser que des IDs d'affiliés existants.
4. Regarde les 5 derniers commits pour comprendre ce qui vient d'être publié et éviter le chevauchement.
5. Vérifie le routing : les articles sont accessibles à `/expatriation/{pays}/{slug}` et le sitemap est régénéré automatiquement.

### 2. Sélection des sujets

Choisir **2 sujets complémentaires** selon cette grille de priorité (dans l'ordre) :

1. **Actualité fiscale récente** (lois de finances, réformes, jurisprudence, conventions révisées, directives UE — DAC7, DAC8, CARF, MiCA, Pilier 2 OCDE, ATAD 3, etc.).
2. **Gap thématique** : un sujet avec volume de recherche potentiel non encore couvert.
3. **Gap géographique** : un pays attractif pour expatriés français sans article dédié (Monaco, Andorre, Malte, Chypre, Panama, Irlande, Nouvelle-Zélande, Brésil, Tunisie, Sénégal, etc.).
4. **Sujet transversal à forte intention commerciale** (trust et expatriation, holding internationale, pacte Dutreil et expatriation, cession d'entreprise avant départ, rachat de trimestres depuis l'étranger, PER et expatriation, stock-options à l'étranger, etc.).

**Règles :**

- Les 2 sujets doivent appartenir à **deux catégories différentes** parmi celles ci-dessus.
- Chaque sujet doit être **unique** : pas de réplique d'un article existant (chercher le slug le plus proche pour vérifier).
- Prioriser les sujets **"2026"** (dateVerification: "avril 2026" ou mois courant) pour bénéficier de la fraîcheur.
- Écarter les sujets déjà massivement couverts par la concurrence (ex. résumés génériques de la loi Beckham — sauf angle nouveau).

### 3. Recherche factuelle

Avant de rédiger, effectuer une **recherche web rapide** sur chaque sujet pour vérifier :

- Les chiffres, seuils, taux et dates (barèmes, abattements, plafonds).
- L'état actuel du droit (texte en vigueur vs projet de loi).
- Les conventions fiscales bilatérales concernées (date de signature, avenants récents).
- Les actualités des 6 derniers mois (une loi de finances corrige tout).

Si un fait est incertain, indiquer « à vérifier auprès de l'administration » ou exprimer une fourchette. **Ne jamais inventer un chiffre**.

### 4. Rédaction des articles

Chaque article doit respecter **strictement** ce gabarit et ces règles :

#### Frontmatter YAML

```yaml
---
title: "<titre SEO 55-70 caractères, inclut l'année si pertinent>"
metaDescription: "<140-160 caractères, inclut le mot-clé principal et un bénéfice>"
pays: "<slug du pays OU 'actualite' OU 'outils'>"
slug: "<slug kebab-case, 5-8 mots, inclut le mot-clé principal>"
dateVerification: "<mois année, ex: avril 2026>"
datePublished: "<date de publication machine, format AAAA-MM-JJ, ex: 2026-07-23>"
motClePrincipal: "<mot-clé cible exact>"
affiliations: ["<ids d'affiliés existants>"]
faq:
  - question: "<question fréquente, style PAA>"
    reponse: "<réponse de 50-120 mots>"
  # 4 à 6 questions FAQ
---
```

**Règles frontmatter :**

- `pays` **doit** correspondre soit à un slug présent dans `src/data/countries.ts`, soit à un hub existant (`actualite`, `outils`). Créer un nouveau hub **uniquement** si `src/app/expatriation/[pays]/page.tsx > topicHubs` le prévoit (sinon utiliser un hub existant ou un pays existant).
- `affiliations` : **uniquement** les IDs présents dans `src/data/affiliates.ts` (wise, revolut, n26, acs, cigna, april, waltio, koinly). Maximum 3 par article, cohérents avec le sujet.
- `slug` doit être le même que le nom du fichier (sans `.mdx`).

#### Structure du contenu

1. **Introduction** (80-150 mots) — pose le problème, explique pourquoi le sujet est critique en 2026, annonce le plan.
2. **Plan hiérarchisé H2 / H3** — 8 à 14 sections au total. Titres riches en mots-clés secondaires mais naturels.
3. **Éléments SEO enrichissants** (obligatoires sur chaque article) :
   - Au moins **2 tableaux markdown** (GFM) avec données concrètes.
   - Au moins **2 listes à puces** structurées.
   - Au moins **1 liste numérotée** (étapes, checklist).
   - Encart ou section "Ce qu'il faut retenir" / "Checklist finale" en fin d'article.
   - Exemples chiffrés concrets (ex. « un célibataire avec 400 000 € de revenus... »).
4. **Longueur** : 1 800 à 3 000 mots utiles (sans compter frontmatter).
5. **Ton** : expert, précis, francophone de France, sans jargon inutile, sans anglicismes gratuits.
6. **Terminologie** : toujours utiliser « résidence fiscale » (pas « domicile fiscal » seul), « non-résident » au sens CGI, « convention fiscale bilatérale » pour la première occurrence puis « convention ».

#### Maillage interne — la règle d'or

Chaque article **doit contenir 8 à 15 liens internes** vers d'autres articles du site. Format obligatoire :

```markdown
[libellé descriptif](/expatriation/<pays>/<slug>)
```

**Sélection des liens :**

- Couvrir au minimum : 1 lien vers un article "actualite", 1 vers un article "outils", 2 vers des articles pays pertinents.
- Privilégier les articles **stratégiques** (guides piliers, simulateurs, comparatifs) avec un bon maillage entrant.
- Ajouter un **lien vers `/bilan-fiscal`** dans la conclusion (CTA commercial).
- Vérifier que **chaque URL existe réellement** (fichier `.mdx` présent pour le slug cité).
- Ne pas faire pointer plusieurs liens vers la même cible dans un même article (diluer l'ancre).

#### FAQ (schema.org FAQPage)

- **4 à 6 questions** dans le frontmatter `faq:`.
- Questions réellement posées (style "People Also Ask").
- Réponses **autonomes** (compréhensibles sans lire l'article), 50 à 120 mots.
- Chaque réponse doit contenir au moins un chiffre, un seuil, ou une référence juridique si le sujet s'y prête.

#### Conclusion

- Section "Ce qu'il faut retenir" ou tableau récapitulatif.
- Section "Prochaines étapes" avec 3 à 5 actions concrètes.
- Dernier paragraphe avec CTA vers `/bilan-fiscal`.

### 5. Workflow Git

1. **Créer ou basculer** sur la branche dédiée (`claude/add-tax-expatriation-articles-<slug>` ou similaire, **jamais directement `main`**).
2. Créer les 2 fichiers dans `content/articles/<slug>.mdx`.
3. Valider que les 2 articles **compilent** mentalement : frontmatter YAML valide, liens internes existants, affiliés existants.
4. Commit avec message clair : `Publier 2 articles SEO : <sujet 1> + <sujet 2>`.
5. **Push** la branche vers `origin` avec `-u`.
6. **Ne pas ouvrir de PR** sauf demande explicite. L'utilisateur mergera manuellement.

### 6. Restitution

Dans la réponse finale au chat, fournir sous forme concise :

- Les **2 slugs** créés et leurs URL cibles (`/expatriation/<pays>/<slug>`).
- Pour chaque article : **mot-clé principal**, **nombre de mots approximatif**, **nombre de liens internes**, **nombre de questions FAQ**.
- La **liste des pages internes** référencées (pour validation manuelle).
- Le **nom de la branche** poussée.

## Contraintes de qualité absolues

- **Aucune invention factuelle.** Si un chiffre n'est pas certain, préférer une fourchette ou reformuler.
- **Aucun article de moins de 1 800 mots**. Un article court ne range pas sur les SERP concurrentielles.
- **Aucun doublon** avec un article existant : vérifier la liste complète avant de commencer.
- **Aucun lien interne mort** : toujours vérifier que le `.mdx` cible existe.
- **Aucun affilié inexistant** dans le frontmatter.
- **Aucune promesse illégale** (évasion fiscale, montages abusifs). Le site parle d'**optimisation légale**.
- **Aucun plagiat** : le contenu doit être original, reformulé, enrichi d'analyses.

## Idées de sujets en réserve (à piocher si manque d'inspiration)

- Monaco : la convention 1963 (✅ publié)
- Résidence fiscale : les 4 critères article 4B (✅ publié)
- Andorre : résidence passive et résidence active pour Français
- Malte : programme Global Residence, fiscalité remittance basis
- Chypre : régime non-dom, 60 jours, Digital Nomad Visa
- Irlande : régime remittance basis pour les résidents non-dom
- Nouvelle-Zélande : transitional resident exemption 4 ans
- Brésil : convention France-Brésil, régime des "não-residentes"
- Tunisie : retraités français et régime fiscal tunisien
- Sénégal : convention et fiscalité des Français de la diaspora
- Pacte Dutreil et expatriation du dirigeant
- Cession d'entreprise : quand partir pour optimiser ?
- Rachats de trimestres retraite depuis l'étranger
- PER (Plan Épargne Retraite) en expatriation
- Stock-options et actions gratuites en cas de départ
- Trust anglo-saxon et résidence fiscale française
- DAC8 : la nouvelle directive crypto 2026 pour les expatriés
- ATAD 3 (Unshell) : impact sur les holdings des expatriés
- Convention France-USA : ce que change la réforme Trump 2025-2026
- Frontaliers Monaco-France : travailler à Monaco, vivre en France
- Mariage international et régime matrimonial fiscal
- Divorce d'expatriés : prestations compensatoires et imposition
- CFE pour fonctionnaires détachés à l'étranger
- Impatriation en France : le régime article 155 B CGI
- Loueur en meublé professionnel (LMP) non-résident
- Investissement Pinel / Denormandie et non-résidence
- Plus-values immobilières : exonération résidence principale et départ à l'étranger
- Crédit d'impôt étranger : mécanisme pratique et erreurs fréquentes
- Revenus de YouTube / TikTok / streaming pour expatriés français
- Dropshipping et e-commerce : quelle structure à l'étranger ?

## Checklist de validation finale (à dérouler mentalement avant commit)

- [ ] 2 articles écrits dans `content/articles/<slug>.mdx`
- [ ] Frontmatter YAML complet et valide (title, metaDescription, pays, slug, dateVerification, motClePrincipal, affiliations, faq)
- [ ] Pays / hub existants — pas de nouveau hub non déclaré
- [ ] Affiliés uniquement parmi ceux de `src/data/affiliates.ts`
- [ ] 1 800+ mots par article
- [ ] 8 à 15 liens internes vérifiés, pointant vers des slugs existants
- [ ] Lien final vers `/bilan-fiscal`
- [ ] 2+ tableaux + 2+ listes à puces + 1+ liste numérotée
- [ ] 4 à 6 FAQ autonomes
- [ ] Conclusion + "Prochaines étapes"
- [ ] Branche Git dédiée (pas `main`)
- [ ] Push `-u origin <branche>`
- [ ] Restitution concise au chat avec URLs, mots-clés, nb de liens

---

*Dernière mise à jour du prompt : avril 2026.*
