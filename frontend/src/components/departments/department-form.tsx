"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createDepartmentSchema,
  type CreateDepartmentFormData,
} from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiPlus, FiX } from "react-icons/fi";

interface DepartmentFormProps {
  onSubmit: (data: CreateDepartmentFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: CreateDepartmentFormData;
}

export function DepartmentForm({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
}: DepartmentFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateDepartmentFormData>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: initialData || {
      name: "",
      subDepartments: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subDepartments",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Department Name"
        placeholder="Enter department name"
        error={errors.name?.message}
        {...register("name")}
      />

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sub-Departments (Optional)
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => append({ name: "" })}
          >
            <FiPlus className="w-4 h-4 mr-1" />
            Add Sub-Department
          </Button>
        </div>

        {fields.length > 0 && (
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  placeholder={`Sub-department ${index + 1} name`}
                  error={errors.subDepartments?.[index]?.name?.message}
                  {...register(`subDepartments.${index}.name`)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="shrink-0"
                >
                  <FiX className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="flex-1"
        >
          {initialData ? "Update Department" : "Create Department"}
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
