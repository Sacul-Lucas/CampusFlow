import ReactPlayer from "react-player"
import type { Course } from "@/core/lib/types/Course"

interface ShortPlayerProps {
  course: Course
}

export const ShortPlayer = ({ course }: ShortPlayerProps) => {
  if (!course.shortUrl) {
    return null
  }

  return (
    <div className="mt-4">
      <ReactPlayer
        src={course.shortUrl}
        width="100%"
        height="100%"
        controls
        className="object-cover"
      />
    </div>
  )
}