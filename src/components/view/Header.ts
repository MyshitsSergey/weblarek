import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Header extends Component<{ counter: number }> {
  private counterElement: HTMLElement;
  private basketButton: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.counterElement = container.querySelector('.header__basket-counter')!;
    this.basketButton = container.querySelector('.header__basket')!;
    this.basketButton.addEventListener('click', () => this.events.emit('basket:open'));
  }

  set counter(value: number) {
    if (this.counterElement) this.counterElement.textContent = String(value);
  }
}