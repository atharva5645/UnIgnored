import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  serverTimestamp,
  onSnapshot,
  Timestamp,
  DocumentSnapshot
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Complaint, ComplaintStatus, TimelineEvent } from "../types/complaint";

const COMPLAINTS_COLLECTION = "complaints";

const convertComplaint = (doc: any): Complaint => {
  const data = doc.data();
  // Provide fallbacks for serverTimestamps that haven't resolved yet
  const createdAtStr = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString());
  const updatedAtStr = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date().toISOString());
  const slaDeadlineStr = data.slaDeadline instanceof Timestamp ? data.slaDeadline.toDate().toISOString() : (data.slaDeadline || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString());

  return {
    id: doc.id,
    ...data,
    createdAt: createdAtStr,
    updatedAt: updatedAtStr,
    slaDeadline: slaDeadlineStr,
    timeline: (data.timeline || []).map((t: any) => ({
      ...t,
      timestamp: t.timestamp instanceof Timestamp ? t.timestamp.toDate().toISOString() : (t.timestamp || new Date().toISOString())
    }))
  } as Complaint;
};

export const complaintService = {
  /**
   * Submit a new complaint
   */
  submitComplaint: async (complaintData: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COMPLAINTS_COLLECTION), {
        ...complaintData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        upvotes: 0,
        timeline: [{
          id: `t_${Date.now()}`,
          status: 'submitted',
          timestamp: new Date().toISOString(),
          actor: complaintData.citizenName,
          actorRole: 'citizen',
          note: 'Complaint submitted successfully.'
        }]
      });
      return docRef.id;
    } catch (error) {
      console.error("Error submitting complaint:", error);
      throw error;
    }
  },

  /**
   * Update a complaint (Edit)
   */
  updateComplaint: async (id: string, updates: Partial<Complaint>): Promise<void> => {
    try {
      const docRef = doc(db, COMPLAINTS_COLLECTION, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating complaint:", error);
      throw error;
    }
  },

  /**
   * Delete a complaint
   */
  deleteComplaint: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COMPLAINTS_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting complaint:", error);
      throw error;
    }
  },

  /**
   * Update complaint status with timeline entry
   */
  updateStatus: async (
    complaintId: string, 
    status: ComplaintStatus, 
    actor: string, 
    actorRole: 'citizen' | 'officer' | 'admin' | 'system',
    note: string
  ): Promise<void> => {
    try {
      const docRef = doc(db, COMPLAINTS_COLLECTION, complaintId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) throw new Error("Complaint not found");
      
      const data = snap.data();
      const timeline: TimelineEvent[] = data.timeline || [];
      
      const newEvent: TimelineEvent = {
        id: `t_${Date.now()}`,
        status,
        timestamp: new Date().toISOString(),
        actor,
        actorRole,
        note
      };

      await updateDoc(docRef, {
        status,
        timeline: [...timeline, newEvent],
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating status:", error);
      throw error;
    }
  },

  /**
   * Subscribe to user's complaints (Realtime)
   */
  subscribeToUserComplaints: (citizenId: string, callback: (complaints: Complaint[]) => void) => {
    // Just where() clause for citizen, fetch all their complaints (usually a small number)
    // No orderBy here to avoid composite index (where + orderBy)
    const q = query(
      collection(db, COMPLAINTS_COLLECTION),
      where("citizenId", "==", citizenId)
    );

    return onSnapshot(q, 
      (snapshot) => {
        const complaints = snapshot.docs.map(convertComplaint);
        // Sort descending by createdAt client-side
        complaints.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(complaints);
      },
      (error) => {
        console.error("Error in subscribeToUserComplaints:", error);
      }
    );
  },

  /**
   * Subscribe to all public complaints (Realtime)
   */
  subscribeToPublicFeed: (callback: (complaints: Complaint[]) => void, limitCount: number = 50) => {
    // orderBy alone does NOT require a composite index!
    const q = query(
      collection(db, COMPLAINTS_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    return onSnapshot(q, 
      (snapshot) => {
        let complaints = snapshot.docs.map(convertComplaint);
        // Filter out anonymous manually
        complaints = complaints.filter(c => !c.isAnonymous);
        // The results are already sorted by Firestore, but we can safely re-sort just in case
        complaints.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(complaints);
      },
      (error) => {
        console.error("Error in subscribeToPublicFeed:", error);
      }
    );
  },

  /**
   * Fetch complaints with pagination
   */
  fetchComplaintsPaged: async (
    lastDoc: DocumentSnapshot | null = null, 
    pageSize: number = 10,
    filters: { status?: string, category?: string } = {}
  ) => {
    let q = query(
      collection(db, COMPLAINTS_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (filters.status && filters.status !== 'all') {
      q = query(q, where("status", "==", filters.status));
    }

    if (filters.category && filters.category !== 'all') {
      q = query(q, where("category", "==", filters.category));
    }

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const complaints = snapshot.docs.map(convertComplaint);
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];

    return { complaints, lastVisible };
  }
};
