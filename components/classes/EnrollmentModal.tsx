'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useClasses } from '@/hooks/useClasses'
import { useAuth } from '@/hooks/useAuth'

interface EnrollmentModalProps {
  classId: number
  className: string
  onClose: () => void
  onSuccess?: () => void
}

export function EnrollmentModal({ classId, className, onClose, onSuccess }: EnrollmentModalProps) {
  const [enrollmentResult, setEnrollmentResult] = useState<{ success: boolean; message: string } | null>(null)
  const { enrollInClass, isLoading } = useClasses()
  const { user } = useAuth()

  const handleEnroll = async () => {
    if (!user) {
      setEnrollmentResult({ success: false, message: 'You must be logged in to enroll' })
      return
    }

    const result = await enrollInClass(user.id, classId)
    
    if (result.success) {
      setEnrollmentResult({ success: true, message: 'Successfully enrolled in the class!' })
      setTimeout(() => {
        if (onSuccess) onSuccess()
        onClose()
      }, 2000)
    } else {
      setEnrollmentResult({ success: false, message: result.error || 'Failed to enroll' })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Enroll in Class</CardTitle>
          <CardDescription>
            Do you want to enroll in "{className}"?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {enrollmentResult && (
            <Alert variant={enrollmentResult.success ? "default" : "destructive"}>
              <AlertDescription>{enrollmentResult.message}</AlertDescription>
            </Alert>
          )}

          {!enrollmentResult && (
            <div className="flex gap-2">
              <Button onClick={handleEnroll} disabled={isLoading} className="flex-1">
                {isLoading ? 'Enrolling...' : 'Confirm Enrollment'}
              </Button>
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          )}

          {enrollmentResult && (
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}