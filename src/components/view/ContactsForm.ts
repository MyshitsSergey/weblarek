import { Form } from './Form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class ContactsForm extends Form<{ email: string; phone: string }> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    
    console.log('📝 ContactsForm создан, name:', container.name);
    
    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
    
    if (!this.emailInput || !this.phoneInput) {
      throw new Error('ContactsForm: не найдены поля email или phone');
    }
    
    console.log('✅ ContactsForm: поля email и phone найдены');
  }

  set email(value: string) {
    if (this.emailInput) {
      this.emailInput.value = value;
      console.log('📧 ContactsForm.email установлен:', value);
    }
  }

  set phone(value: string) {
    if (this.phoneInput) {
      this.phoneInput.value = value;
      console.log('📞 ContactsForm.phone установлен:', value);
    }
  }
  
  get email(): string {
    return this.emailInput?.value || '';
  }
  
  get phone(): string {
    return this.phoneInput?.value || '';
  }
}