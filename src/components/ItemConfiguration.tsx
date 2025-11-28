import { useState } from 'react';
import { ItemList } from './items/ItemList';
import { ItemForm } from './items/ItemForm';
import { Toast, ToastType } from './shared/Toast';

export interface Item {
  id: string;
  code: string;
  name: string;
  category: string;
  uom: string;
  photo?: string;
  specifications: { key: string; values: string[] }[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export function ItemConfiguration() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [items, setItems] = useState<Item[]>([
    {
      id: '1',
      code: 'ITM001',
      name: 'Premium Cotton T-Shirt',
      category: 'Apparel',
      uom: 'Piece',
      specifications: [
        { key: 'Color', values: ['Red', 'Black', 'White'] },
        { key: 'Size', values: ['S', 'M', 'L', 'XL'] },
      ],
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      code: 'ITM002',
      name: 'Wireless Mouse',
      category: 'Electronics',
      uom: 'Piece',
      specifications: [
        { key: 'Color', values: ['Black', 'Silver'] },
      ],
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  ]);
  
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: ToastType;
  }>({
    isOpen: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ isOpen: true, message, type });
  };

  const handleCreateItem = () => {
    setSelectedItem(null);
    setView('create');
  };

  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setView('edit');
  };

  const handleSaveItem = (item: Omit<Item, 'id' | 'createdAt'>) => {
    if (selectedItem) {
      // Update existing item
      setItems(items.map((i) => (i.id === selectedItem.id ? { ...item, id: selectedItem.id, createdAt: selectedItem.createdAt } : i)));
      showToast('Item updated successfully', 'success');
    } else {
      // Create new item
      const newItem: Item = {
        ...item,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setItems([...items, newItem]);
      showToast('Item created successfully', 'success');
    }
    setView('list');
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    showToast('Item deleted successfully', 'success');
  };

  const handleToggleStatus = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' }
          : item
      )
    );
    const item = items.find((i) => i.id === id);
    const newStatus = item?.status === 'active' ? 'inactive' : 'active';
    showToast(`Item status changed to ${newStatus}`, 'success');
  };

  const handleCancel = () => {
    setView('list');
    setSelectedItem(null);
  };

  return (
    <>
      {view === 'list' && (
        <ItemList
          items={items}
          onCreateItem={handleCreateItem}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
          onToggleStatus={handleToggleStatus}
        />
      )}
      
      {(view === 'create' || view === 'edit') && (
        <ItemForm
          item={selectedItem}
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
