'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Testimonials from '@/components/Testimonials'
import CallToAction from '@/components/CallToAction'
import Footer from '@/components/Footer'

const AuthModel = dynamic(() => import('@/components/AuthModal'), { ssr: false })

export default function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)

  const handleOpenAuth = (signUp: boolean) => {
    setIsSignUp(signUp)
    setIsAuthOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 to-blue-900 text-white">
      <Navbar onOpenAuth={handleOpenAuth} />
      <Hero onOpenAuth={handleOpenAuth} />
      <Features />
      <Testimonials />
      <CallToAction onOpenAuth={handleOpenAuth} />
      <Footer />

      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-cyan-900 to-blue-900 text-white border border-cyan-500/30">
          <DialogHeader>
            <DialogTitle className="text-cyan-300">{isSignUp ? 'Create Account' : 'Welcome Back'}</DialogTitle>
          </DialogHeader>
          <AuthModel isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
        </DialogContent>
      </Dialog>
    </div>
  )
}