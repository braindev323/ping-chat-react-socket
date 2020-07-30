/* @flow */

import React from 'react';

import Icon from '../icon';
import './checkbox.scss';


type Props = {
  className?: string,
  size?: number,
  label?: string,
  value: boolean,
  onChange: (value: boolean) => any,
};

type State = {
  value: boolean,
};

export default class Checkbox extends React.Component<Props, State> {
  state: State = {
    value: this.props.value,
  }

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      value: props.value,
    }
  }

  onChange = () => {
    this.props.onChange(!this.state.value);
    this.setState({
      value: !this.state.value,
    })
  }

  render() {
    const {
      className,
      size,
      label,
    } = this.props;

    return (
      <div className={`checkbox form-check custom-control-inline ${className || ''}`} onClick={this.onChange}>
        <Icon className='icon form-check-input' name={this.state.value? 'checkbox_fill': 'checkbox_empty'} size={size || 24} />
        <label className='label form-check-label'>{label}</label>
      </div>
    )
  };
};