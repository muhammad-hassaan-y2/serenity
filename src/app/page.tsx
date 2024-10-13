// app/page.tsx
"use client";

import { useState } from "react";
import AuthModal from "@/components/AuthModal"; // Import the AuthModal component

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Mental Health Platform</h1>

      {/* Login and Sign Up Buttons */}
      <div className="space-x-4">
        <button onClick={openModal} className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
        <button onClick={openModal} className="bg-green-500 text-white px-4 py-2 rounded">
          Sign Up
        </button>
      </div>

      {/* Modal for Authentication */}
      {isModalOpen && <AuthModal closeModal={closeModal} />}
    </div>
  );
}
