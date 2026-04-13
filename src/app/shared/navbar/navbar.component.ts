import { Component, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  @Input() variant: 'landing' | 'dashboard' | 'audit' | 'results' = 'landing';
  @Input() stepLabel = 'Step 1 of 9';
  @Input() progressPct = 11;
  @Output() exportClicked = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEsc() {}

  onExport() { this.exportClicked.emit(); }
}
