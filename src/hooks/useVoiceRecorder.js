import { useState, useRef, useCallback } from 'react'

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const animRef = useRef(null)

  const startRecording = useCallback(async () => {
    setIsRecording(true)
    const animate = () => {
      setAudioLevel(Math.random() * 0.3 + 0.05)
      animRef.current = requestAnimationFrame(animate)
    }
    animate()
  }, [])

  const stopRecording = useCallback(() => new Promise((resolve) => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    setAudioLevel(0)
    setIsRecording(false)
    resolve(new Blob(['dummy'], { type: 'audio/webm' }))
  }), [])

  return { isRecording, audioLevel, startRecording, stopRecording }
}
