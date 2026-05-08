import { create } from 'zustand';
import { Complaint, ComplaintStatus } from '../types/complaint';
import { complaintService } from '../services/complaintService';

interface ComplaintState {
  complaints: Complaint[];
  isLoading: boolean;
  error: string | null;
  filterStatus: string;
  filterCategory: string;
  searchQuery: string;
  viewMode: 'list' | 'kanban' | 'map' | 'calendar';
  
  // Actions
  setComplaints: (complaints: Complaint[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setFilter: (key: 'filterStatus' | 'filterCategory' | 'searchQuery', value: string) => void;
  setViewMode: (mode: 'list' | 'kanban' | 'map' | 'calendar') => void;
  
  // Async Operations
  addComplaint: (complaintData: any) => Promise<string>;
  updateStatus: (id: string, status: ComplaintStatus, actor: string, actorRole: any, note: string) => Promise<void>;
  deleteComplaint: (id: string) => Promise<void>;
  getFilteredComplaints: () => Complaint[];
}

export const useComplaintStore = create<ComplaintState>((set, get) => ({
  complaints: [],
  isLoading: false,
  error: null,
  filterStatus: 'all',
  filterCategory: 'all',
  searchQuery: '',
  viewMode: 'list',

  setComplaints: (complaints) => set({ complaints, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  setFilter: (key, value) => set({ [key]: value }),
  setViewMode: (viewMode) => set({ viewMode }),

  addComplaint: async (complaintData) => {
    set({ isLoading: true, error: null });
    try {
      const id = await complaintService.submitComplaint(complaintData);
      set({ isLoading: false });
      return id;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateStatus: async (id, status, actor, actorRole, note) => {
    set({ isLoading: true, error: null });
    try {
      await complaintService.updateStatus(id, status, actor, actorRole, note);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteComplaint: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await complaintService.deleteComplaint(id);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  getFilteredComplaints: () => {
    const { complaints, filterStatus, filterCategory, searchQuery } = get();
    return complaints.filter(c => {
      const statusMatch = filterStatus === 'all' || c.status === filterStatus;
      const categoryMatch = filterCategory === 'all' || c.category === filterCategory;
      const searchMatch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.referenceId.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && categoryMatch && searchMatch;
    });
  }
}));
