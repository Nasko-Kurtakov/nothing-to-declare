import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgxCSVParserError } from "ngx-csv-parser";
import { map, Subscription } from "rxjs";
import {
  ETFMaticParser,
  IOptions,
} from "../etf-matic-parser/etf-matic-parser.component";
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
export class TradeHistoryComponent implements OnInit, OnDestroy {
  tradingColumns: string[] = [
    "name",
    "totalQuantity",
    "avaragePrice",
    "totalPrice",
  ];
  trades: ITradeSum[] = [];
  etfNames: string[] = [];
  parseFileSub: Subscription | null = null;

  @ViewChild(ETFMaticParser, { static: true }) parser!: ETFMaticParser<
    IEtfTradeRecord,
    ITradeSum
  >;

  ngOnInit() {
    this.parseFileSub = this.parser
      .parsedData()
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

  get options(): IOptions<IEtfTradeRecord, ITradeSum> {
    return {
      title: () => "Trade History",
      tableTitle: () => "Trade Records",
      records: () => this.trades,
      transform: this.transform,
      groupBy: () => "Symbol",
      tableColumns: () => this.tradingColumns,
    };
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

  ngOnDestroy(): void {
    this.parseFileSub?.unsubscribe();
  }
}
