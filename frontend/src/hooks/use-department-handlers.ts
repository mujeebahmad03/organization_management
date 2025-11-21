import { useCallback } from "react";
import { useDepartmentMutations } from "./use-department-mutations";
import { useToast } from "./use-toast";
import type { FormValues } from "@/components/department/form/base-form";
import type { DepartmentFormValues } from "@/components/department/form/department-form";

interface UseDepartmentHandlersProps {
  onDeptSuccess?: () => void;
  onSubDeptSuccess?: () => void;
  onDepartmentCreated?: (deptId: number) => void;
}

export function useDepartmentHandlers({
  onDeptSuccess,
  onSubDeptSuccess,
  onDepartmentCreated,
}: UseDepartmentHandlersProps = {}) {
  const {
    createDepartment,
    updateDepartment,
    deleteDepartment,
    createSubDepartment,
    updateSubDepartment,
    deleteSubDepartment,
  } = useDepartmentMutations();
  const { toast } = useToast();

  const handleCreateDepartment = useCallback(
    async (values: DepartmentFormValues | FormValues) => {
      try {
        // Check if it's the new form with sub-departments
        if ("subDepartments" in values) {
          // Create department first
          await createDepartment(values.name);
          
          // If there's a callback, we need to wait for the department to be created
          // For now, we'll create sub-departments separately after department creation
          // This would ideally be handled by the backend in a transaction
          // For now, we'll need to refetch and get the new department ID
          onDeptSuccess?.();
          
          // Note: Creating sub-departments inline would require the new department ID
          // This is a limitation - ideally the backend should support creating department with sub-departments in one call
        } else {
          await createDepartment(values.name);
          onDeptSuccess?.();
        }
      } catch {
        toast.error("Failed to create department");
      }
    },
    [createDepartment, onDeptSuccess, toast]
  );

  const handleUpdateDepartment = useCallback(
    async (values: DepartmentFormValues | FormValues, deptId: number) => {
      try {
        await updateDepartment(deptId, values.name);
        onDeptSuccess?.();
      } catch {
        toast.error("Failed to update department");
      }
    },
    [updateDepartment, onDeptSuccess, toast]
  );

  const handleDeleteDepartment = useCallback(
    async (id: number) => {
      try {
        await deleteDepartment(id);
      } catch {
        toast.error("Failed to delete department");
      }
    },
    [deleteDepartment, toast]
  );

  const handleCreateSubDepartment = useCallback(
    async (values: FormValues, departmentId: number) => {
      try {
        await createSubDepartment(departmentId, values.name);
        onSubDeptSuccess?.();
      } catch {
        toast.error("Failed to create sub-department");
      }
    },
    [createSubDepartment, onSubDeptSuccess, toast]
  );

  const handleUpdateSubDepartment = useCallback(
    async (values: FormValues, subDeptId: number) => {
      try {
        await updateSubDepartment(subDeptId, values.name);
        onSubDeptSuccess?.();
      } catch {
        toast.error("Failed to update sub-department");
      }
    },
    [updateSubDepartment, onSubDeptSuccess, toast]
  );

  const handleDeleteSubDepartment = useCallback(
    async (subId: number) => {
      try {
        await deleteSubDepartment(subId);
      } catch {
        toast.error("Failed to delete sub-department");
      }
    },
    [deleteSubDepartment, toast]
  );

  return {
    handleCreateDepartment,
    handleUpdateDepartment,
    handleDeleteDepartment,
    handleCreateSubDepartment,
    handleUpdateSubDepartment,
    handleDeleteSubDepartment,
  };
}

