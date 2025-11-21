'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_DEPARTMENTS } from '@/lib/graphql/queries';
import {
  CREATE_DEPARTMENT,
  UPDATE_DEPARTMENT,
  DELETE_DEPARTMENT,
} from '@/lib/graphql/mutations';
import { DepartmentForm } from '@/components/departments/department-form';
import { UpdateDepartmentForm } from '@/components/departments/update-department-form';
import { DepartmentList } from '@/components/departments/department-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FiPlus, FiX } from 'react-icons/fi';
import type { CreateDepartmentFormData, UpdateDepartmentFormData } from '@/lib/validations';

export default function DepartmentsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_DEPARTMENTS);

  const [createDepartment, { loading: creating }] = useMutation(CREATE_DEPARTMENT, {
    onCompleted: () => {
      setShowCreateForm(false);
      refetch();
    },
    onError: (error) => {
      alert(`Error creating department: ${error.message}`);
    },
  });

  const [updateDepartment, { loading: updating }] = useMutation(UPDATE_DEPARTMENT, {
    onCompleted: () => {
      setEditingDepartment(null);
      refetch();
    },
    onError: (error) => {
      alert(`Error updating department: ${error.message}`);
    },
  });

  const [deleteDepartment, { loading: deleting }] = useMutation(DELETE_DEPARTMENT, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      alert(`Error deleting department: ${error.message}`);
    },
  });

  const handleCreate = async (data: CreateDepartmentFormData) => {
    await createDepartment({
      variables: {
        input: {
          name: data.name,
          subDepartments: data.subDepartments?.filter((sd) => sd.name.trim()) || null,
        },
      },
    });
  };

  const handleUpdate = async (data: UpdateDepartmentFormData) => {
    await updateDepartment({
      variables: {
        input: {
          id: data.id,
          name: data.name,
        },
      },
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this department? This will also delete all sub-departments.')) {
      return;
    }
    await deleteDepartment({
      variables: { id },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-red-600 dark:text-red-400">
            Error loading departments: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  const departments = data?.getDepartments || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Departments</h1>
        {!showCreateForm && !editingDepartment && (
          <Button
            variant="primary"
            onClick={() => setShowCreateForm(true)}
            disabled={creating}
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Create Department
          </Button>
        )}
      </div>

      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Create New Department</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)}>
                <FiX className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DepartmentForm
              onSubmit={handleCreate}
              onCancel={() => setShowCreateForm(false)}
              isLoading={creating}
            />
          </CardContent>
        </Card>
      )}

      {editingDepartment && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Update Department</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setEditingDepartment(null)}>
                <FiX className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <UpdateDepartmentForm
              departmentId={editingDepartment.id}
              currentName={editingDepartment.name}
              onSubmit={handleUpdate}
              onCancel={() => setEditingDepartment(null)}
              isLoading={updating}
            />
          </CardContent>
        </Card>
      )}

      <DepartmentList
        departments={departments}
        onEdit={(dept) => setEditingDepartment({ id: dept.id, name: dept.name })}
        onDelete={handleDelete}
        isLoading={deleting}
      />
    </div>
  );
}

