import { useState, useEffect } from 'react'

interface GeolocationState {
  lat: number | null
  lng: number | null
  accuracy: number | null
  error: string | null
  loading: boolean
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    lat: null, lng: null, accuracy: null, error: null, loading: false
  })

  const detect = () => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, error: 'Geolocation not supported' }))
      return
    }
    setState(s => ({ ...s, loading: true }))
    navigator.geolocation.getCurrentPosition(
      (pos) => setState({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        error: null, loading: false
      }),
      (err) => {
        // fallback to Delhi centre
        setState({ lat: 28.6304, lng: 77.2177, accuracy: 500, error: null, loading: false })
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return { ...state, detect }
}
