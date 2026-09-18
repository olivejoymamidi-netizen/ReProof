/**
 * Multi-Domain Evaluation Pipeline Verification
 * Verifies that the evaluation pipeline handles various domains & skills accurately.
 */

const http = require('http');

function postJson(urlPath, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path: urlPath,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runCrossDomainTests() {
  console.log('Testing Cross-Domain Competency Evaluation...\n');

  const testCases = [
    {
      domainId: 'cybersecurity',
      skillId: 'web-security',
      levelNumber: 1,
      name: 'Cybersecurity // Web Security L1',
      kPct: 75,
      appScore: 80,
      cScore: 85,
      pScore: 78,
      iScore: 82,
    },
    {
      domainId: 'web-dev',
      skillId: 'react',
      levelNumber: 2,
      name: 'Web Dev // React L2',
      kPct: 90,
      appScore: 85,
      cScore: 92,
      pScore: 88,
      iScore: 90,
    },
    {
      domainId: 'dsa',
      skillId: 'trees-and-graphs',
      levelNumber: 1,
      name: 'DSA // Trees and Graphs L1',
      kPct: 60,
      appScore: 70,
      cScore: 65,
      // Missing project & interview
      pScore: null,
      iScore: null,
    },
  ];

  let passed = 0;
  for (const tc of testCases) {
    const payload = {
      domainId: tc.domainId,
      skillId: tc.skillId,
      levelNumber: tc.levelNumber,
      evidencePayload: {
        knowledgeResult: { percentage: tc.kPct, score: 6, totalQuestions: 8 },
        approachResult: { score: tc.appScore, complexity: 'O(N)' },
        codingResult: { score: tc.cScore, totalLinesChanged: 25 },
        projectResult: tc.pScore !== null ? { overallScore: tc.pScore, title: `${tc.name} Benchmark` } : undefined,
        interviewResult: tc.iScore !== null ? { overallScore: tc.iScore } : undefined,
      },
    };

    const res = await postJson('/api/intelligence/analyze', payload);
    const proof = res.data?.data;

    // Expected score
    let expectedScore;
    if (tc.pScore !== null && tc.iScore !== null) {
      expectedScore = Math.round(tc.kPct * 0.15 + tc.appScore * 0.20 + tc.cScore * 0.25 + tc.pScore * 0.25 + tc.iScore * 0.15);
    } else {
      // 15 + 20 + 25 = 60
      expectedScore = Math.round((tc.kPct * 15 + tc.appScore * 20 + tc.cScore * 25) / 60);
    }

    if (proof?.overallScore === expectedScore) {
      console.log(`[PASS] ${tc.name}: score = ${proof.overallScore}/100 (matched expected ${expectedScore})`);
      passed++;
    } else {
      console.error(`[FAIL] ${tc.name}: got ${proof?.overallScore}, expected ${expectedScore}`);
    }
  }

  console.log(`\nCross-domain verification: ${passed}/${testCases.length} passed.`);
  if (passed === testCases.length) process.exit(0);
  else process.exit(1);
}

runCrossDomainTests();
