import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
}

export function normalizeDoubleLetters(text: string): string {
  return text.replace(/(.)\1+/g, '$1')
}

export function fuzzyMatch(guess: string, actual: string): boolean {
  const normalizedGuess = normalizeDoubleLetters(normalizeText(guess))
  const normalizedActual = normalizeDoubleLetters(normalizeText(actual))
  return normalizedGuess === normalizedActual
}
