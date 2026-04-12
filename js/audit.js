/* ============================================================
   audit.js — Multi-Step Audit Form Logic
   ============================================================ */

const STEPS = [
  {
    id: 1,
    label: "Organization Info",
    icon: "🏢",
    title: "Organization Information",
    description: "Tell us about your organization so we can tailor the audit to your context.",
    questions: [
      {
        type: "text",
        id: "org-name",
        label: "Organization name",
        placeholder: "e.g. Acme Corporation"
      },
      {
        type: "select",
        id: "org-size",
        label: "Number of employees",
        options: ["1–10", "11–50", "51–200", "201–500", "500+"]
      },
      {
        type: "select",
        id: "org-sector",
        label: "Industry sector",
        options: ["Technology", "Finance / Banking", "Healthcare", "Retail / E-commerce", "Manufacturing", "Government / Public sector", "Education", "Other"]
      },
      {
        type: "radio",
        id: "org-certif",
        label: "Do you currently hold any compliance certifications?",
        options: ["Yes", "No", "In progress"]
      }
    ]
  },
  {
    id: 2,
    label: "Security Policy",
    icon: "📋",
    title: "Information Security Policy",
    description: "Evaluate the existence and quality of your information security governance policies.",
    questions: [
      {
        type: "checkbox-multi",
        id: "policy-exist",
        label: "Which of the following policies exist in your organization?",
        options: [
          { value: "isms", label: "Information Security Management System (ISMS)", desc: "Formal ISMS documented and approved" },
          { value: "acceptable-use", label: "Acceptable Use Policy", desc: "Policy for appropriate use of IT resources" },
          { value: "data-class", label: "Data Classification Policy", desc: "Rules for classifying sensitive data" },
          { value: "incident", label: "Incident Response Policy", desc: "Defined process for handling security incidents" },
          { value: "bcp", label: "Business Continuity Plan (BCP)", desc: "Plan for maintaining operations during disruptions" },
        ]
      },
      {
        type: "radio",
        id: "policy-review",
        label: "Are your security policies reviewed at least annually?",
        options: ["Yes, regularly", "Yes, occasionally", "No", "We have no policies"]
      }
    ]
  },
  {
    id: 3,
    label: "Access Control",
    icon: "🔐",
    title: "Access Control & Identity Management",
    description: "Review how user access and authentication is managed across your systems.",
    questions: [
      {
        type: "radio",
        id: "mfa",
        label: "Is Multi-Factor Authentication (MFA) enforced for all user accounts?",
        options: ["Yes, for all accounts", "Yes, for admin accounts only", "No, but planned", "No"]
      },
      {
        type: "radio",
        id: "least-privilege",
        label: "Is the principle of least privilege applied when granting access?",
        options: ["Yes, strictly", "Partially", "No", "Not sure"]
      },
      {
        type: "checkbox-multi",
        id: "access-controls",
        label: "Which access control measures are in place?",
        options: [
          { value: "rbac", label: "Role-based access control (RBAC)", desc: "Access based on job role" },
          { value: "sso", label: "Single Sign-On (SSO)", desc: "Centralized authentication system" },
          { value: "reviews", label: "Regular access reviews", desc: "At least quarterly reviews of user permissions" },
          { value: "offboarding", label: "Automated offboarding", desc: "Access revoked within 24h of employee departure" },
          { value: "pam", label: "Privileged Access Management (PAM)", desc: "Special controls for admin/privileged accounts" },
        ]
      }
    ]
  },
  {
    id: 4,
    label: "Data Management",
    icon: "🗄️",
    title: "Data Management & Protection",
    description: "Assess how your organization handles, stores, and protects sensitive data.",
    questions: [
      {
        type: "radio",
        id: "data-encrypt",
        label: "Is sensitive data encrypted both at rest and in transit?",
        options: ["Yes, both", "At rest only", "In transit only", "No"]
      },
      {
        type: "radio",
        id: "data-backup",
        label: "Are regular data backups performed and tested?",
        options: ["Yes, automated & tested", "Yes, but not tested", "Manually and irregularly", "No backups"]
      },
      {
        type: "checkbox-multi",
        id: "data-practices",
        label: "Which data management practices do you follow?",
        options: [
          { value: "inventory", label: "Data asset inventory", desc: "All data assets catalogued and owner assigned" },
          { value: "retention", label: "Data retention policy", desc: "Defined retention periods and deletion procedures" },
          { value: "dpia", label: "Data Protection Impact Assessments (DPIA)", desc: "Conducted before processing high-risk data" },
          { value: "anonymization", label: "Anonymization / pseudonymization", desc: "Applied where appropriate" },
        ]
      }
    ]
  },
  {
    id: 5,
    label: "Human Resources",
    icon: "👥",
    title: "Human Resources & Training",
    description: "Evaluate security awareness, training programs, and HR security procedures.",
    questions: [
      {
        type: "radio",
        id: "security-training",
        label: "Do employees receive regular security awareness training?",
        options: ["Yes, at least annually", "Yes, at onboarding only", "Occasionally", "No"]
      },
      {
        type: "radio",
        id: "background-checks",
        label: "Are background checks conducted before hiring?",
        options: ["Yes, for all staff", "Yes, for sensitive roles only", "No", "Not applicable"]
      },
      {
        type: "checkbox-multi",
        id: "hr-practices",
        label: "Which HR security practices are in place?",
        options: [
          { value: "nda", label: "Confidentiality / NDA agreements", desc: "Signed by all employees and contractors" },
          { value: "disciplinary", label: "Disciplinary process for security violations", desc: "Documented and communicated" },
          { value: "reporting", label: "Clear incident reporting channel", desc: "Employees know how to report suspicious activity" },
          { value: "phishing", label: "Phishing simulation exercises", desc: "Regular simulated phishing tests" },
        ]
      }
    ]
  },
  {
    id: 6,
    label: "Physical Security",
    icon: "🏭",
    title: "Physical & Environmental Security",
    description: "Review physical controls that protect your facilities and equipment.",
    questions: [
      {
        type: "radio",
        id: "phys-access",
        label: "Is physical access to sensitive areas restricted and logged?",
        options: ["Yes, strictly (badge + log)", "Partially", "No", "Not applicable (remote-only)"]
      },
      {
        type: "checkbox-multi",
        id: "phys-controls",
        label: "Which physical security controls are in place?",
        options: [
          { value: "cctv", label: "CCTV / Video surveillance", desc: "Cameras in sensitive areas" },
          { value: "visitor-log", label: "Visitor management system", desc: "All visitors logged and escorted" },
          { value: "clean-desk", label: "Clean desk policy", desc: "Sensitive materials secured when not in use" },
          { value: "server-lock", label: "Locked server rooms", desc: "Physical lock + access log for server rooms" },
        ]
      },
      {
        type: "radio",
        id: "env-controls",
        label: "Are environmental protections in place (fire, flood, power)?",
        options: ["Yes, fully protected", "Partially", "No", "Not applicable"]
      }
    ]
  },
  {
    id: 7,
    label: "Incident Response",
    icon: "🚨",
    title: "Incident Response & Recovery",
    description: "Review how your organization detects, responds to, and recovers from security incidents.",
    questions: [
      {
        type: "radio",
        id: "ir-plan",
        label: "Do you have a documented Incident Response (IR) plan?",
        options: ["Yes, tested regularly", "Yes, but never tested", "Draft exists", "No"]
      },
      {
        type: "radio",
        id: "rto-rpo",
        label: "Are Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO) defined?",
        options: ["Yes, for all critical systems", "For some systems", "No", "Not sure"]
      },
      {
        type: "checkbox-multi",
        id: "ir-capabilities",
        label: "Which incident response capabilities do you have?",
        options: [
          { value: "siem", label: "SIEM / Security monitoring", desc: "Centralized log collection and alerting" },
          { value: "soc", label: "24/7 Security Operations (SOC)", desc: "In-house or outsourced SOC" },
          { value: "forensics", label: "Forensics capability", desc: "Ability to investigate incidents post-event" },
          { value: "notifications", label: "Breach notification procedures", desc: "Process for notifying regulators and users within required time" },
        ]
      }
    ]
  },
  {
    id: 8,
    label: "Supplier & Third Party",
    icon: "🤝",
    title: "Supplier & Third-Party Management",
    description: "Assess how you manage information security risks from vendors and partners.",
    questions: [
      {
        type: "radio",
        id: "vendor-assessment",
        label: "Do you conduct security assessments before onboarding new vendors?",
        options: ["Yes, always", "For critical vendors only", "Rarely", "No"]
      },
      {
        type: "radio",
        id: "vendor-contracts",
        label: "Do vendor contracts include information security requirements?",
        options: ["Yes, always (DPA / SLAs)", "For critical vendors only", "No", "Not sure"]
      },
      {
        type: "checkbox-multi",
        id: "vendor-monitoring",
        label: "Which third-party management practices do you follow?",
        options: [
          { value: "register", label: "Vendor / supplier register", desc: "Up-to-date list of all third parties" },
          { value: "periodic-review", label: "Periodic vendor security reviews", desc: "At least annual reassessment" },
          { value: "cloud-review", label: "Cloud service provider review", desc: "SaaS / IaaS providers regularly assessed" },
          { value: "exit", label: "Vendor exit procedures", desc: "Data retrieval and deletion upon contract end" },
        ]
      }
    ]
  },
  {
    id: 9,
    label: "Compliance & Audit",
    icon: "✅",
    title: "Compliance & Audit Management",
    description: "Evaluate how your organization maintains and demonstrates ongoing compliance.",
    questions: [
      {
        type: "radio",
        id: "internal-audit",
        label: "Are internal audits conducted on a regular basis?",
        options: ["Yes, at least annually", "Yes, but infrequently", "Never", "In the process of implementation"]
      },
      {
        type: "radio",
        id: "external-audit",
        label: "Has your organization undergone an external security audit in the past 2 years?",
        options: ["Yes, passed", "Yes, with findings", "No, but planned", "No"]
      },
      {
        type: "textarea",
        id: "compliance-notes",
        label: "Any additional compliance notes or context?",
        placeholder: "e.g. We are preparing for our ISO 27001 certification next year..."
      },
      {
        type: "checkbox-multi",
        id: "compliance-frameworks",
        label: "Which compliance frameworks apply to your organization?",
        options: [
          { value: "iso27001", label: "ISO 27001", desc: "Information security management" },
          { value: "gdpr", label: "GDPR", desc: "EU data protection regulation" },
          { value: "soc2", label: "SOC 2", desc: "Service organization controls" },
          { value: "nist", label: "NIST CSF", desc: "US cybersecurity framework" },
          { value: "hipaa", label: "HIPAA", desc: "US healthcare data regulation" },
        ]
      }
    ]
  }
];

