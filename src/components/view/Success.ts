import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Success extends Component<{ total: number }> {
  private closeButton: HTMLButtonElement;
  private description: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
    this.description = ensureElement<HTMLElement>('.order-success__description', container);
    this.closeButton.addEventListener('click', () => this.events.emit('success:close'));
  }

  set total(value: number) {
    this.description.textContent = `Списано ${value} синапсов`;
  }
}