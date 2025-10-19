// This service completely hides the data store from the rest of the app.
// No other part of the app knows how the data is stored. If anyone wants
// to read or write data, they have to go through this service.

import { db } from "./firebaseConfig";
import { loggedInUserDisplayName, loggedInUserID } from "./authService";
import {
  collection,
  getDoc,
  setDoc,
  doc,
  getDocs,
  query,
  orderBy,
  limit,
  increment,
  updateDoc,
} from "firebase/firestore";

export async function newUser(user: {
  first_name: string;
  last_name: string;
  color: string;
  make: string;
  model: string;
  plate: string;
}) {
  const userID = loggedInUserID();

  if (userID != undefined) {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(doc(db, "users", userID), {
        first_name: user.first_name,
        last_name: user.last_name,
        color: user.color,
        make: user.make,
        model: user.model,
        plate: user.plate,
      });
    }
  }
}

export async function getFirstName() {
  const userID = loggedInUserID();
  if (userID != undefined) {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().first_name;
    }
  }
  return "N/A";
}

export async function getLastName() {
  const userID = loggedInUserID();
  if (userID != undefined) {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().last_name;
    }
  }
  return "N/A";
}

export async function getMake() {
  const userID = loggedInUserID();
  if (userID != undefined) {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().make;
    }
  }
  return "N/A";
}

export async function getModel() {
  const userID = loggedInUserID();
  if (userID != undefined) {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().model;
    }
  }
  return "N/A";
}

export async function getColor() {
  const userID = loggedInUserID();
  if (userID != undefined) {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().make;
    }
  }
  return "N/A";
}

export async function getPlate() {
  const userID = loggedInUserID();
  if (userID != undefined) {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().plate;
    }
  }
  return "N/A";
}
