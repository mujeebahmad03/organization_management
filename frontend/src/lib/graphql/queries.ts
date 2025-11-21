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

