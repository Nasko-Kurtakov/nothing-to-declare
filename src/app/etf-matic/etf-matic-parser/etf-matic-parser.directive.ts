import { Directive, OnDestroy, OnInit } from "@angular/core";
import { NgxCsvParser, NgxCSVParserError } from "ngx-csv-parser";
import { map, Observable, Subject, Subscription, switchMap } from "rxjs";
import { RecordHash } from "../models/etf-record.interface";
import { IndexTrades } from "../models/index-trades";

@Directive({})
export abstract class ETFMaticParser<K> implements OnDestroy {
  fileName = "";
  tableColumns: string[] = []; //???HMMM

  protected file = new Subject();

  constructor(private ngxCsvParser: NgxCsvParser) {}

  private parseCSV(file: any): Observable<any[]> {
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

  public parsedData(): Observable<RecordHash<K[]>> {
    return this.file.pipe(
      switchMap((file: any) => {
        this.fileName = file.name;
        return this.parseCSV(file);
      }),
      map((result: any[]) => this.transform(result)),
      map((data: K[]) => this.group<K>(data, this.groupBy))
    );
  }

  abstract transform(parsedData: any[] | NgxCSVParserError): K[];

  abstract get groupBy(): string;

  //   transform(parsedData: any[] | NgxCSVParserError): IEtfTradeRecord[] {
  //     if (Array.isArray(parsedData)) {
  //       return parsedData.map((v) => {
  //         return {
  //           ...v,
  //           Price: +v.Price,
  //           Quantity: +v.Quantity,
  //           Total: +v["Total(€)"],
  //         };
  //       });
  //     } else {
  //       return [];
  //     }
  //   }

  //   transformDividentsRecords(
  //     parsedData: any[] | NgxCSVParserError
  //   ): IEtfMovementRecord[] {
  //     if (Array.isArray(parsedData)) {
  //       return parsedData.map((v) => {
  //         return {
  //           date: new Date(v.date),
  //           movementType: v["Movement type"],
  //           amount: +v["Amount(€)"],
  //         };
  //       });
  //     } else {
  //       return [];
  //     }
  //   }

  //   sumTrades(tradeRecords: RecordHash<IEtfTradeRecord[]>): ITradeSum[] {
  //     var tradesSummed: ITradeSum[] = [];

  //     for (const symbol in tradeRecords) {
  //       let trades = tradeRecords[symbol];
  //       const total = trades.reduce(
  //         (total, record: IEtfTradeRecord) => {
  //           total.price += record.Total;
  //           const isSell = record.Total < 0;
  //           if (isSell) {
  //             total.quantity -= record.Quantity;
  //           } else {
  //             total.quantity += record.Quantity;
  //           }
  //           return total;
  //         },
  //         { quantity: 0, price: 0 }
  //       );
  //       tradesSummed.push(
  //         new IndexTrades(trades[0].Name, total.quantity, total.price)
  //       );
  //     }

  //     return tradesSummed;
  //   }

  group<T>(csvRecords: T[], groupBy: string): RecordHash<T[]> {
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
    this.file.complete();
  }
}
