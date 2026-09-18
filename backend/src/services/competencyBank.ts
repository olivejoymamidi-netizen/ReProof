export interface CompetencyDefinition {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'advanced' | 'architectural' | 'invariants' | 'reasoning';
  levelExpectations: {
    1: string;
    2: string;
    3: string;
  };
  relevantRounds: ('knowledge' | 'approach' | 'coding' | 'project' | 'interview')[];
  weight: number; // percentage in this skill
}

export interface SkillCompetencyProfile {
  domainId: string;
  skillId: string;
  skillName: string;
  competencies: CompetencyDefinition[];
}

export const COMPETENCY_PROFILES: Record<string, SkillCompetencyProfile> = {
  // 1. AI / ML — Python for ML
  'python-for-ml': {
    domainId: 'ai-ml',
    skillId: 'python-for-ml',
    skillName: 'Python for ML',
    competencies: [
      {
        id: 'pml_vectorization',
        name: 'Vectorized Array Operations',
        description: 'Ability to perform vectorized broadcasting and matrix math avoiding slow Python loops.',
        category: 'core',
        levelExpectations: {
          1: 'Applies 1D/2D basic broadcasting and element-wise NumPy operators.',
          2: 'Implements multidimensional tensor broadcasting and custom universal functions (ufuncs).',
          3: 'Optimizes SIMD vectorization, in-place buffer operations, and BLAS/LAPACK routine dispatch.',
        },
        relevantRounds: ['knowledge', 'coding', 'project', 'interview'],
        weight: 20,
      },
      {
        id: 'pml_memory_layout',
        name: 'Memory Layout & Cache Locality',
        description: 'Knowledge of C-contiguous vs Fortran order, memory views, strides, and memory mapping.',
        category: 'invariants',
        levelExpectations: {
          1: 'Distinguishes between array views and deep copies.',
          2: 'Uses strides and contiguous memory flags to avoid unintentional buffer duplications.',
          3: 'Engineers out-of-core pipelines using memory-mapped files (np.memmap) for massive datasets.',
        },
        relevantRounds: ['knowledge', 'approach', 'project', 'interview'],
        weight: 20,
      },
      {
        id: 'pml_linear_algebra',
        name: 'Linear Algebra & Numerical Invariants',
        description: 'Decompositions, matrix multiplications, dot products, and numerical stability safeguards.',
        category: 'core',
        levelExpectations: {
          1: 'Performs matrix dot products, transpose transformations, and norm calculations.',
          2: 'Applies SVD/eigenvalue decompositions and solves linear systems stably.',
          3: 'Implements condition-number auditing and epsilon-damping against matrix degeneracy.',
        },
        relevantRounds: ['knowledge', 'coding', 'project'],
        weight: 20,
      },
      {
        id: 'pml_numerical_stability',
        name: 'Numerical Stability & Denominator Safeguards',
        description: 'Handling zero-variance standard deviations, float precision drift, and log-sum-exp stabilization.',
        category: 'invariants',
        levelExpectations: {
          1: 'Handles NaN/inf checks and incorporates basic epsilons into divisions.',
          2: 'Stabilizes softmax and log-likelihood formulations using max-subtraction tricks.',
          3: 'Detects float16/float32 underflow and designs high-precision gradient accumulation buffers.',
        },
        relevantRounds: ['approach', 'coding', 'project', 'interview'],
        weight: 20,
      },
      {
        id: 'pml_performance_reasoning',
        name: 'Computational Profiling & Trade-offs',
        description: 'Justifying algorithmic complexity, profiling hotspots, and explaining Python GIL trade-offs.',
        category: 'reasoning',
        levelExpectations: {
          1: 'Identifies why Python for-loops bottleneck numerical performance.',
          2: 'Profiles execution time with cProfile/timeit and balances memory vs compute trade-offs.',
          3: 'Explains C-extension interaction, memory bandwidth limits, and parallel multi-core scaling.',
        },
        relevantRounds: ['approach', 'interview'],
        weight: 20,
      },
    ],
  },

  // 2. AI / ML — Data Preprocessing
  'data-preprocessing': {
    domainId: 'ai-ml',
    skillId: 'data-preprocessing',
    skillName: 'Data Preprocessing',
    competencies: [
      {
        id: 'dp_imputation',
        name: 'Missing Data Imputation & Diagnostics',
        description: 'Detecting missingness mechanisms (MCAR, MAR, MNAR) and applying statistical imputation.',
        category: 'core',
        levelExpectations: {
          1: 'Detects null indicators and applies mean, median, and mode imputation strategies.',
          2: 'Evaluates distribution distortion caused by univariate imputation and applies KNN/iterative methods.',
          3: 'Designs predictive MICE imputation pipelines with confidence intervals and missingness indicator flags.',
        },
        relevantRounds: ['knowledge', 'coding', 'project'],
        weight: 20,
      },
      {
        id: 'dp_feature_scaling',
        name: 'Feature Scaling & Normalization',
        description: 'Standardization, MinMax bounds, Robust scaling, and power transforms.',
        category: 'core',
        levelExpectations: {
          1: 'Applies z-score standardization and min-max feature bounding.',
          2: 'Selects RobustScaler for outlier-heavy distributions and QuantileTransformer for skew.',
          3: 'Customizes scaling transforms preserving sparsity in high-dimensional feature spaces.',
        },
        relevantRounds: ['knowledge', 'coding', 'project'],
        weight: 20,
      },
      {
        id: 'dp_encoding',
        name: 'Categorical Encoding & Cardinality Management',
        description: 'One-hot encoding, ordinal mappings, target encoding, and frequency discretization.',
        category: 'core',
        levelExpectations: {
          1: 'Applies one-hot and ordinal encoding to low-cardinality discrete features.',
          2: 'Implements target encoding with m-estimate smoothing to prevent overfitting on unseen labels.',
          3: 'Designs out-of-fold target encoding pipelines with hash tricks for ultra-high cardinality.',
        },
        relevantRounds: ['knowledge', 'project', 'interview'],
        weight: 20,
      },
      {
        id: 'dp_leakage_prevention',
        name: 'Data Leakage Isolation Invariants',
        description: 'Ensuring transformations are fit strictly on training splits before test inference.',
        category: 'invariants',
        levelExpectations: {
          1: 'Separates train and test sets prior to fitting scaler objects.',
          2: 'Encapsulates transforms in scikit-learn Pipelines to avoid leakage in cross-validation folds.',
          3: 'Audits time-series temporal boundaries and prevents out-of-distribution lookahead bias.',
        },
        relevantRounds: ['approach', 'coding', 'project', 'interview'],
        weight: 20,
      },
      {
        id: 'dp_outlier_filtering',
        name: 'Outlier Detection & Distribution Governance',
        description: 'Interquartile ranges, z-score bounds, isolation forests, and drift detection.',
        category: 'architectural',
        levelExpectations: {
          1: 'Filters anomalous records using IQR bounds and standard deviation cutoffs.',
          2: 'Applies Isolation Forest and Mahalanobis distance for multivariate anomaly detection.',
          3: 'Designs automated drift detection monitoring distribution shifts between train and production feeds.',
        },
        relevantRounds: ['approach', 'project', 'interview'],
        weight: 20,
      },
    ],
  },

  // 3. AI / ML — Machine Learning
  'machine-learning': {
    domainId: 'ai-ml',
    skillId: 'machine-learning',
    skillName: 'Machine Learning',
    competencies: [
      {
        id: 'ml_model_selection',
        name: 'Model Selection & Inductive Bias',
        description: 'Selecting linear, tree-based, or kernel algorithms appropriate to dataset topology.',
        category: 'architectural',
        levelExpectations: {
          1: 'Chooses between linear regression, logistic classification, and basic decision trees.',
          2: 'Selects Random Forests, Gradient Boosted Trees (XGBoost/LightGBM), or SVMs based on data shape.',
          3: 'Justifies ensemble architectures, stacking classifiers, and deep neural network trade-offs.',
        },
        relevantRounds: ['approach', 'project', 'interview'],
        weight: 20,
      },
      {
        id: 'ml_overfitting_mitigation',
        name: 'Overfitting Mitigation & Regularization',
        description: 'Applying L1/L2 penalties, tree pruning, early stopping, and dropout.',
        category: 'invariants',
        levelExpectations: {
          1: 'Uses train/test splits and tunes tree depth parameters to avoid pure leaf memorization.',
          2: 'Applies Ridge/Lasso regularization and K-Fold cross validation to assess generalization error.',
          3: 'Formulates multi-objective Bayesian hyperparameter optimization with early stopping criteria.',
        },
        relevantRounds: ['knowledge', 'coding', 'project', 'interview'],
        weight: 20,
      },
      {
        id: 'ml_evaluation_metrics',
        name: 'Evaluation Metrics & Loss Trade-offs',
        description: 'Precision-Recall, ROC-AUC, F1-Score, Brier loss, and asymmetric cost matrices.',
        category: 'core',
        levelExpectations: {
          1: 'Computes accuracy, precision, recall, and confusion matrix indicators.',
          2: 'Interprets Precision-Recall curves and ROC-AUC on imbalanced class distributions.',
          3: 'Calibrates model probability outputs (Platt scaling / Isotonic regression) and cost-weighted loss.',
        },
        relevantRounds: ['knowledge', 'project', 'interview'],
        weight: 20,
      },
      {
        id: 'ml_pipeline_engineering',
        name: 'Inference Pipeline Engineering',
        description: 'Packaging trained weights, managing serialization, and serving predictions.',
        category: 'core',
        levelExpectations: {
          1: 'Serializes model artifacts using joblib/pickle and restores them for test evaluation.',
          2: 'Packages end-to-end transformers with model predictors inside automated scikit-learn pipelines.',
          3: 'Designs low-latency batch inference servers with warm-up routines and memory isolation.',
        },
        relevantRounds: ['coding', 'project'],
        weight: 20,
      },
      {
        id: 'ml_generalization_reasoning',
        name: 'Model Generalization & Bias-Variance Reasoning',
        description: 'Explaining model failures, diagnosing high bias vs high variance, and defending decisions.',
        category: 'reasoning',
        levelExpectations: {
          1: 'Distinguishes between underfitting (high bias) and overfitting (high variance).',
          2: 'Analyzes learning curves and justifies feature engineering to resolve structural weaknesses.',
          3: 'Defends fairness constraints, explainability (SHAP/LIME values), and robust domain adaptation.',
        },
        relevantRounds: ['approach', 'interview'],
        weight: 20,
      },
    ],
  },

  // 4. Cybersecurity — Networking Fundamentals
  'networking-fundamentals': {
    domainId: 'cybersecurity',
    skillId: 'networking-fundamentals',
    skillName: 'Networking Fundamentals',
    competencies: [
      {
        id: 'net_tcp_ip',
        name: 'TCP/IP Architecture & Protocol Stack',
        description: 'OSI 7-layer encapsulation, TCP 3-way handshake, flags, and window sizing.',
        category: 'core',
        levelExpectations: {
          1: 'Identifies packet flow through OSI layers and traces SYN, SYN-ACK, ACK transitions.',
          2: 'Analyzes TCP window flow control, sequence numbers, and retransmission behaviors.',
          3: 'Audits low-level packet fragmentation, MTU path discovery, and raw socket crafting.',
        },
        relevantRounds: ['knowledge', 'coding', 'project'],
        weight: 20,
      },
      {
        id: 'net_packet_analysis',
        name: 'Packet Inspection & Traffic Forensics',
        description: 'Parsing PCAP captures, identifying anomalies, and extracting network metadata.',
        category: 'core',
        levelExpectations: {
          1: 'Applies Wireshark display filters to extract HTTP headers and IP endpoints.',
          2: 'Decodes raw PCAP frame byte buffers and correlates port scanning sequences.',
          3: 'Detects covert tunneling (DNS/ICMP tunnels) and stealth timing-based exfiltration patterns.',
        },
        relevantRounds: ['coding', 'project', 'interview'],
        weight: 25,
      },
      {
        id: 'net_subnetting_routing',
        name: 'Subnetting & Network Segmentation',
        description: 'CIDR calculations, VLAN boundaries, NAT routing tables, and perimeter topologies.',
        category: 'architectural',
        levelExpectations: {
          1: 'Calculates subnet masks, broadcast addresses, and host ranges for IPv4 CIDR blocks.',
          2: 'Designs isolated VLAN topologies and configures stateful routing access-control lists.',
          3: 'Hardens border gateway routing (BGP) and configures zero-trust microsegmentation rules.',
        },
        relevantRounds: ['knowledge', 'approach', 'project'],
        weight: 20,
      },
      {
        id: 'net_security_invariants',
        name: 'Protocol Security & Flood Defense',
        description: 'SYN flood mitigation, ARP spoofing defenses, and perimeter firewall invariants.',
        category: 'invariants',
        levelExpectations: {
          1: 'Explains how stateful firewalls track connection states (NEW, ESTABLISHED, RELATED).',
          2: 'Configures SYN cookies and rate limiting against distributed exhaustion attacks.',
          3: 'Designs resilient protocol fallback invariants mitigating DNS cache poisoning and BGP hijacking.',
        },
        relevantRounds: ['approach', 'coding', 'project', 'interview'],
        weight: 20,
      },
      {
        id: 'net_forensic_reasoning',
        name: 'Network Threat Reasoning & Diagnostics',
        description: 'Investigating communication anomalies and defending perimeter decisions.',
        category: 'reasoning',
        levelExpectations: {
          1: 'Diagnoses host reachability issues using ICMP ping and traceroute telemetry.',
          2: 'Identifies unauthorized lateral movement through network flow logs.',
          3: 'Correlates distributed packet traces to reconstruct advanced persistent threat (APT) timelines.',
        },
        relevantRounds: ['approach', 'interview'],
        weight: 15,
      },
    ],
  },

  // 5. Cybersecurity — Web Security
  'web-security': {
    domainId: 'cybersecurity',
    skillId: 'web-security',
    skillName: 'Web Security',
    competencies: [
      {
        id: 'ws_injection_mitigation',
        name: 'Injection Attack Mitigation',
        description: 'SQL injection, command injection, and parameterized database queries.',
        category: 'core',
        levelExpectations: {
          1: 'Identifies basic SQLi vectors and replaces dynamic concatenation with parameterized queries.',
          2: 'Mitigates second-order SQLi and input-dependent dynamic query construction.',
          3: 'Audits ORM query abstractions and prevents blind timing-based injection across distributed microservices.',
        },
        relevantRounds: ['knowledge', 'coding', 'project'],
        weight: 20,
      },
      {
        id: 'ws_xss_csp',
        name: 'XSS Sanitization & Content Security Policy',
        description: 'Reflected/Stored/DOM XSS, contextual encoding, and CSP Level 3 policy design.',
        category: 'core',
        levelExpectations: {
          1: 'Distinguishes reflected from stored XSS and applies HTML entity escaping.',
          2: 'Configures strict Content Security Policy (CSP) headers with cryptographic nonces.',
          3: 'Neutralizes DOM-based prototype pollution and secures trusted types in modern browser runtimes.',
        },
        relevantRounds: ['knowledge', 'coding', 'project', 'interview'],
        weight: 20,
      },
      {
        id: 'ws_csrf_session',
        name: 'Session Hardening & CSRF Defense',
        description: 'Double-submit cookie patterns, SameSite flags, and cryptographic token verification.',
        category: 'invariants',
        levelExpectations: {
          1: 'Configures HttpOnly, Secure, and SameSite=Lax cookie attributes on session tokens.',
          2: 'Implements double-submit CSRF tokens and synchronizer token patterns with timing-safe checks.',
          3: 'Architects stateless JWT session revocation lists with sliding-window refresh token rotation.',
        },
        relevantRounds: ['approach', 'coding', 'project', 'interview'],
        weight: 25,
      },
      {
        id: 'ws_ssrf_boundary',
        name: 'Server-Side Request Forgery (SSRF) Defense',
        description: 'Validating external resource fetch URLs and blocking internal loopback interfaces.',
        category: 'invariants',
        levelExpectations: {
          1: 'Blocks direct fetch requests targeting 127.0.0.1 and localhost addresses.',
          2: 'Resolves DNS before request dispatch and filters private RFC-1918 IPv4/IPv6 address blocks.',
          3: 'Prevents DNS rebinding and TOCTOU vulnerabilities through isolated egress proxy gateways.',
        },
        relevantRounds: ['knowledge', 'approach', 'project', 'interview'],
        weight: 20,
      },
      {
        id: 'ws_appsec_reasoning',
        name: 'Threat Modeling & Defensive Architecture',
        description: 'Applying defense-in-depth principles and reasoning about attack surface reduction.',
        category: 'reasoning',
        levelExpectations: {
          1: 'Explains OWASP Top 10 categories and fundamental client-vs-server trust boundaries.',
          2: 'Conducts threat modeling on authentication gateways and evaluates authorization bypasses.',
          3: 'Defends zero-trust API architecture against parameter tampering, replay attacks, and IDOR vectors.',
        },
        relevantRounds: ['approach', 'interview'],
        weight: 15,
      },
    ],
  },

  // 6. Cybersecurity — Cryptography
  'cryptography': {
    domainId: 'cybersecurity',
    skillId: 'cryptography',
    skillName: 'Cryptography',
    competencies: [
      {
        id: 'crypto_symmetric',
        name: 'Symmetric Ciphers & Authenticated Encryption',
        description: 'AES-GCM, ChaCha20-Poly1305, IV/nonce uniqueness, and ciphertext authentication.',
        category: 'core',
        levelExpectations: {
          1: 'Encrypts and decrypts payload buffers using AES-256-GCM with authentication tags.',
          2: 'Guarantees nonce/IV uniqueness per encryption key to prevent catastrophic GCM tag forgery.',
          3: 'Engineers authenticated streaming encryption routines with chunk-level integrity verification.',
        },
        relevantRounds: ['knowledge', 'coding', 'project'],
        weight: 25,
      },
      {
        id: 'crypto_asymmetric',
        name: 'Asymmetric Key Exchange & Public Key Infrastructure',
        description: 'RSA-OAEP, Elliptic Curve Diffie-Hellman (ECDH), and X.509 certificate chains.',
        category: 'core',
        levelExpectations: {
          1: 'Generates RSA/ECDSA keypairs and verifies public key signatures.',
          2: 'Implements ECDH key exchange with ephemeral keys and validates X.509 certificate chains.',
          3: 'Designs hybrid cryptosystems with perfect forward secrecy and resistance to downgrade attacks.',
        },
        relevantRounds: ['knowledge', 'project', 'interview'],
        weight: 20,
      },
      {
        id: 'crypto_hashing',
        name: 'Cryptographic Hashing & Key Derivation',
        description: 'SHA-256, HMAC authentication, and salted password hashing (Argon2id, bcrypt).',
        category: 'invariants',
        levelExpectations: {
          1: 'Computes SHA-256 digests and hashes user passwords with salted bcrypt.',
          2: 'Uses HMAC-SHA256 for message integrity and tunes Argon2id memory/time parameters.',
          3: 'Implements HKDF (HMAC-based Key Derivation Function) with explicit context info strings.',
        },
        relevantRounds: ['knowledge', 'coding', 'project'],
        weight: 20,
      },
      {
        id: 'crypto_timing_attacks',
        name: 'Side-Channel & Timing Attack Defense',
        description: 'Using constant-time comparison primitives and preventing timing leakage in verification.',
        category: 'invariants',
        levelExpectations: {
          1: 'Uses timingSafeEqual instead of standard equality operators for signature checking.',
          2: 'Audits modular arithmetic implementations for variable-time execution branches.',
          3: 'Protects cryptographic secret state from cache-timing and speculative execution leakage.',
        },
        relevantRounds: ['approach', 'coding', 'interview'],
        weight: 20,
      },
      {
        id: 'crypto_protocol_reasoning',
        name: 'Cryptographic Security & Invariant Reasoning',
        description: 'Defending protocol choices, assessing entropy, and evaluating cipher lifespan.',
        category: 'reasoning',
        levelExpectations: {
          1: 'Explains why deprecated algorithms like MD5 and DES must never be used.',
          2: 'Analyzes forward secrecy guarantees and justifies chosen key bit-lengths.',
          3: 'Defends zero-knowledge protocol proofs and post-quantum algorithm migration strategies.',
        },
        relevantRounds: ['approach', 'interview'],
        weight: 15,
      },
    ],
  },

  // 7. Data Science — Python & SQL
  'python-sql': {
    domainId: 'data-science',
    skillId: 'python-sql',
    skillName: 'Python & SQL',
    competencies: [
      {
        id: 'psql_relational_queries',
        name: 'Complex Relational Joins & Aggregations',
        description: 'INNER, LEFT, FULL joins, GROUP BY multi-column grouping, and HAVING filters.',
        category: 'core',
        levelExpectations: {
          1: 'Writes multi-table INNER and LEFT joins with aggregate functions (SUM, AVG, COUNT).',
          2: 'Constructs complex subqueries, self-joins, and conditional aggregations with CASE WHEN.',
          3: 'Optimizes multi-stage CTE query pipelines avoiding Cartesian fanouts on billion-row tables.',
        },
        relevantRounds: ['knowledge', 'coding', 'project'],
        weight: 25,
      },
      {
        id: 'psql_window_functions',
        name: 'Analytical SQL Window Functions',
        description: 'PARTITION BY, ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG, and rolling frames.',
        category: 'core',
        levelExpectations: {
          1: 'Applies ROW_NUMBER and RANK over ordered partitions.',
          2: 'Calculates rolling averages and period-over-period growth using LEAD, LAG, and sliding frames.',
          3: 'Customizes cumulative sum partitions and sessionization logic over irregular temporal events.',
        },
        relevantRounds: ['knowledge', 'coding', 'project'],
        weight: 25,
      },
      {
        id: 'psql_dataframe_wrangling',
        name: 'Pandas Dataframe Ingestion & Transformation',
        description: 'Vectorized filtering, merging, pivoting, melting, and datetime handling.',
        category: 'core',
        levelExpectations: {
          1: 'Loads CSV/SQL records into DataFrames and performs basic slicing and filtering.',
          2: 'Performs merge operations with validation flags, pivot tables, and multi-index aggregations.',
          3: 'Optimizes DataFrame memory footprint with categorical dtypes and chunked iterator pipelines.',
        },
        relevantRounds: ['coding', 'project'],
        weight: 20,
      },
      {
        id: 'psql_query_optimization',
        name: 'Query Plan Optimization & Indexing',
        description: 'EXPLAIN ANALYZE interpretation, B-Tree vs GIN indexes, and partition pruning.',
        category: 'invariants',
        levelExpectations: {
          1: 'Identifies full table scans vs index lookups in query explain outputs.',
          2: 'Designs composite B-Tree indexes matching WHERE and ORDER BY query predicates.',
          3: 'Eliminates nested loop spills to disk, resolves buffer cache misses, and configures table partitioning.',
        },
        relevantRounds: ['approach', 'project', 'interview'],
        weight: 15,
      },
      {
        id: 'psql_analytical_reasoning',
        name: 'Data Integrity & Business Logic Reasoning',
        description: 'Validating cohort metrics, reconciling discrepancies, and defending metric definitions.',
        category: 'reasoning',
        levelExpectations: {
          1: 'Explains null handling differences between COUNT(*) and COUNT(column).',
          2: 'Defends cohort retention formulas and reconciles conflicting customer lifetime value aggregations.',
          3: 'Audits transaction isolation levels, concurrency anomalies, and read-replica replication lag.',
        },
        relevantRounds: ['approach', 'interview'],
        weight: 15,
      },
    ],
  },

  // 8. Data Science — Statistics
  'statistics': {
    domainId: 'data-science',
    skillId: 'statistics',
    skillName: 'Statistics',
    competencies: [
      {
        id: 'stat_descriptive',
        name: 'Descriptive Distributions & Variability',
        description: 'Central tendency, variance, skewness, kurtosis, and Central Limit Theorem.',
        category: 'core',
        levelExpectations: {
          1: 'Calculates mean, median, IQR, and explains when median is superior to mean for skewed data.',
          2: 'Evaluates empirical probability distributions and demonstrates Central Limit Theorem convergence.',
          3: 'Models heavy-tailed distributions, Pareto frontiers, and multivariate covariance matrices.',
        },
        relevantRounds: ['knowledge', 'coding', 'project'],
        weight: 20,
      },
      {
        id: 'stat_hypothesis_testing',
        name: 'Hypothesis Testing & Statistical Inference',
        description: 'Two-sample t-tests, Welch tests, ANOVA, Chi-Square, and p-value interpretations.',
        category: 'core',
        levelExpectations: {
          1: 'Sets null and alternative hypotheses, computes two-sample t-tests, and checks alpha thresholds.',
          2: 'Conducts Welch t-tests for unequal variance and one-way ANOVA with post-hoc Tukey tests.',
          3: 'Applies Bonferroni/FDR multiple testing adjustments and interprets exact permutation test distributions.',
        },
        relevantRounds: ['knowledge', 'coding', 'project', 'interview'],
        weight: 25,
      },
      {
        id: 'stat_bootstrap_bayesian',
        name: 'Resampling & Bayesian Inference',
        description: 'Non-parametric bootstrapping, posterior distributions, conjugate priors, and credible intervals.',
        category: 'advanced',
        levelExpectations: {
          1: 'Calculates standard normal confidence intervals for population parameters.',
          2: 'Generates non-parametric bootstrap confidence intervals without parametric assumptions.',
          3: 'Computes Bayesian parameter updating with Beta-Binomial / Normal-Normal conjugate priors.',
        },
        relevantRounds: ['coding', 'project', 'interview'],
        weight: 20,
      },
      {
        id: 'stat_causal_invariants',
        name: 'Causal Invariants & Confounder Control',
        description: 'Controlling for selection bias, Simpson paradox, and omitted variable bias.',
        category: 'invariants',
        levelExpectations: {
          1: 'Distinguishes correlation from causation in observational datasets.',
          2: 'Identifies Simpson paradox in aggregated subgroups and controls for confounding covariates.',
          3: 'Formulates propensity score matching and difference-in-differences causal estimators.',
        },
        relevantRounds: ['approach', 'project', 'interview'],
        weight: 20,
      },
      {
        id: 'stat_inferential_reasoning',
        name: 'Statistical Power & Decision Reasoning',
        description: 'Type I and Type II errors, sample size power calculations, and decision thresholds.',
        category: 'reasoning',
        levelExpectations: {
          1: 'Explains false positives (Type I) vs false negatives (Type II) in test decisions.',
          2: 'Conducts statistical power calculations to determine required sample size for minimum detectable effect.',
          3: 'Defends sequential testing frameworks (SPRT) avoiding p-hacking in continuous experimentation.',
        },
        relevantRounds: ['approach', 'interview'],
        weight: 15,
      },
    ],
  },

  // 9. Data Science — Data Analysis & Visualization
  'data-analysis-visualization': {
    domainId: 'data-science',
    skillId: 'data-analysis-visualization',
    skillName: 'Data Analysis & Visualization',
    competencies: [
      {
        id: 'dav_chart_selection',
        name: 'Perceptual Chart Selection & Encodings',
        description: 'Selecting visual encodings (position, length, color) matching data types.',
        category: 'core',
        levelExpectations: {
          1: 'Selects appropriate bar, line, and scatter charts matching discrete and continuous variables.',
          2: 'Implements faceted small multiples, box-and-whisker plots, and cumulative distribution curves.',
          3: 'Avoids visual hazards (dual-axis distortion, 3D charts, uncalibrated rainbow colormaps).',
        },
        relevantRounds: ['knowledge', 'project'],
        weight: 20,
      },
      {
        id: 'dav_eda_correlation',
        name: 'Exploratory Analysis & Correlation Modeling',
        description: 'Correlation heatmaps, pairplots, missingness matrices, and trend lines.',
        category: 'core',
        levelExpectations: {
          1: 'Generates correlation matrices and interprets Pearson vs Spearman correlation coefficients.',
          2: 'Constructs faceted pair plots and identifies non-linear bivariate clustering patterns.',
          3: 'Applies dimensionality reduction projections (t-SNE/UMAP) for high-dimensional visual clustering.',
        },
        relevantRounds: ['knowledge', 'coding', 'project'],
        weight: 25,
      },
      {
        id: 'dav_dashboard_architecture',
        name: 'Dashboard Architecture & Interactivity',
        description: 'Structuring KPI summaries, interactive filter controls, and hierarchy.',
        category: 'architectural',
        levelExpectations: {
          1: 'Builds static tabular summaries with clean typographic layout and visual hierarchy.',
          2: 'Constructs multi-view interactive dashboards with coordinated filter states and date range controls.',
          3: 'Optimizes visual rendering performance for streaming real-time sensor and time-series telemetry.',
        },
        relevantRounds: ['approach', 'project'],
        weight: 20,
      },
      {
        id: 'dav_data_storytelling',
        name: 'Executive Storytelling & Insight Synthesis',
        description: 'Extracting unambiguous business conclusions backed by visual evidence.',
        category: 'reasoning',
        levelExpectations: {
          1: 'Summarizes key trends and outliers in written dashboard callouts.',
          2: 'Synthesizes actionable strategic insights from multi-dimensional cohort performance.',
          3: 'Presents risk trade-offs and confidence intervals to non-technical executive stakeholders.',
        },
        relevantRounds: ['approach', 'interview'],
        weight: 20,
      },
      {
        id: 'dav_visual_integrity',
        name: 'Visual Integrity & Truthful Baselines',
        description: 'Preserving zero baselines, proportional scale ink ratios, and honest visual axes.',
        category: 'invariants',
        levelExpectations: {
          1: 'Ensures bar charts always anchor at zero to prevent truncated perspective distortion.',
          2: 'Normalizes population scales (per capita / percentages) before geographic chloropleth mapping.',
          3: 'Defends visual encoding integrity against cherry-picked time intervals and survivorship bias.',
        },
        relevantRounds: ['interview'],
        weight: 15,
      },
    ],
  },

  // 10. DSA — Arrays & Strings
  'arrays-strings': {
    domainId: 'dsa',
    skillId: 'arrays-strings',
    skillName: 'Arrays & Strings',
    competencies: [
      {
        id: 'as_two_pointers',
        name: 'Two-Pointer Algorithms & In-Place Mutation',
        description: 'Opposite-direction and same-direction two-pointer patterns with O(1) auxiliary space.',
        category: 'core',
        levelExpectations: {
          1: 'Solves two-sum sorted arrays and in-place array element removals using two pointers.',
          2: 'Implements three-sum duplicate avoidance and trapped rainwater two-pointer boundaries.',
          3: 'Extends two-pointer invariants to multi-way partitioning and Dutch National Flag optimizations.',
        },
        relevantRounds: ['knowledge', 'coding', 'project'],
        weight: 25,
      },
      {
        id: 'as_sliding_window',
        name: 'Sliding Window Dynamics',
        description: 'Fixed and variable window boundaries, frequency hash tracking, and contraction invariants.',
        category: 'core',
        levelExpectations: {
          1: 'Computes maximum sum of contiguous subarrays of fixed size K.',
          2: 'Finds longest substring without repeating characters and minimum window substring.',
          3: 'Optimizes sliding window state with monotonic deques and bitmask character frequency sets.',
        },
        relevantRounds: ['knowledge', 'coding', 'project', 'interview'],
        weight: 25,
      },
      {
        id: 'as_prefix_sums',
        name: 'Prefix Sums & Difference Arrays',
        description: 'O(1) range sum queries, 2D prefix sums, and difference array range updates.',
        category: 'core',
        levelExpectations: {
          1: 'Builds 1D prefix sum arrays to answer subarray sum queries in O(1) time.',
          2: 'Applies prefix sums with hash maps to find count of subarrays summing to target K.',
          3: 'Implements 2D matrix prefix sums and difference arrays for bulk interval operations.',
        },
        relevantRounds: ['knowledge', 'coding', 'project'],
        weight: 20,
      },
      {
        id: 'as_complexity_bounds',
        name: 'Time-Space Complexity Bounds & Invariants',
        description: 'Strict O(N) execution guarantees and auxiliary space minimization.',
        category: 'invariants',
        levelExpectations: {
          1: 'Identifies nested loops resulting in O(N^2) time and reduces to O(N).',
          2: 'Proves O(N) amortized time complexity where each element is added and removed at most once.',
          3: 'Guarantees O(1) auxiliary space by mutating buffers in-place without dynamic heap reallocation.',
        },
        relevantRounds: ['approach', 'coding', 'project', 'interview'],
        weight: 15,
      },
      {
        id: 'as_algorithmic_reasoning',
        name: 'Boundary Handling & Algorithmic Defense',
        description: 'Zero-length inputs, single-character strings, overflow handling, and pattern proof.',
        category: 'reasoning',
        levelExpectations: {
          1: 'Safeguards against empty strings and out-of-bounds pointer increments.',
          2: 'Justifies why sliding window is applicable based on monotonicity of window validity.',
          3: 'Proves correctness of pattern matching algorithms (KMP / Rabin-Karp) against worst-case adversary inputs.',
        },
        relevantRounds: ['approach', 'interview'],
        weight: 15,
      },
    ],
  },

  // 11. DSA — Trees & Graphs
  'trees-graphs': {
    domainId: 'dsa',
    skillId: 'trees-graphs',
    skillName: 'Trees & Graphs',
    competencies: [
      {
        id: 'tg_tree_traversals',
        name: 'Tree Traversals & Invariant Verification',
        description: 'DFS (Pre/In/Post-order) and BFS Level-order traversals over hierarchical structures.',
        category: 'core',
        levelExpectations: {
          1: 'Implements recursive DFS and queue-based BFS level-order traversals on binary trees.',
          2: 'Validates Binary Search Tree invariants and computes Lowest Common Ancestor efficiently.',
          3: 'Executes Morris In-order traversal achieving O(1) auxiliary space without recursion stack.',
        },
        relevantRounds: ['knowledge', 'coding', 'project'],
        weight: 20,
      },
      {
        id: 'tg_graph_connectivity',
        name: 'Graph Connectivity & Cycle Detection',
        description: 'Adjacency representations, connected components, cycle detection, and topological sorting.',
        category: 'core',
        levelExpectations: {
          1: 'Represents graphs using adjacency lists and identifies connected components with BFS/DFS.',
          2: 'Detects directed cycles using 3-color DFS states and implements Kahn topological sort.',
          3: 'Computes Strongly Connected Components with Tarjan/Kosaraju algorithms and bridges/articulation points.',
        },
        relevantRounds: ['knowledge', 'coding', 'project', 'interview'],
        weight: 25,
      },
      {
        id: 'tg_shortest_paths',
        name: 'Shortest Path & Heuristic Navigation',
        description: 'Dijkstra with min-heaps, Bellman-Ford, and A* heuristic pathfinding.',
        category: 'advanced',
        levelExpectations: {
          1: 'Computes unweighted shortest paths using queue-based Breadth-First Search.',
          2: 'Implements Dijkstra algorithm using priority queues on non-negative weighted graphs.',
          3: 'Engineers A* heuristic search with admissible heuristics and audits Bellman-Ford negative cycles.',
        },
        relevantRounds: ['coding', 'project', 'interview'],
        weight: 20,
      },
      {
        id: 'tg_visited_invariants',
        name: 'Visited-State Tracking & Memory Invariants',
        description: 'Preventing infinite loops in cyclical graphs and managing recursion stack depth.',
        category: 'invariants',
        levelExpectations: {
          1: 'Uses visited boolean arrays or sets to prevent re-processing nodes.',
          2: 'Manages recursion depth limits and avoids stack overflow by converting to iterative DFS with stacks.',
          3: 'Optimizes visited state representations using bitsets and Union-Find with path compression.',
        },
        relevantRounds: ['approach', 'coding', 'project', 'interview'],
        weight: 20,
      },
      {
        id: 'tg_graph_reasoning',
        name: 'Data Structure Selection & Trade-off Defense',
        description: 'Choosing between adjacency matrix vs list, BFS vs DFS, and explaining Big-O bounds.',
        category: 'reasoning',
        levelExpectations: {
          1: 'Explains time and space complexity of BFS and DFS in terms of V (vertices) and E (edges).',
          2: 'Defends why adjacency lists are optimal for sparse graphs while matrices suit dense graphs.',
          3: 'Justifies heuristic selection in A* search and explains complexity degradation under non-admissible heuristics.',
        },
        relevantRounds: ['approach', 'interview'],
        weight: 15,
      },
    ],
  },

  // 12. DSA — Dynamic Programming
  'dynamic-programming': {
    domainId: 'dsa',
    skillId: 'dynamic-programming',
    skillName: 'Dynamic Programming',
    competencies: [
      {
        id: 'dp_state_formulation',
        name: 'State Definition & Transition Relations',
        description: 'Identifying optimal substructure and formulating recursive state transition equations.',
        category: 'core',
        levelExpectations: {
          1: 'Formulates 1D state relations (Fibonacci, Climbing Stairs, House Robber).',
          2: 'Defines 2D state transitions (0/1 Knapsack, Longest Common Subsequence, Edit Distance).',
          3: 'Formulates multi-dimensional states with bitmasks (Traveling Salesperson) and interval transitions.',
        },
        relevantRounds: ['approach', 'coding', 'project', 'interview'],
        weight: 25,
      },
      {
        id: 'dp_memoization_tabulation',
        name: 'Memoization vs Iterative Tabulation',
        description: 'Top-down memoized recursion vs bottom-up iterative table construction.',
        category: 'core',
        levelExpectations: {
          1: 'Applies hash-map or array memoization to prune overlapping branches in recursive calls.',
          2: 'Converts top-down memoization to bottom-up iterative tabulation eliminating call-stack overhead.',
          3: 'Solves complex cyclic dependencies using topological ordering of DP states.',
        },
        relevantRounds: ['knowledge', 'coding', 'project'],
        weight: 25,
      },
      {
        id: 'dp_space_optimization',
        name: 'Auxiliary Space Optimization',
        description: 'Reducing multi-dimensional DP tables to 1D rolling arrays.',
        category: 'invariants',
        levelExpectations: {
          1: 'Reduces 1D DP arrays to two variables when state only depends on previous two elements.',
          2: 'Optimizes 2D Knapsack / Grid tables into single 1D rolling buffers iterated in reverse order.',
          3: 'Applies Hirschberg algorithm or divide-and-conquer space reduction to reconstruct solutions in O(min(M, N)).',
        },
        relevantRounds: ['approach', 'coding', 'project', 'interview'],
        weight: 20,
      },
      {
        id: 'dp_boundary_initialization',
        name: 'Base Case & Boundary Initialization',
        description: 'Setting neutral elements, infinity guards, and preventing out-of-bounds transitions.',
        category: 'invariants',
        levelExpectations: {
          1: 'Correctly initializes base cases (dp[0] = 0 or 1).',
          2: 'Initializes minimization arrays with Infinity and guards against integer overflow on addition.',
          3: 'Ensures boundary constraints handle non-standard starting states and invalid transitions robustly.',
        },
        relevantRounds: ['coding', 'project'],
        weight: 15,
      },
      {
        id: 'dp_complexity_reasoning',
        name: 'Overlapping Subproblem & Complexity Proof',
        description: 'Proving optimal substructure, calculating state-space size, and defending complexity.',
        category: 'reasoning',
        levelExpectations: {
          1: 'Explains why a problem exhibits overlapping subproblems rather than simple divide-and-conquer.',
          2: 'Calculates overall time complexity as (Number of States) * (Work per State).',
          3: 'Proves why greedy algorithms fail on non-matroid problems where dynamic programming is strictly required.',
        },
        relevantRounds: ['approach', 'interview'],
        weight: 15,
      },
    ],
  },

  // 13. Web Development — HTML, CSS & JavaScript
  'html-css-javascript': {
    domainId: 'web-development',
    skillId: 'html-css-javascript',
    skillName: 'HTML, CSS & JavaScript',
    competencies: [
      {
        id: 'hcj_semantic_dom',
        name: 'Semantic DOM & Accessibility',
        description: 'HTML5 semantic landmarks, ARIA attributes, and accessible keyboard navigation.',
        category: 'core',
        levelExpectations: {
          1: 'Uses semantic tags (<main>, <section>, <nav>, <article>) instead of unsemantic <div>soup.',
          2: 'Implements accessible focus management, ARIA roles, and keyboard navigation traps.',
          3: 'Engineers WCAG 2.1 AAA accessible custom widgets with live region announcements.',
        },
        relevantRounds: ['knowledge', 'coding', 'project'],
        weight: 20,
      },
      {
        id: 'hcj_modern_css',
        name: 'CSS Layout Systems & Responsive Mechanics',
        description: 'CSS Grid, Flexbox, media queries, CSS variables, and layout reflow minimization.',
        category: 'core',
        levelExpectations: {
          1: 'Builds responsive mobile-first layouts using Flexbox and CSS media queries.',
          2: 'Creates two-dimensional CSS Grid layouts with auto-fit, minmax, and CSS custom properties.',
          3: 'Optimizes critical rendering path, prevents cumulative layout shift (CLS), and avoids reflow thrashing.',
        },
        relevantRounds: ['coding', 'project'],
        weight: 25,
      },
      {
        id: 'hcj_async_event_loop',
        name: 'Asynchronous JavaScript & Event Loop',
        description: 'Promises, async/await, microtasks vs macrotasks, and debouncing/throttling.',
        category: 'core',
        levelExpectations: {
          1: 'Consumes fetch APIs using async/await with try/catch error boundaries.',
          2: 'Explains execution ordering between Promises (microtasks) and setTimeout/DOM events (macrotasks).',
          3: 'Implements custom debounce/throttle higher-order functions and AbortController cancellation.',
        },
        relevantRounds: ['knowledge', 'coding', 'project', 'interview'],
        weight: 25,
      },
      {
        id: 'hcj_memory_dom_invariants',
        name: 'Event Delegation & Memory Leak Mitigation',
        description: 'Event bubbling/capturing, delegation on parent nodes, and detached DOM reference cleanup.',
        category: 'invariants',
        levelExpectations: {
          1: 'Uses event delegation on parent containers instead of attaching listeners to hundreds of child nodes.',
          2: 'Cleans up event listeners and intervals to prevent closure-based memory leaks.',
          3: 'Profiles memory heap snapshots in Chrome DevTools to eliminate detached DOM tree retention.',
        },
        relevantRounds: ['approach', 'coding', 'interview'],
        weight: 15,
      },
      {
        id: 'hcj_runtime_reasoning',
        name: 'Browser Runtime & Performance Reasoning',
        description: 'Explaining JavaScript prototype chains, scope closures, and rendering pipeline trade-offs.',
        category: 'reasoning',
        levelExpectations: {
          1: 'Explains lexical scope, variable hoisting with let/const, and closures.',
          2: 'Defends rendering performance optimizations (transform/opacity hardware acceleration vs top/left).',
          3: 'Analyzes Service Worker offline caching strategies and Web Worker multi-threaded execution.',
        },
        relevantRounds: ['approach', 'interview'],
        weight: 15,
      },
    ],
  },

  // 14. Web Development — React
  'react': {
    domainId: 'web-development',
    skillId: 'react',
    skillName: 'React',
    competencies: [
      {
        id: 'react_state_architecture',
        name: 'Component State & Data Flow Architecture',
        description: 'Unidirectional data flow, controlled components, state lifting, and immutable state updates.',
        category: 'core',
        levelExpectations: {
          1: 'Manages component state with useState and handles props immutability.',
          2: 'Lifts shared state appropriately and implements useReducer for complex multi-action state machines.',
          3: 'Designs atomic state architectures avoiding unnecessary provider re-renders in global state.',
        },
        relevantRounds: ['knowledge', 'coding', 'project'],
        weight: 25,
      },
      {
        id: 'react_lifecycle_effects',
        name: 'Lifecycle Synchronization & Custom Hooks',
        description: 'useEffect dependency arrays, cleanup functions, and composable custom hook abstractions.',
        category: 'core',
        levelExpectations: {
          1: 'Uses useEffect for data fetching and implements cleanup functions for intervals/listeners.',
          2: 'Builds reusable custom hooks encapsulating business logic and event subscription state.',
          3: 'Mitigates race conditions in asynchronous effects using AbortController and active boolean flags.',
        },
        relevantRounds: ['knowledge', 'coding', 'project', 'interview'],
        weight: 25,
      },
      {
        id: 'react_render_optimization',
        name: 'Render Performance & Referential Equality',
        description: 'useMemo, useCallback, React.memo, and virtualized list rendering.',
        category: 'invariants',
        levelExpectations: {
          1: 'Explains why components re-render and avoids defining components inside other components.',
          2: 'Applies React.memo, useMemo, and useCallback to preserve object and function referential equality.',
          3: 'Profiles component render trees and implements virtualized rendering for large collections.',
        },
        relevantRounds: ['approach', 'coding', 'project', 'interview'],
        weight: 20,
      },
      {
        id: 'react_error_resilience',
        name: 'Error Boundaries & Concurrent Features',
        description: 'Class/functional error boundaries, fallback UI states, Suspense, and transitions.',
        category: 'architectural',
        levelExpectations: {
          1: 'Renders loading spinners and descriptive error alerts on failed asynchronous fetches.',
          2: 'Implements Error Boundary components catching child runtime exceptions gracefully.',
          3: 'Incorporates React 18 Concurrent features (useTransition, useDeferredValue) for urgent vs non-urgent updates.',
        },
        relevantRounds: ['approach', 'project'],
        weight: 15,
      },
      {
        id: 'react_architectural_reasoning',
        name: 'Composition & Architectural Defense',
        description: 'Compound components, render props vs hooks, and scalability justifications.',
        category: 'reasoning',
        levelExpectations: {
          1: 'Explains differences between props and internal component state.',
          2: 'Justifies component decomposition into presentational and container abstractions.',
          3: 'Defends compound component patterns and evaluates Server Components vs Client Components trade-offs.',
        },
        relevantRounds: ['approach', 'interview'],
        weight: 15,
      },
    ],
  },

  // 15. Web Development — Backend & REST APIs
  'backend-rest-apis': {
    domainId: 'web-development',
    skillId: 'backend-rest-apis',
    skillName: 'Backend & REST APIs',
    competencies: [
      {
        id: 'api_rest_design',
        name: 'RESTful Resource Modeling & HTTP Verbs',
        description: 'Resource hierarchies, idempotency of GET/PUT/DELETE, and standard status codes.',
        category: 'core',
        levelExpectations: {
          1: 'Designs CRUD endpoints using correct HTTP verbs and status codes (200, 201, 204, 400, 404).',
          2: 'Models nested resource hierarchies, query filtering parameters, and pagination cursors.',
          3: 'Enforces strict REST idempotency keys for payment/mutation endpoints and HATEOAS navigability.',
        },
        relevantRounds: ['knowledge', 'coding', 'project'],
        weight: 25,
      },
      {
        id: 'api_middleware_architecture',
        name: 'Middleware Pipelines & Validation',
        description: 'Express middleware chains, schema validation, and centralized error handlers.',
        category: 'core',
        levelExpectations: {
          1: 'Chains body parser and logging middleware and handles 404 not-found routes.',
          2: 'Implements schema-based request validation middleware and centralized asynchronous error handlers.',
          3: 'Builds modular pipeline chains with distributed tracing headers (correlation IDs) and telemetry.',
        },
        relevantRounds: ['knowledge', 'coding', 'project'],
        weight: 20,
      },
      {
        id: 'api_auth_security',
        name: 'Authentication & Perimeter Defense',
        description: 'JWT bearer tokens, role-based access control (RBAC), and rate limiting.',
        category: 'invariants',
        levelExpectations: {
          1: 'Verifies Bearer authentication tokens in incoming Authorization headers.',
          2: 'Implements role-based authorization middleware (RBAC) and IP rate limiting with sliding windows.',
          3: 'Architects OAuth 2.0 token introspection, PKCE verification, and distributed Redis rate limiters.',
        },
        relevantRounds: ['approach', 'coding', 'project', 'interview'],
        weight: 25,
      },
      {
        id: 'api_resilience_scaling',
        name: 'Concurrency, Transactions & Resilience',
        description: 'Database transactions, connection pooling, graceful shutdowns, and circuit breakers.',
        category: 'invariants',
        levelExpectations: {
          1: 'Connects to persistence layers using connection pooling with environment configurations.',
          2: 'Executes multi-step mutations within atomic database transactions with rollback safeguards.',
          3: 'Implements graceful shutdown signal traps (SIGTERM/SIGINT) and circuit breakers for external dependencies.',
        },
        relevantRounds: ['approach', 'project', 'interview'],
        weight: 15,
      },
      {
        id: 'api_architectural_reasoning',
        name: 'Backend System Architecture & Trade-offs',
        description: 'Monolith vs microservices, caching strategies, and horizontal scaling justifications.',
        category: 'reasoning',
        levelExpectations: {
          1: 'Explains why synchronous blocking operations freeze the single-threaded Node.js event loop.',
          2: 'Defends layered architecture (Routes -> Controllers -> Services -> Repositories).',
          3: 'Justifies database indexing, caching strategies (Cache-Aside with Redis), and scaling to 10k req/sec.',
        },
        relevantRounds: ['approach', 'interview'],
        weight: 15,
      },
    ],
  },
};

