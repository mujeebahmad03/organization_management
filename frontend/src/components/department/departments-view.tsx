"use client";

import { Plus, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DepartmentCard } from "./department-card";
import { DepartmentList } from "./list";
import type { Department, SubDepartment } from "@/lib/types";

interface DepartmentsViewProps {
  departments: Department[];
  totalCount?: number;
  searchQuery?: string;
  onAddDepartment: () => void;
  onEditDepartment: (dept: Department) => void;
  onDeleteDepartment: (id: number) => void;
  onAddSubDept: (deptId: number) => void;
  onEditSubDept: (subDept: SubDepartment) => void;
  onDeleteSubDept: (deptId: number, subId: number) => void;
  isLoading?: boolean;
}

export function DepartmentsView({
  departments,
  totalCount,
  searchQuery = "",
  onAddDepartment,
  onEditDepartment,
  onDeleteDepartment,
  onAddSubDept,
  onEditSubDept,
  onDeleteSubDept,
  isLoading = false,
}: DepartmentsViewProps) {
  const displayCount =
    totalCount !== undefined && totalCount !== departments.length
      ? `${departments.length} of ${totalCount}`
      : departments.length;

  const isSearching = searchQuery.trim().length > 0;
  const isEmpty = departments.length === 0;
  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">
            Manage your organization structure and teams.
          </p>
        </div>
        <Button
          onClick={onAddDepartment}
          className="w-auto"
          disabled={isLoading}
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
            Showing {displayCount} department
            {departments.length !== 1 ? "s" : ""}
          </div>
        </div>

        <TabsContent value="grid" className="space-y-4">
          {isEmpty ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-md border border-dashed bg-card">
              <p className="text-muted-foreground">
                {isSearching
                  ? "No departments found matching your search"
                  : "No departments yet"}
              </p>
              {!isSearching && (
                <Button
                  variant="link"
                  onClick={onAddDepartment}
                  className="mt-2"
                >
                  Create your first department
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {departments.map((dept: Department) => (
                <DepartmentCard
                  key={dept.id}
                  department={dept}
                  onEdit={onEditDepartment}
                  onDelete={onDeleteDepartment}
                  onAddSubDept={onAddSubDept}
                  onEditSubDept={onEditSubDept}
                  onDeleteSubDept={onDeleteSubDept}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {isEmpty ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-md border border-dashed bg-card">
              <p className="text-muted-foreground">
                {isSearching
                  ? "No departments found matching your search"
                  : "No departments yet"}
              </p>
              {!isSearching && (
                <Button
                  variant="link"
                  onClick={onAddDepartment}
                  className="mt-2"
                >
                  Create your first department
                </Button>
              )}
            </div>
          ) : (
            <DepartmentList
              departments={departments}
              onEdit={onEditDepartment}
              onDelete={onDeleteDepartment}
              onAddSubDept={onAddSubDept}
              onEditSubDept={onEditSubDept}
              onDeleteSubDept={onDeleteSubDept}
            />
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
