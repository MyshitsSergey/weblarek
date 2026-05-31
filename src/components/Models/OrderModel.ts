import { IBuyer, TPayment, TValidationErrors } from '../../types';
import { IEvents } from '../base/Events';

export class OrderModel {
  private payment: TPayment | null = null;
  private address: string = '';
  private phone: string = '';
  private email: string = '';

  constructor(protected events: IEvents) {}

  updateOrder<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    if (field === 'payment') this.payment = value as TPayment;
    if (field === 'address') this.address = value as string;
    if (field === 'phone') this.phone = value as string;
    if (field === 'email') this.email = value as string;
    this.events.emit('order:changed');
  }

  getOrder(): IBuyer {
    // Преобразуем null в undefined для совместимости с опциональным полем
    return {
      payment: this.payment ?? undefined,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  clear(): void {
    this.payment = null;
    this.address = '';
    this.phone = '';
    this.email = '';
    this.events.emit('order:changed');
  }

  validate(): TValidationErrors {
    const errors: TValidationErrors = {};
    if (!this.payment) errors.payment = 'Не выбран способ оплаты';
    if (!this.address.trim()) errors.address = 'Адрес не может быть пустым';
    if (!this.phone.trim()) errors.phone = 'Телефон не может быть пустым';
    if (!this.email.trim()) errors.email = 'Email не может быть пустым';
    return errors;
  }
}