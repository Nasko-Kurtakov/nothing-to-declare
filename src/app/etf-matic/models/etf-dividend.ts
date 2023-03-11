import { IEtfDividentWithTax } from "./etf-record.interface";

//DIVIDENT TAX for EU ETFs is 5%;
const DIVIDENT_TAX = 0.05;

export class EtfDividentWithTax implements IEtfDividentWithTax {
  constructor(public name: string, public dividendRecieved: number) {}

  public get taxDue() {
    return +(this.dividendRecieved * DIVIDENT_TAX).toFixed(5);
  }
}
