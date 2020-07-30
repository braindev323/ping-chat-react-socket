/* @flow */

import React from 'react';

import loading from '../../resources/image/loading.gif';
import './index.scss';


type Props = {
  size?: string,
  className?: string,
};

type State = {
};

export default class Spinner extends React.Component<Props, State> {
  render() {
    const {
      size,
      className,
    } = this.props;

    return (
      <div className={`loading ${className || ""}`}>
        <img src={loading} className={`${size || "medium"}`} alt="loading..." />
      </div>
    )
  };
};