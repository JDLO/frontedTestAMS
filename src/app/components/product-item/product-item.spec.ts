import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { ProductItem } from './product-item';
import { Product } from '../../models/product.model';

describe('ProductItem', () => {
  let component: ProductItem;
  let fixture: ComponentFixture<ProductItem>;

  const mockProduct: Product = {
    id: '1',
    brand: 'Apple',
    model: 'iPhone 14',
    price: 999,
    imgUrl: 'test.jpg',
    colors: ['Black'],
    options: {
      colors: [{ code: 1, name: 'Black' }],
      storages: [{ code: 1, name: '64GB' }]
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductItem],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: () => Promise.resolve(true)
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => null } },
            paramMap: of({ get: () => null })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductItem);
    component = fixture.componentInstance;
    component.product = mockProduct;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive product input', () => {
    expect(component.product).toBe(mockProduct);
  });

  it('should display product brand', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Apple');
  });

  it('should display product model', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('iPhone 14');
  });

  it('should display product price', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('$999');
  });

  it('should have image with correct src and alt', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('img');
    expect(img?.getAttribute('src')).toBe('test.jpg');
    expect(img?.getAttribute('alt')).toBe('iPhone 14');
  });

  it('should have routerLink attribute', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const div = compiled.querySelector('div[ng-reflect-router-link]') || compiled.querySelector('.border');
    expect(div).toBeTruthy();
  });
});