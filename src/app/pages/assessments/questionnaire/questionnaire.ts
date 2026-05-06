import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

interface Question {
  id: string;
  text: string;
  clauseCode: string;
  reference: string;
}

interface Section {
  title: string;
  icon: string;
  questions: Question[];
}

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './questionnaire.html',
  styleUrl: './questionnaire.css'
})
export class Questionnaire implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  auth = inject(AuthService);

  loading = true;
  saving = false;
  showSaveIndicator = false;
  sectionLocked = false; // True if section is VALIDATED

  // The AssessmentSection ID from route (for backend persistence)
  sectionId: string | null = null;

  sections: Section[] = [];
  currentSectionIndex = 0;
  currentQuestionIndex = 0;

  answers: { [questionId: string]: { response?: string; observation?: string } } = {};

  ngOnInit() {
    this.sectionId = this.route.snapshot.queryParamMap.get('sectionId');
    const userStr = localStorage.getItem('user');
    const role = userStr ? JSON.parse(userStr).role : 'RSSI';

    this.http.get<any>('assets/iso27001-questions.json').subscribe({
      next: async (data) => {
        const allQuestions: Question[] = data[role] || [];

        // Group questions by clauseCode
        const sectionMap = new Map<string, Question[]>();
        for (const q of allQuestions) {
          const key = q.clauseCode || 'General';
          if (!sectionMap.has(key)) sectionMap.set(key, []);
          sectionMap.get(key)!.push(q);
          this.answers[q.id] = { response: '', observation: '' };
        }

        const sectionIcons = ['🏢', '🔒', '🛡️', '💾', '👥', '🏗️', '🚨', '🤝', '✅'];
        let iconIdx = 0;
        sectionMap.forEach((questions, title) => {
          this.sections.push({ title, icon: sectionIcons[iconIdx++ % sectionIcons.length], questions });
        });

        // Load existing answers from backend if we have a sectionId
        if (this.sectionId) {
          await this.loadSavedAnswers();
          await this.checkSectionLocked();
        }

        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private async loadSavedAnswers() {
    try {
      const saved = await this.http
        .get<{ questionId: string; value: any }[]>(`http://localhost:3000/responses/sections/${this.sectionId}/answers`)
        .toPromise();

      if (saved && saved.length > 0) {
        for (const a of saved) {
          if (this.answers[a.questionId] !== undefined) {
            this.answers[a.questionId] = {
              response: a.value?.response || '',
              observation: a.value?.observation || '',
            };
          }
        }
      }
    } catch (e) {
      console.warn('Could not load saved answers:', e);
    }
  }

  private async checkSectionLocked() {
    try {
      const result = await this.http
        .get<{ status: string }>(`http://localhost:3000/responses/sections/${this.sectionId}/status`)
        .toPromise();
      this.sectionLocked = result?.status === 'VALIDATED';
    } catch (e) { /* silent */ }
  }

  // --- Computed getters ---

  get currentSection(): Section | null {
    return this.sections[this.currentSectionIndex] ?? null;
  }

  get currentQuestion(): Question | null {
    return this.currentSection?.questions[this.currentQuestionIndex] ?? null;
  }

  get totalQuestions(): number {
    return this.sections.reduce((sum, s) => sum + s.questions.length, 0);
  }

  get answeredQuestionsCount(): number {
    let idx = 0;
    for (let s = 0; s < this.currentSectionIndex; s++) idx += this.sections[s].questions.length;
    return idx + this.currentQuestionIndex + 1;
  }

  get globalProgress(): number {
    const answered = Object.values(this.answers).filter(a => !!a.response).length;
    return this.totalQuestions > 0 ? Math.round((answered / this.totalQuestions) * 100) : 0;
  }

  get isFirstQuestion(): boolean {
    return this.currentSectionIndex === 0 && this.currentQuestionIndex === 0;
  }

  get isLastQuestion(): boolean {
    const lastSection = this.sections[this.sections.length - 1];
    return (
      this.currentSectionIndex === this.sections.length - 1 &&
      this.currentQuestionIndex === (lastSection?.questions.length ?? 1) - 1
    );
  }

  isSectionCompleted(sectionIndex: number): boolean {
    const section = this.sections[sectionIndex];
    if (!section) return false;
    return section.questions.every(q => !!this.answers[q.id]?.response);
  }

  // --- Navigation ---

  goToSection(index: number) {
    this.currentSectionIndex = index;
    this.currentQuestionIndex = 0;
  }

  nextQuestion() {
    if (!this.currentSection) return;
    if (this.currentQuestionIndex < this.currentSection.questions.length - 1) {
      this.currentQuestionIndex++;
    } else if (this.currentSectionIndex < this.sections.length - 1) {
      this.currentSectionIndex++;
      this.currentQuestionIndex = 0;
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    } else if (this.currentSectionIndex > 0) {
      this.currentSectionIndex--;
      this.currentQuestionIndex = this.sections[this.currentSectionIndex].questions.length - 1;
    }
  }

  setResponse(response: string) {
    if (!this.currentQuestion || this.sectionLocked) return;
    this.answers[this.currentQuestion.id].response = response;
    this.persistAnswer();
  }

  persistAnswer() {
    if (!this.currentQuestion) return;
    this.saving = true;
    this.showSaveIndicator = true;

    const userId = this.auth.currentUserId();
    const value = this.answers[this.currentQuestion.id];

    // If we have a real sectionId, persist to backend
    if (this.sectionId) {
      this.http.post('http://localhost:3000/responses/answers', {
        sectionId: this.sectionId,
        questionId: this.currentQuestion.id,
        value,
        userId,
      }).subscribe({
        next: () => {
          this.saving = false;
          setTimeout(() => (this.showSaveIndicator = false), 2000);
        },
        error: () => {
          this.saving = false;
          setTimeout(() => (this.showSaveIndicator = false), 2000);
        }
      });
    } else {
      // Fallback: local autosave indicator only
      setTimeout(() => {
        this.saving = false;
        setTimeout(() => (this.showSaveIndicator = false), 2000);
      }, 300);
    }
  }

  submitSection() {
    if (this.sectionId) {
      this.http.post(`http://localhost:3000/responses/sections/${this.sectionId}/submit`, {}).subscribe({
        next: () => this.router.navigate(['/assessments/tasks']),
        error: () => alert('Failed to submit. Please try again.'),
      });
    } else {
      this.router.navigate(['/assessments/tasks']);
    }
  }
}
