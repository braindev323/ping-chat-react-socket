/* @flow */

import _ from 'lodash';

import {
  NOTIFICATION_ADD,
  NOTIFICATION_REMOVE,
} from '../type';


const INITIAL = {
  notifications: [],
}

export default (state: any = INITIAL, action: any) => {
  switch (action.type) {
    case NOTIFICATION_ADD: {
      const { type, message } = action.data;

      return { ...state, notifications: _.concat(state.notifications, {id: (new Date()).getTime(), type, message}) };
    }
    
    case NOTIFICATION_REMOVE: {
      const { notification_id } = action.data;
      _.remove(state.notifications, {id: notification_id});

      return { ...state, notifications: state.notifications.slice() };
    }

    default:
      return state;
  }
}