const fs = require('fs');

const rawText = fs.readFileSync('pdf-output.txt', 'utf8');

// Fix encoding issues
const text = rawText
  .replace(/├®/g, 'é')
  .replace(/├á/g, 'à')
  .replace(/┬º/g, '§')
  .replace(/┼ô/g, 'œ')
  .replace(/├¿/g, 'è')
  .replace(/├¬/g, 'ê')
  .replace(/├«/g, 'î')
  .replace(/├┤/g, 'ô')
  .replace(/├ó/g, 'â')
  .replace(/├╗/g, 'û')
  .replace(/├º/g, 'ç')
  .replace(/ÔÇö/g, '—')
  .replace(/ÔÇª/g, '...')
  .replace(/N┬░/g, 'N°');

const pages = text.split(/--- PAGE \d+ ---/);

const roles = [
  { match: /Top Management/, key: 'DIRECTION' },
  { match: /Responsable S.curit. SI/i, key: 'RSSI' },
  { match: /Administrateurs Syst.mes & R.seaux/i, key: 'EMPLOYEE_IT' },
  { match: /Administration du Personnel/, key: 'EMPLOYEE_HR' },
  { match: /Auditeur Interne/, key: 'AUDITOR' },
  { match: /EMPLOYEE_ADMIN/, key: 'EMPLOYEE_ADMIN' }
];

let currentRole = null;
let currentClause = null;
let questions = {
  DIRECTION: [],
  RSSI: [],
  EMPLOYEE_IT: [],
  EMPLOYEE_HR: [],
  AUDITOR: [],
  EMPLOYEE_ADMIN: []
};

pages.forEach(page => {
  // Try to find if this page starts a new role
  roles.forEach(r => {
    if (page.match(r.match)) {
      currentRole = r.key;
    }
  });

  if (!currentRole) return;

  // Split page by 'n   n   n   n' which marks the end of a question
  const parts = page.split(/n\s+n\s+n\s+n/g);
  
  parts.forEach(part => {
    part = part.trim();
    // Check if there's a clause header in this part
    const clauseMatch = part.match(/(§\s*[\d\.]+\s*—\s*[^0-9]+)/);
    if (clauseMatch) {
      currentClause = clauseMatch[1].trim();
    }

    // Try to match a question
    // Example: 1   Avez-vous formellement identifié... ?  §4.1
    // Let's use a simpler match: Number at start of line/block, some text, Reference at end
    const qMatch = part.match(/(?:^|\s)(\d+)\s+(.+?)\s+(§[\d\.]+.*|A\.[\d\.]+.*)$/);
    if (qMatch) {
      const qNum = parseInt(qMatch[1], 10);
      let qText = qMatch[2].trim();
      const qRef = qMatch[3].trim();

      // Clean up question text
      qText = qText.replace(/\s+/g, ' ').replace(/^C\s+P\s*C\s+N\s*C\s+N\s*A\s*/, '').trim();

      questions[currentRole].push({
        id: `${currentRole.substring(0, 3)}-${qNum}`,
        clauseCode: currentClause || 'Général',
        number: qNum,
        text: qText,
        reference: qRef
      });
    } else {
      // If it fails, maybe the reference has trailing spaces? We did part = part.trim().
      // Let's see if we can match any number followed by text and reference
      const altMatch = part.match(/(\d+)\s+(.+?)\s+((?:§|A\.)[\d\.]+.*)$/);
      if (altMatch) {
        const qNum = parseInt(altMatch[1], 10);
        let qText = altMatch[2].trim();
        const qRef = altMatch[3].trim();
        qText = qText.replace(/\s+/g, ' ').replace(/^.*C\s+P\s*C\s+N\s*C\s+N\s*A\s*/, '').trim();
        questions[currentRole].push({
          id: `${currentRole.substring(0, 3)}-${qNum}`,
          clauseCode: currentClause || 'Général',
          number: qNum,
          text: qText,
          reference: qRef
        });
      }
    }
  });
});

fs.writeFileSync('src/assets/iso27001-questions.json', JSON.stringify(questions, null, 2));
console.log("JSON generated successfully.");
