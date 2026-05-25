import { Card } from './Card';
import { IEvents } from '../base/Events';
import { categoryMap, CDN_URL } from '../../utils/constants';

export class CatalogCard extends Card {
  private _image?: HTMLImageElement;
  private _category?: HTMLElement;
  private _id: string = '';

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this._image = container.querySelector('.card__image') as HTMLImageElement;
    this._category = container.querySelector('.card__category') as HTMLElement;
    this.container.onmousedown = () => {
      this.events.emit('card:select', { id: this._id });
    };
  }

  set id(value: string) {
    this._id = value;
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
      const modifier = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
      const classesToRemove = Array.from(this._category.classList).filter(c =>
        c.startsWith('card__category_')
      );
      classesToRemove.forEach(c => this._category!.classList.remove(c));
      this._category.classList.add(modifier);
    }
  }
}