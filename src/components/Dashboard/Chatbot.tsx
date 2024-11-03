'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Mic, Send, StopCircle, MessageCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Chatbot() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleVoiceInput = () => {
    setIsListening(!isListening)
    // Implement voice recognition logic here
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
    <Card className="h-[calc(100vh-12rem)] bg-[#0284c7]/20 border-[#22d3ee]/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#f0f9ff]">
          <MessageCircle className="w-6 h-6 text-[#22d3ee]" />
          AI Study Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full">
        <motion.div 
          className="flex-1 overflow-auto mb-4 space-y-4 pr-4" 
          style={{maxHeight: 'calc(100vh - 22rem)'}}
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
                <div className={`flex items-end gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={m.role === 'user' ? '/placeholder-avatar.jpg' : '/ai-avatar.png'} />
                    <AvatarFallback>{m.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
                  </Avatar>
                  <div className={`rounded-lg p-3 max-w-[70%] ${m.role === 'user' ? 'bg-[#0284c7] text-white' : 'bg-[#22d3ee]/20 text-[#f0f9ff]'}`}>
                    {m.content}
                  </div>
                </div>
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
                className="border-[#22d3ee] text-[#f0f9ff] hover:bg-[#22d3ee]/20"
              >
                {reply}
              </Button>
            </motion.div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
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
              className={`border-[#22d3ee] ${isListening ? 'bg-red-500 text-white' : 'text-[#f0f9ff]'}`}
            >
              {isListening ? <StopCircle className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  )
}