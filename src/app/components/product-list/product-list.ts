import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductItem } from '../product-item/product-item';
import { Search } from '../search/search';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, ProductItem, Search],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  searchTerm = signal<string>('');
  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.products().filter(p =>
      p.brand.toLowerCase().includes(term) ||
      p.model.toLowerCase().includes(term)
    );
  });
  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Error fetching products', err)
    });
  }
  onSearch(term: string): void {
    this.searchTerm.set(term);
  }
}
