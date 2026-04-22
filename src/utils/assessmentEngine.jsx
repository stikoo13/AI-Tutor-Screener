import { scoreResponse, PHASE1_QUESTIONS } from './interviewScript'

export function generateAssessment(p1Answers, quizScore, quizTotal) {
  // Score each phase 1 answer
  const dimScores = {
    communication_clarity:   0,
    warmth_empathy:          0,
    simplification_ability:  0,
    patience:                0,
    english_fluency:         0,
    teaching_methodology:    0
  }

  if (p1Answers.length >= 1) dimScores.communication_clarity   = scoreResponse(p1Answers[0], PHASE1_QUESTIONS[0])
  if (p1Answers.length >= 2) dimScores.simplification_ability  = scoreResponse(p1Answers[1], PHASE1_QUESTIONS[1])
  if (p1Answers.length >= 3) dimScores.patience                = scoreResponse(p1Answers[2], PHASE1_QUESTIONS[2])
  if (p1Answers.length >= 4) dimScores.teaching_methodology    = scoreResponse(p1Answers[3], PHASE1_QUESTIONS[3])

  // Warmth & fluency — derived from avg length + variety of answers
  const avgLen = p1Answers.reduce((s,a)=>s+(a?.split(' ')?.length||0), 0) / Math.max(p1Answers.length, 1)
  dimScores.warmth_empathy   = Math.min(Math.round(avgLen / 5), 10)
  dimScores.english_fluency  = Math.min(Math.round(avgLen / 4), 10)

  const vals = Object.values(dimScores)
  const overall = vals.reduce((a,b)=>a+b,0) / vals.length
  const quizPct = quizTotal > 0 ? (quizScore / quizTotal) * 100 : 0
  const finalScore = overall * 0.7 + (quizPct / 10) * 0.3

  const verdict = finalScore >= 6.5 ? 'HIRE' : finalScore >= 5 ? 'MAYBE' : 'REJECT'

  return { scores: dimScores, overall_score: +finalScore.toFixed(1), verdict, quizPct }
}