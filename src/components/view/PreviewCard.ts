import { Card } from './Card';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export interface IPreviewCardActions {
  onToggleBasket: (event: MouseEvent) => void;
}

export class PreviewCard extends Card {
  private button: HTMLButtonElement;
  private descriptionElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

constructor(container: HTMLElement, actions?: IPreviewCardActions) {
  super(container);
  this.button = ensureElement<HTMLButtonElement>('.card__button', this.container);
  this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
  this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
  this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
  
  if (actions?.onToggleBasket) {
    this.button.addEventListener('click', (e) => {
      e.stopPropagation();
      actions.onToggleBasket(e);
      // Закрываем модальное окно после клика
      const modal = document.querySelector('#modal-container');
      if (modal) {
        modal.classList.remove('modal_active');
      }
    });
  }
}

  getContent(): HTMLElement {
    return this.container;
  }

  set image(value: string) {
    const fullUrl = value.startsWith('http') ? value : CDN_URL + value;
    this.setImage(this.imageElement, fullUrl, this.title);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    const modifier = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
    const classesToRemove = Array.from(this.categoryElement.classList).filter(c =>
      c.startsWith('card__category_')
    );
    classesToRemove.forEach(c => this.categoryElement.classList.remove(c));
    this.categoryElement.classList.add(modifier);
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.button.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.button.disabled = value;
  }
}