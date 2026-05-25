
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