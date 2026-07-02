const fs = require('fs')
const { execFileSync } = require('child_process')

const steps = [
  { n:'01', cat:'Situation de départ', title:'Vérifier votre domicile fiscal actuel',
    content:"Selon l'article 4B du CGI, vous êtes résident fiscal français si vous remplissez l'un des trois critères : foyer ou lieu de séjour principal en France, activité professionnelle principale exercée en France, ou centre de vos intérêts économiques en France. Un seul critère suffit.",
    action:"Listez vos liens avec la France (logement, famille, revenus) et évaluez lequel prévaut." },
  { n:'02', cat:'Cadre juridique', title:'Identifier la convention fiscale applicable',
    content:"La France a signé plus de 120 conventions fiscales bilatérales. Ces textes déterminent quel pays a le droit d'imposer chaque catégorie de revenus. L'absence de convention (ex : Émirats Arabes Unis) change radicalement la stratégie.",
    action:"Consultez impots.gouv.fr → rubrique « Conventions internationales » pour votre pays cible." },
  { n:'03', cat:'Imposition au départ', title:"Évaluer votre exposition à l'exit tax",
    content:"L'article 167 bis du CGI prévoit une imposition immédiate des plus-values latentes sur vos participations si vous détenez plus de 50 % d'une société OU si la valeur de vos titres dépasse 800 000 €. Un report automatique existe dans l'UE/EEE.",
    action:"Valorisez vos titres et participations. Anticipez ce point au moins 12 mois avant le départ." },
  { n:'04', cat:'Imposition au départ', title:'Sécuriser votre date de départ fiscale',
    content:"La rupture de résidence fiscale intervient à votre date de départ effectif, ou à la date précisée dans la convention bilatérale. Conservez tous les justificatifs : bail ou acte d'achat étranger, factures, relevés bancaires locaux, certificat de résidence.",
    action:"Constituez un dossier physique et numérique de vos preuves d'installation à l'étranger." },
  { n:'05', cat:'Obligations déclaratives', title:'Déposer votre déclaration de départ',
    content:"L'année de votre départ, vous déposez une déclaration partielle pour les revenus perçus en France entre le 1er janvier et votre date de départ (formulaire 2042, case « Départ à l'étranger »). Informez le Centre des Impôts des Non-Résidents (CIDNR).",
    action:"Signalez votre départ au CIDNR ou en ligne sur impots.gouv.fr." },
  { n:'06', cat:'Revenus continus', title:'Organiser vos revenus de source française résiduels',
    content:"Biens en location, dividendes de sociétés françaises, retraite française ou activité partielle en France : ces revenus restent imposables en France via le régime des non-résidents. Anticipez les retenues à la source et le taux minimum de 20 %.",
    action:"Identifiez chaque flux de revenu de source française et son traitement sous la convention applicable." },
  { n:'07', cat:'Patrimoine financier', title:"Anticiper la fiscalité de votre épargne",
    content:"Chaque enveloppe réagit différemment. Assurance-vie : rachats après départ soumis à retenue à la source. PEA : clôture en principe sauf maintien sous conditions. PER : droits acquis conservables. Ne procédez à aucun rachat sans analyse préalable.",
    action:"Listez toutes vos enveloppes (AV, PEA, PER, compte-titres) et consultez un expert avant tout rachat." },
  { n:'08', cat:'Protection sociale', title:'Préparer votre couverture sociale',
    content:"En quittant la France, vous perdez votre affiliation automatique à la Sécurité Sociale. Deux options : la CFE (Caisse des Français de l'Étranger) pour une couverture proche du régime français, ou une assurance santé internationale privée (ACS, Cigna, April).",
    action:"Comparez CFE vs assurance privée selon destination, âge et état de santé. Décidez 3 mois avant le départ." },
  { n:'09', cat:'Aspects bancaires', title:"Ouvrir vos comptes bancaires à l'étranger",
    content:"Anticipez l'ouverture d'un compte local (parfois complexe sans historique). Ouvrez aussi un compte multi-devises (Wise, Revolut). Déclarez vos comptes étrangers à l'administration (formulaire 3916) — l'oubli coûte 1 500 € d'amende par compte.",
    action:"Formulaire 3916 à joindre à votre déclaration de revenus pour chaque compte étranger." },
  { n:'10', cat:'Accompagnement expert', title:'Consulter un fiscaliste spécialisé expatriation',
    content:"La fiscalité de l'expatriation est complexe, individuelle et souvent irréversible. Une consultation avant le départ peut économiser des milliers d'euros, éviter des sanctions et sécuriser juridiquement votre départ.",
    action:"Planifiez cette consultation 6 mois avant votre départ prévu." },
]

const card = (s) => `
  <div class="step">
    <div class="step-num">${s.n}</div>
    <div class="step-body">
      <div class="step-cat">${s.cat}</div>
      <h3 class="step-title">${s.title}</h3>
      <p class="step-content">${s.content}</p>
      <div class="step-action"><span class="action-label">À faire</span> ${s.action}</div>
    </div>
  </div>`

