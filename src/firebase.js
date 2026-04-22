import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCk3vXRE90YGchbKrdBkZyKBdqRfUZXmKM",
  authDomain: "ai-powered-tool-545d9.firebaseapp.com",
  projectId: "ai-powered-tool-545d9",
  storageBucket: "ai-powered-tool-545d9.firebasestorage.app",
  messagingSenderId: "282985551445",
  appId: "1:282985551445:web:2adfd037f09615cad766dc",
  measurementId: "G-ZJ83STMJ9B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;