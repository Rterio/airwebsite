<?php
/**
 * Réglages du formulaire de contact (lu par contact-envoi.php).
 * Ce fichier n'est jamais affiché aux visiteurs.
 */
if (!defined('FORMULAIRE_CONTACT')) { http_response_code(403); exit; }

return [
    // Adresse qui REÇOIT les messages du formulaire
    'destinataire' => 'courriel@exemple.ca',

    // Adresse d'EXPÉDITION des courriels. Doit être une adresse permise par le
    // serveur de l'Université (à confirmer avec la DTI), p. ex. ne-pas-repondre@...ulaval.ca
    // Le bouton « Répondre » de votre logiciel de courriel ira quand même à la personne qui a écrit.
    'expediteur' => 'ne-pas-repondre@exemple.ulaval.ca',
    'nom_expediteur' => 'Site web – Laboratoire Andréanne Côté',

    // Nom de domaine du site, pour refuser les envois provenant d'autres sites.
    // Laissez vide pour désactiver la vérification (p. ex. pendant les essais).
    'domaine' => '',

    // Anti-abus : nombre maximal de messages par adresse IP par heure
    'max_par_heure' => 5,
];
