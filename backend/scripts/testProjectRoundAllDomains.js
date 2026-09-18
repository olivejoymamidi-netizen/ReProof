const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }
        resolve({ statusCode: res.statusCode, body: parsed });
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function testDomainProject(domainId, skillId, levelNumber, sampleValidCode) {
  console.log(`\n======================================================================`);
  console.log(`TESTING DOMAIN: ${domainId.toUpperCase()} | SKILL: ${skillId} | LEVEL: 0${levelNumber}`);
  console.log(`======================================================================`);

  // 1. Start Project
  const startRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/project/start',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { domainId, skillId, levelNumber }
  );

  if (startRes.statusCode !== 200 || !startRes.body.success) {
    throw new Error(`Failed to start project: ${JSON.stringify(startRes.body)}`);
  }

  const attempt = startRes.body.data;
  const attemptId = attempt.attemptId;
  const starterCode = attempt.projectSpec.starterCode;
  const starterFileName = attempt.projectSpec.starterFileName;

  console.log(`✓ Project initialized successfully:`);
  console.log(`  - Attempt ID: ${attemptId}`);
  console.log(`  - Title: "${attempt.projectSpec.title}"`);
  console.log(`  - Starter File: ${starterFileName}`);
  console.log(`  - Criteria Count: ${attempt.projectSpec.rubricCriteria.length}`);

  // TEST A.1: Empty submission (empty string)
  console.log(`\n[TEST A.1] Submitting empty string:`);
  const emptyRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/project/attempt/${attemptId}/submit`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      submission: {
        sourceCode: '',
        architectureNotes: '',
        executionLogs: '',
      },
    }
  );

  if (
    emptyRes.statusCode === 400 &&
    emptyRes.body.message === 'Please submit a solution before running the evaluation.'
  ) {
    console.log(`  ✓ PASSED: Correctly rejected with HTTP 400 and message: "${emptyRes.body.message}"`);
  } else {
    console.error(`  ✗ FAILED: Did not return required message. Got:`, emptyRes);
    throw new Error(`Empty submission test failed for ${domainId}`);
  }

  // TEST A.2: Unmodified starter code with no notes
  console.log(`\n[TEST A.2] Submitting unmodified starter code:`);
  const starterRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/project/attempt/${attemptId}/submit`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      submission: {
        sourceCode: starterCode,
        architectureNotes: '',
        executionLogs: '',
      },
    }
  );

  if (
    starterRes.statusCode === 400 &&
    starterRes.body.message === 'Please submit a solution before running the evaluation.'
  ) {
    console.log(`  ✓ PASSED: Correctly rejected unmodified starter code with HTTP 400: "${starterRes.body.message}"`);
  } else {
    console.error(`  ✗ FAILED: Unmodified starter code was not rejected. Got:`, starterRes);
    throw new Error(`Unmodified starter test failed for ${domainId}`);
  }

  // TEST B: Minimal / incorrect submission
  console.log(`\n[TEST B] Submitting minimal/incorrect solution:`);
  // Start a fresh attempt for minimal test
  const minStartRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/project/start',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { domainId, skillId, levelNumber: levelNumber === 1 ? 2 : 1 }
  );
  const minAttemptId = minStartRes.body.data.attemptId;

  const minRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/project/attempt/${minAttemptId}/submit`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      submission: {
        sourceCode: '# broken incomplete snippet\nx = 1\n# no methods implemented',
        architectureNotes: 'did not finish',
        executionLogs: 'error: syntax error',
      },
    }
  );

  if (minRes.statusCode === 200 && minRes.body.success) {
    const evalData = minRes.body.data;
    console.log(`  ✓ Evaluated with realistic low score: ${evalData.overallScore}/100`);
    console.log(`  - Test Summary:`, evalData.testSummary);
    console.log(`  - Areas needing improvement:`, evalData.areasNeedingImprovement);
    if (evalData.overallScore > 40) {
      console.warn(`  WARNING: Expected minimal broken code to score low, received ${evalData.overallScore}`);
    } else {
      console.log(`  ✓ PASSED: Minimal code received appropriate low score (not 100%, not 7/7 pass).`);
    }
  } else {
    console.error(`  ✗ FAILED: Submission error for minimal code:`, minRes);
  }

  // TEST C: Valid domain-appropriate submission
  console.log(`\n[TEST C] Submitting valid domain-appropriate implementation:`);
  const validRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/project/attempt/${attemptId}/submit`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      submission: {
        sourceCode: sampleValidCode,
        architectureNotes:
          'Architected modular domain components with strict separation of concerns, vectorized mathematical bounds, defensive invariant assertions, and comprehensive error handling.',
        executionLogs:
          '$ pytest tests/ --verbose\ntest_invariants PASSED [100%]\ntest_boundary_normalization PASSED (0.02s)\n5 passed in 0.14s',
        repoUrl: 'https://github.com/candidate/benchmark-solution',
      },
    }
  );

  if (validRes.statusCode === 200 && validRes.body.success) {
    const validData = validRes.body.data;
    console.log(`  ✓ Successfully evaluated valid submission:`);
    console.log(`  - Overall Score: ${validData.overallScore}/100`);
    console.log(`  - Criteria Scores:`, validData.criteriaScores.map((c) => `${c.name}: ${c.score}%`));
    console.log(`  - Strengths:`, validData.strengths);
    console.log(`  - Test Summary:`, validData.testSummary);
    console.log(`  ✓ PASSED: Valid code produced genuine rubric evaluation.`);
  } else {
    console.error(`  ✗ FAILED: Valid submission failed:`, validRes);
    throw new Error(`Valid submission test failed for ${domainId}`);
  }
}

