import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

// ---- Types ----
interface QuestionOption {
  value?: string;
  label: string;
  desc?: string;
}

interface Question {
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox-multi';
  id: string;
  label: string;
  placeholder?: string;
  options?: string[] | QuestionOption[];
}

interface Step {
  id: number;
  label: string;
  icon: string;
  title: string;
  description: string;
  questions: Question[];
}

type Answers = Record<number, Record<string, any>>;

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './audit.component.html',
})
export class AuditComponent implements OnInit {
  readonly STEPS: Step[] = [
    {
      id: 1, label: 'Organization Info', icon: '🏢',
      title: 'Organization Information',
      description: 'Tell us about your organization so we can tailor the audit to your context.',
      questions: [
        { type: 'text',   id: 'org-name',   label: 'Organization name', placeholder: 'e.g. Acme Corporation' },
        { type: 'select', id: 'org-size',   label: 'Number of employees', options: ['1–10','11–50','51–200','201–500','500+'] },
        { type: 'select', id: 'org-sector', label: 'Industry sector', options: ['Technology','Finance / Banking','Healthcare','Retail / E-commerce','Manufacturing','Government / Public sector','Education','Other'] },
        { type: 'radio',  id: 'org-certif', label: 'Do you currently hold any compliance certifications?', options: ['Yes','No','In progress'] },
      ],
    },
    {
      id: 2, label: 'Security Policy', icon: '📋',
      title: 'Information Security Policy',
      description: 'Evaluate the existence and quality of your information security governance policies.',
      questions: [
        { type: 'checkbox-multi', id: 'policy-exist', label: 'Which of the following policies exist in your organization?', options: [
          { value: 'isms',          label: 'Information Security Management System (ISMS)', desc: 'Formal ISMS documented and approved' },
          { value: 'acceptable-use',label: 'Acceptable Use Policy', desc: 'Policy for appropriate use of IT resources' },
          { value: 'data-class',    label: 'Data Classification Policy', desc: 'Rules for classifying sensitive data' },
          { value: 'incident',      label: 'Incident Response Policy', desc: 'Defined process for handling security incidents' },
          { value: 'bcp',           label: 'Business Continuity Plan (BCP)', desc: 'Plan for maintaining operations during disruptions' },
        ]},
        { type: 'radio', id: 'policy-review', label: 'Are your security policies reviewed at least annually?', options: ['Yes, regularly','Yes, occasionally','No','We have no policies'] },
      ],
    },
    {
      id: 3, label: 'Access Control', icon: '🔐',
      title: 'Access Control & Identity Management',
      description: 'Review how user access and authentication is managed across your systems.',
      questions: [
        { type: 'radio', id: 'mfa', label: 'Is Multi-Factor Authentication (MFA) enforced for all user accounts?', options: ['Yes, for all accounts','Yes, for admin accounts only','No, but planned','No'] },
        { type: 'radio', id: 'least-privilege', label: 'Is the principle of least privilege applied when granting access?', options: ['Yes, strictly','Partially','No','Not sure'] },
        { type: 'checkbox-multi', id: 'access-controls', label: 'Which access control measures are in place?', options: [
          { value: 'rbac',        label: 'Role-based access control (RBAC)', desc: 'Access based on job role' },
          { value: 'sso',         label: 'Single Sign-On (SSO)', desc: 'Centralized authentication system' },
          { value: 'reviews',     label: 'Regular access reviews', desc: 'At least quarterly reviews of user permissions' },
          { value: 'offboarding', label: 'Automated offboarding', desc: 'Access revoked within 24h of employee departure' },
          { value: 'pam',         label: 'Privileged Access Management (PAM)', desc: 'Special controls for admin/privileged accounts' },
        ]},
      ],
    },
    {
      id: 4, label: 'Data Management', icon: '🗄️',
      title: 'Data Management & Protection',
      description: 'Assess how your organization handles, stores, and protects sensitive data.',
      questions: [
        { type: 'radio', id: 'data-encrypt', label: 'Is sensitive data encrypted both at rest and in transit?', options: ['Yes, both','At rest only','In transit only','No'] },
        { type: 'radio', id: 'data-backup',  label: 'Are regular data backups performed and tested?', options: ['Yes, automated & tested','Yes, but not tested','Manually and irregularly','No backups'] },
        { type: 'checkbox-multi', id: 'data-practices', label: 'Which data management practices do you follow?', options: [
          { value: 'inventory',      label: 'Data asset inventory', desc: 'All data assets catalogued and owner assigned' },
          { value: 'retention',      label: 'Data retention policy', desc: 'Defined retention periods and deletion procedures' },
          { value: 'dpia',           label: 'Data Protection Impact Assessments (DPIA)', desc: 'Conducted before processing high-risk data' },
          { value: 'anonymization',  label: 'Anonymization / pseudonymization', desc: 'Applied where appropriate' },
        ]},
      ],
    },
    {
      id: 5, label: 'Human Resources', icon: '👥',
      title: 'Human Resources & Training',
      description: 'Evaluate security awareness, training programs, and HR security procedures.',
      questions: [
        { type: 'radio', id: 'security-training',  label: 'Do employees receive regular security awareness training?', options: ['Yes, at least annually','Yes, at onboarding only','Occasionally','No'] },
        { type: 'radio', id: 'background-checks',  label: 'Are background checks conducted before hiring?', options: ['Yes, for all staff','Yes, for sensitive roles only','No','Not applicable'] },
        { type: 'checkbox-multi', id: 'hr-practices', label: 'Which HR security practices are in place?', options: [
          { value: 'nda',          label: 'Confidentiality / NDA agreements', desc: 'Signed by all employees and contractors' },
          { value: 'disciplinary', label: 'Disciplinary process for security violations', desc: 'Documented and communicated' },
          { value: 'reporting',    label: 'Clear incident reporting channel', desc: 'Employees know how to report suspicious activity' },
          { value: 'phishing',     label: 'Phishing simulation exercises', desc: 'Regular simulated phishing tests' },
        ]},
      ],
    },
    {
      id: 6, label: 'Physical Security', icon: '🏭',
      title: 'Physical & Environmental Security',
      description: 'Review physical controls that protect your facilities and equipment.',
      questions: [
        { type: 'radio', id: 'phys-access', label: 'Is physical access to sensitive areas restricted and logged?', options: ['Yes, strictly (badge + log)','Partially','No','Not applicable (remote-only)'] },
        { type: 'checkbox-multi', id: 'phys-controls', label: 'Which physical security controls are in place?', options: [
          { value: 'cctv',        label: 'CCTV / Video surveillance', desc: 'Cameras in sensitive areas' },
          { value: 'visitor-log', label: 'Visitor management system', desc: 'All visitors logged and escorted' },
          { value: 'clean-desk',  label: 'Clean desk policy', desc: 'Sensitive materials secured when not in use' },
          { value: 'server-lock', label: 'Locked server rooms', desc: 'Physical lock + access log for server rooms' },
        ]},
        { type: 'radio', id: 'env-controls', label: 'Are environmental protections in place (fire, flood, power)?', options: ['Yes, fully protected','Partially','No','Not applicable'] },
      ],
    },
    {
      id: 7, label: 'Incident Response', icon: '🚨',
      title: 'Incident Response & Recovery',
      description: 'Review how your organization detects, responds to, and recovers from security incidents.',
      questions: [
        { type: 'radio', id: 'ir-plan', label: 'Do you have a documented Incident Response (IR) plan?', options: ['Yes, tested regularly','Yes, but never tested','Draft exists','No'] },
        { type: 'radio', id: 'rto-rpo', label: 'Are Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO) defined?', options: ['Yes, for all critical systems','For some systems','No','Not sure'] },
        { type: 'checkbox-multi', id: 'ir-capabilities', label: 'Which incident response capabilities do you have?', options: [
          { value: 'siem',          label: 'SIEM / Security monitoring', desc: 'Centralized log collection and alerting' },
          { value: 'soc',           label: '24/7 Security Operations (SOC)', desc: 'In-house or outsourced SOC' },
          { value: 'forensics',     label: 'Forensics capability', desc: 'Ability to investigate incidents post-event' },
          { value: 'notifications', label: 'Breach notification procedures', desc: 'Process for notifying regulators and users within required time' },
        ]},
      ],
    },
    {
      id: 8, label: 'Supplier & Third Party', icon: '🤝',
      title: 'Supplier & Third-Party Management',
      description: 'Assess how you manage information security risks from vendors and partners.',
      questions: [
        { type: 'radio', id: 'vendor-assessment', label: 'Do you conduct security assessments before onboarding new vendors?', options: ['Yes, always','For critical vendors only','Rarely','No'] },
        { type: 'radio', id: 'vendor-contracts',  label: 'Do vendor contracts include information security requirements?', options: ['Yes, always (DPA / SLAs)','For critical vendors only','No','Not sure'] },
        { type: 'checkbox-multi', id: 'vendor-monitoring', label: 'Which third-party management practices do you follow?', options: [
          { value: 'register',       label: 'Vendor / supplier register', desc: 'Up-to-date list of all third parties' },
          { value: 'periodic-review',label: 'Periodic vendor security reviews', desc: 'At least annual reassessment' },
          { value: 'cloud-review',   label: 'Cloud service provider review', desc: 'SaaS / IaaS providers regularly assessed' },
          { value: 'exit',           label: 'Vendor exit procedures', desc: 'Data retrieval and deletion upon contract end' },
        ]},
      ],
    },
    {
      id: 9, label: 'Compliance & Audit', icon: '✅',
      title: 'Compliance & Audit Management',
      description: 'Evaluate how your organization maintains and demonstrates ongoing compliance.',
      questions: [
        { type: 'radio',    id: 'internal-audit', label: 'Are internal audits conducted on a regular basis?', options: ['Yes, at least annually','Yes, but infrequently','Never','In the process of implementation'] },
        { type: 'radio',    id: 'external-audit', label: 'Has your organization undergone an external security audit in the past 2 years?', options: ['Yes, passed','Yes, with findings','No, but planned','No'] },
        { type: 'textarea', id: 'compliance-notes', label: 'Any additional compliance notes or context?', placeholder: 'e.g. We are preparing for our ISO 27001 certification next year...' },
        { type: 'checkbox-multi', id: 'compliance-frameworks', label: 'Which compliance frameworks apply to your organization?', options: [
          { value: 'iso27001', label: 'ISO 27001', desc: 'Information security management' },
          { value: 'gdpr',     label: 'GDPR',      desc: 'EU data protection regulation' },
          { value: 'soc2',     label: 'SOC 2',     desc: 'Service organization controls' },
          { value: 'nist',     label: 'NIST CSF',  desc: 'US cybersecurity framework' },
          { value: 'hipaa',    label: 'HIPAA',     desc: 'US healthcare data regulation' },
        ]},
      ],
    },
  ];

