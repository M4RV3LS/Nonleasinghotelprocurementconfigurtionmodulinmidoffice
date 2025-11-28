import { useState } from 'react';
import { PaymentMethodList } from './payment-methods/PaymentMethodList';
import { Toast, ToastType } from './shared/Toast';
import { MOCK_PAYMENT_METHODS, PaymentMethod } from '../mock-data';

// Re-export type for backward compatibility
export type { PaymentMethod };

export function PaymentMethodConfiguration() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(MOCK_PAYMENT_METHODS);

  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: ToastType;
  }>({
    isOpen: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ isOpen: true, message, type });
  };

  const handleCreatePaymentMethod = (name: string) => {
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      name,
      status: 'active',
      isSystemDefault: false,
      createdAt: new Date().toISOString(),
    };
    setPaymentMethods([...paymentMethods, newMethod]);
    showToast('Payment method created successfully', 'success');
  };

  const handleUpdateStatus = (id: string, status: 'active' | 'inactive') => {
    setPaymentMethods(
      paymentMethods.map((pm) => (pm.id === id ? { ...pm, status } : pm))
    );
    showToast(`Payment method status updated to ${status}`, 'success');
  };

  const handleDelete = (id: string) => {
    setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
    showToast('Payment method deleted successfully', 'success');
  };

  return (
    <>
      <PaymentMethodList
        paymentMethods={paymentMethods}
        onCreate={handleCreatePaymentMethod}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDelete}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </>
  );
}
