/* @flow */

import gql from 'graphql-tag';

export const qGetCountries = gql`
  query GetCountries {
    getCountries {
      id
      name
      country_code
      dial_code
    }
  }
`;