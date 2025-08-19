'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useClasses } from '@/hooks/useClasses'
import { useAuth } from '@/hooks/useAuth'

interface Class {
  id: number
  title: string
  description: string
  instructor_id: number | null
  created_at: string
  updated_at: string
}

interface ClassListProps {
  onEdit?: (classItem: Class) => void
  onEnroll?: (classId: number, className: string) => void
}

export function ClassList({ onEdit, onEnroll }: ClassListProps) {
  const { classes, fetchClasses, deleteClass, isLoading, error } = useClasses()
  const { user } = useAuth()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    fetchClasses()
  }, [fetchClasses])

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      setDeletingId(id)
      const result = await deleteClass(id)
      if (result.success) {

      }
      setDeletingId(null)
    }
  }

  if (isLoading && classes.length === 0) {
    return <div className="text-center py-8">Loading classes...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Available Classes</h2>
        <Button onClick={() => fetchClasses()} disabled={isLoading}>
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {classes.length === 0 && !isLoading ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              No classes available. Create your first class!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((classItem) => (
            <Card key={classItem.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-2">{classItem.title}</CardTitle>
                <CardDescription>
                  Class ID: {classItem.id}
                  {classItem.instructor_id && ` • Instructor: ${classItem.instructor_id}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {classItem.description}
                </p>
                <div className="text-xs text-muted-foreground mb-4">
                  <p>Created: {new Date(classItem.created_at).toLocaleDateString()}</p>
                  <p>Updated: {new Date(classItem.updated_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {user && onEnroll && (
                    <Button
                      size="sm"
                      onClick={() => onEnroll(classItem.id, classItem.title)}
                      className="flex-1"
                    >
                      Enroll
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(classItem)}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(classItem.id)}
                    disabled={deletingId === classItem.id}
                  >
                    {deletingId === classItem.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}