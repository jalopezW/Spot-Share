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
  const [plate, setPlate] = useState("");

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
  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        testLogin();
      }}
      title="Sign Up"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault(); // <-- Stop the page reload
          newUser({
            first_name,
            last_name,
            color,
            make,
            model,
            plate,
          });
          onClose();
        }}
      >
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
            disabled={
              first_name == "" &&
              last_name == "" &&
              color == "" &&
              make == "" &&
              model == "" &&
              plate == ""
            }
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
