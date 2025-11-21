import { useState, useCallback } from "react";
import { EditingEntity } from "@/lib/types";

export function useFormModal<T extends EditingEntity = EditingEntity>() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEntity, setEditingEntity] = useState<T | null>(null);

  const openCreateForm = useCallback(() => {
    setShowCreateForm(true);
    setEditingEntity(null);
  }, []);

  const closeCreateForm = useCallback(() => {
    setShowCreateForm(false);
  }, []);

  const openEditForm = useCallback((entity: T) => {
    setEditingEntity(entity);
    setShowCreateForm(false);
  }, []);

  const closeEditForm = useCallback(() => {
    setEditingEntity(null);
  }, []);

  const closeAll = useCallback(() => {
    setShowCreateForm(false);
    setEditingEntity(null);
  }, []);

  return {
    showCreateForm,
    editingEntity,
    openCreateForm,
    closeCreateForm,
    openEditForm,
    closeEditForm,
    closeAll,
  };
}

