# Profil Étudiant

Une app mobile React Native (Expo), faite à deux au cégep en avril 2026. On se connecte, on prend sa photo de profil avec la caméra, on enregistre un message vocal, et on choisit la couleur de son interface. Le profil est sauvegardé dans Firebase et sur le téléphone.

## Ce qu'on peut faire

- **Connexion** : un nom et un mot de passe, vérifiés contre le profil enregistré dans Firestore.
- **Profil** : le nom, la photo prise avec la caméra (ou une image par défaut) et la lecture du message vocal.
- **Caméra** : caméra avant ou arrière, flash, zoom et prise de photo. La photo devient l'image de profil.
- **Audio** : enregistrement, sauvegarde et réécoute d'un message vocal, avec le chemin du fichier affiché.
- **Réglages** : la couleur de fond des écrans principaux et le changement de mot de passe.
- **Permissions** : caméra et micro demandés au bon moment, avec un écran de repli si on les refuse.

## Technique

- **Expo SDK 54** et **React Native 0.81**, en TypeScript.
- **Expo Router** : des onglets (Profil, Caméra, Audio), et les Réglages accessibles seulement depuis le Profil.
- **Redux Toolkit** pour l'état partagé de l'étudiant (nom, mot de passe, photo, voix, couleur), gardé sur le téléphone avec **redux-persist** et AsyncStorage.
- **Firebase Firestore** pour sauvegarder les profils. Les clés sont dans un fichier `.env`, jamais dans le code.
- **expo-camera** et **expo-av** pour la caméra et l'audio.

```
mobile/
  app/            les écrans (Expo Router) : connexion, onglets, réglages
  components/     les composants partagés
  store/          le store Redux et la tranche de l'étudiant
  firebase/       la connexion à Firestore et la lecture / écriture des profils
  types/ utils/   les types et le hachage du mot de passe
  firestore.rules les règles de sécurité de Firestore
```

## Lancer le projet

Il faut Node.js et l'app **Expo Go** sur un téléphone (la caméra et le micro ne marchent pas dans un navigateur).

```bash
cd mobile
npm install
cp .env.example .env    # puis y mettre les clés de son projet Firebase
npx expo start
```

Ensuite, scanner le code QR avec Expo Go. Pour Firestore, publier les règles de `mobile/firestore.rules` dans la console Firebase (ou avec `firebase deploy --only firestore:rules`).
