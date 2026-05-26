import './scss/styles.scss';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { LarekApi } from './components/Models/LarekApi';
import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { OrderModel } from './components/Models/OrderModel';
import { Page } from './components/view/Page';
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

// Флаг для предотвращения обновления превью после оформления заказа
let isOrderCompleted = false;

// 1. Базовые классы
const events = new EventEmitter();
const baseApi = new Api(API_URL);
const api = new LarekApi(baseApi as IApi);

// 2. Модели
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

// 3. Представления (статические компоненты — создаём один раз)
const header = new Header(ensureElement('.header'), events);
const page = new Page(ensureElement('.page__wrapper'));

const modal = new Modal(ensureElement('#modal-container') as HTMLElement, events);

const basketElement = cloneTemplate<HTMLElement>('#basket');
const basketView = new Basket(basketElement, events);

const successElement = cloneTemplate<HTMLElement>('#success');
const successView = new Success(successElement, events);

// Создаём PreviewCard с обработчиком для кнопки
const previewCardElement = cloneTemplate<HTMLElement>('#card-preview');
const previewCard = new PreviewCard(previewCardElement, {
  onToggleBasket: () => {
    const product = catalogModel.getPreview();
    if (product) {
      console.log('🛒 PreviewCard: вызываем card:toggleBasket', product.id);
      events.emit('card:toggleBasket', { id: product.id });
    }
  }
});

const orderFormElement = cloneTemplate<HTMLFormElement>('#order');
const orderForm = new OrderForm(orderFormElement, events);

const contactsFormElement = cloneTemplate<HTMLFormElement>('#contacts');
const contactsForm = new ContactsForm(contactsFormElement, events);

// 4. Загрузка каталога с сервера
api.getProducts()
  .then(({ items }) => {
    console.log('📦 Товары загружены с сервера:', items.length);
    catalogModel.setItems(items);
  })
  .catch(console.error);

// ===================== ОБРАБОТЧИКИ СОБЫТИЙ =====================

// ---------- КАТАЛОГ ----------
events.on('catalog:changed', () => {
  console.log('🔄 catalog:changed получен');
  const items = catalogModel.getItems();
  const cards = items.map((item) => {
    const cardElement = cloneTemplate<HTMLElement>('#card-catalog');
    const card = new CatalogCard(cardElement, {
      onClick: () => {
        console.log('🖱️ Клик по карточке, id:', item.id);
        events.emit('card:select', { id: item.id });
      }
    });
    card.render(item);
    return cardElement;
  });
  page.catalog = cards;
  console.log('✅ Каталог отрисован, карточек:', cards.length);
});

events.on('card:select', ({ id }: { id: string }) => {
  console.log('🎴 card:select получен, id:', id);
  const product = catalogModel.getProductById(id);
  if (product) {
    console.log('📦 Продукт найден:', product.title);
    catalogModel.setPreview(product);
  } else {
    console.log('❌ Продукт не найден');
  }
});

// ---------- ПРЕВЬЮ ----------
events.on('preview:changed', () => {
  console.log('🔄 preview:changed получен');
  const product = catalogModel.getPreview();
  if (!product) {
    console.log('❌ Нет продукта для превью');
    return;
  }
  console.log('📦 Открываем превью для товара:', product.title);
  previewCard.render(product);
  previewCard.buttonText = basketModel.hasItem(product.id)
    ? 'Удалить из корзины'
    : 'В корзину';
  previewCard.buttonDisabled = product.price === null;
  modal.content = previewCard.element;
  modal.open();
  console.log('✅ Превью открыто');
});

// ---------- КОРЗИНА ----------
events.on('card:toggleBasket', ({ id }: { id: string }) => {
  console.log('🛒 card:toggleBasket получен, id:', id);
  const product = catalogModel.getProductById(id);
  if (basketModel.hasItem(id)) {
    console.log('🗑️ Удаляем из корзины');
    basketModel.removeItem(id);
  } else {
    console.log('➕ Добавляем в корзину');
    if (product) basketModel.addItem(product);
  }
  const currentPreview = catalogModel.getPreview();
  if (currentPreview && currentPreview.id === id) {
    console.log('🔄 Обновляем превью');
    catalogModel.setPreview(currentPreview);
  }
});

events.on('basket:changed', () => {
  console.log('🔄 basket:changed получен, товаров в корзине:', basketModel.getCount());
  header.counter = basketModel.getCount();
  // Не обновляем превью, если заказ уже оформлен
  if (!isOrderCompleted) {
    const currentPreview = catalogModel.getPreview();
    if (currentPreview) {
      console.log('🔄 Обновляем превью из-за изменения корзины');
      catalogModel.setPreview(currentPreview);
    }
  } else {
    console.log('🚫 Пропускаем обновление превью (заказ оформлен)');
  }
});

