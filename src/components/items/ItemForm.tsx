import { useState, useRef } from "react";
import { Item } from "../ItemConfiguration";
import { ItemCategory } from "../mock-data"; // Import ItemCategory type
import { Button } from "../shared/Button";
import { FormField } from "../shared/FormField";
import { ToggleSwitch } from "../shared/ToggleSwitch";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import {
  Upload,
  X,
  ChevronLeft,
} from "lucide-react";

interface ItemFormProps {
  item: Item | null;
  categories: ItemCategory[]; // New prop
  onSave: (
    item: Omit<Item, "id" | "createdAt" | "code">,
  ) => void;
  onCancel: () => void;
  existingCodes: string[];
}

export function ItemForm({
  item,
  categories,
  onSave,
  onCancel,
  existingCodes,
}: ItemFormProps) {
  const [formData, setFormData] = useState<
    Omit<Item, "id" | "createdAt" | "code">
  >({
    name: item?.name || "",
    category: item?.category || "",
    uom: item?.uom || "",
    photo: item?.photo || "",
    specifications: item?.specifications || [],
    status: item?.status || "active",
  });

  const [errors, setErrors] = useState<Record<string, string>>(
    {},
  );
  const [customUom, setCustomUom] = useState("");
  const [showCustomUom, setShowCustomUom] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] =
    useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  // Ref for variant photo uploads
  const variantFileRefs = useRef<Map<string, HTMLInputElement>>(
    new Map(),
  );

  const standardUoms = [
    "Piece",
    "Box",
    "Carton",
    "Kilogram",
    "Liter",
    "Meter",
  ];

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          photo: "File size must be less than 5MB",
        });
        return;
      }
      if (!file.type.match(/^image\/(jpeg|png)$/)) {
        setErrors({
          ...errors,
          photo: "Only JPG and PNG files are allowed",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        updateField("photo", event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVariantPhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    specIndex: number,
    valueIndex: number,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // Smaller limit for variants
        alert("Variant photo must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const newSpecs = [...formData.specifications];
        newSpecs[specIndex].values[valueIndex].photo = event
          .target?.result as string;
        updateField("specifications", newSpecs);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSpecification = () => {
    // Constraint: Limit to 1 variant only
    if (formData.specifications.length >= 1) return;

    updateField("specifications", [
      ...formData.specifications,
      { key: "", values: [] },
    ]);
  };

  const updateSpecification = (
    index: number,
    field: "key" | "values",
    value: any,
  ) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    updateField("specifications", newSpecs);
  };

  const removeSpecification = (index: number) => {
    updateField(
      "specifications",
      formData.specifications.filter((_, i) => i !== index),
    );
  };

  const addSpecValue = (specIndex: number, value: string) => {
    if (value.trim()) {
      const newSpecs = [...formData.specifications];
      // Add value with empty photo
      newSpecs[specIndex].values = [
        ...newSpecs[specIndex].values,
        { value: value.trim(), photo: "" },
      ];
      updateField("specifications", newSpecs);
    }
  };

  const removeSpecValue = (
    specIndex: number,
    valueIndex: number,
  ) => {
    const newSpecs = [...formData.specifications];
    newSpecs[specIndex].values = newSpecs[
      specIndex
    ].values.filter((_, i) => i !== valueIndex);
    updateField("specifications", newSpecs);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim())
      newErrors.name = "Item name is required";
    else if (formData.name.length > 100)
      newErrors.name =
        "Item name must be 100 characters or less";

    if (!formData.category.trim())
      newErrors.category = "Category is required";
    if (!formData.uom.trim())
      newErrors.uom = "Unit of Measure is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (saveAndAddAnother = false) => {
    if (validate()) {
      onSave(formData);
      if (saveAndAddAnother) {
        setFormData({
          name: "",
          category: "",
          uom: "",
          photo: "",
          specifications: [],
          status: "active",
        });
        setHasChanges(false);
      }
    }
  };

  const handleCancel = () => {
    if (hasChanges) setShowCancelConfirm(true);
    else onCancel();
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Item List
        </button>
        <h2 className="text-gray-900">
          {item ? "Edit Item" : "Create New Item"}
        </h2>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-3xl">
        {/* Section 1: Basic Information */}
        <div className="mb-8">
          <h3 className="text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Basic Information
          </h3>

          <FormField
            label="Item Name"
            required
            error={errors.name}
          >
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                updateField("name", e.target.value)
              }
              maxLength={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
              placeholder="Enter item name"
            />
          </FormField>

          <FormField
            label="Item Category"
            required
            error={errors.category}
          >
            <select
              value={formData.category}
              onChange={(e) =>
                updateField("category", e.target.value)
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
            >
              <option value="">Select category</option>
              {/* Consuming from Item Categories Configuration */}
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Unit of Measure (UoM)"
            required
            error={errors.uom}
          >
            {showCustomUom ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customUom}
                  onChange={(e) => setCustomUom(e.target.value)}
                  maxLength={20}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
                  placeholder="Enter custom UoM"
                />
                <Button
                  variant="primary"
                  onClick={() => {
                    if (customUom.trim()) {
                      updateField("uom", customUom.trim());
                      setShowCustomUom(false);
                      setCustomUom("");
                    }
                  }}
                >
                  Add
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowCustomUom(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <select
                value={formData.uom}
                onChange={(e) => {
                  if (e.target.value === "__custom__")
                    setShowCustomUom(true);
                  else updateField("uom", e.target.value);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2224]"
              >
                <option value="">Select UoM</option>
                {standardUoms.map((uom) => (
                  <option key={uom} value={uom}>
                    {uom}
                  </option>
                ))}
                <option value="__custom__">Custom UoM</option>
              </select>
            )}
          </FormField>
        </div>

        {/* Section 2: Item Photo */}
        <div className="mb-8">
          <h3 className="text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Main Photo
          </h3>
          <FormField
            label="Photo Upload"
            error={errors.photo}
            helpText="Default photo for item and variants"
          >
            <div className="flex gap-4">
              {formData.photo ? (
                <div className="relative">
                  <img
                    src={formData.photo}
                    alt="Item preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    onClick={() => updateField("photo", "")}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#ec2224] transition-colors"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="flex flex-col gap-2 justify-center">
                <Button
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {formData.photo
                    ? "Change Photo"
                    : "Upload Photo"}
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
          </FormField>
        </div>

        {/* Section 3: Status */}
        <div className="mb-8">
          <h3 className="text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Status
          </h3>
          <FormField label="Item Status" required>
            <ToggleSwitch
              checked={formData.status === "active"}
              onChange={(checked) =>
                updateField(
                  "status",
                  checked ? "active" : "inactive",
                )
              }
              label={
                formData.status === "active"
                  ? "Active"
                  : "Inactive"
              }
            />
          </FormField>
        </div>

        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <Button
            variant="primary"
            onClick={() => handleSubmit(false)}
          >
            Save
          </Button>
          {!item && (
            <Button
              variant="secondary"
              onClick={() => handleSubmit(true)}
            >
              Save & Add Another
            </Button>
          )}
          <Button variant="tertiary" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={onCancel}
        title="Discard Changes"
        message="You have unsaved changes. Are you sure you want to discard them?"
        confirmText="Discard"
        variant="danger"
      />
    </div>
  );
}