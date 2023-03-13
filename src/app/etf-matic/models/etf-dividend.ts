import { EURO_TO_BGN, IEtfDividentWithTax } from "./interfaces";

//DIVIDENT TAX for EU ETFs is 5%;
const DIVIDENT_TAX = 0.05;

export class EtfDividentWithTax implements IEtfDividentWithTax {
  public dividendRecieved: number;
  constructor(public name: string, dividendRecieved: number) {
    this.dividendRecieved = this.format(dividendRecieved);
  }

  public get taxDue() {
    return this.format(this.dividendRecieved * DIVIDENT_TAX);
  }

  public get dividendInBGN() {
    return this.format(this.dividendRecieved * EURO_TO_BGN);
  }

  public get taxInBGN() {
    return this.format(this.taxDue * EURO_TO_BGN);
  }

  private format(number: number): number {
    return +number.toFixed(5);
  }
}
