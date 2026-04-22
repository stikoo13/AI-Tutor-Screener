import React, { useState, useRef, useCallback } from 'react'
import { speakText, askMaya } from '../utils/groqService'
import { QUIZ_QUESTIONS } from '../utils/interviewScript'
import { generateAssessment } from '../utils/assessmentEngine'
import PhaseHeader from './PhaseHeader'
import VoiceOrb    from './VoiceOrb'
import QuizPhase   from './QuizPhase'
import FinalReport from './FinalReport'
import Transcript  from './Transcript'

const SR = window.SpeechRecognition || window.webkitSpeechRecognition

const MAYA_SYSTEM = `You are Maya, a warm but professional AI interviewer for Cuemath, screening candidates who want to become math tutors for K-12 students.
Your job is to conduct a structured interview across these topics (in order):
1. Why they want to teach math to children
2. Their teaching experience or background
3. How they handle a student who is struggling or frustrated
4. Their approach to making math fun and engaging
5. A difficult teaching situation they faced and how they handled it
Rules:
- Ask ONE question at a time. Keep responses under 3 sentences.
- Listen carefully to what the candidate says and respond naturally to their specific answer before asking the next question.
- If an answer is too vague or short, ask a follow-up to dig deeper.
- Be encouraging but professional.
- After all 5 topics are covered, say exactly: "Thank you, that wraps up our professional interview. Let's move to the teaching simulation."
- Never break character. Never mention you are an AI language model.`

const ARYAN_SYSTEM = `You are Aryan, a curious and enthusiastic 10-year-old student learning fractions with a tutor.
You ask good questions, engage well, and occasionally get confused on specific steps.
Keep responses short (1-2 sentences). Ask natural follow-up questions a curious child would ask.
After 4 exchanges say exactly: "Oh I think I get it now! Thank you so much!"`

const RIYA_SYSTEM = `You are Riya, a frustrated and disengaged 12-year-old student who finds math boring and hard.
You give short reluctant answers, occasionally say things like "I don't get it" or "this is too hard".
Keep responses short (1-2 sentences). Be realistic — not rude, just disengaged and struggling.
After 4 exchanges say exactly: "Fine... I'll try I guess."`

