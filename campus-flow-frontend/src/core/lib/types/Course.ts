/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react"

export interface CourseVideo {
  [x: string]: ReactNode
  _id?: string
  title: string
  description?: string
  liveUrl: string
  scheduledDate: string
  status: 'scheduled' | 'live' | 'finished'
  thumbnail?: string
  banner?: string
  createdAt?: string
}

export interface CourseModuleItem {
  title: string
  description?: string
  videos: CourseVideo[]
}

export interface CourseLive {
  status(status: any): import("react").ReactNode
  title: string
  description?: string
  liveUrl: string
  scheduledDate: string
  isFinished: boolean
}

export interface UserReference {
  _id: string
  username?: string
}

export interface CourseQuestion {
  _id: string
  message: string
  answer?: string
  isAnswered: boolean
  user?: UserReference | string
  createdAt: string
  updatedAt: string
}

export interface CourseReview {
  _id: string
  rating: number
  comment?: string
  user?: UserReference | string
  createdAt: string
  updatedAt: string
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

  teacher: string | UserReference

  students: Array<string | UserReference>

  modules: CourseModuleItem[]

  lives: CourseLive[]

  shortUrl?: string;

  progress: string[]

  reviews: CourseReview[]

  questions: CourseQuestion[]

  totalStudents: number

  totalModules: number

  totalVideos: number

  totalHours: number

  averageProgress?: number

  published: boolean

  hasCertificate: boolean

  progressPercent?: number

  createdAt: string

  updatedAt: string
}