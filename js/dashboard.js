/* ============================================================
   dashboard.js — Charts and Audit History Table
   ============================================================ */

// ---- Trend chart data ----
const TREND_DATA = [
  { month: "Oct", score: 58 },
  { month: "Nov", score: 62 },
  { month: "Dec", score: 65 },
  { month: "Jan", score: 61 },
  { month: "Feb", score: 68 },
  { month: "Mar", score: 72 },
];

// ---- Audit history ----
const AUDIT_HISTORY = [
  { date: "27 Mar 2026", org: "Acme Corp", framework: "ISO 27001 / GDPR", score: 72, status: "moderate", risks: 4, id: "A-2026-012" },
  { date: "14 Feb 2026", org: "Acme Corp", framework: "GDPR",             score: 68, status: "moderate", risks: 6, id: "A-2026-011" },
  { date: "03 Jan 2026", org: "Acme Corp", framework: "ISO 27001",         score: 61, status: "low",      risks: 8, id: "A-2026-010" },
  { date: "15 Dec 2025", org: "Acme Corp", framework: "SOC 2",             score: 65, status: "moderate", risks: 5, id: "A-2025-009" },
  { date: "22 Nov 2025", org: "Acme Corp", framework: "NIST CSF",          score: 62, status: "moderate", risks: 7, id: "A-2025-008" },
  { date: "01 Oct 2025", org: "Acme Corp", framework: "ISO 27001",         score: 58, status: "low",      risks: 9, id: "A-2025-007" },
];

// ---- Category scores for radar ----
const RADAR_CATS = [
  { name: "Org Info",         score: 90 },
  { name: "Policy",           score: 65 },
  { name: "Access Control",   score: 55 },
  { name: "Data Mgmt",        score: 80 },
  { name: "HR",               score: 70 },
  { name: "Physical Sec",     score: 85 },
  { name: "Incident Resp",    score: 50 },
  { name: "3rd Party",        score: 60 },
  { name: "Compliance",       score: 75 },
];

// ---- Render Bar Chart ----
function renderTrendChart() {
  const container = document.getElementById('chart-bars');
  const labels    = document.getElementById('chart-labels');
  const maxScore  = 100;

  container.innerHTML = TREND_DATA.map(d => `
    <div class="bar-col">
      <div class="bar-fill" data-score="${d.score}" style="height:0%">
        <div class="bar-tooltip">${d.score}%</div>
      </div>
    </div>`).join('');

  labels.innerHTML = TREND_DATA.map(d => `
    <div class="chart-label">${d.month}</div>`).join('');

  // Animate bars
  setTimeout(() => {
    document.querySelectorAll('.bar-fill').forEach(bar => {
      const score = parseInt(bar.dataset.score);
      bar.style.height = (score / maxScore * 100) + '%';
    });
  }, 300);
}

// ---- Render Radar Chart (pure SVG) ----
function renderRadar() {
  const svg = document.getElementById('radar-svg');
  const cx = 150, cy = 150, r = 100;
  const n = RADAR_CATS.length;

  // Grid rings
  const gridHtml = [0.25, 0.5, 0.75, 1].map(frac => {
    const pts = Array.from({ length: n }, (_, i) => {
      const angle = (2 * Math.PI * i / n) - Math.PI / 2;
      const rad   = r * frac;
      return `${cx + rad * Math.cos(angle)},${cy + rad * Math.sin(angle)}`;
    }).join(' ');
    return `<polygon points="${pts}" fill="none" stroke="#E2E8F0" stroke-width="1"/>`;
  }).join('');

  // Axis lines
  const axisHtml = Array.from({ length: n }, (_, i) => {
    const angle = (2 * Math.PI * i / n) - Math.PI / 2;
    return `<line x1="${cx}" y1="${cy}" x2="${cx + r * Math.cos(angle)}" y2="${cy + r * Math.sin(angle)}" stroke="#E2E8F0" stroke-width="1"/>`;
  }).join('');

  // Data polygon
  const dataPoints = RADAR_CATS.map((cat, i) => {
    const angle = (2 * Math.PI * i / n) - Math.PI / 2;
    const val   = cat.score / 100;
    return `${cx + r * val * Math.cos(angle)},${cy + r * val * Math.sin(angle)}`;
  }).join(' ');

  // Data dots
  const dotHtml = RADAR_CATS.map((cat, i) => {
    const angle = (2 * Math.PI * i / n) - Math.PI / 2;
    const val   = cat.score / 100;
    return `<circle cx="${cx + r * val * Math.cos(angle)}" cy="${cy + r * val * Math.sin(angle)}" r="4" fill="var(--primary)"/>`;
  }).join('');

  // Labels
  const labelOffset = 22;
  const labelHtml = RADAR_CATS.map((cat, i) => {
    const angle = (2 * Math.PI * i / n) - Math.PI / 2;
    const lx = cx + (r + labelOffset) * Math.cos(angle);
    const ly = cy + (r + labelOffset) * Math.sin(angle);
    const anchor = lx < cx - 5 ? 'end' : lx > cx + 5 ? 'start' : 'middle';
    return `<text x="${lx}" y="${ly + 4}" text-anchor="${anchor}" font-size="10" font-family="Inter,sans-serif" fill="#64748B" font-weight="500">${cat.name}</text>`;
  }).join('');

  svg.innerHTML = `
    <defs>
      <linearGradient id="radarGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.15"/>
      </linearGradient>
    </defs>
    ${gridHtml}
    ${axisHtml}
    <polygon points="${dataPoints}" fill="url(#radarGrad)" stroke="#3B82F6" stroke-width="2"/>
    ${dotHtml}
    ${labelHtml}`;
}

// ---- Render Audit Table ----
function renderAuditTable() {
  const tbody = document.getElementById('audit-tbody');
  const statusMap = {
    good:     { class: 'badge-success', label: '✓ Good',     color: 'var(--success)' },
    moderate: { class: 'badge-warning', label: '⚠ Moderate', color: 'var(--warning)' },
    low:      { class: 'badge-danger',  label: '✗ Critical', color: 'var(--danger)'  },
  };
  const riskColor = (n) => n <= 3 ? 'var(--success)' : n <= 6 ? 'var(--warning)' : 'var(--danger)';

  tbody.innerHTML = AUDIT_HISTORY.map(a => {
    const st = statusMap[a.status];
    return `<tr>
      <td style="color:var(--text-muted);font-size:13px">${a.date}</td>
      <td><div class="org-name">${a.org}</div><div style="font-size:12px;color:var(--text-muted)">#${a.id}</div></td>
      <td><span class="badge badge-secondary" style="font-size:12px">${a.framework}</span></td>
      <td><span class="score-pill" style="color:${st.color}">${a.score}%</span></td>
      <td><span class="badge ${st.class}">${st.label}</span></td>
      <td><span style="font-weight:700;color:${riskColor(a.risks)}">${a.risks} risk${a.risks !== 1 ? 's' : ''}</span></td>
      <td>
        <button class="table-action-btn" onclick="window.location='results.html'">View Report</button>
      </td>
    </tr>`;
  }).join('');
}

// ---- Init ----
renderTrendChart();
renderRadar();
renderAuditTable();
