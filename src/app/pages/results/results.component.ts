import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

interface Category { icon: string; name: string; score: number; color: string; }
interface Risk { severity: string; title: string; text: string; category: string; }
interface Recommendation { icon: string; title: string; text: string; priority: string; }

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, NgClass, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './results.component.html',
})
export class ResultsComponent implements AfterViewInit {

  readonly GLOBAL_SCORE = 72;

  readonly CATEGORIES: Category[] = [
    { icon: '🏢', name: 'Organization Info',    score: 90, color: '#22C55E' },
    { icon: '📋', name: 'Security Policy',       score: 65, color: '#F59E0B' },
    { icon: '🔐', name: 'Access Control',        score: 55, color: '#EF4444' },
    { icon: '🗄️', name: 'Data Management',       score: 80, color: '#22C55E' },
    { icon: '👥', name: 'Human Resources',        score: 70, color: '#3B82F6' },
    { icon: '🏭', name: 'Physical Security',      score: 85, color: '#22C55E' },
    { icon: '🚨', name: 'Incident Response',      score: 50, color: '#EF4444' },
    { icon: '🤝', name: 'Supplier Management',    score: 60, color: '#F59E0B' },
    { icon: '✅', name: 'Compliance & Audit',     score: 75, color: '#3B82F6' },
  ];

  readonly RISKS: Risk[] = [
    { severity: 'critical', title: 'No MFA enforced', text: 'Multi-Factor Authentication is not enabled for all user accounts. This significantly increases the risk of unauthorized access.', category: 'Access Control' },
    { severity: 'high',     title: 'Incident Response plan not tested', text: 'Your IR plan exists but has never been exercised. An untested plan may fail during a real incident.', category: 'Incident Response' },
    { severity: 'high',     title: 'Missing security awareness training', text: 'Employees have not received formal security training. Human error remains the #1 cause of data breaches.', category: 'Human Resources' },
    { severity: 'medium',   title: 'Vendor assessments incomplete', text: 'Security assessments are only performed for some vendors. Third-party risks may remain undetected.', category: 'Supplier Management' },
  ];

  readonly RECOMMENDATIONS: Recommendation[] = [
    { icon: '🔒', title: 'Deploy MFA organization-wide',          text: 'Enable MFA for all accounts, prioritizing admin and privileged accounts. Consider hardware keys for critical roles.', priority: 'Immediate' },
    { icon: '📄', title: 'Formalize and approve missing policies', text: 'Draft and get board-level approval for missing policies: ISMS, Data Classification, and Incident Response.', priority: '30 days' },
    { icon: '🎓', title: 'Launch security awareness program',      text: 'Implement annual mandatory training for all staff. Include phishing simulation exercises quarterly.', priority: '60 days' },
    { icon: '🔄', title: 'Test your Incident Response plan',       text: 'Conduct a tabletop exercise with key stakeholders. Update and document lessons learned.', priority: '90 days' },
    { icon: '🤝', title: 'Expand vendor security assessments',     text: 'Assess all critical vendors annually. Include security questionnaires in all new vendor contracts.', priority: '90 days' },
    { icon: '🗂️', title: 'Create a data asset inventory',         text: 'Identify and classify all data assets. Assign an owner to each asset and define retention periods.', priority: '60 days' },
  ];

  readonly severityMap: Record<string, { cls: string; icon: string; badge: string; badgeCls: string }> = {
    critical: { cls: 'risk',            icon: '🔴', badge: 'Critical', badgeCls: 'badge-danger' },
    high:     { cls: 'risk',            icon: '🟠', badge: 'High',     badgeCls: 'badge-danger' },
    medium:   { cls: 'warning',         icon: '🟡', badge: 'Medium',   badgeCls: 'badge-warning' },
    low:      { cls: 'recommendation',  icon: '🟢', badge: 'Low',      badgeCls: 'badge-success' },
  };

  readonly priorityColor: Record<string, string> = {
    'Immediate': 'var(--danger)',
    '30 days':   'var(--warning)',
    '60 days':   'var(--primary)',
    '90 days':   'var(--secondary)',
  };

  displayScore = 0;
  scoreLevel = 'Moderate';
  scoreLevelClass = 'badge badge-warning';
  ringOffset = 427;

  get circumference() { return 427; }

  catScoreColor(score: number) {
    return score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)';
  }

  ngAfterViewInit() {
    this.animateScore();
    setTimeout(() => this.animateBars(), 400);
  }

  animateScore() {
    const offset = this.circumference - (this.GLOBAL_SCORE / 100) * this.circumference;
    setTimeout(() => { this.ringOffset = offset; }, 300);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      this.displayScore = current;
      if (current >= this.GLOBAL_SCORE) {
        clearInterval(interval);
        if (this.GLOBAL_SCORE >= 85) {
          this.scoreLevel = '✓ Good standing';
          this.scoreLevelClass = 'badge badge-success';
        } else if (this.GLOBAL_SCORE >= 65) {
          this.scoreLevel = '⚠ Moderate';
          this.scoreLevelClass = 'badge badge-warning';
        } else {
          this.scoreLevel = '✗ Critical';
          this.scoreLevelClass = 'badge badge-danger';
        }
      }
    }, 18);
  }

  animateBars() {
    document.querySelectorAll<HTMLElement>('.cat-fill').forEach(el => {
      const w = el.dataset['width'];
      if (w) el.style.width = w + '%';
    });
  }

  exportReport() {
    alert('PDF export: In production this would generate a PDF report via jsPDF or a server-side rendering service.');
  }
}
