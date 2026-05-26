import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Success extends Component<{ total: number }> {
  private closeButton: HTMLButtonElement;
  private descriptionElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', container);
    
    this.closeButton.addEventListener('click', () => {
      console.log('🔘 Кнопка "За новыми покупками!" нажата');
      this.events.emit('success:close');
    });
  }

  set total(value: number) {
    if (this.descriptionElement) {
      this.descriptionElement.textContent = `Списано ${value} синапсов`;
      console.log(`💰 Success.total установлен: ${value}`);
    }
  }
}