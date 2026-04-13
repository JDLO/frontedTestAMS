import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { ProductList } from './product-list';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  let productService: ProductService;

  const mockProducts: Product[] = [
    {
      id: '1',
      brand: 'Apple',
      model: 'iPhone 14',
      price: 999,
      imgUrl: 'test1.jpg',
      colors: ['Black'],
      options: {
        colors: [{ code: 1, name: 'Black' }],
        storages: [{ code: 1, name: '64GB' }]
      }
    },
    {
      id: '2',
      brand: 'Samsung',
      model: 'Galaxy S23',
      price: 899,
      imgUrl: 'test2.jpg',
      colors: ['White'],
      options: {
        colors: [{ code: 2, name: 'White' }],
        storages: [{ code: 2, name: '128GB' }]
      }
    }
  ];

  const mockProductService = {
    getProducts: () => of(mockProducts),
    getProductById: () => of(mockProducts[0]),
    addToCart: () => of({ count: 1 })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService
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

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    const spy = vi.spyOn(productService, 'getProducts').mockReturnValue(of(mockProducts));
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should filter products by brand', () => {
    component.products.set(mockProducts);
    component.searchTerm.set('apple');
    fixture.detectChanges();

    const filtered = component.filteredProducts();
    expect(filtered.length).toBe(1);
    expect(filtered[0].brand).toBe('Apple');
  });

  it('should filter products by model', () => {
    component.products.set(mockProducts);
    component.searchTerm.set('iphone');
    fixture.detectChanges();

    const filtered = component.filteredProducts();
    expect(filtered.length).toBe(1);
    expect(filtered[0].model).toBe('iPhone 14');
  });

  it('should filter case-insensitive', () => {
    component.products.set(mockProducts);
    component.searchTerm.set('SAMSUNG');
    fixture.detectChanges();

    const filtered = component.filteredProducts();
    expect(filtered.length).toBe(1);
    expect(filtered[0].brand).toBe('Samsung');
  });

  it('should return all products when search is empty', () => {
    component.products.set(mockProducts);
    component.searchTerm.set('');
    fixture.detectChanges();

    const filtered = component.filteredProducts();
    expect(filtered.length).toBe(2);
  });

  it('should update search term on search', () => {
    component.onSearch('test');
    expect(component.searchTerm()).toBe('test');
  });

  it('should render product items', () => {
    component.products.set(mockProducts);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('app-product-item');
    expect(items.length).toBe(2);
  });
});
