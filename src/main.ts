import './scss/styles.scss';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { LarekApi } from './components/Models/LarekApi';
import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { OrderModel } from './components/Models/OrderModel';
import { Gallery } from './components/view/Gallery';
import { Header } from './components/view/Header';
import { Modal } from './components/view/Modal';
import { Basket } from './components/view/Basket';
import { CatalogCard } from './components/view/CatalogCard';
import { PreviewCard } from './components/view/PreviewCard';
import { BasketCard } from './components/view/BasketCard';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IApi } from './types';

// 1. Базовые классы
const events = new EventEmitter();
const baseApi = new Api(API_URL);
const api = new LarekApi(baseApi as IApi);

// 2. Модели
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

// 3. Представления
const header = new Header(ensureElement('.header'), events);
const gallery = new Gallery(ensureElement('.gallery'));
const modal = new Modal(ensureElement('#modal-container') as HTMLElement, events);

const basketElement = cloneTemplate<HTMLElement>('#basket');
const basketView = new Basket(basketElement, events);

const successElement = cloneTemplate<HTMLElement>('#success');
const successView = new Success(successElement, events);

const previewCardElement = cloneTemplate<HTMLElement>('#card-preview');
const previewCard = new PreviewCard(previewCardElement, {
  onToggleBasket: () => {
    const product = catalogModel.getPreview();
    if (product) {
      events.emit('card:toggleBasket', { id: product.id });
    }
  }
});

const orderFormElement = cloneTemplate<HTMLFormElement>('#order');
const orderForm = new OrderForm(orderFormElement, events);

const contactsFormElement = cloneTemplate<HTMLFormElement>('#contacts');
const contactsForm = new ContactsForm(contactsFormElement, events);

// 4. Загрузка каталога
api.getProducts()
  .then(({ items }) => {
    catalogModel.setItems(items);
  })
  .catch(console.error);

// ===================== ОБРАБОТЧИКИ СОБЫТИЙ ОТ МОДЕЛЕЙ =====================

// Каталог изменился → перерисовать галерею
events.on('catalog:changed', () => {
  const items = catalogModel.getItems();
  const cards = items.map((item) => {
    const cardElement = cloneTemplate<HTMLElement>('#card-catalog');
    const card = new CatalogCard(cardElement, {
      onClick: () => {
        events.emit('card:select', { id: item.id });
      }
    });
    card.render(item);
    return cardElement;
  });
  gallery.catalog = cards;
});

// Превью изменилось → обновить модальное окно
events.on('preview:changed', () => {
  const product = catalogModel.getPreview();
  if (!product) return;
  previewCard.render(product);
  previewCard.buttonText = basketModel.hasItem(product.id) ? 'Удалить из корзины' : 'Купить';
  previewCard.buttonDisabled = product.price === null;
  modal.content = previewCard.getContent();
  modal.open();
});

// Корзина изменилась → обновить счётчик и содержимое корзины
events.on('basket:changed', () => {
  header.counter = basketModel.getCount();
  
  const items = basketModel.getItems();
  const cards = items.map((item, index) => {
    const cardElement = cloneTemplate<HTMLElement>('#card-basket');
    const basketCard = new BasketCard(cardElement, {
      onRemove: () => {
        events.emit('basket:remove', { id: item.id });
      }
    });
    basketCard.render(item);
    basketCard.index = index + 1;
    return cardElement;
  });
  basketView.items = cards;
  basketView.total = basketModel.getTotal();
  basketView.buttonDisabled = items.length === 0;
});

// Данные заказа изменились → обновить формы
events.on('order:changed', () => {
  const order = orderModel.getOrder();
  const errors = orderModel.validate();
  
  // Обновляем форму заказа
  const hasAddressError = !!errors.address;
  const hasPaymentError = !order.payment;
  const isOrderValid = !hasAddressError && !hasPaymentError;
  orderForm.valid = isOrderValid;
  orderForm.selectedPayment = order.payment || null;
  orderForm.address = order.address;
  
  // Формируем текст ошибок
  const errorMessages = [errors.address, errors.payment].filter(Boolean).join(', ');
  orderForm.errors = errorMessages;
  
  // Обновляем форму контактов
  const isContactsValid = !errors.email && !errors.phone;
  contactsForm.valid = isContactsValid;
  contactsForm.email = order.email;
  contactsForm.phone = order.phone;
  
  const contactErrorMessages = [errors.email, errors.phone].filter(Boolean).join(', ');
  contactsForm.errors = contactErrorMessages;
});

// ===================== ОБРАБОТЧИКИ СОБЫТИЙ ОТ ПРЕДСТАВЛЕНИЙ =====================

// Выбрана карточка в каталоге
events.on('card:select', ({ id }: { id: string }) => {
  const product = catalogModel.getProductById(id);
  if (product) {
    catalogModel.setPreview(product);
  }
});

// Добавление/удаление товара из корзины
events.on('card:toggleBasket', ({ id }: { id: string }) => {
  const product = catalogModel.getProductById(id);
  if (basketModel.hasItem(id)) {
    basketModel.removeItem(id);
  } else {
    if (product) basketModel.addItem(product);
  }
});

// Удаление товара из корзины
events.on('basket:remove', ({ id }: { id: string }) => {
  basketModel.removeItem(id);
});

// Открытие корзины
events.on('basket:open', () => {
  modal.content = basketView.render();
  modal.open();
});

// Оформление заказа
events.on('basket:checkout', () => {
  orderForm.render({ address: '', payment: '' });
  modal.content = orderForm.render();
  modal.open();
});

// Изменение адреса
events.on('order.address:change', ({ value }: { value: string }) => {
  orderModel.updateOrder('address', value);
});

// Изменение способа оплаты
events.on('order.payment:change', ({ payment }: { payment: 'online' | 'upon receipt' }) => {
  orderModel.updateOrder('payment', payment);
});

// Отправка первого шага формы
events.on('order:submit', () => {
  modal.content = contactsForm.render();
});

// Изменение email
events.on('contacts.email:change', ({ value }: { value: string }) => {
  orderModel.updateOrder('email', value);
});

// Изменение телефона
events.on('contacts.phone:change', ({ value }: { value: string }) => {
  orderModel.updateOrder('phone', value);
});

// Отправка заказа
events.on('contacts:submit', async () => {
  const orderData = orderModel.getOrder();
  const items = basketModel.getItems().map((item) => item.id);
  const total = basketModel.getTotal();

  const order = {
    payment: orderData.payment as 'online' | 'upon receipt',
    email: orderData.email,
    phone: orderData.phone,
    address: orderData.address,
    items,
    total,
  };

  try {
    const result = await api.postOrder(order);
    basketModel.clear();
    orderModel.clear();
    successView.total = result.total;
    modal.content = successView.render();
    modal.open();
  } catch (err) {
    console.error('Ошибка при оформлении заказа:', err);
    alert('Произошла ошибка, попробуйте ещё раз');
  }
});

// Закрытие окна успеха
events.on('success:close', () => {
  modal.close();
});

// Закрытие модального окна
events.on('modal:close', () => {
  // очистка при необходимости
});