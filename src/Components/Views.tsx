import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Star, Video, ShoppingCart, Plus, Upload, Trash2,
  Activity, Filter, Info, ShieldCheck, Clock, FileText, ChevronRight,
  Calendar, Lock, Mail, User, Home, Download, MessageSquare, Phone, TestTube2, Edit2, Check,
  Users, AlertTriangle, Activity as ActivityIcon, MoreVertical, ToggleLeft, ToggleRight, Save, Settings, Bell, X, Send
} from 'lucide-react';
import { MOCK_DOCTORS, MOCK_MEDICINES, MOCK_LAB_TESTS, MOCK_CLINICS, MOCK_APPOINTMENTS, MOCK_USER, MOCK_ADMIN_USERS, MOCK_ACTIVITY_LOG } from '../constants';
import { Doctor, Medicine, LabTest, CartItem, HealthRecord, Clinic, UserProfile, Appointment, UserRole, AdminUser, ConsultationHistoryItem } from '../types';
import { BookingModal, PaymentModal } from './Modals';
import { getDoctorChatResponse } from '../service/geminiService';

// --- Shared Components ---
const SectionHeader: React.FC<{ title: string, subtitle?: string, children?: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="mb-6">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  </div>
);

// --- Admin Dashboard View ---
export const AdminDashboardView: React.FC = () => {
  return (
    <div>
      <SectionHeader title="Admin Panel" subtitle="System Overview" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
           <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Users</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">2,543</h2>
              <div className="flex gap-2">
                 <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">Doctors: 45</span>
                 <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">Patients: 2,498</span>
              </div>
           </div>
           <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
              <Users size={24} />
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
           <div>
              <p className="text-gray-500 text-sm font-medium mb-1">System Health</p>
              <h2 className="text-3xl font-bold text-green-600 mb-2">98%</h2>
              <p className="text-gray-400 text-xs">All services operational</p>
           </div>
           <div className="bg-green-100 p-3 rounded-xl text-green-600">
              <ActivityIcon size={24} />
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
           <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Reports</p>
              <h2 className="text-3xl font-bold text-orange-600 mb-2">12</h2>
              <p className="text-gray-400 text-xs">Requires attention</p>
           </div>
           <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
              <AlertTriangle size={24} />
           </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-900">Recent Activity Log</h3>
            <button className="text-primary-600 text-sm font-medium hover:underline">View All</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-gray-50">
                  <tr>
                     <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                     <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Action</th>
                     <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Date</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {MOCK_ACTIVITY_LOG.map((log) => (
                     <tr key={log.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{log.user}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{log.action}</td>
                        <td className="px-6 py-4 text-sm text-gray-400 text-right">{log.date}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

// --- Admin User Management View ---
export const AdminUserManagementView: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Doctors' | 'Patients'>('All');

  const filteredUsers = MOCK_ADMIN_USERS.filter(user => {
    const matchesFilter = user.name.toLowerCase().includes(filter.toLowerCase()) || user.email.toLowerCase().includes(filter.toLowerCase());
    if (activeTab === 'All') return matchesFilter;
    if (activeTab === 'Doctors') return matchesFilter && user.role === 'Doctor';
    if (activeTab === 'Patients') return matchesFilter && user.role === 'Patient';
    return matchesFilter;
  });

  return (
    <div>
      <SectionHeader title="User Management" subtitle="Manage doctors, patients, and administrators" />
      
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex bg-gray-100 p-1 rounded-xl">
            {['All', 'Doctors', 'Patients'].map(tab => (
               <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
               >
                  {tab}
               </button>
            ))}
         </div>
         <div className="relative w-full md:w-auto flex-1 md:max-w-md">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
               type="text" 
               placeholder="Search by name or email..." 
               className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 outline-none focus:border-primary-500 text-sm"
               value={filter}
               onChange={(e) => setFilter(e.target.value)}
            />
         </div>
         <button className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-primary-700 transition shadow-md shadow-primary-200 whitespace-nowrap">
            <Plus size={16} /> Add User
         </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-gray-50">
                  <tr>
                     <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User Name</th>
                     <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                     <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                     <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                     <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                     <tr key={user.id} className="hover:bg-gray-50 transition group">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${user.role === 'Doctor' ? 'bg-primary-500' : 'bg-blue-500'}`}>
                                 {user.name.charAt(0)}
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                 <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded-md text-xs font-medium ${user.role === 'Doctor' ? 'bg-purple-100 text-purple-700' : user.role === 'Admin' ? 'bg-gray-800 text-white' : 'bg-blue-100 text-blue-700'}`}>
                              {user.role}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`flex items-center gap-1.5 text-sm ${user.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                              {user.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{user.joinDate}</td>
                        <td className="px-6 py-4 text-right">
                           <button className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition">
                              <MoreVertical size={16} />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

// --- Admin Settings View ---
export const AdminSettingsView: React.FC = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [registrations, setRegistrations] = useState(true);

  return (
    <div>
      <SectionHeader title="System Settings" subtitle="Configure platform preferences and controls" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* General Settings */}
         <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
               <Settings size={20} className="text-gray-500" /> General Configuration
            </h3>
            
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">System Name</label>
                  <input type="text" defaultValue="MediConnect" className="w-full p-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                  <input type="email" defaultValue="support@mediconnect.com" className="w-full p-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
               </div>
               
               <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                     <p className="font-medium text-gray-900 text-sm">Maintenance Mode</p>
                     <p className="text-xs text-gray-500">Disable access for non-admin users</p>
                  </div>
                  <button 
                     onClick={() => setMaintenanceMode(!maintenanceMode)}
                     className={`text-2xl transition-colors ${maintenanceMode ? 'text-primary-600' : 'text-gray-300'}`}
                  >
                     {maintenanceMode ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                  </button>
               </div>

               <div className="py-2 flex items-center justify-between">
                  <div>
                     <p className="font-medium text-gray-900 text-sm">Allow New Registrations</p>
                     <p className="text-xs text-gray-500">Enable new user signups</p>
                  </div>
                  <button 
                     onClick={() => setRegistrations(!registrations)}
                     className={`text-2xl transition-colors ${registrations ? 'text-primary-600' : 'text-gray-300'}`}
                  >
                     {registrations ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                  </button>
               </div>
            </div>
            
            <button className="mt-6 w-full bg-primary-600 text-white py-2.5 rounded-xl font-medium hover:bg-primary-700 transition flex items-center justify-center gap-2">
               <Save size={18} /> Save Changes
            </button>
         </div>

         {/* Admin Accounts */}
         <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                   <ShieldCheck size={20} className="text-gray-500" /> Admin Accounts
                </h3>
                <button className="text-primary-600 text-sm font-medium hover:underline flex items-center gap-1">
                   <Plus size={14} /> Add Admin
                </button>
             </div>

             <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-bold">SA</div>
                      <div>
                         <p className="text-sm font-bold text-gray-900">System Admin</p>
                         <p className="text-xs text-gray-500">Super Admin</p>
                      </div>
                   </div>
                   <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-md">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold">JD</div>
                      <div>
                         <p className="text-sm font-bold text-gray-900">John Doe</p>
                         <p className="text-xs text-gray-500">Support Lead</p>
                      </div>
                   </div>
                   <button className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
             </div>
         </div>
      </div>
    </div>
  );
};

// --- Notifications View (NEW) ---
export const NotificationsView: React.FC = () => {
  const notifications = [
    { id: 1, title: 'Appointment Confirmed', message: 'Your appointment with Dr. Aarav Patel is confirmed for tomorrow.', time: '2 hours ago', unread: true },
    { id: 2, title: 'Lab Results Available', message: 'Your blood test results are now available for download.', time: '1 day ago', unread: false },
    { id: 3, title: 'Prescription Refill', message: 'Time to refill your Vitamin D3 supplement.', time: '2 days ago', unread: false },
  ];

  return (
    <div>
      <SectionHeader title="Notifications" subtitle="Stay updated with your health alerts" />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {notifications.map((n) => (
          <div key={n.id} className={`p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition ${n.unread ? 'bg-blue-50/50' : ''}`}>
             <div className="flex gap-4">
               <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.unread ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                 <Bell size={20} />
               </div>
               <div className="flex-1">
                 <h4 className={`text-sm font-bold ${n.unread ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</h4>
                 <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                 <p className="text-xs text-gray-400 mt-2">{n.time}</p>
               </div>
               {n.unread && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Patients View (NEW) ---
export const PatientsView: React.FC = () => {
   // Mock patients for Doctor view
   const patients = [
     { id: '1', name: 'Yuvashree', age: 20, gender: 'Female', lastVisit: '2 days ago', condition: 'Hypertension', status: 'Stable' },
     { id: '2', name: 'Nivasini', age: 20, gender: 'Female', lastVisit: '1 week ago', condition: 'Routine Checkup', status: 'Recovered' },
     { id: '3', name: 'Vidhya Lakshmi', age: 25, gender: 'Female', lastVisit: '3 weeks ago', condition: 'Post-Op Care', status: 'Critical' },
   ];

   return (
    <div>
       <SectionHeader title="My Patients" subtitle="Manage your patient records" />
       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-gray-50">
                <tr>
                   <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Name</th>
                   <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Age/Gender</th>
                   <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Condition</th>
                   <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Last Visit</th>
                   <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                   <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Action</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
               {patients.map(p => (
                 <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.age} / {p.gender}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.condition}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{p.lastVisit}</td>
                    <td className="px-6 py-4">
                       <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.status === 'Critical' ? 'bg-red-100 text-red-600' : p.status === 'Recovered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                         {p.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="text-primary-600 text-sm font-medium hover:underline">View</button>
                    </td>
                 </tr>
               ))}
             </tbody>
          </table>
       </div>
    </div>
   );
};

// --- Login View ---
export const LoginView: React.FC<{ onLogin: (role: UserRole) => void }> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>('patient');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={32} className="text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-primary-600 mb-1">Welcome Back</h2>
        <p className="text-center text-gray-400 mb-8">Sign in to manage your health</p>

        <div className="bg-primary-50 p-1 rounded-xl flex mb-6">
          <button 
            onClick={() => setRole('patient')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${role === 'patient' ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-400 hover:text-primary-600'}`}
          >
            PATIENT
          </button>
          <button 
            onClick={() => setRole('doctor')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${role === 'doctor' ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-400 hover:text-primary-600'}`}
          >
            DOCTOR
          </button>
          <button 
            onClick={() => setRole('admin')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${role === 'admin' ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-400 hover:text-primary-600'}`}
          >
            ADMIN
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input type="email" defaultValue={role === 'admin' ? 'admin@healthplus.com' : role === 'doctor' ? 'dr.aarav@healthplus.com' : 'rahul@gmail.com'} className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input type="password" defaultValue="........" className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
            </div>
          </div>
          
          <div className="text-right">
             <a href="#" className="text-sm text-primary-400 hover:text-primary-600">Forgot Password?</a>
          </div>

          <button onClick={() => onLogin(role)} className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-200 flex items-center justify-center gap-2">
            Sign In as {role.charAt(0).toUpperCase() + role.slice(1)} <ChevronRight size={18} />
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account? <a href="#" className="text-primary-400 font-semibold hover:text-primary-600">Create Account</a>
        </p>
      </div>
    </div>
  );
};

// --- Dashboard View ---
export const DashboardView: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
  const navigate = useNavigate();
  const upcomingAppointments = MOCK_APPOINTMENTS.filter(a => a.status === 'Confirmed');

  if (userRole === 'admin') {
    return <AdminDashboardView />;
  }

  let greetingName = MOCK_USER.name;
  let bannerMessage = "Welcome to your health dashboard. You can manage your appointments, find specialists, and track your medical history here.";

  if (userRole === 'doctor') {
    greetingName = "Dr. Aarav Patel";
    bannerMessage = "Welcome back, Doctor. You have 4 upcoming appointments today. Your schedule looks busy.";
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-[#5b21b6] rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Hello, {greetingName}</h1>
          <p className="text-primary-100 mb-6 text-sm md:text-base leading-relaxed">
            {bannerMessage}
          </p>
          {userRole === 'patient' && (
            <button 
              onClick={() => navigate('/doctors')}
              className="bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition shadow-md"
            >
              Book New Appointment
            </button>
          )}
          {userRole === 'doctor' && (
            <button 
              onClick={() => navigate('/appointments')}
              className="bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition shadow-md"
            >
              View Schedule
            </button>
          )}
        </div>
        {/* Background Graphic */}
        <div className="absolute top-0 right-0 h-full w-1/2 opacity-10 pointer-events-none">
           <svg viewBox="0 0 100 100" className="h-full w-full" fill="currentColor">
              <path d="M0 50 Q 25 25 50 50 T 100 50" stroke="white" strokeWidth="2" fill="none" />
              <path d="M0 60 Q 25 35 50 60 T 100 60" stroke="white" strokeWidth="2" fill="none" />
           </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointment */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
              <Calendar className="text-primary-600" size={20} /> 
              {userRole === 'doctor' ? "Today's Schedule" : "Upcoming Appointment"}
            </h3>
            <button onClick={() => navigate('/appointments')} className="text-sm text-primary-600 font-medium hover:underline">View all</button>
          </div>
          
          <div className="border border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50">
            {upcomingAppointments.length > 0 ? (
               <div className="w-full text-left">
                  {upcomingAppointments.slice(0,1).map(apt => (
                    <div key={apt.id} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 font-bold">
                         {apt.date.split(' ')[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{apt.doctorName}</h4>
                        <p className="text-sm text-gray-500">{apt.type} • {apt.time}</p>
                      </div>
                      <span className="ml-auto px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        {apt.status}
                      </span>
                    </div>
                  ))}
               </div>
            ) : (
              <>
                <Calendar size={32} className="text-gray-300 mb-2" />
                <p className="text-gray-400 text-sm">No upcoming appointments scheduled.</p>
              </>
            )}
          </div>
        </div>

        {/* Health Status / Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
             <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800 mb-4">
               <Activity className="text-orange-500" size={20} /> 
               {userRole === 'patient' ? "Health Status" : "Quick Stats"}
             </h3>
             <div className="space-y-4">
               {userRole === 'patient' ? (
                 <>
                   <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                     <span className="text-gray-500 text-sm">BMI</span>
                     <span className="font-bold text-gray-900">{MOCK_USER.bmi}</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                     <span className="text-gray-500 text-sm">Blood Pressure</span>
                     <span className="font-bold text-gray-900">{MOCK_USER.bp}</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                     <span className="text-gray-500 text-sm">Heart Rate</span>
                     <span className="font-bold text-gray-900">{MOCK_USER.heartRate}</span>
                   </div>
                 </>
               ) : (
                 <>
                   <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                     <span className="text-gray-500 text-sm">New Patients</span>
                     <span className="font-bold text-gray-900">12</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                     <span className="text-gray-500 text-sm">Consultations</span>
                     <span className="font-bold text-gray-900">45</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                     <span className="text-gray-500 text-sm">Pending Reports</span>
                     <span className="font-bold text-gray-900">3</span>
                   </div>
                 </>
               )}
             </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
             <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
               <Info size={18} /> {userRole === 'patient' ? 'Reminders' : 'System Alerts'}
             </h3>
             <p className="text-sm text-blue-700 leading-relaxed">
               {userRole === 'patient' 
                 ? "It's flu season! Don't forget to ask your doctor about the annual flu shot during your next visit."
                 : "Server maintenance scheduled for Sunday 2:00 AM. Please ensure all reports are saved."
               }
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Find Doctor View ---
export const DoctorsView: React.FC<{ onAddAppointment: (appointment: Appointment) => void }> = ({ onAddAppointment }) => {
  const [filter, setFilter] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Doctor | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showDoctorDetails, setShowDoctorDetails] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'Clinic Visit' | 'Video Consult'>('Clinic Visit');
  
  const filteredDocs = MOCK_DOCTORS.filter(d => 
    d.name.toLowerCase().includes(filter.toLowerCase()) || 
    d.speciality.toLowerCase().includes(filter.toLowerCase()) || 
    d.location.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <SectionHeader title="Find a Specialist" subtitle="Book appointments with top doctors near you" />
      
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
           <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
           <input 
             type="text" 
             placeholder="Search doctor name or keyword..." 
             className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 outline-none focus:border-primary-500"
             value={filter}
             onChange={(e) => setFilter(e.target.value)}
           />
        </div>
        <div className="flex-1 relative">
           <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
           <input type="text" placeholder="Enter symptoms (e.g., chest pain...)" className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 outline-none focus:border-primary-500" />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 bg-white">
          <Filter size={18} /> All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex gap-4 mb-4">
               <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold text-primary-700 bg-primary-100`}>
                  {doc.name.split(' ').map(n=>n[0]).join('').substring(0,3).toUpperCase()}
               </div>
               <div>
                 <h3 className="font-bold text-primary-700 text-lg">{doc.name}</h3>
                 <p className="text-gray-500 text-sm">{doc.speciality}</p>
                 <div className="flex items-center gap-1 mt-1">
                   <Star size={14} className="text-yellow-400 fill-current" />
                   <span className="text-sm font-bold text-gray-900">{doc.rating}</span>
                   <span className="text-xs text-gray-400">({doc.experience} yrs exp)</span>
                 </div>
               </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
              {doc.about}
            </p>

            <div className="flex justify-between items-center mb-6 text-sm">
               <span className="flex items-center gap-1 text-gray-500"><MapPin size={14} /> {doc.location}</span>
               <span className="font-bold text-primary-700">₹{doc.consultationFee}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowDoctorDetails(doc)}
                className="py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200"
              >
                About Doctor
              </button>
              <button
                onClick={() => setSelectedDoc(doc)}
                className="py-2.5 rounded-xl bg-primary-600 text-white font-medium text-sm hover:bg-primary-700 flex items-center justify-center gap-2 shadow-lg shadow-primary-200"
              >
                <Calendar size={16} /> Book
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedDoc && (
        <BookingModal
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          doctorName={selectedDoc.name}
          slots={selectedDoc.availableSlots}
          fee={selectedDoc.consultationFee}
          onBook={(slot, type) => {
            setSelectedSlot(slot);
            setSelectedType(type === 'In-Clinic' ? 'Clinic Visit' : 'Video Consult');
            setShowPayment(true);
          }}
        />
      )}

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={selectedDoc?.consultationFee || 500}
        onSuccess={() => {
          if (selectedDoc) {
            const newAppointment: Appointment = {
              id: crypto.randomUUID(),
              doctorId: selectedDoc.id,
              doctorName: selectedDoc.name,
              date: 'Today', // You might want to make this dynamic
              time: selectedSlot,
              type: selectedType,
              status: 'Confirmed',
              paymentStatus: 'Paid'
            };
            onAddAppointment(newAppointment);
            setSelectedDoc(null);
            alert('Appointment booked successfully!');
          }
          setShowPayment(false);
          setSelectedSlot('');
          setSelectedType('Clinic Visit');
        }}
      />

      {/* Doctor Details Modal */}
      {showDoctorDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Doctor Details</h3>
              <button
                onClick={() => setShowDoctorDetails(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex gap-4 mb-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold text-primary-700 bg-primary-100`}>
                  {showDoctorDetails.name.split(' ').map(n=>n[0]).join('').substring(0,3).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-primary-700 text-xl">{showDoctorDetails.name}</h3>
                  <p className="text-gray-500 text-sm">{showDoctorDetails.speciality}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span className="text-sm font-bold text-gray-900">{showDoctorDetails.rating}</span>
                    <span className="text-xs text-gray-400">({showDoctorDetails.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{showDoctorDetails.about}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
                    <p className="text-gray-600 text-sm">{showDoctorDetails.experience} years</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                    <p className="text-gray-600 text-sm">{showDoctorDetails.location}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Clinic</h4>
                  <p className="text-gray-600 text-sm">{showDoctorDetails.clinicName}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Consultation Fee</h4>
                  <p className="text-primary-700 font-bold text-lg">₹{showDoctorDetails.consultationFee}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Available Services</h4>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">In-Clinic</span>
                    {showDoctorDetails.isVideoAvailable && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Video Consult</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowDoctorDetails(null);
                    setSelectedDoc(showDoctorDetails);
                  }}
                  className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Appointments View ---
export const AppointmentsView: React.FC<{ appointments: Appointment[], onCancel: (id: string) => void }> = ({ appointments, onCancel }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  const filteredAppointments = appointments.filter(apt => {
    if (activeTab === 'upcoming') return apt.status === 'Confirmed' || apt.status === 'Pending';
    return apt.status === 'Completed' || apt.status === 'Cancelled';
  });



  return (
    <div>
      <SectionHeader title="My Appointments" subtitle="Track your visits and scheduled consultations" />

      <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-xl w-fit border border-gray-100">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'upcoming' ? 'bg-[#0f766e] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Upcoming
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'history' ? 'bg-[#0f766e] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
        >
          History
        </button>
      </div>

      <div className="space-y-4">
        {filteredAppointments.length > 0 ? filteredAppointments.map(apt => (
           <div key={apt.id} className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex gap-4 items-center">
                 <div className="bg-gray-50 rounded-xl p-3 text-center min-w-[70px]">
                    <span className="block text-xl font-bold text-gray-800">{apt.date.split(' ')[0]}</span>
                    <span className="block text-xs font-semibold text-gray-400 uppercase">{apt.date.split(' ')[1]}</span>
                 </div>
                 <div>
                    <div className="flex items-center gap-2">
                       <h3 className="font-bold text-lg text-gray-900">{apt.doctorName}</h3>
                       <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                         {apt.status}
                       </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                       <span className="flex items-center gap-1"><Clock size={14} /> {apt.time}</span>
                       <span className="flex items-center gap-1"><MapPin size={14} /> {apt.type}</span>
                    </div>
                 </div>
              </div>
              
              {activeTab === 'upcoming' && (
                <div className="flex gap-3 justify-end">
                  <button onClick={() => onCancel(apt.id)} className="px-4 py-2 border border-red-100 text-red-500 font-medium rounded-lg text-sm hover:bg-red-50 bg-white">
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-[#0f766e] text-white font-medium rounded-lg text-sm hover:bg-[#115e59] shadow-sm">
                    Reschedule
                  </button>
                </div>
              )}
           </div>
        )) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
             <Calendar size={48} className="mx-auto text-gray-300 mb-2" />
             <p className="text-gray-500">No appointments found in this tab.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Clinic Finder View ---
export const ClinicFinderView: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  
  const filteredClinics = MOCK_CLINICS.filter(c => 
    c.name.toLowerCase().includes(filter.toLowerCase()) && 
    (typeFilter === 'All Types' || c.type + 's' === typeFilter || c.type === typeFilter)
  );

  return (
    <div>
      <SectionHeader title="Clinic & Hospital Finder" subtitle="Find nearby healthcare facilities" />
      
      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
             <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
             <input 
               type="text" 
               placeholder="Search clinics/hospitals..." 
               className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 outline-none focus:border-primary-500"
               value={filter}
               onChange={(e) => setFilter(e.target.value)}
             />
          </div>
          <div className="w-full md:w-48 relative">
             <Filter className="absolute left-3 top-3.5 text-gray-400" size={18} />
             <select 
               className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 outline-none appearance-none"
               value={typeFilter}
               onChange={(e) => setTypeFilter(e.target.value)}
             >
                <option>All Types</option>
                <option>Hospitals</option>
                <option>Clinics</option>
             </select>
          </div>
          <div className="w-full md:w-48 flex items-center px-4 border border-gray-200 rounded-xl bg-white">
             <span className="text-sm text-gray-500 mr-2">Max Dist:</span>
             <input type="range" className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClinics.map(clinic => (
          <div key={clinic.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition h-full flex flex-col">
             <div className="flex justify-between items-start mb-4">
                <div className="h-32 w-full bg-gray-50 rounded-xl mb-4 absolute top-0 left-0 -z-10 hidden"></div>
                <h3 className="font-bold text-lg text-primary-700">{clinic.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${clinic.type === 'Hospital' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                  {clinic.type}
                </span>
             </div>
             
             <div className="flex items-center gap-1 mb-6">
                <Star size={14} className="text-yellow-400 fill-current" />
                <span className="text-sm font-bold">{clinic.rating}</span>
             </div>

             <div className="space-y-3 text-sm text-gray-500 mb-6 flex-1">
                <div className="flex items-center gap-2">
                   <MapPin size={16} /> {clinic.address} • {clinic.distance}
                </div>
                <div className="flex items-center gap-2">
                   <Clock size={16} /> {clinic.timings}
                </div>
                <div className="flex items-center gap-2">
                   <Phone size={16} /> {clinic.phone}
                </div>
             </div>

             <div className="flex gap-2 flex-wrap">
                {clinic.tags.map(tag => (
                   <span key={tag} className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-md font-medium">
                     {tag}
                   </span>
                ))}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Medicine View ---
export const PharmacyView: React.FC<{ onAddToCart: (item: CartItem) => void; cart: CartItem[] }> = ({ onAddToCart, cart }) => {
  const [filter, setFilter] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const navigate = useNavigate();
  const filteredMeds = MOCK_MEDICINES.filter(m => m.name.toLowerCase().includes(filter.toLowerCase()));
  const medicineItemsInCart = cart.filter(i => i.type === 'medicine');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
         <div>
            <h1 className="text-2xl font-bold text-purple-600">Medicine Ordering</h1>
            <p className="text-gray-500">Order medicines online with prescription upload</p>
         </div>
         <button
           onClick={() => navigate('/cart')}
           className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg shadow-purple-200 hover:bg-purple-700 transition"
         >
           <ShoppingCart size={16} /> Cart ({medicineItemsInCart.length})
         </button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search medicines..." 
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="w-32 bg-white border border-gray-200 rounded-xl flex items-center justify-center font-medium">
          All
        </div>
      </div>

      <div className="flex gap-6 items-start">
         <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredMeds.map(med => (
                 <div key={med.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-lg text-purple-700">{med.name}</h3>
                    </div>
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wide mb-1">{med.manufacturer}</p>
                    <h4 className="text-purple-700 font-bold text-lg mb-4">₹{med.price}</h4>

                    <p className="text-gray-500 text-sm mb-6 flex-1">
                      {med.description}
                    </p>

                    <button
                      onClick={() => onAddToCart({id: crypto.randomUUID(), type: 'medicine', itemId: med.id, quantity: 1, price: med.price, name: med.name})}
                      className="w-full py-3 bg-[#a855f7] text-white rounded-xl font-medium hover:bg-[#9333ea] transition shadow-md shadow-purple-200 flex items-center justify-center gap-2"
                    >
                      <Plus size={18} /> Add to Cart
                    </button>
                 </div>
               ))}
            </div>
         </div>

         {/* Right Cart Summary Sidebar (Desktop) */}
         <div className="hidden lg:block w-80 bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-24">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Cart Summary</h3>
            {medicineItemsInCart.length === 0 ? (
               <p className="text-gray-500 text-sm">No medicines in cart</p>
            ) : (
               <>
                  <ul className="space-y-3 mb-6">
                    {medicineItemsInCart.map(item => (
                      <li key={item.id} className="text-sm flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-gray-700">{item.name}</span>
                        <span className="font-bold">₹{item.price}</span>
                      </li>
                    ))}
                    <li className="pt-2 flex justify-between font-bold text-lg border-t border-gray-100">
                      <span>Total</span>
                      <span>₹{medicineItemsInCart.reduce((acc, i) => acc + i.price, 0)}</span>
                    </li>
                  </ul>

                  {/* Proceed to Payment Button */}
                  <button
                     onClick={() => setShowPayment(true)}
                     className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-200"
                  >
                     Proceed to Payment
                  </button>
               </>
            )}
         </div>
      </div>

      {/* Mobile Cart Summary */}
      <div className="lg:hidden bg-white rounded-2xl border border-gray-100 p-6 mt-6">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Cart Summary</h3>
        {medicineItemsInCart.length === 0 ? (
          <p className="text-gray-500 text-sm">No medicines in cart</p>
        ) : (
          <>
            <ul className="space-y-3 mb-6">
              {medicineItemsInCart.map(item => (
                <li key={item.id} className="text-sm flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="font-bold">₹{item.price}</span>
                </li>
              ))}
              <li className="pt-2 flex justify-between font-bold text-lg border-t border-gray-100">
                <span>Total</span>
                <span>₹{medicineItemsInCart.reduce((acc, i) => acc + i.price, 0)}</span>
              </li>
            </ul>

            <button
              onClick={() => setShowPayment(true)}
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-200"
            >
              Proceed to Payment
            </button>
          </>
        )}
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={medicineItemsInCart.reduce((acc, i) => acc + i.price, 0)}
        onSuccess={() => {
          setShowPayment(false);
          alert('Medicines ordered successfully! (Mock)');
        }}
      />
    </div>
  );
};

// --- Lab Test View ---
export const LabsView: React.FC<{ onAddToCart: (item: CartItem) => void; cart: CartItem[] }> = ({ onAddToCart, cart }) => {
  const [filter, setFilter] = useState('');
  const [address, setAddress] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const filteredTests = MOCK_LAB_TESTS.filter(t => t.name.toLowerCase().includes(filter.toLowerCase()));
  const labItemsInCart = cart.filter(i => i.type === 'test');

  return (
    <div>
      <SectionHeader title="Lab Test Booking" />

      <div className="flex gap-6 items-start">
         <div className="flex-1">
            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="Search lab tests..." 
                className="w-full pl-4 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTests.map(test => (
                 <div key={test.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{test.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{test.preparation}</p>
                    
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-purple-700 font-bold text-lg">₹{test.price}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-4">{test.category}</p>
                    
                    {test.homePickup && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-4">
                        <Home size={12} className="text-orange-500" /> Home pickup available
                      </div>
                    )}

                    <button 
                      onClick={() => onAddToCart({id: crypto.randomUUID(), type: 'test', itemId: test.id, quantity: 1, price: test.price, name: test.name})}
                      className="w-full py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
                    >
                      Select Test
                    </button>
                 </div>
              ))}
            </div>
         </div>

         {/* Right Booking Summary Sidebar (Desktop) */}
         <div className="hidden lg:block w-80 bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-24">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Booking Summary</h3>
            {labItemsInCart.length === 0 ? (
               <p className="text-gray-500 text-sm">No tests selected</p>
            ) : (
               <>
                  <ul className="space-y-3 mb-6">
                    {labItemsInCart.map(item => (
                      <li key={item.id} className="text-sm flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-gray-700">{item.name}</span>
                        <span className="font-bold">₹{item.price}</span>
                      </li>
                    ))}
                    <li className="pt-2 flex justify-between font-bold text-lg border-t border-gray-100">
                      <span>Total</span>
                      <span>₹{labItemsInCart.reduce((acc, i) => acc + i.price, 0)}</span>
                    </li>
                  </ul>

                  {/* Address Input */}
                  <div className="mb-6">
                     <label className="block text-sm font-medium text-gray-700 mb-2">Test Location</label>
                     <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                        <input
                           type="text"
                           placeholder="Enter address for test collection"
                           value={address}
                           onChange={(e) => setAddress(e.target.value)}
                           className="w-full pl-9 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        />
                     </div>
                  </div>

                  {/* Proceed to Payment Button */}
                  <button
                     onClick={() => setShowPayment(true)}
                     disabled={!address.trim()}
                     className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     Proceed to Payment
                  </button>
               </>
            )}
         </div>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={labItemsInCart.reduce((acc, i) => acc + i.price, 0)}
        onSuccess={() => {
          setShowPayment(false);
          alert('Lab tests booked successfully! (Mock)');
        }}
      />
    </div>
  );
};

// --- Chat Consultation Component ---
const ChatConsultation: React.FC<{ doctor: Doctor; onEnd: (startTime: Date) => void }> = ({ doctor, onEnd }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: `Hello! I'm ${doctor.name}. How can I help you today?`, sender: 'doctor', time: '10:30 AM', type: 'message' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [startTime] = useState(new Date());
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      const patientMessage = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'patient',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'message'
      };
      setMessages(prev => [...prev, patientMessage]);
      const currentMessage = newMessage;
      setNewMessage('');
      setIsTyping(true);

      try {
        // Build conversation history for context
        const conversationHistory = messages.slice(1).map(msg => `${msg.sender}: ${msg.text}`).join('\n');

        const aiResponse = await getDoctorChatResponse(currentMessage, doctor.speciality, conversationHistory);

        const doctorResponse = {
          id: messages.length + 2,
          text: aiResponse,
          sender: 'doctor',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'message'
        };
        setMessages(prev => [...prev, doctorResponse]);
      } catch (error) {
        console.error('Error getting doctor response:', error);
        const fallbackResponse = {
          id: messages.length + 2,
          text: "Thank you for sharing that. I'm here to help. Please provide more details about your symptoms so I can assist you better.",
          sender: 'doctor',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'message'
        };
        setMessages(prev => [...prev, fallbackResponse]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const sendPrescription = () => {
    const prescriptionMessage = {
      id: messages.length + 1,
      text: "Prescription: Paracetamol 500mg, 2 tablets every 6 hours for pain relief. Ibuprofen 400mg, 1 tablet every 8 hours as needed. Please follow the dosage instructions and consult if symptoms persist.",
      sender: 'doctor',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'prescription'
    };
    setMessages([...messages, prescriptionMessage]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-primary-700 bg-white/20`}>
              {doctor.name.split(' ').map(n=>n[0]).join('').substring(0,3).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold">Chat Consultation</h3>
              <p className="text-sm text-primary-100">{doctor.name} • Online</p>
            </div>
          </div>
          <button
            onClick={() => onEnd(startTime)}
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition"
          >
            End Chat
          </button>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'doctor' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.type === 'prescription' ? 'bg-green-100 text-green-900 border border-green-200' : message.sender === 'doctor' ? 'bg-gray-100 text-gray-900' : 'bg-primary-600 text-white'}`}>
                {message.type === 'prescription' && (
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={16} className="text-green-600" />
                    <span className="text-xs font-bold text-green-700 uppercase">Prescription</span>
                  </div>
                )}
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">{message.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <button
              onClick={sendMessage}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition flex items-center gap-2"
            >
              <Send size={18} /> Send
            </button>
          </div>
          {/* Doctor Prescription Button */}
          <div className="flex justify-center">
            <button
              onClick={sendPrescription}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm font-medium"
            >
              <FileText size={16} /> Send Prescription Recommendation
            </button>
          </div>
        </div>

      </div>

    </div>

  );

};

// --- Health Records View ---
export const RecordsView: React.FC = () => {
  const [records, setRecords] = useState<HealthRecord[]>([
    { id: '1', title: 'Blood Pressure Medication', date: '01/09/2023', type: 'Prescription', fileUrl: '#', size: '1.2 MB' },
    { id: '2', title: 'Annual Health Checkup Report', date: '15/08/2023', type: 'Report', fileUrl: '#', size: '2.4 MB' }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newRecord: HealthRecord = {
        id: crypto.randomUUID(),
        title: file.name,
        date: new Date().toLocaleDateString('en-GB'),
        type: 'Report',
        fileUrl: '#',
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      };
      setRecords([newRecord, ...records]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-purple-600">Health Records</h1>
          <p className="text-gray-500 mt-1">Manage your prescriptions, reports, and test results</p>
        </div>
        <div className="relative">
          <input type="file" id="uploadBtn" className="hidden" onChange={handleFileUpload} />
          <label htmlFor="uploadBtn" className="bg-[#a855f7] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 cursor-pointer hover:bg-[#9333ea]">
            <Plus size={16} /> Upload Record
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {records.map((rec) => (
           <div key={rec.id} className={`rounded-2xl p-6 border ${rec.type === 'Prescription' ? 'bg-[#f0f9ff] border-blue-100' : 'bg-[#ecfdf5] border-green-100'}`}>
               <div className="flex items-start gap-3 mb-4">
                  <FileText className={`${rec.type === 'Prescription' ? 'text-blue-600' : 'text-green-600'} mt-1`} size={24} />
                  <div>
                     <h3 className="font-bold text-gray-900 text-lg">{rec.title}</h3>
                     <p className="text-gray-500 text-sm">{rec.type}</p>
                     <p className="text-gray-400 text-xs mt-1">{rec.date}</p>
                  </div>
               </div>
               <div className="flex gap-3 mt-4">
                  <button className="flex-1 bg-white border border-gray-200 py-2 rounded-xl text-gray-700 font-medium text-sm hover:bg-gray-50 flex items-center justify-center gap-2">
                     <div className="w-4 h-4 rounded-full border border-gray-500 flex items-center justify-center"><div className="w-2 h-2 bg-gray-500 rounded-full"></div></div> View
                  </button>
                  <button className="flex-1 bg-[#a855f7] text-white py-2 rounded-xl font-medium text-sm hover:bg-[#9333ea] flex items-center justify-center gap-2 shadow-md shadow-purple-200">
                     <Download size={16} /> Download
                  </button>
               </div>
           </div>
         ))}
      </div>
    </div>
  );
};

// --- Profile View ---
export const ProfileView: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(MOCK_USER);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
         <div>
            <h1 className="text-2xl font-bold text-gray-900">Account & Profile</h1>
            <p className="text-gray-500">Manage your personal data and system preferences</p>
         </div>
         <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700">Profile Information</button>
            <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-500">Settings</button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Left Col: Photo & Mini Cards */}
         <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 flex flex-col items-center text-center">
               <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-medium mb-4">
                  {user.name.split(' ').map(n => n[0]).join('')}
               </div>
               <h2 className="font-bold text-xl text-gray-900">{user.name}</h2>
               <p className="text-gray-500 text-sm mb-6">{user.email}</p>
               
               <div className="flex justify-between w-full px-4 pt-6 border-t border-gray-100">
                  <div className="text-center">
                     <p className="text-xs text-gray-400 uppercase font-bold">Blood Group</p>
                     <p className="text-green-600 font-bold">{user.bloodGroup}</p>
                  </div>
                  <div className="text-center">
                     <p className="text-xs text-gray-400 uppercase font-bold">Age</p>
                     <p className="text-gray-800 font-bold">{user.age}</p>
                  </div>
               </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
               <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <FileText className="text-[#0f766e]" size={18} /> Medical Records
               </h3>
               <div className="border border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center mb-4 cursor-pointer hover:bg-gray-50">
                  <Upload size={20} className="text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">Upload Report (PDF/JPG)</p>
               </div>
               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText size={16} className="text-[#0f766e]" />
                  <div className="flex-1 min-w-0">
                     <p className="text-xs font-medium truncate">Blood_Test_Report_May_2024.pdf</p>
                     <p className="text-[10px] text-gray-400">2024-05-15 • 2.4 MB</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Col: Details Form */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><User className="text-[#0f766e]" size={18}/> Personal Details</h3>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`text-sm px-3 py-1 rounded-lg font-medium flex items-center gap-1 transition ${isEditing ? 'bg-primary-600 text-white' : 'text-[#0f766e] bg-green-50'}`}
                  >
                    {isEditing ? <Check size={14} /> : <Edit2 size={14} />} {isEditing ? 'Save' : 'Edit Details'}
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
                     <input name="name" type="text" readOnly={!isEditing} value={user.name} onChange={handleInputChange} className={`w-full p-3 rounded-xl border border-gray-100 text-gray-700 text-sm ${!isEditing ? 'bg-gray-50' : 'bg-white ring-2 ring-primary-100'}`} />
                  </div>
                  <div>
                     <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                     <input name="email" type="text" readOnly={!isEditing} value={user.email} onChange={handleInputChange} className={`w-full p-3 rounded-xl border border-gray-100 text-gray-700 text-sm ${!isEditing ? 'bg-gray-50' : 'bg-white ring-2 ring-primary-100'}`} />
                  </div>
                  <div>
                     <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number</label>
                     <input name="phone" type="text" readOnly={!isEditing} value={user.phone} onChange={handleInputChange} className={`w-full p-3 rounded-xl border border-gray-100 text-gray-700 text-sm ${!isEditing ? 'bg-gray-50' : 'bg-white ring-2 ring-primary-100'}`} />
                  </div>
                  <div>
                     <label className="block text-xs font-semibold text-gray-500 mb-1">Date of Birth</label>
                     <input name="dob" type="text" readOnly={!isEditing} value={user.dob} onChange={handleInputChange} className={`w-full p-3 rounded-xl border border-gray-100 text-gray-700 text-sm ${!isEditing ? 'bg-gray-50' : 'bg-white ring-2 ring-primary-100'}`} />
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-xs font-semibold text-gray-500 mb-1">Address</label>
                     <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                        <input name="address" type="text" readOnly={!isEditing} value={user.address} onChange={handleInputChange} className={`w-full pl-9 p-3 rounded-xl border border-gray-100 text-gray-700 text-sm ${!isEditing ? 'bg-gray-50' : 'bg-white ring-2 ring-primary-100'}`} />
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
               <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-6"><ShieldCheck className="text-red-500" size={18}/> Medical Information</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-xs font-semibold text-gray-500 mb-1">Blood Group</label>
                     <select disabled={!isEditing} className={`w-full p-3 rounded-xl border border-gray-100 text-gray-700 text-sm appearance-none ${!isEditing ? 'bg-gray-50' : 'bg-white ring-2 ring-primary-100'}`}>
                        <option>O+</option>
                        <option>A+</option>
                        <option>B+</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-xs font-semibold text-gray-500 mb-1">Emergency Contact</label>
                     <input type="text" readOnly={!isEditing} defaultValue={MOCK_USER.emergencyContact} className={`w-full p-3 rounded-xl border border-gray-100 text-gray-700 text-sm ${!isEditing ? 'bg-gray-50' : 'bg-white ring-2 ring-primary-100'}`} />
                  </div>
                  <div>
                     <label className="block text-xs font-semibold text-gray-500 mb-1">Allergies</label>
                     <input type="text" readOnly={!isEditing} placeholder="None" className={`w-full p-3 rounded-xl border border-gray-100 text-gray-700 text-sm ${!isEditing ? 'bg-gray-50' : 'bg-white ring-2 ring-primary-100'}`} />
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- Cart View ---
export const CartView: React.FC<{ cart: CartItem[], onRemove: (id: string) => void }> = ({ cart, onRemove }) => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const finalTotal = total + Math.round(total * 0.05);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
           <ShoppingCart size={48} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="Shopping Cart" subtitle="Review your selected medicines and tests" />
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.type === 'medicine' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                  {item.type === 'medicine' ? <ShoppingCart size={20} /> : <TestTube2 size={20} />}
                </div>
                <div>
                   <h3 className="font-bold text-gray-900">{item.name}</h3>
                   <p className="text-sm text-gray-500 capitalize">{item.type} • Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                 <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                 <button onClick={() => onRemove(item.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-2 rounded-lg transition">
                   <Trash2 size={18} />
                 </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="w-full lg:w-80 h-fit bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
           <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
           <div className="space-y-2 mb-4 border-b border-gray-100 pb-4">
              <div className="flex justify-between text-sm text-gray-500">
                 <span>Subtotal</span>
                 <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                 <span>Tax (5%)</span>
                 <span>₹{Math.round(total * 0.05)}</span>
              </div>
           </div>
           <div className="flex justify-between font-bold text-lg text-gray-900 mb-6">
              <span>Total</span>
              <span>₹{finalTotal}</span>
           </div>
           
           <button 
             onClick={() => setIsPaymentOpen(true)}
             className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-200"
           >
             Proceed to Checkout
           </button>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={finalTotal}
        onSuccess={() => {
           setIsPaymentOpen(false);
           alert("Order placed successfully! (Mock)");
        }}
      />
    </div>
  );
};

// --- Online Consultation View ---
export const OnlineConsultView: React.FC = () => {
  const [isChatActive, setIsChatActive] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [consultationHistory, setConsultationHistory] = useState([
    { id: '1', doctor: 'Dr. Aarav Patel', date: '2024-01-15', type: 'Chat', status: 'Completed', duration: '15 min' },
  ]);

  const startChatConsultation = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setIsChatActive(true);
  };

  const endConsultation = (startTime: Date) => {
    const endTime = new Date();
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMin = Math.round(durationMs / (1000 * 60));
    const newEntry = {
      id: crypto.randomUUID(),
      doctor: selectedDoctor!.name,
      date: new Date().toISOString().split('T')[0],
      type: 'Chat' as const,
      status: 'Completed' as const,
      duration: `${durationMin} min`
    };
    setConsultationHistory(prev => [newEntry, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setIsChatActive(false);
    setSelectedDoctor(null);
  };

  if (isChatActive && selectedDoctor) {
    return <ChatConsultation doctor={selectedDoctor} onEnd={endConsultation} />;
  }

  return (
    <div>
      <SectionHeader title="Online Consultations" subtitle="Connect with doctors remotely through chat or video" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consultation Options */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chat Consultation Doctors List */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Chat Consultation</h3>
            <p className="text-gray-600 text-sm mb-6">Select a doctor for instant text-based consultation</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_DOCTORS.map(doctor => (
                <div key={doctor.id} className="p-4 border border-gray-200 rounded-xl hover:border-primary-500 transition cursor-pointer" onClick={() => startChatConsultation(doctor)}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-primary-700 bg-primary-100`}>
                      {doctor.name.split(' ').map(n=>n[0]).join('').substring(0,3).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{doctor.name}</h4>
                      <p className="text-sm text-gray-500">{doctor.speciality}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-sm font-bold text-gray-900">{doctor.rating}</span>
                        <span className="text-xs text-gray-400">({doctor.experience} yrs exp)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 font-bold">₹{doctor.consultationFee}</span>
                    <span className="text-xs text-gray-400">Available 24/7</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consultation History */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Consultation History</h3>
            <div className="space-y-4">
              {consultationHistory.map(consult => (
                <div key={consult.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${consult.type === 'Chat' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                      {consult.type === 'Chat' ? <MessageSquare size={20} /> : <Video size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{consult.doctor}</h4>
                      <p className="text-sm text-gray-500">{consult.date} • {consult.duration}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${consult.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {consult.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-3">
              <Info size={20} /> How it Works
            </h3>
            <div className="space-y-3 text-sm text-blue-700">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                <p>Select a doctor for chat consultation</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                <p>Complete payment to start consultation</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                <p>Get expert medical advice instantly</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
            <h3 className="font-bold text-green-900 flex items-center gap-2 mb-3">
              <ShieldCheck size={20} /> Secure & Private
            </h3>
            <p className="text-sm text-green-700 leading-relaxed">
              All consultations are encrypted and comply with HIPAA standards. Your medical information is completely confidential.
            </p>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={selectedDoctor?.consultationFee || 500}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

// --- Lab Test Booking View ---
export const LabTestBookingView: React.FC<{ onAddToCart: (item: CartItem) => void; cart: CartItem[] }> = ({ onAddToCart, cart }) => {
  const [filter, setFilter] = useState('');
  const [address, setAddress] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const filteredTests = MOCK_LAB_TESTS.filter(t => t.name.toLowerCase().includes(filter.toLowerCase()));
  const labItemsInCart = cart.filter(i => i.type === 'test');

  return (
    <div>
      <SectionHeader title="Lab Test Booking" subtitle="Book lab tests with home pickup and payment options" />

      <div className="flex gap-6 items-start">
         <div className="flex-1">
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search lab tests..."
                className="w-full pl-4 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTests.map(test => (
                 <div key={test.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{test.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{test.preparation}</p>

                    <div className="flex items-center justify-between mb-2">
                       <span className="text-purple-700 font-bold text-lg">₹{test.price}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-4">{test.category}</p>

                    {test.homePickup && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-4">
                        <Home size={12} className="text-orange-500" /> Home pickup available
                      </div>
                    )}

                    <button
                      onClick={() => onAddToCart({id: crypto.randomUUID(), type: 'test', itemId: test.id, quantity: 1, price: test.price, name: test.name})}
                      className="w-full py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
                    >
                      Select Test
                    </button>
                 </div>
              ))}
            </div>
         </div>

         {/* Right Booking Summary Sidebar (Desktop) */}
         <div className="hidden lg:block w-80 bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-24">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Booking Summary</h3>
            {labItemsInCart.length === 0 ? (
               <p className="text-gray-500 text-sm">No tests selected</p>
            ) : (
               <>
                  <ul className="space-y-3 mb-6">
                    {labItemsInCart.map(item => (
                      <li key={item.id} className="text-sm flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-gray-700">{item.name}</span>
                        <span className="font-bold">₹{item.price}</span>
                      </li>
                    ))}
                    <li className="pt-2 flex justify-between font-bold text-lg border-t border-gray-100">
                      <span>Total</span>
                      <span>₹{labItemsInCart.reduce((acc, i) => acc + i.price, 0)}</span>
                    </li>
                  </ul>

                  {/* Address Input */}
                  <div className="mb-6">
                     <label className="block text-sm font-medium text-gray-700 mb-2">Test Location</label>
                     <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                        <input
                           type="text"
                           placeholder="Enter address for test collection"
                           value={address}
                           onChange={(e) => setAddress(e.target.value)}
                           className="w-full pl-9 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        />
                     </div>
                  </div>

                  {/* Proceed to Payment Button */}
                  <button
                     onClick={() => setShowPayment(true)}
                     disabled={!address.trim()}
                     className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     Proceed to Payment
                  </button>
               </>
            )}
         </div>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={labItemsInCart.reduce((acc, i) => acc + i.price, 0)}
        onSuccess={() => {
          setShowPayment(false);
          alert('Lab tests booked successfully! (Mock)');
        }}
      />
    </div>
  );
};
