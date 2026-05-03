export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Тип для способа оплаты (можно использовать строковой литерал)
export type TPayment = 'online' | 'upon receipt';

// Интерфейс товара
export interface IProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
}

// Интерфейс данных покупателя
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Данные, которые отправляем на сервер при создании заказа
export interface IOrder {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  items: string[];   // массив id товаров
  total: number;
}

// Ответ сервера после успешного оформления заказа
export interface IOrderResult {
  id: string;
  total: number;
}

export interface IProductsResponse {
  items: IProduct[];
  total: number;
}

import { CatalogModel } from './components/Models/CatalogModel';
import { LarekApi } from './components/Models/LarekApi';
// другие импорты

// Создаём экземпляр API для общения с сервером
const api = new LarekApi('https://larek-api.nomoreparties.co');

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