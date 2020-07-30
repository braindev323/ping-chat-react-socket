/* @flow */

import * as React from 'react';

import './notification.scss';

const LIFE_TIME = 3000;
const FADE_DELAY = 250;

type Props = {
  id: number,
  type: string,
  message: string,
  onDismiss?: (id: number) => any,
}

type State = {
  show: boolean,
};

export default class Notification extends React.Component<Props, State> {
  state: State = {
    show: false,
  }

  timer: ?TimeoutID = setTimeout(() => {
    this.setState({ show: true });
    this.timer = setTimeout(() => this.dismiss(), LIFE_TIME);
  }, FADE_DELAY)

  dismiss = () => {
    const { id, onDismiss } = this.props;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.setState({ show: false });
    setTimeout(() => { onDismiss && onDismiss(id); }, FADE_DELAY)
  }

  render() {
    const {
      type,
      message,
    } = this.props;

    const {
      show
    } = this.state;

    return (
      <div className={`notification alert alert-dismissible fade ${show? 'show': ''} ${type}`}>
        <div className='description'>
          {message}
        </div>
        <button type='button' className='close' data-dismiss='alert' aria-label='Close' onClick={this.dismiss}>
          <span aria-hidden='true'>&times;</span>
        </button>
      </div>
    );
  }
}