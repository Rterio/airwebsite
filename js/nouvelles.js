/**
 * Page Nouvelles — affiche les nouvelles de data/nouvelles.json.
 * Ce fichier est rempli par l'éditeur de contenu (admin/). Inutile de le modifier à la main.
 *
 * <div id="liste-nouvelles" data-base="./"></div>   (data-base="../" sur les pages anglaises)
 * Option : data-limite="3" pour n'afficher que les plus récentes (p. ex. sur l'accueil).
 */
const TEXTES_NOUVELLES = {
  fr: {
    categories: { publication: "Publication", prix: "Prix et distinction", financement: "Financement",
                  congres: "Congrès et présentation", equipe: "Vie d'équipe", medias: "Dans les médias" },
    toutes: "Toutes", lire: "Lire la suite", lien: "En savoir plus", enFrancais: "",
    vide: "Aucune nouvelle pour l'instant.",
    erreur: "Les nouvelles n'ont pas pu être chargées. Réessayez dans quelques instants.",
    erreurLocal: "Les nouvelles ne s'affichent pas quand la page est ouverte directement depuis votre ordinateur. Lancez un petit serveur local (voir les instructions), puis ouvrez http://localhost:8080.",
    filtres: "Filtrer par catégorie",
  },
  en: {
    categories: { publication: "Publication", prix: "Award", financement: "Funding",
                  congres: "Conference", equipe: "Team life", medias: "In the media" },
    toutes: "All", lire: "Read more", lien: "Learn more", enFrancais: "In French",
    vide: "No news yet.",
    erreur: "The news couldn't be loaded. Please try again in a moment.",
    erreurLocal: "News can't be displayed when the page is opened directly from your computer. Start a small local server (see the instructions), then open http://localhost:8080.",
    filtres: "Filter by category",
  },
};

const echapperHTML = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const lienSur = (u) => /^https?:\/\//i.test(u || "") ? echapperHTML(u) : "";

// Mise en forme minimale du texte (gras, italique, liens, listes, paragraphes)
function versHTML(md) {
  const echap = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const enLigne = (s) => echap(s)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" rel="noopener">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(/_([^_]+)_/g, "<em>$1</em>");
  return (md || "").trim().split(/\n{2,}/).map((bloc) => {
    const lignes = bloc.split("\n");
    if (lignes.every((l) => /^\s*[-*+]\s+/.test(l))) {
      return "<ul>" + lignes.map((l) => `<li>${enLigne(l.replace(/^\s*[-*+]\s+/, ""))}</li>`).join("") + "</ul>";
    }
    return `<p>${enLigne(bloc).replace(/\n/g, "<br>")}</p>`;
  }).join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  const conteneur = document.querySelector("#liste-nouvelles");
  if (!conteneur) return;
  const base = conteneur.dataset.base || "./";
  const limite = parseInt(conteneur.dataset.limite || "0", 10);
  const lang = (document.documentElement.lang || "fr").startsWith("en") ? "en" : "fr";
  const t = TEXTES_NOUVELLES[lang];
  const filtres = document.querySelector("#filtres-nouvelles");

  let nouvelles;
  try {
    const rep = await fetch(`${base}data/nouvelles.json`, { cache: "no-cache" });
    if (!rep.ok) throw new Error(rep.status);
    nouvelles = ((await rep.json()).nouvelles || [])
      .filter((n) => n.publiee !== false && n.titre_fr)
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  } catch (e) {
    const local = location.protocol === "file:";
    conteneur.innerHTML = `<p class="nouvelles-message">${local ? t.erreurLocal : t.erreur}</p>`;
    return;
  }
  if (limite) nouvelles = nouvelles.slice(0, limite);
  if (!nouvelles.length) { conteneur.innerHTML = `<p class="nouvelles-message">${t.vide}</p>`; return; }

  const fmt = new Intl.DateTimeFormat(lang === "en" ? "en-CA" : "fr-CA", { month: "long", year: "numeric", timeZone: "UTC" });

  function carte(n) {
    const traduite = lang === "en" && n.titre_en;
    const titre = echapperHTML(traduite ? n.titre_en : n.titre_fr);
    const texte = traduite && n.texte_en ? n.texte_en : n.texte_fr;
    const date = n.date ? fmt.format(new Date(n.date + "T00:00:00Z")) : "";
    const cat = t.categories[n.categorie] || "";
    const image = n.image
      ? `<img class="nouvelle__image" src="${base}${echapperHTML(n.image.replace(/^\/+/, ""))}" alt="${echapperHTML(n.image_alt)}" loading="lazy">`
      : "";
    const enFr = lang === "en" && !traduite ? `<span class="nouvelle__langue" lang="en">${t.enFrancais}</span>` : "";
    const lien = lienSur(n.lien) ? `<p class="nouvelle__lien"><a href="${lienSur(n.lien)}" rel="noopener">${t.lien}</a></p>` : "";
    return `
      <article class="nouvelle${n.image ? " nouvelle--image" : ""}" data-categorie="${echapperHTML(n.categorie)}">
        ${image}
        <div class="nouvelle__corps">
          <p class="nouvelle__meta"><time datetime="${echapperHTML(n.date)}">${date}</time>${cat ? `<span class="nouvelle__cat">${cat}</span>` : ""}${enFr}</p>
          <h3${!traduite && lang === "en" ? ' lang="fr"' : ""}>${titre}</h3>
          <div class="nouvelle__texte"${!traduite && lang === "en" ? ' lang="fr"' : ""}>${versHTML(texte)}</div>
          ${lien}
        </div>
      </article>`;
  }

  function afficher(categorie) {
    const liste = categorie ? nouvelles.filter((n) => n.categorie === categorie) : nouvelles;
    conteneur.innerHTML = liste.map(carte).join("");
  }

  // Filtres par catégorie (seulement les catégories utilisées)
  if (filtres) {
    const utilisees = [...new Set(nouvelles.map((n) => n.categorie).filter(Boolean))];
    if (utilisees.length > 1) {
      filtres.setAttribute("aria-label", t.filtres);
      filtres.innerHTML = [["", t.toutes], ...utilisees.map((c) => [c, t.categories[c] || c])]
        .map(([v, l], i) => `<button type="button" class="filtre" data-cat="${v}" aria-pressed="${i === 0}">${l}</button>`).join("");
      filtres.addEventListener("click", (e) => {
        const b = e.target.closest(".filtre");
        if (!b) return;
        filtres.querySelectorAll(".filtre").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        afficher(b.dataset.cat);
      });
    }
  }
  afficher("");
});
