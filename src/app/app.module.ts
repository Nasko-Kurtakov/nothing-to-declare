import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { NgxCsvParserModule } from "ngx-csv-parser";
import { MatTableModule } from "@angular/material/table";
import { MatGridListModule } from "@angular/material/grid-list";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { EtfCalculatorComponent } from "./etf-matic/etf-calculator.component";
import { TradeHistoryComponent } from "./etf-matic/trade-history/trade-history.component";
import { DividendHistoryComponent } from "./etf-matic/dividends-history/dividends-history.component";

@NgModule({
  declarations: [
    AppComponent,
    EtfCalculatorComponent,
    TradeHistoryComponent,
    DividendHistoryComponent,
  ],
  imports: [
    BrowserModule,
    MatListModule,
    AppRoutingModule,
    NgxCsvParserModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatGridListModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
