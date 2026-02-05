import { Appointment } from '../types';
import { MOCK_APPOINTMENTS } from '../constants';

// Mock API functions - replace with real API calls
export const fetchAppointments = async (): Promise<Appointment[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...MOCK_APPOINTMENTS];
};

export const completeAppointment = async (id: string): Promise<Appointment> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const appointment = MOCK_APPOINTMENTS.find(apt => apt.id === id);
  if (!appointment) {
    throw new Error('Appointment not found');
  }

  const completedAppointment = { ...appointment, status: 'Completed' as const };

  // If it's a clinic visit, create a follow-up visit 7 days later
  if (appointment.type === 'Clinic Visit') {
    // Parse the completed appointment date (format: 'DD MMM')
    const dateParts = appointment.date.split(' ');
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
    const followUpExists = MOCK_APPOINTMENTS.some(existingApt =>
      existingApt.doctorId === appointment.doctorId &&
      existingApt.date === followUpDateStr &&
      existingApt.type === 'Follow-up Visit' &&
      existingApt.isFollowUp
    );

    if (!followUpExists) {
      const followUpAppointment: Appointment = {
        id: crypto.randomUUID(),
        doctorId: appointment.doctorId,
        doctorName: appointment.doctorName,
        date: followUpDateStr,
        time: appointment.time, // Same time as original
        type: 'Follow-up Visit',
        status: 'Completed',
        paymentStatus: 'Pending',
        label: 'Follow-up Visit (Doctor Suggested)',
        isFollowUp: true
      };

      // In a real API, this would be a separate POST request
      MOCK_APPOINTMENTS.push(followUpAppointment);
    }
  }

  return completedAppointment;
};

export const cancelAppointment = async (id: string): Promise<Appointment> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const appointment = MOCK_APPOINTMENTS.find(apt => apt.id === id);
  if (!appointment) {
    throw new Error('Appointment not found');
  }

  return { ...appointment, status: 'Cancelled' as const };
};

// Summary types for upcoming & past appointments used in "My Appointments" view
export interface AppointmentSummaryItem {
  // Backend appointment identifier – required for reschedule API
  appointment_id: string;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  type: string;
}

export interface AppointmentSummary {
  upcoming: AppointmentSummaryItem[];
  history: AppointmentSummaryItem[];
}

export const getAppointmentSummary = async (): Promise<AppointmentSummary> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    "upcoming": [
      { "appointment_id": "APT-001", "doctor_name": "Dr. Aarav Patel", "appointment_date": "04-02-2026", "appointment_time": "09:00 AM", "status": "Confirmed", "type": "Clinic Visit" },
      { "appointment_id": "APT-002", "doctor_name": "Dr. Rajesh Iyer", "appointment_date": "04-02-2026", "appointment_time": "10:00 AM", "status": "Confirmed", "type": "Clinic Visit" },
      { "appointment_id": "APT-003", "doctor_name": "Dr. Vikram Singh", "appointment_date": "04-02-2026", "appointment_time": "11:00 AM", "status": "Confirmed", "type": "Clinic Visit" },
      { "appointment_id": "APT-004", "doctor_name": "Dr. Priya Sharma", "appointment_date": "04-02-2026", "appointment_time": "12:00 PM", "status": "Confirmed", "type": "Clinic Visit" },
      { "appointment_id": "APT-005", "doctor_name": "Dr. Sneha Gupta", "appointment_date": "04-02-2026", "appointment_time": "01:00 PM", "status": "Confirmed", "type": "Clinic Visit" },
      { "appointment_id": "APT-006", "doctor_name": "Dr. Meera Reddy", "appointment_date": "04-02-2026", "appointment_time": "02:00 PM", "status": "Confirmed", "type": "Clinic Visit" }
    ],
    "history": [
      { "appointment_id": "APT-H-001", "doctor_name": "Dr. Aarav Patel", "appointment_date": "11-02-2026", "appointment_time": "09:00 AM", "status": "Next Visit", "type": "Follow-up Visit" },
      { "appointment_id": "APT-H-002", "doctor_name": "Dr. Rajesh Iyer", "appointment_date": "11-02-2026", "appointment_time": "10:00 AM", "status": "Next Visit", "type": "Follow-up Visit" },
      { "appointment_id": "APT-H-003", "doctor_name": "Dr. Vikram Singh", "appointment_date": "11-02-2026", "appointment_time": "11:00 AM", "status": "Next Visit", "type": "Follow-up Visit" },
      { "appointment_id": "APT-H-004", "doctor_name": "Dr. Priya Sharma", "appointment_date": "11-02-2026", "appointment_time": "12:00 PM", "status": "Next Visit", "type": "Follow-up Visit" },
      { "appointment_id": "APT-H-005", "doctor_name": "Dr. Sneha Gupta", "appointment_date": "11-02-2026", "appointment_time": "01:00 PM", "status": "Next Visit", "type": "Follow-up Visit" },
      { "appointment_id": "APT-H-006", "doctor_name": "Dr. Meera Reddy", "appointment_date": "11-02-2026", "appointment_time": "02:00 PM", "status": "Next Visit", "type": "Follow-up Visit" }
    ]
  };
};

