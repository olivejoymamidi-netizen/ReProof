export interface ProjectRubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number; // percentage weight, sums to 100
  benchmarkLevel: string;
}

export interface ProjectSpecification {
  id: string;
  domainId: string;
  skillId: string;
  levelNumber: number;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  problemStatement: string;
  objective: string;
  requirements: string[];
  constraints: string[];
  expectedFunctionality: string[];
  expectedDeliverables: string[];
  starterCode: string;
  starterFileName: string;
  rubricCriteria: ProjectRubricCriterion[];
  evaluationCriteria?: ProjectRubricCriterion[];
}

function buildProjectBank(): ProjectSpecification[] {
  const bank: ProjectSpecification[] = [];

  const addProj = (
    domainId: string,
    skillId: string,
    levelNumber: number,
    title: string,
    problemStatement: string,
    objective: string,
    requirements: string[],
    constraints: string[],
    expectedFunctionality: string[],
    expectedDeliverables: string[],
    starterFileName: string,
    starterCode: string,
    rubricCriteria: ProjectRubricCriterion[]
  ) => {
    const difficulty =
      levelNumber === 1 ? 'Beginner' : levelNumber === 2 ? 'Intermediate' : 'Advanced';

    bank.push({
      id: `proj_${domainId}_${skillId}_L${levelNumber}`,
      domainId,
      skillId,
      levelNumber,
      title,
      difficulty,
      problemStatement,
      objective,
      requirements,
      constraints,
      expectedFunctionality,
      expectedDeliverables,
      starterFileName,
      starterCode,
      rubricCriteria,
      evaluationCriteria: rubricCriteria,
    });
  };

  const standardRubric = (skillName: string, level: number): ProjectRubricCriterion[] => [
    {
      id: 'crit_correctness',
      name: 'Technical Correctness & Functionality',
      description: `Verifies that the implementation correctly fulfills all core behavioral benchmarks and produces valid outputs for ${skillName}.`,
      weight: 35,
      benchmarkLevel: `Level 0${level}`,
    },
    {
      id: 'crit_quality',
      name: 'Code Quality & Structural Idioms',
      description: 'Evaluates modularity, readability, idiomatic idioms, clean error handling, and separation of concerns.',
      weight: 25,
      benchmarkLevel: `Level 0${level}`,
    },
    {
      id: 'crit_constraints',
      name: 'Constraint Adherence & Edge Cases',
      description: 'Measures adherence to explicit runtime, memory, security, or algorithmic constraints under boundary conditions.',
      weight: 25,
      benchmarkLevel: `Level 0${level}`,
    },
    {
      id: 'crit_architecture',
      name: 'Technical Rationale & Architecture',
      description: 'Assesses the clarity of submitted architecture explanations, trade-off awareness, and maintainability.',
      weight: 15,
      benchmarkLevel: `Level 0${level}`,
    },
  ];

  // =========================================================================
  // 1. AI / ML
  // =========================================================================

  // 1.1 Python for ML
  addProj('ai-ml', 'python-for-ml', 1,
    'Vectorized Sensor Telemetry Normalizer',
    'A battery of IoT temperature and vibration sensors transmits raw 2D NumPy streams with fluctuating offsets and missing baseline calibrations. You must implement an in-memory normalization harness using vectorized NumPy operations without Python loops.',
    'Build a robust NumPy data-processing and feature normalization module that scales raw multi-channel telemetry into unit variance while filtering anomalous spikes.',
    [
      'Load or accept an arbitrary 2D float64 array of shape (N_samples, M_sensors)',
      'Vectorized computation of column-wise mean and standard deviation',
      'Min-Max and Z-score normalization functions operating strictly in-place or via broadcasting',
      'Threshold-based spike clipping without explicit Python for-loops'
    ],
    ['Strictly no Python for-loops over array rows or columns; rely entirely on NumPy vectorized broadcasting', 'Memory overhead must not exceed 2x input tensor size'],
    ['Accepts NumPy arrays and returns standardized arrays within [-3.0, 3.0] clipped standard deviations', 'Outputs statistical summary dictionary containing per-channel mean, variance, and clipped outlier counts'],
    ['Source code in Python (`telemetry_normalizer.py`)', 'Unit test assertions verifying shape invariance and zero mean / unit variance outputs', 'Brief explanation of NumPy broadcasting mechanics used'],
    'telemetry_normalizer.py',
    `import numpy as np

def normalize_telemetry(data: np.ndarray, clip_std: float = 3.0) -> dict:
    """
    Standardizes sensor telemetry matrix across channels.
    Parameters:
        data: 2D numpy array of shape (N_samples, M_sensors)
        clip_std: max standard deviations before clipping
    Returns:
        dict with keys: 'normalized', 'channel_means', 'channel_stds', 'outliers_clipped'
    """
    # TODO: Implement vectorized Z-score normalization and spike clipping without loops
    pass
`,
    standardRubric('Python for ML', 1)
  );

  addProj('ai-ml', 'python-for-ml', 2,
    'Batch Matrix Factorization & Recommender Pipeline',
    'A streaming media platform requires an on-the-fly user-item interaction scoring engine. You must implement a regularized Alternating Least Squares (ALS) matrix factorization step in pure NumPy, handling sparse interaction matrices and multi-threaded BLAS operations.',
    'Develop a high-throughput linear algebra factorization workflow with vectorized Frobenius norm convergence tracking.',
    [
      'Initialize latent user (U x K) and item (I x K) factor matrices with Xavier normal distribution',
      'Implement alternating least squares update steps using `np.linalg.solve` across batch slices',
      'Compute regularized loss function in vectorized matrix form',
      'Handle zero-interaction cold-start items gracefully without division-by-zero crashes'
    ],
    ['Execution time for a 500x500 matrix with K=20 latent factors must not exceed 1.5 seconds', 'Must use double-precision float64 numerical stability bounds'],
    ['Returns converged user and item embeddings', 'Predicts top-K recommendations for arbitrary user indices with cosine similarity ranking'],
    ['Source code in Python (`als_factorizer.py`)', 'Convergence loss plot log or validation test script', 'Architecture decision notes explaining latent dimension selection and regularizer lambda choice'],
    'als_factorizer.py',
    `import numpy as np

class VectorizedALS:
    def __init__(self, n_factors: int = 20, reg_lambda: float = 0.05, max_iter: int = 15):
        self.n_factors = n_factors
        self.reg_lambda = reg_lambda
        self.max_iter = max_iter

    def fit(self, R: np.ndarray):
        # TODO: Vectorized Alternating Least Squares factorization
        pass

    def predict(self, user_idx: int, top_k: int = 5) -> np.ndarray:
        # TODO: Return top_k item indices with highest predicted score
        pass
`,
    standardRubric('Python for ML', 2)
  );

  addProj('ai-ml', 'python-for-ml', 3,
    'Low-Latency Out-of-Core Memory-Mapped Tensor Processor',
    'A seismic monitoring neural network receives 80GB tensor dumps exceeding host RAM capacity. You must construct a high-performance streaming tensor pipeline using `np.memmap`, custom stride tricks, and zero-copy shared memory windows for sliding-window anomaly inference.',
    'Build an enterprise-grade out-of-core tensor ingestion and batch windowing pipeline that processes multidimensional arrays in bounded memory (<512MB RAM).',
    [
      'Create and manage binary on-disk `.dat` memory-mapped arrays using `np.memmap` in read/write modes',
      'Implement zero-copy sliding window creation via `np.lib.stride_tricks.as_strided` with stride validation',
      'Perform rolling fast Fourier transform (FFT) or power spectral density across sliding windows',
      'Ensure atomic buffer flushes and operating system page cache synchronization'
    ],
    ['Host resident RSS memory footprint must strictly remain under 512MB during processing of 5GB synthetic tensor files', 'Must prevent illegal memory access segmentation faults by ensuring stride bounds do not exceed allocated buffer'],
    ['Memory-efficient tensor stream pipeline capable of arbitrary batch slicing', 'Automated memory profiler log demonstrating constant flat RAM consumption'],
    ['Source code in Python (`mmap_tensor_processor.py`)', 'Benchmark log measuring throughput (MB/s) and peak resident memory', 'Design document explaining stride tricks safety and cache-line prefetching strategy'],
    'mmap_tensor_processor.py',
    `import numpy as np
import os

class OutOfCoreTensorProcessor:
    def __init__(self, file_path: str, shape: tuple, dtype=np.float32):
        self.file_path = file_path
        self.shape = shape
        self.dtype = dtype

    def create_sliding_windows(self, window_size: int, step: int):
        # TODO: Use stride_tricks to create zero-copy sliding windows
        pass

    def process_spectral_energy(self, window_size: int, step: int) -> np.ndarray:
        # TODO: Compute windowed power metrics while preserving flat memory envelope
        pass
`,
    standardRubric('Python for ML', 3)
  );

  // 1.2 Data Preprocessing
  addProj('ai-ml', 'data-preprocessing', 1,
    'Automated Clinical Dataset Cleaning & Imputation Engine',
    'An emergency room triage dataset contains missing physiological metrics (heart rate, blood pressure, SpO2) with corrupt sentinel values (-999, "NaN", null). Build an automated cleaning and statistical imputation pipeline.',
    'Construct an end-to-end dataset sanitizer that identifies missing value indicators, applies appropriate numerical and categorical imputations, and generates clean, leak-free feature matrices.',
    [
      'Detect and standardize multimodal missing value indicators (-999, 9999, "?", "N/A")',
      'Implement median imputation for skewed numerical vitals and mode imputation for categorical triage codes',
      'Filter records exceeding a configurable missingness threshold (e.g. >50% null features)',
      'Generate an audit report detailing missingness counts and transformation parameters'
    ],
    ['Cannot leak test split parameters into training imputations; must adhere to scikit-learn fit/transform separation', 'Must handle unexpected novel categorical values during transform'],
    ['Cleaned feature DataFrame ready for model consumption', 'Statistical imputation report dictionary with baseline comparisons'],
    ['Source code (`clinical_preprocessor.py`)', 'Unit test suite testing edge cases (all-null columns, zero variance)', 'Written explanation of why mean imputation was rejected for skewed physiological indicators'],
    'clinical_preprocessor.py',
    `import pandas as pd
import numpy as np

class ClinicalDataCleaner:
    def __init__(self, max_null_ratio: float = 0.5):
        self.max_null_ratio = max_null_ratio
        self.impute_values = {}

    def fit(self, df: pd.DataFrame):
        # TODO: Learn median and mode statistics strictly on training data
        pass

    def transform(self, df: pd.DataFrame) -> pd.DataFrame:
        # TODO: Clean and impute unseen records without data leakage
        pass
`,
    standardRubric('Data Preprocessing', 1)
  );

  addProj('ai-ml', 'data-preprocessing', 2,
    'Leak-Free Feature Engineering & Encoding Transformer Pipeline',
    'A fintech loan default prediction system requires an automated feature engineering pipeline converting raw demographic, credit bureau, and transaction logs into normalized numerical vectors.',
    'Build a production-grade ColumnTransformer pipeline incorporating target encoding with cross-validation smoothing, robust scaling, and interaction features.',
    [
      'Design a composite pipeline utilizing scikit-learn `Pipeline` and `ColumnTransformer` primitives',
      'Implement Out-of-Fold (OOF) target encoding for high-cardinality geographic codes to prevent target leakage',
      'Apply RobustScaler to transaction volume distributions exhibiting heavy Pareto tails',
      'Generate polynomial interaction terms for debt-to-income and loan-to-value ratios'
    ],
    ['Strict prohibition of target leakage: target encoding MUST be computed inside cross-validation splits', 'Pipeline must serialize and deserialize cleanly via joblib/pickle'],
    ['Reusable scikit-learn compatible Transformer estimator', 'Verification script demonstrating 0% target leak across K-fold validation splits'],
    ['Source code (`feature_pipeline.py`)', 'Cross-validation audit log verifying identical training and inference schema consistency', 'Design document explaining outlier resilience choices'],
    'feature_pipeline.py',
    `from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
import pandas as pd
import numpy as np

class OutOfFoldTargetEncoder(BaseEstimator, TransformerMixin):
    def __init__(self, n_splits: int = 5, smoothing: float = 10.0):
        self.n_splits = n_splits
        self.smoothing = smoothing

    def fit_transform(self, X, y):
        # TODO: K-fold out-of-fold target encoding with m-estimate smoothing
        pass
`,
    standardRubric('Data Preprocessing', 2)
  );

  addProj('ai-ml', 'data-preprocessing', 3,
    'Real-Time Streaming Feature Store with Population Drift Detection',
    'A high-frequency fraud detection engine ingests 10,000 transactions per second. You must build a streaming feature transformation processor that computes point-in-time sliding aggregations and monitors Kolmogorov-Smirnov and Population Stability Index (PSI) drift.',
    'Develop an enterprise-grade real-time feature computation engine with statistical distribution drift alarming.',
    [
      'Implement sliding-window event aggregations (1-hour, 24-hour spending velocity) using event timestamps',
      'Point-in-time correctness: ensure features calculated for historical backfills only use data available prior to event time',
      'Calculate Population Stability Index (PSI) and Wasserstein distance between live transaction batches and golden training distributions',
      'Trigger automated drift alerts when PSI exceeds standard operational thresholds (>0.25)'
    ],
    ['Feature generation latency per transaction record must remain under 10ms', 'Statistical drift calculation must run without stalling concurrent ingestion'],
    ['Streaming feature aggregator with point-in-time join simulator', 'Live drift detection monitor emitting alerts when synthetic anomalies are introduced'],
    ['Source code (`streaming_feature_store.py`)', 'Benchmark report with latency metrics under load', 'System architecture document outlining feature store serving topology and drift remediation protocol'],
    'streaming_feature_store.py',
    `import numpy as np
import pandas as pd
from datetime import datetime, timedelta

class StreamingFeatureStore:
    def __init__(self, psi_threshold: float = 0.25):
        self.psi_threshold = psi_threshold
        self.baseline_distribution = None

    def compute_psi(self, current_batch: np.ndarray) -> float:
        # TODO: Calculate Population Stability Index against certified baseline
        pass

    def ingest_event(self, event: dict) -> dict:
        # TODO: Point-in-time feature extraction and velocity calculation
        pass
`,
    standardRubric('Data Preprocessing', 3)
  );

  // 1.3 Machine Learning
  addProj('ai-ml', 'machine-learning', 1,
    'Supervised Customer Churn Classifier with Calibrated Thresholds',
    'A telecommunications provider experiences 15% annual customer churn. You must develop, validate, and optimize a supervised classification model to identify at-risk subscribers before contract expiration.',
    'Build and evaluate a complete binary classification workflow incorporating logistic regression and decision trees, tuning decision thresholds for business cost-benefit trade-offs.',
    [
      'Perform stratified train-validation-test partitioning to preserve churn class prevalence',
      'Train baseline Logistic Regression and Decision Tree classifiers with hyperparameter regularization',
      'Plot and analyze Precision-Recall and ROC curves to evaluate performance under class imbalance',
      'Optimize the classification threshold to maximize net financial savings based on customer retention costs'
    ],
    ['Model cannot use uncalibrated accuracy as the primary evaluation metric', 'Validation score must achieve PR-AUC > 0.65 on synthetic benchmark dataset'],
    ['Trained model artifact with evaluated confusion matrix at default and optimal thresholds', 'Cost-benefit analysis curve demonstrating financial ROI at chosen threshold'],
    ['Source code (`churn_predictor.py`)', 'Model evaluation report detailing Precision, Recall, F1, and ROC-AUC', 'Executive summary explaining the threshold selection rationale'],
    'churn_predictor.py',
    `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import precision_recall_curve, roc_auc_score

class ChurnModelPipeline:
    def __init__(self, retention_cost: float = 20.0, customer_value: float = 100.0):
        self.retention_cost = retention_cost
        self.customer_value = customer_value
        self.model = LogisticRegression(class_weight='balanced')

    def find_optimal_threshold(self, X_val, y_val) -> float:
        # TODO: Identify decision threshold maximizing net revenue
        pass
`,
    standardRubric('Machine Learning', 1)
  );

  addProj('ai-ml', 'machine-learning', 2,
    'Tuned Ensemble Fraud Detection Engine with Cost-Sensitive Loss',
    'A credit card processor processes millions of daily transactions where fraudulent instances represent 0.2% of total traffic. Build a cost-sensitive ensemble classifier combining Gradient Boosting and Random Forests.',
    'Develop a fraud scoring engine utilizing XGBoost/LightGBM with custom focal/cost-sensitive loss, feature importance analysis, and error decomposition.',
    [
      'Implement cost-sensitive loss weighting giving 500x heavier penalty to False Negatives than False Positives',
      'Train and tune an ensemble utilizing Bayesian optimization or structured grid search over tree depth and learning rate',
      'Compute SHAP (Shapley Additive exPlanations) values to identify key fraud drivers',
      'Conduct bias-variance error decomposition across varying training sample sizes'
    ],
    ['False Negative rate on validation test split must be strictly below 5%', 'Inference latency must not exceed 25ms per transaction batch'],
    ['Trained cost-sensitive ensemble classifier pipeline', 'SHAP summary plot generator displaying top 10 global feature attributions'],
    ['Source code (`fraud_ensemble.py`)', 'Technical evaluation dossier detailing ROC-AUC, PR-AUC, and financial loss reduction', 'Architecture explanation of why boosting was favored over standard bagging for fraud tails'],
    'fraud_ensemble.py',
    `import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier

class CostSensitiveFraudEnsemble:
    def __init__(self, fn_penalty: float = 500.0, fp_penalty: float = 1.0):
        self.fn_penalty = fn_penalty
        self.fp_penalty = fp_penalty

    def fit_ensemble(self, X_train, y_train):
        # TODO: Train cost-weighted ensemble
        pass

    def evaluate_financial_loss(self, X_test, y_test) -> dict:
        # TODO: Compute net financial loss vs unweighted baseline
        pass
`,
    standardRubric('Machine Learning', 2)
  );

  addProj('ai-ml', 'machine-learning', 3,
    'Production Model Serving Pipeline with Uncertainty Estimation & Drift Remediation',
    'An automated medical diagnostic AI requires production deployment with calibrated prediction probabilities and Bayesian uncertainty estimation (Monte Carlo Dropout / Deep Ensembles) to flag ambiguous cases for human physician review.',
    'Architect an end-to-end model serving harness incorporating temperature scaling calibration, epistemic uncertainty bounds, and automated re-training triggers.',
    [
      'Implement probability calibration via Platt Scaling or Isotonic Regression on held-out validation data',
      'Construct a Bayesian uncertainty quantification layer measuring prediction entropy and epistemic variance',
      'Establish a "Human-in-the-Loop" triage routing policy diverting predictions with high uncertainty to physician review queues',
      'Design an automated ablation diagnostic pipeline comparing degraded sub-models against the certified baseline'
    ],
    ['Expected Calibration Error (ECE) on test split must remain below 0.05', 'Physician triage policy must capture at least 90% of model prediction errors'],
    ['Calibrated model serving harness with uncertainty scoring endpoint', 'Automated ablation testing suite logging component contributions to overall system safety'],
    ['Source code (`calibrated_serving_pipeline.py`)', 'Calibration reliability diagram log and ECE comparison metrics', 'Production architecture specification detailing human triage thresholds and graceful degradation failsafes'],
    'calibrated_serving_pipeline.py',
    `import numpy as np
from scipy.special import softmax

class SafeModelServingEngine:
    def __init__(self, uncertainty_threshold: float = 0.35):
        self.uncertainty_threshold = uncertainty_threshold
        self.temperature = 1.0

    def calibrate_temperature(self, logits: np.ndarray, labels: np.ndarray):
        # TODO: Optimize temperature parameter to minimize NLL
        pass

    def predict_with_triage(self, features: np.ndarray) -> dict:
        # TODO: Return prediction, calibrated confidence, uncertainty score, and triage flag
        pass
`,
    standardRubric('Machine Learning', 3)
  );

  // =========================================================================
  // 2. CYBERSECURITY
  // =========================================================================

  // 2.1 Networking Fundamentals
  addProj('cybersecurity', 'networking-fundamentals', 1,
    'PCAP Network Traffic Inspector & Protocol Parser',
    'An enterprise security operations team requires a lightweight packet capture (PCAP) inspection script to parse Ethernet, IPv4, TCP, and UDP headers from raw network dumps and detect unauthorized port traffic.',
    'Build a binary packet parser that dissects raw network packets, verifies IP checksums, and maps traffic distributions across transport ports.',
    [
      'Dissect Ethernet frames, IPv4 headers, and TCP/UDP transport segments from binary PCAP byte streams',
      'Verify IPv4 header checksum validity and identify corrupted packets',
      'Extract source/destination IP addresses, port numbers, and protocol types',
      'Generate an incident summary detailing top communicating IP pairs and anomalous port hits (e.g. Telnet 23, SMB 445)'
    ],
    ['Must parse raw binary byte buffers without relying on heavy external GUI tools', 'Must handle fragmented packets without crashing'],
    ['Functional CLI packet inspection tool', 'Formatted network protocol distribution audit report'],
    ['Source code (`pcap_inspector.py`)', 'Sample test execution log against provided synthetic capture file', 'Technical document explaining IP header checksum arithmetic and bitwise masking operations'],
    'pcap_inspector.py',
    `import struct
import socket

def parse_ethernet_frame(data: bytes):
    # TODO: Dissect 14-byte Ethernet header (dest_mac, src_mac, eth_type)
    pass

def parse_ipv4_header(data: bytes):
    # TODO: Dissect IPv4 header and verify header checksum
    pass
`,
    standardRubric('Networking Fundamentals', 1)
  );

  addProj('cybersecurity', 'networking-fundamentals', 2,
    'TCP Socket Monitor & Syn Flood Anomaly Detector',
    'A datacenter gateway experiences periodic state table exhaustion. Build an active TCP socket monitor that tracks connection lifecycle state transitions and identifies half-open SYN flood anomalies.',
    'Develop a stateful network anomaly monitor that tracks SYN, SYN-ACK, ACK, and FIN/RST sequences and flags abnormal half-open connection accumulation.',
    [
      'Track TCP state transitions per connection tuple (src_ip, src_port, dst_ip, dst_port)',
      'Identify incomplete three-way handshakes lingering past configurable timeout windows',
      'Calculate ratio of incoming SYN packets to completed ACK connections per source subnet',
      'Emit structured security alert events when SYN flood thresholds are breached'
    ],
    ['Memory management: connection state table must purge expired entries to prevent memory exhaustion under attack', 'Processing throughput must exceed 5,000 packets per second'],
    ['Stateful TCP monitor module', 'Simulated attack defense log demonstrating SYN flood alert triggering within 2 seconds of onset'],
    ['Source code (`syn_flood_detector.py`)', 'Test harness simulating legitimate HTTP traffic alongside SYN flood attack streams', 'Security briefing on SYN cookies and transport layer hardening techniques'],
    'syn_flood_detector.py',
    `import time
from collections import defaultdict

class StatefulTCPMonitor:
    def __init__(self, syn_ack_ratio_threshold: float = 3.0, timeout_seconds: float = 10.0):
        self.syn_ack_ratio_threshold = syn_ack_ratio_threshold
        self.timeout_seconds = timeout_seconds
        self.connection_table = {}

    def process_packet(self, src_ip: str, dst_ip: str, flags: dict) -> list:
        # TODO: Update TCP state machine and detect anomalous half-open states
        pass
`,
    standardRubric('Networking Fundamentals', 2)
  );

  addProj('cybersecurity', 'networking-fundamentals', 3,
    'Enterprise Network IDS Rule Engine & Stateful Firewall Inspector',
    'A high-security financial enclave requires a customized Intrusion Detection System (IDS) rule engine capable of inspecting packet headers and TCP payload signatures against Snort-style rules in real time.',
    'Architect a high-performance network rule engine incorporating Aho-Corasick multi-pattern payload searching and CIDR-based stateful packet filtering.',
    [
      'Parse custom IDS rules defining protocol, source/destination CIDR ranges, port lists, and regex/content payload signatures',
      'Implement multi-pattern string matching across packet payloads to detect known exploit payloads (e.g. shellcode NOP sleds, traversal sequences)',
      'Track stateful bidirectional sessions to detect payload fragmentation evasions across multiple TCP segments',
      'Output formatted alerts conforming to Common Event Format (CEF) specifications'
    ],
    ['Zero false positives on certified benign benchmark traffic', 'Must assemble out-of-order TCP segments prior to payload inspection to counter stream reassembly evasion'],
    ['Multi-rule stateful IDS engine', 'Comprehensive test suite testing evasion attacks (fragmentation, overlapping segments) and demonstrating successful detection'],
    ['Source code (`stateful_ids_engine.py`)', 'Benchmark audit report demonstrating payload inspection throughput', 'Security architecture specification explaining TCP stream reassembly and evasion mitigation'],
    'stateful_ids_engine.py',
    `import re

class EnterpriseRuleEngine:
    def __init__(self):
        self.rules = []
        self.tcp_streams = {}

    def load_rules(self, rule_definitions: list):
        # TODO: Parse and index Snort-compatible network rules
        pass

    def inspect_packet(self, packet_bytes: bytes) -> list:
        # TODO: Perform stateful stream reassembly and signature matching
        pass
`,
    standardRubric('Networking Fundamentals', 3)
  );

  // 2.2 Web Security
  addProj('cybersecurity', 'web-security', 1,
    'Web Input Sanitization & XSS Defense Gatekeeper',
    'A user review portal allows markdown and HTML user submissions but is currently vulnerable to stored Cross-Site Scripting (XSS). Build a robust defense filter that strips malicious tags, sanitizes attributes, and enforces strict Content Security Policy (CSP) directives.',
    'Implement a comprehensive input sanitization and output encoding filter that neutralizes reflected and stored XSS vectors.',
    [
      'Construct a strict HTML element whitelist allowing safe formatting (`<b>`, `<i>`, `<p>`) while rejecting executable script containers (`<script>`, `<iframe>`, `<object>`)',
      'Sanitize attributes to strip dangerous inline event handlers (`onload`, `onerror`, `onclick`) and `javascript:` URI schemes',
      'Implement context-aware HTML entity encoding for user text rendered inside HTML body, attribute, and JavaScript contexts',
      'Generate recommended HTTP security headers (`Content-Security-Policy`, `X-Content-Type-Options: nosniff`)'
    ],
    ['Must not break valid rich-text markup while completely blocking obfuscated payloads (e.g. `<img src=x onerror=alert(1)>`)', 'Must prevent filter evasion using Unicode normalization tricks or mixed-case tags'],
    ['Input sanitization and encoding module', 'Automated test harness testing 20+ real-world OWASP XSS cheat-sheet payloads'],
    ['Source code (`xss_gatekeeper.py` or `.js`)', 'Security test verification report showing 100% block rate on XSS payloads', 'Defense-in-depth rationale explaining why output encoding must accompany input sanitization'],
    'xss_gatekeeper.js',
    `function sanitizeHtmlInput(rawInput) {
  // TODO: Implement robust element/attribute whitelist sanitization
}

function generateSecurityHeaders() {
  // TODO: Return strict Content-Security-Policy and hardening headers
}

module.exports = { sanitizeHtmlInput, generateSecurityHeaders };
`,
    standardRubric('Web Security', 1)
  );

  addProj('cybersecurity', 'web-security', 2,
    'Hardened Session Gateway with Double-Submit CSRF & Token Verification',
    'A retail banking REST API requires bulletproof session security. You must build Express authentication middleware that enforces HttpOnly SameSite session cookies, double-submit HMAC CSRF token validation, and session fixation defense.',
    'Develop an enterprise-grade web session security gateway that neutralizes Cross-Site Request Forgery and session hijacking.',
    [
      'Issue cryptographically secure session IDs stored in `HttpOnly; Secure; SameSite=Strict` cookies',
      'Implement a cryptographically verified Double-Submit Cookie CSRF defense using HMAC-SHA256 signatures for state-changing HTTP methods (POST, PUT, DELETE)',
      'Enforce session regeneration upon privilege escalation to prevent session fixation attacks',
      'Incorporate idle and absolute session expiration timers'
    ],
    ['CSRF protection must not block safe idempotent GET requests', 'Must reject requests where CSRF cookie and custom header mismatch or fail HMAC verification'],
    ['Express middleware security package', 'Integration test suite verifying CSRF rejection, session timeout, and fixation prevention'],
    ['Source code (`session_security_gateway.ts`)', 'Security audit log demonstrating rejected forge attempts', 'Threat model document detailing defense against sub-domain cookie injection attacks'],
    'session_security_gateway.ts',
    `import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export class SessionSecurityGateway {
  // TODO: Implement cryptographic session validation and double-submit HMAC CSRF protection
  validateCsrfToken(req: Request, res: Response, next: NextFunction): void {
    // TODO: Verify CSRF token against signed cookie
  }
}
`,
    standardRubric('Web Security', 2)
  );

  addProj('cybersecurity', 'web-security', 3,
    'Zero-Trust SSRF & Blind Injection Perimeter Defense Proxy',
    'A document conversion microservice accepts arbitrary URLs from users to generate PDF previews. Attackers have attempted to reach the internal AWS metadata service (`169.254.169.254`) and internal Kubernetes ports. Build a zero-trust URL egress inspection proxy.',
    'Build a secure outbound HTTP fetching proxy that prevents Server-Side Request Forgery (SSRF), DNS rebinding, and blind injection exploits.',
    [
      'Perform pre-flight DNS resolution and inspect returned IP addresses against private, loopback, link-local (169.254.0.0/16), and cloud metadata CIDR blocks',
      'Mitigate DNS Rebinding attacks by pinning the validated IP address and connecting directly to that resolved IP rather than re-resolving during fetch',
      'Restrict outbound schemes strictly to HTTP/HTTPS, blocking `file://`, `gopher://`, `dict://`, and `ftp://` schemes',
      'Inspect and enforce strict response size and MIME-type limits to prevent denial-of-service decompression bombs'
    ],
    ['Must withstand IPv6 embedding (e.g. `::ffff:169.254.169.254`), decimal IP representations, and DNS rebinding TOCTOU race conditions', 'Must run without introducing more than 15ms latency on legitimate public internet fetches'],
    ['Hardened egress proxy module with IP pinning', 'Automated security test suite covering 15+ advanced SSRF bypass techniques'],
    ['Source code (`zero_trust_ssrf_proxy.ts`)', 'Penetration testing log demonstrating neutralized SSRF attempts', 'Architecture blueprint explaining socket-level IP pinning and egress firewall perimeter policies'],
    'zero_trust_ssrf_proxy.ts',
    `import dns from 'dns/promises';
import http from 'http';

export async function safeFetchUrl(targetUrl: string, maxBytes: number = 5_000_000): Promise<Buffer> {
  // TODO: Validate scheme, resolve DNS, verify non-internal IP, pin socket IP to prevent DNS rebinding
}
`,
    standardRubric('Web Security', 3)
  );

  // 2.3 Cryptography
  addProj('cybersecurity', 'cryptography', 1,
    'Cryptographic File Integrity & Checksum Verification Suite',
    'A software release pipeline distributes executable binaries to thousands of endpoints. You must build a cryptographic integrity verification utility that computes SHA-256 and SHA-512 hashes, compares against digital manifests, and detects tamper modifications.',
    'Build a high-performance cryptographic checksum utility capable of streaming large files and detecting single-bit modifications.',
    [
      'Stream large files in 64KB chunks to compute SHA-256 and SHA-512 digests without loading entire files into memory',
      'Parse cryptographic `SHA256SUMS` manifest files and verify all listed artifacts',
      'Detect and report single-bit tampering, file truncations, and missing assets',
      'Generate cryptographically secure salts and PBKDF2 hashes for release metadata authentication'
    ],
    ['Must maintain flat memory footprint regardless of file size (tested up to 2GB files)', 'Must use constant-time string comparison to prevent timing side-channel leaks'],
    ['CLI integrity verification suite', 'Verification report detailing tested files, execution speed (MB/s), and tamper detection alerts'],
    ['Source code (`integrity_verifier.py`)', 'Unit test suite with corrupted binary test fixtures verifying tamper detection', 'Technical explanation of SHA-256 avalanche effect and constant-time string equality'],
    'integrity_verifier.py',
    `import hashlib
import hmac

def verify_file_checksum(file_path: str, expected_hash: str, algorithm: str = 'sha256') -> bool:
    # TODO: Stream file in chunks, compute digest, compare using hmac.compare_digest
    pass
`,
    standardRubric('Cryptography', 1)
  );

  addProj('cybersecurity', 'cryptography', 2,
    'Authenticated AES-256-GCM Secure Storage Engine with Key Derivation',
    'A patient health records portal must encrypt sensitive medical files at rest. You must construct a secure storage engine using AES-256-GCM authenticated encryption, random 96-bit initialization vectors, and PBKDF2/Argon2 key derivation.',
    'Develop an enterprise authenticated encryption library that provides confidentiality and cryptographic tamper-evidence.',
    [
      'Derive AES-256 keys from user passphrases using PBKDF2 (min 100,000 iterations) with unique cryptographically random salts',
      'Encrypt data using AES-256-GCM, generating a fresh 96-bit random IV for every encryption operation',
      'Append authentication tags (128-bit) and include Associated Data (e.g. record ID, timestamp) to bind ciphertext to metadata context',
      'Validate authentication tags during decryption and raise explicit tamper alerts if ciphertext or metadata was altered'
    ],
    ['Strict zero-nonce-reuse invariant: every encryption MUST generate a cryptographically fresh IV', 'Decryption must immediately abort if authentication tag verification fails, emitting no decrypted plaintext'],
    ['Authenticated encryption/decryption module', 'Test script demonstrating successful roundtrip and tamper detection on modified ciphertext'],
    ['Source code (`secure_storage_engine.py` or `.ts`)', 'Security verification dossier demonstrating zero nonce collisions across 10,000 iterations', 'Cryptographic rationale explaining AEAD advantages over unauthenticated CBC mode'],
    'secure_storage_engine.py',
    `from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

class SecureStorageEngine:
    def __init__(self, key: bytes):
        self.aesgcm = AESGCM(key)

    def encrypt_record(self, plaintext: bytes, associated_data: bytes) -> dict:
        # TODO: Generate 12-byte IV, encrypt with AES-GCM, return {iv, ciphertext, tag}
        pass

    def decrypt_record(self, iv: bytes, ciphertext: bytes, associated_data: bytes) -> bytes:
        # TODO: Decrypt and verify authentication tag
        pass
`,
    standardRubric('Cryptography', 2)
  );

  addProj('cybersecurity', 'cryptography', 3,
    'Ephemeral ECDHE Key Exchange & ECDSA Digital Signature Audit Ledger',
    'A decentralized consensus ledger requires end-to-end forward-secure transaction exchange. You must implement an Ephemeral Elliptic Curve Diffie-Hellman (ECDHE) key agreement using curve P-256 / X25519 and ECDSA digital signatures for tamper-evident transaction auditing.',
    'Construct an end-to-end cryptographic session agreement and signed transaction ledger ensuring Perfect Forward Secrecy (PFS) and non-repudiation.',
    [
      'Generate ephemeral elliptic curve keypairs (X25519 or SECP256R1) per session and compute shared secrets',
      'Derive symmetric encryption keys from ECDH shared secrets using HKDF (HMAC-based Extract-and-Expand Key Derivation Function)',
      'Sign transactions with private ECDSA/Ed25519 keys and verify signatures with corresponding public keys',
      'Assemble a tamper-evident audit ledger linking blocks via cryptographic hash chains'
    ],
    ['Session compromise must not compromise past recorded transactions (demonstrate Perfect Forward Secrecy)', 'Signatures must prevent signature malleability exploits'],
    ['Complete ECDHE + ECDSA transaction protocol implementation', 'Audit ledger test runner verifying signature validation and block hash chain integrity'],
    ['Source code (`ecdhe_signed_ledger.py`)', 'Protocol verification report showing signature verification benchmarks', 'Cryptographic protocol specification detailing the key derivation sequence and threat model'],
    'ecdhe_signed_ledger.py',
    `from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes

class CryptographicSession:
    def __init__(self):
        # TODO: Generate ephemeral ECDH keypair and ECDSA identity keys
        pass

    def agree_session_key(self, peer_public_key) -> bytes:
        # TODO: Compute shared secret and derive session key via HKDF
        pass
`,
    standardRubric('Cryptography', 3)
  );

  // =========================================================================
  // 3. DATA SCIENCE
  // =========================================================================

  // 3.1 Python & SQL
  addProj('data-science', 'python-sql', 1,
    'Relational E-Commerce Sales & Revenue Aggregate Reporter',
    'An online retailer requires a comprehensive sales analytics pipeline combining SQLite / PostgreSQL data with Pandas to calculate monthly revenue trends, customer lifetime values, and top-selling product categories.',
    'Build an analytical reporting tool connecting relational SQL queries with Python data transformation to generate actionable executive sales metrics.',
    [
      'Author SQL queries utilizing `INNER JOIN`, `LEFT JOIN`, `GROUP BY`, and `HAVING` across orders, items, and customers tables',
      'Calculate Monthly Recurring Revenue (MRR), average order value, and refund rates',
      'Load query results into Pandas DataFrames and handle currency formatting and date aggregation',
      'Export summary reports to formatted CSV and structured JSON files'
    ],
    ['Must use parameterized queries to prevent SQL injection vulnerabilities', 'SQL aggregations should be performed database-side rather than loading raw unaggregated tables into Python memory'],
    ['Python analytical reporting script', 'Generated executive sales metrics summary report'],
    ['Source code (`sales_reporter.py`)', 'Sample SQLite database and query verification test script', 'Brief documentation explaining join selection and index optimization recommendations'],
    'sales_reporter.py',
    `import sqlite3
import pandas as pd

def generate_sales_report(db_path: str) -> pd.DataFrame:
    # TODO: Connect to SQLite, execute parameterized relational queries, return aggregated KPI DataFrame
    pass
`,
    standardRubric('Python & SQL', 1)
  );

  addProj('data-science', 'python-sql', 2,
    'Cohort Retention & Window Function Analytical Engine',
    'A SaaS platform needs to calculate user retention across weekly cohorts and determine user drop-off trajectories. You must build an analytical SQL engine using complex window functions (`ROW_NUMBER`, `DENSE_RANK`, `LAG`, `LEAD`) and Pandas matrix pivoting.',
    'Construct an advanced SQL and Python analytics pipeline that computes cohort retention rates, churn intervals, and rolling 7-day active user trends.',
    [
      'Formulate SQL queries with window functions (`LAG`, `LEAD`, `ROW_NUMBER`) to calculate intervals between subsequent user actions',
      'Build cohort retention matrices grouping users by acquisition week and tracking active retention over 12 subsequent weeks',
      'Implement rolling 7-day and 30-day active user (DAU/WAU/MAU) window aggregations',
      'Transform and pivot retention percentages into heatmap-ready Pandas structures'
    ],
    ['Window functions must be executed in SQL to leverage database query optimization', 'Must handle gaps in user activity gracefully without misaligning cohort intervals'],
    ['Cohort retention calculation pipeline', 'Exported retention matrix showing week-by-week percentage retention'],
    ['Source code (`cohort_retention_engine.py`)', 'SQL query file (`cohort_queries.sql`) with detailed window function comments', 'Analysis summary explaining drop-off trends and retention cliff findings'],
    'cohort_retention_engine.py',
    `import pandas as pd
import sqlite3

def compute_cohort_retention(db_connection) -> pd.DataFrame:
    # TODO: Execute window function query, pivot cohort activity into percentage retention matrix
    pass
`,
    standardRubric('Python & SQL', 2)
  );

  addProj('data-science', 'python-sql', 3,
    'High-Throughput Streaming ETL Pipeline with Query Index Profiler',
    'A financial clearinghouse processes 50 million transaction rows daily. Build a high-throughput streaming ETL pipeline that reads raw transaction logs, executes recursive CTEs to resolve transaction chains, and profiles database execution plans with `EXPLAIN ANALYZE`.',
    'Develop an enterprise-grade ETL pipeline using database cursors, recursive Common Table Expressions, and automated index profiling.',
    [
      'Stream large datasets using database server-side cursors and chunked Pandas streaming (`chunksize=50000`)',
      'Author recursive Common Table Expressions (CTEs) to trace multi-hop wire transfers and detect circular transaction loops',
      'Profile query performance using `EXPLAIN (ANALYZE, BUFFERS)` to detect sequential table scans and recommend covering indexes',
      'Implement atomic database upserts with conflict handling (`ON CONFLICT DO UPDATE`)'
    ],
    ['Peak RAM usage must stay below 256MB when processing a 10-million row test dataset', 'Recursive CTE must include cycle detection termination logic to prevent infinite recursion'],
    ['Streaming ETL processor and query profiler', 'Query plan comparison report showing cost reductions before and after index tuning'],
    ['Source code (`streaming_etl_profiler.py`)', 'SQL migration and index profiling analysis document', 'Architecture design notes explaining server-side cursor memory mechanics and transaction isolation levels'],
    'streaming_etl_profiler.py',
    `import sqlite3
import pandas as pd

class StreamingETLPipeline:
    def __init__(self, db_path: str, chunk_size: int = 50000):
        self.db_path = db_path
        self.chunk_size = chunk_size

    def process_large_ledger(self):
        # TODO: Stream records in chunks, execute recursive CTE, perform atomic upserts
        pass
`,
    standardRubric('Python & SQL', 3)
  );

  // 3.2 Statistics
  addProj('data-science', 'statistics', 1,
    'Automated Statistical Profiler & Distribution Analyzer',
    'A pharmaceutical clinical trial requires automated descriptive statistical profiling of patient biomarker datasets to evaluate skewness, normality, and outlier severity across treatment and control groups.',
    'Build a descriptive statistical analysis package calculating central tendency, dispersion, kurtosis, and empirical rule conformance.',
    [
      'Calculate mean, median, mode, variance, standard deviation, and Interquartile Range (IQR) for numeric variables',
      'Compute Fisher-Pearson skewness and kurtosis coefficients to assess deviation from Gaussian normality',
      'Implement Tukey outlier boundaries (1.5 * IQR) and flag anomalous records',
      'Generate formatted statistical summary tables comparing treatment vs control cohorts'
    ],
    ['Must handle multimodal and skewed distributions without erroneous Gaussian assumptions', 'Must handle missing null data systematically without silent distortions'],
    ['Automated statistical profiling utility', 'Formatted markdown/HTML statistical dossier summarizing biomarker distributions'],
    ['Source code (`statistical_profiler.py`)', 'Unit test assertions verifying skewness and outlier calculations against certified scipy values', 'Brief diagnostic commentary on biomarker distribution shapes'],
    'statistical_profiler.py',
    `import numpy as np
import scipy.stats as stats

def profile_dataset(data: np.ndarray) -> dict:
    # TODO: Compute comprehensive descriptive stats, skewness, kurtosis, and outlier bounds
    pass
`,
    standardRubric('Statistics', 1)
  );

  addProj('data-science', 'statistics', 2,
    'Automated A/B Experiment Hypothesis Testing Engine',
    'A high-growth mobile app is running an A/B test on onboarding flows. Build an automated inferential hypothesis testing engine that performs Welch t-tests, Chi-square independence tests, and Mann-Whitney U non-parametric tests based on normality diagnostics.',
    'Construct an experiment evaluation framework that checks statistical assumptions, conducts appropriate parametric or non-parametric tests, and computes confidence intervals with statistical power.',
    [
      'Perform Shapiro-Wilk and Levene tests to evaluate distribution normality and equal variance assumptions',
      'Dynamically route to Student t-test, Welch t-test, or non-parametric Mann-Whitney U test based on diagnostic findings',
      'Calculate two-sided p-values, Cohen d effect sizes, and 95% confidence intervals for metric differences',
      'Perform statistical power analysis (`1 - beta`) to verify whether sample size was sufficient to detect Minimum Detectable Effect (MDE)'
    ],
    ['Must apply Bonferroni or Benjamini-Hochberg False Discovery Rate (FDR) corrections when testing multiple metrics simultaneously', 'Must prevent false positive inflation caused by continuous peeking'],
    ['Automated A/B test evaluation engine', 'Experiment decision brief detailing p-value, effect size, power, and final rollout recommendation'],
    ['Source code (`ab_testing_engine.py`)', 'Experiment test cases verifying routing between Welch and Mann-Whitney tests', 'Technical report explaining the risk of alpha-spending and the business impact of Type I vs Type II errors'],
    'ab_testing_engine.py',
    `import numpy as np
import scipy.stats as stats

class ABTestingEngine:
    def __init__(self, alpha: float = 0.05, power: float = 0.80):
        self.alpha = alpha
        self.power = power

    def evaluate_experiment(self, control: np.ndarray, variant: np.ndarray) -> dict:
        # TODO: Test assumptions (normality, variance), select appropriate test, compute p-value & effect size
        pass
`,
    standardRubric('Statistics', 2)
  );

  addProj('data-science', 'statistics', 3,
    'Bayesian Parameter Updating & Non-Parametric Bootstrap Simulator',
    'A quantitative trading desk requires robust parameter estimation for low-frequency tail risk events where standard sample sizes are small. You must build a Bayesian parameter updating simulator and a non-parametric bootstrap confidence interval engine.',
    'Build an advanced statistical inference system combining Beta-Binomial conjugate updating, Monte Carlo Markov Chain (MCMC) approximation, and bootstrap resampling.',
    [
      'Implement non-parametric bootstrapping with 10,000 resamples to estimate empirical 95% BCa (bias-corrected and accelerated) confidence intervals',
      'Construct a Bayesian conjugate updater (e.g. Beta-Binomial / Normal-Inverse-Gamma) computing exact posterior distributions from prior beliefs and incoming evidence',
      'Implement a Metropolis-Hastings MCMC sampler to approximate posterior distributions for non-conjugate prior-likelihood combinations',
      'Compute Highest Posterior Density (HPD) credible intervals and probability of direction'
    ],
    ['Bootstrapping resamples must use vectorized NumPy indexing to execute in under 3 seconds for 10,000 iterations', 'MCMC sampler must achieve convergence diagnostic Gelman-Rubin R-hat < 1.05'],
    ['Bayesian inference and bootstrap simulation engine', 'Comparison dossier contrasting Frequentist confidence intervals with Bayesian credible intervals on sparse sample data'],
    ['Source code (`bayesian_bootstrap_simulator.py`)', 'Convergence trace plots and test verification log', 'Theoretical paper explaining subjective prior formulation and the interpretation difference between confidence and credible intervals'],
    'bayesian_bootstrap_simulator.py',
    `import numpy as np

def bootstrap_bca_ci(data: np.ndarray, stat_func, n_boot: int = 10000, alpha: float = 0.05) -> tuple:
    # TODO: Non-parametric BCa bootstrap confidence interval
    pass

class BetaBinomialUpdater:
    def __init__(self, prior_alpha: float = 1.0, prior_beta: float = 1.0):
        self.alpha = prior_alpha
        self.beta = prior_beta

    def update(self, successes: int, trials: int):
        # TODO: Exact conjugate posterior updating
        pass
`,
    standardRubric('Statistics', 3)
  );

  // 3.3 Data Analysis & Visualization
  addProj('data-science', 'data-analysis-visualization', 1,
    'Exploratory Data Distribution & Correlation Visualizer',
    'A research institute requires an exploratory data visualization package to analyze multi-variable health demographic surveys, generating clean distribution plots, scatter relationships, and correlation matrices.',
    'Build a structured visualization module that generates publication-quality distribution histograms, box plots with outlier markers, and correlation heatmaps.',
    [
      'Create multi-panel distribution figures using Matplotlib and Seaborn with clean typography and labeled axes',
      'Generate box plots and violin plots showing median, interquartile ranges, and individual outlier points',
      'Plot pairwise scatter relationships with fitted regression trendlines and confidence interval bands',
      'Render correlation heatmaps with diverging colormaps centered at 0 and annotated correlation coefficients'
    ],
    ['Visualizations must conform to data-ink ratio principles: remove unnecessary grid clutter and avoid misleading 3D projections', 'All axes must have explicit physical units and non-overlapping ticks'],
    ['Automated chart generation script', 'Set of exported high-resolution figures (PNG/SVG) and an exploratory insights brief'],
    ['Source code (`eda_visualizer.py`)', 'Generated figures demonstrating clean visual hierarchy', 'Exploratory findings memo highlighting key observed correlations and distribution anomalies'],
    'eda_visualizer.py',
    `import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

def generate_eda_figures(df: pd.DataFrame, output_dir: str):
    # TODO: Generate distribution plots, violin plots, and correlation heatmap
    pass
`,
    standardRubric('Data Analysis & Visualization', 1)
  );

  addProj('data-science', 'data-analysis-visualization', 2,
    'Multi-Metric Anomaly Detection Dashboard with Interactive Faceting',
    'A cloud operations center needs a multi-variable performance telemetry dashboard to monitor server CPU, memory, request latency, and error rates across 50 microservices, highlighting anomalies in real time.',
    'Build a faceted dashboard engine that visualizes time-series metrics, applies rolling Z-score anomaly highlighting, and organizes multi-service comparisons into clean small multiples.',
    [
      'Construct a small-multiples visual grid (faceting) rendering time-series trends across multiple independent services',
      'Implement rolling statistical anomaly detection and highlight outlier points with distinct visual warning markers',
      'Plot dual-axis or normalized metric overlays comparing CPU utilization against P99 response latencies',
      'Export interactive HTML visualization or structured visual specifications (Plotly / Vega-Lite)'
    ],
    ['Must handle time-series data alignment across disparate sampling intervals without visual distortion', 'Color palettes must be colorblind-accessible (e.g. Viridis or ColorBrewer accessible palettes)'],
    ['Faceted dashboard generation engine', 'Interactive HTML dashboard demonstrating anomaly highlighting across microservices'],
    ['Source code (`anomaly_dashboard.py`)', 'Visual test suite with synthetic anomaly injection demonstrating clear visual callouts', 'Design review explaining layout hierarchy and color choices for rapid incident comprehension'],
    'anomaly_dashboard.py',
    `import pandas as pd
import numpy as np

def build_anomaly_dashboard(metrics_df: pd.DataFrame) -> dict:
    # TODO: Compute rolling anomalies, generate faceted small multiples visualization
    pass
`,
    standardRubric('Data Analysis & Visualization', 2)
  );

  addProj('data-science', 'data-analysis-visualization', 3,
    'Executive Strategic Analytics Dashboard with Dimensionality Reduction',
    'An enterprise executive team requires an interactive analytical storytelling dashboard that clusters customer segments across 40 behavioral dimensions and visualizes retention risk trajectories for strategic decision-making.',
    'Architect an executive-ready analytical visualization suite incorporating UMAP/t-SNE 2D cluster projections, Sankey cohort flow diagrams, and anomaly storytelling annotations.',
    [
      'Apply UMAP or t-SNE dimensionality reduction to project high-dimensional customer behavioral features into interactive 2D cluster maps',
      'Generate Sankey or alluvial flow diagrams depicting customer migration across subscription tiers over time',
      'Incorporate narrative visual callouts highlighting critical inflection points and revenue risk factors',
      'Structure visual hierarchy following Edward Tufte principles for executive decision velocity'
    ],
    ['Dimensionality reduction must clearly communicate hyperparameters (perplexity/n_neighbors) to avoid misleading topological interpretations', 'Dashboard rendering must load within 2 seconds'],
    ['Complete executive storytelling dashboard engine', 'Exported presentation-ready visualization report with highlighted strategic insights'],
    ['Source code (`executive_analytics_dashboard.py`)', 'Sample interactive dashboard artifact demonstrating dimensional clustering', 'Executive briefing document detailing strategic conclusions derived from visual clustering'],
    'executive_analytics_dashboard.py',
    `import pandas as pd
import numpy as np

class ExecutiveStorytellingDashboard:
    def __init__(self, data: pd.DataFrame):
        self.data = data

    def compute_cluster_projection(self) -> dict:
        # TODO: Dimensionality reduction (UMAP/PCA) with cluster centroid labeling
        pass
`,
    standardRubric('Data Analysis & Visualization', 3)
  );

  // =========================================================================
  // 4. DSA
  // =========================================================================

  // 4.1 Arrays & Strings
  addProj('dsa', 'arrays-strings', 1,
    'In-Place String & Token Processing Buffer',
    'An embedded microcontroller text display requires a fast string formatting and token reversal utility that operates strictly in-place with O(1) auxiliary space, handling sentence reversals, duplicate whitespace stripping, and palindrome verification.',
    'Implement memory-efficient array and string manipulation algorithms operating in linear O(N) time and constant O(1) extra space.',
    [
      'Reverse words in a mutable character array in-place without allocating new string objects (e.g. "the sky is blue" -> "blue is sky the")',
      'Strip redundant internal and trailing whitespace in a single linear pass in O(1) space',
      'Implement in-place array element rotation by K positions using the three-reversal algorithm',
      'Verify alphanumeric palindrome status in O(N) time with two pointers, ignoring non-alphanumeric characters'
    ],
    ['Strict O(1) auxiliary space complexity: cannot create new array copies, strings, or lists', 'Time complexity must be strictly O(N)'],
    ['In-place text processing library', 'Comprehensive unit test suite demonstrating zero additional memory allocations'],
    ['Source code in Python or TypeScript (`inplace_text_buffer.py`)', 'Time and space complexity audit report for all operations', 'Explanation of why in-place pointer reversal avoids memory allocation spikes in low-memory runtimes'],
    'inplace_text_buffer.py',
    `class InPlaceTextBuffer:
    @staticmethod
    def reverse_words(chars: list[str]) -> None:
        """Reverses words in-place in O(N) time and O(1) space."""
        # TODO: Implement word reversal in-place
        pass

    @staticmethod
    def rotate_array(arr: list, k: int) -> None:
        """Rotates array by k steps in-place using three reversals."""
        # TODO: Implement in-place rotation
        pass
`,
    standardRubric('Arrays & Strings', 1)
  );

  addProj('dsa', 'arrays-strings', 2,
    'Sliding Window Real-Time Log Rate Analyzer',
    'A high-throughput API gateway ingests a stream of timestamped log entries. You must implement a sliding window analytics engine that tracks request rates, identifies the longest request sequence satisfying response time constraints, and detects burst thresholds.',
    'Develop an optimal sliding window engine that processes streaming sequence data in O(N) time with dynamic boundary contraction.',
    [
      'Implement a dynamic sliding window finding the minimum contiguous subarray length whose latency sum meets or exceeds target threshold S',
      'Find the longest substring containing at most K distinct error codes in O(N) time using two pointers and a frequency hash map',
      'Implement a sliding window maximum rate tracker using a monotonic double-ended queue (deque) in O(N) time',
      'Handle out-of-order timestamp arrivals within a bounded grace window'
    ],
    ['Overall time complexity must be strictly O(N); nested loops resulting in O(N^2) or O(N*K) will fail evaluation', 'Auxiliary space must not exceed O(K) where K is unique character/element count'],
    ['Sliding window sequence analytics engine', 'Performance benchmark test suite demonstrating linear scaling across 1,000,000 log events'],
    ['Source code (`sliding_window_analyzer.py`)', 'Big-O complexity mathematical proof for monotonic deque sliding window maximum', 'Design document explaining pointer movement invariant conditions'],
    'sliding_window_analyzer.py',
    `from collections import deque

class SlidingWindowAnalyzer:
    @staticmethod
    def min_subarray_len(target: int, nums: list[int]) -> int:
        # TODO: Dynamic two-pointer sliding window in O(N) time
        pass

    @staticmethod
    def sliding_window_max(nums: list[int], k: int) -> list[int]:
        # TODO: Monotonic deque sliding window maximum in O(N) time
        pass
`,
    standardRubric('Arrays & Strings', 2)
  );

  addProj('dsa', 'arrays-strings', 3,
    'High-Throughput Rolling Hash Pattern Matcher (Rabin-Karp) with Prefix Automaton',
    'A bioinformatics sequencing platform needs to identify gene sequence patterns across 100-megabase genomic strings. You must construct a high-performance pattern matching engine implementing Rabin-Karp rolling polynomial hashing and KMP prefix functions with collision resolution.',
    'Build a production-grade multi-pattern string matching system achieving linear average search time with zero false matches.',
    [
      'Implement polynomial rolling hash with large 61-bit Mersenne prime modulus (2^61 - 1) to eliminate hash collision degradation',
      'Construct a Knuth-Morris-Pratt (KMP) prefix table (`pi` array) for deterministic O(N + M) worst-case fallback',
      'Implement two-dimensional grid pattern matching across 2D matrix strings using 2D rolling hashes',
      'Benchmark and compare throughput (MB/s) against naive brute-force scanning'
    ],
    ['Average search time must be O(N + M)', 'Must implement full string verification on hash collision to guarantee zero false positive matches'],
    ['High-throughput pattern search engine', 'Benchmark comparison demonstrating 50x speedup over brute-force on 10MB test strings'],
    ['Source code (`rolling_hash_engine.py`)', 'Theoretical analysis document explaining prime modulus selection and modular arithmetic optimization', 'Unit tests validating edge cases (repeated patterns, pattern longer than text, empty strings)'],
    'rolling_hash_engine.py',
    `class RabinKarpMatcher:
    def __init__(self, prime_mod: int = 2305843009213693951, base: int = 256):
        self.mod = prime_mod
        self.base = base

    def search_all(self, text: str, pattern: str) -> list[int]:
        # TODO: Rolling hash search returning all match start indices
        pass
`,
    standardRubric('Arrays & Strings', 3)
  );

  // 4.2 Trees & Graphs
  addProj('dsa', 'trees-graphs', 1,
    'Binary Search Tree Hierarchical File System Indexer',
    'An operating system indexing daemon requires a self-balancing Binary Search Tree (BST) to maintain sorted directory file records, supporting logarithmic search, range queries, and structural validation.',
    'Implement a robust Binary Search Tree data structure supporting insertion, deletion, range traversal, and tree validity verification.',
    [
      'Construct a pointer-based BST supporting node insertion, search, and three-case deletion (leaf, one child, two children with in-order successor)',
      'Implement in-order, pre-order, and post-order recursive and iterative traversals',
      'Perform range queries finding all records with file sizes between [min_size, max_size] in O(K + log N) time',
      'Implement an automated validator verifying the BST invariant property across all nodes'
    ],
    ['All search, insertion, and deletion operations must run in O(H) where H is tree height', 'Deletion must correctly reconnect subtrees without memory leaks or pointer corruption'],
    ['BST data structure implementation', 'Comprehensive unit test suite covering root deletion, two-child deletion, and range queries'],
    ['Source code (`bst_indexer.py`)', 'Complexity analysis detailing best, average, and worst-case tree heights', 'Written explanation of why degenerate sorted input degrades un-balanced BSTs to O(N) linked lists'],
    'bst_indexer.py',
    `class BSTNode:
    def __init__(self, key: int, value: str):
        self.key = key
        self.value = value
        self.left = None
        self.right = None

class FileSystemBST:
    def __init__(self):
        self.root = None

    def insert(self, key: int, value: str):
        # TODO: Recursive or iterative BST insertion
        pass

    def delete(self, key: int):
        # TODO: Deletion handling 0, 1, and 2 children
        pass
`,
    standardRubric('Trees & Graphs', 1)
  );

  addProj('dsa', 'trees-graphs', 2,
    'Build Dependency Resolver & Cycle Detection Engine',
    'A package manager (like npm or pip) must resolve deep package dependency graphs, detect circular dependency deadlocks, and generate a valid build compilation sequence.',
    'Develop a directed graph engine implementing Kahn algorithm (BFS topological sort) and DFS cycle detection with cycle trace reconstruction.',
    [
      'Represent directed dependency graphs using adjacency lists with in-degree tracking',
      'Implement cycle detection using 3-color Depth-First Search (white, gray, black) and return the exact circular dependency cycle path',
      'Implement Kahn algorithm using an in-degree zero queue to output a valid topological build order',
      'Detect disconnected graph components and resolve independent build stages in parallel'
    ],
    ['Time complexity must be strictly O(V + E)', 'If a cycle exists, the resolver must pinpoint and return the exact loop sequence (e.g. A -> B -> C -> A)'],
    ['Topological build resolver and cycle tracer', 'Unit tests validating complex diamond dependencies, multi-cycle graphs, and linear chains'],
    ['Source code (`dependency_resolver.py`)', 'Documentation explaining why topological sorting is uniquely defined only on Directed Acyclic Graphs (DAGs)', 'Complexity proof for Kahn algorithm vs DFS post-order reversal'],
    'dependency_resolver.py',
    `from collections import deque, defaultdict

class DependencyResolver:
    def __init__(self):
        self.graph = defaultdict(list)
        self.in_degree = defaultdict(int)

    def add_dependency(self, package: str, depends_on: str):
        # TODO: Build directed graph
        pass

    def resolve_build_order(self) -> list[str]:
        # TODO: Kahn algorithm topological sort; raise error with cycle path if cyclic
        pass
`,
    standardRubric('Trees & Graphs', 2)
  );

  addProj('dsa', 'trees-graphs', 3,
    'Shortest-Path Emergency Routing Service with Dijkstra & Disjoint Set Union',
    'An emergency dispatch system must calculate the fastest route across an urban road network with dynamic road closures and traffic delays. Build a shortest-path routing service using Dijkstra with indexed min-heaps, Disjoint Set Union (DSU) for connectivity, and A* heuristic acceleration.',
    'Architect a high-performance routing engine implementing Dijkstra algorithm, Disjoint Set Union with path compression, and bidirectional search.',
    [
      'Implement Dijkstra algorithm using a priority queue (min-heap) to compute shortest paths in O((V + E) log V) time',
      'Implement Disjoint Set Union (DSU) with union by rank and path compression to answer point-to-point reachability queries in O(alpha(V)) time',
      'Implement A* heuristic search using Euclidean / Manhattan distance heuristics to accelerate point-to-point routing queries',
      'Handle dynamic edge weight updates and road closures without recomputing the entire global graph'
    ],
    ['Must handle graphs with 50,000+ vertices and 200,000+ edges with query response latency under 50ms', 'DSU must use both rank balancing and path compression'],
    ['Enterprise graph routing engine', 'Benchmark performance report comparing Dijkstra vs A* node exploration counts on road networks'],
    ['Source code (`emergency_routing_engine.py`)', 'Benchmark audit showing search space reduction with A*', 'System design specification explaining dynamic edge invalidation and priority queue decrease-key alternatives'],
    'emergency_routing_engine.py',
    `import heapq
import math

class EmergencyRoutingEngine:
    def __init__(self):
        self.adjacency = {}
        self.coordinates = {}

    def dijkstra_shortest_path(self, start_node: str, end_node: str) -> tuple[float, list[str]]:
        # TODO: Min-heap Dijkstra shortest path
        pass

    def a_star_search(self, start_node: str, end_node: str) -> tuple[float, list[str]]:
        # TODO: A* heuristic shortest path
        pass
`,
    standardRubric('Trees & Graphs', 3)
  );

  // 4.3 Dynamic Programming
  addProj('dsa', 'dynamic-programming', 1,
    'Resource Allocation Memoizer & Optimal State Scheduler',
    'A serverless compute orchestrator must allocate CPU workloads across time slots to maximize task value without exceeding contiguous execution limits (variant of House Robber / Task Scheduling).',
    'Implement a 1D dynamic programming state scheduler comparing top-down recursive memoization against bottom-up space-optimized tabulation.',
    [
      'Formulate explicit base cases and recurrence relation: `dp[i] = max(dp[i-1], dp[i-2] + task_value[i])`',
      'Implement top-down recursive solution with hash map/array memoization cache',
      'Implement bottom-up iterative tabulation optimizing auxiliary space from O(N) to O(1)',
      'Reconstruct the exact sequence of selected task indices achieving the optimal score'
    ],
    ['Time complexity must be strictly O(N)', 'Tabulation solution must use strictly O(1) auxiliary memory (two tracking variables)'],
    ['Dynamic programming scheduler with solution path reconstruction', 'Unit test suite comparing memoization vs tabulation outputs on identical test arrays'],
    ['Source code (`resource_dp_scheduler.py`)', 'Recurrence relation proof and state transition table documentation', 'Benchmark comparison measuring recursion stack overhead vs iterative tabulation'],
    'resource_dp_scheduler.py',
    `class ResourceDPScheduler:
    @staticmethod
    def max_schedule_value(task_values: list[int]) -> tuple[int, list[int]]:
        """
        Computes maximum non-adjacent task value and returns (max_val, selected_indices).
        Must run in O(N) time and O(1) auxiliary space for value computation.
        """
        # TODO: Implement 1D DP with solution reconstruction
        pass
`,
    standardRubric('Dynamic Programming', 1)
  );

  addProj('dsa', 'dynamic-programming', 2,
    'Multi-Constraint Knapsack & Bounded Portfolio Optimizer',
    'A venture investment fund must allocate capital across startup tranches. Each investment requires capital and developer-months, offering expected valuation returns. Implement a 2D multi-constraint knapsack optimizer with 1D space optimization and solution tracking.',
    'Build a multi-dimensional dynamic programming knapsack engine handling dual constraints (weight and volume) with state space reduction.',
    [
      'Formulate 3D/2D recurrence relation: `dp[w][v] = max(dp[w][v], dp[w - weight[i]][v - volume[i]] + value[i])`',
      'Optimize space from 3D O(N * W * V) to 2D O(W * V) by iterating constraints in reverse order',
      'Implement fractional knapsack greedy baseline and compare optimal integer choices',
      'Reconstruct and output the full portfolio selection list achieving maximum yield'
    ],
    ['Reverse iteration order in 1D/2D array is mandatory to prevent unbounded multiple-inclusion of 0/1 items', 'Execution time must remain under 1 second for N=100, W=200, V=200'],
    ['Multi-constraint knapsack optimization engine', 'Audit comparison report comparing greedy heuristic vs global DP optimum'],
    ['Source code (`portfolio_knapsack_dp.py`)', 'Mathematical documentation of state space reduction and reverse iteration direction', 'Unit tests validating edge cases (zero capacity, items exceeding bounds, identical weights)'],
    'portfolio_knapsack_dp.py',
    `class PortfolioKnapsackOptimizer:
    def __init__(self, max_capital: int, max_dev_months: int):
        self.max_capital = max_capital
        self.max_dev_months = max_dev_months

    def optimize(self, investments: list[dict]) -> tuple[int, list[str]]:
        # TODO: Multi-constraint knapsack DP with reverse iteration and selection reconstruction
        pass
`,
    standardRubric('Dynamic Programming', 2)
  );

  addProj('dsa', 'dynamic-programming', 3,
    'Bitmask State Compression Travelling Salesperson & Interval Optimization Engine',
    'A drone logistics dispatch center must route automated delivery vehicles visiting N customer hubs with minimum total battery consumption. You must implement the Held-Karp Bitmask Dynamic Programming algorithm and an interval matrix chain optimization engine.',
    'Architect an advanced dynamic programming engine implementing bitmask state compression and interval DP with solution reconstruction.',
    [
      'Implement Held-Karp Traveling Salesperson algorithm using bitmask DP (`dp[mask][last_city]`) in O(N^2 * 2^N) time',
      'Compress visited city sets into a 32-bit integer bitmask utilizing bitwise shifts and bitwise AND/OR operations',
      'Reconstruct the exact optimal cyclic tour path from the memoization table',
      'Implement an Interval DP engine for Matrix Chain Multiplication or Optimal Binary Search Trees in O(N^3) time'
    ],
    ['Must solve N=18 TSP routing instances in under 2.5 seconds', 'Must handle non-Euclidean asymmetric distance matrices where distance A->B != B->A'],
    ['Bitmask and Interval DP optimization library', 'Benchmark report detailing exponential state space scaling from N=10 to N=18'],
    ['Source code (`bitmask_tsp_engine.py`)', 'Bitwise state transition proof and recurrence documentation', 'Complexity analysis discussing why bitmask DP is optimal over brute-force O(N!) factorial permutations'],
    'bitmask_tsp_engine.py',
    `class BitmaskTSPOptimizer:
    def __init__(self, distance_matrix: list[list[float]]):
        self.dist = distance_matrix
        self.n = len(distance_matrix)

    def compute_optimal_tour(self) -> tuple[float, list[int]]:
        # TODO: Held-Karp bitmask DP: dp[mask][u] where mask encodes visited set
        pass
`,
    standardRubric('Dynamic Programming', 3)
  );

  // =========================================================================
  // 5. WEB DEVELOPMENT
  // =========================================================================

  // 5.1 HTML, CSS & JavaScript
  addProj('web-development', 'html-css-javascript', 1,
    'Accessible Responsive Component Design System & Modal Controller',
    'A design system team requires a core set of responsive, accessible UI components in vanilla HTML5, CSS Grid/Flexbox, and JavaScript. You must build an accessible modal dialog, accordion, and responsive navigation drawer with complete keyboard focus trapping and ARIA compliance.',
    'Build an accessible vanilla web component library adhering to WAI-ARIA authoring practices with zero framework dependencies.',
    [
      'Semantic HTML5 structure using `<dialog>`, `<nav>`, `<main>`, `<header>`, and `<article>` tags',
      'Responsive layout utilizing CSS Grid and Flexbox with mobile-first media queries',
      'Modal dialog with keyboard focus trapping: pressing Tab cycles focus within the modal; pressing Escape closes it and restores focus to triggering element',
      'Complete ARIA attribute management (`aria-expanded`, `aria-hidden`, `aria-controls`, `role="dialog"`), tested for screen reader compatibility'
    ],
    ['Zero third-party frameworks: pure vanilla HTML5, modern CSS, and vanilla ES6+ JavaScript', 'Must achieve 100% Google Lighthouse accessibility score'],
    ['Fully responsive web page containing accessible modal, accordion, and drawer', 'Accessibility verification checklist documenting focus trap and keyboard shortcuts'],
    ['Source code (`index.html`, `styles.css`, `components.js`)', 'Lighthouse accessibility audit screenshot or test log', 'Technical explanation of focus management and ARIA live regions'],
    'components.js',
    `class AccessibleModal {
  constructor(modalElement, triggerElement) {
    this.modal = modalElement;
    this.trigger = triggerElement;
    this.init();
  }

  init() {
    // TODO: Implement focus trapping, escape key closing, and ARIA attributes
  }
}
`,
    standardRubric('HTML, CSS & JavaScript', 1)
  );

  addProj('web-development', 'html-css-javascript', 2,
    'Async Virtualized Data Grid with Event Delegation & Client Cache',
    'A financial dashboard needs to display 20,000 real-time stock quotes. Rendering 20,000 DOM elements freezes the browser. You must build a virtualized scroll grid in vanilla JavaScript that renders only visible rows, consumes REST endpoints asynchronously, and uses event delegation.',
    'Develop a high-performance vanilla JavaScript virtualized table that smoothly scrolls through tens of thousands of records at 60 frames per second.',
    [
      'Implement DOM virtualization calculating visible row indices from viewport height and scroll offset, rendering ~25 DOM rows instead of 20,000',
      'Implement event delegation by attaching a single event listener to the grid container to handle sorting, selection, and row expansion',
      'Consume asynchronous REST endpoints using Fetch API with abortable `AbortController` signals to cancel stale requests on rapid filtering',
      'Implement an in-memory LRU client cache to prevent redundant HTTP network fetches'
    ],
    ['Must maintain continuous 60fps scrolling without dropped frames or layout thrashing', 'DOM element count must strictly remain under 50 nodes regardless of total dataset size'],
    ['Virtualized data grid component in vanilla JS', 'Performance test log confirming 60fps frame rate and sub-50 DOM node footprint'],
    ['Source code (`virtual_grid.js`, `grid.css`)', 'Frame rate profiling timeline log demonstrating absence of layout thrashing', 'Architecture document explaining event delegation and virtual scroll math'],
    'virtual_grid.js',
    `class VirtualDataGrid {
  constructor(container, rowHeight = 40, totalRows = 20000) {
    this.container = container;
    this.rowHeight = rowHeight;
    this.totalRows = totalRows;
    this.cache = new Map();
  }

  renderVisibleRows(scrollTop, clientHeight) {
    // TODO: Calculate startIndex and endIndex, update transform and render slice
  }
}
`,
    standardRubric('HTML, CSS & JavaScript', 2)
  );

  addProj('web-development', 'html-css-javascript', 3,
    'High-Performance Canvas Graphics Engine & Web Worker Physics Simulation',
    'A web game and data simulation platform requires a particle visualization engine simulating 10,000 interacting particles. Running collision physics on the main thread causes stuttering. Build a multi-threaded web application using HTML5 Canvas and Dedicated Web Workers.',
    'Architect a high-performance browser rendering pipeline combining HTML5 Canvas, requestAnimationFrame, and background Web Workers communicating via ArrayBuffers.',
    [
      'Offload heavy physics calculations (velocity, gravity, collision detection) to a Dedicated Web Worker',
      'Transfer simulation state between worker and main thread using zero-copy Transferable Objects (`ArrayBuffer`) to eliminate serialization overhead',
      'Render particles on HTML5 Canvas using a double-buffered `requestAnimationFrame` loop maintaining steady 60fps',
      'Implement adaptive frame budgeting that dynamically adjusts particle count if device frame rate drops below 55fps'
    ],
    ['Main thread must remain non-blocking: UI buttons and input sliders must respond within 16ms', 'Data transfer must use Transferable ArrayBuffers rather than structured cloning of JSON objects'],
    ['Multi-threaded canvas physics simulation engine', 'Performance audit comparing Transferable ArrayBuffer throughput against JSON postMessage'],
    ['Source code (`canvas_engine.js`, `physics_worker.js`, `index.html`)', 'FPS performance monitor graph demonstrating smooth 60fps under 10,000 particles', 'Architecture specification document detailing Web Worker message passing and memory transfer mechanics'],
    'physics_worker.js',
    `self.onmessage = function(e) {
  // TODO: Receive SharedArrayBuffer or Transferable ArrayBuffer, compute physics, transfer back
};
`,
    standardRubric('HTML, CSS & JavaScript', 3)
  );

  // 5.2 React
  addProj('web-development', 'react', 1,
    'Interactive Filterable Product Catalog with State Synchronization',
    'An online store requires a responsive, component-driven product catalog. You must build a React application supporting multi-category filtering, real-time search debouncing, price range sliders, and URL search parameter synchronization.',
    'Build a well-structured React component application demonstrating modular state management, controlled inputs, and custom hook decomposition.',
    [
      'Decompose application into focused, reusable functional components (SearchBar, FilterSidebar, ProductCard, ProductGrid)',
      'Manage filter state using `useState` and synchronize active filters to browser URL search params via `useSearchParams`',
      'Implement custom debounce hook (`useDebounce`) to prevent excessive re-renders during rapid search input',
      'Provide clean empty states, loading skeletons, and accessible keyboard navigation'
    ],
    ['Must not cause unnecessary re-renders of the entire product grid on keystroke events', 'All form controls must be strictly controlled components'],
    ['Modular React component catalog application', 'Component test suite verifying filter combinations and search debouncing'],
    ['Source code (`ProductCatalog.tsx`, `useDebounce.ts`, `FilterSidebar.tsx`)', 'Component hierarchy diagram and state flow map', 'Brief explanation of why search parameters are mirrored in the URL for shareability'],
    'ProductCatalog.tsx',
    `import React, { useState, useMemo } from 'react';

export const ProductCatalog: React.FC = () => {
  // TODO: Implement multi-filter state, debounced search, and URL search param synchronization
  return (
    <div className="product-catalog">
      {/* Component structure */}
    </div>
  );
};
`,
    standardRubric('React', 1)
  );

  addProj('web-development', 'react', 2,
    'Multi-Step Wizard Form with Custom Hook State Machine & Error Boundary',
    'A fintech enterprise requires a complex multi-step loan application wizard (Personal Info -> Employment Verification -> Financial Summary -> Review). State transitions must be validated step-by-step, draft data must persist across page refreshes, and render crashes must be caught by an Error Boundary.',
    'Construct an advanced React wizard application utilizing `useReducer`, custom form validation hooks, Context API, and resilient Error Boundaries.',
    [
      'Manage multi-step wizard state machine using `useReducer` with explicit actions (NEXT_STEP, PREV_STEP, UPDATE_FIELD, RESET)',
      'Construct a custom hook `useFormValidation` implementing schema validation and dirty field tracking',
      'Persist in-progress draft applications to `localStorage` and restore state seamlessly on page refresh',
      'Wrap wizard branches in a React Error Boundary displaying friendly recovery UI without unmounting the entire application'
    ],
    ['Advancement to subsequent steps must be strictly blocked if current step validation fails', 'Must prevent unhandled runtime errors from crashing the root React component tree'],
    ['Production-grade multi-step React wizard application', 'Unit and integration test suite testing state transitions and error boundary fallback rendering'],
    ['Source code (`WizardForm.tsx`, `wizardReducer.ts`, `useFormValidation.ts`, `ErrorBoundary.tsx`)', 'State machine transition diagram and validation schema specification', 'Architecture document explaining `useReducer` advantages over nested `useState`'],
    'wizardReducer.ts',
    `export interface WizardState {
  currentStep: number;
  formData: Record<string, any>;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

export function wizardReducer(state: WizardState, action: any): WizardState {
  // TODO: Implement deterministic step transitions and field validations
  return state;
}
`,
    standardRubric('React', 2)
  );

  addProj('web-development', 'react', 3,
    'Concurrency-Optimized Financial Trading Dashboard with React 18 & Virtualization',
    'A high-frequency crypto trading exchange receives continuous WebSocket price tick updates across 500 assets. Updating state on every tick causes extreme frame drops. Build a concurrency-optimized dashboard using React 18 `useTransition`, `useDeferredValue`, and list virtualization.',
    'Architect a high-throughput React 18 real-time dashboard that prioritizes urgent user inputs over background price streaming updates.',
    [
      'Integrate `useTransition` and `useDeferredValue` to mark incoming ticker updates as non-urgent transitions, ensuring user clicks remain responsive (<16ms)',
      'Implement list virtualization rendering only assets within view, handling rapid price re-orders smoothly',
      'Optimize component memoization boundaries using `React.memo`, `useMemo`, and `useCallback` with stable reference equality',
      'Construct a custom hook `useWebSocketStream` featuring automatic reconnection, exponential backoff, and batched updates'
    ],
    ['User interactions (search typing, tab switching) must never stutter or drop below 55fps during heavy WebSocket price floods', 'Must demonstrate zero memory leaks when unmounting ticker subscriptions'],
    ['High-frequency trading dashboard in React 18', 'React Profiler audit log demonstrating absence of unnecessary parent-child re-renders'],
    ['Source code (`TradingDashboard.tsx`, `useWebSocketStream.ts`, `VirtualizedTickerList.tsx`)', 'React DevTools Profiler recording showing flamegraph during simulated 100-tick/second burst', 'Technical architecture paper on React 18 concurrent rendering mechanics and render priority lanes'],
    'TradingDashboard.tsx',
    `import React, { useState, useTransition, useDeferredValue } from 'react';

export const TradingDashboard: React.FC = () => {
  // TODO: Implement concurrent transitions, virtualized ticker lists, and memoized trade cards
  return <div>{/* Trading Dashboard */}</div>;
};
`,
    standardRubric('React', 3)
  );

  // 5.3 Backend & REST APIs
  addProj('web-development', 'backend-rest-apis', 1,
    'RESTful Task & Workspace Management API with Express',
    'A collaborative project management tool requires an Express REST API backend managing workspaces, tasks, and assignees, adhering to strict HTTP status codes, structured JSON error formatting, and input validation.',
    'Build a clean, idiomatic Express REST API service with routing controllers, parameter validation, and centralized error handling.',
    [
      'Implement CRUD routes for `/api/workspaces` and `/api/tasks` with proper HTTP verbs (GET, POST, PUT, PATCH, DELETE)',
      'Enforce proper HTTP response status codes: `201 Created` with `Location` header, `204 No Content` on deletion, `400 Bad Request` on validation failure, `404 Not Found` for missing resources',
      'Implement input validation middleware ensuring required task fields and valid enum statuses (`pending`, `in_progress`, `completed`)',
      'Implement centralized error-handling middleware (`(err, req, res, next) => {}`) returning uniform JSON error bodies'
    ],
    ['Must not leak internal stack traces to clients in production error responses', 'Must correctly handle asynchronous errors by forwarding to `next(err)`'],
    ['Express REST API service', 'Automated Supertest / Postman test suite asserting status codes and response bodies'],
    ['Source code (`app.ts`, `taskRoutes.ts`, `taskController.ts`, `errorHandler.ts`)', 'API documentation specifying endpoint request/response payloads', 'Testing report demonstrating 100% endpoint pass rate across positive and negative paths'],
    'taskController.ts',
    `import { Request, Response, NextFunction } from 'express';

export async function createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  // TODO: Validate body, create task, return 201 Created with JSON payload
}

export async function getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
  // TODO: Fetch task, return 200 or 404 Not Found
}
`,
    standardRubric('Backend & REST APIs', 1)
  );

  addProj('web-development', 'backend-rest-apis', 2,
    'Authenticated Enterprise Gateway with JWT, RBAC & Redis Rate Limiting',
    'A healthcare microservices backend requires an authenticated API gateway enforcing JWT verification, Role-Based Access Control (RBAC: Admin, Doctor, Patient), CORS preflight compliance, and token bucket rate limiting.',
    'Construct an enterprise-grade Express API security gateway implementing token verification, role permissions, CORS security, and request rate throttling.',
    [
      'Implement JWT authentication middleware verifying Bearer tokens and decoding user claims',
      'Implement Role-Based Access Control (RBAC) middleware verifying user roles before allowing access to restricted healthcare endpoints',
      'Configure CORS middleware supporting explicit frontend origins with credentials while handling preflight `OPTIONS` requests',
      'Implement sliding-window or token-bucket rate limiting (e.g. max 100 requests per 15 minutes per IP) with `Retry-After` headers'
    ],
    ['Must reject expired or tampered JWT signatures with `401 Unauthorized`', 'Must block unauthorized roles with `403 Forbidden` rather than 401', 'CORS must not use wildcard `*` alongside credentials'],
    ['Authenticated API gateway service with RBAC and rate limiter', 'Test suite testing token expiration, role enforcement, and rate limit triggers'],
    ['Source code (`authMiddleware.ts`, `rbacMiddleware.ts`, `rateLimiter.ts`, `gatewayApp.ts`)', 'Security audit test log demonstrating blocked unauthorized requests and rate limit HTTP 429 responses', 'Architecture document explaining difference between authentication, authorization, and rate limiting algorithms'],
    'authMiddleware.ts',
    `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: Verify JWT, check req.user.role in allowedRoles, return 401 or 403
  };
}
`,
    standardRubric('Backend & REST APIs', 2)
  );

  addProj('web-development', 'backend-rest-apis', 3,
    'Resilient Microservice Backend with Circuit Breaking, Idempotency & Graceful Shutdown',
    'A payment processing backend interfaces with third-party payment gateways prone to intermittent outages. You must architect a fault-tolerant Express backend implementing the Circuit Breaker pattern, atomic idempotency keys using Redis/database locks, and zero-downtime graceful shutdown.',
    'Build an enterprise-grade payment processing backend with circuit breaker protection, idempotent mutation handling, and graceful process termination.',
    [
      'Implement Idempotency-Key handling: caching responses against unique client request UUIDs to prevent duplicate payment charges upon network retries',
      'Implement Circuit Breaker pattern (Closed, Open, Half-Open states) monitoring downstream gateway failure rates and fast-failing calls when open',
      'Implement ACID transactional database isolation ensuring balance debits and ledger credits execute atomically',
      'Implement zero-downtime graceful shutdown on `SIGTERM` / `SIGINT`: closing HTTP listeners, waiting for active requests to drain, closing DB connection pools, then exiting'
    ],
    ['Retrying an identical payment with the same Idempotency-Key must return the original cached response without executing duplicate charges', 'Circuit breaker must transition to Open after 5 consecutive failures and Half-Open after a cooldown period'],
    ['Resilient payment microservice', 'Chaos testing report demonstrating circuit breaker tripping and idempotent retry safety under network simulation'],
    ['Source code (`paymentApp.ts`, `circuitBreaker.ts`, `idempotencyMiddleware.ts`, `gracefulShutdown.ts`)', 'Chaos testing log documenting system behavior during downstream outages', 'Technical architecture paper on distributed transactions, circuit breakers, and two-phase commit alternatives'],
    'circuitBreaker.ts',
    `export enum CircuitState { CLOSED, OPEN, HALF_OPEN }

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;

  async execute<T>(action: () => Promise<T>): Promise<T> {
    // TODO: Implement circuit breaker state transitions and timeout cooldown
    return await action();
  }
}
`,
    standardRubric('Backend & REST APIs', 3)
  );

  return bank;
}

const projectBank: ProjectSpecification[] = buildProjectBank();

export function getProjectSpecification(
  domainId: string,
  skillId: string,
  levelNumber: number
): ProjectSpecification {
  const normDomain = domainId.toLowerCase().trim();
  const normSkill = skillId.toLowerCase().trim();
  const normLevel = Number(levelNumber) || 1;

  const matched = projectBank.find(
    (p) =>
      (p.domainId.toLowerCase() === normDomain || normDomain.includes(p.domainId.toLowerCase())) &&
      (p.skillId.toLowerCase() === normSkill || normSkill.includes(p.skillId.toLowerCase())) &&
      p.levelNumber === normLevel
  );

  if (matched) return matched;

  // Fallback match on skill and level
  const fallbackSkill = projectBank.find(
    (p) => p.skillId.toLowerCase() === normSkill && p.levelNumber === normLevel
  );
  if (fallbackSkill) return fallbackSkill;

  // Fallback to domain and level
  const fallbackDomain = projectBank.find(
    (p) => p.domainId.toLowerCase() === normDomain && p.levelNumber === normLevel
  );
  if (fallbackDomain) return fallbackDomain;

  return projectBank[0];
}

export function getAllProjects(): ProjectSpecification[] {
  return projectBank;
}
