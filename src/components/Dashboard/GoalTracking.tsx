'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Target, Trophy, Plus, Trash2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

type Goal = {
  id: string
  title: string
  progress: number
  target: number
  unit: string
  dueDate: string
  completed: boolean
}

export default function GoalTracking() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: 0,
    unit: 'hours',
    dueDate: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    // Fetch user goals
    const fetchGoals = async () => {
      try {
        const response = await fetch('/api/user-goals')
        const data = await response.json()
        setGoals(data)
      } catch (error) {
        console.error('Failed to fetch user goals:', error)
        toast({
          title: "Error",
          description: "Failed to fetch goals. Please try again.",
          variant: "destructive",
        })
      }
    }
    fetchGoals()
  }, [toast])

  const handleAddGoal = async () => {
    if (newGoal.title && newGoal.target && newGoal.dueDate) {
      const goalToAdd = {
        ...newGoal,
        id: Date.now().toString(),
        progress: 0,
        completed: false
      }

      // Add goal to the backend
      try {
        const response = await fetch('/api/add-goal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(goalToAdd),
        })
        if (!response.ok) {
          throw new Error('Failed to add goal')
        }
        const addedGoal = await response.json()
        setGoals(prevGoals => [...prevGoals, addedGoal])
        setNewGoal({ title: '', target: 0, unit: 'hours', dueDate: '' })
        toast({
          title: "Goal added",
          description: "Your new goal has been added successfully.",
        })
      } catch (error) {
        console.error('Failed to add goal:', error)
        toast({
          title: "Error",
          description: "Failed to add goal. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Incomplete information",
        description: "Please fill in all fields to add a new goal.",
        variant: "destructive",
      })
    }
  }



  async function handleDeleteGoal(id: string) {
    try {
      const response = await fetch('/api/delete-goal', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete goal');
      }
  
      const deletedGoal = await response.json();
      console.log('Goal deleted:', deletedGoal);
  
      // Update UI as needed
    } catch (error) {
      console.error('Failed to delete goal:', error);
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
              <Target className="w-5 h-5 text-[#22d3ee]" />
              Add New Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goalTitle" className="text-[#f0f9ff]">Goal Title</Label>
                <Input
                  id="goalTitle"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="bg-[#0c4a6e] text-[#f0f9ff] border-[#22d3ee]"
                />
              </div>
              <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="goalTarget" className="text-[#f0f9ff]">Target</Label>
                  <Input
                    id="goalTarget"
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) })}
                    className="bg-[#0c4a6e] text-[#f0f9ff] border-[#22d3ee]"
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <Label htmlFor="goalUnit" className="text-[#f0f9ff]">Unit</Label>
                  <Select
                    value={newGoal.unit}
                    onValueChange={(value) => setNewGoal({ ...newGoal, unit: value })}
                  >
                    <SelectTrigger id="goalUnit" className="bg-[#0c4a6e] text-[#f0f9ff] border-[#22d3ee]">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0c4a6e] text-[#f0f9ff] border-[#22d3ee]">
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="pages">Pages</SelectItem>
                      <SelectItem value="problems">Problems</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goalDueDate" className="text-[#f0f9ff]">Due Date</Label>
                <Input
                  id="goalDueDate"
                  type="date"
                  value={newGoal.dueDate}
                  onChange={(e) => setNewGoal({ ...newGoal, dueDate: e.target.value })}
                  className="bg-[#0c4a6e] text-[#f0f9ff] border-[#22d3ee]"
                />
              </div>
              <Button 
                onClick={handleAddGoal}
                className="w-full bg-[#22d3ee] text-[#0c4a6e] hover:bg-[#22d3ee]/80"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {goals.length > 0 && (
          <div className="space-y-4">
            {goals.map(goal => (
              <Card key={goal.id} className="bg-[#0284c7]/20 border-[#22d3ee]/20">
                <CardHeader>
                  <CardTitle className="text-[#f0f9ff] flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[#22d3ee]" />
                    {goal.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={goal.progress} max={goal.target} />
                    <div className="flex justify-between items-center text-[#f0f9ff]">
                      <span>{goal.progress}/{goal.target} {goal.unit}</span>
                      <span>{goal.dueDate}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="w-full bg-red-600 text-[#f0f9ff]"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete Goal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
