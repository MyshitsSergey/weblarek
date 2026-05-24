import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Success extends Component<{ total: number }> {
  private closeButton: HTMLButtonElement;
  private description: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.closeButton = container.querySelector('.order-success__close')!;
    this.description = container.querySelector('.order-success__description')!;
    this.closeButton.addEventListener('click', () => this.events.emit('success:close'));
  }

  set total(value: number) {
    if (this.description) this.description.textContent = `Списано ${value} синапсов`;
  }
}