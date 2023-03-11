export interface IEtfTradeRecord {
  date: string;
  Exchange: string;
  ISIN: string;
  Name: string;
  Price: number;
  Quantity: number;
  Symbol: string;
  Total: number;
  Type: string;
}

export interface IEtfMovementRecord {
  date: Date;
  movementType: string;
  amount: number;
}

export interface ITradeSum {
  name: string;
  totalQuantity: number;
  totalPrice: number;
  avaragePrice: number;
}

export interface IEtfDividentWithTax {
  name: string;
  dividendRecieved: number;
  taxDue: number;
}

export interface RecordHash<T> {
  [key: string]: T;
}
