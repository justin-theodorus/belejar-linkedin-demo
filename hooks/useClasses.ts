'use client'

import { useState, useCallback } from 'react'

interface Class {
  id: number
  title: string
  description: string
  instructor_id: number | null
  created_at: string
  updated_at: string
}

export function useClasses() {
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const fetchClasses = useCallback(async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/classes')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch classes')
      }
      
      setClasses(data.classes)
      return { success: true, classes: data.classes }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch classes'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchClass = async (id: number) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/classes/${id}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch class')
      }
      
      return { success: true, class: data.class }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch class'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const createClass = async (title: string, description: string, instructorId?: number) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, instructorId }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create class')
      }
      

      setClasses(prev => [data.class, ...prev])
      return { success: true, class: data.class }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create class'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const updateClass = async (id: number, updates: Partial<Pick<Class, 'title' | 'description' | 'instructor_id'>>) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/classes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update class')
      }
      

      setClasses(prev => prev.map(cls => cls.id === id ? data.class : cls))
      return { success: true, class: data.class }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update class'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const deleteClass = async (id: number) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/classes/${id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete class')
      }
      

      setClasses(prev => prev.filter(cls => cls.id !== id))
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete class'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const enrollInClass = async (userId: number, classId: number) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, classId }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to enroll in class')
      }
      
      return { success: true, enrollment: data.enrollment }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to enroll in class'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    classes,
    isLoading,
    error,
    fetchClasses,
    fetchClass,
    createClass,
    updateClass,
    deleteClass,
    enrollInClass
  }
}