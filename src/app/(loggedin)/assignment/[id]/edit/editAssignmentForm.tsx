'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { updateAssignment } from "@/app/(loggedin)/assignment/add/fetchAssignments"
import { Button } from "@/components/ui/button"

interface Assignment {
  id: number
  title: string
  description: string | null
}

export default function EditAssignmentForm({ assignment }: { assignment?: Assignment }) {
  const router = useRouter()
  const [editedTitle, setEditedTitle] = useState<string>("")
  const [editedDescription, setEditedDescription] = useState<string>("")

  useEffect(() => {
    if (assignment) {
      setEditedTitle(assignment.title)
      setEditedDescription(assignment.description || "")
    }
  }, [assignment])
  
  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (assignment) {
      await updateAssignment(assignment.id, {
        title: editedTitle,
        description: editedDescription,
      })
      router.push("/assignment")
    }
  }

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    router.push("/assignment")
  }

  if (!assignment) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Edit Assignment</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Edit title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Edit description"
            rows={4}
          />
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={handleSave}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}