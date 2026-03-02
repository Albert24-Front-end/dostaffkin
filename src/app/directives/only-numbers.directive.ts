import { Directive, HostListener } from "@angular/core";


@Directive({
  selector: '[appOnlyNumbers]',
  standalone: true,
})
export class OnlyNumbersDirective {
  // Разрешаем системные клавиши: Backspace, Tab, End, Home, стрелки
  private navigationKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'];

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // 1. Разрешаем навигацию
    if (this.navigationKeys.indexOf(event.key) > -1) {
      return;
    }

    // 2. Разрешаем Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
      return;
    }

    // 3. Проверяем, является ли нажатая клавиша цифрой
    if (event.key === ' ' || isNaN(Number(event.key))) {
      event.preventDefault(); // Запрещаем ввод
    }
  }
}