/* @flow */

import React from "react";

import Header from "./header";
import "./index.scss";

type Props = {
  data: any,
  showLeftline: boolean
};

type State = {};

export default class NotificationItem extends React.Component<Props, State> {
  render() {
    return (
      <div className="post post-article">
        {this.props.showLeftline ? <div className="leftline" /> : ""}
        {/* {cover_image && <div className='cover' style={{ backgroundImage: `url('${cover_image}')` }} />} */}
        <div className="post-content">
          <Header post={this.props.data} />
        </div>
      </div>
    );
  }
}
