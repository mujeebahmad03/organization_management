import { useQuery } from "@apollo/client/react";
import { GET_DEPARTMENTS } from "@/lib/graphql/queries";
import type { Department } from "@/lib/types";

export function useDepartments() {
  const { data, loading, error, refetch } = useQuery<{
    getDepartments: Department[];
  }>(GET_DEPARTMENTS, {
    fetchPolicy: "cache-and-network",
  });

  return {
    departments: data?.getDepartments || [],
    loading,
    error,
    refetch,
  };
}
