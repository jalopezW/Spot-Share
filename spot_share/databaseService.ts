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
        lat: 0,
        long: 0,
        rating: 5,
      });
    }
  }
}

export async function getFirstName(userID: string | undefined) {
  if (userID != undefined) {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().first_name;
    }
  }
  return "N/A";
}

export async function getLastName(userID: string | undefined) {
  if (userID != undefined) {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().last_name;
    }
  }
  return "N/A";
}

export async function getMake(userID: string | undefined) {
  if (userID != undefined) {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().make;
    }
  }
  return "N/A";
}

export async function getModel(userID: string | undefined) {
  if (userID != undefined) {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().model;
    }
  }
  return "N/A";
}

export async function getColor(userID: string | undefined) {
  if (userID != undefined) {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().make;
    }
  }
  return "N/A";
}

export async function getPlate(userID: string | undefined) {
  if (userID != undefined) {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().plate;
    }
  }
  return "N/A";
}

export async function getCoords(userID: string | undefined) {
  if (userID != undefined) {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const lat = docSnap.data().lat;
      const long = docSnap.data().long;
      return { lat, long };
    }
  }
  return { lat: 0, long: 0 };
}

export async function getUserInfo(userID: string | undefined) {
  if (userID != undefined) {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...docSnap.data() };
    }
  }
}

export async function updateLocation(
  userID: string | undefined,
  lat: number,
  long: number
) {
  if (userID != undefined) {
    const docRef = doc(db, "users", userID);

    await updateDoc(docRef, {
      lat,
      long,
    });
  }
}

export async function updateRating(userID: string | undefined, rating: number) {
  if (userID != undefined) {
    const docRef = doc(db, "users", userID);

    await updateDoc(docRef, {
      rating,
    });
  }
}

export async function sellSpot(spot: {
  lat: number;
  long: number;
  price: number;
  time: Date;
}) {
  const userID = loggedInUserID();
  if (userID != undefined) {
    await setDoc(doc(db, "spots"), {
      Lat: spot.lat,
      Long: spot.long,
      Price: spot.price,
      Time: spot.time,
      userID: userID,
    });
  }
}

export async function getSpots() {
  const spotRef = collection(db, "spots");
  const userID = loggedInUserID();
  //   const { userLat, userLong } = await getCoords(userID);
  const q = query(spotRef, orderBy("Rating", "desc"));

  const querySnapshot = await getDocs(q);

  // ADD SORT BY LONG LAT
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

function distance(Lat1: number, Lat2: number, Long1: number, Long2: number) {
  const dlat = Lat2 - Lat1;
  const dlong = Long2 - Long1;
  return Math.sqrt(dlat * dlat + dlong * dlong);
}
