'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Trophy } from 'lucide-react'

export default function GoalTracking() {
  const [goals, setGoals] = useState([
    { id: 1, title: 'Complete Python Course', progress: 75 },
    { id: 2, title: 'Read 5 Research Papers', progress: 40 },
    { id: 3, title: 'Finish Math Assignment', progress: 90 },
  ])
  const [newGoal, setNewGoal] = useState('')

  const handleAddGoal = () => {
    if (newGoal) {
      setGoals([...goals, { id: Date.now(), title: newGoal, progress: 0 }])
      setNewGoal('')
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Set New Goal</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Enter your new goal"
            className="flex-1"
          />
          <Button onClick={handleAddGoal}>Add Goal</Button>
        </CardContent>
      </Card>
      {goals.map((goal) => (
        <Card key={goal.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {goal.title}
              {goal.progress === 100 && <Trophy className="w-6 h-6 text-[#f59e0b]" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={goal.progress} className="mb-2" />
            <p className="text-sm  text-gray-500">{goal.progress}% Complete</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}