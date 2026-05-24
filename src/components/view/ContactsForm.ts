import { Form } from './Form';
import { IEvents } from '../base/Events';

export class ContactsForm extends Form<{ email: string; phone: string }> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this.emailInput = container.querySelector('input[name="email"]')!;
    this.phoneInput = container.querySelector('input[name="phone"]')!;
  }

  set email(value: string) { if (this.emailInput) this.emailInput.value = value; }
  set phone(value: string) { if (this.phoneInput) this.phoneInput.value = value; }
}