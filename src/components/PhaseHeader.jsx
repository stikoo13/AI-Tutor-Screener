import React from 'react'

const INFO = {
  1:{ title:'Professional Interview', icon:'🎯', color:'#6c63ff', sub:'Soft-skills & communication' },
  2:{ title:'Teaching Simulation', icon:'🎭', color:'#f7971e', sub:'Role-play with students' },
  3:{ title:'Knowledge Quiz', icon:'📝', color:'#43e97b', sub:'5 questions — scored out of 100' }
}

export default function PhaseHeader({ phase, subLabel }) {
  const p = INFO[Math.min(phase,3)]
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16,padding:'16px 0 8px'}}>
      <div style={{display:'flex',alignItems:'center',gap:0}}>
        {[1,2,3].map((n,i)=>{
          const pi = INFO[n]; const done=phase>n; const active=phase===n
          return (
            <React.Fragment key={n}>
              <div style={{width:44,height:44,borderRadius:'50%',display:'flex',
                alignItems:'center',justifyContent:'center',fontSize:18,
                background: done ? pi.color : active ? pi.color+'22' : 'var(--bg-3)',
                border:`2px solid ${active||done?pi.color:'var(--border)'}`,
                boxShadow: active ? `0 0 16px ${pi.color}44` : 'none',
                transition:'all 0.4s', color:'white'}}>
                {done ? '✓' : pi.icon}
              </div>
              {i<2 && <div style={{width:56,height:2,background:done?pi.color:'var(--border)',transition:'background 0.4s'}}/>}
            </React.Fragment>
          )
        })}
      </div>
      <div style={{textAlign:'center'}}>
        <div style={{display:'inline-block',padding:'4px 12px',borderRadius:20,fontSize:12,
          fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase',
          background:p.color+'18',color:p.color,border:`1px solid ${p.color}33`,marginBottom:8}}>
          Phase {Math.min(phase,3)} of 3
        </div>
        <div style={{fontSize:22,fontFamily:'var(--font-display)',color:'var(--text)',marginBottom:4}}>{p.title}</div>
        {subLabel && <div style={{fontSize:13,color:'#f7971e',fontWeight:600,marginBottom:4}}>{subLabel}</div>}
        <div style={{fontSize:13,color:'var(--text-2)'}}>{p.sub}</div>
      </div>
    </div>
  )
}