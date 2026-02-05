import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './Components/Layout';
import {
  DashboardView,
  DoctorsView,
  PharmacyView,
  LabsView,
  RecordsView,
  CartView,
  ClinicFinderView,
  OnlineConsultView,
  ProfileView,
  LoginView,
  AdminUserManagementView,
  AdminSettingsView,
  NotificationsView,
  PatientsView
} from './Components/Views';
import AppointmentManager from './Components/AppointmentManager';
import MyAppointments from './Components/MyAppointments';
import AppointmentSystem from './Components/AppointmentSystem';
import { CartItem, UserRole, Appointment } from './types';
import { MOCK_APPOINTMENTS } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('patient');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);

  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-10 right-10 bg-gray-900 text-white px-6 py-3 rounded-xl text-sm z-50 animate-in fade-in slide-in-from-bottom-5 font-medium shadow-lg';
    notification.innerText = `Added ${item.name} to cart`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const addAppointment = (appointment: Appointment) => {
    setAppointments((prev) => [...prev, appointment]);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) => prev.map(apt =>
      apt.id === id ? { ...apt, status: 'Cancelled' as const } : apt
    ));
  };

  const handleCompleteAppointment = (id: string) => {
    setAppointments((prev) => {
      const updatedAppointments = prev.map(apt => {
        if (apt.id === id) {
          const completedApt = { ...apt, status: 'Completed' as const };

          // If it's a clinic visit, create a follow-up visit 7 days later
          if (apt.type === 'Clinic Visit') {
            // Parse the completed appointment date (format: 'DD MMM')
            const dateParts = apt.date.split(' ');
            const day = parseInt(dateParts[0]);
            const monthStr = dateParts[1];
            const currentYear = new Date().getFullYear();

            // Create date object for the completed appointment
            const completedDate = new Date(`${monthStr} ${day}, ${currentYear}`);

            // Add 7 days for follow-up
            const followUpDate = new Date(completedDate);
            followUpDate.setDate(completedDate.getDate() + 7);

            // Format back to 'DD MMM'
            const followUpDateStr = followUpDate.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short'
            });

            // Check if follow-up already exists for this doctor and date
            const followUpExists = prev.some(existingApt =>
              existingApt.doctorId === apt.doctorId &&
              existingApt.date === followUpDateStr &&
              existingApt.type === 'Follow-up Visit' &&
              existingApt.isFollowUp
            );

            if (!followUpExists) {
              const followUpAppointment: Appointment = {
                id: crypto.randomUUID(),
                doctorId: apt.doctorId,
                doctorName: apt.doctorName,
                date: followUpDateStr,
                time: apt.time, // Same time as original
                type: 'Follow-up Visit',
                status: 'Completed',
                paymentStatus: 'Pending',
                label: 'Follow-up Visit (Doctor Suggested)',
                isFollowUp: true
              };

              // Add the follow-up appointment
              updatedAppointments.push(followUpAppointment);
            }
          }

          return completedApt;
        }
        return apt;
      });

      return updatedAppointments;
    });
  };

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('patient');
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <Layout cartCount={cart.length} onLogout={handleLogout} userRole={userRole}>
        <Routes>
          {/* Shared Dashboard Route which internally decides what to render based on role */}
          <Route path="/" element={<DashboardView userRole={userRole} />} />
          
          {/* Admin Routes */}
          {userRole === 'admin' ? (
             <>
               <Route path="/users" element={<AdminUserManagementView />} />
               <Route path="/settings" element={<AdminSettingsView />} />
             </>
          ) : (
             // Patient/Doctor Routes
             <>
               <Route path="/doctors" element={<DoctorsView onAddAppointment={addAppointment} />} />
               <Route path="/pharmacy" element={<PharmacyView onAddToCart={addToCart} cart={cart} onClear={clearCart} />} />
               <Route path="/labs" element={<LabsView onAddToCart={addToCart} cart={cart} onClear={clearCart} />} />
               <Route path="/records" element={<RecordsView />} />
               <Route path="/appointments" element={<MyAppointments />} />
               <Route path="/appointment-system" element={<AppointmentSystem />} />
               <Route path="/clinics" element={<ClinicFinderView />} />
               <Route path="/consult" element={<OnlineConsultView />} />
               <Route path="/profile" element={<ProfileView />} />
               <Route path="/cart" element={<CartView cart={cart} onRemove={removeFromCart} onClear={clearCart} />} />
               <Route path="/notifications" element={<NotificationsView />} />
               <Route path="/patients" element={<PatientsView />} />
             </>
          )}
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;