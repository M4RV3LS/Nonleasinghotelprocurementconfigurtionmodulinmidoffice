import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  children: ReactNode;
}

export function FormField({ label, required, error, helpText, children }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">
        {label}
        {required && <span className="text-[#ec2224] ml-1">*</span>}
      </label>
      {children}
      {helpText && !error && (
        <p className="mt-1 text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-red-600">{error}</p>
      )}
    </div>
  );
}
