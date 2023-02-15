import { Component } from "@angular/core";

interface Link {
  text: string;
  href: string;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "nothing-to-declare";
  links = [
    {
      text: "ETF",
      href: "/etf",
    },
  ];
  activatedLink: Link | null = null;

  toggle(link: Link) {
    this.activatedLink = link;
  }
}
