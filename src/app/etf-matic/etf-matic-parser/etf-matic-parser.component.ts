import {
  Component,
  ContentChildren,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
} from "@angular/core";
import { MatTable, MatColumnDef } from "@angular/material/table";
import { NgxCsvParser, NgxCSVParserError } from "ngx-csv-parser";
import { map, Observable, Subject, switchMap } from "rxjs";
import { IOptions, RecordHash } from "../models/interfaces";

@Component({
  selector: "app-etf-matic-parser",
  templateUrl: "./etf-matic-parser.component.html",
  styleUrls: ["./etf-matic-parser.component.scss"],
})
export class ETFMaticParser<K, S = K> implements OnDestroy {
  fileName = "";
  tableColumns: string[] = [];
  isTableVisible: boolean = true;

  @Input() options!: IOptions<K, S>;

  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ContentChildren(MatColumnDef) columnDefs!: QueryList<MatColumnDef>;

  protected file = new Subject();

  constructor(private ngxCsvParser: NgxCsvParser) {}

  ngAfterContentInit() {
    this.columnDefs.forEach((columnDef) => this.table.addColumnDef(columnDef));
    this.isTableVisible = false;
  }

  get title(): string {
    return this.options!.title();
  }

  get records(): S[] {
    let records = this.options.records();
    return records;
  }

  get tableTitle(): string {
    return this.options.tableTitle();
  }

  get columns(): any[] {
    return this.options.tableColumns();
  }

  get fileHelperText(): string {
    return this.options.fileHelperText();
  }

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
      map((result: any[]) => this.options.transform(result)),
      map((data: K[]) => this.group<K>(data, this.groupBy))
    );
  }

  get groupBy(): string {
    return this.options.groupBy();
  }

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
