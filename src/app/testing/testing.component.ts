import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { Ripple } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FileUpload } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { RadioButton } from 'primeng/radiobutton';
import { Rating, RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';


class Product {
    id?: string;
    code?: string;
    name?: string;

    image?: string;
    price?: number;
    category?: string;
    status?: string;
    description?: string;
    rating?: number;
    quantity?: number;
    tags?: string[];
    createdAt?: Date;
    updatedAt?: Date;
    [key: string]: any; // Allow additional properties
}

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
  selector: 'app-testing',
  imports: [ButtonModule, TableModule, RatingModule, SelectModule, ToastModule, ToolbarModule, InputTextModule, TextareaModule, CommonModule, FileUpload, DropdownModule, Tag, Rating, InputTextModule, FormsModule, IconFieldModule, InputIconModule],
  providers: [MessageService, ConfirmationService],
  styles: [
    `:host ::ng-deep .p-dialog .product-image {
      width: 150px;
      margin: 0 auto 2rem auto;
      display: block;
    }`
  ],
  templateUrl: './testing.component.html',
  styleUrl: './testing.component.css'
})
export class TestingComponent {
   productDialog: boolean = false;

    products!: Product[];

    product!: Product;

    selectedProducts!: Product[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    exportColumns!: ExportColumn[];

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private cd: ChangeDetectorRef
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
    }
    
