import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AssessmentService } from '../../../services/assessment.service';
import { AssessmentSection } from '../../../models/assessment.model';
import { AuthService } from '../../../services/auth.service';

import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, SidebarComponent],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class Tasks implements OnInit {
  assessmentService = inject(AssessmentService);
  auth = inject(AuthService);
  
  sidebarCollapsed = false;
  toggleSidebar() { this.sidebarCollapsed = !this.sidebarCollapsed; }
  
  mySections: AssessmentSection[] = [];
  loading = true;

  ngOnInit() {
    const role = this.auth.currentUserRoleRaw();
    const userId = this.auth.currentUserId();

    this.assessmentService.getAssessments().subscribe(list => {
      if (list[0]) {
        this.assessmentService.getAssessmentById(list[0].id).subscribe(data => {
          if (role !== 'ADMIN_SYSTEM') {
            this.mySections = data.sections?.filter(s => 
              s.assigned_to === userId || (s.sectionTemplate && s.sectionTemplate.role_required === role)
            ) || [];
          } else {
            this.mySections = data.sections || [];
          }
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    });
  }
}


