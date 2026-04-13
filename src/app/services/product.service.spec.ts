import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProducts = [
    { id: '1', name: 'Product 1', price: 100, image: 'img1.jpg' },
    { id: '2', name: 'Product 2', price: 200, image: 'img2.jpg' }
  ];

  const mockProduct = { id: '1', name: 'Product 1', price: 100, image: 'img1.jpg' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should fetch products from API', () => {
      service.getProducts().subscribe(products => {
        expect(products).toEqual(mockProducts);
      });

      const req = httpMock.expectOne('/api/product');
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });
  });

  describe('getProductById', () => {
    it('should fetch product by id from API', () => {
      service.getProductById('1').subscribe(product => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne('/api/product/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });
  });

  describe('addToCart', () => {
    it('should POST to cart endpoint', () => {
      const cartItem = { id: '1', colorCode: 1, storageCode: 1 };
      const cartResponse = { success: true, cartId: 'cart-1' };

      service.addToCart(cartItem).subscribe(response => {
        expect(response).toEqual(cartResponse);
      });

      const req = httpMock.expectOne('/api/cart');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(cartItem);
      req.flush(cartResponse);
    });
  });
});