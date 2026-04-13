import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { ProductDetail } from './product-detail';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

describe('ProductDetail', () => {
  let component: ProductDetail;
  let fixture: ComponentFixture<ProductDetail>;
  let productService: any;
  let cartService: any;

  const mockProduct: Product = {
    id: '1',
    brand: 'Apple',
    model: 'iPhone 14',
    price: 999,
    imgUrl: 'test.jpg',
    colors: ['Black', 'White'],
    options: {
      colors: [
        { code: 1, name: 'Black' },
        { code: 2, name: 'White' }
      ],
      storages: [
        { code: 1, name: '64GB' },
        { code: 2, name: '128GB' }
      ]
    }
  };

  const createMockProductService = (shouldFail = false) => ({
    getProducts: () => of([mockProduct]),
    getProductById: (id: string) => of(mockProduct),
    addToCart: (item: any) => shouldFail 
      ? throwError(() => new Error('error')) 
      : of({ count: 1 })
  });

  const mockCartService = {
    cartCount: signal(0),
    updateCartCount: () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetail],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } },
            paramMap: of({ get: () => '1' })
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: () => Promise.resolve(true)
          }
        },
        {
          provide: ProductService,
          useValue: createMockProductService()
        },
        {
          provide: CartService,
          useValue: mockCartService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetail);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    cartService = TestBed.inject(CartService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product by id from route param', () => {
    const spy = vi.spyOn(productService, 'getProductById').mockReturnValue(of(mockProduct));
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith('1');
  });

  it('should set product data', () => {
    component.ngOnInit();
    expect(component.product()).toBe(mockProduct);
  });

  it('should update selectedColor directly', () => {
    component.product.set(mockProduct);
    component.selectedColor = 2;
    expect(component.selectedColor).toBe(2);
  });

  it('should update selectedStorage directly', () => {
    component.product.set(mockProduct);
    component.selectedStorage = 2;
    expect(component.selectedStorage).toBe(2);
  });

  it('should call addToCart with correct item', () => {
    component.product.set(mockProduct);
    component.selectedColor = 1;
    component.selectedStorage = 1;
    const cartSpy = vi.spyOn(productService, 'addToCart').mockReturnValue(of({ count: 1 }));
    const updateSpy = vi.spyOn(cartService, 'updateCartCount');

    component.addToCart();

    expect(cartSpy).toHaveBeenCalledWith({
      id: '1',
      colorCode: 1,
      storageCode: 1
    });
    expect(updateSpy).toHaveBeenCalledWith(1);
  });

  it('should show success message after adding to cart', () => {
    component.product.set(mockProduct);
    component.selectedColor = 1;
    component.selectedStorage = 1;

    component.addToCart();
    fixture.detectChanges();

    expect(component.showSuccess()).toBe(true);
  });

  it('should show error message on addToCart failure', () => {
    component.product.set(mockProduct);
    component.selectedColor = 1;
    component.selectedStorage = 1;
    vi.spyOn(productService, 'addToCart').mockReturnValue(throwError(() => new Error('error')));

    component.addToCart();

    expect(component.showError()).toBe(true);
  });

  it('should handle empty string in isEmpty', () => {
    expect(component.isEmpty('')).toBe(true);
  });

  it('should handle non-empty string in isEmpty', () => {
    expect(component.isEmpty('test')).toBe(false);
  });

  it('should handle whitespace-only string in isEmpty', () => {
    expect(component.isEmpty('   ')).toBe(true);
  });

  it('should format camera with array', () => {
    const result = component.formatCamera(['12MP', '12MP']);
    expect(result).toBe('12MP, 12MP');
  });

  it('should format camera with string', () => {
    const result = component.formatCamera('12MP');
    expect(result).toBe('12MP');
  });

  it('should format camera with undefined', () => {
    const result = component.formatCamera(undefined);
    expect(result).toBe('-');
  });

  it('should not add to cart without product', () => {
    component.product.set(null);
    component.selectedColor = 1;
    component.selectedStorage = 1;
    const spy = vi.spyOn(productService, 'addToCart');

    component.addToCart();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should not add to cart without selections', () => {
    component.product.set(mockProduct);
    component.selectedColor = 0;
    component.selectedStorage = 0;
    const spy = vi.spyOn(productService, 'addToCart');

    component.addToCart();

    expect(spy).not.toHaveBeenCalled();
  });
});