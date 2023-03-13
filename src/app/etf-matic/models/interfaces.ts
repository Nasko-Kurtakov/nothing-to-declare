import { NgxCSVParserError } from "ngx-csv-parser";

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

export interface IOptions<K, S = K> {
  title: () => string; //Trade History,
  tableTitle: () => string;
  records: () => S[];
  transform(parsedData: any[] | NgxCSVParserError): K[];
  tableColumns: () => any[];
  groupBy: () => string;
  fileHelperText: () => string;
}

export const EURO_TO_BGN = 1.95583;
