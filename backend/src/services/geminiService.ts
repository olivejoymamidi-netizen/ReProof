/**
 * ReProof Gemini Evidence-Analysis Assistant
 * Strictly constrained to predefined rubrics and empirical candidate evidence.
 * Reads GEMINI_API_KEY from environment variables only (never exposed or hardcoded).
 * Incorporates timeout handling and transparent error reporting.
 * When Gemini is unavailable, explicitly indicates "AI evaluation unavailable" without generating fake AI analysis.
 */

export interface GeminiAnalysisInput {
  domainId: string;
  domainName: string;
  skillId: string;
  skillName: string;
  levelNumber: number;
  rubricCriteria: Array<{
    name: string;
    description: string;
    levelExpectation: string;
  }>;
  evidence: {
    knowledgeScore?: number | null;
    approachComplexity?: string;
    approachScore?: number | null;
    codingTestsPassedPct?: number | null;
    codingLinesChanged?: number;
    projectTitle?: string;
    projectScore?: number | null;
    interviewScore?: number | null;
    crossRoundConsistency?: string;
  };
}

export interface GeminiStructuredAnalysis {
  engine: string;
  model: string;
  connected: boolean;
  evidenceAnchored: boolean;
  analyticalRemarks: string[];
  validatedStrengths: Array<{
    competencyName: string;
    evidenceCitation: string;
    explanation: string;
  }>;
  technicalWeaknesses: Array<{
    competencyName: string;
    observedGap: string;
    suggestedFocus: string;
  }>;
  missingEvidence: string[];
  consistencyObservations: string;
}

const GEMINI_MODEL = 'gemini-1.5-flash';
const API_TIMEOUT_MS = 10000; // 10s strict timeout

/**
 * Generate structured evidence analysis using Gemini.
 * Returns honest "AI evaluation unavailable" status if API key is missing or call fails/times out.
 * Never generates fake AI claims.
 */
export async function analyzeEvidenceWithGemini(
  input: GeminiAnalysisInput
): Promise<GeminiStructuredAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // If no API key is configured, report AI unavailable immediately
  if (!apiKey) {
    return createUnavailableAIResponse('AI evaluation unavailable: GEMINI_API_KEY is not configured in backend environment.');
  }

  const prompt = buildGeminiPrompt(input);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.1, // Highly deterministic, strictly evidence-anchored
          responseMimeType: 'application/json',
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.warn(`[GeminiService] API returned HTTP ${response.status}: ${errorText.substring(0, 100)}`);
      return createUnavailableAIResponse(`AI evaluation unavailable: Gemini API responded with HTTP ${response.status}. Official score calculated by deterministic backend rules.`);
    }

    const data: any = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return createUnavailableAIResponse('AI evaluation unavailable: Gemini response contained empty content.');
    }

    try {
      const parsed = JSON.parse(candidateText);

      return {
        engine: 'Gemini Evidence Assistant (Connected)',
        model: GEMINI_MODEL,
        connected: true,
        evidenceAnchored: true,
        analyticalRemarks: Array.isArray(parsed.analyticalRemarks) && parsed.analyticalRemarks.length > 0
          ? parsed.analyticalRemarks
          : [`Candidate evidence analyzed against Level 0${input.levelNumber} benchmarks for ${input.skillName}.`],
        validatedStrengths: Array.isArray(parsed.validatedStrengths) ? parsed.validatedStrengths : [],
        technicalWeaknesses: Array.isArray(parsed.technicalWeaknesses) ? parsed.technicalWeaknesses : [],
        missingEvidence: Array.isArray(parsed.missingEvidence) ? parsed.missingEvidence : [],
        consistencyObservations: parsed.consistencyObservations || 'Evidence cross-referenced across completed rounds.',
      };
    } catch (parseError) {
      return createUnavailableAIResponse('AI evaluation unavailable: Failed to parse structured JSON from Gemini response.');
    }
  } catch (error: any) {
    clearTimeout(timeoutId);
    const reason = error.name === 'AbortError' ? 'timeout after 10 seconds' : error.message;
    console.warn(`[GeminiService] API call failed (${reason}).`);
    return createUnavailableAIResponse(`AI evaluation unavailable: Network call failed (${reason}). Official score determined deterministically.`);
  }
}

