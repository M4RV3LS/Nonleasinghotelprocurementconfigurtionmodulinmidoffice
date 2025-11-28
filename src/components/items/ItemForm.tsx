import { useState, useRef } from 'react';
import { Item } from '../ItemConfiguration';
import { Button } from '../shared/Button';
import { FormField } from '../shared/FormField';
import { ToggleSwitch } from '../shared/ToggleSwitch';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { Upload, X, Plus, Trash2, ChevronLeft } from 'lucide-react';

interface ItemFormProps {
  item: Item | null;
  onSave: (item: Omit<Item, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  existingCodes: string[];
}

export function ItemForm({ item, onSave, onCancel, existingCodes }: ItemFormProps) {
  const [formData, setFormData] = useState<Omit<Item, 'id' | 'createdAt'>>({
    code: item?.code || '',
    name: item?.name || '',
    category: item?.category || '',
    uom: item?.uom || '',
    photo: item?.photo || '',
    specifications: item?.specifications || [],
    status: item?.status || 'active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [customUom, setCustomUom] = useState('');
  const [showCustomUom, setShowCustomUom] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const standardCategories = ['Apparel', 'Electronics', 'Food & Beverage', 'Office Supplies', 'Hardware'];
  const standardUoms = ['Piece', 'Box', 'Carton', 'Kilogram', 'Liter', 'Meter'];

  const generateCode = () => {
    const prefix = 'ITM';
    let counter = 1;
    let newCode = `${prefix}${String(counter).padStart(3, '0')}`;
    
    while (existingCodes.includes(newCode)) {
      counter++;
      newCode = `${prefix}${String(counter).padStart(3, '0')}`;
    }
    
    updateField('code', newCode);
  };

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, photo: 'File size must be less than 5MB' });
        return;
      }
      
      // Check file type
      if (!file.type.match(/^image\/(jpeg|png)$/)) {
        setErrors({ ...errors, photo: 'Only JPG and PNG files are allowed' });
        return;
      }
      
