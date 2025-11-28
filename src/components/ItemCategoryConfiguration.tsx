import { useState } from 'react';
import { CategoryList } from './categories/CategoryList';
import { CategoryForm } from './categories/CategoryForm';
import { Toast, ToastType } from './shared/Toast';
import { MOCK_CATEGORIES, ItemCategory } from '../mock-data';

// Re-export type for backward compatibility
export type { ItemCategory };

export function ItemCategoryConfiguration() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | null>(null);
  const [categories, setCategories] = useState<ItemCategory[]>(MOCK_CATEGORIES);

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
