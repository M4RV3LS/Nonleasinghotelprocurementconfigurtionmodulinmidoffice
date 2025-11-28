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
      photo: 'https://images.unsplash.com/photo-1713881587420-113c1c43e28a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjB0c2hpcnQlMjBwcm9kdWN0fGVufDF8fHx8MTc2NDI5ODg4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
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
      photo: 'https://images.unsplash.com/photo-1670013190339-dfdab1ce99d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGNvbXB1dGVyJTIwbW91c2V8ZW58MXx8fHwxNzY0MjIyMTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      specifications: [
        { key: 'Color', values: ['Black', 'Silver'] },
      ],
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      code: 'ITM003',
      name: 'Office Chair',
      category: 'Furniture',
      uom: 'Piece',
      photo: 'https://images.unsplash.com/photo-1688578735427-994ecdea3ea4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBjaGFpcnxlbnwxfHx8fDE3NjQyODU5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      specifications: [
        { key: 'Material', values: ['Leather', 'Mesh'] },
      ],
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      code: 'ITM004',
      name: 'Laptop Stand',
      category: 'Electronics',
      uom: 'Piece',
      photo: 'https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBzdGFuZCUyMGRlc2t8ZW58MXx8fHwxNzY0MjYwMTAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      specifications: [],
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      code: 'ITM005',
      name: 'Coffee Mug Set',
      category: 'Kitchenware',
      uom: 'Box',
      photo: 'https://images.unsplash.com/photo-1666713711218-8ea7743c8ed1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtdWclMjBzZXR8ZW58MXx8fHwxNzY0Mjk4ODg1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      specifications: [
        { key: 'Quantity', values: ['4 pieces', '6 pieces'] },
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
