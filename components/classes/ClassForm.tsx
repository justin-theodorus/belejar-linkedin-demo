'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useClasses } from '@/hooks/useClasses'

interface Class {
  id: number
  title: string
  description: string
  instructor_id: number | null
  created_at: string
  updated_at: string
}

interface ClassFormProps {
  editingClass?: Class
  onSuccess?: () => void
  onCancel?: () => void
}

export function ClassForm({ editingClass, onSuccess, onCancel }: ClassFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [instructorId, setInstructorId] = useState('')
  const { createClass, updateClass, isLoading, error } = useClasses()

  useEffect(() => {
    if (editingClass) {
      setTitle(editingClass.title)
      setDescription(editingClass.description)
      setInstructorId(editingClass.instructor_id?.toString() || '')
    }
  }, [editingClass])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const instructorIdNum = instructorId ? parseInt(instructorId) : undefined
    
    let result
    if (editingClass) {
      result = await updateClass(editingClass.id, {
        title,
        description,
        instructor_id: instructorIdNum
      })
    } else {
      result = await createClass(title, description, instructorIdNum)
    }
    
    if (result.success) {
      setTitle('')
      setDescription('')
      setInstructorId('')
      if (onSuccess) onSuccess()
    }
  }

  const handleCancel = () => {
    setTitle('')
    setDescription('')
    setInstructorId('')
    if (onCancel) onCancel()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{editingClass ? 'Edit Class' : 'Create New Class'}</CardTitle>
        <CardDescription>
          {editingClass ? 'Update the class information' : 'Add a new class to the platform'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Class Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter class title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter class description"
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instructorId">Instructor ID (optional)</Label>
            <Input
              id="instructorId"
              type="number"
              value={instructorId}
              onChange={(e) => setInstructorId(e.target.value)}
              placeholder="Enter instructor user ID"
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading 
                ? (editingClass ? 'Updating...' : 'Creating...') 
                : (editingClass ? 'Update Class' : 'Create Class')
              }
            </Button>
            {(editingClass || onCancel) && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}