import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a dynamic ID or locator part to challenge automation engineers.
 * In a real app, these might be stable, but for this practice site, 
 * we can make them change or use obfuscated patterns.
 */
export function getDynamicId(prefix: string) {
  // For this practice site, we'll append a semi-stable but "ugly" suffix
  // In a real "hard" mode, we could use a session-based random string.
  return `${prefix}-${Math.random().toString(36).substring(2, 7)}`;
}

// We'll use a stable seed for the session to make it testable but "look" dynamic
const sessionSeed = Math.random().toString(36).substring(2, 6);
export function getSessionId(base: string) {
  return `${base}_${sessionSeed}`;
}
