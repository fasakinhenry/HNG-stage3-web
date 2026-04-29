import type {
  ApiErrorResponse,
  AuthResponse,
  MessageResponse,
  PaginatedResponse,
  Profile,
  SingleResponse,
  User,
} from '../types/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const API_VERSION = '1'
const API_ROOT = '/api'

let csrfToken = ''

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function buildUrl(path: string): string {
  return `${API_BASE_URL}${path}`
}

function toQuery(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.append(key, String(value))
    }
  })
  const asString = query.toString()
  return asString ? `?${asString}` : ''
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return (await response.json()) as T
  }

  let message = 'Request failed'
  try {
    const payload = (await response.json()) as ApiErrorResponse
    if (payload.message) {
      message = payload.message
    }
  } catch {
    message = response.statusText || message
  }

  throw new ApiError(message, response.status)
}

async function ensureCsrfToken(): Promise<void> {
  if (csrfToken) {
    return
  }

  const response = await fetch(buildUrl(`${API_ROOT}/auth/csrf`), {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    return
  }

  const payload = (await response.json()) as { status: string; csrf_token?: string }
  if (payload.csrf_token) {
    csrfToken = payload.csrf_token
  }
}

async function refreshSession(): Promise<void> {
  await ensureCsrfToken()

  const response = await fetch(buildUrl(`${API_ROOT}/auth/refresh`), {
    method: 'POST',
    credentials: 'include',
    headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined,
  })

  if (!response.ok) {
    throw new ApiError('Session expired. Please sign in again.', response.status)
  }

  await response.json() as AuthResponse
}

async function requestJson<T>(
  path: string,
  init: RequestInit = {},
  requiresVersion = true,
  retryOnUnauthorized = true,
  retried = false
): Promise<T> {
  const method = (init.method || 'GET').toUpperCase()
  const isMutating = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)

  if (isMutating) {
    await ensureCsrfToken()
  }

  const headers = new Headers(init.headers)
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json')
  }
  if (requiresVersion) {
    headers.set('X-API-Version', API_VERSION)
  }
  if (isMutating && csrfToken) {
    headers.set('X-CSRF-Token', csrfToken)
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    method,
    credentials: 'include',
    headers,
  })

  if (
    retryOnUnauthorized &&
    response.status === 401 &&
    !retried &&
    path !== `${API_ROOT}/auth/refresh`
  ) {
    await refreshSession()
    return requestJson(path, init, requiresVersion, retryOnUnauthorized, true)
  }

  return parseResponse<T>(response)
}

async function requestBlob(path: string): Promise<Blob> {
  const response = await fetch(buildUrl(path), {
    method: 'GET',
    credentials: 'include',
    headers: {
      'X-API-Version': API_VERSION,
    },
  })

  if (response.status === 401) {
    await refreshSession()
    return requestBlob(path)
  }

  if (!response.ok) {
    let message = 'Failed to download file'
    try {
      const payload = (await response.json()) as ApiErrorResponse
      if (payload.message) {
        message = payload.message
      }
    } catch {
      message = response.statusText || message
    }
    throw new ApiError(message, response.status)
  }

  return response.blob()
}

export const api = {
  loginUrl: buildUrl(`${API_ROOT}/auth/github`),

  async getMe() {
    return requestJson<SingleResponse<User>>(`${API_ROOT}/auth/me`, {}, false, false)
  },

  async logout() {
    return requestJson<MessageResponse>(`${API_ROOT}/auth/logout`, { method: 'POST' }, false)
  },

  async getProfiles(params: Record<string, string | number | undefined>) {
    return requestJson<PaginatedResponse<Profile>>(`${API_ROOT}/profiles${toQuery(params)}`)
  },

  async getProfile(id: string) {
    return requestJson<SingleResponse<Profile>>(`${API_ROOT}/profiles/${id}`)
  },

  async searchProfiles(
    q: string,
    params: Record<string, string | number | undefined>
  ) {
    return requestJson<PaginatedResponse<Profile>>(
      `${API_ROOT}/profiles/search${toQuery({ q, ...params })}`
    )
  },

  async createProfile(name: string) {
    return requestJson<SingleResponse<Profile>>(`${API_ROOT}/profiles`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    })
  },

  async exportProfilesCsv(params: Record<string, string | number | undefined>) {
    return requestBlob(`${API_ROOT}/profiles/export${toQuery({ format: 'csv', ...params })}`)
  },
}
