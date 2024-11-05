'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Mic, Send, StopCircle, MessageCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

declare global {
  interface Window {
    webkitSpeechRecognition: any
  }
}
type SpeechRecognitionEvent = {
  results: SpeechRecognitionResultList
}

export default function Chatbot() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[event.results.length - 1][0].transcript
        handleInputChange({ target: { value: transcript } } as any)
      }
      
      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
      }
    } else {
      console.warn("Speech recognition not supported in this browser.")
    }
  }, [handleInputChange])

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  const quickReplies = [
    "What's my next task?",
    "Explain this concept",
    "Schedule a study session",
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-[calc(100vh-12rem)]"
    >
      <Card className="h-full bg-[#0284c7]/20 border-[#22d3ee]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#f0f9ff]">
            <MessageCircle className="w-6 h-6 text-[#22d3ee]" />
            AI Study Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-4rem)]">
          <motion.div 
            className="flex-1 overflow-auto mb-4 space-y-4 pr-4" 
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
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={m.role === 'user' ? '/placeholder-avatar.jpg' : '/ai-avatar.png'} />
                      <AvatarFallback>{m.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
                    </Avatar>
                    <div className={`rounded-lg p-3 max-w-[70%] ${m.role === 'user' ? 'bg-[#0284c7] text-white' : 'bg-[#22d3ee]/20 text-[#f0f9ff]'}`}>
                      {m.content}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </motion.div>
          <div className="flex flex-wrap gap-2 mb-4">
            {quickReplies.map((reply, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  onClick={() => handleInputChange({ target: { value: reply } } as any)} 
                  className="border-[#22d3ee] text-[#22d3ee] hover:bg-[#22d3ee]/20 hover:text-[#f0f9ff]"
                >
                  {reply}
                </Button>
              </motion.div>
            ))}
          </div>
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
              placeholder="Ask me anything..."
              className="flex-1 bg-[#0c4a6e] text-[#f0f9ff] border-[#22d3ee]"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" disabled={isLoading} className="bg-[#22d3ee] text-[#0c4a6e]">
                <Send className="w-4 h-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                type="button" 
                onClick={handleVoiceInput} 
                variant={isListening ? "destructive" : "outline"} 
                className={`border-[#22d3ee] ${isListening ? 'bg-red-500 text-white' : 'text-[#22d3ee] hover:bg-[#22d3ee]/20 hover:text-[#f0f9ff]'}`}
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
