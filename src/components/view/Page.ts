import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Page extends Component<{ counter: number; catalog: HTMLElement[] }> {
  private counterElement: HTMLElement;
  private gallery: HTMLElement;
  private basketButton: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.counterElement = container.querySelector('.header__basket-counter')!;
    this.gallery = container.querySelector('.gallery')!;
    this.basketButton = container.querySelector('.header__basket')!;
    this.basketButton.addEventListener('click', () => this.events.emit('basket:open'));
  }

  set counter(value: number) { if (this.counterElement) this.counterElement.textContent = String(value); }
  set catalog(value: HTMLElement[]) {
    if (this.gallery) {
      this.gallery.innerHTML = '';
      value.forEach(item => this.gallery.appendChild(item));
    }
  }
}