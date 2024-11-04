'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bell,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  Home,
  LogOut,
  MessageCircle,
  Settings,
  Target,
  Zap,
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import Chatbot from './Chatbot'
import DailyDiary from './DailyDairy'
import GoalTracking from './GoalTracking'
import AdaptiveStudyPath from './AdaptiveStudyPath'
import SettingsPanel from './SettingsPanel'

const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'chatbot', label: 'Chatbot', icon: MessageCircle },
  { id: 'diary', label: 'Daily Diary', icon: Calendar },
  { id: 'progress', label: 'Progress', icon: BarChart },
  { id: 'study', label: 'Study Path', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview')
    const [isMobile, setIsMobile] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [userData, setUserData] = useState({
      studyTime: 0,
      tasksCompleted: 0,
      quizzesTaken: 0,
      streak: 0,
      recentActivities: [],
      studyGoals: []
    })
  
    const { data: session } = useSession()
    
    useEffect(() => {
      const handleResize = () => {
        const mobile = window.innerWidth < 768
        setIsMobile(mobile)
        setSidebarOpen(!mobile)
      }
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [])
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/user-data')
          const data = await response.json()
          setUserData(data)
        } catch (error) {
          console.error('Failed to fetch user data:', error)
        }
      }
      fetchUserData()
    }, [])
  
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const handleLogout = async () => {
    useEffect(() => {
        const handleLogout = async () => {
          if (typeof window !== 'undefined') {
            const { useRouter } = await import('next/router')
            const router = useRouter()
            await signOut({ redirect: false })
            router.push('/')
          }
        }
        
        // Attach handleLogout function to the logout button here (or use it within the component directly)
      }, [])
  }

  return (
    <div className="flex h-screen bg-[#0c4a6e]">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {(sidebarOpen || !isMobile) && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: sidebarOpen ? 240 : 80, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`
              flex flex-col
              bg-gradient-to-b from-[#0c4a6e] to-[#0284c7]
              border-r border-[#22d3ee]/20
              ${isMobile ? 'absolute z-50 h-full' : 'relative'}
            `}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-8">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <BookOpen className="w-8 h-8 text-[#22d3ee]" />
              </motion.div>
              {sidebarOpen && (
                <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl font-bold bg-gradient-to-r from-[#22d3ee] to-white bg-clip-text text-transparent"
                >
                  AI Study Buddy
                </motion.h1>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4">
              {sidebarItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg
                    transition-colors duration-200
                    ${activeTab === item.id 
                      ? 'bg-[#22d3ee] text-[#0c4a6e]' 
                      : 'text-[#f0f9ff] hover:bg-[#22d3ee]/20'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-[#0c4a6e]' : 'text-[#22d3ee]'}`} />
                  {sidebarOpen && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </motion.button>
              ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-[#22d3ee]/20">
              <motion.div 
                whileHover={{ y: -2 }}
                className="flex items-center gap-3"
              >
                <Avatar className="w-10 h-10 border-2 border-[#22d3ee]">
                  <AvatarImage src={session?.user?.image || '/placeholder.svg'} />
                  <AvatarFallback className="bg-[#22d3ee] text-[#0c4a6e]">{session?.user?.name?.[0]}</AvatarFallback>
                </Avatar>
                {sidebarOpen && (
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#f0f9ff]">{session?.user?.name || 'User'}</p>
                    <p className="text-xs text-[#22d3ee]">Student</p>
                  </div>
                )}
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-[#22d3ee] hover:text-[#f0f9ff] hover:bg-[#22d3ee]/20"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>

            {/* Collapse button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="absolute top-1/2 -right-4 bg-[#22d3ee] text-[#0c4a6e] rounded-full shadow-lg"
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#0c4a6e] text-[#f0f9ff]">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleSidebar}
                  className="text-[#22d3ee]"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              )}
              <h1 className="text-2xl font-bold">{
                sidebarItems.find(item => item.id === activeTab)?.label
              }</h1>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              className="text-[#22d3ee] border-[#22d3ee] hover:bg-[#22d3ee]/20"
            >
              <Bell className="w-5 h-5" />
            </Button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {activeTab === 'overview' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AnimatedCard 
                      title="Study Time" 
                      value={`${userData.studyTime} min`}
                      icon={Clock} 
                      color="#22d3ee"
                      increase={`${Math.round(userData.studyTime / 60)} hours`}
                    />
                    <AnimatedCard 
                      title="Tasks Completed" 
                      value={userData.tasksCompleted}
                      icon={CheckCircle} 
                      color="#0284c7"
                    />
                    <AnimatedCard 
                      title="Quizzes Taken" 
                      value={userData.quizzesTaken} 
                      icon={Target} 
                      color="#0ea5e9"
                    />
                    <AnimatedCard 
                      title="Streak" 
                      value={`${userData.streak} days`}
                      icon={Zap} 
                      color="#38bdf8"
                    />
                  </div>
                </>
              )}
              {activeTab === 'chatbot' && <Chatbot />}
              {activeTab === 'diary' && <DailyDiary />}
              {activeTab === 'progress' && <GoalTracking />}
              {activeTab === 'study' && <AdaptiveStudyPath />}
              {activeTab === 'settings' && <SettingsPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}


function AnimatedCard({ title, value, icon: Icon, color, increase }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="bg-[#0284c7]/20 border-[#22d3ee]/20 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-sm font-medium text-[#f0f9ff]">{title}</CardTitle>
            <div className="p-2 rounded-lg bg-[#22d3ee]/20">
              <Icon className="w-4 h-4 text-[#22d3ee]" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-[#f0f9ff]">{value}</div>
            <div className="text-xs text-[#22d3ee]">
              +{increase} from last week
            </div>
          </div>
          <motion.div
            className="w-full h-1 bg-[#22d3ee]/20 mt-4 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </motion.div>
        
        </CardContent>
      </Card>
    </motion.div>
  )
}