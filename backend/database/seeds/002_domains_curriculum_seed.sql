-- =============================================================
-- ReProof — 5 Domains, 15 Skills, 45 Competency Levels Seed
-- File: 002_domains_curriculum_seed.sql
-- =============================================================
-- Idempotent seed for the ReProof core curriculum hierarchy:
-- Domain (courses) -> Skill (skills) -> Level (skill_levels)
-- =============================================================

-- -------------------------------------------------------------
-- 1. DOMAINS (inserted into courses table)
-- -------------------------------------------------------------
INSERT INTO courses (id, name, description)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'AI / ML',
    'Machine learning pipelines, data preprocessing algorithms, and statistical model evaluation.'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Cybersecurity',
    'Network protocol analysis, secure communication primitives, web defense, and cryptography.'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Data Science',
    'Statistical inference, analytical SQL modeling, data wrangling, and visual synthesis.'
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'DSA',
    'Data structures, algorithmic complexity, tree/graph traversal, and dynamic programming optimization.'
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    'Web Development',
    'Modern component architecture, client/server protocols, reactive state, and REST API design.'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

-- -------------------------------------------------------------
-- 2. SKILLS (15 Skills: 3 per domain)
-- -------------------------------------------------------------
INSERT INTO skills (id, course_id, name, description)
VALUES
  -- AI / ML Skills (Course 01)
  (
    '00000000-0000-0000-0001-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Python for ML',
    'Vectorized data manipulation with NumPy, array broadcasting, and memory-efficient matrix computation.'
  ),
  (
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Data Preprocessing',
    'Handling missing data, categorical encoding, feature scaling, and feature transformation pipelines.'
  ),
  (
    '00000000-0000-0000-0001-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Machine Learning',
    'Supervised and unsupervised learning, loss functions, overfitting mitigation, and model validation.'
  ),

  -- Cybersecurity Skills (Course 02)
  (
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0000-000000000002',
    'Networking Fundamentals',
    'TCP/IP stack, socket behavior, routing mechanics, packet inspection, and protocol vulnerabilities.'
  ),
  (
    '00000000-0000-0000-0002-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'Web Security',
    'OWASP Top 10 vulnerabilities, CSRF mitigation, XSS prevention, and secure header enforcement.'
  ),
  (
    '00000000-0000-0000-0002-000000000003',
    '00000000-0000-0000-0000-000000000002',
    'Cryptography',
    'Symmetric and asymmetric encryption, cryptographic hashing, digital signatures, and key exchange.'
  ),

  -- Data Science Skills (Course 03)
  (
    '00000000-0000-0000-0003-000000000001',
    '00000000-0000-0000-0000-000000000003',
    'Python & SQL',
    'Complex relational queries, CTEs, window functions, and Pandas query acceleration.'
  ),
  (
    '00000000-0000-0000-0003-000000000002',
    '00000000-0000-0000-0000-000000000003',
    'Statistics',
    'Probability distributions, hypothesis testing, p-values, confidence intervals, and variance analysis.'
  ),
  (
    '00000000-0000-0000-0003-000000000003',
    '00000000-0000-0000-0000-000000000003',
    'Data Analysis & Visualization',
    'Exploratory data analysis, multi-dimensional charting, distribution plots, and dashboard insight delivery.'
  ),

  -- DSA Skills (Course 04)
  (
    '00000000-0000-0000-0004-000000000001',
    '00000000-0000-0000-0000-000000000004',
    'Arrays & Strings',
    'Two-pointer techniques, sliding window patterns, prefix sums, and in-place transformations.'
  ),
  (
    '00000000-0000-0000-0004-000000000002',
    '00000000-0000-0000-0000-000000000004',
    'Trees & Graphs',
    'Binary search trees, BFS, DFS, shortest path algorithms, topological sort, and union-find.'
  ),
  (
    '00000000-0000-0000-0004-000000000003',
    '00000000-0000-0000-0000-000000000004',
    'Dynamic Programming',
    'Overlapping subproblems, memoization, bottom-up tabulation, and state space reduction.'
  ),

  -- Web Development Skills (Course 05)
  (
    '00000000-0000-0000-0005-000000000001',
    '00000000-0000-0000-0000-000000000005',
    'HTML, CSS & JavaScript',
    'Semantic DOM hierarchy, CSS grid/flexbox layouts, event bubbling, and async JavaScript execution.'
  ),
  (
    '00000000-0000-0000-0005-000000000002',
    '00000000-0000-0000-0000-000000000005',
    'React',
    'Component lifecycle, state synchronization, hook composition, custom hooks, and memoization.'
  ),
  (
    '00000000-0000-0000-0005-000000000003',
    '00000000-0000-0000-0000-000000000005',
    'Backend & REST APIs',
    'RESTful conventions, request routing, middleware composition, status code rigor, and authentication tokens.'
  )
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

