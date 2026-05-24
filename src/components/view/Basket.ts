import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Basket extends Component<{ items: HTMLElement[]; total: number }> {
  private list: HTMLElement;
  private button: HTMLButtonElement;
  private totalSpan: HTMLElement;

  // constructor(container: HTMLElement, protected events: IEvents) {
  //   super(container);
  //   this.list = container.querySelector('.basket__list');
  //   this.button = container.querySelector('.basket__button');
  //   this.totalSpan = container.querySelector('.basket__price');
  //   this.button.addEventListener('click', () => this.events.emit('basket:checkout'));
  // }

  constructor(container: HTMLElement, protected events: IEvents) {
  super(container);
  const list = container.querySelector('.basket__list');
  const button = container.querySelector('.basket__button');
  const totalSpan = container.querySelector('.basket__price');
  if (!list || !button || !totalSpan) {
    throw new Error('Basket: не найдены обязательные элементы');
  }
  this.list = list as HTMLElement;
  this.button = button as HTMLButtonElement;
  this.totalSpan = totalSpan as HTMLElement;
  this.button.addEventListener('click', () => this.events.emit('basket:checkout'));
}

  set items(value: HTMLElement[]) {
    this.list.innerHTML = '';
    value.forEach(item => this.list.appendChild(item));
  }
  set total(value: number) {
    if (this.totalSpan) this.totalSpan.textContent = `${value} синапсов`;
  }
  set buttonDisabled(value: boolean) { if (this.button) this.button.disabled = value; }
}