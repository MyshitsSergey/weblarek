// import { Api } from '../base/Api';
// import { IProduct, IOrder, IOrderResult, IProductsResponse } from '../../types';

// export class LarekApi {
//   private api: Api;

//   constructor(baseUrl: string, options?: RequestInit) {
//     this.api = new Api(baseUrl, options);
//   }

//   // Получение списка товаров с сервера
//   async getProducts(): Promise<IProduct[]> {
//     const response = await this.api.get<IProductsResponse>('/product');
//     return response.items;
//   }

//   // Отправка заказа на сервер
//   async postOrder(order: IOrder): Promise<IOrderResult> {
//     return this.api.post<IOrderResult>('/order', order);
//   }
// }

// src/components/Models/LarekApi.ts
// src/components/Models/LarekApi.ts
// src/components/Models/LarekApi.ts
import { IApi, IOrder, IOrderResult, IProductsResponse } from '../../types';

export class LarekApi {
  private api: IApi;

  constructor(apiInstance: IApi) {
    this.api = apiInstance;
  }

  async getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>('/product');
  }

  async postOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post<IOrderResult>('/order', order);
  }
}