// State
let currentStep = 0;
const answers = {};

// ---- Render Sidebar ----
function renderSidebar() {
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = STEPS.map((step, idx) => {
    const isActive    = idx === currentStep;
    const isCompleted = answers[step.id] !== undefined && !isActive;
    let cls = 'sidebar-item';
    if (isActive) cls += ' active';
    if (isCompleted) cls += ' completed';
    return `
      <div class="${cls}" onclick="goToStep(${idx})">
        <div class="step-dot">${isCompleted ? '✓' : step.id}</div>
        <div class="step-label">${step.icon} ${step.label}</div>
        <span class="step-check">✓</span>
      </div>`;
  }).join('');
}

// ---- Render Step ----
function renderStep() {
  const step = STEPS[currentStep];
  const pct  = Math.round(((currentStep) / STEPS.length) * 100);

  // Update nav
  document.getElementById('progress-label').textContent = `Step ${currentStep + 1} of ${STEPS.length}`;
  document.getElementById('progress-pct').textContent   = `${pct}%`;
  document.getElementById('top-progress-bar').style.width = `${Math.max(pct, 4)}%`;
  document.getElementById('btn-prev').disabled = currentStep === 0;
  document.getElementById('btn-next').textContent = currentStep === STEPS.length - 1 ? 'Complete Audit ✓' : 'Next Step →';

  const saved = answers[step.id] || {};

  let questionsHtml = step.questions.map(q => renderQuestion(q, saved)).join('');

  document.getElementById('step-container').innerHTML = `
    <div class="step-header animate-fadeInUp">
      <div class="step-badge">
        <span class="badge badge-primary">${step.icon} Step ${step.id} / ${STEPS.length}</span>
      </div>
      <h2 class="step-title">${step.title}</h2>
      <p class="step-desc">${step.description}</p>
    </div>
    <div class="step-questions animate-fadeInUp" style="animation-delay:0.1s">
      ${questionsHtml}
    </div>`;

  renderSidebar();
  bindCheckboxes();
  bindRadios();
}

