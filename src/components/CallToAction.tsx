import { Button } from '@/components/ui/button'

interface CTAProps {
  onOpenAuth: (isSignUp: boolean) => void
}

export default function CallToAction({ onOpenAuth }: CTAProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-600 to-blue-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">Ready to Transform Your Learning Experience?</h2>
        <p className="text-xl mb-8 text-cyan-100">Join thousands of students who are already benefiting from AI-powered study assistance.</p>
        <Button
          onClick={() => onOpenAuth(true)}
          className="bg-white text-blue-600 hover:bg-cyan-100 text-lg px-8 py-3 rounded-full font-semibold transition duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
        >
          Get Started for Free
        </Button>
      </div>
    </section>
  )
}