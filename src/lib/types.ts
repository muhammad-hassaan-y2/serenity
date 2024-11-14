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

 