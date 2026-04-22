import React, { useState } from 'react'

export default function QuizPhase({ questions, onComplete }) {
  const [cur, setCur]           = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore]       = useState(0)
  const [answers, setAnswers]   = useState([])

  const q = questions[cur]

  const pick = (i) => {
    if (answered) return
    setSelected(i); setAnswered(true)
    const pts = i===q.correct ? q.points : 0
    setScore(s=>s+pts)
    setAnswers(a=>[...a,{...q,selected:i,earned:pts,correct:i===q.correct}])
  }

  const next = () => {
    if (cur+1>=questions.length) onComplete({ score: score + (selected === q.correct ? q.points : 0), answers, total: 100 })
    else { setCur(c=>c+1); setSelected(null); setAnswered(false) }
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:18,animation:'fade-in 0.4s ease'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontSize:13,color:'var(--text-2)'}}>Question {cur+1} of {questions.length}</span>
        <span style={{fontSize:14,background:'var(--bg-3)',border:'1px solid var(--border)',
          borderRadius:20,padding:'4px 14px',color:'var(--text-2)'}}>
          Score: <strong style={{color:'#43e97b'}}>{score}</strong>/100
        </span>
      </div>
      <div style={{height:4,background:'var(--bg-3)',borderRadius:4,overflow:'hidden'}}>
        <div style={{height:'100%',borderRadius:4,transition:'width 0.5s',
          background:'linear-gradient(90deg,#6c63ff,#43e97b)',width:`${(cur/questions.length)*100}%`}}/>
      </div>
      <div style={{fontSize:12,color:'#f7971e',background:'#f7971e11',border:'1px solid #f7971e33',
        borderRadius:20,padding:'3px 12px',display:'inline-block',fontWeight:600}}>
        Worth {q.points} points
      </div>
      <div style={{background:'var(--bg-3)',border:'1px solid var(--border)',
        borderRadius:12,padding:'20px 24px',fontSize:15,fontWeight:500,lineHeight:1.6}}>
        {q.question}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {q.options.map((opt,i)=>{
          let bg='var(--bg-3)',bc='var(--border)',c='var(--text)'
          if (answered) {
            if (i===q.correct)               { bg='#43e97b18'; bc='#43e97b' }
            else if (i===selected)           { bg='#ff6b6b18'; bc='#ff6b6b' }
            else                             { c='var(--text-3)' }
          } else if (selected===i)           { bg='#6c63ff22'; bc='#6c63ff' }
          return (
            <button key={i} onClick={()=>pick(i)} style={{display:'flex',alignItems:'center',
              gap:12,background:bg,border:`1px solid ${bc}`,borderRadius:10,
              padding:'13px 18px',cursor:answered?'default':'pointer',color:c,
              fontFamily:'var(--font-body)',fontSize:14,textAlign:'left',transition:'all 0.2s'}}>
              <span style={{width:26,height:26,borderRadius:7,background:'var(--surface)',
                display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:12,fontWeight:700,flexShrink:0,color:'var(--text-2)'}}>
                {['A','B','C','D'][i]}
              </span>
              <span style={{flex:1}}>{opt}</span>
              {answered && i===q.correct && <span style={{color:'#43e97b',fontSize:18}}>✓</span>}
              {answered && i===selected && i!==q.correct && <span style={{color:'#ff6b6b',fontSize:18}}>✗</span>}
            </button>
          )
        })}
      </div>
      {answered && (
        <div style={{background:'var(--bg-3)',border:'1px solid var(--border)',borderRadius:12,
          padding:'16px 20px',display:'flex',flexDirection:'column',gap:10,animation:'fade-in 0.3s'}}>
          <div style={{fontWeight:600,fontSize:15,color:selected===q.correct?'#43e97b':'#ff6b6b'}}>
            {selected===q.correct?`✓ Correct! +${q.points} pts`:`✗ Incorrect — 0 pts`}
          </div>
          <div style={{fontSize:14,color:'var(--text-2)',lineHeight:1.6}}>
            <strong>Why:</strong> {q.explanation}
          </div>
          <button onClick={next} style={{background:'linear-gradient(135deg,#6c63ff,#8b5cf6)',
            color:'white',border:'none',borderRadius:10,padding:'12px 20px',fontSize:14,
            fontWeight:600,cursor:'pointer',fontFamily:'var(--font-body)',alignSelf:'flex-start'}}>
            {cur+1>=questions.length?'Finish Quiz →':'Next Question →'}
          </button>
        </div>
      )}
    </div>
  )
}