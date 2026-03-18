// Validate environment variables at import time
// Non-critical vars are logged as warnings; critical ones throw at runtime when needed

const requiredForApi = ['RESEND_API_KEY', 'BREVO_API_KEY'] as const

export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`[env] Missing required environment variable: ${name}`)
  }
  return value
}

export function getEnvInt(name: string): number | null {
  const raw = process.env[name]
  if (!raw) return null
  const parsed = parseInt(raw, 10)
  if (isNaN(parsed)) {
    console.error(`[env] Invalid integer for ${name}: "${raw}"`)
    return null
  }
  return parsed
}

// Log warnings for missing optional vars in development
if (process.env.NODE_ENV === 'development') {
  for (const name of requiredForApi) {
    if (!process.env[name]) {
      console.warn(`[env] ${name} is not set — API will run in dev/log mode`)
    }
  }
}
