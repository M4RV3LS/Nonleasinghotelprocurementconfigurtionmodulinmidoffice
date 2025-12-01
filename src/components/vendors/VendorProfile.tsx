import { useState } from 'react';
import { Vendor } from '../VendorManagement';
import { Button } from '../shared/Button';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { ChevronLeft } from 'lucide-react';
import { BasicInformation } from './tabs/BasicInformation';
import { PaymentMethods } from './tabs/PaymentMethods';
import { Agreements } from './tabs/Agreements';
import { ItemMapping } from './tabs/ItemMapping';

interface VendorProfileProps {
  vendor: Vendor | null;
  onSave: (vendor: Omit<Vendor, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  existingCodes: string[];
}

export function VendorProfile({ vendor, onSave, onCancel, existingCodes }: VendorProfileProps) {
  const [activeTab, setActiveTab] = useState<'agreements' | 'basic' | 'payments' | 'items'>('agreements');
  const [formData, setFormData] = useState<Omit<Vendor, 'id' | 'createdAt'>>(({
    code: vendor?.code || '',
    name: vendor?.name || '',
    islands: vendor?.islands || [],
    address: vendor?.address || '',
    contactPerson: vendor?.contactPerson || '',
    phone: vendor?.phone || '',
    email: vendor?.email || '',
    alternativePhone: vendor?.alternativePhone || '',
    ppn: vendor?.ppn || 0,
    serviceCharge: vendor?.serviceCharge || 0,
    pb1: vendor?.pb1 || 0,
    requestDestination: vendor?.requestDestination || '',
    status: vendor?.status || 'active',
    paymentMethods: vendor?.paymentMethods || [],
    agreements: vendor?.agreements || [],
    itemMappings: vendor?.itemMappings || [],
  }));
  
  const [hasChanges, setHasChanges] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const updateFormData = (updates: Partial<Omit<Vendor, 'id' | 'createdAt'>>) => {
    setFormData({ ...formData, ...updates });
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelConfirm(true);
    } else {
      onCancel();
    }
  };

  const tabs = [
    { id: 'agreements' as const, label: 'Legal Information' },
    { id: 'basic' as const, label: 'Basic Information' },
    { id: 'payments' as const, label: 'Payment Methods' },
    { id: 'items' as const, label: 'Item Mapping' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Vendor List
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">{vendor ? 'Edit Vendor' : 'Create New Vendor'}</h2>
            <p className="text-gray-600 mt-1">
              {vendor ? `Editing: ${vendor.name}` : 'Add a new vendor to your system'}
            </p>
          </div>
          <Button onClick={handleSave}>Save Vendor Profile</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#ec2224] text-[#ec2224]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'agreements' && (
            <Agreements
              agreements={formData.agreements}
              onChange={(agreements) => updateFormData({ agreements })}
            />
          )}

          {activeTab === 'basic' && (
            <BasicInformation
              formData={formData}
              updateFormData={updateFormData}
              existingCodes={existingCodes}
              isEdit={!!vendor}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentMethods
              selectedMethods={formData.paymentMethods}
              onChange={(methods) => updateFormData({ paymentMethods: methods })}
            />
          )}

          {activeTab === 'items' && (
            <ItemMapping
              mappings={formData.itemMappings}
              agreements={formData.agreements}
              onChange={(mappings) => updateFormData({ itemMappings: mappings })}
            />
          )}
        </div>
      </div>

      {/* Cancel Confirmation */}
      <ConfirmDialog
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={onCancel}
        title="Discard Changes"
        message="You have unsaved changes. Are you sure you want to discard them?"
        confirmText="Discard"
        variant="danger"
      />
    </div>
  );
}