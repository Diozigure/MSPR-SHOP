# geronimo-corp-shop
Shop pour le MSPR Infrastructure et réseaux, créer à partir d'une architecture MVC

Compte Admin par defaut : admin@geronimo-corp.com / admin

## Les technos
Node.js serveur d'appli

### Modules installés
- express
- mongose
- ejs
- pdfkit
- csurf
- multer
- nodemon
- stripe
- bcrypt
- nodemailer

### BDD
Les données sont stockés en NoSQL avec MongoDB

## Installation & Commandes
### Checkout github
```
git init
git remote add origin https://github.com/Diozigure/MSPR-SHOP.git
gir pull origin main
```
### Installer les dépendances node
```
npm install
```
### Start le serveur node
```
npm run start
```
### Fichier de configuration
Le fichier de configuration à modifier : `api-keys/api-keys.js`