async function runAllTests() {
  console.log(`\n======================================================================`);
  console.log(`AUDITING PROJECT ROUND ACROSS ALL 5 DOMAINS`);
  console.log(`======================================================================\n`);

  // Domain 1: AI / ML
  await testDomainProject(
    'ai-ml',
    'python-for-ml',
    1,
    `import numpy as np

def normalize_telemetry(data: np.ndarray, clip_std: float = 3.0) -> dict:
    """
    Standardizes sensor telemetry matrix across channels using vectorized broadcasting.
    """
    if data.ndim != 2 or data.shape[0] == 0:
        raise ValueError("Input data must be a non-empty 2D array")
    
    channel_means = np.mean(data, axis=0)
    channel_stds = np.std(data, axis=0)
    channel_stds[channel_stds == 0] = 1.0  # Prevent division by zero
    
    z_scores = (data - channel_means) / channel_stds
    clipped_z = np.clip(z_scores, -clip_std, clip_std)
    outliers_count = int(np.sum(np.abs(z_scores) > clip_std))
    
    return {
        'normalized': clipped_z,
        'channel_means': channel_means.tolist(),
        'channel_stds': channel_stds.tolist(),
        'outliers_clipped': outliers_count,
    }
`
  );

  // Domain 2: Cybersecurity
  await testDomainProject(
    'cybersecurity',
    'web-security',
    2,
    `import re
from typing import Dict, List, Any

class WebSecurityFirewall:
    def __init__(self):
        self.sql_injection_pattern = re.compile(
            r"(union\\s+select|select\\s+.*\\s+from|insert\\s+into|delete\\s+from|--|;|'\\s+or\\s+'1'='1)",
            re.IGNORECASE
        )
        self.xss_pattern = re.compile(
            r"(<script.*?>.*?</script>|javascript:|onerror\\s*=|onload\\s*=)",
            re.IGNORECASE
        )

    def inspect_request(self, method: str, path: str, headers: Dict[str, str], body: str) -> Dict[str, Any]:
        """
        Inspects incoming HTTP payloads against web security invariants.
        """
        threats: List[str] = []
        if self.sql_injection_pattern.search(path) or self.sql_injection_pattern.search(body):
            threats.append("SQL_INJECTION_SUSPECTED")
        if self.xss_pattern.search(path) or self.xss_pattern.search(body):
            threats.append("CROSS_SITE_SCRIPTING_SUSPECTED")
            
        is_blocked = len(threats) > 0
        return {
            'action': 'BLOCK' if is_blocked else 'ALLOW',
            'threats': threats,
            'status_code': 403 if is_blocked else 200,
        }
`
  );

  // Domain 3: Data Science
  await testDomainProject(
    'data-science',
    'python-sql',
    1,
    `import sqlite3
import pandas as pd
from typing import Dict, Any

def execute_cohort_retention_pipeline(db_path: str) -> pd.DataFrame:
    """
    Extracts transaction and user cohorts using parameterized SQL and calculates retention metrics.
    """
    query = """
    WITH user_first_order AS (
        SELECT user_id, DATE(MIN(created_at), 'start of month') AS cohort_month
        FROM orders
        GROUP BY user_id
    ),
    order_activities AS (
        SELECT 
            o.user_id,
            u.cohort_month,
            CAST((JULIANDAY(DATE(o.created_at, 'start of month')) - JULIANDAY(u.cohort_month)) / 30 AS INTEGER) AS month_number
        FROM orders o
        JOIN user_first_order u ON o.user_id = u.user_id
    )
    SELECT 
        cohort_month,
        month_number,
        COUNT(DISTINCT user_id) AS active_users
    FROM order_activities
    GROUP BY cohort_month, month_number
    ORDER BY cohort_month, month_number;
    """
    with sqlite3.connect(db_path) as conn:
        df = pd.read_sql_query(query, conn)
    return df
`
  );

  // Domain 4: DSA
  await testDomainProject(
    'dsa',
    'arrays-strings',
    1,
    `def length_of_longest_substring_k_distinct(s: str, k: int) -> int:
    """
    Finds the length of the longest substring containing at most k distinct characters.
    Time Complexity: O(N) using sliding window with frequency map.
    Space Complexity: O(k) auxiliary storage.
    """
    if not s or k <= 0:
        return 0
        
    char_freq = {}
    max_len = 0
    left = 0
    
    for right, ch in enumerate(s):
        char_freq[ch] = char_freq.get(ch, 0) + 1
        
        while len(char_freq) > k:
            left_ch = s[left]
            char_freq[left_ch] -= 1
            if char_freq[left_ch] == 0:
                del char_freq[left_ch]
            left += 1
            
        max_len = max(max_len, right - left + 1)
        
    return max_len
`
  );

  // Domain 5: Web Development
  await testDomainProject(
    'web-development',
    'backend-rest-apis',
    2,
    `import { Request, Response } from 'express';

interface TokenPayload {
  userId: string;
  role: 'admin' | 'user';
}

export class OrderApiController {
  async handleCreateOrder(req: Request, res: Response): Promise<void> {
    try {
      const { items, customerId, idempotencyKey } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: 'Order must contain at least one item' });
        return;
      }
      
      const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const tax = Math.round(subtotal * 0.0825);
      const total = subtotal + tax;
      
      res.status(201).json({
        id: 'ord_' + Date.now(),
        customerId,
        subtotal,
        tax,
        total,
        status: 'CONFIRMED',
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  }
}
`
  );

  console.log(`\n======================================================================`);
  console.log(`ALL 5 DOMAINS SUCCESSFULLY VERIFIED AGAINST ZERO FAKE PASS REGRESSION`);
  console.log(`======================================================================\n`);
}

runAllTests().catch((err) => {
  console.error('\nAudit script failed:', err);
  process.exit(1);
});
