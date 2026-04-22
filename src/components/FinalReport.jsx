import React, { useState } from 'react'

const DIMS = {
  communication_clarity:  { label:'Communication Clarity', icon:'💬' },
  warmth_empathy:         { label:'Warmth & Empathy',      icon:'🤝' },
  simplification_ability: { label:'Simplification Ability',icon:'🎯' },
  patience:               { label:'Patience',              icon:'⏳' },
  english_fluency:        { label:'English Fluency',       icon:'🗣️' },
  teaching_methodology:   { label:'Teaching Methodology',  icon:'📚' },
}
const VERDICT = {
  HIRE:   { label:'Recommend for Hire',    color:'#43e97b', icon:'✅' },
  MAYBE:  { label:'Further Review Needed', color:'#f7971e', icon:'⚠️' },
  REJECT: { label:'Not Recommended',       color:'#ff6b6b', icon:'❌' },
}
const col = s => s>=8?'#43e97b':s>=6?'#f7971e':'#ff6b6b'

export default function FinalReport({ assessment, quizResult, candidateName, onRestart }) {
  const [tab, setTab] = useState('recruiter')
  if (!assessment) return null
  const v = VERDICT[assessment.verdict]||VERDICT.MAYBE

  return (
    <div style={{maxWidth:720,margin:'0 auto',padding:'28px 24px',animation:'fade-in 0.6s ease'}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:28}}>
        <div style={{fontSize:15,fontWeight:600,color:'var(--text-2)'}}>∑ Cuemath Tutor Screener</div>
        <button onClick={onRestart} style={{background:'var(--bg-3)',border:'1px solid var(--border)',
          borderRadius:8,padding:'7px 14px',fontSize:13,color:'var(--text-2)',cursor:'pointer',fontFamily:'var(--font-body)'}}>
          Start Over
        </button>
      </div>

      {/* Hero */}
      <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24,
        background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:20,padding:'24px 28px',flexWrap:'wrap'}}>
        <div style={{width:50,height:50,borderRadius:'50%',flexShrink:0,
          background:'linear-gradient(135deg,#6c63ff,#8b5cf6)',
          display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:700,color:'white'}}>
          {candidateName?.charAt(0)?.toUpperCase()||'?'}
        </div>
        <div>
          <div style={{fontSize:20,fontFamily:'var(--font-display)'}}>{candidateName}</div>
          <div style={{fontSize:13,color:'var(--text-3)'}}>Tutor Candidate · Cuemath Screening</div>
        </div>
        <div style={{flex:1}}/>
        <div style={{display:'flex',alignItems:'center',gap:12,padding:'14px 20px',borderRadius:12,
          background:v.color+'15',border:`1px solid ${v.color}44`,color:v.color}}>
          <span style={{fontSize:20}}>{v.icon}</span>
          <div>
            <div style={{fontSize:15,fontWeight:700}}>{v.label}</div>
            <div style={{fontSize:13,opacity:0.8}}>Overall: {assessment.overall_score}/10</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:8,marginBottom:24,background:'var(--bg-2)',
        border:'1px solid var(--border)',borderRadius:12,padding:6}}>
        {['recruiter','candidate'].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{flex:1,padding:'10px 16px',borderRadius:8,border:'none',
              background:tab===t?'var(--bg-3)':'transparent',
              color:tab===t?'var(--text)':'var(--text-2)',
              fontSize:14,fontWeight:500,cursor:'pointer',fontFamily:'var(--font-body)',
              boxShadow:tab===t?'0 2px 8px rgba(0,0,0,0.3)':'none',transition:'all 0.2s'}}>
            {t==='recruiter'?'📋 Recruiter Report':'🪞 Candidate Feedback'}
          </button>
        ))}
      </div>

      {tab==='recruiter' && (
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <Sec title="Performance Dimensions">
            {Object.entries(assessment.scores||{}).map(([k,v])=>{
              const d=DIMS[k]||{label:k,icon:'📊'}
              return (
                <div key={k} style={{marginBottom:12}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6,fontSize:14}}>
                    <span>{d.icon}</span>
                    <span style={{flex:1}}>{d.label}</span>
                    <span style={{fontWeight:700,color:col(v)}}>{v}/10</span>
                  </div>
                  <div style={{height:6,background:'var(--bg-3)',borderRadius:6,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${v*10}%`,borderRadius:6,transition:'width 0.8s',
                      background:`linear-gradient(90deg,${col(v)}88,${col(v)})`}}/>
                  </div>
                </div>
              )
            })}
          </Sec>
          {quizResult && (
            <Sec title="Quiz Score">
              <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:10}}>
                <span style={{fontSize:32,fontFamily:'var(--font-display)',color:'#43e97b'}}>{quizResult.score}</span>
                <span style={{color:'var(--text-2)',fontSize:14}}>/100 points ({assessment.quizPct?.toFixed(0)||0}%)</span>
              </div>
              <div style={{height:8,background:'var(--bg-3)',borderRadius:8,overflow:'hidden'}}>
                <div style={{height:'100%',background:'linear-gradient(90deg,#43e97b,#38f9d7)',
                  width:`${quizResult.score}%`,borderRadius:8}}/>
              </div>
            </Sec>
          )}
        </div>
      )}

      {tab==='candidate' && (
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <div style={{background:'linear-gradient(135deg,#6c63ff22,#43e97b11)',
            border:'1px solid var(--border)',borderRadius:12,padding:'24px'}}>
            <h3 style={{fontSize:22,fontFamily:'var(--font-display)',marginBottom:8}}>
              Hey {candidateName?.split(' ')[0]}! 👋
            </h3>
            <p style={{fontSize:15,color:'var(--text-2)',lineHeight:1.7}}>
              Here's your personal feedback report. Use this to improve and grow as a tutor!
            </p>
          </div>
          <Sec title="Your Scores">
            <div style={{display:'flex',flexWrap:'wrap',gap:12}}>
              {Object.entries(assessment.scores||{}).map(([k,v])=>{
                const d=DIMS[k]||{label:k,icon:'📊'}
                return (
                  <div key={k} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,
                    padding:'14px 18px',background:'var(--bg-3)',border:`1px solid ${col(v)}44`,
                    borderRadius:12,minWidth:80}}>
                    <span style={{fontSize:20}}>{d.icon}</span>
                    <span style={{fontSize:24,fontWeight:700,fontFamily:'var(--font-display)',color:col(v)}}>{v}</span>
                    <span style={{fontSize:11,color:'var(--text-3)',textAlign:'center'}}>{d.label.split(' ')[0]}</span>
                  </div>
                )
              })}
            </div>
          </Sec>
          <Sec title="What You Did Well ✨">
            <p style={{fontSize:15,color:'var(--text-2)',lineHeight:1.7}}>
              {assessment.overall_score >= 7
                ? "You showed strong communication and a natural warmth with students. Your explanation style was clear and your patience during the simulation was commendable."
                : assessment.overall_score >= 5
                ? "You showed genuine enthusiasm for teaching and made a good effort to explain concepts simply. Your motivation to connect with students came through clearly."
                : "You demonstrated willingness to engage with students. With more practice and structure in your explanations, you can improve significantly."}
            </p>
          </Sec>
          <Sec title="Areas to Improve 🔧">
            <p style={{fontSize:15,color:'var(--text-2)',lineHeight:1.7}}>
              {assessment.overall_score >= 7
                ? "Focus on using more real-world analogies and vary your vocabulary when re-explaining concepts. Practice handling very challenging students with playful redirect techniques."
                : assessment.overall_score >= 5
                ? "Work on structuring your answers more concisely. Try practicing the 'explain it like I'm 5' technique daily. Build a library of 10 go-to analogies for common math topics."
                : "Practice explaining simple math concepts out loud every day. Focus on empathy — always acknowledge a student's frustration before re-explaining. Record yourself teaching and review it."}
            </p>
          </Sec>
          {quizResult && (
            <Sec title="Quiz Breakdown 📝">
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {quizResult.answers.map((a,i)=>(
                  <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',
                    padding:'12px 16px',background:'var(--bg-3)',borderRadius:10,
                    border:`1px solid ${a.correct?'#43e97b44':'#ff6b6b44'}`}}>
                    <span style={{fontSize:16,flexShrink:0}}>{a.correct?'✅':'❌'}</span>
                    <div>
                      <div style={{fontSize:14,color:'var(--text)',marginBottom:4,lineHeight:1.5}}>{a.question}</div>
                      <div style={{fontSize:13,color:a.correct?'#43e97b':'#ff6b6b'}}>
                        {a.correct?`+${a.points} pts earned`:'0 pts — review this concept'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Sec>
          )}
        </div>
      )}
    </div>
  )
}

function Sec({ title, children }) {
  return (
    <div style={{background:'var(--bg-2)',border:'1px solid var(--border)',borderRadius:12,padding:'22px 24px'}}>
      <div style={{fontSize:12,fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase',
        color:'var(--text-3)',marginBottom:16}}>{title}</div>
      {children}
    </div>
  )
}