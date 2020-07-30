/* @flow */

import React from "react";
import { connect } from "react-redux";

import Icon from "../../icon";
import { openPostModal } from "../../../redux/actions";
import { PostModalType } from "../../../constants";
import "./index.scss";
import Avatar from "../../avatar";

type State = {
  isLoggedin: boolean,
  me: any
};

class Header extends React.Component<any, State> {
  state: State = {
    isLoggedin: false,
    me: null
  };

  wrapper: ?HTMLDivElement = null;

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      isLoggedin: props.isLoggedin,
      me: props.me
    };
  }

  openProfileModal = () => {
    const data = {
      author: this.props.data.user
    };
    this.props.openPostModal(data, PostModalType.Profile, this.wrapper);
  };

  toggleBookmark(bookmarkMutation: any) {
    const { isLoggedin, me } = this.state;

    if (!isLoggedin || !me) {
      this.props.toggleAuthModal(true);
      return;
    }
  }

  render() {
    const {
      data: { user, content },
      showReply,
      showComment
    } = this.props;

    const { me } = this.state;

    return (
      <div className="comment-header" ref={wrapper => (this.wrapper = wrapper)}>
        <div className="profile" onClick={this.openProfileModal}>
          <Avatar
            url={user && user.photo}
            level={user && user.level}
            size={37}
          />
          <div className="w-100">
            <div className="info">
              <div className="name">
                {user ? user.first_name + " " + user.last_name : ""}
              </div>
              <div className="username">{user ? "@" + user.username : ""}</div>
              <Icon className="icon lightBlue" name="guard" size={16} />
              {showReply && me.id !== user.id && (
                <div className="reply">Reply</div>
              )}
            </div>
            {showComment ? (
              <div className="comment-input">
                <textarea
                  className="comment"
                  name="comment"
                  rows={2}
                  placeholder="Comment..."
                />
              </div>
            ) : (
              <div className="comment-message">{content}</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggedin: state.auth.loggedin,
    me: state.auth.me
  };
}

export default connect(mapStateToProps, { openPostModal })(Header);
