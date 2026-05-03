import './scss/styles.scss';

// main.ts
import { API_URL } from './utils/constants';
import { LarekApi } from './components/Models/LarekApi';



import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { OrderModel } from './components/Models/OrderModel';
import { apiProducts } from './utils/data';
import { IProduct } from './types';

// 1. Тестируем каталог
const catalog = new CatalogModel();
catalog.setItems(apiProducts.items as IProduct[]);
console.log('Все товары каталога:', catalog.getItems());
console.log('Первый товар по id:', catalog.getProductById(apiProducts.items[0].id));
catalog.setPreview(apiProducts.items[0]);
console.log('Выбранный товар для просмотра:', catalog.getPreview());

// 2. Тестируем корзину
const basket = new BasketModel();
basket.addItem(apiProducts.items[0]);
basket.addItem(apiProducts.items[1]);
console.log('Корзина после добавления двух товаров:', basket.getItems());
console.log('Количество товаров:', basket.getCount());
console.log('Общая стоимость:', basket.getTotal());
basket.removeItem(apiProducts.items[0].id);
console.log('Корзина после удаления первого товара:', basket.getItems());
console.log('Есть ли товар с id=1?', basket.hasItem('1'));

// 3. Тестируем данные заказа
const order = new OrderModel();
order.updateOrder('payment', 'online');
order.updateOrder('address', 'ул. Пушкина, 10');
order.updateOrder('phone', '+79991234567');
order.updateOrder('email', 'test@test.ru');
console.log('Заказ после заполнения:', order.getOrder());
console.log('Ошибки валидации (должен быть пустой объект):', order.validate());

order.clear();
console.log('После очистки заказа:', order.getOrder());
console.log('Ошибки валидации после очистки:', order.validate());


const api = new LarekApi(API_URL); // теперь базовый URL включает /api/weblarek

// Создаём модель каталога
const catalogModel = new CatalogModel();

// Получаем товары с сервера
api.getProducts()
  .then(products => {
    // Сохраняем полученный массив в модель каталога
    catalogModel.setItems(products);
    console.log('✅ Товары получены с сервера и сохранены в модели:', catalogModel.getItems());
  })
  .catch(err => {
    console.error('Ошибка при загрузке товаров:', err);
  });