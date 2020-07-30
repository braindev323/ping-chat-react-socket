/* @flow */

import React from 'react'

import Icon from '../icon';
import './index.scss';

type Props = {
  className?: string,
  onChange?: (value: string) => any,
  value?: string,
  placeholder?: string,
  throttle?: number,
};

type State = {
  value: string,
};

class Searchbar extends React.Component<Props, State> {
  static defaultProps: Props = {
    className: '',
    onChange: (value) => {},
    throttle: 200,
    placeholder: 'Search...',
  }

  state: State = {
    value: '',
  }

  _throttleTimeout: ?TimeoutID = null

  constructor (props: Props) {
    super(props)

    this.state = {
      value: props.value || ''
    }
  }

  render () {
    const {
      className,
      placeholder,
    } = this.props;

    const {
      value,
    } = this.state;

    return (
      <div className={`searchbar ${className || ''}`}>
        <Icon className='icon' name='search' size={24} />
        <input type='search' className='form-control' value={value} placeholder={placeholder} onChange={this.updateSearch} />
      </div>
    )
  }

  updateSearch = (e: any) => {
    const value = e.target.value
    this.setState({ value },
      () => {
        if (this._throttleTimeout) {
          clearTimeout(this._throttleTimeout)
        }

        const {
          onChange,
          throttle,
        } = this.props;
        this._throttleTimeout = setTimeout(
          () => { onChange && onChange(value) },
          throttle,
        )
      }
    )
  }
}

export default Searchbar