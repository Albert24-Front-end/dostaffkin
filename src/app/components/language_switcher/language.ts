import { Component, Inject, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language.html',
  styleUrl: './language.css',
})
export class LanguageSwitcherComponent {
  // Получаем текущий язык приложения (ru или en)
  constructor(@Inject(LOCALE_ID) public currentLocale: string) {
    // LOCALE_ID может вернуть 'ru-RU', приводим к краткому виду если нужно
    this.currentLocale = this.currentLocale.substring(0, 2);
  }

  onLanguageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const nextLang = target.value;

    if (this.currentLocale === nextLang) return;

    // Сохраняем выбор в localStorage для вашего корневого редиректа
    localStorage.setItem('userLanguage', nextLang);

    const currentUrl = window.location.href;
    
    // Заменяем сегмент пути /ru/ на /en/ или наоборот
    // Эта регулярка корректно обработает https://.../dostaffkin/ru/page
    const newUrl = currentUrl.replace(/\/(ru|en)(\/|$)/, `/${nextLang}/`);
    
    window.location.href = newUrl;
  }
}