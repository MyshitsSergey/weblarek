// CatalogModel.ts
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class CatalogModel {
  private items: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setItems(products: IProduct[]): void {
    this.items = products;
    this.events.emit('catalog:changed'); // без данных
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getProductById(id: string): IProduct | undefined {
    return this.items.find(product => product.id === id);
  }

  setPreview(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit('preview:changed'); // без данных
  }

  getPreview(): IProduct | null {
    return this.selectedProduct;
  }
}