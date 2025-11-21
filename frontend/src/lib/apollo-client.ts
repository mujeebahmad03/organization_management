import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import type { GraphQLError } from "graphql";
import Cookies from "js-cookie";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3000/graphql",
});

const authLink = new SetContextLink((prevContext) => {
  const token = Cookies.get("authToken");
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = new ErrorLink(
  ({
    graphQLErrors,
    networkError,
  }: {
    graphQLErrors: GraphQLError[];
    networkError: Error;
  }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach((error: GraphQLError) => {
        console.error(
          `[GraphQL error]: Message: ${error.message}, Location: ${error.locations}, Path: ${error.path}`
        );
      });
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
      if ("statusCode" in networkError && networkError.statusCode === 401) {
        // Unauthorized - clear token and redirect to login
        Cookies.remove("authToken");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
  }
);

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});
