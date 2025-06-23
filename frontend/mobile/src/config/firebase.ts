// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAO9alkdc91ied_vzHHMkFyjqQ0iq1HH80",
  authDomain: "healthoracle-e8ca8.firebaseapp.com",
  projectId: "healthoracle-e8ca8",
  storageBucket: "healthoracle-e8ca8.appspot.com",
  messagingSenderId: "56188163377",
  appId: "1:56188163377:web:eda94bd00b81a351dc4c10",
  measurementId: "G-1660VQ0F5Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);
const storage = getStorage(app);

// Ensure auth is properly initialized
if (!auth) {
  console.error('Firebase Auth not initialized');
}

export { auth, db, storage };
export default app;