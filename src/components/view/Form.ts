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
      this.events.emit(`${this.form.name}.${String(field)}:change`, { field, value });
    });
    this.form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.events.emit(`${this.form.name}:submit`);
    });
  }

  set valid(value: boolean) {
    this.button.disabled = !value;
  }

  set errors(value: string) {
    this.errorsSpan.textContent = value;
  }
}