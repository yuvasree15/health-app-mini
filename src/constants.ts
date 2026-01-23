import { Doctor, Medicine, LabTest, Speciality, Clinic, UserProfile, Appointment, AdminUser, ActivityLog } from './types';

export const MOCK_USER: UserProfile = {
  name: "Yuvashree",
  email: "yuva@gmail.com",
  phone: "+91 6369151414",
  dob: "12-04-2005",
  address: "24 ragavendra nagar,villivakkam,chennai-600049",
  bloodGroup: "B+",
  age: 20,
  height: "125 cm",
  weight: "55 kg",
  emergencyContact: "Srimathi (+91 9884980015)",
  bmi: 22.4,
  bp: "120/80",
  heartRate: "72 bpm"
};

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    doctorId: 'd1',
    doctorName: 'Dr. Aarav Patel',
    date: '7 Dec',
    time: '06:00 PM',
    type: 'Clinic Visit',
    status: 'Confirmed',
    paymentStatus: 'Paid'
  },
  {
    id: 'a2',
    doctorId: 'd1',
    doctorName: 'Dr. Aarav Patel',
    date: '7 Dec',
    time: '11:30 AM',
    type: 'Clinic Visit',
    status: 'Confirmed',
    paymentStatus: 'Paid'
  },
  {
    id: 'a3',
    doctorId: 'd2',
    doctorName: 'Dr. Priya Sharma',
    date: '15 Nov',
    time: '09:00 AM',
    type: 'Video Consult',
    status: 'Completed',
    paymentStatus: 'Paid'
  }
];

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Aarav Patel',
    speciality: Speciality.Cardiologist,
    experience: 11,
    location: 'Mumbai, MH',
    clinicName: 'Heart Care Clinic',
    rating: 4.9,
    reviewCount: 124,
    consultationFee: 1500,
    availableSlots: ['10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM'],
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav',
    isVideoAvailable: false,
    about: "Senior Interventional Cardiologist with expertise in complex angioplasties and heart failure..."
  },
  {
    id: 'd2',
    name: 'Dr. Rajesh Iyer',
    speciality: Speciality.Neurologist,
    experience: 22,
    location: 'Bangalore, KA',
    clinicName: 'Neuro Health',
    rating: 4.9,
    reviewCount: 310,
    consultationFee: 2000,
    availableSlots: ['11:00 AM', '12:00 PM', '5:00 PM'],
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
    isVideoAvailable: false,
    about: "Expert in stroke management, epilepsy, and movement disorders with over two decades of..."
  },
  {
    id: 'd3',
    name: 'Dr. Vikram Singh',
    speciality: Speciality.Orthopedic,
    experience: 11,
    location: 'Chandigarh',
    clinicName: 'Bone & Joint Clinic',
    rating: 4.6,
    reviewCount: 200,
    consultationFee: 1200,
    availableSlots: ['09:00 AM', '4:00 PM'],
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
    isVideoAvailable: false,
    about: "Specializes in joint replacement surgery, sports injuries, and arthroscopy."
  },
  {
    id: 'd4',
    name: 'Dr. Priya Sharma',
    speciality: Speciality.Dermatologist,
    experience: 10,
    location: 'New Delhi, DL',
    clinicName: 'Skin Glow Center',
    rating: 4.8,
    reviewCount: 89,
    consultationFee: 800,
    availableSlots: ['09:00 AM', '10:00 AM', '3:00 PM'],
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    isVideoAvailable: false,
    about: "Cosmetic dermatologist specializing in laser treatments, acne management, and anti-aging..."
  },
  {
    id: 'd5',
    name: 'Dr. Sneha Gupta',
    speciality: Speciality.Pediatrician,
    experience: 12,
    location: 'Pune, MH',
    clinicName: 'Little Steps',
    rating: 4.7,
    reviewCount: 150,
    consultationFee: 700,
    availableSlots: ['10:00 AM', '1:00 PM', '3:30 PM'],
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
    isVideoAvailable: false,
    about: "Compassionate child specialist focusing on newborn care, vaccination, and adolescent..."
  },
  {
    id: 'd6',
    name: 'Dr. Meera Reddy',
    speciality: Speciality.Gynecologist,
    experience: 14,
    location: 'Hyderabad, TS',
    clinicName: 'Women Wellness',
    rating: 4.8,
    reviewCount: 180,
    consultationFee: 900,
    availableSlots: ['11:00 AM', '02:00 PM'],
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meera',
    isVideoAvailable: false,
    about: "Expert in high-risk pregnancies, infertility treatments, and laparoscopic surgeries."
  }
];

