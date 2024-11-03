'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle, BookOpen, ArrowRight, Award } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

type Topic = {
  id: string
  title: string
  progress: number
  subtopics: {
    id: string
    title: string
    completed: boolean
  }[]
}

export default function AdaptiveStudyPath() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Fetch user's study path
    const fetchStudyPath = async () => {
      try {
        const response = await fetch('/api/study-path')
        const data = await response.json()
        setTopics(data.topics)
        setCurrentTopic(data.currentTopic)
      } catch (error) {
        console.error('Failed to fetch study path:', error)
      }
    }
    fetchStudyPath()
  }, [])

  const handleCompleteSubtopic = async (topicId: string, subtopicId: string) => {
    const updatedTopics = topics.map(topic => {
      if (topic.id === topicId) {
        const updatedSubtopics = topic.subtopics.map(subtopic => 
          subtopic.id === subtopicId ? { ...subtopic, completed: true } : subtopic
        )
        const completedCount = updatedSubtopics.filter(st => st.completed).length
        const newProgress = Math.round((completedCount / updatedSubtopics.length) * 100)
        return { ...topic, subtopics: updatedSubtopics, progress: newProgress }
      }
      return topic
    })

    setTopics(updatedTopics)

    // Update progress in the backend
    try {
      await fetch('/api/update-progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, subtopicId }),
      })
      toast({
        title: "Progress updated",
        description: "Your study progress has been saved.",
      })
    } catch (error) {
      console.error('Failed to update progress:', error)
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleNextTopic = () => {
    const currentIndex = topics.findIndex(t => t.id === currentTopic?.id)
    if (currentIndex < topics.length - 1) {
      setCurrentTopic(topics[currentIndex + 1])
    } else {
      toast({
        title: "Congratulations!",
        description: "You've completed all topics in your study path.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-[#0284c7]/20 border-[#22d3ee]/20">
          <CardHeader>
            <CardTitle className="text-[#f0f9ff] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#22d3ee]" />
              Current Topic: {currentTopic?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentTopic && (
              <>
                <Progress value={currentTopic.progress} className="h-2 mb-4" />
                <Accordion type="single" collapsible className="w-full">
                  {currentTopic.subtopics.map((subtopic) => (
                    <AccordionItem key={subtopic.id} value={subtopic.id}>
                      <AccordionTrigger className="text-[#f0f9ff] hover:text-[#22d3ee]">
                        {subtopic.title}
                        {subtopic.completed && <CheckCircle className="w-4 h-4 text-green-500 ml-2" />}
                      </AccordionTrigger>
                      <AccordionContent className="text-[#f0f9ff]">
                        <p className="mb-2">Study content for {subtopic.title} goes here.</p>
                        {!subtopic.completed && (
                          <Button 
                            onClick={() => handleCompleteSubtopic(currentTopic.id, subtopic.id)}
                            className="bg-[#22d3ee] text-[#0c4a6e] hover:bg-[#22d3ee]/80"
                          >
                            Mark as Completed
                          </Button>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <Button 
                  onClick={handleNextTopic}
                  className="w-full mt-4 bg-[#22d3ee] text-[#0c4a6e] hover:bg-[#22d3ee]/80"
                >
                  Next Topic <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-[#0284c7]/20 border-[#22d3ee]/20">
          <CardHeader>
            <CardTitle className="text-[#f0f9ff] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#22d3ee]" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topics.map((topic) => (
                <div key={topic.id} className="space-y-2">
                  <div className="flex justify-between text-sm text-[#f0f9ff]">
                    <span>{topic.title}</span>
                    <span>{topic.progress}%</span>
                  </div>
                  <Progress value={topic.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}