/* @flow */

import gql from 'graphql-tag';

export const qIsReadingUser = gql`
  query IsReadingUser($user_id: ID!) {
    isReadingUser(user_id: $user_id)
  }
`;

export const qIsReadingChannel = gql`
  query IsReadingChannel($channel_id: ID!) {
    isReadingChannel(channel_id: $channel_id)
  }
`;