  currentStep = 0;
  answers: Answers = {};
  completed = false;

  get step() { return this.STEPS[this.currentStep]; }
  get progressPct() { return Math.max(Math.round((this.currentStep / this.STEPS.length) * 100), 4); }
  get stepLabel() { return `Step ${this.currentStep + 1} of ${this.STEPS.length}`; }
  get isLastStep() { return this.currentStep === this.STEPS.length - 1; }

  constructor(private router: Router) {}

  ngOnInit() {
    // Initialise answers map
    this.STEPS.forEach(s => (this.answers[s.id] = {}));
  }

  isStepCompleted(idx: number): boolean {
    const step = this.STEPS[idx];
    const ans = this.answers[step.id];
    return idx < this.currentStep && ans !== undefined;
  }

  goToStep(idx: number) {
    this.currentStep = idx;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextStep() {
    if (!this.answers[this.step.id]) this.answers[this.step.id] = {};
    if (this.currentStep < this.STEPS.length - 1) {
      this.currentStep++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.completed = true;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // ---- Field save helpers ----
  getAnswer(qId: string): any {
    return (this.answers[this.step.id] || {})[qId];
  }

  saveField(qId: string, value: any) {
    if (!this.answers[this.step.id]) this.answers[this.step.id] = {};
    this.answers[this.step.id][qId] = value;
  }

  // ---- Radio ----
  selectRadio(qId: string, value: string) {
    this.saveField(qId, value);
  }

  isRadioSelected(qId: string, value: string): boolean {
    return this.getAnswer(qId) === value;
  }

  // ---- Checkboxes ----
  toggleCheckbox(qId: string, value: string) {
    const arr: string[] = this.getAnswer(qId) || [];
    const idx = arr.indexOf(value);
    if (idx > -1) arr.splice(idx, 1); else arr.push(value);
    this.saveField(qId, [...arr]);
  }

  isChecked(qId: string, value: string): boolean {
    return (this.getAnswer(qId) || []).includes(value);
  }

  // ---- Casts for template ----
  asStringArray(opts: any): string[] { return opts as string[]; }
  asOptionArray(opts: any): QuestionOption[] { return opts as QuestionOption[]; }
  isStringArray(opts: any): boolean { return typeof opts[0] === 'string'; }
}
