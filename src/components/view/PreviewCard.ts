import { Card } from './Card';
import { IEvents } from '../base/Events';

export class PreviewCard extends Card {
  private button: HTMLButtonElement;
  private description: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents, id: string) {
    super(container);
    this.button = container.querySelector('.card__button');
    this.description = container.querySelector('.card__text');
    this.button.addEventListener('click', (evt) => {
      evt.stopPropagation();
      this.events.emit('card:toggleBasket', { id });
    });
  }

  set descriptionText(value: string) { if (this.description) this.description.textContent = value; }
  set buttonText(value: string) { if (this.button) this.button.textContent = value; }
  set buttonDisabled(value: boolean) { if (this.button) this.button.disabled = value; }
}