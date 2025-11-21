"use client";

import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { SubDepartment } from "@/lib/types";

interface SubDepartmentListProps {
  subDepartments: SubDepartment[];
  onEdit: (subDepartment: SubDepartment) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export function SubDepartmentList({
  subDepartments,
  onEdit,
  onDelete,
  isLoading = false,
}: SubDepartmentListProps) {
  if (subDepartments.length === 0) {
    return (
      <EmptyState message="No sub-departments found. Create your first sub-department to get started." />
    );
  }

  return (
    <div className="space-y-4">
      {subDepartments.map((subDept) => (
        <Card key={subDept.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{subDept.name}</h3>
                {subDept.department && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Department: {subDept.department.name}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(subDept)}
                  disabled={isLoading}
                >
                  <FiEdit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(subDept.id)}
                  disabled={isLoading}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <FiTrash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
