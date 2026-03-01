import { Component, Inject, LOCALE_ID, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language.html',
  styleUrl: './language.css',
})
export class LanguageSwitcherComponent {
  isOpen = false;
  
  // Список языков с флагами (можно использовать emoji или пути к файлам)
  languages = [
    { 
      code: 'uz', 
      label: "O'zbekcha", 
      // flag: 'https://flagcdn.com/w40/uz.png' 
      flag: 'images/flags/TwemojiFlagUzbekistan.svg' 
    },
    { 
      code: 'ru', 
      label: 'Русский', 
      // flag: 'https://flagcdn.com/w40/ru.png' 
      flag: 'images/flags/TwemojiFlagRussia.svg' 
    },
    { 
      code: 'en', 
      label: 'English', 
      // flag: 'https://flagcdn.com/w40/gb.png' 
      flag: 'images/flags/TwemojiFlagUnitedStates.svg' 
    },
  ];

  // Получаем текущий язык приложения (ru или en)
  constructor(
    @Inject(LOCALE_ID) public currentLocale: string,
    private eRef: ElementRef
  ) {
    this.currentLocale = this.currentLocale.substring(0, 2);
  }

  // Закрытие при клике вне компонента
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  getActiveLang() {
    return this.languages.find(l => l.code === this.currentLocale) || this.languages[0];
  }

  switchLanguage(langCode: string) {
    if (this.currentLocale === langCode) return;

    localStorage.setItem('userLanguage', langCode);
    
    const currentUrl = window.location.href;
    // Регулярка для GitHub Pages с учетом папок /ru/ и /en/
    const newUrl = currentUrl.replace(/\/(ru|en)(\/|$)/, `/${langCode}/`);
    
    window.location.href = newUrl;
  }
}