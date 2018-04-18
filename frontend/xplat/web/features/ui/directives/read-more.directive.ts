import { Directive, Input, ElementRef, AfterViewInit, OnChanges } from '@angular/core';

// credit to: https://github.com/Oneia/read-more-angular2
// license ISC
// modified slightly

@Directive({
  selector: '[readMore]'
})
export class ReadMoreDirective implements  AfterViewInit, OnChanges {
  @Input('readMore-length')  private maxLength:     number;
  @Input('readMore-element') private elementChange: HTMLElement;

  private currentText: string;
  private hideToggle:  boolean = true;
  private text:        string;
  private isCollapsed: boolean = true;

  constructor(private el: ElementRef) {}

  /**
   * @inheritDoc
   */
  public ngAfterViewInit() {
    this.text = this.elementChange.innerHTML;
    this.toggleView();
    if (!this.hideToggle) {
      this.el.nativeElement.classList.remove('hidden');
    } else {
      this.el.nativeElement.classList.add('hidden');
    }
    this.el.nativeElement.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      this.toggleView();
    });
  }

  /**
   * @inheritDoc
   */
  public ngOnChanges() {
    if (this.text) {
      this.toggleView();
    }
  }
  /**
   * Toogle view - full text or not
   */
  private toggleView(): void {
    this.determineView();
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      this.el.nativeElement.querySelector('.more').style.display = "none";
      if (this.text.length > this.maxLength) {
        this.el.nativeElement.querySelector('.less').style.display = "inherit";
      }
    } else {
      this.el.nativeElement.querySelector('.more').style.display = "inherit";
      this.el.nativeElement.querySelector('.less').style.display = "none";
    }
  }

  /**
   * Determine view
   */
  private determineView(): void {
    let _elementChange = document.getElementById(this.elementChange.id);
    if (!this.text && _elementChange) {
      this.text = _elementChange.innerHTML;
    }
    if (_elementChange) {
      if (this.text.length <= this.maxLength) {
        this.currentText = this.text;
        _elementChange.innerHTML = this.currentText;
        this.isCollapsed = false;
        this.hideToggle = true;
        this.el.nativeElement.querySelector('.less').style.display = "none";
        return;
      }
      this.hideToggle = false;
      if (this.isCollapsed === true) {
        this.currentText = this.text.substring(0, this.maxLength) + '...';
        _elementChange.innerHTML = this.currentText;
      } else if (this.isCollapsed === false)  {
        this.currentText = this.text;
        _elementChange.innerHTML = this.currentText;
      }
    }
  }
}
