/* @flow */

import * as React from 'react';

import './index.scss';


const DEFAULT_TOP_LIMIT = 120;

type Props = {
  children?: React.Node,
  className?: string,
  top?: number,
}

type State = {
  floating: boolean,
};

export default class FloatingWrapper extends React.Component<Props, State> {
  state: State = {
    floating: false,
  }

  wrapper: ?HTMLDivElement;

  componentDidMount() {
    window.addEventListener('scroll', this.onWindowScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onWindowScroll);
  }

  onWindowScroll = (e: any) => {
    let {
      top,
    } = this.props;

    top = top || DEFAULT_TOP_LIMIT;

    if (this.wrapper) {
      const wrapperElement = this.wrapper;
      var elemTop = wrapperElement.getBoundingClientRect().top;
      this.setState({
        floating: elemTop < top,
      })
    }
  }

  render() {
    const {
      children,
      className,
      top,
    } = this.props;

    const {
      floating
    } = this.state;

    return (
      <div className={`floating-wrapper ${className || ''}`} ref={wrapper => this.wrapper = wrapper}>
        <div className={`${floating? 'floating': ''}`} style={{ top }}>
          {children}
        </div>
      </div>
    );
  }
}