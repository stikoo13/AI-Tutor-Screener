import { useState, useRef, useCallback } from 'react'

export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const playAudio = useCallback((url) => new Promise(resolve => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src='' }
    const a = new Audio(url); audioRef.current = a
    a.onplay  = () => setIsPlaying(true)
    a.onended = () => { setIsPlaying(false); URL.revokeObjectURL(url); resolve() }
    a.onerror = () => { setIsPlaying(false); resolve() }
    a.play().catch(() => { setIsPlaying(false); resolve() })
  }), [])

  const stopAudio = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src=''; setIsPlaying(false) }
  }, [])

  return { isPlaying, playAudio, stopAudio }
}