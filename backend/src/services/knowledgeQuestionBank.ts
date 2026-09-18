export interface KnowledgeQuestionOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export interface KnowledgeQuestion {
  id: string;
  domainId: string;
  skillId: string;
  levelNumber: number;
  questionText: string;
  codeSnippet?: string;
  questionType: 'multiple_choice' | 'scenario' | 'debugging' | 'conceptual';
  options: KnowledgeQuestionOption[];
  correctAnswer: string; // 'A' | 'B' | 'C' | 'D'
  explanation: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
}

/**
 * Question bank builder with tailored questions for all 45 Domain x Skill x Level configurations.
 */
function buildQuestionBank(): KnowledgeQuestion[] {
  const bank: KnowledgeQuestion[] = [];

  // Helper to register questions
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
  // DOMAIN 1: AI / ML (ai-ml)
  // =========================================================================

  // Skill 1.1: Python for ML (python-for-ml)
  // Level 1: Fundamentals
  addQ('ai-ml', 'python-for-ml', 1, 1,
    'In NumPy, what is the consequence of slicing an array like `sub = arr[1:4]` instead of copying?',
    ['It creates a deep copy requiring double the memory', 'It returns a view sharing the underlying data buffer', 'It converts the slice into a Python list', 'It invalidates the original array pointer'],
    'B', 'NumPy slices create views into the existing buffer rather than allocating new memory.', 'Memory & Views');
  addQ('ai-ml', 'python-for-ml', 1, 2,
    'What happens when adding a 1D array of shape (3,) to a 2D array of shape (4, 3)?',
    ['Broadcasting expands the 1D array across all 4 rows', 'A ValueError is raised due to dimension mismatch', 'The result is reshaped to (12,)', 'The operation sums only the diagonal entries'],
    'A', 'NumPy broadcasting matches trailing dimensions and broadcasts the 1D array across the leading dimension.', 'Broadcasting');
  addQ('ai-ml', 'python-for-ml', 1, 3,
    'Which dtype is the default float precision in NumPy on 64-bit systems?',
    ['float16', 'float32', 'float64', 'float128'],
    'C', 'NumPy defaults to float64 (standard double-precision IEEE 754 float).', 'Data Types');
  addQ('ai-ml', 'python-for-ml', 1, 4,
    'What does `arr.reshape(-1, 1)` accomplish on a 1D array of length N?',
    ['Flattens the array into a scalar', 'Transforms it into a 2D column vector of shape (N, 1)', 'Transposes it into shape (1, N)', 'Reverses the array elements'],
    'B', '-1 instructs NumPy to automatically infer the row count, resulting in an (N, 1) column vector.', 'Array Reshaping');
  addQ('ai-ml', 'python-for-ml', 1, 5,
    'Which operation computes element-wise multiplication between two matching NumPy arrays?',
    ['np.dot(a, b)', 'a @ b', 'a * b', 'np.matmul(a, b)'],
    'C', 'The * operator performs element-wise Hadamard multiplication, whereas @ and matmul perform matrix multiplication.', 'Vector Operations');

  // Level 2: Application & Debugging
  addQ('ai-ml', 'python-for-ml', 2, 1,
    'Given the code below, what will be printed?',
    ['[100, 2, 3]', '[1, 2, 3]', 'TypeError: cannot assign to slice', 'RuntimeWarning: copy on write'],
    'A', 'Because slicing produces a view, mutating `b[0]` directly mutates `a[0]`.', 'Buffer Mutation',
    'a = np.array([1, 2, 3])\nb = a[:]\nb[0] = 100\nprint(a)', 'debugging');
  addQ('ai-ml', 'python-for-ml', 2, 2,
    'How does `np.where(condition, x, y)` differ from a standard Python list comprehension with if/else?',
    ['It is interpreted in pure Python bytecode', 'It performs vectorized branchless selection implemented in C', 'It cannot handle multi-dimensional arrays', 'It mutates the condition array in place'],
    'B', 'np.where executes in C across contiguous SIMD blocks without Python interpreter loop overhead.', 'Vectorized Selection');
  addQ('ai-ml', 'python-for-ml', 2, 3,
    'Why would `np.ascontiguousarray(arr)` improve subsequent model inference throughput?',
    ['It compresses data into gzip format', 'It ensures elements lie sequentially in memory, maximizing CPU L1/L2 cache hits', 'It converts floats to 8-bit integers', 'It creates asynchronous parallel threads'],
    'B', 'C-contiguous arrays align strides with CPU cache lines, preventing cache misses during matrix multiplication.', 'Memory Contiguity');
  addQ('ai-ml', 'python-for-ml', 2, 4,
    'What is the computational danger of running `np.exp(x)` where `x` contains values > 800 in float64?',
    ['Kernel panic', 'Numerical overflow resulting in `inf` and subsequent NaN gradients', 'Underflow resulting in exact zero', 'Silent integer truncation'],
    'B', 'In float64, e^710 overflows to +inf, destroying downstream loss gradients with NaNs.', 'Numerical Stability');
  addQ('ai-ml', 'python-for-ml', 2, 5,
    'Which indexing strategy selects all negative elements in an array and replaces them with 0 without looping?',
    ['arr[arr < 0] = 0', 'arr.filter(lambda x: x >= 0)', 'np.clean_negatives(arr)', 'arr.slice_where(negative=False)'],
    'A', 'Boolean masking indexes into array elements satisfying the condition and executes in-place vectorized assignment.', 'Boolean Indexing');

  // Level 3: Architecture & Optimization
  addQ('ai-ml', 'python-for-ml', 3, 1,
    'When training on a 150GB dataset exceeding available RAM, which NumPy primitive enables out-of-core memory access?',
    ['np.buffer_alloc()', 'np.memmap()', 'np.ram_stream()', 'np.virtual_array()'],
    'B', 'np.memmap maps binary disk files directly into the virtual memory address space via OS page caching.', 'Out-of-Core Processing');
  addQ('ai-ml', 'python-for-ml', 3, 2,
    'What trade-off is introduced when using 16-bit brain floating point (bfloat16) over float32 in ML pipelines?',
    ['Lower dynamic range with higher mantissa precision', 'Same dynamic range as float32 with reduced precision (7-bit mantissa) and 50% memory bandwidth', 'Inability to represent negative values', 'Automatic gradient descent convergence guarantees'],
    'B', 'bfloat16 maintains the 8-bit exponent of float32 (preserving dynamic range) while truncating the mantissa to 7 bits.', 'Precision Trade-offs');
  addQ('ai-ml', 'python-for-ml', 3, 3,
    'In high-throughput feature transformation pipelines, what is the primary bottleneck of repeatedly calling `np.concatenate` in a loop?',
    ['Garbage collection deadlocks', 'O(N^2) memory re-allocations and buffer copies for each iteration', 'Loss of floating-point precision', 'Thread contention on the GIL'],
    'B', 'Each concatenation must allocate a fresh buffer and copy all previous elements. Pre-allocating the target array is O(N).', 'Memory Re-allocation');
  addQ('ai-ml', 'python-for-ml', 3, 4,
    'How does PyTorch/JAX zero-copy array interoperability with NumPy operate under the hood?',
    ['They serialize through JSON strings', 'They consume the __array_interface__ or DLPack protocol sharing raw pointers', 'They write to /tmp temporary files', 'They duplicate the tensor in a background thread'],
    'B', 'The DLPack and __array_interface__ protocols allow frameworks to share raw memory pointers without duplicating buffers.', 'Zero-Copy Architecture');
  addQ('ai-ml', 'python-for-ml', 3, 5,
    'What is the primary purpose of stride tricks (`as_strided`) in advanced feature extraction?',
    ['To encrypt sensitive tensors', 'To construct rolling/sliding window views over data without copying memory', 'To transpose matrices in O(N^3) time', 'To compress sparse matrices into CSR format'],
    'B', 'Striding manipulates how steps in each dimension traverse memory addresses, creating sliding windows with 0 extra memory.', 'Stride Optimization');

  // Skill 1.2: Data Preprocessing (data-preprocessing)
  // Level 1
  addQ('ai-ml', 'data-preprocessing', 1, 1,
    'Which strategy is most appropriate for handling missing values in a categorical feature with high cardinality?',
    ['Replace with mean', 'Create an "Unknown" category or impute using the mode', 'Delete the entire dataset', 'Multiply by zero'],
    'B', 'Mean is mathematically undefined for categories. Mode imputation or an explicit Unknown category preserves distribution.', 'Categorical Imputation');
  addQ('ai-ml', 'data-preprocessing', 1, 2,
    'What is the range of output values produced by `MinMaxScaler` by default?',
    ['[-1, 1]', '[0, 1]', '(-inf, +inf)', '[0, 100]'],
    'B', 'MinMaxScaler rescales feature values linearly to the default range [0, 1].', 'Feature Scaling');
  addQ('ai-ml', 'data-preprocessing', 1, 3,
    'Why must you call `fit_transform` on training data, but ONLY `transform` on test data?',
    ['To speed up compilation', 'To prevent data leakage by learning parameters exclusively from training data', 'To avoid overwriting test labels', 'Because transform does not support arrays'],
    'B', 'Fitting on test data leaks statistical distribution parameters into the evaluation set, invalidating test scores.', 'Data Leakage');
  addQ('ai-ml', 'data-preprocessing', 1, 4,
    'When should one-hot encoding be avoided in favor of target or ordinal encoding?',
    ['When a category has 2 unique values', 'When a categorical feature has very high cardinality (e.g., thousands of unique postal codes)', 'When working with tree-based models', 'When the target is binary'],
    'B', 'One-hot encoding high-cardinality features creates massive, sparse dimensional spaces that degrade memory and performance.', 'Encoding Strategy');
  addQ('ai-ml', 'data-preprocessing', 1, 5,
    'What statistical metric does `StandardScaler` use to center and scale features?',
    ['Median and Interquartile Range (IQR)', 'Mean and Standard Deviation', 'Min and Max', 'Mode and Variance'],
    'B', 'StandardScaler centers values by subtracting the mean (u=0) and scales to unit variance (s=1).', 'Scaling Math');

  // Level 2: Application
  addQ('ai-ml', 'data-preprocessing', 2, 1,
    'A pipeline scales features before performing a train/test split. What fatal flaw does this introduce?',
    ['Underfitting', 'Data leakage: the test set statistics contaminated the mean and variance used for scaling', 'Class imbalance', 'Over-regularization'],
    'B', 'Splitting must occur before any preprocessing fit step to ensure test data remains strictly unobserved.', 'Leakage Diagnosis', undefined, 'debugging');
  addQ('ai-ml', 'data-preprocessing', 2, 2,
    'When dealing with extreme outliers in continuous financial transactions, which scaler is most robust?',
    ['StandardScaler', 'MinMaxScaler', 'RobustScaler (using median and IQR)', 'MaxAbsScaler'],
    'C', 'RobustScaler removes the median and scales according to the IQR, meaning outliers do not skew the scaling bounds.', 'Outlier Resilience');
  addQ('ai-ml', 'data-preprocessing', 2, 3,
    'What is the primary risk of using target encoding without cross-validation or smoothing?',
    ['Extreme target leakage leading to severe overfitting on the training set', 'Zero division errors', 'Conversion of numeric columns to strings', 'Inability to predict continuous targets'],
    'A', 'Target encoding directly utilizes label values. Without smoothing or K-fold out-of-fold encoding, it memorizes targets.', 'Target Encoding');
  addQ('ai-ml', 'data-preprocessing', 2, 4,
    'If a dataset contains 99.5% negative samples and 0.5% positive samples, which sampling technique can balance the training split?',
    ['Random Gaussian Noise', 'SMOTE (Synthetic Minority Over-sampling Technique) or class weighting', 'Dropping all positive records', 'Doubling the learning rate'],
    'B', 'SMOTE synthesizes minority examples along feature space segments, while class weights penalize minority errors heavily.', 'Imbalance Remediation');
  addQ('ai-ml', 'data-preprocessing', 2, 5,
    'Why is a ColumnTransformer preferred over manual Pandas dataframe modifications in production pipelines?',
    ['It produces pretty HTML charts', 'It encapsulates transformations into an atomic scikit-learn estimator compatible with cross-validation', 'It bypasses Python CPU limits', 'It forces all outputs to be integers'],
    'B', 'ColumnTransformer integrates into unified scikit-learn Pipelines, preventing leakage and ensuring identical serving inference.', 'Pipeline Architecture');

  // Level 3: Advanced
  addQ('ai-ml', 'data-preprocessing', 3, 1,
    'In streaming real-time ML inference, how do you handle previously unseen categorical levels without pipeline crash?',
    ['Raise a fatal 500 error', 'Configure encoder with `handle_unknown="ignore"` or map to an explicitly reserved out-of-vocabulary (OOV) token', 'Restart the ingestion worker', 'Impute the global mean'],
    'B', 'Production encoders must handle unknown tokens gracefully by mapping to zeros or a dedicated OOV bucket.', 'Production Serving');
  addQ('ai-ml', 'data-preprocessing', 3, 2,
    'What concept drift detection method evaluates whether the feature distribution P(X) has shifted over time without labels?',
    ['Accuracy score', 'Population Stability Index (PSI) or Kolmogorov-Smirnov test', 'Cross-entropy loss', 'F1-score'],
    'B', 'PSI and KS tests quantify statistical divergence between baseline reference distributions and live serving inputs.', 'Drift Detection');
  addQ('ai-ml', 'data-preprocessing', 3, 3,
    'How does cyclical encoding with sine and cosine transformations resolve representations for timestamps (e.g. hour of day)?',
    ['It normalizes hours between 0 and 100', 'It maps hour 23 and hour 0 as close Euclidean neighbors on a unit circle', 'It removes daylight saving anomalies', 'It converts time to epoch integers'],
    'B', 'Without cyclical sine/cosine transforms, 23:00 and 00:00 appear as opposite extremes (distance 23) rather than adjacent hours.', 'Feature Engineering');
  addQ('ai-ml', 'data-preprocessing', 3, 4,
    'What is the performance bottleneck of applying dense one-hot encoding on high-dimensional text token bags?',
    ['OOM memory explosion due to dense storage of 99.99% zero-valued coordinates', 'Over-smoothing of non-linearities', 'Loss of categorical keys', 'Thread lock on CPU cache'],
    'A', 'Dense representations of sparse data exhaust RAM. Sparse matrices (CSR/CSC) store only non-zero coordinates.', 'Sparse Optimization');
  addQ('ai-ml', 'data-preprocessing', 3, 5,
    'When building a feature store (e.g., Feast), what ensures point-in-time correctness during historical backfills?',
    ['Asynchronous database triggers', 'Time-travel joins that match features to the exact timestamp an event occurred, preventing future lookahead', 'Global snapshot daily dumps', 'Static CSV caching'],
    'B', 'Point-in-time joins ensure training rows only observe feature states that existed at the exact moment of the event timestamp.', 'Feature Store Design');

  // Skill 1.3: Machine Learning (machine-learning)
  // Level 1
  addQ('ai-ml', 'machine-learning', 1, 1,
    'What is the primary indicator of an overfitted machine learning model?',
    ['High training loss and high test loss', 'Near-zero training loss but significantly degraded performance on unseen test data', 'Slow training duration', 'Symmetric confusion matrix'],
    'B', 'Overfitting occurs when a model memorizes noise in the training set, failing to generalize to unseen test records.', 'Overfitting');
  addQ('ai-ml', 'machine-learning', 1, 2,
    'In binary classification with high class imbalance (1% fraud), why is Accuracy a misleading metric?',
    ['It cannot be calculated for fractions', 'A naive model predicting all negatives achieves 99% accuracy while catching 0% of fraud', 'It requires three classes minimum', 'It always outputs 0'],
    'B', 'Accuracy masks catastrophic minority class failure under heavy class skew. Precision, Recall, and PR-AUC are required.', 'Evaluation Metrics');
  addQ('ai-ml', 'machine-learning', 1, 3,
    'Which algorithm is an ensemble of decision trees utilizing random feature subsets and bagging?',
    ['K-Nearest Neighbors', 'Random Forest', 'Linear Discriminant Analysis', 'Support Vector Machine'],
    'B', 'Random Forest uses bootstrap aggregation (bagging) and random feature subspaces to train diverse decision trees.', 'Ensemble Methods');
  addQ('ai-ml', 'machine-learning', 1, 4,
    'What parameter in linear models controls the strength of L2 regularization (Ridge)?',
    ['Learning rate (alpha/lambda)', 'Batch size', 'Number of epochs', 'Random seed'],
    'A', 'The alpha/lambda hyperparameter penalizes the sum of squared weight magnitudes, shrinking parameters toward zero.', 'Regularization');
  addQ('ai-ml', 'machine-learning', 1, 5,
    'What is the purpose of K-Fold Cross Validation?',
    ['To compress dataset files', 'To assess model generalizability by training and validating on K distinct folds', 'To speed up training by factor of K', 'To remove corrupt database rows'],
    'B', 'K-Fold CV trains and evaluates across K rotation splits, yielding robust variance and performance estimates.', 'Validation Strategy');

  // Level 2: Application
  addQ('ai-ml', 'machine-learning', 2, 1,
    'A team needs to diagnose whether high validation error is driven by high bias or high variance. What diagnostic tool should they inspect?',
    ['Confusion matrix correlation plots', 'Learning curves plotting training vs validation error as training set size increases', 'CPU utilization logs', 'Git commit diffs'],
    'B', 'If both train and val error converge at high values, bias dominates. If a wide gap persists between train and val, variance dominates.', 'Model Diagnostics');
  addQ('ai-ml', 'machine-learning', 2, 2,
    'When tuning a Gradient Boosting model (XGBoost/LightGBM), what is the relationship between learning rate and n_estimators?',
    ['Higher learning rate requires higher n_estimators', 'Lower learning rate requires higher n_estimators to achieve convergence while reducing overfit risk', 'They must be strictly equal', 'Learning rate has no effect on estimators'],
    'B', 'Shrinkage (lower learning rate) reduces each tree contribution, requiring more trees (n_estimators) for smooth convergence.', 'Hyperparameter Tuning');
  addQ('ai-ml', 'machine-learning', 2, 3,
    'In a cancer diagnostic screening system, which metric should be prioritized to avoid missing patients who have the disease?',
    ['Specificity', 'Precision', 'Recall (Sensitivity)', 'F-beta with beta=0.5'],
    'C', 'High recall minimizes False Negatives, ensuring that individuals with the disease are not mistakenly cleared.', 'Metric Selection');
  addQ('ai-ml', 'machine-learning', 2, 4,
    'Why does L1 regularization (Lasso) yield sparse model weights compared to L2 (Ridge)?',
    ['L1 squares the error function', 'The L1 diamond constraint has sharp vertices on the coordinate axes, forcing weights to zero', 'L1 requires GPU acceleration', 'L1 doubles the learning rate'],
    'B', 'L1 norm geometry intersects loss contours at axes, driving non-essential coefficients exactly to zero.', 'Sparsity & Selection');
  addQ('ai-ml', 'machine-learning', 2, 5,
    'A model achieves 0.99 AUC on training data, but drops to 0.52 on test data. What is the root cause?',
    ['Underfitting', 'Severe overfitting or complete data leakage during feature generation', 'Learning rate is too low', 'Test set has too many samples'],
    'B', 'A drop to near 0.50 (random chance) indicates the model memorized leakage artifacts absent in the test distribution.', 'Failure Analysis');

  // Level 3: Architecture
  addQ('ai-ml', 'machine-learning', 3, 1,
    'How does early stopping based on a validation metric prevent model degradation?',
    ['It cuts off power to the GPU', 'It halts training when validation loss stops improving for N consecutive patience epochs', 'It resets weights to initial random state', 'It changes the loss function dynamically'],
    'B', 'Early stopping checkpoints the optimal model state before variance-driven overfitting begins deteriorating generalization.', 'Training Dynamics');
  addQ('ai-ml', 'machine-learning', 3, 2,
    'What is the key architectural difference between Bagging and Boosting?',
    ['Bagging trains models sequentially; Boosting trains them independently in parallel', 'Bagging trains independent models in parallel to reduce variance; Boosting trains sequentially to reduce bias', 'Bagging works only on linear models', 'Boosting cannot be used for classification'],
    'B', 'Bagging averages independent estimators to reduce variance; Boosting iteratively corrects predecessor errors to reduce bias.', 'Architecture Trade-offs');
  addQ('ai-ml', 'machine-learning', 3, 3,
    'In low-latency real-time inference (sub-5ms SLA), which model architecture represents the best trade-off over large deep networks?',
    ['A 100-layer Transformer ensemble', 'A compiled decision tree (ONNX/Treelite) or calibrated shallow linear model', 'A dense recurrent network', 'Multi-agent simulation'],
    'B', 'Compiled tree runtimes (Treelite/ONNX) execute in microseconds via branchless SIMD instructions without GPU latency overhead.', 'Serving Latency');
  addQ('ai-ml', 'machine-learning', 3, 4,
    'What technique quantifies individual feature contributions to a specific prediction using game-theoretic cooperative value?',
    ['Permutation importance', 'SHAP (Shapley Additive exPlanations)', 'P-value z-scores', 'Pearson coefficient'],
    'B', 'SHAP values compute the fair marginal contribution of each feature across all possible feature subsets based on Shapley values.', 'Model Explainability');
  addQ('ai-ml', 'machine-learning', 3, 5,
    'When deploying an online recommendation system, how do you mitigate the "feedback loop" (cold start bias)?',
    ['Only show top 1 popular item forever', 'Epsilon-greedy exploration or Thompson Sampling multi-armed bandit strategies', 'Delete database logs nightly', 'Increase batch size to 10,000'],
    'B', 'Multi-armed bandits balance exploiting current known high-yield items while exploring unproven candidates to discover fresh utility.', 'System Design');

  // =========================================================================
  // DOMAIN 2: CYBERSECURITY (cybersecurity)
  // =========================================================================

  // Skill 2.1: Networking Fundamentals (networking-fundamentals)
  // Level 1
  addQ('cybersecurity', 'networking-fundamentals', 1, 1,
    'Which layer of the OSI model is responsible for end-to-end reliability and port addressing?',
    ['Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 4 (Transport)', 'Layer 7 (Application)'],
    'C', 'Layer 4 (Transport) handles port addresses (TCP/UDP), segmentation, flow control, and reliability.', 'OSI Model');
  addQ('cybersecurity', 'networking-fundamentals', 1, 2,
    'What is the default subnet mask for a /24 CIDR prefix in IPv4?',
    ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.255'],
    'C', '/24 denotes 24 network bits: 11111111.11111111.11111111.00000000 = 255.255.255.0 (254 usable hosts).', 'Subnetting');
  addQ('cybersecurity', 'networking-fundamentals', 1, 3,
    'Which port does unencrypted HTTP utilize by default, and which port does HTTPS utilize?',
    ['HTTP 21, HTTPS 22', 'HTTP 80, HTTPS 443', 'HTTP 8080, HTTPS 8443', 'HTTP 53, HTTPS 853'],
    'B', 'Standard RFC allocations specify port 80 for HTTP and port 443 for TLS-encrypted HTTPS.', 'Port Standards');
  addQ('cybersecurity', 'networking-fundamentals', 1, 4,
    'What protocol resolves an IP address to a physical MAC address on a local Ethernet segment?',
    ['DNS', 'ARP (Address Resolution Protocol)', 'DHCP', 'BGP'],
    'B', 'ARP broadcasts requests across Layer 2 to map known Layer 3 IPv4 addresses to hardware MAC addresses.', 'Protocol Mechanics');
  addQ('cybersecurity', 'networking-fundamentals', 1, 5,
    'What packet flag sequence initiates a standard TCP connection handshake?',
    ['ACK -> SYN -> RST', 'SYN -> SYN-ACK -> ACK', 'FIN -> ACK -> FIN-ACK', 'SYN -> PSH -> URG'],
    'B', 'The three-way handshake begins with client SYN, server replies with SYN-ACK, and client acknowledges with ACK.', 'TCP Handshake');

  // Level 2
  addQ('cybersecurity', 'networking-fundamentals', 2, 1,
    'An analyst notices thousands of SYN packets with spoofed source IPs and no final ACKs. What attack is taking place?',
    ['DNS amplification', 'TCP SYN Flood exhausting the target server backlog queue (half-open connections)', 'BGP hijacking', 'ARP poisoning'],
    'B', 'SYN flood attacks exhaust server connection state tables (backlog queue) by never completing the three-way handshake.', 'Network Attacks');
  addQ('cybersecurity', 'networking-fundamentals', 2, 2,
    'How does the TCP sliding window mechanism prevent receiver buffer overflow?',
    ['By dropping all UDP packets', 'The receiver advertises a receive window (rwnd) indicating available buffer capacity', 'By doubling MTU size dynamically', 'By forcing full duplex disconnection'],
    'B', 'Flow control uses the window field in the TCP header to tell the sender how many bytes can be buffered before ACK.', 'Flow Control');
  addQ('cybersecurity', 'networking-fundamentals', 2, 3,
    'In a Wireshark capture, repeated gratuitous ARP replies claiming the gateway IP belongs to an attacker MAC indicates:',
    ['DHCP exhaustion', 'Man-in-the-Middle (MitM) ARP Spoofing / Poisoning', 'DNS Cache Poisoning', 'SQL Injection'],
    'B', 'Gratuitous ARP replies overwrite client ARP caches so traffic destined for the gateway routes to the attacker.', 'Traffic Diagnosis');
  addQ('cybersecurity', 'networking-fundamentals', 2, 4,
    'What is the primary operational difference between stateful firewalls and stateless packet filters?',
    ['Stateful firewalls track connection state tables and inspect sequence numbers across packet flows', 'Stateless firewalls decrypt TLS', 'Stateful firewalls only operate on Layer 1', 'Stateless filters inspect HTTP cookies'],
    'A', 'Stateful inspection tracks whether a packet belongs to an active, established session, automatically allowing return traffic.', 'Firewall Architecture');
  addQ('cybersecurity', 'networking-fundamentals', 2, 5,
    'Why does MTU path discovery matter in VPN tunnels (IPsec/WireGuard)?',
    ['To encrypt passwords', 'Additional tunnel headers reduce payload space; exceeding MTU causes packet fragmentation or silent drops', 'To bypass firewall rules', 'To convert IPv4 to IPv6'],
    'B', 'Encapsulation headers increase packet size. If DF (Don’t Fragment) is set and MTU is exceeded, packets are dropped ("black hole").', 'MTU & Tunneling');

  // Level 3
  addQ('cybersecurity', 'networking-fundamentals', 3, 1,
    'How do SYN cookies defend against SYN flood attacks without allocating kernel memory state?',
    ['They drop all incoming connection requests', 'The initial sequence number encodes connection parameters cryptographically into the SYN-ACK', 'They route requests to a secondary ISP', 'They enforce CAPTCHA on the TCP layer'],
    'B', 'SYN cookies encode client MSS and timestamp into the 32-bit sequence number. State is only allocated upon receiving valid ACK.', 'Kernel Defense');
  addQ('cybersecurity', 'networking-fundamentals', 3, 2,
    'What architectural vulnerability in BGP allows rogue autonomous systems to hijack internet traffic prefixes?',
    ['Lack of cryptographic route announcement authentication in classic BGP (unauthenticated path attributes)', 'TCP port 179 buffer overflows', 'Slow convergence timers', 'DNSSEC incompatibilities'],
    'A', 'Classic BGP trusts announced route prefixes without validation. RPKI (Resource Public Key Infrastructure) fixes this by signing route origins.', 'Routing Security');
  addQ('cybersecurity', 'networking-fundamentals', 3, 3,
    'In high-throughput microservice fabrics, why does TCP head-of-line blocking drive adoption of QUIC / HTTP/3?',
    ['HTTP/3 removes all encryption', 'QUIC multiplexes independent streams over UDP, so a dropped packet only stalls its individual stream', 'QUIC eliminates ports', 'QUIC runs on Layer 2 directly'],
    'B', 'In TCP, a single lost packet halts delivery of all multiplexed HTTP/2 streams until retransmission succeeds. QUIC solves this over UDP.', 'Protocol Evolution');
  addQ('cybersecurity', 'networking-fundamentals', 3, 4,
    'What is the function of the TCP Keep-Alive probe in stateful NAT gateways?',
    ['To monitor network latency', 'To send small packets ensuring stateful NAT table translation mappings do not time out during idle periods', 'To synchronize system clocks', 'To negotiate encryption ciphers'],
    'B', 'Firewalls and NAT gateways evict inactive translation entries after idle timeouts. Keep-alives maintain active translation entries.', 'NAT Traversal');
  addQ('cybersecurity', 'networking-fundamentals', 3, 5,
    'How does BPF/eBPF revolutionize high-performance packet filtering and DDoS mitigation at the kernel level?',
    ['By running packet filters in user-space Python', 'By running sandboxed bytecode directly inside kernel network hooks before socket memory allocation', 'By disabling network cards', 'By rewriting the Linux kernel in Rust'],
    'B', 'eBPF executes programmable filters directly inside driver XDP (eXpress Data Path) hooks, dropping malicious packets in nanoseconds.', 'Kernel Security');

  // Skill 2.2: Web Security (web-security)
  // Level 1
  addQ('cybersecurity', 'web-security', 1, 1,
    'What is the primary cause of SQL Injection (SQLi) vulnerabilities?',
    ['Using relational databases instead of NoSQL', 'Concatenating untrusted user input directly into dynamic SQL query strings', 'Forgetting to add primary keys', 'Running database servers on port 5432'],
    'B', 'Direct string concatenation allows user input to break out of data context into executable SQL syntax.', 'Injection Basics');
  addQ('cybersecurity', 'web-security', 1, 2,
    'What is Cross-Site Scripting (XSS)?',
    ['An attack that steals database servers via SSH', 'Injecting malicious client-side JavaScript that executes within a victim’s browser session', 'Flooding a web server with fake HTTP requests', 'Guessing user passwords through brute force'],
    'B', 'XSS executes attacker-controlled JavaScript in the context of the user’s browser origin, allowing cookie and session theft.', 'XSS Fundamentals');
  addQ('cybersecurity', 'web-security', 1, 3,
    'Which HTTP cookie flag prevents client-side scripts (e.g., document.cookie) from accessing the cookie?',
    ['Secure', 'HttpOnly', 'SameSite=Lax', 'Domain'],
    'B', 'The HttpOnly flag blocks JavaScript access, mitigating session token exfiltration via Cross-Site Scripting.', 'Cookie Security');
  addQ('cybersecurity', 'web-security', 1, 4,
    'What is the role of the `Secure` flag on an HTTP response cookie?',
    ['Encrypts the cookie value with AES-256', 'Ensures the browser only transmits the cookie over encrypted TLS (HTTPS) connections', 'Blocks the cookie from expiring', 'Requires two-factor authentication'],
    'B', 'The Secure flag ensures cookies are never transmitted in cleartext over unencrypted HTTP channels.', 'Cookie Security');
  addQ('cybersecurity', 'web-security', 1, 5,
    'Which mechanism prevents a malicious website from executing unauthorized commands on behalf of an authenticated user (CSRF)?',
    ['Anti-CSRF synchronizer tokens or SameSite cookie attributes', 'Adding more CSS styles', 'Increasing database password length', 'Using base64 encoding'],
    'A', 'Anti-CSRF tokens and SameSite attributes stop third-party origins from tricking browsers into sending authenticated state mutations.', 'CSRF Defense');

  // Level 2
  addQ('cybersecurity', 'web-security', 2, 1,
    'Review the vulnerable code snippet. How should this query be secured?',
    ['Use `eval()` on the user input', 'Use parameterized queries / prepared statements passing variables as bound parameters', 'Wrap user input in URL encoding', 'Replace single quotes with double quotes'],
    'B', 'Parameterized queries separate SQL instructions from user data, ensuring input can never alter query structure.', 'Query Remediation',
    'const query = `SELECT * FROM users WHERE email = "${req.body.email}"`;', 'debugging');
  addQ('cybersecurity', 'web-security', 2, 2,
    'What does a `Content-Security-Policy: default-src \'self\'; script-src \'self\'` header restrict?',
    ['Prevents databases from querying external hosts', 'Blocks script execution from inline `<script>` tags and untrusted external origins', 'Forces all images to be PNG format', 'Disables HTTPS encryption'],
    'B', 'CSP restricts script execution sources to the origin itself and disallows inline scripts and `eval()`, mitigating XSS.', 'Content Security Policy');
  addQ('cybersecurity', 'web-security', 2, 3,
    'An attacker tricks an internal server into fetching `http://169.254.169.254/latest/meta-data/`. What attack is this?',
    ['Cross-Site Request Forgery', 'Server-Side Request Forgery (SSRF) targeting cloud instance metadata', 'SQL Injection', 'Clickjacking'],
    'B', 'SSRF abuses server-side URL fetching to probe internal networks and exfiltrate cloud instance IAM credentials via metadata endpoints.', 'SSRF Exploitation');
  addQ('cybersecurity', 'web-security', 2, 4,
    'How does `SameSite=Strict` cookie behavior affect links incoming from external emails or search engines?',
    ['Cookies are never sent on any cross-site request, meaning user appears logged out when following external links', 'Cookies are sent unconditionally', 'Cookies are encrypted with user password', 'The link is blocked by the browser'],
    'A', 'SameSite=Strict withholds cookies on all top-level cross-site navigations. SameSite=Lax allows safe top-level GET navigations.', 'Cookie Semantics');
  addQ('cybersecurity', 'web-security', 2, 5,
    'What header defends against clickjacking by restricting whether a site can be embedded in an `<iframe>`?',
    ['X-XSS-Protection', 'X-Frame-Options: DENY (or CSP frame-ancestors)', 'X-Content-Type-Options: nosniff', 'Strict-Transport-Security'],
    'B', 'X-Frame-Options and CSP `frame-ancestors \'none\'` instruct browsers never to render the page inside a frame/iframe.', 'Clickjacking Defense');

  // Level 3
  addQ('cybersecurity', 'web-security', 3, 1,
    'In defending against Second-Order SQL Injection, why is sanitizing input on ingestion insufficient?',
    ['Data stored in the database might be deemed safe, but executed dynamically in an unparameterized query downstream', 'Second-order attacks only happen in Python', 'Databases automatically remove escape characters', 'It only affects binary data'],
    'A', 'Second-order SQLi occurs when stored data is subsequently retrieved and concatenated into another dynamic query. Parameterization must occur at point of execution.', 'Advanced Injection');
  addQ('cybersecurity', 'web-security', 3, 2,
    'How does strict mutual TLS (mTLS) protect service-to-service communication in a microservices cluster?',
    ['It compresses payloads with gzip', 'Both client and server validate each other\'s cryptographic X.509 certificates before establishing a connection', 'It replaces HTTP with FTP', 'It eliminates the need for firewalls'],
    'B', 'mTLS provides bidirectional authentication and encryption, ensuring only authorized microservices with valid private keys communicate.', 'Zero-Trust Architecture');
  addQ('cybersecurity', 'web-security', 3, 3,
    'What is the primary vulnerability in JWT authentication if a server accepts `{"alg": "none"}` in the header?',
    ['Token expiration is ignored', 'Attackers can forge arbitrary administrative claims without providing a valid cryptographic signature', 'Database connections leak memory', 'The browser crashes upon decoding'],
    'B', 'The "none" algorithm bug allows forged JWTs with altered payloads to be accepted as valid when servers fail to enforce specific algorithms.', 'JWT Security');
  addQ('cybersecurity', 'web-security', 3, 4,
    'In defending against blind SSRF, what network-level mitigation provides the strongest guarantee against internal port scanning?',
    ['Blacklisting "localhost" in regex', 'Egress firewalls / network security groups blocking application containers from private IP ranges (RFC 1918 & link-local)', 'URL encoding validation', 'Checking the HTTP Referer header'],
    'B', 'Regex blacklists are routinely bypassed via DNS rebinding, IPv6, or alternative IP notations. Network egress rules enforce hard boundaries.', 'SSRF Hardening');
  addQ('cybersecurity', 'web-security', 3, 5,
    'How does the HTTP Strict Transport Security (HSTS) preload list protect users from initial SSL-stripping attacks?',
    ['It downloads certificates during boot', 'Hardcoded browser lists force HTTPS on the very first connection, eliminating the cleartext HTTP redirect vulnerability', 'It encrypts local DNS caches', 'It prevents browser extensions from running'],
    'B', 'Without HSTS preloading, an initial HTTP request can be intercepted and stripped by a Man-in-the-Middle attacker before the HTTPS upgrade.', 'HSTS & Transport');

  // Skill 2.3: Cryptography (cryptography)
  // Level 1
  addQ('cybersecurity', 'cryptography', 1, 1,
    'What is the fundamental difference between cryptographic hashing and encryption?',
    ['Hashing is reversible; encryption is one-way', 'Hashing is a one-way deterministic mathematical function; encryption is two-way reversible with a key', 'Encryption does not require keys', 'Hashing requires high CPU memory'],
    'B', 'Cryptographic hashing cannot be reversed to plaintext; encryption is designed for decryption using the appropriate key.', 'Cryptographic Basics');
  addQ('cybersecurity', 'cryptography', 1, 2,
    'Why is MD5 considered insecure for password storage and digital signatures?',
    ['It generates hashes that are too long', 'Practical collision attacks can generate two distinct inputs with identical MD5 hashes in seconds', 'It cannot handle numbers', 'It requires an internet connection'],
    'B', 'MD5 has severe collision vulnerabilities, meaning attackers can generate colliding forged files and certificates.', 'Hash Security');
  addQ('cybersecurity', 'cryptography', 1, 3,
    'In symmetric encryption (e.g. AES), which key is used for encryption and decryption?',
    ['A public key for encryption and private key for decryption', 'The identical shared secret key is used for both operations', 'Two distinct public keys', 'No key is required'],
    'B', 'Symmetric encryption relies on a single shared secret key for both encryption and decryption.', 'Symmetric Ciphers');
  addQ('cybersecurity', 'cryptography', 1, 4,
    'What is a cryptographic salt and why is it added to passwords before hashing?',
    ['An encryption key that decrypts the password', 'Random unique data concatenated to passwords to defend against precomputed rainbow table attacks', 'A database index', 'A checksum for network packets'],
    'B', 'Unique salts ensure identical passwords produce completely different hash outputs, defeating precomputed rainbow tables.', 'Password Hashing');
  addQ('cybersecurity', 'cryptography', 1, 5,
    'Which algorithm is an asymmetric cryptographic system commonly used for digital signatures and key exchange?',
    ['AES-256', 'RSA', 'DES', 'RC4'],
    'B', 'RSA is an asymmetric public-key cryptosystem using prime factorization for encryption and digital signatures.', 'Asymmetric Cryptography');

  // Level 2
  addQ('cybersecurity', 'cryptography', 2, 1,
    'Why is AES in Electronic Codebook (ECB) mode considered insecure for encrypting structured data?',
    ['It is too slow to execute', 'Identical plaintext blocks produce identical ciphertext blocks, preserving visual and structural patterns', 'It requires public key infrastructure', 'It truncates keys to 32 bits'],
    'B', 'ECB mode encrypts blocks independently without an IV, leaking underlying data patterns (famous "ECB Penguin" visual).', 'Cipher Modes');
  addQ('cybersecurity', 'cryptography', 2, 2,
    'What critical guarantee does AES in Galois/Counter Mode (AES-GCM) provide that CBC mode alone does not?',
    ['Authenticated Encryption with Associated Data (AEAD), ensuring confidentiality and tamper-proof integrity', 'Faster key generation', 'Infinite key length', 'Resistance to quantum computers'],
    'A', 'AES-GCM computes an authentication tag, preventing chosen-ciphertext and padding oracle attacks by verifying data integrity.', 'AEAD Ciphers');
  addQ('cybersecurity', 'cryptography', 2, 3,
    'In digital signature verification, which key does the recipient use to verify that a message was signed by the sender?',
    ['The recipient\'s private key', 'The sender\'s public key', 'A shared symmetric key', 'A random ephemeral salt'],
    'B', 'The sender signs data using their private key; any recipient can verify the signature using the sender\'s corresponding public key.', 'Digital Signatures');
  addQ('cybersecurity', 'cryptography', 2, 4,
    'Why are standard fast hash algorithms like SHA-256 unsuitable for storing user passwords without a KDF?',
    ['They are broken and have collisions', 'GPUs can compute billions of SHA-256 hashes per second, making offline brute-force attacks trivial', 'They only accept 16-character inputs', 'They cannot be salted'],
    'B', 'Password hashing requires computationally expensive Key Derivation Functions (Argon2, bcrypt, PBKDF2) with tunable work factors.', 'Key Derivation');
  addQ('cybersecurity', 'cryptography', 2, 5,
    'What fatal security flaw occurs if an Initialization Vector (IV) is reused with the same key in AES-GCM?',
    ['The encryption becomes slower', 'The authentication key can be recovered, allowing forgery and partial plaintext recovery', 'The database drops the table', 'The server runs out of memory'],
    'B', 'Reusing an IV in GCM mode allows an attacker to compute the GHASH authentication key and decrypt ciphertexts sharing that IV.', 'IV Replay Flaw');

  // Level 3
  addQ('cybersecurity', 'cryptography', 3, 1,
    'What property does Perfect Forward Secrecy (PFS) in TLS 1.3 provide?',
    ['Guarantees password changes every 30 days', 'Compromise of the server\'s long-term private key does not compromise past recorded session traffic', 'Eliminates symmetric encryption completely', 'Blocks all man-in-the-middle attacks automatically'],
    'B', 'PFS generates ephemeral Diffie-Hellman keys per session. Historical traffic cannot be decrypted even if server private keys leak later.', 'Forward Secrecy');
  addQ('cybersecurity', 'cryptography', 3, 2,
    'Why is the Argon2id algorithm recommended over bcrypt for modern high-security password hashing?',
    ['It produces smaller hashes', 'It provides resistance against side-channel timing attacks and memory-hard resistance against ASIC/GPU cracking', 'It runs in zero milliseconds', 'It does not require salts'],
    'B', 'Argon2id combines data-independent and data-dependent memory access, defeating GPU parallelism and cache-timing attacks.', 'Modern KDFs');
  addQ('cybersecurity', 'cryptography', 3, 3,
    'How does a timing attack compromise string comparisons in cryptographic token verification?',
    ['By slowing down CPU clock cycles', 'Standard comparisons terminate early on the first mismatched byte, leaking secret length and prefix via elapsed time', 'By crashing the browser process', 'By exploiting quantum state collapse'],
    'B', 'Non-constant-time comparisons return early when bytes differ. Attackers measure nanosecond variations to deduce secrets byte-by-byte.', 'Timing Attacks');
  addQ('cybersecurity', 'cryptography', 3, 4,
    'What is the advantage of Elliptic Curve Cryptography (ECC, e.g. Ed25519) over classic RSA?',
    ['It is older and more tested', 'Equivalent cryptographic security with substantially smaller key sizes, faster computation, and lower power consumption', 'It does not use mathematics', 'It works without private keys'],
    'B', 'A 256-bit ECC key offers comparable security to a 3072-bit RSA key, drastically reducing handshake bandwidth and CPU overhead.', 'Elliptic Curve Cryptography');
  addQ('cybersecurity', 'cryptography', 3, 5,
    'In zero-knowledge proofs (ZK-SNARKs), what fundamental invariant is mathematically established?',
    ['The verifier learns the full plaintext password', 'The prover demonstrates knowledge of a secret statement without revealing any information about the secret itself', 'All communications are transmitted in cleartext', 'Data is stored on a distributed ledger'],
    'B', 'Zero-knowledge proofs allow one party to prove a statement is true without revealing underlying secret witness data.', 'Zero-Knowledge Proofs');

  // =========================================================================
  // DOMAIN 3: DATA SCIENCE (data-science)
  // =========================================================================

  // Skill 3.1: Python & SQL (python-sql)
  // Level 1
  addQ('data-science', 'python-sql', 1, 1,
    'Which SQL clause filters records AFTER aggregation has been performed by a `GROUP BY`?',
    ['WHERE', 'HAVING', 'FILTER', 'LIMIT'],
    'B', 'WHERE filters rows before aggregation; HAVING filters aggregated groups after GROUP BY.', 'SQL Aggregations');
  addQ('data-science', 'python-sql', 1, 2,
    'In an `INNER JOIN` between Table A (10 rows) and Table B (5 rows), what is returned when no rows match the ON condition?',
    ['10 rows', '5 rows', '0 rows', '15 rows'],
    'C', 'INNER JOIN returns only rows that satisfy the join predicate. Zero matches produce an empty result set.', 'SQL Joins');
  addQ('data-science', 'python-sql', 1, 3,
    'In Pandas, how do you filter a DataFrame `df` for rows where column `age` is greater than 30?',
    ['df.filter(age > 30)', 'df[df[\'age\'] > 30]', 'df.where(age > 30)', 'df.select(\'age > 30\')'],
    'B', 'Boolean indexing `df[df[\'age\'] > 30]` evaluates a boolean Series and returns matching rows.', 'Pandas Filtering');
  addQ('data-science', 'python-sql', 1, 4,
    'What is the primary benefit of a Common Table Expression (`WITH cte AS (...)`) over nested subqueries?',
    ['Faster disk writes', 'Enhanced readability, modular query organization, and the ability to reference CTEs recursively', 'Automatic creation of database indexes', 'Elimination of all JOIN operations'],
    'B', 'CTEs structure complex queries into sequential, readable blocks and support recursion for hierarchical data.', 'SQL CTEs');
  addQ('data-science', 'python-sql', 1, 5,
    'Which Pandas method calculates summary statistics (count, mean, std, min, quartiles, max) for numeric columns?',
    ['df.summary()', 'df.describe()', 'df.info()', 'df.stats()'],
    'B', '`df.describe()` outputs descriptive statistical distributions across all numerical Series.', 'Pandas Exploration');

  // Level 2
  addQ('data-science', 'python-sql', 2, 1,
    'How does `DENSE_RANK()` differ from `RANK()` in SQL window functions when duplicate values occur?',
    ['DENSE_RANK() leaves gaps in ranking numbers after ties; RANK() does not', 'DENSE_RANK() produces consecutive rank numbers without gaps after ties; RANK() skips numbers', 'DENSE_RANK() only works on dates', 'RANK() returns percentages'],
    'B', 'For tied values (1, 1), RANK() assigns (1, 1, 3) skipping 2, while DENSE_RANK() assigns consecutive numbers (1, 1, 2).', 'Window Functions');
  addQ('data-science', 'python-sql', 2, 2,
    'What does `LAG(sales, 1) OVER (PARTITION BY store_id ORDER BY month)` retrieve?',
    ['The sales value of the next month', 'The sales value of the preceding month within each individual store partition', 'The total sales for the year', 'The average store sales'],
    'B', 'LAG accesses rows at a given physical offset prior to the current row within the partitioned window.', 'Window Navigation');
  addQ('data-science', 'python-sql', 2, 3,
    'In Pandas, what occurs if you perform `df.merge()` without specifying `on` or `left_on`/`right_on`?',
    ['Pandas raises a fatal error', 'Pandas automatically joins on the intersection of column names present in both DataFrames', 'It performs an outer Cartesian product', 'It drops all unmatched rows'],
    'B', 'By default, Pandas merges on all overlapping column names present in both dataframes.', 'Pandas Merge');
  addQ('data-science', 'python-sql', 2, 4,
    'How does a B-tree database index accelerate `WHERE user_id = 42` queries?',
    ['By scanning all rows in O(N) sequential order', 'By traversing balanced tree node pointers in O(log N) operations to locate matching row pointers', 'By deleting all other rows', 'By caching the table in browser storage'],
    'B', 'B-trees maintain sorted keys, enabling logarithmic point searches and range lookups without full table scans.', 'Database Indexing');
  addQ('data-science', 'python-sql', 2, 5,
    'Why should `iterrows()` be avoided when manipulating large Pandas DataFrames?',
    ['It cannot process strings', 'It generates Python Series objects per row, introducing massive interpreter overhead compared to vectorized methods', 'It modifies data permanently on disk', 'It runs only in single-user mode'],
    'B', 'Row iteration discards C-level SIMD execution and incurs high Python object wrapping costs. Vectorization is orders of magnitude faster.', 'Vectorization Efficiency');

  // Level 3
  addQ('data-science', 'python-sql', 3, 1,
    'In high-volume SQL query tuning, what does an `EXPLAIN ANALYZE` output showing a "Seq Scan" on a 10M row table indicate?',
    ['The query is using a covering index', 'The database optimizer is reading every single page on disk because no suitable index was matched', 'The query executed in memory cache', 'The query finished in zero milliseconds'],
    'B', 'Sequential scans read every disk block for the table, indicating missing indexes or non-sargable query predicates.', 'Query Plan Profiling');
  addQ('data-science', 'python-sql', 3, 2,
    'How can you prevent a recursive CTE (`WITH RECURSIVE`) from entering an infinite loop on cyclic graph data?',
    ['By setting LIMIT 1000', 'By tracking an array of visited node IDs (`ARRAY[id]`) and halting when the current ID is already in the array', 'By removing all foreign keys', 'By converting integers to strings'],
    'B', 'Accumulating an array of visited nodes and checking `WHERE id <> ALL(path)` breaks cycles in graph/tree traversals.', 'Recursive CTEs');
  addQ('data-science', 'python-sql', 3, 3,
    'What is the difference between a Hash Join and a Nested Loop Join in relational query engines?',
    ['Hash Joins build an in-memory hash table of the smaller relation and probe it in O(M+N); Nested Loops compare every row in O(M*N)', 'Nested loops are always faster for big data', 'Hash joins only work on strings', 'Nested loops require Redis'],
    'A', 'Hash joins efficiently match large unindexed tables using hash lookup tables. Nested loops excel primarily when one side is small and indexed.', 'Query Engine Internals');
  addQ('data-science', 'python-sql', 3, 4,
    'When loading millions of rows into PostgreSQL from Python, which mechanism delivers maximum throughput?',
    ['Executing individual INSERT statements in a loop', 'Using `COPY ... FROM STDIN` binary/text protocol streaming', 'Executing updates via REST API', 'Writing data into JSONB one by one'],
    'B', 'The PostgreSQL COPY protocol streams raw tuples directly into storage pages, bypassing SQL parsing overhead.', 'High-Throughput Ingestion');
  addQ('data-science', 'python-sql', 3, 5,
    'How does table partitioning (e.g., partitioning by month) improve query performance on multi-terabyte analytical databases?',
    ['It compresses data into zip files', 'Partition pruning allows the query planner to completely skip reading disk blocks for irrelevant date ranges', 'It duplicates data across all regions', 'It eliminates NULL values'],
    'B', 'Partition pruning excludes unneeded sub-tables during query execution, reducing I/O by orders of magnitude.', 'Table Partitioning');

  // Skill 3.2: Statistics (statistics)
  // Level 1
  addQ('data-science', 'statistics', 1, 1,
    'Which measure of central tendency is least sensitive to extreme outliers?',
    ['Arithmetic Mean', 'Median', 'Variance', 'Standard Deviation'],
    'B', 'The median relies on rank ordering rather than numerical summation, making it resilient to extreme outliers.', 'Central Tendency');
  addQ('data-science', 'statistics', 1, 2,
    'In a standard normal distribution, approximately what percentage of observations fall within 1 standard deviation of the mean?',
    ['50%', '68%', '95%', '99.7%'],
    'B', 'The empirical 68-95-99.7 rule dictates that ~68.2% of data lies within +/- 1 sigma of the mean in a normal curve.', 'Normal Distribution');
  addQ('data-science', 'statistics', 1, 3,
    'What is a p-value in statistical hypothesis testing?',
    ['The probability that the alternative hypothesis is true', 'The probability of observing data at least as extreme as the sample, assuming the null hypothesis is true', 'The percentage of errors in the dataset', 'The correlation coefficient squared'],
    'B', 'A p-value measures evidence against the null hypothesis assuming the null is true.', 'Hypothesis Testing');
  addQ('data-science', 'statistics', 1, 4,
    'What is a Type I error in statistical decision making?',
    ['Rejecting a true null hypothesis (False Positive)', 'Failing to reject a false null hypothesis (False Negative)', 'Calculating variance incorrectly', 'Using too small a sample size'],
    'A', 'Type I error is finding an effect where none exists (alpha, false positive). Type II is missing an existing effect (beta).', 'Error Types');
  addQ('data-science', 'statistics', 1, 5,
    'What is the range of the Pearson correlation coefficient (r)?',
    ['[0, 1]', '[-1, 1]', '(-inf, +inf)', '[-100, 100]'],
    'B', 'Pearson r ranges from -1 (perfect negative linear correlation) to +1 (perfect positive correlation), with 0 meaning no linear correlation.', 'Correlation');

  // Level 2
  addQ('data-science', 'statistics', 2, 1,
    'When should a two-sample Welch\'s t-test be preferred over Student\'s t-test?',
    ['When sample sizes are identical', 'When the two groups have unequal variances (heteroscedasticity)', 'When data follows a Poisson distribution', 'When sample size exceeds 1,000,000'],
    'B', 'Welch’s t-test does not assume equal population variances, providing robust error control when variances differ.', 'Hypothesis Testing');
  addQ('data-science', 'statistics', 2, 2,
    'What does the Central Limit Theorem guarantee about the distribution of sample means as sample size N grows large?',
    ['The population distribution becomes normal', 'The distribution of sample means approaches a normal distribution regardless of the underlying population shape', 'The variance increases proportionally with N', 'Outliers are permanently eliminated'],
    'B', 'The CLT states that sums and averages of independent random variables approach a normal distribution as N increases.', 'Central Limit Theorem');
  addQ('data-science', 'statistics', 2, 3,
    'What statistical correction adjusts significance thresholds when conducting 50 simultaneous hypothesis tests?',
    ['Standard error doubling', 'Bonferroni correction or Benjamini-Hochberg FDR control', 'Min-max normalization', 'Linear regression'],
    'B', 'Testing multiple hypotheses inflates family-wise error rate. Bonferroni (alpha/m) and FDR control control false discovery rates.', 'Multiple Testing');
  addQ('data-science', 'statistics', 2, 4,
    'In A/B testing, what determines the minimum sample size required before launching an experiment?',
    ['The size of the hard drive', 'Baseline conversion rate, Minimum Detectable Effect (MDE), statistical power (1-beta), and significance level (alpha)', 'The number of developers on the team', 'The time of day testing begins'],
    'B', 'Power analysis calculates required sample size from alpha, desired power (typically 80%), baseline rate, and target effect size.', 'Sample Size Power');
  addQ('data-science', 'statistics', 2, 5,
    'What does Simpson\'s Paradox describe in aggregate data analysis?',
    ['A trend that appears in different groups disappears or reverses when the groups are combined', 'A correlation that always equals 1.0', 'A dataset with zero variance', 'An algorithm that fails on even numbers'],
    'A', 'Simpson’s Paradox occurs when a confounding variable distorts aggregate summaries across unequal group subgroups.', 'Confounding & Bias');

  // Level 3
  addQ('data-science', 'statistics', 3, 1,
    'What is the fundamental difference between Frequentist and Bayesian inference?',
    ['Frequentists treat parameters as fixed unknown constants; Bayesians treat parameters as random variables with probability distributions', 'Frequentists use probabilities; Bayesians do not', 'Bayesians reject all hypothesis testing', 'Frequentists only work on small data'],
    'A', 'Bayesian inference updates prior belief distributions using observed data likelihood to produce posterior distributions.', 'Bayesian vs Frequentist');
  addQ('data-science', 'statistics', 3, 2,
    'When underlying parametric assumptions are completely violated, how does bootstrapping estimate confidence intervals?',
    ['By deleting non-normal values', 'By repeatedly sampling with replacement from the observed data to generate an empirical sampling distribution', 'By dividing standard deviation by 2', 'By fitting an exponential curve'],
    'B', 'Non-parametric bootstrapping resamples observed data with replacement thousands of times to compute empirical quantiles.', 'Bootstrapping');
  addQ('data-science', 'statistics', 3, 3,
    'What problem does Survival Analysis (Kaplan-Meier, Cox Proportional Hazards) solve that standard linear regression cannot?',
    ['Missing column names', 'Right-censored time-to-event data where subjects have not yet experienced the event when study ends', 'Negative numbers', 'High dimensional matrices'],
    'B', 'Standard regression cannot handle censored observations where the event has not yet occurred before observation concludes.', 'Survival Analysis');
  addQ('data-science', 'statistics', 3, 4,
    'In sequential A/B testing, what is the danger of repeatedly checking p-values every hour and stopping as soon as p < 0.05?',
    ['CPU overheating', 'Peeking dramatically inflates Type I false positive rates far above 5% due to repeated testing over time', 'Conversion rates drop to zero', 'The test becomes deterministic'],
    'B', 'Continuous peeking without sequential boundaries (e.g., Pocock or O\'Brien-Fleming) invalidates fixed-sample p-value guarantees.', 'Sequential Testing');
  addQ('data-science', 'statistics', 3, 5,
    'What does Markov Chain Monte Carlo (MCMC) sampling achieve in high-dimensional Bayesian models?',
    ['It calculates deterministic derivatives', 'It generates representative samples from intractable posterior probability distributions that cannot be integrated analytically', 'It sorts arrays in O(N)', 'It verifies network packet integrity'],
    'B', 'MCMC algorithms (Metropolis-Hastings, NUTS, HMC) sample from complex joint posterior spaces where high-dimensional integrals cannot be solved.', 'MCMC Sampling');

  // Skill 3.3: Data Analysis & Visualization (data-analysis-visualization)
  // Level 1
  addQ('data-science', 'data-analysis-visualization', 1, 1,
    'Which chart type is best suited for showing the continuous distribution of a single numerical variable?',
    ['Pie chart', 'Histogram or Kernel Density Plot', 'Radar chart', 'Network graph'],
    'B', 'Histograms divide continuous values into bins, displaying frequency counts and underlying skewness.', 'Chart Selection');
  addQ('data-science', 'data-analysis-visualization', 1, 2,
    'In a box plot, what do the lower and upper bounds of the central box represent?',
    ['Minimum and Maximum values', 'First Quartile (25th percentile) and Third Quartile (75th percentile)', 'Mean and Standard Deviation', 'Mode and Median'],
    'B', 'The box spans the Interquartile Range (IQR) from Q1 (25th percentile) to Q3 (75th percentile).', 'Box Plot Anatomy');
  addQ('data-science', 'data-analysis-visualization', 1, 3,
    'Which chart should be chosen to inspect the correlation between two continuous variables (e.g. height vs weight)?',
    ['Stacked Bar Chart', 'Scatter Plot', 'Doughnut Chart', 'Treemap'],
    'B', 'Scatter plots position individual data points on Cartesian coordinates, revealing linear and non-linear associations.', 'Scatter Plots');
  addQ('data-science', 'data-analysis-visualization', 1, 4,
    'Why are pie charts with more than 7 categories generally discouraged in professional analytics?',
    ['Human perception struggles to accurately judge angles and relative area differences compared to linear bar lengths', 'They require 3D graphics', 'Browsers cannot render circles', 'They invert color palettes'],
    'A', 'Humans perceive lengths along a common axis far more accurately than angular slices or area wedges.', 'Visual Perception');
  addQ('data-science', 'data-analysis-visualization', 1, 5,
    'In Seaborn/Matplotlib, what parameter maps a third categorical dimension to distinct colors in a scatter plot?',
    ['hue', 'color_filter', 'tint', 'group_palette'],
    'A', 'The `hue` parameter encodes categorical groups using distinct color hues on the same canvas.', 'Color Mapping');

  // Level 2
  addQ('data-science', 'data-analysis-visualization', 2, 1,
    'What visualization technique is most effective for displaying pairwise correlations across 20 continuous numerical variables?',
    ['20 individual pie charts', 'A correlation heatmap with an annotated diverging color palette', 'A 3D surface mesh', 'A single line graph'],
    'B', 'Correlation heatmaps map numeric correlation coefficients into a compact, color-coded grid matrix.', 'Correlation Matrix');
  addQ('data-science', 'data-analysis-visualization', 2, 2,
    'When visualizing heavily skewed income distributions with extreme long tails, what transformation improves plot readability?',
    ['Logarithmic transformation on the axis', 'Squaring the values', 'Replacing negatives with 100', 'Inverting the x and y axes'],
    'A', 'Logarithmic scaling contracts exponential ranges, allowing visualization of both median clusters and long tails.', 'Scale Transformations');
  addQ('data-science', 'data-analysis-visualization', 2, 3,
    'Why is a diverging color palette (e.g. Coolwarm) appropriate for correlation matrices but inappropriate for raw counts?',
    ['Raw counts have no colors', 'Diverging palettes emphasize deviations around a critical central midpoint (e.g., 0 correlation); sequential palettes suit zero-bounded counts', 'Diverging palettes only support 2 colors', 'Sequential palettes require negative values'],
    'B', 'Diverging palettes highlight contrasting extremes on both sides of a meaningful neutral center point.', 'Color Theory');
  addQ('data-science', 'data-analysis-visualization', 2, 4,
    'What does a FacetGrid / small multiples design accomplish in exploratory data analysis?',
    ['It merges all categories into one single average line', 'It splits data into a grid of multiple small, coordinated subplots sharing identical scales for comparison', 'It hides outliers automatically', 'It converts 2D charts into 3D'],
    'B', 'Small multiples display identical chart architectures across subsets, avoiding visual clutter from over-plotting.', 'Small Multiples');
  addQ('data-science', 'data-analysis-visualization', 2, 5,
    'What visual artifact occurs in scatter plots when hundreds of thousands of points overlap in the same coordinate region?',
    ['Quantization error', 'Over-plotting, obscuring the true density of the data', 'Color inversion', 'Coordinate drift'],
    'B', 'Over-plotting hides high-density clusters. Hexbin plots, 2D density contours, and alpha transparency resolve this.', 'Over-plotting Remediation');

  // Level 3
  addQ('data-science', 'data-analysis-visualization', 3, 1,
    'In building accessible dashboard interfaces, what color palette design principle is required for color-blind users?',
    ['Use only bright red and green', 'Avoid encoding primary categorical distinctions solely with red/green; use color-blind safe palettes (Viridis, ColorBrewer) and redundant symbols', 'Force black and white only', 'Use flashing animations'],
    'B', 'Deuteranopia and Protanopia prevent distinguishing red from green. Perceptually uniform palettes (Viridis) ensure accessible luminance.', 'Accessibility Standards');
  addQ('data-science', 'data-analysis-visualization', 3, 2,
    'How do vector graphics (SVG) compare to raster canvases (HTML5 Canvas/WebGL) when rendering 1,000,000 live streaming points?',
    ['SVG is faster because it uses XML', 'SVG creates 1,000,000 individual DOM nodes, causing memory crashes; WebGL renders millions of vertices directly on GPU buffers', 'Canvas cannot draw circles', 'SVG eliminates GPU load entirely'],
    'B', 'DOM overhead degrades SVG performance with massive element counts. WebGL/Canvas pipelines render millions of data points via GPU shaders.', 'Rendering Performance');
  addQ('data-science', 'data-analysis-visualization', 3, 3,
    'What is Edward Tufte\'s "Data-Ink Ratio" rule in analytical design?',
    ['Maximize background gridlines and 3D shadows', 'Maximize the proportion of ink/pixels dedicated to displaying actual data information while eliminating decorative chartjunk', 'Ensure every chart uses at least 10 colors', 'Print charts only with black ink'],
    'B', 'The Data-Ink Ratio advocates eliminating non-informational visual noise (heavy borders, unnecessary 3D effects, redundant labels).', 'Information Design');
  addQ('data-science', 'data-analysis-visualization', 3, 4,
    'When displaying time series across 10 years at daily resolution, what technique prevents browser client degradation while preserving trends?',
    ['Dropping 99% of data randomly', 'LTTB (Largest Triangle Three Buckets) downsampling algorithm', 'Converting all dates to year strings', 'Summing all values into one number'],
    'B', 'The LTTB downsampling algorithm retains the visual shape, peaks, and troughs of time series without dropping significant visual features.', 'Downsampling Algorithms');
  addQ('data-science', 'data-analysis-visualization', 3, 5,
    'How does cross-filtering work in multi-chart analytical dashboards (e.g. Crossfilter/DuckDB-Wasm)?',
    ['Selecting a filter on one chart dynamically recalculates and updates dimensional distributions across all other coordinated views in milliseconds', 'It downloads fresh CSV files on every click', 'It reloads the browser tab', 'It converts data to SQL strings'],
    'A', 'Coordinated cross-filtering maintains fast in-memory dimensional indexes, instantly recalculating histograms when a subset is selected.', 'Interactive Architecture');

  // =========================================================================
  // DOMAIN 4: DSA (dsa)
  // =========================================================================

  // Skill 4.1: Arrays & Strings (arrays-strings)
  // Level 1
  addQ('dsa', 'arrays-strings', 1, 1,
    'What is the time complexity of accessing an element in an array by its index?',
    ['O(N)', 'O(1)', 'O(log N)', 'O(N^2)'],
    'B', 'Array indexing calculates memory address directly via `base_address + index * element_size` in O(1) constant time.', 'Complexity Basics');
  addQ('dsa', 'arrays-strings', 1, 2,
    'What is the space complexity of reversing a string in-place using two pointers?',
    ['O(N)', 'O(1)', 'O(log N)', 'O(N^2)'],
    'B', 'Two pointers swap characters in-place without allocating auxiliary array buffers, requiring O(1) auxiliary space.', 'Two Pointers');
  addQ('dsa', 'arrays-strings', 1, 3,
    'Why is string concatenation in a loop (e.g. `s += char`) inefficient in languages with immutable strings like Java or Python?',
    ['It causes infinite loops', 'Each concatenation copies all previous characters into a brand-new string allocation, resulting in O(N^2) total time', 'It skips spaces', 'It reverses the string'],
    'B', 'Immutable string concatenation reallocates and copies memory on every step. A list or StringBuilder achieves O(N).', 'String Immutability');
  addQ('dsa', 'arrays-strings', 1, 4,
    'What data structure enables checking whether an element has been seen before in O(1) average time?',
    ['Sorted Array', 'Hash Set / Hash Map', 'Linked List', 'Stack'],
    'B', 'Hash tables compute hash codes to lookup keys in O(1) expected time.', 'Hashing');
  addQ('dsa', 'arrays-strings', 1, 5,
    'How does a prefix sum array allow querying the sum of any subarray `[L, R]` in O(1) time?',
    ['By sorting the subarray', 'By computing `prefix[R] - prefix[L - 1]`', 'By executing a while loop from L to R', 'By caching the middle element'],
    'B', 'Prefix sums precompute cumulative totals up to each index. Any range sum is resolved in a single subtraction.', 'Prefix Sums');

  // Level 2
  addQ('dsa', 'arrays-strings', 2, 1,
    'Review the two-pointer code snippet for checking a palindrome. What bug exists for odd-length strings?',
    ['It causes an IndexError', 'None; the while condition `left < right` correctly halts when pointers meet or cross', 'It skips the first character', 'It enters an infinite loop'],
    'B', 'When left == right on odd lengths, the middle character equals itself, so halting when left < right is optimal and correct.', 'Code Diagnosis',
    'function isPalindrome(s) {\n  let left = 0, right = s.length - 1;\n  while (left < right) {\n    if (s[left] !== s[right]) return false;\n    left++;\n    right--;\n  }\n  return true;\n}', 'debugging');
  addQ('dsa', 'arrays-strings', 2, 2,
    'In the "Longest Substring Without Repeating Characters" problem, what technique maintains the active window boundary?',
    ['Binary search over all substrings', 'Sliding window with two pointers and a hash map storing the most recent index of each character', 'Sorting the string alphabetically', 'Stack push and pop'],
    'B', 'The right pointer expands the window while the left pointer advances past the duplicate character\'s prior index in O(N).', 'Sliding Window');
  addQ('dsa', 'arrays-strings', 2, 3,
    'How does the Dutch National Flag algorithm partition an array of 0s, 1s, and 2s in a single pass?',
    ['By calling QuickSort', 'Using three pointers (low, mid, high) swapping elements into their target partitions in O(N) time and O(1) space', 'By counting frequencies and allocating three new arrays', 'Using recursion with depth N'],
    'B', 'Three pointers partition the array into elements < mid, == mid, and > mid in a single pass with O(1) memory.', 'Partitioning');
  addQ('dsa', 'arrays-strings', 2, 4,
    'What is the worst-case time complexity of inserting into a dynamic array (like std::vector or Python list)?',
    ['Always O(1)', 'O(N) when the capacity is full and all elements must be copied to a new doubled memory buffer', 'O(log N)', 'O(N^2)'],
    'B', 'While insertion has O(1) amortized cost, array resizing triggers an O(N) allocation and copy.', 'Amortized Analysis');
  addQ('dsa', 'arrays-strings', 2, 5,
    'In the "Container With Most Water" problem, why is moving the pointer with the smaller height guaranteed to be optimal?',
    ['Because moving the taller pointer can only decrease width without any chance of increasing the limiting height', 'Because heights are always sorted', 'Because width increases', 'Because of dynamic programming memoization'],
    'A', 'Area is constrained by `min(h[L], h[R]) * width`. Moving the taller pointer decreases width while height cannot exceed the shorter wall.', 'Two Pointer Invariant');

  // Level 3
  addQ('dsa', 'arrays-strings', 3, 1,
    'What is the worst-case time complexity of the Rabin-Karp string matching algorithm with a naive hash, and how is it optimized?',
    ['O(N) optimized with merge sort', 'O(N * M) worst-case due to hash collisions, optimized to expected O(N + M) using a rolling polynomial hash', 'O(N^3) optimized with Dijkstra', 'O(log N) optimized with binary search'],
    'B', 'Rolling polynomial hash updates hash values in O(1) using modular arithmetic, achieving linear expected matching time.', 'String Matching');
  addQ('dsa', 'arrays-strings', 3, 2,
    'In the "Minimum Window Substring" problem, how do you verify matching target character frequencies in O(1) per sliding window step?',
    ['By re-comparing the entire 128-character array on every step', 'By tracking a `matchedCount` counter that increments only when a character frequency requirement is satisfied', 'By sorting the window string', 'By converting to JSON'],
    'B', 'A matched counter avoids re-iterating over frequency maps, allowing O(1) validation per window shift and total O(N) time.', 'Window Invariant Optimization');
  addQ('dsa', 'arrays-strings', 3, 3,
    'How does the KMP (Knuth-Morris-Pratt) algorithm avoid backtracking the text pointer during pattern matching?',
    ['By buffering characters in a queue', 'By precomputing a Longest Prefix Suffix (LPS) array that indicates the next pattern index to align upon mismatch', 'By running backwards from the end of the text', 'By hashing every 3-letter chunk'],
    'B', 'The LPS table encodes self-similarity within the pattern, shifting pattern alignment without ever moving the text pointer backward.', 'KMP Matching');
  addQ('dsa', 'arrays-strings', 3, 4,
    'What data structure answers range minimum queries (RMQ) over an immutable array in O(1) query time after O(N log N) preprocessing?',
    ['Binary Search Tree', 'Sparse Table (using powers of 2 jumps)', 'Linked List', 'Priority Queue'],
    'B', 'Sparse Tables precompute minimums over intervals of length 2^k, allowing any range to be covered by two overlapping blocks in O(1).', 'Sparse Table RMQ');
  addQ('dsa', 'arrays-strings', 3, 5,
    'What is the theoretical lower bound for comparison-based array sorting, and what proves it?',
    ['O(N) proved by pigeonhole principle', 'Omega(N log N) proved by the decision tree model requiring log2(N!) comparisons to distinguish permutations', 'O(log N) proved by binary search', 'O(N^2) proved by bubble sort'],
    'B', 'A decision tree distinguishing N! possible permutations must have height >= log2(N!) = Omega(N log N).', 'Algorithmic Lower Bounds');

  // Skill 4.2: Trees & Graphs (trees-graphs)
  // Level 1
  addQ('dsa', 'trees-graphs', 1, 1,
    'In a valid Binary Search Tree (BST), what property holds for every node X?',
    ['All left descendants are strictly less than X, and all right descendants are strictly greater than X', 'Every node has exactly 2 children', 'Leaves are all at the exact same depth', 'Left child is always greater than right child'],
    'A', 'The BST invariant requires all nodes in the left subtree to be < root and all in the right subtree to be > root.', 'BST Properties');
  addQ('dsa', 'trees-graphs', 1, 2,
    'Which tree traversal order visits nodes in ascending sorted order when executed on a valid BST?',
    ['Pre-order (Root, Left, Right)', 'In-order (Left, Root, Right)', 'Post-order (Left, Right, Root)', 'Level-order (BFS)'],
    'B', 'In-order traversal visits left subtree, current root, then right subtree, yielding non-decreasing order on BSTs.', 'Tree Traversals');
  addQ('dsa', 'trees-graphs', 1, 3,
    'Which data structure is fundamentally utilized to implement Breadth-First Search (BFS) on a graph?',
    ['Stack (LIFO)', 'Queue (FIFO)', 'Priority Queue', 'Hash Set only'],
    'B', 'BFS processes nodes in order of discovery distance using a First-In-First-Out (FIFO) queue.', 'BFS Mechanics');
  addQ('dsa', 'trees-graphs', 1, 4,
    'What is the maximum number of edges in an undirected simple graph with V vertices?',
    ['V', 'V * (V - 1) / 2', 'V^2', '2^V'],
    'B', 'Every pair of vertices can have at most one undirected edge: (V choose 2) = V * (V - 1) / 2.', 'Graph Properties');
  addQ('dsa', 'trees-graphs', 1, 5,
    'What is the time complexity of searching in a balanced binary search tree with N nodes?',
    ['O(N)', 'O(log N)', 'O(1)', 'O(N log N)'],
    'B', 'Balanced BSTs (AVL, Red-Black) guarantee height h <= c * log N, bounding search operations to O(log N).', 'Tree Complexity');

  // Level 2
  addQ('dsa', 'trees-graphs', 2, 1,
    'How do you detect a cycle in a directed graph using Depth-First Search (DFS)?',
    ['By counting total edges', 'By tracking nodes currently in the recursion stack (visiting state); an edge to an in-stack node is a back-edge indicating a cycle', 'By checking if degree > 2', 'By running in-order traversal'],
    'B', 'A back-edge encountered during DFS pointing to a node currently in the active recursion call stack confirms a directed cycle.', 'Cycle Detection');
  addQ('dsa', 'trees-graphs', 2, 2,
    'What algorithm finds the shortest path between a single source and all other nodes in a graph with non-negative edge weights?',
    ['Floyd-Warshall', 'Dijkstra\'s Algorithm using a min-heap priority queue', 'Kruskal\'s Algorithm', 'Topological Sort'],
    'B', 'Dijkstra’s algorithm greedily expands the closest unvisited node using a min-heap in O((V + E) log V) time.', 'Shortest Path');
  addQ('dsa', 'trees-graphs', 2, 3,
    'When can Topological Sorting be performed on a graph?',
    ['On any undirected graph', 'Exclusively on Directed Acyclic Graphs (DAGs)', 'On graphs with negative cycles', 'On disconnected complete graphs'],
    'B', 'Topological sort linearizes dependencies such that for every directed edge u -> v, u comes before v. Cycles make this impossible.', 'Topological Sort');
  addQ('dsa', 'trees-graphs', 2, 4,
    'How does the Disjoint Set Union (DSU / Union-Find) data structure achieve nearly O(1) amortized operations?',
    ['By balancing AVL trees', 'Using path compression during find and union by rank/size', 'By sorting nodes after every union', 'By using multi-threading'],
    'B', 'Path compression flattens the tree during find(), and union-by-rank keeps tree height minimal, achieving O(alpha(N)) inverse Ackermann complexity.', 'Union-Find');
  addQ('dsa', 'trees-graphs', 2, 5,
    'What is the time complexity of building a heap (heapify) from an unordered array of N elements?',
    ['O(N log N)', 'O(N) linear time', 'O(1)', 'O(N^2)'],
    'B', 'Bottom-up heap construction sums heights across levels: sum of h * (N / 2^(h+1)), mathematically bounding total swaps to O(N).', 'Heapify Bound');

  // Level 3
  addQ('dsa', 'trees-graphs', 3, 1,
    'How does Tarjan\'s or Kosaraju\'s algorithm locate Strongly Connected Components (SCCs) in a directed graph in linear time?',
    ['By running Bellman-Ford V times', 'Using DFS traversal with discovery times and low-link values in O(V + E) time', 'By inverting the adjacency matrix', 'By calculating eigenvalues'],
    'B', 'Tarjan’s algorithm tracks low-link values in a single DFS pass to identify maximal subgraphs where every vertex is reachable from every other.', 'Strongly Connected Components');
  addQ('dsa', 'trees-graphs', 3, 2,
    'In a graph containing negative edge weights without negative cycles, which algorithm correctly finds shortest paths from a single source?',
    ['Dijkstra\'s Algorithm', 'Bellman-Ford Algorithm (relaxing all edges V - 1 times)', 'Prim\'s Algorithm', 'Binary Search'],
    'B', 'Dijkstra fails on negative weights because greedy finalized nodes can be relaxed later. Bellman-Ford handles negative edges in O(V * E).', 'Negative Weight Paths');
  addQ('dsa', 'trees-graphs', 3, 3,
    'What is the Lowest Common Ancestor (LCA) query time in a tree using Binary Lifting after O(N log N) preprocessing?',
    ['O(N)', 'O(log N)', 'O(1)', 'O(N^2)'],
    'B', 'Binary lifting stores 2^k-th ancestors for each node. Queries jump powers of 2 to locate the LCA in O(log N) steps.', 'Binary Lifting LCA');
  addQ('dsa', 'trees-graphs', 3, 4,
    'What theorem governs Maximum Flow and Minimum Cut duality in network flow graphs (Ford-Fulkerson / Dinic)?',
    ['Bayes Theorem', 'The Max-Flow Min-Cut Theorem: the maximum flow passing from source to sink equals the total capacity of edges in the minimum cut', 'Euler\'s Formula', 'Master Theorem'],
    'B', 'The Max-Flow Min-Cut Theorem proves that the bottleneck capacity separating source from sink defines the maximum possible flow.', 'Network Flow Duality');
  addQ('dsa', 'trees-graphs', 3, 5,
    'Why is an A* search heuristic required to be "admissible" to guarantee finding the shortest path?',
    ['It must never underestimate the true cost to reach the goal', 'It must never overestimate the true cost to reach the goal (h(n) <= true_cost)', 'It must always return zero', 'It must equal the Euclidean distance squared'],
    'B', 'An admissible heuristic never overestimates actual remaining cost, ensuring A* will never terminate on a suboptimal path.', 'A* Search Heuristics');

  // Skill 4.3: Dynamic Programming (dynamic-programming)
  // Level 1
  addQ('dsa', 'dynamic-programming', 1, 1,
    'What two fundamental properties must a problem exhibit to be solvable via Dynamic Programming?',
    ['Binary inputs and sorted outputs', 'Optimal substructure and overlapping subproblems', 'Odd length arrays and positive numbers', 'Recursion without base cases'],
    'B', 'Optimal substructure means optimal solutions to subproblems build the global optimum; overlapping subproblems means subproblems re-occur.', 'DP Fundamentals');
  addQ('dsa', 'dynamic-programming', 1, 2,
    'What is the difference between Memoization and Tabulation?',
    ['Memoization is top-down with recursive caching; Tabulation is bottom-up iterative table filling', 'Tabulation uses recursion; Memoization uses loops', 'Memoization is only for sorting', 'They are strictly identical'],
    'A', 'Memoization lazily caches recursive call results. Tabulation iteratively computes subproblems starting from base cases.', 'Memoization vs Tabulation');
  addQ('dsa', 'dynamic-programming', 1, 3,
    'What is the time complexity of computing the N-th Fibonacci number using bottom-up DP with 2 variables?',
    ['O(2^N)', 'O(N) time and O(1) space', 'O(N^2) time', 'O(log N) space'],
    'B', 'Iterative calculation computes F(N) = F(N-1) + F(N-2) in a single loop storing only the last two values in O(1) space.', 'Fibonacci Complexity');
  addQ('dsa', 'dynamic-programming', 1, 4,
    'In the "Climbing Stairs" problem (taking 1 or 2 steps), what recurrence relation defines ways to reach step N?',
    ['ways(N) = ways(N - 1) * ways(N - 2)', 'ways(N) = ways(N - 1) + ways(N - 2)', 'ways(N) = 2 * ways(N - 1)', 'ways(N) = ways(N - 1) - 1'],
    'B', 'Step N can be reached from step N-1 (1 step) or step N-2 (2 steps), matching the Fibonacci recurrence relation.', 'Recurrence Relations');
  addQ('dsa', 'dynamic-programming', 1, 5,
    'What happens to a naive recursive algorithm with overlapping subproblems when memoization is added?',
    ['Time complexity drops from exponential O(2^N) to polynomial/linear by evaluating each state exactly once', 'Space complexity becomes zero', 'The answer becomes approximate', 'Execution requires multi-threading'],
    'A', 'Memoization caches subproblem outputs so subproblems are never re-evaluated, converting exponential trees into DAGs.', 'Complexity Reduction');

  // Level 2
  addQ('dsa', 'dynamic-programming', 2, 1,
    'In the 0/1 Knapsack problem with N items and maximum weight capacity W, what are the state dimensions for tabulation?',
    ['1D array of size N', '2D table dp[i][w] representing max value using a subset of the first i items with capacity w', '3D matrix of size N * W * V', 'A binary tree of height W'],
    'B', 'dp[i][w] records optimal value choosing whether to include or exclude item i given current remaining capacity w.', 'Knapsack Formulation');
  addQ('dsa', 'dynamic-programming', 2, 2,
    'In 0/1 Knapsack, how can the 2D table `dp[N][W]` be optimized to a 1D array of size `W + 1`?',
    ['By iterating the capacity w backwards from W down to item_weight', 'By iterating capacity forwards from 0 to W', 'By multiplying values by 2', 'By skipping odd weights'],
    'A', 'Iterating backwards ensures values from the current item do not overwrite and contaminate states from the previous item.', 'Space Optimization');
  addQ('dsa', 'dynamic-programming', 2, 3,
    'What is the time complexity of finding the Longest Common Subsequence (LCS) between two strings of lengths M and N using DP?',
    ['O(M + N)', 'O(M * N)', 'O(2^(M + N))', 'O(min(M, N))'],
    'B', 'The 2D table compares characters across all prefix pairs: `dp[i][j]` takes O(1) work per cell, yielding O(M * N) total time.', 'LCS Complexity');
  addQ('dsa', 'dynamic-programming', 2, 4,
    'In the "Coin Change" problem asking for the MINIMUM number of coins to make amount A, what is the base case?',
    ['dp[0] = 0, and all other dp[i] = infinity', 'dp[0] = infinity, and all other dp[i] = 0', 'dp[i] = i for all i', 'dp[A] = -1'],
    'A', 'Zero amount requires zero coins (dp[0] = 0). All other amounts are initialized to infinity as minimization targets.', 'Base Case Formulation');
  addQ('dsa', 'dynamic-programming', 2, 5,
    'In the "Longest Increasing Subsequence" (LIS) problem, how can the O(N^2) DP approach be optimized to O(N log N)?',
    ['By sorting the array in reverse', 'Using patience sorting with binary search (`std::lower_bound` / `bisect`) to maintain the tails array', 'Using a hash map', 'Using matrix exponentiation'],
    'B', 'Maintaining the smallest tail of all increasing subsequences of length L allows binary searching the replacement position in O(log N).', 'LIS Optimization');

  // Level 3
  addQ('dsa', 'dynamic-programming', 3, 1,
    'What is the state transition for Matrix Chain Multiplication (MCM) over dimensions array `p` for range `[i, j]`?',
    ['dp[i][j] = dp[i][j-1] + p[i]', 'dp[i][j] = min(dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j]) for all k from i to j-1', 'dp[i][j] = dp[i-1][j-1]', 'dp[i][j] = p[i] * p[j]'],
    'B', 'Interval DP tests every intermediate split point k between i and j, adding the cost of multiplying the two sub-chains.', 'Interval DP');
  addQ('dsa', 'dynamic-programming', 3, 2,
    'In the Traveling Salesperson Problem (TSP) with N <= 20, how does Bitmask DP reduce time complexity from O(N!)?',
    ['To O(N^2 * 2^N) by representing visited cities as an integer bitmask in state `dp[mask][last_city]`', 'To O(N log N) using divide and conquer', 'To O(N^3) using Floyd-Warshall', 'To O(1) using precomputed lookup tables'],
    'A', 'Bitmasking represents subset combinations in a 32-bit integer, eliminating duplicate sub-tours and reducing O(N!) to O(N^2 * 2^N).', 'Bitmask DP');
  addQ('dsa', 'dynamic-programming', 3, 3,
    'What optimization technique reduces 1D DP transitions of the form `dp[i] = min(dp[j] + (x[i] - x[j])^2)` from O(N^2) to O(N)?',
    ['Convex Hull Trick (CHT) or Li Chao Tree', 'QuickSort partitioning', 'Binary tree lifting', 'Gaussian elimination'],
    'A', 'The Convex Hull Trick maintains the lower envelope of linear functions, querying optimal slopes in O(1) or O(log N).', 'Convex Hull Trick');
  addQ('dsa', 'dynamic-programming', 3, 4,
    'How does Digit DP compute the count of integers in range [A, B] satisfying a digit condition in O(log10(B)) time?',
    ['By iterating from A to B sequentially', 'By traversing digits from most to least significant with states `(index, tight_bound_flag, leading_zero_flag, condition_sum)`', 'By converting numbers to binary floating point', 'By factoring into prime numbers'],
    'B', 'Digit DP constructs valid numbers digit by digit. The `tight` flag tracks whether choices are constrained by the upper bound prefix.', 'Digit DP');
  addQ('dsa', 'dynamic-programming', 3, 5,
    'In Tree DP (e.g. Tree Diameter or Maximum Independent Set on trees), in what order must subproblems be evaluated?',
    ['Random order', 'Post-order traversal (bottom-up from leaves to root)', 'Pre-order traversal (root to leaves)', 'Alphabetical by node name'],
    'B', 'Parent node states depend on the aggregated optimal evaluations of their subtrees, requiring post-order leaf-to-root evaluation.', 'Tree DP Order');

  // =========================================================================
  // DOMAIN 5: WEB DEVELOPMENT (web-development)
  // =========================================================================

  // Skill 5.1: HTML, CSS & JavaScript (html-css-javascript)
  // Level 1
  addQ('web-development', 'html-css-javascript', 1, 1,
    'What is the total computed width of an element with `width: 200px`, `padding: 20px`, `border: 5px solid black`, under `box-sizing: content-box`?',
    ['200px', '225px', '250px', '240px'],
    'C', 'content-box adds padding and border to the specified width: 200 + (20 * 2) + (5 * 2) = 250px.', 'CSS Box Model');
  addQ('web-development', 'html-css-javascript', 1, 2,
    'In JavaScript, what is the result of `typeof null`?',
    ['"null"', '"undefined"', '"object"', '"boolean"'],
    'C', '`typeof null === "object"` is a legacy bug in JavaScript from its first 1995 implementation where type tags marked null as an object.', 'JS Types');
  addQ('web-development', 'html-css-javascript', 1, 3,
    'What does event bubbling describe in the DOM event propagation lifecycle?',
    ['Events trigger on the window first, then sink to the target element', 'Events trigger on the innermost target element and bubble upward through parent ancestors to document', 'Events only trigger on hover', 'Events cancel all subsequent clicks'],
    'B', 'Event bubbling dispatches the event from the target element upward through parent node ancestors.', 'Event Propagation');
  addQ('web-development', 'html-css-javascript', 1, 4,
    'Which semantic HTML5 element represents self-contained, independently distributable content like a blog post or news story?',
    ['<div>', '<section>', '<article>', '<aside>'],
    'C', '<article> represents an autonomous piece of content that makes sense on its own outside the page context.', 'Semantic HTML');
  addQ('web-development', 'html-css-javascript', 1, 5,
    'What is the difference between `==` and `===` in JavaScript?',
    ['`==` checks references; `===` checks values', '`==` performs implicit type coercion before comparison; `===` checks both value and type strictly without coercion', '`===` is deprecated in ES6', '`==` is for numbers only'],
    'B', '`==` coerces operand types according to abstract equality algorithms; `===` checks strict identity without conversion.', 'Equality Semantics');

  // Level 2
  addQ('web-development', 'html-css-javascript', 2, 1,
    'Given the asynchronous code snippet, what is the output order logged to the console?',
    ['1, 2, 3, 4', '1, 4, 3, 2', '1, 3, 2, 4', '4, 3, 2, 1'],
    'B', 'Synchronous code runs first (1, 4). Microtasks (Promise then: 3) run before macrotasks (setTimeout: 2).', 'Event Loop Execution',
    'console.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);', 'debugging');
  addQ('web-development', 'html-css-javascript', 2, 2,
    'How does Event Delegation improve performance when managing click events across a list of 10,000 items?',
    ['It creates 10,000 independent event listeners', 'A single event listener attached to the common parent element catches bubbled events, checking `event.target`', 'It disables all mouse clicks', 'It executes clicks in a Web Worker'],
    'B', 'Attaching a single listener to the parent container utilizes event bubbling, saving memory and avoiding 10,000 listener objects.', 'Event Delegation');
  addQ('web-development', 'html-css-javascript', 2, 3,
    'In CSS Grid, what does `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` achieve?',
    ['Forces exactly 3 columns regardless of viewport', 'Creates a responsive multi-column layout wrapping columns automatically without requiring media queries', 'Fixes column widths to 250px and hides overflow', 'Disables flexbox'],
    'B', '`auto-fit` combined with `minmax` expands and contracts columns flexibly, wrapping them cleanly when space is insufficient.', 'CSS Grid Mastery');
  addQ('web-development', 'html-css-javascript', 2, 4,
    'What is a closure in JavaScript?',
    ['A function that has been deleted by the garbage collector', 'A function bundled together with references to its lexical environment, allowing access to outer variables even after the outer function returns', 'A CSS media query boundary', 'A try/catch block'],
    'B', 'Closures retain access to variables in their defining scope even when executed outside that lexical scope.', 'Closures');
  addQ('web-development', 'html-css-javascript', 2, 5,
    'Why does modifying `element.style.top` inside a scroll handler cause severe animation stutter (jank)?',
    ['It alters the font size', 'It forces synchronous layout calculation and repaint (layout thrashing) on the main thread instead of utilizing GPU-composited `transform`', 'Top is unsupported in modern CSS', 'It resets the scroll position to zero'],
    'B', 'Geometric properties (`top`, `left`, `width`) trigger layout and paint reflows. `transform: translate()` operates on the GPU compositor thread.', 'Layout Thrashing');

  // Level 3
  addQ('web-development', 'html-css-javascript', 3, 1,
    'How do microtasks (Promises, MutationObserver, queueMicrotask) interact with the browser rendering pipeline?',
    ['Microtasks execute once per minute', 'The entire microtask queue is drained to completion after every macrotask and before the browser computes style, layout, and paint', 'Microtasks run on background threads', 'Microtasks execute only after repaint'],
    'B', 'The event loop processes all pending microtasks before releasing control to the rendering phase (RAF, style, layout, paint).', 'Event Loop Deep Dive');
  addQ('web-development', 'html-css-javascript', 3, 2,
    'What architectural capability distinguishes Web Workers from the main JavaScript thread?',
    ['Web Workers can access `window` and `document` DOM directly', 'Web Workers run in an isolated operating system thread with no DOM access, communicating exclusively via serialized messages (`postMessage`)', 'Web Workers bypass CORS policies', 'Web Workers execute synchronous database transactions'],
    'B', 'Web Workers execute heavy CPU computation off the main UI thread, preventing dropped animation frames, but have zero direct DOM access.', 'Web Workers');
  addQ('web-development', 'html-css-javascript', 3, 3,
    'What is the difference between `IntersectionObserver` and attaching a `scroll` event listener with `getBoundingClientRect()`?',
    ['IntersectionObserver runs asynchronously off the main thread with zero layout thrashing; scroll handlers force synchronous reflows', 'IntersectionObserver is synchronous and slower', 'Scroll listeners cannot detect elements', 'IntersectionObserver requires jQuery'],
    'A', 'IntersectionObserver delegates intersection calculations to the compositor, alerting the main thread asynchronously without forced reflows.', 'Observer APIs');
  addQ('web-development', 'html-css-javascript', 3, 4,
    'What does the browser do when a script tag has the `defer` attribute vs `async`?',
    ['`defer` downloads in parallel and executes in document order after HTML parsing finishes; `async` downloads in parallel and executes immediately upon arrival, pausing parsing', '`defer` blocks HTML parsing completely', '`async` waits for DOMContentLoaded', 'They are strictly identical'],
    'A', '`defer` preserves execution order and waits for DOM parsing to finish. `async` executes immediately once downloaded, regardless of order.', 'Script Loading Optimization');
  addQ('web-development', 'html-css-javascript', 3, 5,
    'How does memory leak diagnosis via Chrome DevTools Heap Snapshots identify detached DOM nodes?',
    ['By checking disk space', 'By locating DOM nodes that have no parent in the document tree but remain referenced by an active JavaScript closure or global array', 'By measuring battery consumption', 'By reloading the browser tab'],
    'B', 'Detached DOM trees occur when elements are removed from the page but retained in memory by lingering event listeners or variable references.', 'Memory Leak Profiling');

  // Skill 5.2: React (react)
  // Level 1
  addQ('web-development', 'react', 1, 1,
    'In React, why must you never mutate state directly like `state.count = 5`?',
    ['JavaScript syntax prohibits it', 'React compares object references; direct mutations do not change reference identity and fail to trigger re-renders', 'It causes the browser to close', 'It converts state into an HTML string'],
    'B', 'React schedules renders based on shallow state reference changes. Direct mutation bypasses setter reconciliation and drops updates.', 'State Immutability');
  addQ('web-development', 'react', 1, 2,
    'What is the purpose of the `key` prop when rendering a dynamic list in React?',
    ['It styles the element with CSS', 'It gives React a persistent identity for each item to efficiently reconcile additions, removals, and reorderings', 'It is passed as an HTML attribute to the DOM', 'It encrypts component data'],
    'B', 'Keys give elements a stable identity across renders, allowing React’s diffing algorithm to reuse DOM nodes instead of re-creating them.', 'React Keys');
  addQ('web-development', 'react', 1, 3,
    'When does the cleanup function returned from `useEffect` execute?',
    ['Only when the application closes', 'Before the component unmounts and prior to running the effect on subsequent dependency re-renders', 'After the page refreshes', 'Synchronously before initial paint'],
    'B', 'Effect cleanups execute before re-running the effect with new dependencies and when the component unmounts.', 'Effect Lifecycle');
  addQ('web-development', 'react', 1, 4,
    'What hook is used to retain a mutable value across renders without triggering a re-render when the value changes?',
    ['useState', 'useRef', 'useEffect', 'useMemo'],
    'B', '`useRef` returns a persistent object whose `.current` property can be mutated without causing component re-render.', 'useRef');
  addQ('web-development', 'react', 1, 5,
    'What is the "rules of hooks" restriction regarding where hooks may be invoked?',
    ['Hooks can be called inside for loops and if conditions', 'Hooks must only be called at the top level of React function components or custom hooks, never inside conditionals or loops', 'Hooks can only be called in class components', 'Hooks must be called inside event listeners'],
    'B', 'React relies on call order across renders to associate internal state with hooks; conditional calls break hook order.', 'Rules of Hooks');

  // Level 2
  addQ('web-development', 'react', 2, 1,
    'Review the component below. Why does this create an infinite re-render loop?',
    ['useEffect has a missing dependency array; setting state inside triggers a re-render which immediately invokes the effect again', 'fetchData is asynchronous', 'useState is initialized to null', 'Component is missing keys'],
    'A', 'Without a dependency array `[]`, useEffect runs after every render. Since it calls `setData`, it triggers an infinite re-render loop.', 'Infinite Loop Bug',
    'function UserProfile() {\n  const [data, setData] = useState(null);\n  useEffect(() => {\n    fetchData().then(d => setData(d));\n  });\n  return <div>{data?.name}</div>;\n}', 'debugging');
  addQ('web-development', 'react', 2, 2,
    'How does `useCallback(fn, deps)` optimize child component rendering when passed as a prop?',
    ['It executes the function in a background thread', 'It returns a memoized function reference that only changes when dependencies change, preventing child re-renders when paired with `React.memo`', 'It converts the function into an arrow function', 'It makes the function asynchronous'],
    'B', 'Without `useCallback`, inline functions create fresh memory references on every render, causing memoized children to re-render.', 'useCallback Optimization');
  addQ('web-development', 'react', 2, 3,
    'Why is using array index as `key` (`<li key={index}>`) harmful when list items can be filtered, reordered, or deleted?',
    ['It throws a runtime syntax error', 'Reordering changes index associations, causing React to mismatch component state and reuse incorrect DOM nodes', 'It slows down CSS transitions', 'It duplicates DOM nodes'],
    'B', 'Indices change when items shift. React assumes index 0 is the same element, transferring internal state (like input text) to the wrong item.', 'Key Anti-Pattern');
  addQ('web-development', 'react', 2, 4,
    'What occurs when multiple state updates are called within the same event handler in React 18?',
    ['React renders after each individual update', 'React automatically batches them into a single re-render, optimizing performance', 'React drops all updates except the last one', 'It triggers a warning in the console'],
    'B', 'React 18 introduces automatic batching across event handlers, promises, and timeouts, grouping updates into one single render pass.', 'Automatic Batching');
  addQ('web-development', 'react', 2, 5,
    'How does `useMemo` prevent expensive calculations from degrading UI responsiveness?',
    ['By running the calculation on a remote server', 'By caching the computed result and recomputing only when specified dependencies change', 'By converting numbers to strings', 'By compiling the code to WebAssembly'],
    'B', '`useMemo` caches calculation results between renders, skipping re-computation when dependency references remain identical.', 'useMemo Usage');

  // Level 3
  addQ('web-development', 'react', 3, 1,
    'How does React\'s concurrent renderer and `useTransition` prevent user input lag during heavy screen updates?',
    ['By executing updates in Web Workers', 'By marking state updates as non-urgent transitions, allowing urgent interactions (typing, clicks) to interrupt and yield the main thread', 'By dropping background DOM elements', 'By compiling JSX to pure HTML'],
    'B', '`startTransition` marks state updates as interruptible. High-priority browser events pause transition renders to keep inputs fluid.', 'Concurrent Rendering');
  addQ('web-development', 'react', 3, 2,
    'Why does putting large context state objects into a single `useContext` provider cause performance degradation across large component trees?',
    ['Context has a limit of 10 items', 'Any change to any property in the context value forces every consuming component to re-render, even if they only need an untouched field', 'Context cannot store functions', 'Context blocks network requests'],
    'B', 'Context consumers re-render whenever the context provider value reference changes. Splitting contexts or selector patterns solves this.', 'Context Performance');
  addQ('web-development', 'react', 3, 3,
    'What role do Error Boundaries play in React component architecture?',
    ['They catch compilation syntax errors', 'They catch JavaScript runtime errors in child component rendering, lifecycle methods, and constructors, displaying a fallback UI instead of crashing the entire app tree', 'They automatically fix broken API calls', 'They intercept 404 HTTP requests'],
    'B', 'Error Boundaries prevent a component rendering crash from unmounting the entire application root.', 'Error Boundaries');
  addQ('web-development', 'react', 3, 4,
    'What is the purpose of React Suspense in data fetching architectures (e.g. Next.js App Router / React Server Components)?',
    ['To delay page load until user clicks', 'To coordinate asynchronous resource loading declaratively by rendering fallback boundaries until promises resolve', 'To pause CSS animations', 'To throttle database queries'],
    'B', 'Suspense enables declarative asynchronous boundaries, rendering fallback skeletons while data streams in from server components or queries.', 'React Suspense');
  addQ('web-development', 'react', 3, 5,
    'How does the React Compiler (React Forget) fundamentally change how developers write memoization?',
    ['It eliminates React components completely', 'It automatically analyzes JavaScript AST semantics and injects fine-grained memoization, eliminating manual `useMemo`, `useCallback`, and `React.memo`', 'It forces all components to be classes', 'It requires writing TypeScript interfaces for every variable'],
    'B', 'The React Compiler automatically memoizes values and component blocks at compile time, guaranteeing optimal re-renders without manual hooks.', 'React Compiler');

  // Skill 5.3: Backend & REST APIs (backend-rest-apis)
  // Level 1
  addQ('web-development', 'backend-rest-apis', 1, 1,
    'Which HTTP method is intended to be idempotent and safe, retrieving resource representations without mutating server state?',
    ['POST', 'GET', 'DELETE', 'PATCH'],
    'B', 'GET requests must be safe and idempotent, retrieving data without producing side-effects on the target resource.', 'HTTP Verbs');
  addQ('web-development', 'backend-rest-apis', 1, 2,
    'What HTTP status code represents an unauthorized request due to missing or invalid authentication credentials?',
    ['200 OK', '401 Unauthorized', '404 Not Found', '500 Internal Server Error'],
    'B', '401 Unauthorized indicates that the client request lacks valid authentication credentials for the target resource.', 'HTTP Status Codes');
  addQ('web-development', 'backend-rest-apis', 1, 3,
    'In Express.js, which middleware function parses incoming JSON request payloads into `req.body`?',
    ['express.static()', 'express.json()', 'express.urlencoded()', 'express.router()'],
    'B', '`express.json()` inspects incoming requests with Content-Type application/json and parses the stream into req.body.', 'Express Middleware');
  addQ('web-development', 'backend-rest-apis', 1, 4,
    'What is the difference between `PUT` and `PATCH` in RESTful API design?',
    ['PUT is for creating; PATCH is for deleting', 'PUT replaces the entire resource representation; PATCH applies partial modifications to specified fields', 'PATCH is safe and idempotent; PUT is not', 'PUT only works with XML'],
    'B', 'PUT replaces the complete resource entity; PATCH applies delta updates modifying only the provided fields.', 'REST Conventions');
  addQ('web-development', 'backend-rest-apis', 1, 5,
    'What HTTP header transmits a bearer authentication token in protected API requests?',
    ['Authentication: Token <jwt>', 'Authorization: Bearer <token>', 'Token: <jwt>', 'Security-Bearer: <token>'],
    'B', 'RFC 6750 specifies transmitting bearer credentials using the `Authorization: Bearer <token>` header format.', 'Auth Headers');

  // Level 2
  addQ('web-development', 'backend-rest-apis', 2, 1,
    'Review the Express route below. Why does the server hang and never respond to the client when an error occurs?',
    ['res.json() is called with wrong parameters', 'The catch block does not call `next(err)` or return an error response, leaving the HTTP socket open and pending', 'async/await is not supported in Express', 'Status 500 is prohibited'],
    'B', 'If an asynchronous error occurs and the catch block does not send a response or call `next(err)`, Express leaves the connection hanging.', 'Error Handling Hang',
    'app.get("/api/data", async (req, res, next) => {\n  try {\n    const data = await queryDatabase();\n    res.status(200).json(data);\n  } catch (err) {\n    console.error(err);\n  }\n});', 'debugging');
  addQ('web-development', 'backend-rest-apis', 2, 2,
    'How should CORS be configured on an Express API serving credentials to a frontend origin at `http://localhost:5173`?',
    ['Set `Access-Control-Allow-Origin: *` with credentials enabled', 'Set explicit origin `http://localhost:5173` and `credentials: true`', 'Disable all headers', 'Use POST requests only'],
    'B', 'Browsers reject responses combining wildcard `*` origins with credentials: true. Explicit origins are required.', 'CORS Security');
  addQ('web-development', 'backend-rest-apis', 2, 3,
    'What is the purpose of an Idempotency-Key header in payment and order processing APIs?',
    ['To encrypt card numbers', 'To ensure that network retries of a POST request do not accidentally process duplicate payments or transactions', 'To increase database connection pool limits', 'To sign JWT tokens'],
    'B', 'Idempotency keys allow servers to recognize retried requests and return cached responses without executing duplicate mutations.', 'Idempotency');
  addQ('web-development', 'backend-rest-apis', 2, 4,
    'What is the difference between authentication and authorization in backend middleware?',
    ['Authentication verifies WHO the client is; Authorization determines WHAT resources that client is permitted to access', 'Authorization happens before authentication', 'Authentication is only for passwords', 'They are synonyms'],
    'A', 'Authentication validates identity (e.g. verifying JWT signature); Authorization verifies permissions and roles.', 'Auth Architecture');
  addQ('web-development', 'backend-rest-apis', 2, 5,
    'Why is centralized error-handling middleware (`(err, req, res, next) => {}`) placed at the very end of the Express middleware stack?',
    ['To format JSON responses', 'Express identifies 4-argument functions as error handlers; placing them last allows any preceding route or middleware to forward errors via `next(err)`', 'To speed up server startup', 'Because JavaScript executes backwards'],
    'B', '4-argument error handlers must be declared after all route handlers so unhandled route errors cascade down into them.', 'Middleware Ordering');

  // Level 3
  addQ('web-development', 'backend-rest-apis', 3, 1,
    'What algorithm implements token bucket or leaky bucket rate limiting for high-throughput APIs using Redis?',
    ['Bubble sort on user IDs', 'Atomic Redis Lua script checking and decrementing token balance with timestamp-based replenishment in O(1)', 'Reading all records into memory', 'TCP sequence verification'],
    'B', 'Atomic Redis scripts evaluate token counts and refill rates in a single atomic transaction without concurrency race conditions.', 'Rate Limiting');
  addQ('web-development', 'backend-rest-apis', 3, 2,
    'In designing a graceful shutdown sequence for an Express Node.js process upon SIGTERM:',
    ['Immediately call `process.exit(0)`', 'Stop accepting new connections via `server.close()`, wait for active in-flight HTTP requests to finish, drain database pools, then exit', 'Kill the database process', 'Send 500 errors to all clients immediately'],
    'B', 'Graceful shutdown stops receiving incoming connections while allowing ongoing requests to complete before closing database sockets.', 'Graceful Shutdown');
  addQ('web-development', 'backend-rest-apis', 3, 3,
    'What is the N+1 query problem in relational ORM API endpoints, and how is it eliminated?',
    ['Querying 1 record takes N seconds; fixed by adding indexes', 'Loading a parent record then firing N separate SQL queries for each child relation; fixed via eager loading (`JOIN` or batch `WHERE IN (...)`)', 'A query has N syntax errors', 'The database has N duplicate rows'],
    'B', 'N+1 queries fire separate roundtrips per child. Batching or eager joins consolidate child retrieval into a single query.', 'N+1 Problem');
  addQ('web-development', 'backend-rest-apis', 3, 4,
    'How does circuit breaking (e.g., Cockatiel / Opossum) protect backend microservices during third-party dependency outages?',
    ['By increasing timeout thresholds to 10 minutes', 'By tripping to "open" after consecutive failures, fast-failing downstream calls immediately and preventing thread/connection pool exhaustion', 'By rebooting the server', 'By retrying infinitely every millisecond'],
    'B', 'Circuit breakers prevent cascading system failure by short-circuiting calls to failing services and giving them time to recover.', 'Circuit Breaker Pattern');
  addQ('web-development', 'backend-rest-apis', 3, 5,
    'What is the primary advantage of gRPC / Protocol Buffers over REST / JSON for internal service-to-service communication?',
    ['gRPC is written in Python', 'Binary serialization, strong schema typing, multiplexed HTTP/2 streams, and up to 7x faster throughput with smaller payloads', 'gRPC runs directly in web browsers without proxies', 'Protocol Buffers eliminate all networking errors'],
    'B', 'Protobuf binary serialization is far faster and more compact than textual JSON, while HTTP/2 eliminates connection handshake overhead.', 'Protocols Architecture');

  return bank;
}

