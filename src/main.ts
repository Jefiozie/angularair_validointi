import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, RouterLink, RouterOutlet } from "@angular/router";
import 'zone.js/dist/zone';
@Component({
  selector: "my-app",
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header>
      <a routerLink="">Start</a>
      <a routerLink="/simple">Simple</a>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <style>
      :host {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 2rem 1fr;
        height: 100vh;
      }
      header {
        display: inline-flex;
        align-items: center;
        justify-content: start;
        gap: 0.5rem;
        background-color: #0a0a0a;
      }
      main {
      }
    </style>
  `,
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter([
      {
        path: "",
        loadComponent: () =>
          import("./app/template-form/template-form.component").then(
            (m) => m.TemplateFormComponent
          ),
      },
      {
        path: "simple",
        loadComponent: () =>
          import("./app/simple-validation/simple-validation.component").then(
            (m) => m.SimpleValidationComponent
          ),
      },
      { path: "**", redirectTo: "", pathMatch: "full" },
    ]),
  ],
});
