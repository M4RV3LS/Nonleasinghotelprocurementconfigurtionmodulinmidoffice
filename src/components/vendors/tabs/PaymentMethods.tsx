import { useState } from 'react';
import { Search } from 'lucide-react';

// Mock payment methods - in a real app, these would come from the PaymentMethodConfiguration
const AVAILABLE_PAYMENT_METHODS = [
  { id: '1', name: 'Term of Payment 30 Days' },
  { id: '2', name: 'Term of Payment 60 Days' },
  { id: '3', name: 'Cash on Delivery (COD)' },
  { id: '4', name: 'Advance Payment' },
  { id: '5', name: 'Bank Transfer' },
  { id: '6', name: 'Credit Card' },
];

interface PaymentMethodsProps {
  selectedMethods: string[];
  onChange: (methods: string[]) => void;
}

export function PaymentMethods({ selectedMethods, onChange }: PaymentMethodsProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMethods = AVAILABLE_PAYMENT_METHODS.filter((method) =>
    method.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleMethod = (methodId: string) => {
    if (selectedMethods.includes(methodId)) {
      onChange(selectedMethods.filter((id) => id !== methodId));
    } else {
      onChange([...selectedMethods, methodId]);
    }
  };

  const selectedMethodsData = AVAILABLE_PAYMENT_METHODS.filter((m) =>
    selectedMethods.includes(m.id)
  );
  const availableMethodsData = filteredMethods.filter((m) => !selectedMethods.includes(m.id));

  return (
    <div className="max-w-4xl">
      <p className="text-gray-600 mb-6">
        Select which payment methods this vendor accepts
      </p>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search payment methods..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selected Methods */}
        <div>
          <h4 className="text-gray-900 mb-4">
            Accepted Payment Methods ({selectedMethodsData.length})
          </h4>
          <div className="space-y-2 min-h-[200px] p-4 bg-green-50 border border-green-200 rounded-lg">
            {selectedMethodsData.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No payment methods selected
              </p>
            ) : (
              selectedMethodsData.map((method) => (
                <label
                  key={method.id}
                  className="flex items-center gap-3 p-3 bg-white border border-green-300 rounded-lg cursor-pointer hover:bg-green-50"
                >
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => toggleMethod(method.id)}
                    className="w-4 h-4 text-green-600 focus:ring-green-500 rounded"
                  />
                  <span>{method.name}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Available Methods */}
        <div>
          <h4 className="text-gray-900 mb-4">
            Available Payment Methods ({availableMethodsData.length})
          </h4>
          <div className="space-y-2 min-h-[200px] p-4 bg-gray-50 border border-gray-200 rounded-lg">
            {availableMethodsData.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {searchTerm ? 'No matching payment methods' : 'All methods selected'}
              </p>
            ) : (
              availableMethodsData.map((method) => (
                <label
                  key={method.id}
                  className="flex items-center gap-3 p-3 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => toggleMethod(method.id)}
                    className="w-4 h-4 text-[#ec2224] focus:ring-[#ec2224] rounded"
                  />
                  <span>{method.name}</span>
                </label>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
