/* @flow */

import { THEME_CHANGE } from '../type';


const INITIAL = {
  type: 'dark',
}

export default (state: any = INITIAL, action: any) => {
  switch (action.type) {
    case THEME_CHANGE: {
      const theme_type = action.data.type;

      return { ...state, type: theme_type };
    }

    default:
      return state;
  }
}