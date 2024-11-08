// mockDatabase.ts
import { Topic } from "./types"

// Mock data representing user’s study path
export const studyPath: Topic[] = [
  {
    id: "1",
    title: "Introduction to React",
    progress: 50,
    subtopics: [
      { id: "1-1", title: "Components", completed: true },
      { id: "1-2", title: "Props & State", completed: false },
    ],
  },
  // Add more topics as needed
]

export const getStudyPath = (): Topic[] => studyPath
export const updateSubtopicCompletion = (topicId: string, subtopicId: string) => {
  const topic = studyPath.find((t) => t.id === topicId)
  if (topic) {
    const subtopic = topic.subtopics.find((s) => s.id === subtopicId)
    if (subtopic) {
      subtopic.completed = true
      const completedCount = topic.subtopics.filter((s) => s.completed).length
      topic.progress = Math.round((completedCount / topic.subtopics.length) * 100)
    }
  }
  return studyPath
}
