/* @flow */

import React from 'react';

import Avatar from '../../avatar';


type User = {
  id: number,
  username: string,
  first_name: string,
  last_name: string,
  photo?: string,
  cover_image?: string,
  level: number,
}

type Channel = {
  id: number,
  name: string,
  username: string,
  logo: string,
  cover_image?: string,
}

type Props = {
  author?: User,
  channel?: Channel,
  onClick?: () => any,
};

type State = {
};

export default class Profile extends React.Component<Props, State> {
  render() {
    const {
      author,
      channel,
      onClick,
    } = this.props;

    return (
      <div className='profile' onClick={onClick}>
        <Avatar url={(author && author.photo) || (channel && channel.logo)} level={author && author.level} size={37} />
        <div className='info'>
          <div className='name'>{author? author.first_name + ' ' + author.last_name: channel? channel.name: ''}</div>
          <div className='username'>Commented: Lorem ipsum dolor sit…</div>
        </div>
      </div>
    )
  };
};