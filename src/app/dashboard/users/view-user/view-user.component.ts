import { Component, Input } from '@angular/core';
import { ERole } from '../../../enums/enums';
import { UserResponse } from '../../../Dtos/responses/loginResponseDto';
import { Tag } from "primeng/tag";
import { Card } from "primeng/card";
import { Avatar } from "primeng/avatar";
import {  ChipModule } from "primeng/chip";
import { CommonModule } from '@angular/common';
import { Button } from "primeng/button";
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-view-user',
  imports: [CommonModule, Card, Avatar, ChipModule, TabsModule, Tag, Button],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.css'
})
export class ViewCustomerComponent {
  
  @Input() user!: UserResponse;

  getInitials(firstName?: string, lastName?: string): string {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  }

  getRandomColor(): string {
    const colors = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getRoleSeverity(role: string | ERole): string {
    switch(role) {
      case ERole.SHOP_OWNER:
      case 'ADMIN':
        return 'danger';
      case ERole.SOFT_OWNER:
      case 'SOFT_OWNER':
        return 'warning';
      case ERole.CUSTOMER:
      case 'CUSTOMER':
        return 'info';
      default:
        return 'success';
    }
  }
}
