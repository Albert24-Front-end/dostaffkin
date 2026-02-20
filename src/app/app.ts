import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet/>',
})
export class App {
  title = 'Delivery service';

  constructor(private titleService: Title) {
    this.titleService.setTitle($localize`${this.title}`);
  };

  localesList: object = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' }
  ]
};

