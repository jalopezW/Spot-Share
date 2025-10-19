import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

export async function login() {
  return await signInWithPopup(auth, new GoogleAuthProvider());
}

export function logout() {
  return signOut(auth);
}

export function loggedInUserDisplayName() {
  if (auth.currentUser != null) {
    return auth.currentUser.displayName;
  }
}

export function loggedInUserID() {
  if (auth.currentUser != null) {
    return auth.currentUser.uid;
  }
}

export function useAuthentication() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      user ? setUser(user) : setUser(null);
    });
  }, []);
  return user;
}
