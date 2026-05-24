export interface CourseVideo {
  title: string
  description?: string
  videoUrl: string
  durationInMinutes: number
  isPreview: boolean
  thumbnail?: string
}

export interface CourseModuleItem {
  title: string
  description?: string
  videos: CourseVideo[]
}

export interface CourseLive {
  title: string
  description?: string
  liveUrl: string
  scheduledDate: string
  isFinished: boolean
}

export interface Course {
  _id: string

  title: string

  shortDescription: string

  fullDescription: string

  thumbnail: string

  banner?: string

  level: string

  category?: string

  tags: string[]

  teacher: string

  students: string[]

  modules: CourseModuleItem[]

  lives: CourseLive[]

  progress: string[]

  reviews: string[]

  questions: string[]

  totalStudents: number

  totalModules: number

  totalVideos: number

  totalHours: number

  published: boolean

  hasCertificate: boolean

  createdAt: string

  updatedAt: string
}