/* @flow */

import gql from 'graphql-tag';

export const qGetGammatag = gql`
  query GetGammatag($id: Int) {
    getGammatag(id: $id) {
      id
      name
      rate
    }
  }
`;

export const qGetGammatagByName = gql`
  query GetGammatagByName($name: String!) {
    getGammatagByName(name: $name) {
      id
      name
      rate
    }
  }
`;

export const qGetTrendingGammatags = gql`
  query GetTrendingGammatags($count: Int) {
    getTrendingGammatags(count: $count) {
      id
      name
      rate
    }
  }
`;

export const qSearchGammatag = gql`
  query SearchGammatag($name: String!, $count: Int) {
    searchGammatag(name: $name, count: $count) {
      id
      name
      rate
    }
  }
`;