      // Create data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        updateField('photo', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSpecification = () => {
    updateField('specifications', [...formData.specifications, { key: '', values: [] }]);
  };

  const updateSpecification = (index: number, field: 'key' | 'values', value: any) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    updateField('specifications', newSpecs);
  };

  const removeSpecification = (index: number) => {
    updateField(
      'specifications',
      formData.specifications.filter((_, i) => i !== index)
    );
  };

  const addSpecValue = (specIndex: number, value: string) => {
    if (value.trim()) {
      const newSpecs = [...formData.specifications];
      newSpecs[specIndex].values = [...newSpecs[specIndex].values, value.trim()];
      updateField('specifications', newSpecs);
    }
  };

  const removeSpecValue = (specIndex: number, valueIndex: number) => {
    const newSpecs = [...formData.specifications];
    newSpecs[specIndex].values = newSpecs[specIndex].values.filter((_, i) => i !== valueIndex);
    updateField('specifications', newSpecs);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Item code is required';
    } else if (formData.code.length > 20) {
      newErrors.code = 'Item code must be 20 characters or less';
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.code)) {
      newErrors.code = 'Item code must be alphanumeric';
    } else if (existingCodes.includes(formData.code) && formData.code !== item?.code) {
      newErrors.code = 'This item code already exists';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Item name must be 100 characters or less';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.uom.trim()) {
      newErrors.uom = 'Unit of Measure is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (saveAndAddAnother = false) => {
    if (validate()) {
      onSave(formData);
      
      if (saveAndAddAnother) {
        // Reset form
        setFormData({
          code: '',
          name: '',
          category: '',
          uom: '',
          photo: '',
          specifications: [],
          status: 'active',
        });
        setHasChanges(false);
      }
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelConfirm(true);
    } else {
      onCancel();
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Item List
        </button>
        <h2 className="text-gray-900">{item ? 'Edit Item' : 'Create New Item'}</h2>
        <p className="text-gray-600 mt-1">
          {item ? `Editing: ${item.name}` : 'Add a new item to your catalog'}
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-3xl">
        {/* Section 1: Basic Information */}
        <div className="mb-8">
          <h3 className="text-gray-900 mb-4 pb-2 border-b border-gray-200">Basic Information</h3>

          <FormField label="Item Code" required error={errors.code}>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.code}
                onChange={(e) => updateField('code', e.target.value.toUpperCase())}
                maxLength={20}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
                placeholder="e.g., ITM001"
              />
              <Button variant="secondary" onClick={generateCode}>
                Generate Code
              </Button>
            </div>
          </FormField>

          <FormField label="Item Name" required error={errors.name}>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              maxLength={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
              placeholder="Enter item name"
            />
            <p className="mt-1 text-gray-500">
              {formData.name.length}/100 characters
            </p>
          </FormField>

          <FormField label="Item Category" required error={errors.category}>
            {showNewCategory ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
                  placeholder="Enter new category"
                />
                <Button
                  variant="primary"
                  onClick={() => {
                    if (newCategory.trim()) {
                      updateField('category', newCategory.trim());
                      setShowNewCategory(false);
                      setNewCategory('');
                    }
                  }}
                >
                  Add
                </Button>
                <Button variant="secondary" onClick={() => setShowNewCategory(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <select
                value={formData.category}
                onChange={(e) => {
                  if (e.target.value === '__new__') {
                    setShowNewCategory(true);
                  } else {
                    updateField('category', e.target.value);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
              >
                <option value="">Select category</option>
                {standardCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__new__">+ Add New Category</option>
              </select>
            )}
          </FormField>

          <FormField label="Unit of Measure (UoM)" required error={errors.uom}>
            {showCustomUom ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customUom}
                  onChange={(e) => setCustomUom(e.target.value)}
                  maxLength={20}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
                  placeholder="Enter custom UoM"
                />
                <Button
                  variant="primary"
                  onClick={() => {
                    if (customUom.trim()) {
                      updateField('uom', customUom.trim());
                      setShowCustomUom(false);
                      setCustomUom('');
                    }
                  }}
                >
                  Add
                </Button>
                <Button variant="secondary" onClick={() => setShowCustomUom(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <select
                value={formData.uom}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setShowCustomUom(true);
                  } else {
                    updateField('uom', e.target.value);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
              >
                <option value="">Select UoM</option>
                {standardUoms.map((uom) => (
                  <option key={uom} value={uom}>
                    {uom}
                  </option>
                ))}
                <option value="__custom__">Custom UoM</option>
              </select>
            )}
          </FormField>
        </div>

        {/* Section 2: Item Photo */}
        <div className="mb-8">
          <h3 className="text-gray-900 mb-4 pb-2 border-b border-gray-200">Item Photo</h3>

          <FormField label="Photo Upload" error={errors.photo} helpText="Recommended: 800x800px, JPG or PNG, max 5MB">
            <div className="flex gap-4">
              {formData.photo ? (
                <div className="relative">
                  <img
                    src={formData.photo}
                    alt="Item preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    onClick={() => updateField('photo', '')}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#ec2224] transition-colors"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                  {formData.photo ? 'Change Photo' : 'Upload Photo'}
                </Button>
                {formData.photo && (
                  <Button variant="tertiary" onClick={() => updateField('photo', '')}>
                    Remove Photo
                  </Button>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
          </FormField>
        </div>

        {/* Section 3: Specifications */}
        <div className="mb-8">
          <h3 className="text-gray-900 mb-2 pb-2 border-b border-gray-200">Specifications</h3>
          <p className="text-gray-600 mb-4">
            Define product variants/attributes. Example: Color: Red, Black, Brown | Size: XL, L, M
          </p>

          <div className="space-y-4">
            {formData.specifications.map((spec, specIndex) => (
              <div key={specIndex} className="border border-gray-200 rounded-lg p-4">
                <div className="flex gap-4 mb-3">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => updateSpecification(specIndex, 'key', e.target.value)}
                    maxLength={50}
                    placeholder="Specification name (e.g., Color, Size)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
                  />
                  <button
                    onClick={() => removeSpecification(specIndex)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-2">
                  <label className="block text-gray-700 mb-2">Values</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {spec.values.map((value, valueIndex) => (
                      <span
                        key={valueIndex}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full"
                      >
                        {value}
                        <button
                          onClick={() => removeSpecValue(specIndex, valueIndex)}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Type value and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        addSpecValue(specIndex, e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
                  />
                </div>
              </div>
            ))}

            <Button variant="secondary" onClick={addSpecification}>
              <Plus className="w-4 h-4" />
              Add Specification
            </Button>
          </div>
        </div>

        {/* Section 4: Status */}
        <div className="mb-8">
          <h3 className="text-gray-900 mb-4 pb-2 border-b border-gray-200">Status</h3>

          <FormField label="Item Status" required>
            <ToggleSwitch
              checked={formData.status === 'active'}
              onChange={(checked) => updateField('status', checked ? 'active' : 'inactive')}
              label={formData.status === 'active' ? 'Active' : 'Inactive'}
            />
            <p className="mt-2 text-gray-600">
              {formData.status === 'inactive' && 'Warning: Inactive items cannot be selected in RedPartners module'}
            </p>
          </FormField>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <Button variant="primary" onClick={() => handleSubmit(false)}>
            Save
          </Button>
          {!item && (
            <Button variant="secondary" onClick={() => handleSubmit(true)}>
              Save & Add Another
            </Button>
          )}
          <Button variant="tertiary" onClick={handleCancel}>
            Cancel
          </Button>
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
