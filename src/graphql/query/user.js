/* @flow */

import gql from 'graphql-tag';

export const qMe = gql`
  query {
    me {
      id
      username
      first_name
      last_name
      email
      photo
      cover_image
      phone_number
      signup_type
      level
      site_url
      description
      country {
        id
        name
        country_code
        dial_code
      }
      city {
        id
        name
        location
      }
      create_date
    }
  }
`;

export const qGetUserSetting = gql`
  query GetUserSetting {
    getUserSetting {
      paypal_address
      show_balance_in_wallet
      reader_tag_photo
      all_tag_photo
      personalization
      personalization_ads
      personalization_deivice
      personalization_location
      personalization_track
      personalisation_share_partner
      language
      monetize_content
      find_by_email
      find_by_phonenumber
      content_only_pro
      famliy_safe
      theme
    }
  }
`;

export const qGetUserByUsername = gql`
  query GetUserByUsername($username: String!) {
    getUserByUsername(username: $username) {
      id
      username
      first_name
      last_name
      email
      photo
      cover_image
      level
      site_url
      description
      country {
        id
        name
        country_code
        dial_code
      }
      city {
        id
        name
        location
      }
      create_date
    }
  }
`;

export const qGetUserActivity = gql`
  query GetUserActivity($username: String!) {
    getUserActivity(username: $username) {
      posts
      reading
      readers
      comments
      like
      dislike
      reissue
    }
  }
`;

export const qGetUserReading = gql`
  query GetUserReading($user_id: ID!, $offset: Int) {
    getUserReading(user_id: $user_id, offset: $offset) {
      id
      username
      first_name
      last_name
      email
      photo
      cover_image
      level
      site_url
      description
      create_date
      reading
    }
  }
`;

export const qGetUserRecentReading = gql`
  query GetUserRecentReading($user_id: ID!, $count: Int) {
    getUserRecentReading(user_id: $user_id, count: $count) {
      id
      username
      first_name
      last_name
      email
      photo
      cover_image
      level
      site_url
      description
      create_date
      country {
        id
        name
        country_code
        dial_code
      }
      city {
        id
        name
        location
      }
    }
  }
`;

export const qGetUserReaders = gql`
  query GetUserReaders($user_id: ID!, $offset: Int) {
    getUserReaders(user_id: $user_id, offset: $offset) {
      id
      username
      first_name
      last_name
      email
      photo
      cover_image
      level
      site_url
      description
      create_date
      reading
    }
  }
`;

export const qGetUserRecentReaders = gql`
  query GetUserRecentReaders($user_id: ID!, $count: Int) {
    getUserRecentReaders(user_id: $user_id, count: $count) {
      id
      username
      first_name
      last_name
      email
      photo
      cover_image
      level
      site_url
      description
      create_date
      country {
        id
        name
        country_code
        dial_code
      }
      city {
        id
        name
        location
      }
    }
  }
`;

export const qGetBlockedUsers = gql`
  query GetBlockedUsers {
    getBlockedUsers {
      block {
        id
        username
        first_name
        last_name
        email
        photo
        cover_image
        level
        site_url
        description
      }
      status
    }
  }
`;

export const qSearchUsers = gql`
  query SearchUsers($searchkey: String!, $offset: Int) {
    searchUsers(searchkey: $searchkey, offset: $offset) {
      id
      type
      name
      username
      first_name
      last_name
      logo
      photo
      cover_image
      level
      country {
        id
        name
        country_code
      }
      description
    }
  }
`;