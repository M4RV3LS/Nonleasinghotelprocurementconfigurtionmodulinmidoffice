import { useState } from "react";
import { Order } from "../../mock-data";
import { Button } from "../shared/Button";
import { Modal } from "../shared/Modal";
import {
  Eye,
  MessageSquare,
  Mail,
  Download,
} from "lucide-react";

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Local text search (optional, to find specific ID or Name within the filtered results)
  const filteredOrders = orders.filter(
    (order) =>
      order.id
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.propertyName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.propertyCode
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.vendorName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      requested: "bg-blue-100 text-blue-800",
      sent: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status as keyof typeof styles]}`}
      >
        {status}
      </span>
    );
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Quick search within results..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
        />
        <Button
          variant="secondary"
          onClick={() => alert("Exporting to CSV...")}
        >
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Property Code
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Property Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Region
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Created On
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Channel
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Items
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Qty
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Vendor
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No orders found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const totalQty = order.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0,
                  );
                  const itemPreview = order.items
                    .map((i) => i.itemName)
                    .join(", ");

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-[#ec2224]">
                        {order.propertyCode}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {order.propertyName}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {order.propertyRegion}
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono">
                        {order.id}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {order.createdOn}
                      </td>
                      <td className="px-4 py-3">
                        {order.channel === "whatsapp" ? (
                          <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded text-xs">
                            <MessageSquare className="w-3 h-3" />{" "}
                            WhatsApp
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs">
                            <Mail className="w-3 h-3" /> Email
                          </span>
                        )}
                      </td>
                      <td
                        className="px-4 py-3 text-gray-600 max-w-xs truncate"
                        title={itemPreview}
                      >
                        {order.items.length} Item
                        {order.items.length > 1 ? "s" : ""}
                        <span className="text-gray-400 ml-1">
                          ({order.items[0].itemName}...)
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-medium">
                        {totalQty}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {order.vendorName}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            handleViewDetails(order)
                          }
                          className="text-gray-500 hover:text-[#ec2224] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal (Kept simple for brevity) */}
      {selectedOrder && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={`Order Details: ${selectedOrder.id}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">
                  Property
                </p>
                <p className="font-medium">
                  {selectedOrder.propertyName} (
                  {selectedOrder.propertyCode})
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Vendor</p>
                <p className="font-medium">
                  {selectedOrder.vendorName}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Order Items</h4>
              <table className="w-full text-sm border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">
                      Item Name
                    </th>
                    <th className="px-3 py-2 text-right">
                      Qty
                    </th>
                    <th className="px-3 py-2 text-right">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-gray-100"
                    >
                      <td className="px-3 py-2">
                        {item.itemName}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {item.quantity}
                      </td>
                      <td className="px-3 py-2 text-right">
                        Rp {item.subtotal.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end pt-4">
              <Button
                variant="secondary"
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}