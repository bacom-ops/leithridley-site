# Site de Leith Ridley

Le site public, plus un espace privé, l'atelier, où Leith ajoute et modifie ses œuvres elle-même.

## Ce qu'il y a dedans

- `site/index.html` : le site.
- `site/atelier/` : l'espace privé, à l'adresse `/atelier`.
- `site/works/` : les photos des œuvres d'origine.
- `site/works.json` : la liste des œuvres de départ.
- `netlify/functions/` : le petit serveur qui enregistre les œuvres et les photos (Netlify Functions et Netlify Blobs, inclus dans l'offre gratuite).

## Mise en ligne (une seule fois)

1. **GitHub** : crée un compte gratuit sur github.com, puis un dépôt **privé** nommé `leithridley-site`.
   - Sur la page du dépôt, clique sur « uploading an existing file ».
   - Glisses-y **le contenu** de ce dossier : `netlify`, `site`, `netlify.toml`, `package.json`, `README.md` et `.gitignore`.
   - Valide avec « Commit changes ».
2. **Netlify** : fais « Add new site », puis « Import an existing project », puis « GitHub ».
   - Choisis `leithridley-site`. Ne change aucun réglage, tout est lu dans `netlify.toml`.
   - Clique sur « Deploy ».
3. **Mot de passe de l'atelier** : va dans Site configuration, puis Environment variables, puis « Add a variable ».
   - Nom : `ADMIN_PASSWORD`.
   - Valeur : un mot de passe long, par exemple 4 mots au hasard.
   - Puis va dans Deploys et fais « Trigger deploy », puis « Deploy site ».
4. **Messages du formulaire de contact** : va dans Forms, puis Notifications, puis « Add notification », puis « Email notification ».
   - Choisis le formulaire `contact` et l'adresse contact.leithridley@gmail.com.
5. **Nom de domaine** : va dans Domain management, puis « Add a domain ».

## Pour Leith

- Va sur `leithridley.com/atelier` et entre le mot de passe.
- **« + Ajouter une œuvre »** : ajoute la photo, le titre, la série, la technique, les dimensions, le statut et le prix. L'œuvre est en ligne dès l'enregistrement.
- **Les flèches ↑ ↓** changent l'ordre sur le mur.
- **« Masquer du site »** retire une œuvre du site sans la supprimer.
- **« Annuler la dernière modification »** revient en arrière si une erreur a été faite.

Les photos sont redimensionnées automatiquement. Si la photo n'a pas la même forme que les dimensions saisies, l'atelier le signale avant d'enregistrer.
