import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function minDigits(digits: number): number{
  return 10 ** (digits - 1)
}

export function maxDigits(digits: number): number{
  return 10 ** digits - 1
}