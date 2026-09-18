export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  handle: string;
  accreditationStatus: string;
  reProofScore: number;
  completedProofs: number;
  activeDomain: string;
}

export interface CompetencyLevelItem {
  id: string;
  levelNumber: number; // 1, 2, 3
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
}

export interface SkillItem {
  id: string;
  domainId: string;
  name: string;
  slug: string;
  description: string;
  levels: CompetencyLevelItem[];
}

export interface DomainItem {
  id: string;
  code: string;
  name: string;
  slug: string;
  description: string;
  subtopics: string;
  status: 'Ready' | 'In Progress' | 'Verified';
  selected?: boolean;
  skills?: SkillItem[];
}

export interface AssessmentCriterion {
  id: string;
  num: string;
  title: string;
  summary: string;
  verifiableTarget: string;
  badgeLabel: string;
}

export interface AssessmentItem {
  id: string;
  protocolRef: string;
  domainName: string;
  track: string;
  title: string;
  severity: string;
  synopsis: string;
  estimatedDuration: string;
  isolationMode: string;
  topology: Array<{
    code: string;
    name: string;
    description: string;
  }>;
  criteria: AssessmentCriterion[];
}

export interface FileChangeItem {
  name: string;
  added: number;
  deleted: number;
}

export interface SubmissionDetails {
  id: string;
  protocolRef: string;
  taskIdent: string;
  commitHash: string;
  branch: string;
  totalLinesChanged: number;
  files: FileChangeItem[];
  diffExcerpt: {
    file: string;
    range: string;
    lines: Array<{ type: 'del' | 'add' | 'context'; text: string }>;
  };
  testResults: {
    passed: number;
    failed: number;
    suites: number;
    items: Array<{ name: string; description: string; duration: string }>;
  };
}

export interface CompetencyLevelAudit {
  id: string;
  num: string;
  criterionTitle: string;
  demonstratedLevel: number;
  levelLabel: string;
  status: 'Demonstrated' | 'Gap Isolated' | 'Proficient';
  evidenceArtifact: string;
  rubricFinding: string;
}

export interface SkillGapReport {
  assessmentId: string;
  protocolRef: string;
  auditRecord: string;
  rubricVersion: string;
  competencies: CompetencyLevelAudit[];
  remediationQueue: Array<{
    id: string;
    title: string;
    gapDescription: string;
    actionLabel: string;
    estimatedMinutes: number;
  }>;
}

export interface PracticeExercise {
  id: string;
  title: string;
  domain: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  topic: string;
  description: string;
  taskGoal: string;
  completed: boolean;
}

export interface ChangedConditionSpec {
  id: string;
  assessmentId: string;
  originalBaseline: string;
  changedRule: string;
  conditionType: 'concurrency' | 'latency' | 'scale' | 'memory' | 'schema';
  scenarioNarrative: string;
  constraints: string[];
  expectedAdaptation: string;
}

export interface ReProofVerification {
  id: string;
  assessmentId: string;
  submissionId: string;
  status: 'verified' | 'in_progress' | 'needs_work';
  scoreDelta: number;
  finalScore: number;
  proofHash: string;
  verifiedAt: string;
  adaptabilityIndex: number;
  proofCertificateId: string;
  badgeLevel: string;
}
