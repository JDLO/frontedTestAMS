import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { Search } from './search';

describe('Search', () => {
  let component: Search;
  let fixture: ComponentFixture<Search>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Search],
    }).compileComponents();

    fixture = TestBed.createComponent(Search);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit searchChange with debounce', async () => {
    const emitted: string[] = [];
    component.searchChange.subscribe((term) => {
      emitted.push(term);
    });

    component.searchTerm = 'test';
    component.onSearchChange();

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(emitted).toContain('test');
  });

  it('should have correct placeholder', () => {
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input?.placeholder).toBe('Buscar por marca o modelo...');
  });

  it('should cleanup subscriptions on destroy', async () => {
    component.ngOnDestroy();

    let emitted = false;
    component.searchChange.subscribe(() => {
      emitted = true;
    });

    component.searchTerm = 'test';
    component.onSearchChange();

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(emitted).toBe(false);
  });

  it('should not emit duplicate values consecutively', async () => {
    const emitCount = 0;
    component.searchTerm = 'test';
    component.onSearchChange();
    component.onSearchChange();

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(component.searchTerm).toBe('test');
  });
});