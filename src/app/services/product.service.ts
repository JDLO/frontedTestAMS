import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { CartItem } from '../models/car-item.model';
import { CartResponse } from '../models/car-response.model';
import { Product } from '../models/product.model';
import { CacheService } from './cache.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private cache = inject(CacheService);
  private cokies = inject(CookieService);
  // private apiUrl = 'https://itx-frontend-test.onrender.com/api';
  private apiUrl = '/api';

  private cacheKeys = {
    productsList: 'products_list',
    productDetail: (id: string) => `product_${id}`
  };

  getProducts(): Observable<Product[]> {
    const cached = this.cache.get<Product[]>(this.cacheKeys.productsList);
    if (cached) {
      return of(cached);
    }

    return this.http.get<Product[]>(`${this.apiUrl}/product`).pipe(
      tap(data => this.cache.set(this.cacheKeys.productsList, data))
    );
  }

  getProductById(id: string): Observable<Product> {
    const cached = this.cache.get<Product>(this.cacheKeys.productDetail(id));
    if (cached) {
      return of(cached);
    }

    return this.http.get<Product>(`${this.apiUrl}/product/${id}`).pipe(
      tap(data => this.cache.set(this.cacheKeys.productDetail(id), data))
    );
  }

  addToCart(item: CartItem): Observable<CartResponse> {
    return this.http.post<CartResponse>(
      `${this.apiUrl}/cart`,
      item,
      { withCredentials: true }
    );
  }
}