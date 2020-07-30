/* @flow */

import gql from 'graphql-tag';

export const mPost = gql`
  mutation UserPost(
    $title: String!,
    $description: String,
    $cover_image: String,
    $type: Int!,
    $original_url: String,
    $original_post_date: DateTime!,
    $category_id: ID!,
    $gammatags: [String!]!,
    $images: [String!],
    $videos: [VideoInput!],
    $reissued_id: ID,
  ) {
    userPost(input: {
      title: $title,
      description: $description,
      cover_image: $cover_image,
      type: $type,
      original_url: $original_url,
      original_post_date: $original_post_date,
      category_id: $category_id,
      gammatags: $gammatags,
      images: $images,
      videos: $videos,
      reissued_id: $reissued_id,
    })
  }
`;

export const mBookmarkPost = gql`
  mutation BookmarkPost(
    $post_id: ID!,
    $enable: Boolean!
  ) {
    bookmarkPost(input: {
      post_id: $post_id,
      enable: $enable,
    })
  }
`;

export const mRatePost = gql`
  mutation RatePost(
    $post_id: ID!,
    $rate: Int!
  ) {
    ratePost(input: {
      post_id: $post_id,
      rate: $rate,
    })
  }
`;

export const mReportPost = gql`
  mutation ReportPost(
    $post_id: ID!,
    $reason: String!
  ) {
    reportPost(input: {
      post_id: $post_id,
      reason: $reason,
    })
  }
`;