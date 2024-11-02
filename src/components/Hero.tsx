'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface HeroProps {
  onOpenAuth: (isSignUp: boolean) => void
}

export default function Hero({ onOpenAuth }: HeroProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Elevate Your Learning with AI
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-cyan-100">
              Unlock your full potential with personalized AI-powered study assistance for high school, college, and university students.
            </p>
            <Button
              onClick={() => onOpenAuth(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 text-lg px-8 py-3 rounded-full font-semibold transition duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              Start Your Journey
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <Image
              src="/hero.webp" // Replace with your actual image path
              alt="AI Study Buddy Interface"
              width={800}
              height={600}
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}