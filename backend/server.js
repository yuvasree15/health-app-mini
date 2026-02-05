const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for appointments
let appointments = [
  {
    id: 'APT-001',
    doctor_name: 'Dr. Aarav Patel',
    appointment_date: '04-02-2026',
    appointment_time: '09:00 AM',
    status: 'Confirmed',
    type: 'Clinic Visit'
  },
  {
    id: 'APT-002',
    doctor_name: 'Dr. Rajesh Iyer',
    appointment_date: '04-02-2026',
    appointment_time: '10:00 AM',
    status: 'Confirmed',
    type: 'Clinic Visit'
  }
];

// Routes
app.get('/api/appointments', (req, res) => {
  res.json({ success: true, data: appointments });
});

app.put('/api/appointments/:id/reschedule', (req, res) => {
  const { id } = req.params;
  const { new_date, new_time } = req.body;

  const appointment = appointments.find(apt => apt.id === id);
  if (!appointment) {
    return res.status(404).json({ success: false, error: 'Appointment not found' });
  }

  // Update the appointment
  appointment.appointment_date = new_date;
  appointment.appointment_time = new_time;
  appointment.status = 'Rescheduled';

  res.json({
    success: true,
    data: {
      doctor_name: appointment.doctor_name,
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      status: appointment.status
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
