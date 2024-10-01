'use client';

import { useRouter } from 'next/router';
import { useCart } from '@/components/AppContext';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Script from 'next/script';

function OrderComplete() {
  const { clearCart, cartProducts } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const rzpPaymentForm = document.getElementById('rzp-payment-form');
    if (rzpPaymentForm) {
      rzpPaymentForm.addEventListener('payment.success', handlePaymentSuccess);
    }

    return () => {
      if (rzpPaymentForm) {
        rzpPaymentForm.removeEventListener('payment.success', handlePaymentSuccess);
      }
    };
  }, []);

  const handlePaymentSuccess = async (event) => {
    setIsProcessing(true);
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = event.detail;

    try {
      const verificationResponse = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature
        }),
      });
      const data = await verificationResponse.json();
     
      if (data.success) {
        const orderResponse = await fetch('/api/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cartProducts,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
          }),
        });
        const orderData = await orderResponse.json();
       
        if (orderData.success) {
          toast.success('Order placed successfully!');
          clearCart();
          router.push('/');
        } else {
          toast.error('Failed to create order. Please contact support.');
        }
      } else {
        toast.error('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Error during order completion:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <form id="rzp-payment-form">
        <Script
          src="https://checkout.razorpay.com/v1/payment-button.js"
          data-payment_button_id="pl_OZR0KRCE9QUvN8"
          async
        />
      </form>
      {isProcessing && <p>Processing your order...</p>}
    </div>
  );
}

export default OrderComplete;