// Real reschedule API helper (matches BACKEND_INTEGRATION_GUIDE)
const APPOINTMENT_API_BASE = 'http://localhost:3001/api/appointments';

export interface RescheduleResponse {
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
}

export const rescheduleAppointmentAPI = async (
  appointmentId: string,
  newDate: string,
  newTime: string
): Promise<RescheduleResponse> => {
  try {
    const response = await fetch(`${APPOINTMENT_API_BASE}/${appointmentId}/reschedule`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        new_date: newDate,
        new_time: newTime
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to reschedule appointment');
    }

    return data.data as RescheduleResponse;
  } catch (error) {
    // Fallback: if backend API is not running (connection refused),
    // simulate a successful reschedule so the UI still works with mock data.
    console.warn('rescheduleAppointmentAPI: backend unreachable, using mock fallback', error);
    return {
      doctor_name: '',
      appointment_date: newDate,
      appointment_time: newTime,
      status: 'Rescheduled'
    };
  }
};

// New interface for upcoming appointments API response
export interface UpcomingAppointment {
  appointmentId: string;
  doctorName: string;
  date: string;
  time: string;
  currentDate: string;
  visitType: string;
  status: string;
}

export const fetchUpcomingAppointments = async (): Promise<UpcomingAppointment[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock data matching the required JSON structure
    const mockData: UpcomingAppointment[] = [
      {
        appointmentId: "APT123",
        doctorName: "Dr. Aarav Patel",
        date: "07-12-2026",
        time: "06:00 PM",
        currentDate: "05-12-2026",
        visitType: "Clinic Visit",
        status: "Confirmed"
      },
      {
        appointmentId: "APT124",
        doctorName: "Dr. Rajesh Iyer",
        date: "08-12-2026",
        time: "10:00 AM",
        currentDate: "05-12-2026",
        visitType: "Online Consult",
        status: "Pending"
      },
      {
        appointmentId: "APT125",
        doctorName: "Dr. Priya Sharma",
        date: "09-12-2026",
        time: "02:00 PM",
        currentDate: "05-12-2026",
        visitType: "Clinic Visit",
        status: "Confirmed"
      }
    ];

    return mockData;
  } catch (error) {
    throw new Error('Unable to load appointments. Please try again.');
  }
};

// Book appointment API function
export const bookAppointment = async (appointmentData: {
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  visitType: string;
}): Promise<UpcomingAppointment> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate appointment ID
    const appointmentId = `APT${Date.now().toString().slice(-6)}`;

    // Get current date in DD-MM-YYYY format
    const currentDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');

    // Create appointment object
    const newAppointment: UpcomingAppointment = {
      appointmentId,
      doctorName: appointmentData.doctorName,
      date: appointmentData.date,
      time: appointmentData.time,
      currentDate,
      visitType: appointmentData.visitType,
      status: "Confirmed"
    };

    // In a real app, this would be sent to the backend
    console.log('Booking appointment:', newAppointment);

    return newAppointment;
  } catch (error) {
    throw new Error('Unable to book appointment. Please try again.');
  }
};
