"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import {
  login,
  logout,
  useAuthentication,
  loggedInUserID,
} from "../../authService";
import Modal from "./items/Modal";
import { newUser } from "../../databaseService";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  LogIn,
  LogOut,
  Search,
  Car,
  Palette,
  BadgeCheck,
  User,
} from "lucide-react";
import { carBrands } from "../../carBrands";
import { useAuth } from "./contexts/AuthContext";

/* -----------------------------
   Navbar
----------------------------- */
export function Navbar() {
  const user = useAuthentication();
  const [openSignUp, setOpenSignUp] = useState(false);
  const [search, setSearch] = useState("");

  async function handleLogin() {
    await login();
    const userID = loggedInUserID();
    if (userID) {
      const docRef = doc(db, "users", userID);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) setOpenSignUp(true);
    }
  }

  async function handleSignUp() {
    const userID = loggedInUserID();
    if (userID) {
      const docRef = doc(db, "users", userID);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        logout();
      }
    }
    setOpenSignUp(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await handleSignUp();
      } catch (err) {}
    };

    fetchData();
  }, []);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Brand */}
        <Link href="/" className="group inline-flex items-center gap-2">
          <img src={"/SpotShare.png"} className="rounded-xl h-10 w-10" />

          <span className="text-xl font-bold tracking-tight text-slate-900">
            Spot <span className="text-blue-600">Share</span>
          </span>
        </Link>

        {/* Search (desktop) */}
        <div className="hidden flex-1 sm:block">
          <label htmlFor="search" className="sr-only">
            Search parking spots
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for parking spots…"
              className="w-full rounded-full border border-slate-200 bg-white px-9 py-2 text-slate-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Auth */}
        {!user ? (
          <button
            onClick={handleLogin}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-100 hover:shadow"
          >
            <LogIn className="h-4 w-4" />
            Login / Sign Up
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => logout()}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile search */}
      <div className="sm:hidden px-4 pb-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for parking spots…"
            className="w-full rounded-full border border-slate-200 bg-white px-9 py-2 text-slate-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      <SignUpModal open={openSignUp} onClose={() => handleSignUp()} />
    </nav>
  );
}

/* -----------------------------
   Sign Up Modal
----------------------------- */
type ModalProps = { open: boolean; onClose: () => void };

const SignUpModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const [first_name, setfirstName] = useState("");
  const [last_name, setlastName] = useState("");
  const [color, setColor] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [plate, setPlate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function testLogin() {
    const userID = loggedInUserID();
    if (userID) {
      const docRef = doc(db, "users", userID);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) logout();
    }
  }

  const allValid =
    first_name.trim() &&
    last_name.trim() &&
    make.trim() &&
    model.trim() &&
    color.trim() &&
    plate.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid || submitting) return;

    try {
      setSubmitting(true);
      await newUser({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        color: color.trim(),
        make: make.trim(),
        model: model.trim(),
        plate: plate.trim().toUpperCase(),
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        testLogin();
      }}
      title=""
    >
      <div className="max-h-[90vh] overflow-y-auto space-y-6 p-1 sm:p-2">
        {/* Header */}
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Create your Spot Share profile
          </h2>
          <p className="text-sm text-slate-500">
            Help buyers spot you quickly at meet-up.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="rounded-t-2xl bg-gradient-to-r from-blue-600 to-indigo-500 p-3 text-white">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5" />
              <span className="font-semibold">Your Info</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            {/* Name */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <LabeledInput
                label="First name"
                value={first_name}
                onChange={setfirstName}
                placeholder="Josh"
                autoComplete="given-name"
                icon={<User className="h-4 w-4" />}
                required
              />
              <LabeledInput
                label="Last name"
                value={last_name}
                onChange={setlastName}
                placeholder="Miller"
                autoComplete="family-name"
                icon={<User className="h-4 w-4" />}
                required
              />
            </div>

            <div className="my-5 h-px w-full bg-slate-200" />

            {/* Vehicle */}
            <div className="mb-3 flex items-center gap-2 text-slate-800">
              <Car className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-semibold">Vehicle details</h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <LabeledDropdown
                label="Make"
                onChange={setMake}
                icon={<Car className="h-4 w-4" />}
                dropdownOptions={Object.keys(carBrands)}
                required
              />
              <LabeledDropdown
                label="Make"
                onChange={setModel}
                icon={<Car className="h-4 w-4" />}
                dropdownOptions={carBrands[make]}
                disabled={make == ""}
                required
              />
              <LabeledInput
                label="Color"
                value={color}
                onChange={setColor}
                placeholder="Blue"
                icon={<Palette className="h-4 w-4" />}
                required
              />
              <LabeledInput
                label="License plate"
                value={plate}
                onChange={setPlate}
                placeholder="8ABC123"
                icon={<BadgeCheck className="h-4 w-4" />}
                // helper="We’ll only show the last 3 characters to other users."
                required
              />
            </div>

            {/* Submit */}
            <div className="mt-6 space-y-3">
              <button
                type="submit"
                disabled={!allValid || submitting}
                className={`w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition
                ${
                  !allValid || submitting
                    ? "opacity-60"
                    : "hover:brightness-105 active:translate-y-[1px]"
                }`}
              >
                {submitting ? "Creating profile…" : "Save and continue"}
              </button>
              <p className="text-center text-xs text-slate-500">
                By continuing you agree to our Terms &amp; Privacy Policy.
              </p>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

/* -----------------------------
   Small input component
----------------------------- */
function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
  icon,
  helper,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  icon?: React.ReactNode;
  helper?: string;
}) {
  const id = React.useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
            icon ? "pl-9" : ""
          }`}
        />
      </div>
      {helper && <p className="text-xs text-slate-500">{helper}</p>}
    </div>
  );
}
function LabeledDropdown({
  label,
  onChange,
  dropdownOptions,
  required,
  icon,
  disabled,
}: {
  label: string;
  onChange: (v: string) => void;
  dropdownOptions: string[];
  required?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
}) {
  const id = React.useId();
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on input
  useEffect(() => {
    if (inputValue.length > 0 && dropdownOptions) {
      const filtered = dropdownOptions.filter((option) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(dropdownOptions);
    }
  }, [inputValue, dropdownOptions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    setSelectedOption("");
    onChange(value);
    setIsOpen(true); // Open dropdown when typing
  };

  const handleInputClick = () => {
    setIsOpen(!isOpen); // Toggle dropdown on input click
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    setSelectedOption(option);
    onChange(option);
    setIsOpen(false); // Close dropdown after selection
  };

  useEffect(() => {
    if (disabled) {
      setInputValue("");
      setSelectedOption("");
      setIsOpen(false);
    }
  }, [disabled]);

  return (
    <div ref={dropdownRef} className="relative">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}

        <input
          id={id}
          disabled={disabled}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder="Type to search..."
          required={required}
          className={`w-full rounded-lg border border-slate-300 px-4 py-2 pr-10 text-sm 
            focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
            ${icon ? "pl-10" : ""}`}
        />

        {/* Dropdown arrow indicator */}
        <span
          onClick={handleInputClick}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer select-none text-slate-400 transition-transform duration-200"
          style={{
            transform: `translateY(-50%) rotate(${isOpen ? "180deg" : "0deg"})`,
          }}
        >
          ▼
        </span>
      </div>

      {/* Dropdown menu with expand/contract animation */}
      {isOpen && filteredOptions.length > 0 && (
        <ul
          className="absolute z-50 mt-1 w-full overflow-y-auto rounded-lg border border-slate-300 
            bg-white shadow-lg animate-slideDown"
          style={{
            maxHeight: "200px",
            listStyleType: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-slate-100
                ${selectedOption === option ? "bg-slate-200" : ""}`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}

      {selectedOption && (
        <p className="mt-2 text-sm text-slate-600">
          <strong>Selected:</strong> {selectedOption}
        </p>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
