export type Role = 'ADMIN_SYSTEM' | 'RSSI' | 'AUDITOR' | 'DIRECTION' | 'EMPLOYEE_IT' | 'EMPLOYEE_HR' | 'EMPLOYEE_ADMIN';
export type QuestionType = 'TEXT' | 'YES_NO' | 'SELECT' | 'MULTI_SELECT' | 'TEXTAREA';
export type SectionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'VALIDATED';
export type AssessmentStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED';

export interface QuestionTemplate {
  id: string;
  question_text: string;
  type: QuestionType;
  required: boolean;
  options?: any;
  order_index: number;
}

export interface SectionTemplate {
  id: string;
  title: string;
  description: string;
  role_required: Role;
  order_index: number;
  questions?: QuestionTemplate[];
}

export interface AssessmentSection {
  id: string;
  assessment_id: string;
  section_template_id: string;
  assigned_to?: string;
  status: SectionStatus;
  
  // Relations
  sectionTemplate: SectionTemplate;
  assignee?: { id: string; fullName: string; email: string; role: Role };
  answers?: any[];
}

export interface Assessment {
  id: string;
  name: string;
  status: AssessmentStatus;
  template_id: string;
  created_by: string;
  created_at: string;
  
  // UI helpers
  globalProgress?: number;
  
  // Relations
  sections?: AssessmentSection[];
  creator?: any;
}
