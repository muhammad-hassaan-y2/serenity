"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { useChat } from 'ai/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Mic, MessageCircle, StopCircle, BookOpen, PenTool, Plus, Settings } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { AnimatePresence, motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

type ChatMode = 'study' | 'quiz';

interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  voiceEnabled: boolean;
}

interface StudyProfile {
  subjects: string[];
  gradeLevel: string;
  learningStyle: string;
  goals: string;
}

interface QuizProfile {
  subjects: string[];
  difficultyLevel: string;
  quizFormat: string;
  timePreference: string;
}

export default function EnhancedPersonalizedChatbot() {
  const [chatMode, setChatMode] = useState<ChatMode>('study')
  const [showCanvas, setShowCanvas] = useState(false)
  const [canvasContent, setCanvasContent] = useState<string>('')
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    theme: 'light',
    fontSize: 'medium',
    voiceEnabled: true,
  })
  const [chatHistory, setChatHistory] = useState<{ id: string; name: string }[]>([])
  const [currentChatId, setCurrentChatId] = useState<string>('default')
  const [studyProfile, setStudyProfile] = useState<StudyProfile>({
    subjects: [],
    gradeLevel: '',
    learningStyle: '',
    goals: '',
  })
  const [quizProfile, setQuizProfile] = useState<QuizProfile>({
    subjects: [],
    difficultyLevel: '',
    quizFormat: '',
    timePreference: '',
  })
  const [showProfileForm, setShowProfileForm] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, setInput, setMessages } = useChat({
    api: `/api/chat/${chatMode}`,
    id: currentChatId,
    body: { userPreferences, studyProfile, quizProfile },
  })

  const [isListening, setIsListening] = useState(false)
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const startListening = useCallback(() => {
    if ('webkitSpeechRecognition' in window && userPreferences.voiceEnabled) {
      const recognition = new window.webkitSpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onstart = () => {
        setIsListening(true)
        toast({
          title: "Voice Recording Started",
          description: "Speak your message and it will be sent automatically.",
          variant: "default",
        })
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('')

        setInput(transcript)
      }

      recognition.onerror = (event: SpeechRecognitionEvent) => {
        console.error('Speech recognition error', event.error)
        setIsListening(false)
        toast({
          title: "Error",
          description: "Failed to recognize speech. Please try again.",
          variant: "destructive",
        })
      }

      recognition.onend = () => {
        setIsListening(false)
        toast({
          title: "Voice Recording Stopped",
          description: "Your message has been sent.",
          variant: "default",
        })
        handleSubmit(new Event('submit') as any)
      }

      recognition.start()
    } else if (!userPreferences.voiceEnabled) {
      toast({
        title: "Voice input disabled",
        description: "Enable voice input in settings to use this feature.",
        variant: "default",
      })
    } else {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive",
      })
    }
  }, [setInput, toast, handleSubmit, userPreferences.voiceEnabled])

  const stopListening = useCallback(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition()
      recognition.stop()
      setIsListening(false)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening()
      }
    }
  }, [isListening, stopListening])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    // Update canvas content based on the last message
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === 'assistant') {
      setCanvasContent(lastMessage.content)
    }
  }, [messages])

  const toggleChatMode = () => {
    setChatMode(prevMode => prevMode === 'study' ? 'quiz' : 'study')
    setShowProfileForm(true)
  }

  const toggleCanvas = () => {
    setShowCanvas(prev => !prev)
  }

  const startNewChat = () => {
    const newChatId = `chat_${Date.now()}`
    setChatHistory(prev => [...prev, { id: newChatId, name: `Chat ${prev.length + 1}` }])
    setCurrentChatId(newChatId)
    setMessages([])
  }

  const switchChat = (chatId: string) => {
    setCurrentChatId(chatId)
    // Load messages for the selected chat (you'll need to implement this)
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Save profile to database (implement this function)
    await saveProfile(chatMode === 'study' ? studyProfile : quizProfile)
    setShowProfileForm(false)
    toast({
      title: "Profile Updated",
      description: "Your preferences have been saved.",
      variant: "default",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`h-[calc(110vh-10rem)] ${userPreferences.theme === 'dark' ? 'dark' : ''}`}
    >
      <Card className="h-full bg-white dark:bg-gray-800 border-[#22d3ee] drop-shadow-xl">
        <CardHeader className="bg-[#0284c7] text-[#f0f9ff] dark:bg-gray-700 px-3 py-2 rounded-t-xl flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-[#22d3ee]" />
            Personalized AI Assistant
          </CardTitle>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-[#22d3ee] text-[#f0f9ff] hover:bg-[#0c4a6e] hover:text-[#22d3ee]">
                  Switch Mode
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => toggleChatMode()}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Study Mode</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleChatMode()}>
                  <PenTool className="mr-2 h-4 w-4" />
                  <span>Quiz Mode</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={toggleCanvas} variant="outline" size="sm" className="bg-[#22d3ee] text-[#f0f9ff] hover:bg-[#0c4a6e] hover:text-[#22d3ee]">
              {showCanvas ? 'Hide Canvas' : 'Show Canvas'}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-[#22d3ee] text-[#f0f9ff] hover:bg-[#0c4a6e] hover:text-[#22d3ee]">
                  <Settings className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>User Preferences</DialogTitle>
                  <DialogDescription>Customize your chatbot experience</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="theme">Dark Theme</Label>
                    <Switch
                      id="theme"
                      checked={userPreferences.theme === 'dark'}
                      onCheckedChange={(checked) => setUserPreferences(prev => ({ ...prev, theme: checked ? 'dark' : 'light' }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="fontSize">Font Size</Label>
                    <select
                      id="fontSize"
                      value={userPreferences.fontSize}
                      onChange={(e) => setUserPreferences(prev => ({ ...prev, fontSize: e.target.value as 'small' | 'medium' | 'large' }))}
                      className="border rounded p-1"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="voiceEnabled">Voice Input</Label>
                    <Switch
                      id="voiceEnabled"
                      checked={userPreferences.voiceEnabled}
                onCheckedChange={(checked) => setUserPreferences(prev => ({ ...prev, voiceEnabled: checked }))}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-4rem)] px-2 py-4">
          <div className="flex justify-between items-center mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">Chat History</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {chatHistory.map((chat) => (
                  <DropdownMenuItem key={chat.id} onClick={() => switchChat(chat.id)}>
                    {chat.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={startNewChat} size="sm">
              <Plus className="w-4 h-4 mr-2" /> New Chat
            </Button>
          </div>
          {showCanvas && (
            <div className="w-full h-64 mb-4 border border-[#22d3ee] rounded-lg overflow-hidden">
              <Canvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Text
                  position={[0, 0, 0]}
                  color="#22d3ee"
                  fontSize={0.5}
                  maxWidth={5}
                  lineHeight={1}
                  letterSpacing={0.02}
                  textAlign="center"
                  font="https://fonts.gstatic.com/s/raleway/v14/1Ptug8zYS_SKggPNyC0IT4ttDfA.woff2"
                >
                  {canvasContent}
                </Text>
                <OrbitControls />
              </Canvas>
            </div>
          )}
          <div className="text-center mb-4 text-2xl font-bold text-[#0284c7] dark:text-[#22d3ee]">
            {chatMode === 'study' ? 'Study Mode' : 'Quiz Mode'}
          </div>
          {showProfileForm && (
            <form onSubmit={handleProfileSubmit} className="mb-4">
              <h3 className="text-lg font-semibold mb-2">{chatMode === 'study' ? 'Study Profile' : 'Quiz Profile'}</h3>
              {chatMode === 'study' ? (
                <>
                  <Input
                    placeholder="Subjects (comma-separated)"
                    value={studyProfile.subjects.join(', ')}
                    onChange={(e) => setStudyProfile(prev => ({ ...prev, subjects: e.target.value.split(',').map(s => s.trim()) }))}
                    className="mb-2"
                  />
                  <Select onValueChange={(value) => setStudyProfile(prev => ({ ...prev, gradeLevel: value }))}>
                    <SelectTrigger className="mb-2">
                      <SelectValue placeholder="Grade Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elementary">Elementary</SelectItem>
                      <SelectItem value="middle">Middle School</SelectItem>
                      <SelectItem value="high">High School</SelectItem>
                      <SelectItem value="college">College</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={(value) => setStudyProfile(prev => ({ ...prev, learningStyle: value }))}>
                    <SelectTrigger className="mb-2">
                      <SelectValue placeholder="Learning Style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visual">Visual</SelectItem>
                      <SelectItem value="auditory">Auditory</SelectItem>
                      <SelectItem value="reading">Reading/Writing</SelectItem>
                      <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Study Goals"
                    value={studyProfile.goals}
                    onChange={(e) => setStudyProfile(prev => ({ ...prev, goals: e.target.value }))}
                    className="mb-2"
                  />
                </>
              ) : (
                <>
                  <Input
                    placeholder="Subjects (comma-separated)"
                    value={quizProfile.subjects.join(', ')}
                    onChange={(e) => setQuizProfile(prev => ({ ...prev, subjects: e.target.value.split(',').map(s => s.trim()) }))}
                    className="mb-2"
                  />
                  <Select onValueChange={(value) => setQuizProfile(prev => ({ ...prev, difficultyLevel: value }))}>
                    <SelectTrigger className="mb-2">
                      <SelectValue placeholder="Difficulty Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={(value) => setQuizProfile(prev => ({ ...prev, quizFormat: value }))}>
                    <SelectTrigger className="mb-2">
                      <SelectValue placeholder="Quiz Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                      <SelectItem value="short-answer">Short Answer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={(value) => setQuizProfile(prev => ({ ...prev, timePreference: value }))}>
                    <SelectTrigger className="mb-2">
                      <SelectValue placeholder="Time Preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="untimed">Untimed</SelectItem>
                      <SelectItem value="timed">Timed</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
              <Button type="submit">Save Profile</Button>
            </form>
          )}
          <motion.div 
            className={`flex-1 overflow-auto mb-4 space-y-4 text-${userPreferences.fontSize}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {messages.map(m => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div 
                    className={`flex items-end gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Avatar className="w-10 h-10 border-2 border-[#0284c7]">
                      <AvatarImage src={m.role === 'user' ? '/user-avatar.png' : '/ai-avatar.png'} />
                      <AvatarFallback>{m.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
                    </Avatar>
                    <div className={`rounded-xl p-3 max-w-[70%] shadow-md ${
                      m.role === 'user' 
                        ? 'bg-[#0284c7] text-white dark:bg-[#22d3ee] dark:text-gray-800' 
                        : 'bg-[#22d3ee]/30 text-[#0c4a6e] dark:bg-gray-700 dark:text-[#f0f9ff]'
                    }`}>
                      {m.content}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </motion.div>
          <motion.form 
            onSubmit={handleSubmit} 
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder={chatMode === 'study' ? "Ask a study question..." : "Start quiz or ask a question..."}
              className={`flex-1 bg-[#f0f9ff] text-[#0c4a6e] dark:bg-gray-700 dark:text-[#f0f9ff] border-[#22d3ee] focus:ring-[#22d3ee] focus:border-[#22d3ee] rounded-lg text-${userPreferences.fontSize}`}
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" className="bg-[#22d3ee] text-[#f0f9ff] hover:bg-[#0c4a6e] hover:text-[#22d3ee] dark:bg-[#0c4a6e] dark:text-[#22d3ee] dark:hover:bg-[#22d3ee] dark:hover:text-[#0c4a6e]">
                <Send className="w-4 h-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                type="button" 
                onClick={isListening ? stopListening : startListening}
                variant={isListening ? "destructive" : "secondary"} 
                className={`border-[#22d3ee] ${
                  isListening 
                    ? 'bg-red-500 text-white dark:bg-red-700' 
                    : 'text-[#22d3ee] hover:bg-[#22d3ee]/20 hover:text-[#f0f9ff] dark:text-[#f0f9ff] dark:hover:bg-[#22d3ee] dark:hover:text-[#0c4a6e]'
                }`}
                disabled={!userPreferences.voiceEnabled}
              >
                {isListening ? <StopCircle className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </motion.div>
          </motion.form>
        </CardContent>
      </Card>
    </motion.div>
  )
}