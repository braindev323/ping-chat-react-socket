/* @flow */

import gql from 'graphql-tag';

export const mReadUser = gql`
  mutation ReadUser($user_id: ID!, $reading: Int) {
    readUser(user_id: $user_id, reading: $reading)
  }
`;

export const mReadChannel = gql`
  mutation ReadChannel($channel_id: ID!, $reading: Int) {
    readChannel(channel_id: $channel_id, reading: $reading)
  }
`;