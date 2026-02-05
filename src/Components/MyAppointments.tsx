import React, { useState, useEffect } from 'react';
import { Calendar, Clock, X, AlertCircle } from 'lucide-react';
import {
  getAppointmentSummary,
  AppointmentSummary,
  AppointmentSummaryItem,
  rescheduleAppointmentAPI
} from '../service/appointmentService';

type TabType = 'upcoming' | 'history';

type UIAppointment = AppointmentSummaryItem & {
  id: string; // local UI identifier
};

const MyAppointments: React.FC = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState<UIAppointment[]>([]);
  const [historyAppointments, setHistoryAppointments] = useState<UIAppointment[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState<string>('');
  const [rescheduleSuccess, setRescheduleSuccess] = useState<string>('');
  const [selectedForReschedule, setSelectedForReschedule] = useState<UIAppointment | null>(null);
  const [newDate, setNewDate] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('');

  // Load appointments on component mount
  useEffect(() => {
    loadAppointments();
  }, []);

  const mapToUIAppointments = (items: AppointmentSummaryItem[]): UIAppointment[] => {
    return items.map((item, index) => ({
      ...item,
      id: `${item.appointment_id}-${index}`
    }));
  };

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      const data: AppointmentSummary = await getAppointmentSummary();
      setUpcomingAppointments(mapToUIAppointments(data.upcoming));
      setHistoryAppointments(mapToUIAppointments(data.history));
    } catch (err: any) {
      setError(err.message || 'Unable to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = (appointmentId: string) => {
    const appointment = upcomingAppointments.find(apt => apt.id === appointmentId);

    // Move the appointment from upcoming to history with "Cancelled" status
    if (appointment) {
      setUpcomingAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
      setHistoryAppointments(prev => [
        ...prev,
        {
          ...appointment,
          status: 'Cancelled'
        }
      ]);
    }
  };

  const handleRescheduleAppointment = (appointmentId: string) => {
    const sourceList = activeTab === 'upcoming' ? upcomingAppointments : historyAppointments;
    const appointment = sourceList.find(apt => apt.id === appointmentId);
    if (!appointment) return;

    setSelectedForReschedule(appointment);
    setNewDate(appointment.appointment_date);
    setNewTime(appointment.appointment_time);
    setRescheduleError('');
    setRescheduleSuccess('');
  };

  const handleConfirmReschedule = async () => {
    if (!selectedForReschedule) return;

    try {
      setRescheduleLoading(true);
      setRescheduleError('');

      const updated = await rescheduleAppointmentAPI(
        selectedForReschedule.appointment_id,
        newDate,
        newTime
      );

      const applyUpdate = (items: UIAppointment[]) =>
        items.map(apt =>
          apt.appointment_id === selectedForReschedule.appointment_id
            ? {
                ...apt,
                appointment_date: updated.appointment_date,
                appointment_time: updated.appointment_time,
                status: updated.status
              }
            : apt
        );

      setUpcomingAppointments(prev => applyUpdate(prev));
      setHistoryAppointments(prev => applyUpdate(prev));

      setRescheduleSuccess('Appointment rescheduled successfully.');
      setSelectedForReschedule(null);
    } catch (err: any) {
      setRescheduleError(err.message || 'Failed to reschedule appointment. Please try again.');
    } finally {
      setRescheduleLoading(false);
    }
  };

  const getDisplayDateParts = (dateStr: string) => {
    // dateStr is expected in DD-MM-YYYY format
    const [dayStr, monthStr, yearStr] = dateStr.split('-');
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    const year = parseInt(yearStr, 10);

    const appointmentDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isToday = appointmentDate.toDateString() === today.toDateString();

    return {
      day: dayStr.replace(/^0/, ''),
      label: isToday
        ? 'Today'
        : appointmentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase()
    };
  };

  const currentAppointments =
    activeTab === 'upcoming' ? upcomingAppointments : historyAppointments;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
        <p className="text-gray-600">Track your visits and scheduled consultations</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-3 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'upcoming'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'history'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          History
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
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

      {/* Reschedule feedback */}
      {rescheduleError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-3">
          <AlertCircle className="text-red-600" size={18} />
          <p className="text-red-800 text-sm font-medium">{rescheduleError}</p>
          <button
            onClick={() => setRescheduleError('')}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X size={14} />
          </button>
        </div>
      )}
      {rescheduleSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <p className="text-green-800 text-sm font-medium">{rescheduleSuccess}</p>
          <button
            onClick={() => setRescheduleSuccess('')}
            className="ml-auto text-green-700 hover:text-green-900 text-xs"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Appointments List */}
          {currentAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                {activeTab === 'upcoming'
                  ? 'No upcoming appointments found.'
                  : 'No past appointments in history yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentAppointments.map(appointment => {
                const { day, label } = getDisplayDateParts(appointment.appointment_date);
                const statusClasses =
                  appointment.status === 'Confirmed'
                    ? 'bg-green-100 text-green-800'
                    : appointment.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : appointment.status === 'Rescheduled'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-gray-100 text-gray-700';

                return (
                  <div
                    key={appointment.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-6"
                  >
                    {/* Date Badge */}
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center text-gray-900 shrink-0">
                      <span className="text-xl font-extrabold leading-tight">{day}</span>
                      <span className="text-xs font-semibold text-gray-500 mt-0.5">
                        {label}
                      </span>
                    </div>

                    {/* Appointment Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {appointment.doctor_name}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusClasses}`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-gray-400" />
                          <span className="font-medium">{appointment.appointment_time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <span className="font-medium">{appointment.type}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 shrink-0">
                      <button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 border border-red-100 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleRescheduleAppointment(appointment.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Reschedule Modal */}
      {selectedForReschedule && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Reschedule Appointment</h2>
                <p className="text-xs text-gray-500">
                  {selectedForReschedule.doctor_name}
                </p>
              </div>
              <button
                onClick={() => setSelectedForReschedule(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  New Date (DD-MM-YYYY)
                </label>
                <input
                  type="text"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="DD-MM-YYYY"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  New Time (HH:MM AM/PM)
                </label>
                <input
                  type="text"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="02:00 PM"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedForReschedule(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                disabled={rescheduleLoading}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {rescheduleLoading ? 'Rescheduling...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
