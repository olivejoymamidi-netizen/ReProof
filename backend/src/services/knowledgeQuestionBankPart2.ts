import { KnowledgeQuestion } from './knowledgeQuestionBank';

export function buildSupplementaryQuestions(): KnowledgeQuestion[] {
  const bank: KnowledgeQuestion[] = [];

  const addQ = (
    domainId: string,
    skillId: string,
    levelNumber: number,
    qIdx: number,
    questionText: string,
    options: [string, string, string, string],
    correctAnswer: 'A' | 'B' | 'C' | 'D',
    explanation: string,
    category: string,
    codeSnippet?: string,
    questionType: 'multiple_choice' | 'scenario' | 'debugging' | 'conceptual' = 'multiple_choice'
  ) => {
    const difficulty =
      levelNumber === 1 ? 'Beginner' : levelNumber === 2 ? 'Intermediate' : 'Advanced';

    bank.push({
      id: `${domainId}_${skillId}_L${levelNumber}_q${qIdx}`,
      domainId,
      skillId,
      levelNumber,
      questionText,
      codeSnippet,
      questionType,
      options: [
        { id: 'A', text: options[0] },
        { id: 'B', text: options[1] },
        { id: 'C', text: options[2] },
        { id: 'D', text: options[3] },
      ],
      correctAnswer,
      explanation,
      difficulty,
      category,
    });
  };

  // =========================================================================
  // 1. AI / ML
  // =========================================================================

  // Python for ML - Level 1 (Q6-Q9)
  addQ('ai-ml', 'python-for-ml', 1, 6,
    'Which NumPy function initializes an array of shape (3, 3) filled with zeros in a single call?',
    ['np.empty((3, 3))', 'np.zeros((3, 3))', 'np.null((3, 3))', 'np.blank((3, 3))'],
    'B', '`np.zeros(shape)` allocates a contiguous memory buffer populated with zero values of the requested dtype.', 'Array Initialization');
  addQ('ai-ml', 'python-for-ml', 1, 7,
    'What is the result of `np.arange(0, 10, 2)`?',
    ['[0, 1, 2, 3, 4]', '[0, 2, 4, 6, 8]', '[2, 4, 6, 8, 10]', '[0, 2, 4, 6, 8, 10]'],
    'B', '`np.arange(start, stop, step)` generates values from start up to (but excluding) stop with the given step.', 'Array Generation');
  addQ('ai-ml', 'python-for-ml', 1, 8,
    'What does the `.ndim` attribute of a NumPy array signify?',
    ['The byte size of elements', 'The total number of dimensions (axes)', 'The length of the first dimension', 'The memory pointer address'],
    'B', '`.ndim` returns an integer indicating the number of axes/dimensions of the array.', 'Array Attributes');
  addQ('ai-ml', 'python-for-ml', 1, 9,
    'Which method computes the average across columns (along rows) for a 2D array `X`?',
    ['X.mean(axis=0)', 'X.mean(axis=1)', 'np.column_average(X)', 'X.sum(axis=None)'],
    'A', 'In NumPy, `axis=0` aggregates along the column dimension, collapsing rows into a 1D mean array.', 'Reductions');

  // Python for ML - Level 2 (Q6-Q9)
  addQ('ai-ml', 'python-for-ml', 2, 6,
    'Given two arrays `a` of shape (5, 1) and `b` of shape (1, 4), what is the resulting shape of `a + b`?',
    ['(5, 4)', '(5, 1)', '(1, 4)', 'ValueError: shapes incompatible'],
    'A', 'Broadcasting rules expand singleton dimensions along both axes, producing an outer product matrix of shape (5, 4).', 'Broadcasting Matrix');
  addQ('ai-ml', 'python-for-ml', 2, 7,
    'Why is `np.dot` different from `np.matmul` when operating on 3D tensor batches?',
    ['np.dot broadcasts across leading batch dimensions; np.matmul performs 2D matrix multiplies over trailing axes for each batch', 'np.dot requires complex numbers', 'np.matmul only works on vectors', 'They are strictly identical'],
    'A', '`np.matmul` treats trailing 2 dimensions as matrices and broadcasts remaining batch dimensions, ideal for ML batches.', 'Tensor Multiplication');
  addQ('ai-ml', 'python-for-ml', 2, 8,
    'Review the code below. Why does `np.linalg.inv(A)` raise a LinAlgError?',
    ['Matrix dimension is odd', 'Matrix A has determinant zero (singular/linearly dependent columns) and is not invertible', 'Negative numbers are not permitted in inverses', 'Float precision failure'],
    'B', 'Singular matrices with zero determinant or linearly dependent rows cannot be inverted. `pinv` should be used instead.', 'Linear Algebra Debugging',
    'A = np.array([[1, 2], [2, 4]])\ninv = np.linalg.inv(A)', 'debugging');
  addQ('ai-ml', 'python-for-ml', 2, 9,
    'How do you compute the Euclidean pairwise distance matrix between array X (N, D) and Y (M, D) without explicit Python for loops?',
    ['Call `np.dist(X, Y)`', 'Use broadcasting with `(X[:, np.newaxis, :] - Y[np.newaxis, :, :])**2` summed over axis 2', 'Run nested list comprehension', 'Cast arrays to strings'],
    'B', 'Inserting `np.newaxis` enables vectorized broadcasting to compute all N x M pairwise differences in C without Python overhead.', 'Vectorized Distance');

  // Python for ML - Level 3 (Q6-Q9)
  addQ('ai-ml', 'python-for-ml', 3, 6,
    'How does NumPy memory alignment (strides) impact vectorized BLAS / LAPACK routine acceleration?',
    ['Non-contiguous memory triggers fallback to unvectorized element-by-element loops, bypassing SIMD registers (AVX-512)', 'Strides determine encryption keys', 'BLAS ignores memory layout completely', 'Memory strides force GPU migration'],
    'A', 'BLAS routines rely on sequential cache line prefetching. Non-contiguous strides ruin SIMD pipelining and cache efficiency.', 'Memory Architecture');
  addQ('ai-ml', 'python-for-ml', 3, 7,
    'When implementing a custom vectorized Log-Sum-Exp function, how do you prevent catastrophic numerical underflow/overflow?',
    ['Divide all values by 1000', 'Subtract `max(x)` before exponentiation: `max_x + log(sum(exp(x - max_x)))`', 'Cast all values to int32', 'Set negative numbers to zero'],
    'B', 'The Log-Sum-Exp trick shifts values by subtracting their maximum, keeping exponent arguments <= 0 and preventing `inf`.', 'Numerical Stability');
  addQ('ai-ml', 'python-for-ml', 3, 8,
    'What is the purpose of passing `copy=False` in `np.asarray(x)`?',
    ['To encrypt the input array', 'To avoid creating an in-memory duplicate if `x` is already a matching contiguous ndarray', 'To delete the input array from disk', 'To suppress floating point warnings'],
    'B', '`np.asarray(x, copy=False)` reuses the existing ndarray memory buffer without duplicating RAM allocation.', 'Memory Optimization');
  addQ('ai-ml', 'python-for-ml', 3, 9,
    'In production ML pipelines, why is vectorizing with `np.vectorize` NOT a true performance optimization?',
    ['It is deprecated', 'Under the hood, `np.vectorize` is fundamentally a Python-level loop with convenience syntax, not compiled C code', 'It only works on 1D arrays', 'It mutates inputs in place'],
    'B', '`np.vectorize` provides convenience for broadcasting but executes a Python loop internally, lacking SIMD speedups.', 'Performance Anti-patterns');

  // Data Preprocessing - Level 1 (Q6-Q9)
  addQ('ai-ml', 'data-preprocessing', 1, 6,
    'Which Pandas method detects missing null values across DataFrame columns?',
    ['df.empty()', 'df.isnull().sum()', 'df.filter_na()', 'df.check_missing()'],
    'B', '`df.isnull().sum()` produces a boolean mask of null entries and aggregates counts per column.', 'Null Detection');
  addQ('ai-ml', 'data-preprocessing', 1, 7,
    'What happens to dataset rows when `df.dropna()` is invoked without arguments?',
    ['Only columns with all nulls are dropped', 'Any row containing at least one null value is removed', 'Nulls are replaced with zero', 'The DataFrame is cleared completely'],
    'B', 'By default, `dropna(axis=0, how="any")` removes any row that contains one or more missing values.', 'Missing Value Removal');
  addQ('ai-ml', 'data-preprocessing', 1, 8,
    'What is the fundamental difference between ordinal encoding and one-hot encoding?',
    ['Ordinal assigns sequential integers reflecting inherent order; one-hot creates binary indicator columns for unordered categories', 'One-hot encoding is only for text files', 'Ordinal encoding is non-deterministic', 'They are identical'],
    'A', 'Ordinal encoding encodes rank order (e.g. Low=1, Med=2, High=3), whereas one-hot encodes nominal unordered categories.', 'Encoding Basics');
  addQ('ai-ml', 'data-preprocessing', 1, 9,
    'Which scaler is most appropriate when feature values must strictly lie between 0 and 1?',
    ['StandardScaler', 'MinMaxScaler', 'RobustScaler', 'Normalizer'],
    'B', '`MinMaxScaler` compresses the domain linearly into the [0, 1] range.', 'Scaling Selection');

  // Data Preprocessing - Level 2 (Q6-Q9)
  addQ('ai-ml', 'data-preprocessing', 2, 6,
    'A data scientist performs frequency encoding on high-cardinality zip codes. What risk must be mitigated?',
    ['Zip codes turning into complex numbers', 'Different zip codes having identical frequency counts, creating artificial collisions', 'Loss of numeric indices', 'Zero division error'],
    'B', 'When distinct categories share identical frequencies, frequency encoding maps them to the same scalar value, losing uniqueness.', 'Frequency Encoding');
  addQ('ai-ml', 'data-preprocessing', 2, 7,
    'Why is applying log transformation `np.log1p(x)` common for right-skewed positive features like revenue or prices?',
    ['It compresses extreme high-value tails, transforming the distribution closer to Gaussian normality', 'It eliminates all negative values', 'It turns regression into classification', 'It guarantees zero variance'],
    'A', '`log1p(x)` (log(1 + x)) dampens severe right skewness, stabilizing variance and improving linear and neural model convergence.', 'Power Transforms');
  addQ('ai-ml', 'data-preprocessing', 2, 8,
    'In a healthcare dataset, missing blood pressure is strongly correlated with patient age. What category of missingness is this?',
    ['MCAR (Missing Completely At Random)', 'MAR (Missing At Random)', 'MNAR (Missing Not At Random)', 'Deterministic Absence'],
    'B', 'MAR means missingness depends systematically on observed data (age) rather than the unobserved value itself.', 'Missingness Taxonomy');
  addQ('ai-ml', 'data-preprocessing', 2, 9,
    'Why should feature scaling be performed inside each cross-validation fold rather than globally on the whole dataset?',
    ['To reduce computation time', 'To eliminate data leakage where test fold statistics inflate training validation metrics', 'Because scaling only works on subsets', 'To preserve random seeds'],
    'B', 'Global scaling leaks mean and variance of test folds into training, creating overly optimistic validation metrics.', 'Leakage Prevention');

  // Data Preprocessing - Level 3 (Q6-Q9)
  addQ('ai-ml', 'data-preprocessing', 2, 10,
    'What is data drift (covariate shift), and how does it differ from concept drift?',
    ['Covariate shift is a change in feature distribution P(X) while P(Y|X) remains constant; concept drift changes the mapping P(Y|X)', 'They are synonymous', 'Covariate shift only affects databases', 'Concept drift only occurs in reinforcement learning'],
    'A', 'Covariate shift alters input feature distributions over time; concept drift alters the statistical relationship between inputs and targets.', 'Drift Analysis');
  addQ('ai-ml', 'data-preprocessing', 3, 6,
    'When handling high-dimensional text embeddings in a production vector store, why is L2 normalization applied prior to cosine search?',
    ['It shrinks the byte size to 8 bits', 'Cosine similarity between unit-normalized vectors reduces to a fast dot product, enabling hardware acceleration', 'It removes stopwords', 'It prevents network timeouts'],
    'B', 'When vectors have unit L2 norm (||v||=1), cosine similarity cos(theta) = u . v, avoiding costly norm divisions during queries.', 'Vector Optimization');
  addQ('ai-ml', 'data-preprocessing', 3, 7,
    'In streaming real-time feature computation, what architecture avoids re-computing aggregations over unbounded windows?',
    ['Storing all historical raw events in memory', 'Incremental streaming state stores (e.g. Apache Flink tumbling/sliding state) with watermarks', 'Re-querying PostgreSQL every millisecond', 'Cron jobs dumping CSVs'],
    'B', 'Streaming engines maintain stateful accumulators bounded by event-time watermarks, calculating aggregates in O(1) time.', 'Streaming Feature Pipelines');
  addQ('ai-ml', 'data-preprocessing', 3, 8,
    'What strategy detects adversarial data poisoning in training feature distributions prior to model re-training?',
    ['Increasing the learning rate', 'Statistical distance metrics (Wasserstein distance / Population Stability Index) against golden baseline distributions', 'Disabling validation splits', 'Hashing passwords'],
    'B', 'PSI and Wasserstein distance quantify divergence between live training batches and certified baseline distributions, flagging anomalies.', 'Distribution Monitoring');

  // Machine Learning - Level 1 (Q6-Q9)
  addQ('ai-ml', 'machine-learning', 1, 6,
    'What is the output range of the sigmoid activation function used in logistic regression?',
    ['[-1, 1]', '[0, 1]', '(-inf, +inf)', '[0, inf)'],
    'B', 'Sigmoid maps any real-valued number into the (0, 1) probability interval: 1 / (1 + e^-z).', 'Activation Functions');
  addQ('ai-ml', 'machine-learning', 1, 7,
    'Which algorithm is an unsupervised clustering technique that partitions data into K centroids?',
    ['K-Nearest Neighbors', 'K-Means', 'Linear Regression', 'Decision Tree'],
    'B', 'K-Means is an unsupervised clustering algorithm that iteratively minimizes intra-cluster Euclidean variance around K centroids.', 'Clustering Basics');
  addQ('ai-ml', 'machine-learning', 1, 8,
    'In linear regression, what mathematical criterion does Ordinary Least Squares (OLS) minimize?',
    ['Sum of absolute errors', 'Sum of squared residuals between predictions and ground truth', 'Maximum classification margin', 'Cross-entropy loss'],
    'B', 'OLS finds weight coefficients that minimize the sum of squared differences (residuals) between predicted and actual values.', 'Loss Functions');
  addQ('ai-ml', 'machine-learning', 1, 9,
    'What does the F1-score represent in classification evaluations?',
    ['Arithmetic mean of Accuracy and Precision', 'Harmonic mean of Precision and Recall', 'Geometric mean of True Positives and False Positives', 'Product of Sensitivity and Specificity'],
    'B', 'F1-score is 2 * (Precision * Recall) / (Precision + Recall), giving balanced weighting to both metrics under class imbalance.', 'Evaluation Metrics');

  // Machine Learning - Level 2 (Q6-Q9)
  addQ('ai-ml', 'machine-learning', 2, 6,
    'When training a decision tree, how does setting `min_samples_split` to a higher value affect model complexity?',
    ['Increases tree depth and encourages overfitting', 'Restricts tree splitting, regularizing the model and reducing variance', 'Guarantees zero bias', 'Forces the tree into a linear model'],
    'B', 'Requiring more samples before splitting a node prevents creating isolated leaves that memorize individual training samples.', 'Tree Regularization');
  addQ('ai-ml', 'machine-learning', 2, 7,
    'A random forest model has 100% accuracy on training data and 72% on test data. Which hyperparameter adjustment will help close the generalization gap?',
    ['Increase `max_depth` and remove `min_samples_leaf`', 'Decrease `max_depth` and increase `min_samples_leaf`', 'Increase the learning rate', 'Double the training epochs'],
    'B', 'Limiting maximum depth and requiring more samples per leaf node curbs over-specialization and improves test generalization.', 'Overfitting Mitigation');
  addQ('ai-ml', 'machine-learning', 2, 8,
    'Why is ROC-AUC invariant to class distribution changes, whereas Precision-Recall AUC (PR-AUC) is not?',
    ['ROC-AUC does not use True Positives', 'ROC-AUC evaluates True Positive Rate vs False Positive Rate, which do not depend on class balance; PR-AUC incorporates Precision, which shifts with base prevalence', 'ROC-AUC is only for balanced data', 'PR-AUC ignores False Positives'],
    'B', 'Precision includes False Positives against minority positives. If negative count skyrockets, Precision degrades while FPR remains stable.', 'Metric Selection');
  addQ('ai-ml', 'machine-learning', 2, 9,
    'What is the primary advantage of Stacking over simple Voting Ensembles?',
    ['Stacking trains a meta-model that learns how to optimally weight predictions of base estimators', 'Stacking runs 10x faster', 'Stacking does not require validation data', 'Stacking only uses linear models'],
    'A', 'Stacking uses cross-validated base predictions as inputs to train a secondary meta-estimator, learning non-linear blend weights.', 'Ensemble Architecture');

  // Machine Learning - Level 3 (Q6-Q9)
  addQ('ai-ml', 'machine-learning', 3, 6,
    'When deploying an XGBoost model to production, what is the impact of compiling it with Treelite or ONNX Runtime?',
    ['Translates Python trees into C/assembly code, eliminating interpreter overhead and achieving microsecond prediction latency', 'Compresses training loss to zero', 'Automates feature selection', 'Replaces trees with neural networks'],
    'A', 'Treelite compiles decision trees into native machine instructions (nested if-else SIMD assembly), eliminating runtime traversal overhead.', 'Model Compilation');
  addQ('ai-ml', 'machine-learning', 3, 7,
    'In probability calibration, why would you apply Platt Scaling or Isotonic Regression to raw model outputs?',
    ['To normalize features', 'To align uncalibrated model score outputs (e.g. from SVMs or boosted trees) with true empirical class probabilities', 'To speed up training', 'To eliminate outliers'],
    'B', 'Tree and margin models often output biased or distorted probabilities. Calibration maps raw outputs to true frequency probabilities.', 'Probability Calibration');
  addQ('ai-ml', 'machine-learning', 3, 8,
    'What is catastrophic forgetting in continual learning systems, and how is it mitigated?',
    ['Hard drive failure; mitigated by backups', 'Neural networks overwriting previously learned representations when trained sequentially on new distributions; mitigated via replay buffers or regularization (EWC)', 'A bug in Python garbage collection', 'Loss of learning rate'],
    'B', 'Continual training on new data causes gradient updates that destroy earlier task parameters unless constrained by replay or elastic penalties.', 'Continual Learning');

  // =========================================================================
  // 2. CYBERSECURITY
  // =========================================================================

  // Networking Fundamentals - Level 1 (Q6-Q9)
  addQ('cybersecurity', 'networking-fundamentals', 1, 6,
    'What is the primary function of DNS (Domain Name System)?',
    ['Encrypting web traffic', 'Translating human-readable domain names into machine-routable IP addresses', 'Assigning MAC addresses to network cards', 'Filtering malware'],
    'B', 'DNS acts as the phonebook of the internet, resolving human hostnames (e.g. example.com) to numeric IP addresses.', 'DNS Fundamentals');
  addQ('cybersecurity', 'networking-fundamentals', 1, 7,
    'Which protocol dynamically assigns IP addresses, default gateways, and DNS servers to client devices joining a LAN?',
    ['BGP', 'DHCP', 'SNMP', 'SMTP'],
    'B', 'DHCP (Dynamic Host Configuration Protocol) leases IP configuration automatically to network clients upon connection.', 'DHCP Basics');
  addQ('cybersecurity', 'networking-fundamentals', 1, 8,
    'What is the difference between TCP and UDP at the transport layer?',
    ['TCP is connectionless; UDP is connection-oriented', 'TCP provides reliable, ordered, error-checked delivery via handshakes; UDP is connectionless with low latency and no delivery guarantees', 'UDP is encrypted; TCP is plaintext', 'TCP only operates on IPv6'],
    'B', 'TCP guarantees packet order and retransmits lost segments; UDP transmits without handshakes or delivery confirmation.', 'Transport Protocols');
  addQ('cybersecurity', 'networking-fundamentals', 1, 9,
    'What loopback IP address is reserved to refer to the local machine in IPv4?',
    ['192.168.1.1', '127.0.0.1', '10.0.0.1', '255.255.255.255'],
    'B', '127.0.0.1 (or localhost) routes traffic internally back to the local network stack without traversing physical hardware.', 'IP Addressing');

  // Networking Fundamentals - Level 2 (Q6-Q9)
  addQ('cybersecurity', 'networking-fundamentals', 2, 6,
    'In a Wireshark packet capture, an analyst observes TCP packets with the RST flag set. What does this signify?',
    ['A connection is successfully established', 'The sending socket abruptly rejected or terminated the TCP connection', 'The client is requesting more data', 'TLS handshake is complete'],
    'B', 'The RST (Reset) flag immediately tears down a connection when an unexpected packet arrives or a port is closed.', 'TCP Flags & Teardown');
  addQ('cybersecurity', 'networking-fundamentals', 2, 7,
    'What vulnerability allows an attacker on the same local network segment to intercept traffic between a victim and the gateway?',
    ['SQL Injection', 'ARP Poisoning / Spoofing', 'Cross-Site Scripting', 'Buffer Overflow'],
    'B', 'ARP spoofing broadcasts fraudulent MAC-to-IP mappings across Layer 2, redirecting victim traffic through the attacker machine.', 'Layer 2 Attacks');
  addQ('cybersecurity', 'networking-fundamentals', 2, 8,
    'Why would an enterprise deploy split-tunnel VPN instead of full-tunnel VPN for remote workers?',
    ['To prevent malware entirely', 'To route company intranet traffic through the corporate VPN tunnel while sending generic internet traffic directly via local ISP, saving corporate bandwidth', 'To encrypt only DNS queries', 'Because full-tunnel is deprecated'],
    'B', 'Split tunneling conserves enterprise bandwidth by routing only internal corporate CIDR ranges over the VPN.', 'VPN Architecture');
  addQ('cybersecurity', 'networking-fundamentals', 2, 9,
    'What does a TTL (Time To Live) field in an IPv4 packet header prevent?',
    ['Packet tampering', 'Packets circulating indefinitely in routing loops by decrementing at each hop until reaching 0 and being discarded', 'Eavesdropping', 'Port scanning'],
    'B', 'Each router decrements TTL by 1. When TTL hits 0, an ICMP Time Exceeded packet is returned, preventing network congestion loops.', 'Packet Mechanics');

  // Networking Fundamentals - Level 3 (Q6-Q9)
  addQ('cybersecurity', 'networking-fundamentals', 3, 6,
    'How does BGP route hijacking occur on the global internet backbone?',
    ['By guessing root DNS passwords', 'A rogue or misconfigured Autonomous System (AS) announces unauthorized IP prefixes via BGP, diverting global internet traffic to its nodes', 'By spamming HTTP requests', 'Through physical cable cuts'],
    'B', 'Because legacy BGP relies on trust without mandatory cryptographic origin validation (RPKI), bogus announcements divert traffic globally.', 'BGP Routing Security');
  addQ('cybersecurity', 'networking-fundamentals', 3, 7,
    'What is the security risk of TLS termination occurring at an edge reverse proxy before internal microservices?',
    ['Internal traffic between the proxy and upstream microservices travels in unencrypted plaintext unless protected by mTLS in a zero-trust mesh', 'It breaks HTTP/2', 'Clients cannot read cookies', 'Reverse proxies cannot cache responses'],
    'A', 'If edge proxies terminate TLS, internal network sniffing (lateral movement) can intercept sensitive payloads unless internal mTLS is enforced.', 'Zero Trust & TLS');
  addQ('cybersecurity', 'networking-fundamentals', 3, 8,
    'In defending against massive UDP amplification attacks (e.g. NTP or DNS reflection), what architectural control is most effective at ISP ingress?',
    ['Installing local antivirus', 'BCP 38 / Source Address Validation (SAV) to drop outgoing packets with spoofed source IPs at border routers', 'Disabling UDP globally', 'Increasing server RAM'],
    'B', 'BCP 38 mandates that networks verify egress packets originate from valid assigned CIDRs, eliminating IP spoofing required for amplification.', 'DDoS Mitigation');

  // Web Security - Level 1 (Q6-Q9)
  addQ('cybersecurity', 'web-security', 1, 6,
    'What does the HTTP `HttpOnly` cookie flag prevent?',
    ['Sending cookies over HTTPS', 'Client-side JavaScript (`document.cookie`) from accessing the cookie, mitigating XSS token theft', 'Cookies from expiring', 'Cross-origin requests'],
    'B', '`HttpOnly` instructs the browser that JavaScript must not read the cookie, protecting session tokens from XSS scripts.', 'Cookie Security');
  addQ('cybersecurity', 'web-security', 1, 7,
    'What does the `SameSite=Strict` cookie attribute enforce?',
    ['Cookies are only sent in encrypted emails', 'Cookies are withheld on all cross-site requests, providing robust protection against CSRF', 'Cookies cannot be stored on disk', 'Cookies work only on localhost'],
    'B', '`SameSite=Strict` prevents the browser from attaching the cookie on any cross-origin navigation, neutralizing CSRF attacks.', 'CSRF Prevention');
  addQ('cybersecurity', 'web-security', 1, 8,
    'Which OWASP vulnerability occurs when user input is directly concatenated into an SQL query string?',
    ['Cross-Site Request Forgery (CSRF)', 'SQL Injection (SQLi)', 'Insecure Direct Object Reference (IDOR)', 'Broken Access Control'],
    'B', 'Direct string concatenation allows attacker inputs to escape data context and execute arbitrary SQL commands.', 'Injection Flaws');
  addQ('cybersecurity', 'web-security', 1, 9,
    'What is the primary purpose of the HTTP `Content-Security-Policy` (CSP) header?',
    ['To speed up CSS rendering', 'To restrict sources from which scripts, styles, and media can be loaded and executed by the browser, mitigating XSS', 'To set user session timeouts', 'To enable WebSockets'],
    'B', 'CSP defines approved domains for script execution, blocking inline script injections and unauthorized external exfiltration endpoints.', 'CSP Defense');

  // Web Security - Level 2 (Q6-Q9)
  addQ('cybersecurity', 'web-security', 2, 6,
    'A web application exposes an endpoint `GET /api/documents?id=1042`. Changing `id=1043` returns another customer sensitive document without checking permissions. What vulnerability is this?',
    ['Cross-Site Scripting', 'Insecure Direct Object Reference (IDOR) / Broken Object Level Authorization (BOLA)', 'SQL Injection', 'Cross-Origin Resource Sharing'],
    'B', 'IDOR/BOLA occurs when user-supplied identifiers access backend objects without verifying if the authenticated user owns that resource.', 'Access Control');
  addQ('cybersecurity', 'web-security', 2, 7,
    'How does a Double-Submit Cookie pattern protect state-changing requests against CSRF attacks?',
    ['By hashing passwords twice', 'The server sets a random cookie and requires the client to send the identical value in a custom HTTP header; cross-origin sites cannot read or forge the header', 'By requiring two logins', 'By duplicating database rows'],
    'B', 'Same-origin policy prevents malicious cross-site domains from reading cookie values or setting custom request headers.', 'CSRF Token Architecture');
  addQ('cybersecurity', 'web-security', 2, 8,
    'What is the security risk of setting the HTTP header `Access-Control-Allow-Origin: *` on an internal authenticated endpoint?',
    ['It crashes Node.js', 'Any third-party website visited by an authenticated user can read sensitive response data via client-side fetch', 'It forces all traffic into HTTPS', 'It deletes database sessions'],
    'B', 'A wildcard `*` origin allows any malicious site to issue cross-origin GET requests and read the returned responses in the browser.', 'CORS Misconfiguration');
  addQ('cybersecurity', 'web-security', 2, 9,
    'What is Server-Side Request Forgery (SSRF)?',
    ['An attack where client cookies are stolen', 'An attack where a vulnerable server is tricked into issuing unauthorized HTTP requests to internal/loopback network resources (e.g. AWS metadata 169.254.169.254)', 'A DDoS attack on DNS', 'Tampering with JavaScript on CDN'],
    'B', 'SSRF occurs when server functionality accepts an attacker-controlled URL and fetches it without validating destination IP restrictions.', 'SSRF Exploitation');

  // Web Security - Level 3 (Q6-Q9)
  addQ('cybersecurity', 'web-security', 3, 6,
    'How does an attacker exploit Prototype Pollution in JavaScript environments to achieve Remote Code Execution (RCE)?',
    ['By altering CSS styles', 'By injecting malicious properties into `Object.prototype` via recursive merge/clone utilities, which are subsequently executed by gadget functions (e.g. child_process.spawn)', 'By overflowing integers in math libraries', 'By sending invalid JSON'],
    'B', 'Polluting `Object.prototype` cascades inherited properties across all objects. When Node.js libraries invoke shell commands using unvalidated options, RCE occurs.', 'Prototype Pollution');
  addQ('cybersecurity', 'web-security', 3, 7,
    'What security control prevents timing attacks when comparing sensitive authentication tokens (e.g. API keys or HMAC signatures)?',
    ['Standard `===` string equality comparison', 'Constant-time comparison algorithms (e.g., `crypto.timingSafeEqual`)', 'Base64 encoding the strings first', 'Running the comparison in a background thread'],
    'B', 'Standard string equality terminates at the first mismatching byte, leaking character-by-character timing clues. Constant-time operations prevent this.', 'Side-Channel Defense');
  addQ('cybersecurity', 'web-security', 3, 8,
    'When implementing OAuth 2.0 for Single-Page Applications (SPAs), why is PKCE (Proof Key for Code Exchange) mandatory instead of the implicit grant?',
    ['Implicit grant requires passwords', 'PKCE generates a dynamic cryptographic code verifier and challenge on the client, preventing authorization code interception on public clients lacking client secrets', 'PKCE eliminates tokens completely', 'PKCE requires TLS certificates'],
    'B', 'Public clients (SPAs) cannot securely store client secrets. PKCE verifies that the entity redeeming the code is the same entity that initiated the flow.', 'OAuth 2.0 Security');

  // Cryptography - Level 1 (Q6-Q9)
  addQ('cybersecurity', 'cryptography', 1, 6,
    'Why is MD5 considered cryptographically broken for secure password hashing and digital signatures?',
    ['It is too slow to compute', 'Collision attacks can generate two distinct inputs yielding identical MD5 hashes in seconds', 'It only works on ASCII text', 'It outputs variable-length strings'],
    'B', 'MD5 has severe collision vulnerabilities, meaning attackers can forge certificates and files sharing identical hash values.', 'Hash Collisions');
  addQ('cybersecurity', 'cryptography', 1, 7,
    'In symmetric encryption, which key is used for decryption?',
    ['The public key', 'The identical secret key used for encryption', 'A third-party certificate authority key', 'Any random 16-byte string'],
    'B', 'Symmetric encryption relies on a single shared secret key for both encryption and decryption operations.', 'Symmetric Primitives');
  addQ('cybersecurity', 'cryptography', 1, 8,
    'What is the purpose of adding a unique "salt" to passwords before hashing with bcrypt or Argon2?',
    ['To shorten the password', 'To ensure identical passwords generate distinct hash outputs, defeating precomputed rainbow table lookups', 'To make hashes reversible', 'To convert passwords to uppercase'],
    'B', 'A salt ensures identical passwords produce unique hash digests, forcing attackers to compute brute-force attacks individually.', 'Password Salting');
  addQ('cybersecurity', 'cryptography', 1, 9,
    'What is the output length of the SHA-256 cryptographic hash function?',
    ['128 bits (16 bytes)', '256 bits (32 bytes)', '512 bits (64 bytes)', 'Variable depending on input'],
    'B', 'SHA-256 strictly outputs a 256-bit (32-byte) digest, typically displayed as a 64-character hexadecimal string.', 'Hash Standards');

  // Cryptography - Level 2 (Q6-Q9)
  addQ('cybersecurity', 'cryptography', 2, 6,
    'Why is AES-CBC mode vulnerable to Padding Oracle Attacks if error responses reveal padding validity?',
    ['CBC does not use keys', 'Attackers can manipulate cipher block bits and observe whether padding errors occur, decrypting plaintext byte-by-byte without the key', 'CBC outputs plaintext', 'CBC requires RSA'],
    'B', 'Padding oracles leak whether altered ciphertexts conform to PKCS#7 padding, enabling systematic mathematical plaintext recovery.', 'Cipher Vulnerabilities');
  addQ('cybersecurity', 'cryptography', 2, 7,
    'What is the crucial operational requirement for Initialization Vectors (IVs) in AES-GCM encryption?',
    ['They must be kept secret from the receiver', 'They must NEVER be repeated with the same key (nonce reuse breaks authenticity and can leak authentication keys)', 'They must be 2048 bits long', 'They must contain only prime numbers'],
    'B', 'Reusing a nonce in GCM mode destroys the Galois Message Authentication Code (GHASH), allowing forgery and plaintext recovery.', 'Nonce Uniqueness');
  addQ('cybersecurity', 'cryptography', 2, 8,
    'What security property is guaranteed by Authenticated Encryption with Associated Data (AEAD)?',
    ['Only confidentiality', 'Both confidentiality of plaintext and cryptographic integrity/authenticity of ciphertext and metadata', 'Compression of files', 'Post-quantum resistance'],
    'B', 'AEAD (such as AES-GCM or ChaCha20-Poly1305) guarantees both data confidentiality and unforgeable tamper-evident authentication.', 'AEAD Architecture');
  addQ('cybersecurity', 'cryptography', 2, 9,
    'How does an asymmetric digital signature provide non-repudiation?',
    ['By encrypting the entire document with AES', 'The signer creates a signature using their private key; anyone can verify with the public key, proving only the private key holder could have authored it', 'By saving the document to blockchain', 'By logging IP addresses'],
    'B', 'Because only the owner holds the private key, valid signatures cannot be repudiated as long as the private key remains uncompromised.', 'Digital Signatures');

  // Cryptography - Level 3 (Q6-Q9)
  addQ('cybersecurity', 'cryptography', 3, 6,
    'What is Perfect Forward Secrecy (PFS) in TLS 1.3 key exchange?',
    ['A guarantee that passwords never expire', 'A property where compromise of the server long-term private key does NOT compromise previously recorded historical session traffic', 'Using RSA 4096-bit keys exclusively', 'Storing keys in hardware security modules'],
    'B', 'Ephemeral Diffie-Hellman (ECDHE) generates fresh per-session keys discarded after the connection, preventing retrospective decryption.', 'Forward Secrecy');
  addQ('cybersecurity', 'cryptography', 3, 7,
    'In Zero-Knowledge Proofs (ZKP), what does the "Zero-Knowledge" property mathematically assert?',
    ['The verifier learns nothing beyond the factual truth of the claim being proven', 'The prover has zero memory', 'The algorithm requires zero compute power', 'The proof can be forged with zero difficulty'],
    'B', 'A zero-knowledge proof conveys no additional knowledge or witness information to the verifier other than that the statement is valid.', 'ZKP Mechanics');
  addQ('cybersecurity', 'cryptography', 3, 8,
    'Why does post-quantum cryptography replace RSA and ECC with lattice-based algorithms (e.g. ML-KEM / Kyber)?',
    ['Shor algorithm running on quantum computers can factor large integers and solve discrete logarithms in polynomial time, breaking RSA and ECC', 'Lattice math is written in Rust', 'RSA keys are too small to store', 'Quantum computers only support symmetric ciphers'],
    'B', 'Shor algorithm solves the integer factorization and discrete log problems in polynomial time. Lattice problems remain hard for quantum systems.', 'Post-Quantum Crypto');

  // =========================================================================
  // 3. DATA SCIENCE
  // =========================================================================

  // Python & SQL - Level 1 (Q6-Q9)
  addQ('data-science', 'python-sql', 1, 6,
    'In SQL, which clause filters aggregated results produced by a `GROUP BY` statement?',
    ['WHERE', 'HAVING', 'FILTER', 'LIMIT'],
    'B', '`WHERE` filters individual rows prior to grouping; `HAVING` filters aggregated group calculations after `GROUP BY`.', 'SQL Aggregations');
  addQ('data-science', 'python-sql', 1, 7,
    'What is the difference between `INNER JOIN` and `LEFT JOIN` in relational databases?',
    ['INNER returns only matching rows from both tables; LEFT returns all rows from the left table and matched rows from the right (with NULL for non-matches)', 'LEFT JOIN is faster than INNER JOIN', 'INNER JOIN only works on integers', 'They produce identical result sets'],
    'A', 'INNER JOIN filters out unmatched records; LEFT JOIN retains all left records, filling absent right table columns with NULL.', 'SQL Joins');
  addQ('data-science', 'python-sql', 1, 8,
    'Which Pandas method merges two DataFrames based on a shared key column?',
    ['df.concat()', 'pd.merge(df1, df2, on="key")', 'df.append()', 'pd.stack()'],
    'B', '`pd.merge()` performs relational database-style joins across DataFrames on designated foreign keys.', 'Pandas Joins');
  addQ('data-science', 'python-sql', 1, 9,
    'What SQL keyword eliminates duplicate rows from query results?',
    ['UNIQUE', 'DISTINCT', 'FILTER', 'ISOLATE'],
    'B', '`SELECT DISTINCT column FROM table;` returns only unique value combinations from the target columns.', 'SQL Basics');

  // Python & SQL - Level 2 (Q6-Q9)
  addQ('data-science', 'python-sql', 2, 6,
    'What is the difference between `RANK()` and `DENSE_RANK()` window functions when duplicate values occur?',
    ['RANK() skips rank numbers after ties (e.g., 1, 2, 2, 4); DENSE_RANK() does not skip rank numbers (e.g., 1, 2, 2, 3)', 'DENSE_RANK() only works on positive numbers', 'RANK() returns percentages', 'They are strictly identical'],
    'A', '`RANK()` leaves gaps in ranking corresponding to tie count; `DENSE_RANK()` maintains consecutive integer rank numbering.', 'Window Functions');
  addQ('data-science', 'python-sql', 2, 7,
    'How does a Common Table Expression (CTE) defined with `WITH` improve on deeply nested subqueries?',
    ['It automatically indexes the table', 'It provides modular, readable, named intermediate result sets that can be referenced multiple times and support recursion', 'It bypasses SQL query planners', 'It forces in-memory disk caching'],
    'B', 'CTEs provide named, readable building blocks, avoiding unreadable deeply nested subqueries and enabling recursive traversal.', 'SQL Architecture');
  addQ('data-science', 'python-sql', 2, 8,
    'In Pandas, what is the computational advantage of converting an `object` string column with few unique values to `category` dtype?',
    ['It makes strings uppercase', 'It replaces repeated strings with integer pointers to an internal dictionary, reducing memory usage up to 90% and accelerating groupby operations', 'It prevents null values', 'It encodes text into embeddings'],
    'B', 'Categorical dtypes store strings once in a lookup table and represent rows as small integers, slashing RAM consumption.', 'Pandas Optimization');
  addQ('data-science', 'python-sql', 2, 9,
    'What does the `COALESCE(val1, val2, val3)` SQL function return?',
    ['The sum of all three values', 'The first non-null expression in the argument list', 'The maximum value', 'A boolean indicator'],
    'B', '`COALESCE` evaluates arguments in sequence and returns the first non-null value, providing clean fallback substitution.', 'SQL Functions');

  // Python & SQL - Level 3 (Q6-Q9)
  addQ('data-science', 'python-sql', 3, 6,
    'When profiling a slow PostgreSQL query with `EXPLAIN (ANALYZE, BUFFERS)`, what does a "Seq Scan" on a 50-million row table indicate?',
    ['Optimal performance', 'The database is reading the entire table sequentially from disk/cache because no suitable index existed for the WHERE filter', 'The query is cached', 'A network socket error'],
    'B', 'Sequential scans inspect every disk block in the table. Adding a B-Tree or composite index allows O(log N) index lookups.', 'Query Planning');
  addQ('data-science', 'python-sql', 3, 7,
    'How do you write a recursive CTE in SQL to traverse a parent-child organizational hierarchy of indefinite depth?',
    ['Use a WHILE loop', 'Define an anchor query combined via `UNION ALL` with a recursive query that joins back to the CTE name until an empty set is produced', 'Use GROUP BY ROLLUP', 'Call a recursive stored procedure in Python'],
    'B', 'Recursive CTEs execute an anchor member, then iteratively evaluate the recursive member joining to the prior result set.', 'Recursive Queries');
  addQ('data-science', 'python-sql', 3, 8,
    'When loading 10GB of data from PostgreSQL into Pandas, what prevents out-of-memory crashes on a machine with 8GB RAM?',
    ['pd.read_sql(..., chunksize=100000) processing data as an iterator', 'Converting all columns to float64', 'Running the query twice', 'Using SQLite instead'],
    'B', 'The `chunksize` parameter streams query rows in bounded batches, yielding an iterator that prevents memory exhaustion.', 'Memory Streaming');

  // Statistics - Level 1 (Q6-Q9)
  addQ('data-science', 'statistics', 1, 6,
    'What measure of central tendency is least sensitive to extreme outliers?',
    ['Arithmetic Mean', 'Median', 'Variance', 'Standard Deviation'],
    'B', 'The median represents the middle value of sorted data and is unaffected by extreme outlier values.', 'Descriptive Statistics');
  addQ('data-science', 'statistics', 1, 7,
    'In a standard normal distribution (Z-distribution), what are the mean and standard deviation?',
    ['Mean = 1, Std = 0', 'Mean = 0, Std = 1', 'Mean = 100, Std = 15', 'Mean = 0.5, Std = 0.5'],
    'B', 'A standard normal Z-distribution has mean mu = 0 and standard deviation sigma = 1.', 'Normal Distribution');
  addQ('data-science', 'statistics', 1, 8,
    'What does the p-value in a statistical hypothesis test measure?',
    ['The probability that the alternate hypothesis is true', 'The probability of observing test results at least as extreme as the observed data, assuming the null hypothesis is true', 'The percentage of errors in data collection', 'The sample size divided by population'],
    'B', 'A p-value quantifies evidence against the null hypothesis under the assumption that the null hypothesis holds true.', 'Hypothesis Testing');
  addQ('data-science', 'statistics', 1, 9,
    'What is the interquartile range (IQR)?',
    ['Max minus Min', 'The difference between the 75th percentile (Q3) and 25th percentile (Q1)', 'Mean divided by Standard Deviation', 'Median multiplied by 2'],
    'B', 'IQR = Q3 - Q1, capturing the spread of the middle 50% of observations.', 'Statistical Dispersion');

  // Statistics - Level 2 (Q6-Q9)
  addQ('data-science', 'statistics', 2, 6,
    'What is a Type I error (False Positive) in hypothesis testing?',
    ['Failing to reject a false null hypothesis', 'Rejecting a true null hypothesis (claiming an effect exists when it does not)', 'Calculating the wrong mean', 'Using an uneven sample size'],
    'B', 'Type I error occurs when the researcher falsely detects an effect and rejects a null hypothesis that was actually true.', 'Error Types');
  addQ('data-science', 'statistics', 2, 7,
    'When comparing the means of three or more independent groups, which statistical test is most appropriate?',
    ['Student Two-Sample t-test', 'One-Way Analysis of Variance (ANOVA)', 'Chi-Square Goodness of Fit', 'Pearson Correlation'],
    'B', 'ANOVA tests whether significant differences exist among the means of three or more groups while controlling family-wise error.', 'ANOVA');
  addQ('data-science', 'statistics', 2, 8,
    'What does Central Limit Theorem (CLT) state regarding sample means as sample size N becomes large?',
    ['The underlying population becomes normal', 'The sampling distribution of the sample mean approaches a normal distribution, regardless of the population distribution shape', 'Standard deviation increases to infinity', 'All samples become identical'],
    'B', 'CLT guarantees that sums and averages of independent random variables converge to a normal distribution as N grows.', 'Central Limit Theorem');
  addQ('data-science', 'statistics', 2, 9,
    'In A/B testing, what problem is caused by continuously peeking at p-values and stopping the experiment as soon as p < 0.05?',
    ['Underpowered tests', 'Severe inflation of false positive rates (Type I error) due to multiple testing without alpha correction', 'Decreased conversion rate', 'Negative confidence intervals'],
    'B', 'Repeated significance testing on accumulating data dramatically inflates the probability of randomly observing p < 0.05.', 'A/B Testing Rigor');

  // Statistics - Level 3 (Q6-Q9)
  addQ('data-science', 'statistics', 3, 6,
    'How does bootstrapping construct non-parametric confidence intervals without making distribution assumptions?',
    ['By generating random Gaussian noise', 'By repeatedly resampling the observed dataset with replacement thousands of times to estimate the empirical sampling distribution', 'By dividing the data into two halves', 'By applying log transforms'],
    'B', 'Bootstrapping resamples with replacement, empirically approximating the statistic sampling distribution without parametric assumptions.', 'Bootstrapping');
  addQ('data-science', 'statistics', 3, 7,
    'What is the fundamental difference between Frequentist confidence intervals and Bayesian credible intervals?',
    ['Frequentist intervals are always narrower', 'A 95% Bayesian credible interval states there is a 95% posterior probability the parameter lies within; a 95% Frequentist interval means 95% of repeated experiments would contain the fixed parameter', 'Frequentist statistics uses priors', 'Bayesian inference ignores data'],
    'B', 'Bayesian intervals treat parameters as random variables with posterior distributions; Frequentist intervals treat parameters as fixed unknown constants.', 'Bayesian vs Frequentist');
  addQ('data-science', 'statistics', 3, 8,
    'When evaluating multi-armed bandit A/B experiments with Thompson Sampling, what mathematical mechanism balances exploration and exploitation?',
    ['Epsilon-greedy coin flips', 'Sampling actions according to their posterior probability of being optimal using Beta-Bernoulli distributions', 'Manual intervention every morning', 'Random permutation of users'],
    'B', 'Thompson Sampling draws random samples from each arm posterior distribution, directing traffic dynamically to higher probability winners.', 'Thompson Sampling');

  // Data Analysis & Visualization - Level 1 (Q6-Q9)
  addQ('data-science', 'data-analysis-visualization', 1, 6,
    'Which chart type is best suited for visualizing the frequency distribution of a continuous numeric variable?',
    ['Pie chart', 'Histogram', 'Bar chart', 'Radar chart'],
    'B', 'Histograms group continuous numerical data into discrete bins, displaying frequency densities across the domain.', 'Visual Types');
  addQ('data-science', 'data-analysis-visualization', 1, 7,
    'In a standard box-and-whisker plot, what do the "whiskers" traditionally represent?',
    ['The standard deviation', '1.5 times the IQR above Q3 and below Q1, beyond which individual points are marked as outliers', 'The absolute maximum and minimum in all cases', 'The 99th percentile'],
    'B', 'Tukey box plots extend whiskers to 1.5 * IQR from quartiles, displaying data points beyond as individual outlier dots.', 'Box Plots');
  addQ('data-science', 'data-analysis-visualization', 1, 8,
    'Which visual encoding is most effective for displaying the relationship between two continuous variables?',
    ['Scatter plot', 'Stacked bar chart', 'Heatmap with text labels', 'Donut chart'],
    'A', 'Scatter plots position data points along orthogonal Cartesian X/Y axes, making correlation and clusters immediately apparent.', 'Scatter Plots');
  addQ('data-science', 'data-analysis-visualization', 1, 9,
    'Why are 3D pie charts generally discouraged in professional data science reporting?',
    ['They take too much ink to print', 'Perspective distortion exaggerates slices in the foreground, distorting visual area perception and misleading viewers', 'Monitors cannot display 3D', 'They require GPU rendering'],
    'B', 'Perspective angles distort proportional area and angles, causing viewers to misjudge relative slice magnitudes.', 'Chart Design Best Practices');

  // Data Analysis & Visualization - Level 2 (Q6-Q9)
  addQ('data-science', 'data-analysis-visualization', 2, 6,
    'What does a heatmap visualizing a correlation matrix communicate?',
    ['Total revenue over time', 'Pairwise Pearson/Spearman correlation coefficients between all numeric feature pairs using color intensity', 'Distribution of missing null values only', 'Database schema relationships'],
    'B', 'Correlation heatmaps color-code pairwise linear/monotonic coefficients from -1 to +1, highlighting multicollinearity.', 'Correlation Heatmaps');
  addQ('data-science', 'data-analysis-visualization', 2, 7,
    'What is the purpose of using a logarithmic scale on the Y-axis when charting exponential growth curves (e.g. COVID spread)?',
    ['To make numbers look smaller', 'To transform exponential curves into straight linear trajectories, making relative percentage growth rates directly comparable over time', 'To hide negative values', 'To avoid label overlap'],
    'B', 'Log scales convert multiplicative/exponential relationships into linear slopes, highlighting constant rates of percentage growth.', 'Logarithmic Scaling');
  addQ('data-science', 'data-analysis-visualization', 2, 8,
    'In multi-faceted exploratory visualization (e.g. Seaborn FacetGrid), what does "small multiples" refer to?',
    ['Displaying tiny numbers', 'A series of similar charts using the same scale and axes to compare subsets across categorical dimensions', 'Plotting only small datasets', 'Compressing images to thumbnails'],
    'B', 'Small multiples display slices of data across identical visual grids, enabling cognitive comparisons across categories.', 'Small Multiples');
  addQ('data-science', 'data-analysis-visualization', 2, 9,
    'What visual pitfall occurs when truncating the baseline axis of a bar chart to start at a non-zero value?',
    ['The chart fails to render in browsers', 'It visually exaggerates minute relative differences between bars, misleading the audience on comparative proportions', 'Bars become invisible', 'Colors invert'],
    'B', 'Bar lengths encode absolute magnitude from zero. Truncating the baseline distorts proportional comparison between bars.', 'Visual Integrity');

  // Data Analysis & Visualization - Level 3 (Q6-Q9)
  addQ('data-science', 'data-analysis-visualization', 3, 6,
    'When visualizing high-dimensional customer segmentation clusters (e.g. 50 features), which dimensionality reduction technique preserves local neighborhood topology best for 2D embedding?',
    ['Principal Component Analysis (PCA)', 't-SNE or UMAP (Uniform Manifold Approximation and Projection)', 'Linear Discriminant Analysis', 'Singular Value Decomposition'],
    'B', 'UMAP and t-SNE model non-linear manifold geometry, preserving local neighborhood cluster relationships in 2D visual spaces.', 'High-Dim Visualization');
  addQ('data-science', 'data-analysis-visualization', 3, 7,
    'In designing real-time enterprise metric monitoring dashboards, what is the "data-ink ratio" principle (Edward Tufte)?',
    ['Maximizing the amount of printer ink used', 'Maximizing the proportion of visual elements devoted to conveying actual information while removing decorative chartjunk, grids, and shadows', 'Using only black and white colors', 'Plotting every individual raw database row'],
    'B', 'Tufte data-ink ratio emphasizes eliminating decorative visual noise so viewers can process signal without distraction.', 'Information Design');
  addQ('data-science', 'data-analysis-visualization', 3, 8,
    'How do choropleth geographical maps introduce visual population bias, and how is it corrected?',
    ['Large rural land areas visually dominate the map despite low population; corrected by using cartograms or population-weighted hexbin grids', 'Colors look different across countries', 'Maps cannot show percentages', 'Boundaries change yearly'],
    'B', 'Geographic area size does not reflect population density. Cartograms scale geographic regions proportionally to population.', 'Spatial Data Design');

  // =========================================================================
  // 4. DSA
  // =========================================================================

  // Arrays & Strings - Level 1 (Q6-Q9)
  addQ('dsa', 'arrays-strings', 1, 6,
    'What is the time complexity of searching for an element in an unsorted array of length N?',
    ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
    'C', 'In an unsorted array, linear search must inspect up to N elements in the worst case.', 'Complexity Analysis');
  addQ('dsa', 'arrays-strings', 1, 7,
    'How can you check if a string is a palindrome in O(N) time and O(1) auxiliary space?',
    ['Reverse the string into a new array and compare', 'Use two pointers initialized at the start and end, moving inward and comparing characters until they meet', 'Count character frequencies with a hash table', 'Sort the string characters'],
    'B', 'Two pointers check character symmetry inward in O(N) time without allocating additional memory buffers.', 'Two Pointers');
  addQ('dsa', 'arrays-strings', 1, 8,
    'What is the space complexity of reversing an array of size N in place?',
    ['O(N)', 'O(log N)', 'O(1)', 'O(N^2)'],
    'C', 'In-place reversal swaps symmetric elements using a single temporary variable, requiring O(1) auxiliary space.', 'In-Place Manipulation');
  addQ('dsa', 'arrays-strings', 1, 9,
    'What is a Prefix Sum array used for?',
    ['Sorting elements in O(N) time', 'Answering contiguous range sum queries `sum(arr[i..j])` in O(1) time after O(N) precomputation', 'Finding duplicate strings', 'Reversing substrings'],
    'B', '`prefix[j+1] - prefix[i]` computes the sum of elements from index i to j in constant O(1) time.', 'Prefix Sums');

  // Arrays & Strings - Level 2 (Q6-Q9)
  addQ('dsa', 'arrays-strings', 2, 6,
    'Given an array of integers, how does the Two-Pointer technique find two numbers that sum to target in O(N) time if the array is already sorted?',
    ['Compare every pair with nested loops in O(N^2)', 'Initialize left at 0 and right at N-1; if sum > target decrement right, if sum < target increment left', 'Store numbers in a binary search tree', 'Use bubble sort'],
    'B', 'Because the array is sorted, adjusting pointers inward based on sum comparison guarantees finding the pair in O(N) steps.', 'Two-Pointer Search');
  addQ('dsa', 'arrays-strings', 2, 7,
    'In the Sliding Window technique for finding the maximum sum subarray of fixed size K, why is the time complexity O(N) rather than O(N*K)?',
    ['It skips half the elements', 'Each window transition subtracts the departing element and adds the new incoming element in O(1) operations', 'It uses binary search', 'It sorts each window'],
    'B', 'Sliding windows reuse the previous window sum, adjusting bounds in O(1) per step rather than summing K elements from scratch.', 'Sliding Window');
  addQ('dsa', 'arrays-strings', 2, 8,
    'How do you solve the Dutch National Flag problem (sorting an array of 0s, 1s, and 2s) in a single pass with O(1) extra space?',
    ['Run standard QuickSort', 'Use three pointers (low, mid, high), swapping elements into their respective partitions in O(N) time', 'Count frequencies in a hash map', 'Call Array.sort()'],
    'B', 'Dijkstra three-way partitioning traverses with `mid`, placing 0s at `low` and 2s at `high` in a single O(N) scan.', 'Three-Way Partitioning');
  addQ('dsa', 'arrays-strings', 2, 9,
    'Review the string deduplication code below. What is its time complexity?',
    ['O(N)', 'O(N^2) due to repeated string concatenation inside the loop creating fresh immutable string objects', 'O(1)', 'O(log N)'],
    'B', 'In Python/JavaScript, strings are immutable. Repeated `+` concatenation copies all preceding characters, resulting in O(N^2) time.', 'String Immutability',
    'def dedupe(s):\n    res = ""\n    for c in s:\n        if c not in res:\n            res += c\n    return res', 'debugging');

  // Arrays & Strings - Level 3 (Q6-Q9)
  addQ('dsa', 'arrays-strings', 3, 6,
    'How does the Rabin-Karp string matching algorithm achieve O(N + M) average time complexity for pattern searching?',
    ['By building a suffix tree', 'By using rolling polynomial hashes to compare pattern and substring hashes in O(1) time, only verifying characters on hash match', 'By sorting both strings', 'By using regular expressions'],
    'B', 'Rolling hashes update in O(1) arithmetic operations when sliding the window, allowing rapid candidate substring identification.', 'Rolling Hash');
  addQ('dsa', 'arrays-strings', 3, 7,
    'In the Minimum Window Substring problem (finding the smallest substring in S containing all characters of T), what condition dictates when the sliding window left pointer contracts?',
    ['Contract as long as all required character counts remain satisfied, recording candidate minimum lengths', 'Contract every 2 characters', 'Contract only when reaching the end of S', 'Contract when window size is odd'],
    'A', 'The right pointer expands until the constraint is met; the left pointer then shrinks as far as possible while keeping all target counts valid.', 'Sliding Window Optimization');
  addQ('dsa', 'arrays-strings', 3, 8,
    'What data structure enables finding the longest common prefix among N strings with total length L in O(L) time?',
    ['Binary Search Tree', 'Trie (Prefix Tree)', 'Disjoint Set Union', 'Adjacency List'],
    'B', 'A Trie branches on each character. Finding the common prefix involves traversing the root down the non-branching spine in O(L) time.', 'Trie Structure');

  // Trees & Graphs - Level 1 (Q6-Q9)
  addQ('dsa', 'trees-graphs', 1, 6,
    'In a Binary Search Tree (BST), what traversal order visits nodes in ascending sorted numerical order?',
    ['Pre-order (Root, Left, Right)', 'In-order (Left, Root, Right)', 'Post-order (Left, Right, Root)', 'Level-order (BFS)'],
    'B', 'In-order traversal on a valid BST visits left subtree, root, and right subtree, producing elements in sorted order.', 'Tree Traversals');
  addQ('dsa', 'trees-graphs', 1, 7,
    'What is the maximum number of nodes in a full binary tree of depth H (where root has depth 1)?',
    ['2^H - 1', 'H^2', '2 * H', 'H!'],
    'A', 'Geometric sum 1 + 2 + 4 + ... + 2^(H-1) evaluates to 2^H - 1 total nodes.', 'Tree Properties');
  addQ('dsa', 'trees-graphs', 1, 8,
    'Which data structure is fundamentally utilized to implement Breadth-First Search (BFS) on a graph?',
    ['Stack (LIFO)', 'Queue (FIFO)', 'Priority Queue', 'Disjoint Set'],
    'B', 'BFS explores neighbors level-by-level using a FIFO Queue to process nodes in arrival order.', 'BFS Mechanics');
  addQ('dsa', 'trees-graphs', 1, 9,
    'In a graph represented as an adjacency matrix with V vertices, what is the space complexity?',
    ['O(V)', 'O(V^2)', 'O(V + E)', 'O(E^2)'],
    'B', 'A V x V matrix allocates a cell for every vertex pair, requiring O(V^2) space regardless of edge count.', 'Graph Representation');

  // Trees & Graphs - Level 2 (Q6-Q9)
  addQ('dsa', 'trees-graphs', 2, 6,
    'How do you detect a cycle in a directed graph using Depth-First Search (DFS)?',
    ['Check if node count equals edge count', 'Track a recursion stack state (e.g. 3-color marking: unvisited, visiting, visited); encountering a node currently "visiting" indicates a back-edge cycle', 'Run Dijkstra algorithm', 'Check if degree is even'],
    'B', 'Back edges in directed graphs point to an ancestor currently in the active recursion call stack, confirming a directed cycle.', 'Cycle Detection');
  addQ('dsa', 'trees-graphs', 2, 7,
    'What algorithm produces a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u comes before v?',
    ['Kruskal algorithm', 'Topological Sort (Kahn BFS algorithm or DFS post-order reversal)', 'Bellman-Ford algorithm', 'Floyd-Warshall'],
    'B', 'Topological sorting resolves dependency orderings in DAGs using in-degree zero queues (Kahn) or DFS post-order traversal.', 'Topological Sort');
  addQ('dsa', 'trees-graphs', 2, 8,
    'In finding the lowest common ancestor (LCA) of two nodes `p` and `q` in a Binary Search Tree (BST):',
    ['Perform BFS from root to leaves', 'Traverse from root: if both p and q are less than current node go left; if both are greater go right; otherwise current node is the LCA split point', 'Store all nodes in a hash set', 'Compute tree diameter'],
    'B', 'In a BST, the first node whose value falls between p and q (inclusive) is guaranteed to be their Lowest Common Ancestor.', 'BST LCA');
  addQ('dsa', 'trees-graphs', 2, 9,
    'What is the time complexity of Dijkstra shortest path algorithm implemented with a min-heap priority queue for a graph with V vertices and E edges?',
    ['O(V^2)', 'O((V + E) log V)', 'O(V * E)', 'O(V!)'],
    'B', 'Each vertex is extracted once (V log V) and each edge relaxation updates the heap (E log V), totaling O((V + E) log V).', 'Dijkstra Complexity');

  // Trees & Graphs - Level 3 (Q6-Q9)
  addQ('dsa', 'trees-graphs', 3, 6,
    'What optimization in Disjoint Set Union (Union-Find) achieves near constant amortized time complexity alpha(N)?',
    ['Binary Search', 'Union by rank/size combined with Path Compression during find operations', 'Breadth-first search', 'Graph coloring'],
    'B', 'Path compression flattens tree depth during lookups, while union by rank keeps trees balanced, yielding inverse Ackermann O(alpha(N)) runtime.', 'Disjoint Set Union');
  addQ('dsa', 'trees-graphs', 3, 7,
    'When searching for shortest paths in graphs containing negative edge weights without negative cycles, which algorithm must be chosen over Dijkstra?',
    ['Prim algorithm', 'Bellman-Ford algorithm', 'Kruskal algorithm', 'A* Search'],
    'B', 'Dijkstra greedy premise fails with negative weights because finalized node distances can be reduced later. Bellman-Ford relaxes all edges V-1 times.', 'Shortest Path Algorithms');
  addQ('dsa', 'trees-graphs', 3, 8,
    'In network flow optimization, what does the Max-Flow Min-Cut Theorem state?',
    ['Maximum flow equals total number of vertices', 'The maximum amount of flow passing from source to sink equals the minimum total capacity of edges that, if removed, disconnect source from sink', 'All edges must have equal flow', 'Cycle count equals cut count'],
    'B', 'The minimum capacity cut represents the fundamental bottleneck of any network, strictly equalling the maximum feasible flow.', 'Network Flow');

  // Dynamic Programming - Level 1 (Q6-Q9)
  addQ('dsa', 'dynamic-programming', 1, 6,
    'What two fundamental properties characterize problems solvable by Dynamic Programming?',
    ['Sorted data and binary searchability', 'Overlapping subproblems and optimal substructure', 'Greedy choices and negative edge weights', 'Recursion depth < 100'],
    'B', 'Optimal substructure means optimal solutions are composed of optimal sub-solutions; overlapping subproblems means subproblems repeat.', 'DP Principles');
  addQ('dsa', 'dynamic-programming', 1, 7,
    'What is the difference between top-down memoization and bottom-up tabulation?',
    ['Top-down uses loops; bottom-up uses recursion', 'Top-down solves recursively while caching results in a map/array; bottom-up iteratively fills an array starting from base cases', 'They have different big-O complexities', 'Bottom-up cannot handle trees'],
    'B', 'Top-down is on-demand recursion with memoization; bottom-up is iterative state transitions starting from fundamental base cases.', 'Memoization vs Tabulation');
  addQ('dsa', 'dynamic-programming', 1, 8,
    'In the classic Climbing Stairs problem (1 or 2 steps at a time), what recurrence relation governs the number of ways to reach step N?',
    ['dp[N] = dp[N-1] * dp[N-2]', 'dp[N] = dp[N-1] + dp[N-2]', 'dp[N] = max(dp[N-1], dp[N-2])', 'dp[N] = 2^N'],
    'B', 'To reach step N, one must come from step N-1 (taking 1 step) or step N-2 (taking 2 steps), mirroring the Fibonacci sequence.', 'State Transitions');
  addQ('dsa', 'dynamic-programming', 1, 9,
    'Why is naive recursive computation of the Nth Fibonacci number O(2^N), and how does DP reduce it to O(N)?',
    ['Naive recursion recomputes identical subtrees exponentially; DP caches solved states so each subproblem is computed exactly once', 'Naive recursion uses too much disk space', 'DP converts integers to floats', 'Naive recursion causes compiler errors'],
    'B', 'Branching recursion duplicates work exponentially. Memoization stores each Fibonacci value on first compute, answering in O(1) thereafter.', 'Complexity Reduction');

  // Dynamic Programming - Level 2 (Q6-Q9)
  addQ('dsa', 'dynamic-programming', 2, 6,
    'In the 0/1 Knapsack problem with N items and maximum weight W, what is the time complexity of the standard 2D DP table approach?',
    ['O(N * W)', 'O(N^2)', 'O(2^N)', 'O(N + W)'],
    'A', 'Filling an N x W table takes constant time per cell, resulting in pseudo-polynomial O(N * W) time complexity.', 'Knapsack Complexity');
  addQ('dsa', 'dynamic-programming', 2, 7,
    'How can the space complexity of 0/1 Knapsack be optimized from O(N * W) to O(W)?',
    ['By sorting the items by weight', 'By using a single 1D array of size W+1 and iterating weights backwards from W down to item_weight', 'By using a hash map', 'Space cannot be reduced'],
    'B', 'Because `dp[i][w]` only depends on row `i-1`, iterating backwards prevents overwriting values needed for subsequent decisions.', 'Space Optimization');
  addQ('dsa', 'dynamic-programming', 2, 8,
    'What is the state transition for Longest Common Subsequence (LCS) between strings A of length i and B of length j when `A[i-1] == B[j-1]`?',
    ['dp[i][j] = dp[i-1][j-1] + 1', 'dp[i][j] = max(dp[i-1][j], dp[i][j-1])', 'dp[i][j] = dp[i-1][j] + dp[i][j-1]', 'dp[i][j] = 0'],
    'A', 'Matching characters extend the longest common subsequence found in the prefixes A[0..i-2] and B[0..j-2] by 1.', 'LCS Transitions');
  addQ('dsa', 'dynamic-programming', 2, 9,
    'In the Coin Change problem (minimum coins to make amount X), what should `dp[amount]` be initialized to before tabulation?',
    ['0', 'Infinity (or a value greater than amount, such as amount + 1)', '-1', 'Coin denominations'],
    'B', 'Because we are minimizing, initializing with infinity allows valid transitions via `min(dp[x], dp[x - coin] + 1)` to take precedence.', 'Initialization Invariants');

  // Dynamic Programming - Level 3 (Q6-Q9)
  addQ('dsa', 'dynamic-programming', 3, 6,
    'In the Traveling Salesperson Problem (TSP) solved via Held-Karp dynamic programming, what state representation reduces complexity from O(N!) to O(N^2 * 2^N)?',
    ['2D array of distances', 'Bitmask DP: `dp[mask][u]` representing the set of visited cities encoded as integer bit flags ending at city u', 'Adjacency matrix', 'Linked list of cities'],
    'B', 'An integer bitmask compactly encodes subsets of visited cities, transforming combinatorial factorial permutations into exponential bit states.', 'Bitmask DP');
  addQ('dsa', 'dynamic-programming', 3, 7,
    'What condition permits the Knuth-Yao optimization to accelerate 2D Interval DP (like Optimal BST or Matrix Chain) from O(N^3) to O(N^2)?',
    ['All numbers must be negative', 'The cost function satisfies the Quadrangle Inequality and monotonicity on the lattice of intervals', 'The array must be sorted', 'The string must be a palindrome'],
    'B', 'When the quadrangle inequality holds, the optimal split point `opt[i][j]` is bounded by `opt[i][j-1] <= opt[i][j] <= opt[i+1][j]`, dropping an order of N.', 'Interval Optimization');
  addQ('dsa', 'dynamic-programming', 3, 8,
    'In Digit DP (counting integers in range [L, R] satisfying a numerical property), what parameters typically define the recursive memoization state?',
    ['(current_index, sum, is_less, is_started)', '(random_seed, total_digits)', '(min_val, max_val)', '(hash_code, depth)'],
    'A', 'Digit DP states track digit position, property accumulator, a tight/is_less boolean constraint matching the prefix bound, and leading zero flags.', 'Digit DP');

  // =========================================================================
  // 5. WEB DEVELOPMENT
  // =========================================================================

  // HTML, CSS & JavaScript - Level 1 (Q6-Q9)
  addQ('web-development', 'html-css-javascript', 1, 6,
    'Which semantic HTML5 element represents the primary, unique content of the document body?',
    ['<section>', '<main>', '<article>', '<div>'],
    'B', '`<main>` designates the central content unique to that document, excluding repeated headers, sidebars, and footers.', 'Semantic HTML');
  addQ('web-development', 'html-css-javascript', 1, 7,
    'In the CSS box model, what constitutes the total rendered width of an element with `box-sizing: content-box`?',
    ['width only', 'width + padding-left + padding-right + border-left + border-right', 'width minus margin', 'padding only'],
    'B', 'Under `content-box`, declared width applies only to content. Padding and borders add outward, expanding total width.', 'Box Model');
  addQ('web-development', 'html-css-javascript', 1, 8,
    'What does `typeof null` return in JavaScript, and why?',
    ['"null"', '"object" due to a legacy bug in the original 1995 JavaScript implementation where object type tags were 0', '"undefined"', '"boolean"'],
    'B', 'In early JS, values were stored with type tags. Objects had tag 0; null was the NULL pointer (0x00), incorrectly yielding "object".', 'JavaScript Quirks');
  addQ('web-development', 'html-css-javascript', 1, 9,
    'What is the difference between `==` and `===` in JavaScript?',
    ['== performs type coercion before comparison; === checks both value and type strictly without coercion', '=== is slower than ==', '== only compares strings', 'They are identical'],
    'A', 'Loose equality `==` coerces types (e.g. "5" == 5 is true); strict equality `===` requires matching types ("5" === 5 is false).', 'Equality Semantics');

  // HTML, CSS & JavaScript - Level 2 (Q6-Q9)
  addQ('web-development', 'html-css-javascript', 2, 6,
    'What is event delegation in JavaScript, and why is it efficient for dynamic lists?',
    ['Attaching click listeners to every individual child item', 'Attaching a single event listener to a common parent element that handles events bubbling up from current and future children via `e.target`', 'Cancelling all mouse clicks', 'Running events in Web Workers'],
    'B', 'Event delegation leverages event bubbling to manage hundreds of dynamic elements with one parent listener, reducing memory usage.', 'Event Delegation');
  addQ('web-development', 'html-css-javascript', 2, 7,
    'How does CSS Flexbox differ fundamentally from CSS Grid in dimensional layout?',
    ['Flexbox is 2-dimensional (rows and columns); Grid is 1-dimensional', 'Flexbox is 1-dimensional (content-driven along a single main axis); Grid is 2-dimensional (layout-driven across rows and columns simultaneously)', 'Flexbox does not support alignment', 'Grid cannot wrap items'],
    'B', 'Flexbox organizes items along a single axis (row OR column); Grid defines a two-dimensional matrix coordinates structure.', 'CSS Layout Systems');
  addQ('web-development', 'html-css-javascript', 2, 8,
    'Review the async code below. What is logged to the console, and why?',
    ['1, 2, 3', '1, 3, 2 because Promise callbacks are microtasks queued after synchronous code completes', '2, 1, 3', '3, 2, 1'],
    'B', 'Synchronous code runs to completion (1, 3). Resolved promise `.then` callbacks enter the microtask queue and run before the next event loop tick (2).', 'Event Loop Microtasks',
    'console.log(1);\nPromise.resolve().then(() => console.log(2));\nconsole.log(3);', 'debugging');
  addQ('web-development', 'html-css-javascript', 2, 9,
    'What is the difference between `localStorage` and `sessionStorage` in Web Storage API?',
    ['localStorage encrypts data; sessionStorage is plaintext', 'localStorage data persists across browser restarts until explicitly cleared; sessionStorage data is deleted when the tab/session closes', 'sessionStorage has 100GB limit', 'localStorage only works on HTTPS'],
    'B', '`localStorage` has indefinite persistence per origin; `sessionStorage` is scoped strictly to the current browser tab lifetime.', 'Web Storage');

  // HTML, CSS & JavaScript - Level 3 (Q6-Q9)
  addQ('web-development', 'html-css-javascript', 3, 6,
    'What causes "Layout Thrashing" (Forced Synchronous Layout) in high-frequency browser animations?',
    ['Loading large images', 'Interleaving DOM mutations (writes) and style/geometric queries (reads, e.g. `offsetHeight`) in a tight loop, forcing the browser to recalculate layout repeatedly', 'Using CSS transitions', 'Running code in strict mode'],
    'B', 'Reading geometric properties after writing invalidates the DOM layout cache, forcing immediate synchronous reflows on every loop cycle.', 'Performance & Reflow');
  addQ('web-development', 'html-css-javascript', 3, 7,
    'How does a JavaScript `WeakMap` differ from a standard `Map` regarding garbage collection?',
    ['WeakMap keys must be objects and are held as weak references; if no other references exist to the key object, it can be garbage collected along with its value', 'WeakMap can only store 10 items', 'WeakMap is synchronized across threads', 'WeakMap cannot be cleared'],
    'B', '`WeakMap` does not prevent keys from being reclaimed by the garbage collector, preventing memory leaks when associating metadata with DOM nodes.', 'Memory & Weak References');
  addQ('web-development', 'html-css-javascript', 3, 8,
    'Why can Dedicated Web Workers execute heavy CPU computations without stuttering or freezing the 60fps browser UI?',
    ['They run on the GPU', 'Web Workers execute in a completely separate OS thread with their own event loop, isolated from the browser main rendering thread', 'They compile JS to WebAssembly automatically', 'They bypass JavaScript entirely'],
    'B', 'The main thread handles DOM events and paint cycles. Workers run on background threads without blocking main-thread frame rendering.', 'Concurrency & Workers');

  // React - Level 1 (Q6-Q9)
  addQ('web-development', 'react', 1, 6,
    'Why must state in React components be updated using the setter function rather than direct mutation (e.g. `user.name = "Alice"`)?',
    ['Direct mutation causes syntax errors in JSX', 'React detects state changes by comparing references; mutating objects directly does not trigger reconciliation and re-rendering', 'State objects are frozen in memory', 'Direct mutation only works in class components'],
    'B', 'React relies on reference equality (`Object.is`) to detect updates. Mutating objects directly leaves the reference unchanged, skipping re-renders.', 'React Reactivity');
  addQ('web-development', 'react', 1, 7,
    'What is the purpose of the `key` prop when rendering a dynamic array of components in React?',
    ['To give CSS styles to each element', 'To provide a stable identity across renders so React reconciliation algorithm can identify which items changed, were added, or were removed', 'To sort elements alphabetically', 'To assign database primary keys'],
    'B', 'Stable keys enable React virtual DOM diffing to reuse existing DOM nodes rather than destroying and recreating the entire list on every update.', 'Reconciliation Keys');
  addQ('web-development', 'react', 1, 8,
    'When does the cleanup function returned by `useEffect` execute?',
    ['Only when the browser window closes', 'Before the component unmounts, and before re-running the effect on subsequent renders when dependencies change', 'Every 5 seconds automatically', 'Only when an error is thrown'],
    'B', 'Effect cleanups execute prior to subsequent effect executions and upon component unmount to teardown subscriptions and timers.', 'Effect Lifecycle');
  addQ('web-development', 'react', 1, 9,
    'What does the `useRef` hook return, and how does it differ from `useState`?',
    ['It returns a read-only string', 'It returns a mutable `{ current: ... }` container whose mutations persist across renders WITHOUT triggering a component re-render', 'It triggers a re-render on every frame', 'It is only for canvas elements'],
    'B', 'Mutating `ref.current` stores values across renders silently without scheduling reconciliation or causing component re-renders.', 'Ref Primitives');

  // React - Level 2 (Q6-Q9)
  addQ('web-development', 'react', 2, 6,
    'Review the hook code below. What bug causes an infinite re-render loop?',
    ['`fetchUser` must be an arrow function', '`options` is an object created as a fresh reference on every render, causing `useEffect` dependency comparison to fail on every cycle', '`userId` cannot be in dependencies', 'async functions cannot be called'],
    'B', 'Non-primitive objects created in the render body receive fresh memory references on each cycle, constantly triggering dependent effects.', 'Infinite Effect Loop',
    'function Profile({ userId }) {\n  const options = { detailed: true };\n  useEffect(() => {\n    fetchUser(userId, options);\n  }, [userId, options]);\n}', 'debugging');
  addQ('web-development', 'react', 2, 7,
    'How do you prevent child component re-renders when passing a callback function from a parent component wrapped in `React.memo`?',
    ['Use `useCallback` to cache the function definition between renders unless its dependencies change', 'Wrap the function in a Promise', 'Pass the function as a string', 'Declare the function outside the component'],
    'A', '`useCallback` preserves function reference equality across renders, allowing `React.memo` shallow comparison to skip child rendering.', 'useCallback Optimization');
  addQ('web-development', 'react', 2, 8,
    'What is the primary problem solved by the `useReducer` hook over multiple related `useState` calls?',
    ['Faster rendering speed', 'Managing complex, interdependent state transitions deterministically through centralized dispatch actions and pure reducer functions', 'Automatic database syncing', 'Eliminating all re-renders'],
    'B', '`useReducer` unifies complex state update logic into testable, action-driven pure functions, preventing inconsistent partial state updates.', 'useReducer Architecture');
  addQ('web-development', 'react', 2, 9,
    'What happens when an uncaught JavaScript error occurs inside a component render tree without an Error Boundary?',
    ['The error is ignored silently', 'React unmounts the entire component tree from the root, displaying a blank white screen to the user', 'The component reloads automatically', 'Only the failing element turns red'],
    'B', 'In React 16+, unhandled render errors unmount the entire application root. Error Boundaries catch these errors and render fallback UI.', 'Error Boundaries');

  // React - Level 3 (Q6-Q9)
  addQ('web-development', 'react', 3, 6,
    'How does React 18 Concurrent Mode and `useTransition` prevent UI freezing during heavy background state updates?',
    ['By running code on web workers', 'By marking state updates as non-urgent transitions that yield main-thread control to urgent user inputs (like typing or clicks) without blocking frames', 'By disabling CSS animations', 'By caching the DOM to disk'],
    'B', 'Concurrent transitions can be paused, interrupted, or discarded if urgent user interactions take precedence on the main thread.', 'Concurrent Transitions');
  addQ('web-development', 'react', 3, 7,
    'In large-scale data tables rendering 100,000 rows, why is DOM virtualization (e.g. `tanstack-virtual` or `react-window`) required?',
    ['It converts HTML to canvas', 'It renders ONLY the small slice of DOM elements currently visible in the scroll viewport, keeping DOM node counts at ~30 instead of 100,000', 'It compresses table rows with gzip', 'It uses WebGL rendering'],
    'B', 'Virtualization bounds memory and layout calculation to the visible viewport height, ensuring smooth 60fps scrolling over arbitrary dataset sizes.', 'Virtualization');
  addQ('web-development', 'react', 3, 8,
    'What is the fundamental architectural distinction between React Server Components (RSC) and standard Client Components?',
    ['RSCs only run in production', 'RSCs execute exclusively on the server, have direct zero-latency access to databases, and emit lightweight virtual DOM payloads with 0KB client JS bundle overhead', 'Client components cannot use JSX', 'RSCs cannot render HTML'],
    'B', 'RSCs execute on the server and stream serialized component trees to the browser without shipping their dependency code to the client bundle.', 'RSC Architecture');

  // Backend & REST APIs - Level 1 (Q6-Q9)
  addQ('web-development', 'backend-rest-apis', 1, 6,
    'Which HTTP method is semantically intended for completely replacing an existing resource with new data?',
    ['PATCH', 'PUT', 'GET', 'OPTIONS'],
    'B', '`PUT` replaces the resource representation in its entirety; `PATCH` applies partial modifications.', 'HTTP Methods');
  addQ('web-development', 'backend-rest-apis', 1, 7,
    'What HTTP status code should be returned after successfully creating a new resource via a POST request?',
    ['200 OK', '201 Created', '204 No Content', '302 Found'],
    'B', '`201 Created` explicitly signals that the request succeeded and resulted in the allocation of a new resource.', 'Status Codes');
  addQ('web-development', 'backend-rest-apis', 1, 8,
    'What is the purpose of `express.json()` middleware in an Express application?',
    ['To validate JSON syntax in files', 'To parse incoming request bodies with `Content-Type: application/json` and populate `req.body` with the parsed JavaScript object', 'To format all responses as JSON', 'To compress outgoing packets'],
    'B', '`express.json()` reads the raw incoming stream and deserializes JSON payloads into the `req.body` property.', 'Body Parsing');
  addQ('web-development', 'backend-rest-apis', 1, 9,
    'How do you access the route parameter `id` in an Express route defined as `/api/users/:id`?',
    ['req.query.id', 'req.params.id', 'req.body.id', 'req.headers.id'],
    'B', 'Named route parameters prefixed with a colon are extracted by Express into the `req.params` dictionary.', 'Route Parameters');

  // Backend & REST APIs - Level 2 (Q6-Q9)
  addQ('web-development', 'backend-rest-apis', 2, 6,
    'What does the browser send during a CORS preflight request, and what response is expected?',
    ['A GET request expecting HTML', 'An `OPTIONS` HTTP request with `Access-Control-Request-Method`; server must respond with 200/204 and matching `Access-Control-Allow-*` headers', 'A POST request with credentials', 'A DNS ping'],
    'B', 'Before issuing complex cross-origin requests, browsers verify server permission via an OPTIONS preflight call.', 'CORS Preflight Mechanics');
  addQ('web-development', 'backend-rest-apis', 2, 7,
    'What are the three dot-separated components of a JSON Web Token (JWT)?',
    ['Username, Password, Salt', 'Header (algorithm/type), Payload (claims), Signature (cryptographic verification)', 'Domain, Path, Expiry', 'Key, IV, Ciphertext'],
    'B', 'A JWT consists of `header.payload.signature` encoded in base64url, verifiable via shared secret or public key.', 'JWT Architecture');
  addQ('web-development', 'backend-rest-apis', 2, 8,
    'What is the architectural purpose of middleware in Express (`(req, res, next) => {}`)?',
    ['To format HTML templates', 'To intercept, inspect, modify incoming requests, validate auth, and either terminate the response or pass control to downstream handlers via `next()`', 'To restart crashed processes', 'To manage database connections'],
    'B', 'Middleware chains provide pipeline processing for authentication, logging, rate limiting, and request transformation.', 'Middleware Pipeline');
  addQ('web-development', 'backend-rest-apis', 2, 9,
    'Why should sensitive database queries use parameterized prepared statements rather than raw template literal string interpolation?',
    ['To speed up query compilation only', 'Parameters are transmitted separately from SQL logic, ensuring user inputs are treated strictly as data literals and preventing SQL injection', 'Because SQL does not support strings', 'To format dates automatically'],
    'B', 'Parameterized queries separate code from data in the database query engine, rendering SQL injection impossible.', 'SQL Prepared Statements');

  // Backend & REST APIs - Level 3 (Q6-Q9)
  addQ('web-development', 'backend-rest-apis', 3, 6,
    'How does database connection pooling (e.g. `pg.Pool`) improve high-concurrency API performance over opening fresh connections per request?',
    ['It compresses SQL queries', 'It maintains a warm pool of pre-established database TCP connections, avoiding the costly TCP and TLS handshake overhead on every incoming HTTP request', 'It bypasses database authentication', 'It turns SQL into NoSQL'],
    'B', 'Establishing database connections requires expensive handshakes. Pools reuse active connections, handling high request throughput.', 'Connection Pooling');
  addQ('web-development', 'backend-rest-apis', 3, 7,
    'In distributed systems, what is the purpose of database transactions adhering to ACID properties?',
    ['To compress stored records', 'To guarantee Atomicity (all-or-nothing), Consistency, Isolation (concurrency control), and Durability (disk write guarantees) during mutations', 'To enable peer-to-peer networking', 'To encrypt API keys'],
    'B', 'ACID transactions prevent partial writes, race condition overwrites, and state corruption during failures.', 'ACID Transactions');
  addQ('web-development', 'backend-rest-apis', 3, 8,
    'What is the purpose of a health check endpoint exposing both `/health/live` (liveness) and `/health/ready` (readiness) in Kubernetes deployments?',
    ['To show CPU temperature', 'Liveness tells Kubernetes whether to restart an unresponsive container; Readiness tells whether the container is connected to dependencies and ready to receive live user traffic', 'To allow admin logins', 'To measure network bandwidth'],
    'B', 'Separating liveness and readiness prevents traffic from being routed to warm-up containers while ensuring stuck processes are recycled.', 'Observability & Probes');

  return bank;
}
