// //Управляет корзиной.

// import { IProduct } from '../../types';

// export class BasketModel {
//   private items: IProduct[] = [];

//   getItems(): IProduct[] {
//     return this.items;
//   }

//   addItem(product: IProduct): void {
//     // Проверяем, нет ли уже такого товара (по id)
//     if (!this.hasItem(product.id)) {
//       this.items.push(product);
//     }
//   }

//   removeItem(id: string): void {
//     this.items = this.items.filter(item => item.id !== id);
//   }

//   clear(): void {
//     this.items = [];
//   }

//   getTotal(): number {
//     return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
//   }

//   getCount(): number {
//     return this.items.length;
//   }

//   hasItem(id: string): boolean {
//     return this.items.some(item => item.id === id);
//   }
// }


import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class BasketModel {
  private items: IProduct[] = [];

  constructor(protected events: IEvents) { }

  getItems(): IProduct[] { return this.items; }

  addItem(product: IProduct): void {
    if (!this.hasItem(product.id)) {
      this.items.push(product);
      this.events.emit('basket:changed');
    }
  }

  removeItem(id: string): void {
    this.items = this.items.filter(item => item.id !== id);
    this.events.emit('basket:changed');
  }

  clear(): void {
    this.items = [];
    this.events.emit('basket:changed');
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}