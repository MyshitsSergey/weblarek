import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Page extends Component<{ counter: number; catalog: HTMLElement[] }> {
  private counterElement: HTMLElement;
  private gallery: HTMLElement;
  private basketButton: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', container);
    this.gallery = ensureElement<HTMLElement>('.gallery', container);
    this.basketButton = ensureElement<HTMLElement>('.header__basket', container);
    this.basketButton.addEventListener('click', () => this.events.emit('basket:open'));
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }

  set catalog(value: HTMLElement[]) {
    this.gallery.innerHTML = '';
    value.forEach(item => this.gallery.appendChild(item));
  }
}