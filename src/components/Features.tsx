'use client'

import { motion } from 'framer-motion'
import { FaRobot, FaGraduationCap, FaChartLine, FaBrain, FaClock, FaUsers } from 'react-icons/fa'

const features = [
  { icon: <FaRobot className="text-4xl mb-4 text-cyan-400" />, title: "AI-Powered Learning", description: "Harness the power of artificial intelligence to optimize your study sessions and improve retention." },
  { icon: <FaGraduationCap className="text-4xl mb-4 text-cyan-400" />, title: "Personalized Curriculum", description: "Tailored study plans based on your learning style, goals, and current knowledge level." },
  { icon: <FaChartLine className="text-4xl mb-4 text-cyan-400" />, title: "Progress Tracking", description: "Visualize your improvement with detailed analytics and insights to stay motivated." },
  { icon: <FaBrain className="text-4xl mb-4 text-cyan-400" />, title: "Adaptive Learning", description: "Our AI adapts to your progress, focusing on areas that need more attention." },
  { icon: <FaClock className="text-4xl mb-4 text-cyan-400" />, title: "24/7 Assistance", description: "Get help anytime, anywhere with our AI-powered chat support and study resources." },
  { icon: <FaUsers className="text-4xl mb-4 text-cyan-400" />, title: "Collaborative Learning", description: "Connect with peers and form study groups to enhance your learning experience." },
]

export default function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-900/50 to-blue-900/50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-cyan-300">Why Choose AI Study Buddy?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-md border border-cyan-500/30"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {feature.icon}
              <h3 className="text-xl font-semibold mb-3 text-cyan-300">{feature.title}</h3>
              <p className="text-cyan-100">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}