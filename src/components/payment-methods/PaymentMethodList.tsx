import { useState } from 'react';
import { PaymentMethod } from '../PaymentMethodConfiguration';
import { Button } from '../shared/Button';
import { StatusBadge } from '../shared/StatusBadge';
import { Modal } from '../shared/Modal';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { ToggleSwitch } from '../shared/ToggleSwitch';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

interface PaymentMethodListProps {
  paymentMethods: PaymentMethod[];
  onCreate: (name: string) => void;
  onUpdateStatus: (id: string, status: 'active' | 'inactive') => void;
  onDelete: (id: string) => void;
}

export function PaymentMethodList({
  paymentMethods,
  onCreate,
  onUpdateStatus,
  onDelete,
}: PaymentMethodListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [newName, setNewName] = useState('');
  const [nameError, setNameError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    method: PaymentMethod | null;
  }>({ isOpen: false, method: null });

  const filteredMethods = paymentMethods.filter((method) =>
    method.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setNewName('');
    setNameError('');
    setShowCreateModal(true);
  };

  const handleOpenEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setNewName(method.name);
    setNameError('');
  };

  const validateName = (name: string, currentId?: string) => {
    if (!name.trim()) {
      return 'Payment method name is required';
    }
    if (name.length > 100) {
      return 'Payment method name must be 100 characters or less';
    }
    
    const exists = paymentMethods.some(
      (pm) => pm.name.toLowerCase() === name.toLowerCase() && pm.id !== currentId
    );
    if (exists) {
      return 'This payment method name already exists. Please use a different name.';
    }
    
    return '';
  };

  const handleCreate = () => {
    const error = validateName(newName);
    if (error) {
      setNameError(error);
      return;
    }
    
    onCreate(newName);
    setShowCreateModal(false);
    setNewName('');
  };

  const handleUpdate = () => {
    if (!editingMethod) return;
    
    const error = validateName(newName, editingMethod.id);
    if (error) {
      setNameError(error);
      return;
    }
    
    // In a real app, you'd have an onUpdate callback
    // For now, we'll just close the modal since status is handled separately
    setEditingMethod(null);
    setNewName('');
  };

  const handleDeleteClick = (method: PaymentMethod) => {
    setDeleteConfirm({ isOpen: true, method });
  };

  const confirmDelete = () => {
    if (deleteConfirm.method) {
      onDelete(deleteConfirm.method.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900">Payment Method Configuration</h2>
            <p className="text-gray-600 mt-1">Manage payment terms and methods</p>
          </div>
          <Button onClick={handleOpenCreate}>
            <Plus className="w-4 h-4" />
            Create Payment Method
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search payment methods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700">Payment Method Name</th>
              <th className="px-6 py-3 text-left text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-gray-700">Date Created</th>
              <th className="px-6 py-3 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredMethods.map((method) => (
              <tr key={method.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span>{method.name}</span>
                </td>
                <td className="px-6 py-4">
                  <ToggleSwitch
                    checked={method.status === 'active'}
                    onChange={(checked) =>
                      onUpdateStatus(method.id, checked ? 'active' : 'inactive')
                    }
                  />
                </td>
                <td className="px-6 py-4 text-gray-600">{formatDate(method.createdAt)}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEdit(method)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    {!method.isSystemDefault && (
                      <button
                        onClick={() => handleDeleteClick(method)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Payment Method"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">
              Payment Method Name <span className="text-[#ec2224]">*</span>
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setNameError('');
              }}
              maxLength={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
              placeholder="Enter payment method name"
            />
            {nameError && <p className="mt-1 text-red-600">{nameError}</p>}
            <p className="mt-1 text-gray-500">{newName.length}/100 characters</p>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Save
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editingMethod !== null}
        onClose={() => setEditingMethod(null)}
        title="Edit Payment Method"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">
              Payment Method Name <span className="text-[#ec2224]">*</span>
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setNameError('');
              }}
              maxLength={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
              placeholder="Enter payment method name"
              disabled={editingMethod?.isSystemDefault}
            />
            {nameError && <p className="mt-1 text-red-600">{nameError}</p>}
            {editingMethod?.isSystemDefault && (
              <p className="mt-1 text-gray-500">
                System default payment methods cannot be renamed
              </p>
            )}
          </div>

          {editingMethod && (
            <div>
              <label className="block text-gray-700 mb-2">Status</label>
              <ToggleSwitch
                checked={editingMethod.status === 'active'}
                onChange={(checked) => {
                  onUpdateStatus(editingMethod.id, checked ? 'active' : 'inactive');
                  setEditingMethod({ ...editingMethod, status: checked ? 'active' : 'inactive' });
                }}
                label={editingMethod.status === 'active' ? 'Active' : 'Inactive'}
              />
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={() => setEditingMethod(null)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, method: null })}
        onConfirm={confirmDelete}
        title="Delete Payment Method"
        message={`Are you sure you want to delete "${deleteConfirm.method?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
