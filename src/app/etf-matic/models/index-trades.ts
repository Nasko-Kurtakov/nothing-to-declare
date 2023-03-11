import { ITradeSum } from "./etf-record.interface";

export class IndexTrades implements ITradeSum {
  constructor(
    public name: string,
    public totalQuantity: number,
    public totalPrice: number
  ) {}

  public get avaragePrice() {
    return this.totalPrice / this.totalQuantity;
  }
}
