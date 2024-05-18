export function sharedFunction<T>(value: T): T | null {
  return value || null
}

interface sharedType {
  shared: boolean
}

export type { sharedType }
