import { Component } from '../base/Component';

export class Page extends Component<{ catalog: HTMLElement[] }> {
  private gallery: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.gallery = container.querySelector('.gallery')!;
  }

  set catalog(value: HTMLElement[]) {
    if (this.gallery) {
      this.gallery.innerHTML = '';
      value.forEach(item => this.gallery.appendChild(item));
    }
  }
}