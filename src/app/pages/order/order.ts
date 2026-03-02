import { Component, inject, signal } from '@angular/core';
import { Header } from '../../header/header';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DELIVERY_SIZES, DELIVERY_SPEEDS } from './order.config';
import { UpperCasePipe } from '@angular/common';
import { DeliveryApi } from '../../services/delivery-api';
import { OnlyNumbersDirective } from '../../directives/only-numbers.directive';
import { ToastrService } from 'ngx-toastr';
import { OrderStorageService } from '../../storage/order.storage.service';

declare var ymaps: any;

@Component({
  selector: 'app-order',
  imports: [Header, OnlyNumbersDirective, UpperCasePipe, ReactiveFormsModule],
  templateUrl: './order.html',
  styleUrl: './order.css',
})
export class Order {
  public readonly sizes = DELIVERY_SIZES;
  public readonly speeds = DELIVERY_SPEEDS;

  toastr = inject(ToastrService);

  public map: any; // объект карты Яндекса
  private mapRoute: any; // текущий нарисованный маршрут

  public routeForm: FormGroup;
  public orderForm: FormGroup;

  // Внедряем наше хранилище
  private storage = inject(OrderStorageService);

  // Теперь сигнал orderId берется из сервиса
  public orderId = this.storage.lastOrderId;

  // Сигналы:
  //   public orderId: any = signal(null);
  public calculationResult: any = signal(null);

  // Конструктор запускается первым делом, когда компонент создается в памяти.
  constructor(
    private formBuilder: FormBuilder,
    private deliveryApi: DeliveryApi,
  ) {
    // Создаем "чертеж" первой формы
    this.routeForm = this.formBuilder.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      size: ['xs', Validators.required],
      speed: ['regular', Validators.required],
    });
    // Создаем "чертеж" второй формы
    this.orderForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      comment: [''],
    });
  }

  // ngOnInit — это момент, когда Angular уже «нарисовал» компонент и готов работать с данными.
  ngOnInit() {
    // Ждем загрузки API Яндекса
    ymaps.ready(() => {
      if ('geolocation' in navigator) {
        // Спрашиваем у браузера: "Где мы?"
        navigator.geolocation.getCurrentPosition(
          (pos) => this.init(pos.coords.latitude, pos.coords.longitude), // Успех - выдаем геолокацию юзера
          () => this.init(), // Отказ — грузим карту по умолчанию (Москва)
        );
      } else {
        this.init();
      }
    });
  }

  // Метод init просто создает объект new ymaps.Map, делает обратное геокодирование для подстановки локации юзера в поле Откуда и вешает «подсказки» (автокомплит) на поля ввода адресов.
  public init(lat: any = null, lon: any = null) {
    this.map = new ymaps.Map('map', {
      center: [lat ?? 55.751244, lon ?? 37.618423],
      zoom: lat && lon ? 15 : 5,
      controls: ['zoomControl'],
    });

    // Обратное геокодирование: определяем ближайший адрес по координатам, подставляем в Откуда и добавляем поинт на карту
    if (lat != null && lon != null) {
      // Запрос к серверу Яндекса
      ymaps.geocode([lat, lon], { kind: 'house' }).then(
        (res: any) => {
          // Берем самый точный (первый) результат
          const first = res.geoObjects.get(0);
          if (first?.getAddressLine) {
            // Прямая запись в Angular форму:
            this.routeForm.controls['from'].setValue(first.getAddressLine());
            // Ставим метку на карте:
            this.map.geoObjects.add(first);
          }
        },
        () => {},
      );
    }

    // Подключаем подсказки адресов к полям от яндекса
    new ymaps.SuggestView('from').events.add('select', (event: any) =>
      this.routeForm.controls['from'].setValue(event.get('item')?.value ?? ''),
    );
    new ymaps.SuggestView('to').events.add('select', (event: any) =>
      this.routeForm.controls['to'].setValue(event.get('item')?.value ?? ''),
    );
  }

  // Выбор тарифа и скорости (selectSize / selectSpeed)
  public selectSize(size: string) {
    this.routeForm.controls['size'].setValue(size);
  }

  public selectSpeed(speed: string) {
    this.routeForm.controls['speed'].setValue(speed);
  }

  public calculate() {
    this.calculationResult.set(null);

    if (!this.map || this.routeForm.invalid) {
      return;
    }

    const { from, to, size, speed } = this.routeForm.getRawValue(); // Достаем все данные из формы разом

    if (this.mapRoute) {
      this.map.geoObjects.remove(this.mapRoute);
      this.mapRoute = null;
    }

    this.mapRoute = new ymaps.multiRouter.MultiRoute(
      { referencePoints: [from, to] }, // Точки А и Б
      { boundsAutoApply: false }, // Не дергать камеру карты слишком резко
    );
    this.map.geoObjects.add(this.mapRoute); // Добавляем маршрут на карту (он пока невидимый, идет запрос)

    this.mapRoute.model.events.add('requestsuccess', () => {
      // Этот код выполнится ТОЛЬКО когда Яндекс найдет путь и вернет данные о километрах
      try {
        const activeRoute = this.mapRoute.getActiveRoute();
        if (!activeRoute) {
          return this.failedCalculation();
        }

        const km = activeRoute.properties.get('distance').value / 1000;
        const sizeValue = size ?? '';
        const sizeConfig = this.sizes.find((item) => item.value === sizeValue);
        if (!sizeConfig) {
          return this.failedCalculation();
        }
        let total = Math.max(sizeConfig.min, Math.ceil(km * sizeConfig.rate));
        let duration = Math.min(30, 1 + Math.ceil(km / 80));

        if (speed === 'fast') {
          total = Math.ceil(total * 1.15);
          duration = Math.ceil(duration - duration * 0.3);
        }

        // Сохраняем итог в Сигнал
        this.calculationResult.set({
          from,
          to,
          size,
          distance: $localize`${km.toFixed(1)} км`,
          duration: $localize`${duration} дн.`,
          rate: $localize`${sizeConfig.rate} ₽/км`,
          total,
          speed,
        });
      } catch (err) {
        this.failedCalculation();
      }
    });

    this.mapRoute.model.events.add('requestfail', () => this.failedCalculation());
  }

  private failedCalculation() {
    this.calculationResult.set(null);
    this.toastr.error(
      $localize`Не удалось построить маршрут. Проверьте адреса и выбранные параметры.`,
    );
  }

  public submitOrder() {
    const calculation = this.calculationResult(); // Достаем значение из сигнала
    if (!calculation) {
      this.toastr.error($localize`Сначала рассчитайте стоимость, чтобы оформить заявку`);
      return;
    }

    if (this.orderForm.invalid) {
      this.toastr.error($localize`Введите имя и корректный телефон`);
      return;
    }

    const { name, phone, comment } = this.orderForm.getRawValue();
    const trimmedName = (name ?? '').trim();
    const trimmedPhone = (phone ?? '').trim();
    const trimmedComment = (comment ?? '').trim();

    const payload = {
      customer: { name: trimmedName, phone: trimmedPhone, comment: trimmedComment },
      calculation: calculation,
      createdAt: new Date().toISOString(),
    };

    this.deliveryApi.createDelivery(payload).subscribe((response) => {
      if ('error' in response) {
        this.toastr.error(response.error);
        return;
      }

      this.toastr.success($localize`Заявка успешно оформлена!`);
      this.storage.saveOrder(response.id, calculation);
    });
  }
}
