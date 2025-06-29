import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDA1TKOBNqYp_q-urSKKXsobVnpepVTJHY",
    authDomain: "ai-tutor-6e9b7.firebaseapp.com",
    projectId: "ai-tutor-6e9b7",
    storageBucket: "ai-tutor-6e9b7.firebasestorage.app",
    messagingSenderId: "917559890202",
    appId: "1:917559890202:web:e9a50efd801a0f36555ca3"
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