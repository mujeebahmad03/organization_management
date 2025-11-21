"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import type { Department } from "@/lib/types";

const departmentFormSchema = z.object({
  name: z.string().min(2, {
    message: "Department name must be at least 2 characters.",
  }),
  subDepartments: z
    .array(
      z.object({
        name: z.string().min(2, {
          message: "Sub-department name must be at least 2 characters.",
        }),
      })
    )
    .default([]),
});

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

interface DepartmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DepartmentFormValues) => void;
  initialData?: Department | null;
}

export function DepartmentForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: DepartmentFormProps) {
  const form = useForm({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      name: "",
      subDepartments: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subDepartments",
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        subDepartments:
          initialData.subDepartments?.map((sub) => ({ name: sub.name })) || [],
      });
    } else {
      form.reset({
        name: "",
        subDepartments: [],
      });
    }
  }, [initialData, form, open]);

  const handleSubmit = (values: DepartmentFormValues) => {
    onSubmit(values as DepartmentFormValues);
    onOpenChange(false);
    form.reset();
  };

  const addSubDepartment = () => {
    append({ name: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Department" : "Create Department"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Make changes to the department details here."
              : "Add a new department to your organization."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Engineering" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the public display name for the department.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <FormLabel>Sub-Departments (Optional)</FormLabel>
                  <FormDescription className="mt-0">
                    Add sub-departments or teams within this department.
                  </FormDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSubDepartment}
                  className="shrink-0"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>

              {fields.length > 0 && (
                <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                  {fields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`subDepartments.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-start gap-2">
                            <FormControl className="flex-1">
                              <Input
                                placeholder="e.g. Frontend Team"
                                {...field}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 shrink-0 text-destructive hover:text-destructive"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              )}

              {fields.length === 0 && (
                <div className="rounded-lg border border-dashed bg-muted/20 p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No sub-departments added yet. Click &quot;Add&quot; to
                    create one.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="submit">
                {initialData ? "Save changes" : "Create department"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
