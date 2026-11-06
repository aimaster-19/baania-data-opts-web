// Shared helpers for extracting human-readable messages from API/axios errors
// without resorting to `any`.

export interface ApiErrorShape {
  response?: {
    data?: {
      message?: string
      errors?: { field: string; message: string }[]
    }
  }
  message?: string
}

/**
 * Pull a user-facing message out of an unknown thrown value.
 * Prefers API validation errors (422), then the API message, then the JS
 * error message, then the provided fallback.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = 'เกิดข้อผิดพลาด'
): string {
  const e = error as ApiErrorShape
  const validation = e?.response?.data?.errors
  if (validation?.length) {
    return validation.map((v) => `• ${v.message}`).join('\n')
  }
  return e?.response?.data?.message || e?.message || fallback
}
