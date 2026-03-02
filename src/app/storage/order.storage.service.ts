import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root', // Этот сервис по деталям заявки глобальный
})
export class OrderStorageService {
  // Сигналы
  public lastOrderId = signal<number | null>(null);
  public lastCalculation = signal<any>(null);

  saveOrder(id: number, calc: any) {
    this.lastOrderId.set(id);
    this.lastCalculation.set(calc);
  }

  clear() {
    this.lastOrderId.set(null);
    this.lastCalculation.set(null);
  }
}
