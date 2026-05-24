import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Form<T> extends Component<T> {
  protected form: HTMLFormElement;
  protected button: HTMLButtonElement;
  protected errorsSpan: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);
    this.form = container;
    this.button = container.querySelector('.button[type="submit"]')!;
    this.errorsSpan = container.querySelector('.form__errors')!;
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

  set valid(value: boolean) { if (this.button) this.button.disabled = !value; }
  set errors(value: string) { if (this.errorsSpan) this.errorsSpan.textContent = value; }
}