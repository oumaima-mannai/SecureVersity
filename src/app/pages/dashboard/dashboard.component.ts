import { Component, AfterViewInit, ElementRef, ViewChild, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

interface TrendPoint { month: string; score: number; }
interface AuditRecord { date: string; org: string; framework: string; score: number; status: string; risks: number; id: string; }
interface RadarCat { name: string; score: number; }

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgClass, FormsModule, RouterLink, RouterLinkActive, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements AfterViewInit {

  @ViewChild('chartBars') chartBarsRef!: ElementRef<HTMLDivElement>;
  @ViewChild('radarSvg')  radarSvgRef!:  ElementRef<SVGElement>;

  auth = inject(AuthService);
  sidebarCollapsed = false;

  toggleSidebar() { this.sidebarCollapsed = !this.sidebarCollapsed; }

  readonly TREND_DATA: TrendPoint[] = [
    { month: 'Oct', score: 58 }, { month: 'Nov', score: 62 },
    { month: 'Dec', score: 65 }, { month: 'Jan', score: 61 },
    { month: 'Feb', score: 68 }, { month: 'Mar', score: 72 },
  ];

  readonly AUDIT_HISTORY: AuditRecord[] = [
    { date: '27 Mar 2026', org: 'Acme Corp', framework: 'ISO 27001 / GDPR', score: 72, status: 'moderate', risks: 4, id: 'A-2026-012' },
    { date: '14 Feb 2026', org: 'Acme Corp', framework: 'GDPR',             score: 68, status: 'moderate', risks: 6, id: 'A-2026-011' },
    { date: '03 Jan 2026', org: 'Acme Corp', framework: 'ISO 27001',         score: 61, status: 'low',      risks: 8, id: 'A-2026-010' },
    { date: '15 Dec 2025', org: 'Acme Corp', framework: 'SOC 2',             score: 65, status: 'moderate', risks: 5, id: 'A-2025-009' },
    { date: '22 Nov 2025', org: 'Acme Corp', framework: 'NIST CSF',          score: 62, status: 'moderate', risks: 7, id: 'A-2025-008' },
    { date: '01 Oct 2025', org: 'Acme Corp', framework: 'ISO 27001',         score: 58, status: 'low',      risks: 9, id: 'A-2025-007' },
  ];

  readonly RADAR_CATS: RadarCat[] = [
    { name: 'Org Info',       score: 90 }, { name: 'Policy',       score: 65 },
    { name: 'Access Control', score: 55 }, { name: 'Data Mgmt',    score: 80 },
    { name: 'HR',             score: 70 }, { name: 'Physical Sec', score: 85 },
    { name: 'Incident Resp',  score: 50 }, { name: '3rd Party',    score: 60 },
    { name: 'Compliance',     score: 75 },
  ];

  readonly statusMap: Record<string, { cls: string; label: string; color: string }> = {
    good:     { cls: 'badge-success', label: '✓ Good',     color: 'var(--success)' },
    moderate: { cls: 'badge-warning', label: '⚠ Moderate', color: 'var(--warning)' },
    low:      { cls: 'badge-danger',  label: '✗ Critical', color: 'var(--danger)'  },
  };

  searchQuery = '';

  get filteredHistory() {
    const q = this.searchQuery.toLowerCase();
    if (!q) return this.AUDIT_HISTORY;
    return this.AUDIT_HISTORY.filter(a =>
      a.org.toLowerCase().includes(q) ||
      a.framework.toLowerCase().includes(q) ||
      a.date.toLowerCase().includes(q)
    );
  }

  riskColor(n: number) { return n <= 3 ? 'var(--success)' : n <= 6 ? 'var(--warning)' : 'var(--danger)'; }

  barHeight(score: number) { return (score / 100 * 100) + '%'; }

  ngAfterViewInit() {
    // Animate bars after a tick
    setTimeout(() => this.renderBars(), 300);
    this.renderRadar();
  }

  renderBars() {
    const bars = document.querySelectorAll<HTMLElement>('.bar-fill');
    bars.forEach(bar => {
      const score = parseInt(bar.dataset['score'] || '0');
      bar.style.height = (score / 100 * 100) + '%';
    });
  }

  renderRadar() {
    const svg = this.radarSvgRef?.nativeElement;
    if (!svg) return;
    const cx = 150, cy = 150, r = 100;
    const n = this.RADAR_CATS.length;

    const gridHtml = [0.25, 0.5, 0.75, 1].map(frac => {
      const pts = Array.from({ length: n }, (_, i) => {
        const angle = (2 * Math.PI * i / n) - Math.PI / 2;
        return `${cx + r * frac * Math.cos(angle)},${cy + r * frac * Math.sin(angle)}`;
      }).join(' ');
      return `<polygon points="${pts}" fill="none" stroke="#E2E8F0" stroke-width="1"/>`;
    }).join('');

    const axisHtml = Array.from({ length: n }, (_, i) => {
      const angle = (2 * Math.PI * i / n) - Math.PI / 2;
      return `<line x1="${cx}" y1="${cy}" x2="${cx + r * Math.cos(angle)}" y2="${cy + r * Math.sin(angle)}" stroke="#E2E8F0" stroke-width="1"/>`;
    }).join('');

    const dataPoints = this.RADAR_CATS.map((cat, i) => {
      const angle = (2 * Math.PI * i / n) - Math.PI / 2;
      const val = cat.score / 100;
      return `${cx + r * val * Math.cos(angle)},${cy + r * val * Math.sin(angle)}`;
    }).join(' ');

    const dotHtml = this.RADAR_CATS.map((cat, i) => {
      const angle = (2 * Math.PI * i / n) - Math.PI / 2;
      const val = cat.score / 100;
      return `<circle cx="${cx + r * val * Math.cos(angle)}" cy="${cy + r * val * Math.sin(angle)}" r="4" fill="var(--primary)"/>`;
    }).join('');

    const labelHtml = this.RADAR_CATS.map((cat, i) => {
      const angle = (2 * Math.PI * i / n) - Math.PI / 2;
      const lx = cx + (r + 22) * Math.cos(angle);
      const ly = cy + (r + 22) * Math.sin(angle);
      const anchor = lx < cx - 5 ? 'end' : lx > cx + 5 ? 'start' : 'middle';
      return `<text x="${lx}" y="${ly + 4}" text-anchor="${anchor}" font-size="10" font-family="Inter,sans-serif" fill="#64748B" font-weight="500">${cat.name}</text>`;
    }).join('');

    svg.innerHTML = `
      <defs>
        <linearGradient id="radarGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.15"/>
        </linearGradient>
      </defs>
      ${gridHtml}${axisHtml}
      <polygon points="${dataPoints}" fill="url(#radarGrad)" stroke="#3B82F6" stroke-width="2"/>
      ${dotHtml}${labelHtml}`;
  }
}
