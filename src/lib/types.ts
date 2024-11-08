// types.ts
export type Subtopic = {
    id: string
    title: string
    completed: boolean
  }
  
  export type Topic = {
    id: string
    title: string
    progress: number
    subtopics: Subtopic[]
  }
  
  export type StudyPathResponse = {
    topics: Topic[]
    currentTopic: Topic | null
  }

  type Goal = {
    id: string
    title: string
    target: number
    unit: string
    progress: number
    dueDate: string
    completed: boolean
  }
  
  