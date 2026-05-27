import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<{ content: HTMLElement }> {
  private closeButton: HTMLButtonElement;
  private contentContainer: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this.contentContainer = ensureElement<HTMLElement>('.modal__content', container);
    this.closeButton.addEventListener('click', () => this.close());
    this.container.addEventListener('click', (evt) => {
      if (evt.target === this.container) this.close();
    });
  }

  set content(value: HTMLElement) {
    this.contentContainer.innerHTML = '';
    this.contentContainer.appendChild(value);
  }

  open() {
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
  }
}