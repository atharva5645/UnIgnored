import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useComplaintStore } from '../../store/complaintStore'
import { useAuthStore } from '../../store/authStore'
import { CATEGORY_META } from '../../utils/mockData'
import { Button, Card, Badge, ProgressBar } from '../../components/ui'
import { 
  ChevronLeft, ChevronRight, MapPin, Camera, Mic, Info, 
  CheckCircle2, Shield, AlertTriangle, Image as ImageIcon,
  Clock, Award, Trash2, Edit3, Send, User, Users, Map as MapIcon,
  Clipboard, Eye, Bell
} from 'lucide-react'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import { storageService } from '../../services/storageService'
import { useUIStore } from '../../store/uiStore'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

// Fix Leaflet icon issue
const DefaultIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="relative w-10 h-10 flex items-center justify-center">
    <div class="absolute w-10 h-10 bg-[#f59e0b]/20 rounded-full animate-ping"></div>
    <div class="absolute w-8 h-8 bg-[#f59e0b] rounded-full border-[6px] border-white shadow-[0_0_20px_rgba(0,209,255,0.5)] z-10"></div>
    <div class="absolute w-2 h-2 bg-white rounded-full z-20"></div>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const STEPS = [
  { id: 'category', title: 'CATEGORY', icon: <Clipboard />, color: 'text-orange-500' },
  { id: 'location', title: 'LOCATION', icon: <MapPin />, color: 'text-pink-500' },
  { id: 'media', title: 'EVIDENCE', icon: <Camera />, color: 'text-slate-500' },
  { id: 'details', title: 'DETAILS', icon: <Edit3 />, color: 'text-orange-500' },
  { id: 'review', title: 'REVIEW', icon: <Eye />, color: 'text-purple-500' },
]

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 16, {
      duration: 1.5,
      easeLinearity: 0.25
    });
  }, [lat, lng, map]);
  return null;
}

function LocationPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const ImageItem = ({ file, onRemove, onUploadComplete }: { file: File, onRemove: () => void, onUploadComplete: (url: string) => void }) => {
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState('');

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    
    // Simulate a smooth loading screen from 0 to 100%
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(currentProgress);
        clearInterval(interval);
        
        // Brief pause at 100% before revealing the image
        setTimeout(() => {
          setUrl(objectUrl);
          onUploadComplete(objectUrl);
        }, 300);
      } else {
        setProgress(currentProgress);
      }
    }, 150);

    return () => {
      clearInterval(interval);
    };
  }, [file]);

  return (
    <div className="relative aspect-square rounded-[32px] overflow-hidden border border-white/10 group bg-dark-900">
      {url ? (
        <motion.img 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          src={url} 
          className="w-full h-full object-cover" 
          alt="Evidence" 
        />
      ) : (
        <div className="w-full h-full bg-white/5 flex flex-col items-center justify-center p-4">
          <div className="w-full bg-white/10 h-1.5 rounded-[32px] overflow-hidden mb-3">
            <motion.div 
              className="bg-primary-500 h-full shadow-glow-amber" 
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.15 }}
            />
          </div>
          <span className="text-xs font-bold text-white tracking-widest">{progress}%</span>
          <span className="text-[9px] text-slate-500 mt-1 uppercase tracking-wider">Uploading</span>
        </div>
      )}
      <button 
        onClick={onRemove}
        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-red-500/80"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default function NewComplaint() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [reportType, setReportType] = useState<'individual' | 'area'>('individual')
  const [submittedId, setSubmittedId] = useState<string | null>(null)
  const [data, setData] = useState<any>({
    category: '',
    subCategory: '',
    societyName: '',
    location: { address: '', ward: '', lat: 28.6139, lng: 77.2090 },
    media: [],
    title: '',
    description: '',
    severity: 5,
    isAnonymous: false,
  })
  
  const [files, setFiles] = useState<File[]>([])
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const navigate = useNavigate()
  const { addComplaint } = useComplaintStore()
  const { user } = useAuthStore()
  const { addNotification } = useUIStore()

  // Local override for categories to match image exactly
  const DISPLAY_CATEGORIES = [
    { id: 'pothole', label: 'POTHOLE', icon: '🕳️' },
    { id: 'garbage', label: 'GARBAGE', icon: '🗑️' },
    { id: 'water', label: 'WATER LEAKAGE', icon: '💧' },
    { id: 'electricity', label: 'ELECTRICITY', icon: '⚡' },
    { id: 'street_light', label: 'STREET LIGHT', icon: '💡' },
    { id: 'drainage', label: 'DRAINAGE', icon: '🌊' },
    { id: 'safety', label: 'PUBLIC SAFETY', icon: '🛡️' },
    { id: 'other', label: 'OTHER', icon: '❓' },
  ]

  const REPORT_TYPES = [
    { id: 'individual', label: 'Individual Report', desc: 'Standard report for personal issues.', icon: <User size={24} /> },
    { id: 'area', label: 'Society / Area Report', desc: 'Society reports gather area-wide attention.', icon: <Users size={24} /> },
  ]

  useEffect(() => {
    if (step === 5 && submittedId) {
      const timer = setTimeout(() => {
        navigate(`/complaints/track/${submittedId}`)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [step, submittedId, navigate])

  const startCamera = async () => {
    setIsCameraOpen(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      alert("Unable to access camera. Please check permissions.")
      setIsCameraOpen(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
    setIsCameraOpen(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' })
            setFiles(prev => [...prev, file])
            stopCamera()
          }
        }, 'image/jpeg', 0.8)
      }
    }
  }

  const handleNext = () => setStep(s => Math.min(s + 1, STEPS.length - 1))
  const handleBack = () => setStep(s => Math.max(s - 1, 0))

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const handleUploadComplete = (url: string) => {
    setData((prev: any) => ({
      ...prev,
      media: [...prev.media, url]
    }))
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!user) return
    setLoading(true)
    
    try {
      const refId = `CMP-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000) + 10000}`
      
      const complaintData = {
        referenceId: refId,
        title: data.title,
        description: data.description,
        category: data.category as any,
        status: 'submitted',
        severity: data.severity as any,
        location: { 
          ...data.location, 
          wardId: 'w1', 
          pincode: '110001' 
        },
        media: data.media.map((url: string, i: number) => ({ 
          id: `m${i}`, 
          url: url, 
          type: 'image', 
          name: `file_${i}.jpg`, 
          size: 1024, 
          createdAt: new Date().toISOString() 
        })),
        witnesses: [],
        ward: data.location.ward || 'North Ward',
        wardId: 'w1',
        citizenId: user.id,
        citizenName: user.name,
        citizenPhone: user.phone || '',
        isAnonymous: data.isAnonymous,
        isRecurring: false,
        reportType: reportType,
        societyName: reportType === 'area' ? data.societyName : '',
        tags: [data.category],
        estimatedResolutionDays: 3,
        slaDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        rewardPoints: 25,
      }

      const newId = await addComplaint(complaintData)
      toast.success("Intelligence filed! Admin has been alerted.", {
        icon: '📢',
        style: {
          borderRadius: '16px',
          background: '#333',
          color: '#fff',
        },
      })
      addNotification({
        title: 'Report Submitted',
        message: `Your report "${data.title}" has been filed successfully. Ref: ${newId}`,
        type: 'info',
        icon: '📢',
      })
      setSubmittedId(newId)
      setStep(5)
    } catch (error) {
      console.error("Submission failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const [isFetchingLocation, setIsFetchingLocation] = useState(false)
  
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsFetchingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        handleManualLocationSelect(latitude, longitude);
      },
      (error) => {
        console.error("Error fetching location:", error);
        setIsFetchingLocation(false)
        alert("Unable to fetch your location. Please check your permissions.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleManualLocationSelect = async (lat: number, lng: number) => {
    setData((prev: any) => ({
      ...prev,
      location: { ...prev.location, lat, lng }
    }));

    setIsFetchingLocation(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      if (data.display_name) {
        setData((prev: any) => ({
          ...prev,
          location: { 
            ...prev.location, 
            address: data.display_name,
            ward: data.address?.suburb || data.address?.neighbourhood || data.address?.city_district || data.address?.town || data.address?.village || data.address?.city || 'Detected Area'
          }
        }));
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    } finally {
      setIsFetchingLocation(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] pb-20 pt-28 px-6 transition-colors duration-500">
      <div className="max-w-[1600px] mx-auto">
        {/* Horizontal Progress Steps */}
        {step < 5 && (
          <div className="mb-12 border-b border-slate-200 dark:border-white/5 pb-8">
            <div className="flex items-center justify-center gap-10 sm:gap-20">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex flex-col items-center gap-3 group cursor-pointer" onClick={() => step > i && setStep(i)}>
                  <div className={clsx(
                    'w-14 h-14 flex items-center justify-center transition-all duration-500',
                    step === i 
                      ? 'bg-[#f59e0b] rounded-[18px] text-white shadow-lg' 
                      : 'text-slate-400'
                  )}>
                    {React.cloneElement(s.icon as React.ReactElement, {
                      size: 24
                    })}
                  </div>
                  <span className={clsx(
                    'text-[10px] font-black tracking-[0.2em] uppercase',
                    step === i ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-600'
                  )}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <Card className="p-10 min-h-[600px] flex flex-col rounded-[48px] bg-white dark:bg-slate-900/50 border-slate-100 shadow-2xl relative overflow-hidden transition-all duration-500">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="step0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">How are you reporting?</h2>
                      <p className="text-slate-500 text-xs mb-8">Individual reports are for personal issues. Society reports gather area-wide attention faster.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {REPORT_TYPES.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => setReportType(type.id as any)}
                            className={clsx(
                              'flex items-center gap-6 p-8 rounded-[40px] border transition-all duration-500 text-left group relative',
                              reportType === type.id 
                                ? 'bg-[#f59e0b]/5 border-[#f59e0b] shadow-[0_20px_40px_rgba(0,209,255,0.1)]' 
                                : 'bg-slate-50/50 dark:bg-white/5 border-transparent hover:border-slate-200'
                            )}
                          >
                            <div className={clsx(
                              'w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-500',
                               reportType === type.id 
                                ? 'bg-[#f59e0b] text-white shadow-lg' 
                                : 'bg-white dark:bg-white/5 shadow-sm text-slate-400'
                            )}>
                              {React.cloneElement(type.icon as React.ReactElement, { size: 28 })}
                            </div>
                            <div className="flex-1">
                               <h4 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider">{type.label}</h4>
                               <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-widest opacity-60">{type.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>

                      <AnimatePresence>
                        {reportType === 'area' && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-8 overflow-hidden"
                          >
                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-3 block">
                              SOCIETY / AREA NAME
                            </label>
                            <input 
                              type="text"
                              value={data.societyName}
                              onChange={(e) => setData({ ...data, societyName: e.target.value })}
                              placeholder="e.g. Green Valley Apartments, Sector 15 Residents"
                              className="w-full p-6 rounded-[24px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white focus:outline-none focus:border-primary-500 transition-all duration-300 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>


                    <div className="mt-12">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-8">Select Category</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {DISPLAY_CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setData({...data, category: cat.id})}
                            className={clsx(
                              'flex flex-col items-center justify-center p-8 rounded-[40px] border transition-all duration-500 group aspect-square relative',
                              data.category === cat.id 
                                ? 'bg-white border-[#f59e0b] shadow-[0_20px_40px_rgba(0,209,255,0.1)] scale-105 z-10' 
                                : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                            )}
                          >
                            <span className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-500">{cat.icon}</span>
                            <span className={clsx(
                              'text-[10px] font-black uppercase tracking-[0.1em] text-center',
                              data.category === cat.id ? 'text-[#f59e0b]' : 'text-slate-400'
                            )}>
                              {cat.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => setStep(step + 1)}
                      disabled={!data.category}
                      className={clsx(
                        'mt-12 w-full py-8 rounded-[32px] font-black text-xl tracking-widest uppercase transition-all duration-500',
                        data.category 
                          ? 'bg-[#f59e0b] text-white shadow-[0_20px_40px_rgba(0,209,255,0.3)] hover:scale-[1.02] active:scale-95' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'
                      )}
                    >
                      Continue &gt;
                    </button>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Pin Location</h2>
                    <p className="text-slate-500 text-xs mb-8">Where exactly is this happening? You can use your current location.</p>
                    <div className="space-y-6">
                        <div className="h-[400px] rounded-[32px] overflow-hidden border border-slate-200 dark:border-white/5 relative shadow-2xl">
                        <MapContainer 
                          center={[data.location.lat, data.location.lng]} 
                          zoom={16} 
                          className="w-full h-full"
                          zoomControl={false}
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          />
                          <Marker 
                            position={[data.location.lat, data.location.lng]} 
                            icon={DefaultIcon} 
                            eventHandlers={{
                              click: () => {
                                const url = `https://www.google.com/maps/search/?api=1&query=${data.location.lat},${data.location.lng}`;
                                window.open(url, '_blank');
                              }
                            }}
                          />
                          <RecenterMap lat={data.location.lat} lng={data.location.lng} />
                          <LocationPicker onLocationSelect={handleManualLocationSelect} />
                        </MapContainer>

                        {/* Top Left Instructions */}
                        <div className="absolute top-4 left-4 z-[1000]">
                          <div className="bg-slate-100/90 backdrop-blur-sm border border-slate-200 px-4 py-2 rounded-xl">
                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                              Click map to pin exact spot
                            </span>
                          </div>
                        </div>
                        
                        {/* Control Stack at Bottom Right */}
                        <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-3 items-end">
                          <Button 
                            variant="secondary" 
                            size="lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`https://www.google.com/maps/search/?api=1&query=${data.location.lat},${data.location.lng}`, '_blank');
                            }}
                            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-black/5 dark:border-white/10 text-xs font-black uppercase tracking-[0.2em] text-primary-500 shadow-2xl px-6 h-12 flex items-center gap-3 rounded-[20px] hover:scale-105 transition-all duration-300"
                          >
                            <MapIcon size={16} /> Open in Maps
                          </Button>
                          
                          <Button 
                            size="lg" 
                            glow
                            onClick={handleGetCurrentLocation}
                            isLoading={isFetchingLocation}
                            className="bg-primary-500 text-white text-xs font-black uppercase tracking-[0.2em] shadow-glow-amber px-6 h-12 flex items-center gap-3 rounded-[20px] hover:scale-105 transition-all duration-300"
                          >
                            <MapPin size={16} /> 
                            {isFetchingLocation ? 'Tracking Signal...' : 'Auto-Detect GPS'}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <textarea 
                          placeholder="Street name, landmark, building number..."
                          className="w-full bg-slate-100 dark:bg-dark-950/50 border border-slate-200 dark:border-white/5 rounded-[32px] p-5 text-sm text-slate-800 dark:text-white focus:border-primary-500/50 outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                          rows={4}
                          value={data.location.address}
                          onChange={e => setData({...data, location: {...data.location, address: e.target.value}})}
                        />
                        <select 
                          className="w-full bg-slate-100 dark:bg-dark-950/50 border border-slate-200 dark:border-white/5 rounded-[32px] p-4 text-sm text-slate-800 dark:text-white outline-none"
                          value={data.location.ward}
                          onChange={e => setData({...data, location: {...data.location, ward: e.target.value}})}
                        >
                          <option value="" disabled>Select or detect ward...</option>
                          {data.location.ward && !["North Ward", "South Ward", "East Ward", "West Ward"].includes(data.location.ward) && (
                            <option value={data.location.ward}>{data.location.ward} (Detected)</option>
                          )}
                          <option value="North Ward">North Ward</option>
                          <option value="South Ward">South Ward</option>
                          <option value="East Ward">East Ward</option>
                          <option value="West Ward">West Ward</option>
                        </select>
                      </div>
                      </div>
                      <div className="mt-12 flex items-center gap-4">
                        <button
                          onClick={() => setStep(step - 1)}
                          className="flex-1 py-6 rounded-[24px] flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest bg-slate-100 dark:bg-white/5 text-slate-400 hover:bg-slate-200 transition-all duration-300"
                        >
                          <ChevronLeft size={20} />
                          Back
                        </button>
                        <button
                          onClick={() => setStep(step + 1)}
                          disabled={!data.location.lat || !data.location.address}
                          className={clsx(
                            'flex-[2] py-6 rounded-[24px] flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest transition-all duration-300',
                            data.location.lat && data.location.address
                              ? 'bg-[#f59e0b] text-white shadow-[0_20px_40px_rgba(0,209,255,0.2)] hover:scale-[1.02] active:scale-[0.98]' 
                              : 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed'
                          )}
                        >
                          Continue
                          <ChevronRight size={20} />
                        </button>
                      </div>

                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Evidence</h2>
                    <p className="text-slate-500 text-xs mb-8">Visuals help officers understand and resolve issues faster.</p>
                    
                    {isCameraOpen ? (
                      <div className="relative rounded-[32px] overflow-hidden bg-black mb-6">
                        <video ref={videoRef} autoPlay playsInline className="w-full aspect-video object-cover" />
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                          <Button size="lg" glow onClick={capturePhoto}>
                            <Camera size={20} className="mr-2" /> Capture
                          </Button>
                          <Button variant="danger" size="lg" onClick={stopCamera}>
                            Cancel
                          </Button>
                        </div>
                        <canvas ref={canvasRef} className="hidden" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        {files.map((file, i) => (
                          <ImageItem key={i} file={file} onRemove={() => removeFile(i)} onUploadComplete={handleUploadComplete} />
                        ))}
                        <button onClick={startCamera} className="aspect-square flex flex-col items-center justify-center p-4 rounded-[32px] border border-dashed border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all group">
                          <Camera size={24} className="text-primary-500 mb-2 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-widest">Take Photo</span>
                        </button>
                        <button onClick={() => fileInputRef.current?.click()} className="aspect-square flex flex-col items-center justify-center p-4 rounded-[32px] border border-dashed border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all group">
                          <ImageIcon size={24} className="text-brand-violet mb-2 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-widest">Upload Photo</span>
                        </button>
                      </div>

                    )}
                    
                    <div className="mt-12 flex items-center gap-4">
                      <button
                        onClick={() => setStep(step - 1)}
                        className="flex-1 py-6 rounded-[24px] flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest bg-slate-100 dark:bg-white/5 text-slate-400 hover:bg-slate-200 transition-all duration-300"
                      >
                        <ChevronLeft size={20} />
                        Back
                      </button>
                      <button
                        onClick={() => setStep(step + 1)}
                        className="flex-[2] py-6 rounded-[24px] flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest bg-[#f59e0b] text-white shadow-[0_20px_40px_rgba(0,209,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                      >
                        Continue
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Report Details</h2>
                    <p className="text-slate-500 text-xs mb-8">Add a title and detailed description to your report.</p>
                    <div className="space-y-6">
                      <input 
                        placeholder="Short summary (e.g., Pothole near Central Market)" 
                        className="w-full bg-slate-100 dark:bg-dark-950/50 border border-slate-200 dark:border-white/5 rounded-[32px] px-5 py-4 text-sm text-slate-800 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600" 
                        value={data.title} 
                        onChange={e => setData({...data, title: e.target.value})} 
                      />
                      <textarea 
                        placeholder="Describe the issue in detail..." 
                        className="w-full bg-slate-100 dark:bg-dark-950/50 border border-slate-200 dark:border-white/5 rounded-[32px] p-5 text-sm text-slate-900 dark:text-white outline-none resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600" 
                        rows={6} 
                        value={data.description} 
                        onChange={e => setData({...data, description: e.target.value})} 
                      />
                    </div>
                    
                    <div className="mt-12 flex items-center gap-4">
                      <button
                        onClick={() => setStep(step - 1)}
                        className="flex-1 py-6 rounded-[24px] flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest bg-slate-100 dark:bg-white/5 text-slate-400 hover:bg-slate-200 transition-all duration-300"
                      >
                        <ChevronLeft size={20} />
                        Back
                      </button>
                      <button
                        onClick={() => setStep(step + 1)}
                        disabled={!data.title || !data.description}
                        className={clsx(
                          'flex-[2] py-6 rounded-[24px] flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest transition-all duration-300',
                          data.title && data.description
                            ? 'bg-[#f59e0b] text-white shadow-[0_20px_40px_rgba(0,209,255,0.2)] hover:scale-[1.02] active:scale-[0.98]' 
                            : 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed'
                        )}
                      >
                        Continue
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Final Review</h2>
                    <p className="text-slate-500 text-xs mb-8">Verify the information before submitting to authorities.</p>
                    <div className="space-y-6">
                      <div className="p-6 rounded-[32px] bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-6">
                        
                        <div>
                          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest block mb-2">Report Details</span>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{data.title || "No Title Provided"}</h3>
                          <p className="text-sm text-slate-400 leading-relaxed">{data.description || "No description provided."}</p>
                        </div>

                        <div className="h-px w-full bg-white/5" />

                        <div>
                          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest block mb-2">Location</span>
                          <p className="text-sm text-slate-900 dark:text-white font-medium">{data.location.address || "No address specified."}</p>
                        </div>

                        <div className="h-px w-full bg-white/5" />

                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Category</span>
                            <span className="text-slate-900 dark:text-white font-bold flex items-center gap-2">
                              {CATEGORY_META[data.category as keyof typeof CATEGORY_META]?.icon}
                              {CATEGORY_META[data.category as keyof typeof CATEGORY_META]?.label || "Uncategorized"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Type</span>
                            <div className="text-right">
                              <span className="text-slate-900 dark:text-white font-bold capitalize block">{reportType} Report</span>
                              {reportType === 'area' && data.societyName && (
                                <span className="text-[10px] text-primary-500 font-bold uppercase tracking-widest">{data.societyName}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Ward</span>
                            <span className="text-slate-900 dark:text-white font-bold">{data.location.ward || "Unknown Ward"}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Evidence</span>
                            <span className="text-slate-900 dark:text-white font-bold">{files.length} Photo{files.length !== 1 ? 's' : ''} Attached</span>
                          </div>
                        </div>

                      </div>
                      
                      <div className="mt-12 flex items-center gap-4">
                        <button
                          onClick={() => setStep(step - 1)}
                          className="flex-1 py-6 rounded-[24px] flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest bg-slate-100 dark:bg-white/5 text-slate-400 hover:bg-slate-200 transition-all duration-300"
                        >
                          <ChevronLeft size={20} />
                          Back
                        </button>
                        <button
                          onClick={handleSubmit}
                          className="flex-[2] py-6 rounded-[24px] flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest bg-[#f59e0b] text-white shadow-[0_20px_40px_rgba(0,209,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                        >
                          SUBMIT REPORT
                          <Send size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div key="step5" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center text-center py-10">
                    <div className="w-24 h-24 rounded-[32px] bg-emerald-500/20 flex items-center justify-center text-5xl mb-6 shadow-glow-emerald animate-bounce">✅</div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Report Submitted!</h2>
                    <p className="text-slate-500 mb-10 max-w-sm text-sm">Your civic contribution has been registered. You'll receive real-time updates as we work on this.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                      <Button 
                        className="flex-1" 
                        size="lg" 
                        glow 
                        onClick={() => navigate(`/complaints/track/${submittedId}`)}
                      >
                        Track Your Report
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 border-slate-200 dark:border-white/10" 
                        size="lg" 
                        onClick={() => navigate('/dashboard/citizen')}
                      >
                        Go to Dashboard
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>


            </Card>
          </div>

          {/* Sidebar Area matching screenshot */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-10 rounded-[48px] border-slate-100 bg-white shadow-xl">
              <h3 className="text-sm font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Info size={18} className="text-[#f59e0b]" /> PRO TIPS
              </h3>
              <ul className="space-y-4">
                {[
                  { icon: <Clock size={14} />, text: 'Reporting early helps prevent issue escalation.' },
                  { icon: <ImageIcon size={14} />, text: 'Multiple angles in photos help officers locate the exact spot.' },
                  { icon: <Award size={14} />, text: 'Top contributors earn "Civic Ambassador" badges.' },
                ].map((tip, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="text-slate-400 shrink-0 mt-1">{tip.icon}</span>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-black opacity-60">{tip.text}</p>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-10 rounded-[48px] border-transparent bg-[#e0f7fa]/50 backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Shield size={20} className="text-[#f59e0b]" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Safe Community</h3>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-black opacity-60">
                UnIgnored is a platform for genuine public concern. All submissions are monitored. 
                Spam or false reporting may result in account suspension.
              </p>
            </Card>
          </div>
        </div>
      </div>
      <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
    </div>
  )
}

