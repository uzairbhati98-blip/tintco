/**
 * Order Number Generator
 * 
 * Generates sequential order numbers in format: TINT-0001, TINT-0002, etc.
 * Uses localStorage to persist counter across sessions
 */

const ORDER_COUNTER_KEY = 'tintco-order-counter'

/**
 * Get the next order number
 * @returns Order number in format TINT-XXXX
 */
export function getNextOrderNumber(): string {
  // Get current counter from localStorage
  const currentCounter = parseInt(localStorage.getItem(ORDER_COUNTER_KEY) || '0', 10)
  
  // Increment counter
  const nextCounter = currentCounter + 1
  
  // Save to localStorage
  localStorage.setItem(ORDER_COUNTER_KEY, nextCounter.toString())
  
  // Format as TINT-XXXX (4 digits, zero-padded)
  const orderNumber = `TINT-${nextCounter.toString().padStart(4, '0')}`
  
  return orderNumber
}

/**
 * Get current order counter (for testing/debugging)
 * @returns Current counter value
 */
export function getCurrentOrderCounter(): number {
  return parseInt(localStorage.getItem(ORDER_COUNTER_KEY) || '0', 10)
}

/**
 * Reset order counter (for testing only)
 * WARNING: Only use in development!
 */
export function resetOrderCounter(): void {
  if (process.env.NODE_ENV === 'development') {
    localStorage.setItem(ORDER_COUNTER_KEY, '0')
    console.log('Order counter reset to 0')
  } else {
    console.warn('Cannot reset order counter in production')
  }
}

/**
 * Set order counter to specific value (for migration/setup)
 * @param count - The counter value to set
 */
export function setOrderCounter(count: number): void {
  if (count < 0) {
    console.error('Order counter cannot be negative')
    return
  }
  localStorage.setItem(ORDER_COUNTER_KEY, count.toString())
  console.log(`Order counter set to ${count}`)
}

/**
 * Validate order number format
 * @param orderNumber - Order number to validate
 * @returns true if valid TINT-XXXX format
 */
export function isValidOrderNumber(orderNumber: string): boolean {
  return /^TINT-\d{4}$/.test(orderNumber)
}

/**
 * Extract order number from TINT-XXXX format
 * @param orderNumber - Order number in TINT-XXXX format
 * @returns The numeric part (e.g., 1 from TINT-0001)
 */
export function extractOrderNumber(orderNumber: string): number | null {
  const match = orderNumber.match(/^TINT-(\d{4})$/)
  return match ? parseInt(match[1], 10) : null
}