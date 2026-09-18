/**
 * Comprehensive Evaluation Pipeline Verification Suite
 * Tests Gemini connection & offline transparency, centralized scoring normalization,
 * Test A (Strong Performance), Test B (Weak Performance), and edge cases.
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

function getJson(urlPath) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: 'localhost', port: 5000, path: urlPath }, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('===============================================================');
  console.log('REPROOF EVALUATION PIPELINE AUDIT & VERIFICATION SUITE');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // TEST 1: Backend Health
  // -------------------------------------------------------------
  console.log('--- TEST 1: Backend Health Check ---');
  try {
    const health = await getJson('/api/health');
    assert(health.status === 200 && health.data?.success === true, 'Backend /api/health returns HTTP 200 OK');
  } catch (err) {
    assert(false, `Backend /api/health failed: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST 2: TEST A — STRONG PERFORMANCE
  // -------------------------------------------------------------
  console.log('\n--- TEST 2: TEST A — Strong Performance ---');
  let proofA = null;
  try {
    const strongPayload = {
      domainId: 'ai-ml',
      skillId: 'machine-learning',
      levelNumber: 1,
      evidencePayload: {
        knowledgeResult: {
          percentage: 88,
          score: 7,
          totalQuestions: 8,
          correctAnswers: 7,
        },
        approachEvidence: {
          strategy: 'Decompose pipeline into modular ingestion, stratified normalization, and gradient descent optimization with boundary invariant checks.',
          dataStructures: 'Contiguous memory tensor buffers using pre-allocated float32 arrays to prevent cache thrashing.',
          edgeCases: 'Guards against zero-variance features, division by epsilon, and NaN/null propagation in vectorized math.',
          complexity: 'Time: O(N log N), Space: O(N)',
        },
        codingEvidence: {
          sourceCode: 'def optimize_pipeline(data):\n    # verified gradient descent with boundary clipping\n    return data * 2\n',
          testsPassedPct: 100,
          linesChanged: 54,
          submitted: true,
        },
        projectResult: {
          overallScore: 92,
          title: 'Machine Learning Model Benchmark',
          auditHash: 'sha256:test_a_proj_hash',
        },
        interviewResult: {
          overallScore: 86,
          crossRoundConsistency: { status: 'High Alignment' },
        },
      },
    };

    const resA = await postJson('/api/intelligence/analyze', strongPayload);
    assert(resA.status === 200 && resA.data?.success === true, 'Test A request succeeded with HTTP 200');
    proofA = resA.data?.data;

    assert(proofA?.overallScore >= 80, `Test A overallScore is strong: ${proofA?.overallScore}/100`);
    assert(proofA?.overallScore !== 85, `Test A overallScore is NOT hardcoded 85: ${proofA?.overallScore}`);
    assert(proofA?.demonstratedCompetencies?.length >= 3, `Test A has demonstrated competencies: ${proofA?.demonstratedCompetencies?.length}`);
    assert(proofA?.verificationStatus === 'Verified', `Test A verificationStatus is 'Verified': ${proofA?.verificationStatus}`);
    assert(proofA?.evidenceDossier?.knowledge?.status === 'Completed', 'Knowledge round marked Completed in dossier');
    assert(proofA?.evidenceDossier?.approach?.status === 'Completed', 'Approach round marked Completed in dossier');
    assert(proofA?.evidenceDossier?.coding?.status === 'Completed', 'Coding round marked Completed in dossier');
    assert(proofA?.evidenceDossier?.project?.status === 'Completed', 'Project round marked Completed in dossier');
    assert(proofA?.evidenceDossier?.interview?.status === 'Completed', 'Interview round marked Completed in dossier');
  } catch (err) {
    assert(false, `Test A execution failed: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST 3: TEST B — WEAK PERFORMANCE
  // -------------------------------------------------------------
  console.log('\n--- TEST 3: TEST B — Weak Performance (Random / Nonsense Submissions) ---');
  let proofB = null;
  try {
    const weakPayload = {
      domainId: 'ai-ml',
      skillId: 'machine-learning',
      levelNumber: 1,
      evidencePayload: {
        knowledgeResult: {
          percentage: 12, // 1/8 correct
          score: 1,
          totalQuestions: 8,
          correctAnswers: 1,
        },
        approachEvidence: {
          strategy: 'asdf idk placeholder',
          dataStructures: 'test',
          edgeCases: 'none',
          complexity: 'none',
        },
        codingEvidence: {
          sourceCode: 'x = 1',
          testsPassedPct: 0,
          linesChanged: 1,
          submitted: true,
        },
        projectResult: {
          overallScore: 22,
          title: 'Minimal Empty Project',
          auditHash: 'sha256:test_b_proj_hash',
        },
        interviewResult: {
          overallScore: 25,
          crossRoundConsistency: { status: 'Variance Observed' },
        },
      },
    };

    const resB = await postJson('/api/intelligence/analyze', weakPayload);
    assert(resB.status === 200 && resB.data?.success === true, 'Test B request succeeded with HTTP 200');
    proofB = resB.data?.data;

    assert(proofB?.overallScore <= 40, `Test B overallScore reflects weak evidence: ${proofB?.overallScore}/100`);
    assert(proofB?.overallScore !== proofA?.overallScore, `Test A (${proofA?.overallScore}) and Test B (${proofB?.overallScore}) produce distinct scores`);
    assert(proofB?.skillGaps?.length >= 3, `Test B generates targeted skill gaps: ${proofB?.skillGaps?.length} gaps`);
    assert(proofB?.recommendations?.length >= 3, `Test B generates targeted recommendations: ${proofB?.recommendations?.length}`);
    assert(proofB?.verificationStatus === 'Insufficient Evidence', `Test B verificationStatus is 'Insufficient Evidence': ${proofB?.verificationStatus}`);
  } catch (err) {
    assert(false, `Test B execution failed: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST 4: MISSING EVIDENCE NORMALIZATION
  // -------------------------------------------------------------
  console.log('\n--- TEST 4: Missing Evidence Normalization (Project & Interview NOT_AVAILABLE) ---');
  try {
    // Only Knowledge (70), Approach (60), and Coding (80)
    // Available weights: 15 + 20 + 25 = 60
    // Expected normalized: (70*15 + 60*20 + 80*25) / 60 = (1050 + 1200 + 2000) / 60 = 4250 / 60 = 70.83 -> 71
    const partialPayload = {
      domainId: 'ai-ml',
      skillId: 'machine-learning',
      levelNumber: 1,
      evidencePayload: {
        knowledgeResult: { percentage: 70, score: 7, totalQuestions: 10 },
        approachResult: { score: 60, complexity: 'O(N)' },
        codingResult: { score: 80, totalLinesChanged: 30 },
        // Project omitted (NOT_AVAILABLE)
        // Interview omitted (NOT_AVAILABLE)
      },
    };

    const resPartial = await postJson('/api/intelligence/analyze', partialPayload);
    assert(resPartial.status === 200 && resPartial.data?.success === true, 'Partial rounds request succeeded');
    const proofPartial = resPartial.data?.data;

    assert(proofPartial?.overallScore === 71, `Normalized score correctly calculated: ${proofPartial?.overallScore}/100 (expected 71)`);
    assert(proofPartial?.evidenceDossier?.project?.status === 'Not Evaluated', 'Missing Project marked Not Evaluated');
    assert(proofPartial?.evidenceDossier?.interview?.status === 'Not Evaluated', 'Missing Interview marked Not Evaluated');
    assert(proofPartial?.evidenceDossier?.knowledge?.status === 'Completed', 'Provided Knowledge marked Completed');
  } catch (err) {
    assert(false, `Partial evidence test failed: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST 5: NO EVIDENCE SUBMITTED
  // -------------------------------------------------------------
  console.log('\n--- TEST 5: Completely Empty Evidence (All rounds NOT_AVAILABLE) ---');
  try {
    const emptyPayload = {
      domainId: 'ai-ml',
      skillId: 'machine-learning',
      levelNumber: 1,
      evidencePayload: {},
    };

    const resEmpty = await postJson('/api/intelligence/analyze', emptyPayload);
    assert(resEmpty.status === 200 && resEmpty.data?.success === true, 'Empty evidence request succeeded');
    const proofEmpty = resEmpty.data?.data;

    assert(proofEmpty?.overallScore === 0, `Empty evidence yields score 0: ${proofEmpty?.overallScore}`);
    assert(proofEmpty?.overallScore !== 85, `Empty evidence does NOT default to 85`);
    assert(proofEmpty?.verificationStatus === 'Insufficient Evidence', 'Empty evidence status is Insufficient Evidence');
    assert(proofEmpty?.unverifiedCompetencies?.length === 5, 'All competencies flagged as unverified');
  } catch (err) {
    assert(false, `Empty evidence test failed: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST 6: AI TRANSPARENCY (NO FAKE AI)
  // -------------------------------------------------------------
  console.log('\n--- TEST 6: AI Evaluation Transparency ---');
  try {
    // Check AI interpretation in proofA
    const ai = proofA?.aiInterpretation;
    assert(ai !== undefined, 'AI interpretation field exists in proof');
    if (ai.model === 'offline') {
      assert(ai.analyticalRemarks.some((r) => r.includes('AI evaluation unavailable') || r.includes('ReProof')),
        `Transparently declares AI unavailable: "${ai.analyticalRemarks[0]}"`);
    } else {
      console.log(`  [INFO] Gemini connected via model: ${ai.model}`);
      assert(ai.analyticalRemarks.length > 0, 'Gemini provided evidence remarks');
    }
  } catch (err) {
    assert(false, `AI transparency test failed: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST 7: RETRIEVAL OF SKILL PROOF BY ID
  // -------------------------------------------------------------
  console.log('\n--- TEST 7: Skill Proof Persistence & Retrieval ---');
  try {
    if (proofA?.proofId) {
      const getRes = await getJson(`/api/intelligence/proof/${proofA.proofId}`);
      assert(getRes.status === 200 && getRes.data?.data?.proofId === proofA.proofId, 'Successfully retrieved Skill Proof by proofId');
      assert(getRes.data?.data?.overallScore === proofA.overallScore, 'Retrieved proof maintains identical score');
    }
  } catch (err) {
    assert(false, `Proof retrieval failed: ${err.message}`);
  }

  console.log('\n===============================================================');
  console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((e) => {
  console.error('Fatal test runner exception:', e);
  process.exit(1);
});
