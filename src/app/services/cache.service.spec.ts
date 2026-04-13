import { TestBed } from '@angular/core/testing';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CacheService]
    });
    service = TestBed.inject(CacheService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('set', () => {
    it('should store data in localStorage', () => {
      service.set('testKey', { name: 'test' });
      expect(localStorage.getItem('testKey')).toBeTruthy();
    });
  });

  describe('get', () => {
    it('should return null for non-existent key', () => {
      const result = service.get('nonexistent');
      expect(result).toBeNull();
    });

    it('should return cached data if not expired', () => {
      const data = { name: 'test' };
      service.set('key', data);
      const result = service.get('key');
      expect(result).toEqual(data);
    });

    it('should return null and remove expired entry', () => {
      const entry = {
        data: 'expired',
        timestamp: Date.now() - 3600000
      };
      localStorage.setItem('expiredKey', JSON.stringify(entry));
      const result = service.get('expiredKey');
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove specific key from cache', () => {
      service.set('keyToRemove', 'value');
      service.remove('keyToRemove');
      expect(localStorage.getItem('keyToRemove')).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear all cache entries', () => {
      service.set('key1', 'value1');
      service.set('key2', 'value2');
      service.clear();
      expect(localStorage.length).toBe(0);
    });
  });

  describe('isExpired', () => {
    it('should return true for past timestamp', () => {
      const past = Date.now() - 1000;
      expect(service.isExpired(past)).toBe(true);
    });

    it('should return false for future timestamp', () => {
      const future = Date.now() + 3600000;
      expect(service.isExpired(future)).toBe(false);
    });
  });
});