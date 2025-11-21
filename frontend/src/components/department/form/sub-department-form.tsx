"use client";

import { BaseForm, type FormValues } from "./base-form";
import type { SubDepartment } from "@/lib/types";

interface SubDepartmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FormValues) => void;
  initialData?: SubDepartment | null;
  parentDepartmentName?: string;
}

export function SubDepartmentForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  parentDepartmentName,
}: SubDepartmentFormProps) {
  return (
    <BaseForm
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      initialData={initialData || null}
      title={initialData ? "Edit Sub-Department" : "Add Sub-Department"}
      description={
        initialData
          ? "Make changes to the sub-department details."
          : `Add a new sub-department to ${
              parentDepartmentName || "the department"
            }.`
      }
      submitLabel={initialData ? "Save changes" : "Create sub-department"}
      placeholder="e.g. Frontend Team"
      formDescription="The name of the specific team or division."
    />
  );
}
