import { useState } from 'react';
import { ItemCategory } from '../ItemCategoryConfiguration';
import { Button } from '../shared/Button';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { ToggleSwitch } from '../shared/ToggleSwitch';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

interface CategoryListProps {
  categories: ItemCategory[];
  onCreateCategory: () => void;
  onEditCategory: (category: ItemCategory) => void;
  onDeleteCategory: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function CategoryList({
  categories,
  onCreateCategory,
  onEditCategory,
  onDeleteCategory,
  onToggleStatus,
}: CategoryListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    categoryId: string;
    categoryName: string;
    itemsCount: number;
  }>({
    isOpen: false,
    categoryId: '',
    categoryName: '',
    itemsCount: 0,
  });
  const [statusConfirm, setStatusConfirm] = useState<{
    isOpen: boolean;
    categoryId: string;
    currentStatus: string;
  }>({
    isOpen: false,
    categoryId: '',
    currentStatus: '',
  });

  // Filter categories
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || category.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900">Item Category Configuration</h2>
            <p className="text-gray-600 mt-1">Manage categories for item organization</p>
          </div>
          <Button onClick={onCreateCategory}>
            <Plus className="w-4 h-4" />
            Create New Category
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by code, name, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No categories found</p>
          <Button onClick={onCreateCategory}>Create First Category</Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Category Code</th>
                <th className="px-6 py-3 text-left text-gray-700">Category Name</th>
                <th className="px-6 py-3 text-left text-gray-700">Description</th>
                <th className="px-6 py-3 text-left text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-gray-700">Items Count</th>
                <th className="px-6 py-3 text-left text-gray-700">Date Created</th>
                <th className="px-6 py-3 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-600">{category.code}</td>
                  <td
                    className="px-6 py-4 cursor-pointer hover:underline"
                    onClick={() => onEditCategory(category)}
                  >
                    <div className="flex items-center gap-2">
                      {category.name}
                      {category.isSystemDefault && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                          System Default
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{category.description}</td>
                  <td className="px-6 py-4">
                    <ToggleSwitch
                      checked={category.status === 'active'}
                      onChange={() =>
                        setStatusConfirm({
                          isOpen: true,
                          categoryId: category.id,
                          currentStatus: category.status,
                        })
                      }
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600">
                      {category.itemsCount} item{category.itemsCount !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(category.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditCategory(category)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      {!category.isSystemDefault && (
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              isOpen: true,
                              categoryId: category.id,
                              categoryName: category.name,
                              itemsCount: category.itemsCount,
                            })
                          }
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
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, categoryId: '', categoryName: '', itemsCount: 0 })}
        onConfirm={() => onDeleteCategory(deleteConfirm.categoryId)}
        title="Delete Category"
        message={
          deleteConfirm.itemsCount > 0
            ? `This category is used by ${deleteConfirm.itemsCount} item(s). Are you sure you want to delete "${deleteConfirm.categoryName}"? Items using this category will need to be reassigned.`
            : `Are you sure you want to delete "${deleteConfirm.categoryName}"?`
        }
        confirmText="Delete"
        variant="danger"
      />

      {/* Status Change Confirmation */}
      <ConfirmDialog
        isOpen={statusConfirm.isOpen}
        onClose={() => setStatusConfirm({ isOpen: false, categoryId: '', currentStatus: '' })}
        onConfirm={() => onToggleStatus(statusConfirm.categoryId)}
        title="Change Category Status"
        message={
          statusConfirm.currentStatus === 'active'
            ? "Items using this category will remain assigned but the category won't be available for new items."
            : 'Change category status to Active?'
        }
        confirmText="Change Status"
      />
    </div>
  );
}
