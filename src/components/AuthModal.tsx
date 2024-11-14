"use client"
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isSignUp: boolean;
  setIsSignUp: (isSignUp: boolean) => void;
}

export default function AuthModal({ isSignUp, setIsSignUp }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle sending OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

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
        setOtpSent(true);
      }
    } catch (err) {
      setError('An error occurred while sending OTP.');
      console.error('OTP send error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification and sign-up
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password }),
      });

      if (res.ok) {
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
          callbackUrl: '/dashboard',
        });

        if (!result?.error) {
          router.push('/dashboard');
        } else {
          setError(result.error || 'Failed to sign in after OTP verification.');
        }
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to verify OTP.');
      }
    } catch (err) {
      setError('An error occurred during OTP verification.');
      console.error('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Rest of the component remains the same...
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/dashboard',
    });

    if (!result?.error) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Failed to sign in.');
    }
    setLoading(false);
  };

  const signInWithGoogle = () => {
    signIn('google', {
      callbackUrl: '/dashboard',
    });
  };

  return (
    <div className="p-6 bg-gradient-to-br from-cyan-900 to-blue-900 rounded-lg">
      <AnimatePresence>
        {error && (
          <Alert className="bg-red-100 text-red-600 border-red-300 my-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </AnimatePresence>

      <form onSubmit={isSignUp ? (otpSent ? handleVerifyOtp : handleSendOtp) : handleSignIn} className="space-y-4 mt-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-cyan-300 font-semibold text-lg">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-cyan-800/50 text-white placeholder-cyan-400 border-2 border-cyan-500 focus:border-cyan-400 focus:ring-cyan-400 text-lg py-3"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-cyan-300 font-semibold text-lg">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-cyan-800/50 text-white placeholder-cyan-400 border-2 border-cyan-500 focus:border-cyan-400 focus:ring-cyan-400 text-lg py-3"
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
                <Label htmlFor="otp" className="text-cyan-300 font-semibold text-lg">OTP</Label>
                <Input
                  id="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="bg-cyan-800/50 text-white placeholder-cyan-400 border-2 border-cyan-500 focus:border-cyan-400 focus:ring-cyan-400 text-lg py-3"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isSignUp && otpSent && (
          <Alert className="bg-blue-900/50 text-cyan-300 border-cyan-500">
            <AlertDescription className="font-semibold">
              An OTP has been sent to your email. Please check your inbox and enter the OTP above.
            </AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xl font-bold py-3 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          disabled={loading}
        >
          {loading ? 'Processing...' : isSignUp ? (otpSent ? 'Verify OTP & Sign Up' : 'Send OTP') : 'Login'}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-cyan-500/30" />
        </div>
        <div className="relative flex justify-center text-sm uppercase">
          <span className="bg-cyan-900 px-2 text-cyan-300">Or continue with</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full bg-white text-cyan-900 border-2 border-cyan-500 hover:bg-cyan-100 transition-all duration-300 transform hover:scale-105"
        onClick={signInWithGoogle}
        disabled={loading}
      >
        Google
      </Button>

      <div className="mt-4 text-center text-sm text-cyan-300">
        <p className="font-semibold">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            onClick={() => setIsSignUp(!isSignUp)}
            className="cursor-pointer text-cyan-300 transition-colors"
          >
            {isSignUp ? 'Login here' : 'Sign up here'}
          </span>
        </p>
      </div>
    </div>
  );
}