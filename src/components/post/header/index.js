/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Mutation } from 'react-apollo';

import Icon from '../../icon';
import Profile from './profile';
import {
  mBookmarkPost,
} from '../../../graphql/mutation';
import {
  openPostModal,
  toggleAuthModal
} from '../../../redux/actions';
import {
  PostModalType,
} from '../../../constants';
import './index.scss';


type State = {
  isLoggedin: boolean,
  me: ?any,

  bookmark: number,
};

class Header extends React.Component<any, State> {
  state: State = {
    isLoggedin: false,
    me: null,
    bookmark: -1,
  }

  wrapper: ?HTMLDivElement = null;

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      isLoggedin: props.isLoggedin,
      me: props.me,
      bookmark: state.bookmark === -1 ? props.post.bookmark : state.bookmark,
    }
  }

  openProfileModal = () => {
    this.props.openPostModal(this.props.post, PostModalType.Profile, this.wrapper);
  }

  toggleBookmark(bookmarkMutation: any) {
    const {
      isLoggedin,
      me,
      bookmark,
    } = this.state;

    if (!isLoggedin || !me) {
      this.props.toggleAuthModal(true);
      return;
    }

    const newBookmark = 1 - bookmark;
    bookmarkMutation({
      variables: {
        post_id: this.props.post.id,
        enable: newBookmark === 1,
      }
    }).then(res => {
      this.props.post.bookmark = newBookmark;
      this.setState({ bookmark: newBookmark });
      return res;
    }).catch(err => {
      console.log(`error on bookmark post ${this.props.post.id}`, err)
    });
  }

  openMenu = () => {
    const { author } = this.props.post;
    const { me } = this.state;
    const modalType = me && author && me.id === author.id ? PostModalType.ContentOptions : PostModalType.More;
    this.props.openPostModal(this.props.post, modalType, this.wrapper);
  }

  render() {
    const {
      category,
      channel,
      author,
    } = this.props.post;

    const {
      bookmark,
      isLoggedin,
    } = this.state;

    return (
      <div className='post-header' ref={wrapper => this.wrapper = wrapper}>
        <Profile author={author} channel={channel} onClick={this.openProfileModal} />
        <div className='post-info'>
          <span className='category'>{category && category.name}</span>
          <Mutation mutation={mBookmarkPost}>
            {(bookmarkMutation, { loading }) => (
              <Icon className='icon' name={bookmark === 1 ? 'bookmark_fill' : 'bookmark_outline'} size={24}
                onClick={() => this.toggleBookmark(bookmarkMutation)} />
            )}
          </Mutation>
          {isLoggedin && <Icon className='icon' name='more_vertical' size={24} onClick={this.openMenu} />}
        </div>
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

export default connect(mapStateToProps, { openPostModal, toggleAuthModal })(Header);