import { buildSupplementaryQuestions } from './knowledgeQuestionBankPart2';

// Singleton question bank instance containing all questions for all 45 configurations
const questionBank: KnowledgeQuestion[] = [
  ...buildQuestionBank(),
  ...buildSupplementaryQuestions(),
];

/**
 * Retrieve questions tailored for a specific domain, skill, and level.
 */
export function getQuestionsForConfig(
  domainId: string,
  skillId: string,
  levelNumber: number
): KnowledgeQuestion[] {
  const normDomain = domainId.toLowerCase().trim();
  const normSkill = skillId.toLowerCase().trim();
  const normLevel = Number(levelNumber) || 1;

  const matched = questionBank.filter(
    (q) =>
      (q.domainId.toLowerCase() === normDomain || normDomain.includes(q.domainId.toLowerCase())) &&
      (q.skillId.toLowerCase() === normSkill || normSkill.includes(q.skillId.toLowerCase())) &&
      q.levelNumber === normLevel
  );

  if (matched.length > 0) {
    return matched;
  }

  // Fallback match on skill and level
  const fallbackSkill = questionBank.filter(
    (q) =>
      q.skillId.toLowerCase() === normSkill &&
      q.levelNumber === normLevel
  );
  if (fallbackSkill.length > 0) {
    return fallbackSkill;
  }

  // Fallback to domain and level
  const fallbackDomain = questionBank.filter(
    (q) =>
      q.domainId.toLowerCase() === normDomain &&
      q.levelNumber === normLevel
  );
  if (fallbackDomain.length > 0) {
    return fallbackDomain.slice(0, 5);
  }

  // Default fallback
  return questionBank.slice(0, 5);
}

/**
 * Return all questions in the bank
 */
export function getAllQuestions(): KnowledgeQuestion[] {
  return questionBank;
}
