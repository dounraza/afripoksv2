# 🃏 Poker App (Inspired by AfriPoks)

## 🎯 Objectif

Créer une application de poker multiplateforme :

* 🌐 Web
* 🖥️ Desktop (.exe)
* 📱 Android
* ⚙️ Backend robuste (temps réel + logique poker)

---

# 🧱 Architecture du projet

```
project/
├── web/         # Interface web (React)
├── mobile/      # Application Android (React Native)
├── desktop/     # App Electron (.exe)
├── server/      # Backend Node.js (Socket.io)
└── shared/      # Logique poker partagée
```

---

# 🌐 1. WEB (Frontend principal)

## Tech

* React
* CSS / Tailwind / Styled Components
* Socket.io-client

## Fonctionnalités

* Table de poker
* Cartes joueur
* Boutons (Fold / Call / Raise)
* Affichage des joueurs
* Connexion au serveur

---

# 🖥️ 2. DESKTOP (.exe)

## Tech

* Electron

## Fonctionnement

* Charge l’app web
* Build en `.exe`

## Commandes

```
npm install electron
npm install electron-builder
npm run build
```

---

# 📱 3. ANDROID

## Tech

* React Native

## Fonctionnalités

* Interface mobile adaptée
* Connexion au backend
* Animations simples

---

# ⚙️ 4. BACKEND (CRITIQUE)

## Tech

* Node.js
* Express
* Socket.io

## Responsabilités

* Gestion des joueurs
* Création de tables
* Distribution des cartes
* Gestion des tours
* Calcul des gagnants
* Synchronisation temps réel

---

# 🔐 Règle importante

❗ Toute la logique poker doit être côté serveur

```
✔ serveur :
- cartes
- règles
- gagnant

❌ client :
- affichage uniquement
```

---

# 🧠 5. LOGIQUE PARTAGÉE

```
shared/
 └── pokerLogic.js
```

Contient :

* évaluation des mains
* règles du jeu

---

# 🔄 Communication temps réel

## Exemple

Client :

```
socket.emit("joinGame");
```

Serveur :

```
socket.on("joinGame", () => {
  // ajouter joueur
});
```

---

# 🎮 Fonctionnalités du jeu

## Version 1 (MVP)

* rejoindre une table
* recevoir 2 cartes
* jouer un tour
* voir le gagnant

## Version 2

* multi joueurs
* timer
* chat

## Version 3

* classement
* comptes utilisateurs

---

# 🎨 UI (inspirée poker pro)

* table verte
* joueurs autour
* cartes animées
* jetons
* pot central

---

# 🚀 Roadmap

## Étape 1

Backend fonctionnel

## Étape 2

Interface web simple

## Étape 3

Connexion temps réel

## Étape 4

Mobile (React Native)

## Étape 5

Desktop (.exe avec Electron)

---

# ⚠️ À éviter

* ❌ logique côté client
* ❌ complexité trop tôt
* ❌ copier design exact (risque légal)

---

# ✅ Objectif final

Une app poker :

* fluide
* temps réel
* multiplateforme
* scalable

---

# 🔥 Bonus idées

* mode IA
* tournoi
* avatars joueurs
* animations avancées

---

# 📌 Conclusion

Stack recommandée :

* React (web)
* React Native (mobile)
* Electron (desktop)
* Node.js + Socket.io (backend)

👉 Commencer par le backend est essentiel.