function renderQuestion(q, saved) {
  switch (q.type) {
    case 'text':
      return `<div class="form-group">
        <label class="form-label" for="${q.id}">${q.label}</label>
        <input class="form-input" type="text" id="${q.id}" placeholder="${q.placeholder || ''}" value="${saved[q.id] || ''}" oninput="saveField('${q.id}', this.value)">
      </div>`;

    case 'textarea':
      return `<div class="form-group">
        <label class="form-label" for="${q.id}">${q.label}</label>
        <textarea class="form-input form-textarea" id="${q.id}" placeholder="${q.placeholder || ''}" oninput="saveField('${q.id}', this.value)">${saved[q.id] || ''}</textarea>
      </div>`;

    case 'select':
      const opts = q.options.map(o => `<option value="${o}" ${saved[q.id] === o ? 'selected' : ''}>${o}</option>`).join('');
      return `<div class="form-group">
        <label class="form-label" for="${q.id}">${q.label}</label>
        <select class="form-input" id="${q.id}" onchange="saveField('${q.id}', this.value)">
          <option value="">— Select an option —</option>
          ${opts}
        </select>
      </div>`;

    case 'radio':
      const savedRadio = saved[q.id] || '';
      const radioItems = q.options.map(opt => `
        <div class="radio-item${savedRadio === opt ? ' selected' : ''}" data-group="${q.id}" data-value="${opt}" onclick="selectRadio('${q.id}', '${opt}', this)">
          ${opt}
        </div>`).join('');
      return `<div class="form-group">
        <label class="form-label">${q.label}</label>
        <div class="radio-group">${radioItems}</div>
      </div>`;

    case 'checkbox-multi':
      const savedChecked = saved[q.id] || [];
      const cbItems = q.options.map(opt => {
        const isChecked = savedChecked.includes(opt.value);
        return `<label class="checkbox-item${isChecked ? ' checked' : ''}" data-group="${q.id}" data-value="${opt.value}">
          <input type="checkbox" value="${opt.value}" ${isChecked ? 'checked' : ''}>
          <div class="checkbox-box">${isChecked ? '✓' : ''}</div>
          <div>
            <div class="checkbox-label">${opt.label}</div>
            <div class="checkbox-desc">${opt.desc}</div>
          </div>
        </label>`;
      }).join('');
      return `<div class="form-group">
        <label class="form-label">${q.label}</label>
        <div class="checkbox-group">${cbItems}</div>
      </div>`;

    default: return '';
  }
}

