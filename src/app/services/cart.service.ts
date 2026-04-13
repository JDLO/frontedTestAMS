import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartCount = signal(0);

  updateCartCount(count: number): void {
    this.cartCount.set(count);
  }
}
