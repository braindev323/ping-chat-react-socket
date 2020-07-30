/* @flow */

import React from 'react';

import ArticlePost from './articlePost';
import VideoPost from './videoPost';
import PhotoPost from './photoPost';
import {
  PostType,
} from '../../constants';
import './index.scss';


type Props = {
  data: any,
};

type State = {
};

export default class Post extends React.Component<Props, State> {
  render() {
    const {
      type,
      report,
    } = this.props.data;

    if (report > 0) return null;

    switch (type) {
    case PostType.Article:
      return <ArticlePost data={this.props.data} />

    case PostType.Video:
      return <VideoPost data={this.props.data} />

    case PostType.Photo:
      return <PhotoPost data={this.props.data} />
  
    default:
      return null;
    } 
  };
};