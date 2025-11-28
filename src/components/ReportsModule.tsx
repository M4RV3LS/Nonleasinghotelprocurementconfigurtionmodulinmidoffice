import { useState } from 'react';
import { OrderTable } from './reports/OrderTable';
import { OrderReport } from './reports/OrderReport';

export interface Order {
  id: string;
  createdOn: string;
  propertyCode: string;
  propertyName: string;
  propertyRegion: string;
  channel: 'whatsapp' | 'email';
  items: OrderItem[];
  vendorName: string;
  totalAmount: number;
  status: 'requested' | 'sent' | 'cancelled';
}

export interface OrderItem {
  itemCode: string;
  itemName: string;
  specifications?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export function ReportsModule() {
  const [activeTab, setActiveTab] = useState<'table' | 'report'>('table');

  // Mock order data
  const [orders] = useState<Order[]>([
    {
      id: 'ORD-20241128-001',
      createdOn: '2024-11-28 09:15',
      propertyCode: 'PROP-001',
      propertyName: 'Grand Hotel Jakarta',
      propertyRegion: 'DKI Jakarta (Jakarta)',
      channel: 'whatsapp',
      items: [
        { itemCode: 'ITM001', itemName: 'Mineral Water 600ml', quantity: 240, unitPrice: 5000, subtotal: 1200000 },
        { itemCode: 'ITM002', itemName: 'Towel White Large', quantity: 48, unitPrice: 25000, subtotal: 1200000 },
      ],
      vendorName: 'Pacific Supplies Ltd.',
      totalAmount: 2400000,
      status: 'sent',
    },
    {
      id: 'ORD-20241128-002',
      createdOn: '2024-11-28 10:30',
      propertyCode: 'PROP-002',
      propertyName: 'Bali Beach Resort',
      propertyRegion: 'Bali (Denpasar)',
      channel: 'email',
      items: [
        { itemCode: 'ITM003', itemName: 'Bed Sheet King', quantity: 24, unitPrice: 60000, subtotal: 1440000 },
      ],
      vendorName: 'Pacific Supplies Ltd.',
      totalAmount: 1440000,
      status: 'requested',
    },
    {
      id: 'ORD-20241127-003',
      createdOn: '2024-11-27 14:20',
      propertyCode: 'PROP-003',
      propertyName: 'Surabaya Plaza Hotel',
      propertyRegion: 'Jawa Timur (Surabaya)',
      channel: 'whatsapp',
      items: [
        { itemCode: 'ITM001', itemName: 'Mineral Water 600ml', quantity: 480, unitPrice: 5000, subtotal: 2400000 },
        { itemCode: 'ITM004', itemName: 'Coffee Mug Set', quantity: 12, unitPrice: 150000, subtotal: 1800000 },
        { itemCode: 'ITM005', itemName: 'Laundry Detergent 5L', quantity: 6, unitPrice: 85000, subtotal: 510000 },
      ],
      vendorName: 'Eastern Supplies Co.',
      totalAmount: 4710000,
      status: 'sent',
    },
    {
      id: 'ORD-20241127-004',
      createdOn: '2024-11-27 11:45',
      propertyCode: 'PROP-001',
      propertyName: 'Grand Hotel Jakarta',
      propertyRegion: 'DKI Jakarta (Jakarta)',
      channel: 'email',
      items: [
        { itemCode: 'ITM002', itemName: 'Towel White Large', quantity: 72, unitPrice: 25000, subtotal: 1800000 },
      ],
      vendorName: 'Pacific Supplies Ltd.',
      totalAmount: 1800000,
      status: 'cancelled',
    },
    {
      id: 'ORD-20241126-005',
      createdOn: '2024-11-26 16:00',
      propertyCode: 'PROP-004',
      propertyName: 'Bandung Mountain Inn',
      propertyRegion: 'Jawa Barat (Bandung)',
      channel: 'whatsapp',
      items: [
        { itemCode: 'ITM001', itemName: 'Mineral Water 600ml', quantity: 144, unitPrice: 5000, subtotal: 720000 },
        { itemCode: 'ITM003', itemName: 'Bed Sheet King', quantity: 12, unitPrice: 60000, subtotal: 720000 },
      ],
      vendorName: 'Western Suppliers',
      totalAmount: 1440000,
      status: 'sent',
    },
  ]);

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
