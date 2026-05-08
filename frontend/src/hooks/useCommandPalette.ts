import { useEffect, useRef } from 'react'
import { useUIStore } from '../store/uiStore'
import { useAuthStore } from '../store/authStore'

export function useCommandPalette() {
  const toggle = useUIStore(s => s.toggleCommandPalette)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggle])
}

export const COMMANDS = [
  { id: 'nav-home',       label: 'Go to Home',            icon: '🏠', action: '/', group: 'Navigation' },
  { id: 'nav-dashboard',  label: 'Open Dashboard',         icon: '📊', action: '/dashboard/citizen', group: 'Navigation' },
  { id: 'nav-new',        label: 'File New Complaint',      icon: '➕', action: '/complaints/new', group: 'Complaints' },
  { id: 'nav-map',        label: 'Open Complaint Map',      icon: '🗺️', action: '/complaints/map', group: 'Navigation' },
  { id: 'nav-analytics',  label: 'View Analytics',          icon: '📈', action: '/analytics', group: 'Navigation' },
  { id: 'nav-community',  label: 'Community Forum',         icon: '💬', action: '/community', group: 'Navigation' },
  { id: 'nav-profile',    label: 'My Profile',              icon: '👤', action: '/profile', group: 'Navigation' },
  { id: 'nav-admin',      label: 'Admin Panel',             icon: '⚙️', action: '/admin/panel', group: 'Navigation' },
  { id: 'ui-dark',        label: 'Toggle Dark Mode',        icon: '🌙', action: 'toggle-dark', group: 'UI' },
  { id: 'ui-contrast',    label: 'Toggle High Contrast',    icon: '🎨', action: 'toggle-contrast', group: 'Accessibility' },
  { id: 'ui-fontlg',      label: 'Increase Font Size',      icon: '🔠', action: 'font-lg', group: 'Accessibility' },
  { id: 'ui-fontsm',      label: 'Decrease Font Size',      icon: '🔡', action: 'font-sm', group: 'Accessibility' },
  { id: 'ui-rtl',         label: 'Toggle RTL Layout',       icon: '↔️', action: 'toggle-rtl', group: 'Accessibility' },
  { id: 'ui-dyslexic',    label: 'Dyslexic Font',           icon: '📝', action: 'toggle-dyslexic', group: 'Accessibility' },
  { id: 'demo-mode',      label: 'Toggle Demo Mode',        icon: '🎬', action: 'toggle-demo', group: 'Demo' },
  { id: 'judge-mode',     label: 'Toggle Judge Mode',       icon: '⚖️', action: 'toggle-judge', group: 'Demo' },
  { id: 'scenario-pot',   label: 'Scenario: Pothole Crisis', icon: '🕳️', action: 'scenario-pothole', group: 'Demo' },
  { id: 'scenario-water', label: 'Scenario: Water Shortage', icon: '💧', action: 'scenario-water', group: 'Demo' },
  { id: 'scenario-garb',  label: 'Scenario: Garbage Nightmare', icon: '🗑️', action: 'scenario-garbage', group: 'Demo' },
  { id: 'filter-submitted',label:'Filter: Submitted',       icon: '📋', action: 'filter-submitted', group: 'Filters' },
  { id: 'filter-progress', label:'Filter: In Progress',     icon: '⚙️', action: 'filter-progress', group: 'Filters' },
  { id: 'filter-resolved', label:'Filter: Resolved',        icon: '✅', action: 'filter-resolved', group: 'Filters' },
  { id: 'logout',          label: 'Logout',                 icon: '🚪', action: 'logout', group: 'Account' },
  { id: 'export-pdf',      label: 'Export Complaints PDF',  icon: '📄', action: 'export-pdf', group: 'Actions' },
  { id: 'view-kanban',     label: 'Switch to Kanban View',  icon: '📌', action: 'view-kanban', group: 'Views' },
  { id: 'view-calendar',   label: 'Switch to Calendar View',icon: '📅', action: 'view-calendar', group: 'Views' },
  { id: 'view-map',        label: 'Switch to Map View',     icon: '🗺️', action: 'view-map', group: 'Views' },
]
