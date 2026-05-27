import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface ISuccessData {
  total: number;
}

export class Success extends Component<ISuccessData> {
  private closeButton: HTMLButtonElement;
  private descriptionElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', container);
    
    this.closeButton.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}