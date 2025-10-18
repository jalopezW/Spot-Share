import { useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { User } from "firebase/auth";

export function login() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export function logout() {
  return signOut(auth);
}

export function loggedInUserDisplayName() {
  if (auth.currentUser != null) {
    return auth.currentUser.displayName;
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
