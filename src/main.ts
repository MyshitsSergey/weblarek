import './scss/styles.scss';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { LarekApi } from './components/Models/LarekApi';
import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { OrderModel } from './components/Models/OrderModel';
import { Page } from './components/view/Page';
import { Modal } from './components/view/Modal';
import { Basket } from './components/view/Basket';
import { CatalogCard } from './components/view/CatalogCard';
import { PreviewCard } from './components/view/PreviewCard';
import { BasketCard } from './components/view/BasketCard';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';
import { API_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import { IApi } from './types';

// 1. Базовые классы
const events = new EventEmitter();
const baseApi = new Api(API_URL);
const api = new LarekApi(baseApi as IApi);

// 2. Модели
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

// 3. Представления (статические компоненты — создаём один раз)
const page = new Page(document.body, events);

const modalContainer = document.querySelector('#modal-container');
if (!modalContainer) throw new Error('Modal container not found');
const modal = new Modal(modalContainer as HTMLElement, events);

const basketElement = cloneTemplate<HTMLElement>('#basket');
const basketView = new Basket(basketElement, events);

const successElement = cloneTemplate<HTMLElement>('#success');
const successView = new Success(successElement, events);

const previewCardElement = cloneTemplate<HTMLElement>('#card-preview');
const previewCard = new PreviewCard(previewCardElement, events);

const orderFormElement = cloneTemplate<HTMLFormElement>('#order');
const orderForm = new OrderForm(orderFormElement, events);

const contactsFormElement = cloneTemplate<HTMLFormElement>('#contacts');
const contactsForm = new ContactsForm(contactsFormElement, events);

// 4. Загрузка каталога с сервера
api.getProducts()
  .then(({ items }) => {
    catalogModel.setItems(items);
  })
  .catch(console.error);

// ===================== ОБРАБОТЧИКИ СОБЫТИЙ =====================

// Каталог изменился → отрисовать карточки
events.on('catalog:changed', () => {
  const items = catalogModel.getItems();
  const cards = items.map((item) => {
    const cardElement = cloneTemplate<HTMLElement>('#card-catalog');
    const card = new CatalogCard(cardElement, events);
    card.id = item.id;
    card.render(item);
    return cardElement;
  });
  page.catalog = cards;
});

// Выбрана карточка в каталоге → показать превью
events.on('card:select', ({ id }: { id: string }) => {
  const product = catalogModel.getProductById(id);
  if (product) catalogModel.setPreview(product);
});

// Превью изменилось → обновить модальное окно
events.on('preview:changed', () => {
  const product = catalogModel.getPreview();
  if (!product) return;
  previewCard.id = product.id;
  previewCard.render(product);
  previewCard.buttonText = basketModel.hasItem(product.id)
    ? 'Удалить из корзины'
    : 'В корзину';
  previewCard.buttonDisabled = product.price === null;
  modal.content = previewCard.element;
  modal.open();
});

// Добавление / удаление товара из корзины (кнопка в модалке)
events.on('card:toggleBasket', ({ id }: { id: string }) => {
  const product = catalogModel.getProductById(id);
  if (basketModel.hasItem(id)) {
    basketModel.removeItem(id);
  } else {
    if (product) basketModel.addItem(product);
  }
  const currentPreview = catalogModel.getPreview();
  if (currentPreview && currentPreview.id === id) {
    catalogModel.setPreview(currentPreview);
  }
});

// Корзина изменилась → обновить счётчик и, если открыто превью, обновить его
events.on('basket:changed', () => {
  page.counter = basketModel.getCount();
  const currentPreview = catalogModel.getPreview();
  if (currentPreview) {
    catalogModel.setPreview(currentPreview);
  }
});

// Открыть корзину
events.on('basket:open', () => {
  const items = basketModel.getItems();
  const cards = items.map((item, index) => {
    const cardElement = cloneTemplate<HTMLElement>('#card-basket');
    const basketCard = new BasketCard(cardElement, events);
    basketCard.id = item.id;
    basketCard.render(item);
    basketCard.index = index + 1;
    return cardElement;
  });
  basketView.items = cards;
  basketView.total = basketModel.getTotal();
  basketView.buttonDisabled = items.length === 0;
  modal.content = basketView.render();
  modal.open();
});

// Удалить товар из корзины (из модального окна корзины)
events.on('basket:remove', ({ id }: { id: string }) => {
  basketModel.removeItem(id);
  const modalElement = document.querySelector('#modal-container');
  if (modalElement && modalElement.classList.contains('modal_active')) {
    events.emit('basket:open');
  }
});

// Оформить заказ → показать форму заказа (первый шаг)
events.on('basket:checkout', () => {
  orderForm.render({ address: '', payment: '' });
  modal.content = orderForm.render();
  modal.open();
});

// Изменение поля адреса
events.on('order.address:change', ({ value }: { value: string }) => {
  orderModel.updateOrder('address', value);
  events.emit('order:change');
});

// Изменение способа оплаты
events.on('order.payment:change', ({ payment }: { payment: 'online' | 'upon receipt' }) => {
  orderModel.updateOrder('payment', payment);
  events.emit('order:change');
});

// Валидация формы заказа
events.on('order:change', () => {
  const order = orderModel.getOrder();
  const errors = orderModel.validate();
  const hasAddressError = !!errors.address;
  const hasPaymentError = !order?.payment;
  const isValid = !hasAddressError && !hasPaymentError;
  
  orderForm.valid = isValid;
  orderForm.errors = errors.address || (hasPaymentError ? 'Выберите способ оплаты' : '');
  orderForm.selectedPayment = order?.payment || null; // обновляем выделение кнопок
  if (order?.address !== undefined) {
    orderForm.address = order.address; // синхронизируем адрес
  }
});

// Переход ко второй форме (контакты)
events.on('order:submit', () => {
  contactsForm.render({ email: '', phone: '' });
  modal.content = contactsForm.render();
});

// Изменение email
events.on('contacts.email:change', ({ value }: { value: string }) => {
  orderModel.updateOrder('email', value);
  events.emit('contacts:change');
});

// Изменение телефона
events.on('contacts.phone:change', ({ value }: { value: string }) => {
  orderModel.updateOrder('phone', value);
  events.emit('contacts:change');
});

// Валидация формы контактов
events.on('contacts:change', () => {
  const errors = orderModel.validate();
  const isValid = !errors.email && !errors.phone;
  contactsForm.valid = isValid;
  contactsForm.errors = errors.email || errors.phone || '';
});

// Отправка заказа на сервер
events.on('contacts:submit', async () => {
  const orderData = orderModel.getOrder();
  if (!orderData) {
    alert('Заполните все поля заказа');
    return;
  }
  const items = basketModel.getItems().map((item) => item.id);
  const total = basketModel.getTotal();

  const order = {
    payment: orderData.payment,
    email: orderData.email,
    phone: orderData.phone,
    address: orderData.address,
    items,
    total,
  };

  try {
    const result = await api.postOrder(order);
    successView.total = result.total;
    modal.content = successView.render();
    modal.open();
    basketModel.clear();
    orderModel.clear();

    const onSuccessClose = () => {
      modal.close();
      events.off('success:close', onSuccessClose);
    };
    events.on('success:close', onSuccessClose);
  } catch (err) {
    console.error('Ошибка при оформлении заказа:', err);
    alert('Произошла ошибка, попробуйте ещё раз');
  }
});

// Закрытие модального окна
events.on('modal:close', () => {
  // можно очистить временные данные
});