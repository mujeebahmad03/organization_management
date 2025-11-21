"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Edit2,
  Trash2,
  Plus,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface DepartmentListProps {
  departments: Department[];
  onEdit: (dept: Department) => void;
  onDelete: (id: number) => void;
  onAddSubDept: (deptId: number) => void;
  onEditSubDept: (subDept: SubDepartment) => void;
  onDeleteSubDept: (deptId: number, subDeptId: number) => void;
}

export function DepartmentList({
  departments,
  onEdit,
  onDelete,
  onAddSubDept,
  onEditSubDept,
  onDeleteSubDept,
}: DepartmentListProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Mobile-friendly card view */}
      <div className="md:hidden space-y-4 p-4">
        {departments.map((dept) => (
          <div key={dept.id} className="border rounded-lg bg-background">
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="font-semibold">{dept.name}</div>
                  <div className="text-xs text-muted-foreground">
                    ID: {dept.id}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(dept)}>
                      <Edit2 className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAddSubDept(dept.id)}>
                      <Plus className="mr-2 h-4 w-4" /> Add Sub-Dept
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(dept.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(dept.createdAt), "MMM d, yyyy")}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {dept.subDepartments?.length || 0} sub-depts
                </Badge>
              </div>

              {dept.subDepartments && dept.subDepartments.length > 0 && (
                <Collapsible
                  open={expandedRows.has(dept.id)}
                  onOpenChange={() => toggleRow(dept.id)}
                  className="space-y-2"
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs"
                    >
                      <ChevronRight
                        className={`mr-2 h-4 w-4 transition-transform ${
                          expandedRows.has(dept.id) ? "rotate-90" : ""
                        }`}
                      />
                      View Sub-Departments
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2">
                    {dept.subDepartments.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2"
                      >
                        <div className="text-sm">
                          <div className="font-medium">{sub.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(sub.createdAt), "MMM d, yyyy")}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              onEditSubDept({ ...sub, departmentId: dept.id })
                            }
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => onDeleteSubDept(dept.id, sub.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12"></TableHead>
              <TableHead className="font-semibold">Department Name</TableHead>
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Sub-Departments</TableHead>
              <TableHead className="font-semibold">Created</TableHead>
              <TableHead className="font-semibold">Updated</TableHead>
              <TableHead className="w-20 text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((dept) => (
              <>
                <TableRow key={dept.id} className="group hover:bg-muted/40">
                  <TableCell>
                    {dept.subDepartments && dept.subDepartments.length > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleRow(dept.id)}
                      >
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${
                            expandedRows.has(dept.id) ? "rotate-90" : ""
                          }`}
                        />
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {dept.id}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {dept.subDepartments?.length || 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(dept.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(dept.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(dept)}>
                          <Edit2 className="mr-2 h-4 w-4" /> Edit Department
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAddSubDept(dept.id)}>
                          <Plus className="mr-2 h-4 w-4" /> Add Sub-Department
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(dept.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Department
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>

                {/* Expanded sub-departments row */}
                {expandedRows.has(dept.id) &&
                  dept.subDepartments &&
                  dept.subDepartments.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-muted/20 p-0">
                        <div className="py-2 px-14">
                          <div className="space-y-2">
                            <div className="text-xs font-medium text-muted-foreground mb-2">
                              Sub-Departments:
                            </div>
                            <div className="grid gap-2">
                              {dept.subDepartments.map((sub) => (
                                <div
                                  key={sub.id}
                                  className="group flex items-center justify-between rounded-md border bg-background px-4 py-2 hover:bg-muted/40 transition-colors"
                                >
                                  <div className="flex items-center gap-4 flex-1">
                                    <div className="font-medium text-sm">
                                      {sub.name}
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className="font-mono text-xs"
                                    >
                                      {sub.id}
                                    </Badge>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {format(
                                        new Date(sub.createdAt),
                                        "MMM d, yyyy"
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() =>
                                        onEditSubDept({
                                          ...sub,
                                          departmentId: dept.id,
                                        })
                                      }
                                    >
                                      <Edit2 className="h-3 w-3" />
                                      <span className="sr-only">
                                        Edit sub-department
                                      </span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-destructive hover:text-destructive"
                                      onClick={() =>
                                        onDeleteSubDept(dept.id, sub.id)
                                      }
                                    >
                                      <Trash2 className="h-3 w-3" />
                                      <span className="sr-only">
                                        Delete sub-department
                                      </span>
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
