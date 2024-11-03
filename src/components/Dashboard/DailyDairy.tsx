'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Smile, Meh, Frown } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DailyDiary({ colors }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [entry, setEntry] = useState('')
  const [mood, setMood] = useState<'happy' | 'neutral' | 'sad' | null>(null)
  const [entries, setEntries] = useState<Array<{ date: string; mood: string; entry: string }>>([])

  useEffect(() => {
    // Simulating data fetching
    const fetchEntries = async () => {
      // In a real application, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setEntries([
        { date: '2023-05-01', mood: 'happy', entry: 'Great study session today!' },
        { date: '2023-05-02', mood: 'neutral', entry: 'Struggled with some concepts, but making progress.' },
        { date: '2023-05-03', mood: 'sad', entry: 'Feeling overwhelmed with the workload.' },
        { date: '2023-05-04', mood: 'happy', entry: 'Aced my quiz! Hard work pays off.' },
        { date: '2023-05-05', mood: 'neutral', entry: 'Average day, need to focus more tomorrow.' },
      ])
    }
    fetchEntries()
  }, [])

  const handleSave = () => {
    if (selectedDate && mood && entry) {
      const newEntry = {
        date: selectedDate.toISOString().split('T')[0],
        mood,
        entry,
      }
      setEntries([...entries, newEntry])
      setEntry('')
      setMood(null)
    }
  }

  const moodData = entries.map(entry => ({
    date: entry.date,
    mood: entry.mood === 'happy' ? 2 : entry.mood === 'neutral' ? 1 : 0,
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card style={{background: colors.background, color: colors.text}}>
        <CardHeader>
          <CardTitle>Daily Reflection</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="mb-4"
            styles={{
              head_cell: { color: colors.accent },
              day: { color: colors.text },
              day_selected: { background: colors.primary },
            }}
          />
          <Textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Write your thoughts for the day..."
            className="mb-4"
            style={{background: colors.secondary, color: colors.text, borderColor: colors.accent}}
          />
          <div className="flex justify-between mb-4">
            <Button variant={mood === 'happy' ? 'default' : 'outline'} onClick={() => setMood('happy')} style={{borderColor: colors.accent, background: mood === 'happy' ? colors.success : 'transparent'}}>
              <Smile className="w-6 h-6" />
            </Button>
            <Button variant={mood === 'neutral' ? 'default' : 'outline'} onClick={() => setMood('neutral')} style={{borderColor: colors.accent, background: mood === 'neutral' ? colors.warning : 'transparent'}}>
              <Meh className="w-6 h-6" />
            </Button>
            <Button variant={mood === 'sad' ? 'default' : 'outline'} onClick={() => setMood('sad')} style={{borderColor: colors.accent, background: mood === 'sad' ? colors.error : 'transparent'}}>
              <Frown className="w-6 h-6" />
            </Button>
          </div>
          <Button onClick={handleSave} className="w-full" style={{background: colors.primary, color: colors.text}}>Save Entry</Button>
        </CardContent>
      </Card>
      <Card style={{background: colors.background, color: colors.text}}>
        <CardHeader>
          <CardTitle>Reflection Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.accent} />
                <XAxis dataKey="date" stroke={colors.text} />
                <YAxis domain={[0, 2]} ticks={[0, 1, 2]} tickFormatter={(value) => ['Sad', 'Neutral', 'Happy'][value]} stroke={colors.text} />
                <Tooltip contentStyle={{background: colors.secondary, border: `1px solid ${colors.accent}`, color: colors.text}} />
                <Line type="monotone" dataKey="mood" stroke={colors.primary} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {entries.slice(-3).reverse().map((entry, index) => (
              <div key={index} className="p-2 rounded" style={{background: colors.secondary}}>
                <p className="text-sm font-semibold">{entry.date}</p>
                <p className="text-sm">{entry.entry.slice(0, 50)}...</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}