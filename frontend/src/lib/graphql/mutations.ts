import { gql } from '@apollo/client';

export const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
      id
      name
      createdAt
      updatedAt
      subDepartments {
        id
        name
        createdAt
        updatedAt
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
      updatedAt
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
      updatedAt
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
      updatedAt
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

