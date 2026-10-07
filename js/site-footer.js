/**
 * <site-footer base="./"></site-footer>
 *
 * Pied de page partagé, en français et en anglais (selon <html lang>).
 * Remplacez les éléments marqués [À compléter] / [To complete] par les vraies coordonnées.
 */
const TEXTES_PIED = {
  fr: {
    mission: "Le bon traitement, au bon patient, au bon moment.",
    nom: "Laboratoire Andréanne Côté",
    labo: "Le laboratoire", recherche: "Recherche", equipe: "Équipe",
    publications: "Publications", nouvelles: "Nouvelles",
    impliquer: "S'impliquer", participer: "Participer à une étude",
    etudes: "Études supérieures", stages: "Stages", collaborer: "Collaborer avec nous",
    joindre: "Nous joindre",
    adresse: "Centre de recherche de l'IUCPQ<br>2725, chemin Sainte-Foy<br>Québec (Québec) G1V 4G5",
    courriel: "[À compléter : courriel]",
    droits: "Laboratoire Andréanne Côté. Centre de recherche de l'IUCPQ – Université Laval.",
    accessibilite: "Accessibilité", confidentialite: "Confidentialité",
  },
  en: {
    mission: "The right treatment, for the right patient, at the right time.",
    nom: "Andréanne Côté Lab",
    labo: "The lab", recherche: "Research", equipe: "Team",
    publications: "Publications", nouvelles: "News",
    impliquer: "Get involved", participer: "Take part in a study",
    etudes: "Graduate studies", stages: "Internships", collaborer: "Collaborate with us",
    joindre: "Contact us",
    adresse: "IUCPQ Research Centre<br>2725 chemin Sainte-Foy<br>Québec, QC G1V 4G5",
    courriel: "[To complete: email]",
    droits: "Andréanne Côté Lab. IUCPQ Research Centre – Université Laval.",
    accessibilite: "Accessibility", confidentialite: "Privacy",
  },
};

class SiteFooter extends HTMLElement {
  connectedCallback() {
    const base = this.getAttribute("base") || "./";
    const lang = (document.documentElement.lang || "fr").startsWith("en") ? "en" : "fr";
    const t = TEXTES_PIED[lang];
    const r = lang === "en" ? `${base}en/` : base;   // racine des pages de cette langue
    const annee = new Date().getFullYear();

    this.innerHTML = `
      <footer class="pied">
        <svg class="pied__vague" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
          <path fill="currentColor" d="M0 34 C 240 4, 480 4, 720 30 S 1200 60, 1440 22 L1440 60 L0 60 Z"/>
        </svg>

        <div class="conteneur">
          <div class="pied__grille">
            <div>
              <div class="pied__marque">
                <span class="pied__logo"><img src="${base}assets/logo-lungs.png" alt="" width="56" height="59"></span>
                <div>
                  <p class="pied__mission">${t.mission}</p>
                  <p>${t.nom}<br>Asthma Innovative Research</p>
                </div>
              </div>
            </div>

            <nav aria-label="${t.labo}">
              <h2>${t.labo}</h2>
              <ul>
                <li><a href="${r}recherche.html">${t.recherche}</a></li>
                <li><a href="${r}equipe.html">${t.equipe}</a></li>
                <li><a href="${r}publications.html">${t.publications}</a></li>
                <li><a href="${r}nouvelles.html">${t.nouvelles}</a></li>
              </ul>
            </nav>

            <nav aria-label="${t.impliquer}">
              <h2>${t.impliquer}</h2>
              <ul>
                <li><a href="${r}participer.html">${t.participer}</a></li>
                <li><a href="${r}joindre.html">${t.etudes}</a></li>
                <li><a href="${r}joindre.html#stages">${t.stages}</a></li>
                <li><a href="${r}contact.html?motif=collaboration">${t.collaborer}</a></li>
              </ul>
            </nav>

            <div>
              <h2>${t.joindre}</h2>
              <address>
                ${t.adresse}<br>
                <a href="mailto:courriel@exemple.ca">${t.courriel}</a><br>
                <a href="tel:+14186568711">418 656-8711</a>
              </address>
            </div>
          </div>

          <div class="pied__bas">
            <span>© ${annee} ${t.droits}</span>
            <span>
              <a href="${r}accessibilite.html">${t.accessibilite}</a>
              &nbsp;&nbsp;
              <a href="${r}confidentialite.html">${t.confidentialite}</a>
            </span>
          </div>
        </div>
      </footer>`;
  }
}

customElements.define("site-footer", SiteFooter);
