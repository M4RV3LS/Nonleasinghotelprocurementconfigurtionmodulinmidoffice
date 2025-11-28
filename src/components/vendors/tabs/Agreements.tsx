import { useState } from 'react';
import { Agreement } from '../../VendorManagement';
import { Button } from '../../shared/Button';
import { Modal } from '../../shared/Modal';
import { FormField } from '../../shared/FormField';
import { ConfirmDialog } from '../../shared/ConfirmDialog';
import { Plus, Edit, Trash2, ExternalLink, AlertCircle } from 'lucide-react';

interface AgreementsProps {
  agreements: Agreement[];
  onChange: (agreements: Agreement[]) => void;
}

export function Agreements({ agreements, onChange }: AgreementsProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingAgreement, setEditingAgreement] = useState<Agreement | null>(null);
  const [formData, setFormData] = useState<Omit<Agreement, 'id'>>({
    contractNumber: '',
    startDate: '',
    endDate: '',
    documentLink: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    agreementId: string;
  }>({ isOpen: false, agreementId: '' });

  const handleAdd = () => {
    setEditingAgreement(null);
    setFormData({
      contractNumber: '',
      startDate: '',
      endDate: '',
      documentLink: '',
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (agreement: Agreement) => {
    setEditingAgreement(agreement);
    setFormData({
      contractNumber: agreement.contractNumber,
      startDate: agreement.startDate,
      endDate: agreement.endDate,
      documentLink: agreement.documentLink || '',
    });
    setErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.contractNumber.trim()) {
      newErrors.contractNumber = 'Contract number is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.endDate <= formData.startDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (editingAgreement) {
      onChange(
        agreements.map((a) =>
          a.id === editingAgreement.id ? { ...formData, id: editingAgreement.id } : a
        )
      );
    } else {
      const newAgreement: Agreement = {
        ...formData,
        id: Date.now().toString(),
      };
      onChange([...agreements, newAgreement]);
    }

    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    onChange(agreements.filter((a) => a.id !== id));
  };

  const getStatus = (agreement: Agreement): 'active' | 'expired' => {
    const today = new Date();
    const endDate = new Date(agreement.endDate);
    return endDate >= today ? 'active' : 'expired';
  };

  const getDaysUntilExpiry = (agreement: Agreement): number => {
    const today = new Date();
    const endDate = new Date(agreement.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">Manage contracts and offerings for this vendor</p>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4" />
          Add Agreement
        </Button>
      </div>

      {/* Agreements Table */}
      {agreements.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-500 mb-4">No agreements added yet</p>
          <Button onClick={handleAdd}>Add First Agreement</Button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700">Contract Number</th>
                <th className="px-4 py-3 text-left text-gray-700">Start Date</th>
                <th className="px-4 py-3 text-left text-gray-700">End Date</th>
                <th className="px-4 py-3 text-left text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-gray-700">Document</th>
                <th className="px-4 py-3 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {agreements.map((agreement) => {
                const status = getStatus(agreement);
                const daysUntilExpiry = getDaysUntilExpiry(agreement);

                return (
                  <tr key={agreement.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{agreement.contractNumber}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(agreement.startDate)}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-gray-600">{formatDate(agreement.endDate)}</p>
                        {status === 'active' && daysUntilExpiry <= 30 && (
                          <p className="text-yellow-600 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" />
                            Expires in {daysUntilExpiry} days
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                          status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {status === 'active' ? 'Active' : 'Expired'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {agreement.documentLink ? (
                        <a
                          href={agreement.documentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#ec2224] hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(agreement)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ isOpen: true, agreementId: agreement.id })}
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
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingAgreement ? 'Edit Agreement' : 'Add Agreement'}
        size="lg"
      >
        <div className="space-y-4">
          <FormField label="Contract Number" required error={errors.contractNumber}>
            <input
              type="text"
              value={formData.contractNumber}
              onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
              maxLength={50}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
              placeholder="e.g., CTR-2024-001"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date" required error={errors.startDate}>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
              />
            </FormField>

            <FormField label="End Date" required error={errors.endDate}>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
              />
            </FormField>
          </div>

          <FormField label="Document Link" helpText="Provide a URL to the agreement document (optional)">
            <input
              type="url"
              value={formData.documentLink}
              onChange={(e) => setFormData({ ...formData, documentLink: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
              placeholder="https://example.com/document.pdf"
            />
          </FormField>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingAgreement ? 'Update' : 'Add'} Agreement
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, agreementId: '' })}
        onConfirm={() => handleDelete(deleteConfirm.agreementId)}
        title="Delete Agreement"
        message="Are you sure you want to delete this agreement? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
