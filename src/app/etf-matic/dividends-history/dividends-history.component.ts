import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { NgxCSVParserError } from "ngx-csv-parser";
import { map, Subscription } from "rxjs";
import { ETFMaticParser } from "../etf-matic-parser/etf-matic-parser.directive";
import { EtfDividentWithTax } from "../models/etf-dividend";
import {
  IEtfDividentWithTax,
  IEtfMovementRecord,
  RecordHash,
} from "../models/etf-record.interface";

@Component({
  selector: "app-dividends-history",
  templateUrl: "./dividends-history.component.html",
  styleUrls: ["./dividends-history.component.scss"],
})
export class DividendHistoryComponent
  extends ETFMaticParser<IEtfMovementRecord>
  implements OnInit, OnDestroy
{
  @Input() etfNames: string[] = [];

  dividendColumns: string[] = ["name", "dividendRecieved", "taxDue"];
  sub: Subscription | null = null;
  dividends: IEtfDividentWithTax[] = [];

  ngOnInit() {
    this.sub = this.parsedData()
      .pipe(
        map((data: RecordHash<IEtfMovementRecord[]>) => data["Dividends"]),
        map((data: IEtfMovementRecord[]) => {
          const totalDividentsRecieved = data.reduce((sum, payment) => {
            return sum + payment.amount;
          }, 0);

          const dividentsPerETF = totalDividentsRecieved / this.etfNames.length;

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
      });
  }

  get groupBy(): string {
    return "movementType";
  }

  transform(parsedData: any[] | NgxCSVParserError): IEtfMovementRecord[] {
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

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.sub?.unsubscribe();
  }
}
