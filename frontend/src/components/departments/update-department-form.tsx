"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateDepartmentSchema,
  type UpdateDepartmentFormData,
} from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UpdateDepartmentFormProps {
  departmentId: number;
  currentName: string;
  onSubmit: (data: UpdateDepartmentFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UpdateDepartmentForm({
  departmentId,
  currentName,
  onSubmit,
  onCancel,
  isLoading = false,
}: UpdateDepartmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateDepartmentFormData>({
    resolver: zodResolver(updateDepartmentSchema),
    defaultValues: {
      id: departmentId,
      name: currentName,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Department Name"
        placeholder="Enter department name"
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
          Update Department
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
