/* @flow */

import gql from 'graphql-tag';

export const qGetCategories = gql`
  query GetCategories {
    getCategories {
      id
      name
      tags
    }
  }
`;