-- -------------------------------------------------------------
-- 3. SKILL LEVELS (45 Levels: 3 levels for each of the 15 skills)
-- -------------------------------------------------------------
-- AI / ML -> Python for ML
INSERT INTO skill_levels (id, skill_id, level_number, title, description, difficulty)
VALUES
  ('00000000-0001-0001-0000-000000000001', '00000000-0000-0000-0001-000000000001', 1, 'Level 1: Python ML Foundations', 'Array slicing, shape manipulation, and basic mathematical operations in NumPy.', 'Beginner'),
  ('00000000-0001-0001-0000-000000000002', '00000000-0000-0000-0001-000000000001', 2, 'Level 2: Vectorized Computation', 'Broadcasting rules, multidimensional matrix multiplication, and linear algebra routines.', 'Intermediate'),
  ('00000000-0001-0001-0000-000000000003', '00000000-0000-0000-0001-000000000001', 3, 'Level 3: High-Performance Memory Pipelines', 'In-place array mutations, memory-mapped tensors, and vectorized custom loss calculations.', 'Advanced'),

-- AI / ML -> Data Preprocessing
  ('00000000-0001-0002-0000-000000000001', '00000000-0000-0000-0001-000000000002', 1, 'Level 1: Missing Data & Imputation', 'Detecting null indicators, mean/median imputation, and record filtering.', 'Beginner'),
  ('00000000-0001-0002-0000-000000000002', '00000000-0000-0000-0001-000000000002', 2, 'Level 2: Feature Encoding & Scaling', 'StandardScaler, MinMax normalization, one-hot encoding, and target leak prevention.', 'Intermediate'),
  ('00000000-0001-0002-0000-000000000003', '00000000-0000-0000-0001-000000000002', 3, 'Level 3: End-to-End Pipeline Engineering', 'Automated scikit-learn transformers, column transformers, and out-of-distribution drift checks.', 'Advanced'),

-- AI / ML -> Machine Learning
  ('00000000-0001-0003-0000-000000000001', '00000000-0000-0000-0001-000000000003', 1, 'Level 1: Supervised Regression & Classification', 'Linear regression, logistic regression, and train/test cross-validation splits.', 'Beginner'),
  ('00000000-0001-0003-0000-000000000002', '00000000-0000-0000-0001-000000000003', 2, 'Level 2: Ensemble Models & Metric Tuning', 'Random forests, gradient boosting, ROC-AUC, precision-recall optimization.', 'Intermediate'),
  ('00000000-0001-0003-0000-000000000003', '00000000-0000-0000-0001-000000000003', 3, 'Level 3: Model Diagnostics & Regularization', 'L1/L2 hyperparameter search, error decomposition, and calibration under class imbalance.', 'Advanced'),

-- Cybersecurity -> Networking Fundamentals
  ('00000000-0002-0001-0000-000000000001', '00000000-0000-0000-0002-000000000001', 1, 'Level 1: Protocol Inspections & Subnets', 'IP addressing, subnet masks, CIDR notation, and standard port allocations.', 'Beginner'),
  ('00000000-0002-0001-0000-000000000002', '00000000-0000-0000-0002-000000000001', 2, 'Level 2: TCP Handshakes & Packet Parsing', 'SYN/ACK handshakes, sequence numbers, Wireshark packet analysis, and DNS queries.', 'Intermediate'),
  ('00000000-0002-0001-0000-000000000003', '00000000-0000-0000-0002-000000000001', 3, 'Level 3: Socket Hardening & Traffic Defense', 'SYN flood mitigation, raw socket analysis, firewall rule validation, and TLS inspection.', 'Advanced'),

-- Cybersecurity -> Web Security
  ('00000000-0002-0002-0000-000000000001', '00000000-0000-0000-0002-000000000002', 1, 'Level 1: Injection Surface Identification', 'Locating unsanitized inputs, basic SQLi payloads, and reflected script injections.', 'Beginner'),
  ('00000000-0002-0002-0000-000000000002', '00000000-0000-0000-0002-000000000002', 2, 'Level 2: Auth Protection & CSRF Defense', 'SameSite cookies, CSRF token validation, session fixation protection, and CSP headers.', 'Intermediate'),
  ('00000000-0002-0002-0000-000000000003', '00000000-0000-0000-0002-000000000002', 3, 'Level 3: Advanced Exploit Neutralization', 'SSRF remediation, blind injection defensive coding, and zero-trust perimeter auditing.', 'Advanced'),

