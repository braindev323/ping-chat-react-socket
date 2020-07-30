/* @flow */

import { SIDEBAR_TOGGLE } from '../type';

export const toggleSidebar = (isOpen: boolean) => {
  return {
    type: SIDEBAR_TOGGLE,
    data: { isOpen }
  }
}