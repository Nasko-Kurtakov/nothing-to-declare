import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EtfCalculatorComponent } from "./etf/etf-calculator/etf-calculator.component";

const routes: Routes = [
  {
    path: "etf",
    component: EtfCalculatorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
