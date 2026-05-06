import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AssessmentService } from '../../../services/assessment.service';
import { Assessment } from '../../../models/assessment.model';
import { AuthService } from '../../../services/auth.service';

import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  assessmentService = inject(AssessmentService);
  auth = inject(AuthService);
  
  sidebarCollapsed = false;
  toggleSidebar() { this.sidebarCollapsed = !this.sidebarCollapsed; }
  
  assessment: Assessment | null = null;
  loading = true;

  get completedCount() {
    return this.assessment?.sections?.filter(s => s.status === 'VALIDATED' || s.status === 'SUBMITTED').length || 0;
  }

  get inProgressCount() {
    return this.assessment?.sections?.filter(s => s.status === 'IN_PROGRESS').length || 0;
  }

  get notStartedCount() {
    return this.assessment?.sections?.filter(s => s.status === 'NOT_STARTED').length || 0;
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.assessmentService.getAssessments().subscribe(list => {
      if (list && list.length > 0) {
        this.assessmentService.getAssessmentById(list[0].id).subscribe(data => {
          const role = this.auth.currentUserRoleRaw();
          const userId = this.auth.currentUserId();
          
          if (data && data.sections && role !== 'ADMIN_SYSTEM') {
            data.sections = data.sections.filter((s: any) => 
              s.assigned_to === userId || (s.sectionTemplate && s.sectionTemplate.role_required === role)
            );
          }
          
          this.assessment = data;
          this.loading = false;
        });
      } else {
        // No assessment? Let's create one from default template
        this.assessmentService.getDefaultTemplate().subscribe(template => {
          if (template) {
            this.assessmentService.createAssessment(template.id, 'system', 'ISO 27001 Context Phase').subscribe(newAss => {
              this.assessment = newAss;
              this.loading = false;
            });
          } else {
            this.loading = false;
          }
        });
      }
    });
  }
}


