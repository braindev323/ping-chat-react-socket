/* @flow */

import {
  CALLING_OPEN,
  CALLING_CLOSE,
} from '../type';


const INITIAL = {
  isCalling: false,
  callType: -1,
}

export default (state: any = INITIAL, action: any) => {
  switch (action.type) {
    case CALLING_OPEN: {
      const { callType } = action.data;
      return { ...state, isCalling: true, callType };
    }

    case CALLING_CLOSE: {
      return { ...state, isCalling: false };
    }

    default:
      return state;
  }
}