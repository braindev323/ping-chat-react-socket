/* @flow */

import gql from "graphql-tag";

export const qGetPostComments = gql`
  query GetPostComments {
    getPostComments(post_id: 45) {
      id
      post {
        id
        title
        description
        cover_image
        type
        original_url
        original_post_date
        gammatags
        language
      }
      user {
        id
        username
        first_name
        last_name
        email
        photo
        cover_image
      }
      content
      reply_id
    }
  }
`;

export const qGetPosts = gql`
  query GetPosts($date: DateTime, $isLater: Boolean) {
    getPosts(date: $date, isLater: $isLater) {
      id
      title
      description
      cover_image
      type
      original_url
      original_post_date
      category {
        id
        name
        tags
      }
      channel {
        id
        name
        username
        email
        logo
        cover_image
      }
      author {
        id
        username
        first_name
        last_name
        email
        photo
        cover_image
      }
      gammatags
      reissued_id
      language
      media {
        images
        videos {
          url
          thumb_url
        }
      }
      rate {
        like
        dislike
        status
      }
      reply {
        count
      }
      bookmark
      hidden
      report
    }
  }
`;

export const qGetBookMarkUser = gql`
  query getBookmarks {
    getBookmarks {
      id
      post {
        id
        title
        description
        cover_image
        type
        original_url
        original_post_date
        channel {
          id
          name
          username
          email
          logo
          cover_image
        }
        author {
          id
          username
          first_name
          last_name
          email
          photo
          cover_image
        }
        gammatags
        reissued_id
        language
      }
      user {
        id
        username
        first_name
        last_name
        email
        photo
        cover_image
      }
    }
  }
`;

export const qGetHotTopics = gql`
  query GetHotTopics($count: Int) {
    getHotTopics(count: $count) {
      id
      title
      description
      cover_image
      type
      original_url
      original_post_date
      category {
        id
        name
        tags
      }
      channel {
        id
        name
        username
        email
        logo
        cover_image
      }
      author {
        id
        username
        first_name
        last_name
        email
        photo
        cover_image
      }
      gammatags
      reissued_id
      language
      media {
        images
        videos {
          url
          thumb_url
        }
      }
      rate {
        like
        dislike
      }
      reply {
        count
      }
    }
  }
`;

export const qGetUserPosts = gql`
  query GetUserPosts($user_id: ID!, $date: DateTime, $isLater: Boolean) {
    getUserPosts(user_id: $user_id, date: $date, isLater: $isLater) {
      id
      title
      description
      cover_image
      type
      original_url
      original_post_date
      category {
        id
        name
        tags
      }
      channel {
        id
        name
        username
        email
        logo
        cover_image
      }
      author {
        id
        username
        first_name
        last_name
        email
        photo
        cover_image
      }
      gammatags
      reissued_id
      language
      media {
        images
        videos {
          url
          thumb_url
        }
      }
      rate {
        like
        dislike
        status
      }
      reply {
        count
      }
      bookmark
      hidden
      report
    }
  }
`;

export const qGetChannelPosts = gql`
  query GetChannelPosts($channel_id: ID!, $date: DateTime, $isLater: Boolean) {
    getChannelPosts(channel_id: $channel_id, date: $date, isLater: $isLater) {
      id
      title
      description
      cover_image
      type
      original_url
      original_post_date
      category {
        id
        name
        tags
      }
      channel {
        id
        name
        username
        email
        logo
        cover_image
      }
      author {
        id
        username
        first_name
        last_name
        email
        photo
        cover_image
      }
      gammatags
      reissued_id
      language
      media {
        images
        videos {
          url
          thumb_url
        }
      }
      rate {
        like
        dislike
        status
      }
      reply {
        count
      }
      bookmark
      hidden
      report
    }
  }
`;

export const qSearchArticles = gql`
  query SearchArticles($searchkey: String!, $offset: Int) {
    searchArticles(searchkey: $searchkey, offset: $offset) {
      id
      title
      description
      cover_image
      type
      original_url
      original_post_date
      category {
        id
        name
        tags
      }
      channel {
        id
        name
        username
        email
        logo
        cover_image
      }
      author {
        id
        username
        first_name
        last_name
        email
        photo
        cover_image
      }
      gammatags
      reissued_id
      language
      media {
        images
        videos {
          url
          thumb_url
        }
      }
      rate {
        like
        dislike
        status
      }
      reply {
        count
      }
      bookmark
      hidden
      report
    }
  }
`;

export const qSearchPhotos = gql`
  query SearchPhotos($searchkey: String!, $offset: Int) {
    searchPhotos(searchkey: $searchkey, offset: $offset) {
      id
      title
      description
      cover_image
      type
      original_url
      original_post_date
      category {
        id
        name
        tags
      }
      channel {
        id
        name
        username
        email
        logo
        cover_image
      }
      author {
        id
        username
        first_name
        last_name
        email
        photo
        cover_image
      }
      gammatags
      reissued_id
      language
      media {
        images
        videos {
          url
          thumb_url
        }
      }
      rate {
        like
        dislike
        status
      }
      reply {
        count
      }
      bookmark
      hidden
      report
    }
  }
`;

export const qSearchVideos = gql`
  query SearchVideos($searchkey: String!, $offset: Int) {
    searchVideos(searchkey: $searchkey, offset: $offset) {
      id
      title
      description
      cover_image
      type
      original_url
      original_post_date
      category {
        id
        name
        tags
      }
      channel {
        id
        name
        username
        email
        logo
        cover_image
      }
      author {
        id
        username
        first_name
        last_name
        email
        photo
        cover_image
      }
      gammatags
      reissued_id
      language
      media {
        images
        videos {
          url
          thumb_url
        }
      }
      rate {
        like
        dislike
        status
      }
      reply {
        count
      }
      bookmark
      hidden
      report
    }
  }
`;

export const qSearchLives = gql`
  query SearchLives($searchkey: String!, $offset: Int) {
    searchLives(searchkey: $searchkey, offset: $offset) {
      id
      title
      description
      cover_image
      type
      original_url
      original_post_date
      category {
        id
        name
        tags
      }
      channel {
        id
        name
        username
        email
        logo
        cover_image
      }
      author {
        id
        username
        first_name
        last_name
        email
        photo
        cover_image
      }
      gammatags
      reissued_id
      language
      media {
        images
        videos {
          url
          thumb_url
        }
      }
      rate {
        like
        dislike
        status
      }
      reply {
        count
      }
      bookmark
      hidden
      report
    }
  }
`;
