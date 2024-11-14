'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Pencil, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

export default function DailyDiary() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [reflection, setReflection] = useState("")
  const [entries, setEntries] = useState<{[key: string]: string}>({})
  const [editingEntry, setEditingEntry] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchEntries = useCallback(async () => {
    try {
      const response = await fetch('/api/diary-entries')
      if (!response.ok) throw new Error('Failed to fetch entries')
      const data = await response.json()
      setEntries(data)
    } catch {
      toast({
        title: "Error",
        description: "Failed to load diary entries. Please try again.",
        variant: "destructive"
      })
    }
  }, [toast])
  

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const handleSaveReflection = async () => {
    if (!selectedDate || !reflection.trim()) {
      toast({
        title: "Error",
        description: "Please select a date and write your reflection",
        variant: "destructive"
      })
      return
    }
  
    setIsLoading(true)
    const dateKey = format(selectedDate, 'yyyy-MM-dd')
  
    try {
      const response = await fetch('/api/diary-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateKey, entry: reflection }),
      })
  
      if (!response.ok) throw new Error('Failed to save entry')
  
      setEntries(prev => ({ ...prev, [dateKey]: reflection }))
      setReflection("")
      toast({
        title: "Success",
        description: "Your reflection has been saved",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to save your reflection. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  

  const handleEditEntry = async (date: string, updatedEntry: string) => {
    if (!updatedEntry.trim()) {
      toast({
        title: "Error",
        description: "Entry cannot be empty",
        variant: "destructive"
      })
      return
    }
  
    setIsLoading(true)
    try {
      const response = await fetch(`/api/diary-entries/${date}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry: updatedEntry }),
      })
  
      if (!response.ok) throw new Error('Failed to update entry')
  
      setEntries(prev => ({ ...prev, [date]: updatedEntry }))
      setEditingEntry(null)
      toast({
        title: "Success",
        description: "Your reflection has been updated",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to update your reflection. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  

  const handleDeleteEntry = async (date: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/diary-entries/${date}`, {
        method: 'DELETE',
      })
  
      if (!response.ok) throw new Error('Failed to delete entry')
  
      const updatedEntries = { ...entries }
      delete updatedEntries[date]
      setEntries(updatedEntries)
      toast({
        title: "Success",
        description: "Entry deleted successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete entry. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-[#0284c7]/20 border-[#22d3ee]/20">
          <CardHeader>
            <CardTitle className="text-[#f0f9ff]">Daily Reflection</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Write your thoughts for the day..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="min-h-[200px] bg-[#0c4a6e] text-[#f0f9ff] border-[#22d3ee] mb-4"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSaveReflection} 
              className="w-full bg-[#22d3ee] text-[#0c4a6e] hover:bg-[#22d3ee]/80"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Reflection"}
            </Button>
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
            <CardTitle className="text-[#f0f9ff]">Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border border-[#22d3ee] bg-[#0c4a6e] text-[#f0f9ff]"
              disabled={isLoading}
            />
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="md:col-span-2"
      >
        <Card className="bg-[#0284c7]/20 border-[#22d3ee]/20">
          <CardHeader>
            <CardTitle className="text-[#f0f9ff]">Past Reflections</CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {Object.entries(entries).length === 0 ? (
                <p>No entries found for the selected date.</p>
              ) : (
                Object.entries(entries).map(([date, entry]) => (
                  <motion.div
                    key={date}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#f0f9ff] text-lg font-semibold">{date}</p>
                        <p className="text-[#f0f9ff] text-sm">{entry}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost">
                              <Pencil size={16} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Entry</DialogTitle>
                            </DialogHeader>
                            <Textarea
                              value={editingEntry ?? entry}
                              onChange={(e) => setEditingEntry(e.target.value)}
                            />
                            <Button
                              onClick={() => {
                                handleEditEntry(date, editingEntry || entry)
                              }}
                            >
                              Save Changes
                            </Button>
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" onClick={() => handleDeleteEntry(date)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
