import { Card } from './Card';
import { IEvents } from '../base/Events';

export class PreviewCard extends Card {
  private button: HTMLButtonElement;
  private description: HTMLElement;
  private _id: string;

  constructor(container: HTMLElement, protected events: IEvents, id: string) {
    super(container);
    this._id = id;
    this.button = container.querySelector('.card__button')!;
    this.description = container.querySelector('.card__text')!;
    this.button.addEventListener('click', (evt) => {
      evt.stopPropagation();
      console.log('🔘 Кнопка нажата, id:', this._id);
      this.events.emit('card:toggleBasket', { id: this._id });
    });
  }

  // Добавь этот сеттер
  set id(value: string) {
    this._id = value;
  }

  get element(): HTMLElement {
    return this.container;
  }

  set descriptionText(value: string) { if (this.description) this.description.textContent = value; }
  set buttonText(value: string) { if (this.button) this.button.textContent = value; }
  set buttonDisabled(value: boolean) { if (this.button) this.button.disabled = value; }
}