import { Form } from './Form';
import { IEvents } from '../base/Events';

export class OrderForm extends Form<{ address: string; payment: string }> {
  private cardButton: HTMLButtonElement;
  private cashButton: HTMLButtonElement;
  private addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this.cardButton = container.querySelector('button[name="card"]')!;
    this.cashButton = container.querySelector('button[name="cash"]')!;
    this.addressInput = container.querySelector('input[name="address"]')!;
    
    // Только уведомляем презентер, не меняем внешний вид сами
    this.cardButton.addEventListener('click', () => {
      this.events.emit('order.payment:change', { payment: 'online' });
    });
    this.cashButton.addEventListener('click', () => {
      this.events.emit('order.payment:change', { payment: 'upon receipt' });
    });
  }

  // Сеттер для значения адреса (из модели)
  set address(value: string) {
    if (this.addressInput) this.addressInput.value = value;
  }

  // Сеттер для выделения активной кнопки (вызывается презентером на основе данных модели)
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