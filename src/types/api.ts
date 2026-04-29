export type ApiStatus = 'success' | 'error'

export interface ApiErrorResponse {
  status: 'error'
  message: string
}

export interface User {
  id: string
  username: string
  email: string
  avatar_url: string
  role: 'admin' | 'analyst'
  is_active: boolean
  last_login_at: string
  created_at: string
}

export interface Profile {
  id: string
  name: string
  gender: 'male' | 'female'
  gender_probability: number
  age: number
  age_group: 'child' | 'teenager' | 'adult' | 'senior'
  country_id: string
  country_name: string
  country_probability: number
  created_at: string
}

export interface PaginationLinks {
  self: string
  next: string | null
  prev: string | null
}

export interface PaginatedResponse<T> {
  status: 'success'
  page: number
  limit: number
  total: number
  total_pages: number
  links?: PaginationLinks
  data: T[]
}

export interface SingleResponse<T> {
  status: 'success'
  data: T
}

export interface AuthResponse {
  status: 'success'
  access_token: string
  refresh_token: string
}

export interface MessageResponse {
  status: ApiStatus
  message?: string
}
