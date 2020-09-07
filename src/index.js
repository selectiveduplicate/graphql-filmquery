import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { 
  ApolloClient, 
  ApolloProvider,
  InMemoryCache 
} from '@apollo/client';
import './index.css';

const APOLLO_CLIENT = new ApolloClient({
  uri: "https://play.dgraph.io/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          queryFilm: {
            merge(_ignored, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  })
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={APOLLO_CLIENT}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);