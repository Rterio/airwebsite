<?php
/**
 * Configuration de l'éditeur de nouvelles.
 * Ce fichier n'est jamais affiché aux visiteurs (protégé par .htaccess et par la ligne ci-dessous).
 */
if (!defined('EDITEUR_NOUVELLES')) { http_response_code(403); exit; }

return [
    // ------------------------------------------------------------------
    // COMPTES : un identifiant => l'empreinte de son mot de passe.
    // Pour créer une empreinte, ouvrez admin/generer-empreinte.php,
    // tapez le mot de passe, puis copiez la ligne obtenue ici.
    // Ne mettez JAMAIS un mot de passe en clair dans ce fichier.
    // ------------------------------------------------------------------
    'utilisateurs' => [
        // 'jakie' => '$2y$10$............................................',
            'oterio' => '$2y$12$wqLj809NM9BqdDebxq3tAuB6sloybcRQI0YwYQvVkhTfi/1auW03e',
    ],

    // Déconnexion automatique après cette durée d'inactivité (en secondes)
    'duree_session' => 2 * 60 * 60,

    // Blocage après trop de mauvais mots de passe
    'max_tentatives'   => 5,
    'duree_blocage'    => 15 * 60,

    // Images : taille maximale envoyée (octets) et largeur maximale conservée (pixels)
    'taille_max_image' => 8 * 1024 * 1024,
    'largeur_max_image' => 1600,

    // Nombre de copies de sauvegarde conservées
    'nb_sauvegardes' => 30,
];
