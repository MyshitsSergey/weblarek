import { Card } from './Card';
import { IEvents } from '../base/Events';
import { categoryMap, CDN_URL } from '../../utils/constants';

export class PreviewCard extends Card {
  private button: HTMLButtonElement;
  private description: HTMLElement;
  private _image?: HTMLImageElement;
  private _category?: HTMLElement;
  private _id: string = '';

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.button = container.querySelector('.card__button')!;
    this.description = container.querySelector('.card__text')!;
    this._image = container.querySelector('.card__image') as HTMLImageElement;
    this._category = container.querySelector('.card__category') as HTMLElement;
    this.button.addEventListener('click', (evt) => {
      evt.stopPropagation();
      this.events.emit('card:toggleBasket', { id: this._id });
    });
  }

  set id(value: string) {
    this._id = value;
  }

  get element(): HTMLElement {
    return this.container;
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

  set descriptionText(value: string) {
    if (this.description) this.description.textContent = value;
  }

  set buttonText(value: string) {
    if (this.button) this.button.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    if (this.button) this.button.disabled = value;
  }
}