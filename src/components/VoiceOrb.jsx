import React from 'react'

export default function VoiceOrb({ state, audioLevel=0 }) {
  const scale = state==='recording' ? 1+audioLevel*0.3 : 1
  return (
    <div style={{ position:'relative', width:140, height:140, display:'flex', alignItems:'center', justifyContent:'center' }}>
      {state==='ai-speaking' && <>
        <div style={R.ring1}/>
        <div style={R.ring2}/>
      </>}
      {state==='recording' && (
        <div style={{ ...R.recRing, transform:`scale(${1+audioLevel*1.5})`, opacity:0.3+audioLevel*0.5 }}/>
      )}
      <div style={{ ...R.orb,
        ...(state==='ai-speaking'?R.orbSpeak:{}),
        ...(state==='recording'?R.orbRec:{}),
        ...(state==='processing'?R.orbProc:{}),
        transform:`scale(${scale})` }}>
        {state==='ai-speaking' && <Waves/>}
        {state==='recording'   && <MicSVG/>}
        {state==='processing'  && <Dots/>}
        {state==='idle'        && <span style={{fontSize:30,color:'var(--text-3)'}}>✦</span>}
      </div>
    </div>
  )
}

const Waves = () => (
  <div style={{display:'flex',alignItems:'center',gap:4,height:32}}>
    {[0,1,2,3,4].map(i=>(
      <div key={i} style={{width:4,height:'100%',background:'white',borderRadius:4,
        animation:`wave ${0.6+i*0.1}s ease-in-out ${i*0.1}s infinite alternate`}}/>
    ))}
  </div>
)

const MicSVG = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <rect x="9" y="2" width="6" height="12" rx="3" fill="white"/>
    <path d="M5 10a7 7 0 0014 0" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <line x1="12" y1="17" x2="12" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="21" x2="16" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const Dots = () => (
  <div style={{display:'flex',gap:6}}>
    {[0,1,2].map(i=>(
      <div key={i} style={{width:10,height:10,borderRadius:'50%',background:'white',
        animation:`dot-bounce 1.2s ease-in-out ${i*0.16}s infinite`}}/>
    ))}
  </div>
)

const R = {
  ring1:{ position:'absolute', width:140, height:140, borderRadius:'50%',
    border:'2px solid rgba(108,99,255,0.3)', animation:'pulse-ring 2s ease-out infinite' },
  ring2:{ position:'absolute', width:140, height:140, borderRadius:'50%',
    border:'2px solid rgba(108,99,255,0.2)', animation:'pulse-ring 2s ease-out 0.6s infinite' },
  recRing:{ position:'absolute', width:110, height:110, borderRadius:'50%',
    background:'rgba(255,107,107,0.15)', transition:'transform 0.1s, opacity 0.1s' },
  orb:{ width:110, height:110, borderRadius:'50%',
    background:'linear-gradient(135deg,#2a2f45,#1e2332)', border:'2px solid var(--border)',
    display:'flex', alignItems:'center', justifyContent:'center',
    transition:'transform 0.1s, box-shadow 0.3s', position:'relative', zIndex:1 },
  orbSpeak:{ background:'linear-gradient(135deg,#3d3a8c,#6c63ff)',
    border:'2px solid rgba(108,99,255,0.6)', boxShadow:'0 0 40px rgba(108,99,255,0.4)' },
  orbRec:{ background:'linear-gradient(135deg,#8c2a2a,#ff4444)',
    border:'2px solid rgba(255,68,68,0.6)', boxShadow:'0 0 40px rgba(255,68,68,0.3)' },
  orbProc:{ background:'linear-gradient(135deg,#1a3a2a,#43e97b)',
    border:'2px solid rgba(67,233,123,0.4)', boxShadow:'0 0 30px rgba(67,233,123,0.2)' }
}