export default function InterviewRoom({ candidate, onFinish }) {
  const [ready, setReady]           = useState(false)
  const [phase, setPhase]           = useState(1)
  const [subPhase, setSubPhase]     = useState(null)
  const [orbState, setOrb]          = useState('idle')
  const [uiMode, setUiMode]         = useState('idle')
  const [transcript, setTx]         = useState([])
  const [error, setError]           = useState('')
  const [quizResult, setQuizResult] = useState(null)
  const [assessment, setAssessment] = useState(null)
  const [liveText, setLiveText]     = useState('')

  const recRef      = useRef(null)
  const finalBuf    = useRef('')    // committed isFinal speech
  const interimBuf  = useRef('')    // latest interim (uncommitted) speech
  const processing  = useRef(false)
  const phaseRef    = useRef(1)
  const subRef      = useRef(null)
  const historyRef  = useRef([])
  const p2HistRef   = useRef([])
  const p2Count     = useRef(0)
  const p1ScoresRef = useRef([])

  const addMsg = useCallback((role, text) =>
    setTx(t => [...t, { role, text }]), [])

  // ── Destroy recognizer, no callbacks ─────────────────────────────────────
  const killRec = useCallback(() => {
    const r = recRef.current
    if (!r) return
    recRef.current = null
    try { r.onstart = null; r.onresult = null; r.onerror = null; r.onend = null } catch(_) {}
    try { r.abort() } catch(_) {}
  }, [])

  // ── Open mic ─────────────────────────────────────────────────────────────
  const openMic = useCallback(() => {
    if (!SR) { setError('Please use Chrome browser'); return }
    killRec()
    finalBuf.current   = ''
    interimBuf.current = ''

    const r = new SR()
    r.lang = 'en-US'
    r.continuous = true
    r.interimResults = true
    recRef.current = r

    r.onstart = () => {
      setUiMode('listening')
      setOrb('listening')
      setLiveText('')
    }

    r.onresult = (e) => {
      let fin = '', int = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) fin += e.results[i][0].transcript + ' '
        else                       int  = e.results[i][0].transcript
      }
      if (fin) finalBuf.current += fin
      interimBuf.current = int
      setLiveText((finalBuf.current + int).trim())
    }

    // Intentionally empty — the Done button drives all flow, not onend
    r.onerror = () => {}
    r.onend   = () => {}

    try { r.start() } catch(e) { setError('Mic error — allow microphone access and refresh') }
  }, [killRec])

  // ── Speak then reopen mic ────────────────────────────────────────────────
  const speak = useCallback(async (text, role = 'ai') => {
    killRec()
    setUiMode('ai-speaking')
    setOrb('ai-speaking')
    addMsg(role, text)
    await speakText(text)
    await new Promise(r => setTimeout(r, 400))
    openMic()
  }, [addMsg, openMic, killRec])

  // ── Phase 1: Maya questions ───────────────────────────────────────────────
  const handleP1Answer = useCallback(async (text) => {
    historyRef.current.push({ role: 'user', content: text })
    const reply = await askMaya(MAYA_SYSTEM, historyRef.current)
    historyRef.current.push({ role: 'assistant', content: reply })

    const score = text.length > 80 ? 7 : text.length > 30 ? 5 : 3
    p1ScoresRef.current.push({ answer: text, score })

    if (reply.includes('wraps up our professional interview')) {
      addMsg('ai', reply)
      await speakText(reply)
      await new Promise(r => setTimeout(r, 400))
      setPhase(2); phaseRef.current = 2
      setSubPhase('good'); subRef.current = 'good'
      p2HistRef.current = []; p2Count.current = 0
      await speak("Great! Now I'd like to see how you handle students. First, meet Aryan — he's a curious 10-year-old learning fractions. Go ahead and start teaching him.", 'ai')
    } else {
      await speak(reply, 'ai')
    }
  }, [speak, addMsg])

  // ── Phase 2: Student personas ─────────────────────────────────────────────
  const handleP2Answer = useCallback(async (text) => {
    const sp     = subRef.current
    const system = sp === 'good' ? ARYAN_SYSTEM : RIYA_SYSTEM
    const role   = sp === 'good' ? 'good' : 'bad'

    p2HistRef.current.push({ role: 'user', content: text })
    const reply = await askMaya(system, p2HistRef.current)
    p2HistRef.current.push({ role: 'assistant', content: reply })
    p2Count.current += 1

    if (reply.includes('Oh I think I get it now') || reply.includes("Fine... I'll try")) {
      addMsg(role, reply)
      await speakText(reply)
      await new Promise(r => setTimeout(r, 500))
      if (sp === 'good') {
        setSubPhase('bad'); subRef.current = 'bad'
        p2HistRef.current = []; p2Count.current = 0
        await speak("Well done with Aryan! Now meet Riya — she's 12 and finds math really frustrating. Try to engage her.", 'ai')
      } else {
        killRec()
        speechSynthesis.cancel()
        setPhase(3); phaseRef.current = 3
        setUiMode('idle'); setOrb('idle')
      }
    } else {
      addMsg(role, reply)
      await speakText(reply)
      await new Promise(r => setTimeout(r, 300))
      openMic()
    }
  }, [speak, addMsg, openMic, killRec])

  // ── THE KEY FIX: Done button reads buffers directly — NO onend dependency ─
  // This is a plain function (not useCallback) so it always sees latest refs
  const handleDone = () => {
    if (processing.current) return

    // Read both final + interim buffers RIGHT NOW before killing the rec
    const text = (finalBuf.current + ' ' + interimBuf.current).trim()

    // Kill mic immediately
    killRec()
    setUiMode('processing')
    setOrb('idle')
    setLiveText('')
    setError('')

    if (!text) {
      setError("Nothing was heard — please speak then click Done Talking")
      processing.current = false
      openMic()
      return
    }

    processing.current = true
    addMsg('candidate', text)

    const run = async () => {
      try {
        if (phaseRef.current === 1) await handleP1Answer(text)
        if (phaseRef.current === 2) await handleP2Answer(text)
      } catch(e) {
        console.error(e)
        setError('Something went wrong — please try again')
        openMic()
      }
      processing.current = false
    }
    run()
  }

  // ── Start ─────────────────────────────────────────────────────────────────
  const handleStart = useCallback(async () => {
    setReady(true)
    // Unlock audio context on user gesture (required by browsers)
    const warm = new SpeechSynthesisUtterance(' ')
    warm.volume = 0
    speechSynthesis.speak(warm)
    await new Promise(r => setTimeout(r, 500))
    const opening = `Hi ${candidate?.fullName || 'there'}, I'm Maya, your interviewer from Cuemath. It's great to meet you! I'll be asking you a few questions to understand your teaching style and experience. Just speak naturally after I finish each question. Let's begin — could you start by telling me why you want to teach math to children?`
    historyRef.current = [{ role: 'assistant', content: opening }]
    await speak(opening, 'ai')
  }, [speak, candidate])

  // ── Quiz done ─────────────────────────────────────────────────────────────
  const handleQuizDone = (result) => {
    setQuizResult(result)
    setAssessment(generateAssessment(p1ScoresRef.current, result.score, result.total))
    setPhase(4)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (phase === 4 && assessment)
    return <FinalReport assessment={assessment} quizResult={quizResult} candidateName={candidate?.fullName} onRestart={onFinish} />

  if (!ready) return (
    <div style={S.gatePage}>
      <div style={S.gateCard}>
        <div style={S.gateOrb}>✦</div>
        <h2 style={S.gateTitle}>Ready to begin?</h2>
        <p style={S.gateSub}>Find a quiet place.<br />Maya will speak first — your mic opens automatically after she finishes.</p>
        <button style={S.gateBtn} onClick={handleStart}>Start Interview</button>
      </div>
    </div>
  )

  return (
    <div style={S.page}>
      <PhaseHeader phase={phase} subLabel={subPhase === 'good' ? 'Aryan' : subPhase === 'bad' ? 'Riya' : null} />
      {phase < 3 && (
        <div style={S.center}>
          <VoiceOrb state={orbState} audioLevel={uiMode === 'listening' ? 0.5 : 0} />

          {uiMode === 'listening'   && <p style={S.greenLabel}>● Listening — speak now</p>}
          {uiMode === 'processing'  && <p style={S.greyLabel}>⏳ Maya is thinking…</p>}
          {uiMode === 'ai-speaking' && <p style={S.greyLabel}>🔊 Maya is speaking…</p>}

          {liveText ? <p style={S.liveText}>"{liveText}"</p> : null}

          {uiMode === 'listening' && (
            <button style={S.doneBtn} onClick={handleDone}>
              ✓ Done Talking
            </button>
          )}

          {error && <p style={S.errorTxt}>{error}</p>}
        </div>
      )}
      {phase === 3 && <QuizPhase questions={QUIZ_QUESTIONS} onComplete={handleQuizDone} />}
      {transcript.length > 0 && <Transcript transcript={transcript} />}
    </div>
  )
}

