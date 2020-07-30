/* @flow */

import React from 'react';

import './toggle.scss';


type Props = {
  className?: string,
  disable?: boolean,
  value: boolean,
  onChange: (value: boolean) => any,
};

type State = {
  value: boolean,
};

export default class Toggle extends React.Component<Props, State> {
  state: State = {
    value: this.props.value,
  }

  onChange = () => {
    if (this.props.disable) return;

    this.props.onChange(!this.state.value);
    this.setState({
      value: !this.state.value,
    })
  }

  render() {
    const {
      className,
      disable
    } = this.props;

    const {value} = this.state;

    return (
      <div className={`toggle ${className || ''} ${disable? 'disable': ''} ${value? '': 'off'}`} onClick={this.onChange}>
        <div className='handle'></div>
      </div>
    )
  };
};