import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'

export default function App() {
  const [user, setUser]       = useState(undefined) // undefined = loading, null = logged out
  const [ready, setReady]     = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setReady(true)
    })
    return unsub
  }, [])

  if (!ready) {
    return (
      <div style={S.loading}>
        <div style={S.spinner} />
      </div>
    )
  }

  return user ? <HomePage user={user} /> : <LoginPage />
}

const S = {
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '3px solid var(--border)',
    borderTopColor: '#6c63ff',
    animation: 'spin 0.7s linear infinite',
  },
}
