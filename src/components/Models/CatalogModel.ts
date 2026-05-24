// //Отвечает за хранение всех товаров и выбранного товара для просмотра.

// import { IProduct } from '../../types';

// export class CatalogModel {
//   // Поля
//   private items: IProduct[] = [];
//   private selectedProduct: IProduct | null = null;

//   // Методы
//   setItems(products: IProduct[]): void {
//     this.items = products;
//   }

//   getItems(): IProduct[] {
//     return this.items;
//   }

//   getProductById(id: string): IProduct | undefined {
//     return this.items.find(product => product.id === id);
//   }

//   setPreview(product: IProduct): void {
//     this.selectedProduct = product;
//   }

//   getPreview(): IProduct | null {
//     return this.selectedProduct;
//   }
// }

// Отвечает за хранение всех товаров и выбранного товара для просмотра.
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class CatalogModel {
  // Поля
  private items: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  // Конструктор теперь внутри класса
  constructor(protected events: IEvents) {
    // тело конструктора может быть пустым
  }

  // Методы
  setItems(products: IProduct[]): void {
    this.items = products;
    this.events.emit('catalog:changed', this.items); // добавлено событие
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getProductById(id: string): IProduct | undefined {
    return this.items.find(product => product.id === id);
  }

  setPreview(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit('preview:changed', product); // добавлено событие
  }

  getPreview(): IProduct | null {
    return this.selectedProduct;
  }
}