const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<style>
  @page { size: A4; margin: 14mm 0; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin:0; font-family: Georgia, 'Times New Roman', serif; color:#0f0e0b; background:#fff; }
  .wrap { padding: 0 16mm; }
  .cover { background:#0f0e0b; color:#f5f0e8; padding: 26px 16mm 30px; }
  .brand { display:flex; align-items:center; gap:12px; margin-bottom:26px; }
  .logo { width:38px; height:38px; border-radius:50%; background:#c9a84c; color:#0f0e0b;
          font-weight:bold; font-size:22px; text-align:center; line-height:38px; }
  .brand-name { font-size:17px; font-weight:bold; letter-spacing:.3px; }
  .brand-name em { color:#c9a84c; font-style:italic; }
  .kicker { font-family: 'Courier New', monospace; font-size:10px; letter-spacing:3px;
            text-transform:uppercase; color:#c9a84c; margin-bottom:12px; }
  .cover h1 { font-size:30px; line-height:1.15; margin:0 0 12px; font-weight:900; }
  .cover p { font-family: Arial, sans-serif; font-size:12.5px; line-height:1.6; color:#d8d2c5; margin:0; max-width:150mm; }
  .goldbar { height:5px; background:#c9a84c; }
  .steps { padding-top: 22px; }
  .step { display:flex; gap:14px; padding:13px 0; border-bottom:1px solid #ece6da; break-inside:avoid; page-break-inside:avoid; }
  .step-num { flex:0 0 auto; width:34px; height:34px; background:#0f0e0b; color:#c9a84c;
              font-size:13px; font-weight:bold; text-align:center; line-height:34px;
              font-family:'Courier New',monospace; }
  .step-body { flex:1; }
  .step-cat { font-family:'Courier New',monospace; font-size:8.5px; letter-spacing:1.5px;
              text-transform:uppercase; color:#a98b3e; margin-bottom:4px; }
  .step-title { font-size:15px; margin:0 0 5px; font-weight:bold; }
  .step-content { font-family:Arial, sans-serif; font-size:11px; line-height:1.55; color:#3a3733; margin:0 0 7px; }
  .step-action { font-family:Arial, sans-serif; font-size:10.5px; line-height:1.5; color:#0f0e0b;
                 background:#faf6ee; border-left:3px solid #c9a84c; padding:6px 10px; }
  .action-label { font-family:'Courier New',monospace; font-size:8px; letter-spacing:1px;
                  text-transform:uppercase; color:#a98b3e; margin-right:6px; }
  .cta { margin-top:24px; background:#0f0e0b; color:#f5f0e8; padding:20px 22px; break-inside:avoid; }
  .cta .kicker { margin-bottom:8px; }
  .cta h2 { font-size:18px; margin:0 0 8px; }
  .cta p { font-family:Arial,sans-serif; font-size:11px; line-height:1.6; color:#d8d2c5; margin:0 0 12px; }
  .cta .btn { display:inline-block; background:#c9a84c; color:#0f0e0b; font-family:'Courier New',monospace;
              font-size:10px; font-weight:bold; letter-spacing:1.5px; text-transform:uppercase;
              padding:9px 18px; text-decoration:none; }
  .footer { text-align:center; padding:14px 16mm 0; font-family:'Courier New',monospace;
            font-size:9px; letter-spacing:1.5px; text-transform:uppercase; color:#b7b0a3; }
</style></head><body>
  <div class="goldbar"></div>
  <div class="cover">
    <div class="brand"><div class="logo">C</div><div class="brand-name">Le Conseiller <em>Fiscal</em></div></div>
    <div class="kicker">Ressource gratuite</div>
    <h1>10 étapes fiscales obligatoires<br>avant de quitter la France</h1>
    <p>Un guide pratique pour sécuriser votre départ et éviter les erreurs coûteuses : domicile fiscal, exit tax, conventions, épargne, protection sociale et déclarations. Cochez chaque étape avant votre expatriation.</p>
  </div>
  <div class="wrap">
    <div class="steps">${steps.map(card).join('')}</div>
    <div class="cta">
      <div class="kicker">Analyse personnalisée</div>
      <h2>Votre situation mérite un bilan sur mesure.</h2>
      <p>Cette checklist est un point de départ. Pour une analyse personnalisée de votre profil — pays cible, épargne, exit tax, convention — demandez votre bilan fiscal gratuit.</p>
      <a class="btn" href="https://leconseillerfiscal.com/bilan-fiscal">Demander mon bilan fiscal gratuit</a>
    </div>
  </div>
  <div class="footer">leconseillerfiscal.com · La référence de la fiscalité des expatriés</div>
</body></html>`

const SP = __dirname
fs.writeFileSync(SP + '/checklist.html', html)

const chrome = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const outPdf = process.argv[2] || (SP + '/checklist.pdf')
execFileSync(chrome, [
  '--headless', '--no-sandbox', '--disable-gpu',
  '--no-pdf-header-footer',
  '--print-to-pdf=' + outPdf,
  'file://' + SP + '/checklist.html',
], { stdio: 'inherit' })
console.log('PDF généré: ' + outPdf)
