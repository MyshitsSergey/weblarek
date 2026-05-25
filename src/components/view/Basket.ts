import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Basket extends Component<{ items: HTMLElement[]; total: number }> {
  private list: HTMLElement;
  private button: HTMLButtonElement;
  private totalSpan: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.list = ensureElement<HTMLElement>('.basket__list', container);
    this.button = ensureElement<HTMLButtonElement>('.basket__button', container);
    this.totalSpan = ensureElement<HTMLElement>('.basket__price', container);
    this.button.addEventListener('click', () => this.events.emit('basket:checkout'));
  }

  set items(value: HTMLElement[]) {
    this.list.innerHTML = '';
    value.forEach(item => this.list.appendChild(item));
  }

  set total(value: number) {
    this.totalSpan.textContent = `${value} синапсов`;
  }

  set buttonDisabled(value: boolean) {
    this.button.disabled = value;
  }
}