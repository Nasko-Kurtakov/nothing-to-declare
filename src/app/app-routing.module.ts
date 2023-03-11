import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EtfCalculatorComponent } from "./etf-matic/etf-calculator.component";

const routes: Routes = [
  { path: "", redirectTo: "etf", pathMatch: "full" },
  {
    path: "etf",
    component: EtfCalculatorComponent,
  },
  { path: "**", redirectTo: "etf" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