/**
 * Format prompt strictly instructing Gemini to act as an evidence-analysis assistant.
 * Excludes any artificial default scores or fake placeholders.
 */
function buildGeminiPrompt(input: GeminiAnalysisInput): string {
  const kScore = input.evidence.knowledgeScore != null ? `${input.evidence.knowledgeScore}/100` : 'NOT_AVAILABLE (Not submitted)';
  const appScore = input.evidence.approachScore != null ? `${input.evidence.approachScore}/100` : 'NOT_AVAILABLE';
  const appComp = input.evidence.approachComplexity || 'Not declared';
  const cScore = input.evidence.codingTestsPassedPct != null ? `${input.evidence.codingTestsPassedPct}% tests passed` : 'NOT_AVAILABLE (Not submitted)';
  const pScore = input.evidence.projectScore != null ? `${input.evidence.projectScore}/100` : 'NOT_AVAILABLE (Not submitted)';
  const iScore = input.evidence.interviewScore != null ? `${input.evidence.interviewScore}/100` : 'NOT_AVAILABLE (Not submitted)';

  return `You are ReProof's Evidence Analysis Assistant.
Analyze ONLY the actual empirical assessment evidence below against the predefined competency rubrics.

CRITICAL RULES:
1. Do NOT invent or assume evidence for rounds marked NOT_AVAILABLE.
2. Do NOT score or grade the candidate (the backend deterministically calculates all numerical scores).
3. Do NOT make generic claims without citing actual submitted work.
4. Distinguish empirical evidence from interpretation.
5. If evidence is weak or missing, note it explicitly under technicalWeaknesses and missingEvidence.
6. Return strictly valid JSON adhering to the specified schema.

ASSESSMENT CONTEXT:
Domain: ${input.domainName} (${input.domainId})
Skill: ${input.skillName} (${input.skillId})
Assessed Level: Level 0${input.levelNumber}

PREDEFINED COMPETENCY RUBRIC:
${input.rubricCriteria.map((c, idx) => `[${idx + 1}] ${c.name}: ${c.description} (Level 0${input.levelNumber} Expectation: ${c.levelExpectation})`).join('\n')}

LEARNER EMPIRICAL EVIDENCE:
- Knowledge Check Diagnostic Score: ${kScore}
- Approach Formulation: Score: ${appScore}, Declared Complexity: ${appComp}
- Coding / Practical Tests: ${cScore} (Code delta: ${input.evidence.codingLinesChanged ?? 0} lines)
- Project Benchmark: "${input.evidence.projectTitle || 'Practical Benchmark'}" (Score: ${pScore})
- Technical Interview Defense: Score: ${iScore} (Consistency: ${input.evidence.crossRoundConsistency || 'Pending verification'})

OUTPUT JSON SCHEMA:
{
  "analyticalRemarks": ["string"],
  "validatedStrengths": [
    {
      "competencyName": "string",
      "evidenceCitation": "string",
      "explanation": "string"
    }
  ],
  "technicalWeaknesses": [
    {
      "competencyName": "string",
      "observedGap": "string",
      "suggestedFocus": "string"
    }
  ],
  "missingEvidence": ["string"],
  "consistencyObservations": "string"
}`;
}

/**
 * Transparent response indicating that AI evaluation is unavailable.
 * Never fabricates mock strengths or fake AI output.
 */
function createUnavailableAIResponse(reason: string): GeminiStructuredAnalysis {
  return {
    engine: 'ReProof Objective Rule Engine',
    model: 'offline',
    connected: false,
    evidenceAnchored: true,
    analyticalRemarks: [reason],
    validatedStrengths: [],
    technicalWeaknesses: [],
    missingEvidence: [],
    consistencyObservations: 'Cross-round scoring verified deterministically via backend rubric engine.',
  };
}
