"use client";

import { useQuery } from "@apollo/client/react";
import { GET_DEPARTMENTS } from "@/lib/graphql/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { FiLayout, FiLayers, FiTrendingUp } from "react-icons/fi";
import type { GetDepartmentsQuery, Department } from "@/lib/types";

export default function DashboardPage() {
  const { data, loading, error } =
    useQuery<GetDepartmentsQuery>(GET_DEPARTMENTS);

  const departments = data?.getDepartments || [];
  const totalSubDepartments = departments.reduce(
    (acc: number, dept: Department) => acc + (dept.subDepartments?.length || 0),
    0
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage message={error.message} title="Error loading dashboard" />
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Departments
                </p>
                <p className="text-3xl font-bold mt-2">{departments.length}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <FiLayout className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Sub-Departments
                </p>
                <p className="text-3xl font-bold mt-2">{totalSubDepartments}</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <FiLayers className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Active Organizations
                </p>
                <p className="text-3xl font-bold mt-2">
                  {departments.length > 0 ? departments.length : 0}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <FiTrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Departments</CardTitle>
        </CardHeader>
        <CardContent>
          {departments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No departments yet. Create your first department to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {departments.slice(0, 5).map((dept: Department) => (
                <div
                  key={dept.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <span className="font-medium">{dept.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {dept.subDepartments?.length || 0} sub-departments
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
