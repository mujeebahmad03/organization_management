"use client";

import { DashboardHeader } from "@/components/department/header";
import {
  DepartmentForm,
  SubDepartmentForm,
  DeleteDepartmentDialog,
  DeleteSubDepartmentDialog,
  DepartmentsView,
} from "@/components/department";
import { Loader } from "@/components/loader";
import { ProtectedRoute } from "@/components/protected-route";
import { useDepartments } from "@/hooks/use-departments";
import { useDepartmentMutations } from "@/hooks/use-department-mutations";
import { useDepartmentModals } from "@/hooks/use-department-modals";
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation";
import { useDepartmentHandlers } from "@/hooks/use-department-handlers";
import { useDepartmentSearch } from "@/hooks/use-department-search";
import { useAuth } from "@/contexts/auth-context";
import type { Department } from "@/lib/types";
import type { FormValues } from "@/components/department/form/base-form";
import type { DepartmentFormValues } from "@/components/department/form/department-form";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { departments, loading, error, refetch } = useDepartments();
  const { loading: mutationsLoading } = useDepartmentMutations();

  const modals = useDepartmentModals();
  const deleteConfirmation = useDeleteConfirmation();
  const { searchQuery, setSearchQuery, filteredDepartments } =
    useDepartmentSearch(departments);

  const handlers = useDepartmentHandlers({
    onDeptSuccess: async () => {
      modals.closeDeptModal();
      await refetch();
    },
    onSubDeptSuccess: modals.closeSubDeptModal,
  });

  // Department Handlers
  const handleCreateDepartment = async (values: DepartmentFormValues) => {
    try {
      // Create the department
      await handlers.handleCreateDepartment(values);

      // If there are sub-departments, create them after the department is created
      if (values.subDepartments && values.subDepartments.length > 0) {
        // Wait a bit for the department to be created, then refetch
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Refetch to get the new department ID
        const result = await refetch();
        const newDepartment = result.data?.getDepartments.find(
          (dept) => dept.name === values.name
        );

        if (newDepartment) {
          // Create all sub-departments
          for (const subDept of values.subDepartments) {
            if (subDept.name.trim()) {
              await handlers.handleCreateSubDepartment(
                { name: subDept.name },
                newDepartment.id
              );
            }
          }
        }
      }
    } catch (error) {
      console.error("Error creating department with sub-departments:", error);
    }
  };

  const handleUpdateDepartment = async (values: DepartmentFormValues) => {
    if (!modals.editingDept) return;
    await handlers.handleUpdateDepartment(values, modals.editingDept.id);
  };

  const handleDeleteDepartment = (id: number) => {
    deleteConfirmation.openDeleteDeptDialog(id);
  };

  const confirmDeleteDepartment = async () => {
    if (!deleteConfirmation.deleteDeptId) return;
    await handlers.handleDeleteDepartment(deleteConfirmation.deleteDeptId);
    deleteConfirmation.closeDeleteDeptDialog();
  };

  // Sub-Department Handlers
  const handleCreateSubDepartment = async (values: FormValues) => {
    if (!modals.activeDeptId) return;
    await handlers.handleCreateSubDepartment(values, modals.activeDeptId);
  };

  const handleUpdateSubDepartment = async (values: FormValues) => {
    if (!modals.editingSubDept) return;
    await handlers.handleUpdateSubDepartment(values, modals.editingSubDept.id);
  };

  const handleDeleteSubDepartment = (deptId: number, subId: number) => {
    deleteConfirmation.openDeleteSubDeptDialog(deptId, subId);
  };

  const confirmDeleteSubDepartment = async () => {
    if (!deleteConfirmation.deleteSubDept) return;
    await handlers.handleDeleteSubDepartment(
      deleteConfirmation.deleteSubDept.subId
    );
    deleteConfirmation.closeDeleteSubDeptDialog();
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading departments</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30">
        {user && (
          <DashboardHeader
            user={user}
            onLogout={logout}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        <DepartmentsView
          departments={filteredDepartments}
          totalCount={departments.length}
          searchQuery={searchQuery}
          onAddDepartment={modals.openCreateDeptModal}
          onEditDepartment={modals.openEditDeptModal}
          onDeleteDepartment={handleDeleteDepartment}
          onAddSubDept={modals.openCreateSubDeptModal}
          onEditSubDept={modals.openEditSubDeptModal}
          onDeleteSubDept={handleDeleteSubDepartment}
          isLoading={mutationsLoading}
        />

        <DepartmentForm
          open={modals.isDeptModalOpen}
          onOpenChange={modals.setIsDeptModalOpen}
          onSubmit={
            modals.editingDept ? handleUpdateDepartment : handleCreateDepartment
          }
          initialData={modals.editingDept}
        />

        <SubDepartmentForm
          open={modals.isSubDeptModalOpen}
          onOpenChange={modals.setIsSubDeptModalOpen}
          onSubmit={
            modals.editingSubDept
              ? handleUpdateSubDepartment
              : handleCreateSubDepartment
          }
          initialData={modals.editingSubDept}
          parentDepartmentName={
            departments.find((d: Department) => d.id === modals.activeDeptId)
              ?.name
          }
        />

        <DeleteDepartmentDialog
          open={deleteConfirmation.deleteDeptId !== null}
          onOpenChange={(open) =>
            !open && deleteConfirmation.closeDeleteDeptDialog()
          }
          onConfirm={confirmDeleteDepartment}
        />

        <DeleteSubDepartmentDialog
          open={deleteConfirmation.deleteSubDept !== null}
          onOpenChange={(open) =>
            !open && deleteConfirmation.closeDeleteSubDeptDialog()
          }
          onConfirm={confirmDeleteSubDepartment}
        />
      </div>
    </ProtectedRoute>
  );
}
