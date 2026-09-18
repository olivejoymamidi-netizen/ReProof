require('dotenv').config({ path: 'c:/Users/Joy/OneDrive/Desktop/hackcrew/backend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseSecretKey);

const domains = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'AI / ML',
    description: 'Machine learning pipelines, data preprocessing algorithms, and statistical model evaluation.',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Cybersecurity',
    description: 'Network protocol analysis, secure communication primitives, web defense, and cryptography.',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Data Science',
    description: 'Statistical inference, analytical SQL modeling, data wrangling, and visual synthesis.',
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    name: 'DSA',
    description: 'Data structures, algorithmic complexity, tree/graph traversal, and dynamic programming optimization.',
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    name: 'Web Development',
    description: 'Modern component architecture, client/server protocols, reactive state, and REST API design.',
  },
];

const skills = [
  // AI / ML
  {
    id: '00000000-0000-0000-0001-000000000001',
    course_id: '00000000-0000-0000-0000-000000000001',
    name: 'Python for ML',
    description: 'Vectorized data manipulation with NumPy, array broadcasting, and memory-efficient matrix computation.',
  },
  {
    id: '00000000-0000-0000-0001-000000000002',
    course_id: '00000000-0000-0000-0000-000000000001',
    name: 'Data Preprocessing',
    description: 'Handling missing data, categorical encoding, feature scaling, and feature transformation pipelines.',
  },
  {
    id: '00000000-0000-0000-0001-000000000003',
    course_id: '00000000-0000-0000-0000-000000000001',
    name: 'Machine Learning',
    description: 'Supervised and unsupervised learning, loss functions, overfitting mitigation, and model validation.',
  },

  // Cybersecurity
  {
    id: '00000000-0000-0000-0002-000000000001',
    course_id: '00000000-0000-0000-0000-000000000002',
    name: 'Networking Fundamentals',
    description: 'TCP/IP stack, socket behavior, routing mechanics, packet inspection, and protocol vulnerabilities.',
  },
  {
    id: '00000000-0000-0000-0002-000000000002',
    course_id: '00000000-0000-0000-0000-000000000002',
    name: 'Web Security',
    description: 'OWASP Top 10 vulnerabilities, CSRF mitigation, XSS prevention, and secure header enforcement.',
  },
  {
    id: '00000000-0000-0000-0002-000000000003',
    course_id: '00000000-0000-0000-0000-000000000002',
    name: 'Cryptography',
    description: 'Symmetric and asymmetric encryption, cryptographic hashing, digital signatures, and key exchange.',
  },

  // Data Science
  {
    id: '00000000-0000-0000-0003-000000000001',
    course_id: '00000000-0000-0000-0000-000000000003',
    name: 'Python & SQL',
    description: 'Complex relational queries, CTEs, window functions, and Pandas query acceleration.',
  },
  {
    id: '00000000-0000-0000-0003-000000000002',
    course_id: '00000000-0000-0000-0000-000000000003',
    name: 'Statistics',
    description: 'Probability distributions, hypothesis testing, p-values, confidence intervals, and variance analysis.',
  },
  {
    id: '00000000-0000-0000-0003-000000000003',
    course_id: '00000000-0000-0000-0000-000000000003',
    name: 'Data Analysis & Visualization',
    description: 'Exploratory data analysis, multi-dimensional charting, distribution plots, and dashboard insight delivery.',
  },

  // DSA
  {
    id: '00000000-0000-0000-0004-000000000001',
    course_id: '00000000-0000-0000-0000-000000000004',
    name: 'Arrays & Strings',
    description: 'Two-pointer techniques, sliding window patterns, prefix sums, and in-place transformations.',
  },
  {
    id: '00000000-0000-0000-0004-000000000002',
    course_id: '00000000-0000-0000-0000-000000000004',
    name: 'Trees & Graphs',
    description: 'Binary search trees, BFS, DFS, shortest path algorithms, topological sort, and union-find.',
  },
  {
    id: '00000000-0000-0000-0004-000000000003',
    course_id: '00000000-0000-0000-0000-000000000004',
    name: 'Dynamic Programming',
    description: 'Overlapping subproblems, memoization, bottom-up tabulation, and state space reduction.',
  },

  // Web Development
  {
    id: '00000000-0000-0000-0005-000000000001',
    course_id: '00000000-0000-0000-0000-000000000005',
    name: 'HTML, CSS & JavaScript',
    description: 'Semantic DOM hierarchy, CSS grid/flexbox layouts, event bubbling, and async JavaScript execution.',
  },
  {
    id: '00000000-0000-0000-0005-000000000002',
    course_id: '00000000-0000-0000-0000-000000000005',
    name: 'React',
    description: 'Component lifecycle, state synchronization, hook composition, custom hooks, and memoization.',
  },
  {
    id: '00000000-0000-0000-0005-000000000003',
    course_id: '00000000-0000-0000-0000-000000000005',
    name: 'Backend & REST APIs',
    description: 'RESTful conventions, request routing, middleware composition, status code rigor, and authentication tokens.',
  },
];

