'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Moon, Sun, Volume2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

export default function SettingsPanel() {
  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: true,
    darkMode: false,
    studyReminders: 'daily',
    focusTime: 25,
  })
  const { toast } = useToast()

  useEffect(() => {
    // Fetch user settings
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/user-settings')
        const data = await response.json()
        setSettings(data)
      } catch (error) {
        console.error('Failed to fetch user settings:', error)
      }
    }
    fetchSettings()
  }, [])

  const handleSettingChange = async (key: string, value: any) => {
    const updatedSettings = { ...settings, [key]: value }
    setSettings(updatedSettings)

    // Update settings in the backend
    try {
      await fetch('/api/update-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      })
      toast({
        title: "Settings updated",
        description: "Your changes have been saved successfully.",
      })
    } catch (error) {
      console.error('Failed to update settings:', error)
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
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
              <Bell className="w-5 h-5 text-[#22d3ee]" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="text-[#f0f9ff]">Enable notifications</Label>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="soundEffects" className="text-[#f0f9ff]">Sound effects</Label>
              <Switch
                id="soundEffects"
                checked={settings.soundEffects}
                onCheckedChange={(checked) => handleSettingChange('soundEffects', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studyReminders" className="text-[#f0f9ff]">Study reminders</Label>
              <Select
                value={settings.studyReminders}
                onValueChange={(value) => handleSettingChange('studyReminders', value)}
              >
                <SelectTrigger id="studyReminders" className="bg-[#0c4a6e] text-[#f0f9ff] border-[#22d3ee]">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="bg-[#0c4a6e] text-[#f0f9ff] border-[#22d3ee]">
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              <Sun className="w-5 h-5 text-[#22d3ee]" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode" className="text-[#f0f9ff]">Dark mode</Label>
              <Switch
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-[#0284c7]/20 border-[#22d3ee]/20">
          <CardHeader>
            <CardTitle className="text-[#f0f9ff] flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#22d3ee]" />
              Focus Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="focusTime" className="text-[#f0f9ff]">Focus session duration (minutes)</Label>
              <Input
                id="focusTime"
                type="number"
                value={settings.focusTime}
                onChange={(e) => handleSettingChange('focusTime', parseInt(e.target.value))}
                className="bg-[#0c4a6e] text-[#f0f9ff] border-[#22d3ee]"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Button 
          onClick={() => toast({
            title: "Settings saved",
            description: "All your settings have been successfully saved.",
          })}
          className="w-full bg-[#22d3ee] text-[#0c4a6e] hover:bg-[#22d3ee]/80"
        >
          Save All Settings
        </Button>
      </motion.div>
    </div>
  )
}