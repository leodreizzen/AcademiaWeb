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

export function getFullUrl(path: string): string{
  if(!process.env.VERCEL_URL){
    throw new Error("VERCEL_URL not set")
  }
  if(process.env.VERCEL)
    return `https://${process.env.VERCEL_URL}${path}`
  else
    return `http://${process.env.VERCEL_URL}${path}`
}