export const MOCK_MEDICINES: Medicine[] = [
  {
    id: 'm1',
    name: 'Paracetamol',
    manufacturer: 'Pain Relief',
    price: 50,
    type: 'Tablet',
    description: 'Pain reliever and fever reducer',
    prescriptionRequired: false,
    imageUrl: 'bg-blue-100'
  },
  {
    id: 'm2',
    name: 'Amoxicillin',
    manufacturer: 'Antibiotics',
    price: 120,
    type: 'Tablet',
    description: 'Antibiotic for bacterial infections',
    prescriptionRequired: true,
    imageUrl: 'bg-green-100'
  },
  {
    id: 'm3',
    name: 'Ibuprofen',
    manufacturer: 'Pain Relief',
    price: 80,
    type: 'Tablet',
    description: 'Anti-inflammatory painkiller',
    prescriptionRequired: false,
    imageUrl: 'bg-red-100'
  },
  {
    id: 'm4',
    name: 'Vitamin D3',
    manufacturer: 'Supplements',
    price: 200,
    type: 'Tablet',
    description: 'Supplement for bone health',
    prescriptionRequired: false,
    imageUrl: 'bg-yellow-100'
  },
  {
    id: 'm5',
    name: 'Omeprazole',
    manufacturer: 'Digestive Health',
    price: 150,
    type: 'Tablet',
    description: 'For acid reflux and ulcers',
    prescriptionRequired: true,
    imageUrl: 'bg-purple-100'
  }
];

export const MOCK_LAB_TESTS: LabTest[] = [
  {
    id: 't1',
    name: 'Complete Blood Count (CBC)',
    category: 'Blood Tests',
    price: 500,
    turnaroundTime: '24 Hours',
    preparation: 'No fasting required',
    certified: true,
    homePickup: true
  },
  {
    id: 't2',
    name: 'Lipid Profile',
    category: 'Cardiac Tests',
    price: 800,
    turnaroundTime: '24 Hours',
    preparation: '12 hours fasting',
    certified: true,
    homePickup: true
  },
  {
    id: 't3',
    name: 'Thyroid Function Test',
    category: 'Hormone Tests',
    price: 600,
    turnaroundTime: '48 Hours',
    preparation: 'Morning sample preferred',
    certified: true,
    homePickup: true
  },
  {
    id: 't4',
    name: 'Blood Sugar Test',
    category: 'Diabetes Tests',
    price: 300,
    turnaroundTime: '12 Hours',
    preparation: 'Fasting glucose levels',
    certified: true,
    homePickup: true
  },
  {
    id: 't5',
    name: 'X-Ray Chest',
    category: 'Radiology',
    price: 1000,
    turnaroundTime: '2 Hours',
    preparation: 'Chest X-ray for respiratory issues',
    certified: true,
    homePickup: false
  }
];

export const MOCK_CLINICS: Clinic[] = [
  {
    id: 'c1',
    name: 'City General Hospital',
    type: 'Hospital',
    rating: 4.8,
    address: 'Mumbai Central',
    distance: '2.5km away',
    timings: '24/7',
    phone: '+91 9876543210',
    imageColor: 'bg-purple-100',
    tags: ['Cardiology', 'Neurology', 'Orthopedics']
  },
  {
    id: 'c2',
    name: 'Delhi Skin Care Clinic',
    type: 'Clinic',
    rating: 4.6,
    address: 'Connaught Place, Delhi',
    distance: '1.8km away',
    timings: '9 AM - 8 PM',
    phone: '+91 9876543211',
    imageColor: 'bg-pink-100',
    tags: ['Dermatology']
  },
  {
    id: 'c3',
    name: 'Bangalore Children\'s Hospital',
    type: 'Hospital',
    rating: 4.9,
    address: 'Jayanagar, Bangalore',
    distance: '3.2km away',
    timings: '24/7',
    phone: '+91 9876543212',
    imageColor: 'bg-blue-100',
    tags: ['Pediatrics', 'Neonatology']
  }
];

export const MOCK_ADMIN_USERS: AdminUser[] = [
  { id: '#2401', name: 'Dr. Wilson', role: 'Doctor', email: 'wilson@clinic.com', status: 'Active', joinDate: '2023-10-01' },
  { id: '#2402', name: 'Sarah Jones', role: 'Patient', email: 'sarah.j@email.com', status: 'Active', joinDate: '2023-11-15' },
  { id: '#2403', name: 'James Smith', role: 'Patient', email: 'james.s@email.com', status: 'Inactive', joinDate: '2023-09-20' },
  { id: '#2404', name: 'Dr. Emily Chen', role: 'Doctor', email: 'echen@hospital.com', status: 'Active', joinDate: '2023-08-05' },
  { id: '#2405', name: 'Michael Brown', role: 'Patient', email: 'mbrown@email.com', status: 'Active', joinDate: '2023-12-01' },
  { id: '#2406', name: 'Dr. A. Gupta', role: 'Doctor', email: 'agupta@clinic.com', status: 'Active', joinDate: '2023-07-22' },
];

export const MOCK_ACTIVITY_LOG: ActivityLog[] = [
  { id: '1', user: 'User #2401', action: 'Booked an appointment with Dr. Wilson', date: '2 mins ago' },
  { id: '2', user: 'User #2402', action: 'Updated profile information', date: '15 mins ago' },
  { id: '3', user: 'User #2403', action: 'Uploaded a lab report', date: '1 hour ago' },
  { id: '4', user: 'User #2404', action: 'Cancelled appointment #A102', date: '3 hours ago' },
  { id: '5', user: 'User #2405', action: 'Registered new account', date: '5 hours ago' },
];