const S = {
  page:       { minHeight:'100vh', display:'flex', flexDirection:'column', background:'var(--bg)' },
  center:     { flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, padding:'40px 24px' },
  greenLabel: { fontSize:14, color:'#43e97b', letterSpacing:'0.05em', margin:0 },
  greyLabel:  { fontSize:14, color:'var(--text-3)', margin:0 },
  liveText:   { fontSize:15, color:'var(--text-2)', fontStyle:'italic', maxWidth:500, textAlign:'center', minHeight:24 },
  doneBtn:    { background:'linear-gradient(135deg,#43e97b22,#38f9d722)', border:'2px solid #43e97b', borderRadius:24, padding:'12px 36px', fontSize:15, color:'#43e97b', cursor:'pointer', marginTop:8, fontWeight:600, letterSpacing:'0.03em' },
  errorTxt:   { color:'#ff6b6b', fontSize:13, marginTop:8, textAlign:'center', maxWidth:400 },
  gatePage:   { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:24 },
  gateCard:   { background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:24, padding:'48px 40px', maxWidth:420, width:'100%', display:'flex', flexDirection:'column', alignItems:'center', gap:16, textAlign:'center', boxShadow:'var(--shadow-lg)' },
  gateOrb:    { width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#6c63ff,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, color:'white', boxShadow:'0 4px 24px rgba(108,99,255,0.4)' },
  gateTitle:  { fontSize:26, fontFamily:'var(--font-display)', fontWeight:400, margin:0, color:'var(--text)' },
  gateSub:    { fontSize:15, color:'var(--text-2)', lineHeight:1.7, margin:0 },
  gateBtn:    { marginTop:8, background:'linear-gradient(135deg,#6c63ff,#8b5cf6)', color:'white', border:'none', borderRadius:12, padding:'14px 36px', fontSize:16, fontWeight:600, cursor:'pointer', boxShadow:'0 4px 20px rgba(108,99,255,0.4)' }
}
