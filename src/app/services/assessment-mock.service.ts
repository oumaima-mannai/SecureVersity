import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

export type RoleRequired = 'RSSI' | 'IT' | 'EMPLOYEE_ADMIN' | 'DIRECTION';
export type QuestionType = 'TEXT' | 'YES_NO' | 'SELECT' | 'MULTI_SELECT' | 'TEXTAREA';
export type SectionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'VALIDATED';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  required: boolean;
  order: number;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  roleRequired: RoleRequired;
  status: SectionStatus;
  assignee?: { id: string; name: string; avatar: string };
  dueDate: string;
  questions: Question[];
  progress: number; // 0 to 100
}

export interface Assessment {
  id: string;
  title: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED';
  sections: Section[];
  globalProgress: number;
}

const MOCK_ASSESSMENT: Assessment = {
  id: 'iso-assmnt-001',
  title: 'ISO/IEC 27001 Context Assessment Q3 2026',
  status: 'IN_PROGRESS',
  globalProgress: 35,
  sections: [
    {
      id: 'sec-1',
      title: 'Context of the Organization (Clause 4)',
      description: 'Define the internal and external issues relevant to the ISMS.',
      roleRequired: 'DIRECTION',
      status: 'SUBMITTED',
      assignee: { id: 'u1', name: 'Alice Walker', avatar: 'AW' },
      dueDate: '2026-05-15',
      progress: 100,
      questions: [
        { id: 'q1', text: 'Have the external and internal issues relevant to the ISMS been determined?', type: 'YES_NO', required: true, order: 1 },
        { id: 'q2', text: 'List the key external factors affecting your information security.', type: 'TEXTAREA', required: false, order: 2 }
      ]
    },
    {
      id: 'sec-2',
      title: 'Information Security Policies (A.5)',
      description: 'Management direction and support for information security.',
      roleRequired: 'RSSI',
      status: 'IN_PROGRESS',
      assignee: { id: 'u2', name: 'Bob Smith', avatar: 'BS' },
      dueDate: '2026-05-10',
      progress: 60,
      questions: [
        { id: 'q3', text: 'Is there a published information security policy?', type: 'YES_NO', required: true, order: 1 },
        { id: 'q4', text: 'How often are the policies reviewed?', type: 'SELECT', options: ['Monthly', 'Quarterly', 'Annually', 'Never'], required: true, order: 2 }
      ]
    },
    {
      id: 'sec-3',
      title: 'Asset Management (A.8)',
      description: 'Identify organizational assets and appropriate protection responsibilities.',
      roleRequired: 'IT',
      status: 'NOT_STARTED',
      assignee: { id: 'u3', name: 'Carlos Tech', avatar: 'CT' },
      dueDate: '2026-05-20',
      progress: 0,
      questions: [
        { id: 'q5', text: 'Are all major information assets inventoried?', type: 'YES_NO', required: true, order: 1 },
        { id: 'q6', text: 'Select the primary storage environments used.', type: 'MULTI_SELECT', options: ['AWS', 'Azure', 'On-Premise', 'Google Cloud'], required: true, order: 2 }
      ]
    },
    {
      id: 'sec-4',
      title: 'Human Resource Security (A.7)',
      description: 'Ensure employees understand their responsibilities.',
      roleRequired: 'EMPLOYEE_ADMIN',
      status: 'NOT_STARTED',
      dueDate: '2026-05-25',
      progress: 0,
      questions: [
        { id: 'q7', text: 'Are background verification checks carried out on all candidates?', type: 'YES_NO', required: true, order: 1 }
      ]
    }
  ]
};

@Injectable({
  providedIn: 'root'
})
export class AssessmentMockService {

  getAssessment(): Observable<Assessment> {
    return of(MOCK_ASSESSMENT).pipe(delay(500)); // Simulate network latency
  }

  // Used by "My Tasks"
  getMyTasks(userId: string): Observable<Section[]> {
    const tasks = MOCK_ASSESSMENT.sections.filter(s => s.assignee?.id === userId);
    return of(tasks).pipe(delay(300));
  }

  // Used by the magic auto-assign feature
  autoAssignUsers(): Observable<boolean> {
    // Simulate auto assigning missing roles
    MOCK_ASSESSMENT.sections.forEach(s => {
      if (!s.assignee && s.roleRequired === 'EMPLOYEE_ADMIN') {
        s.assignee = { id: 'u4', name: 'Diana Clark', avatar: 'DC' };
      }
    });
    return of(true).pipe(delay(800));
  }
}
