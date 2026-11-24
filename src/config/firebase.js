
import { initializeApp, getApp, getApps } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyAzH1uvRvQjHO-rlex-IpnKSTqsYUEKRy0",
  authDomain: 'ecopoints-bb12b.firebaseapp.com',
  projectId: 'ecopoints-bb12b',
  storageBucket: 'ecopoints-bb12b.firebasestorage.app',
  messagingSenderId: '642265746114',
  appId: '1:642265746114:web:5e86cdd71df8f4ee75895b',
};

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

let auth;

if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    if (error.code !== 'auth/already-initialized') {
      throw error;
    }

    auth = getAuth(app);
  }
}

const db = getFirestore(app);

export { app, auth, db };
