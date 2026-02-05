import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Calendar, Clock, X, CheckCircle, AlertCircle } from 'lucide-react';
import { MOCK_DOCTORS } from '../constants';
import { Doctor } from '../types';
import { fetchUpcomingAppointments, bookAppointment, UpcomingAppointment } from '../service/appointmentService';
import { handlePayment } from '../service/paymentService';
import { PaymentModal } from './Modals';

const AppointmentSystem: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<UpcomingAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentError, setPaymentError] = useState<string>('');
  const [pendingBooking, setPendingBooking] = useState<{
    doctor: Doctor;
    slot: string;
    visitType: string;
  } | null>(null);

  // Load appointments on component mount
  useEffect(() => {
    loadAppointments();
  }, []);

  // Filter doctors based on search term
  useEffect(() => {
    const filtered = doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchTerm, doctors]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchUpcomingAppointments();
      setAppointments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async (doctor: Doctor, slot: string, visitType: string) => {
    try {
      setBookingLoading(true);
      setBookingSuccess('');

      // Generate a future date for the appointment (next week)
      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + 7);
      const dateStr = appointmentDate.toLocaleDateString('en-GB').replace(/\//g, '-');

      const appointmentData = {
        doctorId: doctor.id,
        doctorName: doctor.name,
        date: dateStr,
        time: slot,
        visitType: visitType
      };

      const newAppointment = await bookAppointment(appointmentData);

      // Add to local state
      setAppointments(prev => [...prev, newAppointment]);
      setSelectedDoctor(null);
      setBookingSuccess(`Appointment booked successfully with ${doctor.name}!`);
      setPendingBooking(null);

      // Clear success message after 5 seconds
      setTimeout(() => setBookingSuccess(''), 5000);
    } catch (err: any) {
      setError('Failed to book appointment. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    // Mock cancel functionality
    setAppointments(prev =>
      prev.map(apt =>
        apt.appointmentId === appointmentId
          ? { ...apt, status: 'Cancelled' }
          : apt
      )
    );
  };

  const handleRescheduleAppointment = (appointmentId: string) => {
    // Mock reschedule functionality
    alert(`Reschedule functionality for appointment ${appointmentId} would be implemented here`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor's Appointment System</h1>
        <p className="text-gray-600">Find doctors and manage your appointments</p>
      </div>

      {/* Success Message */}
      {bookingSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="text-green-600" size={20} />
          <p className="text-green-800 font-medium">{bookingSuccess}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <p className="text-red-800 font-medium">{error}</p>
          <button
            onClick={() => setError('')}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Payment Error Message */}
      {paymentError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <p className="text-red-800 font-medium">{paymentError}</p>
          <button
            onClick={() => setPaymentError('')}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Find Doctor Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Doctor</h2>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search doctors by name, specialty, or location..."
                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Doctor Cards */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredDoctors.map(doctor => (
                <div key={doctor.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg">
                      {doctor.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{doctor.name}</h3>
                      <p className="text-sm text-gray-600">{doctor.speciality}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{doctor.rating}</span>
                        <span className="text-xs text-gray-400">({doctor.experience} yrs exp)</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <MapPin size={12} />
                        {doctor.location}
                      </div>
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">{doctor.about}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-bold text-blue-600">₹{doctor.consultationFee}</span>
                        <button
                          onClick={() => setSelectedDoctor(doctor)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No doctors found matching your search.
              </div>
            )}
          </div>
        </div>

        {/* My Appointments Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Appointments</h2>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading appointments...</span>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar size={48} className="mx-auto text-gray-300 mb-2" />
                <p>No upcoming appointments found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map(appointment => (
                  <div key={appointment.appointmentId} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{appointment.doctorName}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {appointment.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {appointment.time}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Booked on: {appointment.currentDate} • {appointment.visitType}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'Confirmed'
                            ? 'bg-green-100 text-green-800'
                            : appointment.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {appointment.status}
                        </span>
                        {appointment.status === 'Confirmed' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCancelAppointment(appointment.appointmentId)}
                              className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleRescheduleAppointment(appointment.appointmentId)}
                              className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              Reschedule
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Book Appointment</h3>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                  {selectedDoctor.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{selectedDoctor.name}</h4>
                  <p className="text-sm text-gray-600">{selectedDoctor.speciality}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot</label>
                  <select
                    id="timeSlot"
                    className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>Select a time slot</option>
                    {selectedDoctor.availableSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visit Type</label>
                  <select
                    id="visitType"
                    className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    defaultValue="Clinic Visit"
                  >
                    <option value="Clinic Visit">Clinic Visit</option>
                    <option value="Online Consult">Online Consult</option>
                  </select>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Consultation Fee</span>
                    <span className="font-bold text-blue-600">₹{selectedDoctor.consultationFee}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const timeSlot = (document.getElementById('timeSlot') as HTMLSelectElement).value;
                    const visitType = (document.getElementById('visitType') as HTMLSelectElement).value;
                    if (!timeSlot) {
                      setError('Please select a time slot before proceeding to payment.');
                      return;
                    }
                    if (selectedDoctor) {
                      setPendingBooking({ doctor: selectedDoctor, slot: timeSlot, visitType });
                      setShowPaymentModal(true);
                      setPaymentError('');
                    }
                  }}
                  disabled={bookingLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? 'Processing...' : 'Proceed to Pay'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal for Appointment Booking */}
      {pendingBooking && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
          }}
          amount={pendingBooking.doctor.consultationFee}
          onSuccess={async () => {
            try {
              await handleBookAppointment(
                pendingBooking.doctor,
                pendingBooking.slot,
                pendingBooking.visitType
              );
            } catch (e: any) {
              setError(e.message || 'Failed to book appointment after payment.');
            } finally {
              setShowPaymentModal(false);
            }
          }}
          onPayment={async (cardDetails) => {
            try {
              await handlePayment(pendingBooking.doctor.consultationFee, cardDetails);
            } catch (err: any) {
              setPaymentError(err.message || 'Payment failed. Please try again.');
              throw err;
            }
          }}
        />
      )}
    </div>
  );
};

export default AppointmentSystem;
