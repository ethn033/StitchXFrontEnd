import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Button } from "primeng/button";
import { Card } from "primeng/card";
import { InputNumber } from 'primeng/inputnumber';

@Component({
  selector: 'app-branch-setup',
  imports: [CommonModule, ReactiveFormsModule, Button, Card, InputNumber],
  templateUrl: './branch-setup.component.html',
  styleUrl: './branch-setup.component.css'
})
export class BranchSetupComponent {
  BranchCreateUpdateDto: any

  businessForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.businessForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      address: ['', [Validators.required, Validators.maxLength(200)]],
      phone: ['', [Validators.maxLength(20)]],
      latitude:  [undefined],  // Changed from empty string to null for number inputs
      longitude: [undefined],  // Changed from empty string to null for number inputs
    });
  }

  onSubmit() {
    if (this.businessForm?.valid) {
      console.log('Form submitted with values:', this.businessForm.value);
      this.businessForm.reset();
    } else {
      this.businessForm?.markAllAsTouched();
    }
  }
}