// ---- Bind Interactions ----
function bindCheckboxes() {
  document.querySelectorAll('.checkbox-item').forEach(item => {
    item.addEventListener('click', function(e) {
      if (e.target.tagName === 'INPUT') return; // handled by input
      const inp = this.querySelector('input[type=checkbox]');
      inp.checked = !inp.checked;
      toggleCheckbox(this, inp);
    });
    const inp = item.querySelector('input[type=checkbox]');
    inp.addEventListener('change', function() {
      toggleCheckbox(item, this);
    });
  });
}

function toggleCheckbox(item, inp) {
  const group = item.dataset.group;
  const val   = item.dataset.value;
  const box   = item.querySelector('.checkbox-box');
  if (inp.checked) {
    item.classList.add('checked');
    box.textContent = '✓';
  } else {
    item.classList.remove('checked');
    box.textContent = '';
  }
  // Save
  const step = STEPS[currentStep];
  if (!answers[step.id]) answers[step.id] = {};
  const arr = answers[step.id][group] || [];
  if (inp.checked) {
    if (!arr.includes(val)) arr.push(val);
  } else {
    const i = arr.indexOf(val);
    if (i > -1) arr.splice(i, 1);
  }
  answers[step.id][group] = arr;
}

function bindRadios() {
  // already handled via onclick
}

function selectRadio(qId, value, el) {
  document.querySelectorAll(`.radio-item[data-group="${qId}"]`).forEach(r => r.classList.remove('selected'));
  el.classList.add('selected');
  saveField(qId, value);
}

function saveField(qId, value) {
  const step = STEPS[currentStep];
  if (!answers[step.id]) answers[step.id] = {};
  answers[step.id][qId] = value;
}

// ---- Navigation ----
function nextStep() {
  // Mark current as answered
  const step = STEPS[currentStep];
  if (!answers[step.id]) answers[step.id] = {};

  if (currentStep < STEPS.length - 1) {
    currentStep++;
    renderStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // Final step → redirect to results
    showCompletion();
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    renderStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function goToStep(idx) {
  currentStep = idx;
  renderStep();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showCompletion() {
  // Update progress bar to 100%
  document.getElementById('progress-label').textContent = 'Audit Complete';
  document.getElementById('progress-pct').textContent = '100%';
  document.getElementById('top-progress-bar').style.width = '100%';

  document.getElementById('step-container').innerHTML = `
    <div class="completion-screen animate-fadeInUp">
      <div class="completion-icon">✓</div>
      <h2>Audit Complete!</h2>
      <p>All 9 sections have been completed. Your compliance report is ready — view your score, risks, and recommendations now.</p>
      <a href="results.html" class="btn btn-primary btn-lg">
        📊 View My Report →
      </a>
    </div>`;

  document.getElementById('audit-nav-btns')?.remove();
  document.querySelector('.audit-nav-btns').style.display = 'none';
}

// ---- Init ----
renderStep();
