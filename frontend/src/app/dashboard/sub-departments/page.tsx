'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_SUB_DEPARTMENTS, GET_DEPARTMENTS } from '@/lib/graphql/queries';
import {
  CREATE_SUB_DEPARTMENT,
  UPDATE_SUB_DEPARTMENT,
  DELETE_SUB_DEPARTMENT,
} from '@/lib/graphql/mutations';
import { SubDepartmentForm } from '@/components/sub-departments/sub-department-form';
import { SubDepartmentList } from '@/components/sub-departments/sub-department-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FiPlus, FiX } from 'react-icons/fi';
import type {
  CreateSubDepartmentFormData,
  UpdateSubDepartmentFormData,
} from '@/lib/validations';

export default function SubDepartmentsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSubDepartment, setEditingSubDepartment] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const { data: subDeptsData, loading: subDeptsLoading, error: subDeptsError, refetch: refetchSubDepts } = useQuery(GET_SUB_DEPARTMENTS);
  const { data: deptsData, loading: deptsLoading } = useQuery(GET_DEPARTMENTS);

  const [createSubDepartment, { loading: creating }] = useMutation(CREATE_SUB_DEPARTMENT, {
    onCompleted: () => {
      setShowCreateForm(false);
      refetchSubDepts();
    },
    onError: (error) => {
      alert(`Error creating sub-department: ${error.message}`);
    },
  });

  const [updateSubDepartment, { loading: updating }] = useMutation(UPDATE_SUB_DEPARTMENT, {
    onCompleted: () => {
      setEditingSubDepartment(null);
      refetchSubDepts();
    },
    onError: (error) => {
      alert(`Error updating sub-department: ${error.message}`);
    },
  });

  const [deleteSubDepartment, { loading: deleting }] = useMutation(DELETE_SUB_DEPARTMENT, {
    onCompleted: () => {
      refetchSubDepts();
    },
    onError: (error) => {
      alert(`Error deleting sub-department: ${error.message}`);
    },
  });

  const handleCreate = async (data: CreateSubDepartmentFormData) => {
    await createSubDepartment({
      variables: {
        input: {
          departmentId: data.departmentId,
          name: data.name,
        },
      },
    });
  };

  const handleUpdate = async (data: UpdateSubDepartmentFormData) => {
    await updateSubDepartment({
      variables: {
        input: {
          id: data.id,
          name: data.name,
        },
      },
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this sub-department?')) {
      return;
    }
    await deleteSubDepartment({
      variables: { id },
    });
  };

  if (subDeptsLoading || deptsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (subDeptsError) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-red-600 dark:text-red-400">
            Error loading sub-departments: {subDeptsError.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  const subDepartments = subDeptsData?.getSubDepartments || [];
  const departments = deptsData?.getDepartments || [];

  if (departments.length === 0 && !showCreateForm && !editingSubDepartment) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Sub-Departments
        </h1>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You need to create at least one department before creating sub-departments.
            </p>
            <Button variant="primary" onClick={() => window.location.href = '/dashboard/departments'}>
              Go to Departments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Sub-Departments</h1>
        {!showCreateForm && !editingSubDepartment && departments.length > 0 && (
          <Button
            variant="primary"
            onClick={() => setShowCreateForm(true)}
            disabled={creating}
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Create Sub-Department
          </Button>
        )}
      </div>

      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Create New Sub-Department</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)}>
                <FiX className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <SubDepartmentForm
              departments={departments.map((d: any) => ({ id: d.id, name: d.name }))}
              onSubmit={handleCreate}
              onCancel={() => setShowCreateForm(false)}
              isLoading={creating}
            />
          </CardContent>
        </Card>
      )}

      {editingSubDepartment && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Update Sub-Department</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setEditingSubDepartment(null)}>
                <FiX className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <SubDepartmentForm
              departments={departments.map((d: any) => ({ id: d.id, name: d.name }))}
              onSubmit={handleUpdate}
              onCancel={() => setEditingSubDepartment(null)}
              isLoading={updating}
              initialData={{
                id: editingSubDepartment.id,
                name: editingSubDepartment.name,
              }}
            />
          </CardContent>
        </Card>
      )}

      <SubDepartmentList
        subDepartments={subDepartments}
        onEdit={(subDept) =>
          setEditingSubDepartment({ id: subDept.id, name: subDept.name })
        }
        onDelete={handleDelete}
        isLoading={deleting}
      />
    </div>
  );
}

