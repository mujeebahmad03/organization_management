import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import {
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
} from "@apollo/client/errors";
import Cookies from "js-cookie";
import { API_CONFIG, COOKIE_CONFIG, ROUTES } from "./constants";

const httpLink = new HttpLink({
  uri: API_CONFIG.GRAPHQL_URL,
});

const authLink = new SetContextLink((prevContext) => {
  const token = Cookies.get(COOKIE_CONFIG.AUTH_TOKEN);
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  } else if (CombinedProtocolErrors.is(error)) {
    error.errors.forEach(({ message, extensions }) => {
      console.error(
        `[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(
          extensions
        )}`
      );
    });
  } else {
    console.error(`[Network error]: ${error}`);
    if ("statusCode" in error && error.statusCode === 401) {
      // Unauthorized - clear token and redirect to login
      Cookies.remove(COOKIE_CONFIG.AUTH_TOKEN);
      if (typeof window !== "undefined") {
        window.location.href = ROUTES.LOGIN;
      }
    }
  }
});

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
