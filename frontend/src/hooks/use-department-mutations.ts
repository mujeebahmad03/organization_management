import { useCallback } from "react";
import { useMutationHandler } from "./use-mutation-handler";
import {
  CREATE_DEPARTMENT,
  UPDATE_DEPARTMENT,
  DELETE_DEPARTMENT,
  CREATE_SUB_DEPARTMENT,
  UPDATE_SUB_DEPARTMENT,
  DELETE_SUB_DEPARTMENT,
} from "@/lib/graphql/mutations";
import { GET_DEPARTMENTS } from "@/lib/graphql/queries";
import { SUCCESS_MESSAGES } from "@/lib/constants";
import { useToast } from "./use-toast";

export function useDepartmentMutations() {
  const { toast } = useToast();

  const createDepartment = useMutationHandler({
    mutation: CREATE_DEPARTMENT,
    onSuccess: () => {
      toast.success(SUCCESS_MESSAGES.DEPARTMENT_CREATED);
    },
    apolloOptions: {
      refetchQueries: [{ query: GET_DEPARTMENTS }],
    },
  });

  const updateDepartment = useMutationHandler({
    mutation: UPDATE_DEPARTMENT,
    onSuccess: () => {
      toast.success(SUCCESS_MESSAGES.DEPARTMENT_UPDATED);
    },
    apolloOptions: {
      refetchQueries: [{ query: GET_DEPARTMENTS }],
    },
  });

  const deleteDepartment = useMutationHandler({
    mutation: DELETE_DEPARTMENT,
    onSuccess: () => {
      toast.success(SUCCESS_MESSAGES.DEPARTMENT_DELETED);
    },
    apolloOptions: {
      refetchQueries: [{ query: GET_DEPARTMENTS }],
    },
  });

  const createSubDepartment = useMutationHandler({
    mutation: CREATE_SUB_DEPARTMENT,
    onSuccess: () => {
      toast.success(SUCCESS_MESSAGES.SUB_DEPARTMENT_CREATED);
    },
    apolloOptions: {
      refetchQueries: [{ query: GET_DEPARTMENTS }],
    },
  });

  const updateSubDepartment = useMutationHandler({
    mutation: UPDATE_SUB_DEPARTMENT,
    onSuccess: () => {
      toast.success(SUCCESS_MESSAGES.SUB_DEPARTMENT_UPDATED);
    },
    apolloOptions: {
      refetchQueries: [{ query: GET_DEPARTMENTS }],
    },
  });

  const deleteSubDepartment = useMutationHandler({
    mutation: DELETE_SUB_DEPARTMENT,
    onSuccess: () => {
      toast.success(SUCCESS_MESSAGES.SUB_DEPARTMENT_DELETED);
    },
    apolloOptions: {
      refetchQueries: [{ query: GET_DEPARTMENTS }],
    },
  });

  return {
    createDepartment: useCallback(
      (name: string, subDepartments?: Array<{ name: string }>) =>
        createDepartment.execute({
          input: {
            name,
            ...(subDepartments && subDepartments.length > 0
              ? { subDepartments }
              : {}),
          },
        }),
      [createDepartment]
    ),
    updateDepartment: useCallback(
      (id: number, name: string) =>
        updateDepartment.execute({
          input: { id, name },
        }),
      [updateDepartment]
    ),
    deleteDepartment: useCallback(
      (id: number) =>
        deleteDepartment.execute({
          id,
        }),
      [deleteDepartment]
    ),
    createSubDepartment: useCallback(
      (departmentId: number, name: string) =>
        createSubDepartment.execute({
          input: { departmentId, name },
        }),
      [createSubDepartment]
    ),
    updateSubDepartment: useCallback(
      (id: number, name: string) =>
        updateSubDepartment.execute({
          input: { id, name },
        }),
      [updateSubDepartment]
    ),
    deleteSubDepartment: useCallback(
      (id: number) =>
        deleteSubDepartment.execute({
          id,
        }),
      [deleteSubDepartment]
    ),
    loading:
      createDepartment.loading ||
      updateDepartment.loading ||
      deleteDepartment.loading ||
      createSubDepartment.loading ||
      updateSubDepartment.loading ||
      deleteSubDepartment.loading,
  };
}

