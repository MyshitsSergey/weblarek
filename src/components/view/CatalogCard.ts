import { Card } from './Card';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

// Интерфейс для действий карточки
export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class CatalogCard extends Card {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    
    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
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
}