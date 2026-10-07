<?php
/**
 * Outil pour créer l'empreinte d'un mot de passe, à copier dans admin/prive/config.php.
 * Ne conserve rien : le mot de passe n'est ni enregistré ni affiché.
 */
header('Cache-Control: no-store');
$ligne = '';
$erreur = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = strtolower(trim($_POST['identifiant'] ?? ''));
    $mdp = $_POST['mot_de_passe'] ?? '';
    if (!preg_match('/^[a-z0-9._-]{2,40}$/', $id)) {
        $erreur = "L'identifiant doit contenir de 2 à 40 lettres minuscules, chiffres, points ou tirets, sans accents ni espaces.";
    } elseif (preg_match_all('/./us', $mdp) < 12) {
        $erreur = 'Le mot de passe doit contenir au moins 12 caractères.';
    } else {
        $ligne = "        '" . $id . "' => '" . password_hash($mdp, PASSWORD_DEFAULT) . "',";
    }
}
?><!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Créer une empreinte de mot de passe</title>
  <link rel="stylesheet" href="admin.css">
</head>
<body class="page-connexion">
  <main class="boite">
    <h1>Créer un compte</h1>
    <p>Choisissez un identifiant et un mot de passe d'au moins 12 caractères. Copiez ensuite la ligne obtenue dans <code>admin/prive/config.php</code>, dans la liste <code>'utilisateurs'</code>.</p>
    <?php if ($erreur): ?><p class="alerte alerte--erreur"><?= htmlspecialchars($erreur) ?></p><?php endif; ?>
    <?php if ($ligne): ?>
      <p class="alerte alerte--succes">Voici la ligne à copier :</p>
      <textarea class="code" rows="3" readonly onclick="this.select()"><?= htmlspecialchars($ligne) ?></textarea>
    <?php endif; ?>
    <form method="post" autocomplete="off">
      <label for="identifiant">Identifiant</label>
      <input id="identifiant" name="identifiant" required pattern="[a-z0-9._\-]{2,40}">
      <label for="mot_de_passe">Mot de passe</label>
      <input id="mot_de_passe" name="mot_de_passe" type="password" required minlength="12" autocomplete="new-password">
      <button class="bouton" type="submit">Créer l'empreinte</button>
    </form>
  </main>
</body>
</html>
