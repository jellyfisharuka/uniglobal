import { UserProfile } from "@/services/userService";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getUserFromStorage = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;

  const userInfo = localStorage.getItem('userInfo');
  if (!userInfo) return null;

  try {
    return JSON.parse(userInfo) as UserProfile;
  } catch (error) {
    console.error('Error parsing user info from localStorage:', error);
    return null;
  }
}

export const getUserGender = (): string => {
  const user = getUserFromStorage();
  return user?.gender || 'male';
}