-- Cybersecurity -> Cryptography
  ('00000000-0002-0003-0000-000000000001', '00000000-0000-0000-0002-000000000003', 1, 'Level 1: Hashing & Checksums', 'SHA-256 integrity checks, salt generation, and dictionary attack prevention.', 'Beginner'),
  ('00000000-0002-0003-0000-000000000002', '00000000-0000-0000-0002-000000000003', 2, 'Level 2: Symmetric Cipher Operations', 'AES-GCM authenticated encryption, initialization vectors, and key derivation with PBKDF2.', 'Intermediate'),
  ('00000000-0002-0003-0000-000000000003', '00000000-0000-0000-0002-000000000003', 3, 'Level 3: Asymmetric Key Exchange & Signatures', 'RSA/ECDSA signature verification, Diffie-Hellman ephemeral exchange, and PKI trust validation.', 'Advanced'),

-- Data Science -> Python & SQL
  ('00000000-0003-0001-0000-000000000001', '00000000-0000-0000-0003-000000000001', 1, 'Level 1: Relational Joins & Grouping', 'INNER/LEFT JOIN operations, GROUP BY aggregations, and filtering with HAVING clauses.', 'Beginner'),
  ('00000000-0003-0001-0000-000000000002', '00000000-0000-0000-0003-000000000001', 2, 'Level 2: Analytical Window Functions', 'ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, and cumulative rolling aggregates.', 'Intermediate'),
  ('00000000-0003-0001-0000-000000000003', '00000000-0000-0000-0003-000000000001', 3, 'Level 3: Optimized ETL Pipelines', 'Recursive CTEs, execution plan index profiling, and high-throughput Pandas database connectors.', 'Advanced'),

-- Data Science -> Statistics
  ('00000000-0003-0002-0000-000000000001', '00000000-0000-0000-0003-000000000002', 1, 'Level 1: Descriptive Summaries', 'Mean, median, mode, standard deviation, interquartile ranges, and skewness.', 'Beginner'),
  ('00000000-0003-0002-0000-000000000002', '00000000-0000-0000-0003-000000000002', 2, 'Level 2: Inferential Hypothesis Testing', 'Student t-tests, ANOVA, Chi-square independence tests, and p-value significance bounds.', 'Intermediate'),
  ('00000000-0003-0002-0000-000000000003', '00000000-0000-0000-0003-000000000002', 3, 'Level 3: Bayesian Modeling & Resampling', 'Bootstrapping confidence intervals, Bayesian parameter updating, and Monte Carlo estimation.', 'Advanced'),

-- Data Science -> Data Analysis & Visualization
  ('00000000-0003-0003-0000-000000000001', '00000000-0000-0000-0003-000000000003', 1, 'Level 1: Exploratory Charting', 'Histograms, scatter plots, box plots, and clean figure labels using Matplotlib/Seaborn.', 'Beginner'),
  ('00000000-0003-0003-0000-000000000002', '00000000-0000-0000-0003-000000000003', 2, 'Level 2: Multi-Variable Visual Synthesis', 'Heatmaps, facet grids, correlation matrices, and density distributions.', 'Intermediate'),
  ('00000000-0003-0003-0000-000000000003', '00000000-0000-0000-0003-000000000003', 3, 'Level 3: Interactive Analytical Storytelling', 'Statistical dashboard design, anomaly highlighting, and executive insight communication.', 'Advanced'),

-- DSA -> Arrays & Strings
  ('00000000-0004-0001-0000-000000000001', '00000000-0000-0000-0004-000000000001', 1, 'Level 1: Iteration & In-Place Traversal', 'Linear search, prefix checks, string reversal, and palindrome verification in O(1) space.', 'Beginner'),
  ('00000000-0004-0001-0000-000000000002', '00000000-0000-0000-0004-000000000001', 2, 'Level 2: Sliding Window & Two Pointers', 'Subarray sum targets, longest substring without duplicates, and container with most water.', 'Intermediate'),
  ('00000000-0004-0001-0000-000000000003', '00000000-0000-0000-0004-000000000001', 3, 'Level 3: Multi-Index & Prefix Hashing', 'Minimum window substring, Dutch national flag partitioning, and string rolling hash matching.', 'Advanced'),

