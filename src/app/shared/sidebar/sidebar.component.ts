import { Component, Input, Output, EventEmitter, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService, AppNotification } from '../../services/notification.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
  auth = inject(AuthService);
  notificationService = inject(NotificationService);
  
  @Input() collapsed = false;
  @Output() toggle = new EventEmitter<void>();

  notificationsDropdownOpen = false;
  unreadCount = 0;
  notifications: AppNotification[] = [];

  ngOnInit() {
    // Initialize Firebase
    this.notificationService.initialize().then(() => {
      this.notificationService.unreadCount$.subscribe(count => this.unreadCount = count);
      this.notificationService.notifications$.subscribe(n => this.notifications = n);
    });
  }

  ngOnDestroy() {
    this.notificationService.stopListening();
  }

  onToggle() {
    this.toggle.emit();
  }

  toggleNotifications() {
    this.notificationsDropdownOpen = !this.notificationsDropdownOpen;
  }

  markAsRead(id: string) {
    this.notificationService.markAsRead(id);
  }
}
