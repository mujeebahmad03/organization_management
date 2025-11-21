import { useCallback } from "react";
import { useMutation, MutationHookOptions } from "@apollo/client/react";
import { DocumentNode } from "graphql";
import { ERROR_MESSAGES } from "@/lib/constants";

interface UseMutationHandlerOptions<TData, TVariables> {
  mutation: DocumentNode;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  refetch?: () => void;
  successMessage?: string;
  errorMessage?: string;
  apolloOptions?: MutationHookOptions<TData, TVariables>;
}

export function useMutationHandler<TData = any, TVariables = any>({
  mutation,
  onSuccess,
  onError,
  refetch,
  successMessage,
  errorMessage,
  apolloOptions,
}: UseMutationHandlerOptions<TData, TVariables>) {
  const [mutate, { loading }] = useMutation<TData, TVariables>(mutation, {
    ...apolloOptions,
    onCompleted: (data) => {
      if (successMessage) {
        // Could integrate with a toast notification system here
        console.log(successMessage);
      }
      onSuccess?.(data);
      refetch?.();
    },
    onError: (error) => {
      const message = errorMessage || error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      if (typeof window !== "undefined") {
        alert(message);
      }
      onError?.(error);
    },
  });

  const execute = useCallback(
    async (variables: TVariables) => {
      try {
        await mutate({ variables });
      } catch (error) {
        // Error is handled in onError callback
      }
    },
    [mutate]
  );

  return { execute, loading };
}

