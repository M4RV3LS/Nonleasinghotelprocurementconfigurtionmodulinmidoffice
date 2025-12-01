import { useState, useRef, useEffect } from "react";
import { Vendor } from "../../VendorManagement";
import { FormField } from "../../shared/FormField";
import { ToggleSwitch } from "../../shared/ToggleSwitch";
import { Button } from "../../shared/Button";
import { ChevronDown } from "lucide-react";

interface BasicInformationProps {
  formData: Omit<Vendor, "id" | "createdAt">;
  updateFormData: (
    updates: Partial<Omit<Vendor, "id" | "createdAt">>,
  ) => void;
  existingCodes: string[];
  isEdit: boolean;
}

const PROVINCES = [
  "Nanggroe Aceh Darussalam (Banda Aceh)",
  "Sumatera Utara (Medan)",
  "Sumatera Selatan (Palembang)",
  "Sumatera Barat (Padang)",
  "Bengkulu (Bengkulu)",
  "Riau (Pekanbaru)",
  "Kepulauan Riau (Tanjung Pinang)",
  "Jambi (Jambi)",
  "Lampung (Bandar Lampung)",
  "Bangka Belitung (Pangkal Pinang)",
  "Kalimantan Barat (Pontianak)",
  "Kalimantan Timur (Samarinda)",
  "Kalimantan Selatan (Banjarmasin)",
  "Kalimantan Tengah (Palangkaraya)",
  "Kalimantan Utara (Tanjung Selor)",
  "Banten (Serang)",
  "DKI Jakarta (Jakarta)",
  "Jawa Barat (Bandung)",
  "Jawa Tengah (Semarang)",
  "DI Yogyakarta (Yogyakarta)",
  "Jawa Timur (Surabaya)",
  "Bali (Denpasar)",
  "Nusa Tenggara Timur (Kupang)",
  "Nusa Tenggara Barat (Mataram)",
  "Gorontalo (Gorontalo)",
  "Sulawesi Barat (Mamuju)",
  "Sulawesi Tengah (Palu)",
  "Sulawesi Utara (Manado)",
  "Sulawesi Tenggara (Kendari)",
  "Sulawesi Selatan (Makassar)",
  "Maluku Utara (Sofifi)",
  "Maluku (Ambon)",
  "Papua Barat (Manokwari)",
  "Papua (Jayapura)",
  "Papua Tengah (Nabire)",
  "Papua Pegunungan (Jayawijaya)",
  "Papua Selatan (Merauke)",
  "Papua Barat Daya (Sorong)",
];

const REQUEST_DESTINATIONS = [
  "System A",
  "System B",
  "System C",
  "System D",
];

