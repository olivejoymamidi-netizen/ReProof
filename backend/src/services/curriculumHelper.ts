export interface CurriculumLevel {
  id: string;
  levelNumber: number;
  title: string;
  description: string;
  difficulty: string;
}

export interface CurriculumSkill {
  id: string;
  domainId: string;
  name: string;
  slug: string;
  description: string;
  levels: CurriculumLevel[];
}

export interface CurriculumDomain {
  id: string;
  code: string;
  name: string;
  slug: string;
  description: string;
  skills: CurriculumSkill[];
}

export const CURRICULUM_DOMAINS: CurriculumDomain[] = [
  {
    id: 'ai-ml',
    code: '01',
    name: 'AI / ML',
    slug: 'ai-ml',
    description: 'Machine learning pipelines, data preprocessing algorithms, and statistical model evaluation.',
    skills: [
      {
        id: 'python-for-ml',
        domainId: 'ai-ml',
        name: 'Python for ML',
        slug: 'python-for-ml',
        description: 'Vectorized manipulation with NumPy, array broadcasting, and memory-efficient matrix computation.',
        levels: [
          { id: '1', levelNumber: 1, title: 'Level 1: Python ML Foundations', description: 'Array slicing, shape manipulation, and fundamental linear algebra operations with NumPy.', difficulty: 'Beginner' },
          { id: '2', levelNumber: 2, title: 'Level 2: Vectorized Computation', description: 'Broadcasting rules, multidimensional matrix multiplication, and performance-tuned linear transformations.', difficulty: 'Intermediate' },
          { id: '3', levelNumber: 3, title: 'Level 3: High-Performance Memory Pipelines', description: 'In-place array mutations, memory-mapped tensors, and vectorized custom loss calculations.', difficulty: 'Advanced' }
        ]
      },
      {
        id: 'data-preprocessing',
        domainId: 'ai-ml',
        name: 'Data Preprocessing',
        slug: 'data-preprocessing',
        description: 'Handling missing data, categorical encoding, feature scaling, and transformation pipelines.',
        levels: [
          { id: '1', levelNumber: 1, title: 'Level 1: Missing Data & Imputation', description: 'Detecting null indicators, statistical mean/median imputation, and outlier record filtering.', difficulty: 'Beginner' },
          { id: '2', levelNumber: 2, title: 'Level 2: Feature Encoding & Scaling', description: 'StandardScaler, MinMax normalization, one-hot encoding, and target-leak prevention.', difficulty: 'Intermediate' },
          { id: '3', levelNumber: 3, title: 'Level 3: End-to-End Pipeline Engineering', description: 'Automated scikit-learn transformers, column transformers, and out-of-distribution drift checks.', difficulty: 'Advanced' }
        ]
      },
      {
        id: 'machine-learning',
        domainId: 'ai-ml',
        name: 'Machine Learning',
        slug: 'machine-learning',
        description: 'Supervised and unsupervised learning, loss functions, overfitting mitigation, and model validation.',
        levels: [
          { id: '1', levelNumber: 1, title: 'Level 1: Supervised Basics & Metrics', description: 'Linear regression, decision trees, train-test splits, accuracy, and precision-recall trade-offs.', difficulty: 'Beginner' },
          { id: '2', levelNumber: 2, title: 'Level 2: Ensemble Models & Hyperparameter Tuning', description: 'Random Forests, Gradient Boosting, ROC-AUC curves, k-fold cross validation, and grid searches.', difficulty: 'Intermediate' },
          { id: '3', levelNumber: 3, title: 'Level 3: Production ML & Drift Detection', description: 'Pipeline serialization, model drift mitigation, inference latency tuning, and calibration metrics.', difficulty: 'Advanced' }
        ]
      }
    ]
  },
  {
    id: 'cybersecurity',
    code: '02',
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    description: 'Network forensics, secure application architecture, vulnerability mitigation, and cryptographic protocols.',
    skills: [
      {
        id: 'networking-fundamentals',
        domainId: 'cybersecurity',
        name: 'Networking Fundamentals',
        slug: 'networking-fundamentals',
        description: 'TCP/IP stack, routing protocols, subnetting, packet inspection, and firewall topology.',
        levels: [
          { id: '1', levelNumber: 1, title: 'Level 1: TCP/IP & Packet Analysis', description: 'OSI 7-layer architecture, 3-way handshake analysis, ICMP diagnostics, and Wireshark filters.', difficulty: 'Beginner' },
          { id: '2', levelNumber: 2, title: 'Level 2: Subnetting & Routing Protocols', description: 'CIDR notation, VLAN segmentation, NAT translation tables, and stateful firewall rule design.', difficulty: 'Intermediate' },
          { id: '3', levelNumber: 3, title: 'Level 3: Protocol Hardening & Intrusion Analysis', description: 'DNS tunneling detection, BGP hijacking defense, TLS handshake inspection, and SYN flood mitigation.', difficulty: 'Advanced' }
        ]
      },
      {
        id: 'web-security',
        domainId: 'cybersecurity',
        name: 'Web Security',
        slug: 'web-security',
        description: 'OWASP Top 10 vulnerabilities, authentication bypasses, sanitization routines, and browser sandboxing.',
        levels: [
          { id: '1', levelNumber: 1, title: 'Level 1: OWASP Essentials', description: 'Reflected XSS vectors, SQL injection mitigations, and HTTP header security controls.', difficulty: 'Beginner' },
          { id: '2', levelNumber: 2, title: 'Level 2: Session & CSRF Defenses', description: 'SameSite cookie flags, double-submit CSRF tokens, SSRF filtering, and JWT signature auditing.', difficulty: 'Intermediate' },
          { id: '3', levelNumber: 3, title: 'Level 3: Advanced AppSec Architecture', description: 'CSP Level 3 nonce policy, prototype pollution sanitization, OAuth 2.0 PKCE flow auditing, and race condition exploits.', difficulty: 'Advanced' }
        ]
      },
      {
        id: 'cryptography',
        domainId: 'cybersecurity',
        name: 'Cryptography',
        slug: 'cryptography',
        description: 'Symmetric/asymmetric encryption primitives, hashing algorithms, digital signatures, and key exchange protocols.',
        levels: [
          { id: '1', levelNumber: 1, title: 'Level 1: Hashing & Symmetric Ciphers', description: 'SHA-256 collision resistance, salted key derivation with bcrypt/Argon2, and AES-GCM encryption.', difficulty: 'Beginner' },
          { id: '2', levelNumber: 2, title: 'Level 2: Asymmetric Cryptography & PKI', description: 'RSA-OAEP, Diffie-Hellman key exchange, X.509 certificate chains, and elliptic curve basics.', difficulty: 'Intermediate' },
          { id: '3', levelNumber: 3, title: 'Level 3: Cryptographic Protocol Design', description: 'Forward secrecy guarantees, nonce-reuse attack defenses, zero-knowledge proofs, and side-channel resistance.', difficulty: 'Advanced' }
        ]
      }
    ]
  },
  {
    id: 'data-science',
    code: '03',
    name: 'Data Science',
    slug: 'data-science',
    description: 'Statistical inference, exploratory data analysis, relational querying, and predictive hypothesis formulation.',
    skills: [
      {
        id: 'python-sql',
        domainId: 'data-science',
        name: 'Python & SQL',
        slug: 'python-sql',
        description: 'Pandas data frame manipulation, relational SQL joins, window functions, and database query optimization.',
        levels: [
          { id: '1', levelNumber: 1, title: 'Level 1: Querying & Dataframe Wrangling', description: 'Filtering records, groupby aggregations, INNER/LEFT joins, and DataFrame reshaping.', difficulty: 'Beginner' },
          { id: '2', levelNumber: 2, title: 'Level 2: Window Functions & Analytical Queries', description: 'PARTITION BY, RANK/DENSE_RANK, rolling windows, CTE chains, and index-aware execution.', difficulty: 'Intermediate' },
          { id: '3', levelNumber: 3, title: 'Level 3: Large-Scale Query Optimization', description: 'Query plan EXPLAIN ANALYZE debugging, partitioned tables, memory-mapped query pipelines, and concurrency locks.', difficulty: 'Advanced' }
        ]
      },
      {
        id: 'statistics',
        domainId: 'data-science',
        name: 'Statistics',
        slug: 'statistics',
        description: 'Probability distributions, hypothesis testing, confidence intervals, regression analysis, and Bayesian principles.',
        levels: [
          { id: '1', levelNumber: 1, title: 'Level 1: Descriptive Statistics & Probabilities', description: 'Mean, median, variance, interquartile ranges, normal distributions, and Central Limit Theorem.', difficulty: 'Beginner' },
          { id: '2', levelNumber: 2, title: 'Level 2: Hypothesis Testing & Inferential Stats', description: 'Two-sample t-tests, ANOVA variance decomposition, chi-square independence, and p-value corrections.', difficulty: 'Intermediate' },
          { id: '3', levelNumber: 3, title: 'Level 3: Causal Inference & Bayesian Modeling', description: 'Propensity score matching, Bayesian parameter estimation, confounding variable controls, and power analysis.', difficulty: 'Advanced' }
        ]
      },
      {
        id: 'data-analysis-visualization',
        domainId: 'data-science',
        name: 'Data Analysis & Visualization',
        slug: 'data-analysis-visualization',
        description: 'Visual storytelling, multi-variable dashboards, exploratory data analysis, and distribution plotting.',
        levels: [
          { id: '1', levelNumber: 1, title: 'Level 1: Chart Selection & Distribution Plots', description: 'Histograms, box plots, scatter distributions, and cognitive clarity in visualization layout.', difficulty: 'Beginner' },
          { id: '2', levelNumber: 2, title: 'Level 2: Interactive Dashboards & Multi-Dimensional EDA', description: 'Correlation matrices, heatmaps, faceted subplots, and outlier drill-down views.', difficulty: 'Intermediate' },
          { id: '3', levelNumber: 3, title: 'Level 3: Advanced Visual Analytics & Executive Storytelling', description: 'Dimensionality reduction plots (t-SNE/UMAP), dual-axis scale hazards, dynamic anomaly overlays, and reporting pipelines.', difficulty: 'Advanced' }
        ]
      }
    ]
  },
  {
    id: 'dsa',
    code: '04',
    name: 'DSA',
    slug: 'dsa',
    description: 'Algorithmic efficiency, time-space complexity optimization, fundamental and advanced computational structures.',
    skills: [
      {
        id: 'arrays-strings',
        domainId: 'dsa',
        name: 'Arrays & Strings',
        slug: 'arrays-strings',
        description: 'Two-pointer patterns, sliding window algorithms, prefix sums, and character buffer manipulations.',
        levels: [
          { id: '1', levelNumber: 1, title: 'Level 1: Two-Pointer & Sliding Window Basics', description: 'In-place array manipulations, target sum pointers, and fixed-size sliding window boundaries.', difficulty: 'Beginner' },
          { id: '2', levelNumber: 2, title: 'Level 2: Variable Window & Monotonic Sequences', description: 'Dynamic sliding window expansions, prefix hash lookups, and monotonic queue implementations.', difficulty: 'Intermediate' },
          { id: '3', levelNumber: 3, title: 'Level 3: High-Performance String & Array Invariants', description: 'KMP pattern matching, Trie prefix indexing, suffix arrays, and bitset-accelerated frequency masks.', difficulty: 'Advanced' }
        ]
      },
      {
        id: 'trees-graphs',
        domainId: 'dsa',
        name: 'Trees & Graphs',
        slug: 'trees-graphs',
        description: 'Tree traversals, binary search trees, graph connectivity, shortest path algorithms, and topological sorting.',
        levels: [
          { id: '1', levelNumber: 1, title: 'Level 1: Binary Tree Traversals & BST Operations', description: 'Pre-order, in-order, post-order recursive scans, BFS level-order queues, and BST search/insert.', difficulty: 'Beginner' },
          { id: '2', levelNumber: 2, title: 'Level 2: Graph Connectivity & Shortest Paths', description: 'Cycle detection with DFS/Union-Find, topological sorting with Kahn algorithm, and Dijkstra pathfinding.', difficulty: 'Intermediate' },
          { id: '3', levelNumber: 3, title: 'Level 3: Advanced Graph Optimization & Network Flows', description: 'A* heuristic navigation, Bellman-Ford negative cycle audits, Tarjan strongly connected components, and segment trees.', difficulty: 'Advanced' }
        ]
      },
      {
        id: 'dynamic-programming',
        domainId: 'dsa',
        name: 'Dynamic Programming',
        slug: 'dynamic-programming',
        description: 'Overlapping subproblems, optimal substructure, memoization, state transitions, and space-optimized tabulation.',
        levels: [
          { id: '1', levelNumber: 1, title: 'Level 1: Memoization & 1D Tabulation', description: 'Fibonacci state transitions, climbing stairs variants, House Robber patterns, and recursion tree pruning.', difficulty: 'Beginner' },
          { id: '2', levelNumber: 2, title: 'Level 2: 2D Grids & Knapsack Formulations', description: '0/1 Knapsack, Longest Common Subsequence, Edit Distance matrices, and state reduction.', difficulty: 'Intermediate' },
          { id: '3', levelNumber: 3, title: 'Level 3: Advanced Bitmask & Interval DP', description: 'Bitmask DP on traveling salesman states, interval DP matrix chain multiplications, and divide-and-conquer DP optimizations.', difficulty: 'Advanced' }
        ]
      }
    ]
  },
  {
    id: 'web-development',
    code: '05',
    name: 'Web Development',
    slug: 'web-development',
    description: 'Modern front-end component systems, asynchronous browser APIs, scalable back-end architectures, and REST services.',
    skills: [
      {
        id: 'html-css-javascript',
        domainId: 'web-development',
        name: 'HTML, CSS & JavaScript',
        slug: 'html-css-javascript',
        description: 'Semantic DOM architecture, CSS grid/flexbox layouts, responsive design, and modern asynchronous JavaScript.',
        levels: [
          { id: '1', levelNumber: 1, title: 'Level 1: Semantic DOM & Modern CSS Layouts', description: 'Semantic HTML5 tags, flexbox/grid alignments, responsive media queries, and event delegation.', difficulty: 'Beginner' },
          { id: '2', levelNumber: 2, title: 'Level 2: Asynchronous JS & DOM Performance', description: 'Promises, async/await error boundaries, debounce/throttle mechanics, and DOM reflow minimization.', difficulty: 'Intermediate' },
          { id: '3', levelNumber: 3, title: 'Level 3: Deep JS Runtime & Web Architecture', description: 'Microtask vs macrotask execution loop, memory leak tracing in closures, Service Worker caching, and Web Workers.', difficulty: 'Advanced' }
        ]
      },
      {
        id: 'react',
        domainId: 'web-development',
        name: 'React',
        slug: 'react',
        description: 'Declarative component architecture, custom hooks, state synchronization, render optimization, and Context API.',
        levels: [
          { id: '1', levelNumber: 1, title: 'Level 1: State & Component Architecture', description: 'Functional components, useState/useEffect lifecycles, props immutability, and controlled inputs.', difficulty: 'Beginner' },
          { id: '2', levelNumber: 2, title: 'Level 2: Custom Hooks & Performance Optimization', description: 'useMemo, useCallback referential equality, useReducer state machines, and React Context boundaries.', difficulty: 'Intermediate' },
          { id: '3', levelNumber: 3, title: 'Level 3: Advanced Patterns & Concurrent Features', description: 'Transitions, Suspense boundaries, custom hook architectures, and bundle-splitting virtualized lists.', difficulty: 'Advanced' }
        ]
      },
      {
        id: 'backend-rest-apis',
        domainId: 'web-development',
        name: 'Backend & REST APIs',
        slug: 'backend-rest-apis',
        description: 'Node/Express API architecture, middleware chains, database transactions, authentication flows, and error handling.',
        levels: [
          { id: '1', levelNumber: 1, title: 'Level 1: RESTful Endpoints & Middleware', description: 'CRUD route handlers, request validation, standard HTTP status codes, and centralized error middleware.', difficulty: 'Beginner' },
          { id: '2', levelNumber: 2, title: 'Level 2: Authentication & Relational Persistence', description: 'Bearer token auth middleware, input sanitization, database transactions, and pagination cursors.', difficulty: 'Intermediate' },
          { id: '3', levelNumber: 3, title: 'Level 3: Scalable Architecture & Resilience', description: 'Rate limiting with Redis tokens, circuit breakers, idempotency keys, and graceful shutdown signal traps.', difficulty: 'Advanced' }
        ]
      }
    ]
  }
];

export function findDomain(domainId: string): CurriculumDomain | undefined {
  const norm = domainId.toLowerCase().trim();
  return CURRICULUM_DOMAINS.find(d => d.id === norm || d.slug === norm || d.name.toLowerCase() === norm);
}

export function findSkill(domainId: string, skillId: string): CurriculumSkill | undefined {
  const domain = findDomain(domainId);
  if (!domain) {
    // Also try searching across all domains directly by skillId
    for (const d of CURRICULUM_DOMAINS) {
      const s = d.skills.find(sk => sk.id === skillId || sk.slug === skillId || sk.name.toLowerCase() === skillId.toLowerCase());
      if (s) return s;
    }
    return undefined;
  }
  return domain.skills.find(s => s.id === skillId || s.slug === skillId || s.name.toLowerCase() === skillId.toLowerCase());
}
