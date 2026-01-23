export enum Speciality {
  GeneralPhysician = "General Physician",
  Cardiologist = "Cardiologist",
  Dermatologist = "Dermatologist",
  Pediatrician = "Pediatrician",
  Neurologist = "Neurologist",
  Dentist = "Dentist",
  Orthopedic = "Orthopedic",
  Gynecologist = "Gynecologist"
}

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface Doctor {
  id: string;
  name: string;
  speciality: Speciality;
  experience: number;
  location: string;
  clinicName: string;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  availableSlots: string[];
  imageUrl: string;
  isVideoAvailable: boolean;
  about: string;
}

export interface Medicine {
  id: string;
  name: string;
  manufacturer: string; // Used as category/description in UI
  price: number;
  type: 'Tablet' | 'Syrup' | 'Injection' | 'Cream' | 'Supplements' | 'Antibiotics';
  description: string;
  prescriptionRequired: boolean;
  imageUrl: string; // Placeholder color or image
}

export interface LabTest {
  id: string;
  name: string;
  category: string;
  price: number;
  turnaroundTime: string; 
  preparation: string;
  certified: boolean;
  homePickup: boolean;
}

export interface HealthRecord {
  id: string;
  title: string;
  date: string;
  type: 'Prescription' | 'Report' | 'Invoice';
  fileUrl: string;
  size: string;
}

export interface CartItem {
  id: string;
  type: 'medicine' | 'test';
  itemId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  type: 'Clinic Visit' | 'Video Consult';
  status: 'Confirmed' | 'Completed' | 'Cancelled' | 'Pending';
  paymentStatus: 'Paid' | 'Pending';
}

export interface Clinic {
  id: string;
  name: string;
  type: 'Hospital' | 'Clinic';
  rating: number;
  address: string;
  distance: string;
  timings: string;
  phone: string;
  imageColor: string; // For placeholder UI
  tags: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  bloodGroup: string;
  age: number;
  height: string;
  weight: string;
  emergencyContact: string;
  bmi: number;
  bp: string;
  heartRate: string;
}

export interface AdminUser {
  id: string;
  name: string;
  role: 'Doctor' | 'Patient' | 'Admin';
  email: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  date: string;
}

export interface ConsultationHistoryItem {
  id: string;
  doctor: string;
  date: string;
  type: 'Chat' | 'Video';
  status: 'Completed' | 'Pending' | 'Cancelled';
  duration: string;
}
