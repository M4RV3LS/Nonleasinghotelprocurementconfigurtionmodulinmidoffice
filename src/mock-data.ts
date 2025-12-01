// Centralized mock data for the vendor management system

// Item Categories
export interface ItemCategory {
  id: string;
  code: string;
  brandName: string;
  itemCategory: 'Branding Item' | 'Ops Item' | 'Others';
  name: string;
  description: string;
  status: 'active' | 'inactive';
  isSystemDefault: boolean;
  itemsCount: number;
  createdAt: string;
}

export const MOCK_CATEGORIES: ItemCategory[] = [
  {
    id: '1',
    code: 'LINEN',
    brandName: 'Reddoorz',
    itemCategory: 'Ops Item',
    name: 'Linen',
    description: 'Bed linen, towels, and textile products',
    status: 'active',
    isSystemDefault: true,
    itemsCount: 15,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    code: 'LAUNDRY',
    brandName: 'Sans',
    itemCategory: 'Ops Item',
    name: 'Laundry',
    description: 'Laundry services and supplies',
    status: 'active',
    isSystemDefault: true,
    itemsCount: 8,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    code: 'BEVERAGE',
    brandName: 'Reddoorz Premium',
    itemCategory: 'Branding Item',
    name: 'Beverage',
    description: 'Bottled water and beverages',
    status: 'active',
    isSystemDefault: true,
    itemsCount: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    code: 'TECHNICAL',
    brandName: 'No Branding',
    itemCategory: 'Ops Item',
    name: 'Technical Services',
    description: 'Air conditioning and handyman services',
    status: 'active',
    isSystemDefault: true,
    itemsCount: 6,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    code: 'VENDING',
    brandName: 'The Lavana',
    itemCategory: 'Others',
    name: 'Vending Machine',
    description: 'Vending machine products and services',
    status: 'active',
    isSystemDefault: true,
    itemsCount: 10,
    createdAt: new Date().toISOString(),
  },
];

// Payment Methods
export interface PaymentMethod {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  isSystemDefault: boolean;
  createdAt: string;
}

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: '1',
    name: 'Term of Payment 30 Days',
    status: 'active',
    isSystemDefault: true,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Term of Payment 60 Days',
    status: 'active',
    isSystemDefault: true,
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'Cash on Delivery (COD)',
    status: 'active',
    isSystemDefault: true,
    createdAt: '2024-01-01',
  },
  {
    id: '4',
    name: 'Advance Payment',
    status: 'active',
    isSystemDefault: true,
    createdAt: '2024-01-01',
  },
  {
    id: '5',
    name: 'Bank Transfer',
    status: 'active',
    isSystemDefault: false,
    createdAt: '2024-01-15',
  },
  {
    id: '6',
    name: 'Credit Card',
    status: 'active',
    isSystemDefault: false,
    createdAt: '2024-01-20',
  },
];

// Available Payment Methods for Vendor Selection
export const AVAILABLE_PAYMENT_METHODS = MOCK_PAYMENT_METHODS.map(pm => ({
  id: pm.id,
  name: pm.name
}));

// Items for Item Mapping
export interface AvailableItem {
  id: string;
  code: string;
  name: string;
  photo: string;
}

export const AVAILABLE_ITEMS: AvailableItem[] = [
  { 
    id: '1', 
    code: 'ITM001', 
    name: 'Premium Cotton T-Shirt', 
    photo: 'https://images.unsplash.com/photo-1713881587420-113c1c43e28a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjB0c2hpcnQlMjBwcm9kdWN0fGVufDF8fHx8MTc2NDI5ODg4M3ww&ixlib=rb-4.1.0&q=80&w=1080' 
  },
  { 
    id: '2', 
    code: 'ITM002', 
    name: 'Wireless Mouse', 
    photo: 'https://images.unsplash.com/photo-1670013190339-dfdab1ce99d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGNvbXB1dGVyJTIwbW91c2V8ZW58MXx8fHwxNzY0MjIyMTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080' 
  },
  { 
    id: '3', 
    code: 'ITM003', 
    name: 'Office Chair', 
    photo: 'https://images.unsplash.com/photo-1688578735427-994ecdea3ea4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBjaGFpcnxlbnwxfHx8fDE3NjQyODU5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080' 
  },
  { 
    id: '4', 
    code: 'ITM004', 
    name: 'Laptop Stand', 
    photo: 'https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBzdGFuZCUyMGRlc2t8ZW58MXx8fHwxNzY0MjYwMTAzfDA&ixlib=rb-4.1.0&q=80&w=1080' 
  },
  { 
    id: '5', 
    code: 'ITM005', 
    name: 'Coffee Mug Set', 
    photo: 'https://images.unsplash.com/photo-1666713711218-8ea7743c8ed1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtdWclMjBzZXR8ZW58MXx8fHwxNzY0Mjk4ODg1fDA&ixlib=rb-4.1.0&q=80&w=1080' 
  },
];

// Indonesian Provinces
export const PROVINCES = [
  'Nanggroe Aceh Darussalam (Banda Aceh)',
  'Sumatera Utara (Medan)',
  'Sumatera Selatan (Palembang)',
  'Sumatera Barat (Padang)',
  'Bengkulu (Bengkulu)',
  'Riau (Pekanbaru)',
  'Kepulauan Riau (Tanjung Pinang)',
  'Jambi (Jambi)',
  'Lampung (Bandar Lampung)',
  'Bangka Belitung (Pangkal Pinang)',
  'Kalimantan Barat (Pontianak)',
  'Kalimantan Timur (Samarinda)',
  'Kalimantan Selatan (Banjarmasin)',
  'Kalimantan Tengah (Palangkaraya)',
  'Kalimantan Utara (Tanjung Selor)',
  'Banten (Serang)',
  'DKI Jakarta (Jakarta)',
  'Jawa Barat (Bandung)',
  'Jawa Tengah (Semarang)',
  'DI Yogyakarta (Yogyakarta)',
  'Jawa Timur (Surabaya)',
  'Bali (Denpasar)',
  'Nusa Tenggara Timur (Kupang)',
  'Nusa Tenggara Barat (Mataram)',
  'Gorontalo (Gorontalo)',
  'Sulawesi Barat (Mamuju)',
  'Sulawesi Tengah (Palu)',
  'Sulawesi Utara (Manado)',
  'Sulawesi Tenggara (Kendari)',
  'Sulawesi Selatan (Makassar)',
  'Maluku Utara (Sofifi)',
  'Maluku (Ambon)',
  'Papua Barat (Manokwari)',
  'Papua (Jayapura)',
  'Papua Tengah (Nabire)',
  'Papua Pegunungan (Jayawijaya)',
  'Papua Selatan (Merauke)',
  'Papua Barat Daya (Sorong)',
];

// Order Data for Reports
export interface OrderItem {
  itemCode: string;
  itemName: string;
  specifications?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

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

export const MOCK_ORDERS: Order[] = [
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
];