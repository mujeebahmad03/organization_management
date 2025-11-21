'use client';

import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SubDepartment {
  id: number;
  name: string;
  departmentId: number;
  createdAt: string;
  department?: {
    id: number;
    name: string;
  };
}

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
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No sub-departments found. Create your first sub-department to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {subDepartments.map((subDept) => (
        <Card key={subDept.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {subDept.name}
                </h3>
                {subDept.department && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
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

