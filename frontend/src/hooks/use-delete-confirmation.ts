import { useState } from "react";

export function useDeleteConfirmation() {
  const [deleteDeptId, setDeleteDeptId] = useState<number | null>(null);
  const [deleteSubDept, setDeleteSubDept] = useState<{
    deptId: number;
    subId: number;
  } | null>(null);

  const openDeleteDeptDialog = (id: number) => {
    setDeleteDeptId(id);
  };

  const closeDeleteDeptDialog = () => {
    setDeleteDeptId(null);
  };

  const openDeleteSubDeptDialog = (deptId: number, subId: number) => {
    setDeleteSubDept({ deptId, subId });
  };

  const closeDeleteSubDeptDialog = () => {
    setDeleteSubDept(null);
  };

  return {
    deleteDeptId,
    deleteSubDept,
    openDeleteDeptDialog,
    closeDeleteDeptDialog,
    openDeleteSubDeptDialog,
    closeDeleteSubDeptDialog,
  };
}

