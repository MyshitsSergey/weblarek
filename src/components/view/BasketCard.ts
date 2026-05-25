import { Card } from './Card';
import { IEvents } from '../base/Events';

export class BasketCard extends Card {
  private indexElement: HTMLElement;
  private deleteButton: HTMLButtonElement;
  private _id: string = '';

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.indexElement = container.querySelector('.basket__item-index')!;
    this.deleteButton = container.querySelector('.basket__item-delete')!;
    this.deleteButton.addEventListener('click', (evt) => {
      evt.stopPropagation();
      this.events.emit('basket:remove', { id: this._id });
    });
  }

  set id(value: string) {
    this._id = value;
  }

  set index(value: number) {
    if (this.indexElement) this.indexElement.textContent = String(value);
  }
}