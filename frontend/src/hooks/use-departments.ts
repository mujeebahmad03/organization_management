import { useQuery } from "@apollo/client/react";
import { GET_DEPARTMENTS } from "@/lib/graphql/queries";
import { useAuth } from "@/contexts/auth-context";
import type { Department } from "@/lib/types";

export function useDepartments() {
  const { isAuthenticated } = useAuth();
  
  const { data, loading, error, refetch } = useQuery<{
    getDepartments: Department[];
  }>(GET_DEPARTMENTS, {
    fetchPolicy: "cache-and-network",
    skip: !isAuthenticated, // Skip query if user is not authenticated
  });

  return {
    departments: data?.getDepartments || [],
    loading,
    error,
    refetch,
  };
}