-- DSA -> Trees & Graphs
  ('00000000-0004-0002-0000-000000000001', '00000000-0000-0000-0004-000000000002', 1, 'Level 1: Binary Tree Traversals', 'Pre-order, in-order, post-order recursive traversals, and maximum depth calculations.', 'Beginner'),
  ('00000000-0004-0002-0000-000000000002', '00000000-0000-0000-0004-000000000002', 2, 'Level 2: BFS, DFS & Graph Connectivity', 'Level-order traversal, cycle detection in directed graphs, and connected components.', 'Intermediate'),
  ('00000000-0004-0002-0000-000000000003', '00000000-0000-0000-0004-000000000002', 3, 'Level 3: Shortest Path & Flow Optimization', 'Dijkstra shortest path, topological sorting, Disjoint Set Union (DSU), and minimum spanning trees.', 'Advanced'),

-- DSA -> Dynamic Programming
  ('00000000-0004-0003-0000-000000000001', '00000000-0000-0000-0004-000000000003', 1, 'Level 1: 1D Linear State Transitions', 'Fibonacci sequence memoization, climbing stairs, and house robber recurrence relations.', 'Beginner'),
  ('00000000-0004-0003-0000-000000000002', '00000000-0000-0000-0004-000000000003', 2, 'Level 2: 2D Grid & Subsequence States', '0/1 Knapsack problem, longest common subsequence, and coin change combinations.', 'Intermediate'),
  ('00000000-0004-0003-0000-000000000003', '00000000-0000-0000-0004-000000000003', 3, 'Level 3: Interval & Bitmask DP', 'Matrix chain multiplication, edit distance optimization, and traveling salesperson state compression.', 'Advanced'),

-- Web Development -> HTML, CSS & JavaScript
  ('00000000-0005-0001-0000-000000000001', '00000000-0000-0000-0005-000000000001', 1, 'Level 1: Semantic Markup & Box Model', 'Accessible HTML5 semantics, CSS box model geometry, and basic DOM query manipulation.', 'Beginner'),
  ('00000000-0005-0001-0000-000000000002', '00000000-0000-0000-0005-000000000001', 2, 'Level 2: Responsive Flex/Grid & Async DOM', 'Complex CSS Grid alignment, event delegation, Promise chaining, and fetch API consumption.', 'Intermediate'),
  ('00000000-0005-0001-0000-000000000003', '00000000-0000-0000-0005-000000000001', 3, 'Level 3: Web Performance & Event Loop Mastery', 'Microtasks vs macrotasks, layout thrashing mitigation, repaint budgeting, and Web Workers.', 'Advanced'),

-- Web Development -> React
  ('00000000-0005-0002-0000-000000000001', '00000000-0000-0000-0005-000000000002', 1, 'Level 1: Component Props & State', 'JSX syntax, useState, component decomposition, and controlled form inputs.', 'Beginner'),
  ('00000000-0005-0002-0000-000000000002', '00000000-0000-0000-0005-000000000002', 2, 'Level 2: Effects, Context & Custom Hooks', 'useEffect cleanup, global state with useContext, custom hook abstraction, and error boundaries.', 'Intermediate'),
  ('00000000-0005-0002-0000-000000000003', '00000000-0000-0000-0005-000000000002', 3, 'Level 3: Render Optimization & Concurrency', 'useMemo/useCallback boundaries, React Compiler compatibility, suspense, and virtualized lists.', 'Advanced'),

-- Web Development -> Backend & REST APIs
  ('00000000-0005-0003-0000-000000000001', '00000000-0000-0000-0005-000000000003', 1, 'Level 1: Express Routing & Request Handling', 'GET/POST endpoint routing, body parsing, request param extraction, and status codes.', 'Beginner'),
  ('00000000-0005-0003-0000-000000000002', '00000000-0000-0000-0005-000000000003', 2, 'Level 2: Middleware & Token Verification', 'Custom middleware chaining, Bearer JWT validation, CORS preflight handling, and centralized errors.', 'Intermediate'),
  ('00000000-0005-0003-0000-000000000003', '00000000-0000-0000-0005-000000000003', 3, 'Level 3: Scalable Architecture & Resilience', 'Rate limiting, idempotent mutation handling, transactional consistency, and graceful shutdown.', 'Advanced')
ON CONFLICT (id) DO UPDATE SET
  skill_id = EXCLUDED.skill_id,
  level_number = EXCLUDED.level_number,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  updated_at = NOW();
