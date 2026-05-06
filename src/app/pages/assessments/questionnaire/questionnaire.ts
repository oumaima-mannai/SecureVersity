import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AssessmentService } from '../../../services/assessment.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './questionnaire.html',
  styleUrl: './questionnaire.css'
})
export class Questionnaire implements OnInit {
  private http = inject(HttpClient);
  assessmentService = inject(AssessmentService);
  auth = inject(AuthService);
  
  loading = true;
  saving = false;
  showSaveIndicator = false;

  questions: any[] = [];
  currentIndex = 0;
  
  // Store answers locally. Format: { response: 'C'|'PC'|'NC'|'NA', observation: string }
  answers: { [questionId: string]: { response?: string, observation?: string } } = {};

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    const role = userStr ? JSON.parse(userStr).role : 'RSSI'; // Fallback to RSSI
    
    this.http.get<any>('assets/iso27001-questions.json').subscribe({
      next: (data) => {
        this.questions = data[role] || [];
        // Pre-fill empty answer objects
        this.questions.forEach(q => {
          if (!this.answers[q.id]) {
            this.answers[q.id] = { response: '', observation: '' };
          }
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load questions:', err);
        this.loading = false;
      }
    });
  }

  get currentQuestion(): any {
    if (this.questions.length === 0) return null;
    return this.questions[this.currentIndex];
  }

  get isLastQuestion(): boolean {
    return this.currentIndex === this.questions.length - 1;
  }

  nextQuestion() {
    if (!this.isLastQuestion) {
      this.currentIndex++;
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  setResponse(response: string) {
    if (!this.currentQuestion) return;
    this.answers[this.currentQuestion.id].response = response;
    this.triggerAutosave();
  }

  triggerAutosave() {
    if (!this.currentQuestion) return;
    
    this.saving = true;
    this.showSaveIndicator = true;
    
    // Simulate API call to save answer
    setTimeout(() => {
      this.saving = false;
      setTimeout(() => this.showSaveIndicator = false, 2000);
    }, 500);
  }

  submitSection() {
    alert("Questionnaire submitted for review!");
  }
}

