/* @flow */

import React from "react";

import Header from "./header";
import "./index.scss";

type Props = {
  data: any,
  showReply: boolean,
  showComment: boolean
};

type State = {};

export default class CommentPost extends React.Component<Props, State> {
  render() {
    const { showReply, showComment } = this.props;

    return (
      <div className={`comment`}>
        <div className="comment-content">
          <Header
            data={this.props.data}
            showReply={showReply}
            showComment={showComment}
          />
          {/* <Content post={this.props.data} /> */}
        </div>
      </div>
    );
  }
}
