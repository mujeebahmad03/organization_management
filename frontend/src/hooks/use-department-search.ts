import { useState, useMemo } from "react";
import type { Department } from "@/lib/types";

export function useDepartmentSearch(departments: Department[]) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDepartments = useMemo(() => {
    if (!searchQuery.trim()) {
      return departments;
    }

    const query = searchQuery.toLowerCase().trim();

    return departments.filter((dept) => {
      // Search in department name
      const matchesName = dept.name.toLowerCase().includes(query);

      // Search in sub-department names
      const matchesSubDept = dept.subDepartments?.some((sub) =>
        sub.name.toLowerCase().includes(query)
      );

      return matchesName || matchesSubDept;
    });
  }, [departments, searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredDepartments,
    clearSearch,
  };
}

