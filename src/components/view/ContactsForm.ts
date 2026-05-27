import { Form } from './Form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

// Интерфейс для данных формы контактов
export interface IContactsFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    
    console.log('📝 ContactsForm создан, name:', container.name);
    
    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
    
    console.log('✅ ContactsForm: поля email и phone найдены');
  }

  set email(value: string) {
    this.emailInput.value = value;
    console.log('📧 ContactsForm.email установлен:', value);
  }

  set phone(value: string) {
    this.phoneInput.value = value;
    console.log('📞 ContactsForm.phone установлен:', value);
  }
}