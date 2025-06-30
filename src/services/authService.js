import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  export const signup = (email,password) => createUserWithEmailAndPassword(auth, email, password);
  export const login  = (email,password) => signInWithEmailAndPassword(auth, email, password);
  export const logout = () => signOut(auth);
  export const onAuthChange = (callback) => onAuthStateChanged(auth,callback);

  export const saveChat = async (uid, chats) => {
    await setDoc(doc(db,"chats",uid), { messages: chats});
  };

  export const loadChat = async (uid) => {
    const docSnap = await getDoc(doc(db,"chats",uid));
    return docSnap.exists() ? docSnap.data().messages : [];
  };