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
import type { Department, SubDepartment } from "@/lib/types";

export default function DashboardPage() {
  const [departments, setDepartments] =
    useState<Department[]>(initialDepartments);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isSubDeptModalOpen, setIsSubDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [editingSubDept, setEditingSubDept] = useState<SubDepartment | null>(
    null
  );
  const [activeDeptId, setActiveDeptId] = useState<number | null>(null);
  const { toast } = useToast();

  // Department Handlers
  const handleCreateDepartment = (values: { name: string }) => {
    const newDept: Department = {
      id: Math.floor(Math.random() * 10000),
      name: values.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subDepartments: [],
    };
    setDepartments([newDept, ...departments]);
    toast({
      title: "Department created",
      description: `${values.name} has been added successfully.`,
    });
  };

  const handleUpdateDepartment = (values: { name: string }) => {
    if (!editingDept) return;
    const updatedDepts = departments.map((dept) =>
      dept.id === editingDept.id
        ? { ...dept, name: values.name, updatedAt: new Date().toISOString() }
        : dept
    );
    setDepartments(updatedDepts);
    setEditingDept(null);
    toast({
      title: "Department updated",
      description: "Changes have been saved successfully.",
    });
  };

  const handleDeleteDepartment = (id: number) => {
    setDepartments(departments.filter((d) => d.id !== id));
    toast({
      title: "Department deleted",
      description: "The department and its sub-departments have been removed.",
      variant: "destructive",
    });
  };

  // Sub-Department Handlers
  const handleCreateSubDepartment = (values: { name: string }) => {
    if (!activeDeptId) return;

    const newSubDept: SubDepartment = {
      id: Math.floor(Math.random() * 10000),
      name: values.name,
      createdAt: new Date().toISOString(),
      departmentId: activeDeptId,
    };

    const updatedDepts = departments.map((dept) => {
      if (dept.id === activeDeptId) {
        return {
          ...dept,
          subDepartments: [...(dept.subDepartments || []), newSubDept],
          updatedAt: new Date().toISOString(),
        };
      }
      return dept;
    });

    setDepartments(updatedDepts);
    setActiveDeptId(null);
    toast({
      title: "Sub-department added",
      description: `${values.name} has been added successfully.`,
    });
  };

  const handleUpdateSubDepartment = (values: { name: string }) => {
    if (!editingSubDept || !editingSubDept.departmentId) return;

    const updatedDepts = departments.map((dept) => {
      if (dept.id === editingSubDept.departmentId) {
        return {
          ...dept,
          subDepartments: dept.subDepartments?.map((sub) =>
            sub.id === editingSubDept.id ? { ...sub, name: values.name } : sub
          ),
          updatedAt: new Date().toISOString(),
        };
      }
      return dept;
    });

    setDepartments(updatedDepts);
    setEditingSubDept(null);
    toast({
      title: "Sub-department updated",
      description: "Changes have been saved successfully.",
    });
  };

  const handleDeleteSubDepartment = (deptId: number, subId: number) => {
    const updatedDepts = departments.map((dept) => {
      if (dept.id === deptId) {
        return {
          ...dept,
          subDepartments: dept.subDepartments?.filter(
            (sub) => sub.id !== subId
          ),
          updatedAt: new Date().toISOString(),
        };
      }
      return dept;
    });
    setDepartments(updatedDepts);
    toast({
      title: "Sub-department removed",
      description: "The sub-department has been deleted.",
    });
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

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader
        user={currentUser}
        onLogout={() => console.log("Logout clicked")}
      />

      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
            <p className="text-muted-foreground">
              Manage your organization structure and teams.
            </p>
          </div>
          <Button onClick={openCreateDeptModal} className="w-full md:w-auto">
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {departments.map((dept) => (
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
        onSubmit={editingDept ? handleUpdateDepartment : handleCreateDepartment}
        initialData={editingDept}
      />

      <SubDepartmentForm
        open={isSubDeptModalOpen}
        onOpenChange={setIsSubDeptModalOpen}
        onSubmit={
          editingSubDept ? handleUpdateSubDepartment : handleCreateSubDepartment
        }
        initialData={editingSubDept}
        parentDepartmentName={
          departments.find((d) => d.id === activeDeptId)?.name
        }
      />

      <Toaster />
    </div>
  );
}
