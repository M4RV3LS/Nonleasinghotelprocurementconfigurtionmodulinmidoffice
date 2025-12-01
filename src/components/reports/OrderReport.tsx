import { Order } from "../../mock-data";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
} from "lucide-react";

interface OrderReportProps {
  orders: Order[];
}

interface ItemAggregate {
  itemCode: string;
  itemName: string;
  totalOrders: number;
  totalQuantity: number;
  totalAmount: number;
}

export function OrderReport({ orders }: OrderReportProps) {
  // 1. Calculate Global Summary Metrics
  const totalOrders = orders.length;
  const totalQuantity = orders.reduce(
    (sum, order) =>
      sum +
      order.items.reduce(
        (itemSum, item) => itemSum + item.quantity,
        0,
      ),
    0,
  );
  const totalAmount = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0,
  );

  // 2. Aggregate Data per Item
  const itemMap = new Map<string, ItemAggregate>();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const existing = itemMap.get(item.itemCode);
      if (existing) {
        existing.totalOrders += 1;
        existing.totalQuantity += item.quantity;
        existing.totalAmount += item.subtotal;
      } else {
        itemMap.set(item.itemCode, {
          itemCode: item.itemCode,
          itemName: item.itemName,
          totalOrders: 1,
          totalQuantity: item.quantity,
          totalAmount: item.subtotal,
        });
      }
    });
  });

  // Convert map to array and sort by Total Amount (Value) descending
  const itemAggregates = Array.from(itemMap.values()).sort(
    (a, b) => b.totalAmount - a.totalAmount,
  );

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  return (
    <div className="space-y-8">
      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Total Orders
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-2">
              {totalOrders}
            </h3>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Total Quantity Requested
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-2">
              {totalQuantity.toLocaleString()}
            </h3>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <Package className="w-6 h-6 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Total Order Value
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-2">
              {formatCurrency(totalAmount)}
            </h3>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Item Level Cards */}
      <div>
        <h4 className="text-gray-900 font-semibold mb-4 text-lg">
          Item Level Analytics
        </h4>

        {itemAggregates.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
            No item data available for the selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {itemAggregates.map((item) => (
              <div
                key={item.itemCode}
                className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-gray-100 p-2 rounded text-gray-600 font-mono text-xs">
                    {item.itemCode}
                  </div>
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                </div>

                <h5
                  className="font-semibold text-gray-900 mb-4 line-clamp-2 h-12"
                  title={item.itemName}
                >
                  {item.itemName}
                </h5>

                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      Orders Count:
                    </span>
                    <span className="font-medium text-gray-900">
                      {item.totalOrders}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      Total Qty:
                    </span>
                    <span className="font-medium text-gray-900">
                      {item.totalQuantity.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      Total Value:
                    </span>
                    <span className="font-medium text-[#ec2224]">
                      {formatCurrency(item.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}