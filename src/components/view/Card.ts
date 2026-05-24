import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { CDN_URL } from '../../utils/constants';

export class Card extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _category?: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._title = container.querySelector('.card__title')!;
    this._price = container.querySelector('.card__price')!;
    this._image = container.querySelector('.card__image')!;
    this._category = container.querySelector('.card__category')!;
  }

  set title(value: string) { if (this._title) this._title.textContent = value; }
  
  set price(value: number | null) {
    if (this._price) {
      this._price.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
    }
  }
  
 set image(value: string) {
    if (this._image) {

      const fullUrl = value.startsWith('http') ? value : CDN_URL + value;
      this.setImage(this._image, fullUrl, this.title);
    }
  }




  
  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;
      // Безопасное получение модификатора
      const modifier = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
      // Удаляем все старые классы категории
      const classesToRemove = Array.from(this._category.classList).filter(c => c.startsWith('card__category_'));
      classesToRemove.forEach(c => this._category!.classList.remove(c));
      this._category.classList.add(modifier);
    }
  }
}