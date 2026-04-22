import React, { useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { auth } from '../firebase'

export default function LoginPage() {
  const [mode, setMode]         = useState('login')   // 'login' | 'register'
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handle = async () => {
    if (!email || !password) return setError('Please fill in both fields.')
    setLoading(true); setError('')
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
    } catch (e) {
      setError(e.message.replace('Firebase: ', '').replace(/\(auth.*\)/, '').trim())
    }
    setLoading(false)
  }

  return (
    <div style={S.page}>
      <div style={S.bgOrb1} />
      <div style={S.bgOrb2} />

      <div style={S.card} className="fade-in">
        {/* Logo */}
        <div style={S.logoRow}>
          <div style={S.logoIcon}>∑</div>
          <div>
            <div style={S.logoName}>Cuemath</div>
            <div style={S.logoSub}>Tutor Screener</div>
          </div>
        </div>

        {/* Role chips — employee is disabled for now */}
        <div style={S.roleRow}>
          <div style={S.roleChipActive}>👨‍🎓 Candidate Login</div>
          <div style={S.roleChipDisabled} title="Coming soon">🏢 Employee Login</div>
        </div>

        <h2 style={S.heading}>
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p style={S.sub}>
          {mode === 'login'
            ? 'Sign in to continue your screening'
            : 'Register to start the tutor screening process'}
        </p>

        <div style={S.form}>
          <div style={S.group}>
            <label style={S.label}>Email Address</label>
            <input style={S.input} type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handle()} />
          </div>
          <div style={S.group}>
            <label style={S.label}>Password</label>
            <input style={S.input} type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handle()} />
          </div>

          {error && <div style={S.error}>{error}</div>}

          <button style={S.btn} onClick={handle} disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>
        </div>

        <div style={S.switchRow}>
          {mode === 'login' ? (
            <>Don't have an account?{' '}
              <span style={S.link} onClick={() => { setMode('register'); setError('') }}>Register</span>
            </>
          ) : (
            <>Already registered?{' '}
              <span style={S.link} onClick={() => { setMode('login'); setError('') }}>Sign In</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const S = {
  page: {
    minHeight:'100vh', display:'flex', alignItems:'center',
    justifyContent:'center', padding:24, position:'relative', overflow:'hidden'
  },
  bgOrb1: {
    position:'fixed', top:'-15%', right:'-10%', width:600, height:600,
    borderRadius:'50%',
    background:'radial-gradient(circle,rgba(108,99,255,0.12)0%,transparent 70%)',
    pointerEvents:'none'
  },
  bgOrb2: {
    position:'fixed', bottom:'-20%', left:'-10%', width:500, height:500,
    borderRadius:'50%',
    background:'radial-gradient(circle,rgba(67,233,123,0.08)0%,transparent 70%)',
    pointerEvents:'none'
  },
  card: {
    background:'var(--bg-2)', border:'1px solid var(--border)',
    borderRadius:'var(--radius-lg)', padding:48, maxWidth:480, width:'100%',
    boxShadow:'var(--shadow-lg)', position:'relative', zIndex:1
  },
  logoRow: { display:'flex', alignItems:'center', gap:14, marginBottom:32 },
  logoIcon: {
    width:52, height:52, borderRadius:14,
    background:'linear-gradient(135deg,#6c63ff,#8b5cf6)',
    display:'flex', alignItems:'center', justifyContent:'center',
    color:'white', fontSize:26, fontWeight:700,
    boxShadow:'0 4px 20px rgba(108,99,255,0.4)'
  },
  logoName: { fontSize:22, fontWeight:600, fontFamily:'var(--font-display)' },
  logoSub:  { fontSize:12, color:'var(--text-3)', letterSpacing:'0.08em', textTransform:'uppercase' },
  roleRow:  { display:'flex', gap:10, marginBottom:28 },
  roleChipActive: {
    padding:'8px 18px', borderRadius:30, fontSize:13, fontWeight:600,
    background:'rgba(108,99,255,0.15)', color:'#a78bfa',
    border:'1px solid rgba(108,99,255,0.4)', cursor:'default'
  },
  roleChipDisabled: {
    padding:'8px 18px', borderRadius:30, fontSize:13, fontWeight:500,
    background:'var(--bg-3)', color:'var(--text-3)',
    border:'1px solid var(--border)', cursor:'not-allowed', opacity:0.6
  },
  heading: { fontSize:26, fontFamily:'var(--font-display)', fontWeight:400, marginBottom:8 },
  sub:     { fontSize:14, color:'var(--text-2)', marginBottom:28 },
  form:    { display:'flex', flexDirection:'column', gap:18 },
  group:   { display:'flex', flexDirection:'column', gap:7 },
  label:   { fontSize:13, fontWeight:500, color:'var(--text-2)' },
  input: {
    background:'var(--bg-3)', border:'1px solid var(--border)',
    borderRadius:10, padding:'12px 16px', fontSize:15, color:'var(--text)',
    width:'100%', transition:'border-color 0.2s'
  },
  error: {
    background:'rgba(255,107,107,0.1)', border:'1px solid rgba(255,107,107,0.3)',
    borderRadius:8, padding:'10px 14px', fontSize:13, color:'#ff6b6b'
  },
  btn: {
    background:'linear-gradient(135deg,#6c63ff,#8b5cf6)', color:'white',
    border:'none', borderRadius:12, padding:'15px 24px', fontSize:16,
    fontWeight:600, cursor:'pointer', boxShadow:'0 4px 20px rgba(108,99,255,0.4)',
    transition:'opacity 0.2s'
  },
  switchRow: { marginTop:24, textAlign:'center', fontSize:14, color:'var(--text-2)' },
  link: { color:'var(--accent)', cursor:'pointer', fontWeight:500, marginLeft:4 }
}