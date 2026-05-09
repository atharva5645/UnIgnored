import { useEffect } from 'react';
import { useComplaintStore } from '../store/complaintStore';
import { useAuthStore } from '../store/authStore';
import { complaintService } from '../services/complaintService';
import { COMPLAINTS } from '../utils/mockData';

export const useComplaints = () => {
  const { user } = useAuthStore();
  const { 
    complaints, 
    isLoading, 
    error, 
    setComplaints, 
    setLoading, 
    setError,
    addComplaint,
    updateStatus,
    assignWorker,
    deleteComplaint,
    getFilteredComplaints
  } = useComplaintStore();

  // Realtime subscription logic
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    let unsubscribe: () => void;

    // Pre-populate with mock data immediately to ensure prototype routes work instantly,
    // but PRESERVE existing live data in the store so it doesn't vanish on route navigation.
    const currentComplaints = useComplaintStore.getState().complaints;
    const existingLive = currentComplaints.filter(c => !COMPLAINTS.some(mock => mock.id === c.id));
    const initialMerge = [...existingLive, ...COMPLAINTS];
    initialMerge.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setComplaints(initialMerge);

    const handleData = (liveData: any[]) => {
      // Merge live data with mock data so prototyping routes work seamlessly
      const allComplaints = [...liveData];
      COMPLAINTS.forEach(mock => {
        if (!allComplaints.some(c => c.id === mock.id)) {
          allComplaints.push(mock);
        }
      });
      // Ensure the entire merged array is sorted newest-first
      allComplaints.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setComplaints(allComplaints);
    };

    try {
      if (user.role === 'citizen') {
        unsubscribe = complaintService.subscribeToUserComplaints(user.id, handleData);
      } else {
        unsubscribe = complaintService.subscribeToPublicFeed(handleData);
      }
      
      // Safety timeout in case Firebase hangs completely
      setTimeout(() => {
        setLoading(false);
      }, 5000);
      
    } catch (err) {
      console.error("Subscription failed:", err);
      setLoading(false);
      handleData([]); // Fallback to mock data only
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, setComplaints, setLoading]);

  return {
    complaints,
    filteredComplaints: getFilteredComplaints(),
    isLoading,
    error,
    addComplaint,
    updateStatus,
    assignWorker,
    deleteComplaint
  };
};
