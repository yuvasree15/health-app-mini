// Mock payment service for demonstration purposes
// In a real application, this would integrate with a payment gateway like Stripe, PayPal, etc.

export interface CardDetails {
  cardNumber: string;
  expiry: string;
  cvv: string;
}

/**
 * Handles payment processing
 * @param amount - The amount to charge in rupees
 * @param cardDetails - The card details for payment
 * @returns Promise that resolves if payment succeeds, rejects if it fails
 */
export const handlePayment = async (amount: number, cardDetails: CardDetails): Promise<void> => {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Basic validation
  if (!cardDetails.cardNumber || cardDetails.cardNumber.length < 16) {
    throw new Error('Invalid card number');
  }

  if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
    throw new Error('Invalid expiry date. Use MM/YY format');
  }

  if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
    throw new Error('Invalid CVV');
  }

  // Simulate random payment failure for demo (10% chance)
  if (Math.random() < 0.1) {
    throw new Error('Payment declined by bank. Please try a different card or contact your bank.');
  }

  // Payment successful
  console.log(`Payment of ₹${amount} processed successfully`);
};
