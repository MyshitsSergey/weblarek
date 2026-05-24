// src/components/view/BasketCard.ts
import { Card } from './Card';
import { IEvents } from '../base/Events';

export class BasketCard extends Card {
  private indexElement: HTMLElement;
  private deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents, id: string) {
    super(container);
    // Добавляем ! после querySelector
    this.indexElement = container.querySelector('.basket__item-index')!;
    this.deleteButton = container.querySelector('.basket__item-delete')!;
    
    this.deleteButton.addEventListener('click', (evt) => {
      evt.stopPropagation();
      this.events.emit('basket:remove', { id });
    });
  }

  set index(value: number) {
    if (this.indexElement) this.indexElement.textContent = String(value);
  }
}