/* @flow */

import {
  POST_MODAL_OPEN,
  POST_MODAL_CLOSE,
} from '../type';

export const openPostModal = (post: any, modalType: number, target: HTMLDivElement) => {
  return {
    type: POST_MODAL_OPEN,
    data: { post, modalType, target }
  }
}

export const closePostModal = () => {
  return {
    type: POST_MODAL_CLOSE,
    data: { }
  }
}