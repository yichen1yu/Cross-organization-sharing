import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAdB2MfjlqaLQpMl9eHOBUg1Div-gTPbP8',
  authDomain: 'annotation-yiyu.firebaseapp.com',
  projectId: 'annotation-yiyu',
  storageBucket: 'annotation-yiyu.firebasestorage.app',
  messagingSenderId: '590176683641',
  appId: '1:590176683641:web:4150c3d987d4ff902d76a8'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
