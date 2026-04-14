import { Component, HostListener, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  auth = inject(AuthService);

  @Input() variant: 'landing' | 'dashboard' | 'audit' | 'results' = 'landing';
  @Input() stepLabel = 'Step 1 of 9';
  @Input() progressPct = 11;
  @Output() exportClicked = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEsc() {}

  onExport() { this.exportClicked.emit(); }
}
