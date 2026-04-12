import { Injectable } from '@angular/core';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private defaultTTL = 3600000;

  get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const entry: CacheEntry<T> = JSON.parse(item);
    if (this.isExpired(entry.timestamp)) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now() + ttl
    };
    localStorage.setItem(key, JSON.stringify(entry));
  }

  isExpired(timestamp: number): boolean {
    return Date.now() > timestamp;
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}