"use client";

import { useQuery } from "@apollo/client/react";
import { FiPlus } from "react-icons/fi";
import { GET_SUB_DEPARTMENTS, GET_DEPARTMENTS } from "@/lib/graphql/queries";
import {
  CREATE_SUB_DEPARTMENT,
  UPDATE_SUB_DEPARTMENT,
  DELETE_SUB_DEPARTMENT,
} from "@/lib/graphql/mutations";
import { SubDepartmentForm } from "@/components/sub-departments/sub-department-form";
import { SubDepartmentList } from "@/components/sub-departments/sub-department-list";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { EmptyState } from "@/components/ui/empty-state";
import { FormModal } from "@/components/ui/form-modal";
import { useFormModal } from "@/hooks/use-form-modal";
import { useMutationHandler } from "@/hooks/use-mutation-handler";
import type {
  CreateSubDepartmentFormData,
  UpdateSubDepartmentFormData,
} from "@/lib/validations";
import type {
  GetSubDepartmentsQuery,
  GetDepartmentsQuery,
  EditingEntity,
  DepartmentOption,
  SubDepartment,
} from "@/lib/types";
import { CONFIRM_MESSAGES, ROUTES } from "@/lib/constants";

export default function SubDepartmentsPage() {
  const {
    showCreateForm,
    editingEntity,
    openCreateForm,
    closeCreateForm,
    openEditForm,
    closeEditForm,
  } = useFormModal<EditingEntity>();

  const {
    data: subDeptsData,
    loading: subDeptsLoading,
    error: subDeptsError,
    refetch: refetchSubDepts,
  } = useQuery<GetSubDepartmentsQuery>(GET_SUB_DEPARTMENTS);
  const { data: deptsData, loading: deptsLoading } =
    useQuery<GetDepartmentsQuery>(GET_DEPARTMENTS);

  const { execute: createSubDepartment, loading: creating } =
    useMutationHandler({
      mutation: CREATE_SUB_DEPARTMENT,
      onSuccess: () => closeCreateForm(),
      refetch: refetchSubDepts,
      errorMessage: "Error creating sub-department",
    });

  const { execute: updateSubDepartment, loading: updating } =
    useMutationHandler({
      mutation: UPDATE_SUB_DEPARTMENT,
      onSuccess: () => closeEditForm(),
      refetch: refetchSubDepts,
      errorMessage: "Error updating sub-department",
    });

  const { execute: deleteSubDepartment, loading: deleting } =
    useMutationHandler({
      mutation: DELETE_SUB_DEPARTMENT,
      refetch: refetchSubDepts,
      errorMessage: "Error deleting sub-department",
    });

  const handleCreate = async (
    data: CreateSubDepartmentFormData | UpdateSubDepartmentFormData
  ) => {
    if ("departmentId" in data) {
      await createSubDepartment({
        input: {
          departmentId: data.departmentId,
          name: data.name,
        },
      });
    }
  };

  const handleUpdate = async (
    data: CreateSubDepartmentFormData | UpdateSubDepartmentFormData
  ) => {
    if ("id" in data) {
      await updateSubDepartment({
        input: {
          id: data.id,
          name: data.name,
        },
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(CONFIRM_MESSAGES.DELETE_SUB_DEPARTMENT)) {
      return;
    }
    await deleteSubDepartment({ id });
  };

  if (subDeptsLoading || deptsLoading) {
    return <LoadingSpinner />;
  }

  if (subDeptsError) {
    return (
      <ErrorMessage
        message={subDeptsError.message}
        title="Error loading sub-departments"
      />
    );
  }

  const subDepartments = subDeptsData?.getSubDepartments || [];
  const departments = deptsData?.getDepartments || [];
  const departmentOptions: DepartmentOption[] = departments.map((d) => ({
    id: d.id,
    name: d.name,
  }));

  if (departments.length === 0 && !showCreateForm && !editingEntity) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Sub-Departments
        </h1>
        <EmptyState
          message="You need to create at least one department before creating sub-departments."
          actionLabel="Go to Departments"
          onAction={() => (window.location.href = ROUTES.DEPARTMENTS)}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Sub-Departments
        </h1>
        {!showCreateForm && !editingEntity && departments.length > 0 && (
          <Button
            variant="primary"
            onClick={openCreateForm}
            disabled={creating}
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Create Sub-Department
          </Button>
        )}
      </div>

      <FormModal
        title="Create New Sub-Department"
        isOpen={showCreateForm}
        onClose={closeCreateForm}
      >
        <SubDepartmentForm
          departments={departmentOptions}
          onSubmit={handleCreate}
          onCancel={closeCreateForm}
          isLoading={creating}
        />
      </FormModal>

      <FormModal
        title="Update Sub-Department"
        isOpen={!!editingEntity}
        onClose={closeEditForm}
      >
        {editingEntity && (
          <SubDepartmentForm
            departments={departmentOptions}
            onSubmit={handleUpdate}
            onCancel={closeEditForm}
            isLoading={updating}
            initialData={{
              id: editingEntity.id,
              name: editingEntity.name,
            }}
          />
        )}
      </FormModal>

      <SubDepartmentList
        subDepartments={subDepartments}
        onEdit={(subDept: SubDepartment) =>
          openEditForm({ id: subDept.id, name: subDept.name })
        }
        onDelete={handleDelete}
        isLoading={deleting}
      />
    </div>
  );
}
