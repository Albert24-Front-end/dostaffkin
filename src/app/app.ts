import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet/>',
  standalone: true,
})
export class App implements OnInit {
  title = 'Delivery service';

  constructor(
    private titleService: Title,
    @Inject(LOCALE_ID) private locale: string, // Получаем текущий язык
  ) {
    this.titleService.setTitle($localize`${this.title}`);
  }

  ngOnInit() {
    // Запускаем загрузку карт при старте приложения
    this.loadYandexMaps();
  }

  private loadYandexMaps() {
    // Мапим локали Angular на форматы, которые понимает Яндекс
    const localeMap: Record<string, string> = {
      'ru': 'ru_RU',
      'en': 'en_US',
      'uz': 'uz_UZ',
    };

    // Определяем язык для API. Если в localeMap нет совпадения, берем ru_RU
    const shortLocale = this.locale.substring(0, 2);
    const yandexLang = localeMap[shortLocale] || 'ru_RU';

    // Создаем элемент <script>
    const script = document.createElement('script');
    script.type = 'text/javascript';
    // Вставь свой реальный API-ключ вместо 'ВАШ_API_КЛЮЧ'
    script.src = `https://api-maps.yandex.ru/2.1/?lang=${yandexLang}&apikey=4e72d839-394a-4c9f-830f-592f62c600e6&suggest_apikey=50e1707b-b630-4f14-8dc6-d0304dbadbff`;
    script.async = true; // Загружаем асинхронно, чтобы не тормозить отрисовку

    // Добавляем скрипт в голову документа
    document.head.appendChild(script);
  }
};

