import { useCallback } from "react";
import { useDepartmentMutations } from "./use-department-mutations";
import { useToast } from "./use-toast";
import type { FormValues } from "@/components/department/form/base-form";

interface UseDepartmentHandlersProps {
  onDeptSuccess?: () => void;
  onSubDeptSuccess?: () => void;
}

export function useDepartmentHandlers({
  onDeptSuccess,
  onSubDeptSuccess,
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
    async (values: FormValues) => {
      try {
        await createDepartment(values.name);
        onDeptSuccess?.();
      } catch {
        toast.error("Failed to create department");
      }
    },
    [createDepartment, onDeptSuccess, toast]
  );

  const handleUpdateDepartment = useCallback(
    async (values: FormValues, deptId: number) => {
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

