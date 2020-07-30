/* @flow */

import {
  NOTIFICATION_ADD,
  NOTIFICATION_REMOVE,
} from '../type';

export const addNotification = (type: string, message: string) => {
  return {
    type: NOTIFICATION_ADD,
    data: { type, message }
  }
}

export const removeNotification = (notification_id: number) => {
  return {
    type: NOTIFICATION_REMOVE,
    data: { notification_id }
  }
}