/* @flow */

import gql from 'graphql-tag';

export const mUpload = gql`
  mutation Upload($file: Upload!) {
    upload(file: $file) {
      url
      thumbUrl
    }
  }
`;