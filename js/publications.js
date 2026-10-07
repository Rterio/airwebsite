/**
 * Liste des publications — partagée par publications.html et en/publications.html.
 *
 * POUR AJOUTER UNE PUBLICATION : copiez une ligne { ... } en haut de la liste
 * et remplacez les champs. Les publications sont triées automatiquement par année.
 *   y     : année
 *   a     : auteurs (pour les longues listes, gardez les premiers, Côté A, puis « et al. »)
 *   t     : titre
 *   j     : revue
 *   v     : volume, numéro et pages (facultatif)
 *   pmid  : numéro PubMed (facultatif)  → lien PubMed
 *   doi   : DOI (facultatif)            → lien vers l'article
 *   choix : true pour l'afficher dans « Publications choisies »
 *
 * Sources : profil de la Dre Côté sur iucpq.ca, PubMed et ORCID 0000-0001-5653-4931 (octobre 2026).
 */
const PUBLICATIONS = [
  // ---------- 2026 ----------
  { y: 2026, a: "Chupp G, Nagase H, Skowasch D, Devouassoux G, Côté A, Jackson DJ, et al.",
    t: "Switching to twice-yearly depemokimab from mepolizumab/benralizumab in severe asthma: a multicenter, randomized, double-blind, phase 3A clinical trial (NIMBLE)", j: "Am J Respir Crit Care Med", v: "212(5):921-935", pmid: "41738176", doi: "10.1093/ajrccm/aamag031" },

  // ---------- 2025 ----------
  { y: 2025, a: "Tardif A, Whitmore GA, Vandemheen KL, Bergeron C, Boulet LP, Côté A, et al.",
    t: "Patient Factors and Clinical Efficacy of Early Identification and Treatment of Chronic Obstructive Pulmonary Disease and Asthma", j: "Am J Respir Crit Care Med", v: "211" },
  { y: 2025, a: "Laroche J, Boulay MÈ, Lechasseur A, Guertin J, Boulet LP, Bergeron C, Lemière C, Lougheed MD, Vandemheen KL, Morissette MC, Aaron SD, Côté A",
    t: "Early Detection of Asthma: Exploring Inflammatory Biomarkers in Symptomatic Adults with Normal Spirometry", j: "J Asthma Allergy", v: "18", doi: "10.2147/JAA.S547949", choix: true },
  { y: 2025, a: "Côté A, Beaulé R, Boulay MÈ, Guertin J, Boulet LP, Godbout K, Price D",
    t: "Poor agreement among asthma specialists on the choice and timing of initiation of a biologic treatment for severe asthma patients", j: "J Allergy Clin Immunol Pract", pmid: "39864739", choix: true },
  { y: 2025, a: "Lugogo NL, Soler X, Gon Y, Côté A, Hilberg O, et al.",
    t: "Baseline Characteristics of Dupilumab-Treated Patients with Asthma in the Real World: The RAPID Global Registry", j: "Adv Ther", v: "42(2):849-862", pmid: "39652256" },

  // ---------- 2024 ----------
  { y: 2024, a: "Aaron SD, Vandemheen KL, Whitmore GA, Bergeron C, Boulet LP, Côté A, et al.",
    t: "Early Diagnosis and Treatment of COPD and Asthma — A Randomized, Controlled Trial", j: "N Engl J Med", v: "390(22):2061-2073", pmid: "38767248", choix: true },
  { y: 2024, a: "Bradding P, Porsbjerg C, Côté A, Dahlén SE, Hallstrand TS, Brightling CE",
    t: "Airway hyperresponsiveness in asthma: the role of the epithelium", j: "J Allergy Clin Immunol", v: "153(5):1181-1193", pmid: "38395082" },
  { y: 2024, a: "Wechsler ME, Scelo G, Larenas-Linnemann DES, … Côté A, et al.",
    t: "Association Between T2-related Comorbidities and Effectiveness of Biologics in Severe Asthma", j: "Am J Respir Crit Care Med", v: "209(3):262-272", pmid: "38016003" },
  { y: 2024, a: "Scelo G, Torres-Duque CA, Maspero J, … Côté A, et al.",
    t: "Analysis of comorbidities and multimorbidity in adult patients in the International Severe Asthma Registry", j: "Ann Allergy Asthma Immunol", v: "132(1):42-53", pmid: "37640263" },
  { y: 2024, a: "Denton E, Hew M, Peters MJ, … Côté A, et al.",
    t: "Real-world biologics response and super-response in the International Severe Asthma Registry cohort", j: "Allergy", v: "79(10):2700-2716", pmid: "38923444" },
  { y: 2024, a: "Côté A, Lee CH, Metwaly SM, Doig CJ, Andonegui G, Yipp BG, Parhar KKS, Winston BW",
    t: "Endotyping in ARDS: one step forward in precision medicine", j: "Eur J Med Res", v: "29(1):284", pmid: "38745261" },
  { y: 2024, a: "Bierbrier J, Gerstein E, Whitmore GA, Vandemheen KL, Bergeron C, Boulet LP, Côté A, et al.",
    t: "Impact of Dyspnea on Adults With Respiratory Symptoms Without a Defined Diagnosis", j: "Chest", v: "166(6):1296-1308", pmid: "39242078" },
  { y: 2024, a: "Mazzola R, Aaron SD, Vandemheen KL, Mulpuru S, Bergeron C, Lemière C, Côté A, et al.",
    t: "Association between lung function and sleep disorder symptoms in a community-based multi-site case-finding study", j: "J Sleep Res", v: "e14356", pmid: "39322312" },
  { y: 2024, a: "Lavoie JC, Simard M, Kalkan H, Rakotoarivelo V, Huot S, Di Marzo V, Côté A, Pouliot M, Flamand N",
    t: "Pharmacological evidence that the inhibitory effects of prostaglandin E2 are mediated by the EP2 and EP4 receptors in human neutrophils", j: "J Leukoc Biol", v: "115(6):1183-1189", pmid: "38345417" },

  // ---------- 2023 ----------
  { y: 2023, a: "Boulet LP, Boulay ME, Côté A, Fitzgerald JM, Bergeron C, Lemière C, Lougheed MD, Vandemheen KL, Aaron SD",
    t: "Airway inflammation and hyperresponsiveness in subjects with respiratory symptoms and normal spirometry", j: "Eur Respir J", v: "61(3):2201194", pmid: "36396140" },
  { y: 2023, a: "Gerstein E, Bierbrier J, Whitmore GA, Vandemheen KL, Bergeron C, Boulet LP, Côté A, et al.",
    t: "Impact of Undiagnosed COPD and Asthma on Symptoms, Quality of Life, Healthcare Utilization and Work Productivity", j: "Am J Respir Crit Care Med", v: "208(12):1271-1282", pmid: "37792953" },
  { y: 2023, a: "Couillard S, Côté A",
    t: "Predicting On-Biologic Remission in Asthma: Insight From the Airways", j: "Chest", v: "163(6):1341-1343", pmid: "37295870" },
  { y: 2023, a: "Gauvreau GM, Bergeron C, Boulet LP, Cockcroft DW, Côté A, Davis BE, Leigh R, Myers I, O'Byrne PM, Sehmi R",
    t: "Sounding the alarmins — The role of alarmin cytokines in asthma", j: "Allergy", v: "78(2):402-417", pmid: "36463491" },
  { y: 2023, a: "Birs I, Boulay ME, Bertrand M, Côté A, Boulet LP",
    t: "Heterogeneity of asthma with nasal polyposis phenotypes: A cluster analysis", j: "Clin Exp Allergy", v: "53(1):52-64", pmid: "36317421" },
  { y: 2023, a: "Laroche J, Pelletier G, Boulay MÈ, Côté A, Godbout K",
    t: "Anti-IL5/IL5R Treatment in COPD: Should We Target Oral Corticosteroid-Dependent Patients?", j: "Int J Chron Obstruct Pulmon Dis", v: "18:755-763", pmid: "37180748" },
  { y: 2023, a: "Celis-Preciado CA, Leclerc S, Duval M, Cliche DO, Larivée P, Lemaire-Paquette S, Lévesque S, Côté A, Lachapelle P, Couillard S",
    t: "Phenotyping the Responses to Systemic Corticosteroids in the Management of Asthma Attacks (PRISMA): protocol for an observational and translational pilot study", j: "BMJ Open Respir Res", v: "10(1):e001932", pmid: "37940357" },
  { y: 2023, a: "Shin S, Whitmore GA, Boulet LP, Boulay MÈ, Côté A, et al.",
    t: "Anticipating undiagnosed asthma in symptomatic adults with normal pre- and post-bronchodilator spirometry: a decision tool for bronchial challenge testing", j: "BMC Pulm Med", v: "23(1):496", pmid: "38071285" },
  { y: 2023, a: "Cherian M, Magner KMA, Whitmore GA, Vandemheen KL, … Côté A, et al.",
    t: "Patient and physician factors associated with symptomatic undiagnosed asthma or COPD", j: "Eur Respir J", v: "61(2):2201721" },
  { y: 2023, a: "Magner KMA, Cherian M, Whitmore GA, Vandemheen KL, Bergeron C, Côté A, Field SK, Lemière C, McIvor RA, Aaron SD",
    t: "Assessment of Preserved Ratio Impaired Spirometry Using Pre- and Post-Bronchodilator Spirometry in a Randomly Sampled Symptomatic Cohort", j: "Am J Respir Crit Care Med", v: "208(10):1129-1131", pmid: "37413793" },
  { y: 2023, a: "Boulet LP, Boulay ME, Lecours L, Kaplan A, Bourbeau J, Horvat E, Côté A, et al.",
    t: "Management of cough in Canadian Primary Care and Specialty Practices: a survey of current knowledge of clinicians and allied health professionals", j: "Can J Respir Crit Care Sleep Med", v: "7(3):124-137" },
  { y: 2023, a: "Henry C, Boucher M, Boulay MÈ, Côté A, Boulet LP, Bossé Y",
    t: "The cumulative effect of methacholine on large and small airways when deep inspirations are avoided", j: "Respirology", v: "28(3):226-235", pmid: "36210352" },
  { y: 2023, a: "Henry C, Biardel S, Boucher M, Godbout K, Chakir J, Côté A, Laviolette M, Bossé Y",
    t: "Bronchial thermoplasty attenuates bronchodilator responsiveness", j: "Respir Med", v: "217:107340", pmid: "37422022" },
  { y: 2023, a: "Gagnon PA, Côté A, Klein M, Biardel S, Laviolette M, Godbout K, Bossé Y, Chakir J",
    t: "The reduction of airway smooth muscle by bronchial thermoplasty stands the test of time", j: "ERJ Open Res", v: "9(4):00024-2023", pmid: "37404844" },
  { y: 2023, a: "Gagnon PA, Klein M, De Vos J, Biardel S, Côté A, Godbout K, Laviolette M, Laprise C, Assou S, Chakir J",
    t: "S100A alarmins and thymic stromal lymphopoietin (TSLP) regulation in severe asthma following bronchial thermoplasty", j: "Respir Res", v: "24(1):294", pmid: "37996952" },

  // ---------- 2022 ----------
  { y: 2022, a: "Pelletier G, Godbout K, Boulay MÈ, Boulet LP, Morissette MC, Côté A",
    t: "Increase in FeNO Levels Following IL5/IL5R-Targeting Therapies in Severe Asthma: A Case Series", j: "J Asthma Allergy", v: "15:691-701", pmid: "35615256" },
  { y: 2022, a: "Huynh C, Whitmore GA, Vandemheen KL, FitzGerald JM, Bergeron C, Boulet LP, Côté A, et al.",
    t: "Derivation and Validation of the UCAP-Q Case-finding Questionnaire to Detect Undiagnosed Asthma and COPD", j: "Eur Respir J", v: "2103243", pmid: "35332067" },
  { y: 2022, a: "Alhabeeb FF, Whitmore GA, Vandemheen KL, FitzGerald JM, Bergeron C, Lemière C, Boulet LP, … Côté A, et al.",
    t: "Disease burden in individuals with symptomatic undiagnosed asthma or COPD", j: "Respir Med", v: "200:106917", pmid: "35850008" },
  { y: 2022, a: "Xu I, Boulay ME, Bertrand M, Côté A, Boulet LP",
    t: "Comparative features of eosinophilic and non-eosinophilic asthma", j: "Clin Exp Allergy", v: "52(1):205-208", pmid: "34053138" },
  { y: 2022, a: "Morissette M, Godbout K, Côté A, Boulet LP",
    t: "Asthma COPD overlap: Insights into cellular and molecular mechanisms", j: "Mol Aspects Med", v: "85:101021", pmid: "34521557" },
  { y: 2022, a: "Côté MÈ, Boulay MÈ, Plante S, Côté A, Chakir J, Boulet LP",
    t: "Comparison of circulating fibrocytes from non-asthmatic patients with seasonal allergic rhinitis between in and out of pollen season samples", j: "Allergy Asthma Clin Immunol", v: "18(1):24", pmid: "35296352" },
  { y: 2022, a: "Rochat I, Côté A, Boulet LP",
    t: "Determinants of lung function changes in athletic swimmers. A review", j: "Acta Paediatr", v: "111(2):259-264", pmid: "34480504" },

  // ---------- 2021 ----------
  { y: 2021, a: "Boulet LP, Côté A, Abd-Elaziz K, Gauvreau G, Diamant Z",
    t: "Allergen bronchoprovocation test: an important research tool supporting precision medicine", j: "Curr Opin Pulm Med", v: "27(1):15-22", pmid: "33065599" },
  { y: 2021, a: "Mekov E, Nuñez A, Sin DD, Ichinose M, Rhee CK, Maselli DJ, Côté A, et al.",
    t: "Update on Asthma-COPD Overlap (ACO): A Narrative Review", j: "Int J Chron Obstruct Pulmon Dis", v: "16:1783-1799", pmid: "34168440" },
  { y: 2021, a: "Valette K, Li Z, Bon-Baret V, … Côté A, Laviolette M, Boulet LP, et al.",
    t: "Prioritization of candidate causal genes for asthma in susceptibility loci derived from UK Biobank", j: "Commun Biol", v: "4(1):700", pmid: "34103634" },
  { y: 2021, a: "Metwaly S, Côté A, Donnelly SJ, Banoei MM, Lee CH, Andonegui G, Yipp BG, Vogel HJ, Fiehn O, Winston BW",
    t: "ARDS metabolic fingerprints: characterization, benchmarking, and potential mechanistic interpretation", j: "Am J Physiol Lung Cell Mol Physiol", v: "321(1):L79-L90", pmid: "33949201" },
  { y: 2021, a: "Archambault AS, Zaid Y, Rakotoarivelo V, … Côté A, Laviolette M, et al.",
    t: "High levels of eicosanoids and docosanoids in the lungs of intubated COVID-19 patients", j: "FASEB J", v: "35(6):e21666", pmid: "34033145" },

  // ---------- 2020 ----------
  { y: 2020, a: "Côté A, Russell RJ, Boulet LP, Gibson PG, Lai K, Irwin RS, Brightling CE",
    t: "Managing Chronic Cough due to Asthma and NAEB in Adults and Adolescents: CHEST Guideline and Expert Panel Report", j: "Chest", v: "158(1):68-96", pmid: "31972181", choix: true },
  { y: 2020, a: "Côté A, Godbout K, Boulet LP",
    t: "The management of severe asthma in 2020", j: "Biochem Pharmacol", v: "179:114112", pmid: "32598948" },
  { y: 2020, a: "Licskai C, Yang CL, Ducharme FM, Radhakrishnan D, Podgers D, Ramsey C, Samanta T, Côté A, Mahdavian M, Lougheed MD",
    t: "Key Highlights From the Canadian Thoracic Society Position Statement on the Optimization of Asthma Management During the Coronavirus Disease 2019 Pandemic", j: "Chest", v: "158(4):1335-1337", pmid: "32473948" },
  { y: 2020, a: "Bossé Y, Côté A",
    t: "Asthma: An Untoward Consequence of Endurance Sports?", j: "Am J Respir Cell Mol Biol", v: "63(1):7-8", pmid: "32223717" },
  { y: 2020, a: "Côté A, Ternacle J, Pibarot P",
    t: "Early prediction of the risk of severe coronavirus disease 2019: A key step in therapeutic decision making", j: "EBioMedicine", v: "59:102948", pmid: "32810827" },

  // ---------- 2018 ----------
  { y: 2018, a: "Côté A, Turmel J, Boulet LP",
    t: "Exercise and Asthma", j: "Semin Respir Crit Care Med", v: "39(1):19-28", pmid: "29427982" },
  { y: 2018, a: "Metwaly S, Côté A, Donnelly SJ, Banoei MM, Mourad AI, Winston BW",
    t: "Evolution of ARDS biomarkers: Will metabolomics be the answer?", j: "Am J Physiol Lung Cell Mol Physiol", v: "315(4):L526-L534", pmid: "29952222" },
];

