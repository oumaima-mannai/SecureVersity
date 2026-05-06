import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Assessment, AssessmentSection } from '../models/assessment.model';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  // Templates
  getDefaultTemplate(): Observable<any> {
    return this.http.get(`${this.apiUrl}/templates/default`);
  }

  // Assessments
  getAssessments(): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${this.apiUrl}/assessments`);
  }

  getAssessmentById(id: string): Observable<Assessment> {
    return this.http.get<Assessment>(`${this.apiUrl}/assessments/${id}`);
  }

  createAssessment(templateId: string, creatorId: string, name?: string): Observable<Assessment> {
    return this.http.post<Assessment>(`${this.apiUrl}/assessments`, { templateId, creatorId, name });
  }

  assignSection(sectionId: string, userId: string): Observable<AssessmentSection> {
    return this.http.put<AssessmentSection>(`${this.apiUrl}/assessments/sections/${sectionId}/assign`, { userId });
  }


  // Responses
  saveAnswer(sectionId: string, questionId: string, value: any, userId?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/responses/answers`, { sectionId, questionId, value, userId });
  }

  submitSection(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/responses/sections/${id}/submit`, {});
  }

  validateSection(id: string, approve: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/responses/sections/${id}/validate`, { approve });
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`).pipe(
      catchError(() => {
        // Fallback for demo so the page doesn't crash on 401 Unauthorized
        return of([
          { id: '1', email: 'rssi@secure.com', fullName: 'Alice RSSI', role: 'RSSI' },
          { id: '2', email: 'it@secure.com', fullName: 'Carlos IT', role: 'EMPLOYEE_IT' },
          { id: '3', email: 'director@secure.com', fullName: 'Diana Director', role: 'DIRECTION' },
          { id: '4', email: 'admin@secure.com', fullName: 'System Admin', role: 'ADMIN_SYSTEM' }
        ]);
      })
    );
  }
}

