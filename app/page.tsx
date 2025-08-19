'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { ClassForm } from '@/components/classes/ClassForm'
import { ClassList } from '@/components/classes/ClassList'
import { EnrollmentModal } from '@/components/classes/EnrollmentModal'
import { APITester } from '@/components/testing/APITester'
import { useAuth } from '@/hooks/useAuth'

type View = 'classes' | 'login' | 'register' | 'create-class' | 'edit-class' | 'api-test'

interface Class {
  id: number
  title: string
  description: string
  instructor_id: number | null
  created_at: string
  updated_at: string
}

export default function HomePage() {
  const [currentView, setCurrentView] = useState<View>('classes')
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [enrollmentModal, setEnrollmentModal] = useState<{ classId: number; className: string } | null>(null)
  const { user, logout, isAuthenticated, isInitialized } = useAuth()

  const handleEditClass = (classItem: Class) => {
    setEditingClass(classItem)
    setCurrentView('edit-class')
  }

  const handleEnrollClick = (classId: number, className: string) => {
    setEnrollmentModal({ classId, className })
  }

  const handleFormSuccess = () => {
    setCurrentView('classes')
    setEditingClass(null)
  }

  const handleFormCancel = () => {
    setCurrentView('classes')
    setEditingClass(null)
  }

  const renderNavigation = () => (
    <nav className="bg-white shadow-sm border-b mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Belajar LinkedIn Class</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    👤 {user?.name}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView('classes')}
                  className={currentView === 'classes' ? 'bg-gray-100' : ''}
                >
                  Classes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView('create-class')}
                  className={currentView === 'create-class' ? 'bg-gray-100' : ''}
                >
                  Create Class
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView('api-test')}
                  className={currentView === 'api-test' ? 'bg-gray-100' : ''}
                >
                  API Test
                </Button>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView('classes')}
                  className={currentView === 'classes' ? 'bg-gray-100' : ''}
                >
                  Browse Classes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView('api-test')}
                  className={currentView === 'api-test' ? 'bg-gray-100' : ''}
                >
                  API Test
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView('login')}
                  className={currentView === 'login' ? 'bg-gray-100' : ''}
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => setCurrentView('register')}
                  className={currentView === 'register' ? 'bg-gray-100' : ''}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )

  const renderContent = () => {
    switch (currentView) {
      case 'login':
        return (
          <div className="max-w-md mx-auto">
            <LoginForm onSuccess={() => setCurrentView('classes')} />
            <p className="text-center mt-4 text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentView('register')}
                className="text-blue-600 hover:underline"
              >
                Register here
              </button>
            </p>
          </div>
        )

      case 'register':
        return (
          <div className="max-w-md mx-auto">
            <RegisterForm onSuccess={() => setCurrentView('classes')} />
            <p className="text-center mt-4 text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => setCurrentView('login')}
                className="text-blue-600 hover:underline"
              >
                Login here
              </button>
            </p>
          </div>
        )

      case 'create-class':
        return (
          <ClassForm
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )

      case 'edit-class':
        return (
          <ClassForm
            editingClass={editingClass}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )

      case 'api-test':
        return <APITester />

      case 'classes':
      default:
        return (
          <div className="space-y-6">
            {!isAuthenticated && (
              <Card>
                <CardHeader>
                  <CardTitle>Welcome to Belajar LinkedIn Class</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Discover and enroll in amazing classes. Login or register to get started with enrollments and class management.
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => setCurrentView('register')}>
                      Get Started
                    </Button>
                    <Button variant="outline" onClick={() => setCurrentView('login')}>
                      Login
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <ClassList
              onEdit={isAuthenticated ? handleEditClass : undefined}
              onEnroll={isAuthenticated ? handleEnrollClick : undefined}
            />
          </div>
        )
    }
  }


  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderNavigation()}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {renderContent()}
      </main>

      {enrollmentModal && (
        <EnrollmentModal
          classId={enrollmentModal.classId}
          className={enrollmentModal.className}
          onClose={() => setEnrollmentModal(null)}
          onSuccess={() => setEnrollmentModal(null)}
        />
      )}
    </div>
  )
}