import { useState } from 'react';
import { Vendor } from '../VendorManagement';
import { Button } from '../shared/Button';
import { StatusBadge } from '../shared/StatusBadge';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { Search, Plus, Eye, Trash2, MapPin } from 'lucide-react';

interface VendorListProps {
  vendors: Vendor[];
  onCreateVendor: () => void;
  onEditVendor: (vendor: Vendor) => void;
  onDeleteVendor: (id: string) => void;
}

export function VendorList({ vendors, onCreateVendor, onEditVendor, onDeleteVendor }: VendorListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [islandFilter, setIslandFilter] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    vendorId: string;
    vendorName: string;
  }>({ isOpen: false, vendorId: '', vendorName: '' });

  const allIslands = Array.from(new Set(vendors.flatMap((v) => v.islands)));

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIsland = !islandFilter || vendor.islands.includes(islandFilter);
    return matchesSearch && matchesIsland;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900">Vendor Management</h2>
            <p className="text-gray-600 mt-1">Manage vendor relationships and configurations</p>
          </div>
          <Button onClick={onCreateVendor}>
            <Plus className="w-4 h-4" />
            Create New Vendor
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by vendor code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
            />
          </div>

          <select
            value={islandFilter}
            onChange={(e) => setIslandFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
          >
            <option value="">All Islands</option>
            {allIslands.map((island) => (
              <option key={island} value={island}>
                {island}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vendor Cards */}
      {filteredVendors.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No vendors found</p>
          <Button onClick={onCreateVendor}>Create First Vendor</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-[#ec2224] mb-1">{vendor.code}</p>
                  <h4 className="text-gray-900 mb-2">{vendor.name}</h4>
                  <StatusBadge status={vendor.status} />
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="flex flex-wrap gap-1">
                    {vendor.islands.slice(0, 2).map((island) => (
                      <span key={island} className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {island}
                      </span>
                    ))}
                    {vendor.islands.length > 2 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        +{vendor.islands.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-gray-600">
                  <p>Commission: {vendor.commission}%</p>
                  <p className="mt-1">{vendor.contactPerson}</p>
                  <p className="mt-1">{vendor.phone}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onEditVendor(vendor)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    setDeleteConfirm({
                      isOpen: true,
                      vendorId: vendor.id,
                      vendorName: vendor.name,
                    })
                  }
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, vendorId: '', vendorName: '' })}
        onConfirm={() => onDeleteVendor(deleteConfirm.vendorId)}
        title="Delete Vendor"
        message={`Are you sure you want to delete "${deleteConfirm.vendorName}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