export function BasicInformation({
  formData,
  updateFormData,
  existingCodes,
  isEdit,
}: BasicInformationProps) {
  const [errors, setErrors] = useState<Record<string, string>>(
    {},
  );
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] =
    useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProvinceDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, []);

  const generateCode = () => {
    const prefix = "VEN";
    let counter = 1;
    let newCode = `${prefix}${String(counter).padStart(3, "0")}`;

    while (existingCodes.includes(newCode)) {
      counter++;
      newCode = `${prefix}${String(counter).padStart(3, "0")}`;
    }

    updateFormData({ code: newCode });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    return phoneRegex.test(phone);
  };

  const handleFieldChange = (
    field: keyof Omit<Vendor, "id" | "createdAt">,
    value: any,
  ) => {
    updateFormData({ [field]: value });

    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const toggleIsland = (island: string) => {
    const newIslands = formData.islands.includes(island)
      ? formData.islands.filter((i) => i !== island)
      : [...formData.islands, island];
    handleFieldChange("islands", newIslands);
  };

  const selectAllProvinces = () => {
    handleFieldChange("islands", PROVINCES);
  };

  const clearAllProvinces = () => {
    handleFieldChange("islands", []);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <FormField
        label="Vendor Code"
        required
        error={errors.code}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.code}
            onChange={(e) =>
              handleFieldChange(
                "code",
                e.target.value.toUpperCase(),
              )
            }
            maxLength={20}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
            placeholder="e.g., VEN001"
          />
          <Button variant="secondary" onClick={generateCode}>
            Generate Code
          </Button>
        </div>
      </FormField>

      <FormField
        label="Vendor Name"
        required
        error={errors.name}
      >
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            handleFieldChange("name", e.target.value)
          }
          maxLength={100}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
          placeholder="Enter vendor name"
        />
      </FormField>

      <FormField
        label="Request Destination"
        required
        error={errors.requestDestination}
        helpText="Select which system this vendor will serve"
      >
        <select
          value={formData.requestDestination}
          onChange={(e) =>
            handleFieldChange("requestDestination", e.target.value)
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
        >
          <option value="">Select a system</option>
          {REQUEST_DESTINATIONS.map((dest) => (
            <option key={dest} value={dest}>
              {dest}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Province Coverage"
        required
        error={errors.islands}
      >
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() =>
              setIsProvinceDropdownOpen(!isProvinceDropdownOpen)
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224] flex items-center justify-between bg-white hover:bg-gray-50"
          >
            <span
              className={
                formData.islands.length === 0
                  ? "text-gray-400"
                  : "text-gray-900"
              }
            >
              {formData.islands.length === 0
                ? "Select provinces"
                : `${formData.islands.length} province${formData.islands.length > 1 ? "s" : ""} selected`}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${isProvinceDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isProvinceDropdownOpen && (
            <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
              <div className="flex gap-2 p-3 border-b border-gray-200">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={selectAllProvinces}
                >
                  Select All
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={clearAllProvinces}
                >
                  Clear All
                </Button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {PROVINCES.map((province) => (
                  <label
                    key={province}
                    className="flex items-center gap-2 p-3 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.islands.includes(
                        province,
                      )}
                      onChange={() => toggleIsland(province)}
                      className="w-4 h-4 text-[#ec2224] focus:ring-[#ec2224] rounded"
                    />
                    <span>{province}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </FormField>

      <FormField
        label="Address"
        required
        error={errors.address}
      >
        <textarea
          value={formData.address}
          onChange={(e) =>
            handleFieldChange("address", e.target.value)
          }
          maxLength={500}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
          placeholder="Enter complete address"
        />
        <p className="mt-1 text-gray-500">
          {formData.address.length}/500 characters
        </p>
      </FormField>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-gray-900 mb-4">
          Contact Information
        </h4>

        <FormField
          label="Contact Person Name"
          required
          error={errors.contactPerson}
        >
          <input
            type="text"
            value={formData.contactPerson}
            onChange={(e) =>
              handleFieldChange("contactPerson", e.target.value)
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
            placeholder="Enter contact person name"
          />
        </FormField>

        <FormField
          label="Phone Number"
          required
          error={errors.phone}
        >
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              handleFieldChange("phone", e.target.value)
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
            placeholder="e.g., +63 912 345 6789"
          />
        </FormField>

        <FormField
          label="Email Address"
          required
          error={errors.email}
        >
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              handleFieldChange("email", e.target.value)
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
            placeholder="e.g., contact@vendor.com"
          />
        </FormField>

        <FormField
          label="Alternative Phone"
          error={errors.alternativePhone}
        >
          <input
            type="tel"
            value={formData.alternativePhone || ""}
            onChange={(e) =>
              handleFieldChange(
                "alternativePhone",
                e.target.value,
              )
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
            placeholder="e.g., +63 912 345 6789"
          />
        </FormField>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-gray-900 mb-4">
          Tax Configuration
        </h4>

        <FormField
          label="PPN (%) (VAT - Value Added Tax)"
          required
          error={errors.ppn}
        >
          <div className="relative">
            <input
              type="number"
              value={formData.ppn}
              onChange={(e) =>
                handleFieldChange(
                  "ppn",
                  Math.min(
                    100,
                    Math.max(0, Number(e.target.value)),
                  ),
                )
              }
              min={0}
              max={100}
              step={0.1}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
              placeholder="0.0"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              %
            </span>
          </div>
        </FormField>

        <FormField
          label="Service Charge (%)"
          helpText="Optional, default: 0"
        >
          <div className="relative">
            <input
              type="number"
              value={formData.serviceCharge}
              onChange={(e) =>
                handleFieldChange(
                  "serviceCharge",
                  Math.min(
                    100,
                    Math.max(0, Number(e.target.value)),
                  ),
                )
              }
              min={0}
              max={100}
              step={0.1}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
              placeholder="0.0"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              %
            </span>
          </div>
        </FormField>

        <FormField
          label="PB1 (%)"
          helpText="Optional, default: 0"
        >
          <div className="relative">
            <input
              type="number"
              value={formData.pb1}
              onChange={(e) =>
                handleFieldChange(
                  "pb1",
                  Math.min(
                    100,
                    Math.max(0, Number(e.target.value)),
                  ),
                )
              }
              min={0}
              max={100}
              step={0.1}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
              placeholder="0.0"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              %
            </span>
          </div>
        </FormField>
      </div>

      <FormField label="Status" required>
        <ToggleSwitch
          checked={formData.status === "active"}
          onChange={(checked) =>
            handleFieldChange(
              "status",
              checked ? "active" : "inactive",
            )
          }
          label={
            formData.status === "active" ? "Active" : "Inactive"
          }
        />
      </FormField>
    </div>
  );
}