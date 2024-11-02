'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

interface NavbarProps {
  onOpenAuth: (isSignUp: boolean) => void
}

export default function Navbar({ onOpenAuth }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-transparent backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-cyan-300">AI Study Buddy</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button
              onClick={() => onOpenAuth(false)}
              className="bg-cyan-600 text-white hover:bg-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/50"
            >
              Login
            </Button>
            <Button
              onClick={() => onOpenAuth(true)}
              className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/50"
            >
              Sign Up
            </Button>
          </div>
          <div className="md:hidden">
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              variant="ghost"
              className="text-white"
            >
              <Menu />
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Button
              onClick={() => onOpenAuth(false)}
              className="w-full bg-cyan-600 text-white hover:bg-cyan-700 transition-all duration-300"
            >
              Login
            </Button>
            <Button
              onClick={() => onOpenAuth(true)}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
            >
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}