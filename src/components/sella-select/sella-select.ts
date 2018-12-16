import {Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2} from '@angular/core';

@Component({
    selector: 'sella-select',
    templateUrl: 'sella-select.html'
})
export class SellaSelectComponent {
    @Input('posts') posts: any;
    @Input('List') List: any[];
    @Output() OnSelect = new EventEmitter();
    opacityChange: number = 0.01;

    constructor(private el: ElementRef, private render: Renderer2) {
        this.opacityChange = 0.26;
    }

    ngAfterViewInit() {
        let items = this.el.nativeElement.querySelector('#select-items');
        setTimeout(() => {
            this.render.addClass(items, 'present');
        });
    }

    selectItem(item) {
        this.OnSelect.emit(item)
    }

    @HostListener('click') onClick() {
        if (this.List) {
            let select = this.el.nativeElement;
            let items = select.querySelector('#select-items');
            this.render.removeClass(items, 'present');
            setTimeout(() => {
                this.render.setStyle(select, 'display', 'none');
            }, 250);
        }

    }
}
