import type { DomainItem, SkillItem, CompetencyLevelItem } from '../types';

export interface CurriculumAssessmentBrief {
  protocolRef: string;
  domainName: string;
  skillName: string;
  levelNumber: number;
  levelTitle: string;
  difficulty: string;
  title: string;
  synopsis: string;
  estimatedDuration: string;
  isolationMode: string;
  criteria: Array<{
    id: string;
    num: string;
    title: string;
    summary: string;
    verifiableTarget: string;
    badgeLabel: string;
  }>;
}

export const curriculumDomains: DomainItem[] = [
  // 1. AI / ML
  {
    id: 'ai-ml',
    code: '01',
    name: 'AI / ML',
    slug: 'ai-ml',
    description: 'Machine learning pipelines, data preprocessing algorithms, and statistical model evaluation.',
    subtopics: 'NumPy broadcasting, imputation matrices, ensemble algorithms, cross-validation',
    status: 'Ready',
    skills: [
      {
        id: 'python-for-ml',
        domainId: 'ai-ml',
        name: 'Python for ML',
        slug: 'python-for-ml',
        description: 'Vectorized manipulation with NumPy, array broadcasting, and memory-efficient matrix computation.',
        levels: [
          {
            id: '1',
            levelNumber: 1,
            title: 'Level 1: Python ML Foundations',
            description: 'Array slicing, shape manipulation, and fundamental linear algebra operations with NumPy.',
            difficulty: 'Beginner',
          },
          {
            id: '2',
            levelNumber: 2,
            title: 'Level 2: Vectorized Computation',
            description: 'Broadcasting rules, multidimensional matrix multiplication, and performance-tuned linear transformations.',
            difficulty: 'Intermediate',
          },
          {
            id: '3',
            levelNumber: 3,
            title: 'Level 3: High-Performance Memory Pipelines',
            description: 'In-place array mutations, memory-mapped tensors, and vectorized custom loss calculations.',
            difficulty: 'Advanced',
          },
        ],
      },
      {
        id: 'data-preprocessing',
        domainId: 'ai-ml',
        name: 'Data Preprocessing',
        slug: 'data-preprocessing',
        description: 'Handling missing data, categorical encoding, feature scaling, and transformation pipelines.',
        levels: [
          {
            id: '1',
            levelNumber: 1,
            title: 'Level 1: Missing Data & Imputation',
            description: 'Detecting null indicators, statistical mean/median imputation, and outlier record filtering.',
            difficulty: 'Beginner',
          },
          {
            id: '2',
            levelNumber: 2,
            title: 'Level 2: Feature Encoding & Scaling',
            description: 'StandardScaler, MinMax normalization, one-hot encoding, and target-leak prevention.',
            difficulty: 'Intermediate',
          },
          {
            id: '3',
            levelNumber: 3,
            title: 'Level 3: End-to-End Pipeline Engineering',
            description: 'Automated scikit-learn transformers, column transformers, and out-of-distribution drift checks.',
            difficulty: 'Advanced',
          },
        ],
      },
      {
        id: 'machine-learning',
        domainId: 'ai-ml',
        name: 'Machine Learning',
        slug: 'machine-learning',
        description: 'Supervised and unsupervised learning, loss functions, overfitting mitigation, and model validation.',
        levels: [
          {
            id: '1',
            levelNumber: 1,
            title: 'Level 1: Supervised Regression & Classification',
            description: 'Linear regression, logistic regression, and train/test cross-validation splits.',
            difficulty: 'Beginner',
          },
          {
            id: '2',
            levelNumber: 2,
            title: 'Level 2: Ensemble Models & Metric Tuning',
            description: 'Random forests, gradient boosting, ROC-AUC, precision-recall optimization.',
            difficulty: 'Intermediate',
          },
          {
            id: '3',
            levelNumber: 3,
            title: 'Level 3: Model Diagnostics & Regularization',
            description: 'L1/L2 hyperparameter search, error decomposition, and calibration under class imbalance.',
            difficulty: 'Advanced',
          },
        ],
      },
    ],
  },

  // 2. Cybersecurity
  {
    id: 'cybersecurity',
    code: '02',
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    description: 'Network protocol analysis, secure communication primitives, web defense, and cryptography.',
    subtopics: 'Packet inspection, OWASP sanitization, symmetric ciphers, TLS trust verification',
    status: 'Ready',
    skills: [
      {
        id: 'networking-fundamentals',
        domainId: 'cybersecurity',
        name: 'Networking Fundamentals',
        slug: 'networking-fundamentals',
        description: 'TCP/IP stack, socket behavior, routing mechanics, packet inspection, and protocol vulnerabilities.',
        levels: [
          {
            id: '1',
            levelNumber: 1,
            title: 'Level 1: Protocol Inspections & Subnets',
            description: 'IP addressing, subnet masks, CIDR notation, and standard port allocations.',
            difficulty: 'Beginner',
          },
          {
            id: '2',
            levelNumber: 2,
            title: 'Level 2: TCP Handshakes & Packet Parsing',
            description: 'SYN/ACK handshakes, sequence numbers, Wireshark packet analysis, and DNS queries.',
            difficulty: 'Intermediate',
          },
          {
            id: '3',
            levelNumber: 3,
            title: 'Level 3: Socket Hardening & Traffic Defense',
            description: 'SYN flood mitigation, raw socket analysis, firewall rule validation, and TLS inspection.',
            difficulty: 'Advanced',
          },
        ],
      },
      {
        id: 'web-security',
        domainId: 'cybersecurity',
        name: 'Web Security',
        slug: 'web-security',
        description: 'OWASP Top 10 vulnerabilities, CSRF mitigation, XSS prevention, and secure header enforcement.',
        levels: [
          {
            id: '1',
            levelNumber: 1,
            title: 'Level 1: Injection Surface Identification',
            description: 'Locating unsanitized inputs, basic SQLi payloads, and reflected script injections.',
            difficulty: 'Beginner',
          },
          {
            id: '2',
            levelNumber: 2,
            title: 'Level 2: Auth Protection & CSRF Defense',
            description: 'SameSite cookies, CSRF token validation, session fixation protection, and CSP headers.',
            difficulty: 'Intermediate',
          },
          {
            id: '3',
            levelNumber: 3,
            title: 'Level 3: Advanced Exploit Neutralization',
            description: 'SSRF remediation, blind injection defensive coding, and zero-trust perimeter auditing.',
            difficulty: 'Advanced',
          },
        ],
      },
      {
        id: 'cryptography',
        domainId: 'cybersecurity',
        name: 'Cryptography',
        slug: 'cryptography',
        description: 'Symmetric and asymmetric encryption, cryptographic hashing, digital signatures, and key exchange.',
        levels: [
          {
            id: '1',
            levelNumber: 1,
            title: 'Level 1: Hashing & Checksums',
            description: 'SHA-256 integrity checks, salt generation, and dictionary attack prevention.',
            difficulty: 'Beginner',
          },
          {
            id: '2',
            levelNumber: 2,
            title: 'Level 2: Symmetric Cipher Operations',
            description: 'AES-GCM authenticated encryption, initialization vectors, and key derivation with PBKDF2.',
            difficulty: 'Intermediate',
          },
          {
            id: '3',
            levelNumber: 3,
            title: 'Level 3: Asymmetric Key Exchange & Signatures',
            description: 'RSA/ECDSA signature verification, Diffie-Hellman ephemeral exchange, and PKI trust validation.',
            difficulty: 'Advanced',
          },
        ],
      },
    ],
  },

  // 3. Data Science
  {
    id: 'data-science',
    code: '03',
    name: 'Data Science',
    slug: 'data-science',
    description: 'Statistical inference, analytical SQL modeling, data wrangling, and visual synthesis.',
    subtopics: 'Relational aggregates, window partitioning, hypothesis testing, exploratory visual charts',
    status: 'Ready',
    skills: [
      {
        id: 'python-sql',
        domainId: 'data-science',
        name: 'Python & SQL',
        slug: 'python-sql',
        description: 'Complex relational queries, CTEs, window functions, and Pandas query acceleration.',
        levels: [
          {
            id: '1',
            levelNumber: 1,
            title: 'Level 1: Relational Joins & Grouping',
            description: 'INNER/LEFT JOIN operations, GROUP BY aggregations, and filtering with HAVING clauses.',
            difficulty: 'Beginner',
          },
          {
            id: '2',
            levelNumber: 2,
            title: 'Level 2: Analytical Window Functions',
            description: 'ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, and cumulative rolling aggregates.',
            difficulty: 'Intermediate',
          },
          {
            id: '3',
            levelNumber: 3,
            title: 'Level 3: Optimized ETL Pipelines',
            description: 'Recursive CTEs, execution plan index profiling, and high-throughput Pandas database connectors.',
            difficulty: 'Advanced',
          },
        ],
      },
      {
        id: 'statistics',
        domainId: 'data-science',
        name: 'Statistics',
        slug: 'statistics',
        description: 'Probability distributions, hypothesis testing, p-values, confidence intervals, and variance analysis.',
        levels: [
          {
            id: '1',
            levelNumber: 1,
            title: 'Level 1: Descriptive Summaries',
            description: 'Mean, median, mode, standard deviation, interquartile ranges, and skewness.',
            difficulty: 'Beginner',
          },
          {
            id: '2',
            levelNumber: 2,
            title: 'Level 2: Inferential Hypothesis Testing',
            description: 'Student t-tests, ANOVA, Chi-square independence tests, and p-value significance bounds.',
            difficulty: 'Intermediate',
          },
          {
            id: '3',
            levelNumber: 3,
            title: 'Level 3: Bayesian Modeling & Resampling',
            description: 'Bootstrapping confidence intervals, Bayesian parameter updating, and Monte Carlo estimation.',
            difficulty: 'Advanced',
          },
        ],
      },
      {
        id: 'data-analysis-visualization',
        domainId: 'data-science',
        name: 'Data Analysis & Visualization',
        slug: 'data-analysis-visualization',
        description: 'Exploratory data analysis, multi-dimensional charting, distribution plots, and insight delivery.',
        levels: [
          {
            id: '1',
            levelNumber: 1,
            title: 'Level 1: Exploratory Charting',
            description: 'Histograms, scatter plots, box plots, and clean figure labels using Matplotlib/Seaborn.',
            difficulty: 'Beginner',
          },
          {
            id: '2',
            levelNumber: 2,
            title: 'Level 2: Multi-Variable Visual Synthesis',
            description: 'Heatmaps, facet grids, correlation matrices, and density distributions.',
            difficulty: 'Intermediate',
          },
          {
            id: '3',
            levelNumber: 3,
            title: 'Level 3: Interactive Analytical Storytelling',
            description: 'Statistical dashboard design, anomaly highlighting, and executive insight communication.',
            difficulty: 'Advanced',
          },
        ],
      },
    ],
  },

  // 4. DSA
  {
    id: 'dsa',
    code: '04',
    name: 'DSA',
    slug: 'dsa',
    description: 'Data structures, algorithmic complexity, tree/graph traversal, and dynamic programming optimization.',
    subtopics: 'Two pointers, sliding window, binary tree DFS/BFS, recurrence relation tabulation',
    status: 'Ready',
    skills: [
      {
        id: 'arrays-strings',
        domainId: 'dsa',
        name: 'Arrays & Strings',
        slug: 'arrays-strings',
        description: 'Two-pointer techniques, sliding window patterns, prefix sums, and in-place transformations.',
        levels: [
          {
            id: '1',
            levelNumber: 1,
            title: 'Level 1: Iteration & In-Place Traversal',
            description: 'Linear search, prefix checks, string reversal, and palindrome verification in O(1) space.',
            difficulty: 'Beginner',
          },
          {
            id: '2',
            levelNumber: 2,
            title: 'Level 2: Sliding Window & Two Pointers',
            description: 'Subarray sum targets, longest substring without duplicates, and container with most water.',
            difficulty: 'Intermediate',
          },
          {
            id: '3',
            levelNumber: 3,
            title: 'Level 3: Multi-Index & Prefix Hashing',
            description: 'Minimum window substring, Dutch national flag partitioning, and string rolling hash matching.',
            difficulty: 'Advanced',
          },
        ],
      },
      {
        id: 'trees-graphs',
        domainId: 'dsa',
        name: 'Trees & Graphs',
        slug: 'trees-graphs',
        description: 'Binary search trees, BFS, DFS, shortest path algorithms, topological sort, and union-find.',
        levels: [
          {
            id: '1',
            levelNumber: 1,
            title: 'Level 1: Binary Tree Traversals',
            description: 'Pre-order, in-order, post-order recursive traversals, and maximum depth calculations.',
            difficulty: 'Beginner',
          },
          {
            id: '2',
            levelNumber: 2,
            title: 'Level 2: BFS, DFS & Graph Connectivity',
            description: 'Level-order traversal, cycle detection in directed graphs, and connected components.',
            difficulty: 'Intermediate',
          },
          {
            id: '3',
            levelNumber: 3,
            title: 'Level 3: Shortest Path & Flow Optimization',
            description: 'Dijkstra shortest path, topological sorting, Disjoint Set Union (DSU), and minimum spanning trees.',
            difficulty: 'Advanced',
          },
        ],
      },
      {
        id: 'dynamic-programming',
        domainId: 'dsa',
        name: 'Dynamic Programming',
        slug: 'dynamic-programming',
        description: 'Overlapping subproblems, memoization, bottom-up tabulation, and state space reduction.',
        levels: [
          {
            id: '1',
            levelNumber: 1,
            title: 'Level 1: 1D Linear State Transitions',
            description: 'Fibonacci sequence memoization, climbing stairs, and house robber recurrence relations.',
            difficulty: 'Beginner',
          },
          {
            id: '2',
            levelNumber: 2,
            title: 'Level 2: 2D Grid & Subsequence States',
            description: '0/1 Knapsack problem, longest common subsequence, and coin change combinations.',
            difficulty: 'Intermediate',
          },
          {
            id: '3',
            levelNumber: 3,
            title: 'Level 3: Interval & Bitmask DP',
            description: 'Matrix chain multiplication, edit distance optimization, and traveling salesperson state compression.',
            difficulty: 'Advanced',
          },
        ],
      },
    ],
  },

  // 5. Web Development
  {
    id: 'web-development',
    code: '05',
    name: 'Web Development',
    slug: 'web-development',
    description: 'Modern component architecture, client/server protocols, reactive state, and REST API design.',
    subtopics: 'DOM rendering flow, React hook reconciliation, Express middleware, status code semantics',
    status: 'Ready',
    skills: [
      {
        id: 'html-css-javascript',
        domainId: 'web-development',
        name: 'HTML, CSS & JavaScript',
        slug: 'html-css-javascript',
        description: 'Semantic DOM hierarchy, CSS grid/flexbox layouts, event bubbling, and async execution.',
        levels: [
          {
            id: '1',
            levelNumber: 1,
            title: 'Level 1: Semantic Markup & Box Model',
            description: 'Accessible HTML5 semantics, CSS box model geometry, and basic DOM query manipulation.',
            difficulty: 'Beginner',
          },
          {
            id: '2',
            levelNumber: 2,
            title: 'Level 2: Responsive Flex/Grid & Async DOM',
            description: 'Complex CSS Grid alignment, event delegation, Promise chaining, and fetch API consumption.',
            difficulty: 'Intermediate',
          },
          {
            id: '3',
            levelNumber: 3,
            title: 'Level 3: Web Performance & Event Loop Mastery',
            description: 'Microtasks vs macrotasks, layout thrashing mitigation, repaint budgeting, and Web Workers.',
            difficulty: 'Advanced',
          },
        ],
      },
      {
        id: 'react',
        domainId: 'web-development',
        name: 'React',
        slug: 'react',
        description: 'Component lifecycle, state synchronization, hook composition, custom hooks, and memoization.',
        levels: [
          {
            id: '1',
            levelNumber: 1,
            title: 'Level 1: Component Props & State',
            description: 'JSX syntax, useState, component decomposition, and controlled form inputs.',
            difficulty: 'Beginner',
          },
          {
            id: '2',
            levelNumber: 2,
            title: 'Level 2: Effects, Context & Custom Hooks',
            description: 'useEffect cleanup, global state with useContext, custom hook abstraction, and error boundaries.',
            difficulty: 'Intermediate',
          },
          {
            id: '3',
            levelNumber: 3,
            title: 'Level 3: Render Optimization & Concurrency',
            description: 'useMemo/useCallback boundaries, React Compiler compatibility, suspense, and virtualized lists.',
            difficulty: 'Advanced',
          },
        ],
      },
      {
        id: 'backend-rest-apis',
        domainId: 'web-development',
        name: 'Backend & REST APIs',
        slug: 'backend-rest-apis',
        description: 'RESTful conventions, request routing, middleware composition, status code rigor, and authentication tokens.',
        levels: [
          {
            id: '1',
            levelNumber: 1,
            title: 'Level 1: Express Routing & Request Handling',
            description: 'GET/POST endpoint routing, body parsing, request param extraction, and status codes.',
            difficulty: 'Beginner',
          },
          {
            id: '2',
            levelNumber: 2,
            title: 'Level 2: Middleware & Token Verification',
            description: 'Custom middleware chaining, Bearer JWT validation, CORS preflight handling, and centralized errors.',
            difficulty: 'Intermediate',
          },
          {
            id: '3',
            levelNumber: 3,
            title: 'Level 3: Scalable Architecture & Resilience',
            description: 'Rate limiting, idempotent mutation handling, transactional consistency, and graceful shutdown.',
            difficulty: 'Advanced',
          },
        ],
      },
    ],
  },
];

