import { useState } from 'react';
import { Item } from '../ItemConfiguration';
import { Button } from '../shared/Button';
import { StatusBadge } from '../shared/StatusBadge';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { ToggleSwitch } from '../shared/ToggleSwitch';
import { ImageLightbox } from '../shared/ImageLightbox';
import { Search, Filter, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface ItemListProps {
  items: Item[];
  onCreateItem: () => void;
  onEditItem: (item: Item) => void;
  onDeleteItem: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function ItemList({ items, onCreateItem, onEditItem, onDeleteItem, onToggleStatus }: ItemListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; itemId: string; itemName: string }>({
    isOpen: false,
    itemId: '',
    itemName: '',
  });
  const [statusConfirm, setStatusConfirm] = useState<{ isOpen: boolean; itemId: string; currentStatus: string }>({
    isOpen: false,
    itemId: '',
    currentStatus: '',
  });
  const [lightbox, setLightbox] = useState<{ isOpen: boolean; imageUrl: string; title: string; subtitle: string }>({
    isOpen: false,
    imageUrl: '',
    title: '',
    subtitle: '',
  });

  // Get unique categories
  const categories = Array.from(new Set(items.map((item) => item.category)));

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900">Item Configuration</h2>
            <p className="text-gray-600 mt-1">Manage your product catalog</p>
          </div>
          <Button onClick={onCreateItem}>
            <Plus className="w-4 h-4" />
            Create New Item
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by code, name, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

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
      {paginatedItems.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No items found</p>
          <Button onClick={onCreateItem}>Create First Item</Button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700">Photo</th>
                  <th className="px-6 py-3 text-left text-gray-700">Item Code</th>
                  <th className="px-6 py-3 text-left text-gray-700">Item Name</th>
                  <th className="px-6 py-3 text-left text-gray-700">Category</th>
                  <th className="px-6 py-3 text-left text-gray-700">UoM</th>
                  <th className="px-6 py-3 text-left text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => item.photo && setLightbox({
                          isOpen: true,
                          imageUrl: item.photo,
                          title: `${item.code} - ${item.name}`,
                          subtitle: 'Primary Photo'
                        })}
                        className={`p-2 rounded-lg ${item.photo ? 'hover:bg-gray-100 text-blue-600' : 'text-gray-400 cursor-not-allowed'}`}
                        disabled={!item.photo}
                        title={item.photo ? 'View photo' : 'No photo available'}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                    <td
                      className="px-6 py-4 text-[#ec2224] cursor-pointer hover:underline"
                      onClick={() => onEditItem(item)}
                    >
                      {item.code}
                    </td>
                    <td
                      className="px-6 py-4 cursor-pointer hover:underline"
                      onClick={() => onEditItem(item)}
                    >
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.category}</td>
                    <td className="px-6 py-4 text-gray-600">{item.uom}</td>
                    <td className="px-6 py-4">
                      <ToggleSwitch
                        checked={item.status === 'active'}
                        onChange={() =>
                          setStatusConfirm({
                            isOpen: true,
                            itemId: item.id,
                            currentStatus: item.status,
                          })
                        }
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEditItem(item)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              isOpen: true,
                              itemId: item.id,
                              itemName: item.name,
                            })
                          }
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-gray-600">
                items per page (Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredItems.length)} of {filteredItems.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="px-4 text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, itemId: '', itemName: '' })}
        onConfirm={() => onDeleteItem(deleteConfirm.itemId)}
        title="Delete Item"
        message={`Are you sure you want to delete "${deleteConfirm.itemName}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />

      <ConfirmDialog
        isOpen={statusConfirm.isOpen}
        onClose={() => setStatusConfirm({ isOpen: false, itemId: '', currentStatus: '' })}
        onConfirm={() => onToggleStatus(statusConfirm.itemId)}
        title="Change Item Status"
        message={`Change item status to ${statusConfirm.currentStatus === 'active' ? 'Inactive' : 'Active'}? ${
          statusConfirm.currentStatus === 'active' ? 'Note: Inactive items cannot be selected in RedPartners module.' : ''
        }`}
        confirmText="Change Status"
      />

      {/* Image Lightbox */}
      <ImageLightbox
        isOpen={lightbox.isOpen}
        onClose={() => setLightbox({ isOpen: false, imageUrl: '', title: '', subtitle: '' })}
        imageUrl={lightbox.imageUrl}
        title={lightbox.title}
        subtitle={lightbox.subtitle}
      />
    </div>
  );
}
