'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface APITestResult {
  status: number
  data: any
  error?: string
}

export function APITester() {
  const [results, setResults] = useState<{ [key: string]: APITestResult }>({})
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})


  const [registerData, setRegisterData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })

  const [loginData, setLoginData] = useState({
    email: 'john@example.com',
    password: 'password123'
  })

  const [classData, setClassData] = useState({
    title: 'Introduction to React',
    description: 'Learn the basics of React development',
    instructorId: '1'
  })

  const [enrollData, setEnrollData] = useState({
    userId: '1',
    classId: '1'
  })

  const [classId, setClassId] = useState('1')

  const testAPI = async (endpoint: string, method: string, body?: any, testKey?: string) => {
    const key = testKey || `${method}-${endpoint}`
    setLoading(prev => ({ ...prev, [key]: true }))

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      })

      const data = await response.json()
      setResults(prev => ({
        ...prev,
        [key]: { status: response.status, data }
      }))
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [key]: { 
          status: 0, 
          data: null, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }
      }))
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }))
    }
  }

  const renderResult = (key: string) => {
    const result = results[key]
    if (!result) return null

    return (
      <Alert className={result.status >= 200 && result.status < 300 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
        <AlertDescription>
          <div className="space-y-2">
            <p><strong>Status:</strong> {result.status}</p>
            {result.error && <p><strong>Error:</strong> {result.error}</p>}
            <p><strong>Response:</strong></p>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Testing Dashboard</CardTitle>
          <CardDescription>
            Test all the REST API endpoints for the Belajar LinkedIn Class platform
          </CardDescription>
        </CardHeader>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>1. User Registration</CardTitle>
          <CardDescription>POST /api/register</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Name</Label>
              <Input
                value={registerData.name}
                onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={registerData.email}
                onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
          </div>
          <Button
            onClick={() => testAPI('/api/register', 'POST', registerData, 'register')}
            disabled={loading.register}
          >
            {loading.register ? 'Testing...' : 'Test Register'}
          </Button>
          {renderResult('register')}
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>2. User Login</CardTitle>
          <CardDescription>POST /api/login</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
          </div>
          <Button
            onClick={() => testAPI('/api/login', 'POST', loginData, 'login')}
            disabled={loading.login}
          >
            {loading.login ? 'Testing...' : 'Test Login'}
          </Button>
          {renderResult('login')}
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>3. Get All Classes</CardTitle>
          <CardDescription>GET /api/classes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => testAPI('/api/classes', 'GET', undefined, 'get-classes')}
            disabled={loading['get-classes']}
          >
            {loading['get-classes'] ? 'Testing...' : 'Test Get Classes'}
          </Button>
          {renderResult('get-classes')}
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>4. Create Class</CardTitle>
          <CardDescription>POST /api/classes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>Title</Label>
              <Input
                value={classData.title}
                onChange={(e) => setClassData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={classData.description}
                onChange={(e) => setClassData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div>
              <Label>Instructor ID (optional)</Label>
              <Input
                value={classData.instructorId}
                onChange={(e) => setClassData(prev => ({ ...prev, instructorId: e.target.value }))}
                placeholder="Leave empty for null"
              />
            </div>
          </div>
          <Button
            onClick={() => testAPI('/api/classes', 'POST', {
              ...classData,
              instructorId: classData.instructorId ? parseInt(classData.instructorId) : undefined
            }, 'create-class')}
            disabled={loading['create-class']}
          >
            {loading['create-class'] ? 'Testing...' : 'Test Create Class'}
          </Button>
          {renderResult('create-class')}
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>5. Get Single Class</CardTitle>
          <CardDescription>GET /api/classes/[id]</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Class ID</Label>
            <Input
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              placeholder="Enter class ID"
            />
          </div>
          <Button
            onClick={() => testAPI(`/api/classes/${classId}`, 'GET', undefined, 'get-class')}
            disabled={loading['get-class'] || !classId}
          >
            {loading['get-class'] ? 'Testing...' : 'Test Get Class'}
          </Button>
          {renderResult('get-class')}
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>6. Update Class</CardTitle>
          <CardDescription>PUT /api/classes/[id]</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Class ID to Update</Label>
            <Input
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              placeholder="Enter class ID"
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>New Title</Label>
              <Input
                value={classData.title}
                onChange={(e) => setClassData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label>New Description</Label>
              <Textarea
                value={classData.description}
                onChange={(e) => setClassData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <Button
            onClick={() => testAPI(`/api/classes/${classId}`, 'PUT', {
              title: classData.title,
              description: classData.description,
              instructorId: classData.instructorId ? parseInt(classData.instructorId) : undefined
            }, 'update-class')}
            disabled={loading['update-class'] || !classId}
          >
            {loading['update-class'] ? 'Testing...' : 'Test Update Class'}
          </Button>
          {renderResult('update-class')}
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>7. Delete Class</CardTitle>
          <CardDescription>DELETE /api/classes/[id]</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Class ID to Delete</Label>
            <Input
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              placeholder="Enter class ID"
            />
          </div>
          <Button
            onClick={() => testAPI(`/api/classes/${classId}`, 'DELETE', undefined, 'delete-class')}
            disabled={loading['delete-class'] || !classId}
            variant="destructive"
          >
            {loading['delete-class'] ? 'Testing...' : 'Test Delete Class'}
          </Button>
          {renderResult('delete-class')}
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>8. Enroll User in Class</CardTitle>
          <CardDescription>POST /api/enroll</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>User ID</Label>
              <Input
                value={enrollData.userId}
                onChange={(e) => setEnrollData(prev => ({ ...prev, userId: e.target.value }))}
              />
            </div>
            <div>
              <Label>Class ID</Label>
              <Input
                value={enrollData.classId}
                onChange={(e) => setEnrollData(prev => ({ ...prev, classId: e.target.value }))}
              />
            </div>
          </div>
          <Button
            onClick={() => testAPI('/api/enroll', 'POST', {
              userId: parseInt(enrollData.userId),
              classId: parseInt(enrollData.classId)
            }, 'enroll')}
            disabled={loading.enroll}
          >
            {loading.enroll ? 'Testing...' : 'Test Enrollment'}
          </Button>
          {renderResult('enroll')}
        </CardContent>
      </Card>
    </div>
  )
}