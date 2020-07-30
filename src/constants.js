/* @flow */


export const PostType = {
  Unknown: -1,
  Article: 0,
  Video: 1,
  Photo: 2,
  Location: 3,
  Poll: 4,
  Link: 5,
  LIVE: 6,
};

export const PostModalType = {
  Profile: 0,
  Share: 1,
  More: 2,
  ContentOptions: 3,
}

export const CallType = {
  Audio: 0,
  Video: 1,
}

export const ChatChannelType = {
  Private: 0,
  Group: 1,
}

export const ChatContentType = {
  Text: 0,
  Image: 1,
  Video: 2,
  Audio: 3,
  File: 4
}