/**
 * Helper to retrieve all 5 domains
 */
export function getCurriculumDomains(): DomainItem[] {
  return curriculumDomains;
}

/**
 * Find domain by ID or slug
 */
export function findDomain(domainIdOrSlug?: string | null): DomainItem {
  if (!domainIdOrSlug) return curriculumDomains[0];
  const normalized = domainIdOrSlug.toLowerCase().trim();
  const match = curriculumDomains.find(
    (d) =>
      d.id.toLowerCase() === normalized ||
      d.slug.toLowerCase() === normalized ||
      d.name.toLowerCase() === normalized
  );
  return match || curriculumDomains[0];
}

/**
 * Find skill by domain ID/slug and skill ID/slug
 */
export function findSkill(
  domainIdOrSlug?: string | null,
  skillIdOrSlug?: string | null
): SkillItem {
  const domain = findDomain(domainIdOrSlug);
  const skills = domain.skills || [];
  if (!skillIdOrSlug) return skills[0];
  const normalized = skillIdOrSlug.toLowerCase().trim();
  const match = skills.find(
    (s) =>
      s.id.toLowerCase() === normalized ||
      s.slug.toLowerCase() === normalized ||
      s.name.toLowerCase() === normalized
  );
  return match || skills[0];
}

/**
 * Find level by level ID or levelNumber (1, 2, 3)
 */