    loadDemoData() {
        
      let data =  [
            {
                id: '1000',
                code: 'f230fh0g3',
                name: 'Bamboo Watch',
                image: 'bamboo-watch.jpg',
                price: 65,
                category: 'Accessories',
                status: 'INSTOCK',
                description: 'A wooden watch made from bamboo.',
                rating: 4.5,
                quantity: 10,
                inventoryStatus: 'INSTOCK',
                tags: ['eco-friendly', 'wooden'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '1001',
                code: 'nvklal433',
                name: 'Black Watch',
                inventoryStatus: 'INSTOCK',
                image: 'black-watch.jpg',
                price: 72,
                category: 'Accessories',
                status: 'LOWSTOCK',
                description: 'A stylish black watch.',
                rating: 4.0,
                quantity: 5,
                tags: ['stylish', 'black'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '1002',
                code: 'zz21cz3c1',
                name: 'Blue Band Watch',
                image: 'blue-band-watch.jpg',
                inventoryStatus: 'INSTOCK',
                price: 79,
                category: 'Accessories',
                status: 'OUTOFSTOCK',
                description: 'A blue band watch with a modern design.',
                rating: 3.5,
                quantity: 0,
                tags: ['modern', 'blue'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
          {
                id: '1000',
                code: 'f230fh0g3',
                name: 'Bamboo Watch',
                image: 'bamboo-watch.jpg',
                price: 65,
                category: 'Accessories',
                status: 'INSTOCK',
                description: 'A wooden watch made from bamboo.',
                rating: 4.5,
                quantity: 10,
                inventoryStatus: 'INSTOCK',
                tags: ['eco-friendly', 'wooden'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '1001',
                code: 'nvklal433',
                name: 'Black Watch',
                inventoryStatus: 'INSTOCK',
                image: 'black-watch.jpg',
                price: 72,
                category: 'Accessories',
                status: 'LOWSTOCK',
                description: 'A stylish black watch.',
                rating: 4.0,
                quantity: 5,
                tags: ['stylish', 'black'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '1002',
                code: 'zz21cz3c1',
                name: 'Blue Band Watch',
                image: 'blue-band-watch.jpg',
                inventoryStatus: 'INSTOCK',
                price: 79,
                category: 'Accessories',
                status: 'OUTOFSTOCK',
                description: 'A blue band watch with a modern design.',
                rating: 3.5,
                quantity: 0,
                tags: ['modern', 'blue'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
          {
                id: '1000',
                code: 'f230fh0g3',
                name: 'Bamboo Watch',
                image: 'bamboo-watch.jpg',
                price: 65,
                category: 'Accessories',
                status: 'INSTOCK',
                description: 'A wooden watch made from bamboo.',
                rating: 4.5,
                quantity: 10,
                inventoryStatus: 'INSTOCK',
                tags: ['eco-friendly', 'wooden'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '1001',
                code: 'nvklal433',
                name: 'Black Watch',
                inventoryStatus: 'INSTOCK',
                image: 'black-watch.jpg',
                price: 72,
                category: 'Accessories',
                status: 'LOWSTOCK',
                description: 'A stylish black watch.',
                rating: 4.0,
                quantity: 5,
                tags: ['stylish', 'black'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '1002',
                code: 'zz21cz3c1',
                name: 'Blue Band Watch',
                image: 'blue-band-watch.jpg',
                inventoryStatus: 'INSTOCK',
                price: 79,
                category: 'Accessories',
                status: 'OUTOFSTOCK',
                description: 'A blue band watch with a modern design.',
                rating: 3.5,
                quantity: 0,
                tags: ['modern', 'blue'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
          {
                id: '1000',
                code: 'f230fh0g3',
                name: 'Bamboo Watch',
                image: 'bamboo-watch.jpg',
                price: 65,
                category: 'Accessories',
                status: 'INSTOCK',
                description: 'A wooden watch made from bamboo.',
                rating: 4.5,
                quantity: 10,
                inventoryStatus: 'INSTOCK',
                tags: ['eco-friendly', 'wooden'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '1001',
                code: 'nvklal433',
                name: 'Black Watch',
                inventoryStatus: 'INSTOCK',
                image: 'black-watch.jpg',
                price: 72,
                category: 'Accessories',
                status: 'LOWSTOCK',
                description: 'A stylish black watch.',
                rating: 4.0,
                quantity: 5,
                tags: ['stylish', 'black'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '1002',
                code: 'zz21cz3c1',
                name: 'Blue Band Watch',
                image: 'blue-band-watch.jpg',
                inventoryStatus: 'INSTOCK',
                price: 79,
                category: 'Accessories',
                status: 'OUTOFSTOCK',
                description: 'A blue band watch with a modern design.',
                rating: 3.5,
                quantity: 0,
                tags: ['modern', 'blue'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
          {
                id: '1000',
                code: 'f230fh0g3',
                name: 'Bamboo Watch',
                image: 'bamboo-watch.jpg',
                price: 65,
                category: 'Accessories',
                status: 'INSTOCK',
                description: 'A wooden watch made from bamboo.',
                rating: 4.5,
                quantity: 10,
                inventoryStatus: 'INSTOCK',
                tags: ['eco-friendly', 'wooden'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '1001',
                code: 'nvklal433',
                name: 'Black Watch',
                inventoryStatus: 'INSTOCK',
                image: 'black-watch.jpg',
                price: 72,
                category: 'Accessories',
                status: 'LOWSTOCK',
                description: 'A stylish black watch.',
                rating: 4.0,
                quantity: 5,
                tags: ['stylish', 'black'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '1002',
                code: 'zz21cz3c1',
                name: 'Blue Band Watch',
                image: 'blue-band-watch.jpg',
                inventoryStatus: 'INSTOCK',
                price: 79,
                category: 'Accessories',
                status: 'OUTOFSTOCK',
                description: 'A blue band watch with a modern design.',
                rating: 3.5,
                quantity: 0,
                tags: ['modern', 'blue'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
          {
                id: '1000',
                code: 'f230fh0g3',
                name: 'Bamboo Watch',
                image: 'bamboo-watch.jpg',
                price: 65,
                category: 'Accessories',
                status: 'INSTOCK',
                description: 'A wooden watch made from bamboo.',
                rating: 4.5,
                quantity: 10,
                inventoryStatus: 'INSTOCK',
                tags: ['eco-friendly', 'wooden'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '1001',
                code: 'nvklal433',
                name: 'Black Watch',
                inventoryStatus: 'INSTOCK',
                image: 'black-watch.jpg',
                price: 72,
                category: 'Accessories',
                status: 'LOWSTOCK',
                description: 'A stylish black watch.',
                rating: 4.0,
                quantity: 5,
                tags: ['stylish', 'black'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '1002',
                code: 'zz21cz3c1',
                name: 'Blue Band Watch',
                image: 'blue-band-watch.jpg',
                inventoryStatus: 'INSTOCK',
                price: 79,
                category: 'Accessories',
                status: 'OUTOFSTOCK',
                description: 'A blue band watch with a modern design.',
                rating: 3.5,
                quantity: 0,
                tags: ['modern', 'blue'],
                createdAt: new Date(),
                updatedAt: new Date()
            }];
            this.products = data;
            this.cd.markForCheck();
        

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            { field: 'name', header: 'Name' },
            { field: 'image', header: 'Image' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(product: any) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
                this.selectedProducts = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    deleteProduct(product: any) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products = this.products.filter((val) => val.id !== product.id);
                this.product = {};
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
                default:
                return 'info';
        }
    }

    saveProduct() {
        this.submitted = true;

        if (this.product.name?.trim()) {
            if (this.product.id) {
                this.products[this.findIndexById(this.product.id)] = this.product;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000
                });
            } else {
                this.product.id = this.createId();
                this.product.image = 'product-placeholder.svg';
                this.products.push(this.product);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000
                });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }
}
