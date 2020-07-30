/* @flow */

import gql from 'graphql-tag';

export const qGetChannels = gql`
  query GetChannels {
    getChannels {
      id
      name
      username
      email
      logo
      cover_image
      site_url
      country {
        id
        name
        country_code
        dial_code
      }
      type
      description
      reading
    }
  }
`;

export const qGetHotChannels = gql`
  query GetChannelByUsername($count: Int) {
    getHotChannels(count: $count) {
      id
      name
      username
      email
      logo
      cover_image
      site_url
      country {
        id
        name
        country_code
        dial_code
      }
      type
      description
      create_date
    }
  }
`;

export const qGetChannelByUsername = gql`
  query GetChannelByUsername($username: String!) {
    getChannelByUsername(username: $username) {
      id
      name
      username
      email
      logo
      cover_image
      site_url
      country {
        id
        name
        country_code
        dial_code
      }
      type
      description
      create_date
      reading
    }
  }
`;