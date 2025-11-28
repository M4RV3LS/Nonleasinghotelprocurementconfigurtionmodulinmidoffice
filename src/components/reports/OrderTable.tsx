import { useState } from 'react';
import { Order } from '../ReportsModule';
import { Button } from '../shared/Button';
import { Modal } from '../shared/Modal';
import { Search, Download, Eye, MessageSquare, Mail } from 'lucide-react';

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>(['requested', 'sent', 'cancelled']);
  const [channelFilter, setChannelFilter] = useState<string[]>(['whatsapp', 'email']);
  const [regionFilter, setRegionFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter.includes(order.status);
    const matchesChannel = channelFilter.includes(order.channel);
    const matchesRegion = !regionFilter || order.propertyRegion === regionFilter;
    return matchesSearch && matchesStatus && matchesChannel && matchesRegion;
  });

  const toggleStatusFilter = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter((s) => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };

  const toggleChannelFilter = (channel: string) => {
    if (channelFilter.includes(channel)) {
      setChannelFilter(channelFilter.filter((c) => c !== channel));
    } else {
      setChannelFilter([...channelFilter, channel]);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      requested: 'bg-blue-100 text-blue-800',
      sent: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    const icons = {
      requested: '🕐',
      sent: '✓',
      cancelled: '✗',
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const exportToCSV = () => {
    // CSV export logic would go here
    alert('Export to CSV functionality');
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Order ID, Property, or Vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
            />
          </div>
          <Button variant="secondary" onClick={exportToCSV}>
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="flex gap-2 items-center">
            <span className="text-gray-700">Status:</span>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={statusFilter.includes('requested')}
                onChange={() => toggleStatusFilter('requested')}
                className="w-4 h-4 text-[#ec2224] focus:ring-[#ec2224] rounded"
              />
              <span className="text-gray-600">Requested</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={statusFilter.includes('sent')}
                onChange={() => toggleStatusFilter('sent')}
                className="w-4 h-4 text-[#ec2224] focus:ring-[#ec2224] rounded"
              />
              <span className="text-gray-600">Sent</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={statusFilter.includes('cancelled')}
                onChange={() => toggleStatusFilter('cancelled')}
                className="w-4 h-4 text-[#ec2224] focus:ring-[#ec2224] rounded"
              />
              <span className="text-gray-600">Cancelled</span>
            </label>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-gray-700">Channel:</span>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={channelFilter.includes('whatsapp')}
                onChange={() => toggleChannelFilter('whatsapp')}
                className="w-4 h-4 text-[#ec2224] focus:ring-[#ec2224] rounded"
              />
              <span className="text-gray-600">WhatsApp</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={channelFilter.includes('email')}
                onChange={() => toggleChannelFilter('email')}
                className="w-4 h-4 text-[#ec2224] focus:ring-[#ec2224] rounded"
              />
              <span className="text-gray-600">Email</span>
            </label>
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-500 mb-4">No orders found matching your filters</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700">Order ID</th>
                  <th className="px-4 py-3 text-left text-gray-700">Created On</th>
                  <th className="px-4 py-3 text-left text-gray-700">Property</th>
                  <th className="px-4 py-3 text-left text-gray-700">Region</th>
                  <th className="px-4 py-3 text-left text-gray-700">Channel</th>
                  <th className="px-4 py-3 text-left text-gray-700">Items</th>
                  <th className="px-4 py-3 text-left text-gray-700">Qty</th>
                  <th className="px-4 py-3 text-left text-gray-700">Vendor</th>
                  <th className="px-4 py-3 text-left text-gray-700">Total Amount</th>
                  <th className="px-4 py-3 text-left text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">{order.id}</td>
                      <td className="px-4 py-3 text-gray-600">{order.createdOn}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-gray-600">{order.propertyCode}</p>
                          <p>{order.propertyName}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{order.propertyRegion}</td>
                      <td className="px-4 py-3">
                        {order.channel === 'whatsapp' ? (
                          <span className="inline-flex items-center gap-1">
                            <MessageSquare className="w-4 h-4 text-green-600" />
                            WhatsApp
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <Mail className="w-4 h-4 text-blue-600" />
                            Email
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {order.items.length <= 3 ? (
                          <div className="space-y-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="text-gray-600">
                                • {item.itemName} (x{item.quantity})
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {order.items.slice(0, 2).map((item, idx) => (
                              <div key={idx} className="text-gray-600">
                                • {item.itemName} (x{item.quantity})
                              </div>
                            ))}
                            <button
                              onClick={() => handleViewDetails(order)}
                              className="text-[#ec2224] hover:underline"
                            >
                              +{order.items.length - 2} more items
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{totalQty}</td>
                      <td className="px-4 py-3 text-gray-600">{order.vendorName}</td>
                      <td className="px-4 py-3 text-gray-600">{formatCurrency(order.totalAmount)}</td>
                      <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={`Order Details - ${selectedOrder.id}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Created: {selectedOrder.createdOn}</p>
                <p className="text-gray-600">
                  Channel: {selectedOrder.channel === 'whatsapp' ? '📱 WhatsApp' : '📧 Email'}
                </p>
              </div>
              {getStatusBadge(selectedOrder.status)}
            </div>

            {/* Property Information */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-gray-900 mb-2">Property Information</h4>
              <p className="text-gray-600">Code: {selectedOrder.propertyCode}</p>
              <p className="text-gray-600">Name: {selectedOrder.propertyName}</p>
              <p className="text-gray-600">Region: {selectedOrder.propertyRegion}</p>
            </div>

            {/* Order Items */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-gray-900 mb-2">Order Items</h4>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-gray-700">Item Name</th>
                    <th className="px-3 py-2 text-left text-gray-700">Qty</th>
                    <th className="px-3 py-2 text-left text-gray-700">Unit Price</th>
                    <th className="px-3 py-2 text-left text-gray-700">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-gray-600">{item.itemName}</td>
                      <td className="px-3 py-2 text-gray-600">{item.quantity}</td>
                      <td className="px-3 py-2 text-gray-600">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-3 py-2 text-gray-600">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vendor Information */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-gray-900 mb-2">Vendor Information</h4>
              <p className="text-gray-600">Vendor: {selectedOrder.vendorName}</p>
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-900">Total:</span>
                <span className="text-gray-900">{formatCurrency(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
