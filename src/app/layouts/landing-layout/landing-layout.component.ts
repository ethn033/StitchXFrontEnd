import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
@Component({
  selector: 'app-landing-layout',
  imports: [CommonModule, CardModule, FormsModule, ReactiveFormsModule, CarouselModule, RatingModule, ButtonModule, RouterLink],
  templateUrl: './landing-layout.component.html',
  styleUrl: './landing-layout.component.css'
})
export class LandingLayoutComponent {
  inquiryForm: FormGroup;
  authService = inject(AuthService);

  testimonials = [
    {
      name: 'Rajesh Kumar',
      position: 'Master Tailor',
      business: 'Royal Stitches',
      text: 'Silai+ has transformed our business operations. We now handle 30% more orders with the same staff.',
      rating: 5,
      avatar: 'assets/images/testimonial-1.jpg'
    },
    {
      name: 'Priya Sharma',
      position: 'Owner',
      business: 'Elegant Boutique',
      text: 'The customer management system saved us countless hours. Measurements are now perfectly tracked.',
      rating: 5,
      avatar: 'assets/images/testimonial-2.jpg'
    },
    {
      name: 'Amit Patel',
      position: 'Manager',
      business: 'Fashion Hub',
      text: 'Our delivery times improved by 40% after implementing the order tracking system.',
      rating: 4,
      avatar: 'assets/images/testimonial-3.jpg'
    },
    {
      name: 'Sunita Devi',
      position: 'Tailor',
      business: 'Neha Fashions',
      text: 'The mobile access lets me check orders even when I\'m not in the shop. Very convenient!',
      rating: 5,
      avatar: 'assets/images/testimonial-4.jpg'
    }
  ];

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  constructor(private fb: FormBuilder) {
    this.inquiryForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    
  }

  onSubmit(): void {
    if (this.inquiryForm.valid) {
      this.inquiryForm.reset();
    }
  }
}
