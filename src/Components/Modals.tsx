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
}> = ({ isOpen, onClose, amount, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');

  const handlePay = () => {
    setLoading(true);
    setStep('processing');
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      setTimeout(() => {
        onSuccess();
        onClose();
        setStep('details'); // Reset for next time
      }, 1500);
    }, 2000);
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
                <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
             </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="text-xs font-semibold text-gray-500 uppercase">Expiry</label>
               <input type="text" placeholder="MM/YY" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
             </div>
             <div>
               <label className="text-xs font-semibold text-gray-500 uppercase">CVV</label>
               <input type="password" placeholder="123" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
             </div>
           </div>

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
