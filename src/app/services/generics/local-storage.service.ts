import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  
  constructor() { }
  
  /**
  * Sets an item in localStorage with optional JSON stringification
  * @param key The storage key (must be a non-empty string)
  * @param value The value to store (will be stringified if parseJson is true)
  * @param parseJson Whether to JSON.stringify the value (default: false)
  * @throws {Error} If key is invalid or stringification fails
  */
  setItem(key: string, value: string | object, parseJson: boolean = false): void {
    // Validate key
    if (!key?.trim()) {
      throw new Error('LocalStorage key must be a non-empty string');
    }
    
    // Validate value (empty string is allowed)
    if (value === null || value === undefined) {
      throw new Error('LocalStorage value cannot be null or undefined');
    }
    
    // Handle stringification if needed
    const storageValue = parseJson 
    ? this.safeStringify(value)
    : typeof value === 'string' 
    ? value 
    : String(value);
    
    // Perform storage operation
    try {
      localStorage.setItem(key, storageValue);
    } catch (e) {
      const error = e as DOMException;
      if (error.name === 'QuotaExceededError') {
        throw new Error('LocalStorage quota exceeded');
      }
      throw new Error(`Failed to set localStorage item: ${error.message}`);
    }
  }
  
  /**
  * Safely stringify values with error handling
  * @param value The value to stringify
  * @returns JSON string
  * @throws {Error} If stringification fails
  */
  private safeStringify(value: any): string {
    try {
      return JSON.stringify(value);
    } catch (e) {
      throw new Error(`Failed to stringify value for localStorage: ${(e as Error).message}`);
    }
  }
  
  /**
  * Retrieves an item from localStorage with optional JSON parsing
  * @param key The storage key to retrieve
  * @param parseJson Whether to parse the stored value as JSON (default: false)
  * @returns The stored value (string or parsed object), or null if not found/invalid
  * @throws {Error} If JSON parsing fails (when parseJson=true)
  */
  getItem(key: string, parseJson: boolean = false): string | any | null {
    // Validate key
    if (!key?.trim()) {
      throw new Error('LocalStorage key must be a non-empty string');
    }
    
    // Retrieve item
    const item = localStorage.getItem(key);
    
    // Return null for non-existent items
    if (item === null) {
      return null;
    }
    
    // Return raw string if parsing not requested
    if (!parseJson) {
      return item;
    }
    
    // Attempt to parse JSON
    try {
      return this.safeJsonParse(item);
    } catch (e) {
      console.error(`Failed to parse localStorage item for key "${key}":`, e);
      // Optional: Remove corrupted data
      this.removeItem(key);
      return null;
    }
  }
  
  /**
  * Safely parses JSON with proper error handling
  * @param jsonString The JSON string to parse
  * @returns Parsed JavaScript value
  * @throws {Error} If parsing fails
  */
  private safeJsonParse(jsonString: string): any {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      throw new Error(`Invalid JSON format: ${(e as Error).message}`);
    }
  }
  
  
  /**
  * Removes an item from localStorage
  * @param key The key of the item to remove
  * @throws {Error} If key is invalid or localStorage operation fails
  */
  removeItem(key: string): void {
    // Validate key
    if (!key?.trim()) {
      throw new Error('LocalStorage key must be a non-empty string');
    }
    
    // Check localStorage availability
    if (!this.isLocalStorageAvailable()) {
      throw new Error('LocalStorage is not available');
    }
    
    try {
      localStorage.removeItem(key);
    } catch (e) {
      throw new Error(`Failed to remove localStorage item: ${(e as DOMException).message}`);
    }
  }
  
  /**
  * Checks if localStorage is available
  * @returns boolean indicating localStorage availability
  */
  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  /**
  * Clears all items from localStorage
  * @throws {Error} If localStorage operation fails
  */
  clear(): void {
    // Check localStorage availability
    if (!this.isLocalStorageAvailable()) {
      throw new Error('LocalStorage is not available');
    }
    
    try {
      localStorage.clear();
    } catch (e) {
      throw new Error(`Failed to clear localStorage: ${(e as DOMException).message}`);
    }
  }
}