/* ======================= Affichage ======================= */
const TEXTES_PUBS = {
  fr: { aucune: "Aucune publication ne correspond à votre recherche. Essayez un autre mot ou retirez un filtre.",
        resultat: (n) => `${n} publication${n > 1 ? "s" : ""}`, toutes: "Toutes les années",
        dirige: "Dirigée par la Dre Côté", pubmed: "PubMed", article: "Article" },
  en: { aucune: "No publication matches your search. Try another word or remove a filter.",
        resultat: (n) => `${n} publication${n > 1 ? "s" : ""}`, toutes: "All years",
        dirige: "Led by Dr. Côté", pubmed: "PubMed", article: "Article" },
};

// Côté A en premier ou dernier auteur = travaux dirigés par le laboratoire
const RE_COTE = /C[oô]t[eé] A\b/;
function estDirigee(p) {
  const auteurs = p.a.replace(/, et al\.$/, "").split(", ");
  return RE_COTE.test(auteurs[0]) || (!/et al\.$/.test(p.a) && RE_COTE.test(auteurs[auteurs.length - 1]));
}
const echapper = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const sansAccents = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function citation(p, t) {
  const auteurs = echapper(p.a).replace(/(C[oô]t[eé] A)\b(?! ?M)/g, "<strong>$1</strong>");
  const liens = [];
  if (p.pmid) liens.push(`<a href="https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/" rel="noopener">${t.pubmed}</a>`);
  if (p.doi) liens.push(`<a href="https://doi.org/${p.doi}" rel="noopener">${t.article}</a>`);
  const badge = estDirigee(p) ? `<span class="badge-dirigee">${t.dirige}</span>` : "";
  return `
    <li class="publication">
      <p class="publication__titre">${echapper(p.t)}</p>
      <p class="publication__auteurs">${auteurs}</p>
      <p class="publication__source"><em>${echapper(p.j)}</em> ${p.y}${p.v ? ";" + echapper(p.v) : ""}</p>
      <div class="publication__liens">${badge}${liens.join("")}</div>
    </li>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const lang = (document.documentElement.lang || "fr").startsWith("en") ? "en" : "fr";
  const t = TEXTES_PUBS[lang];
  const liste = document.querySelector("#liste-publications");
  const choisies = document.querySelector("#publications-choisies");
  const champ = document.querySelector("#recherche-pubs");
  const annee = document.querySelector("#annee-pubs");
  const dirigees = document.querySelector("#dirigees-pubs");
  const compteur = document.querySelector("#compteur-pubs");

  const pubs = [...PUBLICATIONS].sort((a, b) => b.y - a.y);

  if (choisies) {
    choisies.innerHTML = pubs.filter((p) => p.choix).map((p) => citation(p, t)).join("");
  }

  const annees = [...new Set(pubs.map((p) => p.y))];
  annee.innerHTML = `<option value="">${t.toutes}</option>` + annees.map((y) => `<option>${y}</option>`).join("");

  function afficher() {
    const q = sansAccents(champ.value.trim());
    const y = annee.value;
    const seulement = dirigees.checked;
    const res = pubs.filter((p) =>
      (!y || String(p.y) === y) &&
      (!seulement || estDirigee(p)) &&
      (!q || sansAccents(`${p.t} ${p.a} ${p.j}`).includes(q)));

    compteur.textContent = t.resultat(res.length);
    if (!res.length) { liste.innerHTML = `<p class="pubs-vide">${t.aucune}</p>`; return; }

    let html = "";
    for (const y of annees) {
      const duAn = res.filter((p) => p.y === y);
      if (!duAn.length) continue;
      html += `<section class="annee-pubs" aria-labelledby="annee-${y}">
        <h3 id="annee-${y}">${y}</h3>
        <ol class="publications">${duAn.map((p) => citation(p, t)).join("")}</ol>
      </section>`;
    }
    liste.innerHTML = html;
  }

  champ.addEventListener("input", afficher);
  annee.addEventListener("change", afficher);
  dirigees.addEventListener("change", afficher);
  afficher();
});
