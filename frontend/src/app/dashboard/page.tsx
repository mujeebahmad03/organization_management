'use client';

import { useQuery } from '@apollo/client';
import { GET_DEPARTMENTS } from '@/lib/graphql/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FiLayout, FiLayers, FiTrendingUp } from 'react-icons/fi';

export default function DashboardPage() {
  const { data, loading, error } = useQuery(GET_DEPARTMENTS);

  const departments = data?.getDepartments || [];
  const totalSubDepartments = departments.reduce(
    (acc: number, dept: any) => acc + (dept.subDepartments?.length || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-red-600 dark:text-red-400">
            Error loading dashboard: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Departments</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {departments.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FiLayout className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Sub-Departments</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {totalSubDepartments}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <FiLayers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Organizations</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {departments.length > 0 ? departments.length : 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <FiTrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
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
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No departments yet. Create your first department to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {departments.slice(0, 5).map((dept: any) => (
                <div
                  key={dept.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {dept.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
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

