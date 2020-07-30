/* @flow */

import React from 'react';

import Avatar from '../../components/avatar';


type Profile = {
  id: number,
  type: number,
  name: ?string,
  username: string,
  first_name: ?string,
  last_name: ?string,
  logo: ?string,
  photo: ?string,
  cover_image: ?string,
  level: number,
  description: ?string,
}

type Props = {
  profile: Profile,
}

type State = {
};

export default class ProfileItem extends React.Component<Props, State> {
  render() {
    const {
      type,
      username,
      name,
      first_name,
      last_name,
      logo,
      photo,
      level,
    } = this.props.profile;

    return (
      <div className='item' >
        <div className='main'>
          <Avatar url={type === 0? photo: logo} level={level} size={45} />
          <div className='info'>
            <div className='name'>{type === 0? `${first_name || ''} ${last_name || ''}`: name}</div>
            <div className='username lightBlue'>{`@${username}`}</div>
          </div>
        </div>
        <div className='tools'>
          <a className='view' href={type === 0? `/profile/${username}`: `/channels/${username}`} target='_blank' rel='noopener noreferrer' >
            {'View Profile'}
          </a>
        </div>
      </div>
    )
  }
}