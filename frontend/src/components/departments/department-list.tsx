"use client";

import { useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Department } from "@/lib/types";

interface DepartmentListProps {
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export function DepartmentList({
  departments,
  onEdit,
  onDelete,
  isLoading = false,
}: DepartmentListProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpanded(newExpanded);
  };

  if (departments.length === 0) {
    return (
      <EmptyState message="No departments found. Create your first department to get started." />
    );
  }

  return (
    <div className="space-y-4">
      {departments.map((department) => {
        const isExpanded = expanded.has(department.id);
        const subDepartments = department.subDepartments || [];
        const hasSubDepartments = subDepartments.length > 0;

        return (
          <Card key={department.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {hasSubDepartments && (
                    <button
                      onClick={() => toggleExpand(department.id)}
                      className="p-1 hover:bg-accent rounded"
                    >
                      {isExpanded ? (
                        <FiChevronDown className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <FiChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{department.name}</h3>
                    {hasSubDepartments && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {subDepartments.length} sub-department
                        {subDepartments.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(department)}
                    disabled={isLoading}
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(department.id)}
                    disabled={isLoading}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {isExpanded && hasSubDepartments && (
                <div className="mt-4 ml-8 space-y-2 border-l-2 border-border pl-4">
                  {subDepartments.map((subDept) => (
                    <div
                      key={subDept.id}
                      className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg"
                    >
                      <span className="text-sm">{subDept.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
