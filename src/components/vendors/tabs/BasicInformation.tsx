import { useState } from 'react';
import { Vendor } from '../../VendorManagement';
import { FormField } from '../../shared/FormField';
import { ToggleSwitch } from '../../shared/ToggleSwitch';
import { Button } from '../../shared/Button';

interface BasicInformationProps {
  formData: Omit<Vendor, 'id' | 'createdAt'>;
  updateFormData: (updates: Partial<Omit<Vendor, 'id' | 'createdAt'>>) => void;
  existingCodes: string[];
  isEdit: boolean;
}

const ISLANDS = [
  'Luzon',
  'Visayas',
  'Mindanao',
  'Palawan',
  'Panay',
  'Negros',
  'Cebu',
  'Bohol',
  'Leyte',
  'Samar',
  'Mindoro',
];

export function BasicInformation({ formData, updateFormData, existingCodes, isEdit }: BasicInformationProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateCode = () => {
    const prefix = 'VEN';
    let counter = 1;
    let newCode = `${prefix}${String(counter).padStart(3, '0')}`;
    
    while (existingCodes.includes(newCode)) {
      counter++;
      newCode = `${prefix}${String(counter).padStart(3, '0')}`;
    }
    
    updateFormData({ code: newCode });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    return phoneRegex.test(phone);
  };

  const handleFieldChange = (field: keyof Omit<Vendor, 'id' | 'createdAt'>, value: any) => {
    updateFormData({ [field]: value });
    
    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const toggleIsland = (island: string) => {
    const newIslands = formData.islands.includes(island)
      ? formData.islands.filter((i) => i !== island)
      : [...formData.islands, island];
    handleFieldChange('islands', newIslands);
  };

  const selectAllIslands = () => {
    handleFieldChange('islands', ISLANDS);
  };

  const clearAllIslands = () => {
    handleFieldChange('islands', []);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <FormField label="Vendor Code" required error={errors.code}>
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.code}
            onChange={(e) => handleFieldChange('code', e.target.value.toUpperCase())}
            maxLength={20}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
            placeholder="e.g., VEN001"
          />
          <Button variant="secondary" onClick={generateCode}>
            Generate Code
          </Button>
        </div>
      </FormField>

      <FormField label="Vendor Name" required error={errors.name}>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          maxLength={100}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
          placeholder="Enter vendor name"
        />
      </FormField>

      <FormField label="Island Coverage" required error={errors.islands}>
        <div className="space-y-2">
          <div className="flex gap-2 mb-3">
            <Button variant="secondary" size="sm" onClick={selectAllIslands}>
              Select All
            </Button>
            <Button variant="secondary" size="sm" onClick={clearAllIslands}>
              Clear All
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ISLANDS.map((island) => (
              <label
                key={island}
                className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={formData.islands.includes(island)}
                  onChange={() => toggleIsland(island)}
                  className="w-4 h-4 text-[#ec2224] focus:ring-[#ec2224] rounded"
                />
                <span>{island}</span>
              </label>
            ))}
          </div>
        </div>
      </FormField>

      <FormField label="Address" required error={errors.address}>
        <textarea
          value={formData.address}
          onChange={(e) => handleFieldChange('address', e.target.value)}
          maxLength={500}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
          placeholder="Enter complete address"
        />
        <p className="mt-1 text-gray-500">{formData.address.length}/500 characters</p>
      </FormField>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-gray-900 mb-4">Contact Information</h4>

        <FormField label="Contact Person Name" required error={errors.contactPerson}>
          <input
            type="text"
            value={formData.contactPerson}
            onChange={(e) => handleFieldChange('contactPerson', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
            placeholder="Enter contact person name"
          />
        </FormField>

        <FormField label="Phone Number" required error={errors.phone}>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
            placeholder="e.g., +63 912 345 6789"
          />
        </FormField>

        <FormField label="Email Address" required error={errors.email}>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
            placeholder="e.g., contact@vendor.com"
          />
        </FormField>

        <FormField label="Alternative Phone" error={errors.alternativePhone}>
          <input
            type="tel"
            value={formData.alternativePhone || ''}
            onChange={(e) => handleFieldChange('alternativePhone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
            placeholder="e.g., +63 912 345 6789"
          />
        </FormField>
      </div>

      <FormField label="Commission %" required error={errors.commission}>
        <div className="relative">
          <input
            type="number"
            value={formData.commission}
            onChange={(e) => handleFieldChange('commission', Math.min(100, Math.max(0, Number(e.target.value))))}
            min={0}
            max={100}
            step={0.1}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
            placeholder="0.0"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
        </div>
      </FormField>

      <FormField label="Status" required>
        <ToggleSwitch
          checked={formData.status === 'active'}
          onChange={(checked) => handleFieldChange('status', checked ? 'active' : 'inactive')}
          label={formData.status === 'active' ? 'Active' : 'Inactive'}
        />
      </FormField>
    </div>
  );
}
