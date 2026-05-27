import { Component } from '../base/Component';

export class Gallery extends Component<{ catalog: HTMLElement[] }> {
  private gallery: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.gallery = container;
  }

  set catalog(value: HTMLElement[]) {
    this.gallery.replaceChildren(...value);
  }
}