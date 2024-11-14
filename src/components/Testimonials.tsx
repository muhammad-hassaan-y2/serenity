'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const testimonials = [
  { name: "Alex", role: "College Student", quote: "AI Study Buddy has revolutionized my study habits. I&apos;ve seen a significant improvement in my grades!", image: "/alex.png" },
  { name: "Sarah", role: "High School Senior", quote: "The personalized study plans have helped me prepare for my exams more efficiently than ever before.", image: "/sarah.png" },
  { name: "Michael", role: "Graduate Student", quote: "As a busy grad student, the 24/7 AI assistance has been invaluable for my research and coursework.", image: "/michael.png" },
]

export default function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 to-cyan-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-cyan-300">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white/10 p-6 rounded-xl shadow-xl backdrop-blur-md border border-cyan-500/30 flex flex-col items-center text-center"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={120}
                height={120}
                className="rounded-full mb-4 border-2 border-cyan-300"
              />
              <p className="text-cyan-100 mb-4 italic">&quot;{testimonial.quote}&quot;</p>
              <div className="font-semibold text-cyan-300">{testimonial.name}</div>
              <div className="text-sm text-cyan-400">{testimonial.role}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
