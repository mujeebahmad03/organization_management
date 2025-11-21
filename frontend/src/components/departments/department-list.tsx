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
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      {isExpanded ? (
                        <FiChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <FiChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {department.name}
                    </h3>
                    {hasSubDepartments && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {isExpanded && hasSubDepartments && (
                <div className="mt-4 ml-8 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                  {subDepartments.map((subDept) => (
                    <div
                      key={subDept.id}
                      className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {subDept.name}
                      </span>
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
