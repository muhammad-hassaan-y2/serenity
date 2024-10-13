'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthModel() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Handle sending OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to send OTP.');
      } else {
        setOtpSent(true); // Show OTP input field
      }
    } catch (error) {
      setError('An error occurred while sending OTP.');
    }
  };

  // Handle OTP verification and sign-up
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, password }),
    });

    if (res.ok) {
      // Auto-login after successful sign-up
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/dashboard', // Redirect to dashboard
      });

      if (!result?.error) {
        setIsOpen(false); // Close the modal
        router.push('/dashboard');
      } else {
        setError(result.error || 'Failed to sign in after OTP verification.');
      }
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to verify OTP.');
    }
  };

  // Handle Sign-In (for existing users)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/dashboard', // Redirect to dashboard after login
    });

    if (!result?.error) {
      setIsOpen(false); // Close the modal
      router.push('/dashboard');
    } else {
      setError(result.error || 'Failed to sign in.');
    }
  };

  // Handle Google Sign-In
  const signInWithGoogle = () => {
    signIn('google', {
      callbackUrl: '/dashboard', // Redirect to dashboard after Google sign-in
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              setIsSignUp(true);
              setIsOpen(true);
              setOtpSent(false);
            }}
            className="bg-white text-purple-800 font-bold text-lg hover:bg-purple-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Sign Up
          </Button>
        </DialogTrigger>
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              setIsSignUp(false);
              setIsOpen(true);
            }}
            className="bg-transparent border-2 border-white text-white font-bold text-lg hover:bg-white hover:text-purple-800 ml-4 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Login
          </Button>
        </DialogTrigger>

        <AnimatePresence>
          {isOpen && (
            <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-2xl p-0 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold text-purple-800 mb-2">
                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                  </DialogTitle>
                </DialogHeader>
                {error && (
                  <Alert className="bg-red-100 text-red-600 border-red-300 my-2">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={isSignUp ? (otpSent ? handleVerifyOtp : handleSendOtp) : handleSignIn} className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-semibold text-lg">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-gray-100 text-gray-800 placeholder-gray-500 border-2 border-purple-300 focus:border-purple-500 focus:ring-purple-500 text-lg py-3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-semibold text-lg">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-gray-100 text-gray-800 placeholder-gray-500 border-2 border-purple-300 focus:border-purple-500 focus:ring-purple-500 text-lg py-3"
                    />
                  </div>

                  <AnimatePresence>
                    {isSignUp && otpSent && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="space-y-2">
                          <Label htmlFor="otp" className="text-gray-700 font-semibold text-lg">OTP</Label>
                          <Input
                            id="otp"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="bg-gray-100 text-gray-800 placeholder-gray-500 border-2 border-purple-300 focus:border-purple-500 focus:ring-purple-500 text-lg py-3"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {isSignUp && otpSent && (
                    <Alert className="bg-purple-100 text-purple-800 border-purple-300">
                      <AlertDescription className="font-semibold">
                        An OTP has been sent to your email. Please check your inbox and enter the OTP above.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-purple-600 text-white text-xl font-bold py-3 hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {isSignUp ? (otpSent ? 'Verify OTP & Sign Up' : 'Send OTP') : 'Login'}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-white text-gray-800 border-2 border-gray-300 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-md text-lg font-semibold py-3"
                  onClick={signInWithGoogle}
                >
                  <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                  </svg>
                  Sign in with Google
                </Button>

                <Button
                  variant="link"
                  className="w-full text-purple-600 hover:text-purple-800 mt-4 text-lg font-semibold"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setOtpSent(false);
                  }}
                >
                  {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                </Button>
              </motion.div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>
    </div>
  );
}
