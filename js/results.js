/* ============================================================
   results.js — Animate score ring, render categories/risks/recos
   ============================================================ */

const GLOBAL_SCORE = 72;

const CATEGORIES = [
  { icon: "🏢", name: "Organization Info",     score: 90, color: "#22C55E" },
  { icon: "📋", name: "Security Policy",        score: 65, color: "#F59E0B" },
  { icon: "🔐", name: "Access Control",         score: 55, color: "#EF4444" },
  { icon: "🗄️", name: "Data Management",        score: 80, color: "#22C55E" },
  { icon: "👥", name: "Human Resources",         score: 70, color: "#3B82F6" },
  { icon: "🏭", name: "Physical Security",       score: 85, color: "#22C55E" },
  { icon: "🚨", name: "Incident Response",       score: 50, color: "#EF4444" },
  { icon: "🤝", name: "Supplier Management",     score: 60, color: "#F59E0B" },
  { icon: "✅", name: "Compliance & Audit",      score: 75, color: "#3B82F6" },
];

const RISKS = [
  {
    severity: "critical",
    title: "No MFA enforced",
    text: "Multi-Factor Authentication is not enabled for all user accounts. This significantly increases the risk of unauthorized access.",
    category: "Access Control"
  },
  {
    severity: "high",
    title: "Incident Response plan not tested",
    text: "Your IR plan exists but has never been exercised. An untested plan may fail during a real incident.",
    category: "Incident Response"
  },
  {
    severity: "high",
    title: "Missing security awareness training",
    text: "Employees have not received formal security training. Human error remains the #1 cause of data breaches.",
    category: "Human Resources"
  },
  {
    severity: "medium",
    title: "Vendor assessments incomplete",
    text: "Security assessments are only performed for some vendors. Third-party risks may remain undetected.",
    category: "Supplier Management"
  },
];

const RECOMMENDATIONS = [
  {
    icon: "🔒",
    title: "Deploy MFA organization-wide",
    text: "Enable MFA for all accounts, prioritizing admin and privileged accounts. Consider hardware keys for critical roles.",
    priority: "Immediate"
  },
  {
    icon: "📄",
    title: "Formalize and approve missing policies",
    text: "Draft and get board-level approval for missing policies: ISMS, Data Classification, and Incident Response.",
    priority: "30 days"
  },
  {
    icon: "🎓",
    title: "Launch security awareness program",
    text: "Implement annual mandatory training for all staff. Include phishing simulation exercises quarterly.",
    priority: "60 days"
  },
  {
    icon: "🔄",
    title: "Test your Incident Response plan",
    text: "Conduct a tabletop exercise with key stakeholders. Update and document lessons learned.",
    priority: "90 days"
  },
  {
    icon: "🤝",
    title: "Expand vendor security assessments",
    text: "Assess all critical vendors annually. Include security questionnaires in all new vendor contracts.",
    priority: "90 days"
  },
  {
    icon: "🗂️",
    title: "Create a data asset inventory",
    text: "Identify and classify all data assets. Assign an owner to each asset and define retention periods.",
    priority: "60 days"
  },
];

// ---- Score Ring Animation ----
function animateScore() {
  const ring    = document.getElementById('score-ring');
  const display = document.getElementById('score-display');
  const label   = document.getElementById('score-level');
  const circumference = 427;
  const offset  = circumference - (GLOBAL_SCORE / 100) * circumference;

  // Animate ring
  setTimeout(() => {
    ring.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)';
    ring.style.strokeDashoffset = offset;
  }, 300);

  // Animate number
  let current = 0;
  const interval = setInterval(() => {
    current++;
    display.textContent = current;
    if (current >= GLOBAL_SCORE) {
      clearInterval(interval);
      // Set level badge
      if (GLOBAL_SCORE >= 85) {
        label.textContent = '✓ Good standing';
        label.className = 'score-level badge badge-success';
      } else if (GLOBAL_SCORE >= 65) {
        label.textContent = '⚠ Moderate';
        label.className = 'score-level badge badge-warning';
      } else {
        label.textContent = '✗ Critical';
        label.className = 'score-level badge badge-danger';
      }
    }
  }, 18);
}

// ---- Render Categories ----
function renderCategories() {
  const container = document.getElementById('category-scores');
  container.innerHTML = CATEGORIES.map(cat => {
    const scoreClass = cat.score >= 80 ? 'success' : cat.score >= 60 ? 'warning' : 'danger';
    const scoreColor = cat.score >= 80 ? 'var(--success)' : cat.score >= 60 ? 'var(--warning)' : 'var(--danger)';
    return `
      <div class="cat-item">
        <div class="cat-header">
          <div class="cat-name">${cat.icon} ${cat.name}</div>
          <div class="cat-score" style="color:${scoreColor}">${cat.score}%</div>
        </div>
        <div class="cat-track">
          <div class="cat-fill" data-width="${cat.score}" style="background:${cat.color}"></div>
        </div>
      </div>`;
  }).join('');

  // Animate bars after a delay
  setTimeout(() => {
    document.querySelectorAll('.cat-fill').forEach(fill => {
      fill.style.width = fill.dataset.width + '%';
    });
  }, 400);
}

// ---- Render Risks ----
function renderRisks() {
  const container = document.getElementById('risks-list');
  const severityMap = {
    critical: { cls: 'risk',    icon: '🔴', badge: 'Critical', badgeCls: 'badge-danger' },
    high:     { cls: 'risk',    icon: '🟠', badge: 'High',     badgeCls: 'badge-danger' },
    medium:   { cls: 'warning', icon: '🟡', badge: 'Medium',   badgeCls: 'badge-warning' },
    low:      { cls: 'recommendation', icon: '🟢', badge: 'Low', badgeCls: 'badge-success' },
  };
  container.innerHTML = RISKS.map(risk => {
    const s = severityMap[risk.severity];
    return `
      <div class="alert-card ${s.cls}">
        <div class="alert-icon">${s.icon}</div>
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:4px">
            <div class="alert-title">${risk.title}</div>
            <span class="badge ${s.badgeCls}">${s.badge}</span>
            <span class="badge badge-secondary" style="font-size:11px">${risk.category}</span>
          </div>
          <div class="alert-text">${risk.text}</div>
        </div>
      </div>`;
  }).join('');
}

// ---- Render Recommendations ----
function renderRecos() {
  const container = document.getElementById('reco-list');
  const priorityColor = { Immediate: 'var(--danger)', '30 days': 'var(--warning)', '60 days': 'var(--primary)', '90 days': 'var(--secondary)' };
  container.innerHTML = RECOMMENDATIONS.map(r => `
    <div class="alert-card recommendation">
      <div class="alert-icon">${r.icon}</div>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:4px">
          <div class="alert-title">${r.title}</div>
          <span style="font-size:11px;font-weight:600;padding:3px 9px;border-radius:999px;background:#E0F2FE;color:${priorityColor[r.priority] || 'var(--primary)'};">${r.priority}</span>
        </div>
        <div class="alert-text">${r.text}</div>
      </div>
    </div>`).join('');
}

function exportReport() {
  alert('PDF export feature: In a production app, this would generate a PDF report using a library like jsPDF or via a server-side rendering service.');
}

// ---- Init ----
animateScore();
renderCategories();
renderRisks();
renderRecos();
