import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from '../models/car-item.model';
import { CartResponse } from '../models/car-response.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'https://itx-frontend-test.onrender.com/api';
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product`);
  }
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/product/${id}`);
  }
  addToCart(item: CartItem): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.apiUrl}/cart`, item);
  }
}