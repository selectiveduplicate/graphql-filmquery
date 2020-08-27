import React from 'react';
import ReactDOM from 'react-dom';
import { App, APOLLO_CLIENT } from './App';
import './index.css';
import { ApolloProvider } from '@apollo/client';

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={APOLLO_CLIENT}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);