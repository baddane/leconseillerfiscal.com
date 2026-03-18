const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
const PHONE_RE = /^[\d\s\-+().]{7,20}$/

export function isValidEmail(email: unknown): email is string {
  return typeof email === 'string' && email.length <= 254 && EMAIL_RE.test(email)
}

export function isValidPhone(phone: unknown): phone is string {
  if (!phone || typeof phone !== 'string') return true // optional field
  return PHONE_RE.test(phone.trim())
}

export function sanitizeText(text: unknown, maxLength = 5000): string {
  if (typeof text !== 'string') return ''
  return text.trim().slice(0, maxLength)
}

export function isNonEmpty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

/** Max body size check — returns true if body is too large */
export function isBodyTooLarge(contentLength: string | null, maxBytes = 10_000): boolean {
  if (!contentLength) return false
  const size = parseInt(contentLength, 10)
  return !isNaN(size) && size > maxBytes
}
