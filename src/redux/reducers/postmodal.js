/* @flow */

import {
  POST_MODAL_OPEN,
  POST_MODAL_CLOSE,
} from '../type';


const INITIAL = {
  isOpen: false,
  post: null,
  modalType: 0,
  target: null,
}

export default (state: any = INITIAL, action: any) => {
  switch (action.type) {
    case POST_MODAL_OPEN: {
      const { post, modalType, target } = action.data;

      return { ...state, isOpen: true, post, modalType, target };
    }

    case POST_MODAL_CLOSE: {
      return { ...state, isOpen: false, post: null };
    }

    default:
      return state;
  }
}