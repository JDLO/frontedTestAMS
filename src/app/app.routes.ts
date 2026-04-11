import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';

export const routes: Routes = [
    { path: '', component: ProductList },
  {
    path: 'product/:id',
    loadComponent: () => import('./components/product-detail/product-detail')
      .then(m => m.ProductDetail)
  },
  { path: '**', redirectTo: '' }
];