const levels = [
  // AI / ML -> Python for ML
  { id: '00000000-0001-0001-0000-000000000001', skill_id: '00000000-0000-0000-0001-000000000001', level_number: 1, title: 'Level 1: Python ML Foundations', description: 'Array slicing, shape manipulation, and basic mathematical operations in NumPy.', difficulty: 'Beginner' },
  { id: '00000000-0001-0001-0000-000000000002', skill_id: '00000000-0000-0000-0001-000000000001', level_number: 2, title: 'Level 2: Vectorized Computation', description: 'Broadcasting rules, multidimensional matrix multiplication, and linear algebra routines.', difficulty: 'Intermediate' },
  { id: '00000000-0001-0001-0000-000000000003', skill_id: '00000000-0000-0000-0001-000000000001', level_number: 3, title: 'Level 3: High-Performance Memory Pipelines', description: 'In-place array mutations, memory-mapped tensors, and vectorized custom loss calculations.', difficulty: 'Advanced' },

  // AI / ML -> Data Preprocessing
  { id: '00000000-0001-0002-0000-000000000001', skill_id: '00000000-0000-0000-0001-000000000002', level_number: 1, title: 'Level 1: Missing Data & Imputation', description: 'Detecting null indicators, mean/median imputation, and record filtering.', difficulty: 'Beginner' },
  { id: '00000000-0001-0002-0000-000000000002', skill_id: '00000000-0000-0000-0001-000000000002', level_number: 2, title: 'Level 2: Feature Encoding & Scaling', description: 'StandardScaler, MinMax normalization, one-hot encoding, and target leak prevention.', difficulty: 'Intermediate' },
  { id: '00000000-0001-0002-0000-000000000003', skill_id: '00000000-0000-0000-0001-000000000002', level_number: 3, title: 'Level 3: End-to-End Pipeline Engineering', description: 'Automated scikit-learn transformers, column transformers, and out-of-distribution drift checks.', difficulty: 'Advanced' },

  // AI / ML -> Machine Learning
  { id: '00000000-0001-0003-0000-000000000001', skill_id: '00000000-0000-0000-0001-000000000003', level_number: 1, title: 'Level 1: Supervised Regression & Classification', description: 'Linear regression, logistic regression, and train/test cross-validation splits.', difficulty: 'Beginner' },
  { id: '00000000-0001-0003-0000-000000000002', skill_id: '00000000-0000-0000-0001-000000000003', level_number: 2, title: 'Level 2: Ensemble Models & Metric Tuning', description: 'Random forests, gradient boosting, ROC-AUC, precision-recall optimization.', difficulty: 'Intermediate' },
  { id: '00000000-0001-0003-0000-000000000003', skill_id: '00000000-0000-0000-0001-000000000003', level_number: 3, title: 'Level 3: Model Diagnostics & Regularization', description: 'L1/L2 hyperparameter search, error decomposition, and calibration under class imbalance.', difficulty: 'Advanced' },

  // Cybersecurity -> Networking Fundamentals
  { id: '00000000-0002-0001-0000-000000000001', skill_id: '00000000-0000-0000-0002-000000000001', level_number: 1, title: 'Level 1: Protocol Inspections & Subnets', description: 'IP addressing, subnet masks, CIDR notation, and standard port allocations.', difficulty: 'Beginner' },
  { id: '00000000-0002-0001-0000-000000000002', skill_id: '00000000-0000-0000-0002-000000000001', level_number: 2, title: 'Level 2: TCP Handshakes & Packet Parsing', description: 'SYN/ACK handshakes, sequence numbers, Wireshark packet analysis, and DNS queries.', difficulty: 'Intermediate' },
  { id: '00000000-0002-0001-0000-000000000003', skill_id: '00000000-0000-0000-0002-000000000001', level_number: 3, title: 'Level 3: Socket Hardening & Traffic Defense', description: 'SYN flood mitigation, raw socket analysis, firewall rule validation, and TLS inspection.', difficulty: 'Advanced' },

  // Cybersecurity -> Web Security
  { id: '00000000-0002-0002-0000-000000000001', skill_id: '00000000-0000-0000-0002-000000000002', level_number: 1, title: 'Level 1: Injection Surface Identification', description: 'Locating unsanitized inputs, basic SQLi payloads, and reflected script injections.', difficulty: 'Beginner' },
  { id: '00000000-0002-0002-0000-000000000002', skill_id: '00000000-0000-0000-0002-000000000002', level_number: 2, title: 'Level 2: Auth Protection & CSRF Defense', description: 'SameSite cookies, CSRF token validation, session fixation protection, and CSP headers.', difficulty: 'Intermediate' },
  { id: '00000000-0002-0002-0000-000000000003', skill_id: '00000000-0000-0000-0002-000000000002', level_number: 3, title: 'Level 3: Advanced Exploit Neutralization', description: 'SSRF remediation, blind injection defensive coding, and zero-trust perimeter auditing.', difficulty: 'Advanced' },

  // Cybersecurity -> Cryptography
  { id: '00000000-0002-0003-0000-000000000001', skill_id: '00000000-0000-0000-0002-000000000003', level_number: 1, title: 'Level 1: Hashing & Checksums', description: 'SHA-256 integrity checks, salt generation, and dictionary attack prevention.', difficulty: 'Beginner' },
  { id: '00000000-0002-0003-0000-000000000002', skill_id: '00000000-0000-0000-0002-000000000003', level_number: 2, title: 'Level 2: Symmetric Cipher Operations', description: 'AES-GCM authenticated encryption, initialization vectors, and key derivation with PBKDF2.', difficulty: 'Intermediate' },
  { id: '00000000-0002-0003-0000-000000000003', skill_id: '00000000-0000-0000-0002-000000000003', level_number: 3, title: 'Level 3: Asymmetric Key Exchange & Signatures', description: 'RSA/ECDSA signature verification, Diffie-Hellman ephemeral exchange, and PKI trust validation.', difficulty: 'Advanced' },

  // Data Science -> Python & SQL
  { id: '00000000-0003-0001-0000-000000000001', skill_id: '00000000-0000-0000-0003-000000000001', level_number: 1, title: 'Level 1: Relational Joins & Grouping', description: 'INNER/LEFT JOIN operations, GROUP BY aggregations, and filtering with HAVING clauses.', difficulty: 'Beginner' },
  { id: '00000000-0003-0001-0000-000000000002', skill_id: '00000000-0000-0000-0003-000000000001', level_number: 2, title: 'Level 2: Analytical Window Functions', description: 'ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, and cumulative rolling aggregates.', difficulty: 'Intermediate' },
  { id: '00000000-0003-0001-0000-000000000003', skill_id: '00000000-0000-0000-0003-000000000001', level_number: 3, title: 'Level 3: Optimized ETL Pipelines', description: 'Recursive CTEs, execution plan index profiling, and high-throughput Pandas database connectors.', difficulty: 'Advanced' },

  // Data Science -> Statistics
  { id: '00000000-0003-0002-0000-000000000001', skill_id: '00000000-0000-0000-0003-000000000002', level_number: 1, title: 'Level 1: Descriptive Summaries', description: 'Mean, median, mode, standard deviation, interquartile ranges, and skewness.', difficulty: 'Beginner' },
  { id: '00000000-0003-0002-0000-000000000002', skill_id: '00000000-0000-0000-0003-000000000002', level_number: 2, title: 'Level 2: Inferential Hypothesis Testing', description: 'Student t-tests, ANOVA, Chi-square independence tests, and p-value significance bounds.', difficulty: 'Intermediate' },
  { id: '00000000-0003-0002-0000-000000000003', skill_id: '00000000-0000-0000-0003-000000000002', level_number: 3, title: 'Level 3: Bayesian Modeling & Resampling', description: 'Bootstrapping confidence intervals, Bayesian parameter updating, and Monte Carlo estimation.', difficulty: 'Advanced' },

  // Data Science -> Data Analysis & Visualization
  { id: '00000000-0003-0003-0000-000000000001', skill_id: '00000000-0000-0000-0003-000000000003', level_number: 1, title: 'Level 1: Exploratory Charting', description: 'Histograms, scatter plots, box plots, and clean figure labels using Matplotlib/Seaborn.', difficulty: 'Beginner' },
  { id: '00000000-0003-0003-0000-000000000002', skill_id: '00000000-0000-0000-0003-000000000003', level_number: 2, title: 'Level 2: Multi-Variable Visual Synthesis', description: 'Heatmaps, facet grids, correlation matrices, and density distributions.', difficulty: 'Intermediate' },
  { id: '00000000-0003-0003-0000-000000000003', skill_id: '00000000-0000-0000-0003-000000000003', level_number: 3, title: 'Level 3: Interactive Analytical Storytelling', description: 'Statistical dashboard design, anomaly highlighting, and executive insight communication.', difficulty: 'Advanced' },

  // DSA -> Arrays & Strings
  { id: '00000000-0004-0001-0000-000000000001', skill_id: '00000000-0000-0000-0004-000000000001', level_number: 1, title: 'Level 1: Iteration & In-Place Traversal', description: 'Linear search, prefix checks, string reversal, and palindrome verification in O(1) space.', difficulty: 'Beginner' },
  { id: '00000000-0004-0001-0000-000000000002', skill_id: '00000000-0000-0000-0004-000000000001', level_number: 2, title: 'Level 2: Sliding Window & Two Pointers', description: 'Subarray sum targets, longest substring without duplicates, and container with most water.', difficulty: 'Intermediate' },
  { id: '00000000-0004-0001-0000-000000000003', skill_id: '00000000-0000-0000-0004-000000000001', level_number: 3, title: 'Level 3: Multi-Index & Prefix Hashing', description: 'Minimum window substring, Dutch national flag partitioning, and string rolling hash matching.', difficulty: 'Advanced' },

  // DSA -> Trees & Graphs
  { id: '00000000-0004-0002-0000-000000000001', skill_id: '00000000-0000-0000-0004-000000000002', level_number: 1, title: 'Level 1: Binary Tree Traversals', description: 'Pre-order, in-order, post-order recursive traversals, and maximum depth calculations.', difficulty: 'Beginner' },
  { id: '00000000-0004-0002-0000-000000000002', skill_id: '00000000-0000-0000-0004-000000000002', level_number: 2, title: 'Level 2: BFS, DFS & Graph Connectivity', description: 'Level-order traversal, cycle detection in directed graphs, and connected components.', difficulty: 'Intermediate' },
  { id: '00000000-0004-0002-0000-000000000003', skill_id: '00000000-0000-0000-0004-000000000002', level_number: 3, title: 'Level 3: Shortest Path & Flow Optimization', description: 'Dijkstra shortest path, topological sorting, Disjoint Set Union (DSU), and minimum spanning trees.', difficulty: 'Advanced' },

  // DSA -> Dynamic Programming
  { id: '00000000-0004-0003-0000-000000000001', skill_id: '00000000-0000-0000-0004-000000000003', level_number: 1, title: 'Level 1: 1D Linear State Transitions', description: 'Fibonacci sequence memoization, climbing stairs, and house robber recurrence relations.', difficulty: 'Beginner' },
  { id: '00000000-0004-0003-0000-000000000002', skill_id: '00000000-0000-0000-0004-000000000003', level_number: 2, title: 'Level 2: 2D Grid & Subsequence States', description: '0/1 Knapsack problem, longest common subsequence, and coin change combinations.', difficulty: 'Intermediate' },
  { id: '00000000-0004-0003-0000-000000000003', skill_id: '00000000-0000-0000-0004-000000000003', level_number: 3, title: 'Level 3: Interval & Bitmask DP', description: 'Matrix chain multiplication, edit distance optimization, and traveling salesperson state compression.', difficulty: 'Advanced' },

  // Web Development -> HTML, CSS & JavaScript
  { id: '00000000-0005-0001-0000-000000000001', skill_id: '00000000-0000-0000-0005-000000000001', level_number: 1, title: 'Level 1: Semantic Markup & Box Model', description: 'Accessible HTML5 semantics, CSS box model geometry, and basic DOM query manipulation.', difficulty: 'Beginner' },
  { id: '00000000-0005-0001-0000-000000000002', skill_id: '00000000-0000-0000-0005-000000000001', level_number: 2, title: 'Level 2: Responsive Flex/Grid & Async DOM', description: 'Complex CSS Grid alignment, event delegation, Promise chaining, and fetch API consumption.', difficulty: 'Intermediate' },
  { id: '00000000-0005-0001-0000-000000000003', skill_id: '00000000-0000-0000-0005-000000000001', level_number: 3, title: 'Level 3: Web Performance & Event Loop Mastery', description: 'Microtasks vs macrotasks, layout thrashing mitigation, repaint budgeting, and Web Workers.', difficulty: 'Advanced' },

  // Web Development -> React
  { id: '00000000-0005-0002-0000-000000000001', skill_id: '00000000-0000-0000-0005-000000000002', level_number: 1, title: 'Level 1: Component Props & State', description: 'JSX syntax, useState, component decomposition, and controlled form inputs.', difficulty: 'Beginner' },
  { id: '00000000-0005-0002-0000-000000000002', skill_id: '00000000-0000-0000-0005-000000000002', level_number: 2, title: 'Level 2: Effects, Context & Custom Hooks', description: 'useEffect cleanup, global state with useContext, custom hook abstraction, and error boundaries.', difficulty: 'Intermediate' },
  { id: '00000000-0005-0002-0000-000000000003', skill_id: '00000000-0000-0000-0005-000000000002', level_number: 3, title: 'Level 3: Render Optimization & Concurrency', description: 'useMemo/useCallback boundaries, React Compiler compatibility, suspense, and virtualized lists.', difficulty: 'Advanced' },

  // Web Development -> Backend & REST APIs
  { id: '00000000-0005-0003-0000-000000000001', skill_id: '00000000-0000-0000-0005-000000000003', level_number: 1, title: 'Level 1: Express Routing & Request Handling', description: 'GET/POST endpoint routing, body parsing, request param extraction, and status codes.', difficulty: 'Beginner' },
  { id: '00000000-0005-0003-0000-000000000002', skill_id: '00000000-0000-0000-0005-000000000003', level_number: 2, title: 'Level 2: Middleware & Token Verification', description: 'Custom middleware chaining, Bearer JWT validation, CORS preflight handling, and centralized errors.', difficulty: 'Intermediate' },
  { id: '00000000-0005-0003-0000-000000000003', skill_id: '00000000-0000-0000-0005-000000000003', level_number: 3, title: 'Level 3: Scalable Architecture & Resilience', description: 'Rate limiting, idempotent mutation handling, transactional consistency, and graceful shutdown.', difficulty: 'Advanced' },
];

