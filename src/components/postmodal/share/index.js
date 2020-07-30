/* @flow */

import React from 'react';
import { connect } from 'react-redux';

import Icon from '../../icon';
import {
  toggleAuthModal,
} from '../../../redux/actions';
import './index.scss';


type User = {
  id: number,
  username: string,
  first_name: string,
  last_name: string,
  photo?: string,
  cover_image?: string,
  level: number,
  reading: number,
}

type Channel = {
  id: number,
  name: string,
  username: string,
  logo: string,
  cover_image?: string,
  reading: number,
}

type Post = {
  id: number,
  author: ?User,
  channel: ?Channel,
}

type Props = {
  post: Post,
  downside?: boolean,
};

type State = {
  isLoggedin: boolean,
  me: ?User,
};

class ShareModal extends React.Component<Props, State> {
  state: State = {
    isLoggedin: false,
    me: null,
  }

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      isLoggedin: props.isLoggedin,
      me: props.me,
    }
  }

  onPing = () => {

  }

  onProfile = () => {

  }

  toggleRead = () => {

  }

  render() {
    const {
      post,
      downside,
    } = this.props;

    const {
      author,
      channel,
    } = post;

    if ((!author && !channel) || (author && channel)) {
      return null;
    }

    return (
      <div className={`share-modal ${downside? 'down': 'up'}`}>
        <div className='top-tag'></div>
        <div className='wrapper'>
          <Icon className='icon' name='share' size={24} />
          <div className='label'>{'Share As'}</div>
          <div className='item'>
            <div className='label'>{'Reissue'}</div>
          </div>
          <div className='item'>
            <Icon className='icon' name='comments' size={24} />
            <div className='label'>{'Ping'}</div>
          </div>
          <div className='item'>
            <Icon className='icon' name='mail' size={24} />
            <div className='label'>{'Email'}</div>
          </div>
        </div>
        <div className='bottom-tag'></div>
      </div>
    )
  };
};

function mapStateToProps(state) {
  return {
    isLoggedin: state.auth.loggedin,
    me: state.auth.me,
  }
}

export default connect(mapStateToProps, { toggleAuthModal })(ShareModal)