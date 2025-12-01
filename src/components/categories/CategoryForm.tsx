import { useState } from 'react';
import { ItemCategory } from '../ItemCategoryConfiguration';
import { Button } from '../shared/Button';
import { FormField } from '../shared/FormField';
import { ToggleSwitch } from '../shared/ToggleSwitch';
import { Modal } from '../shared/Modal';

interface CategoryFormProps {
  category: ItemCategory | null;
  onSave: (category: Omit<ItemCategory, 'id' | 'createdAt' | 'itemsCount' | 'isSystemDefault'>) => void;
  onCancel: () => void;
  existingNames: string[];
}

const BRAND_NAMES = [
  'Reddoorz',
  'Reddoorz Premium',
  'RedLiving',
  'Sans',
  'Sans Vibe',
  'Sans Stay',
  'Sans Elite',
  'Urban View',
  'The Lavana',
  'No Branding',
  'Vibes by SANS',
];

const ITEM_CATEGORIES = ['Branding Item', 'Ops Item', 'Others'] as const;

export function CategoryForm({ category, onSave, onCancel, existingNames }: CategoryFormProps) {
  const [formData, setFormData] = useState<Omit<ItemCategory, 'id' | 'createdAt' | 'itemsCount' | 'isSystemDefault'>>(({
    code: category?.code || '',
    brandName: category?.brandName || '',
    itemCategory: category?.itemCategory || 'Ops Item',
    name: category?.name || '',
    description: category?.description || '',
    status: category?.status || 'active',
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.brandName) {
      newErrors.brandName = 'Brand name is required';
    }

    if (!formData.itemCategory) {
      newErrors.itemCategory = 'Item category is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Category name must be 100 characters or less';
    } else {
      const nameToCheck = formData.name.trim().toLowerCase();
      if (existingNames.includes(nameToCheck) && nameToCheck !== category?.name.toLowerCase()) {
        newErrors.name = 'Category name already exists';
      }
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      // Generate code if creating new category
      if (!category) {
        const existingCodes = []; // In real app, would get from parent
        let counter = 1;
        let newCode = `CAT-${String(counter).padStart(3, '0')}`;
        
        while (existingCodes.includes(newCode)) {
          counter++;
          newCode = `CAT-${String(counter).padStart(3, '0')}`;
        }
        
        onSave({ ...formData, code: newCode });
      } else {
        onSave(formData);
      }
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={category ? 'Edit Category' : 'Create New Category'}
      size="lg"
    >
      <div className="space-y-4">
        {category && (
          <FormField label="Category Code">
            <input
              type="text"
              value={formData.code}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </FormField>
        )}

        <FormField label="Brand Name" required error={errors.brandName}>
          <select
            value={formData.brandName}
            onChange={(e) => updateField('brandName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
          >
            {BRAND_NAMES.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Item Category" required error={errors.itemCategory}>
          <select
            value={formData.itemCategory}
            onChange={(e) => updateField('itemCategory', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
          >
            {ITEM_CATEGORIES.map((itemCategory) => (
              <option key={itemCategory} value={itemCategory}>
                {itemCategory}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Category Name" required error={errors.name}>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            maxLength={100}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
            placeholder="Enter category name"
          />
          <p className="mt-1 text-gray-500">{formData.name.length}/100 characters</p>
        </FormField>

        {category && (
          <FormField label="Description" error={errors.description}>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              maxLength={500}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
              placeholder="Enter category description"
            />
            <p className="mt-1 text-gray-500">{formData.description.length}/500 characters</p>
          </FormField>
        )}

        {category && (
          <FormField label="Status" required>
            <ToggleSwitch
              checked={formData.status === 'active'}
              onChange={(checked) => updateField('status', checked ? 'active' : 'inactive')}
              label={formData.status === 'active' ? 'Active' : 'Inactive'}
            />
            {formData.status === 'inactive' && (
              <p className="mt-2 text-gray-600">
                ⚠️ Items using this category will remain assigned but the category won't be available for new items.
              </p>
            )}
          </FormField>
        )}

        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {category ? 'Update' : 'Create'} Category
          </Button>
        </div>
      </div>
    </Modal>
  );
}