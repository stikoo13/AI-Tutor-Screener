// All questions are pre-scripted — no LLM needed

export const PHASE1_QUESTIONS = [
  {
    id: 'p1q1',
    question: "Hi! I'm Maya, your interviewer from Cuemath. Welcome! Could you start by telling me a little about yourself and why you want to teach math to children?",
    followUp: "That's interesting! Could you share a specific moment or experience that made you want to become a tutor?",
    keywords: ['teach','student','math','learning','passion','kids','children','experience']
  },
  {
    id: 'p1q2',
    question: "Great! Next question — how would you explain fractions to a 9-year-old who has never heard the word before?",
    followUp: "Nice approach! Can you give me a real-life example you'd use to make it even more relatable for a child?",
    keywords: ['pizza','pie','equal','parts','divide','example','simple','slice','half']
  },
  {
    id: 'p1q3',
    question: "Imagine a student has been staring at the same problem for 5 minutes and says they just don't understand. Walk me through exactly what you'd do.",
    followUp: "And if they still don't get it after that — what's your next move?",
    keywords: ['patient','break','simple','step','encourage','ask','help','different','way']
  },
  {
    id: 'p1q4',
    question: "Last question for this phase — in your opinion, what makes someone a great math tutor, specifically for kids? Not just a good teacher, but truly great.",
    followUp: "Excellent! Is there a quality you personally feel you're still developing as a tutor?",
    keywords: ['patient','fun','simple','connect','relate','care','explain','understand','kind']
  }
]

export const GOOD_STUDENT_SCRIPT = [
  { speaker:'student', text:"Hi! Are you my new math teacher? I'm Aryan! What are we going to learn today?", waitForTutor: true },
  { speaker:'student', text:"Ooh okay! But wait — why do we even need to learn this? Like, when will I use it in real life?", waitForTutor: true },
  { speaker:'student', text:"Oh! So it's kind of like... dividing a pizza into equal slices? That's actually really cool! But how do you know which fraction is bigger — like, is one-half bigger than one-third?", waitForTutor: true },
  { speaker:'student', text:"Ohh I think I get it now! So the smaller the bottom number, the bigger the pieces? Let me try one — is three-fourths bigger than two-thirds?", waitForTutor: true },
]

export const BAD_STUDENT_SCRIPT = [
  { speaker:'student', text:"Ugh, do we HAVE to do math? My mom says calculators exist for a reason.", waitForTutor: true },
  { speaker:'student', text:"I don't get it. I don't get ANY of it. It's all just numbers and it makes no sense.", waitForTutor: true },
  { speaker:'student', text:"Wait, you said something about pizza. Is the answer just... pizza? I'm hungry.", waitForTutor: true },
  { speaker:'student', text:"I still don't get it. Can you just tell me the answer? My friend just tells me the answer and I learn better that way.", waitForTutor: true },
  { speaker:'student', text:"Fine. I'll try. Is one-half bigger than one-fourth? Wait no — I already forgot what you said. Can you say it again?", waitForTutor: true },
]

export const QUIZ_QUESTIONS = [
  {
    id:1, points:10,
    question:"A student says 'I don't understand fractions at all.' What's your FIRST response as a tutor?",
    options:[
      "Re-read the textbook definition to them",
      "Ask what part confuses them, then use a real-life example",
      "Tell them fractions are easy and they just need to practice",
      "Give them extra homework to practice"
    ],
    correct:1,
    explanation:"Diagnosing confusion first, then using relatable examples, is the most effective approach before reteaching."
  },
  {
    id:2, points:15,
    question:"Which analogy works BEST for explaining fractions to a 9-year-old for the first time?",
    options:[
      "A number line with decimal equivalents",
      "The formal mathematical ratio definition",
      "Cutting a pizza or chocolate bar into equal pieces",
      "A table of equivalent fraction values"
    ],
    correct:2,
    explanation:"Concrete, familiar objects make abstract concepts tangible — the cornerstone of teaching young learners."
  },
  {
    id:3, points:20,
    question:"A student has been off-task for 5 minutes. The most effective re-engagement strategy is:",
    options:[
      "Raise your voice to get their attention immediately",
      "Continue teaching and hope they refocus on their own",
      "Connect the topic to something the student personally finds interesting",
      "Give them a time-out from the session"
    ],
    correct:2,
    explanation:"Connecting content to personal interests is consistently the most effective re-engagement technique for children."
  },
  {
    id:4, points:25,
    question:"A student gives a wrong answer but is very confident. The best Cuemath tutor response is to:",
    options:[
      "Directly say 'That's wrong' and give the correct answer",
      "Say 'Interesting!' and move on without addressing it",
      "Guide them with questions to discover the error themselves",
      "Mark it wrong and explain only at the end of the session"
    ],
    correct:2,
    explanation:"Socratic questioning preserves confidence while building critical thinking — the gold standard in tutoring."
  },
  {
    id:5, points:30,
    question:"What is the single most important quality a Cuemath tutor must have?",
    options:[
      "Speed — solving complex problems quickly to impress students",
      "Patience and the ability to meet the child exactly where they are",
      "Perfect English grammar and highly formal language",
      "Strict adherence to curriculum without any deviation"
    ],
    correct:1,
    explanation:"For K-12 tutoring, emotional intelligence and adaptability consistently outperform technical speed and formality."
  }
]

// Simple keyword scoring (no LLM)
export function scoreResponse(response, question) {
  if (!response || response.length < 10) return 0
  const lower = response.toLowerCase()
  const hits = question.keywords.filter(k => lower.includes(k)).length
  const lengthScore = Math.min(response.split(' ').length / 30, 1) // longer = better, up to 30 words
  return Math.min(Math.round((hits / question.keywords.length) * 6 + lengthScore * 4), 10)
}

// Check if answer is too short (trigger follow-up)
export function isTooShort(text) {
  return !text || text.trim().split(' ').length < 8
}