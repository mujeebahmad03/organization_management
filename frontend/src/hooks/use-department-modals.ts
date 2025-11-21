import { useState } from "react";
import type { Department, SubDepartment } from "@/lib/types";

export function useDepartmentModals() {
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isSubDeptModalOpen, setIsSubDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [editingSubDept, setEditingSubDept] = useState<SubDepartment | null>(
    null
  );
  const [activeDeptId, setActiveDeptId] = useState<number | null>(null);

  const openCreateDeptModal = () => {
    setEditingDept(null);
    setIsDeptModalOpen(true);
  };

  const openEditDeptModal = (dept: Department) => {
    setEditingDept(dept);
    setIsDeptModalOpen(true);
  };

  const closeDeptModal = () => {
    setIsDeptModalOpen(false);
    setEditingDept(null);
  };

  const openCreateSubDeptModal = (deptId: number) => {
    setActiveDeptId(deptId);
    setEditingSubDept(null);
    setIsSubDeptModalOpen(true);
  };

  const openEditSubDeptModal = (subDept: SubDepartment) => {
    setEditingSubDept(subDept);
    setIsSubDeptModalOpen(true);
  };

  const closeSubDeptModal = () => {
    setIsSubDeptModalOpen(false);
    setActiveDeptId(null);
    setEditingSubDept(null);
  };

  return {
    // Department modal state
    isDeptModalOpen,
    setIsDeptModalOpen,
    editingDept,
    openCreateDeptModal,
    openEditDeptModal,
    closeDeptModal,
    // Sub-department modal state
    isSubDeptModalOpen,
    setIsSubDeptModalOpen,
    editingSubDept,
    activeDeptId,
    openCreateSubDeptModal,
    openEditSubDeptModal,
    closeSubDeptModal,
  };
}

