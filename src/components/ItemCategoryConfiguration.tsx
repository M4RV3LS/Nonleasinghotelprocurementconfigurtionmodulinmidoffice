import { useState } from 'react';
import { CategoryList } from './categories/CategoryList';
import { CategoryForm } from './categories/CategoryForm';
import { Toast, ToastType } from './shared/Toast';

export interface ItemCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  isSystemDefault: boolean;
  itemsCount: number;
  createdAt: string;
}

export function ItemCategoryConfiguration() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | null>(null);
  
  // Pre-populated default categories
  const [categories, setCategories] = useState<ItemCategory[]>([
    {
      id: '1',
      code: 'CAT-LIN',
      name: 'Linen',
      description: 'Bed linen, towels, and textile products',
      status: 'active',
      isSystemDefault: true,
      itemsCount: 15,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      code: 'CAT-LAU',
      name: 'Laundry',
      description: 'Laundry services and supplies',
      status: 'active',
      isSystemDefault: true,
      itemsCount: 8,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      code: 'CAT-MIN',
      name: 'Mineral Water',
      description: 'Bottled water and beverages',
      status: 'active',
      isSystemDefault: true,
      itemsCount: 12,
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      code: 'CAT-ACH',
      name: 'AC/Handyman',
      description: 'Air conditioning and handyman services',
      status: 'active',
      isSystemDefault: true,
      itemsCount: 6,
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      code: 'CAT-VEN',
      name: 'Vending Machine',
      description: 'Vending machine products and services',
      status: 'active',
      isSystemDefault: true,
      itemsCount: 10,
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

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setView('create');
  };

  const handleEditCategory = (category: ItemCategory) => {
    setSelectedCategory(category);
    setView('edit');
  };

  const handleSaveCategory = (category: Omit<ItemCategory, 'id' | 'createdAt' | 'itemsCount' | 'isSystemDefault'>) => {
    if (selectedCategory) {
      setCategories(
        categories.map((c) =>
          c.id === selectedCategory.id
            ? { 
                ...category, 
                id: selectedCategory.id, 
                createdAt: selectedCategory.createdAt,
                itemsCount: selectedCategory.itemsCount,
                isSystemDefault: selectedCategory.isSystemDefault
              }
            : c
        )
      );
      showToast('Category updated successfully', 'success');
    } else {
      const newCategory: ItemCategory = {
        ...category,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        itemsCount: 0,
        isSystemDefault: false,
      };
      setCategories([...categories, newCategory]);
      showToast('Category created successfully', 'success');
    }
    setView('list');
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
    showToast('Category deleted successfully', 'success');
  };

  const handleToggleStatus = (id: string) => {
    setCategories(
      categories.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' }
          : c
      )
    );
    showToast('Category status updated', 'success');
  };

  const handleCancel = () => {
    setView('list');
    setSelectedCategory(null);
  };

  return (
    <>
      {view === 'list' && (
        <CategoryList
          categories={categories}
          onCreateCategory={handleCreateCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {(view === 'create' || view === 'edit') && (
        <CategoryForm
          category={selectedCategory}
          onSave={handleSaveCategory}
          onCancel={handleCancel}
          existingNames={categories.map((c) => c.name.toLowerCase())}
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
