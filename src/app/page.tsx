// app/page.tsx
"use client";

import { useState } from "react";
import AuthModal from "@/components/AuthModal"; // Import the AuthModal component
import AuthModel from "@/components/AuthModal";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="">

      <AuthModel />
      <h1 className="text-4xl font-bold mb-6">Welcome to the </h1>

      {/* Login and Sign Up Buttons */}
       
    </div>
  );
}
