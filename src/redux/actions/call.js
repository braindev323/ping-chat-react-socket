/* @flow */

import {
  CALLING_OPEN,
  CALLING_CLOSE,
} from '../type';

export const openCalling = (callType: number) => {
  return {
    type: CALLING_OPEN,
    data: { callType }
  }
}

export const closeCalling = () => {
  return {
    type: CALLING_CLOSE,
    data: {}
  }
}