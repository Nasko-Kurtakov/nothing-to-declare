import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgxCSVParserError } from "ngx-csv-parser";
import { map, Subscription } from "rxjs";
import { ETFMaticParser } from "../etf-matic-parser/etf-matic-parser.directive";
import {
  IEtfMovementRecord,
  IEtfTradeRecord,
  ITradeSum,
  RecordHash,
} from "../models/etf-record.interface";
import { IndexTrades } from "../models/index-trades";

@Component({
  selector: "app-trade-history",
  templateUrl: "./trade-history.component.html",
  styleUrls: ["./trade-history.component.scss"],
})
export class TradeHistoryComponent
  extends ETFMaticParser<IEtfTradeRecord>
  implements OnInit, OnDestroy
{
  tradingColumns: string[] = [
    "name",
    "totalQuantity",
    "avaragePrice",
    "totalPrice",
  ];
  trades: ITradeSum[] = [];

  parseFileSub: Subscription | null = null;
  etfNames: string[] = [];

  ngOnInit() {
    this.parsedData()
      .pipe(
        map((tradeRecords: RecordHash<IEtfTradeRecord[]>) =>
          this.sumTrades(tradeRecords)
        )
      )
      .subscribe({
        next: (tradesSummed: ITradeSum[]) => {
          this.trades = tradesSummed;
          this.etfNames = this.trades.map((t) => t.name);
          console.log(tradesSummed);
        },
        error: (error: NgxCSVParserError): void => {
          console.log("Error", error);
        },
      });
  }

  transform(parsedData: any[] | NgxCSVParserError): IEtfTradeRecord[] {
    if (Array.isArray(parsedData)) {
      return parsedData.map((v) => {
        return {
          ...v,
          Price: +v.Price,
          Quantity: +v.Quantity,
          Total: +v["Total(€)"],
        };
      });
    } else {
      return [];
    }
  }

  transformDividentsRecords(
    parsedData: any[] | NgxCSVParserError
  ): IEtfMovementRecord[] {
    if (Array.isArray(parsedData)) {
      return parsedData.map((v) => {
        return {
          date: new Date(v.date),
          movementType: v["Movement type"],
          amount: +v["Amount(€)"],
        };
      });
    } else {
      return [];
    }
  }

  sumTrades(tradeRecords: RecordHash<IEtfTradeRecord[]>): ITradeSum[] {
    var tradesSummed: ITradeSum[] = [];

    for (const symbol in tradeRecords) {
      let trades = tradeRecords[symbol];
      const total = trades.reduce(
        (total, record: IEtfTradeRecord) => {
          total.price += record.Total;
          const isSell = record.Total < 0;
          if (isSell) {
            total.quantity -= record.Quantity;
          } else {
            total.quantity += record.Quantity;
          }
          return total;
        },
        { quantity: 0, price: 0 }
      );
      tradesSummed.push(
        new IndexTrades(trades[0].Name, total.quantity, total.price)
      );
    }

    return tradesSummed;
  }

  get groupBy(): string {
    return "Symbol";
  }

  get title(): string {
    return "Trade History";
  }

  get records(): ITradeSum[] {
    return this.trades;
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.parseFileSub?.unsubscribe();
  }
}
