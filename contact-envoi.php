<?php
/**
 * Envoi du formulaire de contact par courriel, directement depuis le serveur.
 * Appelé par js/contact-form.js. Réponse en JSON.
 *
 * Rien n'est enregistré sur le serveur : le message est seulement envoyé par courriel.
 * Seul un compteur anti-abus temporaire (adresse IP chiffrée, effacée après une heure)
 * est conservé dans prive/.
 */
define('FORMULAIRE_CONTACT', true);
$CONFIG = require __DIR__ . '/prive/config-contact.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function repondre($ok, $code, $statut = 200) {
    http_response_code($statut);
    echo json_encode(['success' => $ok, 'code' => $code]);
    exit;
}

// Longueur d'un texte avec accents, sans dépendre de l'extension mbstring
function longueur($s) { return preg_match_all('/./us', $s); }

// Retire les sauts de ligne (empêche l'injection d'en-têtes de courriel)
function une_ligne($s) { return trim(preg_replace('/[\r\n\t]+/', ' ', $s)); }

// En-tête encodé en UTF-8 (accents dans le sujet et le nom)
function entete_utf8($s) { return '=?UTF-8?B?' . base64_encode($s) . '?='; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') repondre(false, 'methode', 405);

// 1. Le formulaire doit venir de notre propre site
if (!empty($CONFIG['domaine'])) {
    $origine = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
    $hote = parse_url($origine, PHP_URL_HOST);
    if (!$hote || strcasecmp($hote, $CONFIG['domaine']) !== 0) repondre(false, 'origine', 403);
}

// 2. Piège à robots : un humain ne coche jamais cette case invisible.
//    On fait semblant que tout a fonctionné pour ne pas renseigner le robot.
if (!empty($_POST['botcheck'])) repondre(true, 'ok');

// 3. Limite d'envois par adresse IP (adresse chiffrée, jamais conservée en clair)
$fichier_limites = __DIR__ . '/prive/limites-contact.json';
$cle = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|' . date('Y-m-d-H'));
$limites = is_file($fichier_limites) ? (json_decode(file_get_contents($fichier_limites), true) ?: []) : [];
$heure = date('Y-m-d-H');
$limites = array_filter($limites, function ($v) use ($heure) { return ($v['h'] ?? '') === $heure; });
if (($limites[$cle]['n'] ?? 0) >= (int) $CONFIG['max_par_heure']) repondre(false, 'limite', 429);

// 4. Lecture et validation des champs
$motifs = [
    'participation' => ['fr' => 'Participer à une étude',          'en' => 'Taking part in a study'],
    'etudes'        => ['fr' => 'Études supérieures ou stage',     'en' => 'Graduate studies or internship'],
    'collaboration' => ['fr' => 'Collaboration de recherche',      'en' => 'Research collaboration'],
    'medias'        => ['fr' => 'Demande des médias',              'en' => 'Media request'],
    'autre'         => ['fr' => 'Autre question',                  'en' => 'Other question'],
];
$champ = function ($nom) { return trim(str_replace("\r\n", "\n", (string) ($_POST[$nom] ?? ''))); };

$nom          = une_ligne($champ('nom'));
$courriel     = une_ligne($champ('courriel'));
$motif        = $champ('motif');
$organisation = une_ligne($champ('organisation'));
$message      = $champ('message');
$langue       = $champ('langue') === 'en' ? 'en' : 'fr';

if ($nom === '' || $message === '' || empty($_POST['consentement'])) repondre(false, 'champs', 422);
if (!filter_var($courriel, FILTER_VALIDATE_EMAIL)) repondre(false, 'courriel', 422);
if (!isset($motifs[$motif])) repondre(false, 'champs', 422);
if (longueur($nom) > 120 || longueur($courriel) > 200 || longueur($organisation) > 200 || longueur($message) > 5000) {
    repondre(false, 'longueur', 422);
}

// 5. Composition du courriel
$libelle = $motifs[$motif]['fr'];
$sujet = '[Site web] ' . $libelle . ' – ' . $nom;
$corps = "Nouveau message reçu par le formulaire de contact du site.\n"
       . str_repeat('-', 50) . "\n"
       . "Objet :        $libelle\n"
       . "Nom :          $nom\n"
       . "Courriel :     $courriel\n"
       . "Organisation : " . ($organisation !== '' ? $organisation : '—') . "\n"
       . "Langue :       " . strtoupper($langue) . "\n"
       . "Date :         " . date('Y-m-d H:i') . "\n"
       . str_repeat('-', 50) . "\n\n"
       . $message . "\n\n"
       . str_repeat('-', 50) . "\n"
       . "Pour répondre, utilisez simplement le bouton « Répondre » de votre logiciel de courriel.\n"
       . "Rappel : supprimez ce courriel lorsque la demande est traitée (politique de confidentialité du site).\n";

$entetes = [
    'From: ' . entete_utf8($CONFIG['nom_expediteur']) . ' <' . $CONFIG['expediteur'] . '>',
    'Reply-To: ' . entete_utf8($nom) . ' <' . $courriel . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: Formulaire du laboratoire',
];

$envoye = @mail($CONFIG['destinataire'], entete_utf8($sujet), $corps, implode("\r\n", $entetes), '-f' . $CONFIG['expediteur']);
if (!$envoye) repondre(false, 'envoi', 500);

// 6. Compter l'envoi pour la limite horaire
$limites[$cle] = ['h' => $heure, 'n' => ($limites[$cle]['n'] ?? 0) + 1];
@file_put_contents($fichier_limites, json_encode($limites), LOCK_EX);

repondre(true, 'ok');
