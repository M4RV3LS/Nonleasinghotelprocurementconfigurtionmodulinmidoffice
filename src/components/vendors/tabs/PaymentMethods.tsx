import { AVAILABLE_PAYMENT_METHODS } from '../../../mock-data';

interface PaymentMethodsProps {
  selectedMethods: string[];
  onChange: (methods: string[]) => void;
}

export function PaymentMethods({ selectedMethods, onChange }: PaymentMethodsProps) {
  const toggleMethod = (methodId: string) => {
    if (selectedMethods.includes(methodId)) {
      onChange(selectedMethods.filter((id) => id !== methodId));
    } else {
      onChange([...selectedMethods, methodId]);
    }
  };

  return (
    <div className="max-w-3xl">
      <p className="text-gray-600 mb-6">
        Select which payment methods this vendor accepts
      </p>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-gray-900 mb-4">Payment Methods</h4>
        <div className="space-y-2">
          {AVAILABLE_PAYMENT_METHODS.map((method) => (
            <label
              key={method.id}
              className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedMethods.includes(method.id)}
                onChange={() => toggleMethod(method.id)}
                className="w-4 h-4 text-[#ec2224] focus:ring-[#ec2224] rounded"
              />
              <span>{method.name}</span>
            </label>
          ))}
        </div>
      </div>

      {selectedMethods.length > 0 && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">
            <strong>{selectedMethods.length}</strong> payment method{selectedMethods.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  );
}
