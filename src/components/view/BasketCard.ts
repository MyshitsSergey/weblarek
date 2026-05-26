import { Card } from './Card';
import { ensureElement } from '../../utils/utils';

export interface IBasketCardActions {
  onRemove: (event: MouseEvent) => void;
}

export class BasketCard extends Card {
  private indexElement: HTMLElement;
  private deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IBasketCardActions) {
    super(container);
    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
    
    if (actions?.onRemove) {
      this.deleteButton.addEventListener('click', actions.onRemove);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}