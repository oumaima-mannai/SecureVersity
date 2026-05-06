import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AssessmentService } from '../../../services/assessment.service';
import { Assessment } from '../../../models/assessment.model';
import { AuthService } from '../../../services/auth.service';

import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-assignment',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, SidebarComponent],
  templateUrl: './assignment.html',
  styleUrl: './assignment.css'
})
export class Assignment implements OnInit {
  assessmentService = inject(AssessmentService);
  auth = inject(AuthService);
  
  sidebarCollapsed = false;
  toggleSidebar() { this.sidebarCollapsed = !this.sidebarCollapsed; }
  
  assessment: Assessment | null = null;
  loading = true;
  assigning = false;

  availableUsers: any[] = [];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.assessmentService.getUsers().subscribe(users => {
      this.availableUsers = users;
      
      this.assessmentService.getAssessments().subscribe(list => {
        if (list && list.length > 0) {
          this.assessmentService.getAssessmentById(list[0].id).subscribe(data => {
            this.assessment = data;
            this.loading = false;
          });
        } else {
          // No assessment found, just stop loading
          this.loading = false;
        }
      });
    });
  }

  autoAssign() {
    // In this production version, auto-assign was already done during assessment creation
    // We can simulate a refresh or a toast
    alert('Smart engine already processed initial assignments based on roles.');
  }

  updateAssignment(sectionId: string, event: any) {
    const userId = event.target.value;
    this.assessmentService.assignSection(sectionId, userId).subscribe(() => {
      // Success
    });
  }

  getUsersbyRole(role: string) {
    // Map internal roles if necessary. The UI expects exact matches.
    return this.availableUsers.filter(u => u.role === role);
  }
}

