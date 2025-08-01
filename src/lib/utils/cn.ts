/**
 * Class name utility function
 * Combines clsx for optimal className handling
 */

import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}