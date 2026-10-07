/**
 * <site-header active="accueil" base="./"></site-header>
 *
 * En-tête partagé par toutes les pages, en français et en anglais.
 *  - active : identifiant de la page courante (voir PAGES ci-dessous)
 *  - base   : chemin vers la racine du site ("./" pour les pages françaises,
 *             "../" pour les pages anglaises dans le dossier en/)
 * La langue est lue dans <html lang="fr"> ou <html lang="en">.
 *
 * Les pages anglaises portent le même nom de fichier que les pages
 * françaises, dans le dossier en/ (ex. equipe.html → en/equipe.html).
 * Le bouton FR/EN mène ainsi directement à la même page dans l'autre langue.
 */
const PAGES = [
  { id: "accueil",      href: "index.html",        fr: "Accueil",          en: "Home" },
  { id: "recherche",    href: "recherche.html",    fr: "Recherche",        en: "Research" },
  { id: "equipe",       href: "equipe.html",       fr: "Équipe",           en: "Team" },
  { id: "publications", href: "publications.html", fr: "Publications",     en: "Publications" },
  { id: "participer",   href: "participer.html",   fr: "Participer",       en: "Participate" },
  { id: "nouvelles",    href: "nouvelles.html",    fr: "Nouvelles",        en: "News" },
  { id: "contact",      href: "contact.html",      fr: "Contact",          en: "Contact" },
  { id: "joindre",      href: "joindre.html",      fr: "Joindre l'équipe", en: "Join the team", cta: true },
];

const TEXTES_ENTETE = {
  fr: {
    evitement: "Aller au contenu",
    centre: "Centre de recherche de l'IUCPQ",
    centreUrl: "https://iucpq.qc.ca/fr/recherche",
    langue: "Langue",
    sousTitre: "Laboratoire Andréanne Côté",
    menu: "Menu", fermer: "Fermer",
    navPrincipale: "Navigation principale",
  },
  en: {
    evitement: "Skip to content",
    centre: "IUCPQ Research Centre",
    centreUrl: "https://iucpq.qc.ca/en/research",
    langue: "Language",
    sousTitre: "Andréanne Côté Lab",
    menu: "Menu", fermer: "Close",
    navPrincipale: "Main navigation",
  },
};

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const active = this.getAttribute("active") || "";
    const base = this.getAttribute("base") || "./";
    const lang = (document.documentElement.lang || "fr").startsWith("en") ? "en" : "fr";
    const t = TEXTES_ENTETE[lang];

    // Pages de cette langue : racine pour le français, en/ pour l'anglais
    const racineLangue = lang === "en" ? `${base}en/` : base;

    // Même page dans l'autre langue
    const fichier = location.pathname.split("/").pop() || "index.html";
    const lienFR = `${base}${fichier}`;
    const lienEN = `${base}en/${fichier}`;

    const items = PAGES.map((p) => `
      <li${p.cta ? ' class="nav__cta"' : ""}>
        <a href="${racineLangue}${p.href}"${p.id === active ? ' aria-current="page"' : ""}>${p[lang]}</a>
      </li>`).join("");

    this.innerHTML = `
      <a class="lien-evitement" href="#contenu">${t.evitement}</a>
      <header class="entete">
        <div class="entete__bande">
          <div class="conteneur">
            <span class="entete__adresse">
              <a href="${t.centreUrl}" rel="noopener">${t.centre}</a>
              &nbsp;|&nbsp;
              <a href="https://www.ulaval.ca" rel="noopener">Université Laval</a>
            </span>
            <nav class="entete__langue" aria-label="${t.langue}">
              <a href="${lienFR}" lang="fr" hreflang="fr" ${lang === "fr" ? 'aria-current="true"' : ""}>FR</a>
              <a href="${lienEN}" lang="en" hreflang="en" ${lang === "en" ? 'aria-current="true"' : ""}>EN</a>
            </nav>
          </div>
        </div>

        <div class="entete__principal">
          <div class="conteneur">
            <a class="marque" href="${racineLangue}index.html">
              <img src="${base}assets/logo-lungs.png" alt="" width="52" height="55">
              <span class="marque__nom">
                <strong>Asthma Innovative Research</strong>
                <span>${t.sousTitre}</span>
              </span>
            </a>

            <button class="nav__bascule" type="button" aria-expanded="false" aria-controls="nav-principale">
              ${t.menu}
            </button>

            <nav class="nav" id="nav-principale" aria-label="${t.navPrincipale}">
              <ul>${items}</ul>
            </nav>
          </div>
        </div>
      </header>`;

    const bouton = this.querySelector(".nav__bascule");
    const nav = this.querySelector(".nav");
    bouton.addEventListener("click", () => {
      const ouvert = bouton.getAttribute("aria-expanded") === "true";
      bouton.setAttribute("aria-expanded", String(!ouvert));
      bouton.textContent = ouvert ? t.menu : t.fermer;
      nav.dataset.ouvert = String(!ouvert);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.dataset.ouvert === "true") {
        bouton.click();
        bouton.focus();
      }
    });
  }
}

customElements.define("site-header", SiteHeader);
