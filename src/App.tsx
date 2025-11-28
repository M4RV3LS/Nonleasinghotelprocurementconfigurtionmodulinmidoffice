import { useState } from 'react';
import { ItemCategoryConfiguration } from './components/ItemCategoryConfiguration';
import { ItemConfiguration } from './components/ItemConfiguration';
import { PaymentMethodConfiguration } from './components/PaymentMethodConfiguration';
import { VendorManagement } from './components/VendorManagement';
import { ReportsModule } from './components/ReportsModule';
import { Menu, Package, CreditCard, Building2, Folder, BarChart3 } from 'lucide-react';

type Module = 'categories' | 'items' | 'payments' | 'vendors' | 'reports';

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>('categories');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-[#ec2224]">Management System</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="flex-1 p-4">
          <button
            onClick={() => setActiveModule('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
              activeModule === 'categories'
                ? 'bg-[#ec2224] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Folder className="w-5 h-5" />
            {sidebarOpen && <span>Item Categories</span>}
          </button>

          <button
            onClick={() => setActiveModule('items')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
              activeModule === 'items'
                ? 'bg-[#ec2224] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Package className="w-5 h-5" />
            {sidebarOpen && <span>Item Configuration</span>}
          </button>

          <button
            onClick={() => setActiveModule('payments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
              activeModule === 'payments'
                ? 'bg-[#ec2224] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            {sidebarOpen && <span>Payment Methods</span>}
          </button>

          <button
            onClick={() => setActiveModule('vendors')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
              activeModule === 'vendors'
                ? 'bg-[#ec2224] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Building2 className="w-5 h-5" />
            {sidebarOpen && <span>Vendor Management</span>}
          </button>

          <button
            onClick={() => setActiveModule('reports')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeModule === 'reports'
                ? 'bg-[#ec2224] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            {sidebarOpen && <span>Reports</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {activeModule === 'categories' && <ItemCategoryConfiguration />}
        {activeModule === 'items' && <ItemConfiguration />}
        {activeModule === 'payments' && <PaymentMethodConfiguration />}
        {activeModule === 'vendors' && <VendorManagement />}
        {activeModule === 'reports' && <ReportsModule />}
      </main>
    </div>
  );
}
