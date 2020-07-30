/* @flow */

import React from 'react';
import { get } from "lodash"
import { Link } from 'react-router-dom';

import Icon from '../../icon';
import Tools from '../tools';
import {
  fromNow,
} from '../../../utils.js';
import './index.scss';


const DESCRIPTION_MAX_LENGTH = 255;

type Rate = {
  like: number,
  dislike: number,
  status: number,
}

type Post = {
  id: number,
  title: string,
  description: string,
  channel: any,
  author: any,
  gammatags: string,
  original_url: string,
  original_post_date: Date,
  language: string,
  rate: Rate,
  reply: any,
}

type Props = {
  post: Post,
};

type State = {
};

export default class Content extends React.Component<Props, State> {
  truncate(text: string, length: number) {
    if (text.length > length) {
      text = text.substring(0, length).trim() + '...';
    }

    return text;
  }

  render() {
    const {
      post,
    } = this.props;

    const {
      id,
      title,
      description,
      original_url,
      original_post_date,
      // language,
      reply,
    } = post;

    return (
      <div className='main'>
        <Tools post={post} />
        <div className='d-flex flex-row'>
          <div className='contents'>
            <h3 className='top'><span className='title'>{title}</span><span className='post-time'>{fromNow(original_post_date)}</span></h3>
            <p className='bottom'>
              {description &&
                <span className='description'>{this.truncate(description, DESCRIPTION_MAX_LENGTH)}</span>
              }
              {original_url &&
                <a className='link' href={original_url} target='_blank' rel='noopener noreferrer'>
                  <span>{'View on'}</span>
                  <Icon className='icon' name='open_link' size={14} />
                </a>
              }
            </p>
          </div>
          <div className='d-flex align-items-end'>
            <div className='comments'>
              <Link to={`/comment/${id}`}>
                <Icon className='icon' name='comment_send' size={24} />
              </Link>
              <Icon className='icon' name='arrow_down' size={24} />
              <span className='text'>{get(reply, "count")}</span>
            </div>
          </div>
        </div>
      </div>
    )
  };
};