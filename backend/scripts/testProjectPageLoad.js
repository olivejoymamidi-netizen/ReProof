/**
 * Verification test for Project Page loading and parameter handling.
 * Verifies that domainId=ai-ml, skillId=machine-learning, levelId=1
 * and other domain/skill pairs return complete, non-null project specifications
 * with both rubricCriteria and evaluationCriteria arrays properly populated.
 */

const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: options.path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

const testCases = [
  {
    domainId: 'ai-ml',
    skillId: 'machine-learning',
    levelId: '1',
    expectedTitle: 'Supervised Customer Churn Classifier with Calibrated Thresholds',
  },
  {
    domainId: 'dsa',
    skillId: 'trees-graphs',
    levelId: '2',
    expectedTitle: 'Directed Acyclic Graph Cycle Detector & Topological Build Scheduler',
  },
  {
    domainId: 'web-development',
    skillId: 'react',
    levelId: '2',
    expectedTitle: 'Multi-Step Wizard Form with Custom Hook State Machine & Error Boundary',
  },
];

async function runTest() {
  console.log('================================================================');
  console.log('TESTING PROJECT ROUND DATA INTEGRITY & PARAMETER HANDLING');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  for (const tc of testCases) {
    total++;
    console.log(`▶ Testing ${tc.domainId} // ${tc.skillId} // Level ${tc.levelId}:`);
    const res = await request(
      { path: '/api/project/start', method: 'POST' },
      { domainId: tc.domainId, skillId: tc.skillId, levelId: tc.levelId }
    );

    if (res.status !== 200 || !res.data?.success) {
      console.error(`  ✗ API failed with status ${res.status}:`, res.data);
      continue;
    }

    const spec = res.data?.data?.projectSpec;
    if (!spec) {
      console.error(`  ✗ projectSpec missing in response`);
      continue;
    }

    const checks = [
      spec.title && spec.title.length > 0,
      spec.problemStatement && spec.problemStatement.length > 0,
      spec.objective && spec.objective.length > 0,
      Array.isArray(spec.requirements) && spec.requirements.length > 0,
      Array.isArray(spec.constraints) && spec.constraints.length > 0,
      Array.isArray(spec.expectedDeliverables) && spec.expectedDeliverables.length > 0,
      Array.isArray(spec.rubricCriteria) && spec.rubricCriteria.length > 0,
      Array.isArray(spec.evaluationCriteria) && spec.evaluationCriteria.length > 0,
      spec.starterCode && spec.starterCode.length > 0,
    ];

    if (checks.every(Boolean)) {
      console.log(`  ✓ Title: "${spec.title}"`);
      console.log(`  ✓ Problem Statement: ${spec.problemStatement.substring(0, 70)}...`);
      console.log(`  ✓ Requirements: ${spec.requirements.length} items`);
      console.log(`  ✓ Constraints: ${spec.constraints.length} items`);
      console.log(`  ✓ Deliverables: ${spec.expectedDeliverables.length} items`);
      console.log(`  ✓ Rubric Criteria (rubricCriteria): ${spec.rubricCriteria.length} items`);
      console.log(`  ✓ Evaluation Criteria (evaluationCriteria): ${spec.evaluationCriteria.length} items`);
      console.log(`  ✓ Starter Code: ${spec.starterCode.length} chars`);
      passed++;
    } else {
      console.error(`  ✗ Field checks failed:`, spec);
    }
  }

  console.log('\n================================================================');
  console.log(`PROJECT VERIFICATION SUMMARY: ${passed} / ${total} TESTS PASSED`);
  console.log('================================================================\n');

  process.exit(passed === total ? 0 : 1);
}

runTest().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
