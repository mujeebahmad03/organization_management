import { gql } from '@apollo/client';

export const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
      id
      name
      createdAt
      subDepartments {
        id
        name
        createdAt
      }
    }
  }
`;

export const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment($input: UpdateDepartmentInput!) {
    updateDepartment(input: $input) {
      id
      name
      createdAt
    }
  }
`;

export const DELETE_DEPARTMENT = gql`
  mutation DeleteDepartment($id: Int!) {
    deleteDepartment(id: $id)
  }
`;

export const CREATE_SUB_DEPARTMENT = gql`
  mutation CreateSubDepartment($input: CreateSubDepartmentInput!) {
    createSubDepartment(input: $input) {
      id
      name
      departmentId
      createdAt
      department {
        id
        name
      }
    }
  }
`;

export const UPDATE_SUB_DEPARTMENT = gql`
  mutation UpdateSubDepartment($input: UpdateSubDepartmentInput!) {
    updateSubDepartment(input: $input) {
      id
      name
      departmentId
      createdAt
    }
  }
`;

export const DELETE_SUB_DEPARTMENT = gql`
  mutation DeleteSubDepartment($id: Int!) {
    deleteSubDepartment(id: $id)
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

