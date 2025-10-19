"use client";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  login,
  logout,
  loggedInUserDisplayName,
  useAuthentication,
  loggedInUserID,
} from "../../authService";
import Modal from "./items/Modal";
import { newUser } from "../../databaseService";
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
import { db } from "../../firebaseConfig";

// Navbar Component
export function Navbar() {
  let user = useAuthentication();
  const [openSignUp, setOpenSignUp] = useState(false);

  async function handleLogin() {
    await login();
    const userID = loggedInUserID();

    if (userID != undefined) {
      const docRef = doc(db, "users", userID);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        setOpenSignUp(true);
      }
    }
  }

  return (
    <nav className="flex items-center justify-between gap-4 p-4 bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <Link href="/">
        <div className="text-2xl font-bold text-blue-600">Spot Share</div>
      </Link>

      <div className="flex-1 max-w-xl mx-4">
        <label htmlFor="search" className="sr-only">
          Search parking spots
        </label>
        <input
          id="search"
          type="search"
          placeholder="Search for parking spots..."
          className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          aria-label="Search parking spots"
        />
      </div>
      {!user ? (
        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2 text-blue-600 font-semibold rounded-md hover:bg-blue-50 transition"
            onClick={() => handleLogin()}
          >
            Login/Sign Up
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2 text-blue-600 font-semibold rounded-md hover:bg-blue-50 transition"
            onClick={() => logout()}
          >
            Logout
          </button>
        </div>
      )}

      <SignUpModal open={openSignUp} onClose={() => setOpenSignUp(false)} />
    </nav>
  );
}

type ModalProps = { open: boolean; onClose: () => void };
const SignUpModal: React.FC<ModalProps> = ({ open, onClose }: ModalProps) => {
  const [first_name, setfirstName] = useState("");
  const [last_name, setlastName] = useState("");
  const [color, setColor] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [plate, setPlate] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [vehicleError, setVehicleError] = useState<string | null>(null);

  async function testLogin() {
    const userID = loggedInUserID();

    if (userID != undefined) {
      const docRef = doc(db, "users", userID);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        logout();
      }
    }
  }

  async function checkModelExists(make: string, model: string, year: number) {
    const url = `/api/model-exists?make=${encodeURIComponent(
      make.trim()
    )}&model=${encodeURIComponent(model.trim())}&year=${year}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Model check failed: ${res.status}`);
    const data = await res.json();
    return Boolean(data.exists);
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setVehicleError(null);

      if (year === "" || Number.isNaN(Number(year))) {
        setVehicleError("Please enter a valid model year.");
        return;
      }

      setSubmitting(true);
      try {
        const exists = await checkModelExists(make, model, Number(year));
        if (!exists) {
          setVehicleError(
            "That make/model/year combo wasn't found. Please double-check."
          );
          setSubmitting(false);
          return;
        }

        await newUser({
          first_name,
          last_name,
          color,
          make,
          model,
          plate,
          year: Number(year),
        });

        setSubmitting(false);
        onClose();
      } catch (err) {
        console.error(err);
        setVehicleError(
          "We couldn't verify the vehicle right now. Please try again."
        );
        setSubmitting(false);
      }
    },
    [first_name, last_name, color, make, model, plate, year, onClose]
  );

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        testLogin();
      }}
      title="Sign Up"
    >
      <form onSubmit={handleSubmit}>
        <div className="p-4">
          <div>
            First Name:{" "}
            <input
              type="text"
              onChange={(e) => setfirstName(e.target.value)}
            ></input>
          </div>
          <div>
            Last Name:{" "}
            <input
              type="text"
              onChange={(e) => setlastName(e.target.value)}
            ></input>
          </div>
          <div>
            Car Make:{" "}
            <input
              type="text"
              onChange={(e) => setMake(e.target.value)}
            ></input>
          </div>
          <div>
            Car Model:{" "}
            <input
              type="text"
              onChange={(e) => setModel(e.target.value)}
            ></input>
          </div>
          <div>
            Color:{" "}
            <input
              type="text"
              onChange={(e) => setColor(e.target.value)}
            ></input>
          </div>
          <div>
            Plate Name:{" "}
            <input
              type="text"
              onChange={(e) => setPlate(e.target.value)}
            ></input>
          </div>
          <div>Payments: tf??</div>

          <button
            disabled={submitting}
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </Modal>
  );
};
