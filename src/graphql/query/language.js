/* @flow */

import gql from 'graphql-tag';

export const qGetLanguages = gql`
  query GetLanguages {
    getLanguages {
      id
      name
      native_name
      code
      code2
      code3
    }
  }
`;