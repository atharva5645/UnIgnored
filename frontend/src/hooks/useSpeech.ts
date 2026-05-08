import { useState, useCallback } from 'react'

interface SpeechState {
  isListening: boolean
  transcript: string
  error: string | null
}

export function useSpeech() {
  const [state, setState] = useState<SpeechState>({ isListening: false, transcript: '', error: null })

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Mock for demo
      setState(s => ({ ...s, isListening: true }))
      const mockPhrases = [
        'Large pothole on MG Road near traffic signal',
        'Street light not working in sector 12 colony',
        'Garbage overflow near the park on Gandhi Nagar',
        'Water pipe burst on Nehru Street causing flooding',
      ]
      setTimeout(() => {
        const phrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)]
        setState({ isListening: false, transcript: phrase, error: null })
      }, 2000)
      return
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-IN'
    setState(s => ({ ...s, isListening: true }))
    recognition.onresult = (e: any) => {
      setState({ isListening: false, transcript: e.results[0][0].transcript, error: null })
    }
    recognition.onerror = () => setState({ isListening: false, transcript: '', error: 'Speech recognition failed' })
    recognition.start()
  }, [])

  const reset = useCallback(() => setState({ isListening: false, transcript: '', error: null }), [])

  return { ...state, startListening, reset }
}
