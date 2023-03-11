import { Component } from "@angular/core";
import { Router } from "@angular/router";

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

  constructor(private router: Router) {
    let path = localStorage.getItem("path");
    if (path) {
      localStorage.removeItem("path");
      this.router.navigate([path]);
    }
  }

  toggle(link: Link) {
    this.activatedLink = link;
  }
}
