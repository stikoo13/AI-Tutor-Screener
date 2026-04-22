export default function Transcript({ transcript }) {
  const colors = {
    ai:'#6c63ff',
    'good-student':'#06b6d4',
    'bad-student':'#fb923c',
    candidate:'#43e97b'
  }

  const labels = {
    ai:'Maya (AI)',
    'good-student':'Aryan',
    'bad-student':'Riya',
    candidate:'You'
  }

  return (
    <div style={{
      background:'var(--bg-2)',
      border:'1px solid var(--border)',
      borderRadius:12,
      overflow:'hidden',
      maxHeight:240
    }}>
      <div style={{
        padding:'10px 16px',
        borderBottom:'1px solid var(--border)',
        background:'var(--bg-3)',
        fontSize:12,
        fontWeight:600,
        letterSpacing:'0.05em',
        textTransform:'uppercase',
        color:'var(--text-3)'
      }}>
        💬 Transcript
      </div>

      <div style={{
        overflowY:'auto',
        padding:16,
        display:'flex',
        flexDirection:'column',
        gap:12
      }}>
        {transcript.map((m,i)=>(
          <div key={i} style={{
            display:'flex',
            flexDirection:'column',
            gap:3,
            alignItems:m.role==='candidate'?'flex-end':'flex-start'
          }}>
            <span style={{
              fontSize:11,
              fontWeight:600,
              letterSpacing:'0.05em',
              textTransform:'uppercase',
              padding:'2px 8px',
              borderRadius:20,
              background:(colors[m.role]||'#6c63ff')+'15',
              color:colors[m.role]||'#6c63ff',
              border:`1px solid ${(colors[m.role]||'#6c63ff')}33`
            }}>
              {labels[m.role]||m.role}
            </span>

            <div style={{
              fontSize:13,
              color:'var(--text)',
              lineHeight:1.6,
              maxWidth:'90%'
            }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}