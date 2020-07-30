/* @flow */

import * as React from 'react';
import { connect } from 'react-redux';

import Notification from './notification';
import {
  removeNotification,
} from '../../redux/actions';
import './manager.scss';


type NotificationData = {
  id: number,
  type: string,
  message: string,
}

type State = {
  notifications: Array<NotificationData>
};

class NotificationManager extends React.Component<any, State> {
  static defaultProps = {
    position: 'right-top',
  };
  
  state: State = {
    notifications: []
  }

  notifiIndex = 0;

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      notifications: props.notifications,
    }
  }

  onNotificationDismiss(id: number) {
    this.props.removeNotification(id);
  }

  render() {
    const {
      position,
    } = this.props;

    const {
      notifications,
    } = this.state;

    return (
      <div className={`notifications ${position}`}>
        {notifications.map(({ id, type, message }) => (
          <Notification key={id} id={id} type={type} message={message} onDismiss={() => this.onNotificationDismiss(id)} />
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    notifications: state.notification.notifications,
  }
}

export default connect(mapStateToProps, { removeNotification })(NotificationManager);