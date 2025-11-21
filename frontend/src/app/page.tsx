"use client";

import { useState } from "react";
import { Plus, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/department/header";
import {
  DepartmentForm,
  DepartmentCard,
  SubDepartmentForm,
} from "@/components/department";
import { Loader } from "@/components/loader";
import { ProtectedRoute } from "@/components/protected-route";
import { useDepartments } from "@/hooks/use-departments";
import { useDepartmentMutations } from "@/hooks/use-department-mutations";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { CONFIRM_MESSAGES } from "@/lib/constants";
import type { Department, SubDepartment } from "@/lib/types";
import type { FormValues } from "@/components/department/form/base-form";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { departments, loading, error } = useDepartments();
  const {
    createDepartment,
    updateDepartment,
    deleteDepartment,
    createSubDepartment,
    updateSubDepartment,
    deleteSubDepartment,
    loading: mutationsLoading,
  } = useDepartmentMutations();
  const { toast } = useToast();

  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isSubDeptModalOpen, setIsSubDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [editingSubDept, setEditingSubDept] = useState<SubDepartment | null>(
    null
  );
  const [activeDeptId, setActiveDeptId] = useState<number | null>(null);

  // Department Handlers
  const handleCreateDepartment = async (values: FormValues) => {
    try {
      await createDepartment(values.name);
      setIsDeptModalOpen(false);
      setEditingDept(null);
    } catch {
      toast.error("Failed to create department");
    }
  };

  const handleUpdateDepartment = async (values: FormValues) => {
    if (!editingDept) return;
    try {
      await updateDepartment(editingDept.id, values.name);
      setIsDeptModalOpen(false);
      setEditingDept(null);
    } catch {
      toast.error("Failed to update department");
    }
  };

  const handleDeleteDepartment = async (id: number) => {
    if (!window.confirm(CONFIRM_MESSAGES.DELETE_DEPARTMENT)) return;
    try {
      await deleteDepartment(id);
    } catch {
      toast.error("Failed to delete department");
    }
  };

  // Sub-Department Handlers
  const handleCreateSubDepartment = async (values: FormValues) => {
    if (!activeDeptId) return;
    try {
      await createSubDepartment(activeDeptId, values.name);
      setIsSubDeptModalOpen(false);
      setActiveDeptId(null);
    } catch {
      toast.error("Failed to create sub-department");
    }
  };

  const handleUpdateSubDepartment = async (values: FormValues) => {
    if (!editingSubDept) return;
    try {
      await updateSubDepartment(editingSubDept.id, values.name);
      setIsSubDeptModalOpen(false);
      setEditingSubDept(null);
    } catch {
      toast.error("Failed to update sub-department");
    }
  };

  const handleDeleteSubDepartment = async (deptId: number, subId: number) => {
    if (!window.confirm(CONFIRM_MESSAGES.DELETE_SUB_DEPARTMENT)) return;
    try {
      await deleteSubDepartment(subId);
    } catch {
      toast.error("Failed to delete sub-department");
    }
  };

  // Modal Triggers
  const openCreateDeptModal = () => {
    setEditingDept(null);
    setIsDeptModalOpen(true);
  };

  const openEditDeptModal = (dept: Department) => {
    setEditingDept(dept);
    setIsDeptModalOpen(true);
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
        {user && <DashboardHeader user={user} onLogout={logout} />}

        <main className="container mx-auto p-4 md:p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
              <p className="text-muted-foreground">
                Manage your organization structure and teams.
              </p>
            </div>
            <Button
              onClick={openCreateDeptModal}
              className="w-auto"
              disabled={mutationsLoading}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Department
            </Button>
          </div>

          <Tabs defaultValue="grid" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="grid">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Grid
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="mr-2 h-4 w-4" />
                  List
                </TabsTrigger>
              </TabsList>
              <div className="text-sm text-muted-foreground">
                Showing {departments.length} departments
              </div>
            </div>

            <TabsContent value="grid" className="space-y-4">
              {departments.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-md border border-dashed bg-card">
                  <p className="text-muted-foreground">No departments yet</p>
                  <Button
                    variant="link"
                    onClick={openCreateDeptModal}
                    className="mt-2"
                  >
                    Create your first department
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {departments.map((dept: Department) => (
                    <DepartmentCard
                      key={dept.id}
                      department={dept}
                      onEdit={openEditDeptModal}
                      onDelete={handleDeleteDepartment}
                      onAddSubDept={openCreateSubDeptModal}
                      onEditSubDept={openEditSubDeptModal}
                      onDeleteSubDept={handleDeleteSubDepartment}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
              <div className="rounded-md border bg-card">
                <div className="p-4 text-center text-muted-foreground">
                  List view implementation would go here (simplified for demo)
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>

        <DepartmentForm
          open={isDeptModalOpen}
          onOpenChange={setIsDeptModalOpen}
          onSubmit={
            editingDept ? handleUpdateDepartment : handleCreateDepartment
          }
          initialData={editingDept}
        />

        <SubDepartmentForm
          open={isSubDeptModalOpen}
          onOpenChange={setIsSubDeptModalOpen}
          onSubmit={
            editingSubDept
              ? handleUpdateSubDepartment
              : handleCreateSubDepartment
          }
          initialData={editingSubDept}
          parentDepartmentName={
            departments.find((d: Department) => d.id === activeDeptId)?.name
          }
        />
      </div>
    </ProtectedRoute>
  );
}
