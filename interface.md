# Description de l'Interface CoinPoker

## Vue d'ensemble

CoinPoker est une plateforme de poker en ligne. L'interface présentée est une application de bureau (desktop) avec un design sombre (dark theme), aux tons noirs, gris foncé et rouges.

---

## Barre de Navigation Supérieure

### En-tête principal
- **Logo** : Icône rouge avec les lettres "CP" entrelacées, suivi du texte **CoinPoker** en blanc.
- **Indicateur en ligne** : `● 2562 Online` (point vert + nombre d'utilisateurs connectés).
- **Lecteur audio** : Icône play rouge avec le titre *"The Vibe"* et un icône de son.
- **Compte utilisateur** (en haut à droite) :
  - Avatar personnalisé (illustration de personnage)
  - Nom d'utilisateur : `bad555956414...`
  - Solde : `₮0`
  - Icônes d'actions (notifications, actualisation)
  - Bouton rouge (probablement dépôt/caisse)

### Menu de navigation principal
Quatre onglets centraux :

| Onglet | Icône | Description |
|--------|-------|-------------|
| **Poker** *(actif)* | Cartes à jouer | Section principale, soulignée en rouge |
| **Casino** | Machine à sous | Jeux de casino classiques |
| **Live Casino** | Dés | Casino en direct avec croupiers réels |
| **Sportsbook** | Trophée | Paris sportifs |

---

## Barre de Navigation Secondaire (Sous-menu Poker)

Barre horizontale avec les formats de jeu disponibles :

- 🏠 **Accueil** (icône maison, fond rouge – sélectionné)
- 💰 **Cash Games** – Parties en argent réel
- 🃏 **Short Deck** *(badge "NEW")* – Variante avec deck réduit
- ⚡ **All-In Or Fold** – Format rapide tout-ou-rien
- 💣 **Bomb Pot** – Format avec mise forcée
- 🏆 **Tournaments** – Tournois
- 🌍 **World Poker Masters** – Série de tournois spéciaux
- 🎖️ **CGWC** – Championnat mondial CoinPoker
- ▶ Bouton de défilement pour plus d'options

---

## Zone Centrale Principale

### Bannière gauche (Promotionnelle)
- Visuel animé/illustré représentant une couronne dorée ornée de gemmes rouges posée sur des pièces de monnaie.
- Titre en grandes lettres dorées : **"COIN REWARDS"**
- Indicateurs de pagination (points en bas) suggérant un carrousel de plusieurs bannières.

### Panneau central – Skill Score Board
- Encadré sombre avec message :
  > **"PLAY AT LEAST 1 TOURNAMENT TO GET RANKED IN SKILL SCORE BOARD"**
- Bouton/lien : `START PLAYING TOURNAMENT NOW`

### Section – Explorer les Formats de Poker
Grille 2×2 de cartes cliquables :

| Carte | Icône | Format |
|-------|-------|--------|
| **Cash Games** | Pièce dorée avec logo BTC | Parties cash classiques |
| **Tournaments** | Trophée doré | Tournois |
| **All-In Fold** | Logo A/F stylisé | Format All-In ou Fold |
| **Practice Games** | Cartes à jouer (cœur/carreau) | Parties d'entraînement gratuites |

### Panneau – Mes Transactions
- Icône de cloche (notifications)
- Titre : **"My Transactions"**
- Description : *"Check out your withdrawal and deposit status here"*
- Indicateurs de pagination

### Panneau – PokerIntel
- Icône ampoule (idée)
- Message : *"Use PokerIntel to understand your gameplay and improvise"*

---

## Panneau Droit – Game Stats

### En-tête
- Titre : **GAME STATS**
- Deux onglets : **Cash** *(actif, fond rouge)* | **Tournament**

### Période
- Libellé : **Monthly**
- Plage de dates : `21 Mar - Today`
- Sélecteur de période : `Monthly ▼`

### Temps de jeu
```
Temps joué : 0d  0h  0m
```

### Statistiques de session (grille 2×2)

| Statistique | Valeur |
|-------------|--------|
| **Sessions Played** | 0 |
| **Top Hand** | - |
| **Hands Played** | 0 |
| **Preferred Stakes** | - |

> *Note : Toutes les stats sont à zéro, indiquant un compte nouveau ou sans historique de jeu.*

### Section – Splash the Pot
- Titre : **Splash the pot**
- Statut : *"Splash is now live"*
- Illustration : coffre au trésor avec pièces dorées

---

## Caractéristiques Visuelles et UX

- **Thème** : Dark mode (fond noir/gris très foncé)
- **Couleurs principales** : Rouge `#CC0000`, Or/Jaune pour les icônes, Blanc pour le texte
- **Langue** : Anglais (`EN` sélectionnable en haut à gauche)
- **Plateforme** : Application desktop Windows (boutons Réduire/Agrandir/Fermer visibles)
- **Style général** : Interface riche, dense en informations, typique des plateformes de poker en ligne crypto

---

## Résumé des Sections

```
┌─────────────────────────────────────────────────────────┐
│  Logo  │  2562 Online  │  Poker | Casino | Live | Sport │
├─────────────────────────────────────────────────────────┤
│ 🏠 Cash Games │ Short Deck │ All-In │ Bomb │ Tournaments │
├────────────────────────────┬────────────────────────────┤
│                            │                            │
│  Bannière COIN REWARDS     │  GAME STATS                │
│                            │  Cash | Tournament         │
│  Skill Score Board         │  0d 0h 0m                  │
│                            │  Sessions: 0               │
│  [Cash] [Tournaments]      │  Hands: 0                  │
│  [All-In Fold] [Practice]  │                            │
│                            │  Splash the Pot            │
│  My Transactions           │                            │
│  PokerIntel                │                            │
└────────────────────────────┴────────────────────────────┘
```