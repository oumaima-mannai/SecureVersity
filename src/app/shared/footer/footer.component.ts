import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div style="margin-bottom:12px;">
        <span class="logo" style="justify-content:center;color:#CBD5E1">
          <div class="logo-icon" style="width:28px;height:28px;font-size:13px">✦</div>
          SecureVersity
        </span>
      </div>
      <p style="margin-bottom:8px">
        <a routerLink="/">Home</a>&nbsp;·&nbsp;
        <a routerLink="/dashboard">Dashboard</a>&nbsp;·&nbsp;
        <a routerLink="/audit">Start Audit</a>
      </p>
      <p style="font-size:12px;opacity:0.5;">&copy; 2026 SecureVersity. All rights reserved.</p>
    </footer>
  `,
})
export class FooterComponent {}
