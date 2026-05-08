import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser 
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { User, UserRole } from "../types/user";

export const authService = {
  // Listen to auth state changes
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let profile = await authService.getUserProfile(firebaseUser.uid);
        
        // If profile doesn't exist yet, it might be being created
        // Wait a bit and retry once
        if (!profile) {
          await new Promise(resolve => setTimeout(resolve, 1500));
          profile = await authService.getUserProfile(firebaseUser.uid);
        }
        
        callback(profile);
      } else {
        callback(null);
      }
    });
  },

  // Get user profile from Firestore
  getUserProfile: async (uid: string): Promise<User | null> => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as User;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  // Login with Email and Password
  login: async (email: string, password: string): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const profile = await authService.getUserProfile(userCredential.user.uid);
      
      if (!profile) throw new Error("User profile not found");
      
      // Update last login
      await updateDoc(doc(db, "users", userCredential.user.uid), {
        lastLoginAt: new Date().toISOString()
      });

      return profile;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  // Register a new User
  register: async (email: string, password: string, name: string, role: UserRole = 'citizen'): Promise<User> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const newUser: User = {
        id: uid,
        name,
        email,
        phone: "",
        role,
        badges: [],
        rewardPoints: 0,
        complaintsCount: 0,
        resolvedCount: 0,
        joinedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        isVerified: false,
        aadhaarVerified: false,
        twoFactorEnabled: false,
        privacyMode: true,
        language: 'en',
        theme: 'system',
        fontSize: 'md',
        highContrast: false,
        reducedMotion: false,
        dyslexicFont: false,
        notifications: {
          push: true,
          email: true,
          sms: false,
          whatsapp: false
        },
        addresses: [],
        familyAccounts: [],
        isAnonymousCapable: true,
        loginHistory: []
      };

      await setDoc(doc(db, "users", uid), {
        ...newUser,
        createdAt: serverTimestamp()
      });

      return newUser;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  // Google Login
  loginWithGoogle: async (): Promise<User> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Check if user profile exists
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        // Update last login
        await updateDoc(doc(db, "users", firebaseUser.uid), {
          lastLoginAt: new Date().toISOString()
        });
        return { ...userData, id: firebaseUser.uid };
      } else {
        // Create new citizen profile
        const newUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          phone: firebaseUser.phoneNumber || '',
          role: 'citizen',
          badges: [],
          rewardPoints: 0,
          complaintsCount: 0,
          resolvedCount: 0,
          joinedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          isVerified: true,
          aadhaarVerified: false,
          twoFactorEnabled: false,
          privacyMode: true,
          language: 'en',
          theme: 'system',
          fontSize: 'md',
          highContrast: false,
          reducedMotion: false,
          dyslexicFont: false,
          notifications: {
            push: true,
            email: true,
            sms: false,
            whatsapp: false
          },
          addresses: [],
          familyAccounts: [],
          isAnonymousCapable: true,
          loginHistory: []
        };

        await setDoc(doc(db, "users", firebaseUser.uid), {
          ...newUser,
          createdAt: serverTimestamp()
        });

        return newUser;
      }
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  }
};
