'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdaptiveStudyPath() {
  const [activeTab, setActiveTab] = useState('content')

  // Placeholder data
  const studyContent = [
    { id: 1, title: 'Introduction to Machine Learning', progress: 60 },
    { id: 2, title: 'Data Structures and Algorithms', progress: 40 },
    { id: 3, title: 'Web Development Fundamentals', progress: 80 },
  ]

  const quizzes = [
    { id: 1, title: 'Python Basics Quiz', questions: 10 },
    { id: 2, title: 'JavaScript Fundamentals', questions: 15 },
    { id: 3, title: 'Data Science Concepts', questions: 20 },
  ]

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="content">Study Content</TabsTrigger>
        <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        <TabsTrigger value="resources">Resource Library</TabsTrigger>
      </TabsList>
      <TabsContent value="content">
        {studyContent.map((content) => (
          <Card key={content.id} className="mb-4">
            <CardHeader>
              <CardTitle>{content.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={content.progress} className="mb-2" />
              <p className="text-sm text-gray-500">{content.progress}% Complete</p>
              <Button className="mt-2">Continue Learning</Button>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
      <TabsContent value="quizzes">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="mb-4">
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{quiz.questions} questions</p>
              <Button>Start Quiz</Button>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
      <TabsContent value="resources">
        <Card>
          <CardHeader>
            <CardTitle>Resource Library</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2">
              <li>Introduction to Python Programming (eBook)</li>
              <li>Data Structures and Algorithms Video Course</li>
              <li>Web Development Bootcamp Resources</li>
              <li>Machine Learning Research Papers Collection</li>
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}