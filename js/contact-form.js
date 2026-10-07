/**
 * Formulaire de contact — envoi par le serveur de l'Université (contact-envoi.php).
 * Aucun service externe : les messages ne quittent pas le serveur, sauf par courriel
 * vers l'adresse du laboratoire.
 *
 * L'adresse qui reçoit les messages se règle dans prive/config-contact.php.
 * Ce fichier sert aux deux versions de la page (contact.html et en/contact.html).
 */

// contact-envoi.php est à la racine du site, un dossier au-dessus de js/
const ADRESSE_ENVOI = new URL("../contact-envoi.php", document.currentScript.src).href;

const TEXTES_FORMULAIRE = {
  fr: {
    envoi: "Envoi en cours…",
    bouton: "Envoyer le message",
    succesTitre: "Message envoyé",
    succes: "Merci! Nous vous répondrons dans les meilleurs délais, habituellement en 2 à 3 jours ouvrables.",
    echecTitre: "Le message n'a pas été envoyé",
    echec: "Vérifiez votre connexion et réessayez. Si le problème persiste, écrivez-nous directement par courriel.",
    requis: "Ce champ est obligatoire.",
    courriel: "Entrez une adresse courriel valide, par exemple nom@exemple.com.",
    consentement: "Cochez cette case pour envoyer le message.",
    sujet: "Site web du laboratoire",
    limite: "Vous avez envoyé plusieurs messages en peu de temps. Réessayez dans une heure, ou écrivez-nous directement par courriel.",
  },
  en: {
    envoi: "Sending…",
    bouton: "Send message",
    succesTitre: "Message sent",
    succes: "Thank you! We'll get back to you as soon as possible, usually within 2 to 3 business days.",
    echecTitre: "Your message wasn't sent",
    echec: "Check your connection and try again. If the problem continues, email us directly.",
    requis: "This field is required.",
    courriel: "Enter a valid email address, for example name@example.com.",
    consentement: "Check this box to send your message.",
    sujet: "Lab website",
    limite: "You've sent several messages in a short time. Please try again in an hour, or email us directly.",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#formulaire-contact");
  if (!form) return;

  const lang = (document.documentElement.lang || "fr").startsWith("en") ? "en" : "fr";
  const t = TEXTES_FORMULAIRE[lang];
  const bouton = form.querySelector("button[type=submit]");
  const statut = document.querySelector("#statut-formulaire");
  const menuMotif = form.querySelector("#motif");

  // Affiche l'indice qui correspond à l'objet choisi (s'il y en a un)
  function afficherIndice() {
    document.querySelectorAll(".indice").forEach((p) => {
      p.hidden = p.dataset.motif !== menuMotif.value;
    });
  }

  // Objet présélectionné par le lien d'une autre page :
  // contact.html?motif=participation | etudes | collaboration | medias | autre
  if (menuMotif) {
    const demande = new URLSearchParams(location.search).get("motif");
    if (demande && menuMotif.querySelector(`option[value="${CSS.escape(demande)}"]`)) {
      menuMotif.value = demande;
    }
    menuMotif.addEventListener("change", afficherIndice);
    afficherIndice();
  }

  // Affiche ou retire le message d'erreur sous un champ
  function marquer(champ, message) {
    const id = `${champ.id}-erreur`;
    let erreur = document.getElementById(id);
    if (message) {
      if (!erreur) {
        erreur = document.createElement("p");
        erreur.className = "erreur";
        erreur.id = id;
        champ.closest(".champ, .case").appendChild(erreur);
      }
      erreur.textContent = message;
      champ.setAttribute("aria-invalid", "true");
      champ.setAttribute("aria-describedby", id);
    } else if (erreur) {
      erreur.remove();
      champ.removeAttribute("aria-invalid");
      champ.removeAttribute("aria-describedby");
    }
  }

  function valider() {
    let premier = null;
    form.querySelectorAll("[required]").forEach((champ) => {
      let message = "";
      if (champ.type === "checkbox" && !champ.checked) message = t.consentement;
      else if (champ.type !== "checkbox" && !champ.value.trim()) message = t.requis;
      else if (champ.type === "email" && !champ.validity.valid) message = t.courriel;
      marquer(champ, message);
      if (message && !premier) premier = champ;
    });
    if (premier) premier.focus();
    return !premier;
  }

  // Retire l'erreur dès que la personne corrige le champ
  form.addEventListener("input", (e) => {
    if (e.target.getAttribute("aria-invalid") === "true") marquer(e.target, "");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statut.className = "statut";
    statut.innerHTML = "";
    if (!valider()) return;

    const donnees = new FormData(form);
    donnees.set("langue", lang);

    bouton.disabled = true;
    bouton.textContent = t.envoi;

    try {
      const reponse = await fetch(ADRESSE_ENVOI, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: donnees,
      });
      let resultat = {};
      try { resultat = await reponse.json(); } catch (e) { /* page sans PHP, p. ex. fichier ouvert directement */ }
      if (!resultat.success) {
        const erreur = new Error(resultat.code || "envoi");
        erreur.code = resultat.code;
        throw erreur;
      }

      statut.className = "statut statut--succes";
      statut.innerHTML = `<strong>${t.succesTitre}</strong>${t.succes}`;
      form.reset();
      if (menuMotif) afficherIndice();
    } catch (err) {
      statut.className = "statut statut--echec";
      statut.innerHTML = `<strong>${t.echecTitre}</strong>${err.code === "limite" ? t.limite : t.echec}`;
    } finally {
      bouton.disabled = false;
      bouton.textContent = t.bouton;
      statut.setAttribute("tabindex", "-1");
      statut.focus();
    }
  });
});
