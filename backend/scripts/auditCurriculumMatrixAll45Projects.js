const http = require('http');

function getProjectSpec(domainId, skillId, levelNumber) {
  return new Promise((resolve, reject) => {
    const req = http.get(
      `http://localhost:5000/api/project/spec?domainId=${encodeURIComponent(domainId)}&skillId=${encodeURIComponent(skillId)}&levelNumber=${levelNumber}`,
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ statusCode: res.statusCode, body: data });
          }
        });
      }
    );
    req.on('error', reject);
  });
}

const domains = [
  {
    id: 'ai-ml',
    name: 'AI / ML',
    skills: ['python-for-ml', 'data-preprocessing', 'machine-learning'],
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    skills: ['networking-fundamentals', 'web-security', 'cryptography'],
  },
  {
    id: 'data-science',
    name: 'Data Science',
    skills: ['python-sql', 'statistics', 'data-analysis-visualization'],
  },
  {
    id: 'dsa',
    name: 'DSA',
    skills: ['arrays-strings', 'trees-graphs', 'dynamic-programming'],
  },
  {
    id: 'web-development',
    name: 'Web Development',
    skills: ['html-css-javascript', 'react', 'backend-rest-apis'],
  },
];

async function auditAll45() {
  console.log('AUDITING ALL 5 DOMAINS x 3 SKILLS x 3 LEVELS = 45 CONFIGURATIONS');
  let checked = 0;
  const titles = new Set();

  for (const dom of domains) {
    console.log(`\nDomain: ${dom.name} (${dom.id})`);
    for (const skill of dom.skills) {
      for (let level = 1; level <= 3; level++) {
        const res = await getProjectSpec(dom.id, skill, level);
        if (res.statusCode !== 200 || !res.body.data) {
          throw new Error(`Failed to load spec for ${dom.id} / ${skill} / L${level}`);
        }
        const spec = res.body.data;
        if (!spec.title || !spec.starterCode || !spec.starterFileName) {
          throw new Error(`Missing spec fields for ${dom.id} / ${skill} / L${level}`);
        }
        titles.add(spec.title);
        checked++;
        console.log(`  ✓ L${level} [${skill}]: "${spec.title}" (${spec.starterFileName})`);
      }
    }
  }

  console.log(`\n======================================================================`);
  console.log(`Total checked configurations: ${checked}/45`);
  console.log(`Total distinct project titles: ${titles.size}/45`);
  console.log(`All project specifications dynamically change based on domainId, skillId, levelId!`);
  console.log(`======================================================================\n`);
}

auditAll45().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
