<?php
/**
 * Éditeur de nouvelles — Laboratoire Andréanne Côté
 *
 * Écrit dans data/nouvelles.json (lu par la page Nouvelles) et enregistre
 * les images dans assets/nouvelles/. Une copie de sauvegarde est faite à
 * chaque enregistrement dans admin/prive/sauvegardes/.
 *
 * Comptes et réglages : admin/prive/config.php
 */
define('EDITEUR_NOUVELLES', true);
$CONFIG = require __DIR__ . '/prive/config.php';

$RACINE       = dirname(__DIR__);
$FICHIER      = $RACINE . '/data/nouvelles.json';
$DOSSIER_IMG  = $RACINE . '/assets/nouvelles';
$CHEMIN_IMG   = 'assets/nouvelles';
$PRIVE        = __DIR__ . '/prive';
$SAUVEGARDES  = $PRIVE . '/sauvegardes';
$TENTATIVES   = $PRIVE . '/tentatives.json';

$CATEGORIES = [
    'publication' => 'Publication',
    'prix'        => 'Prix et distinction',
    'financement' => 'Financement',
    'congres'     => 'Congrès et présentation',
    'equipe'      => "Vie d'équipe",
    'medias'      => 'Dans les médias',
];

/* ------------------------------------------------------------------ */
/*  En-têtes de sécurité et session                                    */
/* ------------------------------------------------------------------ */
header('Cache-Control: no-store');
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
session_name('editeur_nouvelles');
session_set_cookie_params([
    'lifetime' => 0,
    'path'     => dirname($_SERVER['SCRIPT_NAME']) . '/',
    'secure'   => $https,
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

if (!empty($_SESSION['utilisateur']) && (time() - ($_SESSION['activite'] ?? 0)) > $CONFIG['duree_session']) {
    $_SESSION = [];
    session_regenerate_id(true);
    $_SESSION['message'] = ['info', 'Votre session a expiré. Reconnectez-vous.'];
}
if (!empty($_SESSION['utilisateur'])) {
    $_SESSION['activite'] = time();
}
if (empty($_SESSION['jeton'])) {
    $_SESSION['jeton'] = bin2hex(random_bytes(32));
}

/* ------------------------------------------------------------------ */
/*  Outils                                                             */
/* ------------------------------------------------------------------ */
// Longueur et découpage de texte avec accents, sans dépendre de l'extension mbstring
function longueur($s) { return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : preg_match_all('/./us', $s); }
function couper($s, $max) {
    if (function_exists('mb_substr')) return mb_substr($s, 0, $max, 'UTF-8');
    preg_match('/^.{0,' . (int) $max . '}/us', $s, $m);
    return $m[0] ?? '';
}

function e($s) { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); }

function rediriger($params = '') {
    header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?') . ($params ? '?' . $params : ''));
    exit;
}

function message($type, $texte) { $_SESSION['message'] = [$type, $texte]; }

function verifier_jeton() {
    $recu = $_POST['jeton'] ?? '';
    if (!is_string($recu) || !hash_equals($_SESSION['jeton'], $recu)) {
        http_response_code(400);
        exit('Requête refusée. Rechargez la page et réessayez.');
    }
}

function lire_nouvelles($fichier) {
    if (!is_file($fichier)) return [];
    $donnees = json_decode(file_get_contents($fichier), true);
    $liste = (is_array($donnees) && isset($donnees['nouvelles']) && is_array($donnees['nouvelles'])) ? $donnees['nouvelles'] : [];
    // Les nouvelles ajoutées avant cet éditeur n'ont pas d'identifiant : on leur en donne un.
    foreach ($liste as &$n) {
        if (empty($n['id']) || !preg_match('/^[a-f0-9]{12}$/', $n['id'])) $n['id'] = bin2hex(random_bytes(6));
    }
    unset($n);
    usort($liste, function ($a, $b) { return strcmp($b['date'] ?? '', $a['date'] ?? ''); });
    return $liste;
}

function ecrire_nouvelles($fichier, $liste, $sauvegardes, $nb_max) {
    // 1. Copie de sauvegarde de la version actuelle
    if (is_file($fichier)) {
        if (!is_dir($sauvegardes)) @mkdir($sauvegardes, 0750, true);
        @copy($fichier, $sauvegardes . '/nouvelles-' . date('Ymd-His') . '-' . bin2hex(random_bytes(2)) . '.json');
        $copies = glob($sauvegardes . '/nouvelles-*.json') ?: [];
        sort($copies);
        while (count($copies) > $nb_max) @unlink(array_shift($copies));
    }
    // 2. Écriture sûre : fichier temporaire, puis remplacement
    usort($liste, function ($a, $b) { return strcmp($b['date'] ?? '', $a['date'] ?? ''); });
    $json = json_encode(['nouvelles' => array_values($liste)], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $temp = $fichier . '.tmp-' . bin2hex(random_bytes(4));
    if (file_put_contents($temp, $json, LOCK_EX) === false) return false;
    return rename($temp, $fichier);
}

/* --- Limitation des tentatives de connexion --- */
function tentatives_lire($f) {
    $t = is_file($f) ? json_decode(file_get_contents($f), true) : [];
    return is_array($t) ? $t : [];
}
function cle_ip() { return hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'inconnue'); }

function est_bloque($f, $config) {
    $t = tentatives_lire($f);
    $k = cle_ip();
    return isset($t[$k]) && $t[$k]['n'] >= $config['max_tentatives'] && (time() - $t[$k]['depuis']) < $config['duree_blocage'];
}
function noter_echec($f, $config) {
    $t = tentatives_lire($f);
    $k = cle_ip();
    foreach ($t as $cle => $v) if (time() - $v['depuis'] > $config['duree_blocage']) unset($t[$cle]);
    if (!isset($t[$k])) $t[$k] = ['n' => 0, 'depuis' => time()];
    $t[$k]['n']++;
    @file_put_contents($f, json_encode($t), LOCK_EX);
}
function effacer_echecs($f) {
    $t = tentatives_lire($f);
    unset($t[cle_ip()]);
    @file_put_contents($f, json_encode($t), LOCK_EX);
}

/* --- Images --- */
function traiter_image($fichier, $dossier, $chemin_public, $config, &$erreur) {
    if (empty($fichier) || ($fichier['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) return null;
    if ($fichier['error'] !== UPLOAD_ERR_OK) { $erreur = "L'image n'a pas pu être envoyée (fichier trop lourd?)."; return false; }
    if ($fichier['size'] > $config['taille_max_image']) { $erreur = "L'image est trop lourde (maximum " . round($config['taille_max_image'] / 1048576) . " Mo)."; return false; }

    $infos = @getimagesize($fichier['tmp_name']);
    $types = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'];
    if (!$infos || !isset($types[$infos[2]])) { $erreur = "Seules les images JPG, PNG ou WebP sont acceptées."; return false; }

    if (!is_dir($dossier)) @mkdir($dossier, 0755, true);
    $base = date('Y-m') . '-' . bin2hex(random_bytes(5));

    // Avec GD : on redimensionne et on réenregistre l'image (plus légère, et sans contenu caché).
    if (function_exists('imagecreatetruecolor')) {
        $source = null;
        if ($infos[2] === IMAGETYPE_JPEG && function_exists('imagecreatefromjpeg')) $source = @imagecreatefromjpeg($fichier['tmp_name']);
        if ($infos[2] === IMAGETYPE_PNG  && function_exists('imagecreatefrompng'))  $source = @imagecreatefrompng($fichier['tmp_name']);
        if ($infos[2] === IMAGETYPE_WEBP && function_exists('imagecreatefromwebp')) $source = @imagecreatefromwebp($fichier['tmp_name']);
        if ($source) {
            $l = imagesx($source); $h = imagesy($source);
            $max = $config['largeur_max_image'];
            if ($l > $max) { $nh = (int) round($h * $max / $l); $nl = $max; } else { $nl = $l; $nh = $h; }
            $dest = imagecreatetruecolor($nl, $nh);
            $garder_png = ($infos[2] === IMAGETYPE_PNG);
            if ($garder_png) { imagealphablending($dest, false); imagesavealpha($dest, true); }
            else { imagefill($dest, 0, 0, imagecolorallocate($dest, 255, 255, 255)); }
            imagecopyresampled($dest, $source, 0, 0, 0, 0, $nl, $nh, $l, $h);
            $nom = $base . ($garder_png ? '.png' : '.jpg');
            $ok = $garder_png ? imagepng($dest, "$dossier/$nom", 8) : imagejpeg($dest, "$dossier/$nom", 82);
            imagedestroy($source); imagedestroy($dest);
            if ($ok) return "$chemin_public/$nom";
        }
    }
    // Sans GD : on garde le fichier tel quel, sous un nouveau nom.
    $nom = $base . '.' . $types[$infos[2]];
    if (!move_uploaded_file($fichier['tmp_name'], "$dossier/$nom")) { $erreur = "L'image n'a pas pu être enregistrée sur le serveur."; return false; }
    return "$chemin_public/$nom";
}

function supprimer_image($chemin, $racine, $chemin_public) {
    // Seulement les images de assets/nouvelles, jamais ailleurs
    if ($chemin && preg_match('#^' . preg_quote($chemin_public, '#') . '/[A-Za-z0-9._-]+$#', $chemin)) {
        @unlink($racine . '/' . $chemin);
    }
}

/* ------------------------------------------------------------------ */
/*  Actions                                                            */
/* ------------------------------------------------------------------ */
$utilisateur = $_SESSION['utilisateur'] ?? null;
$action = $_POST['action'] ?? ($_GET['action'] ?? '');

// --- Connexion ---
if ($action === 'connexion' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    verifier_jeton();
    if (est_bloque($TENTATIVES, $CONFIG)) {
        message('erreur', 'Trop de tentatives. Réessayez dans ' . round($CONFIG['duree_blocage'] / 60) . ' minutes.');
        rediriger();
    }
    $id  = strtolower(trim((string) ($_POST['identifiant'] ?? '')));
    $mdp = (string) ($_POST['mot_de_passe'] ?? '');
    $empreinte = $CONFIG['utilisateurs'][$id] ?? null;
    if ($empreinte && password_verify($mdp, $empreinte)) {
        effacer_echecs($TENTATIVES);
        session_regenerate_id(true);
        $_SESSION['utilisateur'] = $id;
        $_SESSION['activite'] = time();
        $_SESSION['jeton'] = bin2hex(random_bytes(32));
        rediriger();
    }
    noter_echec($TENTATIVES, $CONFIG);
    usleep(400000);
    message('erreur', 'Identifiant ou mot de passe incorrect.');
    rediriger();
}

// --- Déconnexion ---
if ($action === 'deconnexion' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    verifier_jeton();
    $_SESSION = [];
    session_regenerate_id(true);
    message('info', 'Vous êtes déconnecté.');
    rediriger();
}

// --- Actions réservées aux personnes connectées ---
if ($utilisateur && $_SERVER['REQUEST_METHOD'] === 'POST') {
    verifier_jeton();
    $liste = lire_nouvelles($FICHIER);

    if ($action === 'enregistrer') {
        $id = $_POST['id'] ?? '';
        $erreurs = [];
        $champ = function ($nom, $max) use (&$erreurs) {
            $v = trim(str_replace("\r\n", "\n", (string) ($_POST[$nom] ?? '')));
            if (longueur($v) > $max) { $erreurs[] = "Un des champs est trop long."; $v = couper($v, $max); }
            return $v;
        };
        $n = [
            'date'      => $champ('date', 10),
            'publiee'   => !empty($_POST['publiee']),
            'categorie' => $champ('categorie', 20),
            'titre_fr'  => $champ('titre_fr', 200),
            'texte_fr'  => $champ('texte_fr', 5000),
            'titre_en'  => $champ('titre_en', 200),
            'texte_en'  => $champ('texte_en', 5000),
            'image_alt' => $champ('image_alt', 250),
            'lien'      => $champ('lien', 500),
        ];
        $d = DateTime::createFromFormat('Y-m-d', $n['date']);
        if (!$d || $d->format('Y-m-d') !== $n['date']) $erreurs[] = 'La date est invalide.';
        if (!isset($CATEGORIES[$n['categorie']])) $erreurs[] = 'Choisissez une catégorie.';
        if ($n['titre_fr'] === '') $erreurs[] = 'Le titre en français est obligatoire.';
        if ($n['texte_fr'] === '') $erreurs[] = 'Le texte en français est obligatoire.';
        if ($n['lien'] !== '' && !preg_match('#^https?://[^\s<>"]+$#i', $n['lien'])) $erreurs[] = 'Le lien doit commencer par https:// (ou http://).';

        // Nouvelle existante ou nouvelle création
        $index = null;
        foreach ($liste as $i => $x) if ($x['id'] === $id) $index = $i;
        $image_actuelle = $index !== null ? ($liste[$index]['image'] ?? '') : '';

        $erreur_img = '';
        $nouvelle_img = $erreurs ? null : traiter_image($_FILES['image'] ?? null, $DOSSIER_IMG, $CHEMIN_IMG, $CONFIG, $erreur_img);
        if ($nouvelle_img === false) $erreurs[] = $erreur_img;

        if ($erreurs) {
            $_SESSION['brouillon'] = $n + ['id' => $id, 'image' => $image_actuelle];
            message('erreur', implode(' ', array_unique($erreurs)));
            rediriger('action=modifier&id=' . urlencode($id ?: 'nouvelle'));
        }

        $n['image'] = $image_actuelle;
        if (!empty($_POST['retirer_image'])) { supprimer_image($image_actuelle, $RACINE, $CHEMIN_IMG); $n['image'] = ''; }
        if ($nouvelle_img) { supprimer_image($image_actuelle, $RACINE, $CHEMIN_IMG); $n['image'] = $nouvelle_img; }
        if ($n['image'] && $n['image_alt'] === '') $n['image_alt'] = $n['titre_fr'];

        if ($index !== null) {
            $n['id'] = $id;
            $liste[$index] = $n;
        } else {
            $n['id'] = bin2hex(random_bytes(6));
            $liste[] = $n;
        }
        if (ecrire_nouvelles($FICHIER, $liste, $SAUVEGARDES, $CONFIG['nb_sauvegardes'])) {
            message('succes', $n['publiee'] ? 'La nouvelle est enregistrée et visible sur le site.' : 'La nouvelle est enregistrée comme brouillon (non visible sur le site).');
        } else {
            message('erreur', "Impossible d'écrire le fichier des nouvelles. Vérifiez les permissions du dossier data/ avec la DTI.");
        }
        rediriger();
    }

    if ($action === 'supprimer') {
        $id = $_POST['id'] ?? '';
        foreach ($liste as $i => $x) {
            if ($x['id'] === $id) {
                supprimer_image($x['image'] ?? '', $RACINE, $CHEMIN_IMG);
                unset($liste[$i]);
                ecrire_nouvelles($FICHIER, $liste, $SAUVEGARDES, $CONFIG['nb_sauvegardes']);
                message('succes', 'La nouvelle a été supprimée. Une copie de sauvegarde a été conservée.');
                break;
            }
        }
        rediriger();
    }
}

/* ------------------------------------------------------------------ */
/*  Affichage                                                          */
/* ------------------------------------------------------------------ */
$msg = $_SESSION['message'] ?? null;
unset($_SESSION['message']);
$jeton = $_SESSION['jeton'];

function entete($titre) { ?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title><?= e($titre) ?> | Éditeur de nouvelles</title>
  <link rel="icon" href="../assets/logo-lungs.png">
  <link rel="stylesheet" href="admin.css">
</head>
<?php }

function afficher_message($msg) {
    if ($msg) echo '<p class="alerte alerte--' . e($msg[0]) . '" role="status">' . e($msg[1]) . '</p>';
}

// ---------- Écran de connexion ----------
if (!$utilisateur) {
    entete('Connexion'); ?>
<body class="page-connexion">
  <main class="boite">
    <img class="boite__logo" src="../assets/logo-lungs.png" alt="" width="64">
    <h1>Éditeur de nouvelles</h1>
    <p>Laboratoire Andréanne Côté · Asthma Innovative Research</p>
    <?php afficher_message($msg); ?>
    <?php if (empty($CONFIG['utilisateurs'])): ?>
      <p class="alerte alerte--info">Aucun compte n'est encore configuré. Créez-en un avec <a href="generer-empreinte.php">l'outil de création de compte</a>, puis ajoutez-le dans <code>admin/prive/config.php</code>.</p>
    <?php endif; ?>
    <form method="post">
      <input type="hidden" name="action" value="connexion">
      <input type="hidden" name="jeton" value="<?= e($jeton) ?>">
      <label for="identifiant">Identifiant</label>
      <input id="identifiant" name="identifiant" autocomplete="username" required autofocus>
      <label for="mot_de_passe">Mot de passe</label>
      <input id="mot_de_passe" name="mot_de_passe" type="password" autocomplete="current-password" required>
      <button class="bouton" type="submit">Se connecter</button>
    </form>
  </main>
</body>
</html>
<?php exit; }

$liste = lire_nouvelles($FICHIER);

// ---------- Formulaire d'ajout ou de modification ----------
if ($action === 'modifier') {
    $id = $_GET['id'] ?? 'nouvelle';
    $n = null;
    if (!empty($_SESSION['brouillon'])) { $n = $_SESSION['brouillon']; unset($_SESSION['brouillon']); }
    if (!$n) foreach ($liste as $x) if ($x['id'] === $id) $n = $x;
    $creation = !$n || empty($n['id']);
    if (!$n) $n = ['date' => date('Y-m-d'), 'publiee' => true, 'categorie' => 'equipe'];
    entete($creation ? 'Nouvelle nouvelle' : 'Modifier'); ?>
<body>
  <header class="barre">
    <a class="barre__titre" href="./">← Toutes les nouvelles</a>
    <span class="barre__qui"><?= e($utilisateur) ?></span>
  </header>
  <main class="contenu">
    <h1><?= $creation ? 'Ajouter une nouvelle' : 'Modifier la nouvelle' ?></h1>
    <?php afficher_message($msg); ?>

    <form method="post" enctype="multipart/form-data" class="formulaire">
      <input type="hidden" name="action" value="enregistrer">
      <input type="hidden" name="jeton" value="<?= e($jeton) ?>">
      <input type="hidden" name="id" value="<?= e($creation ? '' : $n['id']) ?>">

      <div class="rangee">
        <div class="champ">
          <label for="date">Date</label>
          <input id="date" name="date" type="date" required value="<?= e($n['date'] ?? '') ?>">
        </div>
        <div class="champ">
          <label for="categorie">Catégorie</label>
          <select id="categorie" name="categorie" required>
            <?php foreach ($CATEGORIES as $v => $l): ?>
              <option value="<?= e($v) ?>"<?= ($n['categorie'] ?? '') === $v ? ' selected' : '' ?>><?= e($l) ?></option>
            <?php endforeach; ?>
          </select>
        </div>
      </div>

      <label class="case">
        <input type="checkbox" name="publiee" value="1"<?= !empty($n['publiee']) ? ' checked' : '' ?>>
        Afficher sur le site <span class="aide">(décochez pour garder un brouillon)</span>
      </label>

      <fieldset>
        <legend>En français</legend>
        <div class="champ">
          <label for="titre_fr">Titre</label>
          <input id="titre_fr" name="titre_fr" required maxlength="200" value="<?= e($n['titre_fr'] ?? '') ?>">
        </div>
        <div class="champ">
          <label for="texte_fr">Texte</label>
          <textarea id="texte_fr" name="texte_fr" rows="7" required maxlength="5000"><?= e($n['texte_fr'] ?? '') ?></textarea>
        </div>
      </fieldset>

      <fieldset>
        <legend>En anglais <span class="aide">(facultatif : sans traduction, la page anglaise affiche la version française)</span></legend>
        <div class="champ">
          <label for="titre_en">Title</label>
          <input id="titre_en" name="titre_en" maxlength="200" value="<?= e($n['titre_en'] ?? '') ?>">
        </div>
        <div class="champ">
          <label for="texte_en">Text</label>
          <textarea id="texte_en" name="texte_en" rows="7" maxlength="5000"><?= e($n['texte_en'] ?? '') ?></textarea>
        </div>
      </fieldset>

      <details class="aide-format">
        <summary>Mettre en forme le texte</summary>
        <ul>
          <li><code>**mots en gras**</code> donne <strong>mots en gras</strong></li>
          <li><code>*mots en italique*</code> donne <em>mots en italique</em></li>
          <li><code>[texte du lien](https://adresse.com)</code> crée un lien</li>
          <li>Une ligne qui commence par <code>- </code> crée une liste à puces</li>
          <li>Une ligne vide entre deux blocs crée un nouveau paragraphe</li>
        </ul>
      </details>

      <fieldset>
        <legend>Image et lien <span class="aide">(facultatifs)</span></legend>
        <?php if (!empty($n['image'])): ?>
          <div class="image-actuelle">
            <img src="../<?= e($n['image']) ?>" alt="">
            <label class="case"><input type="checkbox" name="retirer_image" value="1"> Retirer cette image</label>
          </div>
        <?php endif; ?>
        <div class="champ">
          <label for="image"><?= empty($n['image']) ? 'Ajouter une image' : 'Remplacer par une autre image' ?></label>
          <input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp">
          <span class="aide">JPG, PNG ou WebP. Les grandes images sont réduites automatiquement.</span>
        </div>
        <div class="champ">
          <label for="image_alt">Description de l'image</label>
          <input id="image_alt" name="image_alt" maxlength="250" value="<?= e($n['image_alt'] ?? '') ?>">
          <span class="aide">Une courte phrase pour les personnes qui ne voient pas l'image.</span>
        </div>
        <div class="champ">
          <label for="lien">Lien externe</label>
          <input id="lien" name="lien" type="url" maxlength="500" placeholder="https://" value="<?= e($n['lien'] ?? '') ?>">
          <span class="aide">Par exemple l'article publié ou le communiqué.</span>
        </div>
      </fieldset>

      <p class="rappel">Rappel : n'inscrivez aucun renseignement confidentiel ou personnel sur des participants.</p>

      <div class="actions">
        <button class="bouton" type="submit">Enregistrer</button>
        <a class="lien-annuler" href="./">Annuler</a>
      </div>
    </form>
  </main>
</body>
</html>
<?php exit; }

// ---------- Liste des nouvelles ----------
entete('Nouvelles'); ?>
<body>
  <header class="barre">
    <span class="barre__titre">Éditeur de nouvelles</span>
    <span class="barre__qui">
      <a href="../nouvelles.html" target="_blank" rel="noopener">Voir la page Nouvelles</a>
      <form method="post" class="inline">
        <input type="hidden" name="action" value="deconnexion">
        <input type="hidden" name="jeton" value="<?= e($jeton) ?>">
        <button type="submit" class="lien-bouton">Se déconnecter (<?= e($utilisateur) ?>)</button>
      </form>
    </span>
  </header>
  <main class="contenu">
    <div class="tete-liste">
      <h1>Nouvelles</h1>
      <a class="bouton" href="?action=modifier&amp;id=nouvelle">+ Ajouter une nouvelle</a>
    </div>
    <?php afficher_message($msg); ?>

    <?php if (!$liste): ?>
      <p class="vide">Aucune nouvelle pour l'instant. Cliquez sur « Ajouter une nouvelle » pour commencer.</p>
    <?php else: ?>
      <ul class="liste">
        <?php foreach ($liste as $x): ?>
          <li class="item<?= empty($x['publiee']) ? ' item--brouillon' : '' ?>">
            <div class="item__infos">
              <span class="item__date"><?= e($x['date'] ?? '') ?></span>
              <span class="pastille"><?= e($CATEGORIES[$x['categorie'] ?? ''] ?? '—') ?></span>
              <?php if (empty($x['publiee'])): ?><span class="pastille pastille--brouillon">Brouillon</span><?php endif; ?>
              <?php if (empty($x['titre_en'])): ?><span class="pastille pastille--manque">Pas de version anglaise</span><?php endif; ?>
              <strong class="item__titre"><?= e($x['titre_fr'] ?? '') ?></strong>
            </div>
            <div class="item__actions">
              <a href="?action=modifier&amp;id=<?= e($x['id']) ?>">Modifier</a>
              <form method="post" class="inline" onsubmit="return confirm('Supprimer cette nouvelle?');">
                <input type="hidden" name="action" value="supprimer">
                <input type="hidden" name="jeton" value="<?= e($jeton) ?>">
                <input type="hidden" name="id" value="<?= e($x['id']) ?>">
                <button type="submit" class="lien-bouton lien-bouton--danger">Supprimer</button>
              </form>
            </div>
          </li>
        <?php endforeach; ?>
      </ul>
    <?php endif; ?>
  </main>
</body>
</html>
