import { Form } from './Form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class OrderForm extends Form<{ address: string; payment: string }> {
  private cardButton: HTMLButtonElement;
  private cashButton: HTMLButtonElement;
  private addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
    
    this.cardButton.addEventListener('click', () => {
      console.log('cardButton clicked'); // для проверки
      this.events.emit('order.payment:change', { payment: 'online' });
    });
    
    this.cashButton.addEventListener('click', () => {
      console.log('cashButton clicked'); // для проверки
      this.events.emit('order.payment:change', { payment: 'upon receipt' });
    });
  }

  set address(value: string) {
    if (this.addressInput) this.addressInput.value = value;
  }

  set selectedPayment(value: 'online' | 'upon receipt' | null) {
    if (value === 'online') {
      this.cardButton.classList.add('button_alt-active');
      this.cashButton.classList.remove('button_alt-active');
    } else if (value === 'upon receipt') {
      this.cashButton.classList.add('button_alt-active');
      this.cardButton.classList.remove('button_alt-active');
    } else {
      this.cardButton.classList.remove('button_alt-active');
      this.cashButton.classList.remove('button_alt-active');
    }
  }
}