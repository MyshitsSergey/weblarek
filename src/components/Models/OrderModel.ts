//Хранит данные заказа и умеет их валидировать.

import { IBuyer, TPayment } from '../../types';

export class OrderModel {
  private payment: TPayment | null = null;
  private address: string = '';
  private phone: string = '';
  private email: string = '';

  // Обновление одного поля (по имени поля)
  updateOrder<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    if (field === 'payment') this.payment = value as TPayment;
    if (field === 'address') this.address = value as string;
    if (field === 'phone') this.phone = value as string;
    if (field === 'email') this.email = value as string;
  }

  // Получить все данные в виде объекта IBuyer
  getOrder(): IBuyer | null {
    if (this.payment === null || !this.address || !this.phone || !this.email) {
      return null; // или выбросить ошибку, но для теста вернём null
    }
    return {
      payment: this.payment,
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
  }

  // Валидация: возвращает объект с ошибками. Поле считается невалидным, если пустое или null
  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};
    if (!this.payment) errors.payment = 'Не выбран способ оплаты';
    if (!this.address.trim()) errors.address = 'Адрес не может быть пустым';
    if (!this.phone.trim()) errors.phone = 'Телефон не может быть пустым';
    if (!this.email.trim()) errors.email = 'Email не может быть пустым';
    return errors;
  }
}