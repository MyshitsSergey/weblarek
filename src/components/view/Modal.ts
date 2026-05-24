import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Modal extends Component<{ content: HTMLElement }> {
  private closeButton: HTMLButtonElement;
  private contentContainer: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.closeButton = container.querySelector('.modal__close')!;
    this.contentContainer = container.querySelector('.modal__content')!;
    this.closeButton.addEventListener('click', () => this.close());
    this.container.addEventListener('click', (evt) => {
      if (evt.target === this.container) this.close();
    });
  }

  set content(value: HTMLElement) {
    this.contentContainer.innerHTML = '';
    this.contentContainer.appendChild(value);
  }

  open() { this.container.classList.add('modal_active'); }
  close() {
    this.container.classList.remove('modal_active');
    this.events.emit('modal:close');
  }
}