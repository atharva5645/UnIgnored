import { useEffect } from 'react'
import { useComplaintStore } from '../store/complaintStore'
import { useUIStore } from '../store/uiStore'

export function useWebSocket() {
  const simulateRealTimeUpdate = useComplaintStore(s => s.simulateRealTimeUpdate)
  const addNotification = useUIStore(s => s.addNotification)
  const speedMultiplier = useUIStore(s => s.speedMultiplier)

  useEffect(() => {
    const interval = Math.max(5000, 30000 / speedMultiplier)
    const timer = setInterval(() => {
      simulateRealTimeUpdate()
      const messages = [
        { title: 'Status Updated', message: 'A complaint in your area was just resolved!' },
        { title: 'New Complaint', message: 'New pothole reported near MG Road' },
        { title: 'Officer Assigned', message: 'Officer assigned to your complaint' },
      ]
      const msg = messages[Math.floor(Math.random() * messages.length)]
      addNotification({ ...msg, type: 'info' })
    }, interval)
    return () => clearInterval(timer)
  }, [simulateRealTimeUpdate, addNotification, speedMultiplier])
}
