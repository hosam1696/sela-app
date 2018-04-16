import {Directive, ElementRef, EventEmitter, Output, HostListener} from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {
  @Output() clickOutsideEvent = new EventEmitter();
  constructor(private _elementRef : ElementRef) { }
  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    const isClickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!isClickedInside) {
      this.clickOutsideEvent.emit(null);
    }
  }
}
