// app/page.tsx
"use client";

import { useState } from "react";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="">


      <h1 className="text-4xl font-bold mb-6">Welcome to the Quiz App</h1>

      {/* Login and Sign Up Buttons */}
       
    </div>
  );
}
