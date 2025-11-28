import { useState } from 'react';
import { PaymentMethodList } from './payment-methods/PaymentMethodList';
import { Toast, ToastType } from './shared/Toast';

export interface PaymentMethod {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  isSystemDefault: boolean;
  createdAt: string;
}

export function PaymentMethodConfiguration() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      name: 'Term of Payment 30 Days',
      status: 'active',
      isSystemDefault: true,
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'Term of Payment 60 Days',
      status: 'active',
      isSystemDefault: true,
      createdAt: '2024-01-01',
    },
    {
      id: '3',
      name: 'Cash on Delivery (COD)',
      status: 'active',
      isSystemDefault: true,
      createdAt: '2024-01-01',
    },
    {
      id: '4',
      name: 'Advance Payment',
      status: 'active',
      isSystemDefault: true,
      createdAt: '2024-01-01',
    },
  ]);

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
