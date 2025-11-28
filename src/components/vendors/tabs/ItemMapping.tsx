import { useState } from 'react';
import { ItemMapping as ItemMappingType, Agreement } from '../../VendorManagement';
import { Button } from '../../shared/Button';
import { Modal } from '../../shared/Modal';
import { FormField } from '../../shared/FormField';
import { ConfirmDialog } from '../../shared/ConfirmDialog';
import { Plus, Edit, Trash2 } from 'lucide-react';

// Mock items - in a real app, these would come from ItemConfiguration
const AVAILABLE_ITEMS = [
  { id: '1', code: 'ITM001', name: 'Premium Cotton T-Shirt', photo: 'https://images.unsplash.com/photo-1713881587420-113c1c43e28a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjB0c2hpcnQlMjBwcm9kdWN0fGVufDF8fHx8MTc2NDI5ODg4M3ww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: '2', code: 'ITM002', name: 'Wireless Mouse', photo: 'https://images.unsplash.com/photo-1670013190339-dfdab1ce99d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGNvbXB1dGVyJTIwbW91c2V8ZW58MXx8fHwxNzY0MjIyMTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: '3', code: 'ITM003', name: 'Office Chair', photo: 'https://images.unsplash.com/photo-1688578735427-994ecdea3ea4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBjaGFpcnxlbnwxfHx8fDE3NjQyODU5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: '4', code: 'ITM004', name: 'Laptop Stand', photo: 'https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBzdGFuZCUyMGRlc2t8ZW58MXx8fHwxNzY0MjYwMTAzfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: '5', code: 'ITM005', name: 'Coffee Mug Set', photo: 'https://images.unsplash.com/photo-1666713711218-8ea7743c8ed1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtdWclMjBzZXR8ZW58MXx8fHwxNzY0Mjk4ODg1fDA&ixlib=rb-4.1.0&q=80&w=1080' },
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

    if (!formData.unitPrice || formData.unitPrice <= 0) {
      newErrors.unitPrice = 'Unit price must be greater than 0';
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

    if (editingMapping) {
      onChange(
        mappings.map((m) =>
          m.id === editingMapping.id ? { ...formData, id: editingMapping.id } : m
        )
      );
    } else {
      const newMapping: ItemMappingType = {
        ...formData,
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
                  <th className="px-4 py-3 text-left text-gray-700">Unit Price (IDR)</th>
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
                      <td className="px-4 py-3 text-gray-600">
                        Rp {mapping.unitPrice.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

            <FormField label="Unit Price (IDR)" required error={errors.unitPrice}>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                <input
                  type="number"
                  value={formData.unitPrice || ''}
                  onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                  min={0}
                  step={0.01}
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
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
