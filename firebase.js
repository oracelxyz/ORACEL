// firebase.js
// ORACEL Admin Panel – Firebase Config
// Firebase SDK v10 (Modular)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* =========================
   FIREBASE CONFIG
========================= */
const firebaseConfig = {
  apiKey: "AIzaSyAALS_P2tanh2jrFxVE5hD034EBAuU37DA",
  authDomain: "oracel-46802.firebaseapp.com",
  projectId: "oracel-46802",
  storageBucket: "oracel-46802.firebasestorage.app",
  messagingSenderId: "695905619520",
  appId: "1:695905619520:web:f6b88182834fa1008799a5"
};

/* =========================
   INIT APP
========================= */
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/* =========================
   AUTH HELPERS
========================= */

// Admin Login
export const adminLogin = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Logout
export const adminLogout = () => {
  return signOut(auth);
};

// Check Auth State
export const listenAuth = (callback) => {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

/* =========================
   FIRESTORE HELPERS
========================= */

// USERS
export const getAllUsers = async () => {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// MISSIONS
export const createMission = async (data) => {
  return addDoc(collection(db, "missions"), {
    ...data,
    createdAt: serverTimestamp(),
    status: "active"
  });
};

export const getMissions = async () => {
  const q = query(
    collection(db, "missions"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// BADGES
export const createBadge = async (name, targetPoint) => {
  return addDoc(collection(db, "badges"), {
    name,
    targetPoint,
    createdAt: serverTimestamp()
  });
};

export const getBadges = async () => {
  const snap = await getDocs(collection(db, "badges"));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// SETTINGS
export const updateSetting = async (key, value) => {
  return setDoc(
    doc(db, "settings", key),
    { value, updatedAt: serverTimestamp() },
    { merge: true }
  );
};

export const getSetting = async (key) => {
  const snap = await getDoc(doc(db, "settings", key));
  return snap.exists() ? snap.data().value : null;
};

/* =========================
   REVENUE (PREMIUM)
========================= */

export const addRevenue = async (amountSOL) => {
  return addDoc(collection(db, "revenue"), {
    amount: amountSOL,
    createdAt: serverTimestamp()
  });
};

export const getRevenue = async () => {
  const snap = await getDocs(collection(db, "revenue"));
  let total = 0;
  snap.forEach(doc => {
    total += doc.data().amount || 0;
  });
  return total;
};

/* =========================
   UTIL
========================= */

export const isAdmin = async (uid) => {
  const snap = await getDoc(doc(db, "admins", uid));
  return snap.exists();
};