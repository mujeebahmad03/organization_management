'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createSubDepartmentSchema,
  updateSubDepartmentSchema,
  type CreateSubDepartmentFormData,
  type UpdateSubDepartmentFormData,
} from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SubDepartmentFormProps {
  departments: Array<{ id: number; name: string }>;
  onSubmit: (data: CreateSubDepartmentFormData | UpdateSubDepartmentFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: UpdateSubDepartmentFormData;
}

export function SubDepartmentForm({
  departments,
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
}: SubDepartmentFormProps) {
  const schema = initialData ? updateSubDepartmentSchema : createSubDepartmentSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSubDepartmentFormData | UpdateSubDepartmentFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      departmentId: departments[0]?.id || 0,
      name: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!initialData && (
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Department
          </label>
          <select
            className={`
              w-full px-4 py-2.5 rounded-lg border transition-colors
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-gray-600
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${errors.departmentId ? 'border-red-500 focus:ring-red-500' : ''}
            `}
            {...register('departmentId', { valueAsNumber: true })}
          >
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          {errors.departmentId && (
            <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {errors.departmentId.message as string}
            </p>
          )}
        </div>
      )}

      <Input
        label="Sub-Department Name"
        placeholder="Enter sub-department name"
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
          {initialData ? 'Update Sub-Department' : 'Create Sub-Department'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

