import React, { useState } from 'react';
import { X, CreditCard, CheckCircle, Upload, MapPin, Clock } from 'lucide-react';

// --- Types ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// --- Base Modal ---
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Payment Modal ---
export const PaymentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: () => void;
  onPayment?: (cardDetails: { cardNumber: string; expiry: string; cvv: string }) => Promise<void>;
}> = ({ isOpen, onClose, amount, onSuccess, onPayment }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  const handlePay = async () => {
    setError('');
    try {
      if (onPayment) {
        await onPayment({ cardNumber, expiry, cvv });
      }
      setLoading(true);
      setStep('processing');
      setTimeout(() => {
        setLoading(false);
        setStep('success');
        setTimeout(() => {
          onSuccess();
          onClose();
          setStep('details'); // Reset for next time
          setCardNumber('');
          setExpiry('');
          setCvv('');
        }, 1500);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Payment failed');
      setStep('details');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Secure Payment">
       {step === 'details' && (
         <div className="space-y-4">
           <div className="bg-primary-50 p-4 rounded-xl flex justify-between items-center">
             <span className="text-gray-600">Total Amount</span>
             <span className="text-2xl font-bold text-primary-700">₹{amount}</span>
           </div>
           
           <div className="space-y-2">
             <label className="text-xs font-semibold text-gray-500 uppercase">Card Number</label>
             <div className="relative">
                <CreditCard className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
             </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="text-xs font-semibold text-gray-500 uppercase">Expiry</label>
               <input
                 type="text"
                 placeholder="MM/YY"
                 value={expiry}
                 onChange={(e) => setExpiry(e.target.value)}
                 className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
               />
             </div>
             <div>
               <label className="text-xs font-semibold text-gray-500 uppercase">CVV</label>
               <input
                 type="password"
                 placeholder="123"
                 value={cvv}
                 onChange={(e) => setCvv(e.target.value)}
                 className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
               />
             </div>
           </div>

           {error && (
             <div className="bg-red-50 border border-red-200 rounded-lg p-3">
               <p className="text-red-700 text-sm">{error}</p>
             </div>
           )}

           <button 
            onClick={handlePay}
            className="w-full bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition shadow-lg shadow-primary-200 mt-2"
           >
             Pay Now
           </button>
         </div>
       )}
       
       {step === 'processing' && (
         <div className="flex flex-col items-center justify-center py-8">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
           <p className="text-gray-600">Processing Payment...</p>
         </div>
       )}

       {step === 'success' && (
         <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in-95">
           <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
             <CheckCircle size={32} />
           </div>
           <h4 className="text-xl font-bold text-gray-900">Payment Successful!</h4>
           <p className="text-gray-500 mt-2">Your booking has been confirmed. You will receive an SMS shortly.</p>
         </div>
       )}
    </Modal>
  );
};

// --- Reschedule Modal ---
export const RescheduleModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
  onReschedule: (appointmentId: string, newDate: string, newTime: string) => void;
}> = ({ isOpen, onClose, appointment, onReschedule }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const availableSlots = ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"];

  const handleReschedule = () => {
    if (selectedDate && selectedTime) {
      onReschedule(appointment.id, selectedDate, selectedTime);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reschedule Appointment">
      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Current Appointment</h4>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-sm font-medium text-gray-900">{appointment?.doctorName}</p>
            <p className="text-xs text-gray-500">{appointment?.date} at {appointment?.time}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Select New Date</h4>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Select New Time</h4>
          <div className="grid grid-cols-2 gap-2">
            {availableSlots.map(slot => (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={`py-2 px-3 text-sm rounded-lg border transition ${
                  selectedTime === slot
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-gray-200 text-gray-600 hover:border-primary-300'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            disabled={!selectedDate || !selectedTime}
            onClick={handleReschedule}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Reschedule
          </button>
        </div>
      </div>
    </Modal>
  );
};

// --- Booking Modal ---
export const BookingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  slots: string[];
  fee: number;
  onBook: (slot: string, type: 'In-Clinic' | 'Video') => void;
}> = ({ isOpen, onClose, doctorName, slots, fee, onBook }) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const consultationType: 'In-Clinic' = 'In-Clinic';
  const consultationFee = 1500;
  const availableSlots = ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Book Appointment`}>
      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Consultation Type</h4>
          <div className="p-3 rounded-xl border border-primary-600 bg-primary-50 text-primary-700 flex items-center gap-2">
            <MapPin size={20} />
            <span className="text-sm font-medium">In-Clinic</span>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Available Slots (Today)</h4>
          <div className="grid grid-cols-3 gap-2">
            {availableSlots.map(slot => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`py-2 px-1 text-sm rounded-lg border transition ${
                  selectedSlot === slot
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-gray-200 text-gray-600 hover:border-primary-300'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
           <div>
             <p className="text-sm text-gray-500">Consultation Fee</p>
             <p className="text-lg font-bold text-gray-900">₹{consultationFee}</p>
           </div>
           <button
             disabled={!selectedSlot}
             onClick={() => selectedSlot && onBook(selectedSlot, consultationType)}
             className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
           >
             Proceed to Pay
           </button>
        </div>
      </div>
    </Modal>
  );
};
