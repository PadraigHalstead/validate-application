import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyABp6A76inP27spAbYdY3Ea3q4Jmr_aGQU',
  authDomain: 'mule-system.firebaseapp.com',
  databaseURL:
    'https://mule-system-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'mule-system',
  storageBucket: 'mule-system.appspot.com',
  messagingSenderId: '691979430300',
  appId: '1:691979430300:web:c736bda7e72b2ef8ec8059',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
