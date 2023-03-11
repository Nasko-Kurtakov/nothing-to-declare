import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgxCsvParser, NgxCSVParserError } from "ngx-csv-parser";
import { map, Observable, Subject, Subscription, switchMap } from "rxjs";
import { EtfDividentWithTax } from "./models/etf-dividend";
import {
  IEtfDividentWithTax,
  IEtfMovementRecord,
  IEtfTradeRecord,
  ITradeSum,
  RecordHash,
} from "./models/etf-record.interface";
import { IndexTrades } from "./models/index-trades";

@Component({
  selector: "app-etf-calculator",
  templateUrl: "./etf-calculator.component.html",
  styleUrls: ["./etf-calculator.component.scss"],
})
export class EtfCalculatorComponent implements OnInit, OnDestroy {
  buysFileName = "";
  dividentsFileName = "";
  tradingColumns: string[] = [
    "name",
    "totalQuantity",
    "avaragePrice",
    "totalPrice",
  ];
  dividendColumns: string[] = ["name", "dividendRecieved", "taxDue"];
  buysFile = new Subject();
  dividentsFile = new Subject();
  fileChangeSubs: Array<Subscription> = [];
  trades: ITradeSum[] = [];
  etfNames: string[] = [];
  dividends: IEtfDividentWithTax[] = [];

  constructor(private ngxCsvParser: NgxCsvParser) {}

  ngOnInit() {
    this.fileChangeSubs.push(
      this.buysFile
        .pipe(
          switchMap((file: any) => {
            this.buysFileName = file.name;
            return this.parseCSV(file);
          }),
          map((result: any[]) => this.transform(result)),
          map((data: IEtfTradeRecord[]) =>
            this.group<IEtfTradeRecord[]>(data, "Symbol")
          ),
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
        })
    );

    this.fileChangeSubs.push(
      this.dividentsFile
        .pipe(
          switchMap((file: any) => {
            this.dividentsFileName = file.name;
            return this.parseCSV(file);
          }),
          map((result: any[]) => this.transformDividentsRecords(result)),
          map((data: IEtfMovementRecord[]) =>
            this.group<IEtfMovementRecord[]>(data, "movementType")
          ),
          map((data: RecordHash<IEtfMovementRecord[]>) => data["Dividends"]),
          map((data: IEtfMovementRecord[]) => {
            const totalDividentsRecieved = data.reduce((sum, payment) => {
              return sum + payment.amount;
            }, 0);

            const dividentsPerETF =
              totalDividentsRecieved / this.etfNames.length;

            return this.etfNames.map(
              (etfName) => new EtfDividentWithTax(etfName, dividentsPerETF)
            );
          })
        )
        .subscribe({
          next: (dividentsMovements: IEtfDividentWithTax[]) => {
            this.dividends = dividentsMovements;
            console.log(dividentsMovements);
          },
          error: (error: NgxCSVParserError): void => {
            console.log("Error", error);
          },
        })
    );
  }

  parseCSV(file: any): Observable<any[]> {
    return this.ngxCsvParser
      .parse(file, {
        header: true,
        delimiter: ",",
        encoding: "utf8",
      })
      .pipe(
        map((result: any[] | NgxCSVParserError) => {
          if (Array.isArray(result)) {
            return result;
          } else {
            throw result;
          }
        })
      );
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

  group<T>(csvRecords: any, groupBy: string): RecordHash<T> {
    return csvRecords.reduce((acc: RecordHash<T[]>, record: any) => {
      if (!acc[record[groupBy]]) {
        acc[record[groupBy]] = [];
      }
      acc[record[groupBy]].push(record);
      return acc;
    }, {});
  }

  fileChangeListener($event: any, reciever: Subject<any>): void {
    const files = $event.srcElement.files;
    reciever.next(files[0]);
  }

  ngOnDestroy(): void {
    this.buysFile.complete();
    this.dividentsFile.complete();
    this.fileChangeSubs.forEach((s) => s.unsubscribe());
  }
}
