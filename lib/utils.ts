import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ✅ Add this
export const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// ✅ And this
export function createUrl(path: string, params?: Record<string, string>) {
  const url = new URL(path, baseUrl)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }
  return url.toString()
}

export function ensureStartsWith<T extends string>(
  string: T,
  start: string
): T {
  return string.startsWith(start) ? string : (start + string) as T
}