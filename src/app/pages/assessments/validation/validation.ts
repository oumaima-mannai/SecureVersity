import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AssessmentService } from '../../../services/assessment.service';
import { AssessmentSection } from '../../../models/assessment.model';

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './validation.html',
  styleUrl: './validation.css'
})
export class Validation implements OnInit {
  assessmentService = inject(AssessmentService);
  section: AssessmentSection | null = null;
  loading = true;
  
  feedback = '';
  processed = false;

  answersMap: { [qId: string]: any } = {};

  ngOnInit() {
    this.assessmentService.getAssessments().subscribe(list => {
      if (list[0]) {
        this.assessmentService.getAssessmentById(list[0].id).subscribe(data => {
          this.section = data.sections?.find(s => s.status === 'SUBMITTED') || data.sections![0];
          
          if (this.section.answers) {
            this.section.answers.forEach((ans: any) => {
              this.answersMap[ans.question_template_id] = ans.value;
            });
          }
          
          this.loading = false;
        });
      }
    });
  }

  approve() {
    if (!this.section) return;
    this.processed = true;
    this.assessmentService.validateSection(this.section.id, true).subscribe(() => {
      alert('Section APPROVED. SMSI scope updated.');
    });
  }

  reject() {
    if (!this.section) return;
    this.processed = true;
    this.assessmentService.validateSection(this.section.id, false).subscribe(() => {
      alert('Section REJECTED. Sent back to assignee.');
    });
  }
}

