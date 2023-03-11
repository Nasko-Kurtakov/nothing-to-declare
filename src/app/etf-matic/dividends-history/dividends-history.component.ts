import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgxCSVParserError } from "ngx-csv-parser";
import { map, Subscription } from "rxjs";
import {
  ETFMaticParser,
  IOptions,
} from "../etf-matic-parser/etf-matic-parser.component";
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
export class DividendHistoryComponent implements OnInit, OnDestroy {
  @Input() etfNames: string[] = [];
  @ViewChild(ETFMaticParser, { static: true })
  parser!: ETFMaticParser<IEtfMovementRecord>;

  dividendColumns: string[] = ["name", "dividendRecieved", "taxDue"];
  sub: Subscription | null = null;
  dividends: IEtfDividentWithTax[] = [];

  ngOnInit() {
    this.sub = this.parser
      .parsedData()
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

  get options(): IOptions<IEtfMovementRecord, IEtfDividentWithTax> {
    return {
      title: () => "Movements File",
      tableTitle: () => "Movements Records",
      records: () => this.dividends,
      transform: this.transform,
      groupBy: () => "movementType",
      tableColumns: () => this.dividendColumns,
    };
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

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
