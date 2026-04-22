import React, { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import InterviewRoom from '../components/InterviewRoom'

export default function HomePage({ user }) {
  const [started, setStarted] = useState(false)
  const [details, setDetails] = useState({
    fullName: '', phone: '', city: '', experience: '', education: ''
  })
  const [error, setError] = useState('')

  const handleStart = () => {
    if (!details.fullName.trim()) return setError('Please enter your full name.')
    if (!details.phone.trim())    return setError('Please enter your phone number.')
    if (!details.city.trim())     return setError('Please enter your city.')
    setError('')
    setStarted(true)
  }

  if (started) {
    return <InterviewRoom candidate={details} onFinish={() => setStarted(false)} />
  }

  return (
    <div style={S.page}>
      <div style={S.bgOrb} />

      {/* Top bar */}
      <div style={S.topBar}>
        <div style={S.topLogo}>∑ Cuemath Tutor Screener</div>
        <div style={S.topRight}>
          <span style={S.email}>{user.email}</span>
          <button style={S.logoutBtn} onClick={() => signOut(auth)}>Sign Out</button>
        </div>
      </div>

      <div style={S.container}>
        {/* Welcome hero */}
        <div style={S.hero} className="fade-in">
          <h1 style={S.heroHeading}>
            Ready to join <span style={S.accent}>Cuemath?</span>
          </h1>
          <p style={S.heroSub}>
            Complete this 10-minute voice screening to move forward in your tutor application.
            The interview is conducted by Maya, our AI interviewer.
          </p>

          {/* Phase overview */}
          <div style={S.phases}>
            {[
              { n:'01', icon:'🎯', label:'Professional Interview', color:'#6c63ff',
                desc:'4 soft-skill questions about your teaching approach' },
              { n:'02', icon:'🎭', label:'Teaching Simulation', color:'#f7971e',
                desc:'Role-play with an eager student, then a challenging one' },
              { n:'03', icon:'📝', label:'Knowledge Quiz', color:'#43e97b',
                desc:'5 MCQ questions — scored out of 100 points' },
            ].map(p => (
              <div key={p.n} style={{ ...S.phaseCard, borderColor: p.color+'33', background: p.color+'0d' }}>
                <div style={{ ...S.phaseIcon, background: p.color+'22', color: p.color }}>{p.icon}</div>
                <div>
                  <div style={{ ...S.phaseNum, color: p.color }}>Phase {p.n}</div>
                  <div style={S.phaseLabel}>{p.label}</div>
                  <div style={S.phaseDesc}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details form */}
        <div style={S.formCard} className="fade-in">
          <div style={S.formTitle}>Your Details</div>
          <div style={S.grid}>
            {[
              { key:'fullName',   label:'Full Name *',          placeholder:'Priya Sharma',      type:'text' },
              { key:'phone',      label:'Phone Number *',       placeholder:'+91 98765 43210',   type:'tel'  },
              { key:'city',       label:'City *',               placeholder:'Chandigarh',        type:'text' },
              { key:'experience', label:'Teaching Experience',  placeholder:'e.g. 2 years, Fresher', type:'text' },
              { key:'education',  label:'Highest Education',    placeholder:'e.g. B.Tech CSE',   type:'text' },
            ].map(f => (
              <div key={f.key} style={S.group}>
                <label style={S.label}>{f.label}</label>
                <input
                  style={S.input}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={details[f.key]}
                  onChange={e => setDetails(d => ({ ...d, [f.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          {error && <div style={S.error}>{error}</div>}

          <div style={S.disclaimer}>
            🎙️ Microphone access required &nbsp;·&nbsp; 🔊 Audio will play &nbsp;·&nbsp;
            ⏱️ ~10 minutes &nbsp;·&nbsp; 📋 Report generated at the end
          </div>
          <button style={S.startBtn} onClick={handleStart}>
            Begin Interview →
          </button>
        </div>
      </div>
    </div>
  )
}

const S = {
  page: { minHeight:'100vh', position:'relative', overflow:'hidden' },
  bgOrb: {
    position:'fixed', top:'-20%', right:'-15%', width:700, height:700,
    borderRadius:'50%',
    background:'radial-gradient(circle,rgba(108,99,255,0.1)0%,transparent 70%)',
    pointerEvents:'none', zIndex:0
  },
  topBar: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'16px 32px', borderBottom:'1px solid var(--border)',
    background:'var(--bg-2)', position:'relative', zIndex:10
  },
  topLogo: { fontSize:16, fontWeight:600, color:'var(--text-2)' },
  topRight: { display:'flex', alignItems:'center', gap:16 },
  email: { fontSize:14, color:'var(--text-3)' },
  logoutBtn: {
    background:'var(--bg-3)', border:'1px solid var(--border)',
    borderRadius:8, padding:'7px 14px', fontSize:13,
    color:'var(--text-2)', cursor:'pointer'
  },
  container: {
    maxWidth:720, margin:'0 auto', padding:'40px 24px',
    display:'flex', flexDirection:'column', gap:32, position:'relative', zIndex:1
  },
  hero: { display:'flex', flexDirection:'column', gap:24 },
  heroHeading: { fontSize:36, fontFamily:'var(--font-display)', fontWeight:400, lineHeight:1.3 },
  accent: {
    background:'linear-gradient(90deg,#6c63ff,#a78bfa)',
    WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'
  },
  heroSub: { fontSize:16, color:'var(--text-2)', lineHeight:1.7, maxWidth:560 },
  phases: { display:'flex', flexDirection:'column', gap:12 },
  phaseCard: {
    display:'flex', alignItems:'flex-start', gap:16,
    padding:'16px 20px', borderRadius:12, border:'1px solid'
  },
  phaseIcon: {
    width:42, height:42, borderRadius:10,
    display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0
  },
  phaseNum:   { fontSize:11, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase' },
  phaseLabel: { fontSize:15, fontWeight:500, color:'var(--text)', marginBottom:2 },
  phaseDesc:  { fontSize:13, color:'var(--text-2)' },
  formCard: {
    background:'var(--bg-2)', border:'1px solid var(--border)',
    borderRadius:'var(--radius-lg)', padding:'32px 36px',
    display:'flex', flexDirection:'column', gap:24
  },
  formTitle: {
    fontSize:13, fontWeight:600, letterSpacing:'0.06em',
    textTransform:'uppercase', color:'var(--text-3)'
  },
  grid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 },
  group: { display:'flex', flexDirection:'column', gap:7 },
  label: {
    fontSize:13, fontWeight:500, color:'var(--text-2)',
    display:'flex', justifyContent:'space-between', alignItems:'center'
  },
  input: {
    background:'var(--bg-3)', border:'1px solid var(--border)',
    borderRadius:10, padding:'12px 16px', fontSize:14,
    color:'var(--text)', width:'100%', transition:'border-color 0.2s'
  },
  error: {
    background:'rgba(255,107,107,0.1)', border:'1px solid rgba(255,107,107,0.3)',
    borderRadius:8, padding:'10px 14px', fontSize:13, color:'#ff6b6b'
  },
  disclaimer: {
    fontSize:13, color:'var(--text-3)', textAlign:'center',
    padding:'14px', background:'var(--bg-3)',
    borderRadius:10, lineHeight:1.8
  },
  startBtn: {
    background:'linear-gradient(135deg,#6c63ff,#8b5cf6)', color:'white',
    border:'none', borderRadius:12, padding:'16px 24px', fontSize:16,
    fontWeight:600, cursor:'pointer', boxShadow:'0 4px 20px rgba(108,99,255,0.4)',
    transition:'opacity 0.2s'
  }
}