export function findLevel(
  domainIdOrSlug?: string | null,
  skillIdOrSlug?: string | null,
  levelIdOrNumber?: string | number | null
): CompetencyLevelItem {
  const skill = findSkill(domainIdOrSlug, skillIdOrSlug);
  const levels = skill.levels || [];
  if (!levelIdOrNumber) return levels[0];
  const levelNum = Number(levelIdOrNumber);
  const match = levels.find(
    (l) => l.id === String(levelIdOrNumber) || l.levelNumber === levelNum
  );
  return match || levels[0];
}

/**
 * Dynamic Assessment brief generator based on domainId + skillId + levelId
 */
export function getAssessmentBrief(
  domainId?: string | null,
  skillId?: string | null,
  levelId?: string | number | null
): CurriculumAssessmentBrief {
  const domain = findDomain(domainId);
  const skill = findSkill(domain.id, skillId);
  const level = findLevel(domain.id, skill.id, levelId);

  const domainCode = domain.code || '01';
  const skillPrefix = skill.slug.slice(0, 4).toUpperCase();
  const protocolRef = `DOM${domainCode}-${skillPrefix}-L0${level.levelNumber}`;

  return {
    protocolRef,
    domainName: domain.name.toUpperCase(),
    skillName: skill.name.toUpperCase(),
    levelNumber: level.levelNumber,
    levelTitle: level.title,
    difficulty: level.difficulty,
    title: `${skill.name}: ${level.title}`,
    synopsis: `${level.description} Complete the designated benchmarks within the empirical sandboxed runtime environment.`,
    estimatedDuration: level.levelNumber === 1 ? '30m' : level.levelNumber === 2 ? '45m' : '60m',
    isolationMode: 'Strict Sandbox',
    criteria: [
      {
        id: 'crit_1',
        num: '01',
        title: 'Empirical Verification of Core Objectives',
        summary: `Demonstrate deterministic execution of ${skill.name} patterns in an isolated sandbox.`,
        verifiableTarget: 'Deterministic regression assertion pass rate: 100%',
        badgeLabel: 'CORE EXECUTION',
      },
      {
        id: 'crit_2',
        num: '02',
        title: `${level.difficulty} Difficulty Competency Criteria`,
        summary: `Ensure all edge cases and error conditions specific to ${level.title} are systematically addressed.`,
        verifiableTarget: 'Zero unhandled exception states during automated boundary tests',
        badgeLabel: `${level.difficulty.toUpperCase()} BENCHMARK`,
      },
      {
        id: 'crit_3',
        num: '03',
        title: 'Observable Code Quality & Architecture',
        summary: 'Deliver clean, maintainable, and idiomatic solutions meeting production standards.',
        verifiableTarget: 'Adherence to architectural idioms and strict structural invariants',
        badgeLabel: 'ARCHITECTURAL RIGOR',
      },
    ],
  };
}
