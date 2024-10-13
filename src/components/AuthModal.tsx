"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthModal({ closeModal }: { closeModal: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false); // Track if OTP is sent
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Used for redirecting after successful login/signup

  // Handle sending OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Failed to send OTP.");
      } else {
        setIsOtpSent(true); // Show OTP input field
      }
    } catch (error) {
      setError("An error occurred while sending OTP.");
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, password, name }),
    });

    if (res.ok) {
      // Auto-login after successful sign-up
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/dashboard", // Redirect to dashboard
      });

      if (!result?.error) {
        closeModal();
        router.push("/dashboard"); // Ensure client-side redirect
      } else {
        setError(result.error || "Failed to sign in after OTP verification.");
      }
    } else {
      const data = await res.json();
      setError(data.error || "Failed to verify OTP.");
    }
  };

  // Handle Sign-In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/dashboard", // Redirect to dashboard after login
    });

    if (!result?.error) {
      closeModal();
      router.push("/dashboard"); // Ensure client-side redirect
    } else {
      setError(result.error || "Failed to sign in.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">{isSignUp ? "Sign Up" : "Sign In"}</h2>

        {error && <p className="text-red-500">{error}</p>}

        {/* Google Sign-In Button */}
        <button
          className="w-full bg-blue-500 text-white px-4 py-2 rounded mb-4"
          onClick={() =>
            signIn("google", {
              callbackUrl: "/dashboard", // Redirect to dashboard after Google sign-in
            })
          }
        >
          {isSignUp ? "Sign Up with Google" : "Sign In with Google"}
        </button>

        {!isOtpSent ? (
          <form onSubmit={isSignUp ? handleSendOtp : handleSignIn}>
            {isSignUp && (
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full border p-2 my-2"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full border p-2 my-2"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full border p-2 my-2"
              required
            />
            <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded">
              {isSignUp ? "Send OTP" : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="block w-full border p-2 my-2"
              required
            />
            <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded">
              Verify OTP
            </button>
          </form>
        )}

        <button onClick={() => setIsSignUp(!isSignUp)} className="mt-4 text-blue-500">
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </button>

        <button onClick={closeModal} className="w-full mt-4 bg-gray-300 text-black px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
}
