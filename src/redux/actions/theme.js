/* @flow */

import { THEME_CHANGE } from '../type';

export const changeTheme = (type: string) => {
  return {
    type: THEME_CHANGE,
    data: { type }
  }
}