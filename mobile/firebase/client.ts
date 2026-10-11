import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

declare const process: {
  env: {
    EXPO_PUBLIC_FIREBASE_API_KEY?: string;
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN?: string;
    EXPO_PUBLIC_FIREBASE_PROJECT_ID?: string;
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET?: string;
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string;
    EXPO_PUBLIC_FIREBASE_APP_ID?: string;
    EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID?: string;
  };
};

const readRequiredEnv = (value: string | undefined, name: string) => {
  if (!value) {
    throw new Error(`Missing required Firebase environment variable: ${name}`);
  }

  return value;
};

const firebaseConfig = {
  apiKey: readRequiredEnv(process.env.EXPO_PUBLIC_FIREBASE_API_KEY, 'EXPO_PUBLIC_FIREBASE_API_KEY'),
  authDomain: readRequiredEnv(process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN, 'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: readRequiredEnv(process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID, 'EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: readRequiredEnv(process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET, 'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: readRequiredEnv(process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, 'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: readRequiredEnv(process.env.EXPO_PUBLIC_FIREBASE_APP_ID, 'EXPO_PUBLIC_FIREBASE_APP_ID'),
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const firestore = getFirestore(firebaseApp);