async function sync() {
  console.log('--- Syncing Curriculum into Supabase ---');

  // 1. Upsert Courses (Domains)
  for (const d of domains) {
    const { error } = await supabase
      .from('courses')
      .upsert(d, { onConflict: 'id' });
    if (error) {
      console.error(`Error upserting course "${d.name}":`, error.message);
    } else {
      console.log(`[OK] Domain: ${d.name}`);
    }
  }

  // 2. Upsert Skills
  for (const s of skills) {
    const { error } = await supabase
      .from('skills')
      .upsert(s, { onConflict: 'id' });
    if (error) {
      console.error(`Error upserting skill "${s.name}":`, error.message);
    } else {
      console.log(`[OK] Skill: ${s.name}`);
    }
  }

  // 3. Upsert Skill Levels
  for (const lvl of levels) {
    const { error } = await supabase
      .from('skill_levels')
      .upsert(
        {
          skill_id: lvl.skill_id,
          level_number: lvl.level_number,
          title: lvl.title,
          description: lvl.description,
          difficulty: lvl.difficulty,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'skill_id,level_number' }
      );
    if (error) {
      console.error(`Error upserting level "${lvl.title}":`, error.message);
    }
  }
  console.log(`[OK] Upserted ${levels.length} skill levels.`);

  // Verify counts
  const [cRes, sRes, lRes] = await Promise.all([
    supabase.from('courses').select('id', { count: 'exact' }),
    supabase.from('skills').select('id', { count: 'exact' }),
    supabase.from('skill_levels').select('id', { count: 'exact' }),
  ]);

  console.log('\n--- Curriculum Database Verification ---');
  console.log('Total Courses / Domains in DB:', cRes.count);
  console.log('Total Skills in DB:', sRes.count);
  console.log('Total Skill Levels in DB:', lRes.count);
}

sync().catch(console.error);
