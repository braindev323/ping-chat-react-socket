/* @flow */

import gql from 'graphql-tag';

export const mBlockUser = gql`
  mutation BlockUser(
    $block_id: ID!,
  ) {
    blockUser(input: {
      block_id: $block_id,
    })
  }
`;

export const mUnblockUser = gql`
  mutation UnblockUser(
    $block_id: ID!,
  ) {
    unblockUser(input: {
      block_id: $block_id,
    })
  }
`;

export const mMuteUser = gql`
  mutation MuteUser(
    $mute_id: ID!,
  ) {
    muteUser(input: {
      mute_id: $mute_id,
    })
  }
`;

export const mUnmuteUser = gql`
  mutation UnmuteUser(
    $mute_id: ID!,
  ) {
    unmuteUser(input: {
      mute_id: $mute_id,
    })
  }
`;