// Shared Type Definitions

export interface SubDepartment {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  departmentId?: number;
  department?: {
    id: number;
    name: string;
  };
}

export interface Department {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  subDepartments?: SubDepartment[];
}

export interface User {
  id: number;
  username: string;
  createdAt: string;
  updatedAt: string;
}

// GraphQL Query Response Types
export interface GetDepartmentsQuery {
  getDepartments: Department[];
}

export interface GetSubDepartmentsQuery {
  getSubDepartments: SubDepartment[];
}

// Form Data Types
export interface DepartmentOption {
  id: number;
  name: string;
}

export interface EditingEntity {
  id: number;
  name: string;
}
