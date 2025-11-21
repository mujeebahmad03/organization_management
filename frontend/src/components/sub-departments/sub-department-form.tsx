"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSubDepartmentSchema,
  updateSubDepartmentSchema,
  type CreateSubDepartmentFormData,
  type UpdateSubDepartmentFormData,
} from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { DepartmentOption } from "@/lib/types";

interface SubDepartmentFormProps {
  departments: DepartmentOption[];
  onSubmit: (
    data: CreateSubDepartmentFormData | UpdateSubDepartmentFormData
  ) => Promise<void>;
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
  const schema = initialData
    ? updateSubDepartmentSchema
    : createSubDepartmentSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSubDepartmentFormData | UpdateSubDepartmentFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      departmentId: departments[0]?.id || 0,
      name: "",
    },
  });

  // Type-safe access to departmentId error (only exists in create mode)
  const departmentIdError =
    !initialData && "departmentId" in errors
      ? (errors as Record<string, { message?: string }>).departmentId
      : undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!initialData && (
        <div className="w-full">
          <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2">
            Department
          </label>
          <select
            className={`
              flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
              ring-offset-background
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-50
              transition-colors
              ${
                departmentIdError
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            `}
            {...register("departmentId", { valueAsNumber: true })}
          >
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          {departmentIdError && (
            <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {departmentIdError.message as string}
            </p>
          )}
        </div>
      )}

      <Input
        label="Sub-Department Name"
        placeholder="Enter sub-department name"
        error={errors.name?.message}
        {...register("name")}
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="flex-1"
        >
          {initialData ? "Update Sub-Department" : "Create Sub-Department"}
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
