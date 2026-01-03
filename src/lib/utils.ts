import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sqmToSqft = (sqm: number) => sqm * 10.7639
export const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))
export const formatCurrency = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}
export const formatNumber = (number: number) => {
  return new Intl.NumberFormat("en-US").format(number)
}
export const formatPercentage = (value: number) => {
  return `${(value * 100).toFixed(2)}%`
}
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
export const generateRandomId = (length: number = 8) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
export const capitalize = (str: string) => {
  if (str.length === 0) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}
export const truncateString = (str: string, maxLength: number) => {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + "..."
}
export const isValidEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email.toLowerCase())
}
export const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<F>): void => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), waitFor)
  }
}
export const throttle = <F extends (...args: any[]) => any>(func: F, limit: number) => {
  let inThrottle: boolean
  return (...args: Parameters<F>): void => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
export const parseJSON = <T>(jsonString: string, defaultValue: T): T => {
  try {
    return JSON.parse(jsonString) as T
  } catch {
    return defaultValue
  }
}
export const buildQueryString = (params: Record<string, string | number | boolean | undefined>) => {
  const query = new URLSearchParams()
  for (const key in params) {
    const value = params[key]
    if (value !== undefined) {
      query.append(key, String(value))
    }
  }
  return query.toString()
}
export const parseQueryString = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString)
  const result: Record<string, string> = {}
  params.forEach((value, key) => {
    result[key] = value
  })
  return result
}
export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
export const arrayChunk = <T>(array: T[], size: number): T[][] => {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}
export const arrayShuffle = <T>(array: T[]): T[] => {
  const result = array.slice()
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}
export const isObjectEmpty = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}