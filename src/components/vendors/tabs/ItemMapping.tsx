import { useState } from 'react';
import { ItemMapping as ItemMappingType, Agreement } from '../../VendorManagement';
import { Button } from '../../shared/Button';
import { Modal } from '../../shared/Modal';
import { FormField } from '../../shared/FormField';
import { ConfirmDialog } from '../../shared/ConfirmDialog';
import { Plus, Edit, Trash2 } from 'lucide-react';

// Mock items - in a real app, these would come from ItemConfiguration
const AVAILABLE_ITEMS = [
  { id: '1', code: 'ITM001', name: 'Premium Cotton T-Shirt', photo: '' },
  { id: '2', code: 'ITM002', name: 'Wireless Mouse', photo: '' },
  { id: '3', code: 'ITM003', name: 'Office Chair', photo: '' },
  { id: '4', code: 'ITM004', name: 'Laptop Stand', photo: '' },
  { id: '5', code: 'ITM005', name: 'Coffee Mug Set', photo: '' },
];

interface ItemMappingProps {
  mappings: ItemMappingType[];
  agreements: Agreement[];
  onChange: (mappings: ItemMappingType[]) => void;
}

export function ItemMapping({ mappings, agreements, onChange }: ItemMappingProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingMapping, setEditingMapping] = useState<ItemMappingType | null>(null);
  const [formData, setFormData] = useState<Omit<ItemMappingType, 'id'>>({
    itemId: '',
    pricingType: 'fixed',
    unitPrice: 0,
    agreementNumber: '',
    minQuantity: 1,
    multipleOf: 1,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    mappingId: string;
  }>({ isOpen: false, mappingId: '' });

  const mappedItemIds = mappings.map((m) => m.itemId);
  const availableItems = AVAILABLE_ITEMS.filter((item) => 
    editingMapping ? item.id === editingMapping.itemId || !mappedItemIds.includes(item.id) : !mappedItemIds.includes(item.id)
  );

  const handleAdd = () => {
    setEditingMapping(null);
    setFormData({
      itemId: '',
      pricingType: 'fixed',
      unitPrice: 0,
      agreementNumber: '',
      minQuantity: 1,
      multipleOf: 1,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (mapping: ItemMappingType) => {
    setEditingMapping(mapping);
    setFormData({
      itemId: mapping.itemId,
      pricingType: mapping.pricingType,
      unitPrice: mapping.unitPrice,
      agreementNumber: mapping.agreementNumber,
      minQuantity: mapping.minQuantity,
      multipleOf: mapping.multipleOf,
    });
    setErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.itemId) {
      newErrors.itemId = 'Please select an item';
    }

    if (formData.pricingType === 'fixed') {
      if (!formData.unitPrice || formData.unitPrice <= 0) {
        newErrors.unitPrice = 'Unit price must be greater than 0 for fixed pricing';
      }
    }

    if (!formData.minQuantity || formData.minQuantity < 1) {
      newErrors.minQuantity = 'Minimum quantity must be at least 1';
    }

    if (!formData.multipleOf || formData.multipleOf < 1) {
      newErrors.multipleOf = 'Multiple of must be at least 1';
    }

    if (formData.minQuantity % formData.multipleOf !== 0) {
      newErrors.minQuantity = "Minimum Quantity must be a multiple of the 'Multiple Of' value";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const mappingData = {
      ...formData,
      unitPrice: formData.pricingType === 'fixed' ? formData.unitPrice : undefined,
      agreementNumber: formData.pricingType === 'fixed' ? formData.agreementNumber : undefined,
    };

    if (editingMapping) {
      onChange(
        mappings.map((m) =>
          m.id === editingMapping.id ? { ...mappingData, id: editingMapping.id } : m
        )
      );
    } else {
      const newMapping: ItemMappingType = {
        ...mappingData,
        id: Date.now().toString(),
      };
      onChange([...mappings, newMapping]);
    }

    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    onChange(mappings.filter((m) => m.id !== id));
  };

  const getItemById = (id: string) => {
    return AVAILABLE_ITEMS.find((item) => item.id === id);
  };

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">Map items to this vendor with specific pricing rules</p>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4" />
          Add Item Mapping
        </Button>
      </div>

      {/* Mappings Table */}
      {mappings.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-500 mb-4">No items mapped yet</p>
          <Button onClick={handleAdd}>Add First Item Mapping</Button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700">Photo</th>
                  <th className="px-4 py-3 text-left text-gray-700">Item Code</th>
                  <th className="px-4 py-3 text-left text-gray-700">Item Name</th>
                  <th className="px-4 py-3 text-left text-gray-700">Pricing Type</th>
                  <th className="px-4 py-3 text-left text-gray-700">Unit Price</th>
                  <th className="px-4 py-3 text-left text-gray-700">Agreement</th>
                  <th className="px-4 py-3 text-left text-gray-700">Min Qty</th>
                  <th className="px-4 py-3 text-left text-gray-700">Multiple Of</th>
                  <th className="px-4 py-3 text-left text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mappings.map((mapping) => {
                  const item = getItemById(mapping.itemId);
                  if (!item) return null;

                  return (
                    <tr key={mapping.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {item.photo ? (
                            <img src={item.photo} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <span className="text-gray-400 text-xs">No image</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{item.code}</td>
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                            mapping.pricingType === 'fixed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {mapping.pricingType === 'fixed' ? 'Fixed Price' : 'Not Fixed'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {mapping.pricingType === 'fixed' && mapping.unitPrice
                          ? `₱${mapping.unitPrice.toFixed(2)}`
                          : '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{mapping.agreementNumber || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{mapping.minQuantity}</td>
                      <td className="px-4 py-3 text-gray-600">{mapping.multipleOf}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(mapping)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ isOpen: true, mappingId: mapping.id })}
                            className="p-2 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingMapping ? 'Edit Item Mapping' : 'Add Item Mapping'}
        size="lg"
      >
        <div className="space-y-6">
          {/* Section 1: Item Selection */}
          <div>
            <h4 className="text-gray-900 mb-4">Item Selection</h4>
            <FormField label="Select Item" required error={errors.itemId}>
              <select
                value={formData.itemId}
                onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
              >
                <option value="">Select an item</option>
                {availableItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.code} - {item.name}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          {/* Section 2: Pricing Configuration */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-gray-900 mb-4">Pricing Configuration</h4>

            <FormField label="Pricing Type" required>
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="pricingType"
                    value="fixed"
                    checked={formData.pricingType === 'fixed'}
                    onChange={(e) => setFormData({ ...formData, pricingType: 'fixed' })}
                    className="mt-1 w-4 h-4 text-[#ec2224] focus:ring-[#ec2224]"
                  />
                  <div>
                    <p>Fixed Price</p>
                    <p className="text-gray-600">Price is pre-determined</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="pricingType"
                    value="not-fixed"
                    checked={formData.pricingType === 'not-fixed'}
                    onChange={(e) => setFormData({ ...formData, pricingType: 'not-fixed' })}
                    className="mt-1 w-4 h-4 text-[#ec2224] focus:ring-[#ec2224]"
                  />
                  <div>
                    <p>Not Fixed</p>
                    <p className="text-gray-600">Price determined at order time</p>
                  </div>
                </label>
              </div>
            </FormField>

            {formData.pricingType === 'fixed' && (
              <>
                <FormField label="Unit Price" required error={errors.unitPrice}>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                    <input
                      type="number"
                      value={formData.unitPrice || ''}
                      onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                      min={0}
                      step={0.01}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
                      placeholder="0.00"
                    />
                  </div>
                </FormField>

                <FormField label="Agreement Number" helpText="Link this pricing to a specific agreement (optional)">
                  <select
                    value={formData.agreementNumber}
                    onChange={(e) => setFormData({ ...formData, agreementNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
                  >
                    <option value="">No agreement</option>
                    {agreements
                      .filter((a) => {
                        const endDate = new Date(a.endDate);
                        return endDate >= new Date();
                      })
                      .map((agreement) => (
                        <option key={agreement.id} value={agreement.contractNumber}>
                          {agreement.contractNumber}
                        </option>
                      ))}
                  </select>
                </FormField>
              </>
            )}
          </div>

          {/* Section 3: Order Constraints */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-gray-900 mb-4">Order Constraints</h4>

            <FormField
              label="Minimum Quantity"
              required
              error={errors.minQuantity}
              helpText="Minimum order quantity for this item"
            >
              <input
                type="number"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: Number(e.target.value) })}
                min={1}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
              />
            </FormField>

            <FormField
              label="Multiple Of"
              required
              error={errors.multipleOf}
              helpText="Orders must be in multiples of this number. Example: If set to 6, customer can order 6, 12, 18, etc."
            >
              <input
                type="number"
                value={formData.multipleOf}
                onChange={(e) => setFormData({ ...formData, multipleOf: Number(e.target.value) })}
                min={1}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
              />
            </FormField>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingMapping ? 'Update' : 'Add'} Mapping
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, mappingId: '' })}
        onConfirm={() => handleDelete(deleteConfirm.mappingId)}
        title="Delete Item Mapping"
        message="Are you sure you want to delete this item mapping? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
