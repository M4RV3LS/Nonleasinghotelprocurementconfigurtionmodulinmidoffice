import { useState } from "react";
import { ItemList } from "./items/ItemList";
import { ItemForm } from "./items/ItemForm";
import { Toast, ToastType } from "./shared/Toast";
import { MOCK_CATEGORIES } from "../mock-data";

export interface Item {
  id: string;
  code: string;
  name: string;
  category: string;
  uom: string;
  photo?: string;
  // Updated structure: values is now an array of objects with photo
  specifications: {
    key: string;
    values: { value: string; photo?: string }[];
  }[];
  status: "active" | "inactive";
  createdAt: string;
}

export function ItemConfiguration() {
  const [view, setView] = useState<"list" | "create" | "edit">(
    "list",
  );
  const [selectedItem, setSelectedItem] = useState<Item | null>(
    null,
  );

  // Updated initial state to match new interface
  const [items, setItems] = useState<Item[]>([
    {
      id: "1",
      code: "ITM001",
      name: "Premium Cotton T-Shirt",
      category: "Linen", // Updated to match a real category from MOCK_CATEGORIES if applicable
      uom: "Piece",
      photo:
        "https://images.unsplash.com/photo-1713881587420-113c1c43e28a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjB0c2hpcnQlMjBwcm9kdWN0fGVufDF8fHx8MTc2NDI5ODg4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      specifications: [
        {
          key: "Color",
          values: [
            { value: "Red", photo: "" },
            { value: "Black", photo: "" },
            { value: "White", photo: "" },
          ],
        },
      ],
      status: "active",
      createdAt: new Date().toISOString(),
    },
    // ... (rest of items with updated structure)
  ]);

  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: ToastType;
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ isOpen: true, message, type });
  };

  const handleCreateItem = () => {
    setSelectedItem(null);
    setView("create");
  };

  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setView("edit");
  };

  const generateItemCode = (): string => {
    const prefix = "ITM";
    const existingCodes = items.map((item) => item.code);
    let counter = 1;

    while (true) {
      const code = `${prefix}${counter.toString().padStart(3, "0")}`;
      if (!existingCodes.includes(code)) {
        return code;
      }
      counter++;
    }
  };

  const handleSaveItem = (
    item: Omit<Item, "id" | "createdAt" | "code">,
  ) => {
    if (selectedItem) {
      setItems(
        items.map((i) =>
          i.id === selectedItem.id
            ? {
                ...item,
                code: selectedItem.code,
                id: selectedItem.id,
                createdAt: selectedItem.createdAt,
              }
            : i,
        ),
      );
      showToast("Item updated successfully", "success");
    } else {
      const newItem: Item = {
        ...item,
        code: generateItemCode(),
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setItems([...items, newItem]);
      showToast("Item created successfully", "success");
    }
    setView("list");
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    showToast("Item deleted successfully", "success");
  };

  const handleToggleStatus = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === "active"
                  ? "inactive"
                  : "active",
            }
          : item,
      ),
    );
    const item = items.find((i) => i.id === id);
    const newStatus =
      item?.status === "active" ? "inactive" : "active";
    showToast(`Item status changed to ${newStatus}`, "success");
  };

  const handleCancel = () => {
    setView("list");
    setSelectedItem(null);
  };

  return (
    <>
      {view === "list" && (
        <ItemList
          items={items}
          onCreateItem={handleCreateItem}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {(view === "create" || view === "edit") && (
        <ItemForm
          item={selectedItem}
          categories={MOCK_CATEGORIES}
          onSave={handleSaveItem}
          onCancel={handleCancel}
          existingCodes={items.map((i) => i.code)}
        />
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </>
  );
}