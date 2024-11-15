"use client"
import { useState, useEffect, useCallback, useRef } from 'react'
import { useChat } from 'ai/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Mic, MessageCircle, StopCircle } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { AnimatePresence, motion } from 'framer-motion'

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface SpeechRecognitionEventWithTranscript extends SpeechRecognitionEvent {
  results: SpeechRecognitionResult[];
}

declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export default function Chatbot() {
  const { messages, input, handleInputChange, handleSubmit, setInput } = useChat<ChatMessage>({
    api: '/api/chat',
  })
  const [isListening, setIsListening] = useState(false)
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const startListening = useCallback(() => {
    if ('webkitSpeechRecognition' in window) {
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

      recognition.onresult = (event: SpeechRecognitionEventWithTranscript) => {
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
        handleSubmit()
      }

      recognition.start()
    } else {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive",
      })
    }
  }, [setInput, toast, handleSubmit])

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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-[calc(110vh-10rem)] "
    >
      <Card className="h-full bg-white border-[#22d3ee] drop-shadow-xl">
        <CardHeader className="bg-[#0284c7] text-[#f0f9ff] px-3 py-2 rounded-t-xl">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-[#22d3ee]" />
            Personalized AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-4rem)] px-2 py-4">
          <motion.div 
            className="flex-1 overflow-auto mb-4 space-y-4" 
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
                      <AvatarImage src={m.role === 'user' ? '/placeholder-avatar.jpg' : '/ai-avatar.png'} />
                      <AvatarFallback>{m.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
                    </Avatar>
                    <div className={`rounded-xl p-3 max-w-[70%] shadow-md ${m.role === 'user' ? 'bg-[#0284c7] text-white' : 'bg-[#22d3ee]/30 text-[#0c4a6e]'}`}>
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
              placeholder="Type your message..."
              className="flex-1 bg-[#f0f9ff] text-[#0c4a6e] border-[#22d3ee] focus:ring-[#22d3ee] focus:border-[#22d3ee] rounded-lg"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" className="bg-[#22d3ee] text-[#f0f9ff] hover:bg-[#0c4a6e] hover:text-[#22d3ee]">
                <Send className="w-4 h-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                type="button" 
                onClick={startListening} 
                variant={isListening ? "destructive" : "secondary"} 
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
