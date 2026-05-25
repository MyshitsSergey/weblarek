import { Component } from '../base/Component';
import { IProduct } from '../../types';

export class Card extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._title = container.querySelector('.card__title')!;
    this._price = container.querySelector('.card__price')!;
  }

  set title(value: string) {
    if (this._title) this._title.textContent = value;
  }

  set price(value: number | null) {
    if (this._price) {
      this._price.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
    }
  }
}