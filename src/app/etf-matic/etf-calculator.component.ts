import { Component, OnInit, ViewChild } from "@angular/core";
import { TradeHistoryComponent } from "./trade-history/trade-history.component";

@Component({
  selector: "app-etf-calculator",
  templateUrl: "./etf-calculator.component.html",
  styleUrls: ["./etf-calculator.component.scss"],
})
export class EtfCalculatorComponent {
  @ViewChild(TradeHistoryComponent, { static: true })
  trades!: TradeHistoryComponent;

  get hasTrades(): boolean {
    return this.trades && this.trades.etfNames.length > 0;
  }
}
