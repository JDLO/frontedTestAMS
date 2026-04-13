import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

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
});