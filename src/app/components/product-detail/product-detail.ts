import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/car-item.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatSelectModule, MatFormFieldModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | null>(null);
  selectedStorage = 0;
  selectedColor = 0;
  showSuccess = signal(false);
  showError = signal(false);
  loading = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (data) => {
          this.product.set(data)
          if (data.options?.storages?.length === 1) {
            this.selectedStorage = this.isEmpty(data.options.storages[0].name) ? 0 : data.options.storages[0].code;
          }
          if (data.options?.colors?.length === 1) {
            this.selectedColor = this.isEmpty(data.options.colors[0].name) ? 0 : data.options.colors[0].code;
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
        this.cartService.updateCartCount(response.count);
        this.showSuccess.set(true);
        this.loading.set(false);
        setTimeout(() => this.showSuccess.set(false), 3000);
      },
      error: (err) => {
        console.error('Error adding to cart', err);
        this.showError.set(true);
        this.loading.set(false);
        setTimeout(() => this.showError.set(false), 3000);
      }
    });
  }

  formatCamera(camera: string[] | string | undefined): string {
    if (!camera) return '-';
    if (Array.isArray(camera)) return camera.join(', ');
    return camera;
  }

  isEmpty(str: string): boolean{
    if (str.trim().length === 0){
      return true
    }
    return false
  }
}