import { Order } from '../ReportsModule';

interface OrderReportProps {
  orders: Order[];
}

interface ItemAggregate {
  itemCode: string;
  itemName: string;
  totalOrders: number;
  totalQuantity: number;
  totalAmount: number;
  avgOrderQty: number;
  avgUnitPrice: number;
  percentOfTotal: number;
}

export function OrderReport({ orders }: OrderReportProps) {
  // Calculate summary metrics
  const totalOrders = orders.length;
  const totalQuantity = orders.reduce((sum, order) => 
    sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );
  const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  // Aggregate by item
  const itemMap = new Map<string, ItemAggregate>();
  
  orders.forEach(order => {
    order.items.forEach(item => {
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
          avgOrderQty: 0,
          avgUnitPrice: 0,
          percentOfTotal: 0,
        });
      }
    });
  });

  // Calculate averages and percentages
  const itemAggregates = Array.from(itemMap.values()).map(item => ({
    ...item,
    avgOrderQty: item.totalQuantity / item.totalOrders,
    avgUnitPrice: item.totalAmount / item.totalQuantity,
    percentOfTotal: (item.totalAmount / totalAmount) * 100,
  })).sort((a, b) => b.totalAmount - a.totalAmount);

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-gray-600 mb-2">Total Orders</p>
          <p className="text-gray-900">{totalOrders}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-gray-600 mb-2">Total Quantity</p>
          <p className="text-gray-900">{totalQuantity.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-gray-600 mb-2">Total Order Value</p>
          <p className="text-gray-900">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-gray-600 mb-2">Most Ordered Item</p>
          <p className="text-gray-900">{itemAggregates[0]?.itemName || 'N/A'}</p>
          <p className="text-gray-600">{itemAggregates[0]?.totalQuantity.toLocaleString() || 0} units</p>
        </div>
      </div>

      {/* Item-Level Report Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-gray-900">Item-Level Analytics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700">Item Code</th>
                <th className="px-4 py-3 text-left text-gray-700">Item Name</th>
                <th className="px-4 py-3 text-left text-gray-700">Total Orders</th>
                <th className="px-4 py-3 text-left text-gray-700">Total Quantity</th>
                <th className="px-4 py-3 text-left text-gray-700">Total Amount</th>
                <th className="px-4 py-3 text-left text-gray-700">Avg Order Qty</th>
                <th className="px-4 py-3 text-left text-gray-700">Avg Unit Price</th>
                <th className="px-4 py-3 text-left text-gray-700">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {itemAggregates.map((item, index) => (
                <tr key={item.itemCode} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">
                    {index < 3 && <span className="mr-2">{['🥇', '🥈', '🥉'][index]}</span>}
                    {item.itemCode}
                  </td>
                  <td className="px-4 py-3">{item.itemName}</td>
                  <td className="px-4 py-3 text-gray-600">{item.totalOrders}</td>
                  <td className="px-4 py-3 text-gray-600">{item.totalQuantity.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600">{formatCurrency(item.totalAmount)}</td>
                  <td className="px-4 py-3 text-gray-600">{item.avgOrderQty.toFixed(1)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatCurrency(item.avgUnitPrice)}</td>
                  <td className="px-4 py-3 text-gray-600">{item.percentOfTotal.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
