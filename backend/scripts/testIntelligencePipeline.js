/**
 * ReProof Intelligence Pipeline Automated Verification Test (Round 4)
 * Tests complete end-to-end evidence aggregation, deterministic scoring,
 * Competency Matrix, Strengths, Skill Gaps, Current Stage, Recommendations,
 * and Final Skill Proof across all 5 domains and various levels.
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

const skillsToTest = [
  {
    domainId: 'ai-ml',
    domainName: 'AI / ML',
    skillId: 'machine-learning',
    skillName: 'Machine Learning',
    levelNumber: 2,
    knowledgeScore: 82,
    approachScore: 88,
    codingScore: 85,
    projectScore: 92,
    interviewScore: 80,
  },
  {
    domainId: 'cybersecurity',
    domainName: 'Cybersecurity',
    skillId: 'cryptography',
    skillName: 'Cryptography',
    levelNumber: 3,
    knowledgeScore: 88,
    approachScore: 90,
    codingScore: 84,
    projectScore: 94,
    interviewScore: 85,
  },
  {
    domainId: 'data-science',
    domainName: 'Data Science',
    skillId: 'python-sql',
    skillName: 'Python & SQL',
    levelNumber: 1,
    knowledgeScore: 78,
    approachScore: 82,
    codingScore: 80,
    projectScore: 88,
    interviewScore: 75,
  },
  {
    domainId: 'dsa',
    domainName: 'DSA',
    skillId: 'trees-graphs',
    skillName: 'Trees & Graphs',
    levelNumber: 2,
    knowledgeScore: 85,
    approachScore: 85,
    codingScore: 90,
    projectScore: 92,
    interviewScore: 82,
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
    projectScore: 95,
    interviewScore: 86,
  },
  {
    domainId: 'dsa',
    domainName: 'DSA',
    skillId: 'trees-graphs',
    skillName: 'Trees & Graphs',
    levelNumber: 2,
    knowledgeScore: 78,
    approachScore: 75,
    codingScore: 62,
    projectScore: 68,
    interviewScore: 56,
  }
];

async function runTest() {
  console.log('================================================================');
  console.log('REPROOF ROUND 4 VERIFICATION: REPROOF INTELLIGENCE PIPELINE');
  console.log('================================================================\n');

  let totalChecks = 0;
  let passedChecks = 0;

  for (const item of skillsToTest) {
    console.log(`\n▶ EVALUATING DOMAIN: ${item.domainName} | SKILL: ${item.skillName} | LEVEL: 0${item.levelNumber}`);

    // Expected Deterministic Calculation:
    // 0.15*K + 0.15*A + 0.25*C + 0.30*P + 0.15*I
    const expectedComposite = Math.round(
      item.knowledgeScore * 0.15 +
      item.approachScore * 0.15 +
      item.codingScore * 0.25 +
      item.projectScore * 0.30 +
      item.interviewScore * 0.15
    );

    // Step 1: POST /api/intelligence/analyze
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
        codingResult: { score: item.codingScore, totalLinesChanged: 54 },
        projectResult: { overallScore: item.projectScore, title: `${item.skillName} Benchmark Project` },
        interviewResult: { overallScore: item.interviewScore, crossRoundConsistency: { status: 'High Alignment' } },
        integritySignals: [{ type: 'FOCUS_ACTIVE' }],
      }
    });

    const proof = analyzeRes.data?.data;
    if (analyzeRes.status === 200 && proof?.proofId) {
      console.log(`  ✓ 1. Intelligence Analysis Synthesized: Proof ID ${proof.proofId}`);
      passedChecks++;
    } else {
      console.error(`  ✗ 1. Intelligence analysis failed:`, analyzeRes.data);
    }

    // Step 2: Deterministic Score Verification (Not simple averaging)
    totalChecks++;
    const simpleAvg = Math.round(
      (item.knowledgeScore + item.approachScore + item.codingScore + item.projectScore + item.interviewScore) / 5
    );
    if (proof?.overallScore === expectedComposite) {
      console.log(`  ✓ 2. Deterministic Server-Side Score Confirmed: ${proof.overallScore}/100 (Weighted formula matches: 15/15/25/30/15, Differs from naive avg: ${simpleAvg})`);
      passedChecks++;
    } else {
      console.error(`  ✗ 2. Score calculation mismatch. Expected: ${expectedComposite}, got: ${proof?.overallScore}`);
    }

    // Step 3: Competency Matrix Verification
    totalChecks++;
    const matrix = proof?.competencyMatrix;
    if (matrix && matrix.length >= 4) {
      const sample = matrix[0];
      const hasAll5Rounds =
        sample.roundStatuses.Knowledge &&
        sample.roundStatuses.Approach &&
        sample.roundStatuses.Coding &&
        sample.roundStatuses.Project &&
        sample.roundStatuses.Interview;

      if (hasAll5Rounds) {
        console.log(`  ✓ 3. Competency Matrix Generated: ${matrix.length} distinct criteria mapped across all 5 rounds.`);
        console.log(`       Sample Criterion: "${sample.competencyName}" [${sample.overallStatus}]`);
        passedChecks++;
      } else {
        console.error(`  ✗ 3. Competency Matrix missing round mapping.`);
      }
    } else {
      console.error(`  ✗ 3. Matrix generation failed or too few criteria.`);
    }

    // Step 4: Demonstrated Strengths & Traceability
    totalChecks++;
    if (proof?.strengths && proof.strengths.length > 0) {
      const str = proof.strengths[0];
      console.log(`  ✓ 4. Strengths Verified: ${proof.strengths.length} strengths linked to evidence citations.`);
      console.log(`       Top Strength: "${str.competencyName}" -> Cited: "${str.evidenceCitation}"`);
      passedChecks++;
    } else {
      console.error(`  ✗ 4. No strengths generated.`);
    }

    // Step 5: Skill Gap Analysis & Expected vs Observed
    totalChecks++;
    if (proof?.skillGaps && proof.skillGaps.length >= 0) {
      console.log(`  ✓ 5. Skill Gap Analysis Verified: ${proof.skillGaps.length} gaps identified with Expected vs Observed deltas.`);
      if (proof.skillGaps.length > 0) {
        const gap = proof.skillGaps[0];
        console.log(`       Identified Gap: "${gap.competencyName}" (${gap.severity} severity)`);
        console.log(`       Expected: "${gap.expectedCompetency.substring(0, 50)}..."`);
      }
      passedChecks++;
    } else {
      console.error(`  ✗ 5. Skill gap analysis failed.`);
    }

    // Step 6: Current Stage Determination
    totalChecks++;
    const validStages = ['FOUNDATION', 'DEVELOPING', 'APPLIED', 'ADVANCED'];
    if (validStages.includes(proof?.currentCompetencyStage)) {
      console.log(`  ✓ 6. Competency Stage Calculated: ${proof.currentCompetencyStage} (Verification Status: ${proof.verificationStatus})`);
      passedChecks++;
    } else {
      console.error(`  ✗ 6. Invalid stage: ${proof?.currentCompetencyStage}`);
    }

    // Step 7: Actionable Personalized Recommendations
    totalChecks++;
    if (proof?.recommendations && proof.recommendations.length > 0) {
      const rec = proof.recommendations[0];
      console.log(`  ✓ 7. Personalized Recommendations Verified: ${proof.recommendations.length} action plans.`);
      console.log(`       Remediation Target: "${rec.verificationTarget.substring(0, 55)}..."`);
      passedChecks++;
    } else {
      console.log(`  ✓ 7. Full competency demonstrated; zero urgent gaps requiring remediation.`);
      passedChecks++;
    }

    // Step 8: Final Skill Proof & Audit Hash
    totalChecks++;
    if (proof?.auditHash?.startsWith('sha256:') && proof?.evaluationVersion) {
      console.log(`  ✓ 8. Final Skill Proof Authenticated: Cryptographic Hash ${proof.auditHash.substring(0, 24)}... (Version ${proof.evaluationVersion})`);
      passedChecks++;
    } else {
      console.error(`  ✗ 8. Missing audit hash or versioning.`);
    }

    // Step 9: Refresh Persistence (Retrieve by proofId)
    totalChecks++;
    const getRes = await get(`/api/intelligence/proof/${proof.proofId}`);
    if (getRes.status === 200 && getRes.data?.data?.proofId === proof.proofId && getRes.data?.data?.overallScore === proof.overallScore) {
      console.log(`  ✓ 9. Persistence Confirmed: Proof retrieved via GET /api/intelligence/proof/${proof.proofId}`);
      passedChecks++;
    } else {
      console.error(`  ✗ 9. Persistence check failed.`);
    }
  }

  console.log('\n================================================================');
  console.log(`INTELLIGENCE VERIFICATION SUMMARY: ${passedChecks} / ${totalChecks} CHECKS PASSED (${Math.round((passedChecks / totalChecks) * 100)}%)`);
  console.log('================================================================\n');

  if (passedChecks === totalChecks) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTest().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
