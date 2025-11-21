import { useCallback } from "react";
import { useMutation, MutationHookOptions } from "@apollo/client/react";
import { OperationVariables } from "@apollo/client";
import { DocumentNode } from "graphql";
import { ERROR_MESSAGES } from "@/lib/constants";

interface UseMutationHandlerOptions<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables
> {
  mutation: DocumentNode;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  refetch?: () => void;
  successMessage?: string;
  errorMessage?: string;
  apolloOptions?: MutationHookOptions<TData, TVariables>;
}

export function useMutationHandler<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables
>({
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
      onSuccess?.(data);
      if (refetch) {
        refetch();
      }
    },
    onError: (error) => {
      const message =
        errorMessage || error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      onError?.(error);
      // Error handling is done by the caller via onError callback
    },
  });

  const execute = useCallback(
    async (variables: TVariables) => {
      try {
        await mutate({ variables });
      } catch {
        // Error is handled in onError callback
      }
    },
    [mutate]
  );

  return { execute, loading };
}
