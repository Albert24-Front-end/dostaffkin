import { Component, signal } from '@angular/core';
import { Header } from '../../header/header';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DELIVERY_SIZES, DELIVERY_SPEEDS } from './order.config';
import { UpperCasePipe } from '@angular/common';

declare var ymaps: any;

@Component({
  selector: 'app-order',
  imports: [Header, UpperCasePipe],
  templateUrl: './order.html',
  styleUrl: './order.css',
})
export class Order {
  public readonly sizes = DELIVERY_SIZES;
  public readonly speeds = DELIVERY_SPEEDS;

  public map: any;
  private mapRoute: any;

  public routeForm: FormGroup;
  public orderForm: FormGroup;

  public orderId: any = signal(null);
  public calculationResult: any = signal(null);

  constructor(private formBuilder: FormBuilder) {
        this.routeForm = this.formBuilder.group({
            from: ['', Validators.required],
            to: ['', Validators.required],
            size: ['xs', Validators.required],
            speed: ['regular', Validators.required]
        });
        this.orderForm = this.formBuilder.group({
            name: ['', Validators.required],
            phone: ['', [Validators.required]],
            comment: ['']
        });
    }

    ngOnInit() {
        ymaps.ready(() => {
            this.map = new ymaps.Map('map', {
                center: [55.751244, 37.618423],
                zoom: 5,
                controls: ['zoomControl']
            });

            // Подключаем подсказки адресов к полям от яндекса
            (new ymaps.SuggestView('from')).events.add('select', (event: any) => (this.routeForm.controls['from'].setValue(event.get('item')?.value ?? '')));
            (new ymaps.SuggestView('to')).events.add('select', (event: any) => (this.routeForm.controls['to'].setValue(event.get('item')?.value ?? '')));
        });
    }

    public selectSize(size: string) {
        this.routeForm.controls['size'].setValue(size);
    }

    public selectSpeed(speed: string) {
        this.routeForm.controls['speed'].setValue(speed);
    }
}