events.on('basket:open', () => {
  console.log('🛒 basket:open получен');
  const items = basketModel.getItems();
  console.log('Товаров в корзине:', items.length);
  const cards = items.map((item, index) => {
    const cardElement = cloneTemplate<HTMLElement>('#card-basket');
    const basketCard = new BasketCard(cardElement, {
      onRemove: () => {
        console.log('🗑️ Удаление товара из корзины, id:', item.id);
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
  modal.content = basketView.render();
  modal.open();
  console.log('✅ Корзина открыта');
});

events.on('basket:remove', ({ id }: { id: string }) => {
  console.log('🗑️ basket:remove получен, id:', id);
  basketModel.removeItem(id);
  const modalElement = document.querySelector('#modal-container');
  if (modalElement && modalElement.classList.contains('modal_active')) {
    console.log('🔄 Обновляем отображение корзины');
    events.emit('basket:open');
  }
});

events.on('basket:checkout', () => {
  console.log('💳 basket:checkout получен, переход к оформлению');
  orderForm.render({ address: '', payment: '' });
  modal.content = orderForm.render();
  modal.open();
  console.log('✅ Форма заказа открыта');
});

// ---------- ФОРМА ЗАКАЗА (ПЕРВЫЙ ШАГ) ----------
events.on('order.address:change', ({ value }: { value: string }) => {
  console.log('📍 order.address:change получен, value:', value);
  orderModel.updateOrder('address', value);
});

events.on('order.payment:change', ({ payment }: { payment: 'online' | 'upon receipt' }) => {
  console.log('💳 order.payment:change получен, payment:', payment);
  orderModel.updateOrder('payment', payment);
});

events.on('order:changed', () => {
  console.log('🔄 order:changed получен');
  const order = orderModel.getOrder();
  const errors = orderModel.validate();
  console.log('Текущий заказ:', order);
  console.log('Ошибки валидации:', errors);
  
  // Обновляем форму заказа (первый шаг)
  const hasAddressError = !!errors.address;
  const hasPaymentError = !order?.payment;
  const isOrderValid = !hasAddressError && !hasPaymentError;
  orderForm.valid = isOrderValid;
  orderForm.errors = errors.address || (hasPaymentError ? 'Выберите способ оплаты' : '');
  orderForm.selectedPayment = order?.payment || null;
  if (order?.address !== undefined) {
    orderForm.address = order.address;
  }
  
  // Обновляем форму контактов (второй шаг) — для случая, если форма уже открыта
  const isContactsValid = !errors.email && !errors.phone;
  contactsForm.valid = isContactsValid;
  contactsForm.errors = errors.email || errors.phone || '';
  contactsForm.email = order?.email || '';
  contactsForm.phone = order?.phone || '';
  
  console.log('Форма заказа валидна:', isOrderValid);
  console.log('Форма контактов валидна:', isContactsValid);
});

events.on('order:submit', () => {
  console.log('📨 order:submit получен, переходим к форме контактов');
  // Сбрасываем форму контактов
  contactsForm.render({ email: '', phone: '' });
  // Обновляем валидацию
  const errors = orderModel.validate();
  const isValid = !errors.email && !errors.phone;
  contactsForm.valid = isValid;
  modal.content = contactsForm.render();
  modal.open();
  console.log('✅ Форма контактов открыта, валидна:', isValid);
});

// ---------- ФОРМА КОНТАКТОВ (ВТОРОЙ ШАГ) ----------
events.on('contacts.email:change', ({ value }: { value: string }) => {
  console.log('📧 contacts.email:change получен, value:', value);
  orderModel.updateOrder('email', value);
});

events.on('contacts.phone:change', ({ value }: { value: string }) => {
  console.log('📞 contacts.phone:change получен, value:', value);
  orderModel.updateOrder('phone', value);
});

// ---------- ОТПРАВКА ЗАКАЗА ----------
events.on('contacts:submit', async () => {
  console.log('📦 contacts:submit ПОЛУЧЕН');
  const orderData = orderModel.getOrder();
  console.log('Данные заказа для отправки:', orderData);
  
  if (!orderData) {
    console.error('❌ Нет данных заказа');
    alert('Заполните все поля заказа');
    return;
  }
  
  if (!orderData.email || !orderData.phone) {
    console.error('❌ Не заполнены email или телефон');
    alert('Заполните email и телефон');
    return;
  }
  
  const items = basketModel.getItems().map((item) => item.id);
  const total = basketModel.getTotal();
  
  console.log('Товары в корзине (id):', items);
  console.log('Общая сумма:', total);

  const order = {
    payment: orderData.payment,
    email: orderData.email,
    phone: orderData.phone,
    address: orderData.address,
    items,
    total,
  };
  
  console.log('Отправляем заказ на сервер:', order);

  try {
    const result = await api.postOrder(order);
    console.log('✅ Заказ успешно отправлен, результат:', result);
    
    // Устанавливаем флаг, чтобы предотвратить обновление превью
    isOrderCompleted = true;
    
    // Очищаем корзину и данные заказа
    basketModel.clear();
    orderModel.clear();
    console.log('🔄 Корзина и данные заказа очищены');
    
    // Небольшая задержка для обработки всех событий
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Устанавливаем сумму в successView
    successView.total = result.total;
    
    // Получаем отрендеренный элемент
    const successRenderedElement = successView.render();
    console.log('Success элемент:', successRenderedElement);
    
    // Устанавливаем контент модального окна и открываем его
    modal.content = successRenderedElement;
    modal.open();
    console.log('✅ Модальное окно успеха открыто');

    const onSuccessClose = () => {
      console.log('🚪 Закрытие окна успеха');
      isOrderCompleted = false;
      modal.close();
      events.off('success:close', onSuccessClose);
    };
    events.on('success:close', onSuccessClose);
  } catch (err) {
    console.error('❌ Ошибка при оформлении заказа:', err);
    alert('Произошла ошибка, попробуйте ещё раз');
  }
});

// ---------- МОДАЛЬНОЕ ОКНО ----------
events.on('modal:close', () => {
  console.log('🚪 modal:close получен');
});

console.log('🚀 Приложение запущено, все обработчики событий зарегистрированы');