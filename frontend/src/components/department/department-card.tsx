"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  Calendar,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Department, SubDepartment } from "@/lib/types";
import { format } from "date-fns";

interface DepartmentCardProps {
  department: Department;
  onEdit: (dept: Department) => void;
  onDelete: (id: number) => void;
  onAddSubDept: (deptId: number) => void;
  onEditSubDept: (subDept: SubDepartment) => void;
  onDeleteSubDept: (deptId: number, subDeptId: number) => void;
}

export function DepartmentCard({
  department,
  onEdit,
  onDelete,
  onAddSubDept,
  onEditSubDept,
  onDeleteSubDept,
}: DepartmentCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              {department.name}
              <Badge
                variant="outline"
                className="ml-2 font-normal text-xs text-muted-foreground"
              >
                ID: {department.id}
              </Badge>
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-xs">
              <Calendar className="h-3 w-3" />
              Created {format(new Date(department.createdAt), "MMM d, yyyy")}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(department)}>
                <Edit2 className="mr-2 h-4 w-4" /> Edit Department
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddSubDept(department.id)}>
                <Plus className="mr-2 h-4 w-4" /> Add Sub-Department
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(department.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Department
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Layers className="h-4 w-4" />
              <span>
                Sub-Departments ({department.subDepartments?.length || 0})
              </span>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle sub-departments</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2">
            {department.subDepartments &&
            department.subDepartments.length > 0 ? (
              <div className="grid gap-2">
                {department.subDepartments.map((sub) => (
                  <div
                    key={sub.id}
                    className="group flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2 text-sm transition-colors hover:bg-muted/60"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{sub.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        Added {format(new Date(sub.createdAt), "MMM d")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          onEditSubDept({ ...sub, departmentId: department.id })
                        }
                      >
                        <Edit2 className="h-3 w-3" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => onDeleteSubDept(department.id, sub.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-20 flex-col items-center justify-center rounded-md border border-dashed bg-muted/20 text-xs text-muted-foreground">
                <span>No sub-departments yet</span>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={() => onAddSubDept(department.id)}
                >
                  Add one now
                </Button>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      <CardFooter className="border-t bg-muted/10 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Last updated: {format(new Date(department.updatedAt), "PP")}
        </div>
      </CardFooter>
    </Card>
  );
}
