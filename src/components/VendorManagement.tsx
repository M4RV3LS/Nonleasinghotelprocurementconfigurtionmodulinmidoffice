import { useState } from 'react';
import { VendorList } from './vendors/VendorList';
import { VendorProfile } from './vendors/VendorProfile';
import { Toast, ToastType } from './shared/Toast';
import { Item } from './ItemConfiguration';

export interface Vendor {
  id: string;
  code: string;
  name: string;
  islands: string[];
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  alternativePhone?: string;
  commission: number;
  status: 'active' | 'inactive';
  paymentMethods: string[]; // IDs of payment methods
  agreements: Agreement[];
  itemMappings: ItemMapping[];
  createdAt: string;
}

export interface Agreement {
  id: string;
  contractNumber: string;
  startDate: string;
  endDate: string;
  documentLink?: string;
}

export interface ItemMapping {
  id: string;
  itemId: string;
  pricingType: 'fixed' | 'not-fixed';
  unitPrice?: number;
  agreementNumber?: string;
  minQuantity: number;
  multipleOf: number;
}

export function VendorManagement() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: '1',
      code: 'VEN001',
      name: 'Pacific Supplies Ltd.',
      islands: ['Luzon', 'Visayas'],
      address: '123 Business Ave, Manila, Philippines',
      contactPerson: 'Juan Dela Cruz',
      phone: '+63 912 345 6789',
      email: 'juan@pacificsupplies.com',
      commission: 15,
      status: 'active',
      paymentMethods: ['1', '2'],
      agreements: [
        {
          id: '1',
          contractNumber: 'CTR-2024-001',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
        },
      ],
      itemMappings: [],
      createdAt: new Date().toISOString(),
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

  const handleCreateVendor = () => {
    setSelectedVendor(null);
    setView('create');
  };

  const handleEditVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setView('edit');
  };

  const handleSaveVendor = (vendor: Omit<Vendor, 'id' | 'createdAt'>) => {
    if (selectedVendor) {
      setVendors(
        vendors.map((v) =>
          v.id === selectedVendor.id
            ? { ...vendor, id: selectedVendor.id, createdAt: selectedVendor.createdAt }
            : v
        )
      );
      showToast('Vendor profile saved successfully', 'success');
    } else {
      const newVendor: Vendor = {
        ...vendor,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setVendors([...vendors, newVendor]);
      showToast('Vendor created successfully', 'success');
    }
    setView('list');
  };

  const handleDeleteVendor = (id: string) => {
    setVendors(vendors.filter((v) => v.id !== id));
    showToast('Vendor deleted successfully', 'success');
  };

  const handleCancel = () => {
    setView('list');
    setSelectedVendor(null);
  };

  return (
    <>
      {view === 'list' && (
        <VendorList
          vendors={vendors}
          onCreateVendor={handleCreateVendor}
          onEditVendor={handleEditVendor}
          onDeleteVendor={handleDeleteVendor}
        />
      )}

      {(view === 'create' || view === 'edit') && (
        <VendorProfile
          vendor={selectedVendor}
          onSave={handleSaveVendor}
          onCancel={handleCancel}
          existingCodes={vendors.map((v) => v.code)}
        />
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </>
  );
}
