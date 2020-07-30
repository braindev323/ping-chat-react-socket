/* @flow */

import { SIDEBAR_TOGGLE } from '../type';


const INITIAL = {
  isOpen: false,
}

export default (state: any = INITIAL, action: any) => {
  switch (action.type) {
    case SIDEBAR_TOGGLE: {
      const { isOpen } = action.data;

      return { ...state, isOpen };
    }

    default:
      return state;
  }
}