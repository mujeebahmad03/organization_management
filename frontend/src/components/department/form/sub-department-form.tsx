"use client";

import { useForm } from "react-hook-form";
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
import type { SubDepartment } from "@/lib/types";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Sub-department name must be at least 2 characters.",
  }),
});

interface SubDepartmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
      });
    } else {
      form.reset({
        name: "",
      });
    }
  }, [initialData, form, open]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Sub-Department" : "Add Sub-Department"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Make changes to the sub-department details."
              : `Add a new sub-department to ${
                  parentDepartmentName || "the department"
                }.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Frontend Team" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the specific team or division.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {initialData ? "Save changes" : "Create sub-department"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
