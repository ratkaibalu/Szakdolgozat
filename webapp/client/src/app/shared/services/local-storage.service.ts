import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  constructor() {}

  setItem<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem<T>(key: string): T | null {
    let result: T | null = null;
    try {
      const item = localStorage.getItem(key);
      if (item) {
        result = JSON.parse(item) as T;
      }
    } catch (e) {}
    return result;
  }

  removeItem(key: string) {
    try {
      localStorage.removeItem(key);
    }
    catch(e) {}
  }
}