/**
 * Retrieve the predefined competency profile for a given skill.
 */
export function getCompetencyProfile(skillId: string): SkillCompetencyProfile {
  const norm = skillId.toLowerCase().trim();
  const profile = COMPETENCY_PROFILES[norm];
  if (profile) return profile;

  // Fallback profile if an exact slug match is not found
  return {
    domainId: 'general',
    skillId: norm,
    skillName: norm,
    competencies: [
      {
        id: `${norm}_core`,
        name: 'Core Practical Implementation',
        description: 'Applies fundamental domain primitives and delivers functional solutions.',
        category: 'core',
        levelExpectations: {
          1: 'Solves baseline functional requirements.',
          2: 'Integrates multiple constraints and optimizations.',
          3: 'Engineers resilient, production-ready architectures.',
        },
        relevantRounds: ['knowledge', 'coding', 'project'],
        weight: 30,
      },
      {
        id: `${norm}_invariants`,
        name: 'Boundary & Invariant Safeguards',
        description: 'Protects against edge-case failures, invalid states, and resource exhaustion.',
        category: 'invariants',
        levelExpectations: {
          1: 'Handles common boundary conditions.',
          2: 'Enforces defensive state validation.',
          3: 'Guarantees formal invariant preservation under adversarial inputs.',
        },
        relevantRounds: ['approach', 'coding', 'project', 'interview'],
        weight: 25,
      },
      {
        id: `${norm}_reasoning`,
        name: 'Technical Reasoning & Trade-off Defense',
        description: 'Explains architectural decisions and demonstrates authentic subject mastery.',
        category: 'reasoning',
        levelExpectations: {
          1: 'Explains chosen approach simply.',
          2: 'Justifies trade-offs between alternative designs.',
          3: 'Defends scaling limits, complexity, and systems interactions.',
        },
        relevantRounds: ['approach', 'interview'],
        weight: 25,
      },
      {
        id: `${norm}_quality`,
        name: 'Code & Deliverable Quality',
        description: 'Adheres to industry conventions, readability, and testing standards.',
        category: 'architectural',
        levelExpectations: {
          1: 'Writes readable, formatted code.',
          2: 'Adheres to modular structure and test coverage.',
          3: 'Implements maintainable enterprise patterns with rigorous assertions.',
        },
        relevantRounds: ['coding', 'project'],
        weight: 20,
      },
    ],
  };
}
