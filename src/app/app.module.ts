import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatListModule } from "@angular/material/list";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { EtfCalculatorComponent } from "./etf/etf-calculator/etf-calculator.component";

@NgModule({
  declarations: [AppComponent, EtfCalculatorComponent],
  imports: [BrowserModule, MatListModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
