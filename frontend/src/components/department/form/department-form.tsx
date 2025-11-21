"use client";

import { BaseForm, type FormValues } from "./base-form";
import type { Department } from "@/lib/types";

interface DepartmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FormValues) => void;
  initialData?: Department | null;
}

export function DepartmentForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: DepartmentFormProps) {
  return (
    <BaseForm
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      initialData={initialData || null}
      title={initialData ? "Edit Department" : "Create Department"}
      description={
        initialData
          ? "Make changes to the department details here."
          : "Add a new department to your organization."
      }
      submitLabel={initialData ? "Save changes" : "Create department"}
      placeholder="e.g. Engineering"
      formDescription="This is the public display name for the department."
    />
  );
}
