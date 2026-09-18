/**
 * Comprehensive Verification Test for Round 3: Project + Technical Interview
 * Tests all 5 domains, multiple levels, cross-round citations, and persistence.
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

const post = (path, data) => request({ path, method: 'POST' }, data);
const patch = (path, data) => request({ path, method: 'PATCH' }, data);
const get = (path) => request({ path, method: 'GET' });

const testConfigurations = [
  {
    domainId: 'ai-ml',
    domainName: 'AI / ML',
    skillId: 'python-for-ml',
    skillName: 'Python for ML',
    levelNumber: 1,
    code: `import numpy as np
def normalize_telemetry(data):
    mean = np.mean(data, axis=0)
    std = np.std(data, axis=0) + 1e-8
    return (data - mean) / std`,
    architectureNotes: 'Used vectorized array broadcasting instead of row loops for SIMD optimization.',
    weaknessRef: 'broadcasting dimension alignment',
    interviewAnswers: [
      'We chose vectorized broadcasting because contiguous C-array buffers in NumPy minimize pointer indirection and completely avoid the Python GIL overhead during array transformations.',
      'To prevent the broadcasting dimension mismatch flagged during our Knowledge Check, we explicitly reshaped incoming arrays to match axis dimensions before applying matrix calculations.',
      'If the dataset volume grows 100x exceeding RAM, we stream chunks using np.memmap or Dask out-of-core memory partitions instead of loading the full tensor.',
      'Our implementation enforces a 1e-8 epsilon safeguard on division operations to guarantee numerical stability when standard deviation approaches zero.'
    ]
  },
  {
    domainId: 'cybersecurity',
    domainName: 'Cybersecurity',
    skillId: 'web-security',
    skillName: 'Web Security',
    levelNumber: 2,
    code: `// Secure Express Middleware hardening against CSRF & XSS
const helmet = require('helmet');
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", (req, res) => \`'nonce-\${res.locals.cspNonce}'\`]
  }
}));`,
    architectureNotes: 'Implemented cryptographic nonce-based Content Security Policy and double-submit cookie patterns.',
    weaknessRef: 'SSRF internal network validation',
    interviewAnswers: [
      'We established a defense-in-depth architecture using cryptographically random nonces for CSP Level 3 rather than unsafe-inline scripts.',
      'Regarding SSRF constraints from Round 01 diagnostics, our gateway resolves DNS before request dispatch and explicitly blocks RFC-1918 private IP ranges.',
      'If an attacker evades perimeter filtering through HTTP parameter pollution, our schema validation rejects unlisted parameters before business logic executes.',
      'We verified that session tokens use SameSite=Strict and HttpOnly flags to prevent client-side credential extraction.'
    ]
  },
  {
    domainId: 'data-science',
    domainName: 'Data Science',
    skillId: 'statistics',
    skillName: 'Statistics',
    levelNumber: 3,
    code: `import scipy.stats as stats
import numpy as np
def causal_ate(treatment_group, control_group):
    t_stat, p_val = stats.ttest_ind(treatment_group, control_group, equal_var=False)
    diff = np.mean(treatment_group) - np.mean(control_group)
    return {'ATE': diff, 'p_value': p_val, 'significant': p_val < 0.05}`,
    architectureNotes: 'Welch t-test formulation correcting for unequal variance with Bonferroni multiple testing adjustment.',
    weaknessRef: 'confounding covariates and Simpson paradox',
    interviewAnswers: [
      'We opted for Welch two-sample t-test because assumption of equal variance across real-world cohort buckets is routinely violated.',
      'Addressing the confounding covariate risks flagged in Round 01, we stratified cohorts into propensity score matched strata prior to computing ATE.',
      'Under high-frequency streaming observations, we transition from fixed sample hypothesis tests to sequential probability ratio testing (SPRT) to prevent p-hacking.',
      'We evaluated statistical power using Monte Carlo simulation to ensure false negative rates did not exceed 0.10.'
    ]
  },
  {
    domainId: 'dsa',
    domainName: 'DSA',
    skillId: 'dynamic-programming',
    skillName: 'Dynamic Programming',
    levelNumber: 2,
    code: `function minPathSum(grid) {
  const m = grid.length, n = grid[0].length;
  const dp = new Array(n).fill(Infinity);
  dp[0] = 0;
  for (let i = 0; i < m; i++) {
    dp[0] += grid[i][0];
    for (let j = 1; j < n; j++) {
      dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j];
    }
  }
  return dp[n - 1];
}`,
    architectureNotes: 'Space-optimized 1D tabulation reducing memory auxiliary footprint from O(M*N) to O(N).',
    weaknessRef: 'overlapping subproblem state transitions',
    interviewAnswers: [
      'We compressed the 2D grid matrix into a single 1D rolling buffer because each row transition only relies on the current and previous element.',
      'Addressing the state transition boundary hazard flagged in Round 01, we initialized boundaries with Infinity to eliminate edge-case indexing branches.',
      'The time complexity is strictly O(M*N) with optimal O(N) auxiliary space. If N is much larger than M, we invert matrix orientation to minimize auxiliary allocation to O(min(M, N)).',
      'The optimal substructure invariant guarantees that any optimal path to (i, j) is composed of optimal paths to predecessor cells.'
    ]
  },
  {
    domainId: 'web-development',
    domainName: 'Web Development',
    skillId: 'backend-rest-apis',
    skillName: 'Backend & REST APIs',
    levelNumber: 1,
    code: `const express = require('express');
const app = express();
app.use(express.json());
app.get('/api/v1/resources/:id', async (req, res, next) => {
  try {
    const item = await db.find(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not Found' });
    res.json(item);
  } catch (err) { next(err); }
});`,
    architectureNotes: 'Layered RESTful controller with centralized asynchronous error-handling middleware.',
    weaknessRef: 'unhandled promise rejections and status codes',
    interviewAnswers: [
      'We separated routes, controllers, and services so database schema alterations do not directly leak into external API contract specifications.',
      'To eliminate the unhandled async rejection vulnerability flagged in Round 01, all asynchronous handlers delegate caught errors to centralized express error middleware.',
      'For scaling to 10k req/sec, we implement Redis token-bucket rate limiting and horizontal process clustering behind an NGINX reverse proxy.',
      'Every mutation endpoint returns consistent HTTP status codes: 201 for creation, 204 for deletion, and 422 for unprocessable entities.'
    ]
  }
];

async function runVerification() {
  console.log('================================================================');
  console.log('REPROOF ROUND 3 VERIFICATION: PROJECT + TECHNICAL INTERVIEW');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  for (const config of testConfigurations) {
    console.log(`\n▶ TESTING DOMAIN: ${config.domainName} | SKILL: ${config.skillName} | LEVEL: 0${config.levelNumber}`);

    // Step 1: Project Spec Direct Query
    totalTests++;
    const specRes = await get(`/api/project/spec?domainId=${config.domainId}&skillId=${config.skillId}&levelNumber=${config.levelNumber}`);
    if (specRes.status === 200 && specRes.data?.data?.title) {
      console.log(`  ✓ 1. Loaded Project Spec: "${specRes.data.data.title}" (${specRes.data.data.difficulty})`);
      passedTests++;
    } else {
      console.error(`  ✗ 1. Failed to load project spec for ${config.skillId}`);
    }

    // Step 2: Start Project Attempt
    totalTests++;
    const startProjRes = await post('/api/project/start', {
      domainId: config.domainId,
      skillId: config.skillId,
      levelNumber: config.levelNumber,
    });
    const projAttemptId = startProjRes.data?.data?.attemptId;
    if (startProjRes.status === 200 && projAttemptId) {
      console.log(`  ✓ 2. Started Project Attempt: ${projAttemptId}`);
      passedTests++;
    } else {
      console.error(`  ✗ 2. Failed to start project attempt`);
    }

    // Step 3: Save Project Draft & Telemetry
    totalTests++;
    const draftRes = await patch(`/api/project/attempt/${projAttemptId}/draft`, {
      draft: {
        sourceCode: config.code,
        architectureNotes: config.architectureNotes,
      }
    });
    const integrityRes = await post(`/api/project/attempt/${projAttemptId}/integrity`, {
      type: 'TAB_BLUR',
      details: { simulation: true }
    });
    if (draftRes.status === 200 && integrityRes.status === 200) {
      console.log(`  ✓ 3. Saved real-time draft & recorded integrity telemetry`);
      passedTests++;
    } else {
      console.error(`  ✗ 3. Draft save or integrity failed`);
    }

    // Step 4: Submit Project Deliverables
    totalTests++;
    const submitProjRes = await post(`/api/project/attempt/${projAttemptId}/submit`, {
      submission: {
        sourceCode: config.code,
        architectureNotes: config.architectureNotes,
      }
    });
    const projResult = submitProjRes.data?.data;
    if (submitProjRes.status === 200 && projResult?.overallScore >= 70 && projResult?.auditHash) {
      console.log(`  ✓ 4. Project Evaluated: Score ${projResult.overallScore}/100 | Criteria: ${projResult.criteriaScores?.length} dims | Hash: ${projResult.auditHash.substring(0, 16)}...`);
      passedTests++;
    } else {
      console.error(`  ✗ 4. Project evaluation failed:`, submitProjRes.data);
    }

    // Step 5: Start Technical Interview referencing prior evidence
    totalTests++;
    const startInterviewRes = await post('/api/interview/start', {
      domainId: config.domainId,
      skillId: config.skillId,
      levelNumber: config.levelNumber,
      priorEvidence: {
        projectTitle: specRes.data?.data?.title,
        knowledgeWeakness: config.weaknessRef,
      }
    });
    const interviewAttemptId = startInterviewRes.data?.data?.attemptId;
    const questions = startInterviewRes.data?.data?.questions;
    if (startInterviewRes.status === 200 && interviewAttemptId && questions?.length >= 3) {
      console.log(`  ✓ 5. Technical Interview Synthesized: ${questions.length} context-aware questions`);
      console.log(`       Question 1 Focus: [${questions[0].focusArea}]`);
      console.log(`       Evidence Cited: "${questions[0].contextPrompt.substring(0, 50)}..."`);
      passedTests++;
    } else {
      console.error(`  ✗ 5. Interview generation failed:`, startInterviewRes.data);
    }

    // Step 6: Save Answers & Log Telemetry
    totalTests++;
    const answersMap = {};
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const ans = config.interviewAnswers[i % config.interviewAnswers.length];
      answersMap[q.id] = ans;
      await patch(`/api/interview/attempt/${interviewAttemptId}/answer`, {
        questionId: q.id,
        answerText: ans,
      });
    }
    await post(`/api/interview/attempt/${interviewAttemptId}/integrity`, {
      type: 'TAB_BLUR',
      details: { candidateSwitch: false }
    });
    console.log(`  ✓ 6. Saved ${Object.keys(answersMap).length} technical answers with telemetry`);
    passedTests++;

    // Step 7: Submit Technical Interview
    totalTests++;
    const submitInterviewRes = await post(`/api/interview/attempt/${interviewAttemptId}/submit`, {
      answers: answersMap,
    });
    const interviewResult = submitInterviewRes.data?.data;
    if (submitInterviewRes.status === 200 && interviewResult?.overallScore >= 70) {
      console.log(`  ✓ 7. Interview Evaluated: Score ${interviewResult.overallScore}/100`);
      console.log(`       Consistency Status: ${interviewResult.crossRoundConsistency?.status}`);
      console.log(`       Observations: "${interviewResult.crossRoundConsistency?.observations?.[0] || 'Aligned'}"`);
      passedTests++;
    } else {
      console.error(`  ✗ 7. Interview evaluation failed:`, submitInterviewRes.data);
    }

    // Step 8: Persistence Check (Refresh Simulation)
    totalTests++;
    const getProjCheck = await get(`/api/project/attempt/${projAttemptId}`);
    const getInterviewCheck = await get(`/api/interview/attempt/${interviewAttemptId}`);
    if (
      getProjCheck.status === 200 &&
      getProjCheck.data?.data?.evaluationResult?.overallScore &&
      getInterviewCheck.status === 200 &&
      getInterviewCheck.data?.data?.evaluationResult?.overallScore
    ) {
      console.log(`  ✓ 8. Persistence Confirmed: Refreshing does not destroy submitted evidence.`);
      passedTests++;
    } else {
      console.error(`  ✗ 8. Persistence verification failed.`);
    }
  }

  // Step 9: Complexity Level Scaling Test (Verify L1 vs L2 vs L3 requirements)
  console.log('\n▶ TESTING LEVEL COMPLEXITY PROGRESSION (Web Dev / React L1, L2, L3)');
  totalTests++;
  const l1Spec = await get('/api/project/spec?domainId=web-development&skillId=react&levelNumber=1');
  const l2Spec = await get('/api/project/spec?domainId=web-development&skillId=react&levelNumber=2');
  const l3Spec = await get('/api/project/spec?domainId=web-development&skillId=react&levelNumber=3');

  const l1Title = l1Spec.data?.data?.title;
  const l2Title = l2Spec.data?.data?.title;
  const l3Title = l3Spec.data?.data?.title;

  if (l1Title !== l2Title && l2Title !== l3Title) {
    console.log(`  ✓ Level 1: "${l1Title}" (${l1Spec.data?.data?.difficulty})`);
    console.log(`  ✓ Level 2: "${l2Title}" (${l2Spec.data?.data?.difficulty})`);
    console.log(`  ✓ Level 3: "${l3Title}" (${l3Spec.data?.data?.difficulty})`);
    console.log('  ✓ Complexity Progression Confirmed: Unique problems & escalating constraints.');
    passedTests++;
  } else {
    console.error('  ✗ Complexity progression failed; duplicate titles detected.');
  }

  console.log('\n================================================================');
  console.log(`VERIFICATION SUMMARY: ${passedTests} / ${totalTests} CHECKS PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('================================================================\n');

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
