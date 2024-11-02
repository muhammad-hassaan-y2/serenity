import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-cyan-900/50 backdrop-blur-md border-t border-cyan-500/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-4 text-cyan-300">AI Study Buddy</h3>
            <p className="text-cyan-100">Empowering students with AI-driven learning solutions.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-cyan-300">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-cyan-100 hover:text-cyan-300 transition duration-300">About Us</a></li>
              <li><a href="#" className="text-cyan-100 hover:text-cyan-300 transition duration-300">Features</a></li>
              <li><a href="#" className="text-cyan-100 hover:text-cyan-300 transition duration-300">Pricing</a></li>
              <li><a href="#" className="text-cyan-100 hover:text-cyan-300 transition duration-300">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-cyan-300">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-cyan-100 hover:text-cyan-300 transition duration-300">Blog</a></li>
              <li><a href="#" className="text-cyan-100 hover:text-cyan-300 transition duration-300">Tutorials</a></li>
              <li><a href="#" className="text-cyan-100 hover:text-cyan-300 transition duration-300">FAQs</a></li>
              <li><a href="#" className="text-cyan-100 hover:text-cyan-300 transition duration-300">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-cyan-300">Connect With Us</h4>
            <div  className="flex space-x-4">
              <a href="#" className="text-cyan-100 hover:text-cyan-300 transition duration-300"><FaTwitter size={24} /></a>
              <a href="#" className="text-cyan-100 hover:text-cyan-300 transition duration-300"><FaFacebook size={24} /></a>
              <a href="#" className="text-cyan-100 hover:text-cyan-300 transition duration-300"><FaInstagram size={24} /></a>
              <a href="#" className="text-cyan-100 hover:text-cyan-300 transition duration-300"><FaLinkedin size={24} /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-cyan-500/30 text-center text-cyan-100">
          <p>&copy; 2024 AI Study Buddy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}