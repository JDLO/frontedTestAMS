import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { Header } from './header';
import { CartService } from '../../services/cart.service';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  const mockCartService = {
    cartCount: signal(0),
    updateCartCount: () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        {
          provide: Router,
          useValue: {
            events: of(new NavigationEnd(0, '/', '/')),
            navigate: () => Promise.resolve(true),
            url: '/'
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => null } },
            paramMap: of({ get: () => null })
          }
        },
        {
          provide: CartService,
          useValue: mockCartService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display cart count', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const cartElement = compiled.querySelector('.bg-gray-100');
    expect(cartElement?.textContent).toContain('0');
  });

  it('should show "Inicio" breadcrumb on home page', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Inicio');
  });
});