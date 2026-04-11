import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/car-item.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | null>(null);
  selectedStorage = '';
  selectedColor = '';
  showSuccess = signal(false);
  loading = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (data) => {
          this.product.set(data)
          if (data.options?.storages?.length === 1) {
            this.selectedStorage = data.options.storages[0].code.toString();
          }
          if (data.options?.colors?.length === 1) {
            this.selectedColor = data.options.colors[0].code.toString();
          }
        },
        error: (err) => console.error('Error fetching product', err)
      });
      console.log(this.product);
    }

  }

  addToCart(): void {
    const prod = this.product();
    if (!prod || !this.selectedStorage || !this.selectedColor) return;

    this.loading.set(true);
    const item: CartItem = {
      id: prod.id,
      colorCode: Number(this.selectedColor),
      storageCode: Number(this.selectedStorage)
    };

    this.productService.addToCart(item).subscribe({
      next: (response) => {
        debugger;
        this.cartService.updateCartCount(response.count);
        this.showSuccess.set(true);
        this.loading.set(false);
        setTimeout(() => this.showSuccess.set(false), 3000);
      },
      error: (err) => {
        console.error('Error adding to cart', err);
        this.loading.set(false);
      }
    });
  }
}