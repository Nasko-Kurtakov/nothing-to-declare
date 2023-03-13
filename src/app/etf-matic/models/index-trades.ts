import { EURO_TO_BGN, ITradeSum } from "./interfaces";

export class IndexTrades implements ITradeSum {
  public totalPrice: number;
  public totalQuantity: number;
  constructor(public name: string, totalQuantity: number, totalPrice: number) {
    this.totalPrice = this.format(totalPrice);
    this.totalQuantity = this.format(totalQuantity);
  }

  public get avaragePrice() {
    return this.format(this.totalPrice / this.totalQuantity);
  }

  public get avaragePriceInBGN() {
    return this.format(this.avaragePrice * EURO_TO_BGN);
  }

  public get totalPriceInBGN() {
    return this.format(this.totalPrice * EURO_TO_BGN);
  }

  private format(number: number): number {
    return +number.toFixed(5);
  }
}
