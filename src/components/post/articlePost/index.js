/* @flow */

import React from 'react';

import Header from '../header';
import Content from '../content';
import './index.scss';

type Props = {
  data: any,
};

type State = {
};

export default class ArticlePost extends React.Component<Props, State> {
  render() {
    const {
      cover_image,
    } = this.props.data;

    return (
      <div className={`post post-article ${cover_image ? 'has-cover': ''}`}>
        {cover_image && 
          <div className='cover' style={{backgroundImage: `url('${cover_image}')`}} ></div>
        }
        <div className='post-content'>
          <Header post={this.props.data} />
          <Content post={this.props.data} />
        </div>
      </div>
    )
  };
};