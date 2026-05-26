import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Form<T> extends Component<T> {
  protected form: HTMLFormElement;
  protected button: HTMLButtonElement;
  protected errorsSpan: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);
    this.form = container;
    this.button = ensureElement<HTMLButtonElement>('.button[type="submit"]', container);
    this.errorsSpan = ensureElement<HTMLElement>('.form__errors', container);
    
    this.form.addEventListener('input', (evt: Event) => {
      const target = evt.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      console.log(`🔤 input событие: ${this.form.name}.${String(field)}:change`, value);
      this.events.emit(`${this.form.name}.${String(field)}:change`, { field, value });
    });
    
    this.form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      console.log(`📨 submit события: ${this.form.name}:submit`);
      this.events.emit(`${this.form.name}:submit`);
    });
  }

  set valid(value: boolean) {
    if (this.button) {
      this.button.disabled = !value;
      console.log(`🔘 Кнопка ${this.form.name} ${value ? 'активна' : 'заблокирована'}`);
    }
  }

  set errors(value: string) {
    if (this.errorsSpan) {
      this.errorsSpan.textContent = value;
      console.log(`❌ Ошибки формы ${this.form.name}:`, value);
    }
  }
}