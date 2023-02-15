import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EtfCalculatorComponent } from "./etf-calculator.component";

describe("EtfCalculatorComponent", () => {
  let component: EtfCalculatorComponent;
  let fixture: ComponentFixture<EtfCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtfCalculatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EtfCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
