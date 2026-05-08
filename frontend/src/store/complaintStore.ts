import { create } from 'zustand';
import { Complaint, ComplaintStatus, ComplaintCategory } from '../types/complaint';
import { COMPLAINTS } from '../utils/mockData';

interface ComplaintState {
  complaints: Complaint[];
  filterStatus: string;
  filterCategory: string;
  searchQuery: string;
  viewMode: 'list' | 'kanban' | 'map' | 'calendar';
  
  setFilter: (key: 'filterStatus' | 'filterCategory' | 'searchQuery', value: string) => void;
  setViewMode: (mode: 'list' | 'kanban' | 'map' | 'calendar') => void;
  addComplaint: (complaint: Complaint) => void;
  updateComplaintStatus: (id: string, status: ComplaintStatus) => void;
  upvoteComplaint: (id: string) => void;
  addComment: (id: string, text: string, author: string) => void;
  getFilteredComplaints: () => Complaint[];
  simulateRealTimeUpdate: () => void;
}

export const useComplaintStore = create<ComplaintState>((set, get) => ({
  complaints: COMPLAINTS,
  filterStatus: 'all',
  filterCategory: 'all',
  searchQuery: '',
  viewMode: 'list',

  setFilter: (key, value) => set({ [key]: value }),
  setViewMode: (viewMode) => set({ viewMode }),

  addComplaint: (complaint) => set((state) => ({ 
    complaints: [complaint, ...state.complaints] 
  })),

  updateComplaintStatus: (id, status) => set((state) => ({
    complaints: state.complaints.map(c => 
      c.id === id ? { 
        ...c, 
        status, 
        updatedAt: new Date().toISOString(),
        timeline: [...c.timeline, {
          id: `t_${Date.now()}`,
          status,
          timestamp: new Date().toISOString(),
          actor: 'System',
          actorRole: 'system',
          note: `Status updated to ${status.replace('_', ' ')}`
        }]
      } : c
    )
  })),

  upvoteComplaint: (id) => set((state) => ({
    complaints: state.complaints.map(c => 
      c.id === id ? { ...c, upvotes: c.upvotes + 1 } : c
    )
  })),

  addComment: (id, text, author) => set((state) => ({
    complaints: state.complaints.map(c => 
      c.id === id ? { 
        ...c, 
        comments: [...c.comments, {
          id: `cm_${Date.now()}`,
          authorId: 'u1',
          authorName: author,
          authorRole: 'citizen',
          text,
          timestamp: new Date().toISOString(),
          isInternal: false
        }]
      } : c
    )
  })),

  getFilteredComplaints: () => {
    const { complaints, filterStatus, filterCategory, searchQuery } = get();
    return complaints.filter(c => {
      const statusMatch = filterStatus === 'all' || c.status === filterStatus;
      const categoryMatch = filterCategory === 'all' || c.category === filterCategory;
      const searchMatch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.referenceId.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && categoryMatch && searchMatch;
    });
  },

  simulateRealTimeUpdate: () => set((state) => {
    const randomIndex = Math.floor(Math.random() * state.complaints.length);
    const target = state.complaints[randomIndex];
    
    // 70% chance of upvote, 30% chance of status update
    if (Math.random() > 0.3) {
      return {
        complaints: state.complaints.map((c, i) => 
          i === randomIndex ? { ...c, upvotes: c.upvotes + 1 } : c
        )
      };
    } else {
      const nextStatus: Record<ComplaintStatus, ComplaintStatus> = {
        submitted: 'under_review',
        under_review: 'assigned',
        assigned: 'in_progress',
        in_progress: 'resolved',
        resolved: 'verified',
        verified: 'closed',
        closed: 'closed',
        escalated: 'in_progress',
        rejected: 'closed'
      };
      
      const status = nextStatus[target.status];
      if (status === target.status) return state; // No change

      return {
        complaints: state.complaints.map((c, i) => 
          i === randomIndex ? { 
            ...c, 
            status,
            updatedAt: new Date().toISOString(),
            timeline: [...c.timeline, {
              id: `t_sim_${Date.now()}`,
              status,
              timestamp: new Date().toISOString(),
              actor: 'AI Dispatcher',
              actorRole: 'system',
              note: `Automated status update: ${status.replace('_', ' ')}`
            }]
          } : c
        )
      };
    }
  })
}));
