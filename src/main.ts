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
import { IApi, IProduct } from './types';

// 1. Базовые классы
const events = new EventEmitter();
const baseApi = new Api(API_URL);
const api = new LarekApi(baseApi as IApi);

// 2. Модели
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

// 3. Представления (создаём один раз все статичные компоненты)
const page = new Page(document.body, events);

const modalContainer = document.querySelector('#modal-container');
if (!modalContainer) throw new Error('Modal container not found');
const modal = new Modal(modalContainer as HTMLElement, events);

// Корзина
const basketElement = cloneTemplate<HTMLElement>('#basket');
const basketView = new Basket(basketElement, events);

// Успешный заказ
const successElement = cloneTemplate<HTMLElement>('#success');
const successView = new Success(successElement, events);

// Карточка превью (создаём один раз, будем переиспользовать)
const previewCardElement = cloneTemplate<HTMLElement>('#card-preview');
const previewCard = new PreviewCard(previewCardElement, events, '');

// Форма заказа (первый шаг)
const orderFormElement = cloneTemplate<HTMLFormElement>('#order');
const orderForm = new OrderForm(orderFormElement, events);

// Форма контактов (второй шаг)
const contactsFormElement = cloneTemplate<HTMLFormElement>('#contacts');
const contactsForm = new ContactsForm(contactsFormElement, events);

// 4. Загрузка каталога
api.getProducts().then(({ items }) => {
  catalogModel.setItems(items);
}).catch(console.error);

// 5. Обработчики событий

// Изменение каталога -> отрисовка карточек
events.on('catalog:changed', (items: IProduct[]) => {
  const cards = items.map(item => {
    const cardElement = cloneTemplate<HTMLElement>('#card-catalog');
    const card = new CatalogCard(cardElement, events, item.id);
    card.render(item);
    return cardElement;
  });
  page.catalog = cards;
});

// Выбор карточки -> открытие превью
events.on('card:select', ({ id }: { id: string }) => {
  const product = catalogModel.getProductById(id);
  if (product) catalogModel.setPreview(product);
});

// Изменение превью -> обновление модального окна
events.on('preview:changed', (product: IProduct) => {
  previewCard.id = product.id;  // ← Устанавливаем id перед рендером
  previewCard.render(product);
  previewCard.buttonText = basketModel.hasItem(product.id) 
    ? 'Удалить из корзины' 
    : 'В корзину';
  previewCard.buttonDisabled = product.price === null;
  modal.content = previewCard.element;
  modal.open();
});

// Добавление/удаление товара из корзины (из модального окна)
events.on('card:toggleBasket', ({ id }: { id: string }) => {
  console.log('🛒 1. Начало обработки, id:', id);
  console.log('🛒 2. До изменения, в корзине?', basketModel.hasItem(id));
  
  const product = catalogModel.getProductById(id);
  
  // Обновляем корзину
  if (basketModel.hasItem(id)) {
    console.log('🛒 3. Удаляем из корзины');
    basketModel.removeItem(id);
  } else {
    console.log('🛒 3. Добавляем в корзину');
    if (product) basketModel.addItem(product);
  }
  
  console.log('🛒 4. После изменения, в корзине?', basketModel.hasItem(id));
  
  // Принудительно обновляем превью, чтобы кнопка изменилась
  const currentPreview = catalogModel.getPreview();
  console.log('🛒 5. currentPreview:', currentPreview?.id);
  console.log('🛒 6. currentPreview.id === id?', currentPreview?.id === id);
  
  if (currentPreview && currentPreview.id === id) {
    console.log('🛒 7. Вызываем setPreview');
    catalogModel.setPreview(currentPreview);
  }
  
  // Также обновляем счётчик корзины
  page.counter = basketModel.getCount();
  console.log('🛒 8. Счётчик обновлён:', basketModel.getCount());
});

// Изменение корзины -> обновление счётчика и текущего превью
events.on('basket:changed', () => {
  page.counter = basketModel.getCount();
  // Обновляем текущий preview, если он открыт
  const currentPreview = catalogModel.getPreview();
  if (currentPreview) {
    catalogModel.setPreview(currentPreview);
  }
});

// Открытие корзины
events.on('basket:open', () => {
  const items = basketModel.getItems();
  const cards = items.map((item, index) => {
    const cardElement = cloneTemplate<HTMLElement>('#card-basket');
    const basketCard = new BasketCard(cardElement, events, item.id);
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

// Удаление товара из корзины (из модального окна корзины)
events.on('basket:remove', ({ id }: { id: string }) => {
  basketModel.removeItem(id);
  // Обновляем отображение корзины, если она открыта
  const modalElement = document.querySelector('#modal-container');
  if (modalElement && modalElement.classList.contains('modal_active')) {
    events.emit('basket:open');
  }
});

// Оформление заказа (переход к первому шагу)
events.on('basket:checkout', () => {
  orderForm.render({ address: '', payment: '' });
  modal.content = orderForm.render();
  modal.open();
});

// Изменение полей формы заказа (адрес)
events.on('order.address:change', ({ value }: { value: string }) => {
  orderModel.updateOrder('address', value);
  events.emit('order:change');
});

// Изменение способа оплаты
events.on('order.payment:change', ({ payment }: { payment: 'online' | 'upon receipt' }) => {
  orderModel.updateOrder('payment', payment);
  events.emit('order:change');
});

// Валидация и активация кнопки на первом шаге
events.on('order:change', () => {
  const errors = orderModel.validate();
  const hasAddressError = !!errors.address;
  const hasPaymentError = !orderModel.getOrder().payment;
  const isValid = !hasAddressError && !hasPaymentError;
  orderForm.valid = isValid;
  orderForm.errors = errors.address || (hasPaymentError ? 'Выберите способ оплаты' : '');
});

// Отправка первого шага -> переход ко второму
events.on('order:submit', () => {
  contactsForm.render({ email: '', phone: '' });
  modal.content = contactsForm.render();
});

// Изменение полей формы контактов
events.on('contacts.email:change', ({ value }: { value: string }) => {
  orderModel.updateOrder('email', value);
  events.emit('contacts:change');
});

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

// Отправка заказа
events.on('contacts:submit', async () => {
  const orderData = orderModel.getOrder();
  const items = basketModel.getItems().map(item => item.id);
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
    
    // Обработчик закрытия успешного сообщения
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
  // Очищаем временные данные, если нужно
});