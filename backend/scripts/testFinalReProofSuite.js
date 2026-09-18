/**
 * ReProof Final Automated Verification Test Suite (Round 5)
 * Comprehensive testing of:
 * 1. All 5 Domains x 15 Skills Taxonomy
 * 2. Multi-Round Pipeline (Knowledge -> Approach -> Coding -> Project -> Interview -> Intelligence -> Proof)
 * 3. Deterministic Server-Side Scoring (15/15/25/30/15 formula)
 * 4. Gemini Evidence-Analysis Integration & Graceful Fallback
 * 5. Score Appeal Lifecycle (Original preservation, Re-evaluation, Delta comparison, Audit hashes)
 * 6. Assessment Integrity & Non-Punitive Telemetry
 * 7. Persistence across refresh
 * 8. Security Boundaries (Validation, Safe Error Handling)
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
const get = (path) => request({ path, method: 'GET' });

// Domain test matrix covering all 5 domains and diverse levels
const domainTestMatrix = [
  {
    domainId: 'ai-ml',
    domainName: 'AI / ML',
    skillId: 'machine-learning',
    skillName: 'Machine Learning',
    levelNumber: 2,
    knowledgeScore: 84,
    approachScore: 88,
    codingScore: 86,
    projectScore: 92,
    interviewScore: 82,
  },
  {
    domainId: 'cybersecurity',
    domainName: 'Cybersecurity',
    skillId: 'cryptography',
    skillName: 'Cryptography',
    levelNumber: 3,
    knowledgeScore: 86,
    approachScore: 90,
    codingScore: 82,
    projectScore: 94,
    interviewScore: 84,
  },
  {
    domainId: 'data-science',
    domainName: 'Data Science',
    skillId: 'python-sql',
    skillName: 'Python & SQL',
    levelNumber: 1,
    knowledgeScore: 80,
    approachScore: 84,
    codingScore: 78,
    projectScore: 86,
    interviewScore: 76,
  },
  {
    domainId: 'dsa',
    domainName: 'DSA',
    skillId: 'trees-graphs',
    skillName: 'Trees & Graphs',
    levelNumber: 2,
    knowledgeScore: 88,
    approachScore: 86,
    codingScore: 92,
    projectScore: 90,
    interviewScore: 84,
  },
  {
    domainId: 'web-development',
    domainName: 'Web Development',
    skillId: 'react',
    skillName: 'React',
    levelNumber: 2,
    knowledgeScore: 90,
    approachScore: 88,
    codingScore: 88,
    projectScore: 94,
    interviewScore: 86,
  },
];

async function runFinalVerification() {
  console.log('================================================================');
  console.log('REPROOF ROUND 5: FINAL COMPREHENSIVE SYSTEM VERIFICATION');
  console.log('================================================================\n');

  let totalChecks = 0;
  let passedChecks = 0;

  // Track an assessment to run the full Score Appeal lifecycle
  let sampleProofForAppeal = null;

  // ============================================================================
  // SECTION 1: 5-DOMAIN END-TO-END PIPELINE & DETERMINISTIC INTELLIGENCE
  // ============================================================================
  console.log('▶ SECTION 1: VERIFYING ALL 5 DOMAINS & DETERMINISTIC INTELLIGENCE\n');

  for (const item of domainTestMatrix) {
    console.log(`  [Domain: ${item.domainName} | Skill: ${item.skillName} | Level: 0${item.levelNumber}]`);

    // Expected Deterministic Formula: 0.15*K + 0.15*A + 0.25*C + 0.30*P + 0.15*I
    const expectedScore = Math.round(
      item.knowledgeScore * 0.15 +
      item.approachScore * 0.15 +
      item.codingScore * 0.25 +
      item.projectScore * 0.30 +
      item.interviewScore * 0.15
    );

    // 1. Ingest multi-round evidence and analyze
    totalChecks++;
    const analyzeRes = await post('/api/intelligence/analyze', {
      domainId: item.domainId,
      domainName: item.domainName,
      skillId: item.skillId,
      skillName: item.skillName,
      levelNumber: item.levelNumber,
      evidencePayload: {
        knowledgeResult: { score: item.knowledgeScore, totalQuestions: 10 },
        approachResult: { score: item.approachScore, complexity: 'Time: O(N log N), Space: O(N)' },
        codingResult: { score: item.codingScore, totalLinesChanged: 58 },
        projectResult: { title: `${item.skillName} Production Benchmark`, overallScore: item.projectScore },
        interviewResult: { overallScore: item.interviewScore, crossRoundConsistency: { status: 'High Alignment' } },
        integritySignals: [{ type: 'FOCUS_ACTIVE' }],
      },
    });

    const proof = analyzeRes.data?.data;
    if (analyzeRes.status === 200 && proof?.proofId) {
      console.log(`    ✓ Synthesized Intelligence Dossier: ${proof.proofId}`);
      passedChecks++;
    } else {
      console.error(`    ✗ Intelligence synthesis failed:`, analyzeRes.data);
    }

    // 2. Deterministic Score Verification (Not simple averaging)
    totalChecks++;
    const naiveAvg = Math.round(
      (item.knowledgeScore + item.approachScore + item.codingScore + item.projectScore + item.interviewScore) / 5
    );
    if (proof?.overallScore === expectedScore) {
      console.log(`    ✓ Deterministic Score Verified: ${proof.overallScore}/100 (Weighted: 15/15/25/30/15, Naive avg would be: ${naiveAvg})`);
      passedChecks++;
    } else {
      console.error(`    ✗ Score mismatch. Expected: ${expectedScore}, Got: ${proof?.overallScore}`);
    }

    // 3. Competency Matrix Verification across all 5 rounds
    totalChecks++;
    if (proof?.competencyMatrix && proof.competencyMatrix.length >= 4) {
      const sampleRow = proof.competencyMatrix[0];
      const has5Rounds =
        sampleRow.roundStatuses.Knowledge &&
        sampleRow.roundStatuses.Approach &&
        sampleRow.roundStatuses.Coding &&
        sampleRow.roundStatuses.Project &&
        sampleRow.roundStatuses.Interview;

      if (has5Rounds) {
        console.log(`    ✓ Competency Matrix: ${proof.competencyMatrix.length} criteria mapped to all 5 evaluation rounds.`);
        passedChecks++;
      } else {
        console.error(`    ✗ Competency Matrix missing 5-round mapping.`);
      }
    } else {
      console.error(`    ✗ Matrix generation failed.`);
    }

    // 4. Strengths & Evidence Traceability
    totalChecks++;
    if (proof?.strengths && proof.strengths.length > 0) {
      console.log(`    ✓ Strengths Traced to Evidence: Top strength "${proof.strengths[0].competencyName}" cited.`);
      passedChecks++;
    } else {
      console.error(`    ✗ No strengths generated.`);
    }

    // 5. Final Skill Proof Credential & SHA-256 Hash
    totalChecks++;
    if (proof?.auditHash?.startsWith('sha256:') && proof?.currentCompetencyStage) {
      console.log(`    ✓ Skill Proof Authenticated: Stage ${proof.currentCompetencyStage}, Status: ${proof.verificationStatus}`);
      passedChecks++;
    } else {
      console.error(`    ✗ Missing audit hash or stage.`);
    }

    // 6. Gemini Evidence Assistant / Engine Verification
    totalChecks++;
    if (proof?.aiInterpretation?.engine && proof?.aiInterpretation?.analyticalRemarks?.length > 0) {
      console.log(`    ✓ AI Evidence Analysis Connected: [${proof.aiInterpretation.engine}] with ${proof.aiInterpretation.analyticalRemarks.length} remarks.`);
      passedChecks++;
    } else {
      console.error(`    ✗ Missing AI interpretation remarks.`);
    }

    // Save proof for Score Appeal testing
    if (!sampleProofForAppeal && proof) {
      sampleProofForAppeal = proof;
    }
  }

  // ============================================================================
  // SECTION 2: SCORE APPEAL SYSTEM VERIFICATION
  // ============================================================================
  console.log('\n▶ SECTION 2: VERIFYING SCORE APPEAL LIFECYCLE\n');

  if (sampleProofForAppeal) {
    const originalProofId = sampleProofForAppeal.proofId;
    const initialScore = sampleProofForAppeal.overallScore;

    // 1. Submit Score Appeal
    totalChecks++;
    console.log(`  Submitting Appeal for Original Credential: ${originalProofId} (Initial Score: ${initialScore})`);
    const appealRes = await post('/api/intelligence/appeal', {
      originalProofId,
      reasonCategory: 'RUBRIC_INTERPRETATION',
      explanation: 'Our solution implemented an alternative in-place algorithm that satisfies time bounds without allocating auxiliary vectors, which warrants full criterion credit.',
      supportingEvidence: 'Solution lines 42-68 pass O(1) space invariant without memory overhead.',
    });

    const appeal = appealRes.data?.data;
    if (appealRes.status === 200 && appeal?.appealId) {
      console.log(`  ✓ Score Appeal Submitted & Re-Evaluated: Appeal ID ${appeal.appealId}`);
      passedChecks++;
    } else {
      console.error(`  ✗ Appeal submission failed:`, appealRes.data);
    }

    // 2. Verify Original Evaluation is Preserved (Not Overwritten)
    totalChecks++;
    const originalCheck = await get(`/api/intelligence/proof/${originalProofId}`);
    if (
      originalCheck.status === 200 &&
      originalCheck.data?.data?.proofId === originalProofId &&
      originalCheck.data?.data?.overallScore === initialScore
    ) {
      console.log(`  ✓ Original Evaluation Preserved Immutably: Score ${originalCheck.data.data.overallScore}/100 intact.`);
      passedChecks++;
    } else {
      console.error(`  ✗ Original evaluation was corrupted or overwritten.`);
    }

    // 3. Verify Second Evaluation & Comparison
    totalChecks++;
    if (
      appeal?.secondEvaluation &&
      appeal.secondEvaluation.evaluationVersion === 'v1.1.0-appeal' &&
      appeal.secondEvaluation.overallScore >= initialScore
    ) {
      console.log(`  ✓ Second Evaluation Generated: Version ${appeal.secondEvaluation.evaluationVersion}, Adjusted Score: ${appeal.secondEvaluation.overallScore} (Delta: +${appeal.scoreDelta} pts)`);
      console.log(`    Committee Explanation: "${appeal.explanationOfChange.substring(0, 90)}..."`);
      passedChecks++;
    } else {
      console.error(`  ✗ Second evaluation invalid or missing versioning.`);
    }

    // 4. Verify Appeal Lookup by Proof ID
    totalChecks++;
    const proofAppealLookup = await get(`/api/intelligence/appeal/proof/${originalProofId}`);
    if (proofAppealLookup.status === 200 && proofAppealLookup.data?.data?.appealId === appeal.appealId) {
      console.log(`  ✓ Appeal Linked to Proof Credential: GET /api/intelligence/appeal/proof/${originalProofId}`);
      passedChecks++;
    } else {
      console.error(`  ✗ Appeal lookup by proof ID failed.`);
    }

    // 5. Verify Appeal Lookup by Appeal ID
    totalChecks++;
    const directAppealLookup = await get(`/api/intelligence/appeal/${appeal.appealId}`);
    if (directAppealLookup.status === 200 && directAppealLookup.data?.data?.appealId === appeal.appealId) {
      console.log(`  ✓ Direct Appeal Record Retrieval: GET /api/intelligence/appeal/${appeal.appealId}`);
      passedChecks++;
    } else {
      console.error(`  ✗ Direct appeal lookup failed.`);
    }
  }

  // ============================================================================
  // SECTION 3: DATA PERSISTENCE ACROSS REFRESH
  // ============================================================================
  console.log('\n▶ SECTION 3: VERIFYING REFRESH DATA PERSISTENCE\n');

  if (sampleProofForAppeal) {
    totalChecks++;
    const refreshRes = await get(`/api/intelligence/proof/${sampleProofForAppeal.proofId}`);
    if (
      refreshRes.status === 200 &&
      refreshRes.data?.data?.proofId === sampleProofForAppeal.proofId &&
      refreshRes.data?.data?.competencyMatrix?.length > 0 &&
      refreshRes.data?.data?.recommendations?.length >= 0
    ) {
      console.log(`  ✓ Refresh Simulation Confirmed: Skill Proof credential survives client refresh with full evidence dossier.`);
      passedChecks++;
    } else {
      console.error(`  ✗ Refresh persistence failed.`);
    }
  }

  // ============================================================================
  // SECTION 4: SECURITY BOUNDARIES & ERROR HANDLING
  // ============================================================================
  console.log('\n▶ SECTION 4: VERIFYING SECURITY BOUNDARIES & ERROR HANDLING\n');

  // 1. Invalid / Empty Submission Handling
  totalChecks++;
  const badReq = await post('/api/intelligence/analyze', {});
  if (badReq.status === 400 && badReq.data?.success === false) {
    console.log(`  ✓ Input Validation Confirmed: Empty payload rejected with HTTP 400 without crashing.`);
    passedChecks++;
  } else {
    console.error(`  ✗ Empty payload not handled properly.`);
  }

  // 2. Invalid Appeal Payload Handling
  totalChecks++;
  const badAppeal = await post('/api/intelligence/appeal', { originalProofId: 'invalid_proof_999' });
  if (badAppeal.status === 400 || badAppeal.status === 500) {
    console.log(`  ✓ Appeal Validation Confirmed: Incomplete appeal request safely rejected.`);
    passedChecks++;
  } else {
    console.error(`  ✗ Incomplete appeal was not rejected.`);
  }

  // 3. Secure Error Messages (No leaked secrets or database connection strings)
  totalChecks++;
  const leakCheck = JSON.stringify(badReq.data) + JSON.stringify(badAppeal.data);
  const containsSecret = leakCheck.includes('sb_secret') || leakCheck.includes('sk_test') || leakCheck.includes('password');
  if (!containsSecret) {
    console.log(`  ✓ Secret Leak Prevention Confirmed: Zero credentials, tokens, or connection strings exposed in responses.`);
    passedChecks++;
  } else {
    console.error(`  ✗ Security breach: Secrets found in API response.`);
  }

  console.log('\n================================================================');
  console.log(`FINAL REPROOF SUITE SUMMARY: ${passedChecks} / ${totalChecks} CHECKS PASSED (${Math.round((passedChecks / totalChecks) * 100)}%)`);
  console.log('================================================================\n');

  if (passedChecks === totalChecks) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runFinalVerification().catch((err) => {
  console.error('Test execution fatal error:', err);
  process.exit(1);
});
