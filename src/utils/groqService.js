const BASE = 'https://api.groq.com/openai/v1'
const GROQ_KEY = import.meta.env.VITE_GROQ_KEY || ''

export async function askMaya(systemPrompt, conversationHistory) {
  if (!GROQ_KEY) throw new Error('VITE_GROQ_KEY missing')
  const r = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GROQ_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory
      ],
      max_tokens: 120,
      temperature: 0.7
    })
  })
  if (!r.ok) {
    const e = await r.json().catch(() => ({}))
    throw new Error(e?.error?.message || `HTTP ${r.status}`)
  }
  return (await r.json()).choices[0].message.content.trim()
}

function getBestVoice() {
  const voices = speechSynthesis.getVoices()
  if (!voices.length) return null
  const priority = [
    v => v.name === 'Google UK English Female',
    v => v.name === 'Google US English',
    v => v.name.includes('Samantha'),
    v => v.name.includes('Victoria'),
    v => v.name.includes('Microsoft Zira'),
    v => v.name.includes('Female') && v.lang.startsWith('en'),
    v => v.lang.startsWith('en-') && !v.localService,
    v => v.lang.startsWith('en'),
  ]
  for (const test of priority) {
    const found = voices.find(test)
    if (found) return found
  }
  return voices[0]
}

// Chrome bug: cancel() + immediate speak() causes onend to never fire.
// Fix: 100ms gap after cancel, plus a watchdog timer fallback.
export function speakText(text) {
  return new Promise((resolve) => {
    speechSynthesis.cancel()

    setTimeout(() => {
      const utter = new SpeechSynthesisUtterance(text)
      const wordCount = text.split(/\s+/).length
      // Watchdog: resolve after estimated duration + 2s buffer, even if onend never fires
      const estimatedMs = Math.max((wordCount / 130) * 60_000 + 2000, 3000)

      let done = false
      const finish = () => {
        if (done) return
        done = true
        clearTimeout(watchdog)
        resolve()
      }
      const watchdog = setTimeout(finish, estimatedMs)

      utter.onend   = finish
      utter.onerror = finish
      utter.rate    = 0.93
      utter.pitch   = 1.05
      utter.volume  = 1

      const doSpeak = () => {
        const voice = getBestVoice()
        if (voice) utter.voice = voice
        if (speechSynthesis.paused) speechSynthesis.resume()
        speechSynthesis.speak(utter)
        // Chrome sometimes silently drops the speak() — retry once after 300ms
        setTimeout(() => {
          if (!speechSynthesis.speaking && !done) {
            speechSynthesis.speak(utter)
          }
        }, 300)
      }

      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true })
      } else {
        doSpeak()
      }
    }, 100)
  })
}
