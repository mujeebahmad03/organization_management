import { gql } from '@apollo/client';

export const GET_DEPARTMENTS = gql`
  query GetDepartments {
    getDepartments {
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

export const GET_DEPARTMENT = gql`
  query GetDepartment($id: Int!) {
    getDepartment(id: $id) {
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

export const GET_SUB_DEPARTMENTS = gql`
  query GetSubDepartments {
    getSubDepartments {
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

export const GET_SUB_DEPARTMENT = gql`
  query GetSubDepartment($id: Int!) {
    getSubDepartment(id: $id) {
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

