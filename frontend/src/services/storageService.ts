import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject,
  uploadBytes
} from "firebase/storage";
import { storage } from "../firebase/config";
import { compressImage } from "../utils/imageUtils";

export const storageService = {
  /**
   * Upload an image with progress tracking
   */
  uploadWithProgress: (
    path: string, 
    file: File, 
    onProgress: (progress: number) => void
  ): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Compress image before upload if it's an image
        let fileToUpload = file;
        if (file.type.startsWith('image/')) {
          fileToUpload = await compressImage(file);
        }

        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            console.error("Upload error:", error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * Delete a file from storage
   */
  deleteFile: async (path: string): Promise<void> => {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error("Delete failed:", error);
      throw error;
    }
  },

  /**
   * Simple upload without progress
   */
  uploadImage: async (path: string, file: File): Promise<string> => {
    try {
      let fileToUpload = file;
      if (file.type.startsWith('image/')) {
        fileToUpload = await compressImage(file);
      }
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, fileToUpload);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Storage upload failed:", error);
      throw error;
    }
  }
};
