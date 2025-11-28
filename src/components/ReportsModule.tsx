import { useState } from 'react';
import { OrderTable } from './reports/OrderTable';
import { OrderReport } from './reports/OrderReport';
import { MOCK_ORDERS, Order, OrderItem } from '../mock-data';

// Re-export types for backward compatibility
export type { Order, OrderItem };

export function ReportsModule() {
  const [activeTab, setActiveTab] = useState<'table' | 'report'>('table');
  const [orders] = useState<Order[]>(MOCK_ORDERS);

  const tabs = [
    { id: 'table' as const, label: 'Order Table' },
    { id: 'report' as const, label: 'Order Report' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-gray-900">Reports</h2>
        <p className="text-gray-600 mt-1">View and analyze order data</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#ec2224] text-[#ec2224]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'table' && <OrderTable orders={orders} />}
          {activeTab === 'report' && <OrderReport orders={orders} />}
        </div>
      </div>
    </div>
  );
}
