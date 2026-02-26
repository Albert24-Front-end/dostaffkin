import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageSwitcherComponent } from '../components/language_switcher/language';

@Component({
  selector: 'app-header',
  imports: [RouterLink, LanguageSwitcherComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

}
