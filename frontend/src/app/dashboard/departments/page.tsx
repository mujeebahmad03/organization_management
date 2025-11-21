"use client";

import { useQuery } from "@apollo/client/react";
import { FiPlus } from "react-icons/fi";
import { GET_DEPARTMENTS } from "@/lib/graphql/queries";
import {
  CREATE_DEPARTMENT,
  UPDATE_DEPARTMENT,
  DELETE_DEPARTMENT,
} from "@/lib/graphql/mutations";
import { DepartmentForm } from "@/components/departments/department-form";
import { UpdateDepartmentForm } from "@/components/departments/update-department-form";
import { DepartmentList } from "@/components/departments/department-list";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { FormModal } from "@/components/ui/form-modal";
import { useFormModal } from "@/hooks/use-form-modal";
import { useMutationHandler } from "@/hooks/use-mutation-handler";
import type {
  CreateDepartmentFormData,
  UpdateDepartmentFormData,
} from "@/lib/validations";
import type {
  GetDepartmentsQuery,
  EditingEntity,
  Department,
} from "@/lib/types";
import { CONFIRM_MESSAGES } from "@/lib/constants";

export default function DepartmentsPage() {
  const {
    showCreateForm,
    editingEntity,
    openCreateForm,
    closeCreateForm,
    openEditForm,
    closeEditForm,
  } = useFormModal<EditingEntity>();

  const { data, loading, error, refetch } =
    useQuery<GetDepartmentsQuery>(GET_DEPARTMENTS);

  const { execute: createDepartment, loading: creating } = useMutationHandler({
    mutation: CREATE_DEPARTMENT,
    onSuccess: () => closeCreateForm(),
    refetch,
    errorMessage: "Error creating department",
  });

  const { execute: updateDepartment, loading: updating } = useMutationHandler({
    mutation: UPDATE_DEPARTMENT,
    onSuccess: () => closeEditForm(),
    refetch,
    errorMessage: "Error updating department",
  });

  const { execute: deleteDepartment, loading: deleting } = useMutationHandler({
    mutation: DELETE_DEPARTMENT,
    refetch,
    errorMessage: "Error deleting department",
  });

  const handleCreate = async (data: CreateDepartmentFormData) => {
    await createDepartment({
      input: {
        name: data.name,
        subDepartments:
          data.subDepartments?.filter((sd) => sd.name.trim()) || null,
      },
    });
  };

  const handleUpdate = async (data: UpdateDepartmentFormData) => {
    await updateDepartment({
      input: {
        id: data.id,
        name: data.name,
      },
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm(CONFIRM_MESSAGES.DELETE_DEPARTMENT)) {
      return;
    }
    await deleteDepartment({ id });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage message={error.message} title="Error loading departments" />
    );
  }

  const departments = data?.getDepartments || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Departments
        </h1>
        {!showCreateForm && !editingEntity && (
          <Button
            variant="primary"
            onClick={openCreateForm}
            disabled={creating}
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Create Department
          </Button>
        )}
      </div>

      <FormModal
        title="Create New Department"
        isOpen={showCreateForm}
        onClose={closeCreateForm}
      >
        <DepartmentForm
          onSubmit={handleCreate}
          onCancel={closeCreateForm}
          isLoading={creating}
        />
      </FormModal>

      <FormModal
        title="Update Department"
        isOpen={!!editingEntity}
        onClose={closeEditForm}
      >
        {editingEntity && (
          <UpdateDepartmentForm
            departmentId={editingEntity.id}
            currentName={editingEntity.name}
            onSubmit={handleUpdate}
            onCancel={closeEditForm}
            isLoading={updating}
          />
        )}
      </FormModal>

      <DepartmentList
        departments={departments}
        onEdit={(dept: Department) =>
          openEditForm({ id: dept.id, name: dept.name })
        }
        onDelete={handleDelete}
        isLoading={deleting}
      />
    </div>
  );
}
