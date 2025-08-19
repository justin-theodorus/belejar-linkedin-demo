import { createClient } from '@supabase/supabase-js'


const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables: SUPABASE_URL and SUPABASE_KEY are required')
}

export const supabase = createClient(supabaseUrl, supabaseKey)


export interface User {
  id: number
  name: string
  email: string
  password: string
  created_at: string
}

export interface Class {
  id: number
  title: string
  description: string
  instructor_id: number | null
  created_at: string
  updated_at: string
}

export interface Enrollment {
  id: number
  user_id: number
  class_id: number
  created_at: string
}


export async function q<T = any>(text: string, params?: any[]): Promise<{ rows: T[], rowCount: number }> {
  try {
    let query = text
    if (params && params.length > 0) {
      params.forEach((param, index) => {
        const placeholder = `$${index + 1}`
        let value: string
        
        if (param === null || param === undefined) {
          value = 'null'
        } else if (typeof param === 'string') {
          value = `'${param.replace(/'/g, "''")}'`
        } else if (typeof param === 'boolean') {
          value = param ? 'true' : 'false'
        } else {
          value = String(param)
        }
        
        query = query.replace(placeholder, value)
      })
    }

    console.log('Executing query:', query)


    const queryLower = query.trim().toLowerCase()
    

    if (queryLower.startsWith('select')) {
      if (queryLower.includes('from classes')) {
        if (queryLower.includes('order by created_at desc')) {
          const { data, error } = await supabase
            .from('classes')
            .select('id, title, description, instructor_id, created_at, updated_at')
            .order('created_at', { ascending: false })
          
          if (error) throw error
          return { rows: (data as T[]) || [], rowCount: data?.length || 0 }
        } else if (queryLower.includes('where id=')) {
          const idMatch = query.match(/where id='?(\d+)'?/i);
          if (idMatch) {
            const id = parseInt(idMatch[1])
            const { data, error } = await supabase
              .from('classes')
              .select('id, title, description, instructor_id, created_at, updated_at')
              .eq('id', id)
            
            if (error) throw error
            return { rows: (data as T[]) || [], rowCount: data?.length || 0 }
          }
        }
      } else if (queryLower.includes('from users')) {
        if (queryLower.includes('where email=') && queryLower.includes('and password=')) {
          const emailMatch = query.match(/email='([^']+)'/);
          const passwordMatch = query.match(/password='([^']+)'/);
          if (emailMatch && passwordMatch) {
            const email = emailMatch[1]
            const password = passwordMatch[1]
            const { data, error } = await supabase
              .from('users')
              .select('id, name, email')
              .eq('email', email)
              .eq('password', password)
            
            if (error) throw error
            return { rows: (data as T[]) || [], rowCount: data?.length || 0 }
          }
        } else if (queryLower.includes('where email=')) {
          const emailMatch = query.match(/email='([^']+)'/);
          if (emailMatch) {
            const email = emailMatch[1]
            const { data, error } = await supabase
              .from('users')
              .select('id')
              .eq('email', email)
            
            if (error) throw error
            return { rows: (data as T[]) || [], rowCount: data?.length || 0 }
          }
        } else if (queryLower.includes('where id=')) {
          const idMatch = query.match(/where id='?(\d+)'?/i);
          if (idMatch) {
            const id = parseInt(idMatch[1])
            const { data, error } = await supabase
              .from('users')
              .select('id')
              .eq('id', id)
            
            if (error) throw error
            return { rows: (data as T[]) || [], rowCount: data?.length || 0 }
          }
        }
      }
    }
    else if (queryLower.startsWith('insert')) {
      if (queryLower.includes('into classes')) {
        const titleMatch = query.match(/values \('([^']+)'/);
        const descMatch = query.match(/values \('[^']+',\s*'([^']+)'/);
        const instructorMatch = query.match(/values \('[^']+',\s*'[^']+',\s*(\d+|null)/);
        
        if (titleMatch && descMatch) {
          const title = titleMatch[1]
          const description = descMatch[1]
          const instructorId = instructorMatch && instructorMatch[1] !== 'null' ? parseInt(instructorMatch[1]) : null
          
          const { data, error } = await supabase
            .from('classes')
            .insert({ title, description, instructor_id: instructorId })
            .select('id, title, description, instructor_id, created_at, updated_at')
          
          if (error) throw error
          return { rows: (data as T[]) || [], rowCount: data?.length || 0 }
        }
      } else if (queryLower.includes('into users')) {
        const matches = query.match(/values \('([^']+)',\s*'([^']+)',\s*'([^']+)'\)/);
        if (matches) {
          const [, name, email, password] = matches
          
          const { data, error } = await supabase
            .from('users')
            .insert({ name, email, password })
            .select('id, name, email, created_at')
          
          if (error) throw error
          return { rows: (data as T[]) || [], rowCount: data?.length || 0 }
        }
      } else if (queryLower.includes('into enrollments')) {
        if (queryLower.includes('on conflict')) {
          const matches = query.match(/values \((\d+),\s*(\d+)\)/);
          if (matches) {
            const [, userId, classId] = matches

            const { data: existing } = await supabase
              .from('enrollments')
              .select('id')
              .eq('user_id', parseInt(userId))
              .eq('class_id', parseInt(classId))
            
            if (existing && existing.length > 0) {
              return { rows: [], rowCount: 0 }
            }
            const { data, error } = await supabase
              .from('enrollments')
              .insert({ user_id: parseInt(userId), class_id: parseInt(classId) })
              .select('id, user_id, class_id, created_at')
            
            if (error) throw error
            return { rows: (data as T[]) || [], rowCount: data?.length || 0 }
          }
        }
      }
    }
    else if (queryLower.startsWith('update')) {
      if (queryLower.includes('classes')) {
        const whereMatch = query.match(/where id='?(\d+)'?/i);
        if (whereMatch) {
          const id = parseInt(whereMatch[1])

          const updates: any = {}
          
          if (query.includes('title=')) {
            const titleMatch = query.match(/title='([^']+)'/);
            if (titleMatch) updates.title = titleMatch[1]
          }
          
          if (query.includes('description=')) {
            const descMatch = query.match(/description='([^']+)'/);
            if (descMatch) updates.description = descMatch[1]
          }
          
          if (query.includes('instructor_id=')) {
            const instrMatch = query.match(/instructor_id=(\d+|null)/);
            if (instrMatch) {
              updates.instructor_id = instrMatch[1] === 'null' ? null : parseInt(instrMatch[1])
            }
          }
          
          if (query.includes('updated_at=now()')) {
            updates.updated_at = new Date().toISOString()
          }
          
          const { data, error } = await supabase
            .from('classes')
            .update(updates)
            .eq('id', id)
            .select('id, title, description, instructor_id, created_at, updated_at')
          
          if (error) throw error
          return { rows: (data as T[]) || [], rowCount: data?.length || 0 }
        }
      }
    }
    else if (queryLower.startsWith('delete')) {
      if (queryLower.includes('from classes')) {
        const idMatch = query.match(/where id='?(\d+)'?/i);
        if (idMatch) {
          const id = parseInt(idMatch[1])
          const { data, error } = await supabase
            .from('classes')
            .delete()
            .eq('id', id)
            .select('id')
          
          if (error) throw error
          return { rows: (data as T[]) || [], rowCount: data?.length || 0 }
        }
      }
    }

    const { data, error } = await supabase.rpc('execute_sql', { sql_query: query })
    
    if (error) {
      console.error('Supabase query error:', error)
      throw error
    }

    return {
      rows: data || [],
      rowCount: data ? data.length : 0
    }
  } catch (error) {
    console.error('Database query failed:', error)
    throw error
  }
}
