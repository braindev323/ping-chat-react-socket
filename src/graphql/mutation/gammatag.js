/* @flow */

import gql from 'graphql-tag';

export const mAddGammatag = gql`
  mutation AddGammatag($name: String!) {
    addGammatag(name: $name)
  }
`;